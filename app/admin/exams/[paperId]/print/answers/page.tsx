import { redirect, notFound } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { getTermExamPaper } from "@/lib/termExams";
import type { TermExamSection, TermExamAnswerSection } from "@/lib/termExams";
import PrintableExamPaper from "@/components/PrintableExamPaper";

export default async function AdminPrintAnswersPage({ params }: { params: Promise<{ paperId: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const { paperId } = await params;
  const paper = await getTermExamPaper(paperId);
  if (!paper) notFound();

  return (
    <PrintableExamPaper
      title={paper.title}
      subjectName={paper.subject.name}
      totalMarks={paper.totalMarks}
      durationMinutes={paper.durationMinutes}
      sections={paper.sections as unknown as TermExamSection[]}
      answerSections={(paper.answerKey?.sections ?? []) as unknown as TermExamAnswerSection[]}
      mode="answers"
    />
  );
}
