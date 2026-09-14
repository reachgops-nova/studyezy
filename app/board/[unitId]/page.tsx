import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import DrawingBoard from "@/components/board/DrawingBoard";
import { BOARD_UNITS } from "@/lib/boardUnits";
import type { BoardTask } from "@/lib/boardUnits/types";
import type { TestQuestion } from "@/lib/types";

/**
 * The Drawing Board lives on its own route while it is being built out, so
 * the existing lesson keeps working untouched and the two can be compared.
 *
 * Full-bleed on purpose: the board is the screen, not a panel inside one, so
 * this page deliberately skips AppShell's sidebar and padding.
 */
export default async function BoardPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  const user = await requireUser();
  if (!user) redirect("/login");

  const unit = BOARD_UNITS[unitId];
  if (!unit) notFound();

  // The Test phase draws on the question papers this unit already has rather
  // than a second, parallel bank - so the board tests the same questions the
  // progression test does, and a new unit needs no extra question authoring.
  const row = await db.unit.findUnique({
    where: { unitKey: unitId },
    select: { questionPapers: { select: { difficulty: true, questions: true } } },
  });

  const paperTasks: BoardTask[] = (row?.questionPapers ?? [])
    .flatMap((p) => ((p.questions as unknown as TestQuestion[]) ?? []).map((q) => ({ q, tier: p.difficulty })))
    .filter((x): x is { q: Extract<TestQuestion, { type: "multiple_choice" }>; tier: string } => x.q?.type === "multiple_choice")
    .slice(0, 8)
    .map(({ q, tier }, i) => ({
      title: `Paper ${i + 1} · ${tier}`,
      prompt: q.question,
      conceptId: q.concept_tested,
      options: q.options.map((label, oi) => ({
        label,
        correct: oi === q.correct_answer,
        say:
          oi === q.correct_answer
            ? "That's the one."
            : `Not this time - the answer is "${q.options[q.correct_answer]}".`,
        frame: {},
      })),
    }));

  return (
    <main className="fixed inset-0 overflow-hidden">
      <DrawingBoard unit={unit} paperTasks={paperTasks} />
    </main>
  );
}
