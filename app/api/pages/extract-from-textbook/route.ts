import { NextRequest, NextResponse } from "next/server";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { getActiveProfileId } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { extractUnitConceptsFromTextbook, sampleUnitPageNumbers } from "@/lib/textbookConceptExtraction";
import { generateConceptIllustration } from "@/lib/conceptIllustration";
import { renderPdfPageToPng } from "@/lib/pdfCrop";
import { isGeminiConfigured } from "@/lib/gemini";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { UPLOADS_DIR } from "@/lib/uploads";
import path from "node:path";
import type { Prisma } from "@prisma/client";
import type { ExtractionSourceFile } from "@/lib/claude";

export const runtime = "nodejs";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

/**
 * Counterpart to /api/pages/extract, for units created via the
 * table-of-contents textbook upload (lib/textbookToc.ts) instead of
 * page-by-page photos. Those units have the whole book attached as an
 * approved UnitResource but nothing in UploadedPage, so the original route
 * has no source material to read - see lib/textbookConceptExtraction.ts for
 * the full gap this fills.
 */
export async function POST(req: NextRequest) {
  const [profileId, user] = await Promise.all([getActiveProfileId(), getCurrentUser()]);
  if (!profileId || !user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(profileId);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests - try again shortly." }, { status: 429 });
  }

  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: "Textbook extraction isn't configured yet - add GOOGLE_AI_API_KEY." }, { status: 503 });
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

  const unitRow = await db.unit.findUnique({ where: { unitKey }, include: { concepts: true } });
  if (!unitRow) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }
  if (unitRow.concepts.length > 0) {
    return NextResponse.json({ error: "This unit already has lesson content." }, { status: 400 });
  }

  const textbook = await db.unitResource.findFirst({
    where: { unitId: unitRow.id, resourceType: "textbook", status: "approved" },
    orderBy: { createdAt: "desc" },
  });
  if (!textbook) {
    return NextResponse.json({ error: "No approved textbook is attached to this unit yet." }, { status: 400 });
  }

  const totalUnits = await db.unit.count({ where: { subjectId: unitRow.subjectId } });

  try {
    const bytes = await readFile(path.join(UPLOADS_DIR, textbook.storageKey));
    const file: ExtractionSourceFile = {
      path: `/api/uploads/${textbook.storageKey}`,
      mediaType: "application/pdf",
      base64: bytes.toString("base64"),
    };

    const { concepts, pageStart, pageEnd } = await extractUnitConceptsFromTextbook(file, unitRow.title, unitRow.number, totalUnits);

    let orderIndex = 0;
    const createdIds: string[] = [];
    for (const c of concepts) {
      const created = await db.concept.create({
        data: {
          unitId: unitRow.id,
          conceptKey: c.concept_id,
          name: c.concept_name,
          status: "drafted",
          source: "extracted",
          orderIndex: orderIndex++,
          definition: c.definition,
          keyPoints: c.key_points ?? [],
          examples: c.examples ?? [],
          tipsToRemember: c.tips_to_remember ?? [],
          voiceQaSamples: (c.voice_qa_samples ?? []) as unknown as Prisma.InputJsonValue,
          videoStatus: "coming_soon",
        },
      });
      createdIds.push(created.id);
    }

    // Best-effort extras - a concept/unit with real lesson text but no
    // picture or visible source pages is still usable, so neither failure
    // should turn the whole extraction into an error the family sees.
    await Promise.allSettled(
      createdIds.map(async (id) => {
        const concept = await db.concept.findUnique({ where: { id } });
        if (!concept) return;
        const { url } = await generateConceptIllustration(concept);
        await db.concept.update({ where: { id }, data: { generatedIllustrationUrl: url } });
      })
    );

    if (pageStart && pageEnd && pageEnd >= pageStart) {
      const pageNumbers = sampleUnitPageNumbers(pageStart, pageEnd);
      const targetDir = path.join(UPLOADS_DIR, unitKey);
      await mkdir(targetDir, { recursive: true });
      await Promise.allSettled(
        pageNumbers.map(async (pageNumber) => {
          const png = await renderPdfPageToPng(bytes, pageNumber);
          const filename = `textbook-p${pageNumber}.png`;
          const storageKey = `${unitKey}/${filename}`;
          await writeFile(path.join(UPLOADS_DIR, storageKey), png);
          await db.uploadedPage.create({
            data: {
              unitId: unitRow.id,
              uploadedByUserId: user.id,
              storageKey,
              originalFilename: filename,
              mimeType: "image/png",
              byteSize: png.length,
              purpose: "textbook_source",
              pageNumber,
            },
          });
        })
      );
    }

    return NextResponse.json({
      extracted: concepts.map((c) => ({ concept_id: c.concept_id, concept_name: c.concept_name })),
    });
  } catch (err) {
    console.error("extractUnitConceptsFromTextbook failed", err);
    const message = err instanceof Error ? err.message : "Couldn't extract content right now - please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
