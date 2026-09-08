import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateImageGemini, isGeminiConfigured } from "./gemini";
import { UPLOADS_DIR } from "./uploads";
import type { Concept as DbConcept } from "@prisma/client";

// Fixed character + palette, sent identically on every call - this is what
// makes every generated illustration look like part of the same product
// instead of a one-off image. Verified live 2026-09-07: this exact
// description (asked for on its own, no concept content attached)
// reproduces the same mascot design call to call.
//
// Real pilot finding, same day: the first version of this prompt asked for
// a dense infographic-style poster with baked-in titles, labels and bullet
// text (matching the NotebookLM-style reference images the user showed).
// All 3 pilot images came back with genuinely garbled words ("IDIOMIATIC",
// "ARRANING", "THROUGHOT", a label that read "NENTS RISE"), and one
// fabricated an example that was never in the source content at all - a
// known, real weakness of current image models: dense in-image text is
// unreliable, and gets *less* reliable the more of it you ask for in one
// image, no matter how firmly the prompt insists on exact wording. Baking
// facts into pixels also means there is no way to guarantee they match the
// concept's real text short of OCR-checking every image, which is far
// weaker than just not doing it. Real HTML text can't be misspelled or
// invented, so this prompt no longer asks the model to render any text at
// all - it draws the SCENE only, and the app renders the actual facts as
// real text around/under it (see the illustration card in AvatarChat.tsx).
const HOUSE_STYLE = `House style, follow exactly every time:
- Mascot: a friendly brown kangaroo named "Ezy" - big round brown eyes, a cream/tan belly patch, thick warm-brown outlines, a simple joeys-book-mascot look (not photorealistic, not scary, not overly detailed). Ezy may appear once, small, reacting to the scene (pointing, cheering, curious) - never as the main subject.
- Palette: warm cream/peach background, warm brown outlines, one or two accent colours drawn from the content itself (e.g. green for plants, blue for water) - never neon, never harsh.
- Flat vector-style shading, thick consistent outlines, no photorealism, no heavy 3D gradients.
- ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no titles, no labels, no captions, no numbers, no speech-bubble writing, no signage, nothing written at all. This is a pure illustration; every word a student reads about this concept comes from real text elsewhere on the page, never from the picture.
- Never depict a real, identifiable named public figure (an actual celebrity, athlete, or historical photo likeness) - if an example mentions one, illustrate the general idea/scene instead of a recognizable portrait of that real person.`;

const FACTS_RULE = `The facts below are already correct and already checked - they tell you WHAT to draw, never what to write (nothing is written - see the no-text rule above). Illustrate the scene these facts describe and nothing beyond it - do not invent extra objects, characters, or events that aren't implied by the facts.`;

// Real gap reported live 2026-09-08: this used to combine definition +
// keyPoints + examples into ONE image, which worked fine as a standalone
// poster but broke once the picture was anchored to a specific moment in
// the conversation (see AvatarChat.tsx's buildCheckpoints, 2026-09-08
// earlier) - the illustration is only shown/spoken during the EXAMPLES
// checkpoint, but its content came from all three fields combined, so a
// panel could depict a key point ("raining cats and dogs") that gets
// spoken later, in a different checkpoint, while the panel actually being
// discussed right now (an example) was drawn in the wrong position or not
// at all. The image's content must exactly match what's spoken at the one
// point in the lesson it's actually shown - so this is scoped to `examples`
// only now, in the same order they're read aloud, with an explicit
// left-to-right instruction so a multi-panel scene can't be reordered
// relative to the speech. Falls back to the definition only when a concept
// genuinely has no examples (illustrating something more general, since
// there's no per-example moment for it to stay in sync with anyway).
function buildPrompt(concept: DbConcept): string {
  const examples = concept.examples ?? [];
  const facts = examples.length
    ? [
        `Examples, as ${examples.length > 1 ? "separate scenes" : "one scene"} arranged left-to-right in EXACTLY this order (never reorder, merge, or swap them - each is spoken aloud in this order right when this picture is shown):`,
        ...examples.map((e, i) => `Scene ${i + 1}: ${e}`),
      ]
    : concept.definition
      ? [`Definition: ${concept.definition}`]
      : [];

  return [
    `Create one square illustration (no text) that visually represents "${concept.name}" for a school student, as the cover art for a learning app lesson card.`,
    HOUSE_STYLE,
    FACTS_RULE,
    facts.length ? facts.join("\n") : `No further detail was given beyond the concept name - keep the illustration simple and generic to that name rather than guessing specifics.`,
  ].join("\n\n");
}

/**
 * Generates one "poster" illustration for a concept (see the 2026-09-07
 * pilot: user showed NotebookLM-style life-cycle/water-cycle posters and
 * asked for an automated equivalent). Deliberately the mirror image of
 * lib/contentPackExtraction.ts's photo_crop -> count_grid preference: THERE
 * a generated image was rejected for anything answer-bearing, because the
 * image and the marked answer must never be able to disagree. HERE there is
 * no scored answer at stake - this is a Learn-phase teaching aid - so
 * generation is the right tool, not the risky one. But the pilot found a
 * real, different risk: asking the model to render exact facts AS TEXT
 * inside the image produced genuinely garbled words and one fabricated
 * example on every single pilot image (see HOUSE_STYLE's comment below).
 * The image model draws the SCENE only now - no text at all - and every
 * actual fact a student reads still comes from the concept's own real
 * definition/keyPoints/examples, rendered as real HTML text by the caller
 * (see AvatarChat.tsx's illustration card), which can't be misspelled or
 * hallucinated the way pixels can.
 *
 * Caches to `concept.generatedIllustrationUrl` - never regenerates a concept
 * that already has one (same "don't reprocess, don't re-spend tokens"
 * principle as every other content pipeline in this codebase). Caller must
 * check that field before calling this, and is responsible for the
 * `db.concept.update` afterward - this function only produces the file and
 * doesn't touch the database, to keep it usable from both the pilot script
 * and a future admin route.
 */
export async function generateConceptIllustration(concept: DbConcept): Promise<{ url: string; inputTokens: number; outputTokens: number }> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini isn't configured - concept illustration generation has no other capable provider.");
  }
  const prompt = buildPrompt(concept);
  const result = await generateImageGemini("concept-illustration-gemini", prompt);

  const dir = path.join(UPLOADS_DIR, "concept-illustrations");
  await mkdir(dir, { recursive: true });
  const filename = `${concept.id}.png`;
  await writeFile(path.join(dir, filename), result.png);

  return { url: `/api/concept-illustrations/${filename}`, inputTokens: result.inputTokens, outputTokens: result.outputTokens };
}
