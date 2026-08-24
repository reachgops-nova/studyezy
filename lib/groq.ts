import "server-only";
import type { Concept, MarkScheme, VocabItem } from "./types";
import type { GradeResult, ReasoningClassification, ReasoningResult, UploadedPageImage } from "./claude";
import { logAiCost } from "./aiCost";

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

// Real open-weight model (Qwen3.6-27B, released April 2026) hosted on Groq
// like everything else in this file - not a self-hosted deployment, since
// Railway (this app's host) has no GPU compute and its own docs say not to
// try running even small models on CPU (verified 2026-08-22, not assumed).
// Exposed for /admin/model-compare's side-by-side comparison against the
// current QA_MODEL - not used on the live student-facing path unless that
// comparison shows it's actually better.
export const QWEN_MODEL = "qwen/qwen3.6-27b";

export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export interface GroqChatResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

async function groqChat(
  feature: string,
  model: string,
  system: string,
  user: string,
  maxTokens: number,
  reasoningEffort: string = "low"
): Promise<GroqChatResult> {
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
      // sensitive interactive-call budgets. Not every model accepts "low"
      // though - confirmed live 2026-08-22 that qwen/qwen3.6-27b rejects it
      // (400: "must be one of `none` or `default`"), so this is a per-call
      // param, not a hardcoded constant.
      reasoning_effort: reasoningEffort,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const inputTokens = data.usage?.prompt_tokens ?? 0;
  const outputTokens = data.usage?.completion_tokens ?? 0;
  if (data.usage) logAiCost(feature, model, inputTokens, outputTokens);
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned no content");
  return { text, inputTokens, outputTokens };
}

// Same shape as groqChat, but requests structured JSON output - used by
// grading/classification, which need a real object back, not prose.
// Verified against the live API with this project's actual grading and
// Reasoning Interview prompts before relying on it (response_format:
// json_object works with QA_MODEL).
async function groqChatJSON<T>(feature: string, model: string, system: string, user: string, maxTokens: number): Promise<T> {
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

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  if (data.usage) logAiCost(feature, model, data.usage.prompt_tokens ?? 0, data.usage.completion_tokens ?? 0);
  const raw = data.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("Groq returned no content");
  return JSON.parse(raw) as T;
}

/**
 * Same contract as lib/claude.ts's askConceptQuestion, for whenever
 * ANTHROPIC_API_KEY isn't configured but GROQ_API_KEY is - grounded in the
 * concept's own content, not a generic web answer.
 */
