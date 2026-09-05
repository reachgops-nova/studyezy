import React, { useMemo, useState } from 'react';

interface PrefixMachineProps {
  instruction?: string;
  prefixes: { prefix: string; roots: string[] }[];
  challenges: { root: string; prefix: string }[];
  ezyRemedial?: string;
  onAttempt?: (correct: boolean) => void;
  onSuccess?: () => void;
}

export const PrefixMachine: React.FC<PrefixMachineProps> = ({
  instruction,
  prefixes,
  challenges,
  ezyRemedial,
  onAttempt,
  onSuccess,
}) => {
  const [step, setStep] = useState(0);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const options = useMemo(() => prefixes.map((p) => p.prefix), [prefixes]);
  const current = challenges[step];
  const done = step >= challenges.length;

  const handlePick = (prefix: string) => {
    if (!current) return;
    const correct = prefix === current.prefix;
    onAttempt?.(correct);
    if (correct) {
      setShowHint(false);
      if (step + 1 >= challenges.length) {
        setTimeout(() => onSuccess?.(), 1200);
        setStep(step + 1);
      } else {
        setStep(step + 1);
      }
    } else {
      setWrongPick(prefix);
      setShowHint(true);
      setTimeout(() => setWrongPick(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-5 bg-[#f4f6f1] rounded-3xl border-3 border-[#16241f] shadow-[8px_8px_0px_0px_rgba(22,36,31,1)] max-w-lg mx-auto overflow-y-auto">
      <div className="text-center mb-3 w-full">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-extrabold uppercase tracking-widest bg-[#9c6f1f]/10 text-[#9c6f1f] border-2 border-[#9c6f1f]/20">
          Prefix Machine
        </span>
        <h3 className="font-serif text-[#16241f] text-xl font-black mt-1.5 tracking-tight">⚙️ Flip the Opposite</h3>
        <p className="text-xs text-[#16241f]/75 font-sans font-medium mt-0.5">
          {instruction || "Every word below needs the prefix that flips it to its opposite. Pick the matching gear."}
        </p>
      </div>

      {!done && current ? (
        <>
          <div className="w-full p-5 rounded-2xl border-3 border-[#16241f] bg-white shadow-[4px_4px_0px_0px_rgba(22,36,31,1)] mb-3 text-center relative">
            <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-md text-[9px] font-sans font-extrabold uppercase bg-[#16241f] text-white">
              Word {step + 1} of {challenges.length}
            </span>
            <p className="font-sans text-[#16241f] text-xl font-black pt-1">{current.root}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 w-full">
            {options.map((prefix) => (
              <button
                key={prefix}
                onClick={() => handlePick(prefix)}
                className={`w-16 h-16 rounded-full border-3 font-sans font-black text-sm flex items-center justify-center transition-all ${
                  wrongPick === prefix
                    ? 'animate-shake bg-red-100 border-red-400 text-red-700'
                    : 'bg-white border-[#16241f] text-[#16241f] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(22,36,31,1)]'
                }`}
              >
                {prefix}
              </button>
            ))}
          </div>

          {showHint && ezyRemedial && (
            <div className="w-full border-t-2 border-dashed border-[#16241f]/20 pt-3 mt-3 flex items-start gap-3">
              <div className="w-12 h-10 rounded-2xl bg-[#9c6f1f]/15 border-2 border-[#16241f] flex items-center justify-center flex-shrink-0 text-xl shadow-sm">🦘</div>
              <div className="flex-1 bg-white p-2.5 rounded-2xl border-3 border-[#16241f] shadow-[3px_3px_0px_0px_rgba(22,36,31,1)]">
                <p className="text-xs font-sans text-[#16241f] leading-relaxed font-bold">💡 {ezyRemedial}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-1 bg-green-100 border-2 border-[#16241f] rounded-xl px-4 py-2 text-center animate-bounce shadow-md w-full">
          <p className="text-xs font-sans font-extrabold text-[#16241f]">🎉 Every gear meshed correctly!</p>
        </div>
      )}
    </div>
  );
};

export default PrefixMachine;
