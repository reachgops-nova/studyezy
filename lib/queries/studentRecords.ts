import "server-only";
import { db } from "@/lib/db";
import { getDashboardData, getSubjectProgress } from "./dashboard";
import type { SubjectProgress } from "./dashboard";
import { getPrepPlan } from "./prepPlanner";
import type { PrepPlanItem } from "./prepPlanner";
import type { StoredUnitResult } from "@/lib/types";
import type { StudentProfile, User } from "@prisma/client";

export interface StudentRecord {
  profile: StudentProfile;
  account: Pick<User, "email" | "phone" | "state" | "district">;
  unitResults: StoredUnitResult[];
  subjects: SubjectProgress[];
  prepPlan: PrepPlanItem[];
}

/**
 * Everything admin needs to see about one kid in one place (2026-08-20:
 * "intelligence based dynamic needs") - reuses getDashboardData/
 * getSubjectProgress/getPrepPlan exactly as the parent's own /dashboard and
 * /plan already do (all already parameterized by profileId, not tied to the
 * active session), so this is pure aggregation, not new derivation logic or
 * a new AI call. `subjects` is what actually renders (see
 * app/admin/students/[profileId]/page.tsx - "same breakdown the family sees
 * on their own dashboard"); `unitResults` stays for whatever else in this
 * codebase still reads the older per-unit shape.
 */
export async function getStudentRecord(profileId: string): Promise<StudentRecord | null> {
  const profile = await db.studentProfile.findUnique({
    where: { id: profileId },
    include: { user: { select: { email: true, phone: true, state: true, district: true } } },
  });
  if (!profile) return null;

  const [unitResults, subjects, prepPlan] = await Promise.all([
    getDashboardData(profileId),
    getSubjectProgress(profileId),
    getPrepPlan(profileId),
  ]);

  return { profile, account: profile.user, unitResults, subjects, prepPlan };
}
