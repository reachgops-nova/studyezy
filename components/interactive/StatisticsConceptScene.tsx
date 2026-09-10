import React from 'react';

// Statistical-methods sibling to NumberConceptScene/GeometryConceptScene -
// Math Unit 5's concepts (bar charts, dot plots, frequency charts, line
// graphs) don't fit either existing family, so this covers that visual
// vocabulary the same data-driven way. Real user direction 2026-09-10:
// "start working on the other units... prepare those lessons for english
// and math cambridge."
export type StatisticsSceneSpec =
  | { type: 'barChart'; labels: string[]; values: number[]; unit?: string; caption: string }
  | { type: 'dotPlot'; labels: string[]; counts: number[]; caption: string }
  | { type: 'frequencyChart'; intervals: string[]; values: number[]; caption: string }
  | { type: 'lineGraph'; xLabels: string[]; values: number[]; unit?: string; highlightIndex?: number; caption: string }
  | { type: 'likelihoodScale'; event: string; position: 'impossible' | 'unlikely' | 'equally likely' | 'likely' | 'certain'; caption: string };

function BarChart({ labels, values, unit, caption }: Extract<StatisticsSceneSpec, { type: 'barChart' }>) {
  const max = Math.max(...values, 1);
  return (
    <>
      <div className="flex items-end justify-center gap-3 h-24 px-2">
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1 flex-1 max-w-[56px]">
            <span className="text-[10px] font-bold text-[#16241f]">{values[i]}{unit ?? ''}</span>
            <div
              className="w-full rounded-t-md bg-[#9c6f1f]"
              style={{ height: `${Math.max((values[i] / max) * 64, 4)}px`, animation: `fade-in 0.3s ease ${i * 0.08}s both` }}
            />
            <span className="text-[9px] font-bold text-[#16241f]/60 uppercase">{label}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function DotPlot({ labels, counts, caption }: Extract<StatisticsSceneSpec, { type: 'dotPlot' }>) {
  const max = Math.max(...counts, 1);
  return (
    <>
      <div className="flex items-end justify-center gap-3 h-24 px-2">
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1 flex-1 max-w-[56px]">
            <div className="flex flex-col-reverse gap-0.5 h-16 justify-start items-center">
              {Array.from({ length: counts[i] }).map((_, d) => (
                <div
                  key={d}
                  className="w-2.5 h-2.5 rounded-full bg-[#9c6f1f]"
                  style={{ animation: `fade-in 0.25s ease ${(i * max + d) * 0.03}s both` }}
                />
              ))}
            </div>
            <span className="text-[9px] font-bold text-[#16241f]/60 uppercase">{label}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function FrequencyChart({ intervals, values, caption }: Extract<StatisticsSceneSpec, { type: 'frequencyChart' }>) {
  const max = Math.max(...values, 1);
  return (
    <>
      <div className="flex items-end justify-center h-24 px-2 border-b-2 border-[#16241f]/20">
        {intervals.map((interval, i) => (
          <div key={interval} className="flex flex-col items-center flex-1">
            <span className="text-[10px] font-bold text-[#16241f]">{values[i]}</span>
            <div
              className="w-full bg-[#9c6f1f] border-x border-[#f4f6f1]"
              style={{ height: `${Math.max((values[i] / max) * 64, 4)}px`, animation: `fade-in 0.3s ease ${i * 0.08}s both` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center px-2">
        {intervals.map((interval) => (
          <span key={interval} className="flex-1 text-center text-[9px] font-bold text-[#16241f]/60">
            {interval}
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

function LineGraph({ xLabels, values, unit, highlightIndex, caption }: Extract<StatisticsSceneSpec, { type: 'lineGraph' }>) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const w = 100;
  const h = 56;
  const pts = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * w;
    const y = h - ((v - min) / span) * h;
    return { x, y, v };
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  return (
    <>
      <div className="px-2">
        <svg viewBox={`-4 -8 ${w + 8} ${h + 16}`} className="w-full h-24" preserveAspectRatio="none">
          <path d={path} fill="none" stroke="#9c6f1f" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === highlightIndex ? 3.2 : 2.2}
              fill={i === highlightIndex ? '#16241f' : '#9c6f1f'}
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-center px-2 gap-0">
        {xLabels.map((label, i) => (
          <span key={label} className="flex-1 text-center text-[9px] font-bold text-[#16241f]/60">
            {label}
            {i === highlightIndex && (
              <span className="block text-[10px] font-black text-[#16241f]">
                {values[i]}
                {unit ?? ''}
              </span>
            )}
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

type LikelihoodPosition = Extract<StatisticsSceneSpec, { type: 'likelihoodScale' }>['position'];
const LIKELIHOOD_STEPS: LikelihoodPosition[] = ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'];

function LikelihoodScale({ event, position, caption }: Extract<StatisticsSceneSpec, { type: 'likelihoodScale' }>) {
  const activeIndex = LIKELIHOOD_STEPS.indexOf(position);
  return (
    <>
      <p className="mb-3 text-center text-xs font-bold text-[#16241f]">{event}</p>
      <div className="relative px-2">
        <div className="absolute left-2 right-2 top-1/2 h-1 -translate-y-1/2 rounded bg-[#16241f]/15" />
        <div className="relative flex justify-between">
          {LIKELIHOOD_STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center" style={{ width: '20%' }}>
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  i === activeIndex ? 'scale-125 border-[#16241f] bg-[#9c6f1f]' : 'border-[#16241f]/20 bg-white'
                }`}
              />
              <span
                className={`mt-1.5 text-center text-[9px] font-bold uppercase leading-tight ${
                  i === activeIndex ? 'text-[#9c6f1f]' : 'text-[#16241f]/50'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] font-medium text-[#16241f]/60">{caption}</p>
    </>
  );
}

export const StatisticsConceptScene: React.FC<{ spec: StatisticsSceneSpec }> = ({ spec }) => {
  return (
    <div className="rounded-xl border border-[#16241f]/10 bg-[#f4f6f1] p-3">
      {spec.type === 'barChart' && <BarChart {...spec} />}
      {spec.type === 'dotPlot' && <DotPlot {...spec} />}
      {spec.type === 'frequencyChart' && <FrequencyChart {...spec} />}
      {spec.type === 'lineGraph' && <LineGraph {...spec} />}
      {spec.type === 'likelihoodScale' && <LikelihoodScale {...spec} />}
    </div>
  );
};

export default StatisticsConceptScene;
