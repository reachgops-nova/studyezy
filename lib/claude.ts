import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Concept, MarkScheme } from "./types";

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

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

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
