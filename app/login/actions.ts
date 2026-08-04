"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_PROFILES, DEMO_PROFILE_COOKIE } from "@/lib/auth";

export async function selectProfile(formData: FormData) {
  const profileId = formData.get("profileId");
  if (typeof profileId !== "string" || !DEMO_PROFILES.some((p) => p.id === profileId)) {
    throw new Error("Unknown profile.");
  }

  const store = await cookies();
  store.set(DEMO_PROFILE_COOKIE, profileId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/select");
}

export async function signOut() {
  const store = await cookies();
  store.delete(DEMO_PROFILE_COOKIE);
  redirect("/login");
}
