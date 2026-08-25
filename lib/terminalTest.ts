import "server-only";
import { db } from "./db";
import { getQuestionPaperByKey } from "./queries/questionPapers";
import { questionPaperToSheet } from "./questionPaperToPack";
import type { Prisma } from "@prisma/client";
// @ts-ignore - plain JS module (allowJs handles resolution)
import { validatePack } from "../content/engine/validate.mjs";

/**
 * Assembles a cumulative "terminal test" - one sheet per unit the student
 * has already tested on in this subject, each sheet the unit's own real
 * moderate-tier QuestionPaper (converted the same deterministic, zero-AI-cost
 * way as a single progression test - see lib/questionPaperToPack.ts).
 * Not cached/deduped like a progression test pack: every call produces a
 * fresh pack reflecting exactly which units the student has covered as of
 * right now, since that set grows over time (see PLATFORM_PLAN.md's
 * 2026-08-25 entry - this is the kit's own originally-planned "query over
 * skill tags across published packs" terminal-test assembly, built here as
 * a query over the units a student has real TestAttempts on).
 * Returns null if the student has no attempts in this subject yet, or none
 * of those units have a moderate paper to draw from.
 */
export async function assembleTerminalTest(studentProfileId: string, subjectId: string): Promise<string | null> {
  const attempts = await db.testAttempt.findMany({
    where: { studentProfileId, unit: { subjectId } },
    select: { unitId: true },
    distinct: ["unitId"],
  });
  if (attempts.length === 0) return null;

  const units = await db.unit.findMany({
    where: { id: { in: attempts.map((a) => a.unitId) } },
    orderBy: { number: "asc" },
  });
  if (units.length === 0) return null;

  const subject = await db.subject.findUnique({ where: { id: subjectId } });

  const sheets = [];
  for (const unit of units) {
    const paper = await getQuestionPaperByKey(unit.unitKey, "moderate");
    if (!paper || paper.questions.length === 0) continue;
    // sourceUnitKey (additive, non-schema field) lets the grading route
    // record each sheet's results against ITS OWN unit -
    // TestAttempt/ConceptMastery stay one-row-per-unit even though this
    // pack spans several (see app/api/pack-test-attempts/route.ts).
    sheets.push({ ...questionPaperToSheet(paper, unit.title, sheets.length + 1), sourceUnitKey: unit.unitKey });
  }
  if (sheets.length === 0) return null;

  const packId = `terminal-${subjectId}-${Date.now()}`;
  const pack = {
    packVersion: "1.0",
    packId,
    source: { book: subject?.name ?? "Terminal test", capturedAs: "manual" as const, confidence: "high" as const },
    curriculum: { board: units[0].board, stage: String(units[0].unitKey.split("-")[1] ?? ""), subject: subject?.name ?? "" },
    language: "en",
    sheets,
  };

  const validation = validatePack(pack) as { errors: string[]; warnings: string[]; counts: { sheets: number; questions: number; needsHuman: number } };
  if (validation.errors.length > 0) {
    console.error("assembleTerminalTest produced an invalid pack", validation.errors);
    return null;
  }

  await db.contentPack.create({
    data: {
      packId,
      unitId: null,
      subjectId,
      purpose: "terminal_test",
      data: pack as unknown as Prisma.InputJsonValue,
      sheetsCount: validation.counts.sheets,
      questionsCount: validation.counts.questions,
      needsHumanCount: validation.counts.needsHuman,
      errorsCount: validation.errors.length,
      warningsCount: validation.warnings.length,
      status: "clean",
      sourceImageKeys: [],
      model: "converted-from-question-paper",
    },
  });

  return packId;
}
