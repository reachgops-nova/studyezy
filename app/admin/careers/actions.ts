"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/session";
import { createCareerPath, setCareerPathAvailability, deleteCareerPath, CAREER_GRADE_BANDS } from "@/lib/careers";
import type { CareerGradeGuidance } from "@/lib/careers";

function splitList(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitLines(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function readGradeGuidance(formData: FormData): CareerGradeGuidance[] {
  const guidance: CareerGradeGuidance[] = [];
  for (const band of CAREER_GRADE_BANDS) {
    const focus = String(formData.get(`focus_${band}`) ?? "").trim();
    const activities = splitLines(formData.get(`activities_${band}`));
    if (focus || activities.length > 0) {
      guidance.push({ band, focus, activities });
    }
  }
  return guidance;
}

export async function addCareerPath(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const dayInLife = String(formData.get("dayInLife") ?? "").trim();
  if (!name || !category || !summary) {
    throw new Error("Name, category, and summary are required.");
  }

  await createCareerPath({
    name,
    category,
    summary,
    dayInLife: dayInLife || undefined,
    keySkills: splitList(formData.get("keySkills")),
    relatedSubjectSlugs: splitList(formData.get("relatedSubjectSlugs")),
    gradeGuidance: readGradeGuidance(formData),
    createdByUserId: admin.id,
  });
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
}

export async function toggleCareerPathAvailability(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const id = String(formData.get("id") ?? "");
  const available = formData.get("available") === "true";
  if (id) {
    await setCareerPathAvailability(id, available);
    revalidatePath("/admin/careers");
    revalidatePath("/careers");
  }
}

export async function removeCareerPath(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteCareerPath(id);
    revalidatePath("/admin/careers");
    revalidatePath("/careers");
  }
}
