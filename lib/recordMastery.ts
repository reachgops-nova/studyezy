import "server-only";
import { db } from "./db";
import { nextReviewDate, scorePercent } from "./mastery";
import type { StoredUnitResult } from "./types";

export interface RecordUnitAttemptParams {
  profileId: string;
  unitKey: string;
  attemptType?: "progression_test" | "diagnostic" | "content_pack_test";
  difficulty?: string;
  correct: number;
  total: number;
  perConcept: Record<string, { correct: number; total: number }>;
}

const VALID_DIFFICULTIES = ["easy", "moderate", "tough"];

/**
 * The core TestAttempt/ConceptMastery write path - extracted from
 * app/api/attempts/route.ts so app/api/pack-test-attempts/route.ts (pack-
 * based progression/terminal tests, see lib/questionPaperToPack.ts) writes
 * through the exact same logic instead of a parallel copy. `perConcept`'s
 * keys must be real `conceptKey`s - a key that doesn't resolve to a concept
 * on this unit silently produces no ConceptMastery row for it (matches the
 * original route's behaviour, not a new gap).
 */
export async function recordUnitAttempt(params: RecordUnitAttemptParams): Promise<StoredUnitResult> {
  const { profileId, unitKey, attemptType, difficulty, correct, total, perConcept } = params;

  const unit = await db.unit.findUnique({
    where: { unitKey },
    include: { concepts: true },
  });
  if (!unit) {
    throw new Error("Unit not found.");
  }

  const scorePct = scorePercent(correct, total);
  const { band, date } = nextReviewDate(scorePct);
  const takenAt = new Date();

  await db.testAttempt.create({
    data: {
      studentProfileId: profileId,
      unitId: unit.id,
      attemptType: attemptType ?? "progression_test",
      difficulty: typeof difficulty === "string" && VALID_DIFFICULTIES.includes(difficulty) ? difficulty : "moderate",
      scorePct,
      band,
      perConcept,
      nextReviewDate: date,
      takenAt,
    },
  });

  const conceptByKey = new Map(unit.concepts.map((c) => [c.conceptKey, c]));
  for (const [conceptKey, stat] of Object.entries(perConcept)) {
    const concept = conceptByKey.get(conceptKey);
    if (!concept || stat.total <= 0) continue;

    const conceptPct = scorePercent(stat.correct, stat.total);
    const { band: conceptBand, date: conceptNextReview } = nextReviewDate(conceptPct);

    await db.conceptMastery.upsert({
      where: { studentProfileId_conceptId: { studentProfileId: profileId, conceptId: concept.id } },
      create: {
        studentProfileId: profileId,
        conceptId: concept.id,
        lastScorePct: conceptPct,
        band: conceptBand,
        attempts: 1,
        lastAttemptAt: takenAt,
        nextReviewDue: conceptNextReview,
      },
      update: {
        lastScorePct: conceptPct,
        band: conceptBand,
        attempts: { increment: 1 },
        lastAttemptAt: takenAt,
        nextReviewDue: conceptNextReview,
      },
    });
  }

  return {
    unitKey,
    scorePct,
    band,
    nextReviewDate: date.toISOString(),
    perConcept,
    takenAt: takenAt.toISOString(),
  };
}
