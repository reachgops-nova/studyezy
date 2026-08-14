import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { classifyReasoning, isConfigured } from "@/lib/claude";
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

  if (!isConfigured()) {
    return NextResponse.json(
      { error: "The Reasoning Interview isn't configured yet - add ANTHROPIC_API_KEY to .env.local." },
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

  try {
    const result = await classifyReasoning(question, studentAnswer, explanation);

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
  } catch (err) {
    console.error("classifyReasoning failed", err);
    return NextResponse.json({ error: "Couldn't process that right now - please try again." }, { status: 502 });
  }
}
