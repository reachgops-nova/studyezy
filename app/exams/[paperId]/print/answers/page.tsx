import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getTermExamPaper, hasApprovedAnswerKeyAccess } from "@/lib/termExams";
import type { TermExamSection, TermExamAnswerSection } from "@/lib/termExams";
import PrintableExamPaper from "@/components/PrintableExamPaper";

export default async function ParentPrintAnswersPage({ params }: { params: Promise<{ paperId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { paperId } = await params;
  const paper = await getTermExamPaper(paperId);
  if (!paper || paper.status !== "published") notFound();

  const isAdmin = user.role === "admin";
  const approved = isAdmin || (await hasApprovedAnswerKeyAccess(paperId, user.id));
  if (!approved) redirect(`/exams/${paperId}`);

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
