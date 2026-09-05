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
    <div className="flex flex-col items-center w-full h-full p-5 bg-[#f4f6f1] rounded-3xl border-3 border-[#16241f] shadow-[8px_8px_0px_0px_rgba(22,36,31,1)] max-w-lg mx-auto overflow-y-auto">
      <div className="text-center mb-3 w-full">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-extrabold uppercase tracking-widest bg-[#9c6f1f]/10 text-[#9c6f1f] border-2 border-[#9c6f1f]/20">
          Idiom Connector
        </span>
        <h3 className="font-serif text-[#16241f] text-xl font-black mt-1.5 tracking-tight">🔗 Not What It Sounds Like!</h3>
        <p className="text-xs text-[#16241f]/75 font-sans font-medium mt-0.5">
          {instruction || "Tap an idiom, then tap what it really means."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="flex flex-col gap-2">
          {items.map((it) => {
            const isMatched = !!matched[it.idiom];
            const isSelected = selectedIdiom === it.idiom;
            return (
              <button
                key={it.idiom}
                disabled={isMatched}
                onClick={() => setSelectedIdiom(it.idiom)}
                className={`p-3 rounded-xl border-3 font-sans font-black text-xs italic text-left transition-all ${
                  isMatched
                    ? 'bg-[#9c6f1f]/10 border-[#9c6f1f]/30 text-[#9c6f1f]'
                    : isSelected
                    ? 'bg-[#16241f] border-[#16241f] text-white -translate-y-0.5 shadow-md'
                    : 'bg-white border-[#16241f] text-[#16241f] hover:-translate-y-0.5'
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
                className={`p-3 rounded-xl border-3 font-sans text-xs text-left transition-all ${
                  isMatched
                    ? 'bg-[#9c6f1f]/10 border-[#9c6f1f]/30 text-[#9c6f1f]'
                    : wrongFlash === meaning
                    ? 'animate-shake bg-red-100 border-red-400 text-red-700'
                    : 'bg-white border-[#16241f]/40 text-[#16241f] hover:border-[#16241f]'
                }`}
              >
                {meaning} {isMatched && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <div className="mt-3 bg-green-100 border-2 border-[#16241f] rounded-xl px-4 py-2 text-center animate-bounce shadow-md w-full">
          <p className="text-xs font-sans font-extrabold text-[#16241f]">🎉 You cracked every idiom!</p>
        </div>
      )}
    </div>
  );
};

export default IdiomConnector;
