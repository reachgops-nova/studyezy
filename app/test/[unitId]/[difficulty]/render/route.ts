import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrCreateProgressionTestPack } from "@/lib/testPacks";
import { QUESTION_PAPER_DIFFICULTIES, type QuestionPaperDifficulty } from "@/lib/types";

const TEMPLATE_PATH = path.join(process.cwd(), "content", "test-template.html");
const PACK_BLOCK_RE = /(<script id="pack" type="application\/json">)[\s\S]*?(<\/script>)/;

function isDifficulty(value: string): value is QuestionPaperDifficulty {
  return (QUESTION_PAPER_DIFFICULTIES as string[]).includes(value);
}

// Family-gated: serves content/test-template.html with the unit's
// progression test pack substituted in - the pack itself is generated once
// (deterministically, zero AI cost) from the existing QuestionPaper via
// lib/testPacks.ts, then reused on every later request.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ unitId: string; difficulty: string }> }) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { unitId, difficulty } = await params;
  if (!isDifficulty(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty." }, { status: 400 });
  }

  const packId = await getOrCreateProgressionTestPack(unitId, difficulty);
  if (!packId) {
    return NextResponse.json({ error: "No progression test available for this unit/difficulty yet." }, { status: 404 });
  }

  const pack = await db.contentPack.findUnique({ where: { packId } });
  if (!pack) {
    return NextResponse.json({ error: "Test pack not found." }, { status: 404 });
  }

  const template = await readFile(TEMPLATE_PATH, "utf8");
  if (!PACK_BLOCK_RE.test(template)) {
    return NextResponse.json({ error: "Test template is missing its pack block." }, { status: 500 });
  }

  const html = template.replace(PACK_BLOCK_RE, `$1${JSON.stringify(pack.data)}$2`);
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
