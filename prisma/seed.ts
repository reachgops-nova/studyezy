import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: Safely locate a model property by checking both lowercase and pascal case options
function getModel(prismaInstance: any, name: string): any {
  const lowercase = name.toLowerCase();
  const pascalCase = name.charAt(0).toUpperCase() + name.slice(1);
  if (prismaInstance[lowercase]) return prismaInstance[lowercase];
  if (prismaInstance[pascalCase]) return prismaInstance[pascalCase];
  return null;
}

// Helper: Delete all rows in a model safely without crashing if the model or rows don't exist
async function smartDeleteAll(modelName: string) {
  try {
    const model = getModel(prisma, modelName);
    if (model) {
      await model.deleteMany({});
      console.log(`[CLEAN] Safe wiped: ${modelName}`);
    } else {
      console.log(`[CLEAN] Model ${modelName} not found in this schema version.`);
    }
  } catch (e: any) {
    console.log(`[CLEAN] Skipping ${modelName} cleanup:`, e.message || e);
  }
}

// Helper: Smart create that parses Prisma validation errors and self-corrects on-the-fly
async function smartCreate(modelName: string, initialData: any) {
  const model = getModel(prisma, modelName);
  if (!model) {
    console.log(`[SEED] Model ${modelName} not found in schema. Skipping creation.`);
    return null;
  }
  
  let data = { ...initialData };
  let attempts = 0;
  while (attempts < 20) {
    try {
      const result = await model.create({ data });
      console.log(`  ✅ [SUCCESS] Seeded ${modelName}: ${data.id || result.id}`);
      return result;
    } catch (err: any) {
      const errMsg = err.message || '';
      
      // Match unknown argument error (e.g. "Unknown argument `grade`")
      const unknownMatch = errMsg.match(/Unknown argument `([^`]+)`/);
      if (unknownMatch) {
        const unknownField = unknownMatch[1];
        console.log(`  [SELF-HEAL][${modelName}] Removing unknown property: "${unknownField}"`);
        delete data[unknownField];
        
        // Relational connection fallbacks to direct scalar foreign keys
        if (unknownField === 'curriculum' && data.id === 'cambridge-stage5') {
          data.curriculumId = 'cambridge-primary';
        } else if (unknownField === 'stage' && (data.id === 'english-cambridge-stage5' || data.id === 'math-cambridge-stage5')) {
          data.stageId = 'cambridge-stage5';
        } else if (unknownField === 'subject' && data.id?.startsWith('english-u')) {
          data.subjectId = 'english-cambridge-stage5';
        }
        
        attempts++;
        continue;
      }
      
      // Match missing argument error (e.g. "Argument `slug` is missing")
      const missingMatch = errMsg.match(/Argument `([^`]+)` is missing/);
      if (missingMatch) {
        const missingField = missingMatch[1];
        console.log(`  [SELF-HEAL][${modelName}] Supplying default for missing field: "${missingField}"`);
        
        if (missingField === 'slug') {
          data.slug = data.id || 'default-slug';
        } else if (missingField === 'number') {
          data.number = 1;
        } else if (missingField === 'conceptKey') {
          data.conceptKey = data.id || 'default-concept-key';
        } else if (missingField === 'displayName') {
          data.displayName = data.name || 'Default Name';
        } else if (missingField === 'name') {
          data.name = data.displayName || 'Default Name';
        } else if (missingField === 'user') {
          data.user = { connect: { id: 'parent_user' } };
        } else if (missingField === 'stage') {
          data.stage = { connect: { id: 'cambridge-stage5' } };
        } else if (missingField === 'curriculum') {
          data.curriculum = { connect: { id: 'cambridge-primary' } };
        } else {
          if (errMsg.includes('Int')) {
            data[missingField] = 1;
          } else if (errMsg.includes('Boolean')) {
            data[missingField] = true;
          } else {
            data[missingField] = 'default';
          }
        }
        attempts++;
        continue;
      }
      
      console.log(`  ❌ [CRITICAL ERROR][${modelName}]:`, errMsg);
      throw err;
    }
  }
  throw new Error(`Failed to seed ${modelName} after multiple self-healing attempts.`);
}

