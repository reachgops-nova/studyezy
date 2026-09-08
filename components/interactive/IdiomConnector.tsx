import React, { useMemo, useState } from 'react';

interface IdiomConnectorProps {
  instruction?: string;
  items: { idiom: string; meaning: string }[];
  onAttempt?: (correct: boolean) => void;
  onSuccess?: () => void;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const IdiomConnector: React.FC<IdiomConnectorProps> = ({ instruction, items, onAttempt, onSuccess }) => {
  const meanings = useMemo(() => shuffled(items.map((it) => it.meaning)), [items]);
  const [selectedIdiom, setSelectedIdiom] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const allMatched = Object.keys(matched).length === items.length;

  const handleMeaningTap = (meaning: string) => {
    if (!selectedIdiom || Object.values(matched).includes(meaning)) return;
    const item = items.find((it) => it.idiom === selectedIdiom);
    const correct = item?.meaning === meaning;
    onAttempt?.(correct);

    if (correct) {
      const next = { ...matched, [selectedIdiom]: meaning };
      setMatched(next);
      setSelectedIdiom(null);
      if (Object.keys(next).length === items.length) setTimeout(() => onSuccess?.(), 1400);
    } else {
      setWrongFlash(meaning);
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
      <div className="mb-3 w-full text-center">
        <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold-bright/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-ink">
          Idiom connector
        </span>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-800">🔗 Not what it sounds like!</h3>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {instruction || "Tap an idiom, then tap what it really means."}
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {items.map((it) => {
            const isMatched = !!matched[it.idiom];
            const isSelected = selectedIdiom === it.idiom;
            return (
              <button
                key={it.idiom}
                disabled={isMatched}
                onClick={() => setSelectedIdiom(it.idiom)}
                className={`rounded-xl border p-3 text-left text-xs font-semibold italic transition-all ${
                  isMatched
                    ? 'border-brand-gold/30 bg-brand-gold-bright/10 text-brand-ink'
                    : isSelected
                    ? 'border-brand-ink bg-brand-ink text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-brand-ink-light hover:bg-slate-50'
                }`}
              >
                "{it.idiom}" {isMatched && '✓'}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {meanings.map((meaning) => {
            const isMatched = Object.values(matched).includes(meaning);
            return (
              <button
                key={meaning}
                disabled={isMatched}
                onClick={() => handleMeaningTap(meaning)}
                className={`rounded-xl border p-3 text-left text-xs font-medium transition-all ${
                  isMatched
                    ? 'border-brand-gold/30 bg-brand-gold-bright/10 text-brand-ink'
                    : wrongFlash === meaning
                    ? 'animate-shake border-red-300 bg-red-50 text-red-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-ink-light hover:bg-slate-50'
                }`}
              >
                {meaning} {isMatched && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <div className="mt-3 w-full rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-center shadow-sm animate-bounce">
          <p className="text-xs font-semibold text-emerald-800">🎉 You cracked every idiom!</p>
        </div>
      )}
    </div>
  );
};

export default IdiomConnector;
