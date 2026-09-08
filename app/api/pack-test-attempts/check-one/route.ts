import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { db } from "@/lib/db";
import { gradeShortAnswer, isConfigured } from "@/lib/claude";
import { gradeShortAnswerGroq, isGroqConfigured } from "@/lib/groq";
import type { MarkScheme } from "@/lib/types";

interface PackField {
  key: string;
  check: { kind: string; markScheme?: MarkScheme; [k: string]: unknown };
}
interface PackQuestion {
  id: string;
  prompt: string;
  explanation?: string;
  fields: PackField[];
}
interface PackData {
  sheets: { questions: PackQuestion[] }[];
}

// Same Claude-first, Groq-fallback tiering as app/api/pack-test-attempts's
// own gradeOne - identical reasoning (this feeds a real exam score, not a
// low-stakes chat reaction).
async function gradeOne(question: string, markScheme: MarkScheme, answer: string) {
  if (isConfigured()) {
    try {
      return await gradeShortAnswer(question, markScheme, answer);
    } catch (err) {
      console.error("gradeShortAnswer failed, trying Groq fallback", err);
    }
  }
  if (isGroqConfigured()) {
    try {
      return await gradeShortAnswerGroq(question, markScheme, answer);
    } catch (err) {
      console.error("gradeShortAnswerGroq failed", err);
    }
  }
  return null;
}

// Real user request 2026-09-08: Olympiad exam sets should discuss a wrong
// answer immediately, before the student moves to the next question (see
// components/OlympiadExamPlayer.tsx) - a genuinely sequential, gated exam
// flow, unlike the existing submit-everything-then-grade-once flow
// (content/test-template.html, app/api/pack-test-attempts) that curriculum
// progression tests and terminal tests keep using unchanged.
//
// Only ever called for a single-answer-field question whose check needs a
// real AI call (`ai_graded` / short_answer) - every other check kind
// (choice, etc.) is instant and deterministic, so the player checks those
// itself client-side via the same content/engine/checks.js used everywhere
// else, with zero network latency. This route exists only for the one case
// that genuinely can't be checked without a server round-trip.
//
// Deliberately does NOT write to TestAttempt/ConceptMastery - that still
// only happens once, at the very end, via the existing (unchanged)
// /api/pack-test-attempts, with the full final answer set - this route is
// read-only feedback mid-exam, not a scoring event.
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

  const { packId, questionId, answer } = (body ?? {}) as Record<string, unknown>;
  if (typeof packId !== "string" || typeof questionId !== "string" || typeof answer !== "string") {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const pack = await db.contentPack.findUnique({ where: { packId } });
  if (!pack || (pack.purpose !== "progression_test" && pack.purpose !== "terminal_test")) {
    return NextResponse.json({ error: "Test pack not found." }, { status: 404 });
  }

  const data = pack.data as unknown as PackData;
  const question = data.sheets.flatMap((s) => s.questions).find((q) => q.id === questionId);
  const field = question?.fields[0];
  if (!question || !field) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }
  if (field.check.kind !== "ai_graded" || !field.check.markScheme) {
    return NextResponse.json({ error: "This question doesn't need server-side checking." }, { status: 400 });
  }

  const graded = await gradeOne(question.prompt, field.check.markScheme, answer.trim().slice(0, 2000));
  if (!graded) {
    return NextResponse.json({ correct: null, explanation: "Couldn't check this automatically - a parent can review it with you." });
  }
  const correct = graded.full_marks > 0 && graded.marks_awarded / graded.full_marks >= 1;
  return NextResponse.json({ correct, explanation: graded.feedback });
}
