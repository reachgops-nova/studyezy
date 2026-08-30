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

export type WidgetSpec =
  | ClueDetectiveSpec
  | SentenceTrainSpec
  | LifeMountainSpec
  | PrefixMachineSpec;

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
};

export function getWidgetForConcept(conceptId: string): InteractiveWidget | undefined {
  return WIDGETS_BY_CONCEPT[conceptId];
}
