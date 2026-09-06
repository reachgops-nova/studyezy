import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type {
  Concept,
  ConceptMedia,
  MarkScheme,
  ProgressionTestDraft,
  QuestionPaperDifficulty,
  TestQuestion,
  VoiceQASample,
} from "./types";
import { logAiCost } from "./aiCost";
import { buildConceptContextBlock } from "./conceptContext";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

// Cheap, fast model for the high-frequency, low-stakes interactive calls
// (every voice question, every test answer) - cost matters more than extra
// polish here, and Haiku is plenty for a 100-word grounded answer.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

// Better model for content extraction specifically: this runs rarely (once
// per batch of uploaded pages, triggered by a parent, not per interaction)
// but its output becomes the actual curriculum content taught to a real kid -
// quality matters more than the marginal cost here, so it's worth the
// upgrade from the interactive-call model.
const EXTRACTION_MODEL = "claude-sonnet-5";

const MAX_QUESTION_LENGTH = 500;

export function isConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Curriculum-aware voice Q&A. Grounds the answer in the specific concept the
 * kid is studying (not a generic web answer) and keeps it short and simple,
 * per PLATFORM_PLAN.md's voice Q&A principles.
 */
export async function askConceptQuestion(
  concept: Concept,
  question: string,
  language: string = "English",
  subject: string = "English",
  allConcepts: Concept[] = []
): Promise<string> {
  const trimmed = question.trim().slice(0, MAX_QUESTION_LENGTH);
  if (!trimmed) {
    throw new Error("Question cannot be empty.");
  }

  const contextBlock = buildConceptContextBlock(concept, allConcepts);

  // Only added when a non-English language was actually chosen (see
  // AvatarChat.tsx's language selector) - a parent who isn't fluent in
  // English, or a kid who needs a native-language bridge for a hard idea,
  // gets a real answer instead of one they can't fully follow. The subject's
  // own key term is still kept in English (regardless of subject), since
  // school and exams use English terminology either way.
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

  const response = await getClient().messages.create({
    model: MODEL,
    // 300 was enough while every answer was a short generic explanation.
    // Now that a concept's source_image_transcript can ground a question in
    // a specific multi-step problem (e.g. "arrange all 10 fractions"), the
    // model needs real room to work through it instead of getting cut off
    // mid-sentence - confirmed live 2026-08-22 (the exact reported bug's
    // question truncated at 300 even though the answer was finally correct).
    max_tokens: 600,
    system:
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
      "so it's not misread as a word. One more exception: when your answer uses a specific vocabulary word " +
      "or concept term the student should remember (like 'third person' or 'chronological order'), wrap just " +
      "that term in ==double equals== the first time it appears (e.g. ==third person==) so it can be " +
      "highlighted for the student - at most 2-4 terms per answer, only the term itself and not the words " +
      "around it, and skip this entirely if the answer doesn't really have standout vocabulary. Same rule " +
      "applies, and matters even more, when the student shares a piece of their own writing and asks you to " +
      "check or correct it: wrap each word or phrase you actually changed in ==double equals== (just the " +
      "fixed word or phrase itself, e.g. ==Gopi's== or ==searched everywhere==, not the whole sentence around " +
      "it), so every real correction is visually highlighted for them to focus on - that's the main thing " +
      "they need to see and remember for their next piece of writing. This marker " +
      "is stripped before the text is shown or read aloud, same as the illustration token." +
      languageInstruction +
      illustrationInstruction,
    messages: [
      {
        role: "user",
        content: `${contextBlock}\n\nStudent's question: ${trimmed}`,
      },
    ],
  });

  logAiCost("ask", MODEL, response.usage.input_tokens, response.usage.output_tokens);
  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text : "";
}

export interface GradeResult {
  marks_awarded: number;
  full_marks: number;
  feedback: string;
}

/**
 * Grades a short-answer response against the mark scheme, but the feedback is
 * framed around how to write it better next time, not just correctness -
 * consistent with the "no scoring pressure" principle.
 */
