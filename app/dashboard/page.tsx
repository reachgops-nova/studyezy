import { redirect } from "next/navigation";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getSubjectProgress } from "@/lib/queries/dashboard";
import AppShell from "@/components/AppShell";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const subjects = await getSubjectProgress(profile.id);

  return (
    <AppShell profile={profile} active="dashboard" isAdmin={user.role === "admin"}>
      <div>
        <h1 className="text-2xl font-bold">{profile.displayName}&apos;s progress</h1>
        <p className="mt-1 text-slate-600">Each subject, from where it started to where it stands now.</p>
      </div>

      <Dashboard subjects={subjects} />
    </AppShell>
  );
}
