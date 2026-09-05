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
    // Restored from ~/Downloads/curriculum-english-stage5.json (the real
    // hand-authored content export - see PLATFORM_PLAN.md's "Unit 1 English
    // ... 13/13 concepts" history) after an earlier session's schema-agnostic
    // seeder wiped the live rows down to bare id/name stubs. Only the 9
    // concepts that JSON actually covers get full content here; the
    // remaining Unit 1 concepts (1.3, 1.5, 1.6, 1.10-1.13) and the Math unit
    // have no recovered source text, so they stay as name-only stubs below
    // rather than inventing content. illustrationKey values come from the
    // already-intact components/illustrations.tsx (untouched by the wipe -
    // only the DB rows pointing at them were lost).
    //
    // conceptKey must equal the plain id ("1.2", "1.7", ...): that's the key
    // lib/interactiveWidgets.ts's WIDGETS_BY_CONCEPT is indexed by, and it's
    // what getUnit() (lib/content.ts) exposes to the frontend as concept_id -
    // WidgetDispatcher looks widgets up by that value, so a mismatch here
    // silently breaks every interactive widget (ClueDetective, FactOpinionScale, etc).
    const conceptsToSeed = [
      // UNIT 1: FICTION
      {
        id: '1.1', unitId: 'english-u1', name: 'Features of a Fable', pageNumber: [5, 6], sequence: 1,
        definition: "A fable is a short, fictional story that teaches a moral lesson (a rule about right and wrong) on how to treat others. In fables, characters are often animals who behave and speak like humans.",
        keyPoints: [
          "Fables are usually brief and get straight to the point.",
          "Characters are often animals with distinct human attributes or traits (e.g., greedy, hard-working, selfish).",
          "The setting can be anywhere in the world.",
          "There is almost always a clear moral or lesson at the very end of the story."
        ],
        examples: ["In the Malawian fable 'Why Cockerels Crow', Cockerel has a red spiky comb that looks like flames. Hyena believes it is real fire. This sets up a humorous conflict about deception and trust. Moral: Do not take advantage of a friend's helpfulness, and do not let greed blind you to the truth."],
        reasoningInterviewPrompts: ["If Cockerel is so helpful, why do you think Hyena got so scared of him at the end?"],
        voiceQaSamples: [
          { question: "What is a moral in a fable?", answer: "A moral is a lesson or a rule of life taught by the story. For example, it might teach us that honesty is important, or that greed leads to trouble." },
          { question: "Why are animals used as characters in fables?", answer: "Animals are used because they represent simple human qualities—like being sneaky, wise, or hard-working—making the lesson easy and fun for children to understand." }
        ],
        illustrationKey: 'cockerel_hyena_fable'
      },
      {
        id: '1.2', unitId: 'english-u1', name: 'Implicit Meaning (Jo\'s Face)', pageNumber: [5], sequence: 2,
        definition: "Implicit meaning is a 'hidden meaning' in a text. Writers do not always tell readers directly what a character is like or what is happening. Instead, they show us clues, and we must 'read between the lines' like a detective to figure out the truth.",
        keyPoints: [
          "Explicit meaning is stated directly in the text (e.g., 'Jo was mischievous').",
          "Implicit meaning is shown through actions, facial expressions, and speech (e.g., 'Jo winked and grinned as she placed the gum on the chair').",
          "We use our background knowledge + text clues to make inferences."
        ],
        examples: ["\"Jo winked at Charlie and grinned as she placed the chewing gum on the teacher's chair.\" Explicit clue: winked and grinned. Implicit meaning: Jo is playing a cheeky, mischievous joke on the teacher, and Charlie is in on the secret."],
        reasoningInterviewPrompts: ["How does winking show us someone has a secret?"],
        voiceQaSamples: [
          { question: "What is the difference between explicit and implicit?", answer: "Explicit is when the book tells you directly, like: 'It was a cold day.' Implicit is when the book gives clues, like: 'The children shivered and wrapped their woolen coats tightly around themselves.' Both tell you it's cold, but one makes you find the clue!" }
        ],
        illustrationKey: 'implicit_meaning_clue'
      },
      {
        id: '1.4', unitId: 'english-u1', name: 'Predicting', pageNumber: [8], sequence: 4,
        definition: "Predicting is a reading strategy where you guess what might happen next in a story based on clues the writer has already given you, combined with what you already know about how stories work.",
        keyPoints: [
          "Good predictions are not wild guesses—they are backed by evidence from the text.",
          "Look at a character's traits to predict how they will behave.",
          "Use the sentence frames: 'I predict that... because...' or 'Since... happened, I think...'"
        ],
        examples: ["\"Hyena's fire went out, and he was terrified that Cockerel's spiky comb would burn him. He crept into Cockerel's house carrying a stick...\" Prediction: Since Hyena is scared of the fire and carrying a stick, I predict he will try to poke the comb from a safe distance to see if it is hot."],
        reasoningInterviewPrompts: ["Why is a prediction better when you can explain 'why' with evidence?"],
        voiceQaSamples: [
          { question: "How do I make a good prediction?", answer: "Stop and ask yourself: What has this character done before? What are they trying to achieve? Combining those clues will lead to a very logical prediction!" }
        ],
        illustrationKey: 'predicting_next_page'
      },
      {
        id: '1.7', unitId: 'english-u1', name: 'Fact vs. Opinion', pageNumber: [9, 10], sequence: 7,
        definition: "A fact is something that can be tested and proven to be true with evidence (e.g., 'The sun rises in the east'). An opinion is a belief, feeling, or thought that cannot be proven, as different people may feel differently (e.g., 'Math is the most fun subject').",
        keyPoints: [
          "Facts are objective and stay the same for everyone.",
          "Opinions are subjective and can change from person to person.",
          "Words like 'best', 'wonderful', 'bad', or 'should' often signal opinions."
        ],
        examples: [
          "\"Cockerel did all of Cockerel's chores for him.\" — Fact: this can be verified directly by observing the actions in the fable.",
          "\"Hyena is kinder than Cockerel.\" — Opinion: people have different ideas of what makes a character 'kind'."
        ],
        reasoningInterviewPrompts: ["If I say 'This book has 25 pages,' is that a fact or opinion?"],
        voiceQaSamples: [
          { question: "Can an opinion become a fact?", answer: "No. Even if millions of people agree on an opinion (like 'Ice cream is delicious'), it remains an opinion because it's still based on personal taste, not a scientific test." }
        ],
        illustrationKey: 'fact_vs_opinion_scale'
      },
      {
        id: '1.8', unitId: 'english-u1', name: 'Idiomatic Phrases', pageNumber: [17, 18], sequence: 8,
        definition: "An idiom (or idiomatic phrase) is an expression where the words together have a special, figurative meaning that is completely different from the literal, word-for-word meaning.",
        keyPoints: [
          "Literal means exactly what the words say.",
          "Figurative means the words paint a picture of a different idea.",
          "Idioms are culture-specific and have to be learned as whole phrases."
        ],
        examples: [
          "A heart of gold — literally a heart made of metal; idiomatically means being extremely kind, generous, and caring.",
          "Give the cold shoulder — literally pressing a cold shoulder against someone; idiomatically means to ignore someone or act unfriendly toward them.",
          "In hot water — literally sitting in boiling water; idiomatically means being in serious trouble for doing something wrong.",
          "Hit the sack — literally punching a bag; idiomatically means to go to bed because you are tired."
        ],
        reasoningInterviewPrompts: ["If Ezy says 'This test is a piece of cake,' does he want you to eat it?"],
        voiceQaSamples: [
          { question: "Why do people use idioms if they are confusing?", answer: "People use them because they add color and humor to our speech. They are like verbal shortcuts that paint a strong mental picture!" }
        ],
        illustrationKey: 'idiom_literal_vs_meaning'
      },
      {
        id: '1.9', unitId: 'english-u1', name: 'Sentence Types & Connectors', pageNumber: [14, 15], sequence: 9,
        definition: "Sentences come in different structures to make writing interesting. We can build Simple, Compound, and Complex sentences using words called connectives (or conjunctions) to join our ideas together.",
        keyPoints: [
          "Simple Sentence: has only one independent clause expressing a single complete thought (e.g., 'The magpies sang their song.').",
          "Compound Sentence: joins two independent clauses of equal weight using connectives like 'and', 'but', 'so', 'or' (e.g., 'The magpies loved the warmth, but the wombats missed their burrows.').",
          "Complex Sentence: joins a main clause with a dependent clause using connectives like 'because', 'although', 'when', 'since'."
        ],
        examples: [
          "Simple: \"The train sped down the hill.\"",
          "Compound: \"The train sped down the hill, and it went out of control.\"",
          "Complex: \"When the brakes failed, the train sped out of control down the hill.\""
        ],
        reasoningInterviewPrompts: ["What makes 'Because the magpies had never hopped' a dependent clause?"],
        voiceQaSamples: [
          { question: "Why do we need complex sentences?", answer: "If we only write simple sentences, our writing sounds choppy and babyish. Complex sentences help show how actions depend on each other, like cause and effect!" }
        ],
        illustrationKey: 'sentence_types_blocks'
      },

      // UNIT 2: BIOGRAPHY (no recovered illustration for this unit)
      {
        id: '2.1', unitId: 'english-u2', name: 'Features of a Biography', pageNumber: [26], sequence: 1,
        definition: "A biography is a true, non-fiction record of the real events in a person's life, written from the viewpoint of an author (someone else, not the person themselves).",
        keyPoints: [
          "Written in the third person (using pronouns like: he, she, they, him, her).",
          "Starts with an opening statement explaining who the person is and why they are famous.",
          "Describes life events in chronological order.",
          "Contains exact dates, places, and factual achievements.",
          "Includes quotes (direct speech) from the person or people who knew them."
        ],
        examples: ["Poorna Malavath — youngest girl to climb Mount Everest. \"Poorna Malavath was born on 10 June 2000 in a village in Telangana, India. Her family was very poor... but she grew up to climb to the peak of Mount Everest, the highest mountain in the world, on 25 May 2014 aged 13 years and 11 months.\""],
        reasoningInterviewPrompts: ["Why is it important for a biography to have dates and places?"],
        voiceQaSamples: [
          { question: "What is the difference between an autobiography and a biography?", answer: "An AUTObiography is written by the person themselves (using 'I' and 'me'), while a biography is written by someone else (using 'he', 'she', and 'they')." }
        ]
      },
      {
        id: '2.2', unitId: 'english-u2', name: 'Chronological Timelines', pageNumber: [29, 30], sequence: 2,
        definition: "Chronological order means arranging events in the exact sequence they happened in time, from first to last. We use time connectives and adverbial phrases of time to guide the reader smoothly through this sequence.",
        keyPoints: [
          "Adverbs of time tell us WHEN something happened (e.g., first, now, soon, afterwards, eventually, finally).",
          "Adverbial phrases of time tell us how long or in what period (e.g., in the end, throughout her childhood, later on).",
          "When starting a sentence with an adverbial phrase of time, add a comma after it."
        ],
        examples: ["Usain Bolt's Career — First, Bolt won races locally in Jamaica. Afterwards, he suffered a number of injuries, but he recovered and won again. Eventually, he became the fastest man on Earth at the Olympic Games."],
        reasoningInterviewPrompts: ["If a sentence starts with 'Later on...' why do we need a comma?"],
        voiceQaSamples: [
          { question: "How do time adverbs help my writing?", answer: "Without them, your biography reads like a disjointed list of sentences. Adverbs like 'Eventually' or 'Afterwards' create beautiful bridges between paragraphs so the story flows like a river!" }
        ]
      },
      {
        id: '2.5', unitId: 'english-u2', name: 'Prefixes & Suffixes', pageNumber: [38, 39], sequence: 5,
        definition: "Prefixes are letters added to the BEGINNING of a root word to change its meaning (often making it the opposite). Suffixes are letters added to the END of a word to change its grammatical form.",
        keyPoints: [
          "The prefix 'dis-' turns agree to disagree.",
          "Negative prefixes: before roots beginning with 'l', use 'il-' (illegal); before 'm'/'p', use 'im-' (impossible, immature); before 'r', use 'ir-' (irresponsible).",
          "Suffix Rule 1: double the final letter when adding a suffix to 1-syllable verbs ending in a vowel+consonant (e.g., swim -> swimming).",
          "Suffix Rule 2: double the final letter in multi-syllable verbs ONLY if the final syllable is emphasized (e.g., prefer -> preferred, but enter -> entered)."
        ],
        examples: [
          "patient + im- → impatient (not patient)",
          "regular + ir- → irregular (not regular)",
          "hope + -ful + -ness → hopefulness (the state of being full of hope)"
        ],
        reasoningInterviewPrompts: ["Why is it 'entered' with one 'r' but 'preferred' with two 'r's?"],
        voiceQaSamples: [
          { question: "Why does spelling change when adding suffixes?", answer: "English spelling rules are designed to preserve the sound of vowels. For example, if we didn't double the 'p' in 'stopping', it would be pronounced 'stoping' with a long 'o' sound like 'stone'!" }
        ]
      },

      // UNIT 4: EXPLANATION TEXTS (no recovered rich content - name-only stub)
      { id: '4.1', unitId: 'english-u4', name: 'Explanation Texts ("Our Watery World")', pageNumber: [61], sequence: 1 },

      // MATH UNIT 6: FRACTIONS (no recovered rich content - name-only stubs)
      { id: 'm6.1', unitId: 'math-u6', name: 'Equivalent Fractions', pageNumber: [112], sequence: 1 },
      { id: 'm6.2', unitId: 'math-u6', name: 'Adding & Subtracting Fractions', pageNumber: [114], sequence: 2 }
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
            bookPages: c.pageNumber,
            orderIndex: c.sequence,
            definition: (c as any).definition,
            keyPoints: (c as any).keyPoints ?? [],
            examples: (c as any).examples ?? [],
            reasoningInterviewPrompts: (c as any).reasoningInterviewPrompts ?? [],
            voiceQaSamples: (c as any).voiceQaSamples,
            illustrationKey: (c as any).illustrationKey
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
