import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { groqMicroCheckGrade, isGroqConfigured, type MicroCheckVerdict } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rateLimit";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const MAX_LEN = 2000;

// Same "ok"/"idk"/filler-word list used to catch non-answers before they'd
// otherwise get praised - kept here (server-side) so it can gate whether a
// Groq call is even worth making, not just to pick a canned reply. A
// low-effort answer is graded "incorrect" (see below), the same as any
// other non-answer - real user request 2026-09-08: a "half/incorrect/
// negative" answer should be corrected and retried, not waved through.
const LOW_EFFORT_PATTERN =
  /^(ok(ay)?|k|yes|yeah|yep|no|nope|sure|fine|good|nice|idk|i ?don'?t ?know|dunno|hmm+|maybe|not sure)[.!?]*$/i;
const LOW_EFFORT_FEEDBACK = [
  "That's alright - it's a tricky one to put into words. Let's go over it again.",
  "No worries if that one's not clicking yet - here it is again.",
];

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

  const { unitKey, conceptId, question, expectedAnswer, answer, index, attempt, language } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof unitKey !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    typeof conceptId !== "string" ||
    typeof question !== "string" ||
    typeof answer !== "string"
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }
  const resolvedExpectedAnswer = typeof expectedAnswer === "string" ? expectedAnswer : "";
  const resolvedAttempt = typeof attempt === "number" && attempt > 0 ? attempt : 1;
  const resolvedLanguage = typeof language === "string" && language.trim() ? language : "English";

  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const concept = await db.concept.findUnique({
    where: { unitId_conceptKey: { unitId: unit.id, conceptKey: conceptId } },
  });

  // Logged the same way regardless of verdict, for future adaptive-teaching
  // work (PLATFORM_PLAN.md's InteractionEvent foundation) - the verdict
  // itself is NOT written into ConceptMastery (that stays fed only by the
  // real progression-test grading pipeline), only used below to drive the
  // in-chat retry loop. See lib/groq.ts's groqMicroCheckGrade for why this
  // is a deliberate, narrower use of grading than mastery-tracking gets.
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

  // Real user request 2026-09-08: a half/incorrect/negative answer must be
  // corrected with more explanation and NOT let the lesson move on until
  // the kid actually gets it - see AvatarChat.tsx's inMicroCheck branch,
  // which re-asks the same question on anything but "correct". An obvious
  // non-answer is graded "incorrect" the same way, with no AI call needed.
  if (isLowEffortAnswer(trimmedAnswer)) {
    const verdict: MicroCheckVerdict = "incorrect";
    return NextResponse.json({ verdict, feedback: LOW_EFFORT_FEEDBACK[ackIndex % LOW_EFFORT_FEEDBACK.length] });
  }

  if (isGroqConfigured()) {
    try {
      const grade = await groqMicroCheckGrade(question, resolvedExpectedAnswer, trimmedAnswer, resolvedLanguage, resolvedAttempt);
      return NextResponse.json(grade);
    } catch (err) {
      console.error("groqMicroCheckGrade failed, defaulting to a lenient pass", err);
    }
  }

  // Grading unavailable (Groq not configured, or the call failed) - default
  // lenient ("correct") rather than trapping a kid in a retry loop because
  // of an infra problem that has nothing to do with their actual answer.
  const verdict: MicroCheckVerdict = "correct";
  return NextResponse.json({ verdict, feedback: "Thanks for sharing your thinking!" });
}
