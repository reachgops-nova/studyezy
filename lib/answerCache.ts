import "server-only";
import { db } from "./db";

// Answer cache for /api/ask - a repeated or near-identical question, asked
// by a *different* kid on the same concept, is served free instead of
// triggering a new Groq/Claude call. See PLATFORM_PLAN.md's 2026-08-22
// caching entry for the full reasoning. v1 scope deliberately: exact/
// near-exact match only (same wording, different casing/punctuation) - not
// semantic/paraphrase matching, which needs pgvector and a real
// false-positive-risk evaluation before it's safe for an education product.

/** Lowercase, strip punctuation, collapse whitespace - the actual match key. */
export function normalizeQuestion(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[?!.,;:'"()]/g, "")
    .replace(/\s+/g, " ");
}

export async function getCachedAnswer(
  unitKey: string,
  conceptKey: string,
  language: string,
  question: string
): Promise<{ answer: string } | null> {
  const normalizedQuestion = normalizeQuestion(question);
  if (!normalizedQuestion) return null;

  const hit = await db.answerCache.findUnique({
    where: { unitKey_conceptKey_language_normalizedQuestion: { unitKey, conceptKey, language, normalizedQuestion } },
  });
  if (!hit) return null;

  // Best-effort - a kid's answer should never wait on (or fail because of)
  // a hit-count bump.
  db.answerCache
    .update({ where: { id: hit.id }, data: { hitCount: { increment: 1 }, lastUsedAt: new Date() } })
    .catch((err) => console.error("answerCache hit-count bump failed (non-fatal)", err));

  return { answer: hit.answer };
}

export async function saveCachedAnswer(
  unitKey: string,
  conceptKey: string,
  language: string,
  question: string,
  answer: string
): Promise<void> {
  const normalizedQuestion = normalizeQuestion(question);
  if (!normalizedQuestion) return;

  try {
    await db.answerCache.upsert({
      where: { unitKey_conceptKey_language_normalizedQuestion: { unitKey, conceptKey, language, normalizedQuestion } },
      create: { unitKey, conceptKey, language, normalizedQuestion, originalQuestion: question.trim().slice(0, 500), answer },
      update: { answer, lastUsedAt: new Date() },
    });
  } catch (err) {
    // Never fail the real response over a caching write - the kid already
    // has their answer either way.
    console.error("saveCachedAnswer failed (non-fatal)", err);
  }
}

/** Operational safety valve for a wrong/stale cached answer - clears one unit's cache, or all of it. */
export async function clearAnswerCache(unitKey?: string): Promise<number> {
  const result = await db.answerCache.deleteMany({ where: unitKey ? { unitKey } : {} });
  return result.count;
}
