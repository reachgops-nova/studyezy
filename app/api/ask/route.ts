import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { getUnit } from "@/lib/content";
import { askConceptQuestion, isConfigured, translateAnswerClaude } from "@/lib/claude";
import { askConceptQuestionGroq, isGroqConfigured, suggestFollowUpsGroq, translateAnswerGroq } from "@/lib/groq";
import { findLocalAnswer } from "@/lib/localAnswers";
import { askConceptQuestionOpenRouter, isOpenRouterConfigured, translateAnswerOpenRouter } from "@/lib/openrouter";
import { askConceptQuestionGemini, isGeminiConfigured, translateAnswerGemini } from "@/lib/gemini";
import { askConceptQuestionCerebras, isCerebrasConfigured, translateAnswerCerebras } from "@/lib/cerebras";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCachedAnswer, saveCachedAnswer } from "@/lib/answerCache";
import { logCacheHit } from "@/lib/aiCost";
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

// Do not serve an old English cache entry for a parent who selected an
// Indian language. The cache key already includes language, but older builds
// could have stored English under that key, so a small script check keeps the
// visible answer and the spoken answer aligned.
function hasRequestedScript(answer: string, language: string): boolean {
  if (language === "English") return true;
  const ranges: Record<string, RegExp> = {
    Tamil: /[\u0B80-\u0BFF]/,
    Hindi: /[\u0900-\u097F]/,
    Telugu: /[\u0C00-\u0C7F]/,
    Kannada: /[\u0C80-\u0CFF]/,
    Malayalam: /[\u0D00-\u0D7F]/,
  };
  return ranges[language]?.test(answer) ?? false;
}

async function ensureRequestedLanguage(answer: string, language: string): Promise<string> {
  if (language === "English" || hasRequestedScript(answer, language)) return answer;
  try {
    if (isGroqConfigured()) return await translateAnswerGroq(answer, language);
    if (isGeminiConfigured()) return await translateAnswerGemini(answer, language);
    if (isCerebrasConfigured()) return await translateAnswerCerebras(answer, language);
    if (isConfigured()) return await translateAnswerClaude(answer, language);
    if (isOpenRouterConfigured()) return await translateAnswerOpenRouter(answer, language);
  } catch (err) {
    console.error("localized answer repair failed, keeping original answer", err);
  }
  return answer;
}

// If every configured provider is unavailable or over its limit, never show
// the student an English answer while Tamil/Hindi/etc. is selected. This is a
// truthful, cached-safe terminal response; the next request can retry once a
// provider is healthy again.
const LOCALIZED_PROVIDER_UNAVAILABLE: Record<string, string> = {
  Tamil: "இப்போது பதிலை உருவாக்க முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சி செய்யுங்கள்.",
  Hindi: "अभी उत्तर तैयार नहीं हो सका। कृपया थोड़ी देर बाद फिर कोशिश करें।",
  Telugu: "ఇప్పుడు సమాధానం తయారు చేయలేకపోయాము. కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.",
  Kannada: "ಈಗ ಉತ್ತರವನ್ನು ತಯಾರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  Malayalam: "ഇപ്പോൾ ഉത്തരം തയ്യാറാക്കാൻ കഴിഞ്ഞില്ല. കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.",
};

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

  // Checked before any model call - a repeated or near-identical question
  // (same wording, different casing/punctuation), asked by a *different*
  // kid on the same concept, is served free instead of triggering a new
  // Groq/Claude call. See lib/answerCache.ts for the matching rules.
  const cached = await getCachedAnswer(unitKey, concept.concept_id, resolvedLanguage, question);
  if (cached && hasRequestedScript(cached.answer, resolvedLanguage)) {
    logCacheHit("ask");
    // Follow-up chips are also AI output. Do not spend another request on a
    // cache hit; the answer itself is already the reusable response.
    return NextResponse.json({ answer: cached.answer, source: "cache", followUps: [] });
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
      const answer = await ensureRequestedLanguage(
        await askConceptQuestionGroq(concept, question, resolvedLanguage, unit.subject, unit.concepts),
        resolvedLanguage,
      );
      await saveCachedAnswer(unitKey, concept.concept_id, resolvedLanguage, question, answer);
      const followUps = await tryFollowUps(concept, question, answer);
      return NextResponse.json({ answer, source: "ai-groq", followUps });
    } catch (err) {
      console.error("askConceptQuestionGroq failed, trying next fallback", err);
    }
  }

  if (isGeminiConfigured()) {
    try {
      const answer = await askConceptQuestionGemini(
        `${concept.concept_name}\n${concept.definition ?? ""}\n${(concept.key_points ?? []).join("\n")}`,
        question,
        resolvedLanguage,
      );
      const localizedAnswer = await ensureRequestedLanguage(answer, resolvedLanguage);
      await saveCachedAnswer(unitKey, concept.concept_id, resolvedLanguage, question, localizedAnswer);
      const followUps = await tryFollowUps(concept, question, localizedAnswer);
      return NextResponse.json({ answer: localizedAnswer, source: "ai-gemini", followUps });
    } catch (err) {
      console.error("askConceptQuestionGemini failed, trying next fallback", err);
    }
  }

  if (isCerebrasConfigured()) {
    try {
      const answer = await ensureRequestedLanguage(
        await askConceptQuestionCerebras(concept, question, resolvedLanguage, unit.concepts),
        resolvedLanguage,
      );
      await saveCachedAnswer(unitKey, concept.concept_id, resolvedLanguage, question, answer);
      const followUps = await tryFollowUps(concept, question, answer);
      return NextResponse.json({ answer, source: "ai-cerebras", followUps });
    } catch (err) {
      console.error("askConceptQuestionCerebras failed, trying paid fallback", err);
    }
  }

  if (isConfigured()) {
    try {
      const answer = await ensureRequestedLanguage(
        await askConceptQuestion(concept, question, resolvedLanguage, unit.subject, unit.concepts),
        resolvedLanguage,
      );
      await saveCachedAnswer(unitKey, concept.concept_id, resolvedLanguage, question, answer);
      const followUps = await tryFollowUps(concept, question, answer);
      return NextResponse.json({ answer, source: "ai", followUps });
    } catch (err) {
      console.error("askConceptQuestion failed, trying OpenRouter/local fallback", err);
    }
  }

  if (isOpenRouterConfigured()) {
    try {
      const answer = await askConceptQuestionOpenRouter(concept, question, resolvedLanguage, unit.subject, unit.concepts);
      await saveCachedAnswer(unitKey, concept.concept_id, resolvedLanguage, question, answer);
      const followUps = await tryFollowUps(concept, question, answer);
      return NextResponse.json({ answer, source: "ai-openrouter", followUps });
    } catch (err) {
      console.error("askConceptQuestionOpenRouter failed, falling back to local answer", err);
    }
  }

  const translatedLocal = await ensureRequestedLanguage(findLocalAnswer(concept, question), resolvedLanguage);
  const localAnswer = resolvedLanguage === "English" || hasRequestedScript(translatedLocal, resolvedLanguage)
    ? translatedLocal
    : LOCALIZED_PROVIDER_UNAVAILABLE[resolvedLanguage] ?? translatedLocal;
  await saveCachedAnswer(unitKey, concept.concept_id, resolvedLanguage, question, localAnswer);
  return NextResponse.json({ answer: localAnswer, source: "local", followUps: [] });
}
