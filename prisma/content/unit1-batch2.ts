// One-off content-authoring script: drafts concepts 1.4-1.9 of
// cambridge-5-english-1 (previously outline-only placeholders) from
// textbook pages the user photographed and shared in chat.
//
// Per this project's existing copyright boundary (see EXTRACTION_SYSTEM_PROMPT
// in lib/claude.ts), none of the text below is copied or closely paraphrased
// from the textbook - every definition, example, and prompt is written from
// scratch, using the photographed pages only to identify which concept each
// page teaches and roughly how advanced it is for this grade.
//
// Run once against a DATABASE_URL (local, tunnel, or Railway) with:
//   DATABASE_URL=... npx tsx prisma/content/unit1-batch2.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type ConceptDraft = {
  conceptKey: string;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  bookPages: number[];
  storyReferenceTitle?: string;
  storyReferenceSynopsis?: string;
  definition: string;
  keyPoints: string[];
  examples: string[];
  tipsToRemember: string[];
  reasoningInterviewPrompts: string[];
  voiceQaSamples: { question: string; answer: string }[];
  illustrationKey: string;
  illustrationCaption: string;
};

const DRAFTS: ConceptDraft[] = [
  {
    conceptKey: "1.4",
    name: "Predicting as a reading strategy",
    difficulty: "beginner",
    bookPages: [8, 9],
    storyReferenceTitle: "Why Cockerels Crow (a fable from Malawi)",
    storyReferenceSynopsis:
      "Between Part 1 and Part 2, students pause to predict what Hyena might do next, based on what they already know about his character.",
    definition:
      "Predicting means using what you already know - from the story so far, the title, or the pictures - to make a sensible guess about what might happen next, before you read on.",
    keyPoints: [
      "A good prediction is a guess based on evidence, not a random guess - you should always be able to say why you think it.",
      "Predictions don't have to come true. Checking whether you were right (and why or why not) is what actually helps you understand the story better.",
      "Titles, illustrations, and how a character has behaved so far are all clues you can use to predict.",
    ],
    examples: [
      "If a story is called The Boy Who Cried Wolf, you can predict the boy will pretend danger is coming when it isn't, because that's what the title hints at.",
      "A character has been unkind to everyone else in the story so far, so you predict that unkindness will cause a problem for them later on.",
    ],
    tipsToRemember: [
      "Say your prediction as 'I think ___ will happen because ___' - the 'because' is the important part, not the guess itself.",
      "Keep reading with your prediction in mind - were you right, partly right, or completely wrong, and what actually happened instead?",
    ],
    reasoningInterviewPrompts: [
      "What clue from the story made you predict that? Point to something specific, not just a feeling.",
      "Your prediction didn't come true - does that mean it was a bad prediction, or just a reasonable guess the writer chose to surprise you with?",
    ],
    voiceQaSamples: [
      {
        question: "What does it mean to predict in reading?",
        answer:
          "It means making a sensible guess about what happens next, using clues you already have - like the title, the pictures, or what's happened in the story so far. It's not a random guess, it's a guess backed by evidence.",
      },
      {
        question: "Do I need to be right for it to be a good prediction?",
        answer:
          "No! A good prediction just needs a good reason behind it. Even if you're wrong, comparing your guess to what actually happened helps you understand the story better.",
      },
    ],
    illustrationKey: "predicting_next_page",
    illustrationCaption: "Guessing what comes next, backed by clues",
  },
  {
    conceptKey: "1.5",
    name: "Perspective / point of view",
    difficulty: "intermediate",
    bookPages: [12, 13],
    storyReferenceTitle: "Why Monkeys live in Trees (a fable from South Africa)",
    storyReferenceSynopsis:
      "A lioness asks a monkey for help and is tricked and left tied to a tree - a story that feels very different depending on whose side you're following.",
    definition:
      "Perspective (or point of view) is whose eyes a story is being seen through - the same events can feel completely different depending on which character's thoughts and feelings you're following.",
    keyPoints: [
      "The same event can be described very differently by two different characters, because each one only knows and feels their own side of it.",
      "Changing perspective can make you sympathise with a character you didn't like before, once you understand why they acted that way.",
      "Writers show perspective through whose thoughts and feelings we're told about, and what that character happens to notice.",
    ],
    examples: [
      "A story about a lost dog might feel worrying told from the owner's perspective, but exciting told from the dog's own perspective.",
      "From one character's perspective, a story might be about being desperately hungry. From another's, the same event is about being robbed. Same event, two very different feelings.",
    ],
    tipsToRemember: [
      "Ask yourself: whose thoughts and feelings am I being told about right now? That tells you whose perspective you're in.",
      "To retell a story from a different character's perspective, only include what THAT character would actually know, see, or feel - not information they don't have.",
    ],
    reasoningInterviewPrompts: [
      "If you retold this story from the other character's perspective, what would change about how the reader feels?",
      "What does this character know that the other one doesn't - and how does that shape their side of the story?",
    ],
    voiceQaSamples: [
      {
        question: "What's the difference between perspective and opinion?",
        answer:
          "Perspective is whose eyes and feelings the story is told through - it shapes what details you get. An opinion is what someone thinks or believes. A character's opinion often comes from their perspective, but they aren't exactly the same thing.",
      },
      {
        question: "How do I write from a different character's point of view?",
        answer:
          "Only tell the reader what that character would actually see, know, and feel in that moment - not things only another character knows. Use 'I' or their name, and describe events the way it would feel to be them.",
      },
    ],
    illustrationKey: "perspective_two_views",
    illustrationCaption: "Same story, different eyes",
  },
  {
    conceptKey: "1.6",
    name: "Proofreading checklist",
    difficulty: "beginner",
    bookPages: [10],
    definition:
      "Proofreading means carefully checking your own writing after you've finished a draft, to fix small mistakes in punctuation, spelling, and grammar before it's a finished piece.",
    keyPoints: [
      "Proofreading is different from planning or drafting - it happens last, once your ideas are already down on the page.",
      "A good checklist covers capital letters, end punctuation, spacing, spelling, grammar, and whether it actually makes sense when read back.",
      "Reading your writing aloud (or slowly in your head) helps you catch mistakes your eyes skip over when reading fast.",
    ],
    examples: [
      "'She walked to the shop.' has a capital letter, correct spacing, and a full stop - proofread and ready. 'she walked to the shop' is missing its capital letter and needs fixing.",
      "'I like pizza I also like pasta' is missing punctuation between two ideas - proofreading catches that it needs a full stop or connective: 'I like pizza. I also like pasta.'",
    ],
    tipsToRemember: [
      "Check one thing at a time - read once just for capital letters and full stops, then again just for spelling, rather than trying to catch everything at once.",
      "Ask 'does this actually make sense?' as its own separate check - a sentence can be perfectly spelled and punctuated and still not make sense.",
    ],
    reasoningInterviewPrompts: [
      "You wrote this sentence - if you read it aloud right now, does every part of it sound like it makes sense?",
      "What's one thing on the proofreading checklist you tend to forget to check? Why do you think that one's easy to miss?",
    ],
    voiceQaSamples: [
      {
        question: "What's proofreading?",
        answer:
          "It's checking your writing after you've written it, to catch mistakes - missing capital letters, missing full stops, spelling errors, and sentences that don't quite make sense. It's the last step, after your ideas are already down.",
      },
      {
        question: "How is proofreading different from editing my ideas?",
        answer:
          "Editing ideas is about whether your writing says what you mean - is anything missing, confusing, or in the wrong order? Proofreading is smaller and comes after - checking spelling, punctuation, and grammar in the sentences you've already decided on.",
      },
    ],
    illustrationKey: "proofreading_checklist",
    illustrationCaption: "The last check before you're done",
  },
  {
    conceptKey: "1.7",
    name: "Fact vs. opinion",
    difficulty: "beginner",
    bookPages: [9, 11],
    storyReferenceTitle: "Why Cockerels Crow (a fable from Malawi)",
    storyReferenceSynopsis:
      "Students sort statements about Cockerel and Hyena into facts (provable from the text) and opinions (personal judgements about the characters).",
    definition:
      "A fact is something that can be proven true or false with evidence. An opinion is what someone personally thinks, feels, or believes - and it can be different from person to person, even about the same thing.",
    keyPoints: [
      "You can check a fact (by measuring, counting, or looking it up) - you can't check an opinion the same way, because it's about feelings or personal judgement.",
      "Words like 'best', 'worst', 'should', 'beautiful', or 'boring' are usually signs of an opinion, not a fact.",
      "A single passage can mix both - 'The book has 200 pages' is a fact; 'and it's the best book ever' is an opinion.",
    ],
    examples: [
      "'The rooster has red feathers on its head' is a fact - you could look and check. 'The rooster is the most impressive animal in the story' is an opinion - someone else might disagree.",
      "'It rained yesterday' is a fact that can be checked against a weather record. 'Yesterday was a terrible day' is an opinion - it depends on how the person felt about it.",
    ],
    tipsToRemember: [
      "Ask: could two reasonable people disagree about this? If yes, it's probably an opinion, not a fact.",
      "Facts don't need 'I think' in front of them to be true. If a sentence would only make sense with 'I think...' added, that's a clue it's an opinion.",
    ],
    reasoningInterviewPrompts: [
      "You said that sentence was a fact - could someone reasonably disagree with it? If not, why not?",
      "Rewrite this opinion as if it were a fact, and this fact as if it were an opinion - what changes about the wording?",
    ],
    voiceQaSamples: [
      {
        question: "How do I tell a fact from an opinion?",
        answer:
          "Ask if it can be proven true or false - that's a fact. If it's about what someone thinks, feels, or believes, and someone else could reasonably think differently, that's an opinion.",
      },
      {
        question: "Can a sentence be both a fact and an opinion?",
        answer:
          "Not the exact same part, but a sentence can contain both - like 'The story is 10 pages long (fact) and it's a bit too short (opinion).' The trick is spotting where the fact ends and the opinion starts.",
      },
    ],
    illustrationKey: "fact_vs_opinion_scale",
    illustrationCaption: "Provable vs. personal",
  },
  {
    conceptKey: "1.8",
    name: "Idiomatic phrases",
    difficulty: "intermediate",
    bookPages: [17],
    storyReferenceTitle: "The Elephant who lost his Patience (a fable from India)",
    storyReferenceSynopsis:
      "An ant who teases every animal in the jungle finally pushes King Elephant too far - a story that leans on idiomatic phrases like 'hold your tongue' and 'out of hand.'",
    definition:
      "An idiomatic phrase (or idiom) is a group of words that means something different from what the individual words literally say - you have to know the phrase as a whole to understand it.",
    keyPoints: [
      "Idioms usually can't be worked out word-by-word - 'it's raining cats and dogs' has nothing to do with actual animals falling from the sky.",
      "Idioms often describe feelings, warnings, or advice in a more colourful way than saying it plainly.",
      "Because idioms are cultural, they can confuse someone who hasn't heard that exact phrase before - even if they know every individual word in it.",
    ],
    examples: [
      "'Break a leg!' doesn't mean an actual injury - it's an idiom meaning 'good luck', often said before a performance.",
      "'She let the cat out of the bag' doesn't involve a real cat - it means she accidentally revealed a secret.",
    ],
    tipsToRemember: [
      "If a phrase makes no literal sense in context (no cat was ever mentioned before), that's a strong sign it's an idiom, not a literal statement.",
      "When you meet a new idiom, try to guess its meaning from how it's used in the sentence before looking it up - it trains you to spot the pattern.",
    ],
    reasoningInterviewPrompts: [
      "If someone translated this idiom word-for-word into another language, would it make any sense? What does that tell you about idioms?",
      "Can you think of an idiom you already know, and explain what it actually means versus what the words literally say?",
    ],
    voiceQaSamples: [
      {
        question: "What's an idiomatic phrase?",
        answer:
          "It's a group of words where the meaning of the whole phrase is different from what the individual words say. Like 'it cost an arm and a leg' - it just means something was very expensive, not an actual body part!",
      },
      {
        question: "How do I figure out what an idiom means if I've never heard it before?",
        answer:
          "Look at the sentence around it for clues about the feeling or situation, since idioms are almost never meant literally. If it still doesn't make sense, that's a good sign to ask someone or look it up.",
      },
    ],
    illustrationKey: "idiom_literal_vs_meaning",
    illustrationCaption: "Words that don't mean what they say",
  },
  {
    conceptKey: "1.9",
    name: "Sentence types: simple, compound, complex (multi-clause) + connectives",
    difficulty: "advanced",
    bookPages: [16],
    definition:
      "Sentences can be simple (one idea), compound (two equal ideas joined by 'and', 'but', or 'or'), or complex/multi-clause (a main idea joined to a dependent clause using a connective like 'because', 'although', or 'when').",
    keyPoints: [
      "A simple sentence has just one main clause: one subject, one main verb, one complete idea - e.g. 'The dog barked.'",
      "A compound sentence joins two simple sentences with 'and', 'but', or 'or' - both halves could stand alone as their own sentence.",
      "A complex (multi-clause) sentence joins a main clause to a dependent clause that can't stand alone, using a connective like 'because', 'although', 'when', 'while', or 'after' - and needs a comma when the dependent clause comes first.",
    ],
    examples: [
      "Simple: 'The kangaroo jumped.' Compound: 'The kangaroo jumped, but it missed the branch.' Complex: 'Although it was tired, the kangaroo kept jumping.'",
      "'Because the fire had gone out, they couldn't cook dinner' is complex - the comma comes after the dependent clause ('Because the fire had gone out') since it comes first in the sentence.",
    ],
    tipsToRemember: [
      "Test a compound sentence by splitting it at 'and'/'but'/'or' - if both halves make sense alone, it's compound. A complex sentence fails this test - the dependent-clause half won't make sense alone.",
      "When the dependent clause starts the sentence (starts with 'Because', 'Although', 'When'...), put a comma before the main clause. When the main clause comes first, you usually don't need one.",
    ],
    reasoningInterviewPrompts: [
      "You wrote a long sentence - is it actually compound, complex, or just two ideas stuck together without the right punctuation?",
      "Could you rewrite this simple sentence as a complex one? What connective would you use, and why does that one fit best?",
    ],
    voiceQaSamples: [
      {
        question: "What's the difference between a compound and a complex sentence?",
        answer:
          "In a compound sentence, both halves could be their own complete sentence, joined by 'and', 'but', or 'or'. In a complex sentence, one half (the dependent clause) can't stand alone - it needs a connective like 'because' or 'although' and relies on the main clause to make full sense.",
      },
      {
        question: "When do I need a comma in a complex sentence?",
        answer:
          "If the dependent clause comes first - starting with a word like 'Because', 'When', or 'Although' - put a comma right after it, before the main clause. If the main clause comes first, you usually don't need a comma.",
      },
    ],
    illustrationKey: "sentence_types_blocks",
    illustrationCaption: "Building bigger sentences, one clause at a time",
  },
];

