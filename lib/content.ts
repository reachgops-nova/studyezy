import "server-only";
import { db } from "./db";
import type { Concept, CurriculumUnit, OutlineConcept, VoiceQASample } from "./types";
import type { Concept as DbConcept } from "@prisma/client";

export function unitKey(curriculumId: string, stageId: number, subjectId: string, unitId: number) {
  return `${curriculumId}-${stageId}-${subjectId}-${unitId}`;
}

function toDrafted(c: DbConcept): Concept {
  return {
    concept_id: c.conceptKey,
    concept_name: c.name,
    status: "drafted",
    difficulty: (c.difficulty as Concept["difficulty"]) ?? undefined,
    book_pages: c.bookPages.length ? c.bookPages : undefined,
    story_reference:
      c.storyReferenceTitle || c.storyReferenceSynopsis
        ? { title: c.storyReferenceTitle ?? "", synopsis: c.storyReferenceSynopsis ?? "" }
        : undefined,
    definition: c.definition ?? undefined,
    key_points: c.keyPoints.length ? c.keyPoints : undefined,
    examples: c.examples.length ? c.examples : undefined,
    voice_qa_samples: (c.voiceQaSamples as VoiceQASample[] | null) ?? undefined,
    tips_to_remember: c.tipsToRemember.length ? c.tipsToRemember : undefined,
    reasoning_interview_prompts: c.reasoningInterviewPrompts.length ? c.reasoningInterviewPrompts : undefined,
    media: {
      illustration_key: c.illustrationKey ?? undefined,
      generated_illustration_url: c.generatedIllustrationUrl ?? undefined,
      source_image_path: c.sourceImagePath ?? undefined,
      source_image_transcript: c.sourceImageTranscript ?? undefined,
      illustration_caption: c.illustrationCaption ?? undefined,
      video_status: c.videoStatus as "not_planned" | "coming_soon",
      alternate_illustrations:
        (c.alternateIllustrations as { illustration_key: string; caption: string }[] | null) ?? undefined,
    },
    source: c.source as "hand_authored" | "extracted",
  };
}

function toOutline(c: DbConcept): OutlineConcept {
  return {
    concept_id: c.conceptKey,
    concept_name: c.name,
    status: "outline",
    story_reference: c.storyReferenceTitle ?? undefined,
  };
}

