import React, { useState } from 'react';

interface BiographyScannerProps {
  instruction?: string;
  passage: { text: string; feature?: string }[];
  onAttempt?: (correct: boolean) => void;
  onSuccess?: () => void;
}

export const BiographyScanner: React.FC<BiographyScannerProps> = ({ instruction, passage, onAttempt, onSuccess }) => {
  const [found, setFound] = useState<Set<number>>(new Set());
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const taggedCount = passage.filter((seg) => seg.feature).length;
  const allFound = taggedCount > 0 && found.size === taggedCount;

  const handleTap = (index: number, feature: string) => {
    setActiveFeature(feature);
    if (found.has(index)) return;
    const next = new Set(found).add(index);
    setFound(next);
    onAttempt?.(true);
    if (next.size === taggedCount) setTimeout(() => onSuccess?.(), 1600);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
      <div className="mb-3 w-full text-center">
        <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold-bright/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-ink">
          Biography feature scanner
        </span>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-800">🔍 Scan the biography</h3>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {instruction || "Tap the highlighted parts to see which biography feature each one is."}
        </p>
      </div>

      <div className="mb-3 w-full rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
        <p className="text-sm leading-loose text-slate-800">
          {passage.map((seg, i) => {
            if (!seg.feature) return <span key={i}>{seg.text}</span>;
            const isFound = found.has(i);
            return (
              <button
                key={i}
                onClick={() => handleTap(i, seg.feature!)}
                className={`inline rounded px-0.5 font-semibold underline decoration-wavy decoration-2 underline-offset-4 transition-all ${
                  isFound
                    ? 'bg-brand-gold-bright/20 text-brand-ink decoration-brand-gold'
                    : 'text-slate-800 decoration-brand-gold/60 hover:bg-brand-gold-bright/10 animate-pulse'
                }`}
              >
                {seg.text}
              </button>
            );
          })}
        </p>
      </div>

      <div className="flex w-full items-start gap-3 border-t border-dashed border-slate-200 pt-3">
        <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/20 bg-brand-gold-bright/10 text-xl">🦘</div>
        <div className="flex-1 rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-sm">
          <p className="text-xs font-medium leading-relaxed text-slate-700">
            {activeFeature || 'Tap a highlighted phrase above to reveal which biography feature it is!'}
          </p>
          <p className="mt-2 text-[10px] font-semibold text-slate-400">
            {found.size} of {taggedCount} features found
          </p>
        </div>
      </div>

      {allFound && (
        <div className="mt-3 w-full rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-center shadow-sm animate-bounce">
          <p className="text-xs font-semibold text-emerald-800">🎉 You found every biography feature!</p>
        </div>
      )}
    </div>
  );
};

export default BiographyScanner;
