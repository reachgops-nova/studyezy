"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuestionPaperDifficulty, QuestionPaperSummary } from "@/lib/types";

const DIFFICULTY_LABELS: Record<QuestionPaperDifficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  tough: "Tough",
};

export default function GeneratePaperButton({
  unitKey,
  summaries,
}: {
  unitKey: string;
  summaries: QuestionPaperSummary[];
}) {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<QuestionPaperDifficulty>("moderate");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function handleClick() {
    setBusy(true);
    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch("/api/resources/generate-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey, difficulty }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Couldn't generate a question paper.");
      setMessage(`Generated ${body.questionCount} questions for the ${DIFFICULTY_LABELS[difficulty]} tier.`);
      router.refresh();
    } catch (e) {
      setIsError(true);
      setMessage(e instanceof Error ? e.message : "Couldn't generate a question paper.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-800">Generate practice question paper</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Builds original questions from this unit&apos;s approved textbook/worksheet/classwork/homework
            material, saved separately per difficulty - regenerating one tier never touches the others.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as QuestionPaperDifficulty)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            {(["easy", "moderate", "tough"] as const).map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABELS[d]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleClick}
            disabled={busy}
            className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
          >
            {busy ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {summaries.map((s) => (
          <span
            key={s.difficulty}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              s.available ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-400"
            }`}
          >
            {DIFFICULTY_LABELS[s.difficulty]}: {s.available ? `${s.questionCount} questions` : "not generated yet"}
          </span>
        ))}
      </div>

      {message && <p className={`mt-2 text-sm ${isError ? "text-red-600" : "text-green-600"}`}>{message}</p>}
    </div>
  );
}
