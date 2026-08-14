import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { coachWrittenExam, isConfigured, type UploadedPageImage } from "@/lib/claude";
import { checkRateLimit } from "@/lib/rateLimit";
import { UPLOADS_DIR } from "@/lib/uploads";

export const runtime = "nodejs";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const MEDIA_TYPE_BY_EXT: Record<string, "image/jpeg" | "image/png" | "image/webp"> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};
const MAX_PAGES = 10;

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
      { error: "Exam coaching isn't configured yet - add ANTHROPIC_API_KEY to .env.local." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, pagePaths, timeSpentMinutes } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof unitKey !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    !Array.isArray(pagePaths) ||
    pagePaths.length === 0 ||
    !pagePaths.every((p) => typeof p === "string") ||
    (timeSpentMinutes !== undefined && timeSpentMinutes !== null && typeof timeSpentMinutes !== "number")
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  // pagePaths come from this session's own upload responses (/api/uploads/{storageKey}),
  // and every referenced page must actually belong to this profile's own uploads for this
  // unit - never trust the client-supplied path alone to read arbitrary files.
  const storageKeys = (pagePaths as string[]).map((p) => p.replace(/^\/api\/uploads\//, "")).slice(0, MAX_PAGES);
  const ownedPages = await db.uploadedPage.findMany({
    where: { unitId: unit.id, storageKey: { in: storageKeys }, purpose: "exam_page" },
  });
  const ownedKeys = new Set(ownedPages.map((p) => p.storageKey));

  const images: UploadedPageImage[] = [];
  for (const storageKey of storageKeys) {
    if (!ownedKeys.has(storageKey)) continue;
    const ext = path.extname(storageKey).toLowerCase();
    const mediaType = MEDIA_TYPE_BY_EXT[ext];
    if (!mediaType) continue;
    const bytes = await readFile(path.join(UPLOADS_DIR, storageKey));
    images.push({ path: `/api/uploads/${storageKey}`, mediaType, base64: bytes.toString("base64") });
  }

  if (images.length === 0) {
    return NextResponse.json({ error: "No readable exam pages found - try uploading again." }, { status: 400 });
  }

  const submission = await db.examSubmission.create({
    data: {
      studentProfileId: profileId,
      unitId: unit.id,
      timeSpentMinutes: (timeSpentMinutes as number | null | undefined) ?? null,
      pages: { connect: ownedPages.map((p) => ({ id: p.id })) },
    },
  });

  try {
    const result = await coachWrittenExam(images, (timeSpentMinutes as number | null | undefined) ?? null);

    await db.examSubmission.update({
      where: { id: submission.id },
      data: {
        status: "coached",
        techniqueNotes: result.technique_notes,
        overallNote: result.overall_note,
        marksNote: result.marks_note,
      },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("coachWrittenExam failed", err);
    await db.examSubmission.update({ where: { id: submission.id }, data: { status: "failed" } });
    return NextResponse.json({ error: "Couldn't read that paper right now - please try again." }, { status: 502 });
  }
}
