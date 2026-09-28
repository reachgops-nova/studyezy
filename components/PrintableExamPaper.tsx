import PrintButton from "./PrintButton";
import type { TermExamSection, TermExamAnswerSection } from "@/lib/termExams";

interface PrintablePaperProps {
  title: string;
  subjectName: string;
  totalMarks: number;
  durationMinutes: number | null;
  sections: TermExamSection[];
  mode: "questions" | "answers";
  answerSections?: TermExamAnswerSection[];
}

/** Bare, print-optimized rendering of one side of a terminal exam paper - no
 * AppShell/nav, since printing the app chrome alongside a paper a family or
 * teacher hands out on real paper would be pointless. Questions and answers
 * are deliberately two separate print targets (never printed together), per
 * the 2026-09-27 requirement to keep the answer key admin/teacher-only. */
export default function PrintableExamPaper({
  title,
  subjectName,
  totalMarks,
  durationMinutes,
  sections,
  mode,
  answerSections = [],
}: PrintablePaperProps) {
  const answersByLabel = new Map(answerSections.map((s) => [s.label, s]));

  return (
    <div className="mx-auto max-w-3xl bg-white px-8 py-10 text-slate-900 print:px-0 print:py-0">
      <style>{`
        @media print {
          @page { size: A4; margin: 16mm 14mm; }
          html, body { background: #fff; }
        }
      `}</style>
      <PrintButton label={mode === "questions" ? "Print question paper" : "Print answer key"} />

      <div className="border-b-2 border-slate-800 pb-4 text-center">
        <h1 className="text-xl font-bold uppercase tracking-wide">{title}</h1>
        <p className="mt-1 text-sm">{subjectName}</p>
        <p className="mt-2 text-sm">
          {mode === "answers" ? "Answer Key & Mark Scheme - Teacher/Admin Only" : "Question Paper"}
        </p>
        <div className="mt-2 flex justify-center gap-6 text-sm">
          <span>Total Marks: {totalMarks}</span>
          {durationMinutes && <span>Time Allowed: {durationMinutes} minutes</span>}
        </div>
      </div>

      {mode === "questions" && (
        <div className="mt-4 rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs print:bg-white">
          <p className="font-semibold">Instructions to candidates:</p>
          <ul className="mt-1 list-disc pl-5">
            <li>Answer ALL questions in the spaces provided.</li>
            <li>Read each question carefully before answering.</li>
            <li>Marks for each question are shown in brackets [ ].</li>
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-8">
        {sections.map((section) => {
          const answerSection = mode === "answers" ? answersByLabel.get(section.label) : undefined;
          const answersByNumber = new Map((answerSection?.answers ?? []).map((a) => [a.number, a]));
          return (
            <section key={section.label} className="break-inside-avoid-page">
              <div className="flex items-baseline justify-between border-b border-slate-400 pb-1">
                <h2 className="text-sm font-bold uppercase tracking-wide">{section.label}</h2>
                <span className="text-xs font-semibold">[{section.marks} marks]</span>
              </div>
              {section.instructions && <p className="mt-2 text-xs italic text-slate-600">{section.instructions}</p>}

              <ol className="mt-3 grid gap-4">
                {section.questions.map((q) => {
                  const answer = answersByNumber.get(q.number);
                  return (
                    <li key={q.number} className="break-inside-avoid-page text-sm leading-relaxed">
                      <div className="flex items-start justify-between gap-3">
                        <span>
                          <span className="font-semibold">{q.number}.</span> {q.prompt}
                        </span>
                        {q.marks > 0 && <span className="shrink-0 text-xs text-slate-500">[{q.marks}]</span>}
                      </div>
                      {q.diagram && (
                        <figure className="mt-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={q.diagram.src} alt={q.diagram.alt} className="max-h-72 max-w-full rounded border border-slate-300" />
                          {q.diagram.caption && <figcaption className="mt-1 text-xs text-slate-600">{q.diagram.caption}</figcaption>}
                        </figure>
                      )}
                      {mode === "questions" && q.marks > 0 && (
                        <div className="mt-2 h-10 border-b border-dotted border-slate-300 print:h-14" aria-hidden />
                      )}
                      {mode === "answers" && answer && (
                        <div className="mt-1.5 rounded-md bg-slate-50 p-2 text-sm print:bg-white print:border print:border-slate-200">
                          <p className="text-slate-800">{answer.modelAnswer}</p>
                          {answer.diagram && (
                            <figure className="mt-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={answer.diagram.src} alt={answer.diagram.alt} className="max-h-72 max-w-full rounded border border-slate-300" />
                              {answer.diagram.caption && <figcaption className="mt-1 text-xs text-slate-600">{answer.diagram.caption}</figcaption>}
                            </figure>
                          )}
                          {answer.markingNotes && (
                            <p className="mt-1 text-xs text-slate-500">Marking: {answer.markingNotes}</p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs font-semibold uppercase tracking-wide">
        {mode === "questions" ? "End of examination paper" : "End of answer key"}
      </p>
    </div>
  );
}
