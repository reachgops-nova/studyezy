import React from 'react';

export type DecimalSceneVariant = 'split' | 'rodExample' | 'placeValue' | 'doorway';

interface DecimalConceptSceneProps {
  variant: DecimalSceneVariant;
}

// Real user request 2026-09-09: "I want this video to be played after the
// first introduction... play example or visual representing only that
// statement... this give a sequential flow... we can reinvent the video
// idea with limited script for each concept and statement." Replaces the
// standalone pre-roll video (guessed pause points, disconnected from the
// chat, said the intro twice) with small scenes attached directly to each
// checkpoint the chat already pauses at - see AvatarChat.tsx's
// checkpointScenes prop. No video files, no generation quota - same
// CSS-only approach already proven in DecimalPlaceValuePlayer.tsx, so it
// stays visually consistent with the quiz widget that follows.
export const DecimalConceptScene: React.FC<DecimalConceptSceneProps> = ({ variant }) => {
  if (variant === 'split') {
    return (
      <div className="rounded-xl border border-[#16241f]/10 bg-[#f4f6f1] p-3">
        <div className="flex h-10 gap-0.5 overflow-hidden rounded-lg border-2 border-[#16241f]/20 bg-white p-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-1 items-center justify-center rounded bg-[#9c6f1f] text-[8px] font-bold text-white"
              style={{ animation: `fade-in 0.3s ease ${i * 0.08}s both` }}
            >
              0.1
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">1 whole = 10 tenths</p>
      </div>
    );
  }

  if (variant === 'rodExample') {
    return (
      <div className="rounded-xl border border-[#16241f]/10 bg-[#f4f6f1] p-3">
        <div className="flex h-8 gap-0.5 overflow-hidden rounded-lg border-2 border-[#16241f]/20 bg-amber-50 p-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded border border-[#9c6f1f]/30 bg-white"
              style={{ animation: `fade-in 0.25s ease ${i * 0.06}s both` }}
            />
          ))}
        </div>
        <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">1 metre rod, split into 10 pieces</p>
        <p className="text-center text-[10px] font-bold text-[#9c6f1f]">each piece = 0.1 metres</p>
      </div>
    );
  }

  if (variant === 'placeValue') {
    return (
      <div className="rounded-xl border border-[#16241f]/10 bg-[#f4f6f1] p-3">
        <div className="overflow-hidden rounded-lg border-2 border-[#16241f] bg-white">
          <div className="grid grid-cols-3 bg-[#16241f] py-1 text-center text-[9px] font-bold uppercase tracking-wide text-white">
            <div>Ones</div>
            <div className="text-amber-400">•</div>
            <div>Tenths</div>
          </div>
          <div className="grid grid-cols-3 items-center py-2 text-center text-lg font-black text-[#16241f]">
            <div>2</div>
            <div className="text-[#9c6f1f]">•</div>
            <div className="text-[#9c6f1f]">6</div>
          </div>
        </div>
        <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">whole units on the left, tenths on the right</p>
      </div>
    );
  }

  // doorway
  return (
    <div className="rounded-xl border border-[#16241f]/10 bg-[#f4f6f1] p-3">
      <div className="flex items-center justify-center gap-1.5">
        <div className="rounded-lg border-2 border-[#16241f]/20 bg-white px-3 py-2 text-sm font-black text-[#16241f]">4</div>
        <div className="flex h-9 w-5 items-center justify-center rounded border-2 border-dashed border-[#9c6f1f] text-[#9c6f1f]">🚪</div>
        <div className="rounded-lg border-2 border-[#16241f]/20 bg-white px-3 py-2 text-sm font-black text-[#9c6f1f]">9</div>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">the decimal point is the doorway</p>
    </div>
  );
};

export default DecimalConceptScene;