export async function askConceptQuestionGroq(
  concept: Concept,
  question: string,
  language: string = "English",
  subject: string = "English",
  modelOverride?: string
): Promise<string> {
  const contextBlock = [
    `Concept: ${concept.concept_name}`,
    concept.definition ? `Definition: ${concept.definition}` : null,
    concept.key_points?.length ? `Key points:\n${concept.key_points.map((p) => `- ${p}`).join("\n")}` : null,
    concept.examples?.length ? `Examples:\n${concept.examples.map((e) => `- ${e}`).join("\n")}` : null,
    concept.media?.source_image_transcript
      ? `The picture shown above this chat is the actual reference page for this concept. Here is exactly what's printed on it, so you can answer questions about its specific content:\n${concept.media.source_image_transcript}`
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const languageInstruction =
    language !== "English"
      ? ` Respond in ${language}, not English - the student or parent needs this explanation in ${language} to ` +
        `really understand it. When you use the important ${subject} term or vocabulary word being taught, say ` +
        `the ${language} explanation first and then give that key term in English too (in parentheses), so ` +
        `they still pick up the English vocabulary for it.`
      : "";

  // Lets the tutor actually show a matching picture instead of just
  // describing one in words when a student asks to see/draw something - a
  // real gap reported 2026-08-22 (a kid asked for a pizza picture and got
  // told "I'm not able to share a picture" even though a matching one
  // exists). Only added when the concept actually has alternates configured.
  const alternates = concept.media?.alternate_illustrations ?? [];
  const illustrationInstruction = alternates.length
    ? ` Special exception to the plain-prose rule: if the student asks to see, show, or draw a picture, image, or ` +
      `diagram, and one of these matches what you're explaining - ${alternates
        .map((a) => `"${a.illustration_key}" (${a.caption})`)
        .join(", ")} - include the exact token [[illustration:KEY]] once, anywhere in your answer, using one of ` +
      `those exact keys (never invent one). This token is stripped out before the answer is shown or read aloud, ` +
      `so it's fine to include even though everything else must be spoken-style prose. If nothing available ` +
      `actually matches, just say in words that you don't have a matching picture for that.`
    : "";

  const result = await groqChat(
    "ask",
    modelOverride ?? QA_MODEL,
    "You are a patient, encouraging tutor for a Grade 5 (Cambridge Stage 5) student. " +
      "Only answer using the concept context provided - stay on topic for this concept. " +
      "Explain simply, in plain words a 9-10 year old understands. Use an example from the " +
      "context if it helps. Keep the answer under 100 words, unless the student's question needs you to work " +
      "through several steps or list several items (like ordering a set of numbers) - then take the room you " +
      "need to finish completely, still in plain simple spoken words. Never mention marks, scores, or grades - " +
      "this is a no-pressure practice conversation, not a test. If the question is unrelated to the " +
      "concept, gently redirect back to it. " +
      "This answer is read aloud by text-to-speech, so write it exactly as you'd say it out loud: plain " +
      "prose only, no markdown at all (no **bold**, *italic*, #headers, or `code`), and no numbered or " +
      "bulleted lists (no '1.' '2.' '-' markers) - if you're covering more than one point, use spoken " +
      "connectors instead, like 'First, ... Also, ... Finally, ...'. If you need to refer to a letter " +
      "pattern or suffix by itself (like -ly or -er), spell it as separated letters (e.g. 'the letters L, Y') " +
      "so it's not misread as a word." +
      languageInstruction +
      illustrationInstruction,
    `${contextBlock}\n\nStudent's question: ${question.trim().slice(0, 500)}`,
    // 300 truncated mid-sentence once source_image_transcript started
    // grounding answers in real multi-step problems - confirmed live
    // 2026-08-22 against the exact reported bug's question.
    600
  );
  return result.text;
}

/**
 * Same prompt/contract as askConceptQuestionGroq, but returns real token
 * usage alongside the answer - used only by /admin/model-compare, which
 * needs actual cost/latency numbers to compare, not another estimate.
 * Kept separate from askConceptQuestionGroq's Promise<string> contract so
 * the live student-facing call site (app/api/ask/route.ts) never has to
 * change shape for a comparison-only need.
 */
export async function askConceptQuestionGroqWithUsage(
  concept: Concept,
  question: string,
  language: string,
  subject: string,
  model: string
): Promise<GroqChatResult> {
  const contextBlock = [
    `Concept: ${concept.concept_name}`,
    concept.definition ? `Definition: ${concept.definition}` : null,
    concept.key_points?.length ? `Key points:\n${concept.key_points.map((p) => `- ${p}`).join("\n")}` : null,
    concept.examples?.length ? `Examples:\n${concept.examples.map((e) => `- ${e}`).join("\n")}` : null,
    concept.media?.source_image_transcript
      ? `The picture shown above this chat is the actual reference page for this concept. Here is exactly what's printed on it, so you can answer questions about its specific content:\n${concept.media.source_image_transcript}`
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const languageInstruction =
    language !== "English"
      ? ` Respond in ${language}, not English - the student or parent needs this explanation in ${language} to ` +
        `really understand it. When you use the important ${subject} term or vocabulary word being taught, say ` +
        `the ${language} explanation first and then give that key term in English too (in parentheses), so ` +
        `they still pick up the English vocabulary for it.`
      : "";

  return groqChat(
    "model-compare",
    model,
    "You are a patient, encouraging tutor for a Grade 5 (Cambridge Stage 5) student. " +
      "Only answer using the concept context provided - stay on topic for this concept. " +
      "Explain simply, in plain words a 9-10 year old understands. Use an example from the " +
      "context if it helps. Keep the answer under 100 words, unless the student's question needs you to work " +
      "through several steps or list several items (like ordering a set of numbers) - then take the room you " +
      "need to finish completely, still in plain simple spoken words. Never mention marks, scores, or grades - " +
      "this is a no-pressure practice conversation, not a test. If the question is unrelated to the " +
      "concept, gently redirect back to it. " +
      "This answer is read aloud by text-to-speech, so write it exactly as you'd say it out loud: plain " +
      "prose only, no markdown at all (no **bold**, *italic*, #headers, or `code`), and no numbered or " +
      "bulleted lists (no '1.' '2.' '-' markers) - if you're covering more than one point, use spoken " +
      "connectors instead, like 'First, ... Also, ... Finally, ...'. If you need to refer to a letter " +
      "pattern or suffix by itself (like -ly or -er), spell it as separated letters (e.g. 'the letters L, Y') " +
      "so it's not misread as a word." +
      languageInstruction,
    `${contextBlock}\n\nStudent's question: ${question.trim().slice(0, 500)}`,
    600,
    // Confirmed live 2026-08-22: Qwen3.6-27B only accepts "none"/"default"
    // for reasoning_effort, unlike the gpt-oss models' "low" - "none" is the
    // closer analog (minimal reasoning overhead, same intent as "low" here).
    model === QWEN_MODEL ? "none" : "low"
  );
}

const TRANSCRIBE_SYSTEM_PROMPT = `You transcribe the printed content of a textbook/workbook page image, precisely and completely, for a tutoring app to use as reference when answering a student's questions about this exact page.

Preserve:
- Any question/exercise numbering exactly as printed (e.g. "6.", "a)", "Q3")
- All specific numbers, fractions, values, words, and answer options exactly as printed
- Section headers or instructions, in reading order

Do NOT solve or answer any of the questions, and do NOT add commentary or explanation - just transcribe what is printed.

If there is handwriting, pencil marks, or teacher's red-pen marks on the page, IGNORE them completely and transcribe only the originally-printed content - never transcribe a handwritten answer, even partially. This is critical: some pages are a student's own completed homework, and showing them their own past answer would defeat the point of using it for fresh practice.

Respond with ONLY the transcript as plain text, no preamble, no markdown fences, no commentary.`;

/**
 * Same contract/prompt as lib/claude.ts's transcribeReferencePage, using
 * Qwen3.6-27B on Groq (confirmed multimodal - verified live 2026-08-22 via
 * the OpenAI-compatible image_url content block, same format documented at
 * console.groq.com). This is the PRIMARY path, not just a fallback: this
 * deployment currently has no ANTHROPIC_API_KEY configured at all (real
 * Anthropic-credit gap, same root cause documented in app/api/ask/route.ts),
 * so a Claude-only transcription function would silently never run. See
 * lib/conceptImageTranscription.ts for the Groq-first/Claude-fallback tiering.
 */
export async function transcribeReferencePageGroq(image: UploadedPageImage): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: QWEN_MODEL,
      max_tokens: 1500,
      temperature: 0.2,
      reasoning_effort: "none",
      messages: [
        { role: "system", content: TRANSCRIBE_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:${image.mediaType};base64,${image.base64}` } },
            { type: "text", text: "Transcribe this page." },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq vision request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  if (data.usage) logAiCost("transcribe", QWEN_MODEL, data.usage.prompt_tokens ?? 0, data.usage.completion_tokens ?? 0);
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned no transcript content");
  return text;
}

/**
 * Converts ONE photographed page into a "content pack" fragment (JSON text,
 * parsed by the caller) using content/prompts/extract-worksheet.md's system
 * prompt - the declarative-check alternative to plain-prose concept content
 * (see content/HANDOFF.md, PLATFORM_PLAN.md's 2026-08-24 entry). Scoped to
 * one page per call, not a whole book: Qwen3.6-27B's Groq tier has an 8000
 * TPM cap (hit live during the sourceImageTranscript backfill), and the
 * original kit's own convert.mjs budgets 32000 output tokens per call for a
 * whole book - completely incompatible with that ceiling. temperature 0,
 * matching the prompt's own "temperature 0, transcribe only" instruction -
 * this generates graded content, not a chat answer, so determinism matters
 * more than variety.
 */
export async function extractPackFragmentGroq(
  image: UploadedPageImage,
  system: string,
  userText: string
): Promise<GroqChatResult> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: QWEN_MODEL,
      max_tokens: 4000,
      temperature: 0,
      reasoning_effort: "none",
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:${image.mediaType};base64,${image.base64}` } },
            { type: "text", text: userText },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq vision request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const inputTokens = data.usage?.prompt_tokens ?? 0;
  const outputTokens = data.usage?.completion_tokens ?? 0;
  if (data.usage) logAiCost("content-pack", QWEN_MODEL, inputTokens, outputTokens);
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned no content-pack content");
  return { text, inputTokens, outputTokens };
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
    "follow-ups",
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
 * Daily vocabulary practice (synonyms/antonyms) - a lightweight, always-
 * fresh-generated MCQ set rather than a curated/persisted question bank.
 * Deliberate MVP scope: no database table, no "don't repeat today's words"
 * tracking, no per-unit grounding yet - see PLATFORM_PLAN.md's decision
 * record for why (no usage data yet to design real persistence against).
 * Falls back to lib/vocabPractice.ts's static set if this fails, so the
 * feature always works even without Groq configured.
 */
export async function generateVocabPracticeGroq(): Promise<VocabItem[]> {
  const parsed = await groqChatJSON<{ items: VocabItem[] }>(
    "vocab-practice",
    QA_MODEL,
    "You write vocabulary practice questions for a Grade 5 (9-10 year old, Cambridge Stage 5 English) " +
      "student. Generate exactly 3 multiple-choice questions, mixing three kinds: a synonym question " +
      "('Which word means the SAME as X?'), an antonym question ('Which word means the OPPOSITE of X?'), " +
      "and an idiom-meaning question ('What does \"X\" mean?', where X is a common English idiom). Include " +
      "at least one idiom question when possible, and vary which kinds appear each time rather than always " +
      "the same mix. Use words/idioms a Grade 5 student would plausibly meet in stories or everyday writing - " +
      "not overly obscure, not trivially easy. Each question needs exactly 4 short options, with exactly one " +
      "correct answer, and the 3 wrong options should be plausible enough to actually make the student think, " +
      "not obviously silly. Respond with ONLY a JSON object, no other text: " +
      '{"items": [{"word": string, "type": "synonym"|"antonym"|"idiom", "question": string, "options": [string,string,string,string], "correctIndex": number}]}.',
    "Generate 3 fresh vocabulary practice questions now, different words/idioms than typical overused " +
      "examples like 'happy', 'big', or 'piece of cake'.",
    600
  );

  const items = (parsed.items ?? []).filter(
    (i) =>
      i &&
      typeof i.word === "string" &&
      (i.type === "synonym" || i.type === "antonym" || i.type === "idiom") &&
      typeof i.question === "string" &&
      Array.isArray(i.options) &&
      i.options.length === 4 &&
      Number.isInteger(i.correctIndex) &&
      i.correctIndex >= 0 &&
      i.correctIndex < 4
  );

  if (items.length === 0) throw new Error("Groq returned no usable vocab items");
  return items.slice(0, 3);
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
  const result = await groqChat(
    "micro-check",
    REACTION_MODEL,
    "You are a warm Grade 5 tutor giving a ONE-sentence reaction to a student's spoken answer to a " +
      "quick check-in question during a lesson. React specifically to what they actually said - if it's " +
      "on the right track, affirm what's right and add anything missing; if it's off-track or vague, say " +
      "so kindly and nudge them in the right direction; never praise a non-answer. Never mention marks or " +
      "scores. Keep it under 30 words, plain text, no markdown.",
    `Question asked: ${question}\n\nStudent's answer: ${studentAnswer.trim().slice(0, 500)}`,
    80
  );
  return result.text;
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
    "grade",
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
    "reasoning",
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
