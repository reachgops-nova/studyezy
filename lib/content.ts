import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { CurriculumUnit } from "./types";
import unit1English from "@/content/curricula/igcse/stage5/english/unit-1.json";

// Only real, populated units are registered here. Anything not listed is "coming soon"
// per the catalog and should never be requested directly.
const UNIT_REGISTRY: Record<string, CurriculumUnit> = {
  "cambridge-5-english-1": unit1English as unknown as CurriculumUnit,
};

export function getUnit(
  curriculumId: string,
  stageId: number,
  subjectId: string,
  unitId: number
): CurriculumUnit | null {
  const key = `${curriculumId}-${stageId}-${subjectId}-${unitId}`;
  return UNIT_REGISTRY[key] ?? null;
}

export function unitKey(curriculumId: string, stageId: number, subjectId: string, unitId: number) {
  return `${curriculumId}-${stageId}-${subjectId}-${unitId}`;
}

/**
 * Textbook page photos a parent uploaded via the Unit Overview screen.
 * Stored under public/uploads/{unitKey}/ - see app/api/pages/upload.
 * Returns [] if nothing has been uploaded for this unit yet.
 */
export async function getUploadedPageImages(key: string): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "uploads", key);
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => !f.startsWith("."))
      .sort()
      .map((f) => `/uploads/${key}/${f}`);
  } catch {
    return [];
  }
}
