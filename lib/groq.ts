import "server-only";
import type { Concept } from "./types";

// Groq hosts open-weight models (Llama etc.) behind a fast, OpenAI-compatible
// endpoint - used as a genuinely-dynamic middle tier between full Claude
// calls and the local pattern-match fallbacks (lib/localAnswers.ts,
// components/AvatarChat.tsx's low-effort check), for whenever Anthropic
// credit isn't available. Free-tier key from console.groq.com.
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Larger model for grounded Q&A quality; smaller/faster one for the
// high-frequency, low-stakes micro-check reaction - same cheap-vs-quality
// split as lib/claude.ts's MODEL/EXTRACTION_MODEL.
const QA_MODEL = "llama-3.3-70b-versatile";
const REACTION_MODEL = "llama-3.1-8b-instant";

export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

async function groqChat(model: string, system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned no content");
  return text;
}

/**
 * Same contract as lib/claude.ts's askConceptQuestion, for whenever
 * ANTHROPIC_API_KEY isn't configured but GROQ_API_KEY is - grounded in the
 * concept's own content, not a generic web answer.
 */
export async function askConceptQuestionGroq(concept: Concept, question: string): Promise<string> {
  const contextBlock = [
    `Concept: ${concept.concept_name}`,
    concept.definition ? `Definition: ${concept.definition}` : null,
    concept.key_points?.length ? `Key points:\n${concept.key_points.map((p) => `- ${p}`).join("\n")}` : null,
    concept.examples?.length ? `Examples:\n${concept.examples.map((e) => `- ${e}`).join("\n")}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  return groqChat(
    QA_MODEL,
    "You are a patient, encouraging tutor for a Grade 5 (Cambridge Stage 5) student. " +
      "Only answer using the concept context provided - stay on topic for this concept. " +
      "Explain simply, in plain words a 9-10 year old understands. Use an example from the " +
      "context if it helps. Keep the answer under 100 words. Never mention marks, scores, or grades - " +
      "this is a no-pressure practice conversation, not a test. If the question is unrelated to the " +
      "concept, gently redirect back to it.",
    `${contextBlock}\n\nStudent's question: ${question.trim().slice(0, 500)}`,
    300
  );
}

/**
 * A real, content-aware reaction to a Micro-Check answer - replaces the
 * generic rotating ack with something that actually engages with what the
 * kid said, fixing the "false praise for a non-answer" gap a canned phrase
 * can't catch. Ungraded and low-stakes by design (just a warm acknowledgment,
 * not a classification feeding mastery data), so an open-weight model's
 * occasional imperfection here is a fine tradeoff - unlike grading or
 * Reasoning Interview classification, which stay Claude-only.
 */
export async function groqMicroCheckReaction(question: string, studentAnswer: string): Promise<string> {
  return groqChat(
    REACTION_MODEL,
    "You are a warm Grade 5 tutor giving a ONE-sentence reaction to a student's spoken answer to a " +
      "quick check-in question during a lesson. React specifically to what they actually said - if it's " +
      "on the right track, affirm what's right and add anything missing; if it's off-track or vague, say " +
      "so kindly and nudge them in the right direction; never praise a non-answer. Never mention marks or " +
      "scores. Keep it under 30 words, plain text, no markdown.",
    `Question asked: ${question}\n\nStudent's answer: ${studentAnswer.trim().slice(0, 500)}`,
    80
  );
}
