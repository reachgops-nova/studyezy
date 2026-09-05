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
    <div className="flex flex-col items-center w-full h-full p-5 bg-[#f4f6f1] rounded-3xl border-3 border-[#16241f] shadow-[8px_8px_0px_0px_rgba(22,36,31,1)] max-w-lg mx-auto overflow-y-auto">
      <div className="text-center mb-3 w-full">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-extrabold uppercase tracking-widest bg-[#9c6f1f]/10 text-[#9c6f1f] border-2 border-[#9c6f1f]/20">
          Trait Matcher
        </span>
        <h3 className="font-serif text-[#16241f] text-xl font-black mt-1.5 tracking-tight">Who's Who?</h3>
        <p className="text-xs text-[#16241f]/75 font-sans font-medium mt-0.5">
          {instruction || "Tap a character, then tap the trait their actions reveal."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="flex flex-col gap-2">
          {pairs.map((p) => {
            const isMatched = !!matched[p.character];
            const isSelected = selectedCharacter === p.character;
            return (
              <button
                key={p.character}
                disabled={isMatched}
                onClick={() => setSelectedCharacter(p.character)}
                className={`p-3 rounded-xl border-3 font-sans font-black text-sm text-left transition-all ${
                  isMatched
                    ? 'bg-[#9c6f1f]/10 border-[#9c6f1f]/30 text-[#9c6f1f]'
                    : isSelected
                    ? 'bg-[#16241f] border-[#16241f] text-white -translate-y-0.5 shadow-md'
                    : 'bg-white border-[#16241f] text-[#16241f] hover:-translate-y-0.5'
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
                className={`p-3 rounded-xl border-3 font-sans text-xs text-left transition-all ${
                  isMatched
                    ? 'bg-[#9c6f1f]/10 border-[#9c6f1f]/30 text-[#9c6f1f]'
                    : wrongFlash === trait
                    ? 'animate-shake bg-red-100 border-red-400 text-red-700'
                    : 'bg-white border-[#16241f]/40 text-[#16241f] hover:border-[#16241f]'
                }`}
              >
                {trait} {isMatched && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <div className="mt-3 bg-green-100 border-2 border-[#16241f] rounded-xl px-4 py-2 text-center animate-bounce shadow-md w-full">
          <p className="text-xs font-sans font-extrabold text-[#16241f]">🎉 Every trait matched correctly!</p>
        </div>
      )}
    </div>
  );
};

export default TraitMatcher;
