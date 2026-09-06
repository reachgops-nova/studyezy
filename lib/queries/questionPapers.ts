import "server-only";
import { db } from "../db";
import { QUESTION_PAPER_DIFFICULTIES, OLYMPIAD_EXAM_SETS } from "../types";
import type { QuestionPaperContent, QuestionPaperDifficulty, QuestionPaperSummary, TestQuestion } from "../types";

/**
 * Availability + question count for a unit's tiers, for the student picker
 * and the admin generation panel. Defaults to the 3 curriculum-mode tiers;
 * pass OLYMPIAD_EXAM_SETS for an olympiad-mode unit (see getQuestionPaperSummariesByKey,
 * which looks the unit's own contentMode up automatically).
 */
export async function getQuestionPaperSummaries(
  unitId: string,
  tiers: QuestionPaperDifficulty[] = QUESTION_PAPER_DIFFICULTIES
): Promise<QuestionPaperSummary[]> {
  const papers = await db.questionPaper.findMany({ where: { unitId } });
  const byDifficulty = new Map(papers.map((p) => [p.difficulty, p]));

  return tiers.map((difficulty) => {
    const paper = byDifficulty.get(difficulty);
    const questions = (paper?.questions as unknown as TestQuestion[] | undefined) ?? [];
    return { difficulty, available: !!paper, questionCount: questions.length };
  });
}

/** Same as getQuestionPaperSummaries, but takes the public unitKey and auto-selects tiers vs. exam sets from the unit's own contentMode. */
export async function getQuestionPaperSummariesByKey(unitKey: string): Promise<QuestionPaperSummary[]> {
  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) return [];
  const tiers = unit.contentMode === "olympiad" ? OLYMPIAD_EXAM_SETS : QUESTION_PAPER_DIFFICULTIES;
  return getQuestionPaperSummaries(unit.id, tiers);
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
