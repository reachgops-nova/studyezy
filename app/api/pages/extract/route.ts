import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getActiveProfileId } from "@/lib/auth";
import { getUnit, getUploadedPageImages } from "@/lib/content";
import { extractConceptsFromPages, isConfigured, type UploadedPageImage } from "@/lib/claude";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { UPLOADS_DIR } from "@/lib/uploads";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const MEDIA_TYPE_BY_EXT: Record<string, "image/jpeg" | "image/png" | "image/webp"> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};
// Vision calls get expensive fast with many large photos - cap what one
// extraction run sends.
const MAX_IMAGES_PER_EXTRACTION = 10;

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
      { error: "Extraction isn't configured yet - add ANTHROPIC_API_KEY to .env.local." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey } = (body ?? {}) as Record<string, unknown>;
  if (typeof unitKey !== "string" || !UNIT_KEY_PATTERN.test(unitKey)) {
    return NextResponse.json({ error: "Missing or invalid unit." }, { status: 400 });
  }

  const [curriculumId, stageIdStr, subjectId, unitIdStr] = unitKey.split("-");
  const unit = await getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  if (unit.remaining_unit_outline.length === 0) {
    return NextResponse.json({ error: "This unit already has every concept built." }, { status: 400 });
  }

  const pagePaths = await getUploadedPageImages(unitKey); // "/api/uploads/{storageKey}"
  if (pagePaths.length === 0) {
    return NextResponse.json({ error: "Upload some pages first." }, { status: 400 });
  }

  const selectedPaths = pagePaths.slice(0, MAX_IMAGES_PER_EXTRACTION);
  const images: UploadedPageImage[] = [];
  for (const servedPath of selectedPaths) {
    const storageKey = servedPath.replace(/^\/api\/uploads\//, "");
    const ext = path.extname(storageKey).toLowerCase();
    const mediaType = MEDIA_TYPE_BY_EXT[ext];
    if (!mediaType) continue;
    const bytes = await readFile(path.join(UPLOADS_DIR, storageKey));
    images.push({ path: servedPath, mediaType, base64: bytes.toString("base64") });
  }

  if (images.length === 0) {
    return NextResponse.json({ error: "No readable image files found." }, { status: 400 });
  }

  const expected = unit.remaining_unit_outline.map((o) => ({
    concept_id: o.concept_id,
    concept_name: o.concept_name,
    story_reference: o.story_reference,
  }));

  try {
    const extracted = await extractConceptsFromPages(images, expected);

    if (extracted.length === 0) {
      return NextResponse.json(
        { error: "Couldn't find enough material in these pages for the remaining concepts." },
        { status: 422 }
      );
    }

    const unitRow = await db.unit.findUnique({ where: { unitKey } });
    if (!unitRow) {
      return NextResponse.json({ error: "Unit not found." }, { status: 404 });
    }

    for (const c of extracted) {
      await db.concept.updateMany({
        where: { unitId: unitRow.id, conceptKey: c.concept_id },
        data: {
          status: "drafted",
          source: "extracted",
          definition: c.definition,
          keyPoints: c.key_points ?? [],
          examples: c.examples ?? [],
          tipsToRemember: c.tips_to_remember ?? [],
          voiceQaSamples: (c.voice_qa_samples ?? []) as unknown as Prisma.InputJsonValue,
          sourceImagePath: c.media?.source_image_path,
          illustrationCaption: c.media?.illustration_caption,
          videoStatus: c.media?.video_status ?? "coming_soon",
        },
      });
    }

    return NextResponse.json({
      extracted: extracted.map((c) => ({ concept_id: c.concept_id, concept_name: c.concept_name })),
    });
  } catch (err) {
    console.error("extractConceptsFromPages failed", err);
    return NextResponse.json({ error: "Couldn't extract content right now - please try again." }, { status: 502 });
  }
}
