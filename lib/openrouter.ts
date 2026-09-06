import "server-only";
import { logAiCost } from "./aiCost";
import {
  parseExtractedConcepts,
  parseQuestionPaperResponse,
  questionPaperSystemPrompt,
  EXTRACTION_SYSTEM_PROMPT,
  FREEFORM_EXTRACTION_SYSTEM_PROMPT,
  type ExpectedConcept,
  type ExtractionSourceFile,
} from "./claude";
import type { Concept, ProgressionTestDraft, QuestionPaperDifficulty } from "./types";

// OpenRouter (openrouter.ai) - an OpenAI-compatible proxy in front of many
// models, added 2026-09-06 specifically to unblock vision extraction: it
// turned out ANTHROPIC_API_KEY was never actually set on the deployed
// Railway service at all (only locally), so extraction/exam-coaching had
// been completely unavailable in production this whole time, not just
// short on credit. Groq (the existing fallback tier elsewhere in this app)
// has no vision model, so it can't fill this specific gap - OpenRouter's
// openai/gpt-4o can.
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "openai/gpt-4o";

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

interface OpenRouterMessageContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

async function openRouterChat(
  feature: string,
  system: string,
  content: OpenRouterMessageContentPart[]
): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      // Real limit hit live 2026-09-06: OpenRouter checks whether the
      // account's current balance could cover max_tokens worth of output
      // BEFORE even trying the call, and rejects with 402 if not - unlike a
      // token cap that just truncates a long response, an unaffordable
      // max_tokens here means the call never runs at all. 3000 is safely
      // under what a near-empty free-tier balance can afford; raise this
      // once OPENROUTER_API_KEY's account has real credit loaded.
      max_tokens: 3000,
      messages: [
        { role: "system", content: system },
        { role: "user", content },
      ],
    }),
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`OpenRouter request failed (${res.status}): ${bodyText.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  logAiCost(feature, OPENROUTER_MODEL, data.usage?.prompt_tokens ?? 0, data.usage?.completion_tokens ?? 0);
  return data.choices?.[0]?.message?.content ?? "[]";
}

// Standard OpenAI-style vision input - a base64 data URI per image. Unlike
// Claude, this chat-completions endpoint has no native "here's a whole PDF
// document" block; a PDF is simply skipped here rather than sent broken -
// see extractConceptsFromPagesOpenRouter's filtering before this is called.
function toImageContentPart(file: ExtractionSourceFile): OpenRouterMessageContentPart {
  return {
    type: "image_url",
    image_url: { url: `data:${file.mediaType};base64,${file.base64}` },
  };
}

function stripNonImageFiles(images: ExtractionSourceFile[]): ExtractionSourceFile[] {
  return images.filter((f) => f.mediaType !== "application/pdf");
}

/**
 * Same contract as lib/claude.ts's extractConceptsFromPages, for whenever
 * Claude isn't configured/available - a PDF in `images` is silently
 * excluded (OpenRouter's chat-completions vision input only takes images),
 * so callers should still prefer Claude for a unit that uploaded a PDF.
 */
export async function extractConceptsFromPagesOpenRouter(
  images: ExtractionSourceFile[],
  expected: ExpectedConcept[]
): Promise<Concept[]> {
  const imageOnly = stripNonImageFiles(images);
  if (imageOnly.length === 0) {
    throw new Error("OpenRouter extraction only reads image pages, not PDFs - no image pages were provided.");
  }
  const raw = await openRouterChat("extract-openrouter", EXTRACTION_SYSTEM_PROMPT, [
    ...imageOnly.map(toImageContentPart),
    { type: "text", text: `Expected concepts for this unit:\n${JSON.stringify(expected, null, 2)}` },
  ]);
  return parseExtractedConcepts(raw, imageOnly);
}

/** Same contract as lib/claude.ts's extractFreeformConcepts, same PDF caveat as above. */
export async function extractFreeformConceptsOpenRouter(images: ExtractionSourceFile[]): Promise<Concept[]> {
  const imageOnly = stripNonImageFiles(images);
  if (imageOnly.length === 0) {
    throw new Error("OpenRouter extraction only reads image pages, not PDFs - no image pages were provided.");
  }
  const raw = await openRouterChat(
    "extract-freeform-openrouter",
    FREEFORM_EXTRACTION_SYSTEM_PROMPT,
    imageOnly.map(toImageContentPart)
  );
  return parseExtractedConcepts(raw, imageOnly);
}

/** Same contract as lib/claude.ts's generateQuestionPaper, same PDF caveat as the extraction functions above. */
export async function generateQuestionPaperOpenRouter(
  images: ExtractionSourceFile[],
  concepts: { concept_id: string; concept_name: string }[],
  difficulty: QuestionPaperDifficulty = "moderate"
): Promise<ProgressionTestDraft> {
  const imageOnly = stripNonImageFiles(images);
  if (imageOnly.length === 0) {
    throw new Error("OpenRouter extraction only reads image pages, not PDFs - no image pages were provided.");
  }
  const raw = await openRouterChat("question-paper-openrouter", questionPaperSystemPrompt(difficulty), [
    ...imageOnly.map(toImageContentPart),
    { type: "text", text: `Concepts this unit covers:\n${JSON.stringify(concepts, null, 2)}` },
  ]);
  return parseQuestionPaperResponse(raw);
}
