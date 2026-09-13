import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTCircularMotionPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

export const RCRTCircularMotionPlayer: React.FC<RCRTCircularMotionPlayerProps> = ({
  conceptName = 'Uniform Circular Motion, Centripetal & Centrifugal Force',
  unitTitle = 'Unit 2: Motion (Pages 21–23)',
  onSuccess,
  onAttempt,
  onNarrate,
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [step, setStep] = useState<RCRTStep>('READ');

  // Recitation state
  const [userNotes, setUserNotes] = useState('');
  const [recited, setRecited] = useState(false);

  // Interactive Test State: Problem 4 from textbook
  // m = 900 kg, v = 10 m/s, r = 25 m
  const [calcA, setCalcA] = useState('');
  const [calcF, setCalcF] = useState('');
  const [testSuccess, setTestSuccess] = useState(false);
  const [testFeedback, setTestFeedback] = useState('');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const safeNarrate = useCallback(
    (text: string) => {
      if (onNarrate) {
        onNarrate(text);
      }
    },
    [onNarrate]
  );

  const keyConceptText =
    'When an object moves with constant speed along a circular path, its velocity changes continuously due to the change in direction. Hence, uniform circular motion is an accelerated motion. Speed is v = 2πr / T. Centripetal acceleration is a = v² / r, directed radially towards the centre. Centripetal force is F = mv² / r, directed towards the centre. Centrifugal force acts away from the centre with the same magnitude, opposite in direction (such as in a washing machine dryer or merry-go-round).';

  const handlePracticeRecite = () => {
    safeNarrate(keyConceptText);
    setRecited(true);
  };

  const handleVerifyTest = () => {
    const aVal = parseFloat(calcA.trim());
    const fVal = parseFloat(calcF.trim());

    // m = 900, v = 10, r = 25
    // a = v² / r = 100 / 25 = 4 m/s²
    // F = m * a = 900 * 4 = 3600 N
    if (aVal === 4 && fVal === 3600) {
      setTestSuccess(true);
      setTestFeedback('Correct! Centripetal acceleration a = v² / r = 10² / 25 = 4 ms⁻², and Net force F = m × a = 900 × 4 = 3600 N.');
      if (onAttempt) onAttempt(true);
    } else {
      setTestSuccess(false);
      setTestFeedback('Check your calculation: a = v² / r = (10)² / 25 = 100 / 25 = 4 ms⁻². Net centripetal force F = m × a = 900 × 4 = 3600 N.');
      if (onAttempt) onAttempt(false);
    }
  };

  const quizQuestions = [
    {
      question: 'Why is Uniform Circular Motion classified as an accelerated motion even if speed is constant?',
      options: [
        'Because speed increases continuously.',
        'Because the direction of motion changes continuously at every point.',
        'Because the path radius increases with time.',
        'Because mass decreases during circular motion.',
      ],
      correct: 1,
      hint: 'Hint: Velocity is a vector (magnitude + direction). Constant speed in a circle means direction changes at every instant, creating centripetal acceleration.',
    },
    {
      question: 'In a circular path, Centripetal Force acts:',
      options: [
        'Tangential to the circle in the direction of motion.',
        'Radially outwards away from the centre.',
        'Radially inwards towards the centre of the circle.',
        'Vertically upwards perpendicular to the plane of motion.',
      ],
      correct: 2,
      hint: 'Hint: Centripetal means "centre-seeking". Centripetal force F = mv² / r acts radially towards the centre.',
    },
    {
      question: 'The outward pull experienced on a ride in a merry-go-round or the spin dryer of a washing machine is due to:',
      options: ['Centripetal force', 'Centrifugal force', 'Gravitational pull', 'Magnetic force'],
      correct: 1,
      hint: 'Hint: Centrifugal force acts in a direction opposite to centripetal force, directed away from the centre of the circular path.',
    },
  ];

  const handleQuizAnswer = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === quizQuestions[quizIndex].correct;
    if (isCorrect) {
      setShowHint(false);
      setScore((prev) => prev + 1);
      if (onAttempt) onAttempt(true);
    } else {
      setShowHint(true);
      if (onAttempt) onAttempt(false);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      setPhase('passed');
      if (onSuccess) onSuccess();
    }
  };

  const handleReplay = () => {
    setPhase('rcrt_loop');
    setStep('READ');
    setUserNotes('');
    setRecited(false);
    setCalcA('');
    setCalcF('');
    setTestSuccess(false);
    setTestFeedback('');
    setQuizIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setScore(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-[#f4f6f1] text-[#16241f] rounded-2xl shadow-xl border border-[#cbd5e1] font-sans">
      {/* Header */}
      <div className="border-b border-[#cbd5e1] pb-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] bg-[#e8eee3] px-3 py-1 rounded-full">
            RCRT Active Recall
          </span>
          <span className="text-xs text-[#64748b] font-medium">{unitTitle}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#16241f] mt-2">{conceptName}</h1>
      </div>

      {/* PHASE 1: RCRT LOOP */}
      {phase === 'rcrt_loop' && (
        <div>
          {/* Step Indicator */}
          <div className="grid grid-cols-4 gap-2 mb-6 text-center text-xs font-bold">
            <div className={`py-2 rounded-lg transition-all ${step === 'READ' ? 'bg-[#16241f] text-white shadow-md' : 'bg-[#e2e8f0] text-[#64748b]'}`}>
              1. READ
            </div>
            <div className={`py-2 rounded-lg transition-all ${step === 'COVER' ? 'bg-[#16241f] text-white shadow-md' : 'bg-[#e2e8f0] text-[#64748b]'}`}>
              2. COVER
            </div>
            <div className={`py-2 rounded-lg transition-all ${step === 'RECITE' ? 'bg-[#16241f] text-white shadow-md' : 'bg-[#e2e8f0] text-[#64748b]'}`}>
              3. RECITE
            </div>
            <div className={`py-2 rounded-lg transition-all ${step === 'TEST' ? 'bg-[#16241f] text-white shadow-md' : 'bg-[#e2e8f0] text-[#64748b]'}`}>
              4. TEST
            </div>
          </div>

          {/* STEP 1: READ */}
          {step === 'READ' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-[#cbd5e1] shadow-sm space-y-3 leading-relaxed">
                <h2 className="text-lg font-bold text-[#9c6f1f]">Circular Motion & Force Concepts</h2>

                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                  <span className="font-bold text-[#16241f] block text-sm">Uniform Circular Motion (UCM)</span>
                  <p className="text-xs text-[#475569]">
                    An object moving with constant speed along a circular path undergoes <strong>accelerated motion</strong> because its direction changes continuously at every point.
                  </p>
                  <p className="text-xs text-[#16241f] font-mono mt-1">
                    Speed v = Circumference / Time = 2πr / T
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                    <span className="font-bold text-[#16241f] block text-sm">Centripetal Force (F_c)</span>
                    <ul className="text-xs text-[#334155] list-disc pl-4 space-y-1">
                      <li>Directed <strong>radially towards the centre</strong>.</li>
                      <li>Centripetal acceleration: <code>a = v² / r</code></li>
                      <li>Magnitude: <code>F = ma = mv² / r</code></li>
                      <li>Examples: Gravity orbiting Earth, string tension.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                    <span className="font-bold text-[#16241f] block text-sm">Centrifugal Force</span>
                    <ul className="text-xs text-[#334155] list-disc pl-4 space-y-1">
                      <li>Acts <strong>radially away from the centre</strong>.</li>
                      <li>Opposite in direction to centripetal force.</li>
                      <li>Same magnitude <code>F = mv² / r</code>.</li>
                      <li>Examples: Dryer in washing machine, merry-go-round.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('COVER')}
                className="w-full py-3 bg-[#9c6f1f] text-white font-bold rounded-xl hover:bg-[#835b18] transition-colors shadow-md"
              >
                Cover Content & Proceed to Recite
              </button>
            </div>
          )}

          {/* STEP 2: COVER */}
          {step === 'COVER' && (
            <div className="space-y-6 text-center py-8">
              <div className="p-8 bg-[#16241f] text-white rounded-xl shadow-lg space-y-3">
                <div className="text-4xl">🔒</div>
                <h3 className="text-xl font-bold">Content Covered!</h3>
                <p className="text-sm text-[#cbd5e1] max-w-md mx-auto">
                  Principles of UCM, centripetal acceleration, and centripetal vs centrifugal force are hidden.
                </p>
              </div>
              <button
                onClick={() => setStep('RECITE')}
                className="py-3 px-8 bg-[#9c6f1f] text-white font-bold rounded-xl hover:bg-[#835b18] transition-colors shadow-md"
              >
                Start Recitation Step
              </button>
            </div>
          )}

          {/* STEP 3: RECITE */}
          {step === 'RECITE' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-[#cbd5e1] shadow-sm space-y-4">
                <h3 className="text-md font-bold text-[#16241f]">Active Memory Practice</h3>
                <p className="text-sm text-[#475569]">
                  Recite the formulas for speed <code>v = 2πr/T</code>, acceleration <code>a = v²/r</code>, and force <code>F = mv²/r</code> out loud:
                </p>
                <button
                  onClick={handlePracticeRecite}
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-[#e8eee3] text-[#16241f] font-bold border border-[#9c6f1f] rounded-xl hover:bg-[#d9e4d3] transition-colors"
                >
                  <span>🔊</span>
                  <span>Tap to Practice Reciting (Audio Voice Guidance)</span>
                </button>
                {recited && (
                  <p className="text-xs text-[#16a34a] font-semibold text-center">
                    ✓ Voice narration played.
                  </p>
                )}
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Your Recitation Notes:
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9c6f1f]"
                    placeholder="Type F = mv²/r, centripetal = towards centre, centrifugal = away..."
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => setStep('TEST')}
                className="w-full py-3 bg-[#9c6f1f] text-white font-bold rounded-xl hover:bg-[#835b18] transition-colors shadow-md"
              >
                Proceed to Interactive TEST Task
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {step === 'TEST' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-[#cbd5e1] shadow-sm space-y-4">
                <h3 className="text-md font-bold text-[#9c6f1f]">Hands-On Centripetal Force Calculation (Textbook Problem 4)</h3>
                <p className="text-sm text-[#475569]">
                  A <strong>900 kg car</strong> moving at <strong>10 ms⁻¹</strong> takes a turn around a circular track with a radius of <strong>25 m</strong>.
                </p>

                {/* SVG Visual Diagram */}
                <div className="flex justify-center bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
                  <svg viewBox="0 0 200 150" className="w-50 h-38">
                    <rect x="0" y="0" width="200" height="150" fill="#f8fafc" rx="8" />
                    {/* Circle Track */}
                    <circle cx="100" cy="75" r="50" stroke="#cbd5e1" strokeWidth="3" fill="none" strokeDasharray="4 2" />
                    
                    {/* Center point */}
                    <circle cx="100" cy="75" r="4" fill="#16241f" />
                    <text x="100" y="90" fontSize="10" fill="#16241f" fontWeight="bold" textAnchor="middle">Centre</text>

                    {/* Radius line */}
                    <line x1="100" y1="75" x2="150" y2="75" stroke="#16241f" strokeWidth="2" />
                    <text x="125" y="70" fontSize="9" fill="#16241f" fontWeight="bold" textAnchor="middle">r = 25 m</text>

                    {/* Car at (150, 75) */}
                    <rect x="145" y="65" width="16" height="20" fill="#9c6f1f" rx="3" />
                    
                    {/* Velocity Tangent Vector (Up) */}
                    <line x1="153" y1="65" x2="153" y2="30" stroke="#9c6f1f" strokeWidth="2" />
                    <polygon points="153,25 149,32 157,32" fill="#9c6f1f" />
                    <text x="162" y="45" fontSize="9" fill="#9c6f1f" fontWeight="bold">v = 10 ms⁻¹</text>

                    {/* Centripetal Force Vector (Inwards) */}
                    <line x1="145" y1="75" x2="115" y2="75" stroke="#16241f" strokeWidth="2" />
                    <polygon points="110,75 117,71 117,79" fill="#16241f" />
                    <text x="130" y="87" fontSize="9" fill="#16241f" fontWeight="bold">Fc = ?</text>
                  </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      1. Centripetal acceleration a (a = v² / r in ms⁻²):
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 4"
                      value={calcA}
                      onChange={(e) => setCalcA(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      2. Net Centripetal Force F (F = m × a in N):
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 3600"
                      value={calcF}
                      onChange={(e) => setCalcF(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerifyTest}
                  className="w-full py-2 bg-[#16241f] text-white font-bold rounded-lg hover:bg-[#0f1712] transition-colors"
                >
                  Verify Calculations
                </button>

                {testFeedback && (
                  <div
                    className={`p-3 rounded-lg text-xs font-bold ${
                      testSuccess ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef2f2] text-[#b91c1c]'
                    }`}
                  >
                    {testFeedback}
                  </div>
                )}
              </div>

              {testSuccess && (
                <button
                  onClick={() => setPhase('checkpoint_quiz')}
                  className="w-full py-3 bg-[#9c6f1f] text-white font-bold rounded-xl hover:bg-[#835b18] transition-colors shadow-md"
                >
                  Proceed to Checkpoint Quiz →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: CHECKPOINT QUIZ */}
      {phase === 'checkpoint_quiz' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#cbd5e1]">
            <span className="text-xs font-bold text-[#64748b]">
              Question {quizIndex + 1} of {quizQuestions.length}
            </span>
            <span className="text-xs font-bold text-[#9c6f1f]">Score: {score} / 3 ⭐</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#cbd5e1] shadow-sm space-y-4">
            <h3 className="text-md font-bold text-[#16241f]">
              {quizQuestions[quizIndex].question}
            </h3>

            <div className="space-y-2">
              {quizQuestions[quizIndex].options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === quizQuestions[quizIndex].correct;
                let btnStyle = 'bg-[#f8fafc] text-[#334155] border-[#cbd5e1] hover:bg-[#e2e8f0]';
                if (selectedOption !== null) {
                  if (isSelected) {
                    btnStyle = isCorrect ? 'bg-[#dcfce7] text-[#15803d] border-[#16a34a]' : 'bg-[#fef2f2] text-[#b91c1c] border-[#dc2626]';
                  } else if (isCorrect) {
                    btnStyle = 'bg-[#dcfce7] text-[#15803d] border-[#16a34a]';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showHint && (
              <div className="p-3 bg-[#fffbeb] text-[#b45309] rounded-lg text-xs font-medium border border-[#fde68a]">
                {quizQuestions[quizIndex].hint}
              </div>
            )}
          </div>

          {selectedOption !== null && (
            <button
              onClick={handleNextQuiz}
              className="w-full py-3 bg-[#9c6f1f] text-white font-bold rounded-xl hover:bg-[#835b18] transition-colors shadow-md"
            >
              {quizIndex < quizQuestions.length - 1 ? 'Next Question →' : 'Complete Quiz & View Mastery'}
            </button>
          )}
        </div>
      )}

      {/* PHASE 3: PASSED */}
      {phase === 'passed' && (
        <div className="text-center py-8 space-y-6 bg-white p-6 rounded-xl border border-[#cbd5e1] shadow-md">
          <div className="text-5xl">🔄</div>
          <h2 className="text-2xl font-black text-[#16241f]">Circular Motion Mastery!</h2>
          <p className="text-sm text-[#475569] max-w-md mx-auto">
            You have mastered Uniform Circular Motion, Centripetal Force, and Centrifugal Force concepts.
          </p>
          <div className="inline-block bg-[#f8fafc] px-6 py-3 rounded-xl border border-[#e2e8f0] font-bold text-lg text-[#9c6f1f]">
            Final Score: {score} / 3 Stars ⭐
          </div>
          <div>
            <button
              onClick={handleReplay}
              className="py-3 px-8 bg-[#16241f] text-white font-bold rounded-xl hover:bg-[#0f1712] transition-colors shadow-md"
            >
              Replay RCRT Active Loop 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RCRTCircularMotionPlayer;
