import { redirect } from "next/navigation";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getDashboardData } from "@/lib/queries/dashboard";
import AppShell from "@/components/AppShell";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const results = await getDashboardData(profile.id);

  return (
    <AppShell profile={profile} active="dashboard" isAdmin={user.role === "admin"}>
      <h1 className="text-2xl font-bold">{profile.displayName}&apos;s progress</h1>

      <Dashboard results={results} />
    </AppShell>
  );
}
