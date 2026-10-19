import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { UPLOADS_DIR } from "@/lib/uploads";
import { buildConceptDiagramContent, generateVisualNapkin, isNapkinConfigured, type NapkinFormat } from "@/lib/napkin";

const DIAGRAMS_DIR = path.join(UPLOADS_DIR, "concept-diagrams");
const EXT_BY_FORMAT: Record<NapkinFormat, string> = { svg: "svg", png: "png", ppt: "pptx" };

// Admin-only, single-concept diagram (re)generation - same standalone shape
// as /api/admin/concepts/generate-widget: an already-drafted concept (real
// content already verified) gets a structured Napkin diagram on demand,
// without needing a dedicated UI button yet (call with { conceptId } or
// { unitKey, conceptKey }, same contract as generate-widget).
//
// `visualQuery` is optional and passed straight through to Napkin (e.g.
// "flowchart", "timeline", "comparison", "mindmap") - omit it to let Napkin
// pick whichever layout best fits the concept's own text.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }
  if (!isNapkinConfigured()) {
    return NextResponse.json({ error: "NAPKIN_API_KEY isn't configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { conceptId, unitKey, conceptKey, visualQuery, format } = body as {
    conceptId?: string;
    unitKey?: string;
    conceptKey?: string;
    visualQuery?: string;
    format?: NapkinFormat;
  };

  const concept = conceptId
    ? await db.concept.findUnique({ where: { id: conceptId } })
    : unitKey && conceptKey
      ? await db.concept.findFirst({ where: { conceptKey, unit: { unitKey } } })
      : null;
  if (!concept) {
    return NextResponse.json({ error: "Concept not found. Pass conceptId, or unitKey+conceptKey." }, { status: 404 });
  }

  const resolvedFormat: NapkinFormat = format ?? "svg";
  let visual;
  try {
    visual = await generateVisualNapkin("concept-diagram-napkin", {
      content: buildConceptDiagramContent(concept),
      context: `School lesson concept, "${concept.name}" - keep the diagram simple and age-appropriate for a primary-school student.`,
      visualQuery,
      format: resolvedFormat,
    });
  } catch (err) {
    console.error("Napkin diagram generation failed", err);
    return NextResponse.json(
      { error: "Diagram generation failed.", detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }

  await mkdir(DIAGRAMS_DIR, { recursive: true });
  const filename = `${concept.id}.${EXT_BY_FORMAT[resolvedFormat]}`;
  await writeFile(path.join(DIAGRAMS_DIR, filename), visual.bytes);

  const url = `/api/concept-diagrams/${filename}`;
  await db.concept.update({ where: { id: concept.id }, data: { generatedDiagramUrl: url } });

  return NextResponse.json({ ok: true, url, requestId: visual.requestId });
}
