import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { generateTermExamPapers, isConfigured, type TermExamUnitContent, type TermExamDraftPaper } from "@/lib/claude";
import { generateTermExamPapersGemini, isGeminiConfigured } from "@/lib/gemini";
import { createTermExamPaper } from "@/lib/termExams";
import { BOARD_UNITS } from "@/lib/boardUnits";

export const runtime = "nodejs";

// Gemini first, then Claude - same ordering as app/api/resources/generate-paper's
// runGeneration, for the same reason: ANTHROPIC_API_KEY isn't set in
// production, so Claude-only here would 503 every real (non-local) call.
async function runGeneration(
  subjectName: string,
  stageLabel: string,
  units: TermExamUnitContent[],
  paperCount: number,
  totalMarks: number
): Promise<TermExamDraftPaper[]> {
  const providers: { name: string; configured: boolean; run: () => Promise<TermExamDraftPaper[]> }[] = [
    {
      name: "gemini",
      configured: isGeminiConfigured(),
      run: () => generateTermExamPapersGemini(subjectName, stageLabel, units, paperCount, totalMarks),
    },
    {
      name: "claude",
      configured: isConfigured(),
      run: () => generateTermExamPapers(subjectName, stageLabel, units, paperCount, totalMarks),
    },
  ];

  let lastError: unknown;
  for (const provider of providers) {
    if (!provider.configured) continue;
    try {
      return await provider.run();
    } catch (err) {
      console.error(`${provider.name} term-exam generation failed, trying next provider`, err);
      lastError = err;
    }
  }
  throw lastError ?? new Error("No term-exam-paper provider is configured.");
}

/**
 * Admin-only: generates a full set of terminal-exam papers (each with its
 * own answer key) for a chosen subject + portion of units. Source content is
 * each unit's already-vetted concept material - the Board content
 * (lib/boardUnits) when a bespoke unit file exists, else the unit's own
 * DB Concept rows - never a fresh re-read of scanned pages, since that
 * content has already been reviewed once.
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  if (!isConfigured() && !isGeminiConfigured()) {
    return NextResponse.json(
      { error: "Terminal exam generation isn't configured yet - add GOOGLE_AI_API_KEY or ANTHROPIC_API_KEY." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { subjectId, unitIds, paperCount, totalMarks, durationMinutes } = (body ?? {}) as Record<string, unknown>;
  if (typeof subjectId !== "string" || !subjectId) {
    return NextResponse.json({ error: "Missing subject." }, { status: 400 });
  }
  if (!Array.isArray(unitIds) || unitIds.length === 0 || !unitIds.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "Pick at least one unit to cover." }, { status: 400 });
  }
  const papers = Number(paperCount) > 0 ? Math.min(Number(paperCount), 4) : 2;
  const marks = Number(totalMarks) > 0 ? Math.min(Number(totalMarks), 200) : 100;
  const duration = Number(durationMinutes) > 0 ? Number(durationMinutes) : undefined;

  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: { stage: { include: { curriculum: true } } },
  });
  if (!subject) {
    return NextResponse.json({ error: "Subject not found." }, { status: 404 });
  }

  const units = await db.unit.findMany({
    where: { id: { in: unitIds as string[] }, subjectId },
    include: { concepts: true },
    orderBy: { number: "asc" },
  });
  if (units.length === 0) {
    return NextResponse.json({ error: "None of the selected units belong to this subject." }, { status: 400 });
  }

  const unitContent: TermExamUnitContent[] = units.map((unit) => {
    const boardUnit = BOARD_UNITS[unit.unitKey];
    if (boardUnit) {
      return {
        unitKey: unit.unitKey,
        title: unit.title,
        concepts: boardUnit.concepts.map((c) => ({ title: c.title, summary: c.summary, keyPoints: c.keyPoints })),
      };
    }
    return {
      unitKey: unit.unitKey,
      title: unit.title,
      concepts: unit.concepts
        .filter((c) => c.status === "drafted")
        .map((c) => ({
          title: c.name,
          summary: c.definition ?? "",
          keyPoints: c.keyPoints,
        })),
    };
  });

  const hasAnyConcepts = unitContent.some((u) => u.concepts.length > 0);
  if (!hasAnyConcepts) {
    return NextResponse.json(
      { error: "None of the selected units have drafted content yet - author their concepts first." },
      { status: 400 }
    );
  }

  try {
    const drafts = await runGeneration(subject.name, subject.stage.label, unitContent, papers, marks);
    if (drafts.length === 0) {
      return NextResponse.json({ error: "Couldn't generate papers from this portion." }, { status: 422 });
    }

    const created = [];
    for (const draft of drafts) {
      const paper = await createTermExamPaper({
        subjectId,
        title: draft.title,
        paperNumber: draft.paperNumber,
        unitIds: units.map((u) => u.id),
        totalMarks: draft.totalMarks,
        durationMinutes: duration,
        sections: draft.sections,
        answerSections: draft.answerSections,
        createdByUserId: admin.id,
        status: "draft",
      });
      created.push(paper.id);
    }

    return NextResponse.json({ paperIds: created });
  } catch (err) {
    console.error("generateTermExamPapers failed", err);
    return NextResponse.json({ error: "Couldn't generate terminal exam papers right now - please try again." }, { status: 502 });
  }
}
