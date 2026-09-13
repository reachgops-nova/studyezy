import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTSIUnitsPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

interface ItemToClassify {
  id: string;
  name: string;
  symbol: string;
  correctCategory: 'fundamental' | 'derived';
}

const ITEMS_DATA: ItemToClassify[] = [
  { id: '1', name: 'Length (metre)', symbol: 'm', correctCategory: 'fundamental' },
  { id: '2', name: 'Density (mass / volume)', symbol: 'kg m⁻³', correctCategory: 'derived' },
  { id: '3', name: 'Mass (kilogram)', symbol: 'kg', correctCategory: 'fundamental' },
  { id: '4', name: 'Force (mass × acc)', symbol: 'N', correctCategory: 'derived' },
  { id: '5', name: 'Electric Current (ampere)', symbol: 'A', correctCategory: 'fundamental' },
  { id: '6', name: 'Pressure (force / area)', symbol: 'Pa', correctCategory: 'derived' },
];

const QUIZ_QUESTIONS = [
  {
    question: 'Which of the following is one of the 7 SI fundamental quantities in the textbook?',
    options: ['Area', 'Luminous Intensity', 'Density', 'Velocity'],
    correctIndex: 1,
    hint: 'Hint: Fundamental quantities cannot be expressed in terms of any other physical quantities (Length, Mass, Time, Temperature, Electric current, Luminous intensity, Amount of substance).'
  },
  {
    question: 'What is the correct SI derived unit for Density?',
    options: ['kg m⁻³', 'ms⁻¹', 'Nm⁻²', 'kgms⁻¹'],
    correctIndex: 0,
    hint: 'Hint: Density = Mass / Volume = kilogram / cubic metre (kg m⁻³).'
  },
  {
    question: 'Which rule must be followed when expressing SI units named after scientists?',
    options: [
      'The full unit name starts with a capital letter',
      'The full unit name is written in small letters (e.g., newton)',
      'Units are written in plural form like 10 kgs',
      'Degree sign is used with Kelvin temperature'
    ],
    correctIndex: 1,
    hint: 'Hint: Units named after scientists are written with small initial letters (newton, ampere), but their single-letter symbols are capitalized (N, A).'
  }
];

export const RCRTSIUnitsPlayer: React.FC<RCRTSIUnitsPlayerProps> = ({
  conceptName = "1.1 Physical Quantities & SI Units",
  unitTitle = "Unit 1: Measurement (Pages 1-3)",
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [step, setStep] = useState<RCRTStep>('READ');
  const [phase, setPhase] = useState<Phase>('rcrt_loop');

  // TEST state: classification interactive task
  const [classifications, setClassifications] = useState<Record<string, 'fundamental' | 'derived'>>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [testScore, setTestScore] = useState<number>(0);

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

  const conceptRuleText = `Physical quantities are classified into Fundamental and Derived. Fundamental quantities cannot be expressed in terms of any other quantity. There are 7 SI base units: Length (metre, m), Mass (kilogram, kg), Time (second, s), Temperature (kelvin, K), Electric current (ampere, A), Luminous intensity (candela, cd), and Amount of substance (mole, mol). Derived quantities like Area, Volume, Density, Velocity, Force, and Pressure are expressed in terms of fundamental quantities.`;

  const handleClassify = (id: string, category: 'fundamental' | 'derived') => {
    setClassifications(prev => ({ ...prev, [id]: category }));
  };

  const handleVerifyTest = () => {
    let correctCount = 0;
    ITEMS_DATA.forEach(item => {
      if (classifications[item.id] === item.correctCategory) {
        correctCount++;
      }
    });
    setTestScore(correctCount);
    setTestSubmitted(true);
    if (onAttempt) {
      onAttempt(correctCount === ITEMS_DATA.length);
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
    setClassifications({});
    setTestSubmitted(false);
    setTestScore(0);
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

      {/* RCRT Active Loop Phase */}
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
                <span>📖</span> Step 1: Read & Understand Concept Rules
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-[#16241f]/90">
                <p>
                  <strong>Physical Quantity:</strong> A quantity that can be measured, consisting of a numerical value and a unit (e.g., 3 kilogram).
                </p>
                <div className="p-3 bg-[#f4f6f1] rounded-lg border-l-4 border-[#9c6f1f]">
                  <p className="font-bold text-[#9c6f1f] mb-1">7 SI Fundamental Quantities & Units:</p>
                  <ul className="grid grid-cols-2 gap-1 text-xs font-medium">
                    <li>1. Length — metre (m)</li>
                    <li>2. Mass — kilogram (kg)</li>
                    <li>3. Time — second (s)</li>
                    <li>4. Temperature — kelvin (K)</li>
                    <li>5. Electric current — ampere (A)</li>
                    <li>6. Luminous intensity — candela (cd)</li>
                    <li>7. Amount of substance — mole (mol)</li>
                  </ul>
                </div>
                <p>
                  <strong>Derived Quantities:</strong> Quantities expressed in terms of fundamental quantities (e.g., Area m², Volume m³, Density kg·m⁻³, Velocity ms⁻¹, Force N, Pressure Pa).
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
              <h3 className="text-xl font-bold text-white">Content Covered for Active Recall</h3>
              <p className="text-xs text-[#f4f6f1]/80 max-w-md mx-auto">
                The core rule is hidden. Prepare your memory to recite the 7 SI fundamental quantities and how derived quantities differ.
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
                🗣️ Step 3: Recite the Rule Out Loud
              </h3>
              <p className="text-sm text-[#16241f]/80">
                Tap the button below to hear the exact textbook rule, then recite it aloud to reinforce active recall.
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
                  <span>I recalled all 7 SI fundamental units (m, kg, s, K, A, cd, mol)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>I can define derived quantities with examples (Density, Force, Pressure)</span>
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
                  ✍️ Step 4: Interactive Categorization Task
                </h3>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Classify each item below as either a <strong>Fundamental</strong> or <strong>Derived</strong> physical quantity.
                </p>
              </div>

              <div className="space-y-3">
                {ITEMS_DATA.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-[#f4f6f1] rounded-xl border border-[#9c6f1f]/10"
                  >
                    <div>
                      <span className="font-bold text-sm text-[#16241f]">{item.name}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-[#9c6f1f]/10 text-[#9c6f1f] rounded font-mono">
                        {item.symbol}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleClassify(item.id, 'fundamental')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          classifications[item.id] === 'fundamental'
                            ? 'bg-[#16241f] text-white border-[#16241f]'
                            : 'bg-white text-[#16241f] border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        Fundamental
                      </button>
                      <button
                        onClick={() => handleClassify(item.id, 'derived')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          classifications[item.id] === 'derived'
                            ? 'bg-[#9c6f1f] text-white border-[#9c6f1f]'
                            : 'bg-white text-[#16241f] border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        Derived
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!testSubmitted ? (
                <button
                  disabled={Object.keys(classifications).length < ITEMS_DATA.length}
                  onClick={handleVerifyTest}
                  className={`w-full py-3 font-bold rounded-xl transition-all shadow ${
                    Object.keys(classifications).length === ITEMS_DATA.length
                      ? 'bg-[#9c6f1f] text-white hover:bg-[#835c18]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Verify Classification Task
                </button>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-xl border text-center font-bold text-sm ${
                      testScore === ITEMS_DATA.length
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    Task Score: {testScore} / {ITEMS_DATA.length} Correct!
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
              Grounded in Textbook Chapter 1
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
            🏆
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#16241f]">Concept Mastered!</h3>
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

export default RCRTSIUnitsPlayer;
