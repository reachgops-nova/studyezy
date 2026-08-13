import { redirect } from "next/navigation";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getCatalog } from "@/lib/catalog";
import AppHeader from "@/components/AppHeader";
import CurriculumSelector from "@/components/CurriculumSelector";

export default async function SelectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const catalog = await getCatalog();

  return (
    <main className="grid gap-8">
      <AppHeader profile={profile} active="select" isAdmin={user.role === "admin"} />

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
