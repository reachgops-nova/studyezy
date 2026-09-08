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
import {
  loadTextbookConceptExtractionSystem,
  textbookConceptExtractionUserText,
  parseTextbookUnitExtraction,
  type TextbookUnitExtraction,
} from "./textbookConceptExtraction";
import { textbookQuestionPaperUserText } from "./textbookQuestionPaperExtraction";
import { conceptWidgetSystem, conceptWidgetUserText, parseConceptWidget, type GeneratedConceptWidget } from "./conceptWidgetGeneration";
import type { Concept as DbConcept } from "@prisma/client";

// OpenRouter (openrouter.ai) - an OpenAI-compatible proxy in front of many
// models, added 2026-09-06 specifically to unblock vision extraction: it
// turned out ANTHROPIC_API_KEY was never actually set on the deployed
// Railway service at all (only locally), so extraction/exam-coaching had
// been completely unavailable in production this whole time, not just
// short on credit. Groq (the existing fallback tier elsewhere in this app)
// has no vision model, so it can't fill this specific gap - OpenRouter's
// openai/gpt-4o can. Now the FIRST choice everywhere in this file (not just
// for images) - Claude is a pure fallback, tried only if OpenRouter itself
// isn't configured or its call fails.
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "openai/gpt-4o";

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

interface OpenRouterMessageContentPart {
  type: "text" | "image_url" | "file";
  text?: string;
  image_url?: { url: string };
  file?: { filename: string; file_data: string };
}

async function openRouterChat(
  feature: string,
  system: string,
  content: OpenRouterMessageContentPart[],
  hasPdf: boolean
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
      // mistral-ocr is the right engine for this app's PDFs specifically -
      // they're scanned/photographed workbook pages, not born-digital text,
      // so a text-layer-only engine (pdf-text) would return near nothing.
      // ~$2/1000 pages, billed by OpenRouter separately from this call's own
      // token usage - not reflected in logAiCost's numbers below. Only sent
      // when a PDF is actually present; adding the plugin to an all-image
      // call would be pure overhead.
      ...(hasPdf ? { plugins: [{ id: "file-parser", pdf: { engine: "mistral-ocr" } }] } : {}),
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

// Standard OpenAI-style vision input for an image; a PDF instead goes as a
// "file" part - OpenRouter's own file-parser plugin (see the `plugins` block
// above) handles it independent of whether the underlying model has native
// PDF support, so this isn't limited to images-only the way a raw
// OpenAI-compatible endpoint would be.
function toContentPart(file: ExtractionSourceFile): OpenRouterMessageContentPart {
  if (file.mediaType === "application/pdf") {
    return {
      type: "file",
      file: { filename: "document.pdf", file_data: `data:application/pdf;base64,${file.base64}` },
    };
  }
  return {
    type: "image_url",
    image_url: { url: `data:${file.mediaType};base64,${file.base64}` },
  };
}

function hasPdf(images: ExtractionSourceFile[]): boolean {
  return images.some((f) => f.mediaType === "application/pdf");
}

/** Same contract as lib/claude.ts's extractConceptsFromPages, for whenever Claude isn't configured/available. */
export async function extractConceptsFromPagesOpenRouter(
  images: ExtractionSourceFile[],
  expected: ExpectedConcept[]
): Promise<Concept[]> {
  if (images.length === 0) {
    throw new Error("No pages were provided to extract from.");
  }
  const raw = await openRouterChat(
    "extract-openrouter",
    EXTRACTION_SYSTEM_PROMPT,
    [
      ...images.map(toContentPart),
      { type: "text", text: `Expected concepts for this unit:\n${JSON.stringify(expected, null, 2)}` },
    ],
    hasPdf(images)
  );
  return parseExtractedConcepts(raw, images);
}

/** Same contract as lib/claude.ts's extractFreeformConcepts. */
export async function extractFreeformConceptsOpenRouter(images: ExtractionSourceFile[]): Promise<Concept[]> {
  if (images.length === 0) {
    throw new Error("No pages were provided to extract from.");
  }
  const raw = await openRouterChat(
    "extract-freeform-openrouter",
    FREEFORM_EXTRACTION_SYSTEM_PROMPT,
    images.map(toContentPart),
    hasPdf(images)
  );
  return parseExtractedConcepts(raw, images);
}

/** Same contract as lib/textbookConceptExtraction.ts's extractUnitConceptsFromTextbook - the fallback used when Gemini's account hits its spend cap (real 429 hit live 2026-09-08, see app/api/pages/extract-from-textbook/route.ts). */
export async function extractUnitConceptsFromTextbookOpenRouter(
  file: ExtractionSourceFile,
  unitTitle: string,
  unitNumber: number,
  totalUnits: number
): Promise<TextbookUnitExtraction> {
  const system = await loadTextbookConceptExtractionSystem();
  const raw = await openRouterChat(
    "extract-textbook-openrouter",
    system,
    [toContentPart(file), { type: "text", text: textbookConceptExtractionUserText(unitTitle, unitNumber, totalUnits) }],
    true
  );
  return parseTextbookUnitExtraction(raw, unitTitle);
}

/** Same contract as lib/textbookQuestionPaperExtraction.ts's generateUnitQuestionPaperFromTextbook - the fallback used when Gemini's account hits its spend cap. */
export async function generateUnitQuestionPaperFromTextbookOpenRouter(
  file: ExtractionSourceFile,
  unitTitle: string,
  unitNumber: number,
  totalUnits: number,
  concepts: { concept_id: string; concept_name: string }[],
  difficulty: QuestionPaperDifficulty,
  pageRange?: { start: number; end: number } | null
): Promise<ProgressionTestDraft> {
  const raw = await openRouterChat(
    "question-paper-textbook-openrouter",
    questionPaperSystemPrompt(difficulty),
    [toContentPart(file), { type: "text", text: textbookQuestionPaperUserText(unitTitle, unitNumber, totalUnits, concepts, pageRange) }],
    true
  );
  return parseQuestionPaperResponse(raw);
}

/** Same contract as lib/conceptWidgetGeneration.ts's generateConceptWidget - the fallback used when Gemini's account hits its spend cap. Text-only, no PDF/file part needed. */
export async function generateConceptWidgetOpenRouter(concept: DbConcept): Promise<GeneratedConceptWidget> {
  const raw = await openRouterChat(
    "concept-widget-openrouter",
    conceptWidgetSystem(),
    [{ type: "text", text: conceptWidgetUserText(concept) }],
    false
  );
  return parseConceptWidget(raw, concept.name);
}

/** Same contract as lib/claude.ts's generateQuestionPaper. */
export async function generateQuestionPaperOpenRouter(
  images: ExtractionSourceFile[],
  concepts: { concept_id: string; concept_name: string }[],
  difficulty: QuestionPaperDifficulty = "moderate"
): Promise<ProgressionTestDraft> {
  if (images.length === 0) {
    throw new Error("No pages were provided to generate from.");
  }
  const raw = await openRouterChat(
    "question-paper-openrouter",
    questionPaperSystemPrompt(difficulty),
    [
      ...images.map(toContentPart),
      { type: "text", text: `Concepts this unit covers:\n${JSON.stringify(concepts, null, 2)}` },
    ],
    hasPdf(images)
  );
  return parseQuestionPaperResponse(raw);
}
