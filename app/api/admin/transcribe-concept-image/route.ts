import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { transcribeAndSaveConceptImage } from "@/lib/conceptImageTranscription";
import { isConfigured } from "@/lib/claude";

// Admin-only utility: (re)generates the transcript for a concept's already-
// linked reference image. assignConceptImage (app/admin/resources/actions.ts)
// now does this automatically for every new assignment, so this route exists
// for two cases: backfilling concepts that were linked before the
// transcription step existed, and manually retriggering one if a transcript
// looks wrong. Not exposed in any UI yet - triggered directly, same as other
// one-off admin operations in this project.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  if (!isConfigured()) {
    return NextResponse.json({ error: "Transcription isn't configured - ANTHROPIC_API_KEY missing." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { conceptId } = (body ?? {}) as Record<string, unknown>;
  if (typeof conceptId !== "string" || !conceptId) {
    return NextResponse.json({ error: "Missing conceptId." }, { status: 400 });
  }

  const concept = await db.concept.findUnique({ where: { id: conceptId } });
  if (!concept) {
    return NextResponse.json({ error: "Concept not found." }, { status: 404 });
  }
  if (!concept.sourceImagePath) {
    return NextResponse.json({ error: "This concept has no linked reference image." }, { status: 400 });
  }

  const storageKey = concept.sourceImagePath.replace(/^\/api\/uploads\//, "");

  try {
    await transcribeAndSaveConceptImage(conceptId, storageKey);
  } catch (err) {
    console.error("transcribeAndSaveConceptImage failed", err);
    return NextResponse.json({ error: "Transcription failed - please try again." }, { status: 502 });
  }

  const updated = await db.concept.findUnique({ where: { id: conceptId } });
  return NextResponse.json({
    conceptKey: updated?.conceptKey,
    transcriptLength: updated?.sourceImageTranscript?.length ?? 0,
  });
}
