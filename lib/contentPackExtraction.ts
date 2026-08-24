import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractPackFragmentClaude, isConfigured, type UploadedPageImage } from "./claude";
import { extractPackFragmentGroq, isGroqConfigured } from "./groq";
// @ts-ignore - plain JS module (allowJs handles resolution; this silences any type-inference gaps without failing the build if none turn out to exist)
import { validatePack } from "../content/engine/validate.mjs";

const PROMPT_PATH = path.join(process.cwd(), "content", "prompts", "extract-worksheet.md");
const MAX_REPAIR_ATTEMPTS = 3;

export interface PackMeta {
  book: string;
  subject: string;
  board: string;
  stage: string;
  year?: string;
}

export interface PageResult {
  imagePath: string;
  sheets: number;
  questions: number;
  errors: string[];
  modelUsed: string;
}

export interface ContentPackResult {
  pack: Record<string, unknown>;
  perPage: PageResult[];
  totals: { inputTokens: number; outputTokens: number };
  modelUsed: string;
  validation: { errors: string[]; warnings: string[]; counts: { sheets: number; questions: number; fields: number; needsHuman: number } };
}

let cachedPrompt: { system: string; userTemplate: string } | null = null;

async function loadPrompt(): Promise<{ system: string; userTemplate: string }> {
  if (cachedPrompt) return cachedPrompt;
  const raw = await readFile(PROMPT_PATH, "utf8");
  const system = raw.split("## SYSTEM")[1].split("## USER")[0].trim();
  const userTemplate = raw.split("## USER")[1].split("---")[0].trim();
  cachedPrompt = { system, userTemplate };
  return cachedPrompt;
}

function fillTemplate(template: string, meta: PackMeta): string {
  const values: Record<string, string> = {
    book: meta.book,
    subject: meta.subject,
    board: meta.board,
    stage: meta.stage,
    year: meta.year ?? "",
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k: string) => values[k] ?? "");
}

// Groq-first, Claude-fallback - same tiering as lib/conceptImageTranscription.ts,
// for the same reason (this deployment has no ANTHROPIC_API_KEY configured).
async function callVisionModel(
  image: UploadedPageImage,
  system: string,
  userText: string
): Promise<{ text: string; inputTokens: number; outputTokens: number; modelUsed: string }> {
  if (isGroqConfigured()) {
    try {
      const result = await extractPackFragmentGroq(image, system, userText);
      return { ...result, modelUsed: "qwen/qwen3.6-27b" };
    } catch (err) {
      console.error("extractPackFragmentGroq failed, trying Claude fallback", err);
    }
  }
  if (isConfigured()) {
    const result = await extractPackFragmentClaude(image, system, userText);
    return { ...result, modelUsed: "claude-sonnet-5" };
  }
  throw new Error("Neither Groq nor Claude is configured for content-pack extraction.");
}

function parsePackJson(raw: string): { error?: string; sheets?: unknown[] } | null {
  const cleaned = raw.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/**
 * Converts a set of real photographed pages into a validated "content pack"
 * (content/schema/pack.schema.json) - the declarative-check alternative to
 * Concept's plain-prose fields. Runs ONE page per model call (not one call
 * per whole book, unlike content/engine/convert.mjs's original design) -
 * Groq's Qwen3.6-27B has an 8000 TPM cap, incompatible with a single
 * multi-sheet 32000-token completion. Each page gets up to
 * MAX_REPAIR_ATTEMPTS tries, feeding the validator's own error text back as
 * a correction prompt, exactly like the original convert.mjs's repair loop.
 */
export async function convertPagesToPack(
  images: UploadedPageImage[],
  meta: PackMeta,
  packId: string
): Promise<ContentPackResult> {
  const { system, userTemplate } = await loadPrompt();
  const filledUser = fillTemplate(userTemplate, meta);

  const allSheets: unknown[] = [];
  const perPage: PageResult[] = [];
  let totalInput = 0;
  let totalOutput = 0;
  let modelUsed = "";

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const pagingNote =
      `\n\nYou are being sent ONE page at a time (page ${i + 1} of ${images.length} in this batch), not the whole ` +
      `book. Extract only the sheet(s) whose full content appears on this page. If a question's content clearly ` +
      `continues onto a page you don't have, set "needsHuman": true with a reviewReason explaining that it spans pages.`;

    let userText = filledUser + pagingNote;
    let sheets: unknown[] = [];
    let lastErrors: string[] = [];

    for (let attempt = 1; attempt <= MAX_REPAIR_ATTEMPTS; attempt++) {
      const result = await callVisionModel(image, system, userText);
      totalInput += result.inputTokens;
      totalOutput += result.outputTokens;
      modelUsed = result.modelUsed;

      const parsed = parsePackJson(result.text);
      if (!parsed) {
        lastErrors = ["model did not return valid JSON"];
        if (attempt === MAX_REPAIR_ATTEMPTS) break;
        userText = `${filledUser}${pagingNote}\n\nYour previous attempt did not return valid JSON. Return ONLY the JSON object, no markdown fences, no commentary.`;
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
        source: { book: meta.book, capturedAs: "parent photo upload", confidence: "mixed" },
        curriculum: { board: meta.board, stage: meta.stage, subject: meta.subject },
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
        `${filledUser}${pagingNote}\n\nYour previous attempt failed automated validation. Fix exactly these ` +
        `problems and return the corrected pack in full. Do not change anything else.\n\n${v.errors.join("\n")}`;
    }

    allSheets.push(...sheets);
    perPage.push({
      imagePath: image.path,
      sheets: sheets.length,
      questions: sheets.reduce((a: number, s: unknown) => a + ((s as { questions?: unknown[] }).questions?.length ?? 0), 0),
      errors: lastErrors,
      modelUsed,
    });
  }

  const pack = {
    packVersion: "1.0",
    packId,
    source: {
      book: meta.book,
      capturedAs: "parent photo upload",
      photoCount: images.length,
      extractedOn: new Date().toISOString().slice(0, 10),
      confidence: perPage.some((p) => p.errors.length) ? "low" : "mixed",
    },
    curriculum: { board: meta.board, stage: meta.stage, subject: meta.subject },
    language: "en",
    sheets: allSheets,
  };

  const validation = validatePack(pack) as ContentPackResult["validation"];

  return { pack, perPage, totals: { inputTokens: totalInput, outputTokens: totalOutput }, modelUsed, validation };
}
