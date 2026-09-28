import "server-only";
import { db } from "./db";

export interface CareerPathInput {
  name: string;
  category: string;
  summary: string;
  dayInLife?: string;
  keySkills: string[];
  relatedSubjectSlugs: string[];
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
      createdByUserId: input.createdByUserId,
    },
  });
}

export async function setCareerPathAvailability(id: string, available: boolean) {
  return db.careerPath.update({ where: { id }, data: { available } });
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
