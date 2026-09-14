"use client";

import React from "react";
import { normalizeRichScene, type RichScene } from "@/lib/richScene";

/**
 * Plays a model-authored RichScene: illustrated SVG layers plus a step
 * timeline. See lib/richScene.ts for why the artwork is authored by a model
 * and committed rather than hand-coded here - this component is deliberately
 * generic, so a new scene is new data, never new code.
 */
export default function RichSceneStage({ scene }: { scene: RichScene }) {
  const normalized = React.useMemo(() => normalizeRichScene(scene), [scene]);
  const [stepIndex, setStepIndex] = React.useState(-1);
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const play = React.useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setStepIndex(-1);

    let at = 350;
    normalized.steps.forEach((step, i) => {
      timersRef.current.push(setTimeout(() => setStepIndex(i), at));
      at += step.holdMs ?? 2200;
    });
  }, [normalized]);

  React.useEffect(() => {
    play();
    return () => timersRef.current.forEach(clearTimeout);
  }, [play]);

  // Timeline state is cumulative: every step up to and including the current
  // one contributes, so scrubbing to a step shows the same picture as playing
  // through to it.
  const state = React.useMemo(() => {
    const visible = new Map(normalized.layers.map((layer) => [layer.id, !layer.hidden]));
    const offsets = new Map(normalized.layers.map((layer) => [layer.id, { x: 0, y: 0 }]));
    const drawn = new Set<string>();
    let pulsing = new Set<string>();

    normalized.steps.slice(0, stepIndex + 1).forEach((step, i) => {
      step.show?.forEach((id) => visible.set(id, true));
      step.hide?.forEach((id) => visible.set(id, false));
      step.draw?.forEach((id) => {
        visible.set(id, true);
        drawn.add(id);
      });
      step.move?.forEach(({ id, dx, dy }) => {
        const current = offsets.get(id) ?? { x: 0, y: 0 };
        offsets.set(id, { x: current.x + dx, y: current.y + dy });
      });
      pulsing = i === stepIndex ? new Set(step.pulse ?? []) : pulsing;
    });

    return { visible, offsets, drawn, pulsing };
  }, [normalized, stepIndex]);

  const drawableIds = React.useMemo(
    () => new Set(normalized.steps.flatMap((step) => step.draw ?? [])),
    [normalized],
  );

  const currentStep = stepIndex >= 0 ? normalized.steps[stepIndex] : undefined;
  const spokenLine = currentStep?.say ?? normalized.caption ?? "";

  return (
    <>
      <div className="rounded-lg bg-white p-2">
        <svg viewBox={normalized.viewBox} className="w-full" role="img" aria-label={normalized.title}>
          {normalized.defs ? <defs dangerouslySetInnerHTML={{ __html: normalized.defs }} /> : null}
          {normalized.layers.map((layer) => {
            const offset = state.offsets.get(layer.id) ?? { x: 0, y: 0 };
            const isVisible = state.visible.get(layer.id) ?? true;
            const isDrawable = drawableIds.has(layer.id);
            const isDrawn = state.drawn.has(layer.id);

            return (
              <g
                key={layer.id}
                dangerouslySetInnerHTML={{ __html: layer.svg }}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${state.pulsing.has(layer.id) ? 1.04 : 1})`,
                  transformOrigin: "center",
                  transition: "transform 900ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease, stroke-dashoffset 1100ms ease",
                  opacity: isVisible ? 1 : 0,
                  // Drawable layers carry pathLength="1" (added by
                  // normalizeRichScene), so one dash spans the whole stroke
                  // and the offset walks it on.
                  ...(isDrawable ? { strokeDasharray: 1, strokeDashoffset: isDrawn ? 0 : 1 } : {}),
                }}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-1 flex items-center justify-center gap-2">
        <button onClick={play} className="px-2 py-0.5 text-[10px] font-bold text-[#9c6f1f] hover:underline">
          ▶ Replay animation
        </button>
        <span className="flex gap-1">
          {normalized.steps.map((step, i) => (
            <button
              key={i}
              onClick={() => {
                timersRef.current.forEach(clearTimeout);
                timersRef.current = [];
                setStepIndex(i);
              }}
              aria-label={`Step ${i + 1}: ${step.say}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i <= stepIndex ? "bg-[#9c6f1f]" : "bg-[#16241f]/20"}`}
            />
          ))}
        </span>
      </div>

      <p className="mt-1.5 text-center text-[10px] font-medium text-[#16241f]/70">{spokenLine}</p>
    </>
  );
}
