import React, { useMemo, useState } from 'react';

interface LifeMountainProps {
  instruction?: string;
  /** Already bottom-to-top / chronological order - the climb order IS the answer. */
  checkpoints: { adverb: string; description: string; x: number; y: number }[];
  ezyOnComplete?: string;
  onAttempt?: (correct: boolean) => void;
  onSuccess?: () => void;
}

function shuffledIndices(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const LifeMountain: React.FC<LifeMountainProps> = ({
  instruction,
  checkpoints,
  ezyOnComplete,
  onAttempt,
  onSuccess,
}) => {
  const order = useMemo(() => shuffledIndices(checkpoints.length), [checkpoints]);
  const [climbed, setClimbed] = useState<number[]>([]);
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);

  const nextExpected = climbed.length;
  const done = climbed.length === checkpoints.length;

  const handleTap = (index: number) => {
    if (climbed.includes(index) || done) return;
    const correct = index === nextExpected;
    onAttempt?.(correct);
    if (correct) {
      const next = [...climbed, index];
      setClimbed(next);
      if (next.length === checkpoints.length) setTimeout(() => onSuccess?.(), 1600);
    } else {
      setWrongFlash(index);
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
      <div className="mb-3 w-full text-center">
        <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold-bright/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-ink">
          Life mountain
        </span>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-800">⛰️ Climb the timeline</h3>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {instruction || "Tap the events in the order they happened, lowest to highest."}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        {order.map((idx) => {
          const cp = checkpoints[idx];
          const isClimbed = climbed.includes(idx);
          const step = climbed.indexOf(idx);
          return (
            <button
              key={idx}
              onClick={() => handleTap(idx)}
              disabled={isClimbed}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-all ${
                isClimbed
                  ? 'border-emerald-300 bg-emerald-50 text-slate-800'
                  : wrongFlash === idx
                  ? 'animate-shake border-red-300 bg-red-50'
                  : 'border-slate-200 bg-white hover:border-brand-ink-light hover:bg-slate-50'
              }`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                isClimbed ? 'bg-brand-ink text-white' : 'bg-brand-gold-bright/10 text-brand-ink'
              }`}>
                {isClimbed ? step + 1 : '?'}
              </span>
              <span>
                {isClimbed && <span className="mr-1 uppercase text-brand-ink">{cp.adverb},</span>}
                {cp.description}
              </span>
            </button>
          );
        })}
      </div>

      {done && (
        <div className="mt-3 w-full rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-center shadow-sm animate-bounce">
          <p className="text-xs font-semibold text-emerald-800">🏔️ {ezyOnComplete || 'You reached the summit in perfect order!'}</p>
        </div>
      )}
    </div>
  );
};

export default LifeMountain;
