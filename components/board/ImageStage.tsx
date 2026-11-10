"use client";

import { useEffect, useRef, useState } from "react";
import type { ImageFrame } from "@/lib/boardUnits/types";

const TONE: Record<string, string> = { gold: "#f59e0b", green: "#34d399", red: "#f43f5e", blue: "#38bdf8" };

export function AnimatedPathToken({ d, onDone, radius = 7, color = "#38bdf8" }: { d: string; onDone?: () => void; radius?: number; color?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [dotAt, setDotAt] = useState<{ x: number; y: number } | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setDone(true); onDone?.(); return; }
    const length = path.getTotalLength();
    const start = performance.now();
    let raf = 0;
    setDone(false);
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / Math.min(2800, Math.max(1100, length * 3)));
      const point = path.getPointAtLength(length * progress);
      setDotAt({ x: point.x, y: point.y });
      if (progress < 1) raf = requestAnimationFrame(tick); else { setDone(true); onDone?.(); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [d, onDone]);

  return <><path ref={pathRef} d={d} fill="none" stroke="none" />{!done && dotAt && <circle cx={dotAt.x} cy={dotAt.y} r={radius} fill={color} stroke="#0b1329" strokeWidth={radius / 3.5} />}</>;
}

export default function ImageStage({ image, onTap }: { image: ImageFrame; onTap?: (text: string) => void }) {
  const [ratio, setRatio] = useState<number | null>(null);
  const focus = image.focus;
  const scale = focus ? Math.max(100 / focus.w, 100 / focus.h) : 1;
  const originX = focus ? focus.x + focus.w / 2 : 50;
  const originY = focus ? focus.y + focus.h / 2 : 50;

  return <div className="flex h-full w-full select-none flex-col items-center gap-3 overflow-y-auto p-3">
    {image.title && <h3 className="shrink-0 text-center text-xl font-bold text-[#f59e0b]">{image.title}</h3>}
    <div className="relative mx-auto min-h-[18rem] w-full max-w-5xl flex-1 overflow-hidden rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]">
      <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: `scale(${scale}) translate(${50 - originX}%, ${50 - originY}%)`, transformOrigin: "50% 50%" }}>
        <img src={image.src} alt={image.alt} className="h-full w-full object-contain motion-safe:animate-[board-image-float_6s_ease-in-out_infinite]" onLoad={(event) => { const img = event.currentTarget; if (img.naturalWidth && img.naturalHeight) setRatio(img.naturalWidth / img.naturalHeight); }} />
        {image.motionPath && <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full"><AnimatedPathToken d={`M ${image.motionPath.points.map(([x, y]) => `${x} ${y}`).join(" L ")}`} radius={1.6 / scale} color={TONE[image.motionPath.tone ?? "blue"]} /></svg>}
      </div>
    </div>
    {(image.hotspots ?? []).length > 0 && <div className="flex w-full max-w-5xl flex-wrap justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white p-3"><p className="w-full text-center text-xs font-bold text-slate-500">Choose one part to explore:</p>{(image.hotspots ?? []).map((hotspot, index) => <button key={index} type="button" onClick={() => onTap?.(`${hotspot.label}. ${hotspot.note}`)} style={{ borderColor: TONE[hotspot.tone ?? "gold"] }} className="rounded-full border-2 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50">{hotspot.label}</button>)}</div>}
    <p className="shrink-0 text-[0.78rem] text-slate-500">Look at one part, then answer the teacher’s question below.</p>
  </div>;
}
