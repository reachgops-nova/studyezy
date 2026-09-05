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
    <div className="flex flex-col items-center w-full h-full p-5 bg-[#f4f6f1] rounded-3xl border-3 border-[#16241f] shadow-[8px_8px_0px_0px_rgba(22,36,31,1)] max-w-lg mx-auto overflow-y-auto">
      <div className="text-center mb-3 w-full">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-extrabold uppercase tracking-widest bg-[#9c6f1f]/10 text-[#9c6f1f] border-2 border-[#9c6f1f]/20">
          Biography Feature Scanner
        </span>
        <h3 className="font-serif text-[#16241f] text-xl font-black mt-1.5 tracking-tight">🔍 Scan the Biography</h3>
        <p className="text-xs text-[#16241f]/75 font-sans font-medium mt-0.5">
          {instruction || "Tap the highlighted parts to see which biography feature each one is."}
        </p>
      </div>

      <div className="w-full p-4 rounded-2xl border-3 border-[#16241f] bg-white shadow-[4px_4px_0px_0px_rgba(22,36,31,1)] mb-3">
        <p className="font-sans text-[#16241f] text-sm leading-loose">
          {passage.map((seg, i) => {
            if (!seg.feature) return <span key={i}>{seg.text}</span>;
            const isFound = found.has(i);
            return (
              <button
                key={i}
                onClick={() => handleTap(i, seg.feature!)}
                className={`inline font-black underline decoration-wavy decoration-2 underline-offset-4 rounded px-0.5 transition-all ${
                  isFound
                    ? 'bg-[#9c6f1f]/20 text-[#9c6f1f] decoration-[#9c6f1f]'
                    : 'text-[#16241f] decoration-[#9c6f1f]/60 hover:bg-[#9c6f1f]/10 animate-pulse'
                }`}
              >
                {seg.text}
              </button>
            );
          })}
        </p>
      </div>

      <div className="w-full border-t-2 border-dashed border-[#16241f]/20 pt-3 flex items-start gap-3">
        <div className="w-12 h-10 rounded-2xl bg-[#9c6f1f]/15 border-2 border-[#16241f] flex items-center justify-center flex-shrink-0 text-xl shadow-sm">🦘</div>
        <div className="flex-1 bg-white p-2.5 rounded-2xl border-3 border-[#16241f] shadow-[3px_3px_0px_0px_rgba(22,36,31,1)]">
          <p className="text-xs font-sans text-[#16241f] leading-relaxed font-bold">
            {activeFeature || 'Tap a highlighted phrase above to reveal which biography feature it is!'}
          </p>
          <p className="text-[10px] text-[#16241f]/50 font-sans font-bold mt-2">
            {found.size} of {taggedCount} features found
          </p>
        </div>
      </div>

      {allFound && (
        <div className="mt-3 bg-green-100 border-2 border-[#16241f] rounded-xl px-4 py-2 text-center animate-bounce shadow-md w-full">
          <p className="text-xs font-sans font-extrabold text-[#16241f]">🎉 You found every biography feature!</p>
        </div>
      )}
    </div>
  );
};

export default BiographyScanner;
