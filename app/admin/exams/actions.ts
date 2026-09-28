"use server";

import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { respondToAccessRequest } from "@/lib/termExams";
import { db } from "@/lib/db";

export async function approveAccessRequest(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const requestId = String(formData.get("requestId") ?? "");
  if (requestId) {
    await respondToAccessRequest({ requestId, adminId: admin.id, approve: true });
  }
  redirect("/admin/exams");
}

export async function denyAccessRequest(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const requestId = String(formData.get("requestId") ?? "");
  if (requestId) {
    await respondToAccessRequest({ requestId, adminId: admin.id, approve: false });
  }
  redirect("/admin/exams");
}

export async function publishTermExamPaper(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const paperId = String(formData.get("paperId") ?? "");
  if (paperId) {
    await db.termExamPaper.update({ where: { id: paperId }, data: { status: "published" } });
  }
  redirect("/admin/exams");
}

export async function unpublishTermExamPaper(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const paperId = String(formData.get("paperId") ?? "");
  if (paperId) {
    await db.termExamPaper.update({ where: { id: paperId }, data: { status: "draft" } });
  }
  redirect("/admin/exams");
}
