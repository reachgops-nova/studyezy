import "server-only";
import { db } from "./db";
import type { QuestionPaperDifficulty } from "./types";

/**
 * Recommends (not locks) a test tier for this unit based on how far the
 * student has progressed past it: still the newest thing they've studied ->
 * easy; one unit further along -> moderate; two or more -> tough. Pure
 * derived query over existing TestAttempt data, no new schema - the gradual
 * "old units get quietly tougher as new ones are covered" behaviour the
 * user asked for (see PLATFORM_PLAN.md's 2026-08-24 entry).
 */
export async function recommendedDifficulty(
  studentProfileId: string,
  unit: { id: string; number: number; subjectId: string }
): Promise<QuestionPaperDifficulty> {
  const laterUnits = await db.unit.findMany({
    where: { subjectId: unit.subjectId, number: { gt: unit.number } },
    select: { id: true },
  });
  if (laterUnits.length === 0) return "easy";

  const laterUnitIds = laterUnits.map((u) => u.id);
  const attemptedLaterUnits = await db.testAttempt.groupBy({
    by: ["unitId"],
    where: { studentProfileId, unitId: { in: laterUnitIds } },
  });

  if (attemptedLaterUnits.length === 0) return "easy";
  if (attemptedLaterUnits.length === 1) return "moderate";
  return "tough";
}
