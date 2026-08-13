"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";

export async function toggleAdminRole(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const userId = String(formData.get("userId") ?? "");
  if (!userId || userId === admin.id) {
    redirect("/admin?error=cannot_change_self");
  }

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) {
    redirect("/admin?error=unknown_user");
  }

  await db.user.update({
    where: { id: userId },
    data: { role: target.role === "admin" ? "parent" : "admin" },
  });

  redirect("/admin");
}

export async function deleteAccount(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const userId = String(formData.get("userId") ?? "");
  if (!userId || userId === admin.id) {
    redirect("/admin?error=cannot_change_self");
  }

  await db.user.delete({ where: { id: userId } }).catch(() => {});

  redirect("/admin");
}
