import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getAllTermExamPapersGroupedBySubject, getPendingAccessRequests } from "@/lib/termExams";
import { db } from "@/lib/db";
import AppShell from "@/components/AppShell";
import GenerateTermExamForm from "@/components/GenerateTermExamForm";
import type { GenerateTermExamSubjectOption } from "@/components/GenerateTermExamForm";
import { approveAccessRequest, denyAccessRequest, publishTermExamPaper, unpublishTermExamPaper } from "./actions";

export default async function AdminExamsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const [papers, pendingRequests, subjectRows] = await Promise.all([
    getAllTermExamPapersGroupedBySubject(),
    getPendingAccessRequests(),
    db.subject.findMany({
      where: { available: true },
      include: {
        stage: { include: { curriculum: true } },
        units: { where: { available: true }, orderBy: { number: "asc" }, select: { id: true, number: true, title: true } },
      },
      orderBy: [{ stage: { curriculum: { name: "asc" } } }, { stage: { number: "asc" } }, { name: "asc" }],
    }),
  ]);

  // Real subject cuids, never the slug getCatalog() exposes as "id" - a slug
  // like "science" repeats across curricula (real bug found 2026-09-27:
  // Cambridge Science units were once attached to a Matric/State Board
  // subject sharing that same slug), so this form must be unambiguous.
  const subjectOptions: GenerateTermExamSubjectOption[] = subjectRows
    .filter((s) => s.units.length > 0)
    .map((s) => ({
      id: s.id,
      label: `${s.stage.curriculum.name} - ${s.stage.label} - ${s.name}`,
      units: s.units,
    }));

  const bySubject = new Map<string, typeof papers>();
  for (const paper of papers) {
    const list = bySubject.get(paper.subjectId) ?? [];
    list.push(paper);
    bySubject.set(paper.subjectId, list);
  }

  return (
    <AppShell profile={profile} active="admin-exams" isAdmin>
      <div>
        <h1 className="text-2xl font-bold">Terminal exam papers</h1>
        <p className="mt-1 text-slate-600">
          Formal, school-style papers for a subject&apos;s terminal exam - not the same as a unit&apos;s own
          self-test bank. Each paper carries its own separately-stored answer key, hidden from parents until you
          approve their request below.
        </p>
      </div>

      {subjectOptions.length > 0 && <GenerateTermExamForm subjects={subjectOptions} />}

      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Answer key requests</h2>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            {pendingRequests.length} pending
          </span>
        </div>
        {pendingRequests.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No parent has requested an answer key right now.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {pendingRequests.map((req) => (
              <li key={req.id} className="grid gap-1 rounded-xl bg-amber-50 px-3 py-2 text-sm sm:flex sm:items-center sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <Link href={`/admin/exams/${req.paperId}`} className="truncate font-medium text-amber-900 hover:underline">
                    {req.paper.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    Requested by {req.requestedBy.email}
                    {req.studentProfile ? ` for ${req.studentProfile.displayName}` : ""}
                    {req.note ? ` - "${req.note}"` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={approveAccessRequest}>
                    <input type="hidden" name="requestId" value={req.id} />
                    <button type="submit" className="rounded-md bg-brand-ink px-2.5 py-1 text-xs font-medium text-white">
                      Approve
                    </button>
                  </form>
                  <form action={denyAccessRequest}>
                    <input type="hidden" name="requestId" value={req.id} />
                    <button type="submit" className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white">
                      Deny
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {[...bySubject.entries()].map(([subjectId, list]) => {
        const first = list[0];
        return (
          <div key={subjectId} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
            <h2 className="font-semibold text-slate-800">
              {first.subject.stage.curriculum.name} - {first.subject.stage.label} - {first.subject.name}
            </h2>
            <ul className="mt-3 grid gap-2">
              {list.map((paper) => (
                <li key={paper.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <Link href={`/admin/exams/${paper.id}`} className="font-medium text-slate-800 hover:underline">
                      {paper.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {paper.totalMarks} marks - {paper.unitIds.length} unit{paper.unitIds.length === 1 ? "" : "s"} covered
                      {paper.accessRequests.length > 0 && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          {paper.accessRequests.length} pending request{paper.accessRequests.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        paper.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {paper.status}
                    </span>
                    {paper.status === "published" ? (
                      <form action={unpublishTermExamPaper}>
                        <input type="hidden" name="paperId" value={paper.id} />
                        <button type="submit" className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white">
                          Unpublish
                        </button>
                      </form>
                    ) : (
                      <form action={publishTermExamPaper}>
                        <input type="hidden" name="paperId" value={paper.id} />
                        <button type="submit" className="rounded-md bg-brand-ink px-2.5 py-1 text-xs font-medium text-white">
                          Publish
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {papers.length === 0 && (
        <p className="text-sm text-slate-400">
          No terminal exam papers yet. Tell your assistant which subject and units (portion) to prepare a paper for.
        </p>
      )}
    </AppShell>
  );
}
