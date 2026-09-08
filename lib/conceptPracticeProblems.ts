import "server-only";
import { logAiCost } from "./aiCost";
import type { VoiceQASample } from "./types";
import type { Concept as DbConcept } from "@prisma/client";

const MODEL = "gemini-flash-latest";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// Real feedback 2026-09-08: "Math unit 1 is more like conversation, not
// making much sense... this is not a language... give example exercises,
// 2-4 sums per topic so they are clear and answer correctly." The concepts
// already extracted for the 18 live Math units (lib/textbookConceptExtraction.ts,
// before this fix) only carry 2 curiosity-style voice_qa_samples each
// ("What does the tenths place mean?") rather than real solvable problems -
// this regenerates just that field, grounded in the concept's own
// already-approved definition/key_points/examples, without re-reading the
// whole textbook or touching anything else about the concept (illustration,
// generated widget, id - all keyed off the existing row, untouched).
const SYSTEM = `You write short practice problems testing ONE concept a student just learned, for a voice-led tutoring app's in-lesson check-in.

If the concept involves calculation or problem-solving (most Math concepts, and many Science ones), each "question" must be a real, specific, solvable problem using that concept's own vocabulary/numbers (e.g. "What is 0.5 + 0.3?"), and "answer" the specific correct result, stated plainly (e.g. "0.8"). If the concept genuinely has no solvable-problem shape (a purely descriptive/reading concept), write a real comprehension question with one clear correct answer instead - never invent a problem that doesn't fit.

CRITICAL - correctness: every question and answer must be strictly correct according to the material given to you. Do not invent a fact or number that isn't already true from that material.

CRITICAL - originality: write your own problems, don't just copy the concept's own example sentences verbatim.

CRITICAL - notation: write numbers using standard mathematical notation (-4, 0.5, 3/4, 50%), not spelled out in words (never "negative four", "zero point five").

Write 3-4 of these. Respond with ONLY a JSON object, no markdown fences, no commentary:
{"samples": [{"question": string, "answer": string}, ...]}`;

function buildUserText(concept: DbConcept): string {
  const parts = [`Concept: ${concept.name}`];
  if (concept.definition) parts.push(`Definition: ${concept.definition}`);
  if (concept.keyPoints.length) parts.push(`Key points:\n${concept.keyPoints.map((p) => `- ${p}`).join("\n")}`);
  if (concept.examples.length) parts.push(`Examples:\n${concept.examples.map((e) => `- ${e}`).join("\n")}`);
  return parts.join("\n\n");
}

/** Shared by every provider. Exported so lib/openrouter.ts's fallback path reuses this instead of a hand-copied, driftable duplicate. */
export function parseConceptPracticeProblems(rawText: string, conceptName: string): VoiceQASample[] {
  const cleaned = rawText.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();
  let parsed: { samples?: VoiceQASample[] };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Couldn't read clear practice problems for "${conceptName}".`);
  }
  const samples = (parsed.samples ?? []).filter((s) => s.question && s.answer);
  if (samples.length === 0) {
    throw new Error(`No usable practice problems for "${conceptName}".`);
  }
  return samples;
}

export function conceptPracticeProblemsSystem(): string {
  return SYSTEM;
}
export function conceptPracticeProblemsUserText(concept: DbConcept): string {
  return buildUserText(concept);
}

/** Gemini path - see lib/openrouter.ts's generateConceptPracticeProblemsOpenRouter for the fallback used when Gemini's account hits its spend cap. */
export async function generateConceptPracticeProblems(concept: DbConcept): Promise<VoiceQASample[]> {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-goog-api-key": process.env.GOOGLE_AI_API_KEY ?? "" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildUserText(concept) }] }],
      systemInstruction: { parts: [{ text: SYSTEM }] },
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 1500 },
    }),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`Gemini practice-problem request failed (${res.status}): ${bodyText.slice(0, 500)}`);
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };
  logAiCost("concept-practice-problems-gemini", MODEL, data.usageMetadata?.promptTokenCount ?? 0, data.usageMetadata?.candidatesTokenCount ?? 0);
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") || "{}";
  return parseConceptPracticeProblems(text, concept.name);
}
