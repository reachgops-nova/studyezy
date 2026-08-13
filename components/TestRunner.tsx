"use client";

import { useState } from "react";
import type { CurriculumUnit, StoredUnitResult, TestQuestion } from "@/lib/types";
import { recordAttempt } from "@/lib/attempts";

type Answer =
  | { type: "multiple_choice"; selected: number | null }
  | { type: "short_answer"; text: string; marksAwarded?: number; feedback?: string; grading?: boolean };

export default function TestRunner({
  unit,
  unitKey,
}: {
  unit: CurriculumUnit;
  unitKey: string;
}) {
  const questions = unit.progression_test_draft.questions;
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map((q) => (q.type === "multiple_choice" ? { type: "multiple_choice", selected: null } : { type: "short_answer", text: "" }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<StoredUnitResult | null>(null);

  function setMcq(index: number, selected: number) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? { type: "multiple_choice", selected } : a)));
  }

  function setShortText(index: number, text: string) {
    setAnswers((prev) => prev.map((a, i) => (i === index && a.type === "short_answer" ? { ...a, text } : a)));
  }

  async function submitTest() {
    setSubmitting(true);

    const perConcept: Record<string, { correct: number; total: number }> = {};
    let correctSum = 0;

    const graded = await Promise.all(
      questions.map(async (q: TestQuestion, i) => {
        const a = answers[i];
        let fraction = 0;

        if (q.type === "multiple_choice" && a.type === "multiple_choice") {
          fraction = a.selected === q.correct_answer ? 1 : 0;
        } else if (q.type === "short_answer" && a.type === "short_answer") {
          try {
            const res = await fetch("/api/grade", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ unitKey, questionIndex: i, studentAnswer: a.text }),
            });
            if (res.ok) {
              const data = (await res.json()) as { marks_awarded: number; full_marks: number; feedback: string };
              fraction = data.full_marks > 0 ? data.marks_awarded / data.full_marks : 0;
              return { index: i, fraction, feedback: data.feedback, marksAwarded: data.marks_awarded };
            }
          } catch {
            // fall through, fraction stays 0
          }
        }

        return { index: i, fraction, feedback: undefined, marksAwarded: undefined };
      })
    );

    for (const g of graded) {
      const q = questions[g.index];
      const concept = q.concept_tested;
      perConcept[concept] ??= { correct: 0, total: 0 };
      perConcept[concept].correct += g.fraction;
      perConcept[concept].total += 1;
      correctSum += g.fraction;

      if (q.type === "short_answer" && g.feedback) {
        setAnswers((prev) =>
          prev.map((a, i) =>
            i === g.index && a.type === "short_answer"
              ? { ...a, feedback: g.feedback, marksAwarded: g.marksAwarded }
              : a
          )
        );
      }
    }

    try {
      const stored = await recordAttempt({
        unitKey,
        attemptType: "progression_test",
        correct: correctSum,
        total: questions.length,
        perConcept,
      });
      setResult(stored);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-xl border border-test-border bg-test-bg p-6">
        <h2 className="text-xl font-bold">Nice work!</h2>
        <p className="mt-2 text-slate-700">
          Score: {result.scorePct}% - {bandLabel(result.band)}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Next check-in suggested: {new Date(result.nextReviewDate).toLocaleDateString()}
        </p>
        <div className="mt-4 grid gap-2">
          {answers.map((a, i) =>
            a.type === "short_answer" && a.feedback ? (
              <p key={i} className="rounded-lg bg-white p-3 text-sm text-slate-700">
                <strong>Q{i + 1} feedback:</strong> {a.feedback}
              </p>
            ) : null
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-test-border bg-test-bg p-4">
          <p className="font-medium">
            {i + 1}. {q.question}
          </p>

          {q.type === "multiple_choice" && (
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, oi) => (
                <label key={oi} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={(answers[i] as Extract<Answer, { type: "multiple_choice" }>).selected === oi}
                    onChange={() => setMcq(i, oi)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {q.type === "short_answer" && (
            <textarea
              className="mt-3 w-full rounded-lg border border-slate-300 p-2 text-sm"
              rows={3}
              placeholder="Write your answer..."
              value={(answers[i] as Extract<Answer, { type: "short_answer" }>).text}
              onChange={(e) => setShortText(i, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={submitTest}
        disabled={submitting}
        className="justify-self-start rounded-lg bg-test-accent px-5 py-2.5 font-medium text-white disabled:opacity-50"
      >
        {submitting ? "Checking..." : "Submit test"}
      </button>
    </div>
  );
}

function bandLabel(band: StoredUnitResult["band"]): string {
  switch (band) {
    case "mastered":
      return "You've got this one - light check-in in 2 weeks.";
    case "needs_brush_up":
      return "Good basics - let's revisit the tricky bits in a few days.";
    case "needs_reteach":
      return "Let's go over this concept again before retesting.";
  }
}
