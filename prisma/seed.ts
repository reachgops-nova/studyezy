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
    // Restored from three sources that survived on disk after an earlier
    // session's schema-agnostic seeder wiped the live Concept rows down to
    // bare id/name stubs (see PLATFORM_PLAN.md's "Unit 1 English ...
    // 13/13 concepts" history for what existed before):
    //   - ~/Downloads/curriculum-english-stage5.json (1.1, 1.2, 2.1, 2.2, 2.5)
    //   - prisma/content/unit1-batch2.ts (1.4-1.9, richer than the JSON copy -
    //     used in place of it, includes difficulty/tipsToRemember/story refs)
    //   - prisma/content/unit1-batch3.ts (1.10-1.13, the last four of Unit 1)
    // 1.3 (Explicit Meaning) had no recovered source anywhere - written fresh
    // here as the natural complement to 1.2 (Implicit Meaning), same
    // no-copying boundary as every other hand-authored concept in this file.
    // Only the Math unit beyond m6.1/m6.2 remains a genuine content gap.
    // illustrationKey values come from the already-intact
    // components/illustrations.tsx (untouched by the wipe - only the DB rows
    // pointing at them were lost).
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
        id: '1.3', unitId: 'english-u1', name: 'Explicit Meaning', pageNumber: [5], sequence: 3,
        difficulty: 'beginner',
        storyReferenceTitle: "Why Cockerels Crow (a fable from Malawi)",
        storyReferenceSynopsis: "The same page that introduces implicit meaning also states several facts about Cockerel and Hyena directly - a natural pairing for contrasting the two.",
        definition: "Explicit meaning is information a writer states directly and plainly in the text - you don't need to infer or guess anything, because the writer has told you outright.",
        keyPoints: [
          "Explicit meaning needs no reading between the lines - if a sentence says a character 'was angry', that's explicit; showing anger through actions instead is implicit.",
          "Writers use explicit statements when they want the reader to be certain about a fact, and implicit clues when they want the reader to work something out themselves.",
          "A single passage often mixes both - some things are told to you outright, other things you're expected to notice on your own."
        ],
        examples: [
          "\"Cockerel had a red, spiky comb on his head\" is explicit - it states a fact directly, nothing to infer.",
          "\"Hyena's paws trembled as he reached for the comb\" doesn't say 'Hyena was scared' explicitly - that's implicit, since you infer the fear from the trembling."
        ],
        tipsToRemember: [
          "Ask: did the writer just TELL me this, or did I have to figure it out myself? 'Told directly' = explicit.",
          "Explicit information is a good place to start when answering a comprehension question, since it doesn't require interpretation - check there first before making an inference."
        ],
        reasoningInterviewPrompts: ["Find one explicit fact and one implicit clue on this page - how did you decide which was which?"],
        voiceQaSamples: [
          { question: "What's the difference between explicit and implicit meaning?", answer: "Explicit meaning is stated directly by the writer - no guessing needed. Implicit meaning is hinted at through clues like actions or expressions, and you have to infer it yourself." },
          { question: "Which is easier to find, explicit or implicit meaning?", answer: "Explicit meaning is usually easier, since it's written directly in the text. Implicit meaning takes more work, because you have to notice clues and work out what they mean." }
        ],
        illustrationKey: 'explicit_meaning_direct',
        illustrationCaption: 'Stated plainly, nothing to infer'
      },
      {
        id: '1.4', unitId: 'english-u1', name: 'Predicting as a reading strategy', pageNumber: [8, 9], sequence: 4,
        difficulty: 'beginner',
        storyReferenceTitle: "Why Cockerels Crow (a fable from Malawi)",
        storyReferenceSynopsis: "Between Part 1 and Part 2, students pause to predict what Hyena might do next, based on what they already know about his character.",
        definition: "Predicting means using what you already know - from the story so far, the title, or the pictures - to make a sensible guess about what might happen next, before you read on.",
        keyPoints: [
          "A good prediction is a guess based on evidence, not a random guess - you should always be able to say why you think it.",
          "Predictions don't have to come true. Checking whether you were right (and why or why not) is what actually helps you understand the story better.",
          "Titles, illustrations, and how a character has behaved so far are all clues you can use to predict."
        ],
        examples: [
          "If a story is called The Boy Who Cried Wolf, you can predict the boy will pretend danger is coming when it isn't, because that's what the title hints at.",
          "A character has been unkind to everyone else in the story so far, so you predict that unkindness will cause a problem for them later on."
        ],
        tipsToRemember: [
          "Say your prediction as 'I think ___ will happen because ___' - the 'because' is the important part, not the guess itself.",
          "Keep reading with your prediction in mind - were you right, partly right, or completely wrong, and what actually happened instead?"
        ],
        reasoningInterviewPrompts: ["What clue from the story made you predict that? Point to something specific, not just a feeling."],
        voiceQaSamples: [
          { question: "What does it mean to predict in reading?", answer: "It means making a sensible guess about what happens next, using clues you already have - like the title, the pictures, or what's happened in the story so far. It's not a random guess, it's a guess backed by evidence." },
          { question: "Do I need to be right for it to be a good prediction?", answer: "No! A good prediction just needs a good reason behind it. Even if you're wrong, comparing your guess to what actually happened helps you understand the story better." }
        ],
        illustrationKey: 'predicting_next_page',
        illustrationCaption: 'Guessing what comes next, backed by clues'
      },
      {
        id: '1.5', unitId: 'english-u1', name: 'Perspective / point of view', pageNumber: [12, 13], sequence: 5,
        difficulty: 'intermediate',
        storyReferenceTitle: "Why Monkeys live in Trees (a fable from South Africa)",
        storyReferenceSynopsis: "A lioness asks a monkey for help and is tricked and left tied to a tree - a story that feels very different depending on whose side you're following.",
        definition: "Perspective (or point of view) is whose eyes a story is being seen through - the same events can feel completely different depending on which character's thoughts and feelings you're following.",
        keyPoints: [
          "The same event can be described very differently by two different characters, because each one only knows and feels their own side of it.",
          "Changing perspective can make you sympathise with a character you didn't like before, once you understand why they acted that way.",
          "Writers show perspective through whose thoughts and feelings we're told about, and what that character happens to notice."
        ],
        examples: [
          "A story about a lost dog might feel worrying told from the owner's perspective, but exciting told from the dog's own perspective.",
          "From one character's perspective, a story might be about being desperately hungry. From another's, the same event is about being robbed. Same event, two very different feelings."
        ],
        tipsToRemember: [
          "Ask yourself: whose thoughts and feelings am I being told about right now? That tells you whose perspective you're in.",
          "To retell a story from a different character's perspective, only include what THAT character would actually know, see, or feel - not information they don't have."
        ],
        reasoningInterviewPrompts: ["If you retold this story from the other character's perspective, what would change about how the reader feels?"],
        voiceQaSamples: [
          { question: "What's the difference between perspective and opinion?", answer: "Perspective is whose eyes and feelings the story is told through - it shapes what details you get. An opinion is what someone thinks or believes. A character's opinion often comes from their perspective, but they aren't exactly the same thing." },
          { question: "How do I write from a different character's point of view?", answer: "Only tell the reader what that character would actually see, know, and feel in that moment - not things only another character knows. Use 'I' or their name, and describe events the way it would feel to be them." }
        ],
        illustrationKey: 'perspective_two_views',
        illustrationCaption: 'Same story, different eyes'
      },
      {
        id: '1.6', unitId: 'english-u1', name: 'Proofreading checklist', pageNumber: [10], sequence: 6,
        difficulty: 'beginner',
        definition: "Proofreading means carefully checking your own writing after you've finished a draft, to fix small mistakes in punctuation, spelling, and grammar before it's a finished piece.",
        keyPoints: [
          "Proofreading is different from planning or drafting - it happens last, once your ideas are already down on the page.",
          "A good checklist covers capital letters, end punctuation, spacing, spelling, grammar, and whether it actually makes sense when read back.",
          "Reading your writing aloud (or slowly in your head) helps you catch mistakes your eyes skip over when reading fast."
        ],
        examples: [
          "'She walked to the shop.' has a capital letter, correct spacing, and a full stop - proofread and ready. 'she walked to the shop' is missing its capital letter and needs fixing.",
          "'I like pizza I also like pasta' is missing punctuation between two ideas - proofreading catches that it needs a full stop or connective: 'I like pizza. I also like pasta.'"
        ],
        tipsToRemember: [
          "Check one thing at a time - read once just for capital letters and full stops, then again just for spelling, rather than trying to catch everything at once.",
          "Ask 'does this actually make sense?' as its own separate check - a sentence can be perfectly spelled and punctuated and still not make sense."
        ],
        reasoningInterviewPrompts: ["You wrote this sentence - if you read it aloud right now, does every part of it sound like it makes sense?"],
        voiceQaSamples: [
          { question: "What's proofreading?", answer: "It's checking your writing after you've written it, to catch mistakes - missing capital letters, missing full stops, spelling errors, and sentences that don't quite make sense. It's the last step, after your ideas are already down." },
          { question: "How is proofreading different from editing my ideas?", answer: "Editing ideas is about whether your writing says what you mean - is anything missing, confusing, or in the wrong order? Proofreading is smaller and comes after - checking spelling, punctuation, and grammar in the sentences you've already decided on." }
        ],
        illustrationKey: 'proofreading_checklist',
        illustrationCaption: 'The last check before you\'re done'
      },
      {
        id: '1.7', unitId: 'english-u1', name: 'Fact vs. opinion', pageNumber: [9, 11], sequence: 7,
        difficulty: 'beginner',
        storyReferenceTitle: "Why Cockerels Crow (a fable from Malawi)",
        storyReferenceSynopsis: "Students sort statements about Cockerel and Hyena into facts (provable from the text) and opinions (personal judgements about the characters).",
        definition: "A fact is something that can be proven true or false with evidence. An opinion is what someone personally thinks, feels, or believes - and it can be different from person to person, even about the same thing.",
        keyPoints: [
          "You can check a fact (by measuring, counting, or looking it up) - you can't check an opinion the same way, because it's about feelings or personal judgement.",
          "Words like 'best', 'worst', 'should', 'beautiful', or 'boring' are usually signs of an opinion, not a fact.",
          "A single passage can mix both - 'The book has 200 pages' is a fact; 'and it's the best book ever' is an opinion."
        ],
        examples: [
          "'The rooster has red feathers on its head' is a fact - you could look and check. 'The rooster is the most impressive animal in the story' is an opinion - someone else might disagree.",
          "'It rained yesterday' is a fact that can be checked against a weather record. 'Yesterday was a terrible day' is an opinion - it depends on how the person felt about it."
        ],
        tipsToRemember: [
          "Ask: could two reasonable people disagree about this? If yes, it's probably an opinion, not a fact.",
          "Facts don't need 'I think' in front of them to be true. If a sentence would only make sense with 'I think...' added, that's a clue it's an opinion."
        ],
        reasoningInterviewPrompts: ["You said that sentence was a fact - could someone reasonably disagree with it? If not, why not?"],
        voiceQaSamples: [
          { question: "How do I tell a fact from an opinion?", answer: "Ask if it can be proven true or false - that's a fact. If it's about what someone thinks, feels, or believes, and someone else could reasonably think differently, that's an opinion." },
          { question: "Can a sentence be both a fact and an opinion?", answer: "Not the exact same part, but a sentence can contain both - like 'The story is 10 pages long (fact) and it's a bit too short (opinion).' The trick is spotting where the fact ends and the opinion starts." }
        ],
        illustrationKey: 'fact_vs_opinion_scale',
        illustrationCaption: 'Provable vs. personal'
      },
      {
        id: '1.8', unitId: 'english-u1', name: 'Idiomatic phrases', pageNumber: [17], sequence: 8,
        difficulty: 'intermediate',
        storyReferenceTitle: "The Elephant who lost his Patience (a fable from India)",
        storyReferenceSynopsis: "An ant who teases every animal in the jungle finally pushes King Elephant too far - a story that leans on idiomatic phrases like 'hold your tongue' and 'out of hand.'",
        definition: "An idiomatic phrase (or idiom) is a group of words that means something different from what the individual words literally say - you have to know the phrase as a whole to understand it.",
        keyPoints: [
          "Idioms usually can't be worked out word-by-word - 'it's raining cats and dogs' has nothing to do with actual animals falling from the sky.",
          "Idioms often describe feelings, warnings, or advice in a more colourful way than saying it plainly.",
          "Because idioms are cultural, they can confuse someone who hasn't heard that exact phrase before - even if they know every individual word in it."
        ],
        examples: [
          "'Break a leg!' doesn't mean an actual injury - it's an idiom meaning 'good luck', often said before a performance.",
          "'She let the cat out of the bag' doesn't involve a real cat - it means she accidentally revealed a secret."
        ],
        tipsToRemember: [
          "If a phrase makes no literal sense in context (no cat was ever mentioned before), that's a strong sign it's an idiom, not a literal statement.",
          "When you meet a new idiom, try to guess its meaning from how it's used in the sentence before looking it up - it trains you to spot the pattern."
        ],
        reasoningInterviewPrompts: ["If someone translated this idiom word-for-word into another language, would it make any sense? What does that tell you about idioms?"],
        voiceQaSamples: [
          { question: "What's an idiomatic phrase?", answer: "It's a group of words where the meaning of the whole phrase is different from what the individual words say. Like 'it cost an arm and a leg' - it just means something was very expensive, not an actual body part!" },
          { question: "How do I figure out what an idiom means if I've never heard it before?", answer: "Look at the sentence around it for clues about the feeling or situation, since idioms are almost never meant literally. If it still doesn't make sense, that's a good sign to ask someone or look it up." }
        ],
        illustrationKey: 'idiom_literal_vs_meaning',
        illustrationCaption: "Words that don't mean what they say"
      },
      {
        id: '1.9', unitId: 'english-u1', name: 'Sentence types: simple, compound, complex + connectives', pageNumber: [16], sequence: 9,
        difficulty: 'advanced',
        definition: "Sentences can be simple (one idea), compound (two equal ideas joined by 'and', 'but', or 'or'), or complex/multi-clause (a main idea joined to a dependent clause using a connective like 'because', 'although', or 'when').",
        keyPoints: [
          "A simple sentence has just one main clause: one subject, one main verb, one complete idea - e.g. 'The dog barked.'",
          "A compound sentence joins two simple sentences with 'and', 'but', or 'or' - both halves could stand alone as their own sentence.",
          "A complex (multi-clause) sentence joins a main clause to a dependent clause that can't stand alone, using a connective like 'because', 'although', 'when', 'while', or 'after' - and needs a comma when the dependent clause comes first."
        ],
        examples: [
          "Simple: 'The kangaroo jumped.' Compound: 'The kangaroo jumped, but it missed the branch.' Complex: 'Although it was tired, the kangaroo kept jumping.'",
          "'Because the fire had gone out, they couldn't cook dinner' is complex - the comma comes after the dependent clause ('Because the fire had gone out') since it comes first in the sentence."
        ],
        tipsToRemember: [
          "Test a compound sentence by splitting it at 'and'/'but'/'or' - if both halves make sense alone, it's compound. A complex sentence fails this test - the dependent-clause half won't make sense alone.",
          "When the dependent clause starts the sentence (starts with 'Because', 'Although', 'When'...), put a comma before the main clause. When the main clause comes first, you usually don't need one."
        ],
        reasoningInterviewPrompts: ["You wrote a long sentence - is it actually compound, complex, or just two ideas stuck together without the right punctuation?"],
        voiceQaSamples: [
          { question: "What's the difference between a compound and a complex sentence?", answer: "In a compound sentence, both halves could be their own complete sentence, joined by 'and', 'but', or 'or'. In a complex sentence, one half (the dependent clause) can't stand alone - it needs a connective like 'because' or 'although' and relies on the main clause to make full sense." },
          { question: "When do I need a comma in a complex sentence?", answer: "If the dependent clause comes first - starting with a word like 'Because', 'When', or 'Although' - put a comma right after it, before the main clause. If the main clause comes first, you usually don't need a comma." }
        ],
        illustrationKey: 'sentence_types_blocks',
        illustrationCaption: 'Building bigger sentences, one clause at a time'
      },
      {
        id: '1.10', unitId: 'english-u1', name: "Story structure (the narrative 'mountain')", pageNumber: [19], sequence: 10,
        difficulty: 'beginner',
        storyReferenceTitle: "The Elephant who lost his Patience (a fable from India)",
        storyReferenceSynopsis: "An ant who teases every animal in the jungle finally pushes King Elephant too far and gets blasted into the sky - the story's shape maps neatly onto the narrative mountain.",
        definition: "Story structure is the shape a story's events follow from beginning to end. Many stories follow a 'narrative mountain': the beginning sets the scene, then events build up, lead to a challenge, reach a problem (the most tense point), the problem gets solved, and the story reaches its ending.",
        keyPoints: [
          "The 'problem' sits at the top of the mountain - it's the most exciting or tense moment, with everything before it building up and everything after it resolving.",
          "Not every story spends equal time on each stage - a fable might rush through the beginning in a sentence but spend paragraphs on the problem.",
          "Knowing the structure helps you both understand a story you're reading (what stage are we at right now?) and plan one you're writing."
        ],
        examples: [
          "In a fable about a clever ant who tricks a lion, the build up shows the lion boasting, the challenge is the ant deciding to teach him a lesson, the problem is the trick going wrong, and the ending shows what the lion learned.",
          "If a story jumps straight from 'the beginning' to 'the ending' with no build up or problem in between, it will feel flat - readers expect that rise and fall in tension."
        ],
        tipsToRemember: [
          "Before writing your own story, sketch the six stages first (even just one phrase each) - it stops you rambling in the middle with no clear problem to solve.",
          "When retelling a story, check you can name its problem in one sentence - if you can't, you probably haven't found the actual turning point yet."
        ],
        reasoningInterviewPrompts: ["Where's the 'problem' - the most tense moment - in this story? How do you know that's the peak, and not an earlier or later moment?"],
        voiceQaSamples: [
          { question: "What is the 'narrative mountain'?", answer: "It's a way of picturing a story's shape: beginning, build up, challenge, problem, problem solved, ending. The 'problem' is the peak - the most tense or exciting part - with the story building up to it and then coming back down as it gets solved." },
          { question: "Do all stories use this structure?", answer: "Most do, especially fables and adventure stories, but not every story hits every stage in the same order or for the same length. It's a useful pattern to expect, not a strict rule every story must follow exactly." }
        ],
        illustrationKey: 'narrative_mountain',
        illustrationCaption: 'The shape a story climbs and comes down'
      },
      {
        id: '1.11', unitId: 'english-u1', name: 'Mood created through setting and word choice', pageNumber: [20], sequence: 11,
        difficulty: 'intermediate',
        storyReferenceTitle: "The Lion with the Red Eyes (a fable from Somalia)",
        storyReferenceSynopsis: "A lion cub with unusual red eyes is treated as an outsider by his village, until his differences end up saving everyone from a dragon.",
        definition: "Mood is the feeling or atmosphere a writer creates for the reader - like happiness, sadness, fear, or calm - built mainly through the physical setting a writer chooses and the specific words used to describe it.",
        keyPoints: [
          "The same event can feel completely different depending on the setting and words chosen - a dark, stormy forest creates a different mood than a sunny meadow, even for the same character doing the same thing.",
          "Word connotations matter, not just their literal meaning - 'skinny' and 'slender' can describe the same body, but 'skinny' feels negative and 'slender' feels positive.",
          "A story's theme (what it's really about, like courage or kindness) often works together with mood, but they aren't the same thing - mood is the feeling in a moment, theme is the bigger idea across the whole story."
        ],
        examples: [
          "'The old house creaked and groaned in the wind, its broken windows staring out like empty eyes' creates a scary mood through word choice, not just by saying 'it was scary.'",
          "The same walk through a forest could feel peaceful ('sunlight dappled gently through the leaves') or frightening ('shadows twisted between the trees, and every snap of a twig echoed'), purely through setting and word choice."
        ],
        tipsToRemember: [
          "Ask which specific words are doing the mood-building work in a sentence - which ones would you have to change to flip a calm scene into a tense one?",
          "When writing your own setting, pick words with the connotation you want (not just any accurate word) - 'ancient' and 'crumbling' both describe an old building, but only one sounds inviting."
        ],
        reasoningInterviewPrompts: ["Which specific words in this description are creating the mood? What happens to the mood if you swap just one of them for a plainer word?"],
        voiceQaSamples: [
          { question: "How is mood different from just describing what a place looks like?", answer: "Describing a place is just facts - 'the room was old, with a wooden floor.' Creating mood means choosing words that make the reader FEEL something about it - 'the ancient floorboards groaned underfoot, as if the house itself was tired' makes the same room feel eerie, not just old." },
          { question: "What's the difference between mood and theme?", answer: "Mood is the feeling in a specific scene or moment - like tension or calm. Theme is the bigger idea or lesson running through the whole story, like 'being different can be a strength.' A scary mood in one scene doesn't mean the story's theme is about fear." }
        ],
        illustrationKey: 'mood_setting_words',
        illustrationCaption: 'The same place, painted with different words'
      },
      {
        id: '1.12', unitId: 'english-u1', name: 'Comparative and superlative adverbs', pageNumber: [20], sequence: 12,
        difficulty: 'intermediate',
        definition: "Adverbs have three forms: positive (the plain form, e.g. 'quickly'), comparative (comparing two things, e.g. 'more quickly' or 'faster'), and superlative (comparing three or more things, e.g. 'most quickly' or 'fastest').",
        keyPoints: [
          "Most adverbs ending in -ly form the comparative and superlative with 'more'/'most' in front, rather than changing the word itself - 'more quickly', 'most quickly', not 'quicklier.'",
          "Some short adverbs add -er/-est directly instead - 'fast' becomes 'faster'/'fastest', not 'more fast.'",
          "A handful of common adverbs are irregular and just have to be learned: 'well' becomes 'better'/'best', 'badly' becomes 'worse'/'worst', 'much' becomes 'more'/'most', 'little' becomes 'less'/'least.'"
        ],
        examples: [
          "Positive: 'Zach played well in the match.' Comparative: 'Masie played better than him.' Superlative: 'Ronan played the best of everyone.'",
          "Positive: 'She ran quickly.' Comparative: 'She ran more quickly than her brother.' Superlative: 'She ran the most quickly of the whole team.'"
        ],
        tipsToRemember: [
          "Comparative compares exactly two things ('better than him'); superlative compares three or more, and almost always needs 'the' in front ('the best').",
          "If an adverb is irregular, don't try to guess a rule for it - just memorise the small set (well/badly/much/little) since there are only a few."
        ],
        reasoningInterviewPrompts: ["Is this comparing exactly two things, or three or more? How does that tell you whether it should be comparative or superlative?"],
        voiceQaSamples: [
          { question: "How do I know whether to use 'more'/'most' or add -er/-est to an adverb?", answer: "Most adverbs ending in -ly use 'more'/'most' in front, like 'more carefully.' Shorter adverbs that don't end in -ly, like 'fast' or 'hard', usually just add -er/-est instead, like 'faster'/'fastest.'" },
          { question: "What are the irregular comparative and superlative adverbs?", answer: "The most common ones are: well -> better -> best, badly -> worse -> worst, much -> more -> most, and little -> less -> least. These don't follow the usual -er/-est or more/most pattern, so they just need to be remembered." }
        ],
        illustrationKey: 'adverb_ladder',
        illustrationCaption: 'Climbing from good, to better, to best'
      },
      {
        id: '1.13', unitId: 'english-u1', name: 'Full writing checklist (mood, punctuation, apostrophes, direct speech)', pageNumber: [25], sequence: 13,
        difficulty: 'advanced',
        storyReferenceTitle: "The Broath with the Rocks (a fable from Scotland)",
        storyReferenceSynopsis: "A hungry traveller tricks a suspicious old man into cooking a real meal by pretending a plain rock can make delicious broth - the two end up sharing the meal as friends.",
        definition: "A full writing checklist brings together everything you check before calling a piece of writing finished: does it use adjectives/adverbs/adverbial phrases well, does it make sense, is there a clear setting and mood, and is the punctuation (commas, full stops, apostrophes, direct speech) all correct.",
        keyPoints: [
          "This checklist combines earlier, smaller skills (proofreading, mood, sentence types) into one final pass, rather than teaching anything brand new - it's the 'put it all together' step.",
          "Content checks (does it make sense? is there a clear mood and setting?) and punctuation checks (commas, full stops, apostrophes, direct speech) are different kinds of check - a piece can be perfectly punctuated and still not make sense, or vice versa.",
          "Apostrophes and direct speech punctuation are easy to get wrong even in otherwise strong writing, which is why they get their own specific checklist items instead of being lumped into 'grammar.'"
        ],
        examples: [
          "'The travellers coat was soaked' is missing an apostrophe (should be 'traveller's') - a small error a full read-through checklist would catch even if the sentence otherwise makes perfect sense.",
          "'Where did you get that from he asked' is missing direct speech punctuation - it should read: \"Where did you get that from?\" he asked."
        ],
        tipsToRemember: [
          "Work through a checklist like this in passes, not all at once - one read for mood/setting/sense, a separate read just for commas and full stops, a separate read just for apostrophes and speech marks.",
          "Apostrophes have exactly two jobs - showing possession ('the traveller's rock') or showing a missing letter in a contraction ('hadn't') - if it's doing neither, it probably doesn't belong there."
        ],
        reasoningInterviewPrompts: ["Go through your writing checking only apostrophes this time, ignoring everything else - did you find anything a first read-through missed?"],
        voiceQaSamples: [
          { question: "Why do I need a whole checklist just to finish a piece of writing?", answer: "Because there are several different things to check, and trying to catch all of them in one read is hard - a checklist makes sure you don't forget one (like apostrophes) just because you were focused on another (like whether the story makes sense)." },
          { question: "What are the two jobs an apostrophe can do?", answer: "Showing something belongs to someone or something, like 'the traveller's rock', or showing a letter's been left out in a contraction, like 'hadn't' instead of 'had not.' If it's not doing one of those two jobs, it probably shouldn't be there." }
        ],
        illustrationKey: 'writing_checklist_final',
        illustrationCaption: 'Bringing every skill together, one pass at a time'
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
            tipsToRemember: (c as any).tipsToRemember ?? [],
            reasoningInterviewPrompts: (c as any).reasoningInterviewPrompts ?? [],
            voiceQaSamples: (c as any).voiceQaSamples,
            illustrationKey: (c as any).illustrationKey,
            illustrationCaption: (c as any).illustrationCaption,
            difficulty: (c as any).difficulty,
            storyReferenceTitle: (c as any).storyReferenceTitle,
            storyReferenceSynopsis: (c as any).storyReferenceSynopsis
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
