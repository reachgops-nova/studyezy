import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getDashboardData } from "@/lib/queries/dashboard";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const results = await getDashboardData(profile.id);

  return (
    <main className="grid gap-6">
      <header>
        <Link href="/select" className="text-sm text-slate-500 hover:underline">
          &larr; Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold">
          {profile.avatarEmoji} {profile.displayName}&apos;s progress
        </h1>
      </header>

      <Dashboard results={results} />
    </main>
  );
}
