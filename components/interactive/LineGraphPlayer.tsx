import React, { useState, useEffect, useCallback } from 'react';

export interface LineGraphPlayerProps {
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
    questionText: 'Where is time typically placed on a line graph when tracking continuous data?',
    options: [
      'On the horizontal x-axis, while the measured amount goes on the vertical y-axis',
      'On the vertical y-axis, while the measured amount goes on the x-axis',
      'In a corner table with no axes at all'
    ],
    correctIndex: 0,
    hint: 'Time is typically placed on the horizontal x-axis, while the measured amount goes on the vertical y-axis.'
  },
  {
    id: 2,
    questionText: 'What is a main advantage of connecting individual data points with straight lines?',
    options: [
      'Connecting points with lines lets us estimate values between the times we recorded',
      'It rounds all numbers to the nearest hundred automatically',
      'It hides the high and low values so you cannot see them'
    ],
    correctIndex: 0,
    hint: 'Connecting points with lines lets us estimate values between the times we recorded.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when tracking continuous measurements over time?',
    options: [
      'If you are tracking changes that flow steadily over time, connect the dots with a line graph!',
      'Always use a bar chart with gaps for continuous time data',
      'Never connect data points together'
    ],
    correctIndex: 0,
    hint: 'If you are tracking changes that flow steadily over time, connect the dots with a line graph!'
  }
];

