import "server-only";
import path from "node:path";

// Local dev default lives outside public/ (Next's static assets are baked in
// at build time and wouldn't pick up runtime writes anyway). On Railway this
// points at a mounted Volume (e.g. /data/uploads) so photos survive redeploys.
export const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");

export function sanitizeFilename(name: string): string {
  const ext = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
}

// Name predates PDF support (2026-09-06 - real feedback: "not letting me to
// add or choose PDF file in the upload") - kept as-is since it's checked in
// 3 places already; a scanned workbook is often one PDF, not N separate
// page photos. Claude reads a PDF natively as a document block (see
// lib/claude.ts's extraction functions), so no page-rasterization step is
// needed - it just isn't shown as a booklet thumbnail (Booklet.tsx already
// filters to image/* only, so a PDF row there is silently skipped, not
// broken).
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);
export const MAX_UPLOAD_FILE_BYTES = 12 * 1024 * 1024; // 12MB - generous for a phone photo
