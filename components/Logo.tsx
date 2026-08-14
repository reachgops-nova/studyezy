// Brand mark: "Ezy" the kangaroo mascot, matching the in-lesson avatar (see
// components/Avatar.tsx). Small, set-back ears and an elongated snout are
// the cues that actually read as "kangaroo" rather than fox/rabbit at small
// sizes - verified visually before shipping, not just by eye on path data.
let gradientIdCounter = 0;

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  const id = `roo-${++gradientIdCounter}`;
  return (
    <svg viewBox="0 0 200 175" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="30" y1="10" x2="170" y2="175" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <ellipse cx="128" cy="42" rx="13" ry="19" fill={`url(#${id})`} transform="rotate(-8 128 42)" />
      <ellipse cx="72" cy="42" rx="13" ry="19" fill={`url(#${id})`} transform="rotate(8 72 42)" />
      <ellipse cx="127" cy="45" rx="7" ry="12" fill="#fff7ed" transform="rotate(-8 127 45)" />
      <ellipse cx="73" cy="45" rx="7" ry="12" fill="#fff7ed" transform="rotate(8 73 45)" />
      <ellipse cx="100" cy="88" rx="42" ry="38" fill={`url(#${id})`} />
      <path
        d="M64,96 C64,130 78,160 100,168 C122,160 136,130 136,96 C136,120 120,132 100,132 C80,132 64,120 64,96 Z"
        fill={`url(#${id})`}
      />
      <ellipse cx="100" cy="140" rx="24" ry="34" fill="#fff7ed" />
      <ellipse cx="82" cy="82" rx="7" ry="9" fill="#1e2a4a" />
      <ellipse cx="118" cy="82" rx="7" ry="9" fill="#1e2a4a" />
      <circle cx="79.7" cy="78.5" r="1.9" fill="#fff" />
      <circle cx="115.7" cy="78.5" r="1.9" fill="#fff" />
      <ellipse cx="88" cy="70" rx="6" ry="4" fill="#fdba74" opacity="0.55" />
      <ellipse cx="112" cy="70" rx="6" ry="4" fill="#fdba74" opacity="0.55" />
      <path
        d="M95,128 C95,124.5 105,124.5 105,128 C105,132 100,136 100,136 C100,136 95,132 95,128 Z"
        fill="#1e2a4a"
      />
      <path d="M88,144 Q100,151 112,144" stroke="#1e2a4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
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
        <span className="text-brand-navy">Study</span>
        <span className="text-orange-500">Ezy</span>
      </span>
    </span>
  );
}
