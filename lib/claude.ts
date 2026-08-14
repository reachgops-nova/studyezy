import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Concept, ConceptMedia, MarkScheme, VoiceQASample } from "./types";

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
  question: string
): Promise<string> {
  const trimmed = question.trim().slice(0, MAX_QUESTION_LENGTH);
  if (!trimmed) {
    throw new Error("Question cannot be empty.");
  }

  const contextBlock = [
    `Concept: ${concept.concept_name}`,
    concept.definition ? `Definition: ${concept.definition}` : null,
    concept.key_points?.length ? `Key points:\n${concept.key_points.map((p) => `- ${p}`).join("\n")}` : null,
    concept.examples?.length ? `Examples:\n${concept.examples.map((e) => `- ${e}`).join("\n")}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 300,
    system:
      "You are a patient, encouraging tutor for a Grade 5 (Cambridge Stage 5) student. " +
      "Only answer using the concept context provided - stay on topic for this concept. " +
      "Explain simply, in plain words a 9-10 year old understands. Use an example from the " +
      "context if it helps. Keep the answer under 100 words. Never mention marks, scores, or grades - " +
      "this is a no-pressure practice conversation, not a test. If the question is unrelated to the " +
      "concept, gently redirect back to it.",
    messages: [
      {
        role: "user",
        content: `${contextBlock}\n\nStudent's question: ${trimmed}`,
      },
    ],
  });

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

// Static instructional half of the extraction prompt - identical on every
// call for a given unit, so it's worth a cache_control breakpoint: the
// per-call variable part (which concepts are still missing) is appended
// separately in the user turn, after the cached prefix.
const EXTRACTION_SYSTEM_PROMPT = `You are structuring curriculum content for a voice-led English tutoring app for a Grade 5 (Cambridge Stage 5) student, from photos of their own textbook pages.

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

interface RawExtractedConcept {
  concept_id: string;
  concept_name: string;
  definition: string;
  key_points: string[];
  examples: string[];
  tips_to_remember: string[];
  voice_qa_samples: VoiceQASample[];
  source_image_index: number;
}

/**
 * Turns a parent's uploaded textbook page photos into structured lesson
 * concepts, targeting whichever concepts a unit still has stubbed as
 * "coming soon". This is what fills in the rest of a unit without needing
 * every concept hand-authored - see app/api/pages/extract/route.ts.
 */
export async function extractConceptsFromPages(
  images: UploadedPageImage[],
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
          ...images.map((img) => ({
            type: "image" as const,
            source: { type: "base64" as const, media_type: img.mediaType, data: img.base64 },
          })),
          {
            type: "text" as const,
            text: `Expected concepts for this unit:\n${JSON.stringify(expected, null, 2)}`,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const raw = textBlock && textBlock.type === "text" ? textBlock.text : "[]";

  let parsed: RawExtractedConcept[];
  try {
    parsed = JSON.parse(raw) as RawExtractedConcept[];
  } catch {
    throw new Error("Couldn't understand the extracted content - please try again.");
  }

  return parsed
    .filter((c) => images[c.source_image_index])
    .map((c): Concept => {
      const media: ConceptMedia = {
        source_image_path: images[c.source_image_index].path,
        illustration_caption: c.concept_name,
        video_status: "coming_soon",
      };
      return {
        concept_id: c.concept_id,
        concept_name: c.concept_name,
        status: "drafted",
        source: "extracted",
        definition: c.definition,
        key_points: c.key_points,
        examples: c.examples,
        tips_to_remember: c.tips_to_remember,
        voice_qa_samples: c.voice_qa_samples,
        media,
      };
    });
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
