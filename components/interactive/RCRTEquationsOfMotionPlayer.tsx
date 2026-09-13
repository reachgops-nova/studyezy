import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTEquationsOfMotionPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

export const RCRTEquationsOfMotionPlayer: React.FC<RCRTEquationsOfMotionPlayerProps> = ({
  conceptName = 'Equations of Motion & Free Fall',
  unitTitle = 'Unit 2: Motion (Pages 19–21)',
  onSuccess,
  onAttempt,
  onNarrate,
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [step, setStep] = useState<RCRTStep>('READ');

  // Recitation state
  const [userNotes, setUserNotes] = useState('');
  const [recited, setRecited] = useState(false);

  // Interactive Test State: Free fall calculation (h = 20 m, g = 10 m/s²)
  const [calcV, setCalcV] = useState('');
  const [calcT, setCalcT] = useState('');
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
    'Newton derived three equations of motion for uniform acceleration: First equation is v = u + at, Second equation is s = ut + ½ at², Third equation is v² = u² + 2as. For a freely falling body dropped from rest, initial velocity u = 0 and acceleration a = +g. The free fall equations become v = gt, s = ½ gt², and v² = 2gh. All bodies fall at the same rate in vacuum regardless of mass. When thrown vertically upward, a = -g and velocity at highest point is zero.';

  const handlePracticeRecite = () => {
    safeNarrate(keyConceptText);
    setRecited(true);
  };

  const handleVerifyTest = () => {
    const vVal = parseFloat(calcV.trim());
    const tVal = parseFloat(calcT.trim());

    // h = 20 m, g = 10 m/s²
    // v² = 2gh = 2 * 10 * 20 = 400 => v = 20 m/s
    // s = ½ gt² => 20 = 5 t² => t = 2 s
    if (vVal === 20 && tVal === 2) {
      setTestSuccess(true);
      setTestFeedback('Outstanding! v = sqrt(2gh) = sqrt(2 × 10 × 20) = 20 ms⁻¹, and time t = v / g = 20 / 10 = 2 s.');
      if (onAttempt) onAttempt(true);
    } else {
      setTestSuccess(false);
      setTestFeedback('Try again. Use v² = 2gh → v² = 2(10)(20) = 400 → v = 20 ms⁻¹. Then t = v / g = 20 / 10 = 2 s.');
      if (onAttempt) onAttempt(false);
    }
  };

  const quizQuestions = [
    {
      question: 'Which equation represents the Third Equation of Motion?',
      options: ['v = u + at', 's = ut + ½ at²', 'v² = u² + 2as', 'F = ma'],
      correct: 2,
      hint: 'Hint: First equation is v = u + at, Second is s = ut + ½ at², Third is v² = u² + 2as.',
    },
    {
      question: 'When an object is thrown vertically upwards into space, at its highest point:',
      options: [
        'Velocity is finite and acceleration is zero.',
        'Velocity is zero and acceleration is zero.',
        'Velocity is zero and acceleration is finite (-g).',
        'Velocity is maximum and acceleration is -g.',
      ],
      correct: 2,
      hint: 'Hint: At the peak of its trajectory, a thrown body momentarily stops (v = 0 ms⁻¹), but gravity continues to pull it downward with acceleration -g.',
    },
    {
      question: 'A racing car starting from rest (u = 0) accelerates uniformly at 4 ms⁻². What distance does it cover in 10 s?',
      options: ['40 m', '100 m', '200 m', '400 m'],
      correct: 2,
      hint: 'Hint: Use s = ut + ½ at². Since u = 0, s = 0 + ½ × 4 × (10)² = 2 × 100 = 200 m.',
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
    setCalcV('');
    setCalcT('');
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
                <h2 className="text-lg font-bold text-[#9c6f1f]">Newton's Equations of Motion & Free Fall</h2>

                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                  <span className="font-bold text-[#16241f] block text-sm">Three Equations of Motion (Uniform Acceleration a):</span>
                  <div className="font-mono text-xs bg-[#e2e8f0] p-2 rounded text-[#16241f] space-y-1">
                    <div>1. Velocity-Time: v = u + at</div>
                    <div>2. Displacement-Time: s = ut + ½ at²</div>
                    <div>3. Velocity-Displacement: v² = u² + 2as</div>
                  </div>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1 text-xs">
                  <span className="font-bold text-[#16241f] block text-sm">Motion of a Freely Falling Body (Dropped from rest, u = 0, a = +g):</span>
                  <p className="text-[#475569]">
                    In vacuum, all bodies (heavy stone or light eraser) fall at the exact same rate regardless of mass, because free fall acceleration <code>g</code> is independent of mass.
                  </p>
                  <div className="font-mono bg-[#e2e8f0] p-2 rounded text-[#16241f] space-y-1 mt-1">
                    <div>1. v = gt</div>
                    <div>2. s = ½ gt²</div>
                    <div>3. v² = 2gh</div>
                  </div>
                  <p className="text-[#475569] mt-1">
                    <strong>Thrown Vertically Upward:</strong> <code>a = -g</code>. At the highest point, velocity <code>v = 0 ms⁻¹</code>, while acceleration equals <code>g</code> downwards.
                  </p>
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
                  The equations of motion and free fall rules are hidden. Prepare to recite them from memory.
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
                  Recite all 3 equations of motion and free-fall conditions out loud:
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
                    placeholder="Type v = u+at, s = ut+0.5at², v² = u²+2as..."
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
                <h3 className="text-md font-bold text-[#9c6f1f]">Hands-On Free Fall Simulator</h3>
                <p className="text-sm text-[#475569]">
                  A ball is gently dropped from the top of a tower of height <strong>h = 20 m</strong> (u = 0 ms⁻¹). Its velocity increases uniformly under gravity at <strong>g = 10 ms⁻²</strong>.
                </p>

                {/* SVG Visual Diagram */}
                <div className="flex justify-center bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
                  <svg viewBox="0 0 200 140" className="w-50 h-35">
                    <rect x="0" y="0" width="200" height="140" fill="#f8fafc" rx="8" />
                    {/* Tower */}
                    <rect x="40" y="20" width="30" height="100" fill="#cbd5e1" stroke="#16241f" strokeWidth="2" />
                    <text x="55" y="70" fontSize="10" fill="#16241f" fontWeight="bold" textAnchor="middle">
                      20 m
                    </text>

                    {/* Ball Top */}
                    <circle cx="85" cy="25" r="8" fill="#9c6f1f" />
                    <text x="100" y="28" fontSize="10" fill="#16241f" fontWeight="bold">u = 0</text>

                    {/* Fall arrow */}
                    <line x1="85" y1="35" x2="85" y2="105" stroke="#9c6f1f" strokeWidth="2" strokeDasharray="4 2" />
                    <polygon points="85,112 81,102 89,102" fill="#9c6f1f" />
                    <text x="100" y="70" fontSize="10" fill="#9c6f1f" fontWeight="bold">g = 10 ms⁻²</text>

                    {/* Ground */}
                    <line x1="20" y1="120" x2="180" y2="120" stroke="#16241f" strokeWidth="3" />
                    <circle cx="85" cy="112" r="8" fill="#16241f" />
                    <text x="100" y="115" fontSize="10" fill="#16241f" fontWeight="bold">Impact v = ?</text>
                  </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      1. Velocity with which it strikes the ground v (in ms⁻¹):
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 20"
                      value={calcV}
                      onChange={(e) => setCalcV(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      2. Time taken to reach the ground t (in seconds):
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 2"
                      value={calcT}
                      onChange={(e) => setCalcT(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerifyTest}
                  className="w-full py-2 bg-[#16241f] text-white font-bold rounded-lg hover:bg-[#0f1712] transition-colors"
                >
                  Verify Answers
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
          <div className="text-5xl">🎯</div>
          <h2 className="text-2xl font-black text-[#16241f]">Equations of Motion Mastered!</h2>
          <p className="text-sm text-[#475569] max-w-md mx-auto">
            You can now apply Newton&apos;s equations of motion and free fall principles with confidence.
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

export default RCRTEquationsOfMotionPlayer;
