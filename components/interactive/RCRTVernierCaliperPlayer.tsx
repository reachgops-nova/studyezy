import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTVernierCaliperPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

const QUIZ_QUESTIONS = [
  {
    question: 'What is the Least Count (LC) of a standard Vernier Caliper in centimetres?',
    options: ['0.1 cm', '0.01 cm', '0.001 cm', '1.0 cm'],
    correctIndex: 1,
    hint: 'Hint: LC = Value of 1 Main Scale Division / Total Vernier Divisions = 1 mm / 10 = 0.1 mm = 0.01 cm.'
  },
  {
    question: 'If the zero mark of the Vernier scale is shifted to the right of the main scale zero, what type of error and correction occur?',
    options: [
      'Positive zero error, negative zero correction',
      'Negative zero error, positive zero correction',
      'Positive zero error, positive zero correction',
      'No error occurs'
    ],
    correctIndex: 0,
    hint: 'Hint: When Vernier zero is shifted to the right, the instrument over-reads (Positive error), so the correction must be negative.'
  },
  {
    question: 'Calculate the correct reading if MSR = 8 cm, Vernier coincidence = 4, and Positive Zero Error = +0.05 cm.',
    options: ['8.04 cm', '8.09 cm', '7.99 cm', '8.01 cm'],
    correctIndex: 2,
    hint: 'Hint: Correct Reading = MSR + (VC × LC) - Zero Error = 8 + (4 × 0.01) - 0.05 = 8 + 0.04 - 0.05 = 7.99 cm.'
  }
];

