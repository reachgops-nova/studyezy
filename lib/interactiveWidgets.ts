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

  // 2026-09-05: Units 2 (remainder) through 9's widgets - all grounded in the
  // real Hodder Cambridge Primary English Learner's Book 5, re-read page by
  // page (content/textbook-pages has Unit 1's own scans; these later pages
  // were read directly from the PDF, not re-saved as repo assets - only
  // Unit 1 has a live booklet gallery today). Same discipline as the rest
  // of this file: no invented content, and each concept reuses whichever
  // existing widget kind's real mechanic actually fits, not just its name.

  "2.3": {
    id: "W17",
    title: "Formal or Informal?",
    instruction: "Register means choosing language to suit your audience. Read the situation, then choose the register that fits.",
    spec: {
      kind: "predictive_brancher",
      scenario: "You are writing a news report about an important event, for a serious, general audience.",
      choices: [
        { text: "A formal register - precise, serious language, no slang.", correct: true, feedback: "Exactly! A news report needs a formal register - the audience expects careful, serious reporting, not casual chat." },
        { text: "A chatty, informal register full of slang, like texting a friend.", correct: false, feedback: "Not for a news report - that casual register would undermine how seriously the audience takes the report." },
      ],
    },
  },

  "2.4": {
    id: "W18",
    title: "Find a Stronger Synonym",
    instruction: "Good writers vary their vocabulary instead of repeating the same word. Tap each overused word, then tap its stronger synonym.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "hit (overused)", meaning: "strike" },
        { idiom: "beat (overused)", meaning: "annihilate" },
        { idiom: "best (overused)", meaning: "victorious" },
        { idiom: "opponent (overused)", meaning: "adversary" },
      ],
    },
  },

  "2.5": {
    id: "W19",
    title: "Fact or Opinion in a Biography?",
    instruction: "A fact can be proven true. An opinion is a belief, even one many people share. Sort this line from Joey Alexander's biography.",
    spec: {
      kind: "fact_opinion",
      statements: [
        { text: "Many people believed Joey Alexander was the world's best young musician.", answer: "Opinion", hint: "'Best' is a judgement - impossible to prove, even if lots of people agree." },
      ],
    },
  },

  "3.1": {
    id: "W20",
    title: "Count the Syllables",
    instruction: "Narrative poems are built from words and their syllables. Tap each word, then tap how many syllables it has.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "bat", meaning: "1 syllable" },
        { idiom: "orange", meaning: "2 syllables" },
        { idiom: "tomato", meaning: "3 syllables" },
        { idiom: "mysterious", meaning: "4 syllables" },
      ],
    },
  },

  "3.2": {
    id: "W21",
    title: "What Does This Suggest About Neil?",
    instruction: "In Valerie Bloom's poem, Neil keeps insisting he must 'teck a sandwich' even though Granny Lenore offers delicious home-cooked food instead. What does this suggest about Neil's character?",
    spec: {
      kind: "predictive_brancher",
      scenario: "Neil repeats that he must 'teck a sandwich', even as Granny Lenore piles up corn pone, chicken and jerk meat for him to take instead.",
      choices: [
        { text: "He genuinely dislikes his grandmother's cooking.", correct: false, feedback: "The poem never suggests Neil dislikes the food - he even ends up wishing he could bring it!" },
        { text: "He wants to fit in and follow what he was told to bring, even when a better option is right there.", correct: true, feedback: "Exactly! Neil repeating 'teck a sandwich' suggests he cares about following the rule and fitting in with the other children." },
      ],
    },
  },

  "3.3": {
    id: "W22",
    title: "Punctuate the Dialogue",
    instruction: "A reporting clause can come before, after, or inside direct speech - each needs its own punctuation. Tap the unpunctuated line, then tap its correctly punctuated version.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "Where asked the teacher is your sandwich", meaning: "'Where,' asked the teacher, 'is your sandwich?'" },
        { idiom: "Make sure you bring a sandwich said the teacher", meaning: "'Make sure you bring a sandwich,' said the teacher." },
      ],
    },
  },

  "3.4": {
    id: "W23",
    title: "What Does This Metaphor Mean?",
    instruction: "A metaphor says one thing IS another to create a strong image. Tap each metaphor, then tap what it really means.",
    spec: {
      kind: "trait_matcher",
      pairs: [
        { character: "Her anger is a volcano.", trait: "Her anger can suddenly explode powerfully, like a volcano erupting." },
        { character: "His heart is a stone.", trait: "He is cold and shows no feeling, as hard and unfeeling as a stone." },
        { character: "The moon was a ghostly ship upon the cloudy seas.", trait: "The moon looks pale and drifts silently across the sky, like a ship sailing at night." },
      ],
    },
  },

  "3.5": {
    id: "W24",
    title: "Spot the Personification",
    instruction: "Personification describes something not human as if it were a person. Tap the highlighted parts of 'Emily Hurricane' to see the personification.",
    spec: {
      kind: "biography_scanner",
      passage: [
        { text: "Woke up this morning to a breakfast sky, fed the kitten marmalade, had some sunshine in my tea, and then went out to greet the day, met " },
        { text: "Miss Emily Hurricane", feature: "🌪️ Personification - a hurricane is given a human name and title, 'Miss'." },
        { text: ". She said, 'Wouldn't you like to swim in the sky, " },
        { text: "sail with the trees as they go whizzing by, dance with the rooftops", feature: "💃 Personification - the wind is described doing human actions: sailing and dancing." },
        { text: " as they go bubbling?' " },
        { text: "She had silver hair but it was kind of wild, electricity for eyes and a crackling laugh", feature: "😄 Personification - the hurricane is given human hair, eyes, and a laugh." },
        { text: "." },
      ],
    },
  },

  "4.1": {
    id: "W25",
    title: "Features of an Information Text",
    instruction: "Information texts share common features. Match each feature to its real example.",
    spec: {
      kind: "trait_matcher",
      pairs: [
        { character: "Sub-headings and sections", trait: "Break the text into topics so a reader can find information quickly." },
        { character: "Diagrams and pictures with labels", trait: "Show what something looks like or how it works, like a volcano cross-section." },
        { character: "Technical vocabulary", trait: "Specific words for the topic, such as 'lava', 'magma' and 'ash cloud' for a volcano text." },
      ],
    },
  },

  "4.2": {
    id: "W26",
    title: "Spot the Explanation Process",
    instruction: "An explanation text describes a process in order, often using time words. Tap the highlighted parts of this passage about sea ice.",
    spec: {
      kind: "biography_scanner",
      passage: [
        { text: "During the short polar summer, some ice melts. " },
        { text: "Over time", feature: "⏳ Time-order word - shows this process happens in stages." },
        { text: ", this grease ice thickens up and forms discs. " },
        { text: "Eventually", feature: "⏳ Time-order word - signals the next stage in the process." },
        { text: ", as these discs are pushed together, they jam together to build an ice floe, and " },
        { text: "finally they join up to form a mighty sheet of pack ice", feature: "✅ Final stage - explanations often end by showing the finished result." },
        { text: "." },
      ],
    },
  },

  "4.3": {
    id: "W27",
    title: "How Do You Scan For This?",
    instruction: "Scanning tips depend on the question word. Read the scenario, then choose the right scanning strategy.",
    spec: {
      kind: "predictive_brancher",
      scenario: "You need to answer 'Where do coral reefs form?' while scanning the Coral Reefs information text.",
      choices: [
        { text: "Look for a specific place in the answer, like 'warm shallow seas' or 'The Great Barrier Reef'.", correct: true, feedback: "Right - 'where' questions need a place in the answer, exactly as the text's own scanning tips say." },
        { text: "Look for a list of numbered steps.", correct: false, feedback: "That's how you'd scan a 'how' question - a 'where' question needs a place, not a process." },
      ],
    },
  },

  "4.4": {
    id: "W28",
    title: "Register and Suffixes",
    instruction: "Information texts vary in style, and use suffixes to build topic words. Match each item to what it means.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "Presents facts with a serious, impersonal tone", meaning: "Formal style" },
        { idiom: "Uses simple language with fun features like alliteration and rhyme", meaning: "Informal style" },
        { idiom: "-graphy suffix, as in biography", meaning: "means 'writing'" },
        { idiom: "-ology suffix, as in biology", meaning: "means 'the study of something'" },
      ],
    },
  },

  "5.1": {
    id: "W29",
    title: "What Does This Verb Choice Suggest?",
    instruction: "Writers choose specific verbs and adverbs to show feelings without stating them directly.",
    spec: {
      kind: "predictive_brancher",
      scenario: "The writer chooses 'Hugo trudged up the staircase... reluctantly... with heavy footsteps' instead of simply 'Hugo walked up the stairs'.",
      choices: [
        { text: "Hugo is excited and eager to reach the top.", correct: false, feedback: "'Trudged reluctantly' is the opposite of eager - that word choice suggests the climb feels unwanted." },
        { text: "Hugo feels tired or unwilling - the climb feels like hard, unwanted work.", correct: true, feedback: "Exactly! 'Trudged', 'reluctantly' and 'heavy footsteps' all work together to suggest Hugo doesn't want to make this climb." },
      ],
    },
  },

  "5.2": {
    id: "W30",
    title: "Concrete or Abstract Noun?",
    instruction: "Concrete nouns are physical things; abstract nouns are ideas. Tap each noun, then tap its type.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "clocks", meaning: "Concrete noun - a physical thing you can touch or see" },
        { idiom: "knowledge", meaning: "Abstract noun - an idea, not something physical" },
        { idiom: "automaton", meaning: "Concrete noun - a physical wind-up machine" },
        { idiom: "imagination", meaning: "Abstract noun - a thought, not something physical" },
      ],
    },
  },

  "5.3": {
    id: "W31",
    title: "Film Shot Types",
    instruction: "Storyboards plan how a story becomes a film. Match each shot type to what it shows the audience.",
    spec: {
      kind: "trait_matcher",
      pairs: [
        { character: "Close-up", trait: "Shows a character's face in detail, so the audience can see their exact feelings." },
        { character: "Low-angle shot", trait: "Makes the character or object seem more important or powerful." },
        { character: "High-angle shot", trait: "Makes the character seem less powerful." },
        { character: "Over-the-shoulder shot", trait: "Shows events from a character's own viewpoint." },
      ],
    },
  },

  "6.1": {
    id: "W32",
    title: "Match the Adverb and Adjective",
    instruction: "Writers pair adverbs with adjectives to intensify feeling. Tap each adverb, then tap the adjective it pairs with in the extract.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "bitterly", meaning: "disappointed" },
        { idiom: "highly", meaning: "confident" },
        { idiom: "completely", meaning: "overwhelmed" },
        { idiom: "painfully", meaning: "shy" },
      ],
    },
  },

  "6.2": {
    id: "W33",
    title: "Use the Context Clues",
    instruction: "You can often work out an unfamiliar word's meaning from the words around it, without a dictionary.",
    spec: {
      kind: "predictive_brancher",
      scenario: "In the extract, the roc's talons are described as 'frighteningly sharp, like Damascus steel blades' as they slash down on the snake's skin.",
      choices: [
        { text: "The surrounding words 'frighteningly sharp' and the action of 'slashing down' - these tell you Damascus steel blades must be dangerously sharp.", correct: true, feedback: "Exactly! Even without knowing the phrase, the surrounding words give you a strong context clue." },
        { text: "The word 'Damascus' just sounds like a sharp word.", correct: false, feedback: "Not quite - it's the surrounding description ('frighteningly sharp', 'slashing') that gives the real clue, not how the word sounds." },
      ],
    },
  },

  "6.3": {
    id: "W34",
    title: "Possibility or Certainty?",
    instruction: "Modal verbs show how possible or certain something is. Match each example to what it shows.",
    spec: {
      kind: "trait_matcher",
      pairs: [
        { character: "My keys might be in my bag.", trait: "Possibility - it's possible, but not certain." },
        { character: "The storm could get worse.", trait: "Possibility - things could still change." },
        { character: "We couldn't have won that race!", trait: "Certainty about the past - looking back, it was impossible." },
      ],
    },
  },

  "6.4": {
    id: "W35",
    title: "Complete the Adverbial Phrase",
    instruction: "Adverbial phrases (often -ing forms) add vivid detail to a sentence. Tap each sentence opener, then tap the phrase that completes it.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "The raft moved uncertainly, ...", meaning: "tossing and turning in the current." },
        { idiom: "Sinbad stared ahead, ...", meaning: "holding his breath." },
        { idiom: "Suddenly, a light appeared, ...", meaning: "gleaming in the darkness." },
      ],
    },
  },

  "6.5": {
    id: "W36",
    title: "What's the Theme?",
    instruction: "Classic literature often carries a bigger theme beyond the story itself. Match each voyage summary to its theme.",
    spec: {
      kind: "trait_matcher",
      pairs: [
        { character: "\"I learned my lesson about the folly of being selfish and the benefits of working together.\"", trait: "Theme: teamwork matters more than acting alone." },
        { character: "\"I set up an organisation that promoted the good care of the animals we use.\"", trait: "Theme: caring for animals and treating them kindly." },
        { character: "\"I am reminded that there is great power in storytelling.\"", trait: "Theme: stories have the power to shape who we are." },
      ],
    },
  },

  "7.1": {
    id: "W37",
    title: "Reading a Playscript",
    instruction: "A playscript uses a specific layout. Tap the highlighted parts of this line to see what each part is for.",
    spec: {
      kind: "biography_scanner",
      passage: [
        { text: "LITTLE OLD MAN", feature: "🎭 Character name in capitals - tells the actor whose line comes next." },
        { text: ": " },
        { text: "[Whispering]", feature: "🎬 Stage direction - tells the actor HOW to say the line." },
        { text: " You see this? ", feature: "💬 The actual words the actor speaks aloud." },
        { text: "[Waving the bag in front of JAMES' face]", feature: "🎬 Stage direction - tells the actor WHAT to do while speaking." },
      ],
    },
  },

  "7.2": {
    id: "W38",
    title: "Stagecraft Effects",
    instruction: "Lighting, sound and movement all help tell a story on stage. Match each stagecraft choice to its effect.",
    spec: {
      kind: "trait_matcher",
      pairs: [
        { character: "Flashing lights", trait: "Lets the audience only partly see what's happening - builds tension." },
        { character: "Creaking and groaning sounds", trait: "Suggests something heavy is beginning to move, even before you see it." },
        { character: "Characters spinning slowly in a circle", trait: "Shows a giant peach beginning to roll, without a real peach on stage." },
      ],
    },
  },

  "7.3": {
    id: "W39",
    title: "Direct to Reported Speech",
    instruction: "Reported speech changes the verb tense and sometimes the pronoun. Tap each direct-speech line, then tap its reported-speech version.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "\"I like spaghetti.\" (direct)", meaning: "He said that he liked spaghetti. (reported)" },
        { idiom: "\"I bought a new bike.\" (direct)", meaning: "He said that he had bought a new bike. (reported)" },
        { idiom: "\"I will see you later.\" (direct)", meaning: "She said that she would see me later. (reported)" },
        { idiom: "\"I should polish my boots.\" (direct, modal)", meaning: "He said that he should polish his boots. (modal verbs don't change!)" },
      ],
    },
  },

  "7.4": {
    id: "W40",
    title: "Whose Viewpoint Is This?",
    instruction: "In a play, different characters on stage at once can react very differently to the same moment.",
    spec: {
      kind: "predictive_brancher",
      scenario: "Centipede shouts 'That's ridiculous! I don't believe it!' about the Cloud-Men making hailstones in summer, while James is fascinated and excited by the same thing.",
      choices: [
        { text: "All characters in a play must always agree with each other.", correct: false, feedback: "Not at all - that would make for a very flat play! Real characters react differently." },
        { text: "Different characters on stage at the same moment can have completely different reactions and viewpoints.", correct: true, feedback: "Exactly! James's excitement and Centipede's disbelief show two genuine viewpoints existing side by side." },
      ],
    },
  },

  "8.1": {
    id: "W41",
    title: "Unstressed Vowel Sounds",
    instruction: "Some vowel-plus-r spellings sound like 'uh' when unstressed. Tap each spelling pattern, then tap a word that uses it.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "er (unstressed, sounds like 'uh')", meaning: "water" },
        { idiom: "ar (unstressed, sounds like 'uh')", meaning: "dollar" },
        { idiom: "or (unstressed, sounds like 'uh')", meaning: "sailor" },
        { idiom: "ur (unstressed, sounds like 'uh')", meaning: "lemur" },
      ],
    },
  },

  "8.2": {
    id: "W42",
    title: "Spot the Sound Devices",
    instruction: "Poets use repetition and alliteration to build rhythm. Tap the highlighted parts of 'The Coromandel Fishers'.",
    spec: {
      kind: "biography_scanner",
      passage: [
        { text: "Rise, brothers, rise", feature: "🔁 Repetition - repeating the word for rhythm and urgency." },
        { text: "; the wakening skies pray to the morning light, the wind lies asleep in the arms of the dawn like a child that has cried all night. " },
        { text: "Row, brothers, row", feature: "🔁 Repetition + alliteration - repeats for rhythm, and the R sounds echo each other." },
        { text: " to the edge of the verge, where the low sky mates with the sea." },
      ],
    },
  },

  "8.3": {
    id: "W43",
    title: "One Word, Many Meanings",
    instruction: "A homonym is spelled and sounds the same but has different meanings. Tap each use of 'bow', then tap its meaning.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "tie a bow in your shoelaces", meaning: "bow = a knot with two loops" },
        { idiom: "use a bow to play a violin", meaning: "bow = the stick used to play a stringed instrument" },
        { idiom: "take a bow after the performance", meaning: "bow = bending forward to show thanks" },
      ],
    },
  },

  "8.4": {
    id: "W44",
    title: "What Mood Does This Create?",
    instruction: "Writers create mood through their choice of details and language.",
    spec: {
      kind: "predictive_brancher",
      scenario: "\"Jo strolled along in the sunshine, whistling her favourite tune.\"",
      choices: [
        { text: "A positive, happy mood - 'strolled', 'sunshine' and 'whistling a favourite tune' all suggest calm happiness.", correct: true, feedback: "Exactly right! Every word choice here builds a calm, happy mood." },
        { text: "A negative, fearful mood.", correct: false, feedback: "Not this line - words like 'sunshine' and 'favourite tune' are warm and positive, not fearful." },
      ],
    },
  },

  "8.5": {
    id: "W45",
    title: "Common Exception Words",
    instruction: "Some words don't follow common spelling rules and must be learned by sight. Match each word to its memory aid.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "necessary", meaning: "Mnemonic: 'Never Eat Cake, Eat Salad Sandwiches And Remain Young'." },
        { idiom: "efficient", meaning: "Breaks the 'i before e except after c' rule - learn it by sight." },
        { idiom: "ancient", meaning: "Also breaks the usual ie/ei rule - learn it by sight." },
      ],
    },
  },

  "9.1": {
    id: "W46",
    title: "Persuasive Devices",
    instruction: "Persuasive texts use specific devices to convince a reader. Match each device to its real example.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "Rhetorical question", meaning: "\"Can you imagine the perfect sunset?\" - not meant to be answered, just to make the reader think." },
        { idiom: "Exaggeration", meaning: "\"The most amazing ride in the world\" - makes something sound bigger than it really is." },
        { idiom: "Alliteration", meaning: "\"Dan's delicious doughnuts\" - repeating the same starting sound for effect." },
        { idiom: "Imperative verb", meaning: "\"Take a ride with us!\" - a command that tells the reader what to do." },
      ],
    },
  },

  // No single clean "countable/uncountable nouns" page was found near this
  // concept's cited page (163) - that page turned out to repeat the
  // facts/opinions content from 9.3 instead. Grounded in this unit's own
  // recurring ocean/plastic-pollution theme (pages 156-163) rather than
  // invented from nothing.
  "9.2": {
    id: "W47",
    title: "Countable or Uncountable?",
    instruction: "Countable nouns can be counted one by one; uncountable nouns need a quantifier instead. Tap each noun, then tap its type.",
    spec: {
      kind: "idiom_connector",
      items: [
        { idiom: "bottle (countable)", meaning: "one bottle, two bottles, 'a few bottles'" },
        { idiom: "plastic (uncountable)", meaning: "not 'two plastics' - 'a lot of plastic', 'some plastic'" },
        { idiom: "ocean (countable)", meaning: "one ocean, several oceans" },
        { idiom: "water (uncountable)", meaning: "'a lot of water', 'a little water', not 'two waters'" },
      ],
    },
  },

  "9.3": {
    id: "W48",
    title: "Fact, Opinion, or Viewpoint?",
    instruction: "Persuasive writing mixes facts, opinions, and an overall viewpoint. Sort this real statement about the ocean.",
    spec: {
      kind: "fact_opinion",
      statements: [
        { text: "The oceans are a fantastic, vast and wonderful playground for swimming, snorkelling, splashing and surfing!", answer: "Opinion", hint: "Words like 'fantastic' and 'wonderful' are the writer's own feelings, not provable facts." },
      ],
    },
  },

  "9.4": {
    id: "W49",
    title: "Why Build an Imaginative Picture?",
    instruction: "Persuasive writers sometimes paint a vivid, imaginative picture instead of just stating an opinion plainly.",
    spec: {
      kind: "predictive_brancher",
      scenario: "\"Imagine standing on a spotless beach, staring out at a vast ocean, free of plastic, pulsing with life... Pufflings fly, for the first time, flapping madly against the breeze.\"",
      choices: [
        { text: "It helps the reader FEEL what a plastic-free ocean would be like, making them want to help create that future.", correct: true, feedback: "Exactly! An imaginative picture makes the reader want the future the writer is describing, not just informs them." },
        { text: "It makes the letter sound more like a boring textbook.", correct: false, feedback: "The opposite, really - imaginative description is what makes persuasive writing feel alive, not textbook-dry." },
      ],
    },
  },

  "9.5": {
    id: "W50",
    title: "Persuading Different Audiences",
    instruction: "The same writer needs different language for different audiences.",
    spec: {
      kind: "predictive_brancher",
      scenario: "Greta Thunberg wants to persuade world leaders to act on climate change, and separately wants to persuade her own friends to recycle more.",
      choices: [
        { text: "Yes - the exact same formal speech works equally well for everyone.", correct: false, feedback: "Not quite - a speech written for world leaders would feel stiff and distant to a group of friends." },
        { text: "No - leaders need more formal language and hard facts; friends need informal, relatable language they connect with.", correct: true, feedback: "Exactly right! Choosing language for your audience is central to persuasive writing." },
      ],
    },
  },
};

