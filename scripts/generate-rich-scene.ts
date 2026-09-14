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
- Build the picture up: do not show everything in step 1.
- NEVER hide a layer that a later step still points at, compares against or connects to. A before/after comparison needs BOTH halves on screen at the end. Hiding is only for something genuinely finished with.
- A "move" is a slide, not a teleport: the layer keeps its own artwork, so move the pieces that travel and leave a marker of where they started if the point is how far they went.
- holdMs 1800-3000.

GEOMETRY CHECK - do this before you write the JSON, it is the most common way these scenes go wrong
- Work out the final position of everything that moves: start coordinate + every dx/dy applied to it.
- That final position must sit fully inside the drawn scene - inside the grid, the axes and the viewBox, with a margin. A shape that slides off the edge, behind an axis or into space that was never drawn is a broken scene.
- So choose the STARTING position to make room for the journey. If something slides 4 squares left, start it at least 5 squares right of the left edge.
- Any shape you draw at a destination ("the new triangle") must use exactly the coordinates the moving markers land on. Recompute them; do not estimate.

STYLE - this is what separates a real illustration from a wireframe, so spend effort here
- REQUIRED: "defs" must contain at least one <linearGradient> or <radialGradient>, and the first layer must be a full-bleed <rect> filled with it - a sky, a water, or a soft tint of the paper colour. A white background is a failure.
- REQUIRED: every main subject gets a fill, not just a stroke. Flat outlines read as a wireframe.
- Structural scaffolding recedes: grid lines, guides and rules go at stroke-opacity="0.18". Only the subject is at full strength.
- Palette: ink #16241f, accent #9c6f1f, paper #f4f6f1, plus real colours the subject calls for (water blue, leaf green, warm red).
- stroke-linecap="round" stroke-linejoin="round". Stroke widths 2-3 for main shapes, 1 for grid lines.
- Label things with <text> at font-size 12-14, font-family="system-ui, sans-serif", font-weight="600". Put a short title label in the artwork itself.
- Use fill-opacity for soft washes behind shapes, and give solid shapes a second lighter shape offset a couple of units for depth.

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

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      // Generous, because the whole artwork comes back in one object and a
      // truncated response is an invalid one. Reasoning shares this budget,
      // so "high" here starved the actual output.
      max_tokens: 20000,
      temperature: 0.6,
      reasoning_effort: "medium",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Draw and animate this for a school lesson card: ${brief}` },
      ],
    }),
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