// Helper: Smart User Upsert that self-heals password vs passwordHash conflicts
async function smartUpsertUser(u: any, masterPasswordHash: string) {
  const model = getModel(prisma, 'User');
  if (!model) {
    console.log(`[SEED] User model not found. Skipping user upsert.`);
    return null;
  }
  
  let create: any = {
    id: u.id,
    email: u.email,
    role: u.role,
    passwordHash: masterPasswordHash
  };
  
  let update: any = {
    role: u.role,
    passwordHash: masterPasswordHash
  };
  
  let attempts = 0;
  while (attempts < 20) {
    try {
      const result = await model.upsert({
        where: { email: u.email },
        update,
        create
      });
      console.log(`  ✅ [SUCCESS] Seeded user account: ${u.email}`);
      return result;
    } catch (err: any) {
      const errMsg = err.message || '';
      
      const unknownMatch = errMsg.match(/Unknown argument `([^`]+)`/);
      if (unknownMatch) {
        const unknownField = unknownMatch[1];
        console.log(`  [SELF-HEAL][User] Removing unknown property: "${unknownField}"`);
        delete create[unknownField];
        delete update[unknownField];
        attempts++;
        continue;
      }
      
      const missingMatch = errMsg.match(/Argument `([^`]+)` is missing/);
      if (missingMatch) {
        const missingField = missingMatch[1];
        console.log(`  [SELF-HEAL][User] Supplying default for missing field: "${missingField}"`);
        
        if (missingField === 'password') {
          create.password = masterPasswordHash;
          update.password = masterPasswordHash;
        } else if (missingField === 'passwordHash') {
          create.passwordHash = masterPasswordHash;
          update.passwordHash = masterPasswordHash;
        } else {
          create[missingField] = 'default';
          update[missingField] = 'default';
        }
        attempts++;
        continue;
      }
      
      console.log(`  ❌ [CRITICAL ERROR][User]:`, errMsg);
      throw err;
    }
  }
}

// Helper: Smart StudentProfile Upsert that connects relations properly across multiple schema formats
async function smartUpsertStudentProfile() {
  const model = getModel(prisma, 'StudentProfile');
  if (!model) {
    console.log(`[SEED] StudentProfile model not found. Skipping.`);
    return null;
  }
  
  let create: any = {
    id: "student_viban",
    displayName: "Viban Gopinath",
    name: "Viban Gopinath",
    preferredLanguage: "en",
    user: {
      connect: { id: "parent_user" }
    },
    assignedStage: {
      connect: { id: "cambridge-stage5" }
    }
  };
  
  let update: any = {
    displayName: "Viban Gopinath",
    name: "Viban Gopinath"
  };
  
  let attempts = 0;
  while (attempts < 20) {
    try {
      const result = await model.upsert({
        where: { id: "student_viban" },
        update,
        create
      });
      console.log(`  ✅ [SUCCESS] Seeded student profile: student_viban (Viban Gopinath)`);
      return result;
    } catch (err: any) {
      const errMsg = err.message || '';
      
      const unknownMatch = errMsg.match(/Unknown argument `([^`]+)`/);
      if (unknownMatch) {
        const unknownField = unknownMatch[1];
        console.log(`  [SELF-HEAL][StudentProfile] Removing unknown property: "${unknownField}"`);
        delete create[unknownField];
        delete update[unknownField];
        
        if (unknownField === 'user') {
          create.userId = 'parent_user';
        } else if (unknownField === 'assignedStage') {
          create.assignedStageId = 'cambridge-stage5';
        }
        
        attempts++;
        continue;
      }
      
      const missingMatch = errMsg.match(/Argument `([^`]+)` is missing/);
      if (missingMatch) {
        const missingField = missingMatch[1];
        console.log(`  [SELF-HEAL][StudentProfile] Supplying default for missing field: "${missingField}"`);
        
        if (missingField === 'displayName') {
          create.displayName = "Viban Gopinath";
          update.displayName = "Viban Gopinath";
        } else if (missingField === 'name') {
          create.name = "Viban Gopinath";
          update.name = "Viban Gopinath";
        } else if (missingField === 'userId') {
          create.userId = 'parent_user';
        } else if (missingField === 'assignedStageId') {
          create.assignedStageId = 'cambridge-stage5';
        } else {
          create[missingField] = 'default';
          update[missingField] = 'default';
        }
        attempts++;
        continue;
      }
      
      console.log(`  ❌ [CRITICAL ERROR][StudentProfile]:`, errMsg);
      throw err;
    }
  }
}

