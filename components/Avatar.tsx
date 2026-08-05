"use client";

// Original simple mascot - "Ezy" the fox, matching the fox/panda/lion demo
// profile emoji theme from the login screen. No third-party or licensed
// character art involved.
export default function Avatar({ speaking }: { speaking: boolean }) {
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-sm">
        <ellipse cx="50" cy="55" rx="38" ry="34" fill="#f97316" />
        <path d="M15 35 L30 15 L38 40 Z" fill="#f97316" />
        <path d="M85 35 L70 15 L62 40 Z" fill="#f97316" />
        <path d="M20 32 L29 20 L34 38 Z" fill="#fff7ed" />
        <path d="M80 32 L71 20 L66 38 Z" fill="#fff7ed" />
        <path d="M50 48 L38 68 Q50 78 62 68 Z" fill="#fff7ed" />
        <circle cx="36" cy="52" r="5" fill="#1f2937" />
        <circle cx="64" cy="52" r="5" fill="#1f2937" />
        <circle cx="50" cy="60" r="3" fill="#1f2937" />
        <path
          d={speaking ? "M42 70 Q50 80 58 70" : "M43 71 Q50 75 57 71"}
          stroke="#1f2937"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          className={speaking ? "origin-center animate-pulse" : undefined}
        />
      </svg>
      {speaking && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-blue-500" />
        </span>
      )}
    </div>
  );
}
