"use client";

import { useState } from "react";
import type { CurriculumUnit, MasteryBand, TestQuestion } from "@/lib/types";
import { masteryBand } from "@/lib/mastery";
import { recordAttempt } from "@/lib/attempts";

type Answer =
  | { type: "multiple_choice"; selected: number | null }
  | { type: "short_answer"; text: string };

// Always runs against the "moderate" tier - a quick pre-check has no reason
// to make a kid pick a difficulty before they've even started the unit.
const DIAGNOSTIC_DIFFICULTY = "moderate" as const;

export default function UnitDiagnostic({
  unit,
  unitKey,
  questions,
  onReviewConcept,
  onAllMastered,
}: {
  unit: CurriculumUnit;
  unitKey: string;
  questions: TestQuestion[];
  onReviewConcept: (conceptId: string) => void;
  onAllMastered: () => void;
}) {
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map((q) => (q.type === "multiple_choice" ? { type: "multiple_choice", selected: null } : { type: "short_answer", text: "" }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [bands, setBands] = useState<Record<string, MasteryBand> | null>(null);

  function setMcq(index: number, selected: number) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? { type: "multiple_choice", selected } : a)));
  }

  function setShortText(index: number, text: string) {
    setAnswers((prev) => prev.map((a, i) => (i === index && a.type === "short_answer" ? { ...a, text } : a)));
  }

  async function submit() {
    setSubmitting(true);

    const perConcept: Record<string, { correct: number; total: number }> = {};
    let correctSum = 0;

    const graded = await Promise.all(
      questions.map(async (q, i) => {
        const a = answers[i];
        let fraction = 0;

        if (q.type === "multiple_choice" && a.type === "multiple_choice") {
          fraction = a.selected === q.correct_answer ? 1 : 0;
        } else if (q.type === "short_answer" && a.type === "short_answer" && a.text.trim()) {
          try {
            const res = await fetch("/api/grade", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ unitKey, difficulty: DIAGNOSTIC_DIFFICULTY, questionIndex: i, studentAnswer: a.text }),
            });
            if (res.ok) {
              const data = (await res.json()) as { marks_awarded: number; full_marks: number };
              fraction = data.full_marks > 0 ? data.marks_awarded / data.full_marks : 0;
            }
          } catch {
            // fall through, fraction stays 0
          }
        }

        return { concept: q.concept_tested, fraction };
      })
    );

    for (const g of graded) {
      perConcept[g.concept] ??= { correct: 0, total: 0 };
      perConcept[g.concept].correct += g.fraction;
      perConcept[g.concept].total += 1;
      correctSum += g.fraction;
    }

    const computedBands: Record<string, MasteryBand> = {};
    for (const [conceptId, stat] of Object.entries(perConcept)) {
      const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      computedBands[conceptId] = masteryBand(pct);
    }

    try {
      await recordAttempt({
        unitKey,
        attemptType: "diagnostic",
        difficulty: DIAGNOSTIC_DIFFICULTY,
        correct: correctSum,
        total: questions.length,
        perConcept,
      });
    } finally {
      setBands(computedBands);
      setSubmitting(false);
    }
  }

  if (bands) {
    const weakConcepts = unit.concepts.filter((c) => bands[c.concept_id] && bands[c.concept_id] !== "mastered");
    const allMastered = unit.concepts.every((c) => !bands[c.concept_id] || bands[c.concept_id] === "mastered");

    return (
      <div className="grid gap-4">
        <div className="rounded-xl border border-test-border bg-test-bg p-5">
          <h2 className="text-lg font-semibold">Here&apos;s what we found</h2>
          <p className="mt-1 text-sm text-slate-600">No pressure - this just tells us where to spend time.</p>
        </div>
        {unit.concepts.map((c) => {
          const band = bands[c.concept_id];
          if (!band) return null;
          return (
            <div
              key={c.concept_id}
              className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft"
            >
              <div>
                <p className="font-medium">
                  {c.concept_id} {c.concept_name}
                </p>
                <p className="text-sm text-slate-500">{bandMessage(band)}</p>
              </div>
              {band === "mastered" ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  You&apos;ve got this
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onReviewConcept(c.concept_id)}
                  className="rounded-xl bg-practice-accent px-3 py-1.5 text-sm font-medium text-white"
                >
                  Review this
                </button>
              )}
            </div>
          );
        })}
        {allMastered && (
          <button
            type="button"
            onClick={onAllMastered}
            className="justify-self-start rounded-xl bg-green-600 px-5 py-2.5 font-medium text-white"
          >
            Great, let&apos;s move on
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-practice-border bg-practice-bg p-4">
          <p className="font-medium">{q.question}</p>
          {q.type === "multiple_choice" && (
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, oi) => (
                <label key={oi} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`d-${i}`}
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
              className="mt-3 w-full rounded-xl border border-slate-300 p-2 text-sm"
              rows={2}
              placeholder="Write your answer, or leave blank if you're not sure..."
              value={(answers[i] as Extract<Answer, { type: "short_answer" }>).text}
              onChange={(e) => setShortText(i, e.target.value)}
            />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={submit}
        disabled={submitting}
        className="justify-self-start rounded-xl bg-practice-accent px-5 py-2.5 font-medium text-white disabled:opacity-50"
      >
        {submitting ? "Checking..." : "See what I know"}
      </button>
    </div>
  );
}

function bandMessage(band: MasteryBand): string {
  switch (band) {
    case "mastered":
      return "Looks solid already.";
    case "needs_brush_up":
      return "Good basics - a quick review will help.";
    case "needs_reteach":
      return "Worth going through properly.";
  }
}