// WIDGETS_BY_CONCEPT is keyed by bare concept_id ("1.1", "1.2", ...), but
// EVERY subject's concepts are numbered the same "unit.concept" way (see
// lib/claude.ts's extraction prompts, lib/textbookConceptExtraction.ts) - so
// a Math or Science concept can genuinely share an id with one of these,
// e.g. both an English and a Math unit 1 have a concept "1.1". These widgets
// were hand-authored ONLY against studyezy-p1-interactive-specs.json's real
// English Stage 5 units (idioms, fables, prefixes, biography - all English
// Language Arts skills), so a bare-id match with no subject check silently
// hands a Math lesson an English widget whenever the ids happen to collide -
// a real bug reported live 2026-09-08 (Math's "Understanding Tenths and
// Decimals" got a fables Trait Matcher). unitKey scopes the lookup to the
// exact subject these widgets were built for; every other subject correctly
// gets "no widget yet" (WidgetDispatcher's built-in fallback) instead of a
// wrong-subject one, until that subject gets its own authored widgets.
const AUTHORED_WIDGET_SUBJECT_SLUG = "english";

function subjectSlugFromUnitKey(unitKey: string | undefined): string | null {
  if (!unitKey) return null;
  const parts = unitKey.split("-");
  return parts.length === 4 ? parts[2] : null;
}

export function getWidgetForConcept(conceptId: string, unitKey?: string): InteractiveWidget | undefined {
  if (subjectSlugFromUnitKey(unitKey) !== AUTHORED_WIDGET_SUBJECT_SLUG) return undefined;
  return WIDGETS_BY_CONCEPT[conceptId];
}
