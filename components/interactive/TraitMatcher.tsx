import React, { useMemo, useState } from 'react';

interface TraitMatcherProps {
  instruction?: string;
  pairs: { character: string; trait: string }[];
  onAttempt?: (correct: boolean) => void;
  onSuccess?: () => void;
}

// Fisher-Yates, seeded off render so it doesn't reshuffle on every keystroke.
function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const TraitMatcher: React.FC<TraitMatcherProps> = ({ instruction, pairs, onAttempt, onSuccess }) => {
  const traits = useMemo(() => shuffled(pairs.map((p) => p.trait)), [pairs]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const allMatched = Object.keys(matched).length === pairs.length;

  const handleTraitTap = (trait: string) => {
    if (!selectedCharacter || Object.values(matched).includes(trait)) return;
    const pair = pairs.find((p) => p.character === selectedCharacter);
    const correct = pair?.trait === trait;
    onAttempt?.(correct);

    if (correct) {
      const next = { ...matched, [selectedCharacter]: trait };
      setMatched(next);
      setSelectedCharacter(null);
      if (Object.keys(next).length === pairs.length) setTimeout(() => onSuccess?.(), 1400);
    } else {
      setWrongFlash(trait);
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
      <div className="mb-3 w-full text-center">
        <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold-bright/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-ink">
          Trait matcher
        </span>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-800">Who's who?</h3>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {instruction || "Tap a character, then tap the trait their actions reveal."}
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {pairs.map((p) => {
            const isMatched = !!matched[p.character];
            const isSelected = selectedCharacter === p.character;
            return (
              <button
                key={p.character}
                disabled={isMatched}
                onClick={() => setSelectedCharacter(p.character)}
                className={`rounded-xl border p-3 text-left text-sm font-semibold transition-all ${
                  isMatched
                    ? 'border-brand-gold/30 bg-brand-gold-bright/10 text-brand-ink'
                    : isSelected
                    ? 'border-brand-ink bg-brand-ink text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-brand-ink-light hover:bg-slate-50'
                }`}
              >
                {p.character} {isMatched && '✓'}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {traits.map((trait) => {
            const isMatched = Object.values(matched).includes(trait);
            return (
              <button
                key={trait}
                disabled={isMatched}
                onClick={() => handleTraitTap(trait)}
                className={`rounded-xl border p-3 text-left text-xs font-medium transition-all ${
                  isMatched
                    ? 'border-brand-gold/30 bg-brand-gold-bright/10 text-brand-ink'
                    : wrongFlash === trait
                    ? 'animate-shake border-red-300 bg-red-50 text-red-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-ink-light hover:bg-slate-50'
                }`}
              >
                {trait} {isMatched && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <div className="mt-3 w-full rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-center shadow-sm animate-bounce">
          <p className="text-xs font-semibold text-emerald-800">🎉 Every trait matched correctly!</p>
        </div>
      )}
    </div>
  );
};

export default TraitMatcher;
