import "server-only";
import path from "node:path";

// Local dev default lives outside public/ (Next's static assets are baked in
// at build time and wouldn't pick up runtime writes anyway). On Railway this
// points at a mounted Volume (e.g. /data/uploads) so photos survive redeploys.
export const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");
