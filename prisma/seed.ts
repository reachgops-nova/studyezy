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
        id: '2.3', unitId: 'english-u2', name: 'Register (formal vs. informal language)', pageNumber: [31], sequence: 3,
        difficulty: 'intermediate',
        definition: "Register is the tone and level of formality a writer or speaker chooses, depending on who they're communicating with and why - the same message can be written formally or informally.",
        keyPoints: [
          "Formal register avoids contractions and slang, using fuller vocabulary and complete sentences - used for official writing, or addressing someone you don't know well.",
          "Informal register uses contractions, casual phrasing, and everyday words - used for messages to friends, diary entries, or casual conversation.",
          "The right register depends on audience and purpose, not on which one is more 'correct' - both are correct for their own situation."
        ],
        examples: [
          "Formal: 'I would be grateful if you could provide further information.' Informal: 'Can you tell me more about it?'",
          "A biography written for a school reference book stays formal throughout; a personal diary entry about the same person might slip into informal register."
        ],
        tipsToRemember: [
          "Check for contractions ('don't', 'it's') and slang - their presence is the biggest giveaway that a piece is informal.",
          "Before writing, ask: who is going to read this, and how well do I know them? That answers what register to use."
        ],
        reasoningInterviewPrompts: ["If you rewrote this formal sentence informally, what specifically would change - the words, the sentence length, or both?"],
        voiceQaSamples: [
          { question: "What's the difference between formal and informal register?", answer: "Formal register uses fuller, more careful language without contractions or slang, like writing to someone important. Informal register is casual and conversational, with contractions and everyday words, like texting a friend." },
          { question: "How do I know which register to use?", answer: "Think about your audience and purpose. Writing for someone you don't know, or for an official purpose, calls for formal register. Writing to a friend or family calls for informal register." }
        ]
      },
      {
        id: '2.4', unitId: 'english-u2', name: 'Varying vocabulary with synonyms', pageNumber: [32], sequence: 4,
        difficulty: 'beginner',
        definition: "Writing becomes more interesting and precise when you replace overused words with synonyms - words with very similar meanings - found using a thesaurus.",
        keyPoints: [
          "A thesaurus lists synonyms for nouns, verbs, adjectives, and adverbs, so the same idea can be expressed several different ways.",
          "Repeating the same verb or adjective throughout a piece makes writing feel flat - swapping in synonyms adds variety and precision.",
          "Not every synonym fits every context exactly the same way - part of the skill is picking the one that best matches the tone you want."
        ],
        examples: [
          "'Win' can become 'triumph', 'succeed', or 'come out on top', depending on how dramatic the sentence should sound.",
          "'Andre had the strength to hit the ball and beat his opponent' becomes more vivid as 'Andre had the power to blast the ball and annihilate his adversary.'"
        ],
        tipsToRemember: [
          "Circle any word you've used three or more times on a page - that's your shortlist for synonym replacement.",
          "Always read the replaced sentence back - a synonym that's technically correct can still sound wrong if it doesn't match the rest of the tone."
        ],
        reasoningInterviewPrompts: ["Why might 'annihilate' be the wrong synonym for 'beat' in a gentle, friendly story, even though it means something similar?"],
        voiceQaSamples: [
          { question: "What is a synonym?", answer: "A synonym is a word with a very similar meaning to another word - like 'happy' and 'joyful'. A thesaurus is the tool writers use to find them." },
          { question: "Why not just use the same word every time if it's correct?", answer: "Because repeating the same word again and again makes writing feel dull and repetitive. Synonyms keep the writing lively and can add more precise shades of meaning." }
        ]
      },
      {
        id: '2.5', unitId: 'english-u2', name: 'Facts and opinions in biography writing', pageNumber: [35], sequence: 5,
        difficulty: 'intermediate',
        definition: "Biography writers sometimes phrase opinions in a confident, fact-like tone, using strong descriptive words - being able to spot these disguised opinions is important so you don't mistake them for proven facts.",
        keyPoints: [
          "Words like 'prodigy', 'sensation', or 'the greatest' are opinion signals, even when written in a confident, fact-sounding way.",
          "Biographies mix real, checkable facts (dates, places, achievements) with the writer's admiring opinions about the person - both appear side by side.",
          "Turning a sentence into a question ('is that provable?') is a quick way to test whether it's really a fact or an opinion in disguise."
        ],
        examples: [
          "'She became a sensation overnight' sounds fact-like but is an opinion - 'sensation' is a judgement, not something you can measure exactly.",
          "'She performed at 17 national concerts in one year' is a fact - it can be checked against a real record."
        ],
        tipsToRemember: [
          "Watch for superlatives and glowing descriptions ('prodigy', 'the best', 'a sensation') in biographies - they're almost always opinions dressed up as facts.",
          "If you can't verify a claim by checking a record, date, or count, it's probably an opinion, however confidently it's written."
        ],
        reasoningInterviewPrompts: ["Find a sentence in this biography that sounds impressive - is it something you could actually check and prove, or is it really someone's opinion?"],
        voiceQaSamples: [
          { question: "Why do biographies use so many opinions if they're supposed to be true stories?", answer: "Because a biography isn't just a list of facts - it also shows how impressive or admirable the person's achievements were, which naturally includes the writer's opinion, even in confident-sounding language." },
          { question: "How do I tell a disguised opinion from a real fact in a biography?", answer: "Ask if you could actually check it - a date, a place, or a number can be verified. Words like 'amazing' or 'a sensation' can't be checked the same way, even if they sound certain." }
        ]
      },
      {
        id: '2.6', unitId: 'english-u2', name: 'Prefixes & Suffixes', pageNumber: [37, 38, 39], sequence: 6,
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

      // UNIT 3: POETRY (Narrative poems) - representative pass, grounded directly
      // against the real textbook pages (extracted from the source PDF this
      // session), no illustrations yet.
      {
        id: '3.1', unitId: 'english-u3', name: 'Features of a narrative poem', pageNumber: [41], sequence: 1,
        difficulty: 'beginner',
        definition: "A narrative poem is a poem that tells a story. Like other stories, it can include characters, a plot, dialogue, and descriptions of settings - but it's written in poetic form, and may or may not rhyme.",
        keyPoints: [
          "Narrative poems always tell a story - that's what separates them from poems that are just about a feeling or an image.",
          "Rhyme is optional in a narrative poem - the storytelling elements (characters, plot) are what define it, not the sound pattern.",
          "A syllable is a vowel sound inside a word, and counting syllables per line is often used to analyse a poem's rhythm."
        ],
        examples: [
          "A narrative poem about a school trip might include a character (the narrator), a plot (getting ready, going on the trip), dialogue, and a setting.",
          "'Bat' has 1 syllable; 'mysterious' has 4 - counting syllables like this helps compare the rhythm of different lines in a poem."
        ],
        tipsToRemember: [
          "Before analysing a narrative poem's features, first check: does it actually tell a story with events happening in order?",
          "Clap out a line's syllables if you're unsure how many it has - a quick, reliable way to check rather than guessing."
        ],
        reasoningInterviewPrompts: ["What makes this poem 'narrative' rather than just descriptive - can you point to the actual story events?"],
        voiceQaSamples: [
          { question: "What makes a poem 'narrative'?", answer: "It tells a story - with characters and a plot, just like a prose story, but written in poetic lines. It might rhyme, or it might not; what matters is that it narrates events." },
          { question: "Do narrative poems have to rhyme?", answer: "No! Some narrative poems rhyme and some don't. What makes a poem narrative is that it tells a story with characters and events, not whether the lines rhyme." }
        ]
      },
      {
        id: '3.2', unitId: 'english-u3', name: 'Inferring character in poetry', pageNumber: [44], sequence: 2,
        difficulty: 'intermediate',
        definition: "Just like in stories, poems reveal what characters are like through what they say, what they do, and what other characters think or say about them - readers must infer these traits rather than being told directly.",
        keyPoints: [
          "The same three clues used in fiction (speech, actions, others' opinions) apply to poetry - a poem rarely just states 'Neil was nervous.'",
          "A single poem can give clues about several characters at once, including the narrator, who may share their own feelings without a direct statement.",
          "Piecing together character clues from a poem is like solving a puzzle - no single clue tells the whole picture."
        ],
        examples: [
          "If a poem's narrator describes fumbling with buttons and taking too long to get ready, readers infer nervousness, without the poem stating it directly.",
          "If another character is described as calling out warmly and packing an extra treat, readers infer that character is caring."
        ],
        tipsToRemember: [
          "List everything a character says, does, and what others say about them separately first - then combine the lists into one overall impression.",
          "Watch for the narrator's own feelings too - narrators reveal character through tone and word choice, not just named characters."
        ],
        reasoningInterviewPrompts: ["Which specific line gave you that impression of the character? Was it something they said, did, or something someone else said about them?"],
        voiceQaSamples: [
          { question: "How do I find out about a character in a poem if the poet never describes them directly?", answer: "Look at what the character says, what they do, and what other characters think or say about them. Combining those three clues builds a picture of what they're like." },
          { question: "Can the narrator of a poem be a character too?", answer: "Yes! The narrator's own words, tone, and feelings reveal what kind of character they are, even though they're the one telling the poem." }
        ]
      },
      {
        id: '3.3', unitId: 'english-u3', name: 'Punctuating dialogue in poems', pageNumber: [47], sequence: 3,
        difficulty: 'intermediate',
        definition: "Direct speech in a poem is punctuated the same way as in prose: speech marks around the exact words spoken, and a comma separating the reporting clause (who said it) from the words spoken - whether the reporting clause comes before or after.",
        keyPoints: [
          "The reporting clause ('she said', 'the teacher asked') can come before or after the speech itself, but a comma always separates it from the spoken words.",
          "Speech marks go directly around the exact words a character speaks - nothing outside them should be included inside the marks.",
          "Varying where you place the reporting clause keeps dialogue-heavy writing from feeling repetitive."
        ],
        examples: [
          "'I love to read,' the teacher said. (comma before closing speech mark, reporting clause after)",
          "The teacher said, 'I love to read.' (comma after reporting clause, reporting clause before)"
        ],
        tipsToRemember: [
          "Read the sentence aloud - if it doesn't naturally pause where you've placed the comma, you've probably put it in the wrong spot.",
          "Check that speech marks close immediately after the actual spoken words end, not after the reporting clause that follows."
        ],
        reasoningInterviewPrompts: ["Why does the comma go inside the speech marks in 'I love to read,' but outside them when the reporting clause comes first?"],
        voiceQaSamples: [
          { question: "Where does the comma go when I'm writing dialogue?", answer: "It goes right before the closing speech mark if the reporting clause comes after ('I'm ready,' she said), or right after the reporting clause if it comes before (She said, 'I'm ready.')." },
          { question: "Can I move the reporting clause into the middle of a sentence someone is speaking?", answer: "Yes - just make sure commas surround the reporting clause on both sides: 'I'm ready,' she said, 'to go now.'" }
        ]
      },
      {
        id: '3.4', unitId: 'english-u3', name: 'Metaphors', pageNumber: [50], sequence: 4,
        difficulty: 'intermediate',
        definition: "A metaphor is a way of comparing two things by saying one thing IS another, without using 'like' or 'as' - unlike a simile, which makes the comparison directly using those words.",
        keyPoints: [
          "A simile compares using 'like' or 'as' ('the sky is shining like a star'); a metaphor drops those words and states the comparison directly ('the sky is a shining star').",
          "Metaphors work because the two things share some quality, even though they're literally different things.",
          "Metaphors appear in all kinds of poems, not just narrative ones, and can describe people, objects, feelings, or settings."
        ],
        examples: [
          "'He is a giant' - the person isn't literally a giant, but the metaphor suggests great size or an imposing presence.",
          "'Her heart is a stone' - suggests coldness or a lack of feeling, more directly than a simile would."
        ],
        tipsToRemember: [
          "Test whether a comparison is a metaphor or simile by checking for 'like' or 'as' - if those words are missing but a comparison is still being made, it's a metaphor.",
          "Ask what quality the two things share - that's the actual meaning the metaphor is trying to communicate, not the literal image."
        ],
        reasoningInterviewPrompts: ["What specific quality does this metaphor suggest the two things share? Would a simile with 'like' or 'as' feel weaker or stronger here?"],
        voiceQaSamples: [
          { question: "What's the difference between a metaphor and a simile?", answer: "A simile compares two things using 'like' or 'as' - 'brave as a lion.' A metaphor drops those words and says one thing simply IS the other - 'he is a lion.' Metaphors often feel more direct and powerful." },
          { question: "Why do poets use metaphors instead of just saying what they mean?", answer: "Metaphors let a poet suggest a feeling or quality vividly and briefly, letting the reader picture it, rather than plainly stating a fact." }
        ]
      },
      {
        id: '3.5', unitId: 'english-u3', name: 'Personification', pageNumber: [53], sequence: 5,
        difficulty: 'advanced',
        definition: "Personification is a special type of metaphor where a writer describes something that isn't human or alive as if it were a person, giving it human actions, feelings, or qualities.",
        keyPoints: [
          "Personification is specifically about giving HUMAN qualities to non-human things - weather, objects, animals, or ideas.",
          "It's a type of metaphor, since it makes an implied comparison without using 'like' or 'as'.",
          "Personification helps create mood and atmosphere by making non-human things feel alive and relatable."
        ],
        examples: [
          "'Sunshine tiptoed through my window' gives sunshine the human action of tiptoeing.",
          "'The wind howled angrily all night' gives the wind a human emotion (anger) and a human-like sound."
        ],
        tipsToRemember: [
          "Ask: is a non-human thing doing something only a person or animal could really do? If yes, that's personification.",
          "When writing your own personification, pick a human action or feeling that matches the mood you want - a 'gentle breeze that whispered' feels calm; a 'wind that screamed' feels frightening."
        ],
        reasoningInterviewPrompts: ["What human quality is being given to this non-human thing, and how does it change the mood of the poem compared to a plain, literal description?"],
        voiceQaSamples: [
          { question: "How is personification different from a regular metaphor?", answer: "Personification is a specific kind of metaphor where the comparison always gives human qualities or actions to something non-human. A regular metaphor can compare any two things." },
          { question: "Why do writers use personification instead of just describing something normally?", answer: "It makes non-human things feel alive and creates a stronger mood or atmosphere - 'the old house groaned' feels much more eerie than 'the old house creaked.'" }
        ]
      },

      // UNIT 4: INFORMATION AND EXPLANATION TEXTS - representative pass,
      // grounded directly against the real textbook pages, no illustrations yet.
      {
        id: '4.1', unitId: 'english-u4', name: 'What is an information text?', pageNumber: [60], sequence: 1,
        difficulty: 'beginner',
        definition: "An information text is a piece of non-fiction writing about a topic - it can be read in any order, not just from beginning to end, which is why information texts are sometimes called non-chronological reports.",
        keyPoints: [
          "Information texts share features with other non-fiction: a title and introduction, sub-headings and sections, paragraphs, facts, diagrams with labels, bullet points, and topic-specific technical vocabulary.",
          "Because an information text isn't telling a story in order, a reader can jump straight to the section they need instead of reading start to finish.",
          "Comparative and superlative adjectives (taller, the tallest) often appear when an information text compares facts about a topic."
        ],
        examples: [
          "An information text about volcanoes might use technical vocabulary like 'lava', 'magma', and 'ash cloud', organized under sub-headings like 'How volcanoes form.'",
          "A reader wanting to know only about ocean depth can skip straight to that sub-heading, instead of reading the whole text from the start."
        ],
        tipsToRemember: [
          "Skim an information text first for a general impression, then scan it to find specific facts you actually need - two different reading speeds for two different jobs.",
          "If a text uses topic-specific technical vocabulary and can be read out of order, that's a strong sign it's an information text."
        ],
        reasoningInterviewPrompts: ["Why can an information text be read in any order, when a story usually can't?"],
        voiceQaSamples: [
          { question: "What is an information text?", answer: "It's a piece of non-fiction writing about a topic, like volcanoes or the Ancient Egyptians. Because it's organized into sections rather than a single story, you can read it in any order - sometimes called a non-chronological report." },
          { question: "What features should I look for to tell it's an information text?", answer: "Look for a title and introduction, sub-headings, bullet points, facts, diagrams with labels, and technical vocabulary specific to the topic." }
        ]
      },
      {
        id: '4.2', unitId: 'english-u4', name: 'Differences between information and explanation texts', pageNumber: [64], sequence: 2,
        difficulty: 'intermediate',
        definition: "An information text can be read in any order and presents facts about a topic; an explanation text specifically describes a process, showing how or why something happens, and is usually organized chronologically from start to end.",
        keyPoints: [
          "Information texts are non-chronological (read in any order); explanation texts are usually chronological, since they describe a sequence of events or steps.",
          "Explanation texts rely heavily on adverbs and adverbial phrases of time - 'first', 'next', 'afterwards', 'eventually' - to guide the reader through the process.",
          "The same topic can be presented as either kind of text: 'facts about volcanoes' is information; 'how a volcano erupts' is explanation."
        ],
        examples: [
          "'Icebergs form when...then...eventually...' is an explanation text, chronologically describing the process.",
          "A list of iceberg facts organized under sub-headings (size, location, danger) with no particular order is an information text."
        ],
        tipsToRemember: [
          "Ask: does this text describe a PROCESS happening over time, or does it just present facts about a topic? That answers which type it is.",
          "Look for sequencing words like 'first'/'next'/'eventually' - lots of them is a strong sign of an explanation text."
        ],
        reasoningInterviewPrompts: ["Could you rearrange the paragraphs of this text and have it still make complete sense? If yes, is it more likely information or explanation?"],
        voiceQaSamples: [
          { question: "What's the difference between an information text and an explanation text?", answer: "An information text presents facts about a topic and can be read in any order. An explanation text describes how or why something happens, step by step, usually in chronological order." },
          { question: "Can the same topic have both kinds of text?", answer: "Yes - facts about volcanoes could be an information text, while 'how a volcano erupts' step by step would be an explanation text on the same topic." }
        ]
      },
      {
        id: '4.3', unitId: 'english-u4', name: 'Using information texts (scanning for specific answers)', pageNumber: [67], sequence: 3,
        difficulty: 'intermediate',
        definition: "Scanning means reading an information text quickly to find the answer to a specific question, rather than reading every word - different question words point you toward different kinds of answers.",
        keyPoints: [
          "Questions beginning with 'who' need a name or noun in the answer; 'where' needs a place; 'when' needs a time.",
          "Questions beginning with 'what', 'how', or 'why' are harder to scan for - they usually need you to find and read a whole explanation section.",
          "Scanning differs from skimming: skimming gets a general impression of a whole text, scanning hunts for one specific piece of information."
        ],
        examples: [
          "For 'Where do coral reefs grow?', scan for a place name - the answer is 'in warm shallow seas and oceans.'",
          "For 'Why are coral reefs important?', you can't scan for a single word - you need to find and read the explanation section."
        ],
        tipsToRemember: [
          "Before scanning, turn the question into the kind of answer you're hunting for - a name, a place, a time, or an explanation - then search for just that.",
          "'What/how/why' questions almost always need a slower, careful read of a whole paragraph, not a quick scan."
        ],
        reasoningInterviewPrompts: ["Why is 'where' easier to scan for than 'why'? What's different about the kind of answer each one needs?"],
        voiceQaSamples: [
          { question: "What's the difference between skimming and scanning?", answer: "Skimming is a fast read to get the general idea of a whole text. Scanning is hunting through a text for the answer to one specific question, ignoring everything else." },
          { question: "Why are 'what/how/why' questions harder to scan for?", answer: "Because their answers are usually a whole explanation, not a single word like a name, place, or time - you have to find the right section and read it carefully." }
        ]
      },
      {
        id: '4.4', unitId: 'english-u4', name: 'Different styles of information text (register & suffixes)', pageNumber: [70], sequence: 4,
        difficulty: 'intermediate',
        definition: "Information texts can be written in a formal style (technical language, for an audience who knows the topic) or an informal style (simpler, everyday language, for a general audience) - and suffixes like '-ology'/'-ogy' often signal 'the study of' a topic.",
        keyPoints: [
          "Formal information texts use precise, technical vocabulary and an objective tone, often aimed at readers who already know something about the topic.",
          "Informal information texts use simpler, more accessible language, often aimed at readers new to the topic, like younger children.",
          "The suffix '-ology' or '-ogy' means 'the study of' - biology is the study of living things, geology is the study of the Earth."
        ],
        examples: [
          "A formal information text about ecosystems might use 'photosynthesis' and 'biodiversity' without explaining them; an informal version might say 'how plants make food' instead.",
          "'Zoology' = the study of animals; both share the '-ology' pattern meaning a field of study."
        ],
        tipsToRemember: [
          "Check who the text seems to be written for - unexplained technical terms suggest a formal, expert audience; simple explained language suggests an informal, general one.",
          "When you meet an unfamiliar '-ology'/'-ogy' word, try replacing the ending with 'the study of' to get a rough working definition."
        ],
        reasoningInterviewPrompts: ["If you rewrote this formal information text for a much younger reader, what specifically would you need to change?"],
        voiceQaSamples: [
          { question: "How do I know if an information text is formal or informal?", answer: "Look at the vocabulary and audience - a formal text uses precise, technical words often without explaining them, while an informal text uses simpler, everyday language and explains new terms." },
          { question: "What does the suffix '-ology' mean?", answer: "It usually means 'the study of' something - biology is the study of living things, geology is the study of the Earth and its rocks." }
        ]
      },

      // UNIT 5: FICTION (Stories developed into a film) - representative pass,
      // grounded directly against the real textbook pages, no illustrations yet.
      {
        id: '5.1', unitId: 'english-u5', name: 'Showing character feelings through verb and adverb choice', pageNumber: [76], sequence: 1,
        difficulty: 'intermediate',
        definition: "Writers choose specific verbs and adverbs to show how a character feels through their actions, instead of directly telling the reader the character's emotion.",
        keyPoints: [
          "A carefully chosen verb (e.g. 'trudged' instead of 'walked') can suggest tiredness or reluctance without ever using the word 'tired.'",
          "Adverbs added to a verb (e.g. 'reluctantly', 'heavily') sharpen the feeling even further.",
          "This is implicit characterisation applied to actions - readers infer the feeling from HOW something is done, not from being told."
        ],
        examples: [
          "'Hugo trudged up the staircase' suggests tiredness or reluctance through the verb 'trudged' alone, rather than saying 'Hugo was tired.'",
          "'She snatched the pen and threw it down' suggests frustration through the choice of 'snatched' and 'threw', without stating the emotion directly."
        ],
        tipsToRemember: [
          "When writing your own characters, replace a plain verb (walked, said, took) with a more specific one that already carries a feeling (trudged, snapped, snatched).",
          "Add an adverb only if the verb alone isn't doing enough work - stacking too many can feel overwritten."
        ],
        reasoningInterviewPrompts: ["What plain verb could replace 'trudged' here, and how would swapping it change how the character's feeling comes across?"],
        voiceQaSamples: [
          { question: "How can a verb show a character's feelings without saying the feeling directly?", answer: "Some verbs already carry a feeling built in - 'trudged' suggests tiredness or reluctance, while 'strolled' suggests being relaxed. Choosing the right verb lets the action itself show the emotion." },
          { question: "What's the point of adding an adverb to a verb like this?", answer: "An adverb can sharpen or clarify the feeling the verb suggests - 'trudged reluctantly' makes the reluctance clearer than 'trudged' alone." }
        ]
      },
      {
        id: '5.2', unitId: 'english-u5', name: 'Concrete and abstract nouns', pageNumber: [79], sequence: 2,
        difficulty: 'beginner',
        definition: "Concrete nouns name things you can physically sense - see, hear, touch, smell, or taste. Abstract nouns name things that aren't physical, like feelings, ideas, or qualities.",
        keyPoints: [
          "Concrete nouns include people, objects, places, and sounds - anything with a physical presence, like 'clock' or 'staircase.'",
          "Abstract nouns include feelings, thoughts, and qualities that can't be physically touched or seen, like 'fear' or 'bravery.'",
          "Writers often pair a concrete noun with an abstract idea to make a feeling easier to picture."
        ],
        examples: [
          "'Clock', 'wheels', 'staircase' are concrete nouns - you could point to each one.",
          "'Concentration', 'fear', 'intensity' are abstract nouns - you can't point to fear itself, only to things that show it."
        ],
        tipsToRemember: [
          "Test a noun by asking: can I touch, see, or hear this thing directly? If yes, it's concrete; if it's a feeling or idea, it's abstract.",
          "Abstract nouns often come from adjectives or verbs - 'brave' becomes 'bravery', 'concentrate' becomes 'concentration.'"
        ],
        reasoningInterviewPrompts: ["Find one concrete noun and one abstract noun in this same sentence - how did you decide which was which?"],
        voiceQaSamples: [
          { question: "What's the difference between a concrete noun and an abstract noun?", answer: "A concrete noun names something physical you can sense, like a clock or a staircase. An abstract noun names something non-physical, like a feeling or an idea, like concentration or bravery." },
          { question: "Can I turn an abstract noun into something more concrete?", answer: "You can't make an abstract noun physical, but you can show it through a concrete detail - instead of just saying 'fear,' describing trembling hands lets the reader sense the fear indirectly." }
        ]
      },
      {
        id: '5.3', unitId: 'english-u5', name: 'Comparing a story across book and film adaptations', pageNumber: [82], sequence: 3,
        difficulty: 'intermediate',
        definition: "When a book becomes a film, some parts of the story may be changed, added, or removed - understanding a character clearly through the book's own word choices helps you judge whether a film adaptation stays true to that character.",
        keyPoints: [
          "Film-makers and actors must show a character's feelings visually and through performance, sometimes interpreting choices the author only implied through word choice.",
          "Comparing the book and the film side by side reveals what was kept, changed, or added for a different medium.",
          "A reader who understands a character's traits well from the book's own language can predict how believable a film's portrayal will be."
        ],
        examples: [
          "If a book describes a character as 'trudging' and 'reluctant', a film should show that reluctance through the actor's body language and pacing, not just tell viewers about it.",
          "A scene taking many pages of description in a book might be compressed into a few seconds of film, cutting some of the book's implied detail."
        ],
        tipsToRemember: [
          "Before comparing book and film, write down the character traits you can prove from the book's own words - that becomes your checklist for judging the film's accuracy.",
          "A film adds things a book doesn't have (expressions, music, pacing) and can also remove things - neither medium is simply 'more right.'"
        ],
        reasoningInterviewPrompts: ["Choose one verb or adjective from the book describing a character - if you were the film director, how would you show that same quality on screen without using any words?"],
        voiceQaSamples: [
          { question: "Why do films change parts of the book when they're based on it?", answer: "Films have different tools than books - they can't include every line of description, but they can show feelings visually through actors and pacing. Some story parts get compressed, cut, or added to fit the new medium." },
          { question: "How can I tell if a film 'stays true' to a character from the book?", answer: "Check whether the film shows the same personality traits the book's own words gave that character - if the book showed reluctance through a verb like 'trudged,' does the film's performance show that same reluctance?" }
        ]
      },

      // UNIT 6: FICTION (Classic literature) - representative pass, grounded
      // directly against the real textbook pages, no illustrations yet.
      {
        id: '6.1', unitId: 'english-u6', name: 'Combining figurative language with adverbs and adjectives for effect', pageNumber: [95], sequence: 1,
        difficulty: 'advanced',
        definition: "Classic literature often layers figurative language (metaphor, simile, personification, idiom) together with carefully chosen adverbs and adjectives, so the effect builds rather than relying on just one technique at a time.",
        keyPoints: [
          "A plain comparison ('The roc was a large bird') becomes more powerful by adding an adverb to the adjective ('an unbelievably large bird').",
          "Combining more than one figurative device in the same description (a simile plus personification, for example) creates a richer, more vivid image.",
          "The choice of adverb changes the intensity of the effect - 'very large' feels ordinary, 'unbelievably large' feels dramatic."
        ],
        examples: [
          "'The roc was a large bird' -> 'The roc was an unbelievably large bird' - the adverb 'unbelievably' intensifies the adjective for greater effect.",
          "'Dangerously fierce', 'frighteningly sharp' - pairing a dramatic adverb with an adjective sharpens the reader's sense of danger."
        ],
        tipsToRemember: [
          "Don't stack too many intensifying adverbs in the same sentence - one well-chosen one is more powerful than three weaker ones together.",
          "When revising your own writing, look for plain adjectives ('big', 'scary') and ask if a stronger adverb+adjective pairing would create a better effect."
        ],
        reasoningInterviewPrompts: ["Why does 'unbelievably large' create a stronger image than just 'very large'? What does the word 'unbelievably' add?"],
        voiceQaSamples: [
          { question: "How can I make my descriptions in a story more powerful?", answer: "Try combining an intensifying adverb with your adjective - instead of 'a large bird', try 'an unbelievably large bird'. You can also combine more than one figurative technique, like a simile and personification, in the same description." },
          { question: "Is it good to use lots of adverbs and adjectives together?", answer: "Not too many at once - one strong, well-chosen adverb+adjective pairing is usually more effective than piling up several weaker ones in the same sentence." }
        ]
      },
      {
        id: '6.2', unitId: 'english-u6', name: 'Using context clues to understand unfamiliar words', pageNumber: [98], sequence: 2,
        difficulty: 'intermediate',
        definition: "Readers can often work out the meaning of an unfamiliar word by using the information around it - the context - rather than needing a dictionary every time.",
        keyPoints: [
          "Context clues can come from the rest of the sentence, the surrounding sentences, or even the situation being described in the story.",
          "Sometimes the clue is a definition hidden in the same sentence; sometimes it's an example, or the general mood of the passage.",
          "Even without knowing an unfamiliar word exactly, context often lets you make a good-enough guess to keep reading without stopping."
        ],
        examples: [
          "'The giants moved with a menacing gait, and everyone stepped back in fear' - even without knowing 'menacing', the surrounding fear-related words suggest it means something threatening.",
          "'The maroon-coloured door was a deep brownish-red' - the sentence itself defines 'maroon' through the description that follows it."
        ],
        tipsToRemember: [
          "Before reaching for a dictionary, reread the sentence and the one before/after it - the context clue is often right there.",
          "Ask what feeling or reaction the surrounding words create - that often points you toward roughly what the unfamiliar word means, even if not its exact definition."
        ],
        reasoningInterviewPrompts: ["What specific words nearby helped you guess this word's meaning? Would you have guessed the same thing without them?"],
        voiceQaSamples: [
          { question: "What are context clues?", answer: "They're hints in the surrounding text - the rest of the sentence, nearby sentences, or the situation - that help you work out what an unfamiliar word means without looking it up." },
          { question: "What if the context doesn't give an exact definition?", answer: "That's normal - context clues often only get you a rough idea of a word's meaning, which is usually enough to keep reading and understand the story." }
        ]
      },
      {
        id: '6.3', unitId: 'english-u6', name: 'Modal verbs (possibility and certainty)', pageNumber: [102], sequence: 3,
        difficulty: 'intermediate',
        definition: "Modal verbs (like 'might', 'may', 'could', 'couldn't') show how possible, certain, or permitted something is, rather than stating it as a plain fact.",
        keyPoints: [
          "'Might' and 'may' show something is possible but not certain - 'My keys might be in my bag.'",
          "'Could' can show ability, possibility, or a polite request, depending on context - 'I could travel again next year' shows possibility.",
          "'Couldn't' shows impossibility - 'We couldn't have won that race' means winning was not possible in that situation."
        ],
        examples: [
          "'The ticket says: if you cancel, you'll get a full refund' vs 'The ticket might say you'll get a refund' - the second is far less certain.",
          "'We couldn't have won that race' expresses that victory was impossible, not just unlikely."
        ],
        tipsToRemember: [
          "Swap the modal verb out and ask: does the sentence still mean the same thing? If not, the modal verb was doing real work showing certainty or possibility.",
          "Modal verbs never change form for tense the normal way (no 'mighted' or 'coulding') - they stay the same regardless of subject."
        ],
        reasoningInterviewPrompts: ["How would the meaning of this sentence change if you swapped 'might' for 'will'?"],
        voiceQaSamples: [
          { question: "What is a modal verb?", answer: "It's a verb like 'might', 'may', 'could', or 'couldn't' that shows how possible, certain, or permitted something is, instead of stating it as a plain fact." },
          { question: "What's the difference between 'might' and 'couldn't'?", answer: "'Might' shows something is possible but uncertain. 'Couldn't' shows something was impossible. They sit at opposite ends of how likely something is." }
        ]
      },
      {
        id: '6.4', unitId: 'english-u6', name: 'Adverbial phrases (using -ing forms)', pageNumber: [107], sequence: 4,
        difficulty: 'advanced',
        definition: "An adverbial phrase built from an -ing verb form can describe how an action happens, adding detail to a sentence without needing a separate clause.",
        keyPoints: [
          "An -ing adverbial phrase usually describes what's happening at the same time as the main action - 'tossing and turning in the current.'",
          "These phrases can open a sentence for variety, rather than always sitting at the end.",
          "Overusing this pattern in every sentence can feel repetitive - it works best mixed with other sentence structures."
        ],
        examples: [
          "'The raft moved uncertainly, tossing and turning in the current.' - the -ing phrase adds detail about HOW the raft moved.",
          "'Sinbad set sail with a tear in his eye' could become 'Wiping away a tear, Sinbad set sail' - moving the -ing phrase to the front for variety."
        ],
        tipsToRemember: [
          "Check that the -ing action could realistically happen at the SAME time as the main verb - otherwise the sentence won't make logical sense.",
          "Try moving an -ing adverbial phrase to the start of a sentence occasionally instead of always at the end, for rhythm and variety."
        ],
        reasoningInterviewPrompts: ["Could the action in this -ing phrase really happen at the same time as the main verb? What would go wrong if it couldn't?"],
        voiceQaSamples: [
          { question: "What is an -ing adverbial phrase?", answer: "It's a phrase built from an -ing verb (like 'tossing and turning') that describes how an action happens, usually at the same time as the sentence's main action." },
          { question: "Where can I place an -ing adverbial phrase in a sentence?", answer: "Most often at the end, but you can also move it to the beginning of the sentence for variety - just make sure a comma follows it there." }
        ]
      },
      {
        id: '6.5', unitId: 'english-u6', name: 'Themes in classic literature', pageNumber: [109], sequence: 5,
        difficulty: 'advanced',
        definition: "A theme is a big idea about life that a story explores throughout its events - unlike the plot (what happens), the theme is the deeper message or question the whole story is really about.",
        keyPoints: [
          "Common themes in classic literature include courage, greed, friendship, and the difference between appearance and reality.",
          "A single story can explore more than one theme at once - a story can be about greed AND friendship simultaneously.",
          "Theme is found by looking at the whole story's pattern of events and outcomes, not just one single moment or line."
        ],
        examples: [
          "In a story where a character's dishonesty repeatedly causes trouble until they finally tell the truth, the theme might be about the value of honesty.",
          "A story where two rivals must work together to survive might explore the theme of friendship overcoming difference."
        ],
        tipsToRemember: [
          "Ask: what lesson or big idea do the character's choices and consequences seem to be teaching, across the whole story?",
          "Don't confuse theme (the big idea) with plot (what actually happens) - the plot is the events; the theme is what those events mean."
        ],
        reasoningInterviewPrompts: ["What big idea do you think this story is really about, and which specific events made you think that?"],
        voiceQaSamples: [
          { question: "What's the difference between theme and plot?", answer: "The plot is what actually happens in the story - the events in order. The theme is the deeper idea or message those events explore, like courage or friendship." },
          { question: "Can a story have more than one theme?", answer: "Yes - most stories explore several big ideas at once, like greed and loyalty both appearing in the same tale." }
        ]
      },

      // UNIT 7: PLAYSCRIPTS (A playscript, book, and film of the same story) -
      // representative pass, grounded directly against the real textbook
      // pages, no illustrations yet.
      {
        id: '7.1', unitId: 'english-u7', name: 'Comparing playscripts and books', pageNumber: [116], sequence: 1,
        difficulty: 'beginner',
        definition: "Playscripts and books can tell the exact same story, but in very different formats: a book uses a narrator to describe what characters do and how, while a playscript has no narrator - stage directions tell the actors how to behave, and only dialogue is spoken aloud.",
        keyPoints: [
          "In a book, the narrator describes character actions and feelings directly to the reader; in a playscript, that information moves into stage directions instead.",
          "A playscript formats a character's name in capital letters before their line, followed by the words they actually say.",
          "Stage directions (often in brackets or italics) tell an actor HOW to say a line or move, information a book might give through an adverb instead."
        ],
        examples: [
          "Book: 'Aunt Sue said crossly.' Playscript: 'AUNT SUE: (crossly) Where have you been?'",
          "A book might write 'James trembled with fear'; a playscript would show this only through a stage direction like '(James shivers, looking around nervously)'."
        ],
        tipsToRemember: [
          "When turning a book scene into a playscript, look for every 'said [adverb]' and turn it into a bracketed stage direction instead.",
          "Remember a playscript has NO narrator voice - anything the reader needs to know comes through dialogue or stage directions."
        ],
        reasoningInterviewPrompts: ["If a book describes a character's inner thoughts, how would a playscript show that same information to an audience instead?"],
        voiceQaSamples: [
          { question: "What's the main difference between how a book and a playscript tell a story?", answer: "A book has a narrator who describes what's happening and how characters feel. A playscript has no narrator - stage directions tell actors how to behave, and everything else comes through spoken dialogue." },
          { question: "How is a character's name formatted in a playscript?", answer: "It's written in capital letters right before their line of dialogue, so actors and readers instantly know who's speaking." }
        ]
      },
      {
        id: '7.2', unitId: 'english-u7', name: 'Stagecraft (stage directions, lighting, and movement)', pageNumber: [121], sequence: 2,
        difficulty: 'intermediate',
        definition: "Stagecraft is everything a playwright and director use beyond the spoken words - stage directions, lighting, props, and movement - to help an audience understand what's happening and feel the right mood.",
        keyPoints: [
          "Stage directions can describe how actors move around the stage, not just how they say their lines.",
          "Lighting choices (bright, dim, coloured) can suggest mood, time of day, or a change of location without changing the set itself.",
          "Comparing a playscript's stage directions to a filmed version of the same scene reveals different choices directors make for the same story."
        ],
        examples: [
          "'(The lights dim slowly as James climbs into the peach)' uses lighting to signal both a mood shift and a scene change.",
          "A stage direction like '(Centipede shuffles forward, dragging his many legs)' tells an actor exactly how to move to suggest the character's personality."
        ],
        tipsToRemember: [
          "When reading a playscript, picture the stage directions happening, not just the dialogue - they carry real information about mood and setting.",
          "If you were directing this scene, ask what lighting and movement choices you'd make differently - there's often more than one valid choice."
        ],
        reasoningInterviewPrompts: ["Why might a director choose dim lighting for this particular scene? What mood does it create that bright lighting wouldn't?"],
        voiceQaSamples: [
          { question: "What is stagecraft?", answer: "It's everything beyond the spoken dialogue that brings a play to life - stage directions, lighting, props, and how actors move - all working together to create mood and meaning." },
          { question: "Why do stage directions matter if they're not spoken aloud?", answer: "They tell the actors and director exactly how to perform the scene - movement, tone, and timing - which shapes how the audience experiences the story." }
        ]
      },
      {
        id: '7.3', unitId: 'english-u7', name: 'Direct speech and reported speech', pageNumber: [126], sequence: 3,
        difficulty: 'intermediate',
        definition: "Direct speech gives someone's exact spoken words inside speech marks. Reported speech describes what someone said without quoting their exact words - the verb tense usually shifts back, and pronouns often change too.",
        keyPoints: [
          "Direct speech: 'I like spaghetti,' he said. Reported speech: He said that he liked spaghetti - the verb 'like' shifts to 'liked' and the pronoun 'I' becomes 'he'.",
          "Reported speech usually removes speech marks entirely, folding the words into the sentence structure instead.",
          "Playscripts rely heavily on direct speech, since characters speak their lines aloud; reported speech is more common in narrated prose."
        ],
        examples: [
          "Direct: 'I bought a new bike,' she said. Reported: She said that she had bought a new bike.",
          "Direct: 'I will polish my boots,' he said. Reported: He said that he would polish his boots."
        ],
        tipsToRemember: [
          "Check three things when converting to reported speech: does the verb tense shift back, does the pronoun need to change, and do the speech marks disappear?",
          "Not every direct-speech sentence needs 'that' in its reported version, but including it often makes the sentence clearer."
        ],
        reasoningInterviewPrompts: ["Why does 'will' become 'would' when you change this sentence from direct to reported speech?"],
        voiceQaSamples: [
          { question: "What's the difference between direct and reported speech?", answer: "Direct speech gives someone's exact words inside speech marks - 'I'm hungry,' she said. Reported speech describes what was said without the exact words - she said that she was hungry - and the verb tense usually shifts back." },
          { question: "Why does the pronoun change in reported speech?", answer: "Because you're describing the speech from a different point of view - if James says 'I'm cold', reporting it becomes 'James said that he was cold', since you're not James speaking." }
        ]
      },
      {
        id: '7.4', unitId: 'english-u7', name: 'Character viewpoints in plays', pageNumber: [130], sequence: 4,
        difficulty: 'advanced',
        definition: "In a play, the audience can understand events through more than one character's viewpoint at the same time - what one character says and does can reveal a very different perspective from how another character experiences the exact same moment.",
        keyPoints: [
          "A 'defeated'-sounding character's words might contrast with stage directions revealing an inward determination the other characters can't see.",
          "Audiences watching a play often know more than any single character does, since they see and hear every character's reactions at once.",
          "Comparing how two characters describe or react to the same event on stage reveals their different viewpoints without a narrator explaining it."
        ],
        examples: [
          "One character might loudly declare defeat while a stage direction shows them secretly smiling, revealing two different viewpoints on the same moment.",
          "A dismissive character's words about another can be contrasted with that other character's own confident actions, showing the audience both sides at once."
        ],
        tipsToRemember: [
          "When reading a playscript, track each character's words AND stage directions separately - viewpoints can be hidden in either one.",
          "Ask: does the audience know something a character on stage doesn't? That gap is often exactly where interesting viewpoint contrasts live."
        ],
        reasoningInterviewPrompts: ["Whose viewpoint do you trust more in this scene - what a character says, or what their stage directions show them doing? Why?"],
        voiceQaSamples: [
          { question: "How can a play show more than one character's viewpoint at once?", answer: "Through a mix of dialogue and stage directions - what a character says might contrast with what their actions or expressions reveal, letting the audience see multiple perspectives on the same moment." },
          { question: "Do audiences always know more than the characters in a play?", answer: "Often, yes - because audiences see and hear everyone at once, they can notice things individual characters miss about each other." }
        ]
      },

      // UNIT 8: POETRY (Poems by famous poets) - representative pass, grounded
      // directly against the real textbook pages, no illustrations yet.
      {
        id: '8.1', unitId: 'english-u8', name: 'Unstressed vowel phonemes in spelling', pageNumber: [136], sequence: 1,
        difficulty: 'intermediate',
        definition: "An unstressed vowel phoneme is a vowel sound that isn't emphasized when a word is spoken - it often sounds like a plain 'uh' sound no matter which vowel letter is actually written, which is why these words are commonly misspelled.",
        keyPoints: [
          "When a vowel sound is unstressed, it can sound like 'a', 'e', 'i', 'o', or 'u' regardless of which letter is actually there - spelling by sound alone often fails.",
          "Many multi-syllable words have an unstressed vowel in an unexpected position, like the middle or end of the word.",
          "Because you can't rely on how the word sounds, learning these spellings often means memorising the written pattern directly."
        ],
        examples: [
          "'Separate' has an unstressed vowel that could sound like almost any letter - spelling it by ear alone is unreliable.",
          "'Different' and 'chocolate' both have unstressed syllables that are easy to drop or misspell when writing quickly."
        ],
        tipsToRemember: [
          "When a word has a tricky, easy-to-misspell unstressed vowel, break it into syllables and say each one separately and clearly.",
          "Keep a small list of your own personal 'tricky spelling' words with unstressed vowels, and review it regularly."
        ],
        reasoningInterviewPrompts: ["Why can't you always spell an unstressed vowel just by sounding the word out? What do you have to do instead?"],
        voiceQaSamples: [
          { question: "What is an unstressed vowel phoneme?", answer: "It's a vowel sound in a word that isn't emphasized when spoken - it often just sounds like a plain 'uh', no matter which vowel letter is actually written, which makes these words tricky to spell by ear." },
          { question: "How can I remember how to spell words with unstressed vowels?", answer: "Break the word into syllables and say each one clearly and separately - it helps you notice the actual letter pattern instead of relying on how the word sounds when spoken quickly." }
        ]
      },
      {
        id: '8.2', unitId: 'english-u8', name: 'Poetic sound devices (rhyme, repetition, alliteration)', pageNumber: [141], sequence: 2,
        difficulty: 'beginner',
        definition: "Poets choose how their poems sound using devices like rhyme (matching end sounds), repetition (repeating words or phrases), and alliteration (repeating a starting sound) to create rhythm and emphasis.",
        keyPoints: [
          "Rhyme links lines together through matching sounds, often at the end of lines.",
          "Repetition emphasizes an idea by using the same word or phrase more than once, building rhythm and importance.",
          "Alliteration repeats a starting consonant sound across nearby words, creating a pleasing or emphatic sound pattern."
        ],
        examples: [
          "Rhyme: 'In my imagination, I see a world full of fascination.'",
          "Alliteration: 'Thudding and thumping' - both words share the same starting sound, emphasizing a heavy, rhythmic action."
        ],
        tipsToRemember: [
          "Read a poem aloud, not just silently - sound devices like rhyme and alliteration are easiest to notice when heard.",
          "When writing your own poem, don't force a rhyme if it changes your intended meaning - a strong idea matters more than a forced rhyme."
        ],
        reasoningInterviewPrompts: ["Why might a poet choose repetition instead of just saying something once? What effect does repeating it create?"],
        voiceQaSamples: [
          { question: "What's the difference between rhyme and alliteration?", answer: "Rhyme is matching sounds, usually at the end of lines - like 'fascination' and 'imagination'. Alliteration is repeating a starting sound across nearby words - like 'thudding and thumping'." },
          { question: "Why do poets use repetition?", answer: "Repeating a word or phrase builds rhythm and draws extra attention to that idea, making it feel more important or memorable." }
        ]
      },
      {
        id: '8.3', unitId: 'english-u8', name: 'Homonyms in poetry', pageNumber: [145], sequence: 3,
        difficulty: 'intermediate',
        definition: "A homonym is a word that has two or more different meanings, sometimes even different pronunciations - in poetry, working out which meaning fits requires reading the surrounding context carefully.",
        keyPoints: [
          "Some homonyms are spelled and pronounced identically but mean different things depending on context (like 'bark' - a tree's covering, or a dog's sound).",
          "Poetry often uses homonyms deliberately, playing with double meanings for effect.",
          "Context clues from surrounding words are essential for working out which meaning of a homonym is intended in a specific line."
        ],
        examples: [
          "'The bark of the tree was rough' vs 'The dog gave a loud bark' - same word, two unrelated meanings depending on context.",
          "'the wind' (moving air) vs 'to wind' (to turn) - spelled the same, pronounced differently, meaning something completely different."
        ],
        tipsToRemember: [
          "If a line of poetry seems confusing, check whether a key word might be a homonym being used in an unexpected sense.",
          "Reading the whole sentence, not just the single word, almost always reveals which meaning of a homonym is intended."
        ],
        reasoningInterviewPrompts: ["This word has two possible meanings here - which one fits, and what clue in the surrounding words told you that?"],
        voiceQaSamples: [
          { question: "What is a homonym?", answer: "It's a word with two or more different meanings - sometimes even pronounced differently - like 'bark' (a tree's covering) and 'bark' (the sound a dog makes)." },
          { question: "Why do poets use homonyms?", answer: "They can play with double meanings, letting a single word suggest two ideas at once, which adds richness or surprise to a poem." }
        ]
      },
      {
        id: '8.4', unitId: 'english-u8', name: 'Exploring mood through word choice in poetry', pageNumber: [148], sequence: 4,
        difficulty: 'intermediate',
        definition: "A poem's mood - the feeling it creates for the reader - comes through the poet's choice of details, connotations, setting, and actions, not through the poet directly stating an emotion.",
        keyPoints: [
          "The same scene can be given a positive or negative mood purely through which details and words the poet chooses to include.",
          "Word connotations (the feelings a word suggests beyond its literal meaning) shape mood just as much as the events described.",
          "Mood can shift within a single poem as the details and word choices change from one stanza to the next."
        ],
        examples: [
          "'The ground opened up beneath her feet and she found herself tumbling into unknowable, endless darkness' creates a frightening mood through words like 'unknowable' and 'darkness.'",
          "The same event described with 'gentle', 'warm', and 'golden' details would create a completely different, positive mood."
        ],
        tipsToRemember: [
          "Highlight the specific words in a poem doing the mood-building work - what happens to the mood if you swap just one for a neutral word?",
          "When writing your own poem, choose your details and word connotations deliberately to match the mood you want."
        ],
        reasoningInterviewPrompts: ["Which specific words in this stanza are creating its mood, and how would the mood change if you swapped one of them for a plainer word?"],
        voiceQaSamples: [
          { question: "How do poets create mood without just stating a feeling?", answer: "Through their choice of details, connotations, and actions described - words like 'unknowable' and 'darkness' create a frightening mood without the poet ever saying 'this is scary.'" },
          { question: "Can mood change within one poem?", answer: "Yes - as the details and word choices shift from stanza to stanza, the mood can shift too, moving from calm to tense, for example." }
        ]
      },
      {
        id: '8.5', unitId: 'english-u8', name: 'Common exception words (spelling)', pageNumber: [152], sequence: 5,
        difficulty: 'beginner',
        definition: "Common exception words are words that don't follow the usual English spelling rules, so they need to be learned and remembered individually rather than worked out from a pattern.",
        keyPoints: [
          "Spelling 'rules' like 'i before e except after c' have well-known exceptions, and common exception words are often exactly those exceptions.",
          "A useful method for memorising them is Look-Say-Cover-Write-Check: look at the word, say it, cover it, write it from memory, then check.",
          "Building a personal list of your own commonly-misspelled exception words is more useful than trying to memorise every possible exception at once."
        ],
        examples: [
          "'Their' doesn't follow the 'i before e' pattern the way a regular word would, and simply has to be learned as an exception.",
          "Words like 'people' or 'once' have spellings that don't match how they sound, making them common exception words."
        ],
        tipsToRemember: [
          "Use Look-Say-Cover-Write-Check regularly on your own list of tricky exception words rather than trying to learn them all at once.",
          "When you misspell the same exception word more than once, that's the clearest sign it belongs on your personal practice list."
        ],
        reasoningInterviewPrompts: ["Why can't you just sound this word out to spell it correctly? What makes it an 'exception'?"],
        voiceQaSamples: [
          { question: "What is a common exception word?", answer: "It's a word that doesn't follow the usual English spelling rules, so instead of working out its spelling from a pattern, you just have to learn and remember it directly." },
          { question: "What's a good way to learn tricky exception words?", answer: "Try Look-Say-Cover-Write-Check: look at the word, say it aloud, cover it up, write it from memory, then check if you got it right - repeating this helps it stick." }
        ]
      },

      // UNIT 9: NON-FICTION (Persuasive texts) - representative pass so far
      // covers the unit's opening concept; more to follow.
      {
        id: '9.1', unitId: 'english-u9', name: 'Features of persuasive texts', pageNumber: [156], sequence: 1,
        difficulty: 'beginner',
        definition: "A persuasive text is written to convince the reader to think or act a certain way, using techniques like rhetorical questions, exaggeration, powerful adjectives, alliteration, and direct commands to sway the audience.",
        keyPoints: [
          "Rhetorical questions are asked to make a reader think, not to get a literal answer - 'Can you imagine your life without it?'",
          "Exaggeration and powerful, emotive adjectives make a claim feel more dramatic and convincing than a plain, neutral description would.",
          "Imperative verbs (commands like 'Don't miss out!') and direct address to the reader ('Dear reader...') push the audience toward taking action."
        ],
        examples: [
          "'Isn't it time you gave your family the very best?' is a rhetorical question designed to make the reader agree without needing to answer aloud.",
          "'This spectacular, life-changing opportunity' uses powerful adjectives and exaggeration to make an ordinary offer feel dramatic and urgent."
        ],
        tipsToRemember: [
          "When reading an advert or persuasive letter, list every rhetorical question, command, and emotionally loaded adjective you spot - that reveals exactly how it's trying to persuade you.",
          "When writing your own persuasive text, combine several techniques (a rhetorical question AND powerful adjectives AND a direct command) rather than relying on just one."
        ],
        reasoningInterviewPrompts: ["Why does a rhetorical question feel more persuasive than simply stating the same opinion directly?"],
        voiceQaSamples: [
          { question: "What makes a text 'persuasive'?", answer: "It uses specific techniques - like rhetorical questions, exaggeration, powerful adjectives, alliteration, and direct commands - all aimed at convincing the reader to think or act a certain way." },
          { question: "Why do persuasive texts use rhetorical questions?", answer: "A rhetorical question gets the reader thinking and often nudges them toward agreeing with the writer's point, without the writer having to state it as a flat command." }
        ]
      },

      {
        id: '9.2', unitId: 'english-u9', name: 'Countable and uncountable nouns (with quantifiers)', pageNumber: [163], sequence: 2,
        difficulty: 'intermediate',
        definition: "Countable nouns name things that can be counted individually (one bottle, two bottles); uncountable nouns name things that can't be split into individual countable units (water, plastic) and are measured with quantifiers like 'a lot of' or 'less' instead.",
        keyPoints: [
          "Countable nouns have both singular and plural forms and can follow numbers directly - 'three bottles', 'many students.'",
          "Uncountable nouns have no plural form and can't follow a number directly - you can't say 'three waters', but you can say 'a lot of water.'",
          "Quantifiers pair with one or the other: 'fewer'/'many' with countable nouns, 'less'/'much' with uncountable nouns."
        ],
        examples: [
          "'A lot of plastic ends up in the ocean' (uncountable) vs 'A lot of bottles end up in the ocean' (countable).",
          "'There is less rubbish this year' (uncountable, 'less') vs 'There are fewer plastic bags this year' (countable, 'fewer')."
        ],
        tipsToRemember: [
          "Test a noun by trying to put a number directly in front of it - if that sounds wrong ('three waters'), it's likely uncountable.",
          "Remember the pairing: fewer/many go with countable nouns, less/much go with uncountable nouns."
        ],
        reasoningInterviewPrompts: ["Why does 'fewer plastic bottles' sound correct but 'fewer plastic' sound wrong? What's the difference between the two nouns?"],
        voiceQaSamples: [
          { question: "What's the difference between countable and uncountable nouns?", answer: "Countable nouns can be counted individually and have plural forms, like 'bottle/bottles'. Uncountable nouns can't be split into individual units, like 'water' or 'plastic', and use quantifiers like 'a lot of' instead of a number." },
          { question: "When do I use 'fewer' versus 'less'?", answer: "Use 'fewer' with countable nouns ('fewer bottles') and 'less' with uncountable nouns ('less plastic'). Mixing them up is a really common mistake, even for adults!" }
        ]
      },
      {
        id: '9.3', unitId: 'english-u9', name: "Facts, opinions, and the writer's viewpoint in persuasive writing", pageNumber: [160], sequence: 3,
        difficulty: 'advanced',
        definition: "Persuasive texts often blend facts with the writer's own opinions and viewpoint - recognising which is which, and noticing the writer's emotional stance, helps a reader judge how one-sided a persuasive text really is.",
        keyPoints: [
          "A writer's viewpoint is their personal belief or stance on the topic, often revealed through tone and word choice, not just what they explicitly say.",
          "Persuasive texts mix genuine facts with opinions dressed up as if they were facts, to make the argument feel stronger.",
          "Noticing whether a writer's tone is angry, calm, or encouraging helps a reader judge how emotionally charged the argument is."
        ],
        examples: [
          "'Plastic can take hundreds of years to break down' is a fact; 'and that's simply unacceptable' is the writer's opinion layered right next to it.",
          "A calm, encouraging tone ('Together, we can make a difference') persuades differently than an angry, accusing tone ('How dare we let this happen?')."
        ],
        tipsToRemember: [
          "Separate a persuasive text's claims into two columns as you read: facts you could verify, and opinions/viewpoint you couldn't.",
          "Notice emotionally loaded words (unacceptable, shocking, wonderful) - they're usually signals of the writer's viewpoint, not neutral facts."
        ],
        reasoningInterviewPrompts: ["Find one fact and one opinion sitting right next to each other in this persuasive text - how did you tell them apart?"],
        voiceQaSamples: [
          { question: "Why do persuasive texts mix facts and opinions?", answer: "Mixing real facts with the writer's opinions makes the argument feel more credible and convincing - the facts lend the whole argument a sense of truth, even where opinions are woven in." },
          { question: "How can I tell what a writer's viewpoint is?", answer: "Look at their tone and word choice - angry, calm, or encouraging language all reveal how the writer feels about the topic, beyond just the facts they state." }
        ]
      },
      {
        id: '9.4', unitId: 'english-u9', name: 'Building imaginative descriptions to persuade', pageNumber: [166], sequence: 4,
        difficulty: 'advanced',
        definition: "Persuasive writers sometimes paint an idealized picture of how much better things could be, using adverbial phrases and complex (multi-clause) sentences that build an increasingly vivid, imaginative picture across each sentence.",
        keyPoints: [
          "Describing an idealized 'perfect world' scenario can be more persuasive than simply criticising the current situation.",
          "Adverbial phrases and multi-clause (complex) sentences let a writer add layer upon layer of vivid detail within a single sentence.",
          "This technique works by appealing to the reader's imagination and emotions, not just presenting facts and logic."
        ],
        examples: [
          "'Kittens snuggle up and purr themselves contentedly to sleep, while their mother cat watches over them in the safety of the animal rescue centre' builds an idealized, emotionally appealing picture through layered clauses.",
          "Adding an adverbial phrase like 'with smartly gleaming floors, free of rubbish and clutter' extends and intensifies the imagined scene."
        ],
        tipsToRemember: [
          "When writing this kind of persuasive description, build your sentence in layers - start with the core idea, then add adverbial phrases and extra clauses to deepen the picture.",
          "Remember commas are often needed to separate the added adverbial phrases and clauses from the rest of the sentence."
        ],
        reasoningInterviewPrompts: ["Which part of this sentence is doing the persuading - the plain facts, or the imaginative, idealized picture being painted? How can you tell?"],
        voiceQaSamples: [
          { question: "How do writers use imaginative descriptions to persuade?", answer: "They paint a vivid, idealized picture of how good things could be, using adverbial phrases and multi-clause sentences that build layer upon layer of detail, appealing to the reader's imagination and emotions." },
          { question: "Why use a complex, multi-clause sentence instead of several short ones?", answer: "A longer, layered sentence can build an increasingly vivid picture in one continuous flow, rather than breaking the imaginative effect into separate, disconnected statements." }
        ]
      },
      {
        id: '9.5', unitId: 'english-u9', name: 'Adapting persuasive writing for a chosen audience', pageNumber: [169], sequence: 5,
        difficulty: 'advanced',
        definition: "Effective persuasive writing changes its language, examples, and appeals depending on exactly who the intended audience is - the same argument needs different treatment for different readers.",
        keyPoints: [
          "Understanding your audience's age, interests, and existing beliefs shapes which facts, examples, and tone will actually persuade them.",
          "A persuasive text can appeal to different senses (sight, sound, touch) to help a specific audience imagine and connect with the topic more vividly.",
          "The same underlying argument might use very different language for young children compared to adults, even though the core persuasive goal stays the same."
        ],
        examples: [
          "Persuading children to recycle might use simple, friendly language and vivid sensory details a child can imagine (the smell, the sound, the feel).",
          "Persuading adults about climate policy might instead use statistics, expert quotes, and a more formal, urgent tone."
        ],
        tipsToRemember: [
          "Before writing, picture your specific audience and ask what they already care about - that tells you which appeals will actually land.",
          "Try using multiple senses (sight, sound, touch, smell) in your descriptions to help any audience imagine your topic more vividly."
        ],
        reasoningInterviewPrompts: ["If you had to persuade a much younger audience of this same argument, what specifically would you need to change about your language and examples?"],
        voiceQaSamples: [
          { question: "Why does persuasive writing need to change depending on the audience?", answer: "Because different audiences care about different things and respond to different kinds of language - what convinces a young child won't necessarily convince an adult, even for the exact same underlying argument." },
          { question: "How can appealing to the senses help persuade an audience?", answer: "Describing sight, sound, touch, or smell helps any reader imagine the topic vividly and emotionally, making the argument feel more real and immediate, regardless of their age or background." }
        ]
      },

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
