import React, { useState, useEffect, useCallback } from 'react';

export interface TenthsHundredthsPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type Phase = 'visual_intro' | 'demo' | 'checkpoint_quiz' | 'passed';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: 'In the decimal number 1.25, what do the digits 2 and 5 represent?',
    options: [
      '2 tenths and 5 hundredths',
      '2 hundredths and 5 tenths',
      '25 whole numbers'
    ],
    correctIndex: 0,
    hint: 'The first digit to the right of the decimal point represents tenths (2), and the second digit represents hundredths (5).'
  },
  {
    id: 2,
    questionText: 'How should the ribbon measurement 0.45 metres be read aloud correctly?',
    options: [
      'Zero point forty-five metres',
      'Zero point four five metres',
      'Forty-five tenths of a metre'
    ],
    correctIndex: 1,
    hint: 'We read decimals by saying each digit after the decimal point separately: 0.45 is "zero point four five".'
  },
  {
    id: 3,
    questionText: 'How many hundredths make up one tenth?',
    options: [
      'Ten hundredths make one tenth',
      'One hundred hundredths make one tenth',
      'Five hundredths make one tenth'
    ],
    correctIndex: 0,
    hint: 'A hundredth is ten times smaller than a tenth, so ten hundredths make one tenth.'
  }
];

