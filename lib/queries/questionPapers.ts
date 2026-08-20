import "server-only";
import { db } from "../db";
import { QUESTION_PAPER_DIFFICULTIES } from "../types";
import type { QuestionPaperContent, QuestionPaperDifficulty, QuestionPaperSummary, TestQuestion } from "../types";

/** Availability + question count for all 3 tiers, for the student picker and the admin generation panel. */
export async function getQuestionPaperSummaries(unitId: string): Promise<QuestionPaperSummary[]> {
  const papers = await db.questionPaper.findMany({ where: { unitId } });
  const byDifficulty = new Map(papers.map((p) => [p.difficulty, p]));

  return QUESTION_PAPER_DIFFICULTIES.map((difficulty) => {
    const paper = byDifficulty.get(difficulty);
    const questions = (paper?.questions as unknown as TestQuestion[] | undefined) ?? [];
    return { difficulty, available: !!paper, questionCount: questions.length };
  });
}

/** Same as getQuestionPaperSummaries, but takes the public unitKey. */
export async function getQuestionPaperSummariesByKey(unitKey: string): Promise<QuestionPaperSummary[]> {
  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) return [];
  return getQuestionPaperSummaries(unit.id);
}

export async function getQuestionPaper(
  unitId: string,
  difficulty: QuestionPaperDifficulty
): Promise<QuestionPaperContent | null> {
  const paper = await db.questionPaper.findUnique({ where: { unitId_difficulty: { unitId, difficulty } } });
  if (!paper) return null;

  return {
    difficulty: paper.difficulty as QuestionPaperDifficulty,
    coversConcepts: paper.coversConcepts,
    note: paper.note,
    questions: paper.questions as unknown as TestQuestion[],
  };
}

/** Same as getQuestionPaper, but takes the public unitKey. */
export async function getQuestionPaperByKey(
  unitKey: string,
  difficulty: QuestionPaperDifficulty
): Promise<QuestionPaperContent | null> {
  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) return null;
  return getQuestionPaper(unit.id, difficulty);
}
