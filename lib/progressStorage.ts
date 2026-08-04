import { masteryBand, nextReviewDate, scorePercent } from "./mastery";
import type { MasteryBand } from "./types";

/**
 * Known gap: progress is stored client-side (localStorage) per demo profile,
 * not in a real database. That's intentional for the pilot - it keeps the app
 * deployable with zero backend infra while we validate the learning loop with
 * 1-3 kids. Before any real multi-device or multi-family use, this needs to
 * move server-side (Postgres) so progress survives a cleared browser or a
 * second device. See PLATFORM_PLAN.md known gaps.
 */

export interface StoredUnitResult {
  unitKey: string;
  scorePct: number;
  band: MasteryBand;
  nextReviewDate: string; // ISO date
  perConcept: Record<string, { correct: number; total: number }>;
  takenAt: string; // ISO date
}

function storageKey(profileId: string): string {
  return `studyezy_progress_${profileId}`;
}

function readAll(profileId: string): Record<string, StoredUnitResult> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(profileId));
    return raw ? (JSON.parse(raw) as Record<string, StoredUnitResult>) : {};
  } catch {
    return {};
  }
}

export function recordTestResult(
  profileId: string,
  unitKey: string,
  correct: number,
  total: number,
  perConcept: Record<string, { correct: number; total: number }>
): StoredUnitResult {
  const scorePct = scorePercent(correct, total);
  const { band, date } = nextReviewDate(scorePct);

  const result: StoredUnitResult = {
    unitKey,
    scorePct,
    band,
    nextReviewDate: date.toISOString(),
    perConcept,
    takenAt: new Date().toISOString(),
  };

  const all = readAll(profileId);
  all[unitKey] = result;
  window.localStorage.setItem(storageKey(profileId), JSON.stringify(all));
  return result;
}

export function getAllResults(profileId: string): StoredUnitResult[] {
  return Object.values(readAll(profileId));
}

export { masteryBand };
