import { describe, expect, it } from "vitest";
import { daysUntilNextReview, masteryBand, nextReviewDate, scorePercent } from "@/lib/mastery";

describe("scorePercent", () => {
  it("computes a rounded percentage", () => {
    expect(scorePercent(9, 10)).toBe(90);
    expect(scorePercent(1, 3)).toBe(33);
    expect(scorePercent(2, 3)).toBe(67);
  });

  it("returns 0 for a zero-question test instead of dividing by zero", () => {
    expect(scorePercent(0, 0)).toBe(0);
  });
});

describe("masteryBand", () => {
  it("bands scores per PLATFORM_PLAN.md 2.3 thresholds", () => {
    expect(masteryBand(100)).toBe("mastered");
    expect(masteryBand(85)).toBe("mastered");
    expect(masteryBand(84)).toBe("needs_brush_up");
    expect(masteryBand(60)).toBe("needs_brush_up");
    expect(masteryBand(59)).toBe("needs_reteach");
    expect(masteryBand(0)).toBe("needs_reteach");
  });
});

describe("daysUntilNextReview", () => {
  it("tightens the retest cadence as mastery drops", () => {
    expect(daysUntilNextReview("mastered")).toBeGreaterThan(daysUntilNextReview("needs_brush_up"));
    expect(daysUntilNextReview("needs_brush_up")).toBeGreaterThan(daysUntilNextReview("needs_reteach"));
  });
});

describe("nextReviewDate", () => {
  it("adds the right number of days for a mastered score", () => {
    const from = new Date("2026-01-01T00:00:00.000Z");
    const { band, date } = nextReviewDate(90, from);
    expect(band).toBe("mastered");
    expect(date.toISOString().slice(0, 10)).toBe("2026-01-15");
  });

  it("schedules a fast retest for a weak score", () => {
    const from = new Date("2026-01-01T00:00:00.000Z");
    const { band, date } = nextReviewDate(40, from);
    expect(band).toBe("needs_reteach");
    expect(date.toISOString().slice(0, 10)).toBe("2026-01-03");
  });
});
