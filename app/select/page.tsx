import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getCatalog } from "@/lib/catalog";
import CurriculumSelector from "@/components/CurriculumSelector";

export default async function SelectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const catalog = await getCatalog();

  return (
    <main className="grid gap-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Signed in as</p>
          <p className="text-lg font-semibold">
            {profile.avatarEmoji} {profile.displayName}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
            Dashboard
          </Link>
          <Link href="/manage" className="text-sm font-medium text-blue-600 hover:underline">
            + Add subject or unit
          </Link>
          <Link href="/profiles" className="text-sm text-slate-500 hover:underline">
            Switch profile
          </Link>
        </div>
      </header>

      <div>
        <h1 className="text-2xl font-bold">What are we learning today?</h1>
        <p className="mt-1 text-slate-600">
          Content is unit-by-unit, matching what your class is currently covering - not the whole book at once.
        </p>
      </div>

      <CurriculumSelector catalog={catalog} />
    </main>
  );
}
