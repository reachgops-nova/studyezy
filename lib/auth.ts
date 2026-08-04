import "server-only";
import { cookies } from "next/headers";
import type { DemoProfile } from "./types";

// Pilot-scale demo auth: no passwords, no real account system. A parent picks
// which of the 1-3 pilot kids is using the device. This intentionally avoids
// handling any real credentials - see PLATFORM_PLAN.md security notes.
export const DEMO_PROFILES: DemoProfile[] = [
  { id: "kid-1", display_name: "Learner 1", avatar_emoji: "🦊" },
  { id: "kid-2", display_name: "Learner 2", avatar_emoji: "🐼" },
  { id: "kid-3", display_name: "Learner 3", avatar_emoji: "🦁" },
];

const COOKIE_NAME = "studyezy_demo_profile";

export async function getActiveProfileId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return null;
  return DEMO_PROFILES.some((p) => p.id === value) ? value : null;
}

export async function getActiveProfile(): Promise<DemoProfile | null> {
  const id = await getActiveProfileId();
  return DEMO_PROFILES.find((p) => p.id === id) ?? null;
}

export const DEMO_PROFILE_COOKIE = COOKIE_NAME;
