import React, { useMemo, useState } from 'react';

interface PrefixMachineProps {
  instruction?: string;
  prefixes: { prefix: string; roots: string[] }[];
  challenges: { root: string; prefix: string }[];
  ezyRemedial?: string;
  onAttempt?: (correct: boolean) => void;
  onSuccess?: () => void;
}

export const PrefixMachine: React.FC<PrefixMachineProps> = ({
  instruction,
  prefixes,
  challenges,
  ezyRemedial,
  onAttempt,
  onSuccess,
}) => {
  const [step, setStep] = useState(0);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const options = useMemo(() => prefixes.map((p) => p.prefix), [prefixes]);
  const current = challenges[step];
  const done = step >= challenges.length;

  const handlePick = (prefix: string) => {
    if (!current) return;
    const correct = prefix === current.prefix;
    onAttempt?.(correct);
    if (correct) {
      setShowHint(false);
      if (step + 1 >= challenges.length) {
        setTimeout(() => onSuccess?.(), 1200);
        setStep(step + 1);
      } else {
        setStep(step + 1);
      }
    } else {
      setWrongPick(prefix);
      setShowHint(true);
      setTimeout(() => setWrongPick(null), 500);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
      <div className="mb-3 w-full text-center">
        <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold-bright/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-ink">
          Prefix machine
        </span>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-800">⚙️ Flip the opposite</h3>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {instruction || "Every word below needs the prefix that flips it to its opposite. Pick the matching gear."}
        </p>
      </div>

      {!done && current ? (
        <>
          <div className="relative mb-3 w-full rounded-2xl border border-slate-200/70 bg-slate-50 p-5 text-center">
            <span className="absolute -top-3 left-6 rounded-full bg-brand-ink px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
              Word {step + 1} of {challenges.length}
            </span>
            <p className="pt-1 text-xl font-bold text-slate-800">{current.root}</p>
          </div>

          <div className="flex w-full flex-wrap justify-center gap-2.5">
            {options.map((prefix) => (
              <button
                key={prefix}
                onClick={() => handlePick(prefix)}
                className={`flex h-16 w-16 items-center justify-center rounded-full border text-sm font-bold transition-all ${
                  wrongPick === prefix
                    ? 'animate-shake border-red-300 bg-red-50 text-red-700'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-brand-ink-light hover:bg-slate-50'
                }`}
              >
                {prefix}
              </button>
            ))}
          </div>

          {showHint && ezyRemedial && (
            <div className="mt-3 flex w-full items-start gap-3 border-t border-dashed border-slate-200 pt-3">
              <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/20 bg-brand-gold-bright/10 text-xl">🦘</div>
              <div className="flex-1 rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-sm">
                <p className="text-xs font-medium leading-relaxed text-slate-700">💡 {ezyRemedial}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-1 w-full rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-center shadow-sm animate-bounce">
          <p className="text-xs font-semibold text-emerald-800">🎉 Every gear meshed correctly!</p>
        </div>
      )}
    </div>
  );
};

export default PrefixMachine;
