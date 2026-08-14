import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const MAX_LEN = 2000;

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

  const { unitKey, conceptId, question, answer } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof unitKey !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    typeof conceptId !== "string" ||
    typeof question !== "string" ||
    typeof answer !== "string"
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const concept = await db.concept.findUnique({
    where: { unitId_conceptKey: { unitId: unit.id, conceptKey: conceptId } },
  });

  // Ungraded by design - this just logs the exchange for future
  // adaptive-teaching work (PLATFORM_PLAN.md's InteractionEvent foundation),
  // not for scoring.
  await db.interactionEvent.create({
    data: {
      studentProfileId: profileId,
      unitId: unit.id,
      conceptId: concept?.id,
      eventType: "micro_check_response",
      payload: { question: question.slice(0, MAX_LEN), answer: answer.slice(0, MAX_LEN) },
    },
  });

  return NextResponse.json({ ok: true });
}
