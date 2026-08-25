import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { db } from "@/lib/db";
import { gradeShortAnswer, isConfigured } from "@/lib/claude";
import { gradeShortAnswerGroq, isGroqConfigured } from "@/lib/groq";
import { recordUnitAttempt } from "@/lib/recordMastery";
import { nextReviewDate, scorePercent } from "@/lib/mastery";
import type { MarkScheme } from "@/lib/types";
// @ts-ignore - plain JS module (allowJs handles resolution); the same declarative check vocabulary the worksheet player already uses, re-run server-side here since a formal test's score must never trust client-computed correctness.
import { checkAnswer } from "../../../content/engine/checks.js";

interface PackField {
  key: string;
  check: { kind: string; markScheme?: MarkScheme; [k: string]: unknown };
}
interface PackQuestion {
  id: string;
  prompt: string;
  conceptTested?: string;
  explanation?: string;
  fields: PackField[];
}
interface PackSheet {
  questions: PackQuestion[];
  sourceUnitKey?: string;
}
interface PackData {
  sheets: PackSheet[];
}

// Claude-first, Groq-fallback - identical tiering to app/api/grade/route.ts,
// for the same reason (this writes directly into ConceptMastery/retest
// scheduling).
async function gradeOne(question: string, markScheme: MarkScheme, answer: string) {
  if (isConfigured()) {
    try {
      return { ...(await gradeShortAnswer(question, markScheme, answer)), source: "ai" as const };
    } catch (err) {
      console.error("gradeShortAnswer failed, trying Groq fallback", err);
    }
  }
  if (isGroqConfigured()) {
    try {
      return { ...(await gradeShortAnswerGroq(question, markScheme, answer)), source: "ai-groq" as const };
    } catch (err) {
      console.error("gradeShortAnswerGroq failed", err);
    }
  }
  return null;
}

type PerQuestionEntry = {
  id: string;
  correct: boolean | null;
  marksAwarded?: number;
  fullMarks?: number;
  feedback?: string;
  explanation?: string;
};

// Re-homed from the old <TestRunner> (see components/TestRunner.tsx) - same
// "up to a couple of concepts with an authored reasoning-interview prompt"
// selection, now computed here so the pack-rendered results screen
// (content/test-template.html) can drive the same /api/reasoning follow-up
// in vanilla JS instead of the retired React component.
const MAX_REASONING_ITEMS = 2;
type ReasoningItemOut = { unitKey: string; conceptId: string; prompt: string; question: string; studentAnswer: string };