export const RCRTVernierCaliperPlayer: React.FC<RCRTVernierCaliperPlayerProps> = ({
  conceptName = "1.3 Vernier Caliper & Least Count",
  unitTitle = "Unit 1: Measurement (Pages 5-6)",
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [step, setStep] = useState<RCRTStep>('READ');
  const [phase, setPhase] = useState<Phase>('rcrt_loop');

  // TEST state: Interactive Vernier Measurement Calculation
  const [msr, setMsr] = useState<number>(5.0); // in cm
  const [vc, setVc] = useState<number>(6); // coinciding division
  const [userCalc, setUserCalc] = useState<string>('');
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [isCalcCorrect, setIsCalcCorrect] = useState<boolean>(false);

  // Checkpoint Quiz State
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const safeNarrate = useCallback((text: string) => {
    if (onNarrate) {
      onNarrate(text);
    }
  }, [onNarrate]);

  const conceptRuleText = `Least count of a Vernier caliper equals 1 Main Scale Division divided by total Vernier Scale divisions, which is 1 mm divided by 10, equal to 0.1 mm or 0.01 cm. If Vernier zero is to the right of Main scale zero, it is a Positive Zero Error and correction is negative. If Vernier zero is to the left, it is a Negative Zero Error and correction is positive. Correct reading equals MSR plus Vernier coincidence times Least Count plus or minus Zero Correction.`;

  const expectedCorrectReading = (msr + vc * 0.01).toFixed(2);

  const handleVerifyCalc = () => {
    const val = parseFloat(userCalc.trim());
    const expected = parseFloat(expectedCorrectReading);
    const correct = Math.abs(val - expected) < 0.001;
    setIsCalcCorrect(correct);
    setTestSubmitted(true);
    if (onAttempt) {
      onAttempt(correct);
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === QUIZ_QUESTIONS[currentQIndex].correctIndex;
    if (onAttempt) {
      onAttempt(isCorrect);
    }

    if (isCorrect) {
      setShowHint(false);
      setQuizScore(prev => prev + 1);
    } else {
      setShowHint(true);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      setPhase('passed');
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleReplay = () => {
    setStep('READ');
    setPhase('rcrt_loop');
    setUserCalc('');
    setTestSubmitted(false);
    setIsCalcCorrect(false);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setQuizScore(0);
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 bg-[#f4f6f1] text-[#16241f] rounded-2xl shadow-md border border-[#9c6f1f]/20 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#9c6f1f]/20">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9c6f1f]">
            {unitTitle}
          </span>
          <h2 className="text-xl font-bold text-[#16241f]">{conceptName}</h2>
        </div>
        <div className="flex items-center gap-1 bg-[#9c6f1f]/10 text-[#9c6f1f] px-3 py-1 rounded-full text-xs font-bold">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>{quizScore} Stars</span>
        </div>
      </div>

      {phase === 'rcrt_loop' && (
        <div>
          {/* Step Indicator */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {(['READ', 'COVER', 'RECITE', 'TEST'] as RCRTStep[]).map((s, idx) => (
              <div
                key={s}
                className={`py-2 text-center text-xs font-bold rounded-lg transition-all ${
                  step === s
                    ? 'bg-[#9c6f1f] text-white shadow-sm'
                    : 'bg-white/60 text-[#16241f]/60 border border-[#9c6f1f]/10'
                }`}
              >
                {idx + 1}. {s}
              </div>
            ))}
          </div>

          {/* STEP 1: READ */}
          {step === 'READ' && (
            <div className="bg-white p-6 rounded-xl border border-[#9c6f1f]/20 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#16241f] flex items-center gap-2">
                <span>📖</span> Step 1: Vernier Caliper Principles
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-[#16241f]">
                <div className="p-3 bg-[#f4f6f1] rounded-lg border-l-4 border-[#9c6f1f]">
                  <p className="font-bold text-[#9c6f1f] mb-1">Least Count (LC) Formula:</p>
                  <p className="font-mono text-xs font-bold bg-white p-2 rounded border">
                    LC = 1 Main Scale Division / Total Vernier Divisions = 1 mm / 10 = 0.1 mm = 0.01 cm
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-[#f4f6f1] rounded-lg">
                    <span className="font-bold text-[#9c6f1f] block mb-1">Positive Zero Error:</span>
                    <span>Vernier 0 shifted to <strong>right</strong> of Main Scale 0. Correction is <strong>negative</strong>.</span>
                  </div>
                  <div className="p-3 bg-[#f4f6f1] rounded-lg">
                    <span className="font-bold text-[#16241f] block mb-1">Negative Zero Error:</span>
                    <span>Vernier 0 shifted to <strong>left</strong> of Main Scale 0. Correction is <strong>positive</strong>.</span>
                  </div>
                </div>

                <p className="text-xs bg-[#9c6f1f]/10 p-2.5 rounded-lg text-[#16241f] font-semibold">
                  Correct Reading = MSR + (VC × LC) ± Zero Correction
                </p>
              </div>
              <button
                onClick={() => setStep('COVER')}
                className="w-full py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to STEP 2: COVER</span>
                <span>🔒</span>
              </button>
            </div>
          )}

          {/* STEP 2: COVER */}
          {step === 'COVER' && (
            <div className="bg-[#16241f] p-8 rounded-xl text-white text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto bg-[#9c6f1f]/20 text-[#9c6f1f] rounded-full flex items-center justify-center text-3xl">
                🔒
              </div>
              <h3 className="text-xl font-bold text-white">Formula & Error Rules Covered</h3>
              <p className="text-xs text-[#f4f6f1]/80 max-w-md mx-auto">
                Recall the Vernier Least Count value (0.01 cm) and the rules for positive/negative zero error correction.
              </p>
              <button
                onClick={() => setStep('RECITE')}
                className="px-6 py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl transition-all shadow"
              >
                Next: STEP 3 (RECITE) 🗣️
              </button>
            </div>
          )}

          {/* STEP 3: RECITE */}
          {step === 'RECITE' && (
            <div className="bg-white p-6 rounded-xl border border-[#9c6f1f]/20 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-[#16241f]">
                🗣️ Step 3: Recite Vernier Formula
              </h3>
              <p className="text-sm text-[#16241f]/80">
                Tap below to listen to the formula, then practice reciting the Least Count equation and Zero Error rules.
              </p>
              <button
                onClick={() => safeNarrate(conceptRuleText)}
                className="w-full py-3 bg-[#9c6f1f]/10 border-2 border-[#9c6f1f] text-[#9c6f1f] hover:bg-[#9c6f1f] hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>🔊 Tap to Practice Reciting Rule</span>
              </button>

              <div className="p-4 bg-[#f4f6f1] rounded-xl text-xs space-y-2 text-[#16241f]">
                <p className="font-bold text-[#9c6f1f]">Self-Recitation Checklist:</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>LC = 1 mm / 10 = 0.1 mm = 0.01 cm</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>Positive Error (right) → Negative Correction</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>Correct Reading = MSR + (VC × LC) ± Zero Correction</span>
                </label>
              </div>

              <button
                onClick={() => setStep('TEST')}
                className="w-full py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl transition-all shadow"
              >
                Proceed to STEP 4: HANDS-ON TEST ✍️
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {step === 'TEST' && (
            <div className="bg-white p-6 rounded-xl border border-[#9c6f1f]/20 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-bold text-[#16241f]">
                  ✍️ Step 4: Virtual Caliper Measurement Task
                </h3>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Adjust the sliders to simulate jaw placement on a pen cap, then calculate the total reading in centimetres.
                </p>
              </div>

              {/* Interactive Caliper Diagram / Controls */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl space-y-4 border border-[#9c6f1f]/10">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#16241f] mb-1">
                      <span>Main Scale Reading (MSR):</span>
                      <span className="text-[#9c6f1f]">{msr.toFixed(1)} cm</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.5"
                      value={msr}
                      disabled={testSubmitted}
                      onChange={(e) => setMsr(parseFloat(e.target.value))}
                      className="w-full accent-[#9c6f1f]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#16241f] mb-1">
                      <span>Vernier Coincidence (VC division):</span>
                      <span className="text-[#9c6f1f]">{vc}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={vc}
                      disabled={testSubmitted}
                      onChange={(e) => setVc(parseInt(e.target.value))}
                      className="w-full accent-[#9c6f1f]"
                    />
                  </div>
                </div>

                {/* SVG Visual Scale Representation */}
                <div className="bg-white p-3 rounded-lg border flex items-center justify-center">
                  <svg className="w-full h-16" viewBox="0 0 300 60">
                    {/* Main Scale background */}
                    <rect x="10" y="10" width="280" height="20" fill="#e2e8f0" rx="3" />
                    {/* Main scale divisions */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                      <g key={d}>
                        <line x1={20 + d * 25} y1="10" x2={20 + d * 25} y2="25" stroke="#16241f" strokeWidth="1.5" />
                        <text x={20 + d * 25} y="8" fontSize="8" textAnchor="middle" fill="#16241f">
                          {d}
                        </text>
                      </g>
                    ))}

                    {/* Vernier scale slider representation */}
                    <rect
                      x={20 + (msr * 15)}
                      y="25"
                      width="60"
                      height="20"
                      fill="#9c6f1f"
                      opacity="0.85"
                      rx="2"
                    />
                    <text
                      x={20 + (msr * 15) + 30}
                      y="38"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#ffffff"
                      textAnchor="middle"
                    >
                      VC={vc}
                    </text>
                  </svg>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#16241f]">
                    Calculate Total Reading (cm):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5.06"
                      value={userCalc}
                      disabled={testSubmitted}
                      onChange={(e) => setUserCalc(e.target.value)}
                      className="flex-1 p-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9c6f1f]"
                    />
                    <span className="self-center text-xs font-bold text-[#16241f]">cm</span>
                  </div>
                  <p className="text-[10px] text-[#16241f]/60">
                    Formula: Reading = MSR + (VC × 0.01 cm)
                  </p>
                </div>
              </div>

              {!testSubmitted ? (
                <button
                  disabled={!userCalc.trim()}
                  onClick={handleVerifyCalc}
                  className={`w-full py-3 font-bold rounded-xl transition-all shadow ${
                    userCalc.trim()
                      ? 'bg-[#9c6f1f] text-white hover:bg-[#835c18]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Verify Calculation
                </button>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-xl border text-center font-bold text-sm ${
                      isCalcCorrect
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {isCalcCorrect
                      ? `Correct! Reading = ${expectedCorrectReading} cm!`
                      : `Expected ${expectedCorrectReading} cm (${msr} + ${vc} × 0.01).`}
                  </div>
                  <button
                    onClick={() => setPhase('checkpoint_quiz')}
                    className="w-full py-3 bg-[#16241f] hover:bg-[#253930] text-white font-bold rounded-xl transition-all shadow flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkpoint Quiz</span>
                    <span>➔</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Checkpoint Quiz Phase */}
      {phase === 'checkpoint_quiz' && (
        <div className="bg-white p-6 rounded-xl border border-[#9c6f1f]/20 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
              Checkpoint Quiz — Q{currentQIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs text-[#16241f]/60 font-semibold">
              Textbook Grounded
            </span>
          </div>

          <h3 className="text-base font-bold text-[#16241f]">
            {QUIZ_QUESTIONS[currentQIndex].question}
          </h3>

          <div className="space-y-2">
            {QUIZ_QUESTIONS[currentQIndex].options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === QUIZ_QUESTIONS[currentQIndex].correctIndex;
              let btnStyle = "bg-[#f4f6f1] text-[#16241f] border-transparent hover:border-[#9c6f1f]/40";

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = "bg-green-100 text-green-900 border-green-400 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-red-100 text-red-900 border-red-400";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all ${btnStyle}`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showHint && (
            <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs space-y-1">
              <span className="font-bold">💡 Textbook Hint:</span>
              <p>{QUIZ_QUESTIONS[currentQIndex].hint}</p>
            </div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNextQuizQuestion}
              className="w-full py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl transition-all shadow"
            >
              {currentQIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question ➔' : 'Complete Quiz 🏆'}
            </button>
          )}
        </div>
      )}

      {/* Passed Phase */}
      {phase === 'passed' && (
        <div className="bg-white p-8 rounded-xl border border-[#9c6f1f]/20 text-center space-y-5 shadow-sm">
          <div className="w-20 h-20 mx-auto bg-[#9c6f1f]/10 rounded-full flex items-center justify-center text-4xl">
            📐
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#16241f]">Vernier Skills Mastered!</h3>
            <p className="text-sm text-[#16241f]/70 mt-1">
              You completed RCRT Active Recall for <strong>{conceptName}</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#f4f6f1] rounded-xl inline-block px-8 border border-[#9c6f1f]/20">
            <span className="text-xs text-[#9c6f1f] font-bold uppercase tracking-wider block mb-1">
              Quiz Score
            </span>
            <span className="text-3xl font-black text-[#16241f]">
              {quizScore} / {QUIZ_QUESTIONS.length} Stars
            </span>
          </div>

          <div>
            <button
              onClick={handleReplay}
              className="px-6 py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl transition-all shadow"
            >
              Replay RCRT Active Loop 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RCRTVernierCaliperPlayer;
