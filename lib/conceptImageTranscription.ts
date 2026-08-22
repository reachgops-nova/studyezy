import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "./db";
import { isConfigured, transcribeReferencePage, type UploadedPageImage } from "./claude";
import { isGroqConfigured, transcribeReferencePageGroq } from "./groq";
import { UPLOADS_DIR } from "./uploads";

const MEDIA_TYPE_BY_EXT: Record<string, "image/jpeg" | "image/png" | "image/webp"> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/**
 * Reads a concept's linked reference image straight off the uploads volume,
 * transcribes its printed content (see transcribeOnce below for tiering),
 * and saves it - the one-time step that grounds
 * askConceptQuestion/askConceptQuestionGroq in
 * what's actually on the page. Called automatically from
 * app/admin/resources/actions.ts's assignConceptImage whenever an admin
 * links a real image, and from the /api/admin/transcribe-concept-image
 * backfill route for images that were linked before this existed.
 *
 * storageKey is the relative path under UPLOADS_DIR (e.g.
 * "cambridge-5-english-1/xyz.jpeg"), same shape used throughout
 * app/api/pages/upload and app/api/pages/extract.
 */
export async function transcribeAndSaveConceptImage(conceptId: string, storageKey: string): Promise<void> {
  const ext = path.extname(storageKey).toLowerCase();
  const mediaType = MEDIA_TYPE_BY_EXT[ext];
  if (!mediaType) return;

  const bytes = await readFile(path.join(UPLOADS_DIR, storageKey));
  const image: UploadedPageImage = {
    path: `/api/uploads/${storageKey}`,
    mediaType,
    base64: bytes.toString("base64"),
  };

  const transcript = await transcribeOnce(image);
  if (!transcript) return;

  await db.concept.update({
    where: { id: conceptId },
    data: { sourceImageTranscript: transcript },
  });
}

// Groq-first, Claude-fallback - same tiering as app/api/ask/route.ts, and for
// the same reason: this deployment currently has no ANTHROPIC_API_KEY
// configured (real Anthropic-credit gap), so Groq's Qwen3.6-27B (confirmed
// multimodal, verified live 2026-08-22) is the tier that actually runs today.
// Claude stays as the fallback for whenever credit is restored, since it's
// the higher-quality model and this content only gets transcribed once.
async function transcribeOnce(image: UploadedPageImage): Promise<string> {
  if (isGroqConfigured()) {
    try {
      return await transcribeReferencePageGroq(image);
    } catch (err) {
      console.error("transcribeReferencePageGroq failed, trying Claude fallback", err);
    }
  }
  if (isConfigured()) {
    return transcribeReferencePage(image);
  }
  throw new Error("Neither Groq nor Claude is configured for transcription.");
}