// Grades a pack-sourced progression/terminal test (see
// lib/questionPaperToPack.ts, lib/terminalTest.ts) and writes through the
// exact same TestAttempt/ConceptMastery path the original QuestionPaper
// system used (lib/recordMastery.ts) - declarative checks (multiple_choice)
// are re-verified server-side via checks.js, never trusted from the client;
// "ai_graded" fields (short_answer) go through the real, unchanged
// gradeShortAnswer/gradeShortAnswerGroq grading.
//
// A terminal test's pack has one sheet PER UNIT (sheet.sourceUnitKey) -
// TestAttempt/ConceptMastery stay one-row-per-unit (matching every other
// attempt in this app) even though a single test submission spans several
// units, so each sheet's results are recorded via a separate
// recordUnitAttempt call, then combined into one response for display.
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

  const { packId, answers } = (body ?? {}) as Record<string, unknown>;
  if (typeof packId !== "string" || typeof answers !== "object" || answers === null) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }
  const rawAnswers = answers as Record<string, string>;

  const pack = await db.contentPack.findUnique({ where: { packId } });
  if (!pack || (pack.purpose !== "progression_test" && pack.purpose !== "terminal_test")) {
    return NextResponse.json({ error: "Test pack not found." }, { status: 404 });
  }

  const data = pack.data as unknown as PackData;
  if (data.sheets.length === 0) {
    return NextResponse.json({ error: "This pack has no questions." }, { status: 400 });
  }

  // Fallback unit key for single-unit (progression_test) packs, where the
  // unit is on the pack itself rather than per-sheet.
  let fallbackUnitKey: string | null = null;
  if (pack.unitId) {
    const fallbackUnit = await db.unit.findUnique({ where: { id: pack.unitId } });
    fallbackUnitKey = fallbackUnit?.unitKey ?? null;
  }

  const allPerQuestion: PerQuestionEntry[] = [];
  const allConceptNames: Record<string, string> = {};
  let combinedCorrect = 0;
  let combinedTotal = 0;
  let lastResult: Awaited<ReturnType<typeof recordUnitAttempt>> | null = null;
  // Combined perConcept across every sheet, for the results screen's "what
  // to work on next" - the per-unit ConceptMastery writes below are what
  // actually feed Prep Planner/adaptive difficulty, this is display-only.
  const combinedPerConcept: Record<string, { correct: number; total: number }> = {};
  const reasoningItems: ReasoningItemOut[] = [];

  for (const sheet of data.sheets) {
    const unitKey = sheet.sourceUnitKey ?? fallbackUnitKey;
    if (!unitKey) continue;
    const unit = await db.unit.findUnique({ where: { unitKey }, include: { concepts: true } });
    if (!unit) continue;
    for (const c of unit.concepts) allConceptNames[c.conceptKey] = c.name;

    const perConcept: Record<string, { correct: number; total: number }> = {};
    let correctSum = 0;

    for (const q of sheet.questions) {
      const field = q.fields[0];
      const raw = rawAnswers[q.id] ?? "";
      let fraction: number;
      let entry: PerQuestionEntry;

      if (field.check.kind === "ai_graded" && field.check.markScheme) {
        const graded = await gradeOne(q.prompt, field.check.markScheme, raw);
        if (graded) {
          fraction = graded.full_marks > 0 ? graded.marks_awarded / graded.full_marks : 0;
          entry = { id: q.id, correct: fraction >= 1, marksAwarded: graded.marks_awarded, fullMarks: graded.full_marks, feedback: graded.feedback };
        } else {
          fraction = 0;
          entry = { id: q.id, correct: null, feedback: "Couldn't grade this automatically - please review with a parent." };
        }
      } else {
        const ok = checkAnswer(field.check, raw);
        fraction = ok ? 1 : 0;
        entry = { id: q.id, correct: ok, explanation: q.explanation };
      }

      allPerQuestion.push(entry);
      correctSum += fraction;

      const conceptKey = q.conceptTested;
      if (conceptKey) {
        perConcept[conceptKey] ??= { correct: 0, total: 0 };
        perConcept[conceptKey].correct += fraction;
        perConcept[conceptKey].total += 1;

        if (reasoningItems.length < MAX_REASONING_ITEMS) {
          const concept = unit.concepts.find((c) => c.conceptKey === conceptKey);
          const prompt = concept?.reasoningInterviewPrompts?.[0];
          if (prompt) {
            reasoningItems.push({ unitKey, conceptId: conceptKey, prompt, question: q.prompt, studentAnswer: raw });
          }
        }
      }
    }

    combinedCorrect += correctSum;
    combinedTotal += sheet.questions.length;
    for (const [key, stat] of Object.entries(perConcept)) {
      combinedPerConcept[key] ??= { correct: 0, total: 0 };
      combinedPerConcept[key].correct += stat.correct;
      combinedPerConcept[key].total += stat.total;
    }

    try {
      lastResult = await recordUnitAttempt({
        profileId,
        unitKey,
        attemptType: "content_pack_test",
        difficulty: pack.difficulty ?? undefined,
        correct: correctSum,
        total: sheet.questions.length,
        perConcept,
      });
    } catch (err) {
      console.error(`recordUnitAttempt failed for pack test sheet (unit ${unitKey})`, err);
    }
  }

  if (!lastResult) {
    return NextResponse.json({ error: "Couldn't save this result - please try again." }, { status: 502 });
  }

  // The headline score/band reflects ALL sheets combined (accurate even for
  // a multi-unit terminal test), not just whichever sheet's recordUnitAttempt
  // call happened to run last - each sheet's own scorePct/band is still
  // recorded correctly per-unit above, this is purely the display summary.
  const combinedScorePct = scorePercent(combinedCorrect, combinedTotal);
  const { band: combinedBand, date: combinedNextReview } = nextReviewDate(combinedScorePct);

  return NextResponse.json({
    scorePct: combinedScorePct,
    band: combinedBand,
    nextReviewDate: combinedNextReview.toISOString(),
    takenAt: lastResult.takenAt,
    perConcept: combinedPerConcept,
    perQuestion: allPerQuestion,
    conceptNames: allConceptNames,
    reasoningItems,
  });
}
