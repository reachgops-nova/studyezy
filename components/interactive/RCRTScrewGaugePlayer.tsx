import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTScrewGaugePlayerProps {
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
    question: 'What is the Least Count (LC) of a typical screw gauge in millimetres?',
    options: ['0.1 mm', '0.01 mm', '0.001 mm', '1.0 mm'],
    correctIndex: 1,
    hint: 'Hint: LC = Value of 1 pitch scale division / Total head scale divisions = 1 mm / 100 = 0.01 mm.'
  },
  {
    question: 'If the 95th head scale division coincides with the pitch scale axis when studs touch, what is the zero error?',
    options: [
      'Positive zero error of +0.95 mm',
      'Negative zero error of -0.05 mm',
      'Positive zero error of +0.05 mm',
      'No zero error'
    ],
    correctIndex: 1,
    hint: 'Hint: When zero lies above the pitch scale axis, it is Negative zero error = -(100 - 95) × 0.01 = -0.05 mm.'
  },
  {
    question: 'Find the thickness of a 5 rupee coin if PSR = 1 mm, Head Scale Coincidence = 68, and LC = 0.01 mm (no zero error).',
    options: ['1.68 mm', '1.068 mm', '0.68 mm', '2.68 mm'],
    correctIndex: 0,
    hint: 'Hint: Thickness = PSR + (HSC × LC) = 1 mm + (68 × 0.01 mm) = 1 + 0.68 = 1.68 mm.'
  }
];

