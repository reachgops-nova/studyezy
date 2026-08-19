import "server-only";
import type { Concept, MarkScheme } from "./types";
import type { GradeResult, ReasoningClassification, ReasoningResult } from "./claude";

// Groq hosts open-weight models (Llama etc.) behind a fast, OpenAI-compatible
// endpoint - used as a genuinely-dynamic middle tier between full Claude
// calls and the local pattern-match fallbacks (lib/localAnswers.ts,
// components/AvatarChat.tsx's low-effort check), for whenever Anthropic
// credit isn't available. Free-tier key from console.groq.com.
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Larger model for grounded Q&A quality; smaller/faster one for the
// high-frequency, low-stakes micro-check reaction - same cheap-vs-quality
// split as lib/claude.ts's MODEL/EXTRACTION_MODEL.
//
// 2026-08-18: the original llama-3.1-8b-instant/llama-3.3-70b-versatile IDs
// were removed from Groq's catalog at some point after this integration
// shipped - both returned 404 "model does not exist" (confirmed directly
// against the API, not assumed), meaning every Groq call had been silently
// failing and falling back to the local pattern-matcher/generic ack. Swapped
// to OpenAI's open-weight gpt-oss models, now hosted on Groq - verified
// against console.groq.com/openai/v1/models and re-tested against this
// file's actual prompts/token budgets before shipping.
const QA_MODEL = "openai/gpt-oss-120b";
const REACTION_MODEL = "openai/gpt-oss-20b";

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
      // gpt-oss models reason before answering by default, and that
      // reasoning counts against max_tokens - confirmed empirically that
      // without capping effort, the 80-token micro-check budget was
      // consumed entirely by the reasoning trace, leaving empty content
      // (finish_reason: "length"). "low" leaves reasoning brief enough that
      // the actual answer reliably fits within these small, latency-
      // sensitive interactive-call budgets.
      reasoning_effort: "low",
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

// Same shape as groqChat, but requests structured JSON output - used by
// grading/classification, which need a real object back, not prose.
// Verified against the live API with this project's actual grading and
// Reasoning Interview prompts before relying on it (response_format:
// json_object works with QA_MODEL).
async function groqChatJSON<T>(model: string, system: string, user: string, maxTokens: number): Promise<T> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: 0.3,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
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
  const raw = data.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("Groq returned no content");
  return JSON.parse(raw) as T;
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
      "concept, gently redirect back to it. " +
      "This answer is read aloud by text-to-speech, so write it exactly as you'd say it out loud: plain " +
      "prose only, no markdown at all (no **bold**, *italic*, #headers, or `code`), and no numbered or " +
      "bulleted lists (no '1.' '2.' '-' markers) - if you're covering more than one point, use spoken " +
      "connectors instead, like 'First, ... Also, ... Finally, ...'. If you need to refer to a letter " +
      "pattern or suffix by itself (like -ly or -er), spell it as separated letters (e.g. 'the letters L, Y') " +
      "so it's not misread as a word.",
    `${contextBlock}\n\nStudent's question: ${question.trim().slice(0, 500)}`,
    300
  );
}

/**
 * Generates a fresh set of short follow-up questions a kid might naturally
 * want to tap next, grounded in the concept AND the specific answer they
 * were just given - so the suggested-question chips evolve as the
 * conversation goes, instead of staying frozen on the same static list from
 * the moment the lesson loaded. Uses the fast/cheap REACTION_MODEL since
 * this is a low-stakes UI nicety, not graded content - if it fails or
 * returns nothing usable, the caller keeps showing whatever suggestions it
 * already had (never a hard failure for the kid).
 */
