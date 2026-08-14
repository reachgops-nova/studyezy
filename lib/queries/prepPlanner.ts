import "server-only";
import { db } from "@/lib/db";

export interface PrepPlanItem {
  conceptId: string;
  conceptKey: string;
  conceptName: string;
  unitKey: string;
  unitTitle: string;
  band: "needs_reteach" | "needs_brush_up";
  reason: string;
  nextReviewDue: string; // ISO date
}

const MAX_ITEMS = 3;

/**
 * Prep Planner (PLATFORM_PLAN.md §2.6): "here are the 3 things worth 20
 * minutes each this week," not a nagging to-do list. Purely deterministic -
 * derived from ConceptMastery + the latest ReasoningLog per concept, no
 * Claude call needed, so it works fully live regardless of Anthropic credit.
 */
export async function getPrepPlan(profileId: string): Promise<PrepPlanItem[]> {
  const masteries = await db.conceptMastery.findMany({
    where: { studentProfileId: profileId, band: { in: ["needs_reteach", "needs_brush_up"] } },
    include: { concept: { include: { unit: true } } },
    orderBy: [{ nextReviewDue: "asc" }],
  });

  // needs_reteach is more urgent than needs_brush_up, but within each band
  // keep the "due soonest" ordering already applied by the query.
  const sorted = [
    ...masteries.filter((m) => m.band === "needs_reteach"),
    ...masteries.filter((m) => m.band === "needs_brush_up"),
  ].slice(0, MAX_ITEMS);

  const items: PrepPlanItem[] = [];
  for (const m of sorted) {
    const latestReasoning = await db.reasoningLog.findFirst({
      where: { studentProfileId: profileId, conceptId: m.conceptId },
      orderBy: { createdAt: "desc" },
    });

    items.push({
      conceptId: m.conceptId,
      conceptKey: m.concept.conceptKey,
      conceptName: m.concept.name,
      unitKey: m.concept.unit.unitKey,
      unitTitle: m.concept.unit.title,
      band: m.band as "needs_reteach" | "needs_brush_up",
      reason: reasonFor(m.band, latestReasoning?.classification),
      nextReviewDue: m.nextReviewDue.toISOString(),
    });
  }

  return items;
}

function reasonFor(band: string, classification?: string): string {
  switch (classification) {
    case "conceptual_gap":
      return "Worth going through the idea itself again, not just retesting.";
    case "careless_slip":
      return "You know this one - it was more a slip than a gap. A quick retest should confirm it.";
    case "misread_question":
      return "The understanding was there - worth practicing reading the question carefully.";
    default:
      return band === "needs_reteach"
        ? "Let's go through this concept again before retesting."
        : "A few tricky bits worth reviewing before the next check-in.";
  }
}
