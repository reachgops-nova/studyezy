import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTMassWeightPlayerProps {
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
    question: "Which instrument measures weight based on Hooke's law?",
    options: ["Physical balance", "Common beam balance", "Spring balance", "Digital balance"],
    correctIndex: 2,
    hint: "Hint: A spring balance measures weight because addition of weight produces a proportional extension in the spring according to Hooke's law."
  },
  {
    question: "A person has a mass of 70 kg. What is their weight on the Earth (g = 9.8 ms⁻²) and on the Moon (g = 1.63 ms⁻²)?",
    options: [
      "Earth: 686 N, Moon: 114 N",
      "Earth: 70 N, Moon: 11.6 N",
      "Earth: 490 N, Moon: 70 N",
      "Earth: 686 N, Moon: 686 N"
    ],
    correctIndex: 0,
    hint: "Hint: Weight w = mg. On Earth: 70 × 9.8 = 686 N. On Moon: 70 × 1.63 = 114 N."
  },
  {
    question: "What happens to a person's mass when they travel from the Earth to the Moon?",
    options: [
      "Mass decreases by 6 times",
      "Mass increases due to lower gravity",
      "Mass becomes zero in space",
      "Mass remains exactly the same (70 kg)"
    ],
    correctIndex: 3,
    hint: "Hint: Mass is the amount of matter in a body and remains constant everywhere, whereas weight varies with acceleration due to gravity."
  }
];

