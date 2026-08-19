import { NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { generateVocabPracticeGroq, isGroqConfigured } from "@/lib/groq";
import { pickFallbackVocab } from "@/lib/vocabPractice";

// Deliberately no unit/curriculum grounding yet and no persistence (no
// "already asked today" tracking) - see the decision record in
// PLATFORM_PLAN.md. Regenerates fresh via Groq on every request; falls back
// to a small static set so the feature works even without Groq configured
// or if a call fails.
export async function GET() {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (isGroqConfigured()) {
    try {
      const items = await generateVocabPracticeGroq();
      return NextResponse.json({ items, source: "ai-groq" });
    } catch (err) {
      console.error("generateVocabPracticeGroq failed, using fallback set", err);
    }
  }

  return NextResponse.json({ items: pickFallbackVocab(3), source: "local" });
}
