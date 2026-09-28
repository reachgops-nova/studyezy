import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getPublishedTermExamPapersGrouped } from "@/lib/termExams";
import AppShell from "@/components/AppShell";

export default async function ExamsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const papers = await getPublishedTermExamPapersGrouped();
  const bySubject = new Map<string, typeof papers>();
  for (const paper of papers) {
    const list = bySubject.get(paper.subjectId) ?? [];
    list.push(paper);
    bySubject.set(paper.subjectId, list);
  }

  return (
    <AppShell profile={profile} active="exams" isAdmin={user.role === "admin"}>
      <div>
        <h1 className="text-2xl font-bold">Terminal exam papers</h1>
        <p className="mt-1 text-slate-600">
          Full practice papers for the upcoming terminal exam. The question paper is always open - the answer key
          is admin-approved on request, so ask if your child needs one.
        </p>
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
                    <span className="font-medium text-slate-800">{paper.title}</span>
                    <p className="text-xs text-slate-500">
                      {paper.totalMarks} marks{paper.durationMinutes ? ` - ${paper.durationMinutes} minutes` : ""}
                    </p>
                  </div>
                  <Link href={`/exams/${paper.id}`} className="shrink-0 rounded-md bg-brand-ink px-3 py-1.5 text-xs font-medium text-white">
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {papers.length === 0 && (
        <p className="text-sm text-slate-400">No terminal exam papers have been published yet.</p>
      )}
    </AppShell>
  );
}
