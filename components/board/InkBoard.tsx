"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { renderOps } from "@/lib/inkBoard/render";
import type { InkUnit } from "@/lib/inkBoard/types";
import ImageStage from "./ImageStage";
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
// English-only teach/mistake/fix/next prototype this grew from. English
// units (unit.languageCode starting "en") go the other way: a real browser
// voice is free and ~instant, while the server round-trip measured ~1.8-2s
// per scene even on the fast Sarvam path - a real, reported "reading starts
// late" gap for the first English-content ink unit (2026-11-07). See
// speakEnglishWithBrowserVoice below.
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
//
// Real direction 2026-11-07 (first English-medium unit's review): "it's not
// interactive or flowing constantly.. ensure we move to next topic
// automatically. but ensure RRT is followed on each topic and covered
// correctly" - narration finishing now auto-advances to the next scene, or
// to the topic's Quick Check (RRT) once its scenes are done, and finishing
// that Quick Check auto-advances to the next topic. A learner can still
// tap any topic/scene button at any time to jump manually; that's not
// fighting the auto-advance, it's just the next useEffect firing normally.
const DESIGN_WIDTH = 1400;
const DESIGN_HEIGHT = 680;

// How long to sit on a finished scene/quick-check before auto-advancing -
// long enough to feel like a deliberate pause, short enough to keep the
// lesson actually flowing rather than stalling.
const AUTO_ADVANCE_DELAY_MS = 900;

const STRINGS = {
  ta: {
    reading: "🔊 படிக்கிறேன்...",
    tapToListen: "🔊 தட்டி கேளுங்கள்",
    readAgain: "🔊 மீண்டும் படி",
    fullTest: "🧪 முழு தேர்வு",
    startQuickCheck: (topicId: string) => `✅ ${topicId} - விரைவு சோதனை தொடங்கு`,
    audioPlayError: "ஒலியை இயக்க முடியவில்லை.",
    audioServiceError: "ஒலி சேவை இப்போது கிடைக்கவில்லை.",
  },
  en: {
    reading: "🔊 Reading...",
    tapToListen: "🔊 Tap to listen",
    readAgain: "🔊 Read again",
    fullTest: "🧪 Full test",
    startQuickCheck: (topicId: string) => `✅ ${topicId} - Start quick check`,
    audioPlayError: "Couldn't play the audio.",
    audioServiceError: "The audio service isn't available right now.",
  },
};

function pickStrings(languageCode: string) {
  return languageCode.toLowerCase().startsWith("en") ? STRINGS.en : STRINGS.ta;
}