async function main() {
  console.log('🚀 [SEED] Starting Intelligent, Self-Healing Master Database Seeding...');

  // 1. Safe cascading wiped cleanup of old records to prevent duplicate key crashes
  console.log('🧹 [CLEAN] Clearing old databases safe-paths...');
  await smartDeleteAll('conceptMastery');
  await smartDeleteAll('reasoningLog');
  await smartDeleteAll('concept');
  await smartDeleteAll('unit');
  await smartDeleteAll('subject');
  await smartDeleteAll('stage');
  await smartDeleteAll('curriculum');

  // 2. Seed Curriculum
  console.log('🌱 [SEED] Seeding Curriculum catalog...');
  await smartCreate('Curriculum', {
    id: "cambridge-primary",
    name: "Cambridge Primary",
    slug: "cambridge-primary"
  });

  // 3. Seed Stage 5
  console.log('🌱 [SEED] Seeding Curriculum Stage...');
  await smartCreate('Stage', {
    id: "cambridge-stage5",
    number: 5,
    label: "Stage 5",
    curriculum: {
      connect: { id: "cambridge-primary" }
    }
  });

  // 4. Seed Subjects (Cambridge English & Cambridge Mathematics)
  console.log('🌱 [SEED] Seeding Subjects (Primary Textbooks)...');
  await smartCreate('Subject', {
    id: "english-cambridge-stage5",
    name: "Cambridge English",
    slug: "cambridge-english-stage5",
    available: true,
    stage: {
      connect: { id: "cambridge-stage5" }
    }
  });

  await smartCreate('Subject', {
    id: "math-cambridge-stage5",
    name: "Cambridge Mathematics",
    slug: "cambridge-mathematics-stage5",
    available: true,
    stage: {
      connect: { id: "cambridge-stage5" }
    }
  });

  // 5. Seed Units (English Units 1-9 & Fractions)
  console.log('🌱 [SEED] Seeding Textbook Units...');
  const units = [
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

  for (const u of units) {
    await smartCreate('Unit', {
      id: u.id,
      subjectId: u.subjectId,
      title: u.title,
      unitKey: u.unitKey,
      number: u.number,
      sequence: u.sequence
    });
  }

  // 6. Seed Interactive Concepts mapped cleanly to physical pages of textbooks
  console.log('🌱 [SEED] Seeding Interactive Concepts & Voice Scripts...');
  const concepts = [
    // UNIT 1: FICTION (FABLES)
    {
      id: '1.2',
      unitId: 'english-u1',
      title: "Implicit Meaning (Jo's Face)",
      conceptKey: "concept-1.2-implicit",
      pageNumber: 5,
      sequence: 1,
      introScript: "Fables are amazing stories that teach us deep lessons, but writers don't always tell us everything! Sometimes they \"show\" us how characters feel through actions. This is called implicit meaning. Let's watch Jo on the screen—how does her face change when we say she winked or grinned?",
      widgetId: 'jo-wink',
      reviewInterval: 14
    },
    {
      id: '1.7',
      unitId: 'english-u1',
      title: "Fact vs. Opinion",
      conceptKey: "concept-1.7-fact-vs-opinion",
      pageNumber: 10,
      sequence: 2,
      introScript: "Today, we are going to learn how to weigh our words! A fact is something we can prove true or false with real evidence. An opinion is how someone personally thinks or feels about something. Let's play with Ezy's custom Balance Scale to see which words sink down like heavy facts, and which ones float like opinion bubbles!",
      widgetId: '1.7',
      reviewInterval: 7
    },
    {
      id: '1.9',
      unitId: 'english-u1',
      title: "Sentence Types & Connectors",
      conceptKey: "concept-1.9-sentence-train",
      pageNumber: 15,
      sequence: 3,
      introScript: "To build exciting stories, we need to snap our ideas together! Today we are building a Sentence Train. By using conjunctions like \"and,\" \"but,\" and \"because,\" we can connect short carriages into giant compound and complex sentences. Ready to spin our train wheels?",
      widgetId: '1.9',
      reviewInterval: 14
    },

    // UNIT 2: NON-FICTION (BIOGRAPHY)
    {
      id: '2.1',
      unitId: 'english-u2',
      title: "Features of a Biography",
      conceptKey: "concept-2.1-biography-features",
      pageNumber: 26,
      sequence: 1,
      introScript: "A biography is a true record of an extraordinary person's life, written by someone else! Today, we are exploring the life of Poorna Malavath, the youngest girl to climb Mount Everest. Let's scan her record to find direct quotes and key dates!",
      widgetId: 'biography-scan',
      reviewInterval: 7
    },
    {
      id: '2.2',
      unitId: 'english-u2',
      title: "Chronological Timelines",
      conceptKey: "concept-2.2-timelines",
      pageNumber: 29,
      sequence: 2,
      introScript: "Biographies must tell a life story in the order that it happened. This is called chronological order! We use time connectives like \"next,\" \"afterwards,\" and \"eventually\" to guide readers. Let's help Usain Bolt arrange his historic running records along his running track timeline!",
      widgetId: 'bolt-timeline',
      reviewInterval: 14
    },
    {
      id: '2.5',
      unitId: 'english-u2',
      title: "Prefixes & Suffixes",
      conceptKey: "concept-2.5-prefix-suffix",
      pageNumber: 38,
      sequence: 3,
      introScript: "Gears can change how machines spin, and prefixes can change what words mean! By adding a prefix like \"un-\" or \"dis-\" to a root word, we can reverse its meaning. Let's mesh our prefix gears together to build opposites!",
      widgetId: 'prefix-suffix-machine',
      reviewInterval: 14
    },

    // UNIT 4: NON-FICTION (EXPLANATIONS)
    {
      id: '4.1',
      unitId: 'english-u4',
      title: 'Explanation Texts ("Our Watery World")',
      conceptKey: "concept-4.1-explanation",
      pageNumber: 61,
      sequence: 1,
      introScript: "Welcome to our Science Corner! Today we are looking at explanation texts to understand \"Our Watery World\". We will join Droppy the Raindrop to see how oceans recycle rain through evaporation, condensation, and precipitation. Watch Droppy float up as vapor!",
      widgetId: 'droppy-water-cycle',
      reviewInterval: 21
    },

    // MATH UNIT 6: FRACTIONS
    {
      id: 'm6.1',
      unitId: 'math-u6',
      title: "Equivalent Fractions",
      conceptKey: "concept-m6.1-equivalent-fractions",
      pageNumber: 112,
      sequence: 1,
      introScript: "Fractions are just pieces of a whole, but sometimes different pieces represent the exact same amount! Today we are discovering Equivalent Fractions. Let's slide Ezy's special Fraction Shading block to see how two quarters match perfectly with one half!",
      widgetId: 'fraction-shading',
      reviewInterval: 14
    },
    {
      id: 'm6.2',
      unitId: 'math-u6',
      title: "Adding & Subtracting Fractions",
      conceptKey: "concept-m6.2-fraction-math",
      pageNumber: 114,
      sequence: 2,
      introScript: "To add or subtract fractions, we must make sure their denominators are completely matching! If they aren't, we use our equivalent fraction gears to transform them. Let's calculate together!",
      widgetId: 'fraction-calc',
      reviewInterval: 14
    }
  ];

  for (const c of concepts) {
    await smartCreate('Concept', {
      id: c.id,
      unitId: c.unitId,
      title: c.title,
      conceptKey: c.conceptKey,
      pageNumber: c.pageNumber,
      sequence: c.sequence,
      introScript: c.introScript,
      widgetId: c.widgetId,
      reviewInterval: c.reviewInterval
    });
  }

  // 7. Seed all 5 verified system user accounts with standard credentials
  console.log('🌱 [SEED] Seeding System User Accounts...');
  const usersToSeed = [
    { email: 'reachgops@gmail.com', role: 'ADMIN', id: 'reachgops_admin' },
    { email: 'sivasakthi13425@gmail.com', role: 'TEACHER', id: 'sivasakthi_teacher' },
    { email: 'parent@studyezy.com', role: 'PARENT', id: 'parent_user' },
    { email: 'admin@studyezy.com', role: 'ADMIN', id: 'admin_user' },
    { email: 'student@studyezy.com', role: 'STUDENT', id: 'student_user' }
  ];

  // Uniform password hash representing Bcrypt of "P@ssw0rd@321" (salt rounds 12)
  const masterPasswordHash = "$2b$12$.bdb9A4nfauy4.OBpc.wZOynDT9hWgqyNtBqBLxvr0ijzRuq./XrS";

  for (const u of usersToSeed) {
    await smartUpsertUser(u, masterPasswordHash);
  }

  // 8. Seed default Student Profile for Viban relationally linked
  console.log('🌱 [SEED] Connecting Viban Gopinath\'s Student Profile...');
  await smartUpsertStudentProfile();

  console.log('🏁 [SEED] Perfect, self-healing database seeding is complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeder execution crashed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });