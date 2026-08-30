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
  // available:true - Unit 2 went live on 2026-08-27 (6 concepts, real
  // textbook pages, its own progression tests). This flag is written on
  // UPDATE as well as create, so leaving it false meant a routine
  // `npm run db:seed` would silently unpublish a unit families are using.
  { number: 2, title: "Non-fiction: Biography", available: true },
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

// ---------------------------------------------------------------------------
// Progression-test loading from the authored JSON datasets.
//
// Mirrors what scripts/load-progression-tests.py and
// scripts/load-p1-workbook-tests.py did to production, so a freshly seeded
// database ends up with the same papers rather than only Unit 1's original
// moderate draft. Questions are MERGED and de-duplicated by question text -
// the three hand-authored moderate questions and the loaded tiers all coexist,
// exactly as they do live.
// ---------------------------------------------------------------------------

/**
 * curriculum-english-stage5.json's test questions carry no concept_tested, so
 * each is mapped here to a real live Concept.conceptKey. Keyed
 * "<unit>|<tier>|<questionId>". Verified against the database - an unmatched
 * key would be silently dropped by the mastery write rather than erroring.
 */
const CURRICULUM_CONCEPT_MAP: Record<string, string> = {
  "1|easy|q1": "1.1",     // purpose of a fable
  "1|easy|q2": "1.7",     // fact vs opinion
  "1|moderate|q1": "1.2", // implicit meaning
  "1|moderate|q2": "1.9", // compound sentence
  "1|tough|q1": "1.9",    // complex sentence with 'because'
  "1|tough|q2": "1.8",    // idiom 'in hot water'
  "2|easy|q1": "2.1",     // third person
  "2|easy|q2": "2.6",     // prefix im-
  "2|moderate|q1": "2.2", // time adverbs
  "2|moderate|q2": "2.6", // suffix -ing doubling
  "2|tough|q1": "2.6",    // 'travelling' UK rule
  "2|tough|q2": "2.2",    // 3-step chronological timeline
};


type SeedQuestion = Record<string, unknown> & { question: string; concept_tested: string };

/**
 * "Concept 1.3" -> "1.3". studyezy-p1-workbook-tests.json writes the prefixed
 * form, and an unprefixed conceptKey is what app/api/attempts/route.ts resolves
 * against Concept.conceptKey. A key that matches nothing is NOT an error - the
 * mastery write silently skips it - so this normalization is load-bearing.
 */
function normalizeConceptKey(raw: unknown): string {
  const m = String(raw ?? "").match(/(\d+\.\d+)/);
  if (!m) throw new Error(`Cannot parse a concept key out of ${JSON.stringify(raw)}`);
  return m[1];
}

function toSeedQuestion(q: Record<string, any>): SeedQuestion {
  const concept = normalizeConceptKey(q.concept_tested);
  if (q.type === "short_answer" || q.type === "short-answer") {
    const rubric = q.rubric ?? {};
    const criteria: string[] = [];
    if (q.gradingRubric) criteria.push(q.gradingRubric);
    if (rubric.criteria) criteria.push(rubric.criteria);
    for (const [stage, text] of Object.entries(rubric.points ?? {})) {
      criteria.push(`${stage[0].toUpperCase()}${stage.slice(1)}: ${text} (1 mark)`);
    }
    if (q.modelAnswer) criteria.push(`Example of a full-mark answer: ${q.modelAnswer}`);
    return {
      type: "short_answer",
      question: q.question,
      concept_tested: concept,
      mark_scheme: {
        full_marks: Math.max(1, Object.keys(rubric.points ?? {}).length || 2),
        criteria,
      },
    };
  }
  const options: string[] = q.options ?? q.choices ?? [];
  const idx = options.indexOf(q.answer);
  if (idx < 0) throw new Error(`Answer not among options for: ${q.question.slice(0, 50)}`);
  return { type: "multiple_choice", question: q.question, options, correct_answer: idx, concept_tested: concept };
}

