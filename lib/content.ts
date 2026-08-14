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
      source_image_path: c.sourceImagePath ?? undefined,
      illustration_caption: c.illustrationCaption ?? undefined,
      video_status: c.videoStatus as "not_planned" | "coming_soon",
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
    progression_test_draft: unit.progressionTestDraft as unknown as CurriculumUnit["progression_test_draft"],
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