export const RCRTMassWeightPlayer: React.FC<RCRTMassWeightPlayerProps> = ({
  conceptName = "1.5 Mass vs Weight & Measuring Balances",
  unitTitle = "Unit 1: Measurement (Pages 8-10)",
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [step, setStep] = useState<RCRTStep>('READ');
  const [phase, setPhase] = useState<Phase>('rcrt_loop');

  // TEST state: Interactive Earth vs Moon Weight Calculator
  const [testMass, setTestMass] = useState<number>(50); // kg
  const [userEarthWeight, setUserEarthWeight] = useState<string>('');
  const [userMoonWeight, setUserMoonWeight] = useState<string>('');
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

  const conceptRuleText = `Mass is a fundamental scalar quantity representing the amount of matter contained in a body, measured in kilograms, and remains constant everywhere. Weight is a derived vector quantity representing the normal force balancing gravity, calculated as w equals m times g, measured in newtons. Gravity on the Moon is one-sixth of Earth gravity. A 70 kg man weighs 686 newtons on Earth and 114 newtons on the Moon, but his mass remains 70 kg. Physical balance measures mass accurately to 10 milligrams, while Spring balance measures weight via Hooke's law.`;

  const expectedEarthWeight = (testMass * 9.8).toFixed(1);
  const expectedMoonWeight = (testMass * 1.63).toFixed(1);

  const handleVerifyCalc = () => {
    const earthVal = parseFloat(userEarthWeight.trim());
    const moonVal = parseFloat(userMoonWeight.trim());
    const expectedE = parseFloat(expectedEarthWeight);
    const expectedM = parseFloat(expectedMoonWeight);

    const earthOk = Math.abs(earthVal - expectedE) < 1.0;
    const moonOk = Math.abs(moonVal - expectedM) < 1.0;

    const correct = earthOk && moonOk;
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
    setUserEarthWeight('');
    setUserMoonWeight('');
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
                <span>📖</span> Step 1: Mass vs Weight Key Differences
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-[#16241f]">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-[#f4f6f1] rounded-lg border-l-4 border-[#9c6f1f]">
                    <span className="font-bold text-[#9c6f1f] block mb-1">Mass (m):</span>
                    <ul className="space-y-1">
                      <li>• Fundamental, Scalar quantity</li>
                      <li>• Amount of matter in a body</li>
                      <li>• SI Unit: kilogram (kg)</li>
                      <li>• <strong>Constant everywhere</strong></li>
                      <li>• Measured using physical balance</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-[#f4f6f1] rounded-lg border-l-4 border-[#16241f]">
                    <span className="font-bold text-[#16241f] block mb-1">Weight (w = mg):</span>
                    <ul className="space-y-1">
                      <li>• Derived, Vector quantity</li>
                      <li>• Normal force balancing gravity</li>
                      <li>• SI Unit: newton (N)</li>
                      <li>• <strong>Varies with location (g)</strong></li>
                      <li>• Measured using spring balance</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-[#9c6f1f]/10 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-[#9c6f1f]">Earth vs Moon Gravity Benchmark:</p>
                  <p>• g(Earth) = 9.8 ms⁻², g(Moon) = 1.63 ms⁻² (1/6th of Earth).</p>
                  <p>• A 70 kg man weighs 686 N on Earth and 114 N on Moon, but his mass is still 70 kg on the Moon.</p>
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
              <h3 className="text-xl font-bold text-white">Mass & Weight Rules Covered</h3>
              <p className="text-xs text-[#f4f6f1]/80 max-w-md mx-auto">
                Recall the definitions, SI units, constancy of mass, and Earth vs Moon weight calculations (w = mg).
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
                🗣️ Step 3: Recite Differences & Gravitational Calculations
              </h3>
              <p className="text-sm text-[#16241f]/80">
                Tap below to listen to the core rules, then practice reciting the differences and Earth/Moon calculations.
              </p>
              <button
                onClick={() => safeNarrate(conceptRuleText)}
                className="w-full py-3 bg-[#9c6f1f]/10 border-2 border-[#9c6f1f] text-[#9c6f1f] hover:bg-[#9c6f1f] hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>🔊 Tap to Practice Reciting Rule</span>
              </button>

              <div className="p-4 bg-[#f4f6f1] rounded-xl text-xs space-y-2 text-[#16241f]">
                <p className="font-bold text-[#9c6f1f]">Memory Review Check:</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>Mass is scalar (kg) and constant everywhere</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>Weight is vector (N) = mg, varies with gravity</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>Physical balance = mass (10 mg); Spring balance = weight (Hooke's law)</span>
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
                  ✍️ Step 4: Earth vs Moon Weight Calculation Task
                </h3>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Adjust the mass slider below, then calculate the body&apos;s weight on Earth (g = 9.8 ms⁻²) and Moon (g = 1.63 ms⁻²).
                </p>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl space-y-4 border border-[#9c6f1f]/10">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#16241f] mb-1">
                    <span>Object Mass (m):</span>
                    <span className="text-[#9c6f1f] font-bold text-sm">{testMass} kg</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={testMass}
                    disabled={testSubmitted}
                    onChange={(e) => setTestMass(parseInt(e.target.value))}
                    className="w-full accent-[#9c6f1f]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#16241f]">
                      Weight on Earth (w = m × 9.8 N):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 490"
                      value={userEarthWeight}
                      disabled={testSubmitted}
                      onChange={(e) => setUserEarthWeight(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9c6f1f]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#16241f]">
                      Weight on Moon (w = m × 1.63 N):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 81.5"
                      value={userMoonWeight}
                      disabled={testSubmitted}
                      onChange={(e) => setUserMoonWeight(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9c6f1f]"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border text-xs text-[#16241f]">
                  <strong>Mass on Moon:</strong> Remains <strong>{testMass} kg</strong> (Mass does not change!).
                </div>
              </div>

              {!testSubmitted ? (
                <button
                  disabled={!userEarthWeight.trim() || !userMoonWeight.trim()}
                  onClick={handleVerifyCalc}
                  className={`w-full py-3 font-bold rounded-xl transition-all shadow ${
                    userEarthWeight.trim() && userMoonWeight.trim()
                      ? 'bg-[#9c6f1f] text-white hover:bg-[#835c18]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Verify Calculations
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
                      ? `Correct! Earth Weight = ${expectedEarthWeight} N, Moon Weight = ${expectedMoonWeight} N!`
                      : `Expected Earth Weight = ${expectedEarthWeight} N (${testMass} × 9.8) and Moon Weight = ${expectedMoonWeight} N (${testMass} × 1.63).`}
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
            ⚖️
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#16241f]">Mass & Weight Mastered!</h3>
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

export default RCRTMassWeightPlayer;
