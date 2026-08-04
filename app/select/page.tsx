import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { CATALOG } from "@/lib/catalog";
import CurriculumSelector from "@/components/CurriculumSelector";
import { signOut } from "@/app/login/actions";

export default async function SelectPage() {
  const profile = await getActiveProfile();
  if (!profile) redirect("/login");

  return (
    <main className="grid gap-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Signed in as</p>
          <p className="text-lg font-semibold">
            {profile.avatar_emoji} {profile.display_name}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
            Dashboard
          </Link>
          <form action={signOut}>
            <button type="submit" className="text-sm text-slate-500 hover:underline">
              Switch profile
            </button>
          </form>
        </div>
      </header>

      <div>
        <h1 className="text-2xl font-bold">What are we learning today?</h1>
        <p className="mt-1 text-slate-600">
          Content is unit-by-unit, matching what your class is currently covering - not the whole book at once.
        </p>
      </div>

      <CurriculumSelector catalog={CATALOG} />
    </main>
  );
}