export async function gradeShortAnswer(
  questionText: string,
  markScheme: MarkScheme,
  studentAnswer: string
): Promise<GradeResult> {
  const trimmedAnswer = studentAnswer.trim().slice(0, 2000);

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 400,
    system:
      "You are grading a Grade 5 student's short-answer response, kindly and constructively. " +
      "Respond with ONLY a JSON object matching this shape, no other text: " +
      '{"marks_awarded": number, "feedback": string}. ' +
      "The feedback should focus on how to write the answer better next time (e.g. show your " +
      "reasoning, use evidence from the text), not just whether it was right or wrong. Keep feedback " +
      "under 80 words and encouraging in tone.",
    messages: [
      {
        role: "user",
        content: `Question: ${questionText}\n\nMark scheme (full marks: ${markScheme.full_marks}):\n${markScheme.criteria
          .map((c) => `- ${c}`)
          .join("\n")}\n\nStudent's answer: ${trimmedAnswer}`,
      },
    ],
  });

  logAiCost("grade", MODEL, response.usage.input_tokens, response.usage.output_tokens);
  const textBlock = response.content.find((block) => block.type === "text");
  const raw = textBlock && textBlock.type === "text" ? textBlock.text : "{}";

  try {
    const parsed = JSON.parse(raw) as { marks_awarded: number; feedback: string };
    return {
      marks_awarded: Math.max(0, Math.min(markScheme.full_marks, Math.round(parsed.marks_awarded))),
      full_marks: markScheme.full_marks,
      feedback: parsed.feedback,
    };
  } catch {
    return {
      marks_awarded: 0,
      full_marks: markScheme.full_marks,
      feedback: "Couldn't grade this automatically - please review with a parent.",
    };
  }
}

export type ReasoningClassification =
  | "correct_reasoning"
  | "conceptual_gap"
  | "careless_slip"
  | "misread_question";

export interface ReasoningResult {
  classification: ReasoningClassification;
  note: string;
}

const VALID_CLASSIFICATIONS: ReasoningClassification[] = [
  "correct_reasoning",
  "conceptual_gap",
  "careless_slip",
  "misread_question",
];

/**
 * Classifies *why* an answer was right or wrong from the kid's own
 * explanation - a conceptual gap, a careless slip, or a misread question are
 * three different fixes, and a raw score can't tell them apart. Feeds the
 * Reasoning Interview (PLATFORM_PLAN.md §2.4) and later the Prep Planner.
 */
export async function classifyReasoning(
  question: string,
  studentAnswer: string,
  explanation: string
): Promise<ReasoningResult> {
  const trimmedExplanation = explanation.trim().slice(0, 1000);

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 300,
    system:
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
    messages: [
      {
        role: "user",
        content: `Question: ${question}\n\nStudent's answer: ${studentAnswer}\n\nStudent's explanation of their thinking: ${trimmedExplanation}`,
      },
    ],
  });

  logAiCost("reasoning", MODEL, response.usage.input_tokens, response.usage.output_tokens);
  const textBlock = response.content.find((block) => block.type === "text");
  const raw = textBlock && textBlock.type === "text" ? textBlock.text : "{}";

  try {
    const parsed = JSON.parse(raw) as { classification: string; note: string };
    const classification = VALID_CLASSIFICATIONS.includes(parsed.classification as ReasoningClassification)
      ? (parsed.classification as ReasoningClassification)
      : "correct_reasoning";
    return { classification, note: parsed.note };
  } catch {
    return {
      classification: "correct_reasoning",
      note: "Thanks for walking me through your thinking!",
    };
  }
}

export interface ExpectedConcept {
  concept_id: string;
  concept_name: string;
  story_reference?: string;
}

export interface UploadedPageImage {
  path: string; // public URL, e.g. /uploads/{unitKey}/xyz.jpg
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  base64: string;
}

// Deliberately not folded into UploadedPageImage above - that type is shared
// by several other functions (exam coaching, page transcription, worksheet
// conversion) this pass didn't touch, and a PDF isn't a valid `type: "image"`
// content block for any of them. Only the two lesson-extraction functions
// below (which now accept a workbook as one PDF, not just page photos - real
// feedback 2026-09-06: "I have content/sample workbook... I can upload")
// know how to route a PDF to Claude's native `type: "document"` block
// instead.
export interface ExtractionSourceFile {
  path: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
  base64: string;
}

