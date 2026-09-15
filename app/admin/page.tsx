import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import AppShell from "@/components/AppShell";
import { getActiveProfile } from "@/lib/auth";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { isEmailConfigured } from "@/lib/email";
import { EMAIL_TEMPLATES } from "@/lib/emailTemplates";
import { toggleAdminRole, deleteAccount, resetUserPassword, sendTemplatedEmail } from "./actions";
import { presenceFromSessions, formatAgo, PRESENCE_STYLES, PRESENCE_DOTS } from "@/lib/presence";

const ERROR_MESSAGES: Record<string, string> = {
  cannot_change_self: "You can't change or delete your own account from here.",
  unknown_user: "That account wasn't found - it may have already been removed.",
  delete_failed: "Couldn't delete that account - please try again.",
  email_not_configured: "Email isn't set up yet - add RESEND_API_KEY.",
  email_send_failed: "Couldn't send that email - please try again.",
};

const SUCCESS_MESSAGES: Record<string, string> = {
  reset_email_sent: "Password reset email sent.",
  email_sent: "Email sent.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const { error, success } = await searchParams;
  const emailReady = isEmailConfigured();
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      studentProfiles: true,
      _count: { select: { studentProfiles: true } },
      // Sessions carry the activity signal: createdAt is a sign-in, and
      // lastSeenAt is stamped while someone is actually making requests.
      sessions: { select: { createdAt: true, expiresAt: true, lastSeenAt: true } },
    },
  });

  const now = new Date();
  const rows = users.map((u) => ({ user: u, presence: presenceFromSessions(u.sessions, now) }));
  const onlineNow = rows.filter((r) => r.presence.state === "online").length;
  const activeToday = rows.filter((r) => r.presence.state === "online" || r.presence.state === "today").length;
  const signedIn = rows.filter((r) => r.presence.liveSessions > 0).length;
  const neverSignedIn = rows.filter((r) => r.presence.state === "never").length;

  return (
    <AppShell profile={profile} active="admin" isAdmin>

      <div>
        <h1 className="text-2xl font-bold">Manage accounts</h1>
        <p className="mt-1 text-slate-600">
          Every registered account and the kid profiles under it. Admin-only.
        </p>
      </div>

      {error && ERROR_MESSAGES[error] && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{ERROR_MESSAGES[error]}</p>
      )}
      {success && SUCCESS_MESSAGES[success] && (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">{SUCCESS_MESSAGES[success]}</p>
      )}
      {!emailReady && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Email isn&apos;t configured yet - password reset and templated emails below won&apos;t send until
          RESEND_API_KEY is set.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Online now", value: onlineNow, hint: "seen in the last 5 minutes", tone: "text-green-700" },
          { label: "Active today", value: activeToday, hint: "seen in the last 24 hours", tone: "text-emerald-700" },
          { label: "Signed in", value: signedIn, hint: "has a session that has not expired", tone: "text-slate-700" },
          { label: "Never signed in", value: neverSignedIn, hint: "registered but never used", tone: "text-slate-500" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className={`text-2xl font-bold tabular-nums ${c.tone}`}>{c.value}</p>
            <p className="text-sm font-medium text-slate-700">{c.label}</p>
            <p className="text-xs text-slate-400">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last sign-in</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Kids</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ user: u, presence }) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {u.email}
                  {u.id === admin.id && <span className="ml-2 text-xs text-slate-400">(you)</span>}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${PRESENCE_STYLES[presence.state]}`}
                    title={presence.lastSeenAt ? `Last seen ${presence.lastSeenAt.toLocaleString()}` : "No sign-in recorded"}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${PRESENCE_DOTS[presence.state]}`} />
                    {presence.label}
                  </span>
                  {presence.liveSessions > 1 && (
                    <span className="ml-1.5 text-xs text-slate-400">{presence.liveSessions} sessions</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {presence.lastSignInAt ? formatAgo(now.getTime() - presence.lastSignInAt.getTime()) : "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {u.studentProfiles.length === 0 ? (
                    "-"
                  ) : (
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {u.studentProfiles.map((p) => (
                        <a
                          key={p.id}
                          href={`/admin/students/${p.id}`}
                          className="rounded-full border border-slate-200 px-2 py-0.5 text-xs hover:bg-slate-50"
                        >
                          {p.avatarEmoji} {p.displayName}
                        </a>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{u.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {u.id !== admin.id && (
                    <div className="grid gap-2">
                      <div className="flex flex-wrap gap-2">
                        <form action={toggleAdminRole}>
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            {u.role === "admin" ? "Remove admin" : "Make admin"}
                          </button>
                        </form>
                        <form action={resetUserPassword}>
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            disabled={!emailReady}
                            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                          >
                            Reset password
                          </button>
                        </form>
                        <form action={deleteAccount}>
                          <input type="hidden" name="userId" value={u.id} />
                          <ConfirmSubmitButton
                            confirmMessage={`Delete ${u.email} and all their data? This can't be undone.`}
                            className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                      <details className="text-xs">
                        <summary className="cursor-pointer font-medium text-slate-600">Send email</summary>
                        <form action={sendTemplatedEmail} className="mt-2 grid gap-1.5 rounded-lg border border-slate-200 p-2">
                          <input type="hidden" name="userId" value={u.id} />
                          <select name="template" required className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                            {Object.entries(EMAIL_TEMPLATES).map(([key, t]) => (
                              <option key={key} value={key}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            name="studentName"
                            placeholder="Student name (optional)"
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                          />
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              name="planName"
                              placeholder="Plan (optional)"
                              className="w-1/2 rounded-md border border-slate-300 px-2 py-1 text-xs"
                            />
                            <input
                              type="text"
                              name="priceInr"
                              placeholder="Price ₹ (optional)"
                              className="w-1/2 rounded-md border border-slate-300 px-2 py-1 text-xs"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={!emailReady}
                            className="justify-self-start rounded-md bg-brand-ink px-2.5 py-1 text-xs font-medium text-white disabled:opacity-40"
                          >
                            Send
                          </button>
                        </form>
                      </details>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
