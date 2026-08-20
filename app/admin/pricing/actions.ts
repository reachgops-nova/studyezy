"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";

// Every submitted field is named "price_<planId>" so one form can save the
// whole grid in a single round-trip rather than one form per cell.
export async function updatePricing(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const updates: { id: string; price: number }[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("price_")) continue;
    const id = key.slice("price_".length);
    const price = Number(value);
    if (!id || !Number.isFinite(price) || price < 0) continue;
    updates.push({ id, price: Math.round(price) });
  }

  await Promise.all(
    updates.map((u) =>
      db.pricingPlan.update({ where: { id: u.id }, data: { pricePerSubjectInr: u.price } }).catch(() => {})
    )
  );

  redirect("/admin/pricing?saved=1");
}