function toExtractionContentBlock(file: ExtractionSourceFile) {
  if (file.mediaType === "application/pdf") {
    return {
      type: "document" as const,
      source: { type: "base64" as const, media_type: "application/pdf" as const, data: file.base64 },
    };
  }
  return {
    type: "image" as const,
    source: { type: "base64" as const, media_type: file.mediaType, data: file.base64 },
  };
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
 * Transcribes a real reference page's printed content once, so it can be
 * baked into a concept's context permanently (see
 * lib/conceptImageTranscription.ts) instead of re-sent as an image on every
 * single student question - far cheaper and faster, and fixes a real gap
 * where the AI tutor had no idea what was actually on the picture it was
 * showing (reported 2026-08-22: "I'm not able to see the picture you're
 * referring to").
 */
export async function transcribeReferencePage(image: UploadedPageImage): Promise<string> {
  const response = await getClient().messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 1500,
    system: TRANSCRIBE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image" as const,
            source: { type: "base64" as const, media_type: image.mediaType, data: image.base64 },
          },
        ],
      },
    ],
  });

  logAiCost("transcribe", EXTRACTION_MODEL, response.usage.input_tokens, response.usage.output_tokens);
  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";
}

export interface VisionExtractResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Claude fallback for extractPackFragmentGroq (lib/groq.ts) - same contract,
 * used when Groq isn't configured or fails, matching the Groq-first/Claude-
 * fallback tiering already established in lib/conceptImageTranscription.ts.
 * temperature 0 (deterministic), matching content/prompts/extract-worksheet.md's
 * own instruction - this generates graded content, not a chat answer.
 */
export async function extractPackFragmentClaude(
  image: UploadedPageImage,
  system: string,
  userText: string
): Promise<VisionExtractResult> {
  const response = await getClient().messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 4000,
    temperature: 0,
    system,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.base64 } },
          { type: "text", text: userText },
        ],
      },
    ],
  });

  logAiCost("content-pack", EXTRACTION_MODEL, response.usage.input_tokens, response.usage.output_tokens);
  const textBlock = response.content.find((block) => block.type === "text");
  return {
    text: textBlock && textBlock.type === "text" ? textBlock.text.trim() : "",
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

// Static instructional half of the extraction prompt - identical on every
// call for a given unit, so it's worth a cache_control breakpoint: the
// per-call variable part (which concepts are still missing) is appended
// separately in the user turn, after the cached prefix.
// Exported so lib/openrouter.ts's extraction functions use the identical
// wording instead of a hand-copied, driftable duplicate.
export const EXTRACTION_SYSTEM_PROMPT = `You are structuring curriculum content for a voice-led English tutoring app for a Grade 5 (Cambridge Stage 5) student, from photos of their own textbook pages.

CRITICAL - originality: Write your OWN explanations of what's shown in the photos, in your own words, the way a tutor would explain it out loud. Do NOT copy or closely paraphrase sentences directly from the page images - this becomes original teaching content, not a reproduction of the book.

You will be given: (1) photos of textbook pages, and (2) a list of "expected concepts" the family's unit is known to cover (id, name, and optionally which story/section it comes from). For each expected concept that the photos actually contain enough material for, produce:
- concept_id: copy exactly from the expected concept
- concept_name: copy exactly from the expected concept
- definition: 1-2 original sentences, grade-appropriate
- key_points: 2-4 original bullet points
- examples: 1-2 original examples (can reference the story context if relevant, but don't quote it verbatim)
- tips_to_remember: 1 short original memory tip
- voice_qa_samples: 2 short original question+answer pairs a curious kid might ask, with simple grade-appropriate answers
- source_image_index: the 0-based index of the single uploaded photo that best represents this concept

Skip any expected concept the photos don't contain enough material for - do not invent content for it.

Respond with ONLY a JSON array matching this shape, no other text, no markdown fences:
[{"concept_id": string, "concept_name": string, "definition": string, "key_points": string[], "examples": string[], "tips_to_remember": string[], "voice_qa_samples": [{"question": string, "answer": string}], "source_image_index": number}]`;

export interface RawExtractedConcept {
  concept_id: string;
  concept_name: string;
  definition: string;
  key_points: string[];
  examples: string[];
  tips_to_remember: string[];
  voice_qa_samples: VoiceQASample[];
  source_image_index: number;
}

// Shared by every extraction provider (Claude here, OpenRouter in
// lib/openrouter.ts) - same JSON shape, same originality contract, so the
// parsing/mapping logic only needs to exist once.
export function parseExtractedConcepts(raw: string, images: ExtractionSourceFile[]): Concept[] {
  let parsed: RawExtractedConcept[];
  try {
    parsed = JSON.parse(raw) as RawExtractedConcept[];
  } catch {
    throw new Error("Couldn't understand the extracted content - please try again.");
  }

  return parsed
    .filter((c) => images[c.source_image_index])
    .map((c): Concept => ({
      concept_id: c.concept_id,
      concept_name: c.concept_name,
      status: "drafted",
      source: "extracted",
      definition: c.definition,
      key_points: c.key_points,
      examples: c.examples,
      tips_to_remember: c.tips_to_remember,
      voice_qa_samples: c.voice_qa_samples,
      media: {
        source_image_path: images[c.source_image_index].path,
        illustration_caption: c.concept_name,
        video_status: "coming_soon",
      },
    }));
}

/**
 * Turns a parent's uploaded textbook page photos into structured lesson
 * concepts, targeting whichever concepts a unit still has stubbed as
 * "coming soon". This is what fills in the rest of a unit without needing
 * every concept hand-authored - see app/api/pages/extract/route.ts.
 */
export async function extractConceptsFromPages(
  images: ExtractionSourceFile[],
  expected: ExpectedConcept[]
): Promise<Concept[]> {
  const response = await getClient().messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 8000,
    output_config: { effort: "medium" },
    system: [
      {
        type: "text",
        text: EXTRACTION_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          ...images.map(toExtractionContentBlock),
          {
            type: "text" as const,
            text: `Expected concepts for this unit:\n${JSON.stringify(expected, null, 2)}`,
          },
        ],
      },
    ],
  });

  logAiCost("extract", EXTRACTION_MODEL, response.usage.input_tokens, response.usage.output_tokens);
  const textBlock = response.content.find((block) => block.type === "text");
  const raw = textBlock && textBlock.type === "text" ? textBlock.text : "[]";
  return parseExtractedConcepts(raw, images);
}

