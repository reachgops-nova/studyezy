/**
 * Interactive lesson widgets (P1), authored in studyezy-p1-interactive-specs.json.
 *
 * Held as typed static data in the repo rather than as a `Concept` column on
 * purpose: these are authored curriculum content that belongs in git next to
 * the components that render them, they never vary per student, and keeping
 * them here means no Prisma migration and nothing new to seed per unit.
 *
 * Palette note: the source JSON's `theme` block specifies the RETIRED
 * navy/orange/cream identity (#1E293B, #FF6F00, #FFFDD0). These specs are
 * rendered in the live brand tokens instead (see tailwind.config.ts) - ink
 * #16241f, paper #f4f6f1, gold #9c6f1f / #c99a2e. Character colours (skin,
 * hair) are art, not brand, and are kept as authored.
 */

export const WIDGET_INK = "#16241f";
export const WIDGET_PAPER = "#f4f6f1";
export const WIDGET_GOLD = "#9c6f1f";
export const WIDGET_GOLD_BRIGHT = "#c99a2e";

export interface ClueDetectiveSpec {
  kind: "clue_detective";
  sentence: string;
  /** Words rendered as tappable clue buttons, in the order they appear. */
  clues: {
    word: string;
    /** Which part of the face this word reveals. */
    reveals: "wink" | "grin";
    ezySays: string;
  }[];
}

export interface SentenceTrainSpec {
  kind: "sentence_train";
  leftCarriage: string;
  rightCarriage: string;
  couplers: { id: string; label: string; type: "compound" | "complex"; correct: boolean }[];
  ezyOnSuccess: string;
}

export interface LifeMountainSpec {
  kind: "life_mountain";
  /** Bottom-to-top: the climb order IS the chronological order. */
  checkpoints: { adverb: string; description: string; x: number; y: number }[];
  ezyOnComplete: string;
}

export interface PrefixMachineSpec {
  kind: "prefix_machine";
  prefixes: { prefix: string; roots: string[] }[];
  /** Roots the child is asked to fix, paired with the prefix that works. */
  challenges: { root: string; prefix: string }[];
  ezyRemedial: string;
}

export interface TraitMatcherSpec {
  kind: "trait_matcher";
  pairs: { character: string; trait: string }[];
}

export interface PredictiveBrancherSpec {
  kind: "predictive_brancher";
  scenario: string;
  choices: { text: string; correct: boolean; feedback: string }[];
}

export interface FactOpinionSpec {
  kind: "fact_opinion";
  statements: { text: string; answer: "Fact" | "Opinion"; hint: string }[];
}

export interface IdiomConnectorSpec {
  kind: "idiom_connector";
  items: { idiom: string; meaning: string }[];
}

export interface BiographyScannerSpec {
  kind: "biography_scanner";
  /** Split into runs so the tappable phrases stay inside a readable passage. */
  passage: { text: string; feature?: string }[];
}

export type WidgetSpec =
  | ClueDetectiveSpec
  | SentenceTrainSpec
  | LifeMountainSpec
  | PrefixMachineSpec
  | TraitMatcherSpec
  | PredictiveBrancherSpec
  | FactOpinionSpec
  | IdiomConnectorSpec
  | BiographyScannerSpec;

export interface InteractiveWidget {
  id: string;
  title: string;
  /** One line telling the child what to do - shown above the canvas. */
  instruction: string;
  spec: WidgetSpec;
}

/**
 * Keyed by Concept.conceptKey (the same value the app exposes as
 * `concept_id`). A concept with no entry simply renders no widget.
 */
