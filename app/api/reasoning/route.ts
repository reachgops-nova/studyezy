import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { classifyReasoning, isConfigured } from "@/lib/claude";
import { classifyReasoningGroq, isGroqConfigured } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rateLimit";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

export async function POST(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(profileId);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests - try again shortly." }, { status: 429 });
  }

  if (!isConfigured() && !isGroqConfigured()) {
    return NextResponse.json(
      { error: "The Reasoning Interview isn't configured yet - add ANTHROPIC_API_KEY or GROQ_API_KEY." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, conceptId, question, studentAnswer, explanation } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof unitKey !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    typeof conceptId !== "string" ||
    typeof question !== "string" ||
    typeof studentAnswer !== "string" ||
    typeof explanation !== "string" ||
    !explanation.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }
  const concept = await db.concept.findUnique({
    where: { unitId_conceptKey: { unitId: unit.id, conceptKey: conceptId } },
  });
  if (!concept) {
    return NextResponse.json({ error: "Concept not found." }, { status: 404 });
  }

  // Lower stakes than grading (this only shapes the explanatory "note" shown
  // to the parent/kid - it doesn't drive ConceptMastery/retest scheduling),
  // but still tries Claude first when available.
  let result: { classification: string; note: string; source: "ai" | "ai-groq" } | null = null;

  if (isConfigured()) {
    try {
      const r = await classifyReasoning(question, studentAnswer, explanation);
      result = { ...r, source: "ai" };
    } catch (err) {
      console.error("classifyReasoning failed, trying Groq fallback", err);
    }
  }

  if (!result && isGroqConfigured()) {
    try {
      const r = await classifyReasoningGroq(question, studentAnswer, explanation);
      result = { ...r, source: "ai-groq" };
    } catch (err) {
      console.error("classifyReasoningGroq failed", err);
    }
  }

  if (!result) {
    return NextResponse.json({ error: "Couldn't process that right now - please try again." }, { status: 502 });
  }

  await db.reasoningLog.create({
    data: {
      studentProfileId: profileId,
      conceptId: concept.id,
      question,
      studentAnswer,
      explanation,
      classification: result.classification,
      note: result.note,
    },
  });

  return NextResponse.json(result);
}
