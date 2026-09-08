import "server-only";
import { logAiCost } from "./aiCost";
import type { TraitMatcherSpec, PredictiveBrancherSpec } from "./interactiveWidgets";
import type { Concept as DbConcept } from "@prisma/client";

const MODEL = "gemini-flash-latest";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// WIDGETS_BY_CONCEPT (lib/interactiveWidgets.ts) is a hand-authored bank
// that only ever covers the real English Stage 5 curriculum (idioms,
// fables, prefixes) - real bug found live 2026-09-08 when a Math concept
// collided with an English concept id and got a fables widget. The fix
// there scopes that bank to English only, which is correct but leaves
// every OTHER subject with no practice widget at all. This is the real
// per-subject replacement: of WIDGETS_BY_CONCEPT's 9 widget kinds, only
// two are generic UI shapes with no English-specific mechanic baked into
// the component itself (confirmed by reading each component) - a matching
// game (trait_matcher) and a scenario-with-choices game
// (predictive_brancher). The other 7 (sentence_train, clue_detective,
// idiom_connector, biography_scanner, prefix_machine, life_mountain,
// fact_opinion) either need real English-language material (idioms,
// prefixes, sentence types) or have the mechanic's labels hardcoded into
// the component (fact_opinion literally renders "Fact"/"Opinion"), so this
// never asks for those kinds.
const SYSTEM = `You write a short interactive practice activity for a school student, testing ONE specific concept they just learned. You choose whichever of these two activity shapes genuinely fits the concept better - never force a bad fit.

SHAPE 1 - "trait_matcher": a matching game. 3-5 pairs of {"character": string, "trait": string} - despite the field names, these can be ANY two things that correctly go together for this concept (a term and its definition, a number and its property, an example and its category, a step and what it does). The student sees the left column and matches each to its correct partner from a shuffled right column.
Respond: {"kind": "trait_matcher", "instruction": "one short sentence telling the student what to do", "pairs": [{"character": string, "trait": string}, ...]}

SHAPE 2 - "predictive_brancher": a scenario with 2-4 choices, exactly one correct. Good for "what happens next" or "which approach is correct" questions.
Respond: {"kind": "predictive_brancher", "instruction": "one short sentence telling the student what to do", "scenario": "the situation or question, grounded in the concept", "choices": [{"text": string, "correct": boolean, "feedback": "one sentence explaining why, shown after the student picks"}, ...]}

CRITICAL - correctness: every pair, choice, and feedback must be strictly correct according to the concept material given to you. Do not invent a fact, number, or example that isn't already true from that material - if you're not sure something is correct, don't include it. This is a graded activity, not decoration.

CRITICAL - originality: write your own pairs/scenario/choices suited for a matching or prediction game - don't just copy the concept's own example sentences verbatim.

If NEITHER shape can be built with only strictly-correct, ungrounded-in-nothing-but-the-given-material content (e.g. the concept is too abstract for a concrete matching pair or branching scenario), respond instead with {"error": "..."} explaining why - do not force a weak or shaky fit.

Respond with ONLY the JSON object, no markdown fences, no commentary.`;

/** Exported so lib/openrouter.ts's fallback path uses the identical wording instead of a hand-copied, driftable duplicate. */
export function conceptWidgetSystem(): string {
  return SYSTEM;
}

export function conceptWidgetUserText(concept: DbConcept): string {
  const parts = [`Concept: ${concept.name}`];
  if (concept.definition) parts.push(`Definition: ${concept.definition}`);
  if (concept.keyPoints.length) parts.push(`Key points:\n${concept.keyPoints.map((p) => `- ${p}`).join("\n")}`);
  if (concept.examples.length) parts.push(`Examples:\n${concept.examples.map((e) => `- ${e}`).join("\n")}`);
  if (concept.tipsToRemember.length) parts.push(`Tips:\n${concept.tipsToRemember.map((t) => `- ${t}`).join("\n")}`);
  return parts.join("\n\n");
}

export type GeneratedConceptWidget = ((TraitMatcherSpec | PredictiveBrancherSpec) & { instruction: string }) | null;

/** Shared by every provider - parses the raw JSON text into the same GeneratedConceptWidget shape regardless of which model produced it. Exported so lib/openrouter.ts's fallback path reuses this instead of a hand-copied, driftable duplicate. */
export function parseConceptWidget(rawText: string, conceptName: string): GeneratedConceptWidget {
  const cleaned = rawText.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();

  let parsed: { kind?: string; instruction?: string; pairs?: { character: string; trait: string }[]; scenario?: string; choices?: { text: string; correct: boolean; feedback: string }[]; error?: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Couldn't read a clear widget for "${conceptName}".`);
  }
  if (parsed.error || !parsed.kind) return null;

  if (parsed.kind === "trait_matcher" && parsed.pairs && parsed.pairs.length >= 2) {
    return { kind: "trait_matcher", instruction: parsed.instruction ?? "Match each item to its partner.", pairs: parsed.pairs };
  }
  if (parsed.kind === "predictive_brancher" && parsed.scenario && parsed.choices && parsed.choices.some((c) => c.correct)) {
    return {
      kind: "predictive_brancher",
      instruction: parsed.instruction ?? "Read the scenario, then choose the best answer.",
      scenario: parsed.scenario,
      choices: parsed.choices,
    };
  }
  return null;
}

/**
 * Generates one subject-agnostic practice widget for a concept - see the
 * SYSTEM prompt above for why only trait_matcher/predictive_brancher are
 * ever produced. Returns null (not an error) when the model itself decides
 * neither shape genuinely fits, which the caller should treat the same as
 * "no widget yet" rather than retrying.
 *
 * Gemini path - see app/api/pages/extract-from-textbook/route.ts callers
 * for the OpenRouter fallback used when Gemini's account hits its spend cap.
 */
export async function generateConceptWidget(concept: DbConcept): Promise<GeneratedConceptWidget> {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-goog-api-key": process.env.GOOGLE_AI_API_KEY ?? "" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: conceptWidgetUserText(concept) }] }],
      systemInstruction: { parts: [{ text: SYSTEM }] },
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 2000 },
    }),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`Gemini widget-generation request failed (${res.status}): ${bodyText.slice(0, 500)}`);
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };
  logAiCost("concept-widget-gemini", MODEL, data.usageMetadata?.promptTokenCount ?? 0, data.usageMetadata?.candidatesTokenCount ?? 0);
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") || "{}";
  return parseConceptWidget(text, concept.name);
}
