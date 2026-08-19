import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { getUnit } from "@/lib/content";
import { askConceptQuestion, isConfigured } from "@/lib/claude";
import { askConceptQuestionGroq, isGroqConfigured, suggestFollowUpsGroq } from "@/lib/groq";
import { findLocalAnswer } from "@/lib/localAnswers";
import { checkRateLimit } from "@/lib/rateLimit";
import type { Concept } from "@/lib/types";

// Follow-up suggestions are a UI nicety (evolving quick-reply chips), not the
// answer itself - generated best-effort alongside whichever tier answered
// the real question, and never allowed to fail the request. Falls back to
// an empty list (the frontend just keeps its last known suggestions) rather
// than surfacing a Groq error to the kid over something this low-stakes.
async function tryFollowUps(concept: Concept, question: string, answer: string): Promise<string[]> {
  if (!isGroqConfigured()) return [];
  try {
    return await suggestFollowUpsGroq(concept, question, answer);
  } catch (err) {
    console.error("suggestFollowUpsGroq failed, keeping existing suggestions", err);
    return [];
  }
}

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

// Allowlisted, not passed through freely - this value is interpolated
// straight into the AI system prompt (see lib/claude.ts/lib/groq.ts), so an
// arbitrary client-supplied string would be a prompt-injection vector.
// Keep in sync with components/AvatarChat.tsx's LANGUAGES list.
const SUPPORTED_LANGUAGES = new Set(["English", "Tamil", "Hindi", "Telugu", "Kannada", "Malayalam", "French"]);

function resolveLanguage(value: unknown): string {
  return typeof value === "string" && SUPPORTED_LANGUAGES.has(value) ? value : "English";
}

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

  const resolvedLanguage = resolveLanguage(language);

  const [curriculumId, stageIdStr, subjectId, unitIdStr] = unitKey.split("-");
  const unit = await getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const concept = unit.concepts.find((c) => c.concept_id === conceptId);
  if (!concept) {
    return NextResponse.json({ error: "Concept not found." }, { status: 404 });
  }

  // Three-tier fallback so a kid mid-lesson always gets a real, grounded
  // answer: Claude first (best quality), then Groq's open-weight model (still
  // genuinely dynamic, works without Anthropic credit), then the local
  // pattern-matcher (always available, no network dependency at all).
  if (isConfigured()) {
    try {
      const answer = await askConceptQuestion(concept, question, resolvedLanguage);
      const followUps = await tryFollowUps(concept, question, answer);
      return NextResponse.json({ answer, source: "ai", followUps });
    } catch (err) {
      console.error("askConceptQuestion failed, trying next fallback", err);
    }
  }

  if (isGroqConfigured()) {
    try {
      const answer = await askConceptQuestionGroq(concept, question, resolvedLanguage);
      const followUps = await tryFollowUps(concept, question, answer);
      return NextResponse.json({ answer, source: "ai-groq", followUps });
    } catch (err) {
      console.error("askConceptQuestionGroq failed, falling back to local answer", err);
    }
  }

  return NextResponse.json({ answer: findLocalAnswer(concept, question), source: "local", followUps: [] });
}
