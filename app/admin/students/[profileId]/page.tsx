import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getStudentRecord } from "@/lib/queries/studentRecords";
import AppShell from "@/components/AppShell";
import Dashboard from "@/components/Dashboard";

export default async function AdminStudentPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const activeProfile = await getActiveProfile();
  if (!activeProfile) redirect("/profiles");

  const { profileId } = await params;
  const record = await getStudentRecord(profileId);
  if (!record) notFound();

  const { profile, account, unitResults, prepPlan } = record;

  return (
    <AppShell profile={activeProfile} active="admin" isAdmin>
      <div>
        <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
          &larr; Manage accounts
        </Link>
        <h1 className="mt-2 text-2xl font-bold">
          {profile.avatarEmoji} {profile.displayName}
        </h1>
        <p className="mt-1 text-slate-600">{account.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <h2 className="font-semibold text-slate-800">Profile</h2>
          <dl className="mt-2 grid gap-1.5 text-sm">
            <Row label="School" value={profile.schoolName} />
            <Row label="Curriculum board" value={profile.preferredCurriculumLabel} />
            <Row
              label="Enrolled subjects"
              value={profile.enrolledSubjectSlugs.length ? profile.enrolledSubjectSlugs.join(", ") : null}
            />
            <Row label="Joined" value={profile.createdAt.toLocaleDateString()} />
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <h2 className="font-semibold text-slate-800">Contact</h2>
          <dl className="mt-2 grid gap-1.5 text-sm">
            <Row label="Phone" value={account.phone} />
            <Row label="State" value={account.state} />
            <Row label="District" value={account.district} />
          </dl>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800">Progress</h2>
        <p className="mt-1 text-sm text-slate-500">Same breakdown the family sees on their own dashboard.</p>
        <div className="mt-3">
          <Dashboard results={unitResults} />
        </div>
      </div>

      <div>
<h2 className="text-lg font-semibold text-slate-800">Current improvement plan</h2>
<p className="mt-1 text-sm text-slate-500">
  The same &quot;worth 20 minutes this week&quot; list this kid sees on Prep Plan.
</p>        {prepPlan.length === 0 ? (
          <p className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Nothing urgent right now - either everything&apos;s mastered, or there&apos;s no test history yet.
          </p>
        ) : (
          <div className="mt-3 grid gap-3">
            {prepPlan.map((item) => (
              <div key={item.conceptId} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
                <span
                  className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    item.band === "needs_reteach" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.band === "needs_reteach" ? "Needs reteach" : "Needs brush-up"}
                </span>
                <p className="font-medium text-slate-800">
                  {item.conceptKey} {item.conceptName}
                </p>
                <p className="text-xs text-slate-400">{item.unitTitle}</p>
                <p className="mt-1 text-sm text-slate-600">{item.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right text-slate-700">{value ?? <span className="text-slate-300">Not set</span>}</dd>
    </div>
  );
}
