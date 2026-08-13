"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { setActiveProfile } from "@/lib/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATAR_EMOJIS = ["🦊", "🐼", "🦁", "🐨", "🐯", "🦉"];

export async function register(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const kidName = String(formData.get("kidName") ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    redirect("/register?error=invalid_email");
  }
  if (password.length < 8) {
    redirect("/register?error=weak_password");
  }
  if (!kidName) {
    redirect("/register?error=missing_kid_name");
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/register?error=email_taken");
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      studentProfiles: {
        create: {
          displayName: kidName,
          avatarEmoji: AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
        },
      },
    },
    include: { studentProfiles: true },
  });

  await createSession(user.id);
  await setActiveProfile(user.studentProfiles[0].id);

  redirect("/select");
}
