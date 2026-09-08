import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractPackFragmentGemini, isGeminiConfigured } from "./gemini";
import type { ExtractionSourceFile } from "./claude";

const PROMPT_PATH = path.join(process.cwd(), "content", "prompts", "extract-textbook-toc.md");

export interface DetectedUnit {
  title: string;
}

let cachedSystem: string | null = null;
async function loadSystem(): Promise<string> {
  if (cachedSystem) return cachedSystem;
  const raw = await readFile(PROMPT_PATH, "utf8");
  cachedSystem = raw.split("## SYSTEM")[1].split("## After the model returns")[0].trim();
  return cachedSystem;
}

/**
 * Real user request 2026-09-08: adding a textbook should populate every one
 * of its units automatically from its own table of contents, instead of an
 * admin re-typing each unit title one at a time. Gemini-only (same
 * constraint as lib/contentPackExtraction.ts's whole-document path) - it's
 * the only provider here with real native PDF support; OpenRouter's PDF
 * plugin has a paid-account-balance floor and Claude isn't configured in
 * production.
 *
 * Deliberately narrow: this ONLY detects the unit/chapter list, it does not
 * attempt to extract real lesson content or split the PDF's pages across
 * units - see app/manage/actions.ts's createUnitsFromTextbook, which
 * attaches the whole uploaded file to every created unit as a pending
 * UnitResource so the existing, unchanged Curriculum Materials
 * approve-then-extract flow populates each unit's real content afterward.
 */
export async function extractTextbookUnits(file: ExtractionSourceFile): Promise<DetectedUnit[]> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini isn't configured - textbook unit detection has no other capable provider right now.");
  }
  const system = await loadSystem();
  const result = await extractPackFragmentGemini(
    file,
    system,
    "Identify every unit/chapter in this textbook, in the book's own order."
  );
  const cleaned = result.text.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();

  let parsed: { units?: { title?: string }[]; error?: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Couldn't read a clear unit/chapter list from this file - try a PDF that includes the table of contents.");
  }
  if (parsed.error) {
    throw new Error(parsed.error);
  }

  const units = (parsed.units ?? [])
    .map((u) => ({ title: String(u.title ?? "").trim() }))
    .filter((u) => u.title.length > 0);
  if (units.length === 0) {
    throw new Error("Couldn't find any real units or chapters in this file - try a PDF that includes the table of contents.");
  }
  return units;
}
