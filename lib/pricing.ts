import "server-only";
import type { PricingPlan, User } from "@prisma/client";
import { db } from "./db";

// Only the Cambridge pathway has real seeded content today (see
// prisma/seed.ts) - the other 4 boards in PricingPlan exist for business
// planning ahead of that content, per the 2026-08-20 pricing decision. This
// is the one explicit mapping between "what content a kid is actually on"
// and "which pricing column applies to them" - update it here if/when a
// second real curriculum is seeded.
const CONTENT_CURRICULUM_SLUG_TO_PRICING_LABEL: Record<string, string> = {
  cambridge: "Cambridge IGCSE",
};

export const TRIAL_LENGTH_DAYS = 30;

export function isTrialActive(user: Pick<User, "trialEndsAt">): boolean {
  return user.trialEndsAt.getTime() > Date.now();
}

export function trialDaysRemaining(user: Pick<User, "trialEndsAt">): number {
  const msRemaining = user.trialEndsAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
}

export async function getAllPricingPlans(): Promise<PricingPlan[]> {
  return db.pricingPlan.findMany({
    orderBy: [{ minGrade: "asc" }, { curriculumLabel: "asc" }],
  });
}

/**
 * Resolves the price a given kid should see: the PricingPlan row whose
 * grade band covers their Stage number, under the pricing column mapped to
 * their content curriculum's slug. Returns null if no plan covers that
 * combination (e.g. a grade band the admin hasn't priced, or a curriculum
 * slug not yet in the mapping above) - callers should treat that as "no
 * price to show," not throw, since pricing config can legitimately be
 * incomplete.
 */
export async function getPricingPlanForKid(
  curriculumSlug: string,
  grade: number
): Promise<PricingPlan | null> {
  const curriculumLabel = CONTENT_CURRICULUM_SLUG_TO_PRICING_LABEL[curriculumSlug];
  if (!curriculumLabel) return null;

  return db.pricingPlan.findFirst({
    where: { curriculumLabel, minGrade: { lte: grade }, maxGrade: { gte: grade } },
  });
}
