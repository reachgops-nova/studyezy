import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit } from "@/lib/content";
import { isTrialActive, getPricingPlanForKid } from "@/lib/pricing";
import { getQualifyingWorksheetAttempt, QUALIFYING_SCORE_PCT } from "@/lib/worksheetGate";
import { db } from "@/lib/db";
import { LogoMark } from "@/components/Logo";
import AppShell from "@/components/AppShell";

/**
 * Olympiad-mode unit home screen (Unit.contentMode === "olympiad") -
 * replaces the Learn/chat flow entirely: a list of fixed practice sets
 * (ContentPack rows, purpose "worksheet", difficulty "set1".."set4" - each
 * one transcribed from its own uploaded source document, not an AI-invented
 * variation, see the plan this was built from), then an exam section once
 * one set is passed at >=70%, reusing the exact same gate
 * app/test/[unitId]/page.tsx already uses.
 */
export default async function PracticePage({ params }: { params: Promise<{ unitId: string }> }) {
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

  const unitRow = await db.unit.findUnique({ where: { unitKey: unitId } });
  if (!unitRow) notFound();
  // A curriculum-mode unit has no reason to be here - send it back to its
  // real home rather than showing an empty practice-sets screen.
  if (unitRow.contentMode !== "olympiad") {
    redirect(`/learn/${unitId}`);
  }

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
            <p className="mt-4 text-3xl font-bold text-brand-ink">
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

  const practiceSets = await db.contentPack.findMany({
    where: { unitId: unitRow.id, purpose: "worksheet", difficulty: { startsWith: "set" } },
    orderBy: { difficulty: "asc" },
  });

  const qualifying = await getQualifyingWorksheetAttempt(profile.id, unitRow.id);

  return (
    <AppShell profile={profile} isAdmin={user.role === "admin"}>
      <main className="mx-auto grid w-full max-w-2xl gap-6">
        <header>
          <Link href="/select" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
            <LogoMark className="h-6 w-6" />
            &larr; Back to subjects
          </Link>
          <h1 className="mt-2 text-2xl font-bold">
            Unit {unit.unit}: {unit.unit_title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Practice sets first - score {QUALIFYING_SCORE_PCT}% or better on any one to unlock the exam.
          </p>
        </header>

        {practiceSets.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 text-center text-sm text-slate-500 shadow-soft">
            No practice sets are ready yet - ask an admin to convert this unit&apos;s material into a set.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {practiceSets.map((pack, i) => (
              <div key={pack.id} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
                <h2 className="font-semibold text-slate-800">Set {i + 1}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {pack.sheetsCount} sheet{pack.sheetsCount === 1 ? "" : "s"} · {pack.questionsCount} question
                  {pack.questionsCount === 1 ? "" : "s"}
                </p>
                <Link
                  href={`/learn/${unitId}/worksheet/${pack.packId}`}
                  className="mt-3 inline-block rounded-xl border border-test-border bg-test-bg px-4 py-2 text-center text-sm font-medium text-test-accent"
                >
                  Start
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-brand-ink/30 bg-brand-ink/5 p-4 shadow-soft">
          <h2 className="font-semibold text-slate-800">Exam</h2>
          {qualifying ? (
            <>
              <p className="mt-1 text-xs text-slate-500">
                Two independent exam sets are ready - real, original questions at real exam difficulty.
              </p>
              <Link
                href={`/test/${unitId}`}
                className="mt-3 inline-block rounded-xl border border-brand-ink bg-brand-ink px-4 py-2 text-center text-sm font-medium text-white"
              >
                Go to the exam
              </Link>
            </>
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              Score {QUALIFYING_SCORE_PCT}% or better on a practice set above to unlock the exam.
            </p>
          )}
        </div>
      </main>
    </AppShell>
  );
}
