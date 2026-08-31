import React, { useState } from 'react';

interface Statement {
  id: number;
  text: string;
  isFact: boolean;
  explanation: string;
  hint: string;
}

export default function FactOpinionSorter() {
  const statements: Statement[] = [
    {
      id: 1,
      text: "The sun rises early in the morning.",
      isFact: true,
      explanation: "This is a scientific truth that can be observed and measured every single day. It does not change!",
      hint: "Can we prove this with a clock or a camera? Yes! That means it's solid as iron."
    },
    {
      id: 2,
      text: "Hyena is kinder than Cockerel.",
      isFact: false,
      explanation: "Kindness means different things to different people. Some might think Hyena was silly, not kind!",
      hint: "Is there a rule or a tool to measure 'kindness' exactly? No, it's how you feel about him!"
    },
    {
      id: 3,
      text: "Hyena's fire had gone out.",
      isFact: true,
      explanation: "In the story, the ashes were cold and there was no light. This is a clear event we can verify.",
      hint: "If we looked at Hyena's fireplace, could we see if it was cold? Yes, we can prove it!"
    },
    {
      id: 4,
      text: "Cockerel had a lucky escape.",
      isFact: false,
      explanation: "The word 'lucky' is an opinion. Someone else might say Cockerel was just clever!",
      hint: "Look closely at the word 'lucky'. Is luck a scientific measurement, or is it a personal interpretation?"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<'fact' | 'opinion' | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; show: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [scaleAngle, setScaleAngle] = useState(0); // in degrees: -10 for Fact weight, +10 for Opinion weight
  const [isWiggling, setIsWiggling] = useState(false);

  const currentStatement = statements[currentIndex];

  const handleChoice = (choice: 'fact' | 'opinion') => {
    if (feedback?.show) return; // Prevent double clicking during animation

    const isCorrect = (choice === 'fact' && currentStatement.isFact) || 
                      (choice === 'opinion' && !currentStatement.isFact);

    setSelectedType(choice);
    setFeedback({ isCorrect, show: true });
    setShowHint(false);

    if (isCorrect) {
      setScore(prev => prev + 1);
      // Tilt the scale weight toward the correct answer side
      setScaleAngle(choice === 'fact' ? -12 : 12);
    } else {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 500);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedType(null);
    setScaleAngle(0);
    if (currentIndex < statements.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop or restart for demo
      setCurrentIndex(0);
      setScore(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#f4f6f1] rounded-2xl border-4 border-[#16241f] shadow-[8px_8px_0px_0px_#16241f] text-[#16241f] font-sans overflow-hidden">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b-4 border-[#16241f] pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#9c6f1f] flex items-center justify-center border-2 border-[#16241f] text-[#f4f6f1] font-bold text-lg shadow-[2px_2px_0px_0px_#16241f]">
            🦘
          </div>
          <div>
            <h2 className="font-extrabold text-2xl tracking-tight text-[#16241f]">Ezy's Fact vs. Opinion Scale</h2>
            <p className="text-xs font-semibold text-[#16241f]/70 uppercase tracking-widest">Unit 1 • Pages 9 - 10</p>
          </div>
        </div>
        <div className="bg-[#16241f] text-[#f4f6f1] px-4 py-1.5 rounded-full font-bold text-sm border-2 border-[#9c6f1f] shadow-[2px_2px_0px_0px_#9c6f1f]">
          Caliber Score: {score} / {statements.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Animated SVG Sorter Balance */}
        <div className="flex flex-col items-center justify-center p-4 bg-white/60 rounded-xl border-2 border-[#16241f] relative min-h-[340px]">
          {/* Sorter Scale SVG */}
          <svg viewBox="0 0 400 300" className="w-full max-w-[320px] drop-shadow-md">
            {/* Base Stand */}
            <path d="M 150 260 L 250 260 L 230 250 L 210 120 L 190 120 L 170 250 Z" fill="#16241f" />
            <circle cx="200" cy="110" r="14" fill="#9c6f1f" stroke="#16241f" strokeWidth="3" />
            
            {/* Tilting Beam */}
            <g style={{ transform: `rotate(${scaleAngle}deg)`, transformOrigin: '200px 110px', transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
              {/* Balance Beam line */}
              <line x1="80" y1="110" x2="320" y2="110" stroke="#16241f" strokeWidth="8" strokeLinecap="round" />
              
              {/* Left Plate Connector */}
              <line x1="80" y1="110" x2="80" y2="170" stroke="#16241f" strokeWidth="3" />
              <line x1="80" y1="110" x2="50" y2="170" stroke="#16241f" strokeWidth="2" />
              <line x1="80" y1="110" x2="110" y2="170" stroke="#16241f" strokeWidth="2" />
              {/* Left Plate (FACT Safe) */}
              <g transform="translate(80, 185)">
                <rect x="-40" y="-15" width="80" height="25" rx="6" fill={selectedType === 'fact' && feedback?.isCorrect ? '#9c6f1f' : '#16241f'} stroke="#16241f" strokeWidth="3" />
                <text x="0" y="2" textAnchor="middle" fill="#f4f6f1" className="text-xs font-black tracking-wider uppercase">FACT</text>
                <circle cx="0" cy="-25" r="8" fill="#16241f" opacity="0.15" />
              </g>

              {/* Right Plate Connector */}
              <line x1="320" y1="110" x2="320" y2="170" stroke="#16241f" strokeWidth="3" />
              <line x1="320" y1="110" x2="290" y2="170" stroke="#16241f" strokeWidth="2" />
              <line x1="320" y1="110" x2="350" y2="170" stroke="#16241f" strokeWidth="2" />
              {/* Right Plate (OPINION Bubble) */}
              <g transform="translate(320, 185)">
                <rect x="-40" y="-15" width="80" height="25" rx="6" fill={selectedType === 'opinion' && feedback?.isCorrect ? '#9c6f1f' : '#16241f'} stroke="#16241f" strokeWidth="3" />
                <text x="0" y="2" textAnchor="middle" fill="#f4f6f1" className="text-xs font-black tracking-wider uppercase">OPINION</text>
                <circle cx="0" cy="-25" r="8" fill="#16241f" opacity="0.15" />
              </g>
            </g>

            {/* Scale Center Dial Pin */}
            <polygon points="200,80 196,110 204,110" fill="#9c6f1f" style={{ transform: `rotate(${scaleAngle * -1.5}deg)`, transformOrigin: '200px 110px', transition: 'transform 0.6s' }} />
          </svg>

          {/* Ezy Kangaroo Head Coaching overlay */}
          <div className="absolute bottom-2 left-4 flex items-center space-x-2">
            <svg viewBox="0 0 100 100" className="w-12 h-12 bg-[#9c6f1f] rounded-full border-2 border-[#16241f] p-1 shadow">
              {/* Simplified Cartoon Kangaroo face */}
              <ellipse cx="50" cy="55" rx="30" ry="25" fill="#e0a955" />
              {/* Ears */}
              <path d="M 30 35 Q 20 5 35 25 Z" fill="#e0a955" stroke="#16241f" strokeWidth="2" />
              <path d="M 70 35 Q 80 5 65 25 Z" fill="#e0a955" stroke="#16241f" strokeWidth="2" />
              {/* Eyes */}
              <circle cx="40" cy="50" r="4" fill="#16241f" />
              <circle cx="60" cy="50" r="4" fill="#16241f" />
              {/* Cheeks */}
              <circle cx="32" cy="58" r="4" fill="#f27d6d" opacity="0.7" />
              <circle cx="68" cy="58" r="4" fill="#f27d6d" opacity="0.7" />
              {/* Snout */}
              <ellipse cx="50" cy="65" rx="10" ry="8" fill="#16241f" />
              <path d="M 46 63 Q 50 58 54 63" stroke="#f4f6f1" strokeWidth="1.5" fill="none" />
            </svg>
            <div className="bg-[#16241f] text-[#f4f6f1] px-3 py-1.5 rounded-xl rounded-bl-none text-[11px] font-bold max-w-[180px] shadow">
              {feedback?.show
                ? feedback.isCorrect 
                  ? "Bouncing brilliant! You proved it!" 
                  : "Oh! Let's think about this..."
                : "Drag or Tap to drop the block on the right scale!"
              }
            </div>
          </div>
        </div>

        {/* Right Side: Active Statement Block & Tactile Sorter Controls */}
        <div className="flex flex-col justify-between h-full space-y-6">
          {/* Statement Board */}
          <div className={`p-6 rounded-xl border-3 border-[#16241f] transition-all duration-300 ${
            isWiggling ? 'animate-bounce border-[#e05656]' : 'bg-[#16241f] text-[#f4f6f1] shadow-[4px_4px_0px_0px_#9c6f1f]'
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#9c6f1f]">
              TEXTBOOK STATEMENT #{currentStatement.id}
            </span>
            <p className="text-lg md:text-xl font-bold mt-2 leading-relaxed italic">
              "{currentStatement.text}"
            </p>
          </div>

          {/* Interactive Tap Actions */}
          {!feedback?.show ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice('fact')}
                  className="py-4 bg-[#f4f6f1] hover:bg-[#9c6f1f] hover:text-[#f4f6f1] text-[#16241f] font-black text-base rounded-xl border-3 border-[#16241f] shadow-[4px_4px_0px_0px_#16241f] active:translate-y-1 active:shadow-[1px_1px_0px_0px_#16241f] transition-all duration-150 uppercase"
                >
                  🔒 It's a Fact
                </button>
                <button
                  onClick={() => handleChoice('opinion')}
                  className="py-4 bg-[#f4f6f1] hover:bg-[#9c6f1f] hover:text-[#f4f6f1] text-[#16241f] font-black text-base rounded-xl border-3 border-[#16241f] shadow-[4px_4px_0px_0px_#16241f] active:translate-y-1 active:shadow-[1px_1px_0px_0px_#16241f] transition-all duration-150 uppercase"
                >
                  🎈 It's an Opinion
                </button>
              </div>

              {/* Hint Trigger */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-bold text-[#9c6f1f] hover:underline flex items-center space-x-1"
                >
                  <span>💡 Need a clue from Ezy?</span>
                </button>
              </div>

              {/* Collapsible Animated Hint Box */}
              {showHint && (
                <div className="p-4 bg-white rounded-xl border-2 border-[#16241f] text-xs font-medium leading-relaxed shadow-inner">
                  <span className="font-extrabold text-[#9c6f1f]">Ezy's Clue:</span> {currentStatement.hint}
                </div>
              )}
            </div>
          ) : (
            /* Post-Selection Explainer Panel */
            <div className={`p-5 rounded-xl border-3 border-[#16241f] animate-fade-in ${
              feedback.isCorrect ? 'bg-[#9c6f1f]/10' : 'bg-[#e05656]/10'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">
                  {feedback.isCorrect ? '🟢' : '🔴'}
                </span>
                <span className="font-extrabold text-sm uppercase">
                  {feedback.isCorrect ? 'Correct Answer!' : 'Not Quite right!'}
                </span>
              </div>
              <p className="text-xs font-semibold leading-relaxed text-[#16241f]/80">
                {currentStatement.explanation}
              </p>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="mt-4 w-full py-2.5 bg-[#16241f] text-[#f4f6f1] hover:bg-[#9c6f1f] font-bold text-sm rounded-lg transition-all duration-150 border-2 border-[#16241f] shadow-[2px_2px_0px_0px_#9c6f1f]"
              >
                {currentIndex < statements.length - 1 ? 'Next Statement ➔' : 'View Results ➔'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
