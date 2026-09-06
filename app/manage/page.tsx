import { redirect } from "next/navigation";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import AppShell from "@/components/AppShell";
import { createSubject, createUnit, createBoard } from "./actions";
import AddSubjectForm from "@/components/manage/AddSubjectForm";
import AddUnitForm from "@/components/manage/AddUnitForm";
import ExamPresetForm from "@/components/manage/ExamPresetForm";

const ERROR_MESSAGES: Record<string, string> = {
  missing_subject_fields: "Pick (or add) a board and grade, and give the subject a name.",
  missing_grade_fields: "Give the grade a label and a number.",
  missing_board_fields: "Give the board/exam a name.",
  unknown_board: "That board wasn't found - try again.",
  unknown_stage: "That grade wasn't found - try again.",
  missing_unit_fields: "Pick a subject, and give the unit a title.",
  unknown_subject: "That subject wasn't found - try again.",
  unit_exists: "That unit number already exists for this subject.",
  // Real feedback (2026-09-06): "throw exact error to uploaders" - the real
  // per-file reason travels in `detail` instead of a fixed generic message
  // here; this is only the fallback if that's somehow missing.
  file_rejected: "One or more files couldn't be uploaded.",
};

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; detail?: string; success?: string; curriculumId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { error, detail, success, curriculumId } = await searchParams;

  // One query, real DB ids throughout (not the slug/number scheme
  // lib/catalog.ts's getCatalog() uses for student-facing URLs) - this page
  // creates rows, so it needs ids it can actually pass to Prisma.
  const curricula = await db.curriculum.findMany({
    orderBy: { name: "asc" },
    include: {
      stages: {
        orderBy: { number: "asc" },
        include: {
          subjects: {
            orderBy: { name: "asc" },
            include: { units: { orderBy: { number: "asc" } } },
          },
        },
      },
    },
  });

  return (
    <AppShell profile={profile} active="manage" isAdmin={user.role === "admin"}>
      <div>
        <h1 className="text-2xl font-bold">Add subjects and units</h1>
        <p className="mt-1 text-slate-600">
          New subjects and units are available to practice right away - fill in the actual lesson
          content afterwards from the unit page (upload textbook pages, then extract). Any board,
          grade, or subject can be added below - check what already exists first so families share
          one copy instead of duplicating the same book.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error === "file_rejected" && detail ? detail : ERROR_MESSAGES[error] ?? "Something went wrong - try again."}
        </p>
      )}
      {success === "subject_added" && (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">Subject added.</p>
      )}
      {success === "board_added" && (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">
          Board added - pick it below to add a subject under it.
        </p>
      )}

      <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold">Add a subject</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose the board and grade this subject belongs to - add a new board or grade inline if
          yours isn&apos;t listed yet.
        </p>
        <AddSubjectForm action={createSubject} curricula={curricula} initialCurriculumId={curriculumId} />
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold">Add a unit</h2>
        <p className="mt-1 text-sm text-slate-500">
          Pick the board, grade and subject first - existing units show up so you can confirm
          yours isn&apos;t already there.
        </p>
        <AddUnitForm action={createUnit} curricula={curricula} isAdmin={user.role === "admin"} />
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold">Add a global or competitive exam</h2>
        <p className="mt-1 text-sm text-slate-500">
          For exams that don&apos;t fit a school grade - Olympiad, NEET, JEE, GRE, and the like.
          This adds it as a board with one general grade; add its subjects and units below
          afterwards, same as any other board.
        </p>
        <ExamPresetForm action={createBoard} existingBoardNames={curricula.map((c) => c.name)} />
      </section>
    </AppShell>
  );
}
