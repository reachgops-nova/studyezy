import "server-only";
import { db } from "@/lib/db";
import type { StoredUnitResult } from "@/lib/types";

/**
 * Latest progression-test result per unit for this student, mirroring what
 * the old localStorage-backed dashboard showed (one row per unit, most
 * recent attempt only) - now a full history lives in TestAttempt, this just
 * reduces to the same "latest per unit" view.
 */
export async function getDashboardData(profileId: string): Promise<StoredUnitResult[]> {
  const attempts = await db.testAttempt.findMany({
    where: { studentProfileId: profileId, attemptType: "progression_test" },
    orderBy: { takenAt: "desc" },
    include: { unit: true },
  });

  const seenUnitIds = new Set<string>();
  const latestPerUnit: StoredUnitResult[] = [];

  for (const attempt of attempts) {
    if (seenUnitIds.has(attempt.unitId)) continue;
    seenUnitIds.add(attempt.unitId);

    latestPerUnit.push({
      unitKey: attempt.unit.unitKey,
      scorePct: attempt.scorePct,
      band: attempt.band as StoredUnitResult["band"],
      nextReviewDate: attempt.nextReviewDate.toISOString(),
      perConcept: attempt.perConcept as StoredUnitResult["perConcept"],
      takenAt: attempt.takenAt.toISOString(),
    });
  }

  return latestPerUnit;
}