export async function getUnit(
  curriculumId: string,
  stageId: number,
  subjectId: string,
  unitId: number
): Promise<CurriculumUnit | null> {
  const key = unitKey(curriculumId, stageId, subjectId, unitId);

  const unit = await db.unit.findUnique({
    where: { unitKey: key },
    include: {
      subject: { include: { stage: { include: { curriculum: true } } } },
      concepts: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!unit || !unit.available) return null;

  const concepts = unit.concepts.filter((c) => c.status === "drafted").map(toDrafted);
  const remaining_unit_outline = unit.concepts.filter((c) => c.status === "outline").map(toOutline);

  return {
    board: unit.board,
    curriculum: unit.subject.stage.curriculum.name,
    grade_stage: unit.subject.stage.number,
    subject: unit.subject.name,
    unit: unit.number,
    unit_title: unit.title,
    source_reference: {
      publisher: unit.sourcePublisher ?? "",
      title: unit.sourceTitle ?? "",
      authors: unit.sourceAuthors,
      series_editors: unit.sourceSeriesEditors,
      note: unit.sourceNote ?? "",
    },
    unit_status: unit.unitStatus as "in_progress" | "complete",
    concepts,
    remaining_unit_outline,
    unit_mastery_checklist: unit.masteryChecklist as unknown as CurriculumUnit["unit_mastery_checklist"],
  };
}

/**
 * Textbook page photos a parent uploaded via the Unit Overview screen.
 * Served through /api/uploads/{storageKey} - see app/api/uploads/[...path]
 * and app/api/pages/upload. Returns [] if nothing has been uploaded yet.
 */
export async function getUploadedPageImages(key: string): Promise<string[]> {
  const unit = await db.unit.findUnique({ where: { unitKey: key } });
  if (!unit) return [];

  const pages = await db.uploadedPage.findMany({
    where: { unitId: unit.id, purpose: "textbook_source" },
    orderBy: { createdAt: "asc" },
  });
  return pages.map((p) => `/api/uploads/${p.storageKey}`);
}

export interface BookletPage {
  url: string;
  /** The real printed page number, when known (UploadedPage.pageNumber - see its schema comment). Null for a family's own photo upload, or a UnitResource row (that table has no page-number column yet). */
  page: number | null;
}

/**
 * Every readable textbook page image for a unit, from BOTH places a page can
 * have been stored, in reading order.
 *
 * There are two, for real historical reasons: the original parent-facing
 * "upload the pages" flow writes UploadedPage rows, while the later admin
 * curation flow (app/api/resources/upload) writes UnitResource rows with
 * resourceType "textbook". English Unit 1's 22 pages went in through the
 * first; Unit 2's 6 pages went in through the second. getUploadedPageImages
 * only ever saw the first, which is why Unit 2 - the newest unit - had no
 * booklet at all even though its pages were sitting right there (found
 * 2026-08-30 while putting the booklet beside the lesson chat).
 *
 * Only image/* is included: UnitResource also legitimately holds PDFs, and
 * components/Booklet.tsx renders <img>, which cannot display one.
 *
 * Returns {url, page} pairs, not bare strings, since 2026-09-06: UnitView's
 * "jump to this concept's cited page" used to assume array index N held
 * book page N+1, which only worked for Unit 1 by accident (it starts near
 * page 1) - Unit 9 (pages 156+) would have needed 155 leading placeholder
 * rows just to make that arithmetic land. Real page numbers let UnitView
 * look a page up directly instead.
 */
export async function getUnitBookletImages(key: string): Promise<BookletPage[]> {
  const unit = await db.unit.findUnique({ where: { unitKey: key } });
  if (!unit) return [];

  const [pages, resources] = await Promise.all([
    db.uploadedPage.findMany({
      where: { unitId: unit.id, purpose: "textbook_source" },
      orderBy: { createdAt: "asc" },
    }),
    db.unitResource.findMany({
      // Approved only - the booklet is the family-facing reader, and a
      // pending upload has not been vetted by an admin yet.
      where: { unitId: unit.id, resourceType: "textbook", status: "approved" },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const entries: BookletPage[] = [...pages, ...resources]
    .filter((row) => row.mimeType.startsWith("image/"))
    .map((row) => ({
      url: `/api/uploads/${row.storageKey}`,
      page: "pageNumber" in row ? row.pageNumber : null,
    }));

  // A page could in principle exist in both tables; dedupe by served url so
  // it is never shown twice.
  const seen = new Set<string>();
  return entries.filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}

/**
 * Same query as getUploadedPageImages, but keeps the raw storageKey rather
 * than the served /api/uploads/ path - used by the content-pack conversion
 * admin UI, which needs to send storageKeys (not full URLs) to the convert
 * API route.
 *
 * Real gap found live 2026-09-06: this only ever read UploadedPage, missing
 * the same UnitResource half that getUnitBookletImages above already merges
 * in. A unit whose material came in through /manage's newer "Workbook"
 * upload flow (which writes UnitResource, not UploadedPage) never appeared
 * in the Content Packs unit picker at all as a result - not a rejected
 * conversion, just completely invisible to this list. Approved + (image or
 * PDF) - content-pack conversion gained real PDF support the same day
 * (lib/contentPackExtraction.ts's callVisionModelForDocument, via Gemini),
 * so a PDF resource belongs in this list now too; an unapproved upload
 * still hasn't been vetted yet.
 */
export async function getUploadedPageStorageKeys(
  key: string
): Promise<{ storageKey: string; originalFilename: string }[]> {
  const unit = await db.unit.findUnique({ where: { unitKey: key } });
  if (!unit) return [];

  const [pages, resources] = await Promise.all([
    db.uploadedPage.findMany({
      where: { unitId: unit.id, purpose: "textbook_source" },
      orderBy: { createdAt: "asc" },
    }),
    db.unitResource.findMany({
      where: { unitId: unit.id, status: "approved" },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const entries = [...pages, ...resources]
    .filter((row) => row.mimeType.startsWith("image/") || row.mimeType === "application/pdf")
    .map((row) => ({ storageKey: row.storageKey, originalFilename: row.originalFilename }));

  const seen = new Set<string>();
  return entries.filter((e) => (seen.has(e.storageKey) ? false : (seen.add(e.storageKey), true)));
}
