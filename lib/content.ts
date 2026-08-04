import "server-only";
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
