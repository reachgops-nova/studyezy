import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dynamic model helper to safely retrieve models regardless of casing
function getModel(client: any, modelName: string): any {
  const keys = Object.keys(client);
  const foundKey = keys.find(k => k.toLowerCase() === modelName.toLowerCase());
  return foundKey ? client[foundKey] : null;
}

async function main() {
  console.log('[SEED] Starting Self-Healing, Schema-Agnostic Database Seeding...');

  // 1. Safe clean up of old seed data
  try {
    const conceptMastery = getModel(prisma, 'ConceptMastery');
    if (conceptMastery) {
      await conceptMastery.deleteMany({});
      console.log('[CLEAN] Cleaned ConceptMastery');
    }
  } catch (e) {
    console.log('[WARNING] Skipping ConceptMastery cleanup');
  }

  try {
    const reasoningLog = getModel(prisma, 'ReasoningLog');
    if (reasoningLog) {
      await reasoningLog.deleteMany({});
      console.log('[CLEAN] Cleaned ReasoningLog');
    }
  } catch (e) {
    console.log('[WARNING] Skipping ReasoningLog cleanup');
  }

  try {
    const concept = getModel(prisma, 'Concept');
    if (concept) {
      await concept.deleteMany({});
      console.log('[CLEAN] Cleaned Concept');
    }
  } catch (e) {
    console.log('[WARNING] Skipping Concept cleanup');
  }

  try {
    const unit = getModel(prisma, 'Unit');
    if (unit) {
      await unit.deleteMany({});
      console.log('[CLEAN] Cleaned Unit');
    }
  } catch (e) {
    console.log('[WARNING] Skipping Unit cleanup');
  }

  try {
    const subject = getModel(prisma, 'Subject');
    if (subject) {
      await subject.deleteMany({});
      console.log('[CLEAN] Cleaned Subject');
    }
  } catch (e) {
    console.log('[WARNING] Skipping Subject cleanup');
  }

  try {
    const stage = getModel(prisma, 'Stage');
    if (stage) {
      await stage.deleteMany({});
      console.log('[CLEAN] Cleaned Stage');
    }
  } catch (e) {
    console.log('[WARNING] Skipping Stage cleanup');
  }

  try {
    const curriculum = getModel(prisma, 'Curriculum');
    if (curriculum) {
      await curriculum.deleteMany({});
      console.log('[CLEAN] Cleaned Curriculum');
    }
  } catch (e) {
    console.log('[WARNING] Skipping Curriculum cleanup');
  }

  // 2. Seed Curriculum
  console.log('[SEED] Seeding Curriculum...');
  const curriculumModel = getModel(prisma, 'Curriculum');
  let curriculum: any = null;
  if (curriculumModel) {
    try {
      curriculum = await curriculumModel.create({
        data: {
          id: "cambridge-primary",
          name: "Cambridge Primary",
          // Hyphen-free on purpose: /learn/[unitId] (app/learn/[unitId]/page.tsx)
          // splits the URL on "-" expecting exactly 4 parts
          // (curriculumSlug-stageNumber-subjectSlug-unitNumber, see the
          // Unit.unitKey doc comment in schema.prisma). A slug with its own
          // hyphen breaks that split for every unit under this curriculum.
          slug: "cambridge"
        }
      });
      console.log('[SUCCESS] Curriculum seeded successfully with slug!');
    } catch (err: any) {
      try {
        curriculum = await curriculumModel.create({
          data: {
            id: "cambridge-primary",
            name: "Cambridge Primary"
          }
        });
        console.log('[SUCCESS] Curriculum seeded successfully (fallback without slug)!');
      } catch (err2: any) {
        console.log('[ERROR] Curriculum seeding failed:', err2.message || err2);
      }
    }
  }

  // 3. Seed Stage
  console.log('[SEED] Seeding Stage...');
  const stageModel = getModel(prisma, 'Stage');
  let stage: any = null;
  if (stageModel) {
    try {
      stage = await stageModel.create({
        data: {
          id: "cambridge-stage5",
          number: 5,
          label: "Stage 5",
          available: true,
          curriculum: {
            connect: { id: "cambridge-primary" }
          }
        }
      });
      console.log('[SUCCESS] Stage seeded successfully with nested curriculum relation!');
    } catch (err: any) {
      try {
        stage = await stageModel.create({
          data: {
            id: "cambridge-stage5",
            number: 5,
            label: "Stage 5",
            available: true,
            curriculumId: "cambridge-primary"
          }
        });
        console.log('[SUCCESS] Stage seeded successfully (direct curriculumId fallback)!');
      } catch (err2: any) {
        try {
          // Minimal fallback
          stage = await stageModel.create({
            data: {
              id: "cambridge-stage5",
              number: 5,
              label: "Stage 5",
              available: true
            }
          });
          console.log('[SUCCESS] Stage seeded successfully (minimal structure fallback)!');
        } catch (err3: any) {
          console.log('[ERROR] Stage seeding failed:', err3.message || err3);
        }
      }
    }
  }

  // 4. Seed Subjects (English & Mathematics)
  console.log('[SEED] Seeding Subjects...');
  const subjectModel = getModel(prisma, 'Subject');
  let english: any = null;
  let math: any = null;
  if (subjectModel) {
    try {
      english = await subjectModel.create({
        data: {
          id: "english-cambridge-stage5",
          name: "Cambridge English",
          slug: "english", // hyphen-free - see the Curriculum.slug comment above
          available: true,
          stage: {
            connect: { id: "cambridge-stage5" }
          }
        }
      });
      console.log('[SUCCESS] English Subject seeded successfully with Stage connection!');
    } catch (err: any) {
      try {
        english = await subjectModel.create({
          data: {
            id: "english-cambridge-stage5",
            name: "Cambridge English",
            slug: "english",
            available: true,
            stageId: "cambridge-stage5"
          }
        });
        console.log('[SUCCESS] English Subject seeded successfully (direct stageId fallback)!');
      } catch (err2: any) {
        try {
          english = await subjectModel.create({
            data: {
              id: "english-cambridge-stage5",
              name: "Cambridge English",
              available: true
            }
          });
          console.log('[SUCCESS] English Subject seeded successfully (minimal fallback)!');
        } catch (err3: any) {
          console.log('[ERROR] English Subject seeding failed:', err3.message || err3);
        }
      }
    }

    try {
      math = await subjectModel.create({
        data: {
          id: "math-cambridge-stage5",
          name: "Cambridge Mathematics",
          slug: "math", // hyphen-free - see the Curriculum.slug comment above
          available: true,
          stage: {
            connect: { id: "cambridge-stage5" }
          }
        }
      });
      console.log('[SUCCESS] Math Subject seeded successfully with Stage connection!');
    } catch (err: any) {
      try {
        math = await subjectModel.create({
          data: {
            id: "math-cambridge-stage5",
            name: "Cambridge Mathematics",
            slug: "math",
            available: true,
            stageId: "cambridge-stage5"
          }
        });
        console.log('[SUCCESS] Math Subject seeded successfully (direct stageId fallback)!');
      } catch (err2: any) {
        try {
          math = await subjectModel.create({
            data: {
              id: "math-cambridge-stage5",
              name: "Cambridge Mathematics",
              available: true
            }
          });
          console.log('[SUCCESS] Math Subject seeded successfully (minimal fallback)!');
        } catch (err3: any) {
          console.log('[ERROR] Math Subject seeding failed:', err3.message || err3);
        }
      }
    }
  }

  // 5. Seed Units (English Units 1-9 & Math Unit 6)
  console.log('[SEED] Seeding Units...');
  const unitModel = getModel(prisma, 'Unit');
  if (unitModel) {
    // unitKey must be the composite "{curriculumSlug}-{stageNumber}-{subjectSlug}-{unitNumber}"
    // string (see the Unit.unitKey doc comment in schema.prisma and lib/content.ts's
    // unitKey() helper) - it's what /learn/[unitId] looks the row up by directly,
    // not a free-form label.
    const unitsToSeed = [
      { id: "english-u1", subjectId: "english-cambridge-stage5", title: "Unit 1: Fiction: Stories from different cultures", unitKey: "cambridge-5-english-1", number: 1 },
      { id: "english-u2", subjectId: "english-cambridge-stage5", title: "Unit 2: Non-fiction: Biography", unitKey: "cambridge-5-english-2", number: 2 },
      { id: "english-u3", subjectId: "english-cambridge-stage5", title: "Unit 3: Poetry: Narrative poems", unitKey: "cambridge-5-english-3", number: 3 },
      { id: "english-u4", subjectId: "english-cambridge-stage5", title: "Unit 4: Non-fiction: Information and explanation texts", unitKey: "cambridge-5-english-4", number: 4 },
      { id: "english-u5", subjectId: "english-cambridge-stage5", title: "Unit 5: Fiction: Stories that have been developed into a film", unitKey: "cambridge-5-english-5", number: 5 },
      { id: "english-u6", subjectId: "english-cambridge-stage5", title: "Unit 6: Fiction: Classic literature", unitKey: "cambridge-5-english-6", number: 6 },
      { id: "english-u7", subjectId: "english-cambridge-stage5", title: "Unit 7: Playscripts: A playscript, book and film of the same story", unitKey: "cambridge-5-english-7", number: 7 },
      { id: "english-u8", subjectId: "english-cambridge-stage5", title: "Unit 8: Poetry: Poems by famous poets", unitKey: "cambridge-5-english-8", number: 8 },
      { id: "english-u9", subjectId: "english-cambridge-stage5", title: "Unit 9: Non-fiction: Persuasive texts", unitKey: "cambridge-5-english-9", number: 9 },
      { id: "math-u6", subjectId: "math-cambridge-stage5", title: "Unit 6: Fractions, Decimals and Percentages", unitKey: "cambridge-5-math-6", number: 6 }
    ];

    for (const u of unitsToSeed) {
      try {
        await unitModel.create({
          data: {
            id: u.id,
            subjectId: u.subjectId,
            title: u.title,
            unitKey: u.unitKey,
            number: u.number,
            available: true
          }
        });
        console.log(`  [SUCCESS] Unit seeded successfully: ${u.id}`);
      } catch (err: any) {
        console.log(`  [ERROR] Unit seeding failed for ${u.id}:`, err.message || err);
      }
    }
  }

  // 6. Seed Concepts
  console.log('[SEED] Seeding Concepts...');
  const conceptModel = getModel(prisma, 'Concept');
  if (conceptModel) {
    // Note: introScript/reviewInterval/page for these concept ids also live in
    // the static CONCEPT_METADATA lookup in pages/api/lesson-dispatcher.ts -
    // that's the lesson-runtime copy. The Concept model itself only has
    // conceptKey/name/bookPages/orderIndex, no columns for those.
    //
    // conceptKey must equal the plain id ("1.2", "1.7", ...): that's the key
    // lib/interactiveWidgets.ts's WIDGETS_BY_CONCEPT is indexed by, and it's
    // what getUnit() (lib/content.ts) exposes to the frontend as concept_id -
    // WidgetDispatcher looks widgets up by that value, so a mismatch here
    // silently breaks every interactive widget (ClueDetective, FactOpinionScale, etc).
    const conceptsToSeed = [
      // UNIT 1: FICTION
      { id: '1.2', unitId: 'english-u1', name: 'Implicit Meaning (Jo\'s Face)', pageNumber: 5, sequence: 1 },
      { id: '1.7', unitId: 'english-u1', name: 'Fact vs. Opinion', pageNumber: 10, sequence: 2 },
      { id: '1.9', unitId: 'english-u1', name: 'Sentence Types & Connectors', pageNumber: 15, sequence: 3 },

      // UNIT 2: BIOGRAPHY
      { id: '2.1', unitId: 'english-u2', name: 'Features of a Biography', pageNumber: 26, sequence: 1 },
      { id: '2.2', unitId: 'english-u2', name: 'Chronological Timelines', pageNumber: 29, sequence: 2 },
      { id: '2.5', unitId: 'english-u2', name: 'Prefixes & Suffixes', pageNumber: 38, sequence: 3 },

      // UNIT 4: EXPLANATION TEXTS
      { id: '4.1', unitId: 'english-u4', name: 'Explanation Texts ("Our Watery World")', pageNumber: 61, sequence: 1 },

      // MATH UNIT 6: FRACTIONS
      { id: 'm6.1', unitId: 'math-u6', name: 'Equivalent Fractions', pageNumber: 112, sequence: 1 },
      { id: 'm6.2', unitId: 'math-u6', name: 'Adding & Subtracting Fractions', pageNumber: 114, sequence: 2 }
    ];

    for (const c of conceptsToSeed) {
      try {
        await conceptModel.create({
          data: {
            id: c.id,
            unitId: c.unitId,
            name: c.name,
            conceptKey: c.id,
            status: 'drafted',
            bookPages: [c.pageNumber],
            orderIndex: c.sequence
          }
        });
        console.log(`  [SUCCESS] Concept seeded successfully: ${c.id}`);
      } catch (err: any) {
        console.log(`  [ERROR] Concept seeding failed for ${c.id}:`, err.message || err);
      }
    }
  }

  // 7. Seed All 5 User Accounts
  console.log('[SEED] Restoring and Seeding the 5 DB Users...');
  const userModel = getModel(prisma, 'User');
  if (userModel) {
    const usersToSeed = [
      { email: 'reachgops@gmail.com', role: 'ADMIN', id: 'reachgops_admin' },
      { email: 'sivasakthi13425@gmail.com', role: 'TEACHER', id: 'sivasakthi_teacher' },
      { email: 'parent@studyezy.com', role: 'PARENT', id: 'parent_user' },
      { email: 'admin@studyezy.com', role: 'ADMIN', id: 'admin_user' },
      { email: 'student@studyezy.com', role: 'STUDENT', id: 'student_user' }
    ];

    const masterPasswordHash = "$2b$12$.bdb9A4nfauy4.OBpc.wZOynDT9hWgqyNtBqBLxvr0ijzRuq./XrS";

    for (const u of usersToSeed) {
      try {
        await userModel.upsert({
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
        console.log(`[SUCCESS] Seeded user (with standard passwordHash): ${u.email}`);
      } catch (err: any) {
        try {
          await userModel.upsert({
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
          console.log(`[SUCCESS] Seeded user (with password fallback): ${u.email}`);
        } catch (err2: any) {
          console.log(`[ERROR] User seeding failed for ${u.email}:`, err2.message || err2);
        }
      }
    }
  }

  // 8. Seed default Student Profile for Viban
  console.log('[SEED] Seeding default student profile...');
  const profileModel = getModel(prisma, 'StudentProfile');
  if (profileModel) {
    try {
      await profileModel.upsert({
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
      console.log('[SUCCESS] Student Profile seeded successfully (Standard relation connects)!');
    } catch (err: any) {
      try {
        await profileModel.upsert({
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
        console.log('[SUCCESS] Student Profile seeded successfully (Direct scalar key fallback)!');
      } catch (err2: any) {
        try {
          await profileModel.create({
            data: {
              id: "student_viban",
              displayName: "Viban Gopinath"
            }
          });
          console.log('[SUCCESS] Student Profile seeded successfully (Bare minimum fallback)!');
        } catch (err3: any) {
          console.log('[ERROR] Student Profile seeding failed entirely:', err3.message || err3);
        }
      }
    }

    // 9. Seed the user-requested custom Viban Gopinath demo profile
    console.log('[SEED] Seeding custom Viban demo profile...');
    await seedVibanDemoProfile();
  }

  console.log('[SEED] Seeding process complete!');
}

async function seedVibanDemoProfile() {
  const model = getModel(prisma, 'StudentProfile');
  if (!model) {
    console.log(`[SEED] StudentProfile model not found. Skipping Viban demo.`);
    return null;
  }

  const create: any = {
    id: "student_viban_demo",
    displayName: "Viban Gopinath",
    avatarEmoji: "👦",
    schoolName: "Chennai Public School",
    preferredCurriculumLabel: "Cambridge IGCSE",
    enrolledSubjectSlugs: ["english", "math"],
    userId: "parent_user",
    assignedStageId: "cambridge-stage5"
  };

  const update: any = {
    displayName: "Viban Gopinath",
    avatarEmoji: "👦",
    schoolName: "Chennai Public School",
    preferredCurriculumLabel: "Cambridge IGCSE",
  };

  try {
    const result = await model.upsert({
      where: { id: "student_viban_demo" },
      update,
      create
    });
    console.log(`  ✅ [SUCCESS] Seeded Viban Gopinath demo profile (IGCSE Grade 4/5)`);
    return result;
  } catch (err: any) {
    console.log(`  ❌ [FAILED] Could not seed Viban demo profile:`, err.message || err);
    return null;
  }
}

function printSkipWarning(table: string, err: any) {
  console.log(`[WARNING] Skipping ${table} cleanup (might not contain rows, or columns mismatched):`, err.message || err);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