// A brand-new unit with literally no outline yet (real feedback 2026-09-06:
// "Units can be derived from there... we don't need to feed unit numbers
// here") has nothing for extractConceptsFromPages' "expected concepts" list
// to match against - that function explicitly refuses to invent a concept
// that isn't already named. This is the from-scratch counterpart: given
// just the photos (no pre-declared breakdown), it proposes one itself.
export const FREEFORM_EXTRACTION_SYSTEM_PROMPT = `You are structuring curriculum content for a voice-led tutoring app, from photos of a family's own textbook or workbook pages for a subject that has no lesson breakdown yet at all.

CRITICAL - originality: Write your OWN explanations of what's shown in the photos, in your own words, the way a tutor would explain it out loud. Do NOT copy or closely paraphrase sentences directly from the page images - this becomes original teaching content, not a reproduction of the book.

You will be given photos of pages from a workbook or textbook. Propose a sensible breakdown into distinct concepts/topics these pages actually cover - however many the material genuinely supports (typically 2-6), never padding out topics that aren't really there. For each concept, produce:
- concept_id: a short id in "N.M" form, numbered in the order they should be taught (e.g. "1.1", "1.2", ...)
- concept_name: a short, clear topic name (e.g. "Binary numbers", "Loops in Python")
- definition: 1-2 original sentences, grade-appropriate
- key_points: 2-4 original bullet points
- examples: 1-2 original examples
- tips_to_remember: 1 short original memory tip
- voice_qa_samples: 2 short original question+answer pairs a curious kid might ask, with simple grade-appropriate answers
- source_image_index: the 0-based index of the single uploaded photo that best represents this concept

Respond with ONLY a JSON array matching this shape, no other text, no markdown fences:
[{"concept_id": string, "concept_name": string, "definition": string, "key_points": string[], "examples": string[], "tips_to_remember": string[], "voice_qa_samples": [{"question": string, "answer": string}], "source_image_index": number}]`;

/**
 * Same output shape and originality rules as extractConceptsFromPages, but
 * for a unit with no existing outline to match against - it proposes its
 * own concept_id/concept_name breakdown instead of only filling in
 * pre-declared ones. See app/api/pages/extract/route.ts for when each mode
 * is used.
 */
