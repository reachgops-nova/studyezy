import React, { useState, useEffect, useRef } from 'react';

type Phase = 'visual_intro' | 'place_value_demo' | 'checkpoint_quiz' | 'passed';

interface DecimalPlaceValuePlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  /** Fired whenever the widget moves to a new phase, after the first render - real user request 2026-09-09: Ezy's voice should narrate what's happening in here, not leave it as a silent island next to the chat. */
  onPhaseChange?: (phase: Phase) => void;
  /** Fired with the full question text (including choices) whenever the quiz shows a new question - real user request 2026-09-09: "the question are not read by the avatar which makes it silent and not sure what to do." A phase-change announcement alone said "time for a quiz" but never the actual question. */
  onQuestionChange?: (text: string) => void;
}

/**
 * Pilot: a hand-built, richer alternative to the generic trait_matcher/
 * predictive_brancher shapes (lib/conceptWidgetGeneration.ts) for ONE
 * concept - real user request 2026-09-09, testing whether a bespoke
 * interactive visual (slider + place-value chart + number line + gated
 * quiz) is worth building more of, versus the cheaper generic/generated
 * widgets. Piloted on cambridge-4-math-1 / concept 1.1 only (see
 * WidgetDispatcher.tsx's special case) before deciding whether to build
 * more like it.
 */
