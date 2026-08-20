import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { gradeShortAnswer, isConfigured } from "@/lib/claude";
import { gradeShortAnswerGroq, isGroqConfigured } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rateLimit";
import { getQuestionPaperByKey } from "@/lib/queries/questionPapers";
import { QUESTION_PAPER_DIFFICULTIES, type QuestionPaperDifficulty } from "@/lib/types";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

function isDifficulty(value: unknown): value is QuestionPaperDifficulty {
  return typeof value === "string" && (QUESTION_PAPER_DIFFICULTIES as string[]).includes(value);
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

  if (!isConfigured() && !isGroqConfigured()) {
    return NextResponse.json(
      { error: "Grading isn't configured yet - add ANTHROPIC_API_KEY or GROQ_API_KEY." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, difficulty: rawDifficulty, questionIndex, studentAnswer } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof unitKey !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    typeof questionIndex !== "number" ||
    typeof studentAnswer !== "string" ||
    !studentAnswer.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }
  const difficulty: QuestionPaperDifficulty = isDifficulty(rawDifficulty) ? rawDifficulty : "moderate";

  const paper = await getQuestionPaperByKey(unitKey, difficulty);
  if (!paper) {
    return NextResponse.json({ error: "Question paper not found." }, { status: 404 });
  }

  const question = paper.questions[questionIndex];
  if (!question || question.type !== "short_answer") {
    return NextResponse.json({ error: "Question not found or not gradeable this way." }, { status: 404 });
  }

  // Claude tried first (higher quality, and this writes directly into
  // ConceptMastery/retest scheduling); Groq is a real, working fallback -
  // not a silent no-op - for whenever Claude isn't configured or fails,
  // per the user's explicit call to extend it here.
  if (isConfigured()) {
    try {
      const result = await gradeShortAnswer(question.question, question.mark_scheme, studentAnswer);
      return NextResponse.json({ ...result, source: "ai" });
    } catch (err) {
      console.error("gradeShortAnswer failed, trying Groq fallback", err);
    }
  }

  if (isGroqConfigured()) {
    try {
      const result = await gradeShortAnswerGroq(question.question, question.mark_scheme, studentAnswer);
      return NextResponse.json({ ...result, source: "ai-groq" });
    } catch (err) {
      console.error("gradeShortAnswerGroq failed", err);
    }
  }

  return NextResponse.json({ error: "Couldn't grade this right now - please try again." }, { status: 502 });
}
