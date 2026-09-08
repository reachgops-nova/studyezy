import "server-only";
import { db } from "@/lib/db";
import type { MasteryBand, StoredUnitResult } from "@/lib/types";

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

export interface SubjectProgressUnit {
  unitKey: string;
  title: string;
  number: number;
  scorePct: number;
  band: MasteryBand;
  takenAt: string;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  /** The earliest recorded attempt's score in this subject - a real "diagnostic" attempt if one exists, otherwise just whichever test came first. */
  baselinePct: number;
  baselineIsDiagnostic: boolean;
  baselineTakenAt: string;
  /** The most recent attempt's score in this subject. */
  currentPct: number;
  currentTakenAt: string;
  /** currentPct - baselinePct - positive means improving. Always 0 when there's only one attempt so far. */
  trend: number;
  attemptsCount: number;
  units: SubjectProgressUnit[];
}

/**
 * Real user request 2026-09-08: "bring the status and progress of each
 * subject to give a quick view how they are improving from benchmark base
 * to current situations." TestAttempt already carries an `attemptType`
 * that distinguishes a real "diagnostic" (taken before any teaching, a
 * genuine benchmark) from a regular "progression_test" - the old dashboard
 * query (getDashboardData, above) filtered diagnostics out entirely and had
 * no subject-level rollup at all, only "latest score per unit". This is the
 * new query that groups every attempt (both types) by subject, and reduces
 * each subject to its baseline (earliest attempt) vs current (latest
 * attempt) score - real numbers from real attempts, not a new tracked
 * "baseline" flag that would need retroactively backfilling.
 */
export async function getSubjectProgress(profileId: string): Promise<SubjectProgress[]> {
  const attempts = await db.testAttempt.findMany({
    where: { studentProfileId: profileId },
    orderBy: { takenAt: "asc" },
    include: { unit: { include: { subject: true } } },
  });
  if (attempts.length === 0) return [];

  const bySubject = new Map<string, { subjectName: string; attempts: typeof attempts }>();
  for (const attempt of attempts) {
    const key = attempt.unit.subjectId;
    const bucket = bySubject.get(key) ?? { subjectName: attempt.unit.subject.name, attempts: [] };
    bucket.attempts.push(attempt);
    bySubject.set(key, bucket);
  }

  const result: SubjectProgress[] = [];
  for (const [subjectId, { subjectName, attempts: subjectAttempts }] of bySubject) {
    // subjectAttempts is already ascending by takenAt (inherited from the
    // outer query's own orderBy) - first is the baseline, last is current.
    const baseline = subjectAttempts[0];
    const current = subjectAttempts[subjectAttempts.length - 1];

    // Latest attempt per unit within this subject, for the breakdown list -
    // a later entry in the ascending array always overwrites an earlier one
    // for the same unit, so what's left after the loop is each unit's most
    // recent result.
    const latestPerUnit = new Map<string, (typeof subjectAttempts)[number]>();
    for (const attempt of subjectAttempts) latestPerUnit.set(attempt.unitId, attempt);

    result.push({
      subjectId,
      subjectName,
      baselinePct: baseline.scorePct,
      baselineIsDiagnostic: baseline.attemptType === "diagnostic",
      baselineTakenAt: baseline.takenAt.toISOString(),
      currentPct: current.scorePct,
      currentTakenAt: current.takenAt.toISOString(),
      trend: current.scorePct - baseline.scorePct,
      attemptsCount: subjectAttempts.length,
      units: Array.from(latestPerUnit.values())
        .sort((a, b) => a.unit.number - b.unit.number)
        .map((attempt) => ({
          unitKey: attempt.unit.unitKey,
          title: attempt.unit.title,
          number: attempt.unit.number,
          scorePct: attempt.scorePct,
          band: attempt.band as MasteryBand,
          takenAt: attempt.takenAt.toISOString(),
        })),
    });
  }

  return result.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
}
