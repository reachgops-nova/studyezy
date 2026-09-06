"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { consumePasswordResetToken } from "@/lib/passwordReset";
import { hashPassword } from "@/lib/password";

export async function completePasswordReset(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    redirect(`/reset-password/${token}?error=weak_password`);
  }

  const userId = await consumePasswordResetToken(token);
  if (!userId) {
    redirect(`/reset-password/${token}?error=invalid_token`);
  }

  await db.user.update({ where: { id: userId! }, data: { passwordHash: await hashPassword(password) } });

  redirect("/login?success=password_reset");
}