export const LineGraphPlayer: React.FC<LineGraphPlayerProps> = ({
  conceptName = 'Concept 5.3: Line Graphs for Continuous Data',
  unitTitle = 'Unit 5: Statistical Methods (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'balloon_height' | 'hourly_temp'>('balloon_height');
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
        'A line graph tracks continuous data by connecting individual points with straight lines to illustrate change over time. It helps us understand continuous measurements like height, temperature, or liquid levels as they rise or fall. Time is typically placed on the horizontal x-axis, while the measured amount goes on the vertical y-axis, allowing us to estimate values between the times we recorded.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'balloon_height') {
        const desc =
          demoStep === 0
            ? 'Tracking how the height of a hot air balloon changes every 30 minutes during a flight. Click Plot & Connect Points!'
            : demoStep === 1
            ? 'Data points plotted and connected with straight lines! Notice how the balloon rises to 400 meters at 60 minutes, then descends.'
            : 'Connecting points with lines lets us estimate values between times (like estimating height at 45 minutes)! Line graphs track continuous changes over time.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Recording hourly temperatures over a day to see when it was coolest and warmest. Click Plot & Connect Points!'
            : demoStep === 1
            ? 'Connected line shows temperature rising from 14°C at 8 AM to a peak of 26°C at 2 PM, then cooling down.'
            : 'Line graphs make it simple to spot peak warm times (2 PM at 26°C) and cool morning times (8 AM at 14°C)! If you are tracking changes that flow steadily over time, connect the dots with a line graph!';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Line Graphs for Continuous Data! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'balloon_height' | 'hourly_temp') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'balloon_height') {
      safeNarrate('Tracking how the height of a hot air balloon changes every 30 minutes during a flight. Click Plot & Connect Points!');
    } else {
      safeNarrate('Recording hourly temperatures over a day to see when it was coolest and warmest. Click Plot & Connect Points!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'balloon_height') {
      const desc =
        next === 0
          ? 'Tracking how the height of a hot air balloon changes every 30 minutes during a flight. Click Plot & Connect Points!'
          : next === 1
          ? 'Data points plotted and connected with straight lines! Notice how the balloon rises to 400 meters at 60 minutes, then descends.'
          : 'Connecting points with lines lets us estimate values between times (like estimating height at 45 minutes)! Line graphs track continuous changes over time.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Recording hourly temperatures over a day to see when it was coolest and warmest. Click Plot & Connect Points!'
          : next === 1
          ? 'Connected line shows temperature rising from 14°C at 8 AM to a peak of 26°C at 2 PM, then cooling down.'
          : 'Line graphs make it simple to spot peak warm times (2 PM at 26°C) and cool morning times (8 AM at 14°C)! If you are tracking changes that flow steadily over time, connect the dots with a line graph!';
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
              A <strong>line graph</strong> tracks <strong>continuous data</strong> by connecting individual points with straight lines to illustrate change over time. 
              It helps us understand continuous measurements like height, temperature, or liquid levels as they rise or fall. 
              <strong> Time is typically placed on the horizontal x-axis</strong>, while the measured amount goes on the <strong>vertical y-axis</strong>, allowing us to estimate values between recorded times.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Hot Air Balloon Flight Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Tracking height changes every 30 minutes during flight
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Connecting points shows the balloon rising, peaking at 400m, and landing.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🎈 📈
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Hourly Temperature Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Recording hourly temperatures over a day
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Easily spot when it was coolest in the morning and warmest in the afternoon.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🌡️ 📊
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Line Graph Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('balloon_height')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'balloon_height'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🎈 Balloon Flight (Height every 30m)
            </button>
            <button
              onClick={() => handleSelectDemoMode('hourly_temp')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'hourly_temp'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🌡️ Hourly Temperature (°C over time)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'balloon_height' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Line Graph: Hot Air Balloon Height Every 30 Minutes
                </h3>

                {/* SVG Line Graph Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="relative w-full h-44 flex flex-col justify-between pt-2 pb-6 px-4">
                    <span className="absolute top-1 left-2 text-[10px] font-bold text-[#9c6f1f]">Height (m)</span>

                    <svg className="w-full h-32 overflow-visible">
                      <line x1="0" y1="0" x2="100%" y2="0" stroke="#16241f" strokeOpacity="0.1" strokeDasharray="3 3" />
                      <line x1="0" y1="40" x2="100%" y2="40" stroke="#16241f" strokeOpacity="0.1" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="100%" y2="80" stroke="#16241f" strokeOpacity="0.1" strokeDasharray="3 3" />
                      <line x1="0" y1="120" x2="100%" y2="120" stroke="#16241f" strokeWidth="2" strokeOpacity="0.3" />

                      {demoStep >= 1 && (
                        <polyline
                          fill="none"
                          stroke="#9c6f1f"
                          strokeWidth="3"
                          points="10,120 70,75 130,0 190,15 250,120"
                          className="transition-all duration-700 ease-in-out"
                        />
                      )}

                      {[
                        { x: 10, y: 120, time: '0m', val: '0m' },
                        { x: 70, y: 75, time: '30m', val: '150m' },
                        { x: 130, y: 0, time: '60m', val: '400m', isPeak: true },
                        { x: 190, y: 15, time: '90m', val: '350m' },
                        { x: 250, y: 120, time: '120m', val: '0m' }
                      ].map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={pt.isPeak && demoStep >= 1 ? '6' : '4'}
                            fill={pt.isPeak && demoStep >= 1 ? '#9c6f1f' : '#16241f'}
                          />
                          <text x={pt.x} y={pt.y - 8} textAnchor="middle" className="text-[9px] font-bold fill-[#16241f]">
                            {demoStep >= 1 ? pt.val : ''}
                          </text>
                        </g>
                      ))}

                      {demoStep === 2 && (
                        <g className="animate-fade-in">
                          <circle cx="100" cy="37.5" r="5" fill="#16241f" stroke="#9c6f1f" strokeWidth="2" />
                          <line x1="100" y1="37.5" x2="100" y2="120" stroke="#9c6f1f" strokeDasharray="2 2" strokeWidth="1.5" />
                          <text x="100" y="28" textAnchor="middle" className="text-[9px] font-extrabold fill-[#9c6f1f]">
                            ~275m (45 min est.)
                          </text>
                        </g>
                      )}
                    </svg>

                    <div className="flex justify-between items-center text-[10px] font-bold text-[#16241f]/70 pt-1 border-t border-[#16241f]/20">
                      <span>0 min</span>
                      <span>30 min</span>
                      <span>60 min</span>
                      <span>90 min</span>
                      <span>120 min</span>
                    </div>
                  </div>

                  {demoStep === 2 && (
                    <div className="mt-2 p-2.5 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-xs font-bold text-[#9c6f1f] animate-fade-in">
                      💡 Connecting points lets us estimate values between recorded times (like ~275m at 45 mins)!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🎈 Step 1: Plot & Connect Points'
                    : demoStep === 1
                    ? '💡 Step 2: Estimate Values Between Times'
                    : '🔄 Reset Balloon Flight Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Line Graph: Hourly Temperatures (°C Over Time)
                </h3>

                {/* SVG Line Graph Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="relative w-full h-44 flex flex-col justify-between pt-2 pb-6 px-4">
                    <span className="absolute top-1 left-2 text-[10px] font-bold text-[#16241f]">Temp (°C)</span>

                    <svg className="w-full h-32 overflow-visible">
                      <line x1="0" y1="0" x2="100%" y2="0" stroke="#16241f" strokeOpacity="0.1" strokeDasharray="3 3" />
                      <line x1="0" y1="40" x2="100%" y2="40" stroke="#16241f" strokeOpacity="0.1" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="100%" y2="80" stroke="#16241f" strokeOpacity="0.1" strokeDasharray="3 3" />
                      <line x1="0" y1="120" x2="100%" y2="120" stroke="#16241f" strokeWidth="2" strokeOpacity="0.3" />

                      {demoStep >= 1 && (
                        <polyline
                          fill="none"
                          stroke="#16241f"
                          strokeWidth="3"
                          points="10,100 70,70 130,25 190,10 250,50"
                          className="transition-all duration-700 ease-in-out"
                        />
                      )}

                      {[
                        { x: 10, y: 100, val: '14°C' },
                        { x: 70, y: 70, val: '18°C' },
                        { x: 130, y: 25, val: '24°C' },
                        { x: 190, y: 10, val: '26°C', isPeak: true },
                        { x: 250, y: 50, val: '21°C' }
                      ].map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={pt.isPeak && demoStep >= 1 ? '6' : '4'}
                            fill={pt.isPeak && demoStep >= 1 ? '#9c6f1f' : '#16241f'}
                          />
                          <text x={pt.x} y={pt.y - 8} textAnchor="middle" className="text-[9px] font-bold fill-[#16241f]">
                            {demoStep >= 1 ? pt.val : ''}
                          </text>
                        </g>
                      ))}
                    </svg>

                    <div className="flex justify-between items-center text-[10px] font-bold text-[#16241f]/70 pt-1 border-t border-[#16241f]/20">
                      <span>8 AM</span>
                      <span>10 AM</span>
                      <span>12 PM</span>
                      <span>2 PM</span>
                      <span>4 PM</span>
                    </div>
                  </div>

                  {demoStep === 2 && (
                    <div className="mt-2 p-2.5 bg-[#16241f]/10 border border-[#16241f]/30 rounded-xl text-xs font-bold text-[#16241f] animate-fade-in">
                      🔥 Easily spot peak warm times (2 PM at 26°C) and cool morning times (8 AM at 14°C)!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🌡️ Step 1: Plot & Connect Temperatures'
                    : demoStep === 1
                    ? '🔥 Step 2: Spot Coolest & Warmest Times'
                    : '🔄 Reset Hourly Temperature Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'balloon_height' ? (
                <>
                  {demoStep === 0 && 'Tracking how the height of a hot air balloon changes every 30 minutes during a flight. Click Plot & Connect Points!'}
                  {demoStep === 1 && 'Data points plotted and connected with straight lines! Notice how the balloon rises to 400 meters at 60 minutes, then descends.'}
                  {demoStep === 2 && 'Connecting points with lines lets us estimate values between times (like estimating height at 45 minutes)! Line graphs track continuous changes over time.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Recording hourly temperatures over a day to see when it was coolest and warmest. Click Plot & Connect Points!'}
                  {demoStep === 1 && 'Connected line shows temperature rising from 14°C at 8 AM to a peak of 26°C at 2 PM, then cooling down.'}
                  {demoStep === 2 && 'Line graphs make it simple to spot peak warm times (2 PM at 26°C) and cool morning times (8 AM at 14°C)! If you are tracking changes that flow steadily over time, connect the dots with a line graph!'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Line Graphs for Continuous Data</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              If you are tracking changes that flow steadily over time, connect the dots with a line graph!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('balloon_height');
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

export default LineGraphPlayer;
