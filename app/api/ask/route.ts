import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { getUnit } from "@/lib/content";
import { askConceptQuestion, isConfigured } from "@/lib/claude";
import { checkRateLimit } from "@/lib/rateLimit";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

export async function POST(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(profileId);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many questions at once - take a short breather and try again." },
      { status: 429 }
    );
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Voice Q&A isn't configured yet - add ANTHROPIC_API_KEY to .env.local." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, conceptId, question } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof unitKey !== "string" ||
    typeof conceptId !== "string" ||
    typeof question !== "string" ||
    !UNIT_KEY_PATTERN.test(unitKey) ||
    !question.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const [curriculumId, stageIdStr, subjectId, unitIdStr] = unitKey.split("-");
  const unit = getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const concept = unit.concepts.find((c) => c.concept_id === conceptId);
  if (!concept) {
    return NextResponse.json({ error: "Concept not found." }, { status: 404 });
  }

  try {
    const answer = await askConceptQuestion(concept, question);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("askConceptQuestion failed", err);
    return NextResponse.json(
      { error: "Couldn't get an answer right now - please try again." },
      { status: 502 }
    );
  }
}
