import React, { useEffect, useState } from 'react';

interface FactOpinionScaleProps {
  statement: string;
  onSelect: (classification: 'fact' | 'opinion') => void;
  currentSelection?: 'fact' | 'opinion' | null;
  isCorrect?: boolean | null;
}

export const FactOpinionScale: React.FC<FactOpinionScaleProps> = ({
  statement,
  onSelect,
  currentSelection = null,
  isCorrect = null,
}) => {
  const [angle, setAngle] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  // Dynamic balance beam physics based on selection
  useEffect(() => {
    if (currentSelection === 'fact') {
      setAngle(-14); // Tilt left (Fact drops down with heavy evidence weight)
    } else if (currentSelection === 'opinion') {
      setAngle(14);  // Tilt right (Opinion drops down, light as a balloon)
    } else {
      setAngle(0);   // Balanced default
    }
  }, [currentSelection]);

  // Wobble effect for errors
  useEffect(() => {
    if (isCorrect === false) {
      setWiggle(true);
      const timer = setTimeout(() => setWiggle(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  return (
    <div className={`flex flex-col items-center justify-between w-full h-full p-6 bg-[#f4f6f1] rounded-3xl border-3 border-[#16241f] shadow-[8px_8px_0px_0px_rgba(22,36,31,1)] max-w-lg mx-auto overflow-hidden transition-all duration-300 ${wiggle ? 'animate-bounce' : ''}`}>
      
      {/* 1. Playful Cartoon Title Bar */}
      <div className="text-center mb-4 relative w-full">
        <div className="absolute -top-2 left-2 animate-bounce delay-100 text-2xl">✨</div>
        <div className="absolute -top-2 right-2 animate-bounce delay-300 text-2xl">💡</div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-sans font-extrabold uppercase tracking-widest bg-[#9c6f1f]/10 text-[#9c6f1f] border-2 border-[#9c6f1f]/20">
          Unit 1.7 Lesson Sandbox
        </span>
        <h3 className="font-serif text-[#16241f] text-2xl font-black mt-1.5 tracking-tight">
          Ezy's Fact vs. Opinion Scale
        </h3>
        <p className="text-sm text-[#16241f]/75 font-sans font-medium mt-0.5 max-w-xs mx-auto">
          Help Ezy sort the textbook stories! Is it a heavy, solid Fact or a light, floating Opinion?
        </p>
      </div>

      {/* 2. Visual Sandbox Canvas - Fully Styled Cute SVG Balance Scale */}
      <div className="relative w-full h-64 flex items-center justify-center my-1 bg-white rounded-2xl border-3 border-[#16241f] shadow-inner overflow-visible">
        
        {/* Soft cartoon sky backdrop */}
        <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-[#bae6fd]/30 to-transparent pointer-events-none rounded-xl" />

        <svg
          viewBox="0 0 400 250"
          className="w-full h-full overflow-visible z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* SVG Definitions for shadows, linear gradients, and styles */}
          <defs>
            <linearGradient id="goldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="50%" stopColor="#e5a93b" />
              <stop offset="100%" stopColor="#9c6f1f" />
            </linearGradient>
            <linearGradient id="woodPedestal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c28c5f" />
              <stop offset="100%" stopColor="#805634" />
            </linearGradient>
            <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fffdf0" />
              <stop offset="100%" stopColor="#f7ebd0" />
            </linearGradient>
            <filter id="cuteShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="4" stdDeviation="0" floodColor="#16241f" floodOpacity="1" />
            </filter>
          </defs>

          {/* BACKGROUND BACKGROUND SCENERY (Cute floating tiny sparkles) */}
          <g opacity="0.3">
            <circle cx="80" cy="50" r="2" fill="#9c6f1f" />
            <circle cx="320" cy="40" r="3" fill="#9c6f1f" />
            <circle cx="50" cy="180" r="2.5" fill="#9c6f1f" />
          </g>

          {/* STATIC BASE & STAND ASSEMBLY */}
          {/* Wood Base Pedestal */}
          <path
            d="M 120 225 C 120 215, 280 215, 280 225 L 290 235 L 110 235 Z"
            fill="url(#woodPedestal)"
            stroke="#16241f"
            strokeWidth="3.5"
            filter="url(#cuteShadow)"
            strokeLinejoin="round"
          />
          {/* Base grass elements */}
          <path d="M 105 235 Q 110 220 115 235" stroke="#16241f" strokeWidth="3" strokeLinecap="round" />
          <path d="M 282 235 Q 288 222 292 235" stroke="#16241f" strokeWidth="3" strokeLinecap="round" />

          {/* Central Iron Supporting Pillar */}
          <rect
            x="193"
            y="75"
            width="14"
            height="145"
            rx="7"
            fill="#16241f"
            stroke="#16241f"
            strokeWidth="1"
          />
          {/* Support Brackets */}
          <path d="M 180 215 L 200 190 L 220 215" stroke="#16241f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Shiny Pillar Plate Center */}
          <rect x="198" y="85" width="4" height="125" rx="2" fill="#f4f6f1" opacity="0.15" />

          {/* ROTATING TRANSFOMED ASSEMBLY */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '200px 75px',
              transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            {/* The Main Curved Golden Beam */}
            <path
              d="M 60 77 Q 200 45 340 77 L 340 83 Q 200 51 60 83 Z"
              fill="url(#goldBeam)"
              stroke="#16241f"
              strokeWidth="3.5"
              filter="url(#cuteShadow)"
              strokeLinejoin="round"
            />
            {/* Center Pivot Decorative Dial (Cute Smiling Golden Star/Gear) */}
            <g transform="translate(200, 75)" filter="url(#cuteShadow)">
              <circle cx="0" cy="0" r="14" fill="#9c6f1f" stroke="#16241f" strokeWidth="3" />
              <circle cx="0" cy="0" r="9" fill="#fff4d4" stroke="#16241f" strokeWidth="2" />
              {/* Cute Smiling Face on central pivot */}
              <circle cx="-3" cy="-2" r="1.5" fill="#16241f" />
              <circle cx="3" cy="-2" r="1.5" fill="#16241f" />
              <path d="M -3 3 Q 0 6 3 3" stroke="#16241f" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Left Hanging Loop (Fact hook) */}
            <circle cx="65" cy="78" r="4.5" fill="#fffdf0" stroke="#16241f" strokeWidth="3" />
            {/* Right Hanging Loop (Opinion hook) */}
            <circle cx="335" cy="78" r="4.5" fill="#fffdf0" stroke="#16241f" strokeWidth="3" />

            {/* --- COUNTER-ROTATING LEFT PLATE: FACT --- */}
            <g
              style={{
                transform: `rotate(${-angle}deg)`,
                transformOrigin: '65px 78px',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              {/* Cute Cartoon Strings */}
              <line x1="65" y1="78" x2="30" y2="155" stroke="#16241f" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="65" y1="78" x2="100" y2="155" stroke="#16241f" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Golden Bowl Platform */}
              <path
                d="M 20 155 Q 65 185 110 155 Z"
                fill={currentSelection === 'fact' ? '#16241f' : '#fff4d4'}
                stroke="#16241f"
                strokeWidth="3.5"
                filter="url(#cuteShadow)"
                strokeLinejoin="round"
                className="transition-colors duration-500"
              />

              {/* FACT MASCOT (Cute Smart Scroll with specs and smile!) */}
              <g transform="translate(42, 110)" filter="url(#cuteShadow)" className="transition-all duration-300">
                {/* Scroll Body */}
                <path
                  d="M 5 0 L 40 0 C 43 0, 45 5, 45 10 L 45 35 C 45 40, 43 45, 40 45 L 5 45 C 2 45, 0 40, 0 35 L 0 10 C 0 5, 2 0, 5 0 Z"
                  fill="url(#scrollGradient)"
                  stroke="#16241f"
                  strokeWidth="3"
                />
                {/* Scroll Curled Edges */}
                <path d="M 0 5 Q 10 10 20 5 L 45 5 M 0 40 Q 10 35 20 40 L 45 40" stroke="#16241f" strokeWidth="2" fill="none" />
                
                {/* Big Intelligent Glasses */}
                <circle cx="15" cy="20" r="6" stroke="#16241f" strokeWidth="2.5" fill="none" />
                <circle cx="30" cy="20" r="6" stroke="#16241f" strokeWidth="2.5" fill="none" />
                <line x1="21" y1="20" x2="24" y2="20" stroke="#16241f" strokeWidth="2.5" />
                {/* Happy eyes behind glasses */}
                <circle cx="15" cy="20" r="1.5" fill="#16241f" />
                <circle cx="30" cy="20" r="1.5" fill="#16241f" />
                {/* Joyful grin */}
                <path d="M 20 28 Q 22.5 32 25 28" stroke="#16241f" strokeWidth="2" strokeLinecap="round" />
                
                {/* Magnifying Glass emblem */}
                <g transform="translate(18, 30) scale(0.6)">
                  <circle cx="10" cy="10" r="4" stroke="#9c6f1f" strokeWidth="2" fill="none" />
                  <line x1="13" y1="13" x2="18" y2="18" stroke="#16241f" strokeWidth="3" strokeLinecap="round" />
                </g>
              </g>

              {/* FACT Text Label Card */}
              <g transform="translate(65, 192)" filter="url(#cuteShadow)">
                <rect x="-30" y="-10" width="60" height="20" rx="10" fill="#16241f" stroke="#16241f" strokeWidth="2" />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  className="text-[10px] font-sans font-black fill-[#f4f6f1] tracking-wider"
                >
                  FACT
                </text>
              </g>
            </g>

            {/* --- COUNTER-ROTATING RIGHT PLATE: OPINION --- */}
            <g
              style={{
                transform: `rotate(${-angle}deg)`,
                transformOrigin: '335px 78px',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              {/* Cute Cartoon Strings */}
              <line x1="335" y1="78" x2="300" y2="155" stroke="#16241f" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="335" y1="78" x2="370" y2="155" stroke="#16241f" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Golden Bowl Platform */}
              <path
                d="M 290 155 Q 335 185 380 155 Z"
                fill={currentSelection === 'opinion' ? '#9c6f1f' : '#fff4d4'}
                stroke="#16241f"
                strokeWidth="3.5"
                filter="url(#cuteShadow)"
                strokeLinejoin="round"
                className="transition-colors duration-500"
              />

              {/* OPINION MASCOT (Cute Puffy Dreamy Cloud sleeping/smiling!) */}
              <g transform="translate(305, 105)" filter="url(#cuteShadow)">
                {/* Cloud Shape */}
                <path
                  d="M 12 30 C 5 30, 0 25, 0 18 C 0 11, 8 7, 15 10 C 18 3, 28 0, 36 5 C 44 2, 50 8, 50 15 C 50 22, 45 28, 38 28 Z"
                  fill="url(#cloudGradient)"
                  stroke="#16241f"
                  strokeWidth="3"
                />
                
                {/* Cute Winking or Cozy Sleeping Eyes */}
                {currentSelection === 'opinion' ? (
                  // Happy Eyes Open Smile
                  <g>
                    <path d="M 12 14 Q 15 11 18 14" stroke="#16241f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M 28 14 Q 31 11 34 14" stroke="#16241f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <circle cx="15" cy="18" r="1.5" fill="#16241f" />
                    <circle cx="31" cy="18" r="1.5" fill="#16241f" />
                  </g>
                ) : (
                  // Cozy Sleeping Eyes
                  <g>
                    <path d="M 12 16 Q 15 19 18 16" stroke="#16241f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M 28 16 Q 31 19 34 16" stroke="#16241f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </g>
                )}
                {/* Rosy Cheeks */}
                <ellipse cx="10" cy="20" rx="3.5" ry="2" fill="#fca5a5" />
                <ellipse cx="34" cy="20" rx="3.5" ry="2" fill="#fca5a5" />
                {/* Sweet smiling open mouth */}
                <path d="M 21 21 Q 23 25 25 21" stroke="#16241f" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Magic floating sparkles */}
                <g transform="translate(42, -5) scale(0.6)">
                  <path d="M 5 0 L 7 3 L 12 5 L 7 7 L 5 12 L 3 7 L 0 5 L 3 3 Z" fill="#9c6f1f" />
                </g>
              </g>

              {/* OPINION Text Label Card */}
              <g transform="translate(335, 192)" filter="url(#cuteShadow)">
                <rect x="-38" y="-10" width="76" height="20" rx="10" fill="#9c6f1f" stroke="#16241f" strokeWidth="2" />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  className="text-[10px] font-sans font-black fill-[#f4f6f1] tracking-wider"
                >
                  OPINION
                </text>
              </g>
            </g>
          </g>
        </svg>

        {/* Dynamic Interactive Hint Banner */}
        {isCorrect === true && (
          <div className="absolute top-4 left-4 right-4 bg-green-100 border-2 border-[#16241f] rounded-xl px-4 py-2 text-center animate-bounce shadow-md">
            <p className="text-xs font-sans font-extrabold text-[#16241f]">
              🎉 AMAZING JOB! You weighed the concept correctly!
            </p>
          </div>
        )}
      </div>

      {/* 3. The Active Textbook Statement Box */}
      <div
        className={`w-full p-5 rounded-2xl border-3 transition-all duration-300 my-4 text-center relative ${
          isCorrect === true
            ? 'bg-green-100/50 border-[#16241f] shadow-[4px_4px_0px_0px_rgba(22,36,31,1)]'
            : isCorrect === false
            ? 'animate-shake bg-red-100 border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]'
            : 'bg-white border-[#16241f] shadow-[4px_4px_0px_0px_rgba(22,36,31,1)]'
        }`}
      >
        <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-md text-[9px] font-sans font-extrabold uppercase bg-[#16241f] text-white">
          Active Concept Statement
        </span>
        <p className="font-sans text-[#16241f] text-base md:text-lg leading-relaxed font-bold italic pt-1">
          "{statement}"
        </p>
      </div>

      {/* 4. Playful Large Chunky Buttons */}
      <div className="flex gap-4 w-full mt-1.5 z-20">
        <button
          onClick={() => onSelect('fact')}
          className={`flex-1 py-4 px-4 rounded-2xl font-sans font-black text-sm uppercase tracking-wider border-3 border-[#16241f] transition-all duration-200 active:translate-y-0 active:shadow-none ${
            currentSelection === 'fact'
              ? 'bg-[#16241f] text-[#f4f6f1] shadow-none translate-y-1'
              : 'bg-white text-[#16241f] shadow-[4px_4px_0px_0px_rgba(22,36,31,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(22,36,31,1)]'
          }`}
        >
          🔍 Prove as Fact
        </button>
        <button
          onClick={() => onSelect('opinion')}
          className={`flex-1 py-4 px-4 rounded-2xl font-sans font-black text-sm uppercase tracking-wider border-3 border-[#16241f] transition-all duration-200 active:translate-y-0 active:shadow-none ${
            currentSelection === 'opinion'
              ? 'bg-[#9c6f1f] text-white shadow-none translate-y-1'
              : 'bg-white text-[#16241f] shadow-[4px_4px_0px_0px_rgba(22,36,31,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(22,36,31,1)]'
          }`}
        >
          💭 Feel as Opinion
        </button>
      </div>

      {/* 5. Mascot Assistant Box */}
      <div className="w-full border-t-3 border-dashed border-[#16241f]/20 pt-4 mt-4 flex items-start gap-3">
        <div className="w-12 h-10 rounded-2xl bg-[#9c6f1f]/15 border-2 border-[#16241f] flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-sm">
          🦘
        </div>
        <div className="flex-1 bg-white p-3.5 rounded-2xl border-3 border-[#16241f] relative shadow-[3px_3px_0px_0px_rgba(22,36,31,1)]">
          <div className="absolute -left-2 top-3.5 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-[#16241f] border-b-6 border-b-transparent" />
          <p className="text-xs font-sans text-[#16241f] leading-relaxed font-bold">
            {showHint ? (
              <span>
                💡 <span className="text-[#9c6f1f]">Ezy's Clue:</span> Ask yourself, can we measure, test, or check clocks or dates to see if this statement is 100% true for everyone? If yes, it's a Fact! If it is just how someone feels or believes, it's an Opinion!
              </span>
            ) : (
              "Need a helper clue from your buddy Ezy? Tap the button below!"
            )}
          </p>
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-[10px] font-sans font-black text-[#9c6f1f] hover:underline mt-2 flex items-center gap-1"
            >
              💡 Ask Ezy for a Clue!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