/** Appends `incoming` to the unit's paper for this tier, skipping duplicates. */
async function mergeQuestionPaper(unitId: string, difficulty: string, incoming: SeedQuestion[], note?: string) {
  if (incoming.length === 0) return;
  const existing = await db.questionPaper.findUnique({
    where: { unitId_difficulty: { unitId, difficulty } },
  });
  const current = (existing?.questions as SeedQuestion[] | undefined) ?? [];
  const seen = new Set(current.map((q) => q.question));
  const merged = [...current, ...incoming.filter((q) => !seen.has(q.question))];
  const covers = [...new Set(merged.map((q) => q.concept_tested))].sort();

  await db.questionPaper.upsert({
    where: { unitId_difficulty: { unitId, difficulty } },
    create: { unitId, difficulty, coversConcepts: covers, note: note ?? null, questions: merged },
    update: { coversConcepts: covers, questions: merged, note: existing?.note ?? note ?? null },
  });
}


/**
 * Loads every authored progression test into QuestionPaper rows, merging into
 * whatever a unit already has (see mergeQuestionPaper). Reads the two datasets
 * at the repo root; skips silently if either is absent so the seed still works
 * in a checkout without them.
 */
async function seedProgressionTests() {
  const root = process.cwd();
  const readJson = async (name: string) => {
    try {
      return JSON.parse(await readFile(path.join(root, name), "utf8"));
    } catch {
      console.warn(`  (skipping ${name} - not found)`);
      return null;
    }
  };

  const unitIdFor = async (unitNumber: number) => {
    const row = await db.unit.findUnique({ where: { unitKey: unitKey("cambridge", 5, "english", unitNumber) } });
    return row?.id ?? null;
  };

  // 1. curriculum-english-stage5.json - easy/moderate/tough for Units 1 and 2.
  const curriculum = await readJson("curriculum-english-stage5.json");
  for (const unit of curriculum?.units ?? []) {
    const unitId = await unitIdFor(unit.unitNumber);
    if (!unitId) continue;
    for (const [tier, body] of Object.entries<any>(unit.progressionTest?.difficultyTiers ?? {})) {
      // This dataset omits concept_tested entirely, so the mapping lives here
      // rather than in the file - each question is tagged by hand below.
      const mapped = (body.questions ?? []).map((q: any, i: number) => ({
        ...q,
        concept_tested: CURRICULUM_CONCEPT_MAP[`${unit.unitNumber}|${tier}|${q.id ?? `q${i + 1}`}`],
      }));
      await mergeQuestionPaper(unitId, tier, mapped.map(toSeedQuestion), body.instructions);
    }
  }

  // 2. studyezy-p1-workbook-tests.json - three extra Unit 1 questions grounded
  //    in the real fable text. These DO carry concept_tested, in the prefixed
  //    "Concept 1.1" form that normalizeConceptKey strips.
  const workbook = await readJson("studyezy-p1-workbook-tests.json");
  const unit1Id = await unitIdFor(1);
  if (unit1Id && workbook) {
    for (const [tier, body] of Object.entries<any>(workbook.progressive_evaluations?.unit_1_tests ?? {})) {
      await mergeQuestionPaper(unit1Id, tier, (body.questions ?? []).map(toSeedQuestion));
    }
  }

  console.log("  Progression tests loaded.");
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
      },
      update: {
        title: u.title,
        available: u.available,
      },
    });

    if (isUnit1) {
      await seedConceptsForUnit(unitRow.id, unit1Json);

      // Original test content ships as the "moderate" tier - matches the
      // QuestionPaper model that replaced the old single-blob
      // Unit.progressionTestDraft field (see 2026-08-20 migration).
      const draft = unit1Json.progression_test_draft as {
        covers_concepts?: string[];
        note?: string;
        questions?: unknown;
      };
      if (draft?.questions) {
        await db.questionPaper.upsert({
          where: { unitId_difficulty: { unitId: unitRow.id, difficulty: "moderate" } },
          create: {
            unitId: unitRow.id,
            difficulty: "moderate",
            coversConcepts: draft.covers_concepts ?? [],
            note: draft.note ?? null,
            questions: draft.questions as object,
          },
          update: {
            coversConcepts: draft.covers_concepts ?? [],
            note: draft.note ?? null,
            questions: draft.questions as object,
          },
        });
      }
    }
  }

  await seedProgressionTests();

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
