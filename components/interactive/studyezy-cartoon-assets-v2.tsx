import React from 'react';

// StudyEzy Production-Ready Cartoon Assets (Version 2)
// Built specifically for the live brand tokens:
// - Ink: #16241f (Deep Forest Ink)
// - Paper: #f4f6f1 (Warm Recycled Paper background)
// - Gold: #9c6f1f (Golden Accent)

interface CartoonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

// 1. Jo's Facial Expression Cartoon (Unit 1.2 - Implicit Meaning)
// Supports BOTH isWinking and isGrinning states to teach kids how facial cues reveal character traits.
interface JoWinkAndGrinProps extends CartoonProps {
  isWinking?: boolean;
  isGrinning?: boolean;
}

export const JoWinkCartoon: React.FC<JoWinkAndGrinProps> = ({
  isWinking = false,
  isGrinning = false,
  className = '',
  width = '100%',
  height = '100%',
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      width={width}
      height={height}
      className={`select-none ${className}`}
      style={{ background: '#f4f6f1' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background container border */}
      <rect x="5" y="5" width="190" height="190" rx="20" fill="none" stroke="#16241f" strokeWidth="3" strokeDasharray="6,4" />
      
      {/* Face Base */}
      <circle cx="100" cy="100" r="70" fill="#f4f6f1" stroke="#16241f" strokeWidth="4" />
      
      {/* Rosy Cheeks */}
      <circle cx="65" cy="120" r="12" fill="#9c6f1f" fillOpacity="0.25" />
      <circle cx="135" cy="120" r="12" fill="#9c6f1f" fillOpacity="0.25" />

      {/* Left Eye (Always open and curious) */}
      <circle cx="70" cy="90" r="8" fill="#16241f" />
      <circle cx="68" cy="88" r="3" fill="#f4f6f1" /> {/* Eye Highlight */}

      {/* Right Eye (Winking state transitions) */}
      {isWinking ? (
        // Winking Eye Path (Curved happy line)
        <path
          d="M 120 92 Q 130 82 140 92"
          fill="none"
          stroke="#16241f"
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      ) : (
        // Normal Open Eye
        <g className="transition-all duration-300 ease-in-out">
          <circle cx="130" cy="90" r="8" fill="#16241f" />
          <circle cx="128" cy="88" r="3" fill="#f4f6f1" />
        </g>
      )}

      {/* Eyebrows */}
      <path d="M 60 78 Q 70 70 80 75" fill="none" stroke="#16241f" strokeWidth="3" strokeLinecap="round" />
      <path d="M 120 75 Q 130 70 140 78" fill="none" stroke="#16241f" strokeWidth="3" strokeLinecap="round" />

      {/* Mouth (Grinning vs Normal Smile) */}
      {isGrinning ? (
        // Wide mischievous grin (showing teeth)
        <g className="transition-all duration-300 ease-in-out">
          {/* Grin background */}
          <path d="M 75 120 Q 100 155 125 120 Z" fill="#9c6f1f" fillOpacity="0.8" stroke="#16241f" strokeWidth="4" strokeLinejoin="round" />
          {/* Teeth line */}
          <path d="M 77 125 Q 100 135 123 125" fill="none" stroke="#f4f6f1" strokeWidth="3" />
        </g>
      ) : (
        // Sweet subtle smile
        <path
          d="M 82 125 Q 100 138 118 125"
          fill="none"
          stroke="#16241f"
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      )}

      {/* Cute freckles */}
      <circle cx="95" cy="105" r="1.5" fill="#9c6f1f" />
      <circle cx="105" cy="105" r="1.5" fill="#9c6f1f" />
      <circle cx="100" cy="109" r="1.5" fill="#9c6f1f" />
    </svg>
  );
};

// 2. Sentence Train Steam Locomotive (Unit 1.9 - Clause Connectors)
// Visual feedback for connecting simple, compound, and complex clauses.
interface SentenceTrainProps extends CartoonProps {
  isSnapped?: boolean;
  connectorText?: string;
}

export const SentenceTrain: React.FC<SentenceTrainProps> = ({
  isSnapped = false,
  connectorText = '?',
  className = '',
  width = '100%',
  height = '100%',
}) => {
  return (
    <svg
      viewBox="0 0 450 160"
      width={width}
      height={height}
      className={`select-none ${className}`}
      style={{ background: '#f4f6f1' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ground Line */}
      <line x1="20" y1="130" x2="430" y2="130" stroke="#16241f" strokeWidth="4" strokeLinecap="round" />

      {/* CARRIAGE 1: Left (Independent Clause) */}
      <g className="transition-transform duration-500 ease-out" style={{ transform: isSnapped ? 'translateX(15px)' : 'translateX(0px)' }}>
        {/* Wheels */}
        <circle cx="50" cy="120" r="12" fill="#16241f" />
        <circle cx="110" cy="120" r="12" fill="#16241f" />
        <circle cx="50" cy="120" r="5" fill="#9c6f1f" />
        <circle cx="110" cy="120" r="5" fill="#9c6f1f" />
        
        {/* Carriage body */}
        <rect x="35" y="45" width="90" height="65" rx="10" fill="#f4f6f1" stroke="#16241f" strokeWidth="4" />
        {/* Window */}
        <rect x="50" y="55" width="60" height="25" rx="4" fill="#9c6f1f" fillOpacity="0.15" stroke="#16241f" strokeWidth="3" />
        
        {/* Text Label */}
        <text x="80" y="100" fill="#16241f" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          CLAUSE A
        </text>
      </g>

      {/* COUPLER (Connector Block) */}
      <g className="transition-all duration-500" style={{ opacity: isSnapped ? 1 : 0.65 }}>
        {/* Coupling bars */}
        <line x1="125" y1="80" x2="310" y2="80" stroke="#16241f" strokeWidth="4" strokeDasharray={isSnapped ? '0' : '4,4'} />
        
        {/* Glowing connector bubble */}
        <rect
          x="195"
          y="55"
          width="60"
          height="45"
          rx="12"
          fill={isSnapped ? '#9c6f1f' : '#f4f6f1'}
          stroke="#16241f"
          strokeWidth="4"
          className="transition-colors duration-300"
        />
        
        {/* Connector word */}
        <text
          x="225"
          y="83"
          fill={isSnapped ? '#f4f6f1' : '#16241f'}
          fontSize="14"
          fontWeight="bold"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          {connectorText}
        </text>
      </g>

      {/* CARRIAGE 2: Right Locomotive (Clause B) */}
      <g className="transition-transform duration-500 ease-out" style={{ transform: isSnapped ? 'translateX(-15px)' : 'translateX(0px)' }}>
        {/* Wheels */}
        <circle cx="330" cy="120" r="12" fill="#16241f" />
        <circle cx="390" cy="120" r="12" fill="#16241f" />
        <circle cx="330" cy="120" r="5" fill="#9c6f1f" />
        <circle cx="390" cy="120" r="5" fill="#9c6f1f" />

        {/* Engine Body */}
        <rect x="310" y="45" width="95" height="65" rx="8" fill="#f4f6f1" stroke="#16241f" strokeWidth="4" />
        {/* Driver Cab */}
        <rect x="315" y="25" width="45" height="25" rx="4" fill="#f4f6f1" stroke="#16241f" strokeWidth="4" />
        <rect x="323" y="32" width="28" height="12" rx="2" fill="#9c6f1f" fillOpacity="0.15" stroke="#16241f" strokeWidth="3" />

        {/* Funnel / Smokestack */}
        <rect x="380" y="20" width="12" height="25" fill="#f4f6f1" stroke="#16241f" strokeWidth="4" />
        <line x1="376" y1="20" x2="396" y2="20" stroke="#16241f" strokeWidth="4" strokeLinecap="round" />

        {/* Animated Steam puff (Only appears on snap) */}
        {isSnapped && (
          <g className="animate-bounce">
            <circle cx="388" cy="5" r="7" fill="#9c6f1f" fillOpacity="0.3" />
            <circle cx="398" cy="-2" r="5" fill="#9c6f1f" fillOpacity="0.2" />
          </g>
        )}

        <text x="358" y="100" fill="#16241f" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          CLAUSE B
        </text>
      </g>
    </svg>
  );
};

// 3. Droppy the Water Droplet (Unit 4.1 Science / English Explanation Texts)
// Beautiful mult-state mascot helper that handles evaporation, condensation, and rain states.
interface DroppyProps extends CartoonProps {
  state: 'evaporating' | 'condensing' | 'raining' | 'idle';
}

export const DroppyWaterCycle: React.FC<DroppyProps> = ({
  state,
  className = '',
  width = '100%',
  height = '100%',
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      width={width}
      height={height}
      className={`select-none ${className}`}
      style={{ background: '#f4f6f1' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Frame */}
      <rect x="5" y="5" width="190" height="190" rx="24" fill="none" stroke="#16241f" strokeWidth="2" strokeDasharray="4,4" />

      {/* Condensation Cloud (Visible or dark depending on state) */}
      <path
        d="M 40 50 Q 30 35 50 30 Q 65 15 90 25 Q 110 15 130 25 Q 150 20 150 40 Q 165 50 150 65 L 45 65 Z"
        fill="#f4f6f1"
        stroke="#16241f"
        strokeWidth="4"
        strokeLinejoin="round"
        className={`transition-all duration-500 ${state === 'condensing' || state === 'raining' ? 'fill-brand-gold opacity-90' : 'opacity-25'}`}
        style={{ fill: state === 'raining' ? '#9c6f1f' : undefined }}
      />

      {/* Evaporation Waves rising from the ocean */}
      <g className={`transition-opacity duration-500 ${state === 'evaporating' ? 'opacity-100' : 'opacity-0'}`}>
        <path d="M 60 160 Q 65 145 60 130" fill="none" stroke="#9c6f1f" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
        <path d="M 100 160 Q 105 145 100 130" fill="none" stroke="#9c6f1f" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
        <path d="M 140 160 Q 145 145 140 130" fill="none" stroke="#9c6f1f" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
      </g>

      {/* Droppy Mascot Droplet Body */}
      <g
        className="transition-all duration-700 ease-in-out"
        style={{
          transform:
            state === 'evaporating'
              ? 'translateY(-60px) scale(0.9)'
              : state === 'condensing'
              ? 'translate(25px, -85px) scale(0.8)'
              : state === 'raining'
              ? 'translateY(55px) scale(1)'
              : 'none',
        }}
      >
        {/* Droplet outline */}
        <path
          d="M 100 90 C 70 130 70 160 100 160 C 130 160 130 130 100 90 Z"
          fill="#f4f6f1"
          stroke="#16241f"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Droppy Face */}
        <g>
          {/* Eyes */}
          <circle cx="90" cy="135" r="4.5" fill="#16241f" />
          <circle cx="110" cy="135" r="4.5" fill="#16241f" />
          <circle cx="88" cy="133" r="1.5" fill="#f4f6f1" />
          <circle cx="108" cy="133" r="1.5" fill="#f4f6f1" />

          {/* Rosy Cheeks */}
          <circle cx="83" cy="140" r="4" fill="#9c6f1f" fillOpacity="0.4" />
          <circle cx="117" cy="140" r="4" fill="#9c6f1f" fillOpacity="0.4" />

          {/* Mouth (expression changes based on state) */}
          {state === 'evaporating' ? (
            // Dizzy, warm, floating mouth "o"
            <circle cx="100" cy="144" r="5.5" fill="none" stroke="#16241f" strokeWidth="3" />
          ) : state === 'raining' ? (
            // Super excited shouting smile
            <path d="M 94 142 Q 100 154 106 142 Z" fill="#9c6f1f" stroke="#16241f" strokeWidth="3" />
          ) : (
            // Cozy smile
            <path d="M 95 143 Q 100 148 105 143" fill="none" stroke="#16241f" strokeWidth="3" strokeLinecap="round" />
          )}
        </g>
      </g>

      {/* Ground Water Reservoir / Waves at bottom */}
      <path
        d="M 10 180 Q 55 170 100 180 Q 145 190 190 180 L 190 195 L 10 195 Z"
        fill="#16241f"
        stroke="#16241f"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
};
