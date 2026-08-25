import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";

const TEMPLATE_PATH = path.join(process.cwd(), "content", "test-template.html");
const PACK_BLOCK_RE = /(<script id="pack" type="application\/json">)[\s\S]*?(<\/script>)/;

// Family-gated, read-only: serves an already-assembled terminal-test pack
// (created by the startTerminalTest server action - see app/test/actions.ts)
// via the same content/test-template.html the progression test uses, so
// refreshing this page just re-shows the same cumulative test rather than
// building a new one.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ packId: string }> }) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { packId } = await params;
  const pack = await db.contentPack.findUnique({ where: { packId } });
  if (!pack || pack.purpose !== "terminal_test") {
    return NextResponse.json({ error: "Terminal test not found." }, { status: 404 });
  }

  const template = await readFile(TEMPLATE_PATH, "utf8");
  if (!PACK_BLOCK_RE.test(template)) {
    return NextResponse.json({ error: "Test template is missing its pack block." }, { status: 500 });
  }

  // Replacer function, not a template-string second argument - see the same
  // fix in app/test/[unitId]/[difficulty]/render/route.ts for why: String.replace
  // treats "$1"/"$2" in a STRING replacement as backreferences, and real
  // pack content can legitimately contain "$"-prefixed sequences.
  const packJson = JSON.stringify(pack.data);
  const html = template.replace(PACK_BLOCK_RE, (_m, open: string, close: string) => `${open}${packJson}${close}`);
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
