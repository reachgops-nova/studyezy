import { NextRequest, NextResponse } from "next/server";
import { getActiveProfileId } from "@/lib/auth";
import { recordUnitAttempt } from "@/lib/recordMastery";

// Family-gated, fire-and-forget target for WidgetDispatcher.tsx (see the
// onItemResult plumbing there). One call per fully-completed lesson widget,
// scored on first-attempt correctness only - a retry that eventually gets an
// item right does not count as correct here, which is what keeps this signal
// honest despite every widget being retriable. recordUnitAttempt caps the
// resulting band below "mastered" for this attemptType - see lib/recordMastery.ts.
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

  const { unitKey, conceptKey, correct, total } = (body ?? {}) as Record<string, unknown>;

  if (typeof unitKey !== "string" || !unitKey) {
    return NextResponse.json({ error: "unitKey is required." }, { status: 400 });
  }
  if (typeof conceptKey !== "string" || !conceptKey) {
    return NextResponse.json({ error: "conceptKey is required." }, { status: 400 });
  }
  // Client-submitted score for a low-stakes signal, but it still writes real
  // mastery/scheduling data - validated properly rather than trusted, same as
  // any other write path, not just logged like the plain InteractionEvent
  // counter in app/api/interaction/route.ts.
  if (
    !Number.isInteger(total) ||
    !Number.isInteger(correct) ||
    (total as number) <= 0 ||
    (total as number) > 20 ||
    (correct as number) < 0 ||
    (correct as number) > (total as number)
  ) {
    return NextResponse.json({ error: "correct/total must be integers with 0 <= correct <= total <= 20." }, { status: 400 });
  }

  try {
    await recordUnitAttempt({
      profileId,
      unitKey,
      attemptType: "practice_widget",
      correct: correct as number,
      total: total as number,
      perConcept: { [conceptKey]: { correct: correct as number, total: total as number } },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unit not found.") {
      return NextResponse.json({ error: "Unit not found." }, { status: 404 });
    }
    throw err;
  }

  return NextResponse.json({ ok: true });
}
