import type { Concept } from "./types";

/**
 * Builds the AI tutor's grounding context: full detail for the concept
 * actually being taught, plus full detail for every OTHER drafted concept
 * in the same unit. Real gap found live 2026-08-26: a kid mid-lesson on
 * "Features of a biography" asked about Usain Bolt (real material, but
 * taught under a different concept a few pages later in the same unit) and
 * the tutor said it had nothing else from the textbook, then invented
 * plausible-sounding facts when pushed - it genuinely couldn't see anything
 * outside the single concept it was handed. Kids reference material from
 * elsewhere in the same unit constantly; the tutor needs real access to it,
 * not just the one concept's own page.
 *
 * Cost stays reasonable even for a 13-concept unit (a few thousand extra
 * input tokens) - worth it against the alternative, which is an education
 * product fabricating facts to a real kid.
 */
export function buildConceptContextBlock(concept: Concept, allConcepts: Concept[]): string {
  const current = [
    `Currently teaching: ${concept.concept_name}`,
    concept.definition ? `Definition: ${concept.definition}` : null,
    concept.key_points?.length ? `Key points:\n${concept.key_points.map((p) => `- ${p}`).join("\n")}` : null,
    concept.examples?.length ? `Examples:\n${concept.examples.map((e) => `- ${e}`).join("\n")}` : null,
    concept.media?.source_image_transcript
      ? `The picture shown above this chat is the actual reference page for this concept. Here is exactly what's printed on it, so you can answer questions about its specific content:\n${concept.media.source_image_transcript}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const others = allConcepts.filter((c) => c.concept_id !== concept.concept_id);
  if (others.length === 0) return current;

  const otherBlocks = others
    .map((c) => {
      const parts = [
        `--- ${c.concept_name} (${c.concept_id}) ---`,
        c.definition ? `Definition: ${c.definition}` : null,
        c.key_points?.length ? `Key points:\n${c.key_points.map((p) => `- ${p}`).join("\n")}` : null,
        c.examples?.length ? `Examples:\n${c.examples.map((e) => `- ${e}`).join("\n")}` : null,
        c.media?.source_image_transcript ? `Page content:\n${c.media.source_image_transcript}` : null,
      ].filter(Boolean);
      return parts.join("\n");
    })
    .join("\n\n");

  return (
    `${current}\n\n` +
    `Other material already taught elsewhere in this same unit - real content, not something you need to guess ` +
    `at. If the student asks about any of it (even though it's not today's concept), answer using these real ` +
    `facts instead of saying you don't have it or inventing plausible-sounding details:\n\n${otherBlocks}`
  );
}
