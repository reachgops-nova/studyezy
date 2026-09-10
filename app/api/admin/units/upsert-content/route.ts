import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";

// Admin-only. Creates or updates a unit and its concepts' real content
// (definition/keyPoints/examples/tipsToRemember) via the app's own
// authenticated code path, rather than a raw DB script - the same
// content this route accepts was already verified against the real
// source material before being sent here. Built for rolling out the
// NotebookLM-generated lesson pattern (scenes + bespoke practice widgets)
// unit by unit, real user direction 2026-09-10: "start working on the
// other units... prepare those lessons for english and math cambridge."
interface ConceptInput {
  conceptKey: string;
  name: string;
  orderIndex: number;
  definition: string;
  keyPoints: string[];
  examples: string[];
  tipsToRemember: string[];
}

interface RequestBody {
  subjectUnitKey: string; // an existing unit's key, to copy subjectId/board from
  unitKey: string;
  number: number;
  title: string;
  concepts: ConceptInput[];
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body.subjectUnitKey || !body.unitKey || !body.number || !body.title || !Array.isArray(body.concepts)) {
    return NextResponse.json({ error: "subjectUnitKey, unitKey, number, title, and concepts are required." }, { status: 400 });
  }

  const referenceUnit = await db.unit.findUnique({ where: { unitKey: body.subjectUnitKey } });
  if (!referenceUnit) {
    return NextResponse.json({ error: `Reference unit ${body.subjectUnitKey} not found.` }, { status: 404 });
  }

  const unit = await db.unit.upsert({
    where: { unitKey: body.unitKey },
    create: {
      subjectId: referenceUnit.subjectId,
      unitKey: body.unitKey,
      number: body.number,
      title: body.title,
      board: referenceUnit.board,
      available: true,
      unitStatus: "in_progress",
      contentMode: "curriculum",
    },
    update: {},
  });

  const results: { conceptKey: string; id: string }[] = [];
  for (const c of body.concepts) {
    const result = await db.concept.upsert({
      where: { unitId_conceptKey: { unitId: unit.id, conceptKey: c.conceptKey } },
      create: {
        unitId: unit.id,
        conceptKey: c.conceptKey,
        name: c.name,
        status: "drafted",
        orderIndex: c.orderIndex,
        definition: c.definition,
        keyPoints: c.keyPoints,
        examples: c.examples,
        tipsToRemember: c.tipsToRemember,
        source: "extracted",
      },
      update: {
        name: c.name,
        orderIndex: c.orderIndex,
        definition: c.definition,
        keyPoints: c.keyPoints,
        examples: c.examples,
        tipsToRemember: c.tipsToRemember,
      },
    });
    results.push({ conceptKey: result.conceptKey, id: result.id });
  }

  return NextResponse.json({ ok: true, unitId: unit.id, concepts: results });
}
