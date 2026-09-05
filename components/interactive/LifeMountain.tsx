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
    <div className="flex flex-col items-center w-full h-full p-5 bg-[#f4f6f1] rounded-3xl border-3 border-[#16241f] shadow-[8px_8px_0px_0px_rgba(22,36,31,1)] max-w-lg mx-auto overflow-y-auto">
      <div className="text-center mb-3 w-full">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-extrabold uppercase tracking-widest bg-[#9c6f1f]/10 text-[#9c6f1f] border-2 border-[#9c6f1f]/20">
          Life Mountain
        </span>
        <h3 className="font-serif text-[#16241f] text-xl font-black mt-1.5 tracking-tight">⛰️ Climb the Timeline</h3>
        <p className="text-xs text-[#16241f]/75 font-sans font-medium mt-0.5">
          {instruction || "Tap the events in the order they happened, lowest to highest."}
        </p>
      </div>

      <div className="w-full flex flex-col gap-2">
        {order.map((idx) => {
          const cp = checkpoints[idx];
          const isClimbed = climbed.includes(idx);
          const step = climbed.indexOf(idx);
          return (
            <button
              key={idx}
              onClick={() => handleTap(idx)}
              disabled={isClimbed}
              className={`p-3 rounded-xl border-3 font-sans text-left text-xs font-bold transition-all flex items-center gap-3 ${
                isClimbed
                  ? 'bg-green-100 border-[#16241f]/40 text-[#16241f]'
                  : wrongFlash === idx
                  ? 'animate-shake bg-red-100 border-red-400'
                  : 'bg-white border-[#16241f] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(22,36,31,1)]'
              }`}
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                isClimbed ? 'bg-[#16241f] text-white' : 'bg-[#9c6f1f]/10 text-[#9c6f1f]'
              }`}>
                {isClimbed ? step + 1 : '?'}
              </span>
              <span>
                {isClimbed && <span className="text-[#9c6f1f] uppercase mr-1">{cp.adverb},</span>}
                {cp.description}
              </span>
            </button>
          );
        })}
      </div>

      {done && (
        <div className="mt-3 bg-green-100 border-2 border-[#16241f] rounded-xl px-4 py-2 text-center animate-bounce shadow-md w-full">
          <p className="text-xs font-sans font-extrabold text-[#16241f]">🏔️ {ezyOnComplete || 'You reached the summit in perfect order!'}</p>
        </div>
      )}
    </div>
  );
};

export default LifeMountain;
