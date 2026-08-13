import "server-only";
import { cookies } from "next/headers";
import { db } from "./db";
import { getCurrentUser } from "./session";
import type { StudentProfile, User } from "@prisma/client";

const ACTIVE_PROFILE_COOKIE = "studyezy_active_profile";

export async function requireUser(): Promise<User | null> {
  return getCurrentUser();
}

/**
 * The active kid profile for this browser session. Always re-validates that
 * the profile actually belongs to the logged-in user - the cookie value
 * alone is never trusted, since a signed-out or different account could
 * otherwise reuse a stale profile id.
 */
export async function getActiveProfile(): Promise<StudentProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const store = await cookies();
  const profileId = store.get(ACTIVE_PROFILE_COOKIE)?.value;
  if (!profileId) return null;

  const profile = await db.studentProfile.findUnique({ where: { id: profileId } });
  if (!profile || profile.userId !== user.id) return null;

  return profile;
}

export async function getActiveProfileId(): Promise<string | null> {
  const profile = await getActiveProfile();
  return profile?.id ?? null;
}

export async function setActiveProfile(profileId: string): Promise<void> {
  const store = await cookies();
  store.set(ACTIVE_PROFILE_COOKIE, profileId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearActiveProfile(): Promise<void> {
  const store = await cookies();
  store.delete(ACTIVE_PROFILE_COOKIE);
}

export const ACTIVE_PROFILE_COOKIE_NAME = ACTIVE_PROFILE_COOKIE;
