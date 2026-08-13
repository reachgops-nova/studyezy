import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import AppHeader from "@/components/AppHeader";
import { getActiveProfile } from "@/lib/auth";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { toggleAdminRole, deleteAccount } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  cannot_change_self: "You can't change or delete your own account from here.",
  unknown_user: "That account wasn't found - it may have already been removed.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const { error } = await searchParams;
  const profile = await getActiveProfile();

  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { studentProfiles: true, _count: { select: { studentProfiles: true } } },
  });

  return (
    <main className="grid gap-6">
      {profile && <AppHeader profile={profile} active="admin" isAdmin />}

      <div>
        <h1 className="text-2xl font-bold">Manage accounts</h1>
        <p className="mt-1 text-slate-600">
          Every registered account and the kid profiles under it. Admin-only.
        </p>
      </div>

      {error && ERROR_MESSAGES[error] && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{ERROR_MESSAGES[error]}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Kids</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {u.email}
                  {u.id === admin.id && <span className="ml-2 text-xs text-slate-400">(you)</span>}
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
                  {u.studentProfiles.map((p) => `${p.avatarEmoji} ${p.displayName}`).join(", ") || "-"}
                </td>
                <td className="px-4 py-3 text-slate-500">{u.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {u.id !== admin.id && (
                    <div className="flex gap-2">
                      <form action={toggleAdminRole}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          {u.role === "admin" ? "Remove admin" : "Make admin"}
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
