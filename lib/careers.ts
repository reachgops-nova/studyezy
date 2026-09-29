import "server-only";
import { db } from "./db";
import type { Prisma } from "@prisma/client";

/** One rung of a career path's grade-by-grade roadmap - deliberately fixed
 * to these 4 bands (not tied to any one curriculum's exact grade numbers)
 * so the same roadmap makes sense across Cambridge/CBSE/ICSE/etc. `focus`
 * is a one-line theme for the band, `activities` are concrete, doable
 * things a kid (or their parent) can act on right now - not just "study
 * hard". Real feedback (2026-09-29): marking a path "curious" needs to
 * answer "what do I do about that today", not just describe the job. */
export const CAREER_GRADE_BANDS = ["Grades 3-5", "Grades 6-8", "Grades 9-10", "Grades 11-12"] as const;
export type CareerGradeBand = (typeof CAREER_GRADE_BANDS)[number];

export interface CareerGradeGuidance {
  band: CareerGradeBand;
  focus: string;
  activities: string[];
}

export interface CareerPathInput {
  name: string;
  category: string;
  summary: string;
  dayInLife?: string;
  keySkills: string[];
  relatedSubjectSlugs: string[];
  gradeGuidance?: CareerGradeGuidance[];
  relatedUnitIds?: string[];
  createdByUserId?: string;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCareerPath(input: CareerPathInput) {
  const baseSlug = slugify(input.name);
  let slug = baseSlug;
  let suffix = 2;
  while (await db.careerPath.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return db.careerPath.create({
    data: {
      slug,
      name: input.name,
      category: input.category,
      summary: input.summary,
      dayInLife: input.dayInLife,
      keySkills: input.keySkills,
      relatedSubjectSlugs: input.relatedSubjectSlugs,
      gradeGuidance: (input.gradeGuidance ?? []) as unknown as Prisma.InputJsonValue,
      relatedUnitIds: input.relatedUnitIds ?? [],
      createdByUserId: input.createdByUserId,
    },
  });
}

export async function setCareerPathAvailability(id: string, available: boolean) {
  return db.careerPath.update({ where: { id }, data: { available } });
}

export async function setCareerPathGradeGuidance(id: string, guidance: CareerGradeGuidance[]) {
  return db.careerPath.update({
    where: { id },
    data: { gradeGuidance: guidance as unknown as Prisma.InputJsonValue },
  });
}

export async function setCareerPathRelatedUnits(id: string, unitIds: string[]) {
  return db.careerPath.update({ where: { id }, data: { relatedUnitIds: unitIds } });
}

/** Every available unit across the real curriculum, grouped by subject, for
 * an admin to pick from when wiring a career path to actual lessons -
 * mirrors the subject/unit shape GenerateTermExamForm already uses. */
export async function getUnitPickerOptions() {
  const subjects = await db.subject.findMany({
    where: { available: true },
    include: {
      stage: { include: { curriculum: true } },
      units: { where: { available: true }, orderBy: { number: "asc" }, select: { id: true, number: true, title: true } },
    },
    orderBy: [{ stage: { curriculum: { name: "asc" } } }, { stage: { number: "asc" } }, { name: "asc" }],
  });
  return subjects
    .filter((s) => s.units.length > 0)
    .map((s) => ({
      id: s.id,
      label: `${s.stage.curriculum.name} - ${s.stage.label} - ${s.name}`,
      units: s.units,
    }));
}

/** Resolves a career path's relatedUnitIds into real, linkable lesson info -
 * skips any id that no longer resolves (a unit hidden or removed) rather
 * than erroring, since this is a soft, best-effort link, not a hard FK. */
export async function getRelatedUnitsForCareerPath(unitIds: string[]) {
  if (unitIds.length === 0) return [];
  const units = await db.unit.findMany({
    where: { id: { in: unitIds }, available: true },
    select: { id: true, number: true, title: true, subject: { select: { name: true } } },
  });
  const byId = new Map(units.map((u) => [u.id, u]));
  return unitIds.map((id) => byId.get(id)).filter((u): u is NonNullable<typeof u> => Boolean(u));
}

export async function deleteCareerPath(id: string) {
  return db.careerPath.delete({ where: { id } });
}

export async function getAvailableCareerPaths() {
  return db.careerPath.findMany({
    where: { available: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export async function getAllCareerPaths() {
  return db.careerPath.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export async function getCareerInterestIdsForProfile(studentProfileId: string): Promise<Set<string>> {
  const rows = await db.careerInterest.findMany({
    where: { studentProfileId },
    select: { careerPathId: true },
  });
  return new Set(rows.map((r) => r.careerPathId));
}

export async function getCareerInterestsForProfile(studentProfileId: string) {
  return db.careerInterest.findMany({
    where: { studentProfileId },
    include: { careerPath: true },
    orderBy: { createdAt: "desc" },
  });
}

/** Best-effort guess at which grade band a profile currently sits in, used
 * only to highlight one band of a career path's roadmap by default - never
 * to gate content (that stays assignedStageId's job, set via /select).
 * Falls back to the assigned/enrolled Stage's number, then this app's only
 * real content today (Stage 4, i.e. "Grades 3-5"), since there's no hard
 * grade field on StudentProfile itself. */
export async function getLikelyGradeBand(studentProfileId: string): Promise<CareerGradeBand> {
  const profile = await db.studentProfile.findUnique({
    where: { id: studentProfileId },
    include: { assignedStage: true },
  });

  let stageNumber = profile?.assignedStage?.number;
  if (stageNumber === undefined) {
    const recentAttempt = await db.testAttempt.findFirst({
      where: { studentProfileId },
      orderBy: { takenAt: "desc" },
      include: { unit: { include: { subject: { include: { stage: true } } } } },
    });
    stageNumber = recentAttempt?.unit.subject.stage.number;
  }

  if (stageNumber === undefined) return "Grades 3-5";
  if (stageNumber <= 5) return "Grades 3-5";
  if (stageNumber <= 8) return "Grades 6-8";
  if (stageNumber <= 10) return "Grades 9-10";
  return "Grades 11-12";
}

/** Toggles a student's "I'm curious about this" mark - opt-in only, no
 * ranking, per the "not a forced learning" framing this feature started
 * from. Returns whether the path is now marked (true) or unmarked (false). */
export async function toggleCareerInterest(studentProfileId: string, careerPathId: string): Promise<boolean> {
  const existing = await db.careerInterest.findUnique({
    where: { studentProfileId_careerPathId: { studentProfileId, careerPathId } },
  });
  if (existing) {
    await db.careerInterest.delete({ where: { id: existing.id } });
    return false;
  }
  await db.careerInterest.create({ data: { studentProfileId, careerPathId } });
  return true;
}
