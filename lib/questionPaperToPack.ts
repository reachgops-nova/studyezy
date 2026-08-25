import "server-only";
import type { QuestionPaperContent, TestQuestion } from "./types";

export interface PackTestMeta {
  book: string;
  subject: string;
  board: string;
  stage: string;
}

// id is prefixed with sheetNo so ids stay unique across an entire pack, not
// just within one sheet - a terminal test's pack has one sheet per unit
// (see lib/terminalTest.ts), and the client flattens every sheet's fields
// into one `answers` object keyed by question id (content/test-template.html),
// so a bare `q1` repeated in every sheet would collide across units.
function questionToPackQuestion(q: TestQuestion, sheetNo: number, index: number) {
  const base = {
    id: `s${sheetNo}q${index + 1}`,
    label: String(index + 1),
    prompt: q.question,
    conceptTested: q.concept_tested,
    needsHuman: false,
  };

  if (q.type === "multiple_choice") {
    return {
      ...base,
      fields: [
        {
          key: "a",
          label: "Your answer",
          input: "choice",
          options: q.options,
          check: { kind: "choice", value: q.options[q.correct_answer] },
        },
      ],
      hint: "Think back to what you learned about this - re-read the concept if you're stuck.",
      explanation: `The correct answer is "${q.options[q.correct_answer]}".`,
    };
  }

  return {
    ...base,
    fields: [
      {
        key: "a",
        label: "Your answer",
        input: "text",
        check: { kind: "ai_graded", markScheme: q.mark_scheme },
      },
    ],
    hint: "Show your reasoning, not just a final answer - that's what earns full marks here.",
    explanation: `Marked against: ${q.mark_scheme.criteria.join("; ")}.`,
  };
}

/**
 * Builds one pack sheet from an existing QuestionPaper - the reusable core
 * both `questionPaperToPack` (single-unit progression test) and
 * `lib/terminalTest.ts` (merges one sheet per unit into a cumulative pack)
 * are built from.
 */
export function questionPaperToSheet(paper: QuestionPaperContent, unitTitle: string, sheetNo: number) {
  return {
    id: `test-${paper.difficulty}-${sheetNo}`,
    no: sheetNo,
    title: `Progression Test (${paper.difficulty}) - ${unitTitle}`,
    objective: paper.note || "A progression test covering this unit's concepts.",
    skill: "progression-test",
    questions: paper.questions.map((q, index) => questionToPackQuestion(q, sheetNo, index)),
  };
}

/**
 * Deterministic, zero-AI-cost conversion of an existing, already-authored
 * QuestionPaper into a pack (content/schema/pack.schema.json) shape - the
 * progression test's actual questions/answers/mark schemes are carried over
 * losslessly, just re-expressed as declarative checks (multiple_choice) or
 * the new "ai_graded" kind (short_answer, still graded by the real
 * gradeShortAnswer/gradeShortAnswerGroq functions - see
 * app/api/pack-test-attempts/route.ts). Every question keeps its real
 * `concept_tested` as `conceptTested`, so the existing mastery-write path in
 * app/api/attempts/route.ts needs no special-casing for pack-sourced tests
 * (see PLATFORM_PLAN.md's 2026-08-25 entry).
 */
export function questionPaperToPack(paper: QuestionPaperContent, meta: PackTestMeta, unitTitle: string, packId: string) {
  return {
    packVersion: "1.0",
    packId,
    source: {
      book: meta.book,
      capturedAs: "manual" as const,
      confidence: "high" as const,
    },
    curriculum: { board: meta.board, stage: meta.stage, subject: meta.subject },
    language: "en",
    sheets: [questionPaperToSheet(paper, unitTitle, 1)],
  };
}
