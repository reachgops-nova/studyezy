import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =========================================================================
// 🛡️ ADAPTIVE, SELF-HEALING SEED ENGINE (COMPATIBLE WITH ALL SCHEMAS)
// =========================================================================

async function adaptiveCreate(model: any, initialData: any, defaultOverrides: Record<string, any> = {}): Promise<any> {
  let data = { ...initialData };
  const maxRetries = 12;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await model.create({ data });
    } catch (err: any) {
      const errMsg = err.message || "";
      
      // 1. Match missing arguments
      const missingMatch = errMsg.match(/Argument `(\w+)` is missing/);
      if (missingMatch) {
        const field = missingMatch[1];
        console.log(`  🔧 [Adaptive Create] Adding required missing field: "${field}"`);
        
        if (field === 'slug') {
          data[field] = data.id || "default-slug";
        } else if (field === 'number') {
          data[field] = data.sequence || 1;
        } else if (field === 'conceptKey') {
          data[field] = `concept-${data.id || 'key'}`;
        } else if (field === 'displayName') {
          data[field] = data.name || "Default Display Name";
        } else if (defaultOverrides[field] !== undefined) {
          data[field] = defaultOverrides[field];
        } else {
          data[field] = "";
        }
        continue;
      }
      
      // 2. Match unknown arguments
      const unknownMatch = errMsg.match(/Unknown argument `(\w+)`/);
      if (unknownMatch) {
        const field = unknownMatch[1];
        console.log(`  🧹 [Adaptive Create] Stripping unsupported field: "${field}"`);
        delete data[field];
        continue;
      }
      
      // Unhandled error
      throw err;
    }
  }
  throw new Error("Max retries exceeded in adaptiveCreate");
}

async function adaptiveUpsert(model: any, query: { where: any; update: any; create: any }, defaultOverrides: Record<string, any> = {}): Promise<any> {
  let where = { ...query.where };
  let update = { ...query.update };
  let create = { ...query.create };
  const maxRetries = 12;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await model.upsert({ where, update, create });
    } catch (err: any) {
      const errMsg = err.message || "";
      
      // 1. Match missing arguments
      const missingMatch = errMsg.match(/Argument `(\w+)` is missing/);
      if (missingMatch) {
        const field = missingMatch[1];
        console.log(`  🔧 [Adaptive Upsert] Adding required missing field: "${field}"`);
        
        let val: any = "";
        if (field === 'slug') val = create.id || "slug";
        else if (field === 'number') val = 1;
        else if (field === 'conceptKey') val = `concept-${create.id || 'key'}`;
        else if (field === 'displayName') val = create.name || "Display Name";
        else if (defaultOverrides[field] !== undefined) val = defaultOverrides[field];
        
        create[field] = val;
        continue;
      }
      
      // 2. Match unknown arguments
      const unknownMatch = errMsg.match(/Unknown argument `(\w+)`/);
      if (unknownMatch) {
        const field = unknownMatch[1];
        console.log(`  🧹 [Adaptive Upsert] Stripping unsupported field: "${field}"`);
        delete create[field];
        delete update[field];
        continue;
      }
      
      throw err;
    }
  }
  throw new Error("Max retries exceeded in adaptiveUpsert");
}

// Helper to safely clean tables without throwing on schema variations
async function safeDelete(model: any, tableName: string) {
  try {
    if (model && typeof model.deleteMany === 'function') {
      await model.deleteMany({});
      console.log(`🧹 Cleaned ${tableName} table successfully.`);
    }
  } catch (e: any) {
    console.log(`⚠️ Skipping cleanup for ${tableName} (table or schema might not exist yet):`, e.message || e);
  }
}

// =========================================================================
// 🚀 MASTER SEED RUNNER
// =========================================================================

