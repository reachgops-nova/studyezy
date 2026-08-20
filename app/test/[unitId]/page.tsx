import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit } from "@/lib/content";
import { getQuestionPaperSummariesByKey } from "@/lib/queries/questionPapers";
import { LogoMark } from "@/components/Logo";
import type { QuestionPaperDifficulty } from "@/lib/types";

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

  return (
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
            }`}
          >
            <h2 className="font-semibold text-slate-800">{DIFFICULTY_LABELS[s.difficulty]}</h2>
            <p className="mt-1 text-xs text-slate-500">{DIFFICULTY_DESCRIPTIONS[s.difficulty]}</p>
            {s.available ? (
              <>
                <p className="mt-3 text-xs text-slate-400">{s.questionCount} questions</p>
                <Link
                  href={`/test/${unitId}/${s.difficulty}`}
                  className="mt-3 inline-block rounded-xl border border-test-border bg-test-bg px-4 py-2 text-center text-sm font-medium text-test-accent"
                >
                  Start
                </Link>
              </>
            ) : (
              <p className="mt-3 text-xs text-slate-400">Not ready yet - ask an admin to generate this tier.</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
