import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { generateQuestionPaper, isConfigured, type UploadedPageImage } from "@/lib/claude";
import { UPLOADS_DIR } from "@/lib/uploads";
import { FREEZABLE_TYPES } from "@/lib/unitResources";
import { QUESTION_PAPER_DIFFICULTIES, type QuestionPaperDifficulty } from "@/lib/types";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const MEDIA_TYPE_BY_EXT: Record<string, "image/jpeg" | "image/png" | "image/webp"> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};
const MAX_IMAGES = 10;

function isDifficulty(value: unknown): value is QuestionPaperDifficulty {
  return typeof value === "string" && (QUESTION_PAPER_DIFFICULTIES as string[]).includes(value);
}

/**
 * Admin-only: builds a curriculum-aligned practice question paper, at a
 * chosen difficulty tier, from a unit's approved textbook/worksheet/
 * classwork/homework material, upserting it into the QuestionPaper table
 * (PLATFORM_PLAN.md §2.7, extended 2026-08-20 for difficulty tiers) - one
 * row per unit+difficulty, so generating "tough" never destroys "easy".
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Question-paper generation isn't configured yet - add ANTHROPIC_API_KEY." },
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

  const unitRow = await db.unit.findUnique({ where: { unitKey } });
  if (!unitRow) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const [approvedResources, concepts] = await Promise.all([
    db.unitResource.findMany({
      where: { unitId: unitRow.id, resourceType: { in: FREEZABLE_TYPES }, status: "approved" },
      orderBy: { createdAt: "asc" },
      take: MAX_IMAGES,
    }),
    db.concept.findMany({ where: { unitId: unitRow.id, status: "drafted" } }),
  ]);

  if (approvedResources.length === 0) {
    return NextResponse.json(
      { error: "Approve some textbook, worksheet, or classwork material for this unit first." },
      { status: 400 }
    );
  }

  const images: UploadedPageImage[] = [];
  for (const resource of approvedResources) {
    const ext = path.extname(resource.storageKey).toLowerCase();
    const mediaType = MEDIA_TYPE_BY_EXT[ext];
    if (!mediaType) continue;
    try {
      const bytes = await readFile(path.join(UPLOADS_DIR, resource.storageKey));
      images.push({ path: `/api/uploads/${resource.storageKey}`, mediaType, base64: bytes.toString("base64") });
    } catch {
      // skip files that no longer exist on disk
    }
  }

  if (images.length === 0) {
    return NextResponse.json({ error: "No readable image files found." }, { status: 400 });
  }

  try {
    const draft = await generateQuestionPaper(
      images,
      concepts.map((c) => ({ concept_id: c.conceptKey, concept_name: c.name })),
      difficulty
    );

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
    console.error("generateQuestionPaper failed", err);
    return NextResponse.json({ error: "Couldn't generate a question paper right now - please try again." }, { status: 502 });
  }
}
