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

async function geminiGenerate(feature: string, system: string, parts: GeminiPart[]): Promise<string> {
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
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 8000 },
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
  logAiCost(
    feature,
    GEMINI_MODEL,
    data.usageMetadata?.promptTokenCount ?? 0,
    data.usageMetadata?.candidatesTokenCount ?? 0
  );
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") || "[]";
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
