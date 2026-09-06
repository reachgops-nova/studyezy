import "server-only";

export type EmailTemplateKey = "welcome" | "followup" | "feedback" | "payment_reminder" | "renewal";

export interface EmailTemplatePlaceholders {
  parentName?: string;
  studentName?: string;
  planName?: string;
  priceInr?: string;
}

export interface EmailTemplateDef {
  label: string;
  subject: string;
  body: (p: EmailTemplatePlaceholders) => string;
}

const wrap = (inner: string) =>
  `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#14243A;line-height:1.6;max-width:520px;margin:0 auto;">${inner}<p style="margin-top:24px;color:#7B8A9C;font-size:13px;">- The StudyEzy team</p></div>`;

// Kept as plain hardcoded templates rather than a DB-backed model for now -
// admin picks one and sends; a future pass can make these editable/schedulable
// (explicitly deferred by the user - "later we can schedule").
export const EMAIL_TEMPLATES: Record<EmailTemplateKey, EmailTemplateDef> = {
  welcome: {
    label: "Welcome",
    subject: "Welcome to StudyEzy!",
    body: (p) =>
      wrap(
        `<p>Hi ${p.parentName || "there"},</p>` +
          `<p>Welcome to StudyEzy! ${p.studentName ? `${p.studentName} is` : "You're"} all set up and ready to start learning - real lessons, practice, and tests, all in one place.</p>` +
          `<p>If anything's unclear or you'd like a hand getting started, just reply to this email.</p>`
      ),
  },
  followup: {
    label: "Follow-up",
    subject: "How's it going so far?",
    body: (p) =>
      wrap(
        `<p>Hi ${p.parentName || "there"},</p>` +
          `<p>Just checking in - how has ${p.studentName ? `${p.studentName}'s` : "your"} experience with StudyEzy been so far? We'd love to hear how things are going, or help with anything that's not working the way you'd expect.</p>`
      ),
  },
  feedback: {
    label: "Get feedback",
    subject: "A quick favor - what do you think of StudyEzy?",
    body: (p) =>
      wrap(
        `<p>Hi ${p.parentName || "there"},</p>` +
          `<p>We're always trying to make StudyEzy better. Would you mind sharing a quick thought on what's working well for ${p.studentName || "your child"}, and what isn't? Just reply to this email - we read every response.</p>`
      ),
  },
  payment_reminder: {
    label: "Payment reminder",
    subject: "A quick reminder about your StudyEzy subscription",
    body: (p) =>
      wrap(
        `<p>Hi ${p.parentName || "there"},</p>` +
          `<p>This is a friendly reminder that payment is due for ${p.studentName ? `${p.studentName}'s` : "your"} StudyEzy subscription${p.planName ? ` (${p.planName})` : ""}${p.priceInr ? ` - ₹${p.priceInr}/month` : ""}.</p>` +
          `<p>Reply to this email and we'll help you get it sorted.</p>`
      ),
  },
  renewal: {
    label: "Renewal",
    subject: "Time to renew your StudyEzy plan",
    body: (p) =>
      wrap(
        `<p>Hi ${p.parentName || "there"},</p>` +
          `<p>${p.studentName ? `${p.studentName}'s` : "Your"} current StudyEzy plan${p.planName ? ` (${p.planName})` : ""} is coming up for renewal. Reply to this email whenever you're ready to continue, and we'll take care of it.</p>`
      ),
  },
};
