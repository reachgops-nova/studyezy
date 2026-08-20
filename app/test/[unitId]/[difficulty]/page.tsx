import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit } from "@/lib/content";
import { getQuestionPaperByKey } from "@/lib/queries/questionPapers";
import { QUESTION_PAPER_DIFFICULTIES, type QuestionPaperDifficulty } from "@/lib/types";
import { LogoMark } from "@/components/Logo";
import TestRunner from "@/components/TestRunner";

function isDifficulty(value: string): value is QuestionPaperDifficulty {
  return (QUESTION_PAPER_DIFFICULTIES as string[]).includes(value);
}

export default async function TestDifficultyPage({
  params,
}: {
  params: Promise<{ unitId: string; difficulty: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { unitId, difficulty: rawDifficulty } = await params;
  if (!isDifficulty(rawDifficulty)) notFound();
  const difficulty = rawDifficulty;

  const parts = unitId.split("-");
  if (parts.length !== 4) notFound();
  const [curriculumId, stageIdStr, subjectId, unitIdStr] = parts;
  const unit = await getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) notFound();

  const paper = await getQuestionPaperByKey(unitId, difficulty);
  if (!paper || paper.questions.length === 0) {
    redirect(`/test/${unitId}`);
  }

  return (
    <main className="mx-auto grid w-full max-w-3xl gap-6">
      <header>
        <Link
          href={`/test/${unitId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
        >
          <LogoMark className="h-6 w-6" />
          &larr; Choose a different level
        </Link>
        <h1 className="mt-2 text-2xl font-bold">
          Progression Test ({difficulty}) - Unit {unit.unit}: {unit.unit_title}
        </h1>
        {paper.note && <p className="mt-1 text-sm text-slate-500">{paper.note}</p>}
      </header>

      <TestRunner unit={unit} unitKey={unitId} questions={paper.questions} difficulty={difficulty} />
    </main>
  );
}
