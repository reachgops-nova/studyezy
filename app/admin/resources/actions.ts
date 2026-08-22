"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";
import { clearAnswerCache } from "@/lib/answerCache";

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

// Sets (or clears, via an empty storageKey) which uploaded reference page
// shows as a concept's illustration - see getConceptImageAssignmentData.
// Empty selection reverts to the concept's original SVG icon, since
// AvatarChat only falls back to it when sourceImagePath is unset.
export async function assignConceptImage(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const conceptId = String(formData.get("conceptId") ?? "");
  const storageKey = String(formData.get("storageKey") ?? "").trim();
  const unitKey = String(formData.get("unitKey") ?? "");
  if (conceptId) {
    await db.concept.update({
      where: { id: conceptId },
      data: { sourceImagePath: storageKey ? `/api/uploads/${storageKey}` : null },
    });
  }
  redirect(`/admin/resources?unitKey=${unitKey}`);
}

// Operational safety valve for a wrong/stale cached answer (lib/answerCache.ts) -
// clears every cached AI answer for this unit, so the next matching
// question generates a fresh one instead of reusing a bad cache entry.
export async function clearUnitAnswerCache(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const unitKey = String(formData.get("unitKey") ?? "");
  if (unitKey) {
    await clearAnswerCache(unitKey);
  }
  redirect(`/admin/resources?unitKey=${unitKey}`);
}
