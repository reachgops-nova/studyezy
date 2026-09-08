import "server-only";
import { logAiCost } from "./aiCost";

// Real user-supplied credential 2026-09-08, specifically to fix a measured
// latency problem: lib/gemini.ts's Gemini TTS (a general multimodal
// "preview" model that happens to generate audio) has a fixed ~5s floor per
// call. Sarvam (sarvam.ai) is a dedicated Indian-language speech product -
// verified live before building on it: ~1.8-2s per call regardless of
// text length (vs Gemini's ~5s), same ballpark as any purpose-built TTS
// API, for exactly the 5 Indian languages this app's language picker
// offers (see AvatarChat.tsx's LANGUAGES). Used as the PRIMARY path for
// those languages; Gemini TTS stays as the fallback for anything Sarvam
// doesn't cover (French) or if this call fails.
const TTS_URL = "https://api.sarvam.ai/text-to-speech";

// Sarvam's own supported set (docs.sarvam.ai/api-reference/text-to-speech/convert,
// verified live 2026-09-08) - a strict superset of the 5 Indian languages in
// AvatarChat.tsx's LANGUAGES list (ta-IN, hi-IN, te-IN, kn-IN, ml-IN all
// present), so every language this app can request IS covered except
// fr-FR/en-*, which fall through to the Gemini fallback instead.
const SUPPORTED_LANGUAGE_CODES = new Set([
  "bn-IN", "en-IN", "gu-IN", "hi-IN", "kn-IN", "ml-IN", "mr-IN", "od-IN", "pa-IN", "ta-IN", "te-IN",
]);

export function isSarvamConfigured(): boolean {
  return Boolean(process.env.SARVAM_API_KEY);
}

export function isSarvamLanguageSupported(languageCode: string): boolean {
  return SUPPORTED_LANGUAGE_CODES.has(languageCode);
}

export interface SarvamSpeech {
  wav: Buffer;
}

/**
 * Response is already a real WAV file (base64-encoded), unlike Gemini's
 * bare PCM - no container-wrapping needed here, see lib/gemini.ts's
 * pcmToWav for the contrast. No token/cost metadata comes back in the
 * response, and there's no verified per-character rate to compute one from,
 * so this logs 0 tokens with an unknown ($0, not accurate - a known gap)
 * cost rather than guessing a number - see lib/aiCost.ts's estimateCostUsd,
 * which already returns null/unlisted-model behavior for "sarvam-bulbul-v3".
 */
export async function generateSpeechSarvam(feature: string, text: string, languageCode: string): Promise<SarvamSpeech> {
  const res = await fetch(TTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-subscription-key": process.env.SARVAM_API_KEY ?? "" },
    body: JSON.stringify({ text, language_code: languageCode, model: "bulbul:v3" }),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`Sarvam TTS request failed (${res.status}): ${bodyText.slice(0, 500)}`);
  }
  const data = (await res.json()) as { audios?: string[] };
  const audioB64 = data.audios?.[0];
  if (!audioB64) {
    throw new Error("Sarvam TTS response contained no audio.");
  }
  logAiCost(feature, "sarvam-bulbul-v3", 0, 0);
  return { wav: Buffer.from(audioB64, "base64") };
}
