import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Self-Healing, Schema-Agnostic Database Seeding...');

  // 1. Safe clean up of old seed data (Relational cascades might handle this, but let's do it safely)
  try {
    await prisma.conceptMastery.deleteMany({});
    console.log('🧹 Cleaned ConceptMastery');
  } catch (e) {
    console.log('⚠️ Skipping ConceptMastery cleanup (might not exist yet)');
  }

  try {
    await prisma.reasoningLog.deleteMany({});
    console.log('🧹 Cleaned ReasoningLog');
  } catch (e) {
    printSkipWarning('ReasoningLog', e);
  }

  try {
    await prisma.concept.deleteMany({});
    console.log('🧹 Cleaned Concept');
  } catch (e) {
    printSkipWarning('Concept', e);
  }

  try {
    await prisma.unit.deleteMany({});
    console.log('🧹 Cleaned Unit');
  } catch (e) {
    printSkipWarning('Unit', e);
  }

  try {
    await prisma.subject.deleteMany({});
    console.log('🧹 Cleaned Subject');
  } catch (e) {
    printSkipWarning('Subject', e);
  }

  try {
    await prisma.stage.deleteMany({});
    console.log('🧹 Cleaned Stage');
  } catch (e) {
    printSkipWarning('Stage', e);
  }

  try {
    await prisma.curriculum.deleteMany({});
    console.log('🧹 Cleaned Curriculum');
  } catch (e) {
    printSkipWarning('Curriculum', e);
  }

  // 2. Seed Curriculum
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
    console.log('✅ Curriculum seeded successfully with slug!');
  } catch (err: any) {
    try {
      curriculum = await (prisma as any).curriculum.create({
        data: {
          id: "cambridge-primary",
          name: "Cambridge Primary"
        }
      });
      console.log('✅ Curriculum seeded successfully (fallback without slug)!');
    } catch (err2: any) {
      console.log('❌ Curriculum seeding failed:', err2.message || err2);
    }
  }

  // 3. Seed Stage
  console.log('🌱 Seeding Stage...');
  let stage: any = null;
  try {
    stage = await (prisma as any).stage.create({
      data: {
        id: "cambridge-stage5",
        number: 5,
        label: "Stage 5",
        curriculum: {
          connect: { id: "cambridge-primary" }
        }
      }
    });
    console.log('✅ Stage seeded successfully with nested curriculum relation!');
  } catch (err: any) {
    try {
      stage = await (prisma as any).stage.create({
        data: {
          id: "cambridge-stage5",
          number: 5,
          label: "Stage 5",
          curriculumId: "cambridge-primary"
        }
      });
      console.log('✅ Stage seeded successfully (direct curriculumId fallback)!');
    } catch (err2: any) {
      console.log('❌ Stage seeding failed:', err2.message || err2);
    }
  }

  // 4. Seed Subjects (English & Mathematics)
  console.log('🌱 Seeding Subjects...');
  let english: any = null;
  try {
    english = await (prisma as any).subject.create({
      data: {
        id: "english-cambridge-stage5",
        name: "Cambridge English",
        slug: "cambridge-english-stage5",
        grade: "Stage 5",
        available: true,
        stage: {
          connect: { id: "cambridge-stage5" }
        }
      }
    });
    console.log('✅ English Subject seeded successfully!');
  } catch (err: any) {
    try {
      english = await (prisma as any).subject.create({
        data: {
          id: "english-cambridge-stage5",
          name: "Cambridge English",
          grade: "Stage 5",
          available: true,
          stageId: "cambridge-stage5"
        }
      });
      console.log('✅ English Subject seeded successfully (without subject slug)!');
    } catch (err2: any) {
      console.log('❌ English Subject seeding failed:', err2.message || err2);
    }
  }

  let math: any = null;
  try {
    math = await (prisma as any).subject.create({
      data: {
        id: "math-cambridge-stage5",
        name: "Cambridge Mathematics",
        slug: "cambridge-mathematics-stage5",
        grade: "Stage 5",
        available: true,
        stage: {
          connect: { id: "cambridge-stage5" }
        }
      }
    });
    console.log('✅ Math Subject seeded successfully!');
  } catch (err: any) {
    try {
      math = await (prisma as any).subject.create({
        data: {
          id: "math-cambridge-stage5",
          name: "Cambridge Mathematics",
          grade: "Stage 5",
          available: true,
          stageId: "cambridge-stage5"
        }
      });
      console.log('✅ Math Subject seeded successfully (without subject slug)!');
    } catch (err2: any) {
      console.log('❌ Math Subject seeding failed:', err2.message || err2);
    }
  }

  // 5. Seed Units (English Units 1-9 & Math Unit 6)
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
    try {
      await (prisma as any).unit.create({
        data: {
          id: u.id,
          subjectId: u.subjectId,
          title: u.title,
          unitKey: u.unitKey,
          number: u.number,
          sequence: u.sequence
        }
      });
      console.log(`  ✅ Unit seeded successfully: ${u.id}`);
    } catch (err: any) {
      try {
        await (prisma as any).unit.create({
          data: {
            id: u.id,
            subjectId: u.subjectId,
            title: u.title,
            unitKey: u.unitKey,
            sequence: u.sequence
          }
        });
        console.log(`  ✅ Unit seeded successfully (without unit number): ${u.id}`);
      } catch (err2: any) {
        console.log(`  ❌ Unit seeding failed for ${u.id}:`, err2.message || err2);
      }
    }
  }

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
    }
  ];

  for (const c of conceptsToSeed) {
    try {
      await (prisma as any).concept.create({
        data: {
          id: c.id,
          unitId: c.unitId,
          title: c.title,
          pageNumber: c.pageNumber,
          sequence: c.sequence,
          introScript: c.introScript,
          widgetId: c.widgetId,
          reviewInterval: c.reviewInterval
        }
      });
      console.log(`  ✅ Concept seeded successfully: ${c.id}`);
    } catch (err: any) {
      console.log(`  ❌ Concept seeding failed for ${c.id}:`, err.message || err);
    }
  }

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
    try {
      await (prisma as any).user.upsert({
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
      });
      console.log(`✅ Seeded user (with standard passwordHash): ${u.email}`);
    } catch (err: any) {
      try {
        // Fallback in case columns are named differently (e.g., password, password_hash)
        await (prisma as any).user.upsert({
          where: { email: u.email },
          update: {
            password: masterPasswordHash,
            role: u.role
          },
          create: {
            id: u.id,
            email: u.email,
            password: masterPasswordHash,
            role: u.role
          }
        });
        console.log(`✅ Seeded user (with password fallback): ${u.email}`);
      } catch (err2: any) {
        console.log(`❌ User seeding failed for ${u.email}:`, err2.message || err2);
      }
    }
  }

  // 8. Seed default Student Profile for Viban (Nested connects fallbacks to secure relation compiles)
  console.log('🌱 Seeding default student profile...');
  try {
    await (prisma as any).studentProfile.upsert({
      where: { id: "student_viban" },
      update: {
        displayName: "Viban Gopinath"
      },
      create: {
        id: "student_viban",
        displayName: "Viban Gopinath",
        user: {
          connect: { id: "parent_user" }
        },
        assignedStage: {
          connect: { id: "cambridge-stage5" }
        }
      }
    });
    console.log('✅ Student Profile seeded successfully (Standard relation connects)!');
  } catch (err: any) {
    try {
      // Fallback in case schemas require direct foreign keys
      await (prisma as any).studentProfile.upsert({
        where: { id: "student_viban" },
        update: {
          displayName: "Viban Gopinath"
        },
        create: {
          id: "student_viban",
          displayName: "Viban Gopinath",
          userId: "parent_user",
          assignedStageId: "cambridge-stage5"
        }
      });
      console.log('✅ Student Profile seeded successfully (Direct scalar key fallback)!');
    } catch (err2: any) {
      try {
        // Ultimate bare minimum fallback
        await (prisma as any).studentProfile.create({
          data: {
            id: "student_viban",
            displayName: "Viban Gopinath"
          }
        });
        console.log('✅ Student Profile seeded successfully (Bare minimum fallback)!');
      } catch (err3: any) {
        console.log('❌ Student Profile seeding failed entirely:', err3.message || err3);
      }
    }
  }

  console.log('🌱 Seeding process complete!');
}

function printSkipWarning(table: string, err: any) {
  console.log(`⚠️ Skipping ${table} cleanup (might not contain rows, or columns mismatched):`, err.message || err);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
