/**
 * RCRT_GUI_V1 - the Learning Board template.
 *
 * Named so it can be referred to in one word (real user direction
 * 2026-09-14). Everything below is the contract a unit fills in; the player
 * in components/board/DrawingBoard.tsx never changes per subject.
 *
 * The shape of a lesson under RCRT_GUI_V1:
 *   Read    - an intro saying what the chapter covers and what you will be
 *             able to do, then one walkthrough step per concept, each
 *             followed by that concept's worked examples (from the textbook,
 *             with page and source) and its own quick check.
 *   Cover   - the explanation is put away; guided questions where every
 *             option draws its own outcome and names the specific mistake.
 *   Recite  - say the rule back, then written practice to work on paper.
 *   Test    - graded, set on material not seen while teaching, plus the
 *             unit's own question papers. First answer is final.
 *   Results - readiness score, written into the same mastery record the
 *             Prep Plan and Progression Test already read.
 *
 * Stages available: grid, numberLine, text, diagram, bar, chart, timeline,
 * map. A frame picks its own stage, so one unit can mix them.
 */

/** A unit's Learning Board content.
 *
 * Real user direction 2026-09-14, with a working reference attached
 * (drawing_board_unit10_v5.py): "we can use this template and examples as is
 * and how interactive is this is good. just realign to our learning methods
 * one by one and steady for the kids... once you reproduce this, we can do
 * this for unit by unit."
 *
 * The whole point of this file is that last sentence. Everything that differs
 * between units is data here; the player in components/board/DrawingBoard.tsx
 * never changes. Adding Unit 11 means writing one more of these, not touching
 * a component.
 *
 * Coordinates are in GRID units (0-10), never pixels - the player owns the
 * mapping to SVG space. Getting that boundary wrong is what produced shapes
 * floating off their own grid in earlier attempts.
 */

/** A polygon given by its grid-space corners, e.g. [[1,2],[3,2],[2,4]]. */
export type GridPoints = [number, number][];

export type BoardShape = {
  points: GridPoints;
  /** ghost = where it started, live = the shape under discussion. */
  look: "ghost" | "live" | "correct" | "wrong";
};

/** A dashed vector arrow from one grid point to another. */
export type BoardArrow = { from: [number, number]; to: [number, number] };

/**
 * A plain dashed guide line - a mirror line, an axis of symmetry, a fold.
 * Unlike an arrow it has no head, because it is scenery the shapes sit
 * against rather than a movement being pointed out. Drawn beneath everything
 * else for the same reason.
 */
export type BoardGuide = {
  from: [number, number];
  to: [number, number];
  label?: string;
  tone?: "gold" | "green" | "red" | "blue";
};

/** A labelled dot, for calling out a specific vertex or coordinate. */
export type BoardDot = { at: [number, number]; label?: string; tone?: "gold" | "green" | "red" | "blue" };

/**
 * A number line, for units that teach number rather than position. Unit 1 is
 * decimals, decomposing and negatives - a coordinate grid says nothing about
 * any of them, so the board needs a second stage rather than a grid pressed
 * into a shape it does not fit.
 */
export type NumberLineFrame = {
  min: number;
  max: number;
  /** Distance between labelled ticks, e.g. 1 for whole numbers, 0.1 for tenths. */
  step: number;
  marks?: { at: number; label?: string; tone?: "gold" | "green" | "red" | "blue" }[];
  /** A hop along the line, drawn as an arc with its size written above it. */
  jumps?: { from: number; to: number; label?: string }[];
  /** Place-value columns shown under the line, e.g. 40 + 5 + 0.8. */
  parts?: { label: string; value: string; tone?: "gold" | "green" | "red" | "blue" }[];
};

/**
 * A text stage, for subjects where the thing being taught is language rather
 * than position or quantity. English Unit 2 is biography, chronological
 * order, register, synonyms and prefixes - a grid says nothing about any of
 * them, and neither does a number line.
 */
