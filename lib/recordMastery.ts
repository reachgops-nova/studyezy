import "server-only";
import { db } from "./db";
import { daysUntilNextReview, nextReviewDate, scorePercent } from "./mastery";
import type { StoredUnitResult } from "./types";

export interface RecordUnitAttemptParams {
  profileId: string;
  unitKey: string;
  // "practice_widget": an in-lesson interactive widget completed (see
  // app/api/widget-practice/route.ts) - a real signal, but a strictly
  // weaker one than a formal test: retriable, sometimes hint-assisted, and
  // never scored against a fixed unseen paper. Capped below so it can never
  // alone push a concept to "mastered" - see the cap after nextReviewDate().
  attemptType?: "progression_test" | "diagnostic" | "content_pack_test" | "practice_widget";
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
  let { band, date } = nextReviewDate(scorePct);
  if (attemptType === "practice_widget" && band === "mastered") {
    // Widget taps are real evidence but not proof: every other widget lets a
    // wrong tap just be tried again, so a clean run only shows "got there
    // eventually with help available," not "would get this right cold on a
    // real test." Capped to the same ceiling a borderline test score gets -
    // only a real progression/content-pack test can certify "mastered."
    band = "needs_brush_up";
    date = new Date();
    date.setDate(date.getDate() + daysUntilNextReview(band));
  }
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
    let { band: conceptBand, date: conceptNextReview } = nextReviewDate(conceptPct);
    if (attemptType === "practice_widget" && conceptBand === "mastered") {
      conceptBand = "needs_brush_up";
      conceptNextReview = new Date();
      conceptNextReview.setDate(conceptNextReview.getDate() + daysUntilNextReview(conceptBand));
    }

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