export const RCRTScrewGaugePlayer: React.FC<RCRTScrewGaugePlayerProps> = ({
  conceptName = "1.4 Screw Gauge Pitch & Least Count",
  unitTitle = "Unit 1: Measurement (Pages 7-8)",
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [step, setStep] = useState<RCRTStep>('READ');
  const [phase, setPhase] = useState<Phase>('rcrt_loop');

  // TEST state: Interactive Thimble Simulation Task
  const [psr, setPsr] = useState<number>(2); // Pitch Scale Reading in mm
  const [hsc, setHsc] = useState<number>(45); // Head Scale Coincidence
  const [userThickness, setUserThickness] = useState<string>('');
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [isThicknessCorrect, setIsThicknessCorrect] = useState<boolean>(false);

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

  const conceptRuleText = `The screw gauge works on the principle that distance moved by the tip of the screw is directly proportional to the number of rotations. Pitch of the screw is the distance moved for one complete rotation, equal to 1 mm. Least Count equals 1 mm divided by 100 head scale divisions, which is 0.01 mm. If head scale zero lies below the pitch scale axis, it is a Positive Zero Error. If head scale zero lies above the axis, it is a Negative Zero Error equal to minus open-parenthesis 100 minus n close-parenthesis times Least Count.`;

  const expectedThickness = (psr + hsc * 0.01).toFixed(2);

  const handleVerifyThickness = () => {
    const val = parseFloat(userThickness.trim());
    const expected = parseFloat(expectedThickness);
    const correct = Math.abs(val - expected) < 0.001;
    setIsThicknessCorrect(correct);
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
    setUserThickness('');
    setTestSubmitted(false);
    setIsThicknessCorrect(false);
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
                <span>📖</span> Step 1: Screw Gauge Working & Formulas
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-[#16241f]">
                <p>
                  <strong>Working Principle:</strong> Distance moved by tip of screw is directly proportional to number of head scale rotations.
                </p>

                <div className="p-3 bg-[#f4f6f1] rounded-lg border-l-4 border-[#9c6f1f]">
                  <p className="font-bold text-[#9c6f1f] mb-1">Pitch & Least Count Formulas:</p>
                  <p className="font-mono text-xs font-bold bg-white p-2 rounded border mb-1">
                    Pitch = Distance on Pitch Scale / Head Scale Rotations = 1 mm
                  </p>
                  <p className="font-mono text-xs font-bold bg-white p-2 rounded border">
                    LC = 1 Pitch Scale Div / Total Head Divisions = 1 mm / 100 = 0.01 mm
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-[#f4f6f1] rounded-lg">
                    <span className="font-bold text-[#9c6f1f] block mb-1">Positive Error (below axis):</span>
                    <span>ZE = +(n × LC) mm. Zero correction is <strong>negative</strong>.</span>
                  </div>
                  <div className="p-3 bg-[#f4f6f1] rounded-lg">
                    <span className="font-bold text-[#16241f] block mb-1">Negative Error (above axis):</span>
                    <span>ZE = -(100 - n) × LC mm. Zero correction is <strong>positive</strong>.</span>
                  </div>
                </div>
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
              <h3 className="text-xl font-bold text-white">Screw Gauge Rules Covered</h3>
              <p className="text-xs text-[#f4f6f1]/80 max-w-md mx-auto">
                Formulas are covered. Prepare to recite Pitch (1 mm), Least Count (0.01 mm), and Zero Error equations.
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
                🗣️ Step 3: Recite Screw Gauge Principles
              </h3>
              <p className="text-sm text-[#16241f]/80">
                Tap the button to listen, then recite the Pitch and Least Count formulas aloud.
              </p>
              <button
                onClick={() => safeNarrate(conceptRuleText)}
                className="w-full py-3 bg-[#9c6f1f]/10 border-2 border-[#9c6f1f] text-[#9c6f1f] hover:bg-[#9c6f1f] hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>🔊 Tap to Practice Reciting Rule</span>
              </button>

              <div className="p-4 bg-[#f4f6f1] rounded-xl text-xs space-y-2 text-[#16241f]">
                <p className="font-bold text-[#9c6f1f]">Memory Review Points:</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>Pitch = 1 mm; Least Count = 1 mm / 100 = 0.01 mm</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>Negative Zero Error = -(100 - n) × 0.01 mm</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>Total Thickness = PSR + (HSC × 0.01 mm) ± Zero Correction</span>
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
                  ✍️ Step 4: Screw Gauge Wire Thickness Simulation
                </h3>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Rotate/adjust the thimble sliders to measure a thin wire, then compute the thickness in millimetres.
                </p>
              </div>

              {/* Interactive Thimble Controls */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl space-y-4 border border-[#9c6f1f]/10">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#16241f] mb-1">
                      <span>Pitch Scale Reading (PSR):</span>
                      <span className="text-[#9c6f1f]">{psr} mm</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={psr}
                      disabled={testSubmitted}
                      onChange={(e) => setPsr(parseInt(e.target.value))}
                      className="w-full accent-[#9c6f1f]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#16241f] mb-1">
                      <span>Head Scale Coincidence (HSC):</span>
                      <span className="text-[#9c6f1f]">{hsc} divisions</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="99"
                      step="1"
                      value={hsc}
                      disabled={testSubmitted}
                      onChange={(e) => setHsc(parseInt(e.target.value))}
                      className="w-full accent-[#9c6f1f]"
                    />
                  </div>
                </div>

                {/* SVG Visual Representation of Thimble */}
                <div className="bg-white p-3 rounded-lg border flex items-center justify-center">
                  <svg className="w-full h-16" viewBox="0 0 300 60">
                    {/* Sleeve barrel */}
                    <rect x="20" y="20" width="120" height="20" fill="#cbd5e1" rx="2" />
                    <line x1="20" y1="30" x2="140" y2="30" stroke="#16241f" strokeWidth="1.5" />
                    {/* Pitch scale ticks */}
                    {[0, 1, 2, 3, 4, 5].map((tick) => (
                      <line
                        key={tick}
                        x1={30 + tick * 18}
                        y1="22"
                        x2={30 + tick * 18}
                        y2="30"
                        stroke="#16241f"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Rotating Thimble */}
                    <rect x={30 + psr * 18} y="12" width="120" height="36" fill="#9c6f1f" rx="3" />
                    <text
                      x={30 + psr * 18 + 60}
                      y="33"
                      fontSize="11"
                      fontWeight="bold"
                      fill="#ffffff"
                      textAnchor="middle"
                    >
                      HSC = {hsc}
                    </text>
                  </svg>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#16241f]">
                    Calculate Wire Thickness (mm):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 2.45"
                      value={userThickness}
                      disabled={testSubmitted}
                      onChange={(e) => setUserThickness(e.target.value)}
                      className="flex-1 p-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9c6f1f]"
                    />
                    <span className="self-center text-xs font-bold text-[#16241f]">mm</span>
                  </div>
                  <p className="text-[10px] text-[#16241f]/60">
                    Formula: Thickness = PSR + (HSC × 0.01 mm)
                  </p>
                </div>
              </div>

              {!testSubmitted ? (
                <button
                  disabled={!userThickness.trim()}
                  onClick={handleVerifyThickness}
                  className={`w-full py-3 font-bold rounded-xl transition-all shadow ${
                    userThickness.trim()
                      ? 'bg-[#9c6f1f] text-white hover:bg-[#835c18]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Verify Thickness
                </button>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-xl border text-center font-bold text-sm ${
                      isThicknessCorrect
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {isThicknessCorrect
                      ? `Correct! Thickness = ${expectedThickness} mm!`
                      : `Expected ${expectedThickness} mm (${psr} + ${hsc} × 0.01).`}
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
            🔩
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#16241f]">Screw Gauge Mastered!</h3>
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

export default RCRTScrewGaugePlayer;
