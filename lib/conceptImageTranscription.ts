import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "./db";
import { transcribeReferencePage, type UploadedPageImage } from "./claude";
import { UPLOADS_DIR } from "./uploads";

const MEDIA_TYPE_BY_EXT: Record<string, "image/jpeg" | "image/png" | "image/webp"> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/**
 * Reads a concept's linked reference image straight off the uploads volume,
 * transcribes its printed content via Claude vision, and saves it - the
 * one-time step that grounds askConceptQuestion/askConceptQuestionGroq in
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

  const transcript = await transcribeReferencePage(image);
  if (!transcript) return;

  await db.concept.update({
    where: { id: conceptId },
    data: { sourceImageTranscript: transcript },
  });
}
