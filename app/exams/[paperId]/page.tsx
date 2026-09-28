import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getTermExamPaper, getAccessRequestsForUser, hasApprovedAnswerKeyAccess } from "@/lib/termExams";
import type { TermExamSection, TermExamAnswerSection } from "@/lib/termExams";
import AppShell from "@/components/AppShell";
import { requestAnswerKey } from "../actions";

export default async function ExamPaperPage({ params }: { params: Promise<{ paperId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { paperId } = await params;
  const paper = await getTermExamPaper(paperId);
  if (!paper || paper.status !== "published") notFound();

  const isAdmin = user.role === "admin";
  const [requests, approved] = await Promise.all([
    getAccessRequestsForUser(paperId, user.id),
    isAdmin ? Promise.resolve(true) : hasApprovedAnswerKeyAccess(paperId, user.id),
  ]);
  const latestRequest = requests[0];
  const hasPendingRequest = latestRequest?.status === "pending";
  const canSeeAnswerKey = isAdmin || approved;

  const sections = paper.sections as unknown as TermExamSection[];
  const answerSections = (paper.answerKey?.sections ?? []) as unknown as TermExamAnswerSection[];
  const answersByLabel = new Map(answerSections.map((s) => [s.label, s]));

  return (
    <AppShell profile={profile} active="exams" isAdmin={isAdmin}>
      <div>
        <Link href="/exams" className="text-sm text-brand-ink hover:underline">
          &larr; All terminal exam papers
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{paper.title}</h1>
        <p className="mt-1 text-slate-600">
          {paper.subject.name} - {paper.totalMarks} marks{paper.durationMinutes ? ` - ${paper.durationMinutes} minutes` : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/exams/${paper.id}/print/questions`}
            target="_blank"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Print question paper
          </Link>
          {canSeeAnswerKey && (
            <Link
              href={`/exams/${paper.id}/print/answers`}
              target="_blank"
              className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            >
              Print answer key
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4">
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

      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
        <h2 className="font-semibold text-slate-800">Answer key</h2>
        {canSeeAnswerKey ? (
          <div className="mt-3 grid gap-4">
            {sections.map((section) => {
              const answerSection = answersByLabel.get(section.label);
              return (
                <div key={section.label} className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
                  <h3 className="text-sm font-medium text-slate-800">{section.label}</h3>
                  <ol className="mt-2 grid gap-2">
                    {(answerSection?.answers ?? []).map((a) => (
                      <li key={a.number} className="rounded-lg bg-white px-3 py-2 text-sm">
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
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        ) : hasPendingRequest ? (
          <p className="mt-2 text-sm text-amber-600">Your request is pending admin approval.</p>
        ) : (
          <div className="mt-3">
            {latestRequest?.status === "denied" && (
              <p className="mb-2 text-sm text-slate-500">Your last request wasn&apos;t approved - you can ask again below.</p>
            )}
            <form action={requestAnswerKey} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <input type="hidden" name="paperId" value={paper.id} />
              <label className="flex-1 text-sm font-medium text-slate-700">
                Note (optional)
                <input
                  type="text"
                  name="note"
                  placeholder="e.g. Preparing for the mock this weekend"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <button type="submit" className="shrink-0 rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95">
                Request answer key
              </button>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
