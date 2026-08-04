import type { MasteryBand } from "./types";

/**
 * Mastery bands per PLATFORM_PLAN.md 2.3 - adaptive retest cadence, not a fixed calendar.
 */
export function masteryBand(scorePct: number): MasteryBand {
  if (scorePct >= 85) return "mastered";
  if (scorePct >= 60) return "needs_brush_up";
  return "needs_reteach";
}

/**
 * Days until the next review, driven by how the kid actually did - tightens or
 * loosens instead of a fixed Day-1/3/7/21 schedule.
 */
export function daysUntilNextReview(band: MasteryBand): number {
  switch (band) {
    case "mastered":
      return 14; // light single-question check-in at the next natural review point
    case "needs_brush_up":
      return 3; // retest the specific weak concept soon
    case "needs_reteach":
      return 2; // re-teach first, then retest fast
  }
}

export function nextReviewDate(scorePct: number, from: Date = new Date()): { band: MasteryBand; date: Date } {
  const band = masteryBand(scorePct);
  const date = new Date(from);
  date.setDate(date.getDate() + daysUntilNextReview(band));
  return { band, date };
}

export function scorePercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}
