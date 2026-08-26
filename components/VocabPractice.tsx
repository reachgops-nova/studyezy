"use client";

import { useEffect, useState } from "react";
import type { VocabItem } from "@/lib/types";

interface AnsweredState {
  [index: number]: number; // item index -> option index picked
}

export default function VocabPractice({
  onContinue,
  continueLabel = "Continue to lesson",
}: {
  /** When set, renders a primary CTA (in place of the "no pressure" plan-page framing) - used for the
   *  pre-session warm-up in UnitView. Omit for the standalone /plan widget. */
  onContinue?: () => void;
  continueLabel?: string;
}) {
  const [items, setItems] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState<AnsweredState>({});

  async function load() {
    setLoading(true);
    setAnswered({});
    try {
      const res = await fetch("/api/vocab-practice");
      const data = (await res.json()) as { items: VocabItem[] };
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function pick(itemIndex: number, optionIndex: number) {
    if (answered[itemIndex] !== undefined) return;
    setAnswered((prev) => ({ ...prev, [itemIndex]: optionIndex }));
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Vocabulary practice</h2>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="text-xs font-medium text-brand-ink hover:underline disabled:opacity-50"
        >
          🔄 New words
        </button>
      </div>
      <p className="mt-1 text-sm text-slate-500">A few quick synonyms and antonyms - no pressure, just practice.</p>

      {loading ? (
        <p className="mt-4 text-sm text-slate-400">Picking some words...</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">Couldn&apos;t load words right now - try again in a moment.</p>
      ) : (
        <div className="mt-4 grid gap-4">
          {items.map((item, i) => {
            const pickedIndex = answered[i];
            const isAnswered = pickedIndex !== undefined;
            return (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-800">{item.question}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.options.map((opt, oi) => {
                    const isCorrect = oi === item.correctIndex;
                    const isPicked = oi === pickedIndex;
                    let style = "border-slate-300 bg-white text-slate-700 hover:bg-slate-100";
                    if (isAnswered && isCorrect) style = "border-green-500 bg-green-50 text-green-700";
                    else if (isAnswered && isPicked) style = "border-red-400 bg-red-50 text-red-600";
                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => pick(i, oi)}
                        disabled={isAnswered}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-default ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {isAnswered && (
                  <p className={`mt-2 text-xs ${pickedIndex === item.correctIndex ? "text-green-600" : "text-red-500"}`}>
                    {pickedIndex === item.correctIndex
                      ? "Nice - that's right!"
                      : `Not quite - the answer is "${item.options[item.correctIndex]}".`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {onContinue && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <button type="button" onClick={onContinue} className="text-xs font-medium text-slate-400 hover:text-slate-600">
            Skip for now
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95"
          >
            {continueLabel}
          </button>
        </div>
      )}
    </div>
  );
}
