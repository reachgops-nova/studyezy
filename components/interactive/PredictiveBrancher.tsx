import React, { useState } from 'react';

interface PredictiveBrancherProps {
  instruction?: string;
  scenario: string;
  choices: { text: string; correct: boolean; feedback: string }[];
  onAttempt?: (correct: boolean) => void;
  onSuccess?: () => void;
}

export const PredictiveBrancher: React.FC<PredictiveBrancherProps> = ({
  instruction,
  scenario,
  choices,
  onAttempt,
  onSuccess,
}) => {
  const [picked, setPicked] = useState<number | null>(null);

  const handlePick = (index: number) => {
    if (picked !== null) return;
    setPicked(index);
    const correct = choices[index].correct;
    onAttempt?.(correct);
    if (correct) setTimeout(() => onSuccess?.(), 1800);
  };

  return (
    <div className="flex h-full w-full max-w-lg flex-col items-center overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft mx-auto">
      <div className="mb-3 w-full text-center">
        <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold-bright/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-ink">
          Predict what happens next
        </span>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-800">🔮 What happens next?</h3>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {instruction || "Read the moment, then choose the most logical prediction."}
        </p>
      </div>

      <div className="relative mb-3 w-full rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
        <span className="absolute -top-3 left-6 rounded-full bg-brand-ink px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
          The scene
        </span>
        <p className="pt-1 text-sm font-medium leading-relaxed text-slate-800">{scenario}</p>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        {choices.map((choice, i) => {
          const isPicked = picked === i;
          const showResult = picked !== null && isPicked;
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={picked !== null}
              className={`rounded-xl border p-3 text-left text-sm font-medium transition-all ${
                showResult
                  ? choice.correct
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'animate-shake border-red-300 bg-red-50'
                  : picked !== null
                  ? 'border-slate-100 bg-white opacity-40'
                  : 'border-slate-200 bg-white hover:border-brand-ink-light hover:bg-slate-50'
              }`}
            >
              {choice.text}
              {showResult && <span className="mt-1.5 block text-xs font-normal text-slate-500">{choice.feedback}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PredictiveBrancher;
