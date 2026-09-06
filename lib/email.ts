import "server-only";

// Resend (resend.com) - chosen for its simple REST API (no heavyweight SDK
// needed, same raw-fetch convention this app already uses for
// OpenRouter/Gemini), a real free tier, and no requirement to stand up SMTP.
//
// Real operational constraint, not a code limitation: Resend restricts an
// account with no verified sending domain to only deliver to the account
// owner's own email address (a spam-prevention measure every transactional
// email provider applies in some form). Sending real welcome/reminder emails
// to actual parents/students needs a verified domain added in the Resend
// dashboard - until then, RESEND_FROM_EMAIL should stay on the sandbox
// address and test sends should target only the account owner's inbox.
const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "StudyEzy <onboarding@resend.dev>";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error("Email isn't configured - add RESEND_API_KEY.");
  }
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`Email send failed (${res.status}): ${bodyText.slice(0, 500)}`);
  }
}