export type TextFrame = {
  title?: string;
  /** A passage, split into parts so some can be picked out in colour. */
  passage?: { text: string; tone?: "gold" | "green" | "red" | "blue"; note?: string }[];
  /** Words or events in a row - tappable, and draggable into columns. */
  chips?: { text: string; tone?: "gold" | "green" | "red" | "blue"; note?: string }[];
  /**
   * Concept cards, each carrying the real quote it came from. A child reads
   * the idea and the line from the book side by side, which is what makes
   * cross-checking possible when they meet a fable they have never seen.
   */
  cards?: { tag: string; title: string; desc: string; quote?: string }[];
  /** Labelled buckets to sort into, e.g. Fact / Opinion, Formal / Informal. */
  columns?: { label: string; items: string[]; tone?: "gold" | "green" | "red" | "blue" }[];
};

type Tone = "gold" | "green" | "red" | "blue";

/**
 * A labelled figure - apparatus, a circuit, a cell, a map. The artwork is
 * hand-authored SVG in the data file (repo source, not model output), and
 * `parts` puts tappable callouts on it that explain themselves.
 */
export type DiagramFrame = {
  title?: string;
  viewBox: string;
  svg: string;
  parts?: { label: string; at: [number, number]; note: string; tone?: Tone }[];
};

/** Bar models and arrays - multiplication, fractions of an amount. */
export type BarFrame = {
  title?: string;
  /** Proportional bars, e.g. 3/4 of 20. */
  bars?: { label: string; value: number; tone?: Tone; note?: string }[];
  max?: number;
  /** A rows x cols array of counters, with the first n picked out. */
  array?: { rows: number; cols: number; highlight?: number; tone?: Tone };
  caption?: string;
};

/** A bar chart with axes - data handling and statistics. */
export type ChartFrame = {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  categories: { label: string; value: number; tone?: Tone; note?: string }[];
};

/** Dated events along a line - history, or the story of an idea. */
export type TimelineFrame = {
  title?: string;
  events: { when: string; what: string; note?: string; tone?: Tone; direction?: "east" | "west" | "neutral" }[];
};

/**
 * A real illustration on the board, walked through rather than just shown.
 *
 * Real user direction 2026-09-14: generate artwork covering several topics in
 * one go and "split or clip and use them aptly for respective topics", then
 * "use them for interactive session on the drawing board animating them
 * wherever possible". So a frame can focus on one region of a bigger picture,
 * and successive steps pan across it - one image, many teaching moments, no
 * separate crops to manage.
 *
 * All coordinates are percentages of the image, so they survive any resize.
 */
export type ImageFrame = {
  src: string;
  alt: string;
  title?: string;
  /** Tappable labels sitting on the picture, each explaining itself. */
  hotspots?: { label: string; at: [number, number]; note: string; tone?: Tone }[];
  /** The region to zoom to. Omitted shows the whole picture. */
  focus?: { x: number; y: number; w: number; h: number };
};

export type BoardFrame = {
  shapes?: BoardShape[];
  arrows?: BoardArrow[];
  guides?: BoardGuide[];
  dots?: BoardDot[];
  line?: NumberLineFrame;
  text?: TextFrame;
  diagram?: DiagramFrame;
  bar?: BarFrame;
  chart?: ChartFrame;
  timeline?: TimelineFrame;
  image?: ImageFrame;
};

/** Phase 1: one press of a stepper button. */
export type ConceptStep = {
  /** Button face, e.g. "2. Shift right +3". */
  label: string;
  /** Which concept this step belongs to, so its examples can follow it. */
  conceptId?: string;
  /** Spoken, and shown on the subtitle strip. */
  say: string;
  frame: BoardFrame;
};

/** Phase 2/4: one answerable option. Choosing it draws its own outcome. */
export type BoardOption = {
  label: string;
  correct: boolean;
  /** What Ezy says for this choice - wrong answers explain, never just buzz. */
  say: string;
  /**
   * What the board shows for this choice. A wrong answer draws where that
   * answer would actually land, which is the single most useful thing the
   * reference does: the child sees their own mistake happen.
   */
  frame: BoardFrame;
};

/**
 * Lets a question be answered by moving something on the board instead of
 * picking from a list - real user direction 2026-09-14: "I am not able to
 * drag the points to a position for answer". Dragging to the right place is
 * the skill; choosing between four written options is a different one.
 *
 * Values are in board units: [x, y] on the grid, [value] on a number line.
 */
export type BoardDrag = {
  from: number[];
  to: number[];
  /** Shown beside the handle, e.g. "drag me". */
  hint?: string;
};

