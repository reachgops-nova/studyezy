import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { nextReviewDate, scorePercent } from "@/lib/mastery";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

interface AttemptBody {
  unitKey: string;
  attemptType?: "progression_test" | "diagnostic";
  correct: number;
  total: number;
  perConcept: Record<string, { correct: number; total: number }>;
}

export async function POST(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(profileId);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests - try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, attemptType, correct, total, perConcept } = (body ?? {}) as Partial<AttemptBody>;

  if (
    typeof unitKey !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    typeof correct !== "number" ||
    typeof total !== "number" ||
    total <= 0 ||
    typeof perConcept !== "object" ||
    perConcept === null
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const unit = await db.unit.findUnique({
    where: { unitKey },
    include: { concepts: true },
  });
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const scorePct = scorePercent(correct, total);
  const { band, date } = nextReviewDate(scorePct);
  const takenAt = new Date();

  await db.testAttempt.create({
    data: {
      studentProfileId: profileId,
      unitId: unit.id,
      attemptType: attemptType === "diagnostic" ? "diagnostic" : "progression_test",
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

  return NextResponse.json({
    unitKey,
    scorePct,
    band,
    nextReviewDate: date.toISOString(),
    perConcept,
    takenAt: takenAt.toISOString(),
  });
}