export async function extractFreeformConcepts(images: ExtractionSourceFile[]): Promise<Concept[]> {
  const response = await getClient().messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 8000,
    output_config: { effort: "medium" },
    system: FREEFORM_EXTRACTION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: images.map(toExtractionContentBlock),
      },
    ],
  });

  logAiCost("extract-freeform", EXTRACTION_MODEL, response.usage.input_tokens, response.usage.output_tokens);
  const textBlock = response.content.find((block) => block.type === "text");
  const raw = textBlock && textBlock.type === "text" ? textBlock.text : "[]";
  return parseExtractedConcepts(raw, images);
}

// Per-difficulty instruction appended to the shared prompt below - keeps the
// three tiers meaningfully different (not just "same paper, relabeled"),
// per the 2026-08-20 decision that kids should be able to choose their own
// challenge level rather than get one fixed paper.
const DIFFICULTY_INSTRUCTIONS: Record<QuestionPaperDifficulty, string> = {
  easy:
    "Difficulty: EASY. Favor multiple_choice over short_answer (at most 1-2 short_answer). Use simple, " +
    "everyday vocabulary and short sentences. Give clearly distinct, unambiguous options - no trick answers. " +
    "Each question should test one idea at a time, close to how the concept's own definition/examples state it.",
  moderate:
    "Difficulty: MODERATE. This is the standard, default level - mix multiple_choice and short_answer roughly " +
    "evenly, matching how a concept would normally be assessed after learning it.",
  tough:
    "Difficulty: TOUGH. Favor short_answer over multiple_choice. Push beyond straight recall - ask the student " +
    "to apply, compare, or explain reasoning, not just identify a fact. Multiple-choice options (where used) " +
    "should include plausible near-misses, not obviously-wrong distractors. Less scaffolding in the question " +
    "wording - a strong student should have to think, not just pattern-match.",
};

// Static instructional half of the question-paper prompt, cached the same
// way as EXTRACTION_SYSTEM_PROMPT above (per-difficulty text is appended
// before the cache_control block, so each tier gets its own cache entry -
// generation is rare/admin-triggered, so a smaller cache-hit-rate hit here
// is an acceptable trade for genuinely different papers per tier).
function questionPaperSystemPrompt(difficulty: QuestionPaperDifficulty): string {
  return `You are writing an original curriculum-aligned practice question paper for a Grade 5 (Cambridge Stage 5) student, from photos of a unit's admin-approved textbook/worksheet/classwork pages.

CRITICAL - originality: Write your OWN questions inspired by what's shown in the photos - do NOT copy questions or passages verbatim from the pages. This becomes original assessment content, not a reproduction of the source material.

You will be given: (1) photos of the unit's approved source material, and (2) the list of concepts this unit covers (id and name). Write 6-10 questions in total, spanning as many of the given concepts as the material supports, mixing multiple_choice and short_answer types.

${DIFFICULTY_INSTRUCTIONS[difficulty]}

Respond with ONLY a JSON object matching this shape, no other text, no markdown fences:
{"covers_concepts": string[], "note": string, "questions": [{"type": "multiple_choice", "question": string, "options": string[], "correct_answer": number, "concept_tested": string} | {"type": "short_answer", "question": string, "concept_tested": string, "mark_scheme": {"full_marks": number, "criteria": string[]}}]}

- covers_concepts: the concept ids actually tested (copy exactly from the given list)
- note: one short sentence describing this practice paper
- multiple_choice.correct_answer: 0-based index into options
- short_answer.mark_scheme.criteria: 2-4 short marking points`;
}

interface RawQuestionPaper {
  covers_concepts: string[];
  note?: string;
  questions: TestQuestion[];
}

/**
 * Generates a curriculum-aligned practice question paper, at a chosen
 * difficulty tier, from a unit's admin-approved canonical material
 * (PLATFORM_PLAN.md §2.7) - "based on textbook/worksheet/classwork we can
 * build question papers too." Writes into the QuestionPaper table (one row
 * per unit+difficulty, see prisma/schema.prisma), which drives real
 * TestAttempt/ConceptMastery data, so this stays on the extraction-tier
 * Claude model like the other high-value, rarely-run calls - never routed
 * through the Groq fallback tier used for low-stakes interactive answers.
 */
