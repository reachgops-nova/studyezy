import { redirect } from "next/navigation";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getCatalog, getStageRef } from "@/lib/catalog";
import AppShell from "@/components/AppShell";
import CurriculumSelector from "@/components/CurriculumSelector";

export default async function SelectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const [catalog, assignedStageRef] = await Promise.all([
    getCatalog(),
    profile.assignedStageId ? getStageRef(profile.assignedStageId) : Promise.resolve(null),
  ]);

  return (
    <AppShell profile={profile} active="select" isAdmin={user.role === "admin"}>
      <div>
        <h1 className="text-2xl font-bold">What are we learning today?</h1>
        <p className="mt-1 text-slate-600">
          Content is unit-by-unit, matching what your class is currently covering - not the whole book at once.
        </p>
        {assignedStageRef && (
          <p className="mt-1 text-sm text-brand-navy">
            Starting on {profile.displayName}&apos;s assigned book - change it anytime from{" "}
            <a href="/profiles" className="underline">
              profiles
            </a>
            , or just pick a different curriculum/stage below.
          </p>
        )}
      </div>

      <CurriculumSelector
        catalog={catalog}
        defaultCurriculumId={assignedStageRef?.curriculumSlug}
        defaultStageId={assignedStageRef?.stageNumber}
      />
    </AppShell>
  );
}
