import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getTermExamPaper } from "@/lib/termExams";
import type { TermExamSection, TermExamAnswerSection } from "@/lib/termExams";
import AppShell from "@/components/AppShell";

export default async function AdminExamPaperPage({ params }: { params: Promise<{ paperId: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { paperId } = await params;
  const paper = await getTermExamPaper(paperId);
  if (!paper) notFound();

  const sections = paper.sections as unknown as TermExamSection[];
  const answerSections = (paper.answerKey?.sections ?? []) as unknown as TermExamAnswerSection[];
  const answersByLabel = new Map(answerSections.map((s) => [s.label, s]));

  return (
    <AppShell profile={profile} active="admin-exams" isAdmin>
      <div>
        <Link href="/admin/exams" className="text-sm text-brand-ink hover:underline">
          &larr; All terminal exam papers
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{paper.title}</h1>
        <p className="mt-1 text-slate-600">
          {paper.subject.name} - {paper.totalMarks} marks{paper.durationMinutes ? ` - ${paper.durationMinutes} minutes` : ""} -{" "}
          <span className={paper.status === "published" ? "text-green-700" : "text-slate-500"}>{paper.status}</span>
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href={`/admin/exams/${paper.id}/print/questions`}
            target="_blank"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Print question paper
          </Link>
          <Link
            href={`/admin/exams/${paper.id}/print/answers`}
            target="_blank"
            className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
          >
            Print answer key
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          <h2 className="font-semibold text-slate-800">Question paper</h2>
          {sections.map((section) => (
            <div key={section.label} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-800">{section.label}</h3>
                <span className="text-xs text-slate-500">{section.marks} marks</span>
              </div>
              {section.instructions && <p className="mt-1 text-xs text-slate-500">{section.instructions}</p>}
              <ol className="mt-3 grid gap-3">
                {section.questions.map((q) => (
                  <li key={q.number} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium text-slate-700">
                        {q.number}. {q.prompt}
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">[{q.marks}]</span>
                    </div>
                    {q.diagram && (
                      <figure className="mt-2">
                        <img src={q.diagram.src} alt={q.diagram.alt} className="max-h-64 rounded-lg border border-slate-200" />
                        {q.diagram.caption && <figcaption className="mt-1 text-xs text-slate-500">{q.diagram.caption}</figcaption>}
                      </figure>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="grid gap-4">
          <h2 className="font-semibold text-slate-800">Answer key (admin only)</h2>
          {sections.map((section) => {
            const answerSection = answersByLabel.get(section.label);
            return (
              <div key={section.label} className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-soft">
                <h3 className="font-medium text-slate-800">{section.label}</h3>
                <ol className="mt-3 grid gap-3">
                  {(answerSection?.answers ?? []).map((a) => (
                    <li key={a.number} className="rounded-xl bg-white px-3 py-2 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-medium text-slate-700">{a.number}.</span>
                        <span className="shrink-0 text-xs text-slate-400">[{a.marks}]</span>
                      </div>
                      <p className="mt-1 text-slate-700">{a.modelAnswer}</p>
                      {a.diagram && (
                        <figure className="mt-2">
                          <img src={a.diagram.src} alt={a.diagram.alt} className="max-h-64 rounded-lg border border-slate-200" />
                          {a.diagram.caption && <figcaption className="mt-1 text-xs text-slate-500">{a.diagram.caption}</figcaption>}
                        </figure>
                      )}
                      {a.markingNotes && <p className="mt-1 text-xs text-slate-500">Marking: {a.markingNotes}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
