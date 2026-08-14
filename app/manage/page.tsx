import { redirect } from "next/navigation";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import AppHeader from "@/components/AppHeader";
import { createSubject, createUnit } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  missing_subject_fields: "Pick a stage and give the subject a name.",
  unknown_stage: "That stage wasn't found - try again.",
  missing_unit_fields: "Pick a subject, and give the unit a number and a title.",
  unknown_subject: "That subject wasn't found - try again.",
  unit_exists: "That unit number already exists for this subject.",
};

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { error, success } = await searchParams;

  const stages = await db.stage.findMany({
    include: { curriculum: true, subjects: { orderBy: { name: "asc" } } },
    orderBy: { number: "asc" },
  });
  const subjects = stages.flatMap((s) =>
    s.subjects.map((subj) => ({ id: subj.id, label: `${s.label} - ${subj.name}` }))
  );

  return (
    <main className="grid gap-8">
      <AppHeader profile={profile} active="manage" isAdmin={user.role === "admin"} />

      <div>
        <h1 className="text-2xl font-bold">Add subjects and units</h1>
        <p className="mt-1 text-slate-600">
          New subjects and units are available to practice right away - fill in the actual lesson
          content afterwards from the unit page (upload textbook pages, then extract).
        </p>
      </div>

      {error && ERROR_MESSAGES[error] && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{ERROR_MESSAGES[error]}</p>
      )}
      {success === "subject_added" && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Subject added.</p>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Add a subject</h2>
        <form action={createSubject} className="mt-3 grid max-w-md gap-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Stage
            <select name="stageId" required className="rounded-lg border border-slate-300 px-3 py-2 text-base">
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.curriculum.name} - {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Subject name
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Math"
              className="rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </label>
          <button type="submit" className="justify-self-start rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white">
            Add subject
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Add a unit</h2>
        <form action={createUnit} className="mt-3 grid max-w-md gap-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Subject
            <select name="subjectId" required className="rounded-lg border border-slate-300 px-3 py-2 text-base">
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Unit number
            <input
              type="number"
              name="number"
              min={1}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Unit title
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Fractions and decimals"
              className="rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Textbook publisher (optional)
            <input type="text" name="publisher" className="rounded-lg border border-slate-300 px-3 py-2 text-base" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Textbook title (optional)
            <input type="text" name="bookTitle" className="rounded-lg border border-slate-300 px-3 py-2 text-base" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Concepts this unit covers (optional, one per line as <code>id: name</code>)
            <textarea
              name="outline"
              rows={4}
              placeholder={"2.1: Adding fractions\n2.2: Comparing decimals"}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
            />
          </label>
          <button type="submit" className="justify-self-start rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white">
            Add unit
          </button>
        </form>
      </section>
    </main>
  );
}
