import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { generateSpeechGemini, isGeminiConfigured } from "@/lib/gemini";
import { generateSpeechSarvam, isSarvamConfigured, isSarvamLanguageSupported } from "@/lib/sarvam";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_LEN = 2000;

// Server-side speech synthesis - only actually used by AvatarChat.tsx when
// the browser's own speechSynthesis has no installed voice for the
// requested language (see components/AvatarChat.tsx's speakText: English
// still uses the free, zero-latency browser voice). Real gap reported live
// 2026-09-08: Chrome on plenty of real devices ships with no Tamil (or
// other Indian language) voice at all, so a correctly-translated /api/ask
// reply had nothing able to speak it back.
//
// Sarvam tried first when the language is one it covers (all 5 Indian
// languages this app offers) and it's configured - measured live ~1.8-2s
// per call vs Gemini TTS's measured ~5s floor. Gemini stays as the fallback
// for anything Sarvam doesn't cover (French) or if the Sarvam call fails.
export async function POST(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(profileId);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests - try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { text, languageCode } = (body ?? {}) as Record<string, unknown>;
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }
  const trimmedText = text.trim().slice(0, MAX_LEN);
  const resolvedLanguageCode = typeof languageCode === "string" ? languageCode : "";

  if (isSarvamConfigured() && isSarvamLanguageSupported(resolvedLanguageCode)) {
    try {
      const { wav } = await generateSpeechSarvam("tts-avatar-chat", trimmedText, resolvedLanguageCode);
      return new NextResponse(new Uint8Array(wav), {
        headers: { "Content-Type": "audio/wav", "Cache-Control": "private, no-store" },
      });
    } catch (err) {
      console.error("generateSpeechSarvam failed, trying Gemini fallback", err);
    }
  }

  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: "Speech isn't available right now." }, { status: 503 });
  }

  try {
    const { wav } = await generateSpeechGemini("tts-avatar-chat", trimmedText);
    return new NextResponse(new Uint8Array(wav), {
      headers: { "Content-Type": "audio/wav", "Cache-Control": "private, no-store" },
    });
  } catch (err) {
    console.error("generateSpeechGemini failed", err);
    return NextResponse.json({ error: "Couldn't generate speech right now." }, { status: 502 });
  }
}
