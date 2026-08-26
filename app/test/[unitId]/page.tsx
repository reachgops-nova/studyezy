import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit } from "@/lib/content";
import { getQuestionPaperSummariesByKey } from "@/lib/queries/questionPapers";
import { db } from "@/lib/db";
import { getQualifyingWorksheetAttempt } from "@/lib/worksheetGate";
import { recommendedDifficulty } from "@/lib/adaptiveDifficulty";
import { LogoMark } from "@/components/Logo";
import AppShell from "@/components/AppShell";
import type { QuestionPaperDifficulty } from "@/lib/types";
import { startTerminalTest } from "@/app/test/actions";

const DIFFICULTY_LABELS: Record<QuestionPaperDifficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  tough: "Tough",
};

const DIFFICULTY_DESCRIPTIONS: Record<QuestionPaperDifficulty, string> = {
  easy: "Mostly multiple-choice, simple wording - a confidence-building warm-up.",
  moderate: "The standard mix - a fair check of what you've learned.",
  tough: "More short-answer, less scaffolding - for when you want a real challenge.",
};

export default async function TestPage({ params }: { params: Promise<{ unitId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { unitId } = await params;
  const parts = unitId.split("-");
  if (parts.length !== 4) notFound();
  const [curriculumId, stageIdStr, subjectId, unitIdStr] = parts;
  const unit = await getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) notFound();

  const summaries = await getQuestionPaperSummariesByKey(unitId);

  // Confidence gate + cross-unit adaptive difficulty (PLATFORM_PLAN.md's
  // 2026-08-24 entry): a unit the student has never tested on is "new" -
  // locked behind a qualifying worksheet practice attempt first. Once
  // unlocked (or for a unit they've already tested on before), the tier
  // that best matches how far they've progressed past this unit is
  // recommended, not force-selected - a student can still pick any tier.
  const unitRow = await db.unit.findUnique({ where: { unitKey: unitId } });
  let locked = false;
  let recommended: QuestionPaperDifficulty = "easy";
  let completedUnitsInSubject = 0;
  if (unitRow) {
    const priorAttempts = await db.testAttempt.count({ where: { studentProfileId: profile.id, unitId: unitRow.id } });
    if (priorAttempts === 0) {
      const qualifying = await getQualifyingWorksheetAttempt(profile.id, unitRow.id);
      locked = !qualifying;
    }
    recommended = await recommendedDifficulty(profile.id, unitRow);

    // Only worth offering a cumulative terminal test once there's more than
    // one unit to cumulate - with a single tested unit it would just
    // duplicate the progression test above (see lib/terminalTest.ts).
    const testedUnits = await db.testAttempt.findMany({
      where: { studentProfileId: profile.id, unit: { subjectId: unitRow.subjectId } },
      select: { unitId: true },
      distinct: ["unitId"],
    });
    completedUnitsInSubject = testedUnits.length;
  }

  if (locked) {
    return (
      <AppShell profile={profile} isAdmin={user.role === "admin"}>
        <main className="mx-auto grid w-full max-w-2xl gap-6">
          <header>
            <Link
              href={`/learn/${unitId}`}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
            >
              <LogoMark className="h-6 w-6" />
              &larr; Back to unit
            </Link>
            <h1 className="mt-2 text-2xl font-bold">
              Progression Test - Unit {unit.unit}: {unit.unit_title}
            </h1>
          </header>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 text-center shadow-soft">
            <p className="text-sm text-slate-600">
              This is a new unit - practise the worksheet first (70% or better) to unlock the test.
            </p>
            <Link
              href={`/learn/${unitId}`}
              className="mt-4 inline-block rounded-xl bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white"
            >
              Go practise the worksheet
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell profile={profile} isAdmin={user.role === "admin"}>
    <main className="mx-auto grid w-full max-w-2xl gap-6">
      <header>
        <Link
          href={`/learn/${unitId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
        >
          <LogoMark className="h-6 w-6" />
          &larr; Back to unit
        </Link>
        <h1 className="mt-2 text-2xl font-bold">
          Progression Test - Unit {unit.unit}: {unit.unit_title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Choose your challenge - you can always try another level later.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {summaries.map((s) => (
          <div
            key={s.difficulty}
            className={`rounded-2xl border p-4 shadow-soft ${
              s.available ? "border-slate-200/70 bg-white" : "border-slate-200/70 bg-slate-50"
            } ${s.difficulty === recommended ? "ring-2 ring-brand-ink" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-slate-800">{DIFFICULTY_LABELS[s.difficulty]}</h2>
              {s.difficulty === recommended && (
                <span className="rounded-full bg-brand-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                  Suggested
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">{DIFFICULTY_DESCRIPTIONS[s.difficulty]}</p>
            {s.available ? (
              <>
                <p className="mt-3 text-xs text-slate-400">{s.questionCount} questions</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/test/${unitId}/${s.difficulty}`}
                    className="inline-block rounded-xl border border-test-border bg-test-bg px-4 py-2 text-center text-sm font-medium text-test-accent"
                  >
                    Start
                  </Link>
                  <Link
                    href={`/test/${unitId}/${s.difficulty}?mode=practice`}
                    className="inline-block rounded-xl border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-600"
                    title="Same real questions, but it won't affect your progress - a dry run before the real test."
                  >
                    Practice exam
                  </Link>
                </div>
              </>
            ) : (
              <p className="mt-3 text-xs text-slate-400">Not ready yet - ask an admin to generate this tier.</p>
            )}
          </div>
        ))}
      </div>

      {unitRow && completedUnitsInSubject >= 2 && (
        <div className="rounded-2xl border border-brand-ink/30 bg-brand-ink/5 p-4 shadow-soft">
          <h2 className="font-semibold text-slate-800">Terminal test</h2>
          <p className="mt-1 text-xs text-slate-500">
            A cumulative test across all {completedUnitsInSubject} units you&apos;ve covered so far in this subject -
            a real check of everything, not just this unit.
          </p>
          <form action={startTerminalTest.bind(null, unitRow.subjectId)} className="mt-3">
            <button
              type="submit"
              className="inline-block rounded-xl border border-brand-ink bg-brand-ink px-4 py-2 text-center text-sm font-medium text-white"
            >
              Start terminal test
            </button>
          </form>
        </div>
      )}
    </main>
    </AppShell>
  );
}
