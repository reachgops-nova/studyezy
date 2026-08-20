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

// Optional, family-level contact/location details (2026-08-20 decision) -
// never required, editable any time, never sent to any AI prompt. Kept as
// its own action (separate from per-kid fields below) since it writes to
// User, not StudentProfile.
export async function updateAccountDetails(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const phone = String(formData.get("phone") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();

  await db.user.update({
    where: { id: user.id },
    data: { phone: phone || null, state: state || null, district: district || null },
  });

  redirect("/profiles?saved=1");
}

// Optional, self-reported per-kid context - school, which curriculum board
// the family actually intends (independent of assignedStageId, which only
// ever points at real Cambridge content today), and which subjects they're
// enrolled in. Purely declarative - doesn't change what content a kid sees.
export async function updateProfileDetails(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profileId = String(formData.get("profileId") ?? "");
  const profile = await db.studentProfile.findUnique({ where: { id: profileId } });
  if (!profile || profile.userId !== user.id) {
    redirect("/profiles?error=unknown_profile");
  }

  const schoolName = String(formData.get("schoolName") ?? "").trim();
  const preferredCurriculumLabel = String(formData.get("preferredCurriculumLabel") ?? "").trim();
  const enrolledSubjectSlugs = formData.getAll("enrolledSubjectSlugs").map(String);

  await db.studentProfile.update({
    where: { id: profileId },
    data: {
      schoolName: schoolName || null,
      preferredCurriculumLabel: preferredCurriculumLabel || null,
      enrolledSubjectSlugs,
    },
  });

  redirect("/profiles?saved=1");
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
