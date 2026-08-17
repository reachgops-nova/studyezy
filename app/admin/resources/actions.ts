"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";

export async function approveResource(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const id = String(formData.get("id") ?? "");
  const unitKey = String(formData.get("unitKey") ?? "");
  if (id) {
    await db.unitResource.update({
      where: { id },
      data: { status: "approved", approvedByUserId: admin.id, approvedAt: new Date() },
    });
  }
  redirect(`/admin/resources?unitKey=${unitKey}`);
}

// Also doubles as "remove" for an already-approved resource, not just
// rejecting a pending one - same effect either way, one less action to wire.
export async function rejectResource(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const id = String(formData.get("id") ?? "");
  const unitKey = String(formData.get("unitKey") ?? "");
  if (id) {
    await db.unitResource.delete({ where: { id } }).catch(() => {});
  }
  redirect(`/admin/resources?unitKey=${unitKey}`);
}
