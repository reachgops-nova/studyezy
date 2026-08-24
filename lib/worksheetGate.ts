import "server-only";
import { db } from "./db";

export const QUALIFYING_SCORE_PCT = 70;

/**
 * True once the student has any recorded engagement with this unit's lesson
 * - the honest proxy this app can actually measure for "read the textbook
 * and engaged with the concept" (see PLATFORM_PLAN.md's 2026-08-24 entry).
 * InteractionEvent.unitId is a bare, unindexed column (not a real relation),
 * matching how it's already written elsewhere (app/api/micro-check/route.ts).
 */
export async function hasEngagedWithUnit(studentProfileId: string, unitId: string): Promise<boolean> {
  const count = await db.interactionEvent.count({
    where: { studentProfileId, unitId },
  });
  return count > 0;
}

/**
 * The student's most recent WorksheetAttempt for this unit that cleared the
 * confidence threshold, or null. Used to gate the formal progression test on
 * a brand-new unit - see app/test/[unitId]/page.tsx.
 */
export async function getQualifyingWorksheetAttempt(
  studentProfileId: string,
  unitId: string,
  threshold: number = QUALIFYING_SCORE_PCT
) {
  return db.worksheetAttempt.findFirst({
    where: { studentProfileId, unitId, scorePct: { gte: threshold } },
    orderBy: { attemptedAt: "desc" },
  });
}
