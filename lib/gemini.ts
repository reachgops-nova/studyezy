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

// Google AI Studio (Gemini) - added 2026-09-06 as a fourth provider,
// specifically because it has genuinely native PDF support (a plain
// inline_data part, same mechanism as an image - no OCR plugin, no
// per-feature balance floor the way OpenRouter's file-parser does) and no
// vision gap the way Groq has. Tried FIRST, ahead of OpenRouter: verified
// live against the real Olympiad Computers workbook PDF that OpenRouter's
// $0.50-balance-for-files requirement was blocking, and Gemini read it
// correctly (page-accurate, verbatim questions) on the first real call.
const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GOOGLE_AI_API_KEY);
}

interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

interface GeminiCallResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

// gemini-flash-latest "thinks" by default - a real call verified live
// 2026-09-06 showed a non-trivial thoughtsTokenCount alongside the visible
// candidatesTokenCount, and maxOutputTokens caps BOTH combined, not just the
// visible completion. 8000 left comfortable headroom on every call tried so
// far (a 7-question paper used under 1900 of it); worth raising if a
// genuinely large document ever truncates.
async function geminiGenerateRaw(feature: string, system: string, parts: GeminiPart[], maxOutputTokens = 8000): Promise<GeminiCallResult> {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": process.env.GOOGLE_AI_API_KEY ?? "",
    },
    body: JSON.stringify({
      contents: [{ parts }],
      systemInstruction: { parts: [{ text: system }] },
      // Forces a clean JSON string back (no markdown fences to strip) -
      // lib/claude.ts's parseExtractedConcepts/parseQuestionPaperResponse
      // both do a bare JSON.parse on whatever comes back, same as they do
      // for Claude/OpenRouter's responses.
      generationConfig: { responseMimeType: "application/json", maxOutputTokens },
    }),
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`Gemini request failed (${res.status}): ${bodyText.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };
  const inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
  const outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;
  logAiCost(feature, GEMINI_MODEL, inputTokens, outputTokens);
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") || "[]";
  return { text, inputTokens, outputTokens };
}

async function geminiGenerate(feature: string, system: string, parts: GeminiPart[]): Promise<string> {
  const result = await geminiGenerateRaw(feature, system, parts);
  return result.text;
}

// A PDF and an image both go through inline_data the same way - Gemini's
// multimodal input has no images-vs-files split the way OpenRouter's does.
function toGeminiPart(file: ExtractionSourceFile): GeminiPart {
  return { inline_data: { mime_type: file.mediaType, data: file.base64 } };
}

/** Same contract as lib/claude.ts's extractConceptsFromPages. */
export async function extractConceptsFromPagesGemini(
  images: ExtractionSourceFile[],
  expected: ExpectedConcept[]
): Promise<Concept[]> {
  if (images.length === 0) {
    throw new Error("No pages were provided to extract from.");
  }
  const raw = await geminiGenerate("extract-gemini", EXTRACTION_SYSTEM_PROMPT, [
    ...images.map(toGeminiPart),
    { text: `Expected concepts for this unit:\n${JSON.stringify(expected, null, 2)}` },
  ]);
  return parseExtractedConcepts(raw, images);
}

/** Same contract as lib/claude.ts's extractFreeformConcepts. */
export async function extractFreeformConceptsGemini(images: ExtractionSourceFile[]): Promise<Concept[]> {
  if (images.length === 0) {
    throw new Error("No pages were provided to extract from.");
  }
  const raw = await geminiGenerate("extract-freeform-gemini", FREEFORM_EXTRACTION_SYSTEM_PROMPT, images.map(toGeminiPart));
  return parseExtractedConcepts(raw, images);
}

/** Same contract as lib/claude.ts's generateQuestionPaper. */
export async function generateQuestionPaperGemini(
  images: ExtractionSourceFile[],
  concepts: { concept_id: string; concept_name: string }[],
  difficulty: QuestionPaperDifficulty = "moderate"
): Promise<ProgressionTestDraft> {
  if (images.length === 0) {
    throw new Error("No pages were provided to generate from.");
  }
  const raw = await geminiGenerate("question-paper-gemini", questionPaperSystemPrompt(difficulty), [
    ...images.map(toGeminiPart),
    { text: `Concepts this unit covers:\n${JSON.stringify(concepts, null, 2)}` },
  ]);
  return parseQuestionPaperResponse(raw);
}

/**
 * Same contract as lib/claude.ts's extractPackFragmentClaude / lib/groq.ts's
 * extractPackFragmentGroq (content-pack/workbook extraction, see
 * lib/contentPackExtraction.ts), for a whole PDF document instead of one
 * photographed page - added 2026-09-06 specifically so that pipeline can
 * finally read a PDF at all (neither Groq nor Claude can: Groq has no
 * vision model, Claude isn't configured in production).
 *
 * 32000 tokens, not the usual 8000 - real, live-tested constraint: a real
 * ~9-page Olympiad workbook (35 questions across it) needed ~11000 thinking
 * tokens plus ~10000 for the actual JSON to come back complete. 12000
 * (this function's first attempt) truncated the JSON mid-object every time -
 * thinking and the visible completion draw from the SAME maxOutputTokens
 * budget, and thinking alone can eat most of a modest cap. Do not lower this
 * without re-testing against a real multi-page document.
 */
export async function extractPackFragmentGemini(
  file: ExtractionSourceFile,
  system: string,
  userText: string
): Promise<GeminiCallResult> {
  return geminiGenerateRaw("content-pack-gemini", system, [toGeminiPart(file), { text: userText }], 32000);
}
