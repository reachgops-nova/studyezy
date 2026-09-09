import React from 'react';

// Generalizes the earlier DecimalConceptScene (built for just concept 1.1)
// into a small set of reusable, DATA-DRIVEN scene shapes - real user
// direction 2026-09-09: "start working on other topics... in parallel."
// Hand-building one bespoke React component per concept doesn't scale past
// a single pilot; these 6 shapes cover every number concept in Unit 1
// (1.1-1.5) via a spec object instead, and the same shapes will very
// likely cover most future Math concepts too (place value, shifting
// digits, number lines, and sequences show up constantly in primary
// maths) without needing a new component each time.
export type NumberSceneSpec =
  | { type: 'placeValueChart'; columns: string[]; values: (string | number)[]; caption: string }
  | { type: 'blocksSplit'; count: number; shaded: number; unitLabel: string; caption: string }
  | { type: 'regroup'; from: string; to: string; caption: string }
  | { type: 'digitShift'; before: string; after: string; direction: 'left' | 'right'; places: number; caption: string }
  | { type: 'numberLine'; from: number; to: number; marker: number; path?: number[]; caption: string }
  | { type: 'sequenceSteps'; terms: (number | string)[]; rule: string; caption: string };

function PlaceValueChart({ columns, values, caption }: Extract<NumberSceneSpec, { type: 'placeValueChart' }>) {
  return (
    <>
      <div className="overflow-hidden rounded-lg border-2 border-[#16241f] bg-white">
        <div
          className="grid py-1 text-center text-[9px] font-bold uppercase tracking-wide text-white bg-[#16241f]"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
        <div
          className="grid items-center py-2 text-center text-lg font-black text-[#16241f]"
          style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}
        >
          {values.map((v, i) => (
            <div key={i} className={typeof v === 'string' && (v === '•' || v === '.') ? 'text-[#9c6f1f]' : ''}>
              {v}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function BlocksSplit({ count, shaded, unitLabel, caption }: Extract<NumberSceneSpec, { type: 'blocksSplit' }>) {
  return (
    <>
      <div className="flex h-9 gap-0.5 overflow-hidden rounded-lg border-2 border-[#16241f]/20 bg-white p-0.5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`flex flex-1 items-center justify-center rounded text-[8px] font-bold ${
              i < shaded ? 'bg-[#9c6f1f] text-white' : 'bg-gray-100 text-[#16241f]/20'
            }`}
            style={{ animation: `fade-in 0.25s ease ${i * 0.06}s both` }}
          >
            {i < shaded ? unitLabel : ''}
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function Regroup({ from, to, caption }: Extract<NumberSceneSpec, { type: 'regroup' }>) {
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <div className="rounded-lg border-2 border-[#16241f]/20 bg-white px-3 py-2 text-center text-xs font-bold text-[#16241f]">{from}</div>
        <span className="text-[#9c6f1f]">➡️</span>
        <div className="rounded-lg border-2 border-[#9c6f1f]/40 bg-amber-50 px-3 py-2 text-center text-xs font-bold text-[#9c6f1f]">{to}</div>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function DigitShift({ before, after, direction, places, caption }: Extract<NumberSceneSpec, { type: 'digitShift' }>) {
  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <div className="flex gap-0.5">
          {before.split('').map((d, i) => (
            <span key={i} className="flex h-7 w-6 items-center justify-center rounded border-2 border-[#16241f]/20 bg-white text-sm font-black text-[#16241f]">
              {d}
            </span>
          ))}
        </div>
        <span className="text-[#9c6f1f]">{direction === 'left' ? `${'⬅️'.repeat(1)}×${places}` : `${'➡️'.repeat(1)}×${places}`}</span>
        <div className="flex gap-0.5">
          {after.split('').map((d, i) => (
            <span key={i} className="flex h-7 w-6 items-center justify-center rounded border-2 border-[#9c6f1f]/40 bg-amber-50 text-sm font-black text-[#9c6f1f]">
              {d}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function NumberLine({ from, to, marker, path, caption }: Extract<NumberSceneSpec, { type: 'numberLine' }>) {
  const span = to - from;
  const pct = (n: number) => ((n - from) / span) * 100;
  return (
    <>
      <div className="relative h-10 w-full px-2">
        <div className="absolute left-2 right-2 top-5 h-1 rounded bg-[#16241f]/20" />
        {Array.from({ length: span + 1 }).map((_, i) => {
          const n = from + i;
          return (
            <div key={n} className="absolute top-3 flex flex-col items-center" style={{ left: `calc(${pct(n)}% * 0.96 + 2%)`, transform: 'translateX(-50%)' }}>
              <div className={`h-3 w-0.5 ${n === 0 ? 'bg-[#16241f]' : 'bg-[#16241f]/40'}`} />
              {(n === from || n === to || n === 0 || n === marker) && (
                <span className="mt-0.5 text-[8px] font-bold text-[#16241f]/60">{n}</span>
              )}
            </div>
          );
        })}
        {path && path.length > 1 && (
          <svg className="absolute left-2 right-2 top-1" width="96%" height="16" style={{ overflow: 'visible' }}>
            {path.slice(0, -1).map((n, i) => (
              <line
                key={i}
                x1={`${pct(n) * 0.96}%`}
                y1="8"
                x2={`${pct(path[i + 1]) * 0.96}%`}
                y2="8"
                stroke="#9c6f1f"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            ))}
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#9c6f1f" />
              </marker>
            </defs>
          </svg>
        )}
        <div className="absolute -top-1 flex flex-col items-center" style={{ left: `calc(${pct(marker) * 0.96}% + 2%)`, transform: 'translateX(-50%)' }}>
          <span className="text-sm">📍</span>
        </div>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function SequenceSteps({ terms, rule, caption }: Extract<NumberSceneSpec, { type: 'sequenceSteps' }>) {
  return (
    <>
      <div className="flex items-center justify-center gap-1.5">
        {terms.map((t, i) => (
          <React.Fragment key={i}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#16241f]/20 bg-white text-sm font-black text-[#16241f]">
              {t === '' ? '?' : t}
            </div>
            {i < terms.length - 1 && <span className="text-[10px] font-bold text-[#9c6f1f]">{rule}</span>}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

export const NumberConceptScene: React.FC<{ spec: NumberSceneSpec }> = ({ spec }) => {
  return (
    <div className="rounded-xl border border-[#16241f]/10 bg-[#f4f6f1] p-3">
      {spec.type === 'placeValueChart' && <PlaceValueChart {...spec} />}
      {spec.type === 'blocksSplit' && <BlocksSplit {...spec} />}
      {spec.type === 'regroup' && <Regroup {...spec} />}
      {spec.type === 'digitShift' && <DigitShift {...spec} />}
      {spec.type === 'numberLine' && <NumberLine {...spec} />}
      {spec.type === 'sequenceSteps' && <SequenceSteps {...spec} />}
    </div>
  );
};

export default NumberConceptScene;
