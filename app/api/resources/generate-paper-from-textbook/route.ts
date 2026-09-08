import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { UPLOADS_DIR } from "@/lib/uploads";
import { generateUnitQuestionPaperFromTextbook } from "@/lib/textbookQuestionPaperExtraction";
import { generateUnitQuestionPaperFromTextbookOpenRouter, isOpenRouterConfigured } from "@/lib/openrouter";
import { isGeminiConfigured } from "@/lib/gemini";
import { QUESTION_PAPER_DIFFICULTIES, OLYMPIAD_EXAM_SETS, type ProgressionTestDraft, type QuestionPaperDifficulty } from "@/lib/types";
import type { ExtractionSourceFile } from "@/lib/claude";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

function isDifficulty(value: unknown): value is QuestionPaperDifficulty {
  return typeof value === "string" && ([...QUESTION_PAPER_DIFFICULTIES, ...OLYMPIAD_EXAM_SETS] as string[]).includes(value);
}

/**
 * Counterpart to /api/resources/generate-paper, for a unit whose only
 * approved source is the WHOLE shared textbook (lib/textbookToc.ts's upload
 * flow) rather than curated per-unit pages - see
 * lib/textbookQuestionPaperExtraction.ts for why that needs an explicit
 * unit-position/page-range hint instead of the plain existing prompt.
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  if (!isGeminiConfigured() && !isOpenRouterConfigured()) {
    return NextResponse.json(
      { error: "Question-paper generation isn't configured yet - add GOOGLE_AI_API_KEY or OPENROUTER_API_KEY." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, difficulty: rawDifficulty } = (body ?? {}) as Record<string, unknown>;
  if (typeof unitKey !== "string" || !UNIT_KEY_PATTERN.test(unitKey)) {
    return NextResponse.json({ error: "Missing or invalid unit." }, { status: 400 });
  }
  const difficulty: QuestionPaperDifficulty = isDifficulty(rawDifficulty) ? rawDifficulty : "moderate";

  const unitRow = await db.unit.findUnique({ where: { unitKey }, include: { concepts: { where: { status: "drafted" } } } });
  if (!unitRow) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }
  if (unitRow.concepts.length === 0) {
    return NextResponse.json({ error: "This unit has no lesson content yet - extract its concepts first." }, { status: 400 });
  }

  const textbook = await db.unitResource.findFirst({
    where: { unitId: unitRow.id, resourceType: "textbook", status: "approved" },
    orderBy: { createdAt: "desc" },
  });
  if (!textbook) {
    return NextResponse.json({ error: "No approved textbook is attached to this unit yet." }, { status: 400 });
  }

  const totalUnits = await db.unit.count({ where: { subjectId: unitRow.subjectId } });
  const concepts = unitRow.concepts.map((c) => ({ concept_id: c.conceptKey, concept_name: c.name }));
  const pageRange =
    unitRow.textbookPageStart && unitRow.textbookPageEnd
      ? { start: unitRow.textbookPageStart, end: unitRow.textbookPageEnd }
      : null;

  try {
    const bytes = await readFile(path.join(UPLOADS_DIR, textbook.storageKey));
    const file: ExtractionSourceFile = {
      path: `/api/uploads/${textbook.storageKey}`,
      mediaType: "application/pdf",
      base64: bytes.toString("base64"),
    };

    let draft: ProgressionTestDraft | null = null;
    let lastError: unknown;
    if (isGeminiConfigured()) {
      try {
        draft = await generateUnitQuestionPaperFromTextbook(file, unitRow.title, unitRow.number, totalUnits, concepts, difficulty, pageRange);
      } catch (err) {
        console.error("Gemini textbook question-paper generation failed, trying OpenRouter", err);
        lastError = err;
      }
    }
    if (!draft && isOpenRouterConfigured()) {
      try {
        draft = await generateUnitQuestionPaperFromTextbookOpenRouter(
          file,
          unitRow.title,
          unitRow.number,
          totalUnits,
          concepts,
          difficulty,
          pageRange
        );
      } catch (err) {
        console.error("OpenRouter textbook question-paper generation failed", err);
        lastError = err;
      }
    }
    if (!draft) {
      throw lastError ?? new Error("No question-paper provider is configured.");
    }

    if (draft.questions.length === 0) {
      return NextResponse.json({ error: "Couldn't generate questions from this material." }, { status: 422 });
    }

    await db.questionPaper.upsert({
      where: { unitId_difficulty: { unitId: unitRow.id, difficulty } },
      create: {
        unitId: unitRow.id,
        difficulty,
        coversConcepts: draft.covers_concepts,
        note: draft.note ?? null,
        questions: draft.questions as unknown as Prisma.InputJsonValue,
      },
      update: {
        coversConcepts: draft.covers_concepts,
        note: draft.note ?? null,
        questions: draft.questions as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ questionCount: draft.questions.length, difficulty });
  } catch (err) {
    console.error("generateUnitQuestionPaperFromTextbook failed", err);
    return NextResponse.json({ error: "Couldn't generate a question paper right now - please try again." }, { status: 502 });
  }
}
