import React from 'react';

// Generalizes the NumberConceptScene pattern (built for Unit 1: Number) to
// Unit 2's geometry concepts (symmetry, angles, triangles) - same
// data-driven approach: a small set of reusable scene shapes fed by a spec
// object per checkpoint, rather than one bespoke component per concept.
// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge" - this is the
// scene layer for Math Unit 2 (Angles and shapes).
export type GeometrySceneSpec =
  | { type: 'symmetryGrid'; axis: 'vertical' | 'horizontal' | 'both'; shaded: [number, number][]; cols: number; rows: number; caption: string }
  | { type: 'angleArc'; degrees: number; label: string; kind: 'acute' | 'obtuse' | 'reflex' | 'right'; caption: string }
  | { type: 'straightLineSplit'; known: number; missing: number; caption: string }
  | { type: 'triangleClassify'; kind: 'equilateral' | 'isosceles' | 'scalene'; sides: [number, number, number]; caption: string };

function SymmetryGrid({ axis, shaded, cols, rows, caption }: Extract<GeometrySceneSpec, { type: 'symmetryGrid' }>) {
  const cellSize = 22;
  const w = cols * cellSize;
  const h = rows * cellSize;
  const isShaded = (c: number, r: number) => shaded.some(([sc, sr]) => sc === c && sr === r);
  return (
    <>
      <div className="flex justify-center">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => (
              <rect
                key={`${c}-${r}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={isShaded(c, r) ? '#9c6f1f' : '#ffffff'}
                stroke="#16241f22"
              />
            ))
          )}
          {(axis === 'vertical' || axis === 'both') && (
            <line x1={w / 2} y1={0} x2={w / 2} y2={h} stroke="#16241f" strokeWidth={2} strokeDasharray="4 3" />
          )}
          {(axis === 'horizontal' || axis === 'both') && (
            <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke="#16241f" strokeWidth={2} strokeDasharray="4 3" />
          )}
        </svg>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function AngleArc({ degrees, label, kind, caption }: Extract<GeometrySceneSpec, { type: 'angleArc' }>) {
  const cx = 90;
  const cy = 90;
  const r = 60;
  const rad = (degrees * Math.PI) / 180;
  const endX = cx + r * Math.cos(-rad);
  const endY = cy + r * Math.sin(-rad);
  const largeArc = degrees > 180 ? 1 : 0;
  const color = kind === 'acute' ? '#9c6f1f' : kind === 'obtuse' ? '#16241f' : kind === 'reflex' ? '#b45309' : '#16241f';
  return (
    <>
      <div className="flex justify-center">
        <svg width={180} height={110} viewBox="0 0 180 110">
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#16241f" strokeWidth={2} />
          <line x1={cx} y1={cy} x2={endX} y2={endY} stroke="#16241f" strokeWidth={2} />
          <path
            d={`M ${cx + 20} ${cy} A 20 20 0 ${largeArc} 0 ${cx + 20 * Math.cos(-rad)} ${cy + 20 * Math.sin(-rad)}`}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
          <text x={cx + 30} y={cy - 12} fontSize="11" fontWeight="bold" fill={color}>
            {label}
          </text>
          <circle cx={cx} cy={cy} r={2.5} fill="#16241f" />
        </svg>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function StraightLineSplit({ known, missing, caption }: Extract<GeometrySceneSpec, { type: 'straightLineSplit' }>) {
  const cx = 90;
  const cy = 70;
  const r = 55;
  const rad = (known * Math.PI) / 180;
  const midX = cx + r * Math.cos(-rad);
  const midY = cy + r * Math.sin(-rad);
  return (
    <>
      <div className="flex justify-center">
        <svg width={180} height={90} viewBox="0 0 180 90">
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#16241f" strokeWidth={2} />
          <line x1={cx} y1={cy} x2={midX} y2={midY} stroke="#16241f" strokeWidth={2} />
          <text x={cx - 45} y={cy - 12} fontSize="12" fontWeight="bold" fill="#9c6f1f">{known}&#176;</text>
          <text x={cx + 25} y={cy - 12} fontSize="12" fontWeight="bold" fill="#16241f">{missing}&#176;</text>
          <circle cx={cx} cy={cy} r={2.5} fill="#16241f" />
        </svg>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function TriangleClassify({ kind, sides, caption }: Extract<GeometrySceneSpec, { type: 'triangleClassify' }>) {
  const color = kind === 'equilateral' ? '#9c6f1f' : kind === 'isosceles' ? '#16241f' : '#b45309';
  return (
    <>
      <div className="flex flex-col items-center">
        <svg width={140} height={100} viewBox="0 0 140 100">
          <polygon points="70,10 15,90 125,90" fill={`${color}1a`} stroke={color} strokeWidth={2.5} />
          <text x={40} y={55} fontSize="10" fontWeight="bold" fill={color}>{sides[0]}cm</text>
          <text x={90} y={55} fontSize="10" fontWeight="bold" fill={color}>{sides[1]}cm</text>
          <text x={62} y={98} fontSize="10" fontWeight="bold" fill={color}>{sides[2]}cm</text>
        </svg>
        <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color }}>{kind}</span>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

export const GeometryConceptScene: React.FC<{ spec: GeometrySceneSpec }> = ({ spec }) => {
  return (
    <div className="rounded-xl border border-[#16241f]/10 bg-[#f4f6f1] p-3">
      {spec.type === 'symmetryGrid' && <SymmetryGrid {...spec} />}
      {spec.type === 'angleArc' && <AngleArc {...spec} />}
      {spec.type === 'straightLineSplit' && <StraightLineSplit {...spec} />}
      {spec.type === 'triangleClassify' && <TriangleClassify {...spec} />}
    </div>
  );
};

export default GeometryConceptScene;
