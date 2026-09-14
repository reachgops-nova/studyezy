/**
 * Author an illustrated, animated scene with an LLM and commit it to git.
 *
 * Real user direction 2026-09-14: "Still the images look normal.. not as good
 * as what I directly see in LLM or Astra.. should we have everything developed
 * there and ship to git to get better results?" - yes. This is that pipeline.
 * The model writes the artwork as SVG plus a step timeline; we sanitise,
 * validate and write it to lib/richScenes/ as reviewable JSON; RichSceneStage
 * plays it back. Runs on Groq, so it stays inside the free tier - the user's
 * standing constraint is "I am not going to upgrade paid models for now".
 *
 * Usage (the key lives in Railway, never on disk):
 *   railway run npx tsx scripts/generate-rich-scene.ts <sceneKey> "<brief>"
 *
 * e.g. railway run npx tsx scripts/generate-rich-scene.ts \
 *        cambridge-4-math-10/10.1 "Translating a triangle on a coordinate grid"
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { normalizeRichScene, validateRichScene, type RichScene } from "../lib/richScene";

const MODEL = "openai/gpt-oss-120b";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM = `You are an illustrator and motion designer who makes explainer animations for school children. You output ONE JSON object and nothing else.

You are drawing for a printed-textbook-quality lesson card, not a wireframe. A plain grid with thin lines is a FAILURE. Draw the real thing: if the concept involves a boat, draw a boat with a hull, a sail and a waterline; if it involves a grid, give it a soft tinted ground, a clear axis with arrowheads and readable numbers; always add labels, callouts and colour with intent.

SCHEMA
{
  "title": string,
  "viewBox": "0 0 W H",              // W around 520, H around 360
  "defs": string,                     // optional raw SVG <defs> CONTENT (gradients etc). No <defs> wrapper.
  "caption": string,                  // one sentence shown at rest
  "layers": [ { "id": string, "svg": string, "hidden"?: boolean } ],
  "steps": [ { "say": string, "show"?: [id], "hide"?: [id], "draw"?: [id], "move"?: [{"id":id,"dx":n,"dy":n}], "pulse"?: [id], "holdMs"?: n } ]
}

LAYER RULES
- "svg" is an SVG fragment: shapes only, NO <svg> and NO <g> wrapper (the player wraps each layer in its own <g>).
- Give every layer a meaningful id ("grid", "boat", "arrow-left", "label-a").
- Anything a step animates must be its OWN layer - that is the only way it can move or draw separately.
- Set "hidden": true on anything that should appear partway through.
- Coordinates are viewBox space and absolute. "move" offsets are viewBox units too.

TIMELINE RULES
- 4 to 7 steps. Each "say" is ONE short spoken sentence a child hears - warm and concrete, never "As we can see".
- "draw" strokes a shape on as if a hand were drawing it. It only works on stroked shapes, so give a drawn layer stroke and fill="none".
- Build the picture up: do not show everything in step 1. If a step's line says something appears, arrives or is added, that layer MUST carry "hidden": true and be revealed by that very step. A scene whose first frame already contains what step 4 introduces has no reveal at all, and is the single most common way these come back wrong.
- Reveal one thing per step. Three points plotted "one at a time" means three separate hidden layers shown by three different steps.
- NEVER hide a layer that a later step still points at, compares against or connects to. A before/after comparison needs BOTH halves on screen at the end. Hiding is only for something genuinely finished with.
- A "move" is a slide, not a teleport: the layer keeps its own artwork, so move the pieces that travel and leave a marker of where they started if the point is how far they went.
- holdMs 1800-3000.

GEOMETRY CHECK - do this before you write the JSON, it is the most common way these scenes go wrong
- If the scene has a grid, number line or axis, FIRST fix its mapping and write it down: the pixel position of the origin (ORIGIN_X, ORIGIN_Y) and the pixel size of one cell (CELL, use 34-40).
- Then EVERY plotted point is computed from that mapping, never placed by eye:
    px = ORIGIN_X + (x * CELL)
    py = ORIGIN_Y - (y * CELL)        <- note the minus: SVG y grows downward, graph y grows upward
  The grid lines, the axis tick labels and the shapes must all come from the same mapping, or the labels will say one thing and the picture another.
- Draw the grid lines only across the range the axes actually cover, and make sure every plotted shape sits inside that range. A shape floating above or beside the grid is a broken scene.
- A grid or axis MUST carry a visible axis line and a numbered tick label at every whole value on both axes. Without them a child cannot read a coordinate off the picture and the scene fails at its job, however pretty it is.
- Axis tick labels go just outside the axis line (x labels a few px below it, y labels a few px to its left) so they never collide with each other or with the plotted shapes.
- Work out the final position of everything that moves: start coordinate + every dx/dy applied to it. A move of n cells is dx = n * CELL, so the shape lands exactly on grid points.
- That final position must sit fully inside the drawn scene - inside the grid, the axes and the viewBox, with a margin. A shape that slides off the edge, behind an axis or into space that was never drawn is a broken scene.
- So choose the STARTING position to make room for the journey. If something slides 4 squares left, start it at least 5 squares right of the left edge.
- Any shape you draw at a destination ("the new triangle") must use exactly the coordinates the moving markers land on. Recompute them; do not estimate.

ART DIRECTION - this is what separates a real illustration from a wireframe, so spend real effort here
Think modern flat editorial illustration - the look of a well-designed children's science app in 2026 - NOT a textbook line drawing and NOT a whiteboard sketch. Rounded, chunky, confident, colourful, with depth.

REQUIRED, every scene:
- "defs" contains at least two <linearGradient> or <radialGradient> definitions AND a soft shadow filter:
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#16241f" flood-opacity="0.18"/></filter>
- The first layer is a full-bleed <rect> with rx="16" filled by a gradient. A white background is a failure.
- Every main subject is FILLED with a gradient (not a flat colour, not an outline) and carries filter="url(#soft)" so it lifts off the page.
- Round everything: rx on rectangles, stroke-linecap="round", stroke-linejoin="round".
- Give the scene a rounded "card" panel behind the working area, slightly lighter than the background, so it reads as a designed surface.

COLOUR
- Ground the palette in ink #16241f, accent #9c6f1f, paper #f4f6f1, then bring in saturated modern colours the subject calls for: teal #2a9d8f, coral #e76f51, sky #4a9fd5, sun #f4a261, violet #7b6cd9.
- Use at least three distinct colours with intent. One brown shape on a pale ground is the failure mode - a "before" object and an "after" object should be different colours so a child can tell them apart instantly.
- Structural scaffolding recedes: grid lines, guides and rules at stroke-opacity="0.15". Only the subject is at full strength.

TYPE AND LABELS
- <text> at font-size 13-15, font-family="system-ui, -apple-system, sans-serif", font-weight="700", fill="#16241f".
- Put a short title label in the artwork itself, and label the objects that matter ("before", "after", "4 left").
- Set a label that sits over artwork on its own rounded <rect> chip so it stays readable.

DEPTH AND POLISH
- Add a soft highlight: a lighter shape at low fill-opacity over the top of a solid form.
- Where a value or count matters, draw it as a chip or badge, not just loose text.
- At most two small decorative touches that belong to the subject (a cloud, a leaf). They must sit in a margin of the scene, must not overlap or cross the working area, and must never be long lines or streaks across the artwork. If in doubt, leave them out - a clean scene beats a decorated one.

FORBIDDEN
- No <script>, no on* attributes, no <image>, no external URLs, no <style>, no <animate>. Motion comes from the timeline only.
- No LaTeX. Write units and symbols as Unicode directly (m², 45°, ×, →).
- Every "svg" value is ONE single quoted JSON string, however long. Never split it with + concatenation - that is JavaScript, not JSON, and it makes the whole response unparseable.`;

/**
 * The model reliably writes good artwork but sometimes reaches for JS string
 * concatenation ("<line .../>" + "<line .../>") to break up a long SVG value,
 * which is not valid JSON. The art is fine; only the seam is wrong - so join
 * the pieces rather than discard the generation and pay for another.
 */
