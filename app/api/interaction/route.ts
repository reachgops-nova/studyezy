import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// Generic InteractionEvent logger, family-session-gated (not admin) - the
// general foundation the model's own schema comment already frames it as.
// First real caller: components/UnitView.tsx fires "lesson_started" once per
// unit, the honest engagement signal that unlocks the worksheet section (see
// lib/worksheetGate.ts and PLATFORM_PLAN.md's 2026-08-24 entry).
const ALLOWED_EVENT_TYPES = new Set(["lesson_started"]);

export async function POST(req: NextRequest) {
  const profileId = await getActiveProfileId();
  if (!profileId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { unitKey, conceptId, eventType, payload } = (body ?? {}) as Record<string, unknown>;

  if (typeof eventType !== "string" || !ALLOWED_EVENT_TYPES.has(eventType)) {
    return NextResponse.json({ error: "Unknown eventType." }, { status: 400 });
  }

  // Resolved server-side from unitKey (same pattern as app/api/micro-check/route.ts)
  // rather than trusting a raw unit row id from the client.
  let unitId: string | null = null;
  if (typeof unitKey === "string") {
    const unit = await db.unit.findUnique({ where: { unitKey } });
    unitId = unit?.id ?? null;
  }

  await db.interactionEvent.create({
    data: {
      studentProfileId: profileId,
      unitId,
      conceptId: typeof conceptId === "string" ? conceptId : null,
      eventType,
      payload: (payload ?? {}) as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json({ ok: true });
}
