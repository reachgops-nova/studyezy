import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTTypesOfMotionPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

export const RCRTTypesOfMotionPlayer: React.FC<RCRTTypesOfMotionPlayerProps> = ({
  conceptName = 'Distance, Displacement & Types of Motion',
  unitTitle = 'Unit 2: Motion (Pages 14–16)',
  onSuccess,
  onAttempt,
  onNarrate,
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [step, setStep] = useState<RCRTStep>('READ');
  
  // Recitation & practice state
  const [userNotes, setUserNotes] = useState('');
  const [recited, setRecited] = useState(false);

  // Test interactive task state: Scenario with walking 4 m East then 3 m North
  const [calcDistance, setCalcDistance] = useState('');
  const [calcDisplacement, setCalcDisplacement] = useState('');
  const [selectedMotionType, setSelectedMotionType] = useState<string>('');
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
    'Distance is the actual length of the path travelled by a moving body irrespective of direction (scalar quantity, SI unit metre). Displacement is the change in position in a particular direction; it is the shortest straight-line distance from initial to final position (vector quantity, SI unit metre). Linear motion is along a straight line, Circular motion is along a circular path, Oscillatory motion is repetitive to-and-fro motion at regular time intervals, and Random motion lacks a fixed pattern.';

  const handlePracticeRecite = () => {
    safeNarrate(keyConceptText);
    setRecited(true);
  };

  const handleVerifyTest = () => {
    const distNum = parseFloat(calcDistance.trim());
    const dispNum = parseFloat(calcDisplacement.trim());

    if (distNum === 7 && dispNum === 5 && selectedMotionType === 'Oscillatory') {
      setTestSuccess(true);
      setTestFeedback('Excellent! Distance = 4 + 3 = 7 m, Displacement = sqrt(4² + 3²) = 5 m, and swinging pendulum = Oscillatory Motion.');
      if (onAttempt) onAttempt(true);
    } else {
      setTestSuccess(false);
      setTestFeedback('Not quite right. Distance is the total path length (4 + 3 = 7 m). Displacement is the shortest straight line (sqrt(4² + 3²) = 5 m). A pendulum swings to-and-fro (Oscillatory).');
      if (onAttempt) onAttempt(false);
    }
  };

  const quizQuestions = [
    {
      question: 'Which statement correctly distinguishes distance and displacement?',
      options: [
        'Distance is a vector and displacement is a scalar.',
        'Distance is actual path length (scalar); displacement is shortest straight-line change in position (vector).',
        'Displacement can never be zero, whereas distance can be zero.',
        'Both distance and displacement are scalar quantities measured in kg.',
      ],
      correct: 1,
      hint: 'Hint: Distance has magnitude only (scalar), while displacement has both magnitude and direction (vector). Displacement can be zero when returning to the starting point.',
    },
    {
      question: 'The motion of a ceiling fan rotating about its fixed central axis is an example of:',
      options: ['Linear motion', 'Circular motion', 'Random motion', 'Oscillatory motion'],
      correct: 1,
      hint: 'Hint: Motion along a circular path or around a fixed central point is classified as circular motion.',
    },
    {
      question: 'If an athlete completes one full round of a circular track of radius 50 m and returns to the starting point, what are the distance and displacement?',
      options: [
        'Distance = 0 m, Displacement = 314 m',
        'Distance = 314 m, Displacement = 0 m',
        'Distance = 100 m, Displacement = 100 m',
        'Distance = 314 m, Displacement = 314 m',
      ],
      correct: 1,
      hint: 'Hint: Circumference = 2 × π × r = 2 × 3.14 × 50 = 314 m. Returning to the exact initial position means final position - initial position = 0 m displacement.',
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
    setCalcDistance('');
    setCalcDisplacement('');
    setSelectedMotionType('');
    setTestSuccess(false);
    setTestFeedback('');
    setQuizIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setScore(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-[#f4f6f1] text-[#16241f] rounded-2xl shadow-xl border border-[#cbd5e1] font-sans">
      {/* Top Header */}
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
          {/* Step Indicator Bar */}
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
                <h2 className="text-lg font-bold text-[#9c6f1f]">Core Concept & Definitions</h2>
                <p>
                  <strong>Motion vs. Rest:</strong> An object is in motion if it changes its position with respect to its surroundings; otherwise, it is at rest. Motion is a relative phenomenon.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                    <span className="font-bold text-[#16241f] block mb-1">Distance (s)</span>
                    <ul className="text-sm list-disc pl-4 text-[#334155] space-y-1">
                      <li>Actual length of path travelled.</li>
                      <li>Scalar quantity (magnitude only).</li>
                      <li>SI unit: metre (m).</li>
                      <li>Always positive or zero (never decreases).</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                    <span className="font-bold text-[#16241f] block mb-1">Displacement (s)</span>
                    <ul className="text-sm list-disc pl-4 text-[#334155] space-y-1">
                      <li>Shortest distance in a specified direction.</li>
                      <li>Vector quantity (magnitude + direction).</li>
                      <li>SI unit: metre (m).</li>
                      <li>Can be zero, positive, or negative.</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="font-bold text-[#9c6f1f] block mb-1">Types of Motion:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-[#f1f5f9] rounded border border-[#e2e8f0]"><strong>Linear:</strong> Motion along a straight line.</div>
                    <div className="p-2 bg-[#f1f5f9] rounded border border-[#e2e8f0]"><strong>Circular:</strong> Motion along a circular path.</div>
                    <div className="p-2 bg-[#f1f5f9] rounded border border-[#e2e8f0]"><strong>Oscillatory:</strong> Repetitive to-and-fro motion at regular intervals.</div>
                    <div className="p-2 bg-[#f1f5f9] rounded border border-[#e2e8f0]"><strong>Random:</strong> Irregular motion with no fixed path.</div>
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
                  The concept card is now hidden. Prepare to test your memory by reciting definitions and differences out loud or writing them down.
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
                <h3 className="text-md font-bold text-[#16241f]">Active Memory Recall</h3>
                <p className="text-sm text-[#475569]">
                  Recite the definitions of Distance, Displacement, and the 4 Types of Motion out loud or type your thoughts below:
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
                    ✓ Voice narration played. Compare your mental recall with the rule card!
                  </p>
                )}
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Your Recitation Scratchpad (Optional):
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9c6f1f]"
                    placeholder="Type distance vs displacement differences or types of motion..."
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
                <h3 className="text-md font-bold text-[#9c6f1f]">Hands-On Interactive Task: Path & Displacement</h3>
                <p className="text-sm text-[#475569]">
                  A person walks <strong>4 m East</strong> from point A to point B, and then <strong>3 m North</strong> from point B to point C.
                </p>

                {/* SVG Visual Representation */}
                <div className="flex justify-center bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
                  <svg viewBox="0 0 240 160" className="w-60 h-40">
                    <rect x="0" y="0" width="240" height="160" fill="#f8fafc" rx="8" />
                    {/* Path A to B */}
                    <line x1="40" y1="120" x2="180" y2="120" stroke="#16241f" strokeWidth="3" strokeDasharray="4 2" />
                    <text x="110" y="140" fontSize="12" fill="#16241f" fontWeight="bold" textAnchor="middle">
                      4 m East
                    </text>

                    {/* Path B to C */}
                    <line x1="180" y1="120" x2="180" y2="30" stroke="#16241f" strokeWidth="3" strokeDasharray="4 2" />
                    <text x="195" y="75" fontSize="12" fill="#16241f" fontWeight="bold" textAnchor="start">
                      3 m North
                    </text>

                    {/* Displacement A to C */}
                    <line x1="40" y1="120" x2="180" y2="30" stroke="#9c6f1f" strokeWidth="4" />
                    <text x="95" y="65" fontSize="12" fill="#9c6f1f" fontWeight="bold" textAnchor="end">
                      Displacement (hypotenuse)
                    </text>

                    {/* Points */}
                    <circle cx="40" cy="120" r="6" fill="#16241f" />
                    <text x="25" y="125" fontSize="12" fill="#16241f" fontWeight="bold">A</text>

                    <circle cx="180" cy="120" r="6" fill="#16241f" />
                    <text x="185" y="135" fontSize="12" fill="#16241f" fontWeight="bold">B</text>

                    <circle cx="180" cy="30" r="6" fill="#9c6f1f" />
                    <text x="180" y="20" fontSize="12" fill="#9c6f1f" fontWeight="bold">C</text>
                  </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      1. What is the Total Distance travelled (in m)?
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 7"
                      value={calcDistance}
                      onChange={(e) => setCalcDistance(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      2. What is the Displacement magnitude (in m)?
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 5"
                      value={calcDisplacement}
                      onChange={(e) => setCalcDisplacement(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#16241f] mb-1">
                    3. Select the type of motion for a child swinging on a playground swing:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['Linear', 'Circular', 'Oscillatory', 'Random'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMotionType(m)}
                        className={`p-2 rounded-lg border font-semibold transition-all ${
                          selectedMotionType === m
                            ? 'bg-[#16241f] text-white border-[#16241f]'
                            : 'bg-[#f8fafc] text-[#334155] border-[#cbd5e1] hover:bg-[#e2e8f0]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
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
          <div className="text-5xl">🎉</div>
          <h2 className="text-2xl font-black text-[#16241f]">RCRT Mastery Achieved!</h2>
          <p className="text-sm text-[#475569] max-w-md mx-auto">
            You have successfully completed the Read-Cover-Recite-Test loop and Checkpoint Quiz for <strong>{conceptName}</strong>.
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

export default RCRTTypesOfMotionPlayer;
