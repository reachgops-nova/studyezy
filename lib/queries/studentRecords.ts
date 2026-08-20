import "server-only";
import { db } from "@/lib/db";
import { getDashboardData } from "./dashboard";
import { getPrepPlan } from "./prepPlanner";
import type { PrepPlanItem } from "./prepPlanner";
import type { StoredUnitResult } from "@/lib/types";
import type { StudentProfile, User } from "@prisma/client";

export interface StudentRecord {
  profile: StudentProfile;
  account: Pick<User, "email" | "phone" | "state" | "district">;
  unitResults: StoredUnitResult[];
  prepPlan: PrepPlanItem[];
}

/**
 * Everything admin needs to see about one kid in one place (2026-08-20:
 * "intelligence based dynamic needs") - reuses getDashboardData/getPrepPlan
 * exactly as the parent's own /dashboard and /plan already do (both are
 * already parameterized by profileId, not tied to the active session), so
 * this is pure aggregation, not new derivation logic or a new AI call.
 */
export async function getStudentRecord(profileId: string): Promise<StudentRecord | null> {
  const profile = await db.studentProfile.findUnique({
    where: { id: profileId },
    include: { user: { select: { email: true, phone: true, state: true, district: true } } },
  });
  if (!profile) return null;

  const [unitResults, prepPlan] = await Promise.all([getDashboardData(profileId), getPrepPlan(profileId)]);

  return { profile, account: profile.user, unitResults, prepPlan };
}
