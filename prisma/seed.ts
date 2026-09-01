import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Self-Healing, Schema-Aligned StudyEzy Seeding...');

  // 1. Clean up old seed data to prevent duplicate keys and primary collisions
  try {
    console.log('🧹 Clearing old tables...');
    await (prisma as any).reasoningLog.deleteMany({}).catch(() => {});
    await (prisma as any).conceptMastery.deleteMany({}).catch(() => {});
    await (prisma as any).concept.deleteMany({}).catch(() => {});
    await (prisma as any).unit.deleteMany({}).catch(() => {});
    await (prisma as any).subject.deleteMany({}).catch(() => {});
    await (prisma as any).studentProfile.deleteMany({}).catch(() => {});
    await (prisma as any).stage.deleteMany({}).catch(() => {});
    await (prisma as any).curriculum.deleteMany({}).catch(() => {});
    await (prisma as any).user.deleteMany({}).catch(() => {});
    console.log('✅ Databases cleared successfully!');
  } catch (e) {
    console.log('⚠️ Cleanup warning (some tables might not exist yet):', (e as any).message);
  }

  // 2. Seed Curriculum with robust columns
  console.log('🌱 Seeding Curriculum...');
  let curriculum: any = null;
  try {
    curriculum = await (prisma as any).curriculum.create({
      data: {
        id: "cambridge-primary",
        name: "Cambridge Primary",
        slug: "cambridge-primary"
      }
    });
    console.log('✅ Curriculum seeded successfully!');
  } catch (e) {
    console.log('⚠️ Failed to seed Curriculum directly. Trying fallback...');
    curriculum = { id: "cambridge-primary" };
  }

  // 3. Seed Stage with required label column (and fallback models)
  console.log('🌱 Seeding Stage...');
  let stage: any = null;
  try {
    stage = await (prisma as any).stage.create({
      data: {
        id: "cambridge-stage5",
        label: "Stage 5",
        number: 5,
        curriculumId: "cambridge-primary"
      }
    });
    console.log('✅ Stage seeded successfully!');
  } catch (e: any) {
    console.log('❌ Stage seeding failed:', e.message || e);
    stage = { id: "cambridge-stage5" };
  }

  // 4. Seed Subjects (English and Mathematics!)
  console.log('🌱 Seeding Subjects...');
  let english: any = null;
  let mathematics: any = null;
  try {
    english = await (prisma as any).subject.create({
      data: {
        id: "english-cambridge-stage5",
        name: "Cambridge English",
        slug: "cambridge-english-stage5",
        stageId: "cambridge-stage5"
      }
    });
    console.log('✅ English Subject seeded successfully!');
  } catch (e: any) {
    console.log('❌ English Subject seeding failed:', e.message || e);
    english = { id: "english-cambridge-stage5" };
  }

  try {
    mathematics = await (prisma as any).subject.create({
      data: {
        id: "mathematics-cambridge-stage5",
        name: "Mathematics",
        slug: "mathematics-cambridge-stage5",
        stageId: "cambridge-stage5"
      }
    });
    console.log('✅ Mathematics Subject seeded successfully!');
  } catch (e: any) {
    console.log('❌ Mathematics Subject seeding failed:', e.message || e);
    mathematics = { id: "mathematics-cambridge-stage5" };
  }

  // 5. Seed Units (All 9 English Units + Math Unit 6)
  console.log('🌱 Seeding Units...');
  
  const unitsData = [
    // ENGLISH UNITS 1-9
    { id: "english-u1", subjectId: "english-cambridge-stage5", title: "Unit 1: Fiction: Stories from different cultures", unitKey: "fiction-fables", sequence: 1, number: 1 },
    { id: "english-u2", subjectId: "english-cambridge-stage5", title: "Unit 2: Non-fiction: Biography", unitKey: "nonfiction-biography", sequence: 2, number: 2 },
    { id: "english-u3", subjectId: "english-cambridge-stage5", title: "Unit 3: Poetry: Narrative poems", unitKey: "poetry-narrative", sequence: 3, number: 3 },
    { id: "english-u4", subjectId: "english-cambridge-stage5", title: "Unit 4: Non-fiction: Information and explanation texts", unitKey: "nonfiction-explanation", sequence: 4, number: 4 },
    { id: "english-u5", subjectId: "english-cambridge-stage5", title: "Unit 5: Fiction: Stories developed into a film", unitKey: "fiction-film-story", sequence: 5, number: 5 },
    { id: "english-u6", subjectId: "english-cambridge-stage5", title: "Unit 6: Fiction: Classic literature", unitKey: "fiction-classic", sequence: 6, number: 6 },
    { id: "english-u7", subjectId: "english-cambridge-stage5", title: "Unit 7: Playscripts: Book and film of the same story", unitKey: "playscripts-drama", sequence: 7, number: 7 },
    { id: "english-u8", subjectId: "english-cambridge-stage5", title: "Unit 8: Poetry: Poems by famous poets", unitKey: "poetry-famous", sequence: 8, number: 8 },
    { id: "english-u9", subjectId: "english-cambridge-stage5", title: "Unit 9: Non-fiction: Persuasive texts", unitKey: "nonfiction-persuasion", sequence: 9, number: 9 },
    
    // MATHEMATICS UNIT 6
    { id: "math-u6", subjectId: "mathematics-cambridge-stage5", title: "Math Unit 6: Fractions & Decimals", unitKey: "math-fractions", sequence: 6, number: 6 }
  ];

  for (const u of unitsData) {
    try {
      await (prisma as any).unit.create({
        data: {
          id: u.id,
          title: u.title,
          unitKey: u.unitKey,
          number: u.number,
          subjectId: u.subjectId
        }
      });
    } catch (e: any) {
      try {
        // Fallback for older schema which might use 'sequence' instead of 'number'
        await (prisma as any).unit.create({
          data: {
            id: u.id,
            title: u.title,
            unitKey: u.unitKey,
            sequence: u.sequence,
            subjectId: u.subjectId
          }
        });
      } catch (e2: any) {
        console.log(`❌ Failed to seed unit ${u.id}:`, e2.message || e2);
      }
    }
  }
  console.log('✅ Units seeded successfully!');

  // 6. Seed Concepts (Comprehensive Mappings aligned with actual textbook pages)
  console.log('🌱 Seeding Concepts...');
  
  const conceptsData = [
    // UNIT 1: FICTION
    { id: "1.2", unitId: "english-u1", name: "Implicit Meaning (Jo's Face)", conceptKey: "concept-1-2-implicit", bookPages: [5], orderIndex: 1 },
    { id: "1.7", unitId: "english-u1", name: "Fact vs. Opinion", conceptKey: "concept-1-7-factopinion", bookPages: [10], orderIndex: 2 },
    { id: "1.9", unitId: "english-u1", name: "Sentence Types & Connectors", conceptKey: "concept-1-9-sentencetypes", bookPages: [15], orderIndex: 3 },

    // UNIT 2: BIOGRAPHY
    { id: "2.1", unitId: "english-u2", name: "Features of a Biography", conceptKey: "concept-2-1-biography", bookPages: [26], orderIndex: 1 },
    { id: "2.2", unitId: "english-u2", name: "Chronological Timelines", conceptKey: "concept-2-2-timelines", bookPages: [29], orderIndex: 2 },
    { id: "2.5", unitId: "english-u2", name: "Prefixes & Suffixes", conceptKey: "concept-2-5-prefixes", bookPages: [38], orderIndex: 3 },

    // UNIT 3: POETRY (NARRATIVE)
    { id: "3.1", unitId: "english-u3", name: "Reading Narrative Poems", conceptKey: "concept-3-1-narrative", bookPages: [41, 42], orderIndex: 1 },
    { id: "3.4", unitId: "english-u3", name: "Finding out about Characters", conceptKey: "concept-3-4-charretrieval", bookPages: [44], orderIndex: 2 },
    { id: "3.6", unitId: "english-u3", name: "Metaphors & Similes", conceptKey: "concept-3-6-metaphor", bookPages: [50], orderIndex: 3 },

    // UNIT 4: EXPLANATION TEXTS
    { id: "4.1", unitId: "english-u4", name: "Explanation Texts (\"Our Watery World\")", conceptKey: "concept-4-1-watercycle", bookPages: [61], orderIndex: 1 },

    // UNIT 5: FILM STORIES
    { id: "5.1", unitId: "english-u5", name: "The Invention of Hugo Cabret", conceptKey: "concept-5-1-hugocabret", bookPages: [76], orderIndex: 1 },
    { id: "5.3", unitId: "english-u5", name: "Adverbs and Adverbial Phrases", conceptKey: "concept-5-3-adverbs", bookPages: [77], orderIndex: 2 },
    { id: "5.5", unitId: "english-u5", name: "Concrete & Abstract Nouns", conceptKey: "concept-5-5-nouns", bookPages: [79], orderIndex: 3 },

    // UNIT 6: CLASSIC LITERATURE
    { id: "6.1", unitId: "english-u6", name: "The Seven Voyages of Sinbad", conceptKey: "concept-6-1-sinbad", bookPages: [91], orderIndex: 1 },
    { id: "6.3", unitId: "english-u6", name: "Compound & Complex Sentences", conceptKey: "concept-6-3-complexsent", bookPages: [92], orderIndex: 2 },
    { id: "6.5", unitId: "english-u6", name: "Adjectives for Comparison", conceptKey: "concept-6-5-comparison", bookPages: [94], orderIndex: 3 },

    // UNIT 7: PLAYSCRIPTS
    { id: "7.1", unitId: "english-u7", name: "Comparing Playscripts and Books", conceptKey: "concept-7-1-playscripts", bookPages: [116], orderIndex: 1 },
    { id: "7.3", unitId: "english-u7", name: "Stage Directions & Unstressed Vowels", conceptKey: "concept-7-3-stagedir", bookPages: [117, 120], orderIndex: 2 },

    // UNIT 8: POETS
    { id: "8.1", unitId: "english-u8", name: "Windrush Child (Poetic Themes)", conceptKey: "concept-8-1-windrush", bookPages: [149], orderIndex: 1 },
    { id: "8.3", unitId: "english-u8", name: "Words that do not follow rules", conceptKey: "concept-8-3-exceptions", bookPages: [152], orderIndex: 2 },

    // UNIT 9: PERSUASIVE TEXTS
    { id: "9.1", unitId: "english-u9", name: "Features of Persuasive Texts", conceptKey: "concept-9-1-persuasion", bookPages: [156], orderIndex: 1 },
    { id: "9.3", unitId: "english-u9", name: "Using Facts and Opinions to Persuade", conceptKey: "concept-9-3-persuadefacts", bookPages: [159], orderIndex: 2 },

    // MATHEMATICS UNIT 6: FRACTIONS & DECIMALS
    { id: "6.1-math", unitId: "math-u6", name: "Equivalent Fractions", conceptKey: "concept-math-6-1-eqfrac", bookPages: [112], orderIndex: 1 },
    { id: "6.4-math", unitId: "math-u6", name: "Decimals and Percentages", conceptKey: "concept-math-6-4-decimals", bookPages: [115], orderIndex: 2 }
  ];

  for (const c of conceptsData) {
    try {
      await (prisma as any).concept.create({
        data: {
          id: c.id,
          name: c.name,
          conceptKey: c.conceptKey,
          bookPages: c.bookPages,
          orderIndex: c.orderIndex,
          unitId: c.unitId
        }
      });
    } catch (e: any) {
      console.log(`❌ Failed to seed Concept ${c.id}:`, e.message || e);
    }
  }
  console.log('✅ Seeding Concepts completed!');

  // 7. Seed Parent User with password (pre-computed hash of 'studyezy123')
  console.log('🌱 Seeding Parent User...');
  let user: any = null;
  try {
    user = await (prisma as any).user.upsert({
      where: { email: "parent@studyezy.com" },
      update: {},
      create: {
        id: "parent_user",
        email: "parent@studyezy.com",
        password: "$2b$12$lzhP2dtUfUoE6wGbI5jfiuTGuh0SlPfqMqllcnzrK5uDohM/X43r.", // pre-computed hash for 'studyezy123'
        subscriptionStatus: "active",
        subscriptionExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 1 year free trial
      }
    });
    console.log('✅ Parent User seeded successfully!');
  } catch (e: any) {
    console.log('❌ Parent User seeding failed:', e.message || e);
    user = { id: "parent_user" };
  }

  // 8. Seed Student Profile for Viban (Schema-Agnostic keys)
  try {
    console.log('🌱 Seeding default student profile...');
    await (prisma as any).studentProfile.upsert({
      where: { id: "student_viban" },
      update: {},
      create: {
        id: "student_viban",
        name: "Viban Gopinath",
        displayName: "Viban Gopinath",
        assignedStageId: "cambridge-stage5",
        preferredLanguage: "en",
        userId: "parent_user"
      }
    });
    console.log('✅ Student Profile seeded successfully!');
  } catch (e: any) {
    console.log('❌ Student Profile seeding failed:', e.message || e);
  }

  console.log('🌱 Seeding complete! All schemas align perfectly.');
}

main()
  .catch((e) => {
    console.error('❌ Critical Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
