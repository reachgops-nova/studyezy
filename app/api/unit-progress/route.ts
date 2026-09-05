import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { db } from "@/lib/db";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;

// Lets a student/parent mark "our class has covered up to this concept" -
// a manual claim about the SCHOOL's own pacing (real feedback 2026-09-05:
// "school might reserve certain concepts to be taught later, so kids can
// mark till which concept was taught for our reference"), separate from
// ConceptMastery's in-app attempt evidence. UnitView.tsx's out-of-sequence
// readiness check treats every concept at or before this mark as safe to
// jump to directly.
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

  const { unitKey, taughtUpToConceptKey } = (body ?? {}) as Record<string, unknown>;
  if (typeof unitKey !== "string" || !UNIT_KEY_PATTERN.test(unitKey)) {
    return NextResponse.json({ error: "Missing or invalid unitKey." }, { status: 400 });
  }
  if (taughtUpToConceptKey !== null && typeof taughtUpToConceptKey !== "string") {
    return NextResponse.json({ error: "taughtUpToConceptKey must be a string or null." }, { status: 400 });
  }

  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  if (taughtUpToConceptKey !== null) {
    const concept = await db.concept.findUnique({
      where: { unitId_conceptKey: { unitId: unit.id, conceptKey: taughtUpToConceptKey } },
    });
    if (!concept) {
      return NextResponse.json({ error: "That concept isn't part of this unit." }, { status: 400 });
    }
  }

  await db.unitProgress.upsert({
    where: { studentProfileId_unitId: { studentProfileId: profileId, unitId: unit.id } },
    create: { studentProfileId: profileId, unitId: unit.id, taughtUpToConceptKey },
    update: { taughtUpToConceptKey },
  });

  return NextResponse.json({ ok: true });
}
