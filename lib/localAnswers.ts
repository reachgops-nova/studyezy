import type { Concept } from "./types";

// Same "local pattern-match first, no AI call needed" idea already used for
// checkpoint-pause intent recognition (see components/AvatarChat.tsx) -
// applied here so Voice Q&A still gives a real, grounded answer when Claude
// isn't available (no credit, or a transient failure), instead of a dead
// end or a generic error.

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "what", "why", "how", "do", "does", "did",
  "of", "in", "on", "to", "for", "and", "or", "it", "this", "that", "i", "you", "your", "my",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  return shared / Math.min(a.size, b.size);
}

// Below this, the matched sample question is more likely a coincidence than
// a real match - fall through to the generic concept-content answer instead.
const MATCH_THRESHOLD = 0.34;

/**
 * Answers a question from the concept's own pre-written content (sample
 * Q&A, definition, key points) - no AI call, so this always works. Not as
 * sharp as a real grounded Claude answer, but never a dead end.
 */
export function findLocalAnswer(concept: Concept, question: string): string {
  const qTokens = tokenize(question);

  let best: { answer: string; score: number } | null = null;
  for (const sample of concept.voice_qa_samples ?? []) {
    const score = overlapScore(qTokens, tokenize(sample.question));
    if (score > 0 && (!best || score > best.score)) {
      best = { answer: sample.answer, score };
    }
  }

  if (best && best.score >= MATCH_THRESHOLD) {
    return best.answer;
  }

  const parts = [
    concept.definition,
    concept.key_points?.length ? `Here's what matters most: ${concept.key_points[0]}` : null,
  ].filter((p): p is string => Boolean(p));

  if (parts.length === 0) {
    return "I don't have a ready answer for that one yet - try one of the suggested questions below, or ask again in a moment.";
  }

  return `I can't think that one through live right now, but here's what I know: ${parts.join(" ")}`;
}
