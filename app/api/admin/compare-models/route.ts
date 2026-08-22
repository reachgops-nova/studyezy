import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { getUnit } from "@/lib/content";
import { askConceptQuestionGroqWithUsage, isGroqConfigured, QWEN_MODEL } from "@/lib/groq";
import { estimateCostUsd } from "@/lib/aiCost";
import type { Concept } from "@/lib/types";

// Real side-by-side comparison, not a guess: runs the exact same concept +
// question through the model already used in production and through
// Qwen3.6-27B (see PLATFORM_PLAN.md's 2026-08-22 entry - Railway has no GPU
// compute, so a hosted open-weight model on Groq, not self-hosting, is the
// only way to actually try one). Admin-only, never touches the live
// student-facing /api/ask path or its answer cache.
const CURRENT_MODEL = "openai/gpt-oss-120b";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const SUPPORTED_LANGUAGES = new Set(["English", "Tamil", "Hindi", "Telugu", "Kannada", "Malayalam", "French"]);

interface ModelResult {
  model: string;
  answer: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number | null;
}

async function runModel(
  concept: Concept,
  question: string,
  language: string,
  subject: string,
  model: string
): Promise<ModelResult> {
  const started = Date.now();
  const result = await askConceptQuestionGroqWithUsage(concept, question, language, subject, model);
  return {
    model,
    answer: result.text,
    latencyMs: Date.now() - started,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    costUsd: estimateCostUsd(model, result.inputTokens, result.outputTokens),
  };
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  if (!isGroqConfigured()) {
    return NextResponse.json({ error: "Groq isn't configured on this deployment." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, conceptId, question, language } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof unitKey !== "string" ||
    typeof conceptId !== "string" ||
    typeof question !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    !question.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const resolvedLanguage = typeof language === "string" && SUPPORTED_LANGUAGES.has(language) ? language : "English";

  const [curriculumId, stageIdStr, subjectId, unitIdStr] = unitKey.split("-");
  const unit = await getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const concept = unit.concepts.find((c) => c.concept_id === conceptId);
  if (!concept) {
    return NextResponse.json({ error: "Concept not found." }, { status: 404 });
  }

  // Run both in parallel - a fair latency comparison, and faster for whoever's testing.
  const [current, qwen] = await Promise.allSettled([
    runModel(concept, question, resolvedLanguage, unit.subject, CURRENT_MODEL),
    runModel(concept, question, resolvedLanguage, unit.subject, QWEN_MODEL),
  ]);

  return NextResponse.json({
    current: current.status === "fulfilled" ? current.value : { model: CURRENT_MODEL, error: current.reason?.message ?? "Request failed" },
    qwen: qwen.status === "fulfilled" ? qwen.value : { model: QWEN_MODEL, error: qwen.reason?.message ?? "Request failed" },
  });
}
