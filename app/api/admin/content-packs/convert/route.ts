import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { UPLOADS_DIR } from "@/lib/uploads";
import { convertPagesToPack } from "@/lib/contentPackExtraction";
import { estimateCostUsd } from "@/lib/aiCost";
import type { UploadedPageImage } from "@/lib/claude";
import type { Prisma } from "@prisma/client";

const MEDIA_TYPE_BY_EXT: Record<string, "image/jpeg" | "image/png" | "image/webp"> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// Same cap reasoning as app/api/pages/extract/route.ts - and doubly relevant
// here since each page is now its own paced model call (Groq's 8000 TPM
// cap), not one batched call.
const MAX_PAGES_PER_CONVERSION = 10;

// Admin-only content-pack conversion (content/HANDOFF.md's original task,
// adapted to run on this Railway deployment instead of a local CLI - see
// PLATFORM_PLAN.md's 2026-08-24 entry). Reads real files already sitting on
// the uploads volume, runs them through the vision-extract -> validate ->
// repair loop (lib/contentPackExtraction.ts), and persists a ContentPack row.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, storageKeys, book, subject, board, stage } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof unitKey !== "string" ||
    !Array.isArray(storageKeys) ||
    storageKeys.length === 0 ||
    !storageKeys.every((k) => typeof k === "string") ||
    typeof book !== "string" ||
    typeof subject !== "string" ||
    typeof board !== "string" ||
    typeof stage !== "string"
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const selectedKeys = (storageKeys as string[]).slice(0, MAX_PAGES_PER_CONVERSION);
  const images: UploadedPageImage[] = [];
  for (const storageKey of selectedKeys) {
    const ext = path.extname(storageKey).toLowerCase();
    const mediaType = MEDIA_TYPE_BY_EXT[ext];
    if (!mediaType) continue;
    try {
      const bytes = await readFile(path.join(UPLOADS_DIR, storageKey));
      images.push({ path: `/api/uploads/${storageKey}`, mediaType, base64: bytes.toString("base64") });
    } catch (err) {
      console.error(`Couldn't read uploaded page ${storageKey}`, err);
    }
  }

  if (images.length === 0) {
    return NextResponse.json({ error: "No readable image files found for the selected pages." }, { status: 400 });
  }

  const packId = `${unitKey}-${Date.now()}`;

  try {
    const result = await convertPagesToPack(images, { book, subject, board, stage }, packId);

    const status =
      result.validation.errors.length > 0
        ? "failed"
        : result.validation.counts.needsHuman > 0
          ? "needs_review"
          : "clean";

    await db.contentPack.create({
      data: {
        packId,
        unitId: unit.id,
        data: result.pack as unknown as Prisma.InputJsonValue,
        sheetsCount: result.validation.counts.sheets,
        questionsCount: result.validation.counts.questions,
        needsHumanCount: result.validation.counts.needsHuman,
        errorsCount: result.validation.errors.length,
        warningsCount: result.validation.warnings.length,
        status,
        sourceImageKeys: selectedKeys,
        model: result.modelUsed,
        inputTokens: result.totals.inputTokens,
        outputTokens: result.totals.outputTokens,
      },
    });

    return NextResponse.json({
      packId,
      status,
      counts: result.validation.counts,
      errors: result.validation.errors,
      warnings: result.validation.warnings,
      perPage: result.perPage,
      inputTokens: result.totals.inputTokens,
      outputTokens: result.totals.outputTokens,
      costUsd: estimateCostUsd(result.modelUsed, result.totals.inputTokens, result.totals.outputTokens),
    });
  } catch (err) {
    console.error("convertPagesToPack failed", err);
    return NextResponse.json({ error: "Couldn't convert these pages right now - please try again." }, { status: 502 });
  }
}
