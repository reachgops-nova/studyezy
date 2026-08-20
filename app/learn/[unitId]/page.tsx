import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit, getUploadedPageImages } from "@/lib/content";
import { getUnitResourceGroupsByKey } from "@/lib/queries/unitResources";
import { FREEZABLE_TYPES } from "@/lib/unitResources";
import { isTrialActive, getPricingPlanForKid } from "@/lib/pricing";
import { LogoMark } from "@/components/Logo";
import UnitView from "@/components/UnitView";

export default async function LearnPage({ params }: { params: Promise<{ unitId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { unitId } = await params;
  const parts = unitId.split("-");
  if (parts.length !== 4) notFound();
  const [curriculumId, stageIdStr, subjectId, unitIdStr] = parts;
  const grade = Number(stageIdStr);
  const unit = await getUnit(curriculumId, grade, subjectId, Number(unitIdStr));
  if (!unit) notFound();

  // Admin accounts (the family running the pilot) are never gated - the
  // 30-day trial is a real product boundary for new families, not a
  // restriction on the account that operates this app. See lib/pricing.ts.
  if (user.role !== "admin" && !isTrialActive(user)) {
    const plan = await getPricingPlanForKid(curriculumId, grade);
    return (
      <main className="mx-auto grid w-full max-w-lg gap-6 py-12 text-center">
        <Link href="/select" className="mx-auto inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
          <LogoMark className="h-6 w-6" />
          StudyEzy
        </Link>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-soft">
          <h1 className="text-xl font-bold text-slate-800">Your free trial has ended</h1>
          <p className="mt-2 text-sm text-slate-600">
            {profile.displayName} learned with StudyEzy free for 30 days. To keep going with{" "}
            {unit.subject} - {unit.curriculum}, here&apos;s the price for this subject:
          </p>
          {plan ? (
            <p className="mt-4 text-3xl font-bold text-brand-navy">
              ₹{plan.pricePerSubjectInr}
              <span className="text-base font-medium text-slate-400"> / month</span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Pricing for this grade isn&apos;t set up yet - contact us and we&apos;ll sort it out.</p>
          )}
          <p className="mt-4 text-sm text-slate-500">
            Reply to the email you registered with, or reach out directly, and we&apos;ll get {profile.displayName}
            {" "}set up on a paid plan.
          </p>
        </div>
      </main>
    );
  }

  const pageImages = await getUploadedPageImages(unitId);
  const resourceGroups = (await getUnitResourceGroupsByKey(unitId)).filter((g) =>
    (FREEZABLE_TYPES as string[]).includes(g.type)
  );

  return (
    <main className="mx-auto grid w-full max-w-3xl gap-6">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/select" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
            <LogoMark className="h-6 w-6" />
            &larr; Change unit
          </Link>
          <h1 className="mt-2 text-2xl font-bold">
            Unit {unit.unit}: {unit.unit_title}
          </h1>
          <p className="text-sm text-slate-500">
            {unit.subject} - {unit.curriculum}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href={`/exam/${unitId}`}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Written exam practice
          </Link>
          <Link
            href={`/test/${unitId}`}
            className="rounded-xl border border-test-border bg-test-bg px-4 py-2 text-center text-sm font-medium text-test-accent"
          >
            Take Progression Test
          </Link>
        </div>
      </header>

      <UnitView unit={unit} unitKey={unitId} initialPageImages={pageImages} resourceGroups={resourceGroups} />
    </main>
  );
}