export const DecimalPlaceValuePlayer: React.FC<DecimalPlaceValuePlayerProps> = ({
  conceptName = 'Understanding Tenths and Decimals',
  unitTitle = 'Unit 1: Number',
  onSuccess,
  onAttempt,
  onPhaseChange,
  onQuestionChange,
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onPhaseChange?.(phase);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const [tenthsCount, setTenthsCount] = useState<number>(3); // 0.3
  const [selectedWhole] = useState<number>(1); // 1.3

  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);

  const quizQuestions = [
    {
      question: 'Which decimal number is equal to 3 tenths (3/10)?',
      choices: ['0.03', '0.3', '3.0'],
      correctIndex: 1,
      hint: 'Remember - 1 tenth is 0.1, so 3 tenths is 0.3!',
    },
    {
      question: 'Look at 2.6 on the place value chart. What does the 6 represent?',
      choices: ['6 ones', '6 tenths (0.6)', '6 hundredths'],
      correctIndex: 1,
      hint: 'The digit right after the decimal point (.) is in the tenths column!',
    },
  ];

  useEffect(() => {
    if (phase !== 'checkpoint_quiz') return;
    const q = quizQuestions[quizQuestionIndex];
    if (q) onQuestionChange?.(`${q.question} Your choices are: ${q.choices.join(', ')}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, quizQuestionIndex]);

  const handleQuizAnswer = (choiceIdx: number) => {
    setSelectedQuizChoice(choiceIdx);
    const currentQ = quizQuestions[quizQuestionIndex];
    if (choiceIdx === currentQ.correctIndex) {
      setIsQuizCorrect(true);
      setQuizError(null);
      onAttempt?.(true);

      setTimeout(() => {
        if (quizQuestionIndex < quizQuestions.length - 1) {
          setQuizQuestionIndex((prev) => prev + 1);
          setSelectedQuizChoice(null);
          setIsQuizCorrect(null);
        } else {
          setPhase('passed');
          onSuccess?.();
        }
      }, 1400);
    } else {
      setIsQuizCorrect(false);
      setQuizError(currentQ.hint);
      onAttempt?.(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-5 bg-[#f4f6f1] rounded-2xl border-2 border-[#16241f]/10 shadow-sm max-w-lg mx-auto">
      <div className="w-full flex items-center justify-between border-b border-[#16241f]/10 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-bounce">🔢</span>
          <div>
            <h3 className="font-serif text-[#16241f] text-base font-bold tracking-tight">{conceptName}</h3>
            <p className="text-[10px] text-[#16241f]/60 font-sans uppercase font-bold tracking-wider">{unitTitle}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {['intro', 'demo', 'quiz', 'done'].map((step, idx) => {
            const activeIdx = phase === 'visual_intro' ? 0 : phase === 'place_value_demo' ? 1 : phase === 'checkpoint_quiz' ? 2 : 3;
            return (
              <span
                key={step}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIdx ? 'bg-[#9c6f1f] scale-125' : idx < activeIdx ? 'bg-[#16241f]' : 'bg-[#16241f]/20'
                }`}
              />
            );
          })}
        </div>
      </div>

      {phase === 'visual_intro' && (
        <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4 animate-fade-in my-2">
          <div className="bg-white p-4 rounded-2xl border border-[#16241f]/10 w-full shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-[#9c6f1f] tracking-wider block mb-1">1 Whole Metre Ribbon = 1.0</span>
            <div className="w-full h-8 bg-amber-100 rounded-lg border-2 border-[#16241f]/20 flex overflow-hidden my-2">
              <div className="w-full h-full bg-[#16241f]/15 flex items-center justify-center font-bold text-xs text-[#16241f]">1 Whole Metre (1)</div>
            </div>

            <p className="text-xs text-[#16241f]/80 leading-relaxed mt-2 font-medium">
              When we split <strong>1 whole</strong> into <strong>10 equal parts</strong>, each part is <strong>1/10</strong> or <strong>0.1</strong>!
            </p>

            <div className="w-full h-10 bg-white rounded-lg border-2 border-[#16241f]/20 flex gap-0.5 p-0.5 my-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-full rounded transition-all duration-300 flex items-center justify-center text-[9px] font-bold ${
                    i < tenthsCount ? 'bg-[#9c6f1f] text-white shadow-sm' : 'bg-gray-100 text-[#16241f]/30'
                  }`}
                >
                  {i < tenthsCount ? '0.1' : ''}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between bg-[#f4f6f1] p-3 rounded-xl border border-[#16241f]/10 mt-2">
              <span className="text-xs font-bold text-[#16241f]">
                Shaded tenths: <strong className="text-[#9c6f1f] text-sm">{tenthsCount} / 10</strong> ({(tenthsCount * 0.1).toFixed(1)})
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setTenthsCount((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-white border border-[#16241f]/20 rounded-lg text-xs font-bold hover:bg-gray-100"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setTenthsCount((prev) => Math.min(10, prev + 1))}
                  className="px-3 py-1 bg-[#16241f] text-white rounded-lg text-xs font-bold hover:bg-[#16241f]/90"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase('place_value_demo')}
            className="w-full py-3 bg-[#16241f] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#16241f]/90 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Place Value Chart</span>
            <span>➡️</span>
          </button>
        </div>
      )}

      {phase === 'place_value_demo' && (
        <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4 animate-fade-in my-2">
          <div className="bg-white p-4 rounded-2xl border border-[#16241f]/10 w-full shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-[#9c6f1f] tracking-wider block mb-2">Place Value Chart</span>

            <div className="w-full border-2 border-[#16241f] rounded-xl overflow-hidden bg-white my-2 shadow-sm">
              <div className="grid grid-cols-3 bg-[#16241f] text-white py-2 text-xs font-bold uppercase tracking-wider">
                <div>Ones (1s)</div>
                <div className="text-amber-400 font-black">•</div>
                <div>Tenths (1/10s)</div>
              </div>
              <div className="grid grid-cols-3 py-4 items-center text-lg font-black text-[#16241f]">
                <div className="text-2xl text-[#16241f]">{selectedWhole}</div>
                <div className="text-2xl text-[#9c6f1f] font-black">•</div>
                <div className="text-2xl text-[#9c6f1f]">{tenthsCount}</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-[#16241f] font-medium leading-relaxed my-2">
              We read <strong>{selectedWhole}.{tenthsCount}</strong> as <strong>&quot;{selectedWhole} point {tenthsCount}&quot;</strong>. It has{' '}
              <strong>{selectedWhole} whole</strong> and <strong>{tenthsCount} tenths</strong>.
            </div>

            <div className="w-full mt-3 p-2 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10">
              <span className="text-[10px] font-bold text-[#16241f]/60 uppercase tracking-wider block mb-1">
                Number line (between {selectedWhole} and {selectedWhole + 1})
              </span>
              <div className="relative w-full h-8 flex items-center px-4">
                <div className="w-full h-1 bg-[#16241f]/30 rounded relative flex justify-between items-center">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className={`w-0.5 ${i === 0 || i === 10 ? 'h-4 bg-[#16241f]' : 'h-2 bg-[#16241f]/50'}`} />
                  ))}
                  <div className="absolute -top-3 -ml-2 text-base transition-all duration-300" style={{ left: `${(tenthsCount / 10) * 100}%` }}>
                    📍
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase('checkpoint_quiz')}
            className="w-full py-3 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#9c6f1f]/90 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>🎯 Check Understanding</span>
            <span>➡️</span>
          </button>
        </div>
      )}

      {phase === 'checkpoint_quiz' && (
        <div className="w-full flex-1 flex flex-col items-center justify-center space-y-3 animate-fade-in my-2">
          <div className="bg-white p-4 rounded-2xl border-2 border-[#16241f]/15 w-full shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9c6f1f]">
                Checkpoint question {quizQuestionIndex + 1} of {quizQuestions.length}
              </span>
              <span className="text-xs font-bold text-[#16241f] bg-[#16241f]/5 px-2 py-0.5 rounded-md">⭐ +10 stars</span>
            </div>

            <p className="text-xs md:text-sm font-bold text-[#16241f] leading-snug mb-3">{quizQuestions[quizQuestionIndex].question}</p>

            <div className="space-y-2">
              {quizQuestions[quizQuestionIndex].choices.map((choice, idx) => {
                const isSelected = selectedQuizChoice === idx;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected && isQuizCorrect === true
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : isSelected && isQuizCorrect === false
                          ? 'bg-red-50 border-red-400 text-red-700'
                          : 'bg-[#f4f6f1] border-[#16241f]/10 text-[#16241f] hover:bg-white hover:border-[#16241f]/30'
                    }`}
                  >
                    <span>{choice}</span>
                    {isSelected && isQuizCorrect === true && <span>✅</span>}
                    {isSelected && isQuizCorrect === false && <span>💡</span>}
                  </button>
                );
              })}
            </div>

            {quizError && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium animate-fade-in flex items-center gap-2">
                <span>🦘</span>
                <span>Ezy&apos;s hint: {quizError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === 'passed' && (
        <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4 animate-fade-in text-center my-2">
          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500/30 w-full shadow-md">
            <span className="text-5xl block mb-2 animate-bounce">🎉</span>
            <h4 className="font-serif text-lg font-black text-[#16241f]">Awesome job!</h4>
            <p className="text-xs text-[#16241f]/70 font-medium my-2">
              You worked through <strong>{conceptName}</strong>! Earned +10 stars ⭐
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecimalPlaceValuePlayer;
