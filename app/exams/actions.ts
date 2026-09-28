"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { requestAnswerKeyAccess } from "@/lib/termExams";

export async function requestAnswerKey(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();

  const paperId = String(formData.get("paperId") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (paperId) {
    await requestAnswerKeyAccess({
      paperId,
      requestedByUserId: user.id,
      studentProfileId: profile?.id,
      note: note || undefined,
    });
  }
  redirect(`/exams/${paperId}`);
}
