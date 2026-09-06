"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";
import { createPasswordResetToken } from "@/lib/passwordReset";
import { sendEmail, isEmailConfigured } from "@/lib/email";
import { EMAIL_TEMPLATES, type EmailTemplateKey } from "@/lib/emailTemplates";

const APP_URL = process.env.APP_URL || "https://studyezy-production.up.railway.app";

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

  try {
    await db.user.delete({ where: { id: userId } });
  } catch (err) {
    console.error("deleteAccount failed", err);
    redirect("/admin?error=delete_failed");
  }

  redirect("/admin");
}

/**
 * Admin-triggered password reset (2026-09-06): the admin never sets or sees
 * the user's new password - it emails the user a one-time link instead
 * (lib/passwordReset.ts), the same secure pattern as a self-service "forgot
 * password" flow, just admin-initiated.
 */
export async function resetUserPassword(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const userId = String(formData.get("userId") ?? "");
  const target = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
  if (!target) {
    redirect("/admin?error=unknown_user");
  }

  if (!isEmailConfigured()) {
    redirect("/admin?error=email_not_configured");
  }

  const token = await createPasswordResetToken(target!.id);
  const resetUrl = `${APP_URL}/reset-password/${token}`;

  try {
    await sendEmail(
      target!.email,
      "Reset your StudyEzy password",
      `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#14243A;line-height:1.6;max-width:520px;margin:0 auto;">
        <p>Hi,</p>
        <p>An admin started a password reset for your StudyEzy account. Click below to set a new password - this link works once and expires in an hour.</p>
        <p><a href="${resetUrl}" style="display:inline-block;background:#14243A;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Set a new password</a></p>
        <p style="color:#7B8A9C;font-size:13px;">If you didn't expect this, you can safely ignore this email.</p>
      </div>`
    );
  } catch (err) {
    console.error("resetUserPassword email failed", err);
    redirect("/admin?error=email_send_failed");
  }

  redirect("/admin?success=reset_email_sent");
}

/** Admin-triggered templated email (welcome/follow-up/feedback/payment reminder/renewal) - see lib/emailTemplates.ts. */
export async function sendTemplatedEmail(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const userId = String(formData.get("userId") ?? "");
  const templateKey = String(formData.get("template") ?? "") as EmailTemplateKey;
  const target = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
  const template = EMAIL_TEMPLATES[templateKey];

  if (!target || !template) {
    redirect("/admin?error=unknown_user");
  }
  if (!isEmailConfigured()) {
    redirect("/admin?error=email_not_configured");
  }

  const studentName = String(formData.get("studentName") ?? "");
  const planName = String(formData.get("planName") ?? "");
  const priceInr = String(formData.get("priceInr") ?? "");

  try {
    await sendEmail(
      target!.email,
      template.subject,
      template.body({ studentName: studentName || undefined, planName: planName || undefined, priceInr: priceInr || undefined })
    );
  } catch (err) {
    console.error("sendTemplatedEmail failed", err);
    redirect("/admin?error=email_send_failed");
  }

  redirect("/admin?success=email_sent");
}