export type BoardTask = {
  title: string;
  /**
   * What the board shows while this question is being read, before any answer.
   * Omitted means a clear board - which is still better than leaving the
   * previous question's working up while a new one is being worked on.
   */
  setup?: BoardFrame;
  /** Answerable by dragging, as well as by the options below. */
  drag?: BoardDrag;
  /** The text-stage equivalent: drag a word into the right bucket. */
  chipDrag?: { chip: string; toColumn: number; hint?: string };
  prompt: string;
  options: BoardOption[];
  /** Concept this question belongs to, so mastery is recorded per concept. */
  conceptId: string;
};

/** Phase 3: the slider lab. */
export type BoardLab = {
  prompt: string;
  /** The shared lab can teach coordinate movement, time-zone jumps, or a visual investigation. */
  kind?: "coordinate" | "timeZone" | "visual";
  /** Bottom-left anchor of the shape being dragged around, in grid units. */
  start: [number, number];
  /** Offsets from the anchor that define the shape, e.g. a 2x2 square. */
  shape: GridPoints;
  range: { min: number; max: number };
};

export type BoardConcept = {
  conceptId: string;
  title: string;
  icon: string;
  /** Shown in the module popup from the tray. */
  summary: string;
  keyPoints: string[];
  /**
   * Where this concept lives in the real textbook, and which fable it was
   * taught from - real user question 2026-09-14: "I just wanted to know if
   * the examples are used from existing text fables (we can refer those pages
   * as well) so that kids can cross check". A child should be able to put the
   * board down, open the book at the right page, and see the same example.
   */
  pages?: number[];
  storyReference?: string;
  /** Worked examples to try at the end of this concept, before moving on. */
  examples: { question: string; answer: string }[];
  /**
   * A quick check at the end of this concept, before the next one starts -
   * real user direction 2026-09-14: "at end of each concept we should do
   * quick assessment or worksheet homeworks on what they learnt". Not graded
   * in the readiness score; that is what the Test is for.
   */
  quickCheck?: BoardTask[];
};

/**
 * Phase 3 is Recite: the child says the rule back in their own words before
 * being tested on it. Self-marked on purpose - the point is retrieval, and
 * grading it would make them guess what we want to hear instead of trying.
 */
export type RecitePrompt = {
  ask: string;
  /** Revealed after they have had a go, to check themselves against. */
  answer: string;
  /** Optional topic owner. When present, only this concept's prompts show. */
  conceptId?: string;
};

/** Written practice: work it in a rough book, then check yourself. */
export type WrittenPractice = { question: string; answer: string; conceptId?: string };

/** Stored, unit-specific help for the board chat. Keeps common questions fast,
 * predictable, and usable when an AI provider is unavailable. */
export type BoardChatAnswer = {
  question: string;
  answer: string;
  keywords: string[];
  conceptId?: string;
};

export type BoardUnit = {
  unitKey: string;
  title: string;
  badge: string;
  /** Grid extent. The reference uses 0-10 on both axes. */
  gridMax: number;
  /** Which stage this unit draws on. Defaults to the coordinate grid. */
  /**
   * The default stage. Individual frames override it by carrying their own
   * shape - a frame with `diagram` draws a diagram whatever the unit says -
   * so one unit can mix stages where the content calls for it.
   */
  stage?: "grid" | "numberLine" | "text" | "diagram" | "bar" | "chart" | "timeline" | "map";
  /** Shown and read out before anything else: what this chapter covers and
   *  what the child will be able to do by the end of it. */
  intro: { covers: string[]; outcomes: string[] };
  concepts: BoardConcept[];
  conceptSteps: ConceptStep[];
  guidedTasks: BoardTask[];
  lab: BoardLab;
  recitePrompts: RecitePrompt[];
  /** Longer practice to work on paper - deliberately not multiple choice. */
  writtenPractice: WrittenPractice[];
  /**
   * A passage the child has NOT seen during teaching, shown on the board
   * through the Test - real user direction 2026-09-14: "assess them with an
   * entirely new story for the 13 concepts". Applying an idea to unfamiliar
   * material is the only way to tell understanding from recall.
   */
  assessmentStory?: BoardFrame;
  assessment: { partA: BoardTask[]; partB: BoardTask[] };
  /** Tappable readymade questions in the assistant panel. */
  readymade: { q: string; a: string }[];
  /** Questions matched locally before any future AI fallback is considered. */
  chatAnswers?: BoardChatAnswer[];
};