export async function suggestFollowUpsGroq(
  concept: Concept,
  lastQuestion: string,
  lastAnswer: string
): Promise<string[]> {
  const contextBlock = [
    `Concept: ${concept.concept_name}`,
    concept.definition ? `Definition: ${concept.definition}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const parsed = await groqChatJSON<{ questions: string[] }>(
    REACTION_MODEL,
    "You suggest what a Grade 5 (9-10 year old) student might naturally want to ask NEXT in a tutoring " +
      "chat, right after the tutor just answered one of their questions. Read the concept, the student's " +
      "last question, and the tutor's answer, then write 3 short, distinct follow-up questions the student " +
      "could tap to ask next - each under 12 words, in the student's own simple voice (e.g. 'What if...', " +
      "'Can you give another example?', 'Why does that happen?'). Don't repeat the question just asked. " +
      "Stay strictly on this one concept. Respond with ONLY a JSON object, no other text: " +
      '{"questions": [string, string, string]}.',
    `${contextBlock}\n\nStudent just asked: ${lastQuestion.trim().slice(0, 300)}\n\nTutor answered: ${lastAnswer
      .trim()
      .slice(0, 800)}`,
    250
  );

  return (parsed.questions ?? []).filter((q) => typeof q === "string" && q.trim().length > 0).slice(0, 3);
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

// 2026-08-19: extended to grading and Reasoning Interview classification too
// - explicit user decision (both were previously Claude-only on the
// reasoning that a wrong guess would corrupt ConceptMastery/retest
// scheduling). Grading in particular still writes directly into that data,
// so this is a real, acknowledged quality/consistency tradeoff versus
// Claude, not a free upgrade - accepted because "some feedback now" beats
// "no feedback until credit exists" for this pilot's scale, and Claude
// still gets tried first whenever it's configured (see the API routes).

/** Same contract as lib/claude.ts's gradeShortAnswer. */
export async function gradeShortAnswerGroq(
  questionText: string,
  markScheme: MarkScheme,
  studentAnswer: string
): Promise<GradeResult> {
  const trimmedAnswer = studentAnswer.trim().slice(0, 2000);

  const parsed = await groqChatJSON<{ marks_awarded: number; feedback: string }>(
    QA_MODEL,
    "You are grading a Grade 5 student's short-answer response, kindly and constructively. " +
      "Respond with ONLY a JSON object matching this shape, no other text: " +
      '{"marks_awarded": number, "feedback": string}. ' +
      "The feedback should focus on how to write the answer better next time (e.g. show your " +
      "reasoning, use evidence from the text), not just whether it was right or wrong. Keep feedback " +
      "under 80 words and encouraging in tone.",
    `Question: ${questionText}\n\nMark scheme (full marks: ${markScheme.full_marks}):\n${markScheme.criteria
      .map((c) => `- ${c}`)
      .join("\n")}\n\nStudent's answer: ${trimmedAnswer}`,
    400
  );

  return {
    marks_awarded: Math.max(0, Math.min(markScheme.full_marks, Math.round(parsed.marks_awarded))),
    full_marks: markScheme.full_marks,
    feedback: parsed.feedback,
  };
}

const VALID_CLASSIFICATIONS: ReasoningClassification[] = [
  "correct_reasoning",
  "conceptual_gap",
  "careless_slip",
  "misread_question",
];

/** Same contract as lib/claude.ts's classifyReasoning. */
export async function classifyReasoningGroq(
  question: string,
  studentAnswer: string,
  explanation: string
): Promise<ReasoningResult> {
  const trimmedExplanation = explanation.trim().slice(0, 1000);

  const parsed = await groqChatJSON<{ classification: string; note: string }>(
    QA_MODEL,
    "You are a kind Grade 5 tutor figuring out WHY a student answered the way they did, from their " +
      "own explanation of their thinking. Classify into exactly one of: " +
      '"correct_reasoning" (their thinking was sound, whether or not the final answer was marked right), ' +
      '"conceptual_gap" (they do not yet understand the underlying idea), ' +
      '"careless_slip" (they understand it but made a slip - rushing, a small error), ' +
      '"misread_question" (they misunderstood what was being asked, not the concept itself). ' +
      "Respond with ONLY a JSON object, no other text: " +
      '{"classification": string, "note": string}. ' +
      "The note is a short (under 50 words), warm, specific reaction to their explanation - never " +
      "mention marks or scores, this is about understanding their thinking, not grading it.",
    `Question: ${question}\n\nStudent's answer: ${studentAnswer}\n\nStudent's explanation of their thinking: ${trimmedExplanation}`,
    400
  );

  const classification = VALID_CLASSIFICATIONS.includes(parsed.classification as ReasoningClassification)
    ? (parsed.classification as ReasoningClassification)
    : "correct_reasoning";

  return { classification, note: parsed.note };
}
