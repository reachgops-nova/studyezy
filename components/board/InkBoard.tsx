"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { renderOps } from "@/lib/inkBoard/render";
import type { InkUnit } from "@/lib/inkBoard/types";
import InkQuickCheck from "./InkQuickCheck";

// Generic player for any InkUnit (see lib/inkBoard/types.ts for why this
// replaces components/board/TeacherWritingSample.tsx's one hardcoded
// problem) - a topic picker, a scene picker within the active topic, and
// narration that plays automatically on every scene change.
//
// Real gap this reuses the fix for (2026-09-08, see /api/tts's own
// comment): the browser's own speechSynthesis has no installed Tamil voice
// on plenty of real devices, so Tamil scenes are always read through
// /api/tts's server-side TTS, never window.speechSynthesis - unlike the
// English-only teach/mistake/fix/next prototype this grew from.
//
// Real direction 2026-10-19: "voice need to come up automatically instead
// of asking to read" - narration now fires from an effect keyed on the
// active scene, not only a manual button press. Browsers block audio
// autoplay before any user gesture on the page at all, so the very first
// scene on a fresh page load can be silently blocked - caught via the
// rejected play() promise and surfaced as a one-tap "தட்டி கேளுங்கள்"
// prompt rather than failing invisibly. Every topic/scene button click is
// itself a user gesture, so autoplay on every scene switch after that
// first tap works without restriction.
const DESIGN_WIDTH = 1400;
const DESIGN_HEIGHT = 680;

