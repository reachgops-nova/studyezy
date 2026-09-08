"use client";

import { useState } from "react";
import Link from "next/link";
// Same declarative check vocabulary every other player in this app uses -
// works unchanged in the browser (see the file's own docstring), so
// client-checkable kinds (choice, etc.) get instant, zero-latency feedback
// here instead of a network round trip for every single question.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - plain JS module (allowJs handles resolution)
import { checkAnswer, answerText } from "../content/engine/checks.js";

interface PackCheck {
  kind: string;
  value?: string;
  markScheme?: { full_marks: number; criteria: string[] };
  [key: string]: unknown;
}
interface PackField {
  key: string;
  label: string;
  input: "choice" | "text";
  options?: string[];
  check: PackCheck;
}
interface PackQuestion {
  id: string;
  label: string;
  prompt: string;
  fields: PackField[];
  hint?: string;
  explanation?: string;
}
interface PackSheet {
  questions: PackQuestion[];
}

interface CheckedState {
  correct: boolean | null;
  explanation: string;
  correctAnswerText?: string;
}

interface FinalResult {
  scorePct: number;
  band: string;
  perQuestion: { id: string; correct: boolean | null; explanation?: string; feedback?: string }[];
}

export default function OlympiadExamPlayer({
  packId,
  unitKey,
  pack,
  isPractice,
}: {
  packId: string;
  unitKey: string;
  pack: { sheets: PackSheet[] };
  isPractice: boolean;
}) {
  const questions = pack.sheets.flatMap((s) => s.questions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState("");
  const [textValue, setTextValue] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState<CheckedState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const question = questions[index];
  const field = question?.fields[0];
  const isLast = index === questions.length - 1;
  const currentValue = field?.input === "choice" ? selectedOption : textValue;

  async function handleCheck() {
    if (!question || !field || !currentValue.trim() || checking) return;
    setError(null);
    setChecking(true);
    try {
      if (field.check.kind === "ai_graded" && field.check.markScheme) {
        const res = await fetch("/api/pack-test-attempts/check-one", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packId, questionId: question.id, answer: currentValue }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't check this answer right now.");
        setChecked({ correct: data.correct, explanation: data.explanation ?? "" });
      } else {
        const ok = checkAnswer(field.check, currentValue);
        setChecked({
          correct: ok,
          explanation: question.explanation ?? "",
          correctAnswerText: ok ? undefined : answerText(field),
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setChecking(false);
    }
  }

  async function handleNext() {
    if (!question) return;
    const nextAnswers = { ...answers, [question.id]: currentValue };
    setAnswers(nextAnswers);

    if (isLast) {
      setSubmitting(true);
      setError(null);
      try {
        const res = await fetch("/api/pack-test-attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packId, answers: nextAnswers, practice: isPractice }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't submit this exam right now.");
        setFinalResult(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setIndex(index + 1);
    setSelectedOption("");
    setTextValue("");
    setShowHint(false);
    setChecked(null);
  }

  if (finalResult) {
    return (
      <div className="grid gap-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-soft">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {isPractice ? "Practice exam - complete" : "Exam complete"}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">{finalResult.scorePct}%</h1>
          <p className="mt-1 text-slate-600">Band: {finalResult.band}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <h2 className="font-semibold text-slate-800">Question by question</h2>
          <div className="mt-2 grid gap-2">
            {questions.map((q, i) => {
              const entry = finalResult.perQuestion.find((p) => p.id === q.id);
              const ok = entry?.correct;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    ok === true
                      ? "border-emerald-200 bg-emerald-50"
                      : ok === false
                        ? "border-red-200 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="font-medium text-slate-700">
                    Q{i + 1}. {q.prompt}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <Link
          href={`/learn/${unitKey}`}
          className="w-fit rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white"
        >
          Back to unit
        </Link>
      </div>
    );
  }

  if (!question || !field) {
    return <p className="text-slate-500">This exam has no questions yet.</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          Question {index + 1} of {questions.length}
        </p>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-gold transition-all"
            style={{ width: `${(index / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
        <p className="text-lg font-medium text-slate-800">{question.prompt}</p>

        {field.input === "choice" && field.options ? (
          <div className="mt-4 grid gap-2">
            {field.options.map((opt) => {
              const isSelected = selectedOption === opt;
              const showResult = checked !== null;
              const isCorrectOpt = field.check.kind === "choice" && field.check.value === opt;
              const tone = !showResult
                ? isSelected
                  ? "border-brand-ink bg-brand-paper"
                  : "border-slate-200 bg-white hover:bg-slate-50"
                : isCorrectOpt
                  ? "border-emerald-300 bg-emerald-50"
                  : isSelected
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 bg-white opacity-60";
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={checked !== null}
                  onClick={() => setSelectedOption(opt)}
                  className={`rounded-xl border px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition ${tone}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <textarea
            value={textValue}
            disabled={checked !== null}
            onChange={(e) => setTextValue(e.target.value)}
            rows={4}
            placeholder="Type your answer..."
            className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm disabled:bg-slate-50"
          />
        )}

        {question.hint && (
          <div className="mt-3">
            {!showHint ? (
              <button type="button" onClick={() => setShowHint(true)} className="text-xs font-medium text-brand-ink underline">
                💡 Need a hint?
              </button>
            ) : (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">{question.hint}</p>
            )}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {checked === null ? (
          <button
            type="button"
            onClick={handleCheck}
            disabled={!currentValue.trim() || checking}
            className="mt-4 rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {checking ? "Checking..." : "Check answer"}
          </button>
        ) : (
          <div className="mt-4 grid gap-3">
            {/* Real user request 2026-09-08: a wrong answer must be discussed
                right here, before the student can move on - not just marked
                and left behind for a submit-at-the-end summary. */}
            <div
              className={`rounded-xl border p-3 text-sm ${
                checked.correct === true
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : checked.correct === false
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <p className="font-semibold">
                {checked.correct === true ? "Correct!" : checked.correct === false ? "Not quite - let's look at why" : "Thanks"}
              </p>
              {checked.correctAnswerText && (
                <p className="mt-1">
                  The correct answer is <strong>{checked.correctAnswerText}</strong>.
                </p>
              )}
              {checked.explanation && <p className="mt-1">{checked.explanation}</p>}
            </div>
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="w-fit rounded-full bg-brand-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Submitting..." : isLast ? "Finish exam" : "I understand - next question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
