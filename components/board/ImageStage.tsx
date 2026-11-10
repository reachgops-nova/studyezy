"use client";

import { useEffect, useRef, useState } from "react";
import type { ImageFrame } from "@/lib/boardUnits/types";

// Extracted from DrawingBoard.tsx's local ImageStage/AnimatedPathToken
// (2026-11-10) so the ink-board player (components/board/InkBoard.tsx) can
// reuse the exact same real-illustration + zoom/pan + tappable-hotspot +
// animated-motion-path treatment, instead of ink-board scenes being limited
// to hand-drawn canvas shapes. Real user direction: "the images are not
// animated and interactive visually graphical.. we had better images in
// the past which we can animate and use" - this IS that better image
// system (lib/boardUnits/types.ts's ImageFrame), now usable from either
// player. Behaviour is unchanged from the original inline version; only the
// prop shape changed (takes `image: ImageFrame` directly instead of a
// whole `BoardFrame`, since the ink board has no BoardFrame concept).
const TONE: Record<string, string> = { gold: "#f59e0b", green: "#34d399", red: "#f43f5e", blue: "#38bdf8" };

/**
 * A token that travels a hand-authored path once per visit - the pollen
 * tube growing down a style, a bee flying flower to flower, water moving
 * round the states-of-matter cycle. Same tween technique as the rest of the
 * board's motion, generalised to any SVG path.
 */
export function AnimatedPathToken({ d, onDone, radius = 7, color = "#38bdf8" }: { d: string; onDone?: () => void; radius?: number; color?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [dotAt, setDotAt] = useState<{ x: number; y: number } | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const len = path.getTotalLength();
    if (reduceMotion) {
      setDotAt(null);
      setDone(true);
      onDone?.();
      return;
    }
    setDone(false);
    let raf: number | null = null;
    const durationMs = Math.min(2600, Math.max(900, len * 3.2));
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const p = path.getPointAtLength(len * t);
      setDotAt({ x: p.x, y: p.y });
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setDone(true);
        onDone?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf != null) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);

  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      {!done && dotAt && <circle cx={dotAt.x} cy={dotAt.y} r={radius} fill={color} stroke="#0b1329" strokeWidth={radius / 3.5} />}
    </>
  );
}

/**
 * A real illustration, zoomed/panned to a `focus` region, with tappable
 * hotspots and an optional animated token travelling a `motionPath` -
 * `onTap` fires with the tapped hotspot's "label. note" text so the caller
 * can narrate it the same way a scene's own `say` text is narrated.
 */
export default function ImageStage({ image, onTap }: { image: ImageFrame; onTap?: (text: string) => void }) {
  const [shape, setShape] = useState<{ src: string; ratio: number } | null>(null);
  const ratio = shape && shape.src === image.src ? shape.ratio : null;
  const f = image.focus;
  // Zoom so the focused region FILLS the stage - Math.min was the "contain"
  // formula (shrink to fit both sides in view, i.e. barely zoom at all for
  // a full-width horizontal band); Math.max is "cover", the one that
  // actually crops. transform-origin stays fixed at centre and a translate
  // (computed in the image's own unscaled percentage space, so it composes
  // correctly with the scale that follows it) carries the focus point there.
  const scale = f ? Math.max(100 / f.w, 100 / f.h) : 1;
  const originX = f ? f.x + f.w / 2 : 50;
  const originY = f ? f.y + f.h / 2 : 50;

  return (
    <div className="flex h-full w-full select-none flex-col items-center gap-2 overflow-y-auto p-3">
      {image.title && <h3 className="shrink-0 text-center text-xl font-bold text-[#f59e0b]">{image.title}</h3>}
      <div
        className={`relative mx-auto overflow-hidden rounded-2xl border-[3px] border-slate-700 bg-[#0b1329] ${
          ratio ? "" : "min-h-[15rem] w-full max-w-full flex-1"
        }`}
        style={
          ratio
            ? {
                aspectRatio: String(ratio),
                height: "100%",
                width: "auto",
                maxWidth: "100%",
                minHeight: ratio < 0.9 ? "28rem" : "15rem",
                flex: "0 1 auto",
              }
            : undefined
        }
      >
        <div
          className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
          style={{ transform: `scale(${scale}) translate(${50 - originX}%, ${50 - originY}%)`, transformOrigin: "50% 50%" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            ref={(img) => {
              if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;
              const r = img.naturalWidth / img.naturalHeight;
              setShape((prev) => (prev && prev.src === image.src && prev.ratio === r ? prev : { src: image.src, ratio: r }));
            }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) setShape({ src: image.src, ratio: img.naturalWidth / img.naturalHeight });
            }}
            className="board-motion-image h-full w-full object-contain motion-safe:animate-[board-image-float_6s_ease-in-out_infinite]"
          />
          {(image.hotspots ?? []).map((h, i) => {
            const [hx, hy] = h.at;
            const shiftX = hx < 18 ? "0%" : hx > 82 ? "-100%" : "-50%";
            const shiftY = hy < 10 ? "0%" : hy > 90 ? "-100%" : "-50%";
            return (
              <button
                key={i}
                type="button"
                onClick={() => onTap?.(`${h.label}. ${h.note}`)}
                style={{
                  left: `${hx}%`,
                  top: `${hy}%`,
                  borderColor: TONE[h.tone ?? "gold"],
                  transform: `translate(${shiftX}, ${shiftY}) scale(${1 / scale})`,
                }}
                className="absolute whitespace-nowrap rounded-full border-2 bg-[#0b1329]/85 px-2 py-0.5 text-[0.7rem] font-bold text-white backdrop-blur-sm hover:bg-[#0b1329]"
              >
                {h.label}
              </button>
            );
          })}
          {image.motionPath && (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
              <AnimatedPathToken
                d={`M ${image.motionPath.points.map(([x, y]) => `${x} ${y}`).join(" L ")}`}
                radius={1.6 * (1 / scale)}
                color={TONE[image.motionPath.tone ?? "blue"]}
              />
            </svg>
          )}
        </div>
      </div>
      <p className="shrink-0 text-[0.78rem] text-slate-500">Tap a label to hear more.</p>
    </div>
  );
}
