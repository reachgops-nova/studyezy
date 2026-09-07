import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { generateVariantFragmentGemini, isGeminiConfigured } from "./gemini";
import { FIELD_SHAPE_REMINDER, parsePackJson, renumberSheets, verifyDiagramAnswers } from "./contentPackExtraction";
// @ts-ignore - plain JS module, see lib/contentPackExtraction.ts's identical import
import { validatePack } from "../content/engine/validate.mjs";

const PROMPT_PATH = path.join(process.cwd(), "content", "prompts", "generate-variant.md");
const MAX_REPAIR_ATTEMPTS = 3;

export interface SourcePack {
  packId: string;
  source: { book: string; [key: string]: unknown };
  curriculum: { board: string; stage: string; subject: string; [key: string]: unknown };
  sheets: unknown[];
}

export interface VariantResult {
  pack: Record<string, unknown>;
  totals: { inputTokens: number; outputTokens: number };
  modelUsed: string;
  validation: { errors: string[]; warnings: string[]; counts: { sheets: number; questions: number; fields: number; needsHuman: number } };
}

let cachedSystem: string | null = null;
async function loadSystem(): Promise<string> {
  if (cachedSystem) return cachedSystem;
  const raw = await readFile(PROMPT_PATH, "utf8");
  cachedSystem = raw.split("## SYSTEM")[1].split("## After the model returns")[0].trim();
  return cachedSystem;
}

/**
 * Authors a brand-new practice set from an existing, already-validated one
 * (`sourcePack`) as its blueprint - see content/prompts/generate-variant.md.
 * This is the "avoid document dependency" path the user asked for directly:
 * Set 2/3/4 no longer need their own uploaded source PDF, they're authored
 * from Set 1's own pattern. `photo_crop` questions (real, non-reproducible
 * photographs) are instructed to pass through unchanged; every other
 * question gets fresh numbers and its own freshly-derived answer, then that
 * answer is independently re-checked by verifyDiagramAnswers before this
 * returns - the same safeguard extraction runs, applied here to genuinely
 * new (never-human-reviewed) content, where it matters even more.
 *
 * Runs as ONE model call for the whole blueprint (not per-sheet), matching
 * how the real Olympiad blueprint is actually shaped today (a single sheet,
 * see the 2026-09-07 production inspection) and reusing the same
 * 32000-token budget already proven sufficient for a 35-question document.
 */
export async function generateVariantPack(sourcePack: SourcePack, setNumber: number, packId: string): Promise<VariantResult> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini isn't configured - variant generation has no other capable provider right now.");
  }

  const system = await loadSystem();
  const baseUserText =
    `Blueprint set (already published, already correct) to base Set ${setNumber} on. Reproduce its exact sheet/question ` +
    `shape and write fresh content per the rules above.\n\nBlueprint sheets:\n${JSON.stringify(sourcePack.sheets, null, 2)}`;

  let userText = baseUserText + FIELD_SHAPE_REMINDER;
  let sheets: unknown[] = [];
  let lastErrors: string[] = [];
  let totalInput = 0;
  let totalOutput = 0;
  let modelUsed = "";

  for (let attempt = 1; attempt <= MAX_REPAIR_ATTEMPTS; attempt++) {
    const result = await generateVariantFragmentGemini(system, userText);
    totalInput += result.inputTokens;
    totalOutput += result.outputTokens;
    modelUsed = "gemini-flash-latest";

    const parsed = parsePackJson(result.text);
    if (!parsed) {
      lastErrors = ["model did not return valid JSON"];
      if (attempt === MAX_REPAIR_ATTEMPTS) break;
      userText = `${baseUserText}${FIELD_SHAPE_REMINDER}\n\nYour previous attempt did not return valid JSON. Return ONLY the JSON object, no markdown fences, no commentary.`;
      continue;
    }
    if (parsed.error) {
      lastErrors = [`model refused: ${parsed.error}`];
      break;
    }

    sheets = parsed.sheets ?? [];
    const probePack = {
      packVersion: "1.0",
      packId,
      source: { ...sourcePack.source, capturedAs: "authored variant" },
      curriculum: sourcePack.curriculum,
      language: "en",
      sheets,
    };
    const v = validatePack(probePack) as { errors: string[]; warnings: string[] };
    if (v.errors.length === 0) {
      lastErrors = [];
      break;
    }
    lastErrors = v.errors;
    if (attempt === MAX_REPAIR_ATTEMPTS) break;
    userText =
      `${baseUserText}${FIELD_SHAPE_REMINDER}\n\nYour previous attempt failed automated validation. Fix exactly these ` +
      `problems and return the corrected set in full. Do not change anything else.\n\n${v.errors.join("\n")}`;
  }

  if (sheets.length > 0) {
    const verified = await verifyDiagramAnswers(sheets);
    if (verified > 0) console.log(`Verified ${verified} declarative-diagram answer(s) in the new variant set.`);
  }

  const renumbered = renumberSheets(sheets, 0);

  const pack = {
    packVersion: "1.0",
    packId,
    source: {
      ...sourcePack.source,
      capturedAs: "authored variant",
      variantOf: sourcePack.packId,
      extractedOn: new Date().toISOString().slice(0, 10),
      confidence: lastErrors.length ? "low" : "mixed",
    },
    curriculum: sourcePack.curriculum,
    language: "en",
    sheets: renumbered,
  };

  const validation = validatePack(pack) as VariantResult["validation"];

  return { pack, totals: { inputTokens: totalInput, outputTokens: totalOutput }, modelUsed, validation };
}
