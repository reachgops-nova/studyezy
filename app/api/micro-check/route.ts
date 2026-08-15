import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { groqMicroCheckReaction, isGroqConfigured } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rateLimit";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const MAX_LEN = 2000;

// Same "ok"/"idk"/filler-word list used to catch non-answers before they'd
// otherwise get praised - kept here (server-side) so it can gate whether a
// Groq call is even worth making, not just to pick a canned reply.
const LOW_EFFORT_PATTERN =
  /^(ok(ay)?|k|yes|yeah|yep|no|nope|sure|fine|good|nice|idk|i ?don'?t ?know|dunno|hmm+|maybe|not sure)[.!?]*$/i;
const LOW_EFFORT_ACKS = [
  "That's alright - it's a tricky one to put into words. Want to hear it explained again?",
  "No worries if that one's not clicking yet - we'll come back to it.",
];
const MICRO_CHECK_ACKS = ["Good effort - thanks for thinking it through!", "Nice, thanks for sharing your thinking!"];

function isLowEffortAnswer(text: string): boolean {
  return text.length < 4 || LOW_EFFORT_PATTERN.test(text);
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

  const { unitKey, conceptId, question, answer, index } = (body ?? {}) as Record<string, unknown>;

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

  const trimmedAnswer = answer.trim();
  const ackIndex = typeof index === "number" ? index : 0;

  // Obvious non-answers get an honest, warm reply with no AI call needed.
  // Anything else gets a real, content-aware reaction from Groq's
  // open-weight model when available - genuinely dynamic understanding
  // instead of a canned "Nice thinking!" that doesn't know what was said.
  if (isLowEffortAnswer(trimmedAnswer)) {
    return NextResponse.json({ ack: LOW_EFFORT_ACKS[ackIndex % LOW_EFFORT_ACKS.length] });
  }

  if (isGroqConfigured()) {
    try {
      const ack = await groqMicroCheckReaction(question, trimmedAnswer);
      return NextResponse.json({ ack });
    } catch (err) {
      console.error("groqMicroCheckReaction failed, falling back to generic ack", err);
    }
  }

  return NextResponse.json({ ack: MICRO_CHECK_ACKS[ackIndex % MICRO_CHECK_ACKS.length] });
}
