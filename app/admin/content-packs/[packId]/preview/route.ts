import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";

const TEMPLATE_PATH = path.join(process.cwd(), "content", "player-template.html");
const PACK_BLOCK_RE = /(<script id="pack" type="application\/json">)[\s\S]*?(<\/script>)/;

// Byte-for-byte reuse of content/player-template.html (the kit's own already-
// working renderer - checks.js + player-app.js are inlined in it), with the
// hardcoded reference pack swapped for whichever real pack was just
// converted. Deliberately NOT a React port: this is a validation surface for
// proving the schema against real content, not a production UI commitment
// (see PLATFORM_PLAN.md's 2026-08-24 entry).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ packId: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const { packId } = await params;
  const pack = await db.contentPack.findUnique({ where: { packId } });
  if (!pack) {
    return NextResponse.json({ error: "Pack not found." }, { status: 404 });
  }

  const template = await readFile(TEMPLATE_PATH, "utf8");
  if (!PACK_BLOCK_RE.test(template)) {
    return NextResponse.json({ error: "Preview template is missing its pack block." }, { status: 500 });
  }

  const html = template.replace(PACK_BLOCK_RE, `$1${JSON.stringify(pack.data)}$2`);
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
