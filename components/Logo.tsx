// Brand mark: a simplified version of "Ezy" the fox mascot used throughout
// the avatar-led lesson (see components/Avatar.tsx) - reusing the same
// palette/shapes so the brand mark and the in-lesson character read as the
// same character, not two unrelated designs.
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <ellipse cx="50" cy="55" rx="38" ry="34" fill="#f97316" />
      <path d="M15 35 L30 15 L38 40 Z" fill="#f97316" />
      <path d="M85 35 L70 15 L62 40 Z" fill="#f97316" />
      <path d="M20 32 L29 20 L34 38 Z" fill="#fff7ed" />
      <path d="M80 32 L71 20 L66 38 Z" fill="#fff7ed" />
      <path d="M50 48 L38 68 Q50 78 62 68 Z" fill="#fff7ed" />
      <circle cx="36" cy="52" r="5" fill="#1f2937" />
      <circle cx="64" cy="52" r="5" fill="#1f2937" />
      <circle cx="50" cy="60" r="3" fill="#1f2937" />
      <path d="M43 71 Q50 75 57 71" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
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
