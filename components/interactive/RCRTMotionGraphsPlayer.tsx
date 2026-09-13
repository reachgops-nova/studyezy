import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTMotionGraphsPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

export const RCRTMotionGraphsPlayer: React.FC<RCRTMotionGraphsPlayerProps> = ({
  conceptName = 'Distance-Time & Velocity-Time Graphs',
  unitTitle = 'Unit 2: Motion (Pages 17–19)',
  onSuccess,
  onAttempt,
  onNarrate,
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [step, setStep] = useState<RCRTStep>('READ');

  // Recitation state
  const [userNotes, setUserNotes] = useState('');
  const [recited, setRecited] = useState(false);

  // Interactive Test State: Graph calculation
  // Triangle 0-10s (0 to 18 m/s), Rectangle 10-20s (18 m/s)
  const [calcSlope, setCalcSlope] = useState('');
  const [calcArea, setCalcArea] = useState('');
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
    'For a Distance-Time graph: time is on the X-axis and distance is on the Y-axis. The slope of the line equals speed (steeper slope means greater speed). A straight line indicates uniform motion, while a curved line indicates non-uniform motion. For a Velocity-Time graph: velocity is on the Y-axis and time on the X-axis. The slope equals acceleration, and the total area under the velocity-time graph equals displacement.';

  const handlePracticeRecite = () => {
    safeNarrate(keyConceptText);
    setRecited(true);
  };

  const handleVerifyTest = () => {
    const slopeVal = parseFloat(calcSlope.trim());
    const areaVal = parseFloat(calcArea.trim());

    // Slope in first 10 s: 18 / 10 = 1.8 m/s²
    // Area: Triangle (0.5 * 10 * 18 = 90) + Rectangle (10 * 18 = 180) = 270 m
    if (Math.abs(slopeVal - 1.8) < 0.05 && areaVal === 270) {
      setTestSuccess(true);
      setTestFeedback('Perfect! Acceleration (slope) = 18 / 10 = 1.8 ms⁻², and Displacement (area) = ½(10)(18) + (10)(18) = 90 + 180 = 270 m.');
      if (onAttempt) onAttempt(true);
    } else {
      setTestSuccess(false);
      setTestFeedback('Check your work: Slope = Δv / Δt = 18 / 10 = 1.8 ms⁻². Area under v-t graph = Area of triangle (½ × 10 × 18 = 90) + Area of rectangle (10 × 18 = 180) = 270 m.');
      if (onAttempt) onAttempt(false);
    }
  };

  const quizQuestions = [
    {
      question: 'What physical quantity is represented by the area under a Velocity-Time graph?',
      options: ['Speed', 'Displacement / Distance', 'Acceleration', 'Force'],
      correct: 1,
      hint: 'Hint: Area = Velocity × Time = (m/s) × s = metres (m), which represents magnitude of displacement.',
    },
    {
      question: 'The slope of a Distance-Time graph at any point gives:',
      options: ['Acceleration', 'Speed', 'Force', 'Displacement'],
      correct: 1,
      hint: 'Hint: Slope = (Distance on Y-axis) / (Time on X-axis) = Distance / Time = Speed.',
    },
    {
      question: 'If the Velocity-Time graph of an object is a straight line parallel to the X-axis, the object has:',
      options: ['Uniform acceleration', 'Zero acceleration (Uniform velocity)', 'Increasing velocity', 'Non-uniform speed'],
      correct: 1,
      hint: 'Hint: A horizontal line parallel to the time axis means velocity is constant (v does not change with time), so acceleration a = 0 ms⁻².',
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
    setCalcSlope('');
    setCalcArea('');
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
                <h2 className="text-lg font-bold text-[#9c6f1f]">Motion Graph Rules</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                    <span className="font-bold text-[#16241f] block text-sm">Distance-Time Graph</span>
                    <ul className="text-xs text-[#334155] list-disc pl-4 space-y-1">
                      <li><strong>X-axis:</strong> Time | <strong>Y-axis:</strong> Distance</li>
                      <li><strong>Slope = Speed</strong> (BC / AC). Steeper slope = Higher speed.</li>
                      <li>Straight line = Uniform motion.</li>
                      <li>Curved line = Non-uniform (accelerated) motion.</li>
                      <li>Horizontal line = Object at rest (Speed = 0).</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                    <span className="font-bold text-[#16241f] block text-sm">Velocity-Time Graph</span>
                    <ul className="text-xs text-[#334155] list-disc pl-4 space-y-1">
                      <li><strong>X-axis:</strong> Time | <strong>Y-axis:</strong> Velocity</li>
                      <li><strong>Slope = Acceleration</strong> (a = Δv / Δt).</li>
                      <li><strong>Area under graph = Displacement (s)</strong>.</li>
                      <li>Horizontal line = Uniform velocity (a = 0 ms⁻²).</li>
                      <li>Inclined straight line = Uniform acceleration.</li>
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
                  The graph rules are covered. Prepare to recall what slope and area represent for Distance-Time and Velocity-Time graphs.
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
                  Recite what Slope and Area under Velocity-Time and Distance-Time graphs represent out loud:
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
                    placeholder="Type slope of s-t graph = speed, area under v-t graph = displacement..."
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
                <h3 className="text-md font-bold text-[#9c6f1f]">Hands-On Velocity-Time Graph Analysis</h3>
                <p className="text-sm text-[#475569]">
                  Examine the Velocity-Time graph below: A car accelerates uniformly from <strong>0 to 18 ms⁻¹ in 10 s</strong>, and then continues at a constant <strong>18 ms⁻¹ from t = 10 s to t = 20 s</strong>.
                </p>

                {/* SVG Graph Plot */}
                <div className="flex justify-center bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
                  <svg viewBox="0 0 240 150" className="w-60 h-38">
                    <rect x="0" y="0" width="240" height="150" fill="#f8fafc" rx="8" />
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="220" y2="20" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="40" y1="70" x2="220" y2="70" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="130" y1="20" x2="130" y2="120" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Axes */}
                    <line x1="40" y1="20" x2="40" y2="120" stroke="#16241f" strokeWidth="2" />
                    <line x1="40" y1="120" x2="220" y2="120" stroke="#16241f" strokeWidth="2" />

                    {/* Shaded Area */}
                    <polygon points="40,120 130,30 220,30 220,120" fill="#e8eee3" opacity="0.8" />

                    {/* Graph Plot Line */}
                    <line x1="40" y1="120" x2="130" y2="30" stroke="#9c6f1f" strokeWidth="3" />
                    <line x1="130" y1="30" x2="220" y2="30" stroke="#16241f" strokeWidth="3" />

                    {/* Labels */}
                    <text x="35" y="125" fontSize="10" fill="#16241f" textAnchor="end">0</text>
                    <text x="35" y="35" fontSize="10" fill="#16241f" textAnchor="end">18</text>
                    <text x="15" y="70" fontSize="10" fill="#16241f" fontWeight="bold" transform="rotate(-90 15 70)" textAnchor="middle">Velocity (m/s)</text>

                    <text x="40" y="135" fontSize="10" fill="#16241f" textAnchor="middle">0 s</text>
                    <text x="130" y="135" fontSize="10" fill="#16241f" textAnchor="middle">10 s</text>
                    <text x="220" y="135" fontSize="10" fill="#16241f" textAnchor="middle">20 s</text>
                    <text x="130" y="147" fontSize="10" fill="#16241f" fontWeight="bold" textAnchor="middle">Time (s)</text>

                    {/* Points */}
                    <circle cx="40" cy="120" r="4" fill="#9c6f1f" />
                    <circle cx="130" cy="30" r="4" fill="#9c6f1f" />
                    <circle cx="220" cy="30" r="4" fill="#16241f" />
                  </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      1. Acceleration in first 10 s (Slope = Δv / Δt in ms⁻²):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 1.8"
                      value={calcSlope}
                      onChange={(e) => setCalcSlope(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#16241f] mb-1">
                      2. Total Displacement in 20 s (Shaded Area in m):
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-[#cbd5e1] rounded-lg text-sm"
                      placeholder="e.g. 270"
                      value={calcArea}
                      onChange={(e) => setCalcArea(e.target.value)}
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
          <div className="text-5xl">📊</div>
          <h2 className="text-2xl font-black text-[#16241f]">Graph Analysis Mastered!</h2>
          <p className="text-sm text-[#475569] max-w-md mx-auto">
            You can now interpret and calculate slopes and areas for distance-time and velocity-time graphs.
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

export default RCRTMotionGraphsPlayer;
