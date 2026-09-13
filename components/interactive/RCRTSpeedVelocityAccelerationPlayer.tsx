import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTSpeedVelocityAccelerationPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

export const RCRTSpeedVelocityAccelerationPlayer: React.FC<RCRTSpeedVelocityAccelerationPlayerProps> = ({
  conceptName = 'Speed, Velocity & Acceleration',
  unitTitle = 'Unit 2: Motion (Pages 16–17)',
  onSuccess,
  onAttempt,
  onNarrate,
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [step, setStep] = useState<RCRTStep>('READ');

  // Recitation state
  const [userNotes, setUserNotes] = useState('');
  const [recited, setRecited] = useState(false);

  // Interactive Test State: Textbook Problem 3
  // Brakes applied produce a = -6 m/s², t = 2 s, initial u = 12 m/s.
  const [inputU, setInputU] = useState('');
  const [inputV, setInputV] = useState('');
  const [inputS, setInputS] = useState('');
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
    'Speed is the rate of change of distance (Speed = Distance / Time, scalar, SI unit m/s). Velocity is the rate of change of displacement (Velocity = Displacement / Time, vector, SI unit m/s). Acceleration is the rate of change of velocity: a = (v - u) / t (vector, SI unit m/s²). If final velocity v is less than initial velocity u, acceleration is negative, called deceleration or retardation.';

  const handlePracticeRecite = () => {
    safeNarrate(keyConceptText);
    setRecited(true);
  };

  const handleVerifyTest = () => {
    const uVal = parseFloat(inputU.trim());
    const vVal = parseFloat(inputV.trim());
    const sVal = parseFloat(inputS.trim());

    // u = 12 m/s, v = 0 m/s (stopped), s = 12 m
    if (uVal === 12 && vVal === 0 && sVal === 12) {
      setTestSuccess(true);
      setTestFeedback('Correct! u = 12 m/s, v = 0 m/s, and distance s = ut + ½ at² = (12 × 2) + ½ (-6 × 4) = 24 - 12 = 12 m.');
      if (onAttempt) onAttempt(true);
    } else {
      setTestSuccess(false);
      setTestFeedback('Re-check calculations: v = u + at → 0 = u + (-6 × 2) → u = 12 m/s. Since the car stops, v = 0. s = (12 × 2) + ½(-6)(2)² = 12 m.');
      if (onAttempt) onAttempt(false);
    }
  };

  const quizQuestions = [
    {
      question: 'What is the SI unit of acceleration?',
      options: ['m/s', 'ms⁻¹', 'ms⁻²', 'N/m'],
      correct: 2,
      hint: 'Hint: Acceleration is rate of change of velocity: (velocity in m/s) / (time in s) = m/s² or ms⁻².',
    },
    {
      question: 'An object travels 16 m in 4 s and then another 16 m in 2 s. What is its average speed?',
      options: ['8.00 ms⁻¹', '5.33 ms⁻¹', '4.00 ms⁻¹', '32.00 ms⁻¹'],
      correct: 1,
      hint: 'Hint: Average speed = Total distance / Total time = (16 + 16) / (4 + 2) = 32 / 6 = 5.33 ms⁻¹.',
    },
    {
      question: 'If a car decelerates with an acceleration value of -4 ms⁻², its deceleration (retardation) is:',
      options: ['-4 ms⁻²', '4 ms⁻²', '0 ms⁻²', '16 ms⁻²'],
      correct: 1,
      hint: 'Hint: Negative acceleration is called deceleration. If acceleration = -4 ms⁻², we state deceleration as 4 ms⁻² (without the minus sign).',
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
    setInputU('');
    setInputV('');
    setInputS('');
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
                <h2 className="text-lg font-bold text-[#9c6f1f]">Speed, Velocity & Acceleration Principles</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                    <span className="font-bold text-[#16241f] block">Speed</span>
                    <p className="text-xs text-[#475569]">Rate of change of distance: <code>Speed = Distance / Time</code> (Scalar, SI unit: ms⁻¹ or m/s).</p>
                    <p className="text-xs text-[#475569] mt-1">Average speed = Total distance travelled / Total time taken.</p>
                  </div>

                  <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                    <span className="font-bold text-[#16241f] block">Velocity</span>
                    <p className="text-xs text-[#475569]">Rate of change of displacement: <code>Velocity = Displacement / Time</code> (Vector, SI unit: ms⁻¹ or m/s).</p>
                  </div>

                  <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                    <span className="font-bold text-[#16241f] block">Acceleration (a)</span>
                    <p className="text-xs text-[#475569]">Rate of change of velocity: <code>a = (v - u) / t</code> (Vector, SI unit: ms⁻² or m/s²).</p>
                    <ul className="text-xs text-[#334155] list-disc pl-4 mt-1 space-y-0.5">
                      <li><strong>Positive Acceleration (a &gt; 0):</strong> Final velocity v &gt; Initial velocity u.</li>
                      <li><strong>Negative Acceleration / Retardation (a &lt; 0):</strong> Final velocity v &lt; Initial velocity u.</li>
                      <li>If acceleration = -2 ms⁻², deceleration = 2 ms⁻².</li>
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
                  Formulas for Speed, Velocity, Acceleration, and Retardation are covered. Prepare to test your recall.
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
                  Recite the formulas for Speed, Velocity, and Acceleration <code>a = (v - u) / t</code> out loud:
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
                    Your Recitation Scratchpad:
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9c6f1f]"
                    placeholder="Type a = (v-u)/t, Speed = distance/time, Retardation..."
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
                <h3 className="text-md font-bold text-[#9c6f1f]">Hands-On Calculation Task (Textbook Problem)</h3>
                <p className="text-sm text-[#475569]">
                  Brakes applied to a car produce a deceleration / negative acceleration of <strong>a = -6 ms⁻²</strong>. The car takes <strong>t = 2 s</strong> to come to a complete stop after the brakes are applied.
                </p>

                {/* SVG Visual Diagram */}
                <div className="flex justify-center bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
                  <svg viewBox="0 0 240 120" className="w-60 h-30">
                    <rect x="0" y="0" width="240" height="120" fill="#f8fafc" rx="8" />
                    {/* Road */}
                    <line x1="20" y1="90" x2="220" y2="90" stroke="#16241f" strokeWidth="3" />
                    
                    {/* Car Start */}
                    <rect x="30" y="65" width="40" height="20" fill="#9c6f1f" rx="3" />
                    <text x="50" y="60" fontSize="10" fill="#16241f" fontWeight="bold" textAnchor="middle">Initial u = ?</text>
                    
                    {/* Motion arrow */}
                    <line x1="80" y1="75" x2="150" y2="75" stroke="#9c6f1f" strokeWidth="2" />
                    <polygon points="150,71 160,75 150,79" fill="#9c6f1f" />
                    <text x="115" y="68" fontSize="10" fill="#9c6f1f" fontWeight="bold" textAnchor="middle">a = -6 ms⁻², t = 2 s</text>

                    {/* Car Stop */}
                    <rect x="170" y="65" width="40" height="20" fill="#16241f" rx="3" />
                    <text x="190" y="60" fontSize="10" fill="#16241f" fontWeight="bold" textAnchor="middle">Stopped (v = ?)</text>

                    {/* Distance s */}
                    <line x1="50" y1="105" x2="190" y2="105" stroke="#16241f" strokeWidth="2" strokeDasharray="3 2" />
                    <text x="120" y="117" fontSize="10" fill="#16241f" fontWeight="bold" textAnchor="middle">Distance s = ?</text>
                  </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      1. Initial velocity u (in ms⁻¹):
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 12"
                      value={inputU}
                      onChange={(e) => setInputU(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      2. Final velocity v (in ms⁻¹):
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 0"
                      value={inputV}
                      onChange={(e) => setInputV(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      3. Distance travelled s (in m):
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 12"
                      value={inputS}
                      onChange={(e) => setInputS(e.target.value)}
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
          <div className="text-5xl">⚡</div>
          <h2 className="text-2xl font-black text-[#16241f]">Kinematics Mastery Unlocked!</h2>
          <p className="text-sm text-[#475569] max-w-md mx-auto">
            You have mastered the concepts of Speed, Velocity, Acceleration, and Retardation.
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

export default RCRTSpeedVelocityAccelerationPlayer;
