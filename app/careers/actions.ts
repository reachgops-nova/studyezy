"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { toggleCareerInterest } from "@/lib/careers";

export async function markCareerInterest(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const careerPathId = String(formData.get("careerPathId") ?? "");
  if (careerPathId) {
    await toggleCareerInterest(profile.id, careerPathId);
    revalidatePath("/careers");
    revalidatePath("/dashboard");
  }
}
