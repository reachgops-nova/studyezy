import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getSubjectProgress } from "@/lib/queries/dashboard";
import { getCareerInterestsForProfile } from "@/lib/careers";
import AppShell from "@/components/AppShell";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const [subjects, careerInterests] = await Promise.all([
    getSubjectProgress(profile.id),
    getCareerInterestsForProfile(profile.id),
  ]);

  return (
    <AppShell profile={profile} active="dashboard" isAdmin={user.role === "admin"}>
      <div>
        <h1 className="text-2xl font-bold">{profile.displayName}&apos;s progress</h1>
        <p className="mt-1 text-slate-600">Each subject, from where it started to where it stands now.</p>
      </div>

      <Link
        href="/careers"
        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft transition hover:border-slate-300"
      >
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-800">Career explorer</h2>
          <p className="mt-1 text-sm text-slate-600">
            {careerInterests.length > 0
              ? `Curious about ${careerInterests.length} career path${careerInterests.length === 1 ? "" : "s"}: ${careerInterests
                  .slice(0, 3)
                  .map((i) => i.careerPath.name)
                  .join(", ")}${careerInterests.length > 3 ? ", and more" : ""}.`
              : "See what grown-ups in different jobs actually do, and which subjects help get there."}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-brand-ink px-3 py-1.5 text-xs font-medium text-white">Explore</span>
      </Link>

      <Dashboard subjects={subjects} />
    </AppShell>
  );
}