async function main() {
  const unit = await db.unit.findUnique({ where: { unitKey: "cambridge-5-english-1" } });
  if (!unit) throw new Error("Unit cambridge-5-english-1 not found - run prisma/seed.ts first.");

  for (const d of DRAFTS) {
    const existing = await db.concept.findUnique({
      where: { unitId_conceptKey: { unitId: unit.id, conceptKey: d.conceptKey } },
    });
    if (!existing) {
      console.warn(`Skipping ${d.conceptKey} - no existing outline row found.`);
      continue;
    }

    await db.concept.update({
      where: { id: existing.id },
      data: {
        status: "drafted",
        source: "hand_authored",
        difficulty: d.difficulty,
        bookPages: d.bookPages,
        storyReferenceTitle: d.storyReferenceTitle ?? null,
        storyReferenceSynopsis: d.storyReferenceSynopsis ?? null,
        definition: d.definition,
        keyPoints: d.keyPoints,
        examples: d.examples,
        tipsToRemember: d.tipsToRemember,
        reasoningInterviewPrompts: d.reasoningInterviewPrompts,
        voiceQaSamples: d.voiceQaSamples,
        illustrationKey: d.illustrationKey,
        illustrationCaption: d.illustrationCaption,
      },
    });
    console.log(`Updated ${d.conceptKey} - ${d.name}`);
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await db.$disconnect();
    process.exit(1);
  });
