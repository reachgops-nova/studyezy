import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getActiveProfileId } from "@/lib/auth";
import { getUnit, getUploadedPageImages } from "@/lib/content";
import {
  extractConceptsFromPages,
  extractFreeformConcepts,
  isConfigured,
  type ExtractionSourceFile,
  type ExpectedConcept,
} from "@/lib/claude";
import {
  extractConceptsFromPagesOpenRouter,
  extractFreeformConceptsOpenRouter,
  isOpenRouterConfigured,
} from "@/lib/openrouter";
import { extractConceptsFromPagesGemini, extractFreeformConceptsGemini, isGeminiConfigured } from "@/lib/gemini";
import { db } from "@/lib/db";
import type { Concept } from "@/lib/types";
import { checkRateLimit } from "@/lib/rateLimit";
import { UPLOADS_DIR } from "@/lib/uploads";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const MEDIA_TYPE_BY_EXT: Record<string, "image/jpeg" | "image/png" | "image/webp" | "application/pdf"> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};
// Vision calls get expensive fast with many large photos - cap what one
// extraction run sends.
const MAX_IMAGES_PER_EXTRACTION = 10;

// Gemini first, then OpenRouter, then Claude - Groq is never a candidate
// here (no vision model in its catalog, confirmed 2026-09-06). Gemini added
// 2026-09-06 specifically because OpenRouter's file-parser plugin has its
// own $0.50-account-balance floor for PDFs (hit live on this account) while
// Gemini reads a PDF as plain inline_data, same as an image, no such floor -
// verified live against the real Olympiad Computers workbook PDF that had
// been failing. OpenRouter stays second (confirmed working for images
// today) and Claude last (ANTHROPIC_API_KEY still isn't set in production).
async function runExtraction(
  images: ExtractionSourceFile[],
  expected: ExpectedConcept[],
  isFreeform: boolean
): Promise<Concept[]> {
  const providers: { name: string; configured: boolean; run: () => Promise<Concept[]> }[] = [
    {
      name: "gemini",
      configured: isGeminiConfigured(),
      run: () => (isFreeform ? extractFreeformConceptsGemini(images) : extractConceptsFromPagesGemini(images, expected)),
    },
    {
      name: "openrouter",
      configured: isOpenRouterConfigured(),
      run: () =>
        isFreeform ? extractFreeformConceptsOpenRouter(images) : extractConceptsFromPagesOpenRouter(images, expected),
    },
    {
      name: "claude",
      configured: isConfigured(),
      run: () => (isFreeform ? extractFreeformConcepts(images) : extractConceptsFromPages(images, expected)),
    },
  ];

  let lastError: unknown;
  for (const provider of providers) {
    if (!provider.configured) continue;
    try {
      return await provider.run();
    } catch (err) {
      console.error(`${provider.name} extraction failed, trying next provider`, err);
      lastError = err;
    }
  }
  throw lastError ?? new Error("No extraction provider is configured.");
}

export async function POST(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(profileId);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests - try again shortly." }, { status: 429 });
  }

  // Real gap found live 2026-09-06: ANTHROPIC_API_KEY was never actually set
  // on the deployed service at all (only locally), so this route had been
  // completely unusable in production the whole time it existed - not just
  // short on Claude credit. Gemini/OpenRouter both fill the same
  // vision-capable role Groq can't (no vision model there), so this now
  // only 503s if genuinely none of the three is configured anywhere.
  if (!isConfigured() && !isOpenRouterConfigured() && !isGeminiConfigured()) {
    return NextResponse.json(
      { error: "Extraction isn't configured yet - add GOOGLE_AI_API_KEY, OPENROUTER_API_KEY, or ANTHROPIC_API_KEY." },
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

  // A brand-new unit with no outline at all (real feedback 2026-09-06: "we
  // don't need to feed unit numbers/concepts here... units can be derived
  // from there") has nothing for the expected-concepts path to match
  // against - that path only ever fills in pre-declared stubs, it never
  // invents a concept that isn't already named. Freeform mode covers this:
  // propose the breakdown from the photos themselves instead of requiring
  // one typed in first.
  const isFreeform = unit.concepts.length === 0 && unit.remaining_unit_outline.length === 0;

  if (!isFreeform && unit.remaining_unit_outline.length === 0) {
    return NextResponse.json({ error: "This unit already has every concept built." }, { status: 400 });
  }

  const pagePaths = await getUploadedPageImages(unitKey); // "/api/uploads/{storageKey}"
  if (pagePaths.length === 0) {
    return NextResponse.json({ error: "Upload some pages first." }, { status: 400 });
  }

  const selectedPaths = pagePaths.slice(0, MAX_IMAGES_PER_EXTRACTION);
  const images: ExtractionSourceFile[] = [];
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
    const extracted = await runExtraction(images, expected, isFreeform);

    if (extracted.length === 0) {
      return NextResponse.json(
        {
          error: isFreeform
            ? "Couldn't find enough material in these pages to propose any concepts."
            : "Couldn't find enough material in these pages for the remaining concepts.",
        },
        { status: 422 }
      );
    }

    const unitRow = await db.unit.findUnique({ where: { unitKey }, include: { concepts: true } });
    if (!unitRow) {
      return NextResponse.json({ error: "Unit not found." }, { status: 404 });
    }

    if (isFreeform) {
      let orderIndex = unitRow.concepts.length;
      for (const c of extracted) {
        await db.concept.create({
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
            sourceImagePath: c.media?.source_image_path,
            illustrationCaption: c.media?.illustration_caption,
            videoStatus: c.media?.video_status ?? "coming_soon",
          },
        });
      }
    } else {
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
    }

    return NextResponse.json({
      extracted: extracted.map((c) => ({ concept_id: c.concept_id, concept_name: c.concept_name })),
    });
  } catch (err) {
    console.error("extractConceptsFromPages failed", err);
    return NextResponse.json({ error: "Couldn't extract content right now - please try again." }, { status: 502 });
  }
}
