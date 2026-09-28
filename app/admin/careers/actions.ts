"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/session";
import { createCareerPath, setCareerPathAvailability, deleteCareerPath } from "@/lib/careers";

function splitList(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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
