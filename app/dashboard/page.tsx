import { redirect } from "next/navigation";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getDashboardData } from "@/lib/queries/dashboard";
import AppHeader from "@/components/AppHeader";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const results = await getDashboardData(profile.id);

  return (
    <main className="grid gap-6">
      <AppHeader profile={profile} active="dashboard" />

      <h1 className="text-2xl font-bold">{profile.displayName}&apos;s progress</h1>

      <Dashboard results={results} />
    </main>
  );
}
