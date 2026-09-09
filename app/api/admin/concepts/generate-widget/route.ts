import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { generateConceptWidget } from "@/lib/conceptWidgetGeneration";
import { generateConceptWidgetOpenRouter, isOpenRouterConfigured } from "@/lib/openrouter";
import type { Prisma } from "@prisma/client";

// Admin-only, single-concept widget (re)generation - same
// generateConceptWidget()/OpenRouter-fallback pair app/api/pages/
// extract-from-textbook/route.ts already runs per newly-created concept,
// exposed here standalone so an already-drafted concept (real content
// already verified, generatedWidget still null) can get its practice
// widget without re-running the whole textbook extraction pipeline.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { conceptId, unitKey, conceptKey } = body as { conceptId?: string; unitKey?: string; conceptKey?: string };

  const concept = conceptId
    ? await db.concept.findUnique({ where: { id: conceptId } })
    : unitKey && conceptKey
      ? await db.concept.findFirst({ where: { conceptKey, unit: { unitKey } } })
      : null;
  if (!concept) {
    return NextResponse.json({ error: "Concept not found. Pass conceptId, or unitKey+conceptKey." }, { status: 404 });
  }

  let widget = null;
  let source: "gemini" | "openrouter" | null = null;
  try {
    widget = await generateConceptWidget(concept);
    source = "gemini";
  } catch (err) {
    console.error("Gemini widget generation failed, trying OpenRouter", err);
    if (isOpenRouterConfigured()) {
      widget = await generateConceptWidgetOpenRouter(concept);
      source = "openrouter";
    }
  }

  if (!widget) {
    return NextResponse.json({ error: "Widget generation failed on all providers." }, { status: 502 });
  }

  await db.concept.update({
    where: { id: conceptId },
    data: { generatedWidget: widget as unknown as Prisma.InputJsonValue },
  });

  return NextResponse.json({ ok: true, source, widget });
}
