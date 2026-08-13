import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { getUnit } from "@/lib/content";
import { gradeShortAnswer, isConfigured } from "@/lib/claude";
import { checkRateLimit } from "@/lib/rateLimit";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

export async function POST(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(profileId);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests - try again shortly." }, { status: 429 });
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Grading isn't configured yet - add ANTHROPIC_API_KEY to .env.local." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, questionIndex, studentAnswer } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof unitKey !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    typeof questionIndex !== "number" ||
    typeof studentAnswer !== "string" ||
    !studentAnswer.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const [curriculumId, stageIdStr, subjectId, unitIdStr] = unitKey.split("-");
  const unit = await getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const question = unit.progression_test_draft.questions[questionIndex];
  if (!question || question.type !== "short_answer") {
    return NextResponse.json({ error: "Question not found or not gradeable this way." }, { status: 404 });
  }

  try {
    const result = await gradeShortAnswer(question.question, question.mark_scheme, studentAnswer);
    return NextResponse.json(result);
  } catch (err) {
    console.error("gradeShortAnswer failed", err);
    return NextResponse.json({ error: "Couldn't grade this right now - please try again." }, { status: 502 });
  }
}
