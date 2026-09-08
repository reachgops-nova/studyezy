import "server-only";
import { extractPackFragmentGemini, isGeminiConfigured } from "./gemini";
import { questionPaperSystemPrompt, parseQuestionPaperResponse, type ExtractionSourceFile } from "./claude";
import type { ProgressionTestDraft, QuestionPaperDifficulty } from "./types";

/**
 * Same targeting problem as lib/textbookConceptExtraction.ts, for
 * progression-test generation instead of Learn-phase concepts: a
 * textbook-sourced unit's only approved material is the WHOLE book (one
 * UnitResource shared by every unit in the subject), but the concepts list
 * passed alongside it is already correctly unit-scoped (real Concept rows,
 * created per-unit by the extraction above) - unlike concept extraction,
 * this doesn't need its own dedicated prompt, just an explicit position/page
 * hint added to the existing questionPaperSystemPrompt's user turn so the
 * model doesn't wander into another unit's material just because it's sitting
 * in the same file.
 */
export function textbookQuestionPaperUserText(
  unitTitle: string,
  unitNumber: number,
  totalUnits: number,
  concepts: { concept_id: string; concept_name: string }[],
  pageRange?: { start: number; end: number } | null
): string {
  const rangeHint = pageRange ? ` Its own section runs from page ${pageRange.start} to page ${pageRange.end} of this file.` : "";
  return [
    `This file is the WHOLE textbook, shared across every unit in this subject. Write this question paper for unit ${unitNumber} of ${totalUnits}: "${unitTitle}".${rangeHint} Use only material from that unit's own section - do not draw questions from any other unit's material even though it's in the same file.`,
    `Concepts this unit covers:\n${JSON.stringify(concepts, null, 2)}`,
  ].join("\n\n");
}

/** Gemini path - see app/api/resources/generate-paper-from-textbook/route.ts for the OpenRouter fallback used when Gemini's account hits its spend cap. */
export async function generateUnitQuestionPaperFromTextbook(
  file: ExtractionSourceFile,
  unitTitle: string,
  unitNumber: number,
  totalUnits: number,
  concepts: { concept_id: string; concept_name: string }[],
  difficulty: QuestionPaperDifficulty,
  pageRange?: { start: number; end: number } | null
): Promise<ProgressionTestDraft> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini isn't configured - textbook question-paper generation has no other capable provider right now.");
  }
  const result = await extractPackFragmentGemini(
    file,
    questionPaperSystemPrompt(difficulty),
    textbookQuestionPaperUserText(unitTitle, unitNumber, totalUnits, concepts, pageRange)
  );
  return parseQuestionPaperResponse(result.text);
}
