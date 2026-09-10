import React from 'react';

// English's equivalent of NumberConceptScene/GeometryConceptScene - a
// small set of reusable, DATA-DRIVEN scene shapes covering the recurring
// content patterns across Cambridge Stage 5 English (reading strategies,
// writing checklists, sentence/grammar examples, story structure), rather
// than one bespoke component per concept. Real user direction
// 2026-09-10: "start working on the other units... prepare those lessons
// for english and math cambridge" - this is the first English scene
// layer, built for Unit 1 (Fiction: Stories from different cultures) and
// intended to cover most future English concepts too, the same way
// NumberConceptScene's shapes turned out to cover most Math units.
export type LiteracySceneSpec =
  | { type: 'quotedExcerpt'; quote: string; tag: string; caption: string }
  | { type: 'narrativeMountain'; stages: { name: string; note: string }[]; peakIndex: number; caption: string }
  | { type: 'checklistCard'; items: string[]; caption: string }
  | { type: 'timeline'; points: { label: string; note: string }[]; caption: string };

function QuotedExcerpt({ quote, tag, caption }: Extract<LiteracySceneSpec, { type: 'quotedExcerpt' }>) {
  return (
    <>
      <div className="rounded-lg border-l-4 border-[#9c6f1f] bg-white px-4 py-3 shadow-sm">
        <span className="mb-1.5 inline-block rounded-full bg-[#9c6f1f]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#9c6f1f]">
          {tag}
        </span>
        <p className="text-sm italic leading-snug text-[#16241f]">&ldquo;{quote}&rdquo;</p>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function NarrativeMountain({ stages, peakIndex, caption }: Extract<LiteracySceneSpec, { type: 'narrativeMountain' }>) {
  const w = 320;
  const h = 100;
  const pad = 30;
  const n = stages.length;
  const stepX = w / (n - 1);
  const peakY = 16;
  const baseY = 80;
  const points = stages.map((_, i) => {
    const x = pad + i * stepX;
    const dist = Math.abs(i - peakIndex);
    const maxDist = Math.max(peakIndex, n - 1 - peakIndex) || 1;
    const y = peakY + (baseY - peakY) * (dist / maxDist);
    return [x, y] as [number, number];
  });
  const pathD = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  return (
    <>
      <div className="flex justify-center overflow-x-auto">
        <svg width={w + pad * 2} height={h + 30} viewBox={`0 0 ${w + pad * 2} ${h + 30}`}>
          <path d={pathD} fill="none" stroke="#16241f" strokeWidth={2} />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === peakIndex ? 5 : 3.5} fill={i === peakIndex ? '#9c6f1f' : '#16241f'} />
          ))}
          {stages.map((s, i) => (
            <text
              key={`label-${i}`}
              x={points[i][0]}
              y={h + 12}
              fontSize="8"
              fontWeight="bold"
              fill={i === peakIndex ? '#9c6f1f' : '#16241f'}
              textAnchor="middle"
            >
              {s.name}
            </text>
          ))}
        </svg>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function Timeline({ points, caption }: Extract<LiteracySceneSpec, { type: 'timeline' }>) {
  const w = 280;
  const pad = 34;
  const n = points.length;
  const stepX = n > 1 ? (w - pad * 2) / (n - 1) : 0;
  const y = 20;
  return (
    <>
      <div className="flex justify-center overflow-x-auto">
        <svg width={w} height={70} viewBox={`0 0 ${w} 70`}>
          <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="#16241f22" strokeWidth={2} />
          {points.map((p, i) => {
            const x = pad + i * stepX;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={4} fill="#9c6f1f" />
                <text x={x} y={y - 10} fontSize="8" fontWeight="bold" fill="#16241f" textAnchor="middle">
                  {p.label}
                </text>
                <text x={x} y={y + 22} fontSize="7" fill="#16241f99" textAnchor="middle">
                  {p.note}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function ChecklistCard({ items, caption }: Extract<LiteracySceneSpec, { type: 'checklistCard' }>) {
  return (
    <>
      <div className="space-y-1.5 rounded-lg bg-white p-3 shadow-sm">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs font-medium text-[#16241f]">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#9c6f1f]/15 text-[9px] font-bold text-[#9c6f1f]">
              ✓
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

export const LiteracyConceptScene: React.FC<{ spec: LiteracySceneSpec }> = ({ spec }) => {
  return (
    <div className="rounded-xl border border-[#16241f]/10 bg-[#f4f6f1] p-3">
      {spec.type === 'quotedExcerpt' && <QuotedExcerpt {...spec} />}
      {spec.type === 'narrativeMountain' && <NarrativeMountain {...spec} />}
      {spec.type === 'checklistCard' && <ChecklistCard {...spec} />}
      {spec.type === 'timeline' && <Timeline {...spec} />}
    </div>
  );
};

export default LiteracyConceptScene;
