"use client";

import { useState } from "react";

export interface ReasoningItem {
  conceptId: string;
  prompt: string;
  question: string;
  studentAnswer: string;
}

interface ReasoningApiResult {
  classification: string;
  note: string;
}

const CLASSIFICATION_LABELS: Record<string, string> = {
  correct_reasoning: "Solid thinking",
  conceptual_gap: "Worth reviewing together",
  careless_slip: "Just a slip",
  misread_question: "Misread the question",
};

/**
 * Reasoning Interview (PLATFORM_PLAN.md §2.4) - after a progression test,
 * a short follow-up asking the kid to explain their thinking on a couple of
 * questions, classified into why (not just whether) it was right or wrong.
 * Entirely optional - "Skip" always available, matches the no-pressure
 * practice principle even though this runs after a scored test.
 */
export default function ReasoningInterview({
  unitKey,
  items,
  onDone,
}: {
  unitKey: string;
  items: ReasoningItem[];
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<(ReasoningApiResult | null)[]>(items.map(() => null));
  const [error, setError] = useState<string | null>(null);

  const current = items[index];
  const currentResult = results[index];

  async function submit() {
    if (!explanation.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reasoning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitKey,
          conceptId: current.conceptId,
          question: current.question,
          studentAnswer: current.studentAnswer,
          explanation,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't process that - please try again.");
      }
      const data = (await res.json()) as ReasoningApiResult;
      setResults((prev) => prev.map((r, i) => (i === index ? data : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    setExplanation("");
    setError(null);
    if (index + 1 >= items.length) {
      onDone();
    } else {
      setIndex(index + 1);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-practice-border bg-practice-bg p-5">
      <h3 className="font-semibold text-slate-800">Let&apos;s talk through your thinking</h3>
      <p className="mt-1 text-sm text-slate-600">
        Not scored - this just helps us understand how you think, not whether you were right.
      </p>

      {!currentResult ? (
        <div className="mt-4 grid gap-2">
          <p className="text-sm font-medium text-slate-700">{current.prompt}</p>
          <textarea
            className="w-full rounded-xl border border-slate-300 p-2 text-sm"
            rows={3}
            placeholder="Explain how you thought about it..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !explanation.trim()}
              className="rounded-xl bg-practice-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Thinking..." : "Share my thinking"}
            </button>
            <button
              type="button"
              onClick={next}
              disabled={submitting}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 disabled:opacity-50"
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          <div className="rounded-xl bg-white p-3">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {CLASSIFICATION_LABELS[currentResult.classification] ?? "Noted"}
            </span>
            <p className="mt-1 text-sm text-slate-700">{currentResult.note}</p>
          </div>
          <button
            type="button"
            onClick={next}
            className="justify-self-start rounded-xl bg-practice-accent px-4 py-2 text-sm font-medium text-white"
          >
            {index + 1 >= items.length ? "Done" : "Next"}
          </button>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-400">
        {index + 1} of {items.length}
      </p>
    </div>
  );
}
