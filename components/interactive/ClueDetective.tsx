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
    <div className="flex flex-col items-center justify-between w-full h-full p-4 bg-[#f4f6f1] rounded-3xl border-3 border-[#16241f] shadow-[8px_8px_0px_0px_rgba(22,36,31,1)] max-w-lg mx-auto overflow-y-auto">
      {/* Title bar */}
      <div className="text-center mb-2 relative w-full shrink-0">
        <div className="absolute -top-2 left-2 animate-bounce delay-100 text-2xl">🔍</div>
        <div className="absolute -top-2 right-2 animate-bounce delay-300 text-2xl">✨</div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-extrabold uppercase tracking-widest bg-[#9c6f1f]/10 text-[#9c6f1f] border-2 border-[#9c6f1f]/20">
          Unit 1.2 Lesson Sandbox
        </span>
        <h3 className="font-serif text-[#16241f] text-xl font-black mt-1.5 tracking-tight">
          Ezy's Clue Detective
        </h3>
        <p className="text-xs text-[#16241f]/75 font-sans font-medium mt-0.5 max-w-xs mx-auto">
          Tap the glowing clue words to see what Jo's face is really telling us!
        </p>
      </div>

      {/* Jo's face scene */}
      <div className="relative w-full h-32 shrink-0 flex items-center justify-center bg-white rounded-2xl border-3 border-[#16241f] shadow-inner overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-[#fde68a]/30 to-transparent pointer-events-none" />
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
          <div className="absolute top-3 left-4 right-4 bg-green-100 border-2 border-[#16241f] rounded-xl px-4 py-2 text-center animate-bounce shadow-md">
            <p className="text-xs font-sans font-extrabold text-[#16241f]">
              🎉 You cracked the case! Jo is being mischievous!
            </p>
          </div>
        )}
      </div>

      {/* Clue sentence */}
      <div className="w-full p-3 rounded-2xl border-3 border-[#16241f] bg-white shadow-[4px_4px_0px_0px_rgba(22,36,31,1)] my-2 text-center relative shrink-0">
        <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-md text-[9px] font-sans font-extrabold uppercase bg-[#16241f] text-white">
          Clue Sentence
        </span>
        <p className="font-sans text-[#16241f] text-sm md:text-base leading-relaxed font-bold pt-1">
          {sentenceParts.map((part, i) => {
            const clue = clues.find((c) => c.word.toLowerCase() === part.toLowerCase());
            if (!clue) return <span key={i}>{part}</span>;
            const found = foundWords.has(clue.word);
            return (
              <button
                key={i}
                onClick={() => handleClueTap(clue)}
                className={`inline font-black underline decoration-wavy decoration-2 underline-offset-4 rounded px-0.5 transition-all ${
                  found
                    ? 'bg-[#9c6f1f]/20 text-[#9c6f1f] decoration-[#9c6f1f]'
                    : 'text-[#16241f] decoration-[#9c6f1f]/60 hover:bg-[#9c6f1f]/10 animate-pulse'
                }`}
              >
                {part}
              </button>
            );
          })}
        </p>
      </div>

      {/* Mascot Ezy clue reveal */}
      <div className="w-full shrink-0 border-t-2 border-dashed border-[#16241f]/20 pt-2 flex items-start gap-3">
        <div className="w-12 h-10 rounded-2xl bg-[#9c6f1f]/15 border-2 border-[#16241f] flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-sm">
          🦘
        </div>
        <div className="flex-1 bg-white p-2.5 rounded-2xl border-3 border-[#16241f] relative shadow-[3px_3px_0px_0px_rgba(22,36,31,1)]">
          <div className="absolute -left-2 top-3.5 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-[#16241f] border-b-6 border-b-transparent" />
          <p className="text-xs font-sans text-[#16241f] leading-relaxed font-bold">
            {activeClue ? (
              <span>
                💡 <span className="text-[#9c6f1f]">Ezy's Clue:</span> {activeClue.ezySays}
              </span>
            ) : (
              "Tap a glowing word in the sentence above to see what it really means!"
            )}
          </p>
          {clues.length > 0 && (
            <p className="text-[10px] text-[#16241f]/50 font-sans font-bold mt-2">
              {foundWords.size} of {clues.length} clues found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClueDetective;
