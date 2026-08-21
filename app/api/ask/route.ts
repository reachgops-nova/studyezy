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

  // 2026-08-20: reordered to Groq-first, Claude-fallback (was the reverse).
  // This is the highest-frequency AI call in the app (every voice question,
  // every checkpoint-pause follow-up), so it's the one place where the tier
  // order actually matters for cost/latency/resilience at scale - grading
  // and Reasoning Interview classification deliberately stay Claude-first
  // (see those routes), since they write into ConceptMastery/retest
  // scheduling and a wrong answer there has a real data-quality cost that
  // outweighs the savings. Reasoning for this one specifically: (1) Groq is
  // materially cheaper per call (gpt-oss-120b vs Claude Haiku, see
  // lib/aiCost.ts's rates) and compounds at real scale; (2) Groq is also
  // faster, a genuine UX win for an interactive chat a kid is waiting on;
  // (3) resilience - this session hit real Anthropic-credit gaps more than
  // once, and Groq-first means the primary interactive feature keeps working
  // through that without depending on a top-up. Quality was checked, not
  // assumed, against this project's actual grounded-Q&A prompts before
  // making this the default tier, not just the fallback.
  if (isGroqConfigured()) {
    try {
      const answer = await askConceptQuestionGroq(concept, question, resolvedLanguage, unit.subject);
      const followUps = await tryFollowUps(concept, question, answer);
      return NextResponse.json({ answer, source: "ai-groq", followUps });
    } catch (err) {
      console.error("askConceptQuestionGroq failed, trying next fallback", err);
    }
  }

  if (isConfigured()) {
    try {
      const answer = await askConceptQuestion(concept, question, resolvedLanguage, unit.subject);
      const followUps = await tryFollowUps(concept, question, answer);
      return NextResponse.json({ answer, source: "ai", followUps });
    } catch (err) {
      console.error("askConceptQuestion failed, falling back to local answer", err);
    }
  }

  return NextResponse.json({ answer: findLocalAnswer(concept, question), source: "local", followUps: [] });
}
