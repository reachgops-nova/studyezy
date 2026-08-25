import "server-only";
import { db } from "./db";
import { getQuestionPaperByKey } from "./queries/questionPapers";
import { questionPaperToPack } from "./questionPaperToPack";
import type { QuestionPaperDifficulty } from "./types";
import type { Prisma } from "@prisma/client";
// @ts-ignore - plain JS module (allowJs handles resolution)
import { validatePack } from "../content/engine/validate.mjs";

/**
 * Returns the packId of a validator-clean, pack-shaped progression test for
 * this unit+difficulty - converting the unit's existing QuestionPaper the
 * first time it's requested (lib/questionPaperToPack.ts, zero AI cost,
 * deterministic), then reusing that same ContentPack row on every later
 * request (unique on unitId+purpose+difficulty). Returns null if the unit
 * has no QuestionPaper for this difficulty yet - unchanged from the old
 * behaviour (app/test/[unitId]/[difficulty]/page.tsx redirects back to the
 * tier picker in that case).
 */
export async function getOrCreateProgressionTestPack(unitKey: string, difficulty: QuestionPaperDifficulty): Promise<string | null> {
  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) return null;

  const existing = await db.contentPack.findUnique({
    where: { unitId_purpose_difficulty: { unitId: unit.id, purpose: "progression_test", difficulty } },
  });
  if (existing) return existing.packId;

  const paper = await getQuestionPaperByKey(unitKey, difficulty);
  if (!paper || paper.questions.length === 0) return null;

  const packId = `${unitKey}-test-${difficulty}`;
  const pack = questionPaperToPack(
    paper,
    { book: unit.sourceTitle || unit.title, subject: unit.title, board: unit.board, stage: unitKey.split("-")[1] },
    unit.title,
    packId
  );

  const validation = validatePack(pack) as { errors: string[]; warnings: string[]; counts: { sheets: number; questions: number; needsHuman: number } };
  const status = validation.errors.length > 0 ? "failed" : "clean";

  await db.contentPack.upsert({
    where: { unitId_purpose_difficulty: { unitId: unit.id, purpose: "progression_test", difficulty } },
    create: {
      packId,
      unitId: unit.id,
      purpose: "progression_test",
      difficulty,
      data: pack as unknown as Prisma.InputJsonValue,
      sheetsCount: validation.counts.sheets,
      questionsCount: validation.counts.questions,
      needsHumanCount: validation.counts.needsHuman,
      errorsCount: validation.errors.length,
      warningsCount: validation.warnings.length,
      status,
      sourceImageKeys: [],
      model: "converted-from-question-paper",
    },
    update: {},
  });

  if (status === "failed") {
    console.error(`questionPaperToPack produced an invalid pack for ${unitKey}/${difficulty}`, validation.errors);
    return null;
  }
  return packId;
}
