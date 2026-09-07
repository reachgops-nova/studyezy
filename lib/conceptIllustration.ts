import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateImageGemini, isGeminiConfigured } from "./gemini";
import { UPLOADS_DIR } from "./uploads";
import type { Concept as DbConcept } from "@prisma/client";

// Fixed character + palette, sent identically on every call - this is what
// makes every generated poster look like part of the same product instead
// of a one-off image. Verified live 2026-09-07: this exact description
// (asked for on its own, no concept content attached) reproduces the same
// mascot design call to call.
const HOUSE_STYLE = `House style, follow exactly every time:
- Mascot: a friendly brown kangaroo named "Ezy" - big round brown eyes, a cream/tan belly patch, thick warm-brown outlines, a simple joeys-book-mascot look (not photorealistic, not scary, not overly detailed). Ezy may appear once, small, reacting to the content (pointing, cheering, curious) - never as the main subject.
- Palette: warm cream/peach background, warm brown outlines, one or two accent colours per illustration drawn from the content itself (e.g. green for plants, blue for water) - never neon, never harsh.
- Layout: a rounded card on the background, a short playful all-caps title banner across the top (with one small relevant emoji), thick consistent outlines on every shape, flat vector-style shading (no photorealism, no gradients-heavy 3D render).
- Typography: bold, rounded, highly legible sans-serif for every label - a 7-year-old must be able to read it.
- Absolutely no misspelled words in any label.`;

const FACTS_RULE = `The facts below are already correct and already checked - illustrate exactly these facts and nothing else. Do not invent, add, reorder, or embellish any fact, label, step, or number beyond what is given. If the facts describe an ordered sequence (steps, a cycle, a growing pattern), lay it out as clearly-numbered stages with arrows showing the order, like a process diagram. If they don't describe an order (a single definition, a set of unordered examples, a comparison), use a single clear illustration with labeled callouts instead - do not force an unordered fact into a fake sequence.`;

function buildPrompt(concept: DbConcept): string {
  const facts: string[] = [];
  if (concept.definition) facts.push(`Definition: ${concept.definition}`);
  if (concept.keyPoints.length) facts.push(`Key points, in this order: ${concept.keyPoints.join(" | ")}`);
  if (concept.examples.length) facts.push(`Examples: ${concept.examples.join(" | ")}`);

  return [
    `Create one square educational poster illustration explaining "${concept.name}" to a school student, for a learning app.`,
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
 * generation is the right tool, not the risky one. The correctness
 * discipline still applies to facts, just applied differently: the prompt
 * is built entirely from the concept's own already-vetted definition/
 * keyPoints/examples (never invented), and the image model is told
 * explicitly to illustrate only those facts, never add new ones.
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