function repairJson(raw: string): string {
  return raw.replace(/"\s*\+\s*"/g, "");
}

/**
 * The free tier's budget is per minute, so generating scenes back to back
 * runs into it routinely - the call is not wrong, it is just early. Wait out
 * the window rather than failing the run, which matters when this is batched
 * across a unit.
 */
async function requestWithBackoff(body: Record<string, unknown>): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const rateLimited = res.status === 429 || res.status === 413;
    if (!rateLimited || attempt >= 4) return res;

    const waitMs = Number(res.headers.get("retry-after")) * 1000 || (attempt + 1) * 20_000;
    console.warn(`Rate limited (${res.status}); waiting ${Math.round(waitMs / 1000)}s before retry ${attempt + 1}/4.`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
}

/** Groq returns a failed generation in the error body; it is usually repairable. */
async function contentFrom(res: Response): Promise<{ raw: string; usage?: { prompt_tokens?: number; completion_tokens?: number } }> {
  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    error?: { message?: string; failed_generation?: string };
  };

  if (!res.ok) {
    const salvaged = body.error?.failed_generation?.trim();
    if (!salvaged) throw new Error(`Groq request failed: ${res.status} ${body.error?.message ?? "unknown error"}`);
    console.warn("Model returned invalid JSON; attempting repair of the failed generation.");
    return { raw: salvaged };
  }

  const raw = body.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("Groq returned no content");
  return { raw, usage: body.usage };
}

async function main() {
  const [sceneKey, brief] = process.argv.slice(2);
  if (!sceneKey || !brief) {
    console.error('Usage: generate-rich-scene.ts <unitKey/conceptId> "<brief>"');
    process.exit(1);
  }
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set. Run through `railway run` so the key comes from Railway.");
    process.exit(1);
  }

  const res = await requestWithBackoff({
      model: MODEL,
      // The free tier allows 8000 tokens per minute and counts the prompt
      // plus the whole max_tokens reservation against it, so a single call
      // cannot reserve more than that however long the artwork is. Reasoning
      // shares this budget with the output, and the quality here comes from
      // the art direction above rather than from reasoning depth - "high"
      // starved the output entirely and returned nothing.
      max_tokens: 6000,
      temperature: 0.6,
      // "low" fits the budget comfortably but visibly costs quality - it
      // returned a grid with no axis numbers and no progressive reveal.
      // Medium is worth the tighter margin.
      reasoning_effort: "medium",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Draw and animate this for a school lesson card: ${brief}` },
      ],
  });

  const { raw, usage } = await contentFrom(res);

  let parsed: RichScene;
  try {
    parsed = JSON.parse(raw) as RichScene;
  } catch {
    parsed = JSON.parse(repairJson(raw)) as RichScene;
  }

  const scene = normalizeRichScene(parsed);
  const errors = validateRichScene(scene);
  if (errors.length) {
    console.error("Scene failed validation:");
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  const outPath = join(process.cwd(), "lib", "richScenes", `${sceneKey}.json`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(scene, null, 2)}\n`);

  console.log(`Wrote ${outPath}`);
  console.log(`  ${scene.layers.length} layers, ${scene.steps.length} steps, ${raw.length} chars`);
  console.log(`  tokens: ${usage?.prompt_tokens ?? 0} in / ${usage?.completion_tokens ?? 0} out`);
  scene.steps.forEach((s, i) => console.log(`  ${i + 1}. ${s.say}`));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
