import React, { useState } from 'react';

interface ClueDetectiveProps {
  sentence: string;
  clues: {
    word: string;
    reveals: 'wink' | 'grin';
    ezySays: string;
  }[];
  onAttempt?: (correct: boolean) => void;
  onSuccess?: () => void;
}

export const ClueDetective: React.FC<ClueDetectiveProps> = ({
  sentence,
  clues,
  onAttempt,
  onSuccess,
}) => {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [activeClue, setActiveClue] = useState<ClueDetectiveProps['clues'][number] | null>(null);

  const allFound = clues.length > 0 && foundWords.size === clues.length;

  const handleClueTap = (clue: ClueDetectiveProps['clues'][number]) => {
    setActiveClue(clue);
    if (foundWords.has(clue.word)) return;
    const next = new Set(foundWords);
    next.add(clue.word);
    setFoundWords(next);

    if (next.size === clues.length) {
      onAttempt?.(true);
      setTimeout(() => onSuccess?.(), 1800);
    }
  };

  // Splits the sentence around the clue words so each one renders as its own
  // tappable button - longest word first so "winked" isn't swallowed by a
  // shorter overlapping match.
  const sentenceParts = React.useMemo(() => {
    if (clues.length === 0) return [sentence];
    const words = [...clues].sort((a, b) => b.word.length - a.word.length).map((c) => c.word);
    const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
    return sentence.split(pattern);
  }, [sentence, clues]);

  const expression = activeClue?.reveals ?? null;

  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center justify-between overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
      {/* Title bar */}
      <div className="relative mb-2 w-full shrink-0 text-center">
        <div className="absolute -top-2 left-2 animate-bounce delay-100 text-2xl">🔍</div>
        <div className="absolute -top-2 right-2 animate-bounce delay-300 text-2xl">✨</div>
        <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold-bright/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-ink">
          Unit 1.2 lesson sandbox
        </span>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-800">
          Ezy's clue detective
        </h3>
        <p className="mx-auto mt-0.5 max-w-xs text-xs font-medium text-slate-500">
          Tap the glowing clue words to see what Jo's face is really telling us!
        </p>
      </div>

      {/* Jo's face scene */}
      <div className="relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-gold-bright/15 to-transparent" />
        <svg viewBox="0 0 200 200" className="w-24 h-24 z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="70" fill="#ffe0b2" stroke="#16241f" strokeWidth="4" />

          {/* Left eye - winks shut when the "wink" clue is active */}
          {expression === 'wink' ? (
            <path d="M 65 90 Q 75 100 85 90" stroke="#16241f" strokeWidth="4" strokeLinecap="round" fill="none" />
          ) : (
            <circle cx="75" cy="92" r="6" fill="#16241f" />
          )}
          <circle cx="125" cy="92" r="6" fill="#16241f" />

          {expression === 'grin' && (
            <>
              <ellipse cx="65" cy="115" rx="8" ry="5" fill="#fca5a5" />
              <ellipse cx="135" cy="115" rx="8" ry="5" fill="#fca5a5" />
            </>
          )}

          {expression === 'grin' ? (
            <path d="M 70 120 Q 100 145 130 120" stroke="#16241f" strokeWidth="5" strokeLinecap="round" fill="none" />
          ) : expression === 'wink' ? (
            <path d="M 80 122 Q 100 130 120 122" stroke="#16241f" strokeWidth="4" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M 85 122 Q 100 126 115 122" stroke="#16241f" strokeWidth="4" strokeLinecap="round" fill="none" />
          )}
        </svg>

        {allFound && (
          <div className="absolute left-4 right-4 top-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-center shadow-sm animate-bounce">
            <p className="text-xs font-semibold text-emerald-800">
              🎉 You cracked the case! Jo is being mischievous!
            </p>
          </div>
        )}
      </div>

      {/* Clue sentence */}
      <div className="relative my-2 w-full shrink-0 rounded-2xl border border-slate-200/70 bg-slate-50 p-3 text-center">
        <span className="absolute -top-3 left-6 rounded-full bg-brand-ink px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
          Clue sentence
        </span>
        <p className="pt-1 text-sm font-medium leading-relaxed text-slate-800 md:text-base">
          {sentenceParts.map((part, i) => {
            const clue = clues.find((c) => c.word.toLowerCase() === part.toLowerCase());
            if (!clue) return <span key={i}>{part}</span>;
            const found = foundWords.has(clue.word);
            return (
              <button
                key={i}
                onClick={() => handleClueTap(clue)}
                className={`inline rounded px-0.5 font-semibold underline decoration-wavy decoration-2 underline-offset-4 transition-all ${
                  found
                    ? 'bg-brand-gold-bright/20 text-brand-ink decoration-brand-gold'
                    : 'text-slate-800 decoration-brand-gold/60 hover:bg-brand-gold-bright/10 animate-pulse'
                }`}
              >
                {part}
              </button>
            );
          })}
        </p>
      </div>

      {/* Mascot Ezy clue reveal */}
      <div className="flex w-full shrink-0 items-start gap-3 border-t border-dashed border-slate-200 pt-2">
        <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/20 bg-brand-gold-bright/10 text-xl font-bold">
          🦘
        </div>
        <div className="relative flex-1 rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-sm">
          <p className="text-xs font-medium leading-relaxed text-slate-700">
            {activeClue ? (
              <span>
                💡 <span className="text-brand-ink">Ezy's clue:</span> {activeClue.ezySays}
              </span>
            ) : (
              "Tap a glowing word in the sentence above to see what it really means!"
            )}
          </p>
          {clues.length > 0 && (
            <p className="mt-2 text-[10px] font-semibold text-slate-400">
              {foundWords.size} of {clues.length} clues found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClueDetective;
