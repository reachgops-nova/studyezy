// Landing-page hero art: Ezy the kangaroo reading, built from the same
// proven head geometry as Logo.tsx/Avatar.tsx (small set-back ears,
// elongated snout) so the mascot stays consistent everywhere it appears.
export default function HeroIllustration({ className = "w-full max-w-md" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 420" className={className} role="img" aria-label="Ezy the kangaroo, sitting and reading an open book">
      <defs>
        <linearGradient id="heroRoo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>

      <ellipse cx="320" cy="392" rx="160" ry="14" fill="#1e2a4a" opacity="0.06" />

      <path
        d="M225,388 C205,318 215,258 255,228 C260,205 280,190 300,188 C320,186 335,198 338,215 C378,225 448,255 438,340 C433,368 415,388 395,388 Z"
        fill="url(#heroRoo)"
      />

      <path
        d="M410,345 C460,350 495,315 485,265 C480,238 458,232 452,252 C462,260 455,298 415,315 C405,322 400,338 410,345 Z"
        fill="url(#heroRoo)"
      />

      <ellipse cx="325" cy="325" rx="60" ry="66" fill="#fff7ed" />

      <path
        d="M268,295 C250,302 240,320 246,340 C251,330 264,320 276,315 Z"
        fill="url(#heroRoo)"
      />

      <path
        d="M270,140 C270,120 380,120 380,140 L390,230 C390,250 260,250 260,230 Z"
        fill="url(#heroRoo)"
      />

      <g transform="translate(195,45) scale(1.05)">
        <ellipse cx="128" cy="42" rx="13" ry="19" fill="url(#heroRoo)" transform="rotate(-8 128 42)" />
        <ellipse cx="72" cy="42" rx="13" ry="19" fill="url(#heroRoo)" transform="rotate(8 72 42)" />
        <ellipse cx="127" cy="45" rx="7" ry="12" fill="#fff7ed" transform="rotate(-8 127 45)" />
        <ellipse cx="73" cy="45" rx="7" ry="12" fill="#fff7ed" transform="rotate(8 73 45)" />
        <ellipse cx="100" cy="88" rx="42" ry="38" fill="url(#heroRoo)" />
        <path
          d="M64,96 C64,130 78,160 100,168 C122,160 136,130 136,96 C136,120 120,132 100,132 C80,132 64,120 64,96 Z"
          fill="url(#heroRoo)"
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
        <path d="M84,144 Q100,155 116,144" stroke="#1e2a4a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      <path
        d="M260,290 C260,280 302,273 322,273 L322,336 C302,336 260,341 260,332 Z"
        fill="#fff7ed"
        stroke="#ea580c"
        strokeWidth="2.5"
      />
      <path
        d="M384,290 C384,280 342,273 322,273 L322,336 C342,336 384,341 384,332 Z"
        fill="#fff7ed"
        stroke="#ea580c"
        strokeWidth="2.5"
      />
      <path d="M268,287 L310,281 M268,298 L310,292 M268,309 L310,303" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
      <path d="M376,287 L334,281 M376,298 L334,292 M376,309 L334,303" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />

      <path
        d="M376,273 C396,279 408,296 402,315 C395,306 384,297 372,293 Z"
        fill="url(#heroRoo)"
      />
    </svg>
  );
}
