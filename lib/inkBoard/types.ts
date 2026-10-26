// Data shapes for the "ink board" lesson style - a continuous hand-drawn
// whiteboard, as opposed to the card-based RCRT Board (see lib/boardUnits).
// Generalized 2026-10-19 from components/board/TeacherWritingSample.tsx,
// which drew one single hardcoded Math problem with scene logic written
// directly in the component. Every topic from here on is pure data (an
// array of InkOp per scene) interpreted by one shared renderer
// (components/board/InkBoard.tsx's renderOps) - adding a new topic never
// means writing new canvas code again.
//
// Coordinates are plain canvas pixels on a fixed design surface (see
// InkBoard.tsx's DESIGN_WIDTH/DESIGN_HEIGHT) - the component scales the
// canvas to fit, so every scene script can assume the same coordinate
// space regardless of the viewer's actual screen size.
//
// STANDING HOUSE STYLE - "Tips & Tricks" scenes (real direction
// 2026-10-25: "we have to teach these kind of points with tricks to
// remember... ensure that we apply this to all subjects and grades"):
// every topic across every subject/grade should include at least one
// scene that teaches a genuine, logically-grounded shortcut or memory aid
// for that topic - never a made-up gimmick, always something that
// actually holds up (a real pattern, a real grouping, a real reason a
// grammar rule or a calculation shortcut works). Use TIP_COLOR for every
// such scene's accent boxes/text so a child learns to recognise "this is
// the trick to remember" by colour alone, consistently across every unit
// this app ever ships - Math, Tamil, Science, any future subject or
// grade. A tips scene is content like any other: it still needs its own
// quiz questions in the topic's `questions` bank, not just a visual aid.
export const TIP_COLOR = "#b8860b";

// STANDING HOUSE STYLE - "Practice Problems" scenes (real direction
// 2026-10-26: "ask them to write and solve more examples" for TN Std 10
// Math, generalized the same way TIP_COLOR was): every topic should also
// include one scene, after the teaching scenes, that gives the learner
// 2-3 additional problems of the same kind just taught and asks them to
// write and solve each one in their notebook before the step-by-step
// solution is shown. Use PRACTICE_COLOR for this scene's accent boxes/
// text so a child learns to recognise "now it's my turn to solve" by
// colour alone, the same way TIP_COLOR marks a memory aid - applies
// across every subject/grade, not just Math.
export const PRACTICE_COLOR = "#0ea5e9";

export type InkColor = string;

export interface InkText {
  type: "text";
  value: string;
  x: number;
  y: number;
  color: InkColor;
  size?: number;
}

export interface InkLine {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: InkColor;
  width?: number;
  dashed?: boolean;
}

export interface InkArrow {
  type: "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: InkColor;
}

/** A rounded-rectangle label box - used for seat numbers, table rows, a highlighted term. */
export interface InkBox {
  type: "box";
  x: number;
  y: number;
  w: number;
  h: number;
  color: InkColor;
  label?: string;
  labelSize?: number;
}

/** A hand-drawn "set" - an ellipse boundary with a title above it and member dots+labels inside. */
export interface InkSet {
  type: "set";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  color: InkColor;
  title: string;
  /** Member labels, laid out in a simple vertical list inside the ellipse. */
  members: string[];
}

/** One arrow from a named member of one InkSet to a named member of another - the classic
 * mapping-diagram way to show an ordered pair / relation before any coordinates are introduced. */
export interface InkMapping {
  type: "mapping";
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: InkColor;
}

/** A simple labelled x/y axis pair (not a full grid) for plotting ordered pairs as points. */
export interface InkAxes {
  type: "axes";
  /** Referenced by InkPoint.axesId so a point knows which axes to map its value onto. */
  id: string;
  /** Top-left of the plotting area in design-pixel space. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Axis value range, e.g. {min:-2, max:6} - mapped linearly onto width/height. */
  xRange: { min: number; max: number };
  yRange: { min: number; max: number };
  xLabel?: string;
  yLabel?: string;
  color?: InkColor;
}

/** A plotted point inside the most recently drawn InkAxes - values are in axis units, not pixels. */
export interface InkPoint {
  type: "point";
  axesId: string;
  valueX: number;
  valueY: number;
  color: InkColor;
  label?: string;
}

/** A smooth curve (e.g. a function's graph) through a list of sample points inside the named
 * InkAxes - values are in axis units, not pixels. Points should already be ordered along the curve. */
export interface InkCurve {
  type: "curve";
  axesId: string;
  points: { x: number; y: number }[];
  color: InkColor;
  width?: number;
}

export type InkOp = InkText | InkLine | InkArrow | InkBox | InkSet | InkMapping | InkAxes | InkPoint | InkCurve;

export interface InkScene {
  /** Short label shown on the scene-switcher button, e.g. "1. அறிமுகம்". */
  label: string;
  /** Spoken narration for this scene, in the same language as the visible text (Tamil). */
  say: string;
  ops: InkOp[];
}

/**
 * One multiple-choice question for the RRT (Read, Recite, Test) assessment
 * layer - see components/board/InkQuickCheck.tsx and InkTestSession.tsx.
 * Real user direction 2026-10-20: "RCRT we can remove C, RRT is still
 * fine" - the ink board has no Cover/guided-drag step, only Read (the
 * scenes), Recite (a short random quick-check after a topic), and Test (a
 * longer random test across the whole unit). `correctIndex` indexes into
 * `options`; exactly one option is correct per question.
 */
export interface InkQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InkTopic {
  /** e.g. "1.2" */
  topicId: string;
  title: string;
  scenes: InkScene[];
  /** Question bank this topic draws from for both quick-checks and the unit test - see InkQuestion. */
  questions: InkQuestion[];
}

export interface InkUnit {
  unitKey: string;
  title: string;
  badge: string;
  /** BCP-47 / Sarvam-style language-tts code, e.g. "ta-IN". */
  languageCode: string;
  topics: InkTopic[];
}
