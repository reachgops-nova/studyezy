"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { setActiveProfile } from "@/lib/auth";

const AVATAR_EMOJIS = ["🦊", "🐼", "🦁", "🐨", "🐯", "🦉"];

export async function selectProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profileId = String(formData.get("profileId") ?? "");
  const profile = await db.studentProfile.findUnique({ where: { id: profileId } });
  if (!profile || profile.userId !== user.id) {
    redirect("/profiles?error=unknown_profile");
  }

  await setActiveProfile(profileId);
  redirect("/select");
}

export async function setAssignedStage(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profileId = String(formData.get("profileId") ?? "");
  const profile = await db.studentProfile.findUnique({ where: { id: profileId } });
  if (!profile || profile.userId !== user.id) {
    redirect("/profiles?error=unknown_profile");
  }

  // Empty selection means "clear the override, browse normally" - not an
  // error, since that's a valid choice (go back to picking freely).
  const stageId = String(formData.get("stageId") ?? "").trim();
  if (stageId) {
    const stage = await db.stage.findUnique({ where: { id: stageId } });
    if (!stage || !stage.available) {
      redirect("/profiles?error=unknown_stage");
    }
  }

  await db.studentProfile.update({
    where: { id: profileId },
    data: { assignedStageId: stageId || null },
  });

  redirect("/profiles");
}

export async function addProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!displayName) {
    redirect("/profiles?error=missing_name");
  }

  const profile = await db.studentProfile.create({
    data: {
      userId: user.id,
      displayName,
      avatarEmoji: AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
    },
  });

  await setActiveProfile(profile.id);
  redirect("/select");
}
