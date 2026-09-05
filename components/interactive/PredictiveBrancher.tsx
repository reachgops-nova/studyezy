import React, { useState } from 'react';

interface PredictiveBrancherProps {
  instruction?: string;
  scenario: string;
  choices: { text: string; correct: boolean; feedback: string }[];
  onAttempt?: (correct: boolean) => void;
  onSuccess?: () => void;
}

export const PredictiveBrancher: React.FC<PredictiveBrancherProps> = ({
  instruction,
  scenario,
  choices,
  onAttempt,
  onSuccess,
}) => {
  const [picked, setPicked] = useState<number | null>(null);

  const handlePick = (index: number) => {
    if (picked !== null) return;
    setPicked(index);
    const correct = choices[index].correct;
    onAttempt?.(correct);
    if (correct) setTimeout(() => onSuccess?.(), 1800);
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-5 bg-[#f4f6f1] rounded-3xl border-3 border-[#16241f] shadow-[8px_8px_0px_0px_rgba(22,36,31,1)] max-w-lg mx-auto overflow-y-auto">
      <div className="text-center mb-3 w-full">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-extrabold uppercase tracking-widest bg-[#9c6f1f]/10 text-[#9c6f1f] border-2 border-[#9c6f1f]/20">
          Predict What Happens Next
        </span>
        <h3 className="font-serif text-[#16241f] text-xl font-black mt-1.5 tracking-tight">🔮 What Happens Next?</h3>
        <p className="text-xs text-[#16241f]/75 font-sans font-medium mt-0.5">
          {instruction || "Read the moment, then choose the most logical prediction."}
        </p>
      </div>

      <div className="w-full p-4 rounded-2xl border-3 border-[#16241f] bg-white shadow-[4px_4px_0px_0px_rgba(22,36,31,1)] mb-3 relative">
        <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-md text-[9px] font-sans font-extrabold uppercase bg-[#16241f] text-white">
          The Scene
        </span>
        <p className="font-sans text-[#16241f] text-sm leading-relaxed font-bold pt-1">{scenario}</p>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        {choices.map((choice, i) => {
          const isPicked = picked === i;
          const showResult = picked !== null && isPicked;
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={picked !== null}
              className={`p-3 rounded-xl border-3 font-sans font-bold text-xs text-left transition-all ${
                showResult
                  ? choice.correct
                    ? 'bg-green-100 border-[#16241f] shadow-none'
                    : 'animate-shake bg-red-100 border-red-500'
                  : picked !== null
                  ? 'opacity-40 border-[#16241f]/20 bg-white'
                  : 'bg-white border-[#16241f] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(22,36,31,1)]'
              }`}
            >
              {choice.text}
              {showResult && <span className="block mt-1.5 font-medium text-[11px] text-[#16241f]/80">{choice.feedback}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PredictiveBrancher;
