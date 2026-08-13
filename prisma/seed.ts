// Standalone script (run via `npm run db:seed`, uses tsx - not part of the
// Next.js app, so it cannot import lib/db.ts's "server-only" client).
import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const db = new PrismaClient();

// Mirrors the old hardcoded lib/catalog.ts CATALOG tree exactly, so nothing
// about what's selectable changes for existing users.
const ENGLISH_UNITS: { number: number; title: string; available: boolean }[] = [
  { number: 1, title: "Fiction: Stories from different cultures", available: true },
  { number: 2, title: "Non-fiction: Biography", available: false },
  { number: 3, title: "Poetry: Narrative poems", available: false },
  { number: 4, title: "Non-fiction: Information and explanation texts", available: false },
  { number: 5, title: "Fiction: Stories that have been developed into a film", available: false },
  { number: 6, title: "Fiction: Classic literature", available: false },
  { number: 7, title: "Playscripts", available: false },
  { number: 8, title: "Poetry: Poems by famous poets", available: false },
  { number: 9, title: "Non-fiction: Persuasive texts", available: false },
];

interface UnitJson {
  board: string;
  curriculum: string;
  grade_stage: number;
  subject: string;
  unit: number;
  unit_title: string;
  source_reference: {
    publisher: string;
    title: string;
    authors: string[];
    series_editors: string[];
    note: string;
  };
  unit_status: string;
  concepts: Record<string, unknown>[];
  remaining_unit_outline: Record<string, unknown>[];
  unit_mastery_checklist: unknown;
  progression_test_draft: unknown;
}

function unitKey(curriculumSlug: string, stageNumber: number, subjectSlug: string, unitNumber: number) {
  return `${curriculumSlug}-${stageNumber}-${subjectSlug}-${unitNumber}`;
}

async function seedConceptsForUnit(unitRowId: string, json: UnitJson) {
  let orderIndex = 0;

  for (const c of json.concepts) {
    const storyRef = c.story_reference as { title?: string; synopsis?: string } | undefined;
    await db.concept.upsert({
      where: { unitId_conceptKey: { unitId: unitRowId, conceptKey: c.concept_id as string } },
      create: {
        unitId: unitRowId,
        conceptKey: c.concept_id as string,
        name: c.concept_name as string,
        status: "drafted",
        source: "hand_authored",
        difficulty: (c.difficulty as string) ?? null,
        bookPages: (c.book_pages as number[]) ?? [],
        storyReferenceTitle: storyRef?.title ?? null,
        storyReferenceSynopsis: storyRef?.synopsis ?? null,
        definition: (c.definition as string) ?? null,
        keyPoints: (c.key_points as string[]) ?? [],
        examples: (c.examples as string[]) ?? [],
        tipsToRemember: (c.tips_to_remember as string[]) ?? [],
        reasoningInterviewPrompts: (c.reasoning_interview_prompts as string[]) ?? [],
        voiceQaSamples: c.voice_qa_samples ?? [],
        illustrationKey: (c.media as { illustration_key?: string } | undefined)?.illustration_key ?? null,
        illustrationCaption: (c.media as { illustration_caption?: string } | undefined)?.illustration_caption ?? null,
        videoStatus: (c.media as { video_status?: string } | undefined)?.video_status ?? "not_planned",
        orderIndex: orderIndex++,
      },
      update: {},
    });
  }

  for (const o of json.remaining_unit_outline) {
    await db.concept.upsert({
      where: { unitId_conceptKey: { unitId: unitRowId, conceptKey: o.concept_id as string } },
      create: {
        unitId: unitRowId,
        conceptKey: o.concept_id as string,
        name: o.concept_name as string,
        status: "outline",
        storyReferenceTitle: (o.story_reference as string) ?? null,
        orderIndex: orderIndex++,
      },
      update: {},
    });
  }
}

async function main() {
  const curriculum = await db.curriculum.upsert({
    where: { slug: "cambridge" },
    create: { slug: "cambridge", name: "Cambridge Primary / IGCSE pathway" },
    update: {},
  });

  const stageDefs = [
    { number: 4, label: "Stage 4 (Grade 4)", available: false },
    { number: 5, label: "Stage 5 (Grade 5)", available: true },
    { number: 6, label: "Stage 6 (Grade 6)", available: false },
  ];
  const stagesByNumber = new Map<number, { id: string }>();
  for (const s of stageDefs) {
    const stage = await db.stage.upsert({
      where: { curriculumId_number: { curriculumId: curriculum.id, number: s.number } },
      create: { curriculumId: curriculum.id, number: s.number, label: s.label, available: s.available },
      update: { label: s.label, available: s.available },
    });
    stagesByNumber.set(s.number, stage);
  }

  const stage5 = stagesByNumber.get(5)!;
  const subjectDefs = [
    { slug: "english", name: "English", available: true },
    { slug: "math", name: "Math", available: false },
    { slug: "science", name: "Science", available: false },
  ];
  const subjectsBySlug = new Map<string, { id: string }>();
  for (const s of subjectDefs) {
    const subject = await db.subject.upsert({
      where: { stageId_slug: { stageId: stage5.id, slug: s.slug } },
      create: { stageId: stage5.id, slug: s.slug, name: s.name, available: s.available },
      update: { name: s.name, available: s.available },
    });
    subjectsBySlug.set(s.slug, subject);
  }

  const englishSubject = subjectsBySlug.get("english")!;

  // Unit 1 gets its real hand-authored content from unit-1.json; units 2-9
  // are stubs with no concepts yet (matches the old "coming soon" catalog).
  const unit1JsonPath = path.join(
    process.cwd(),
    "content/curricula/igcse/stage5/english/unit-1.json"
  );
  const unit1Json = JSON.parse(await readFile(unit1JsonPath, "utf-8")) as UnitJson;

  for (const u of ENGLISH_UNITS) {
    const key = unitKey("cambridge", 5, "english", u.number);
    const isUnit1 = u.number === 1;

    const unitRow = await db.unit.upsert({
      where: { unitKey: key },
      create: {
        subjectId: englishSubject.id,
        unitKey: key,
        number: u.number,
        title: u.title,
        board: isUnit1 ? unit1Json.board : "Cambridge",
        available: u.available,
        unitStatus: isUnit1 ? unit1Json.unit_status : "in_progress",
        sourcePublisher: isUnit1 ? unit1Json.source_reference.publisher : null,
        sourceTitle: isUnit1 ? unit1Json.source_reference.title : null,
        sourceAuthors: isUnit1 ? unit1Json.source_reference.authors : [],
        sourceSeriesEditors: isUnit1 ? unit1Json.source_reference.series_editors : [],
        sourceNote: isUnit1 ? unit1Json.source_reference.note : null,
        masteryChecklist: isUnit1 ? (unit1Json.unit_mastery_checklist as object) : undefined,
        progressionTestDraft: isUnit1 ? (unit1Json.progression_test_draft as object) : undefined,
      },
      update: {
        title: u.title,
        available: u.available,
      },
    });

    if (isUnit1) {
      await seedConceptsForUnit(unitRow.id, unit1Json);
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
