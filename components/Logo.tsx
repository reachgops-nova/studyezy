// Brand mark: "Ezy" the fox mascot used throughout the avatar-led lesson
// (see components/Avatar.tsx) - reusing the same palette so the brand mark
// and the in-lesson character read as the same character. Refined from the
// original flat-polygon version with proper triangular fox ears, smooth
// bezier curves, and a gradient for depth.
let gradientIdCounter = 0;

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  const gradientId = `foxGrad-${++gradientIdCounter}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="30" y1="20" x2="170" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path d="M118,85 C122,55 132,25 148,12 C158,30 168,55 172,80 Z" fill={`url(#${gradientId})`} />
      <path d="M82,85 C78,55 68,25 52,12 C42,30 32,55 28,80 Z" fill={`url(#${gradientId})`} />
      <path d="M124,80 C127,58 135,36 146,26 C153,40 160,58 162,76 Z" fill="#fff7ed" />
      <path d="M76,80 C73,58 65,36 54,26 C47,40 40,58 38,76 Z" fill="#fff7ed" />
      <ellipse cx="100" cy="118" rx="64" ry="58" fill={`url(#${gradientId})`} />
      <ellipse cx="100" cy="142" rx="34" ry="28" fill="#fff7ed" />
      <ellipse cx="76" cy="112" rx="8" ry="10" fill="#1e293b" />
      <ellipse cx="124" cy="112" rx="8" ry="10" fill="#1e293b" />
      <circle cx="73" cy="108" r="2.2" fill="#fff" />
      <circle cx="121" cy="108" r="2.2" fill="#fff" />
      <path
        d="M93,130 C93,126 107,126 107,130 C107,135 100,140 100,140 C100,140 93,135 93,130 Z"
        fill="#1e293b"
      />
      <path d="M84,150 Q100,160 116,150" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({
  className = "h-8 w-8",
  textClassName = "text-lg",
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={className} />
      <span className={`font-bold tracking-tight ${textClassName}`}>
        <span className="text-slate-800">Study</span>
        <span className="text-orange-500">Ezy</span>
      </span>
    </span>
  );
}
