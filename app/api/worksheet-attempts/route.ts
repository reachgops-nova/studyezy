import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { QUALIFYING_SCORE_PCT } from "@/lib/worksheetGate";
import type { Prisma } from "@prisma/client";

interface AnswerResult {
  value: unknown;
  correct: boolean;
}

// Records a WorksheetAttempt from the family-facing worksheet practice view
// (app/learn/[unitId]/worksheet/[packId]/route.ts's injected submit script).
// Deliberately low-stakes: correctness is computed client-side by the pack's
// own proven checks.js logic (same code used in every preview this session)
// and trusted here rather than re-verified server-side - this is a distinct
// practice layer from the formal, server-graded QuestionPaper test (see
// PLATFORM_PLAN.md's 2026-08-24 entry), so there's no real integrity stake
// in a kid fudging their own practice score beyond unlocking the test a
// little early, which isn't a meaningful risk.
export async function POST(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
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

  const pack = await db.contentPack.findUnique({ where: { packId } });
  if (!pack) {
    return NextResponse.json({ error: "Pack not found." }, { status: 404 });
  }

  const entries = Object.values(answers as Record<string, AnswerResult>);
  const totalCount = entries.length;
  const correctCount = entries.filter((a) => a && a.correct === true).length;
  if (totalCount === 0) {
    return NextResponse.json({ error: "No answers submitted." }, { status: 400 });
  }
  const scorePct = Math.round((correctCount / totalCount) * 100);

  await db.worksheetAttempt.create({
    data: {
      studentProfileId: profileId,
      contentPackId: pack.id,
      unitId: pack.unitId,
      correctCount,
      totalCount,
      scorePct,
      answers: answers as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json({ scorePct, correctCount, totalCount, qualifiesForTest: scorePct >= QUALIFYING_SCORE_PCT });
}
