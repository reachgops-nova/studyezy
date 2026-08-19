// One-off content-authoring script: drafts concepts 1.10-1.13 of
// cambridge-5-english-1 (the final four outline concepts, completing Unit 1),
// from textbook pages the user photographed and shared in chat.
//
// Same copyright boundary as prisma/content/unit1-batch2.ts and
// EXTRACTION_SYSTEM_PROMPT in lib/claude.ts: nothing below is copied or
// closely paraphrased from the textbook - every definition, example, and
// prompt is written from scratch, using the photographed pages only to
// identify which concept each page teaches.
//
// Run once against a DATABASE_URL (local, tunnel, or Railway) with:
//   DATABASE_URL=... npx tsx prisma/content/unit1-batch3.ts
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
    conceptKey: "1.10",
    name: "Story structure (the narrative 'mountain': beginning, build up, challenge, problem, problem solved, ending)",
    difficulty: "beginner",
    bookPages: [19],
    storyReferenceTitle: "The Elephant who lost his Patience (a fable from India)",
    storyReferenceSynopsis:
      "An ant who teases every animal in the jungle finally pushes King Elephant too far and gets blasted into the sky - the story's shape, from Ant's teasing to his return, maps neatly onto the narrative mountain.",
    definition:
      "Story structure is the shape a story's events follow from beginning to end. Many stories follow a 'narrative mountain': the beginning sets the scene, then events build up, lead to a challenge, reach a problem (the most tense point), the problem gets solved, and the story reaches its ending.",
    keyPoints: [
      "The 'problem' sits at the top of the mountain - it's the most exciting or tense moment, with everything before it building up and everything after it resolving.",
      "Not every story spends equal time on each stage - a fable might rush through the beginning in a sentence but spend paragraphs on the problem.",
      "Knowing the structure helps you both understand a story you're reading (what stage are we at right now?) and plan one you're writing.",
    ],
    examples: [
      "In a fable about a clever ant who tricks a lion, the build up shows the lion boasting, the challenge is the ant deciding to teach him a lesson, the problem is the trick going wrong, and the ending shows what the lion learned.",
      "If a story jumps straight from 'the beginning' to 'the ending' with no build up or problem in between, it will feel flat - readers expect that rise and fall in tension.",
    ],
    tipsToRemember: [
      "Before writing your own story, sketch the six stages first (even just one phrase each) - it stops you rambling in the middle with no clear problem to solve.",
      "When retelling a story, check you can name its problem in one sentence - if you can't, you probably haven't found the actual turning point yet.",
    ],
    reasoningInterviewPrompts: [
      "Where's the 'problem' - the most tense moment - in this story? How do you know that's the peak, and not an earlier or later moment?",
      "If you removed the 'build up' stage entirely and jumped straight to the problem, what would the story lose?",
    ],
    voiceQaSamples: [
      {
        question: "What is the 'narrative mountain'?",
        answer:
          "It's a way of picturing a story's shape: beginning, build up, challenge, problem, problem solved, ending. The 'problem' is the peak - the most tense or exciting part - with the story building up to it and then coming back down as it gets solved.",
      },
      {
        question: "Do all stories use this structure?",
        answer:
          "Most do, especially fables and adventure stories, but not every story hits every stage in the same order or for the same length. It's a useful pattern to expect, not a strict rule every story must follow exactly.",
      },
    ],
    illustrationKey: "narrative_mountain",
    illustrationCaption: "The shape a story climbs and comes down",
  },
  {
    conceptKey: "1.11",
    name: "Mood created through setting and word choice",
    difficulty: "intermediate",
    bookPages: [20],
    storyReferenceTitle: "The Lion with the Red Eyes (a fable from Somalia)",
    storyReferenceSynopsis:
      "A lion cub with unusual red eyes is treated as an outsider by his village, until his differences end up saving everyone from a dragon.",
    definition:
      "Mood is the feeling or atmosphere a writer creates for the reader - like happiness, sadness, fear, or calm - built mainly through the physical setting a writer chooses and the specific words used to describe it.",
    keyPoints: [
      "The same event can feel completely different depending on the setting and words chosen - a dark, stormy forest creates a different mood than a sunny meadow, even for the same character doing the same thing.",
      "Word connotations matter, not just their literal meaning - 'skinny' and 'slender' can describe the same body, but 'skinny' feels negative and 'slender' feels positive.",
      "A story's theme (what it's really about, like courage or kindness) often works together with mood, but they aren't the same thing - mood is the feeling in a moment, theme is the bigger idea across the whole story.",
    ],
    examples: [
      "'The old house creaked and groaned in the wind, its broken windows staring out like empty eyes' creates a scary mood through word choice ('creaked', 'groaned', 'staring like empty eyes'), not just by saying 'it was scary.'",
      "The same walk through a forest could feel peaceful ('sunlight dappled gently through the leaves') or frightening ('shadows twisted between the trees, and every snap of a twig echoed'), purely through setting and word choice.",
    ],
    tipsToRemember: [
      "Ask which specific words are doing the mood-building work in a sentence - which ones would you have to change to flip a calm scene into a tense one?",
      "When writing your own setting, pick words with the connotation you want (not just any accurate word) - 'ancient' and 'crumbling' both describe an old building, but only one sounds inviting.",
    ],
    reasoningInterviewPrompts: [
      "Which specific words in this description are creating the mood? What happens to the mood if you swap just one of them for a plainer word?",
      "Could the exact same setting be described to create a completely different mood? Try describing it the opposite way.",
    ],
    voiceQaSamples: [
      {
        question: "How is mood different from just describing what a place looks like?",
        answer:
          "Describing a place is just facts - 'the room was old, with a wooden floor.' Creating mood means choosing words that make the reader FEEL something about it - 'the ancient floorboards groaned underfoot, as if the house itself was tired' makes the same room feel eerie, not just old.",
      },
      {
        question: "What's the difference between mood and theme?",
        answer:
          "Mood is the feeling in a specific scene or moment - like tension or calm. Theme is the bigger idea or lesson running through the whole story, like 'being different can be a strength.' A scary mood in one scene doesn't mean the story's theme is about fear.",
      },
    ],
    illustrationKey: "mood_setting_words",
    illustrationCaption: "The same place, painted with different words",
  },
  {
    conceptKey: "1.12",
    name: "Comparative and superlative adverbs",
    difficulty: "intermediate",
    bookPages: [20],
    definition:
      "Adverbs have three forms: positive (the plain form, e.g. 'quickly'), comparative (comparing two things, e.g. 'more quickly' or 'faster'), and superlative (comparing three or more things, e.g. 'most quickly' or 'fastest').",
    keyPoints: [
      "Most adverbs ending in -ly form the comparative and superlative with 'more'/'most' in front, rather than changing the word itself - 'more quickly', 'most quickly', not 'quicklier.'",
      "Some short adverbs add -er/-est directly instead - 'fast' becomes 'faster'/'fastest', not 'more fast.'",
      "A handful of common adverbs are irregular and just have to be learned: 'well' becomes 'better'/'best', 'badly' becomes 'worse'/'worst', 'much' becomes 'more'/'most', 'little' becomes 'less'/'least.'",
    ],
    examples: [
      "Positive: 'Zach played well in the match.' Comparative: 'Masie played better than him.' Superlative: 'Ronan played the best of everyone.'",
      "Positive: 'She ran quickly.' Comparative: 'She ran more quickly than her brother.' Superlative: 'She ran the most quickly of the whole team.'",
    ],
    tipsToRemember: [
      "Comparative compares exactly two things ('better than him'); superlative compares three or more, and almost always needs 'the' in front ('the best').",
      "If an adverb is irregular, don't try to guess a rule for it - just memorise the small set (well/badly/much/little) since there are only a few.",
    ],
    reasoningInterviewPrompts: [
      "Is this comparing exactly two things, or three or more? How does that tell you whether it should be comparative or superlative?",
      "Why do we say 'better' instead of 'more well' or 'gooder'? What does that tell you about irregular words in English?",
    ],
    voiceQaSamples: [
      {
        question: "How do I know whether to use 'more'/'most' or add -er/-est to an adverb?",
        answer:
          "Most adverbs ending in -ly use 'more'/'most' in front, like 'more carefully.' Shorter adverbs that don't end in -ly, like 'fast' or 'hard', usually just add -er/-est instead, like 'faster'/'fastest.'",
      },
      {
        question: "What are the irregular comparative and superlative adverbs?",
        answer:
          "The most common ones are: well -> better -> best, badly -> worse -> worst, much -> more -> most, and little -> less -> least. These don't follow the usual -er/-est or more/most pattern, so they just need to be remembered.",
      },
    ],
    illustrationKey: "adverb_ladder",
    illustrationCaption: "Climbing from good, to better, to best",
  },
  {
    conceptKey: "1.13",
    name: "Full writing checklist applied end-to-end (mood, punctuation, apostrophes, direct speech)",
    difficulty: "advanced",
    bookPages: [25],
    storyReferenceTitle: "The Broath with the Rocks (a fable from Scotland)",
    storyReferenceSynopsis:
      "A hungry traveller tricks a suspicious old man into cooking a real meal by pretending a plain rock can make delicious broth - the two end up sharing the meal as friends.",
    definition:
      "A full writing checklist brings together everything you check before calling a piece of writing finished: does it use adjectives/adverbs/adverbial phrases well, does it make sense, is there a clear setting and mood, and is the punctuation (commas, full stops, apostrophes, direct speech) all correct.",
    keyPoints: [
      "This checklist combines earlier, smaller skills (proofreading, mood, sentence types) into one final pass, rather than teaching anything brand new - it's the 'put it all together' step.",
      "Content checks (does it make sense? is there a clear mood and setting?) and punctuation checks (commas, full stops, apostrophes, direct speech) are different kinds of check - a piece can be perfectly punctuated and still not make sense, or vice versa.",
      "Apostrophes and direct speech punctuation are easy to get wrong even in otherwise strong writing, which is why they get their own specific checklist items instead of being lumped into 'grammar.'",
    ],
    examples: [
      "'The travellers coat was soaked' is missing an apostrophe (should be 'traveller's') - a small error a full read-through checklist would catch even if the sentence otherwise makes perfect sense.",
      "'Where did you get that from he asked' is missing direct speech punctuation - it should read: \"Where did you get that from?\" he asked. Correct content, incorrect punctuation.",
    ],
    tipsToRemember: [
      "Work through a checklist like this in passes, not all at once - one read for mood/setting/sense, a separate read just for commas and full stops, a separate read just for apostrophes and speech marks.",
      "Apostrophes have exactly two jobs - showing possession ('the traveller's rock') or showing a missing letter in a contraction ('hadn't') - if it's doing neither, it probably doesn't belong there.",
    ],
    reasoningInterviewPrompts: [
      "Go through your writing checking only apostrophes this time, ignoring everything else - did you find anything a first read-through missed?",
      "Which item on this checklist do you personally forget most often? Why do you think that one's easy to skip?",
    ],
    voiceQaSamples: [
      {
        question: "Why do I need a whole checklist just to finish a piece of writing?",
        answer:
          "Because there are several different things to check, and trying to catch all of them in one read is hard - a checklist makes sure you don't forget one (like apostrophes) just because you were focused on another (like whether the story makes sense).",
      },
      {
        question: "What are the two jobs an apostrophe can do?",
        answer:
          "Showing something belongs to someone or something, like 'the traveller's rock', or showing a letter's been left out in a contraction, like 'hadn't' instead of 'had not.' If it's not doing one of those two jobs, it probably shouldn't be there.",
      },
    ],
    illustrationKey: "writing_checklist_final",
    illustrationCaption: "Bringing every skill together, one pass at a time",
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