export const TenthsHundredthsPlayer: React.FC<TenthsHundredthsPlayerProps> = ({
  conceptName = 'Concept 7.1: Tenths and Hundredths in Decimals',
  unitTitle = 'Unit 7: Number (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'decimal_grid' | 'ribbon_measure'>('decimal_grid');
  const [demoStep, setDemoStep] = useState<number>(0);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);

  const safeNarrate = useCallback(
    (text: string) => {
      if (onNarrate) {
        onNarrate(text);
      }
    },
    [onNarrate]
  );

  useEffect(() => {
    if (phase === 'visual_intro') {
      safeNarrate(
        'A decimal number shows parts of a whole using tenths and hundredths after a decimal point. The first digit to the right of the decimal point represents tenths, and the second digit represents hundredths. A hundredth is ten times smaller than a tenth, so ten hundredths make one tenth. Always say the digits after the decimal point one by one: 3.48 is "three point four eight"!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'decimal_grid') {
        const desc =
          demoStep === 0
            ? 'Breaking down 1.25 into place value parts. Click Highlight Place Values!'
            : demoStep === 1
            ? 'In 1.25, the 1 is one whole, the 2 represents two tenths, and the 5 represents five hundredths!'
            : 'We read 1.25 aloud as "one point two five", saying each digit after the decimal point separately!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Measuring a 45 centimetre strip of ribbon in metres. Click Convert to Metres!'
            : demoStep === 1
            ? '45 centimetres equals 4 tenths and 5 hundredths of a metre, written as 0.45 metres!'
            : 'We read 0.45 metres as "zero point four five metres"! A hundredth is ten times smaller than a tenth.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Tenths and Hundredths in Decimals! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'decimal_grid' | 'ribbon_measure') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'decimal_grid') {
      safeNarrate('Breaking down 1.25 into place value parts. Click Highlight Place Values!');
    } else {
      safeNarrate('Measuring a 45 centimetre strip of ribbon in metres. Click Convert to Metres!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'decimal_grid') {
      const desc =
        next === 0
          ? 'Breaking down 1.25 into place value parts. Click Highlight Place Values!'
          : next === 1
          ? 'In 1.25, the 1 is one whole, the 2 represents two tenths, and the 5 represents five hundredths!'
          : 'We read 1.25 aloud as "one point two five", saying each digit after the decimal point separately!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Measuring a 45 centimetre strip of ribbon in metres. Click Convert to Metres!'
          : next === 1
          ? '45 centimetres equals 4 tenths and 5 hundredths of a metre, written as 0.45 metres!'
          : 'We read 0.45 metres as "zero point four five metres"! A hundredth is ten times smaller than a tenth.';
      safeNarrate(desc);
    }
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setShowHint(false);
    const q = QUIZ_QUESTIONS[quizIndex];
    const isCorrect = idx === q.correctIndex;

    if (onAttempt) {
      onAttempt(isCorrect);
    }

    if (isCorrect) {
      setStars((prev) => prev + 1);
      setTimeout(() => {
        if (quizIndex < QUIZ_QUESTIONS.length - 1) {
          setQuizIndex((prev) => prev + 1);
          setSelectedOption(null);
          setShowHint(false);
        } else {
          setPhase('passed');
          if (onSuccess) {
            onSuccess();
          }
        }
      }, 1200);
    } else {
      setShowHint(true);
      safeNarrate(q.hint);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[#f4f6f1] text-[#16241f] rounded-2xl shadow-md border-2 border-[#16241f]/10 transition-all duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#16241f]/10">
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-[#9c6f1f]">{unitTitle}</p>
          <h2 className="text-lg font-bold text-[#16241f] mt-0.5">{conceptName}</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9c6f1f]/10 rounded-full border border-[#9c6f1f]/30">
          <span className="text-base">⭐</span>
          <span className="text-sm font-bold text-[#9c6f1f]">{stars} Stars</span>
        </div>
      </div>

      {/* Phase 1: Visual Intro */}
      {phase === 'visual_intro' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-sm font-bold text-[#9c6f1f] uppercase tracking-wide mb-1">
              Core Definition & Key Rules
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              A <strong>decimal number</strong> shows parts of a whole using tenths and hundredths after a decimal point. 
              The <strong>first digit to the right</strong> represents <strong>tenths</strong>, and the <strong>second digit</strong> represents <strong>hundredths</strong>. 
              A hundredth is ten times smaller than a tenth, so <strong>ten hundredths make one tenth</strong>.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Place Value Example (1.25)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  1 whole + 2 tenths + 5 hundredths = 1.25
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Read aloud as "one point two five", saying digits one by one.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🔢 1.25
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Measurement Example (Ribbon)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  45 centimetres = 0.45 metres
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  4 tenths and 5 hundredths of a metre.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🎗️ 0.45 m
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Tenths & Hundredths Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('decimal_grid')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'decimal_grid'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🔢 Place Value (1.25)
            </button>
            <button
              onClick={() => handleSelectDemoMode('ribbon_measure')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'ribbon_measure'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🎗️ Ribbon Measure (0.45 m)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'decimal_grid' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Understanding 1.25 (Ones, Tenths & Hundredths)
                </h3>

                {/* Visual Place Value Cards & Grid */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex justify-center items-center gap-3 mb-4">
                    {/* Ones Column */}
                    <div
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        demoStep >= 1 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-75">Ones</span>
                      <span className="text-2xl font-black">1</span>
                      <span className="text-[10px] block mt-0.5">1 Whole</span>
                    </div>

                    <span className="text-3xl font-black text-[#9c6f1f]">.</span>

                    {/* Tenths Column */}
                    <div
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        demoStep >= 1 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-75">Tenths (1/10)</span>
                      <span className="text-2xl font-black">2</span>
                      <span className="text-[10px] block mt-0.5">2 Tenths</span>
                    </div>

                    {/* Hundredths Column */}
                    <div
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        demoStep >= 1 ? 'bg-[#9c6f1f]/80 text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-75">Hundredths (1/100)</span>
                      <span className="text-2xl font-black">5</span>
                      <span className="text-[10px] block mt-0.5">5 Hundredths</span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="p-2.5 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-xs font-bold text-[#9c6f1f] animate-fade-in">
                      ✨ In 1.25, the 1 is one whole, 2 means two tenths, and 5 means five hundredths!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🗣️ Always say the digits after the decimal point one by one: "one point two five"!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Highlight Place Values'
                    : demoStep === 1
                    ? '🗣️ Step 2: Practice Read Aloud Rule'
                    : '🔄 Reset 1.25 Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Measuring Ribbon: 45 cm = 0.45 Metres
                </h3>

                {/* Ribbon Measurement Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="flex justify-between text-xs font-bold text-[#16241f]">
                      <span>0 cm (0 m)</span>
                      <span>45 cm (0.45 m)</span>
                      <span>100 cm (1 m)</span>
                    </div>

                    {/* 1-Metre Meter Ruler */}
                    <div className="relative h-10 bg-white border-2 border-[#16241f] rounded-xl overflow-hidden flex items-center p-1">
                      <div
                        className={`h-full bg-[#9c6f1f] rounded-lg transition-all duration-500 flex items-center justify-center text-white text-xs font-bold ${
                          demoStep >= 1 ? 'w-[45%]' : 'w-0'
                        }`}
                      >
                        {demoStep >= 1 && '45 cm Ribbon'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                      <div className="p-2 bg-white border border-[#16241f]/20 rounded-xl">
                        Tenths: <span className="text-[#9c6f1f] font-black">4 tenths</span> (40 cm)
                      </div>
                      <div className="p-2 bg-white border border-[#16241f]/20 rounded-xl">
                        Hundredths: <span className="text-[#9c6f1f] font-black">5 hundredths</span> (5 cm)
                      </div>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      🎗️ 45 cm = 4 tenths and 5 hundredths = 0.45 metres!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🗣️ Read aloud as "zero point four five metres"! Say each digit separately.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Convert Ribbon to Metres (0.45 m)'
                    : demoStep === 1
                    ? '🗣️ Step 2: Practice Read Aloud Rule'
                    : '🔄 Reset Ribbon Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'decimal_grid' ? (
                <>
                  {demoStep === 0 && 'Breaking down 1.25 into place value parts. Click Highlight Place Values!'}
                  {demoStep === 1 && 'In 1.25, the 1 is one whole, the 2 represents two tenths, and the 5 represents five hundredths!'}
                  {demoStep === 2 && 'We read 1.25 aloud as "one point two five", saying each digit after the decimal point separately!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Measuring a 45 centimetre strip of ribbon in metres. Click Convert to Metres!'}
                  {demoStep === 1 && '45 centimetres equals 4 tenths and 5 hundredths of a metre, written as 0.45 metres!'}
                  {demoStep === 2 && 'We read 0.45 metres as "zero point four five metres"! A hundredth is ten times smaller than a tenth.'}
                </>
              )}
            </p>
          </div>

          <button
            onClick={() => setPhase('checkpoint_quiz')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Start Checkpoint Quiz ➔
          </button>
        </div>
      )}

      {/* Phase 3: Checkpoint Quiz */}
      {phase === 'checkpoint_quiz' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f]">
              Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full ${
                    idx === quizIndex
                      ? 'bg-[#9c6f1f]'
                      : idx < quizIndex
                      ? 'bg-[#16241f]'
                      : 'bg-[#16241f]/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Box */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-base font-bold text-[#16241f] leading-snug">
              {QUIZ_QUESTIONS[quizIndex].questionText}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {QUIZ_QUESTIONS[quizIndex].options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectIndex = idx === QUIZ_QUESTIONS[quizIndex].correctIndex;
              let btnClass = 'bg-white text-[#16241f] border-[#16241f]/15 hover:border-[#16241f]/40';

              if (isSelected) {
                if (isCorrectIndex) {
                  btnClass = 'bg-[#16241f] text-white border-[#16241f] shadow-md';
                } else {
                  btnClass = 'bg-red-500/10 text-red-700 border-red-500/40';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 text-left font-semibold text-sm rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {isSelected && isCorrectIndex && <span>✨ Correct!</span>}
                </button>
              );
            })}
          </div>

          {/* Hint Card on Error */}
          {showHint && (
            <div className="p-4 bg-[#9c6f1f]/10 rounded-xl border border-[#9c6f1f]/30 text-xs font-medium text-[#16241f] animate-fade-in">
              <span className="font-bold text-[#9c6f1f] block mb-1">💡 Helpful Hint:</span>
              {QUIZ_QUESTIONS[quizIndex].hint}
            </div>
          )}
        </div>
      )}

      {/* Phase 4: Passed State */}
      {phase === 'passed' && (
        <div className="text-center py-8 space-y-5 animate-fade-in">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-black text-[#16241f]">Concept Mastered!</h3>
          <p className="text-sm text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            Awesome job! You successfully completed the checkpoint quiz for <strong>Tenths and Hundredths in Decimals</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Always say the digits after the decimal point one by one: 3.48 is 'three point four eight'!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('decimal_grid');
                setDemoStep(0);
              }}
              className="py-3 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
            >
              🔄 Replay Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenthsHundredthsPlayer;
