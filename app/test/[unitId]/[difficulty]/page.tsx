import { notFound, redirect } from "next/navigation";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit } from "@/lib/content";
import { getQuestionPaperByKey } from "@/lib/queries/questionPapers";
import { QUESTION_PAPER_DIFFICULTIES, type QuestionPaperDifficulty } from "@/lib/types";

function isDifficulty(value: string): value is QuestionPaperDifficulty {
  return (QUESTION_PAPER_DIFFICULTIES as string[]).includes(value);
}

// This page no longer renders anything itself - it's just the family-facing
// entry point that keeps the login/profile redirects and the "does this
// tier even exist" guard, then hands off to the pack-rendered test at
// [difficulty]/render (content/test-template.html - the same design system
// as reading/worksheets, see PLATFORM_PLAN.md's 2026-08-25 entry). Replaces
// the old <TestRunner> rendering path.
export default async function TestDifficultyPage({
  params,
  searchParams,
}: {
  params: Promise<{ unitId: string; difficulty: string }>;
  searchParams: Promise<{ mode?: string }>;
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

  // "Practice exam" (PLATFORM_PLAN.md's 2026-08-26 entry) reuses this exact
  // real progression-test pack/render path - the only difference is the
  // ?mode=practice flag, forwarded through so the client-side template and
  // /api/pack-test-attempts both know not to touch TestAttempt/ConceptMastery
  // for this attempt.
  const { mode } = await searchParams;
  const suffix = mode === "practice" ? "?mode=practice" : "";
  redirect(`/test/${unitId}/${difficulty}/render${suffix}`);
}
