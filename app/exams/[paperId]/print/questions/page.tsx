import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getTermExamPaper } from "@/lib/termExams";
import type { TermExamSection } from "@/lib/termExams";
import PrintableExamPaper from "@/components/PrintableExamPaper";

export default async function ParentPrintQuestionsPage({ params }: { params: Promise<{ paperId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { paperId } = await params;
  const paper = await getTermExamPaper(paperId);
  if (!paper || (paper.status !== "published" && user.role !== "admin")) notFound();

  return (
    <PrintableExamPaper
      title={paper.title}
      subjectName={paper.subject.name}
      totalMarks={paper.totalMarks}
      durationMinutes={paper.durationMinutes}
      sections={paper.sections as unknown as TermExamSection[]}
      mode="questions"
    />
  );
}