export const WIDGETS_BY_CONCEPT: Record<string, InteractiveWidget> = {
  "1.1": {
    id: "W5",
    title: "Who's Who in the Fable",
    instruction: "Fables show character through what characters do. Match each animal to the trait their actions reveal.",
    spec: {
      kind: "trait_matcher",
      pairs: [
        { character: "Cockerel", trait: "Helpful and polite - does chores for his friend" },
        { character: "Hyena", trait: "Lazy and fearful - easily tricked by the 'fire' on Cockerel's head" },
      ],
    },
  },

  "1.4": {
    id: "W6",
    title: "What Happens Next?",
    instruction: "Good readers predict using clues they already have. Read the moment, then choose what Hyena does next.",
    spec: {
      kind: "predictive_brancher",
      scenario:
        "Hyena arrives at Cockerel's house in the dark. Cockerel is fast asleep. Hyena tip-toes up...",
      choices: [
        {
          text: "Hyena will run away screaming.",
          correct: false,
          feedback:
            "Hyena is cowardly, but he really wants the fire. Why walk all that way just to run off before even trying?",
        },
        {
          text: "Hyena will touch Cockerel's red comb with a small stick.",
          correct: true,
          feedback:
            "Spot on! Hyena uses a small stick to touch the red spiky comb, hoping to steal fire without burning himself.",
        },
      ],
    },
  },

  "1.7": {
    id: "W7",
    title: "Fact or Opinion?",
    instruction: "A fact can be checked. An opinion is what somebody thinks. Sort all four.",
    spec: {
      kind: "fact_opinion",
      statements: [
        { text: "Oceans cover more than two-thirds of our planet.", answer: "Fact", hint: "This can be measured by scientists." },
        { text: "The ocean is beautiful and relaxing.", answer: "Opinion", hint: "Someone afraid of deep water might disagree!" },
        { text: "Cockerel has a red spiky comb on his head.", answer: "Fact", hint: "This is a physical description everyone can see." },
        { text: "Hyena made a very silly mistake.", answer: "Opinion", hint: "The word 'silly' is a personal judgement." },
      ],
    },
  },

  "1.8": {
    id: "W8",
    title: "The Idiom Connector",
    instruction: "An idiom does not mean what its words literally say. Tap an idiom, then tap what it really means.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "A piece of cake", meaning: "Very easy to do" },
        { idiom: "Out of hand", meaning: "Getting out of control" },
        { idiom: "Cut corners", meaning: "Doing something quickly and poorly to save time" },
      ],
    },
  },

  "2.1": {
    id: "W9",
    title: "Biography Feature Scanner",
    instruction: "Tap the highlighted parts of this real biography opening to see which biography feature each one is.",
    spec: {
      kind: "biography_scanner",
      passage: [
        { text: "Poorna Malavath was born " },
        { text: "on 10 June 2000", feature: "📅 Date and fact - sets the historical timeline." },
        { text: " in a farming family in " },
        { text: "Telangana", feature: "📍 Place name - roots her life in a real location." },
        { text: ", India. From that village, " },
        { text: "she grew up to climb", feature: "👤 Third person - 'she' shows someone else is telling her story." },
        { text: " the highest mountain in the world." },
      ],
    },
  },

  "1.2": {
    id: "W1",
    title: "The Clue Detective",
    instruction: "Writers hide clues instead of telling you things directly. Tap the glowing words to see what Jo is really thinking.",
    spec: {
      kind: "clue_detective",
      sentence: "Jo winked at Charlie and grinned as she placed the chewing gum on the teacher's chair.",
      clues: [
        {
          word: "winked",
          reveals: "wink",
          ezySays: "A wink means she shares a sneaky secret! Look, she is closing one eye.",
        },
        {
          word: "grinned",
          reveals: "grin",
          ezySays: "That cheeky grin means she's up to mischief! She's not just smiling - she's proud of her trick.",
        },
      ],
    },
  },

  "1.9": {
    id: "W2",
    title: "The Sentence Train",
    instruction: "Two carriages, one missing coupler. Pick the joining word that links these two ideas correctly.",
    spec: {
      kind: "sentence_train",
      leftCarriage: "The magpies loved the warmth",
      rightCarriage: "the wombats missed their burrows",
      couplers: [
        { id: "and", label: "and", type: "compound", correct: false },
        { id: "but", label: "but", type: "compound", correct: true },
        { id: "because", label: "because", type: "complex", correct: false },
      ],
      ezyOnSuccess:
        "Woohoo! 'But' shows a contrast. The magpies liked the heat, BUT the wombats hated it and missed their cold underground homes.",
    },
  },

  "2.2": {
    id: "W3",
    title: "Poorna's Life Mountain",
    instruction: "Put Poorna Malavath's life in order, lowest to highest. Tap the events in the order they happened to climb the mountain.",
    spec: {
      kind: "life_mountain",
      checkpoints: [
        { adverb: "First", description: "Born in Pakala village, Telangana (2000)", x: 200, y: 400 },
        { adverb: "Then", description: "Selected for mountaineering school (2013)", x: 225, y: 300 },
        { adverb: "Afterwards", description: "Trained in Darjeeling for eight months", x: 235, y: 180 },
        { adverb: "Eventually", description: "Summitted Mt Everest (May 2014)", x: 250, y: 70 },
      ],
      ezyOnComplete:
        "Amazing! Adverbs of time organise a biography. First she was born, then she trained, and eventually she reached the highest peak in the world.",
    },
  },

  // Real seeded conceptKey for "Prefixes & Suffixes" is 2.6 - Unit 2 gained
  // three new concepts (2.3-2.5) ahead of it once the unit was filled out
  // with real textbook pages, see prisma/seed.ts.
  "2.6": {
    id: "W4",
    title: "The Prefix Machine",
    instruction: "Every word below needs the prefix that flips it to its opposite. Pick the gear that meshes.",
    spec: {
      kind: "prefix_machine",
      prefixes: [
        { prefix: "un-", roots: ["happy", "equal", "well"] },
        { prefix: "dis-", roots: ["agree", "obey", "approve"] },
        { prefix: "im-", roots: ["possible", "patient", "mature"] },
        { prefix: "il-", roots: ["legal", "logical"] },
        { prefix: "ir-", roots: ["responsible", "regular"] },
      ],
      challenges: [
        { root: "happy", prefix: "un-" },
        { root: "obey", prefix: "dis-" },
        { root: "possible", prefix: "im-" },
        { root: "legal", prefix: "il-" },
        { root: "responsible", prefix: "ir-" },
      ],
      ezyRemedial:
        "Remember the spelling rule! Use 'dis-' for actions like disobey, but feelings like happy take 'un-' to become unhappy.",
    },
  },

  // 2026-09-05: Unit 1 concepts 1.3, 1.5, 1.6, 1.10, 1.11, 1.12, 1.13 had no
  // widget at all (real gap reported live) - all seven grounded directly in
  // the real "Why Cockerels Crow" / "Why Monkeys Live in Trees" / "The
  // Broath with the Rocks" fables and their surrounding exercises (Hodder
  // Cambridge Primary English Learner's Book 5, pages 6, 12, 18, 19, 23,
  // 25), re-read page by page rather than invented, same discipline as the
  // rest of this file. No new widget component needed - all seven reuse an
  // existing kind whose real mechanic fits the content, not just its name.
  "1.3": {
    id: "W10",
    title: "Spot the Explicit Details",
    instruction:
      "Explicit meaning is what a writer tells you directly - no reading between the lines needed. Tap the highlighted parts of this passage from 'Why Cockerels Crow' to see what each one states outright.",
    spec: {
      kind: "biography_scanner",
      passage: [
        { text: "Everyone admired Cockerel because he had " },
        { text: "a bright red spiky comb on top of his head", feature: "📋 Explicit detail - directly describes what Cockerel looks like. No guessing needed." },
        { text: ". The first time, " },
        { text: "Hyena ploughed his field for free", feature: "✅ Explicit action - states exactly what Hyena did." },
        { text: "! Cockerel sat in the shade and watched, " },
        { text: "with his feet up on an old table under the trees", feature: "📍 Explicit detail - tells us exactly where and how Cockerel was resting." },
        { text: "." },
      ],
    },
  },

  "1.5": {
    id: "W11",
    title: "Whose Side Are You On?",
    instruction:
      "Perspective (point of view) means how a character sees and explains their own actions. Read the moment from 'Why Monkeys Live in Trees', then choose the explanation that makes sense FROM MONKEY'S side of the story.",
    spec: {
      kind: "predictive_brancher",
      scenario:
        "Monkey happily picks the fleas from Lioness's fur until she falls asleep - then ties her tail to a tree in a big bow and creeps away laughing. From Monkey's own point of view, why might he have played this trick?",
      choices: [
        {
          text: "Monkey is simply cruel and enjoys hurting others.",
          correct: false,
          feedback:
            "Monkey helped Lioness kindly at first - that doesn't fit someone who's just cruel. Think about how lions usually treat monkeys in the wild.",
        },
        {
          text: "Lioness is a predator who could easily hunt him - from his side, trapping her feels like protecting himself, with a bit of cheeky payback for once being the smaller animal.",
          correct: true,
          feedback:
            "Exactly! Seen from Monkey's side - a small animal lions normally hunt - his trick looks like self-protection and cheek, not pure cruelty. That's what perspective does: the same action reads differently depending on whose side you're standing on.",
        },
      ],
    },
  },

  "1.6": {
    id: "W12",
    title: "Proofread It!",
    instruction:
      "Good writers proofread (check) their work before calling it finished. This sentence from 'The Broath with the Rocks' has five mistakes - tap each wrong word on the left, then tap its correction on the right.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "new", meaning: "knew - spelling (past tense of 'know')" },
        { idiom: "hadnt", meaning: "hadn't - missing apostrophe for 'had not'" },
        { idiom: "nightfal", meaning: "nightfall - missing a letter" },
        { idiom: "lites", meaning: "lights - spelling" },
        { idiom: "apeared", meaning: "appeared - missing a letter" },
      ],
    },
  },

  "1.10": {
    id: "W13",
    title: "Climb the Story Mountain",
    instruction:
      "Every fable climbs this same shape. Tap the stages in order, from the calm beginning up to the peak problem and back down to the ending.",
    spec: {
      kind: "life_mountain",
      checkpoints: [
        { adverb: "Beginning", description: "Where the story starts - who the characters are and what normal life looks like.", x: 110, y: 420 },
        { adverb: "Build-up", description: "Something starts to happen that will lead to a problem.", x: 230, y: 280 },
        { adverb: "Problem", description: "The biggest challenge the main character has to face - the peak of the story.", x: 350, y: 90 },
        { adverb: "Resolution", description: "How the character deals with or overcomes the problem.", x: 470, y: 250 },
        { adverb: "Ending", description: "Things settle back down - the story's final, calmer state.", x: 580, y: 400 },
      ],
      ezyOnComplete:
        "Well done! Every story climbs like a mountain - it begins calmly, builds up tension, reaches a problem at the very peak, works towards a resolution, and comes back down to a calm ending.",
    },
  },

  "1.11": {
    id: "W14",
    title: "What Mood Does This Create?",
    instruction:
      "Writers set the mood of a scene through the words they choose, not by naming the mood outright. Read this real example, then choose the mood these specific word choices create.",
    spec: {
      kind: "predictive_brancher",
      scenario:
        "A story's opening paragraph is meant to feel like a lovely place. The writer describes it using the words 'tiny village', 'fertile farmland' and 'perfect'.",
      choices: [
        {
          text: "These word choices create a calm, peaceful mood.",
          correct: true,
          feedback:
            "Exactly! Words like 'tiny', 'fertile' and 'perfect' paint a gentle, contented picture - that's how writers set a mood without ever saying 'this village is peaceful' directly.",
        },
        {
          text: "These word choices create a frightening, tense mood.",
          correct: false,
          feedback:
            "Not quite - 'fertile' and 'perfect' are warm, positive words. A frightening mood would lean on words like 'crumbling', 'shadowy' or 'abandoned' instead.",
        },
      ],
    },
  },

  "1.12": {
    id: "W15",
    title: "Positive, Comparative or Superlative?",
    instruction:
      "Adverbs change form to compare: fast → faster → fastest, but quickly → more quickly → most quickly. Tap each positive form, then tap the form it matches.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "fast (positive)", meaning: "faster - comparative, add -er" },
        { idiom: "quickly (positive)", meaning: "more quickly - comparative, use 'more' for longer adverbs" },
        { idiom: "hard (positive)", meaning: "hardest - superlative, add -est" },
        { idiom: "carefully (positive)", meaning: "most carefully - superlative, use 'most' for longer adverbs" },
      ],
    },
  },

  "1.13": {
    id: "W16",
    title: "The Full Writing Checklist",
    instruction:
      "Before you call a piece of writing finished, run through this checklist. Match each question to why it actually matters.",
    spec: {
      kind: "trait_matcher",
      pairs: [
        { character: "Did you use adjectives, adverbs and adverbial phrases?", trait: "They add detail and help create a clear mood for the reader." },
        { character: "Are commas and full stops used correctly?", trait: "They show the reader exactly where one idea ends and the next begins." },
        { character: "Are apostrophes used correctly?", trait: "They show who something belongs to (Gopi's pen) or shorten two words (didn't)." },
        { character: "Have you correctly punctuated direct speech?", trait: "Speech marks show the reader exactly which words a character actually said." },
      ],
    },
  },
};

export function getWidgetForConcept(conceptId: string): InteractiveWidget | undefined {
  return WIDGETS_BY_CONCEPT[conceptId];
}
