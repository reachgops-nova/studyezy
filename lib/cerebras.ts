import "server-only";
import { buildConceptContextBlock } from "./conceptContext";
import { logAiCost } from "./aiCost";
import type { Concept } from "./types";

const CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions";
const CEREBRAS_MODEL = "gpt-oss-120b";

export function isCerebrasConfigured(): boolean {
  return Boolean(process.env.CEREBRAS_API_KEY);
}

async function cerebrasChat(system: string, user: string): Promise<string> {
  const response = await fetch(CEREBRAS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
    },
    body: JSON.stringify({
      model: CEREBRAS_MODEL,
      max_tokens: 500,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!response.ok) throw new Error(`Cerebras request failed: ${response.status} ${await response.text()}`);
  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  logAiCost("ask", `cerebras/${CEREBRAS_MODEL}`, data.usage?.prompt_tokens ?? 0, data.usage?.completion_tokens ?? 0);
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error("Cerebras returned no answer");
  return answer;
}

export function askConceptQuestionCerebras(
  concept: Concept,
  question: string,
  language: string,
  allConcepts: Concept[] = [],
): Promise<string> {
  const languageRule = language === "English"
    ? "Respond in English."
    : `Respond entirely in ${language} script, not English. Do not transliterate.`;
  return cerebrasChat(
    `You are a patient school tutor. Answer only from the supplied concept context. Explain simply to a 9-10 year old in under 100 words. ${languageRule} Return plain text only.`,
    `${buildConceptContextBlock(concept, allConcepts)}\n\nStudent question: ${question.trim().slice(0, 500)}`,
  );
}

export function translateAnswerCerebras(answer: string, language: string): Promise<string> {
  return cerebrasChat(
    `Translate this school-tutor answer entirely into ${language}. Return only ${language} script, not English or transliteration. Preserve numbers and mathematical expressions.`,
    answer,
  );
}