export async function generateQuestionPaper(
  images: UploadedPageImage[],
  concepts: { concept_id: string; concept_name: string }[],
  difficulty: QuestionPaperDifficulty = "moderate"
): Promise<ProgressionTestDraft> {
  const response = await getClient().messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 4000,
    output_config: { effort: "medium" },
    system: [
      {
        type: "text",
        text: questionPaperSystemPrompt(difficulty),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          ...images.map((img) => ({
            type: "image" as const,
            source: { type: "base64" as const, media_type: img.mediaType, data: img.base64 },
          })),
          {
            type: "text" as const,
            text: `Concepts this unit covers:\n${JSON.stringify(concepts, null, 2)}`,
          },
        ],
      },
    ],
  });

  logAiCost("question-paper", EXTRACTION_MODEL, response.usage.input_tokens, response.usage.output_tokens);
  const textBlock = response.content.find((block) => block.type === "text");
  const raw = textBlock && textBlock.type === "text" ? textBlock.text : "{}";

  let parsed: RawQuestionPaper;
  try {
    parsed = JSON.parse(raw) as RawQuestionPaper;
  } catch {
    throw new Error("Couldn't generate a question paper from that material - please try again.");
  }

  return {
    test_id: `generated-${Date.now()}`,
    covers_concepts: parsed.covers_concepts ?? [],
    note: parsed.note,
    questions: parsed.questions ?? [],
  };
}

export interface ExamCoachingResult {
  technique_notes: string[];
  overall_note: string;
  marks_note: string;
}

const EXAM_COACHING_SYSTEM_PROMPT = `You are coaching a Grade 5 (Cambridge Stage 5) student on exam WRITING TECHNIQUE from photos of a real handwritten practice paper they just completed, timed like a real exam.

Your focus is HOW they wrote the answers, not just whether they were correct:
- Was working/reasoning shown, or just a final answer?
- Is the final answer clearly indicated (underlined, boxed, "Answer:" etc.) or hard to find?
- Does handwriting/layout suggest rushing on later questions (messier, shorter, incomplete)?
- If time spent is given, does it look proportional across questions, or did they get stuck on one?

Respond with ONLY a JSON object, no other text, no markdown fences:
{"technique_notes": string[], "overall_note": string, "marks_note": string}

- technique_notes: 2-4 short, specific, kind, ACTIONABLE tips framed as "next time, try..." - never "you failed to...". Reference specific questions/pages where useful.
- overall_note: 1-2 encouraging sentences on their exam technique as a whole.
- marks_note: a brief, low-emphasis note only about correctness/marks - this is shown LAST and de-emphasized, never the headline.

Never use words like "wrong", "failed", or "bad" - this is coaching on craft, not a verdict.`;

/**
 * Written Exam Capture & Coaching (PLATFORM_PLAN.md §2.5): reads photos of a
 * real handwritten practice paper directly (no separate OCR step - Claude's
 * vision reads handwriting and reasons about technique in one pass) and
 * coaches HOW it was written, not just whether it was right. Uses the
 * extraction-tier model since this is a rare, high-value call, not a
 * per-interaction one.
 */
export async function coachWrittenExam(
  images: UploadedPageImage[],
  timeSpentMinutes: number | null
): Promise<ExamCoachingResult> {
  const timeContext = timeSpentMinutes
    ? `The student reports spending ${timeSpentMinutes} minutes on this paper.`
    : "No time information was provided.";

  const response = await getClient().messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 1000,
    output_config: { effort: "medium" },
    system: EXAM_COACHING_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          ...images.map((img) => ({
            type: "image" as const,
            source: { type: "base64" as const, media_type: img.mediaType, data: img.base64 },
          })),
          { type: "text" as const, text: timeContext },
        ],
      },
    ],
  });

  logAiCost("exam-coaching", EXTRACTION_MODEL, response.usage.input_tokens, response.usage.output_tokens);
  const textBlock = response.content.find((block) => block.type === "text");
  const raw = textBlock && textBlock.type === "text" ? textBlock.text : "{}";

  try {
    const parsed = JSON.parse(raw) as ExamCoachingResult;
    return {
      technique_notes: parsed.technique_notes ?? [],
      overall_note: parsed.overall_note ?? "",
      marks_note: parsed.marks_note ?? "",
    };
  } catch {
    throw new Error("Couldn't read that paper right now - please try again.");
  }
}
