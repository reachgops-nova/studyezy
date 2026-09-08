import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";

// Real, server-backed partial-save/resume for practice worksheets - see
// prisma/schema.prisma's WorksheetProgress for the full story (a real gap
// found live 2026-09-08: content/player-template.html's save/load calls
// had nothing behind them at all). GET loads the current student's saved
// state for a pack; POST autosaves it (called on a 400ms debounce by the
// player itself, see content/player-template.html's saveState). Never used
// by terminal tests or real exams - those have no equivalent call.
const MAX_STATE_BYTES = 200_000;

export async function GET(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const packId = req.nextUrl.searchParams.get("packId");
  if (!packId) {
    return NextResponse.json({ error: "Missing packId." }, { status: 400 });
  }

  const row = await db.worksheetProgress.findUnique({
    where: { studentProfileId_packId: { studentProfileId: profileId, packId } },
    select: { state: true },
  });
  return NextResponse.json({ state: row?.state ?? null });
}

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

  const { packId, state } = (body ?? {}) as Record<string, unknown>;
  if (typeof packId !== "string" || !packId.trim() || typeof state !== "object" || state === null) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }
  // A worksheet has a real, bounded question count - a state blob this
  // large can only be a malformed or abusive payload, not real progress.
  if (JSON.stringify(state).length > MAX_STATE_BYTES) {
    return NextResponse.json({ error: "Progress payload too large." }, { status: 413 });
  }

  await db.worksheetProgress.upsert({
    where: { studentProfileId_packId: { studentProfileId: profileId, packId } },
    create: { studentProfileId: profileId, packId, state: state as object },
    update: { state: state as object },
  });
  return NextResponse.json({ ok: true });
}
