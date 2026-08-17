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

export const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
export const MAX_UPLOAD_FILE_BYTES = 12 * 1024 * 1024; // 12MB - generous for a phone photo