export default function InkBoard({ unit }: { unit: InkUnit }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Bumped at the start of every readBoard() call - lets a call that is
  // still awaiting its /api/tts fetch recognise it has been superseded by a
  // newer one (a quick scene/topic tap, or the auto-play effect firing
  // right after a manual "read again" click) and discard its result
  // instead of playing audio on top of - or right after - whatever the
  // newer call already started. Real gap flagged live 2026-10-23: "ensure
  // sound overlaps does not happen". Also guards every auto-advance
  // setTimeout below, so a manual topic/scene click cancels any pending
  // auto-advance from the scene the learner just left.
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
  const isEnglish = unit.languageCode.toLowerCase().startsWith("en");
  const t = pickStrings(unit.languageCode);

  // Chrome (and others) return an EMPTY array from speechSynthesis.getVoices()
  // on its first call(s), populating only after the async 'voiceschanged'
  // event fires once - calling getVoices() fresh inside speakEnglishWithBrowserVoice
  // was silently finding no English voice on every single scene, falling
  // through to the slow ~2s server /api/tts round trip every time instead of
  // the intended free/instant browser voice. Real gap reported live
  // 2026-11-10 ("reading is not sync with page shift it takes long time to
  // read.. this was all good earlier"). Priming the list once here (and
  // refreshing it whenever voiceschanged fires) is the standard fix.
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const refresh = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
    return () => {
      if (window.speechSynthesis.onvoiceschanged === refresh) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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

  // Moves the lesson forward on its own once narration for the current
  // scene has actually finished: next scene within the topic, or - once the
  // topic's last scene is done - straight into that topic's Quick Check
  // (RRT), so every topic's RRT is still always reached, just automatically
  // instead of waiting for a tap. Guarded by the same generation counter as
  // narration itself, so a manual click elsewhere cancels a stale advance.
  function scheduleAdvance() {
    const myGeneration = speechGenerationRef.current;
    const capturedTopicIndex = topicIndex;
    const capturedSceneIndex = sceneIndex;
    window.setTimeout(() => {
      if (speechGenerationRef.current !== myGeneration) return; // superseded by a manual click
      const activeTopic = unit.topics[capturedTopicIndex];
      if (!activeTopic) return;
      if (capturedSceneIndex + 1 < activeTopic.scenes.length) {
        setSceneIndex(capturedSceneIndex + 1);
      } else {
        setShowQuickCheck(true);
      }
    }, AUTO_ADVANCE_DELAY_MS);
  }

  // Called when a topic's Quick Check (RRT) is left, either finished or
  // closed early. Only a genuinely finished quick check auto-advances to
  // the next topic - closing early is a learner's deliberate choice to stay
  // put, not a cue to skip ahead.
  function handleQuickCheckClose(completed: boolean) {
    setShowQuickCheck(false);
    if (completed && topicIndex + 1 < unit.topics.length) {
      const myGeneration = speechGenerationRef.current;
      window.setTimeout(() => {
        if (speechGenerationRef.current !== myGeneration) return;
        setTopicIndex((i) => (i + 1 < unit.topics.length ? i + 1 : i));
      }, AUTO_ADVANCE_DELAY_MS);
    }
  }

  // English narration uses a real browser voice - free and effectively
  // instant, unlike the ~1.8-2s /api/tts round trip (measured in that
  // endpoint's own comment), let alone the much longer real-world stall
  // reported live 2026-11-10 ("took almost 12 sec to start reading..
  // the voice is not connected to the visuals"). Deliberately does NOT
  // require finding an explicit English-tagged voice before committing to
  // this path: leaving `utter.voice` unset makes the browser use its own
  // default voice, which is English (or close enough) on the overwhelming
  // majority of real devices - and crucially, NEVER silently falls through
  // to the slow network path just because getVoices() hasn't populated
  // yet. Only a device with no speechSynthesis API at all uses the server
  // path below (readBoard's main body).
  function speakEnglishWithBrowserVoice(text: string, myGeneration: number, advance: boolean): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
    const isStale = () => speechGenerationRef.current !== myGeneration;

    // Chrome has a known quirk where speak() called in the same tick right
    // after cancel() can be silently dropped - a tiny delay lets the
    // cancellation actually land first, every time, instead of only after
    // whichever earlier call happened to win the race.
    window.speechSynthesis.cancel();
    setSpeaking(true);
    window.setTimeout(() => {
      if (isStale()) return;
      const utter = new SpeechSynthesisUtterance(text);
      if (voice) utter.voice = voice; // else: browser's own default voice
      utter.rate = 0.95;
      let started = false;
      utter.onstart = () => {
        started = true;
      };
      utter.onend = () => {
        if (isStale()) return;
        setSpeaking(false);
        if (advance) scheduleAdvance();
      };
      utter.onerror = () => {
        if (isStale()) return;
        setSpeaking(false);
        // A blocked/failed browser utterance before any page interaction
        // looks just like the <audio> autoplay-block case - ask for one tap
        // rather than silently stalling the lesson.
        if (!started) setNeedsTapToStart(true);
      };
      window.speechSynthesis.speak(utter);
      // Safety net: if the browser never actually starts speaking (some
      // real devices silently swallow speak() calls), stop waiting and ask
      // for a tap rather than leaving the lesson stalled indefinitely.
      window.setTimeout(() => {
        if (isStale() || started) return;
        window.speechSynthesis.cancel();
        setSpeaking(false);
        setNeedsTapToStart(true);
      }, 1500);
    }, 30);
    return true;
  }

  // The shared narration core: speaks `text` (the active scene's `say`, or
  // an image hotspot's tapped "label. note" text) via the fast English
  // browser-voice path when available, else the server /api/tts path.
  // `advance` controls whether finishing this narration should trigger the
  // auto-advance flow - true for the scene's own narration, false for an
  // ad-hoc hotspot tap (tapping a hotspot is exploration, not "this scene is
  // done, move on").
  async function playNarration(text: string, advance: boolean) {
    const myGeneration = ++speechGenerationRef.current;
    const isStale = () => speechGenerationRef.current !== myGeneration;

    setSpeechError(null);
    setNeedsTapToStart(false);
    // Stop whatever is currently playing immediately, synchronously - this
    // is what prevents the common case (switching scenes while narration is
    // still going) from ever overlapping, independent of the generation
    // check below which guards the slower, fetch-in-flight race.
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();

    if (isEnglish && speakEnglishWithBrowserVoice(text, myGeneration, advance)) return;

    setSpeaking(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, languageCode: unit.languageCode }),
      });
      if (isStale()) return; // a newer scene/click started while this fetch was in flight
      if (!res.ok) throw new Error(`tts request failed (${res.status})`);
      const blob = await res.blob();
      if (isStale()) return;
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        if (isStale()) return;
        setSpeaking(false);
        if (advance) scheduleAdvance();
      };
      audio.onerror = () => {
        if (!isStale()) {
          setSpeaking(false);
          setSpeechError(t.audioPlayError);
          if (advance) scheduleAdvance();
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
      console.error("InkBoard playNarration failed", err);
      if (!isStale()) {
        setSpeaking(false);
        setSpeechError(t.audioServiceError);
        if (advance) scheduleAdvance();
      }
    }
  }

  function readBoard() {
    if (!scene) return;
    playNarration(scene.say, true);
  }

  // A tapped image hotspot narrates its own "label. note" text without
  // affecting the scene's own auto-advance flow.
  function speakHotspot(text: string) {
    playNarration(text, false);
  }

  // Stop any in-flight narration the moment the player itself goes away
  // (e.g. clicking through to the Test route) - otherwise a scene's audio
  // can keep playing underneath a page the student has already left,
  // which is its own kind of overlap.
  useEffect(() => {
    return () => {
      speechGenerationRef.current++;
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
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
              {speaking ? t.reading : needsTapToStart ? t.tapToListen : t.readAgain}
            </button>
            <Link href={`/board-ink/${unit.unitKey}/test`} className="rounded-lg border-2 border-indigo-700 px-4 py-3 text-sm font-black text-indigo-700">
              {t.fullTest}
            </Link>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-white px-4 py-2 sm:px-8">
          {unit.topics.map((tp, i) => (
            <button
              key={tp.topicId}
              type="button"
              onClick={() => {
                speechGenerationRef.current++; // cancel any pending auto-advance from where we were
                setTopicIndex(i);
              }}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-black ${
                i === topicIndex ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-300 text-slate-600"
              }`}
            >
              {tp.topicId} · {tp.title}
            </button>
          ))}
        </div>

        <div className="bg-[#fbfdfb] p-2 sm:p-5">
          {scene.image ? (
            // ImageStage sizes itself from the picture's own measured aspect
            // ratio (see components/board/ImageStage.tsx) - it needs a
            // flexible box, not one forced into the canvas's wide 1400x680
            // ratio, which squeezed/cropped it. This mirrors the flexible
            // stage container DrawingBoard.tsx already gives it.
            <div className="relative flex min-h-[20rem] items-center justify-center overflow-hidden rounded-lg bg-[#0b1329] p-2 sm:min-h-[28rem]">
              <ImageStage image={scene.image} onTap={speakHotspot} />
            </div>
          ) : (
            <canvas ref={canvasRef} style={{ aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}` }} className="w-full rounded-lg" />
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-white px-4 py-3 sm:px-8">
          {topic.scenes.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                speechGenerationRef.current++; // cancel any pending auto-advance from where we were
                setShowQuickCheck(false);
                setSceneIndex(i);
              }}
              className={`rounded-full border-2 px-3 py-2 text-xs font-black ${
                i === sceneIndex && !showQuickCheck ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-300 text-slate-600"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {speechError && <p className="px-4 pb-3 text-center text-xs font-bold text-rose-600 sm:px-8">{speechError}</p>}

        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-8">
          {showQuickCheck ? (
            <InkQuickCheck key={topic.topicId} unitKey={unit.unitKey} topic={topic} lang={isEnglish ? "en" : "ta"} onClose={handleQuickCheckClose} />
          ) : (
            <button
              type="button"
              onClick={() => setShowQuickCheck(true)}
              className="w-full rounded-lg border-2 border-dashed border-indigo-300 py-3 text-sm font-black text-indigo-700 hover:border-indigo-500"
            >
              {t.startQuickCheck(topic.topicId)}
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