export default function InkBoard({ unit }: { unit: InkUnit }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Bumped at the start of every readBoard() call - lets a call that is
  // still awaiting its /api/tts fetch recognise it has been superseded by a
  // newer one (a quick scene/topic tap, or the auto-play effect firing
  // right after a manual "read again" click) and discard its result
  // instead of playing audio on top of - or right after - whatever the
  // newer call already started. Real gap flagged live 2026-10-23: "ensure
  // sound overlaps does not happen".
  const speechGenerationRef = useRef(0);
  const [topicIndex, setTopicIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [needsTapToStart, setNeedsTapToStart] = useState(false);
  const [showQuickCheck, setShowQuickCheck] = useState(false);

  const topic = unit.topics[topicIndex];
  const scene = topic?.scenes[sceneIndex];
  const sceneRef = useRef(scene);
  sceneRef.current = scene;

  function draw() {
    const canvas = canvasRef.current;
    const activeScene = sceneRef.current;
    if (!canvas || !activeScene) return;
    const box = canvas.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = box.width * ratio;
    canvas.height = box.height * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Scenes are authored against a fixed DESIGN_WIDTH/HEIGHT canvas, then
    // scaled to whatever size the element actually rendered at - so a scene
    // script never needs to know the viewer's real screen size.
    const scale = box.width / DESIGN_WIDTH;
    ctx.scale(ratio * scale, ratio * scale);
    renderOps(ctx, DESIGN_WIDTH, DESIGN_HEIGHT, activeScene.ops);
  }

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // Real bug caught live 2026-10-23: on a fresh page load the canvas's
  // getBoundingClientRect() can still read a 0x0 box the instant this
  // effect runs (layout/fonts not settled yet), silently leaving the very
  // first scene blank until the viewer happened to switch scenes, which
  // resized the canvas and drew correctly. A ResizeObserver catches the
  // canvas's real first non-zero layout (and any later resize) and redraws
  // from the always-current sceneRef, independent of the scene-keyed effect
  // above timing out on a too-early measurement.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSceneIndex(0);
    setShowQuickCheck(false);
  }, [topicIndex]);

  useEffect(() => {
    if (!scene) return;
    readBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  async function readBoard() {
    if (!scene) return;
    const myGeneration = ++speechGenerationRef.current;
    const isStale = () => speechGenerationRef.current !== myGeneration;

    setSpeechError(null);
    setNeedsTapToStart(false);
    // Stop whatever is currently playing immediately, synchronously - this
    // is what prevents the common case (switching scenes while narration is
    // still going) from ever overlapping, independent of the generation
    // check below which guards the slower, fetch-in-flight race.
    audioRef.current?.pause();
    setSpeaking(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scene.say, languageCode: unit.languageCode }),
      });
      if (isStale()) return; // a newer scene/click started while this fetch was in flight
      if (!res.ok) throw new Error(`tts request failed (${res.status})`);
      const blob = await res.blob();
      if (isStale()) return;
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        if (!isStale()) setSpeaking(false);
      };
      audio.onerror = () => {
        if (!isStale()) {
          setSpeaking(false);
          setSpeechError("ஒலியை இயக்க முடியவில்லை.");
        }
      };
      try {
        await audio.play();
        if (isStale()) {
          // Lost the race between starting playback and a newer call
          // landing - stop immediately rather than let two scenes' audio
          // overlap even briefly.
          audio.pause();
        }
      } catch (playErr) {
        if (!isStale()) {
          // Autoplay blocked (no user gesture yet on this page) - common
          // only on the very first scene of a fresh load. Keep the audio
          // ready and ask for one tap instead of treating this as a real
          // failure.
          setSpeaking(false);
          setNeedsTapToStart(true);
        }
        console.warn("InkBoard autoplay blocked, waiting for a tap", playErr);
      }
    } catch (err) {
      console.error("InkBoard readBoard failed", err);
      if (!isStale()) {
        setSpeaking(false);
        setSpeechError("ஒலி சேவை இப்போது கிடைக்கவில்லை.");
      }
    }
  }

  // Stop any in-flight narration the moment the player itself goes away
  // (e.g. clicking through to the Test route) - otherwise a scene's audio
  // can keep playing underneath a page the student has already left,
  // which is its own kind of overlap.
  useEffect(() => {
    return () => {
      speechGenerationRef.current++;
      audioRef.current?.pause();
    };
  }, []);

  if (!topic || !scene) return null;

  return (
    <main className="min-h-screen bg-[#20242b] p-2 sm:p-6">
      <section className="mx-auto max-w-[1500px] overflow-hidden rounded-xl border-[10px] border-[#343943] bg-[#f5f8f5] shadow-2xl">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-300 bg-white px-4 py-3 sm:px-8">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-indigo-700">{unit.badge} · ink board</p>
            <h1 className="hand text-2xl text-slate-800 sm:text-4xl">{unit.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={readBoard}
              disabled={speaking}
              className={`rounded-lg px-4 py-3 text-sm font-black text-white disabled:opacity-60 ${
                needsTapToStart ? "animate-pulse bg-rose-600" : "bg-indigo-700"
              }`}
            >
              {speaking ? "🔊 படிக்கிறேன்..." : needsTapToStart ? "🔊 தட்டி கேளுங்கள்" : "🔊 மீண்டும் படி"}
            </button>
            <Link href={`/board-ink/${unit.unitKey}/test`} className="rounded-lg border-2 border-indigo-700 px-4 py-3 text-sm font-black text-indigo-700">
              🧪 முழு தேர்வு
            </Link>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-white px-4 py-2 sm:px-8">
          {unit.topics.map((t, i) => (
            <button
              key={t.topicId}
              type="button"
              onClick={() => setTopicIndex(i)}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-black ${
                i === topicIndex ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-300 text-slate-600"
              }`}
            >
              {t.topicId} · {t.title}
            </button>
          ))}
        </div>

        <div className="bg-[#fbfdfb] p-2 sm:p-5">
          <canvas ref={canvasRef} style={{ aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}` }} className="w-full rounded-lg" />
        </div>
        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-white px-4 py-3 sm:px-8">
          {topic.scenes.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setSceneIndex(i)}
              className={`rounded-full border-2 px-3 py-2 text-xs font-black ${
                i === sceneIndex ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-300 text-slate-600"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {speechError && <p className="px-4 pb-3 text-center text-xs font-bold text-rose-600 sm:px-8">{speechError}</p>}

        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-8">
          {showQuickCheck ? (
            <InkQuickCheck key={topic.topicId} unitKey={unit.unitKey} topic={topic} onClose={() => setShowQuickCheck(false)} />
          ) : (
            <button
              type="button"
              onClick={() => setShowQuickCheck(true)}
              className="w-full rounded-lg border-2 border-dashed border-indigo-300 py-3 text-sm font-black text-indigo-700 hover:border-indigo-500"
            >
              ✅ {topic.topicId} - விரைவு சோதனை தொடங்கு
            </button>
          )}
        </div>
      </section>
      <style jsx>{`
        .hand {
          font-family: "Comic Sans MS", "Bradley Hand", cursive;
          font-weight: 700;
        }
      `}</style>
    </main>
  );
}