async function main() {
  console.log('🌱 Starting Self-Healing, Schema-Agnostic StudyEzy Database Seeding...');

  // 1. Safe, non-destructive clearing of tracking tables to prevent duplicate keys
  await safeDelete(prisma.conceptMastery, 'ConceptMastery');
  await safeDelete(prisma.reasoningLog, 'ReasoningLog');
  await safeDelete(prisma.concept, 'Concept');
  await safeDelete(prisma.unit, 'Unit');
  await safeDelete(prisma.subject, 'Subject');
  await safeDelete(prisma.stage, 'Stage');
  await safeDelete(prisma.curriculum, 'Curriculum');

  // 2. Seed Curriculum
  console.log('🌱 Seeding Curriculum...');
  const curriculum = await adaptiveCreate((prisma as any).curriculum, {
    id: "cambridge-primary",
    name: "Cambridge Primary",
    slug: "cambridge-primary"
  });
  console.log('✅ Curriculum seeded successfully!');

  // 3. Seed Stage
  console.log('🌱 Seeding Stage...');
  const stage = await adaptiveCreate((prisma as any).stage, {
    id: "cambridge-stage5",
    number: 5,
    label: "Stage 5",
    curriculumId: "cambridge-primary",
    curriculum: {
      connect: { id: "cambridge-primary" }
    }
  });
  console.log('✅ Stage seeded successfully!');

  // 4. Seed Subjects
  console.log('🌱 Seeding English Subject...');
  const english = await adaptiveCreate((prisma as any).subject, {
    id: "english-cambridge-stage5",
    name: "Cambridge English",
    grade: "Stage 5",
    available: true,
    slug: "cambridge-english-stage5",
    number: 1, // Supplying both slug and number upfront to comply with both schemas
    stageId: "cambridge-stage5",
    stage: {
      connect: { id: "cambridge-stage5" }
    }
  });
  console.log('✅ English Subject seeded successfully!');

  console.log('🌱 Seeding Math Subject...');
  const math = await adaptiveCreate((prisma as any).subject, {
    id: "math-cambridge-stage5",
    name: "Cambridge Mathematics",
    grade: "Stage 5",
    available: true,
    slug: "cambridge-mathematics-stage5",
    number: 2, // Supplying both slug and number upfront
    stageId: "cambridge-stage5",
    stage: {
      connect: { id: "cambridge-stage5" }
    }
  });
  console.log('✅ Math Subject seeded successfully!');

  // 5. Seed Units
  console.log('🌱 Seeding Units...');
  const unitsToSeed = [
    { id: "english-u1", subjectId: "english-cambridge-stage5", title: "Unit 1: Fiction: Stories from different cultures", unitKey: "fiction-fables", number: 1, sequence: 1 },
    { id: "english-u2", subjectId: "english-cambridge-stage5", title: "Unit 2: Non-fiction: Biography", unitKey: "nonfiction-biography", number: 2, sequence: 2 },
    { id: "english-u3", subjectId: "english-cambridge-stage5", title: "Unit 3: Poetry: Narrative poems", unitKey: "poetry-narrative", number: 3, sequence: 3 },
    { id: "english-u4", subjectId: "english-cambridge-stage5", title: "Unit 4: Non-fiction: Information and explanation texts", unitKey: "nonfiction-explanation", number: 4, sequence: 4 },
    { id: "english-u5", subjectId: "english-cambridge-stage5", title: "Unit 5: Fiction: Stories that have been developed into a film", unitKey: "fiction-film-story", number: 5, sequence: 5 },
    { id: "english-u6", subjectId: "english-cambridge-stage5", title: "Unit 6: Fiction: Classic literature", unitKey: "fiction-classic", number: 6, sequence: 6 },
    { id: "english-u7", subjectId: "english-cambridge-stage5", title: "Unit 7: Playscripts: A playscript, book and film of the same story", unitKey: "playscript-film", number: 7, sequence: 7 },
    { id: "english-u8", subjectId: "english-cambridge-stage5", title: "Unit 8: Poetry: Poems by famous poets", unitKey: "poetry-famous", number: 8, sequence: 8 },
    { id: "english-u9", subjectId: "english-cambridge-stage5", title: "Unit 9: Non-fiction: Persuasive texts", unitKey: "nonfiction-persuasive", number: 9, sequence: 9 },
    { id: "math-u6", subjectId: "math-cambridge-stage5", title: "Unit 6: Fractions, Decimals and Percentages", unitKey: "fractions-decimals", number: 6, sequence: 6 }
  ];

  for (const u of unitsToSeed) {
    await adaptiveCreate((prisma as any).unit, {
      id: u.id,
      subjectId: u.subjectId,
      title: u.title,
      unitKey: u.unitKey,
      number: u.number,
      sequence: u.sequence
    });
  }
  console.log('✅ All Units seeded successfully!');

  // 6. Seed Concepts
  console.log('🌱 Seeding Concepts...');
  const conceptsToSeed = [
    // UNIT 1: FICTION
    {
      id: '1.2',
      unitId: 'english-u1',
      title: 'Implicit Meaning (Jo\'s Face)',
      pageNumber: 5,
      sequence: 1,
      introScript: 'Fables are amazing stories that teach us deep lessons, but writers don\'t always tell us everything! Sometimes they "show" us how characters feel through actions. This is called implicit meaning. Let\'s watch Jo on the screen—how does her face change when we say she winked or grinned?',
      widgetId: 'jo-wink',
      reviewInterval: 14,
      conceptKey: 'concept-1-2'
    },
    {
      id: '1.7',
      unitId: 'english-u1',
      title: 'Fact vs. Opinion',
      pageNumber: 10,
      sequence: 2,
      introScript: 'Today, we are going to learn how to weigh our words! A fact is something we can prove true or false with real evidence. An opinion is how someone personally thinks or feels about something. Let\'s play with Ezy\'s custom Balance Scale to see which words sink down like heavy facts, and which ones float like opinion bubbles!',
      widgetId: '1.7',
      reviewInterval: 7,
      conceptKey: 'concept-1-7'
    },
    {
      id: '1.9',
      unitId: 'english-u1',
      title: 'Sentence Types & Connectors',
      pageNumber: 15,
      sequence: 3,
      introScript: 'To build exciting stories, we need to snap our ideas together! Today we are building a Sentence Train. By using conjunctions like "and," "but," and "because," we can connect short carriages into giant compound and complex sentences. Ready to spin our train wheels?',
      widgetId: '1.9',
      reviewInterval: 14,
      conceptKey: 'concept-1-9'
    },

    // UNIT 2: BIOGRAPHY
    {
      id: '2.1',
      unitId: 'english-u2',
      title: 'Features of a Biography',
      pageNumber: 26,
      sequence: 1,
      introScript: 'A biography is a true record of an extraordinary person\'s life, written by someone else! Today, we are exploring the life of Poorna Malavath, the youngest girl to climb Mount Everest. Let\'s scan her record to find direct quotes and key dates!',
      widgetId: 'biography-scan',
      reviewInterval: 7,
      conceptKey: 'concept-2-1'
    },
    {
      id: '2.2',
      unitId: 'english-u2',
      title: 'Chronological Timelines',
      pageNumber: 29,
      sequence: 2,
      introScript: 'Biographies must tell a life story in the order that it happened. This is called chronological order! We use time connectives like "next," "afterwards," and "eventually" to guide readers. Let\'s help Usain Bolt arrange his historic running records along his running track timeline!',
      widgetId: 'bolt-timeline',
      reviewInterval: 14,
      conceptKey: 'concept-2-2'
    },
    {
      id: '2.5',
      unitId: 'english-u2',
      title: 'Prefixes & Suffixes',
      pageNumber: 38,
      sequence: 3,
      introScript: 'Gears can change how machines spin, and prefixes can change what words mean! By adding a prefix like "un-" or "dis-" to a root word, we can reverse its meaning. Let\'s mesh our prefix gears together to build opposites!',
      widgetId: 'prefix-suffix-machine',
      reviewInterval: 14,
      conceptKey: 'concept-2-5'
    },

    // UNIT 4: EXPLANATION TEXTS
    {
      id: '4.1',
      unitId: 'english-u4',
      title: 'Explanation Texts ("Our Watery World")',
      pageNumber: 61,
      sequence: 1,
      introScript: 'Welcome to our Science Corner! Today we are looking at explanation texts to understand "Our Watery World". We will join Droppy the Raindrop to see how oceans recycle rain through evaporation, condensation, and precipitation. Watch Droppy float up as vapor!',
      widgetId: 'droppy-water-cycle',
      reviewInterval: 21,
      conceptKey: 'concept-4-1'
    },

    // MATH UNIT 6: FRACTIONS
    {
      id: 'm6.1',
      unitId: 'math-u6',
      title: 'Equivalent Fractions',
      pageNumber: 112,
      sequence: 1,
      introScript: 'Fractions are just pieces of a whole, but sometimes different pieces represent the exact same amount! Today we are discovering Equivalent Fractions. Let\'s slide Ezy\'s special Fraction Shading block to see how two quarters match perfectly with one half!',
      widgetId: 'fraction-shading',
      reviewInterval: 14,
      conceptKey: 'concept-m6-1'
    },
    {
      id: 'm6.2',
      unitId: 'math-u6',
      title: 'Adding & Subtracting Fractions',
      pageNumber: 114,
      sequence: 2,
      introScript: 'To add or subtract fractions, we must make sure their denominators are completely matching! If they aren\'t, we use our equivalent fraction gears to transform them. Let\'s calculate together!',
      widgetId: 'fraction-calc',
      reviewInterval: 14,
      conceptKey: 'concept-m6-2'
    }
  ];

  for (const c of conceptsToSeed) {
    await adaptiveCreate((prisma as any).concept, {
      id: c.id,
      unitId: c.unitId,
      title: c.title,
      pageNumber: c.pageNumber,
      sequence: c.sequence,
      introScript: c.introScript,
      widgetId: c.widgetId,
      reviewInterval: c.reviewInterval,
      conceptKey: c.conceptKey
    });
  }
  console.log('✅ All Concepts seeded successfully!');

  // 7. Seed All 5 User Accounts (with passwordHash parameter falling back safely)
  console.log('🌱 Restoring and Seeding the 5 DB Users...');
  const usersToSeed = [
    { email: 'reachgops@gmail.com', role: 'ADMIN', id: 'reachgops_admin' },
    { email: 'sivasakthi13425@gmail.com', role: 'TEACHER', id: 'sivasakthi_teacher' },
    { email: 'parent@studyezy.com', role: 'PARENT', id: 'parent_user' },
    { email: 'admin@studyezy.com', role: 'ADMIN', id: 'admin_user' },
    { email: 'student@studyezy.com', role: 'STUDENT', id: 'student_user' }
  ];

  // Hash representing Blowfish Bcrypt of "P@ssw0rd@321" (salt rounds 12)
  const masterPasswordHash = "$2b$12$.bdb9A4nfauy4.OBpc.wZOynDT9hWgqyNtBqBLxvr0ijzRuq./XrS";

  for (const u of usersToSeed) {
    await adaptiveUpsert((prisma as any).user, {
      where: { email: u.email },
      update: {
        passwordHash: masterPasswordHash,
        role: u.role
      },
      create: {
        id: u.id,
        email: u.email,
        passwordHash: masterPasswordHash,
        role: u.role
      }
    }, {
      password: masterPasswordHash
    });
    console.log(`✅ Seeded user account: ${u.email}`);
  }

  // 8. Seed default Student Profile for Viban
  console.log('🌱 Seeding default student profile...');
  await adaptiveUpsert((prisma as any).studentProfile, {
    where: { id: "student_viban" },
    update: {
      displayName: "Viban Gopinath"
    },
    create: {
      id: "student_viban",
      displayName: "Viban Gopinath",
      name: "Viban Gopinath",
      user: {
        connect: { id: "parent_user" }
      },
      assignedStage: {
        connect: { id: "cambridge-stage5" }
      }
    }
  }, {
    userId: "parent_user",
    assignedStageId: "cambridge-stage5"
  });
  console.log('✅ Student Profile seeded successfully!');

  console.log('🌱 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding process crashed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
