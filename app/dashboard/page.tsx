import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const profile = await getActiveProfile();
  if (!profile) redirect("/login");

  return (
    <main className="grid gap-6">
      <header>
        <Link href="/select" className="text-sm text-slate-500 hover:underline">
          &larr; Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold">
          {profile.avatar_emoji} {profile.display_name}&apos;s progress
        </h1>
      </header>

      <Dashboard profileId={profile.id} />
    </main>
  );
}
