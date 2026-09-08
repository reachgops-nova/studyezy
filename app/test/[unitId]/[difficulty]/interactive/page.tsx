import { notFound, redirect } from "next/navigation";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit } from "@/lib/content";
import { getOrCreateProgressionTestPack } from "@/lib/testPacks";
import { db } from "@/lib/db";
import { OLYMPIAD_EXAM_SETS, type QuestionPaperDifficulty } from "@/lib/types";
import AppShell from "@/components/AppShell";
import OlympiadExamPlayer from "@/components/OlympiadExamPlayer";

// Real user request 2026-09-08: an Olympiad exam set should feel
// interactive - one question at a time, a wrong answer discussed
// immediately, understood before moving on - not the traditional
// answer-everything-then-submit-once flow (content/test-template.html,
// still used unchanged by curriculum progression tests and terminal
// tests). Reuses the exact same real pack (lib/testPacks.ts converts the
// unit's QuestionPaper into a ContentPack once, deterministically, zero AI
// cost - the same row content/test-template.html itself would read) and
// the same final-grading endpoint (/api/pack-test-attempts) for the actual
// score/ConceptMastery write, so this is a different FRONT END for
// answering, not a different scoring system.
export default async function InteractiveExamPage({
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
  if (!OLYMPIAD_EXAM_SETS.includes(rawDifficulty as (typeof OLYMPIAD_EXAM_SETS)[number])) {
    // This interactive flow only exists for Olympiad exam sets - anything
    // else belongs on the traditional render path.
    redirect(`/test/${unitId}/${rawDifficulty}/render`);
  }
  const difficulty = rawDifficulty as QuestionPaperDifficulty;

  const parts = unitId.split("-");
  if (parts.length !== 4) notFound();
  const [curriculumId, stageIdStr, subjectId, unitIdStr] = parts;
  const unit = await getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) notFound();

  const packId = await getOrCreateProgressionTestPack(unitId, difficulty);
  if (!packId) redirect(`/test/${unitId}`);

  const pack = await db.contentPack.findUnique({ where: { packId } });
  if (!pack) redirect(`/test/${unitId}`);

  const { mode } = await searchParams;

  return (
    <AppShell profile={profile} active="select">
      <OlympiadExamPlayer
        packId={packId}
        unitKey={unitId}
        pack={pack.data as unknown as Parameters<typeof OlympiadExamPlayer>[0]["pack"]}
        isPractice={mode === "practice"}
      />
    </AppShell>
  );
}
