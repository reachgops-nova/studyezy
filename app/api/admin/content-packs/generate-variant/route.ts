import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { generateVariantPack, type SourcePack } from "@/lib/contentPackVariants";
import { estimateCostUsd } from "@/lib/aiCost";
import type { Prisma } from "@prisma/client";

// Authors a new "set" ContentPack from an existing one, instead of requiring
// a fresh uploaded source document per set - see lib/contentPackVariants.ts.
// Admin-only, same auth/response shape as .../content-packs/convert/route.ts.
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

  const { unitKey, sourceDifficulty, targetDifficulty } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof unitKey !== "string" ||
    typeof sourceDifficulty !== "string" ||
    !/^set\d+$/.test(sourceDifficulty) ||
    typeof targetDifficulty !== "string" ||
    !/^set\d+$/.test(targetDifficulty) ||
    sourceDifficulty === targetDifficulty
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const sourceRow = await db.contentPack.findFirst({
    where: { unitId: unit.id, purpose: "worksheet", difficulty: sourceDifficulty },
  });
  if (!sourceRow) {
    return NextResponse.json({ error: `${sourceDifficulty} does not exist yet for this unit.` }, { status: 404 });
  }

  const sourcePack = sourceRow.data as unknown as SourcePack;
  const packId = `${unitKey}-${targetDifficulty}`;
  const setNumber = Number(targetDifficulty.replace("set", ""));

  try {
    const result = await generateVariantPack({ ...sourcePack, packId: sourceRow.packId }, setNumber, packId);

    const status =
      result.validation.errors.length > 0
        ? "failed"
        : result.validation.counts.needsHuman > 0
          ? "needs_review"
          : "clean";

    await db.contentPack.upsert({
      where: { packId },
      create: {
        packId,
        unitId: unit.id,
        difficulty: targetDifficulty,
        data: result.pack as unknown as Prisma.InputJsonValue,
        sheetsCount: result.validation.counts.sheets,
        questionsCount: result.validation.counts.questions,
        needsHumanCount: result.validation.counts.needsHuman,
        errorsCount: result.validation.errors.length,
        warningsCount: result.validation.warnings.length,
        status,
        sourceImageKeys: [],
        model: result.modelUsed,
        inputTokens: result.totals.inputTokens,
        outputTokens: result.totals.outputTokens,
      },
      update: {
        data: result.pack as unknown as Prisma.InputJsonValue,
        sheetsCount: result.validation.counts.sheets,
        questionsCount: result.validation.counts.questions,
        needsHumanCount: result.validation.counts.needsHuman,
        errorsCount: result.validation.errors.length,
        warningsCount: result.validation.warnings.length,
        status,
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
      inputTokens: result.totals.inputTokens,
      outputTokens: result.totals.outputTokens,
      costUsd: estimateCostUsd(result.modelUsed, result.totals.inputTokens, result.totals.outputTokens),
    });
  } catch (err) {
    console.error("generateVariantPack failed", err);
    return NextResponse.json({ error: "Couldn't generate this set right now - please try again." }, { status: 502 });
  }
}
