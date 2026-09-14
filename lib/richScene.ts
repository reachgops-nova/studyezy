// LLM-authored illustrated scenes.
//
// Real user direction 2026-09-14: "Still the images look normal.. not as good
// as what I directly see in LLM or Astra.. why are you not able to get the
// high quality animation from LLM should we have everything developed there
// and ship to git to get better results?"
//
// The honest answer was that the ceiling was the hand-coded primitives in
// GeometryConceptScene (fixed 22px grid cells, hairline strokes, one shape
// vocabulary per subject), not the model. This module is the other route:
// a model authors the artwork as real SVG plus a step timeline, we review
// the JSON, commit it to git, and RichSceneStage plays it back. No paid tier
// and no runtime generation - the art is a build artifact like any other.
//
// The SVG is written by a model, so it is treated as untrusted markup and
// sanitised at generation time (see sanitizeSvgFragment) before it is ever
// committed, and again on the way into the DOM.

export type RichSceneLayer = {
  /** Referenced by the timeline. Unique within a scene. */
  id: string;
  /** An SVG fragment - shapes only, no <svg> wrapper. */
  svg: string;
  /** Hidden until a step shows it. Defaults to visible. */
  hidden?: boolean;
};

export type RichSceneStep = {
  /** The line spoken while this step is on screen. */
  say: string;
  show?: string[];
  hide?: string[];
  /** Stroke draw-on, as if a hand were drawing it. */
  draw?: string[];
  /** Slide a layer by a viewBox-space offset. Cumulative across steps. */
  move?: { id: string; dx: number; dy: number }[];
  /** Brief attention pulse. */
  pulse?: string[];
  /** How long to hold before the next step. Defaults to 2200ms. */
  holdMs?: number;
};

export type RichSceneHotspot = {
  /** The layer that becomes tappable. */
  layerId: string;
  /** What Ezy says when a child taps it. */
  say: string;
};

export type RichScene = {
  title: string;
  /** "0 0 W H". The stage scales to its container. */
  viewBox: string;
  /** Gradients, markers, patterns. Sanitised like any other fragment. */
  defs?: string;
  layers: RichSceneLayer[];
  steps: RichSceneStep[];
  /** Shown under the stage when no step is playing. */
  caption?: string;
  /**
   * Tappable parts of the drawing. A board a child can poke at and have it
   * explain itself is the difference between a diagram and a lesson - see
   * lib/boardNarration.tsx.
   */
  hotspots?: RichSceneHotspot[];
};

const FORBIDDEN_ELEMENTS = /<\s*\/?\s*(script|iframe|foreignObject|object|embed|link|meta|style|animate|set|handler)\b[^>]*>/gi;
const EVENT_ATTRS = /\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URLS = /(href|xlink:href|src|filter|mask|clip-path)\s*=\s*("|')\s*(javascript:|data:text\/html|https?:)[^"']*("|')/gi;
const EXTERNAL_URL_FUNCS = /url\(\s*("|')?\s*(https?:|\/\/|data:text\/html)[^)]*\)/gi;

/**
 * Strip everything that could execute or phone out. Model-authored SVG is
 * untrusted markup: it is drawn, never trusted. Applied once when the scene
 * is generated (so the committed JSON is already clean and reviewable in a
 * diff) and again in the player before the fragment reaches the DOM.
 */
export function sanitizeSvgFragment(svg: string): string {
  return svg
    // Models sometimes escape the attribute quotes a second time, so the
    // string arrives holding a literal <rect x=\"0\"> and the fragment is
    // malformed markup that renders nothing at all. A backslash before a
    // quote is never meaningful in SVG, so dropping it is always safe.
    .replace(/\\"/g, '"')
    .replace(FORBIDDEN_ELEMENTS, "")
    .replace(EVENT_ATTRS, "")
    .replace(JS_URLS, "")
    .replace(EXTERNAL_URL_FUNCS, "none");
}

const DRAWABLE_TAG = /<(path|line|polyline|polygon|circle|ellipse|rect)\b/gi;

/**
 * A draw-on effect animates stroke-dashoffset, which needs a known path
 * length. Rather than rely on the model to remember pathLength="1" on every
 * drawable shape, add it wherever it is missing on a layer the timeline
 * actually draws.
 */
export function withPathLengths(svg: string): string {
  return svg.replace(DRAWABLE_TAG, (match) => `${match} pathLength="1"`);
}

/** Sanitise, and prepare any layer the timeline draws. Safe to run twice. */
export function normalizeRichScene(scene: RichScene): RichScene {
  const drawn = new Set(scene.steps.flatMap((step) => step.draw ?? []));
  return {
    ...scene,
    defs: scene.defs ? sanitizeSvgFragment(scene.defs) : undefined,
    layers: scene.layers.map((layer) => {
      const clean = sanitizeSvgFragment(layer.svg);
      return { ...layer, svg: drawn.has(layer.id) && !/pathLength=/.test(clean) ? withPathLengths(clean) : clean };
    }),
  };
}

/** Reject a scene whose timeline references layers that do not exist. */
export function validateRichScene(scene: RichScene): string[] {
  const errors: string[] = [];
  if (!/^[\d.\s-]+$/.test(scene.viewBox)) errors.push(`viewBox is not four numbers: ${scene.viewBox}`);
  if (!scene.layers.length) errors.push("scene has no layers");
  if (!scene.steps.length) errors.push("scene has no steps");

  const ids = new Set(scene.layers.map((layer) => layer.id));
  if (ids.size !== scene.layers.length) errors.push("layer ids are not unique");

  scene.steps.forEach((step, i) => {
    const referenced = [
      ...(step.show ?? []),
      ...(step.hide ?? []),
      ...(step.draw ?? []),
      ...(step.pulse ?? []),
      ...(step.move ?? []).map((m) => m.id),
    ];
    referenced.filter((id) => !ids.has(id)).forEach((id) => errors.push(`step ${i + 1} references unknown layer "${id}"`));
    if (!step.say?.trim()) errors.push(`step ${i + 1} has no spoken line`);
  });

  return errors;
}
