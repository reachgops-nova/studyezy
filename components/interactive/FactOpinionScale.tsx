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

  // Dynamically calculate the balance beam tilt based on the selected answer
  useEffect(() => {
    if (currentSelection === 'fact') {
      // Tilt left (Fact plate goes down, heavy with evidence)
      setAngle(-12);
    } else if (currentSelection === 'opinion') {
      // Tilt right (Opinion plate goes down, light/personal)
      setAngle(12);
    } else {
      // Balanced
      setAngle(0);
    }
  }, [currentSelection]);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-6 bg-[#f4f6f1] rounded-2xl border-2 border-[#16241f]/10 shadow-sm max-w-md mx-auto">
      {/* 1. Header / Concept Hook */}
      <div className="text-center mb-4">
        <h3 className="font-serif text-[#16241f] text-lg font-semibold tracking-tight">
          Provable vs. Personal
        </h3>
        <p className="text-xs text-[#16241f]/60 font-sans mt-0.5">
          Does it weigh down with facts, or float like an opinion?
        </p>
      </div>

      {/* 2. Interactive SVG Balance Scale */}
      <div className="relative w-full h-48 flex items-center justify-center my-2 overflow-visible">
        <svg
          viewBox="0 0 300 200"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base & Stand (Static - Stays Anchored) */}
          <path
            d="M 130 180 L 170 180 L 160 170 L 140 170 Z"
            fill="#16241f"
            opacity="0.15"
          />
          {/* Main Pillar */}
          <rect x="146" y="60" width="8" height="110" rx="4" fill="#16241f" />
          {/* Base Stand Line */}
          <rect x="110" y="166" width="80" height="6" rx="3" fill="#16241f" />
          {/* Center Pivot Point */}
          <circle cx="150" cy="64" r="7" fill="#9c6f1f" stroke="#f4f6f1" strokeWidth="2" className="z-10" />

          {/* ROTATING BEAM ASSEMBLY */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '150px 64px',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* The Main Horizontal Beam */}
            <path
              d="M 50 62 L 250 62 L 250 66 L 50 62 Z"
              fill="#16241f"
            />
            {/* Left Hanging Loop (For Fact Plate) */}
            <circle cx="50" cy="64" r="3" fill="#9c6f1f" />
            {/* Right Hanging Loop (For Opinion Plate) */}
            <circle cx="250" cy="64" r="3" fill="#9c6f1f" />

            {/* --- LEFT PLATE: FACT (Counter-rotates to stay upright!) --- */}
            <g
              style={{
                transform: `rotate(${-angle}deg)`,
                transformOrigin: '50px 64px',
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Left Plate Strings */}
              <line x1="50" y1="64" x2="25" y2="120" stroke="#16241f" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="50" y1="64" x2="75" y2="120" stroke="#16241f" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              {/* Left Plate Bowl */}
              <path
                d="M 20 120 Q 50 145 80 120 Z"
                fill={currentSelection === 'fact' ? '#16241f' : '#16241f/10'}
                stroke="#16241f"
                strokeWidth="2.5"
                className="transition-colors duration-300"
              />
              {/* Fact Symbol Floating over Left Bowl: Document with Checkmark */}
              <g transform="translate(40, 90)">
                <rect
                  x="2"
                  y="2"
                  width="16"
                  height="20"
                  rx="2"
                  fill="#f4f6f1"
                  stroke={currentSelection === 'fact' ? '#9c6f1f' : '#16241f'}
                  strokeWidth="2"
                />
                <path
                  d="M 6 12 L 9 15 L 14 8"
                  stroke="#9c6f1f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={currentSelection === 'fact' ? 1 : 0.4}
                />
              </g>
              {/* Text Label */}
              <text x="50" y="152" textAnchor="middle" className="text-[10px] font-sans font-bold fill-[#16241f] tracking-wider uppercase">
                FACT
              </text>
            </g>

            {/* --- RIGHT PLATE: OPINION (Counter-rotates to stay upright!) --- */}
            <g
              style={{
                transform: `rotate(${-angle}deg)`,
                transformOrigin: '250px 64px',
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Right Plate Strings */}
              <line x1="250" y1="64" x2="225" y2="120" stroke="#16241f" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="250" y1="64" x2="275" y2="120" stroke="#16241f" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              {/* Right Plate Bowl */}
              <path
                d="M 220 120 Q 250 145 280 120 Z"
                fill={currentSelection === 'opinion' ? '#9c6f1f' : '#16241f/10'}
                stroke={currentSelection === 'opinion' ? '#9c6f1f' : '#16241f'}
                strokeWidth="2.5"
                className="transition-colors duration-300"
              />
              {/* Opinion Symbol Floating over Right Bowl: Thought Bubble */}
              <g transform="translate(238, 90)">
                <path
                  d="M 4 10 C 4 6, 8 4, 12 4 C 16 4, 20 6, 20 10 C 20 12, 18 14, 16 15 C 15 17, 16 19, 13 18 C 12 18, 11 18, 10 18 C 6 18, 4 14, 4 10 Z"
                  fill="#f4f6f1"
                  stroke={currentSelection === 'opinion' ? '#9c6f1f' : '#16241f'}
                  strokeWidth="2"
                />
                <circle cx="9" cy="10" r="1.5" fill="#16241f" opacity="0.5" />
                <circle cx="12" cy="10" r="1.5" fill="#16241f" opacity="0.5" />
                <circle cx="15" cy="10" r="1.5" fill="#16241f" opacity="0.5" />
              </g>
              {/* Text Label */}
              <text x="250" y="152" textAnchor="middle" className="text-[10px] font-sans font-bold fill-[#16241f] tracking-wider uppercase">
                OPINION
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* 3. The Active Textbook Statement Box */}
      <div
        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 my-3 text-center ${
          isCorrect === true
            ? 'bg-[#16241f]/5 border-[#16241f] shadow-sm'
            : isCorrect === false
            ? 'animate-shake bg-red-500/5 border-red-500/30'
            : 'bg-white border-[#16241f]/10 shadow-sm'
        }`}
      >
        <p className="font-sans text-[#16241f] text-sm md:text-base leading-relaxed font-medium">
          "{statement}"
        </p>
      </div>

      {/* 4. Sleek Selection Buttons (Forest Ink vs. Gold accent) */}
      <div className="flex gap-3 w-full mt-2">
        <button
          onClick={() => onSelect('fact')}
          className={`flex-1 py-3 px-4 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
            currentSelection === 'fact'
              ? 'bg-[#16241f] text-[#f4f6f1] shadow-md transform -translate-y-0.5'
              : 'bg-white text-[#16241f] border-2 border-[#16241f]/10 hover:border-[#16241f]/30 hover:bg-[#16241f]/5'
          }`}
        >
          🔍 Prove as Fact
        </button>
        <button
          onClick={() => onSelect('opinion')}
          className={`flex-1 py-3 px-4 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
            currentSelection === 'opinion'
              ? 'bg-[#9c6f1f] text-[#f4f6f1] shadow-md transform -translate-y-0.5'
              : 'bg-white text-[#16241f] border-2 border-[#16241f]/10 hover:border-[#16241f]/30 hover:bg-[#16241f]/5'
          }`}
        >
          💭 Feel as Opinion
        </button>
      </div>
    </div>
  );
};
