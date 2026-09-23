"use client";

import Link from "next/link";
import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BoardFrame, BoardTask, BoardUnit } from "@/lib/boardUnits/types";
import { sanitizeSvgFragment } from "@/lib/richScene";
import VoiceReciteCheck from "./VoiceReciteCheck";

/**
 * The Drawing Board: a five-phase lesson surface built to the reference the
 * user approved (drawing_board_unit10_v5.py, 2026-09-14).
 *
 * The phases are the learning method made visible - concept, guided practice,
 * free practice, assessment, then what to do next. A child moves through them
 * one press at a time and nothing plays past them.
 *
 * Everything unit-specific lives in lib/boardUnits/*, so a new unit is a new
 * data file and never a change here.
 */

/**
 * The phases ARE the RCRT method, not a parallel set of names beside it -
 * real user direction 2026-09-14: "our curriculum teaching flow RCRT and this
 * UI/UX together we must be ready".
 *
 *   Read    - meet the idea, one press at a time
 *   Cover   - hide the explanation and try it, with the board showing what
 *             each answer would actually do
 *   Recite  - say the rule back in your own words, then play with it freely
 *   Test    - the graded check
 *   Results - the score, and what the schedule does about it
 */
const PHASES = [
  { id: 1, label: "Read", icon: "📖" },
  { id: 2, label: "Cover", icon: "🙈" },
  { id: 3, label: "Recite", icon: "🗣️" },
  { id: 4, label: "Test", icon: "📝" },
  { id: 5, label: "Results", icon: "📊" },
] as const;

// SVG geometry. Grid units in, pixels out - the one place this conversion
// happens, so a shape can never drift off its own grid.
/** Reads a value the way a child should hear it: 0.3 as "three tenths". */
function nameValue(v: number): string {
  if (Number.isInteger(v)) return v < 0 ? `Minus ${Math.abs(v)}.` : `${v}.`;
  const whole = Math.trunc(v);
  const tenths = Math.round(Math.abs(v - whole) * 10);
  const tenthWord = `${tenths} ${tenths === 1 ? "tenth" : "tenths"}`;
  if (whole === 0) return `${v} - that is ${tenthWord}.`;
  return `${v} - that is ${Math.abs(whole)} ${Math.abs(whole) === 1 ? "whole" : "wholes"} and ${tenthWord}.`;
}

/**
 * Names the actual mistake in a number-line drag answer instead of just
 * stating the right spot - real user direction 2026-09-20: "if wrong tell
 * them what went wrong and correct." Generic by design (direction, then
 * distance) so it works for any number-line topic, not just one unit.
 */
function diagnoseNumberLineMiss(from: number, target: number, dropped: number): string {
  if (Math.abs(dropped - from) < 1e-6) {
    return `You left it at ${from}. ${target > from ? "Adding" : "Subtracting"} means the counter has to move - slide it toward ${target}.`;
  }
  const wantDir = Math.sign(target - from);
  const gotDir = Math.sign(dropped - from);
  if (gotDir !== wantDir) {
    return `You moved ${gotDir > 0 ? "right" : "left"} from ${from}, but this needs a move ${wantDir > 0 ? "right, since you are adding" : "left, since you are subtracting"}. Start at ${from} again and go the other way.`;
  }
  const wantSteps = Math.abs(target - from);
  const gotSteps = Math.abs(dropped - from);
  if (gotSteps < wantSteps) {
    return `Right direction, but you stopped short at ${dropped}. From ${from} it is ${wantSteps} steps - you only moved ${gotSteps}.`;
  }
  if (gotSteps > wantSteps) {
    return `Right direction, but you went too far to ${dropped}. From ${from} it is only ${wantSteps} steps - you moved ${gotSteps}.`;
  }
  return `Close - double check the landing spot. It belongs at ${target}.`;
}

const PAD_L = 44;
const PAD_B = 44;
const VB_W = 460;
const VB_H = 396;

type SpeechRecognitionResultLike = { 0: { transcript: string }; length: number };
type SpeechRecognitionEventLike = { results: { [index: number]: SpeechRecognitionResultLike } };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const BOARD_LANGUAGES = [
  { code: "en-IN", label: "English", ttsCode: "en-GB" },
  { code: "ta-IN", label: "Tamil", ttsCode: "ta-IN" },
  { code: "hi-IN", label: "Hindi", ttsCode: "hi-IN" },
  { code: "te-IN", label: "Telugu", ttsCode: "te-IN" },
  { code: "kn-IN", label: "Kannada", ttsCode: "kn-IN" },
  { code: "ml-IN", label: "Malayalam", ttsCode: "ml-IN" },
] as const;

function getSavedBoardLanguage(): string {
  if (typeof window === "undefined") return "en-IN";
  return localStorage.getItem("studyezy_language") || "en-IN";
}

export default function DrawingBoard({
  unit,
  paperTasks = [],
  initialConceptId,
}: {
  unit: BoardUnit;
  paperTasks?: BoardTask[];
  /** Jump straight to this concept's first step instead of the unit's start. */
  initialConceptId?: string;
}) {
  const initialStep = initialConceptId
    ? Math.max(0, unit.conceptSteps.findIndex((s) => s.conceptId === initialConceptId))
    : 0;
  const [phase, setPhase] = useState(1);
  const [step, setStep] = useState(initialStep);
  const [frame, setFrame] = useState<BoardFrame>(unit.conceptSteps[initialStep]?.frame ?? {});
  const [subtitle, setSubtitle] = useState(
    `Welcome to ${unit.title}. Press the buttons above the board to walk through it one step at a time.`,
  );
  const [voiceOn, setVoiceOn] = useState(true);
  const [answers, setAnswers] = useState<Record<string, { correct: boolean; label: string; locked?: boolean }>>({});
  const [dx, setDx] = useState(2);
  const [dy, setDy] = useState(3);
  const [chat, setChat] = useState<{ who: "kid" | "ezy"; text: string }[]>([
    { who: "ezy", text: "Tap a step above the board, or ask me one of the questions below." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [listening, setListening] = useState(false);
  const [chatNotice, setChatNotice] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [language, setLanguage] = useState(getSavedBoardLanguage);
  const [reciteProgress, setReciteProgress] = useState<Record<string, number>>({});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const audioRef = useRef<AudioContext | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const voiceOnRef = useRef(voiceOn);
  voiceOnRef.current = voiceOn;
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const languageAudioRef = useRef<HTMLAudioElement | null>(null);
  const languageAudioUrlRef = useRef<string | null>(null);
  const lessonPanelRef = useRef<HTMLDivElement | null>(null);
  const examplesPanelRef = useRef<HTMLDivElement | null>(null);

  const gx = useCallback(
    (x: number) => PAD_L + (x * (VB_W - PAD_L - 20)) / unit.gridMax,
    [unit.gridMax],
  );
  const gy = useCallback(
    (y: number) => VB_H - PAD_B - (y * (VB_H - PAD_B - 20)) / unit.gridMax,
    [unit.gridMax],
  );

  const say = useCallback((text: string, onDone?: () => void, languageCode = "en-GB") => {
    setSubtitle(text);
    // Fall back to a length-based estimate when there is no voice to wait on,
    // so the board behaves the same with narration off.
    const estimate = Math.min(9000, 1400 + text.length * 55);
    if (!voiceOnRef.current || typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onDone) setTimeout(onDone, estimate);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = languageCode;
    const voices = window.speechSynthesis.getVoices();
    const baseLanguage = languageCode.split("-")[0].toLowerCase();
    const matchingVoice = voices.find((voice) => voice.lang?.toLowerCase() === languageCode.toLowerCase())
      ?? voices.find((voice) => voice.lang?.toLowerCase().startsWith(`${baseLanguage}-`));
    if (matchingVoice) u.voice = matchingVoice;
    // Real user finding 2026-09-23: some browsers list a Tamil (or other
    // Indian-language) voice in getVoices() that never actually produces
    // sound - a silent match, not a missing one. The server route already
    // has a real, verified-working Tamil voice (Sarvam), so for any
    // non-English language always prefer it over a browser voice that might
    // just be a name with nothing behind it - never gate this on whether a
    // "matching" voice was merely reported.
    if (baseLanguage !== "en") {
      fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, languageCode }),
      }).then(async (response) => {
        if (!response.ok) throw new Error("local-language speech unavailable");
        const url = URL.createObjectURL(await response.blob());
        if (languageAudioUrlRef.current) URL.revokeObjectURL(languageAudioUrlRef.current);
        languageAudioUrlRef.current = url;
        const audio = languageAudioRef.current ?? new Audio();
        audio.src = url;
        const finish = () => {
          URL.revokeObjectURL(url);
          if (languageAudioUrlRef.current === url) languageAudioUrlRef.current = null;
          onDone?.();
        };
        audio.onended = finish;
        audio.onerror = finish;
        audio.play().catch(finish);
      }).catch(() => onDone?.());
      return;
    }
    u.rate = 0.85;
    u.pitch = 1.05;
    if (onDone) {
      let fired = false;
      const once = () => {
        if (fired) return;
        fired = true;
        onDone();
      };
      u.onend = once;
      u.onerror = once;
      // Some installed voices never fire onend at all.
      setTimeout(once, estimate + 3000);
    }
    // Calling speak() immediately after cancel() is a known cause of
    // dropped or laggy speech in Chrome - only cancel when something is
    // actually still talking, and let the engine settle a tick first.
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
      setTimeout(() => window.speechSynthesis.speak(u), 30);
    } else {
      window.speechSynthesis.speak(u);
    }
  }, []);

  // Small synthesised cues rather than audio files: no asset to ship, no
  // request to make, and it works offline like the rest of the board.
  const sfx = useCallback((kind: "tap" | "right" | "wrong") => {
    if (!voiceOnRef.current) return;
    try {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (kind === "right") {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (kind === "wrong") {
        osc.frequency.setValueAtTime(196, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch {
      /* audio is a nicety; never let it break the lesson */
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
      languageAudioRef.current?.pause();
      if (languageAudioUrlRef.current) URL.revokeObjectURL(languageAudioUrlRef.current);
    };
  }, []);

  // Steps bucketed by the concept they belong to, in the order they appear.
  const conceptGroups = (() => {
    const out: { key: string; label: string; indexes: number[] }[] = [];
    unit.conceptSteps.forEach((st, i) => {
      const key = st.conceptId ?? st.label;
      const found = out.find((g) => g.key === key);
      if (found) found.indexes.push(i);
      else {
        const c = unit.concepts.find((x) => x.conceptId === key);
        out.push({ key, label: c ? `${c.conceptId} ${c.title}` : st.label, indexes: [i] });
      }
    });
    return out;
  })();
  const activeGroup = conceptGroups.find((g) => g.indexes.includes(step));

  const activeConcept = unit.concepts.find((c) => c.conceptId === unit.conceptSteps[step]?.conceptId);

  /** The full concept list, hidden by default so the board keeps its height. */
  const [pickerOpen, setPickerOpen] = useState(true);
  // Lesson content owns the workspace initially. Chat becomes a compact bar
  // while a child is learning, then takes the full workspace only when opened.
  const [focusPanel, setFocusPanel] = useState<"lesson" | "chat">("lesson");
  const [exampleProgress, setExampleProgress] = useState<Record<string, number>>({});

  // Keep every RCRT phase on the concept currently being taught. The old
  // Cover phase used the whole unit's task list, exposing later topics early.
  const activeConceptId = activeConcept?.conceptId;
  const topicTasks = (tasks: BoardTask[]) => tasks.filter((task) => !activeConceptId || task.conceptId === activeConceptId);
  const topicGuidedTasks = topicTasks(unit.guidedTasks);
  const topicPartA = topicTasks(unit.assessment.partA);
  const topicPartB = topicTasks(unit.assessment.partB);
  const topicPaperTasks = paperTasks.filter((task) => !activeConceptId || task.conceptId === activeConceptId);
  const topicRecitePrompts = unit.recitePrompts.filter((prompt) => !prompt.conceptId || prompt.conceptId === activeConceptId);
  const topicWrittenPractice = unit.writtenPractice.filter((practice) => !practice.conceptId || practice.conceptId === activeConceptId);
  const topicGraded = [...topicPartA, ...topicPartB, ...topicPaperTasks];
  const nextGroup = activeGroup
    ? conceptGroups[conceptGroups.findIndex((group) => group.key === activeGroup.key) + 1]
    : undefined;

  function quickChecksComplete() {
    return (activeConcept?.quickCheck ?? []).every((task) => answers[task.title]?.correct);
  }

  function conceptStatus(conceptId: string): { read: boolean; cover: boolean; recite: boolean; test: boolean } {
    const concept = unit.concepts.find((item) => item.conceptId === conceptId);
    if (!concept) return { read: false, cover: false, recite: false, test: false };
    const read = (exampleProgress[conceptId] ?? 0) >= concept.examples.length
      && (concept.quickCheck ?? []).every((task) => answers[task.title]?.correct);
    const guided = unit.guidedTasks.filter((task) => task.conceptId === conceptId);
    const cover = read && guided.every((task) => answers[task.title]);
    const reciteTotal = unit.recitePrompts.filter((prompt) => prompt.conceptId === conceptId).length
      + unit.writtenPractice.filter((practice) => practice.conceptId === conceptId).length;
    const recite = cover && reciteTotal > 0 && (reciteProgress[conceptId] ?? 0) >= reciteTotal;
    const testTasks = [...unit.assessment.partA, ...unit.assessment.partB, ...paperTasks].filter((task) => task.conceptId === conceptId);
    const test = recite && testTasks.length > 0 && testTasks.every((task) => answers[task.title]);
    return { read, cover, recite, test };
  }

  function markReciteComplete(conceptId: string) {
    setReciteProgress((previous) => ({ ...previous, [conceptId]: (previous[conceptId] ?? 0) + 1 }));
  }

  function moveToNextTopic() {
    const nextStep = nextGroup?.indexes[0];
    if (nextStep === undefined) return;
    const next = unit.conceptSteps[nextStep];
    setStep(nextStep);
    setPhase(1);
    setFocusPanel("lesson");
    setFrame(next.frame ?? {});
    setPickerOpen(true);
    say(`Great work. ${activeGroup?.label ?? "That topic"} is complete. Now let's learn ${nextGroup?.label ?? "the next topic"}.`, undefined, "en-GB");
  }

  function examplesComplete(conceptId = activeConcept?.conceptId) {
    const concept = unit.concepts.find((item) => item.conceptId === conceptId);
    return !concept || concept.examples.length === 0 || (exampleProgress[concept.conceptId] ?? 0) >= concept.examples.length;
  }

  function markExampleComplete(conceptId: string) {
    const total = unit.concepts.find((item) => item.conceptId === conceptId)?.examples.length ?? 0;
    setExampleProgress((previous) => ({
      ...previous,
      [conceptId]: Math.min(total, (previous[conceptId] ?? 0) + 1),
    }));
  }

  function loadStep(i: number) {
    const s = unit.conceptSteps[i];
    if (!s) return;
    const currentConceptId = unit.conceptSteps[step]?.conceptId;
    // Only advancing to a topic ahead of where you are should ever be
    // gated - real user finding 2026-09-23: finishing topic 1 and moving to
    // topic 2, then trying to go back and revisit topic 1, was blocked by
    // this same "finish your examples first" check meant for topic 2's own
    // unfinished examples. Revisiting anything already reached must always
    // be free, in both directions.
    const targetGroupIndex = conceptGroups.findIndex((g) => g.key === s.conceptId);
    const currentGroupIndex = conceptGroups.findIndex((g) => g.key === currentConceptId);
    const movingForward = targetGroupIndex > currentGroupIndex;
    if (s.conceptId !== currentConceptId && movingForward && !examplesComplete(currentConceptId)) {
      setFocusPanel("lesson");
      examplesPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      say("Try every example in this concept first. Then we will unlock the next topic.");
      return;
    }
    setStep(i);
    setFocusPanel("lesson");
    setFrame(s.frame);
    sfx("tap");
    say(s.say);
  }

  /**
   * The first answer is the one that counts. A child can keep pressing to see
   * what each option does - that is how the board teaches - but a question
   * answered wrongly stays wrong, exactly as it would in a real test. Real
   * user direction 2026-09-14: "in test mark wrong answer as wrong only
   * though we explain them... their score for that answer will be zero".
   */
  /** Still-to-do questions first; finished ones sink to the bottom. */
  const byDone = (tasks: BoardTask[]) => [...tasks].sort((a, b) => Number(Boolean(answers[a.title])) - Number(Boolean(answers[b.title])));

  /** Put a finished question's working back on the board on demand. */
  function replayTask(task: BoardTask) {
    const chosen = answers[task.title];
    const opt = task.options.find((o) => o.label === chosen?.label);
    if (!opt) return;
    setFrame(opt.frame);
    say(opt.say);
  }

  /**
   * Once the explanation has been spoken, the board clears and sets up the
   * next question - real user direction 2026-09-14: "the old answer still
   * stays, it should populate for next question". Leaving the last answer's
   * working up while a new question is being read is exactly the confusion
   * receding the cards was meant to remove.
   */
  function handOverToNextTask(justAnswered: string) {
    if (phase === 1) {
      setFrame(unit.conceptSteps[step]?.frame ?? {});
      return;
    }
    const list = phase === 2 ? topicGuidedTasks : topicGraded;
    const next = list.find((t) => t.title !== justAnswered && !answersRef.current[t.title]);
    setFrame(next?.setup ?? {});
  }

  /** The question the board is currently offering to be dragged. */
  const dragTask =
    phase === 2 || phase === 4
      ? (phase === 2 ? topicGuidedTasks : [...topicPartA, ...topicPartB]).find(
          (t) => t.drag && !answers[t.title],
        )
      : undefined;
  const [dragAt, setDragAt] = useState<number[] | null>(null);
  useEffect(() => {
    setDragAt(dragTask?.drag ? [...dragTask.drag.from] : null);
  }, [dragTask]);

  /** Dropping the handle answers the question, same rules as tapping an option. */
  function dropDrag(at: number[]) {
    if (!dragTask?.drag) return;
    setDragAt(at);
    const hit = dragTask.drag.to.every((v, i) => Math.abs((at[i] ?? NaN) - v) < 1e-6);
    const idx = dragTask.options.findIndex((o) => o.correct === hit);
    const opt = dragTask.options[idx] ?? dragTask.options[0];
    setAnswers((prev) =>
      prev[dragTask.title]
        ? prev
        : { ...prev, [dragTask.title]: { correct: hit, label: `dragged to ${at.join(", ")}`, locked: true } },
    );
    sfx(hit ? "right" : "wrong");
    say(
      hit
        ? `That is the spot. ${opt?.say ?? ""}`
        : dragTask.drag.to.length === 1
          ? diagnoseNumberLineMiss(dragTask.drag.from[0], dragTask.drag.to[0], at[0])
          : `Not quite - you put it at ${at.join(", ")}. It belongs at ${dragTask.drag.to.join(", ")}.`,
      () => handOverToNextTask(dragTask.title),
    );
  }

  /** The question currently offering a word to sort into a bucket. */
  const chipTask =
    phase === 2 || phase === 4
      ? (phase === 2 ? topicGuidedTasks : [...topicPartA, ...topicPartB]).find(
          (t) => t.chipDrag && !answers[t.title],
        )
      : undefined;

  function dropChip(columnIndex: number) {
    const cd = chipTask?.chipDrag;
    if (!cd || !chipTask) return;
    const hit = columnIndex === cd.toColumn;
    const opt = chipTask.options.find((o) => o.correct === hit);
    setAnswers((prev) =>
      prev[chipTask.title] ? prev : { ...prev, [chipTask.title]: { correct: hit, label: cd.chip, locked: true } },
    );
    sfx(hit ? "right" : "wrong");
    say(opt?.say ?? (hit ? "That's the one." : "Not quite - have another look."), () => handOverToNextTask(chipTask.title));
  }

  function answer(task: BoardTask, optionIndex: number) {
    const opt = task.options[optionIndex];
    setAnswers((prev) =>
      prev[task.title]
        ? { ...prev, [task.title]: { ...prev[task.title], label: opt.label } }
        : { ...prev, [task.title]: { correct: opt.correct, label: opt.label, locked: true } },
    );
    setFrame(opt.frame);
    sfx(opt.correct ? "right" : "wrong");
    say(opt.say, () => {
      if (phase === 1 && opt.correct) goPhase(2);
      else handOverToNextTask(task.title);
    });
  }

  // Score is only ever the graded phase - the practice phases are for trying
  // things, and counting them would punish exploring.
  // Paper questions count the same as the board's own - they are this unit's
  // real progression-test content, not a warm-up.
  const graded = topicGraded;
  const gradedAnswered = graded.filter((t) => answers[t.title]);
  const gradedCorrect = graded.filter((t) => answers[t.title]?.correct);
  const readiness = graded.length ? Math.round((gradedCorrect.length / graded.length) * 100) : 0;
  const passed = readiness >= 75;

  const labFrame: BoardFrame = useMemo(() => {
    const [sx, sy] = unit.lab.start;
    const at = (ox: number, oy: number): [number, number] => [sx + ox, sy + oy];
    const moved = (ox: number, oy: number): [number, number] => [sx + dx + ox, sy + dy + oy];
    return {
      shapes: [
        { points: unit.lab.shape.map(([ox, oy]) => at(ox, oy)), look: "ghost" },
        { points: unit.lab.shape.map(([ox, oy]) => moved(ox, oy)), look: "live" },
      ],
      arrows: [{ from: [sx, sy], to: [sx + dx, sy + dy] }],
      dots: [{ at: [sx + dx, sy + dy], label: `(${sx + dx}, ${sy + dy})`, tone: "blue" }],
    };
  }, [unit.lab, dx, dy]);

  // The coordinate equation and arrows are part of the board lesson, not a
  // hidden result behind a button. Keep them synced while either slider moves.
  useEffect(() => {
    if (phase === 3 && unit.lab.kind === "coordinate") setFrame(labFrame);
  }, [phase, unit.lab.kind, labFrame]);

  function goPhase(p: number) {
    if (phase === 1 && p > 1 && !examplesComplete()) {
      setFocusPanel("lesson");
      examplesPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      say("Before Cover, try every example in this concept. They are your warm-up for the homework.");
      return;
    }
    if (phase === 1 && p > 1 && !quickChecksComplete()) {
      say("Finish this topic's quick check first. Then we will start Cover.");
      return;
    }
    if (phase === 2 && p === 3 && topicGuidedTasks.some((task) => !answers[task.title])) {
      say("Finish this topic's Cover questions first. Then we will move to Recite.");
      return;
    }
    setFocusPanel("lesson");
    setPhase(p);
    sfx("tap");
    if (p === 1) {
      const s = unit.conceptSteps[step];
      setFrame(s?.frame ?? {});
      say(s?.say ?? "Let's look at the idea again.");
    } else if (p === 2) {
      setFrame(topicGuidedTasks.find((t) => !answers[t.title])?.setup ?? {});
      say("Cover. The explanation is put away - try these from memory. Even a wrong answer will show you where it would land.");
    } else if (p === 3) {
      setFrame(unit.conceptSteps[step]?.frame ?? {});
      say(`Recite ${activeConcept?.conceptId ?? "this topic"}. Look at the board model, explain ${activeConcept?.title ?? "the idea"} in your own words, then use the worked example before checking the answer.`);
    } else if (p === 4) {
      // Same rule as Cover: show the active topic's own next question, not
      // a unit-wide fallback - real user finding 2026-09-22: switching
      // topics then opening Test showed topic 1's board image regardless
      // of which topic's question was actually being asked.
      setFrame(topicGraded.find((t) => !answers[t.title])?.setup ?? unit.assessmentStory ?? {});
      say("Test time. Part A is straight recall, Part B asks you to use the idea somewhere new.");
    } else {
      say(
        passed
          ? `You scored ${readiness} percent. That is a solid pass - we will bring this back in three days to keep it fresh.`
          : `You scored ${readiness} percent. No problem - we will go over the weak parts tomorrow.`,
      );
    }
  }

  // Phase 5 writes into the same mastery record the Progression Test and Prep
  // Plan already read from, so a board session actually counts toward the
  // schedule instead of being a dead end.
  async function saveResult() {
    setSaveState("saving");
    const perConcept: Record<string, { correct: number; total: number }> = {};
    graded.forEach((t) => {
      const a = answers[t.title];
      if (!a) return;
      const bucket = (perConcept[t.conceptId] ??= { correct: 0, total: 0 });
      bucket.total += 1;
      if (a.correct) bucket.correct += 1;
    });

    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitKey: unit.unitKey,
          attemptType: "diagnostic",
          correct: gradedCorrect.length,
          total: graded.length,
          perConcept,
        }),
      });
      setSaveState(res.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }

  async function ask(q: string, a: string) {
    const selectedLanguage = BOARD_LANGUAGES.find((item) => item.code === language) ?? BOARD_LANGUAGES[0];
    // The saved cards are English curriculum content. English can answer
    // offline; a selected Indian language must use the same cached translation
    // pipeline as typed questions, otherwise the Board silently prints English.
    if (language === "en-IN") {
      setChat((prev) => [...prev, { who: "kid", text: q }, { who: "ezy", text: a }]);
      say(a, undefined, selectedLanguage.ttsCode);
      return;
    }
    setChat((prev) => [...prev, { who: "kid", text: q }, { who: "ezy", text: "Let me think about that…" }]);
    setChatBusy(true);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitKey: unit.unitKey,
          conceptId: activeConcept?.conceptId ?? unit.concepts[0]?.conceptId,
          question: q,
          language: selectedLanguage.label,
        }),
      });
      const payload = (await response.json()) as { answer?: string };
      const answer = response.ok && payload.answer ? payload.answer : a;
      setChat((prev) => prev.map((message, index) => index === prev.length - 1 ? { ...message, text: answer } : message));
      say(answer, undefined, selectedLanguage.ttsCode);
    } catch {
      setChat((prev) => prev.map((message, index) => index === prev.length - 1 ? { ...message, text: a } : message));
      say(a, undefined, selectedLanguage.ttsCode);
    } finally {
      setChatBusy(false);
    }
  }

  function answerStoredQuestion(question: string): string | null {
    const normalized = question.toLowerCase().replace(/[^a-z0-9. ]/g, " ");
    const words = new Set(normalized.split(/\s+/).filter((word) => word.length > 1));
    const candidates = (unit.chatAnswers ?? []).filter((item) => !item.conceptId || item.conceptId === activeConcept?.conceptId);
    const best = candidates
      .map((item) => ({ item, score: item.keywords.reduce((score, keyword) => score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0) + (words.has(item.question.toLowerCase()) ? 2 : 0) }))
      .sort((a, b) => b.score - a.score)[0];
    return best && best.score >= 1 ? best.item.answer : null;
  }

  async function submitChatQuestion(rawQuestion = chatInput) {
    const question = rawQuestion.trim();
    if (!question || chatBusy) return;
    setChatInput("");
    const storedAnswer = language === "en-IN" ? answerStoredQuestion(question) : null;
    if (storedAnswer) {
      setChat((prev) => [...prev, { who: "kid", text: question }, { who: "ezy", text: storedAnswer }]);
      setChatNotice("Answered from this topic’s saved help cards");
      say(storedAnswer, undefined, BOARD_LANGUAGES.find((item) => item.code === language)?.ttsCode);
      return;
    }
    setChatBusy(true);
    setChatNotice("I’m checking that with Ezy…");
    setChat((prev) => [...prev, { who: "kid", text: question }, { who: "ezy", text: "Let me think about that…" }]);
    try {
      const selectedLanguage = BOARD_LANGUAGES.find((item) => item.code === language) ?? BOARD_LANGUAGES[0];
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ unitKey: unit.unitKey, conceptId: activeConcept?.conceptId ?? unit.concepts[0]?.conceptId, question, language: selectedLanguage.label }) });
      const payload = (await response.json()) as { answer?: string; source?: string };
      const answerText = response.ok && payload.answer ? payload.answer : "I could not reach Ezy right now. Try one of the saved questions, or ask your teacher to add this one to the topic cards.";
      setChat((prev) => prev.map((message, index) => index === prev.length - 1 ? { ...message, text: answerText } : message));
      setChatNotice(payload.source === "local" ? "Answered from the saved curriculum help" : "Answered live by Ezy");
      say(answerText, undefined, selectedLanguage.ttsCode);
    } catch {
      const answerText = "I could not reach Ezy right now. Try one of the saved questions, or ask your teacher to add this one to the topic cards.";
      setChat((prev) => prev.map((message, index) => index === prev.length - 1 ? { ...message, text: answerText } : message));
      setChatNotice("Ezy is offline — saved help is still available");
      say(answerText, undefined, BOARD_LANGUAGES.find((item) => item.code === language)?.ttsCode);
    } finally {
      setChatBusy(false);
    }
  }

  function toggleListening() {
    if (typeof window === "undefined") {
      setChatNotice("Microphone input is not available in this browser. Try Chrome or Edge.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = (window as Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition
      ?? (window as Window & { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setChatNotice("Microphone input is not available in this browser. Try Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setChatInput(transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setChatNotice("I could not hear that. Please try again or type your question.");
    };
    recognitionRef.current = recognition;
      setChatNotice("Listening… ask about this topic");
    setListening(true);
    recognition.start();
  }

  const shapeFill: Record<string, string> = {
    ghost: "rgba(255,89,100,0.22)",
    live: "url(#g-blue)",
    correct: "url(#g-green)",
    wrong: "url(#g-red)",
  };
  const shapeStroke: Record<string, string> = {
    ghost: "#ff5964",
    live: "#38bdf8",
    correct: "#34d399",
    wrong: "#f43f5e",
  };
  const dotFill: Record<string, string> = { gold: "#f59e0b", green: "#34d399", red: "#f43f5e", blue: "#38bdf8" };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#090d16] font-board text-slate-100">
      <audio ref={languageAudioRef} className="hidden" aria-hidden="true" />
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {/* Header */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b-4 border-[#f59e0b] bg-[#020617] px-5 py-2.5">
        <div className="flex items-center gap-2.5 text-lg font-bold text-[#f59e0b]">
          {/* The board is a room inside the unit, not a separate app - real
              feedback 2026-09-14: "it has not synced up with our old link
              portion". */}
          <Link
            href="/select"
            className="rounded-lg border-2 border-slate-700 px-2.5 py-1 text-sm text-slate-300 transition-colors hover:border-[#38bdf8] hover:text-[#38bdf8]"
          >
            ← Unit selection
          </Link>
          🏫 Learning Board
          <span className="rounded-full bg-[#ec4899] px-3 py-0.5 text-xs text-white">{unit.badge}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border-2 border-[#38bdf8] bg-[#1e293b] px-3.5 py-1 text-sm font-bold tabular-nums">
            🎯 Readiness: <strong className="text-[#f59e0b]">{readiness}%</strong>
          </span>
          <button
            type="button"
            onClick={() => {
              const next = !voiceOn;
              setVoiceOn(next);
              if (!next && typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
            }}
            aria-pressed={voiceOn}
            className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors ${
              voiceOn ? "border-[#34d399] bg-[#10b981] text-white" : "border-slate-500 bg-slate-700 text-slate-200"
            }`}
          >
            {voiceOn ? "🔊 Read aloud" : "🔇 Read aloud off"}
          </button>
        </div>
      </header>

      {/* Phases */}
      <nav className="flex shrink-0 flex-wrap justify-center gap-2 border-b border-slate-700 bg-[#0f172a] px-3 py-2">
        {PHASES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => goPhase(p.id)}
            aria-current={phase === p.id}
            className={`rounded-xl border-2 px-4 py-1.5 text-sm font-bold transition-all ${
              phase === p.id
                ? "-translate-y-0.5 border-[#38bdf8] bg-[#38bdf8] text-[#052e3f] shadow-lg shadow-cyan-500/25"
                : "border-slate-700 bg-[#1e293b] text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {p.icon} {p.id}. {p.label}
          </button>
        ))}
      </nav>

      <div className="relative grid min-h-0 flex-1 gap-3 p-2.5 sm:p-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* ---------- Board ---------- */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border-4 border-slate-700 bg-[#0f172a] shadow-2xl">
          {/* Grouped by concept. A unit where several concepts are walked
              across an illustration can reach forty steps, and a flat row of
              forty buttons is not navigable - so the row shows one button per
              concept, and its sub-steps appear underneath only while that
              concept is the one being read. */}
          {phase === 1 && (
            <div className="shrink-0 border-b border-slate-800 px-3 py-2">
              {/* Thirteen concepts laid flat ran to four rows and left the
                  board barely 230px tall, which is what was cropping the
                  artwork. Collapsed to the concept being read, with the full
                  list one tap away. */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPickerOpen((v) => !v)}
                  aria-expanded={pickerOpen}
                  className="rounded-xl border-2 border-slate-700 bg-slate-900/95 px-2.5 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:border-[#38bdf8] hover:text-white"
                  title="Show every concept in this chapter"
                >
                  {pickerOpen ? "✕" : "☰"} {conceptGroups.length}
                </button>
                <span className="rounded-xl border-2 border-[#f59e0b] bg-[#f59e0b] px-3 py-1.5 text-xs font-bold text-[#020617]">
                  {activeGroup ? activeGroup.label : "Read"}
                </span>
              </div>
              {pickerOpen && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-2xl border border-slate-800 bg-[#090d16] p-2">
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {conceptGroups.map((g) => {
                      const isHere = g.indexes.includes(step);
                      const status = conceptStatus(g.key);
                      const statusLabel = status.test ? "Complete" : status.recite ? "Test pending" : status.cover ? "Recite pending" : status.read ? "Cover pending" : "Read pending";
                      return (
                        <div key={g.key} className={`rounded-xl border p-2 ${isHere ? "border-[#f59e0b]/70 bg-[#f59e0b]/10" : "border-slate-800 bg-[#0f172a]"}`}>
                          <button
                            type="button"
                            onClick={() => loadStep(g.indexes[0])}
                            className={`w-full rounded-lg px-2 py-1 text-left text-xs font-extrabold transition-colors ${isHere ? "text-[#fef08a]" : "text-slate-300 hover:text-white"}`}
                          >
                            {g.label}
                          </button>
                          <p className={`mt-1 text-[0.62rem] font-bold ${status.test ? "text-[#34d399]" : "text-[#f59e0b]"}`}>
                            {status.test ? "✅" : "⏳"} {statusLabel}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {g.indexes.map((idx, n) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => loadStep(idx)}
                                className={`rounded-md border px-1.5 py-1 text-[0.65rem] font-bold transition-colors ${idx === step ? "border-[#38bdf8] bg-[#38bdf8]/20 text-[#7dd3fc]" : "border-slate-700 text-slate-500 hover:border-[#38bdf8] hover:text-slate-200"}`}
                              >
                                {n + 1}. {unit.conceptSteps[idx].label.replace(/^\S+\s*/, "")}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3">
            {frame.image ? (
              <ImageStage frame={frame} onTap={(t) => say(t)} />
            ) : frame.diagram ? (
              <DiagramStage frame={frame} onTap={(t) => say(t)} />
            ) : frame.bar ? (
              <BarStage frame={frame} onTap={(t) => say(t)} />
            ) : frame.chart ? (
              <ChartStage frame={frame} onTap={(t) => say(t)} />
            ) : frame.timeline ? (
              <TimelineStage frame={frame} onTap={(t) => say(t)} />
            ) : frame.text || unit.stage === "text" ? (
              <TextStage
                frame={frame}
                onTap={(t) => say(t)}
                chipDrag={chipTask?.chipDrag && !answers[chipTask.title] ? chipTask.chipDrag : undefined}
                onDropChip={(col) => dropChip(col)}
              />
            ) : unit.stage === "numberLine" ? (
              <NumberLineStage
                frame={frame}
                onTap={(v) => say(nameValue(v))}
                drag={dragTask?.drag && dragAt ? { at: dragAt[0], hint: dragTask.drag.hint } : undefined}
                onDrag={(v) => setDragAt([v])}
                onDrop={(v) => dropDrag([v])}
              />
            ) : unit.stage !== "grid" &&
              !frame.shapes?.length &&
              !frame.arrows?.length &&
              !frame.guides?.length &&
              !frame.dots?.length &&
              !dragTask?.drag ? (
              // The coordinate-axis grid below is a real Math teaching tool
              // (drag-a-shape tasks, translations, plotted points) - showing
              // its bare x/y axes for a Science or English step with no
              // matching visual is confusing, not a neutral empty state. Real
              // user finding 2026-09-22: a stale/empty frame surfaced this
              // grid on a Science unit's Recite step. Every other stage falls
              // back to this only when there is real coordinate content to
              // draw; otherwise show a plain "no picture for this step" card.
              <div className="flex h-full max-h-[26rem] w-full max-w-[36rem] flex-col items-center justify-center gap-2 rounded-2xl border-[3px] border-dashed border-slate-700 bg-[#0b1329] p-6 text-center">
                <span className="text-3xl">{activeConcept?.icon ?? "📋"}</span>
                <p className="text-sm font-bold text-slate-300">{activeConcept?.title ?? unit.title}</p>
                <p className="max-w-xs text-xs text-slate-500">Talk through the idea out loud, then check the worked example below.</p>
              </div>
            ) : (
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="h-full max-h-[26rem] w-full max-w-[36rem] select-none touch-none rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]"
              role="img"
              aria-label={`Coordinate grid showing ${unit.title}`}
            >
              <defs>
                <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="#f59e0b" />
                </marker>
                <linearGradient id="g-blue" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="g-green" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="g-red" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" /><stop offset="100%" stopColor="#be123c" />
                </linearGradient>
              </defs>

              {Array.from({ length: unit.gridMax + 1 }, (_, i) => (
                <g key={i}>
                  <line x1={gx(i)} y1={gy(unit.gridMax)} x2={gx(i)} y2={gy(0)} stroke="#1e293b" strokeWidth={1} />
                  <line x1={gx(0)} y1={gy(i)} x2={gx(unit.gridMax)} y2={gy(i)} stroke="#1e293b" strokeWidth={1} />
                  <text x={gx(i)} y={gy(0) + 16} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="middle">{i}</text>
                  {i > 0 && <text x={gx(0) - 10} y={gy(i) + 4} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="end">{i}</text>}
                </g>
              ))}
              <line x1={gx(0)} y1={gy(0)} x2={gx(unit.gridMax) + 12} y2={gy(0)} stroke="#64748b" strokeWidth={3} />
              <line x1={gx(0)} y1={gy(0)} x2={gx(0)} y2={gy(unit.gridMax) - 12} stroke="#64748b" strokeWidth={3} />

              {/* Every whole-number point is touchable and says its
                  coordinates aloud. */}
              {Array.from({ length: unit.gridMax + 1 }, (_, ix) =>
                Array.from({ length: unit.gridMax + 1 }, (_, iy) => (
                  <rect
                    key={`h${ix}-${iy}`}
                    x={gx(ix) - 9}
                    y={gy(iy) - 9}
                    width={18}
                    height={18}
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={() => say(`${ix} across and ${iy} up. We write that as ${ix}, ${iy}.`)}
                  />
                )),
              )}
              {dragTask?.drag && dragAt && (unit.stage ?? "grid") === "grid" && (
                <g
                  className="cursor-grab"
                  onPointerDown={(e) => {
                    const svg = e.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    const move = (ev: PointerEvent) => {
                      const r = svg.getBoundingClientRect();
                      const vx = ((ev.clientX - r.left) / r.width) * VB_W;
                      const vy = ((ev.clientY - r.top) / r.height) * VB_H;
                      const gxUnit = (VB_W - PAD_L - 20) / unit.gridMax;
                      const gyUnit = (VB_H - PAD_B - 20) / unit.gridMax;
                      const x = Math.round((vx - PAD_L) / gxUnit);
                      const y = Math.round((VB_H - PAD_B - vy) / gyUnit);
                      setDragAt([Math.max(0, Math.min(unit.gridMax, x)), Math.max(0, Math.min(unit.gridMax, y))]);
                    };
                    const up = (ev: PointerEvent) => {
                      window.removeEventListener("pointermove", move);
                      window.removeEventListener("pointerup", up);
                      const r = svg.getBoundingClientRect();
                      const vx = ((ev.clientX - r.left) / r.width) * VB_W;
                      const vy = ((ev.clientY - r.top) / r.height) * VB_H;
                      const gxUnit = (VB_W - PAD_L - 20) / unit.gridMax;
                      const gyUnit = (VB_H - PAD_B - 20) / unit.gridMax;
                      const x = Math.max(0, Math.min(unit.gridMax, Math.round((vx - PAD_L) / gxUnit)));
                      const y = Math.max(0, Math.min(unit.gridMax, Math.round((VB_H - PAD_B - vy) / gyUnit)));
                      dropDrag([x, y]);
                    };
                    window.addEventListener("pointermove", move);
                    window.addEventListener("pointerup", up);
                  }}
                >
                  <circle cx={gx(dragAt[0])} cy={gy(dragAt[1])} r={13} fill="#ec4899" fillOpacity={0.25} />
                  <circle cx={gx(dragAt[0])} cy={gy(dragAt[1])} r={8} fill="#ec4899" stroke="#fff" strokeWidth={2} />
                  <text x={gx(dragAt[0]) + 14} y={gy(dragAt[1]) - 12} fill="#ec4899" fontSize={12} fontWeight="bold">
                    {dragTask.drag.hint ?? "drag me"} ({dragAt[0]}, {dragAt[1]})
                  </text>
                </g>
              )}
              {(frame.shapes ?? []).map((s, i) => (
                <AnimatedPolygon
                  key={`s${i}`}
                  points={s.points}
                  gx={gx}
                  gy={gy}
                  fill={shapeFill[s.look]}
                  stroke={shapeStroke[s.look]}
                  strokeWidth={s.look === "ghost" ? 2.5 : 3}
                  strokeDasharray={s.look === "ghost" ? "5,5" : undefined}
                />
              ))}
              {/* Guides are drawn under everything else: a mirror line is
                  scenery the shapes sit against, not a thing being pointed
                  at, so it gets no arrowhead. */}
              {(frame.guides ?? []).map((g, i) => (
                <g key={`g${i}`}>
                  <line
                    x1={gx(g.from[0])} y1={gy(g.from[1])} x2={gx(g.to[0])} y2={gy(g.to[1])}
                    stroke={dotFill[g.tone ?? "blue"]} strokeWidth={2.5} strokeDasharray="8,6" strokeLinecap="round"
                  />
                  {g.label && (
                    <text
                      x={gx(g.to[0]) + 8}
                      y={gy(g.to[1]) + 4}
                      fill={dotFill[g.tone ?? "blue"]}
                      fontSize={12}
                      fontWeight="bold"
                    >
                      {g.label}
                    </text>
                  )}
                </g>
              ))}
              {(frame.arrows ?? []).map((a, i) => (
                <line
                  key={`a${i}`}
                  x1={gx(a.from[0])} y1={gy(a.from[1])} x2={gx(a.to[0])} y2={gy(a.to[1])}
                  stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6,4" markerEnd="url(#ah)"
                />
              ))}
              {(frame.dots ?? []).map((d, i) => (
                <g key={`d${i}`}>
                  <circle cx={gx(d.at[0])} cy={gy(d.at[1])} r={6} fill={dotFill[d.tone ?? "gold"]} />
                  {d.label && (
                    <text x={gx(d.at[0]) + 10} y={gy(d.at[1]) - 8} fill={dotFill[d.tone ?? "gold"]} fontSize={12} fontWeight="bold">
                      {d.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>
            )}

            {phase === 3 && activeConcept ? <ReciteBoardCard concept={activeConcept} /> : null}
          </div>

          {/* Narration */}
          <div className="flex shrink-0 items-center gap-3 border-t-[3px] border-[#38bdf8] bg-[#020617]/95 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#38bdf8] text-lg">🎙️</span>
            <p className="min-w-0 flex-1 text-[0.95rem] font-bold leading-snug text-[#e0f2fe]">{subtitle}</p>
          </div>

        </section>

        {/* ---------- Assistant / tasks ---------- */}
        <aside className="flex min-h-0 flex-col gap-3 overflow-hidden rounded-3xl border-2 border-slate-700 bg-[#1e293b] p-3 transition-all duration-500 ease-out sm:p-4">
          <nav className="grid shrink-0 grid-cols-2 gap-2 rounded-2xl border border-slate-700 bg-[#0f172a] p-1.5" aria-label="Learning board side panel">
            <button
              type="button"
              onClick={() => setFocusPanel("lesson")}
              aria-pressed={focusPanel === "lesson"}
              className={`rounded-xl px-3 py-2 text-sm font-extrabold transition-all ${focusPanel === "lesson" ? "bg-[#f59e0b] text-[#020617] shadow-lg shadow-amber-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              📚 Lesson
            </button>
            <button
              type="button"
              onClick={() => setFocusPanel("chat")}
              aria-pressed={focusPanel === "chat"}
              className={`rounded-xl px-3 py-2 text-sm font-extrabold transition-all ${focusPanel === "chat" ? "bg-[#38bdf8] text-[#052e3f] shadow-lg shadow-cyan-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              💬 Chat
            </button>
          </nav>
          {focusPanel !== "chat" && <div ref={lessonPanelRef} className="min-h-0 flex-1 overflow-y-auto pr-1 motion-safe:animate-[fadeIn_.35s_ease-out]">
          {phase === 1 && (
            <>
              <h2 className="border-b-2 border-slate-700 pb-2 text-lg font-bold text-[#f59e0b]">📖 This chapter</h2>
              {/* A child should know what they are walking into and what they
                  will be able to do at the end of it - real feedback
                  2026-09-14: "it lacks some introduction on what we are going
                  to cover in this chapter and what will be achieved". */}
              <div className="rounded-2xl border-2 border-slate-700 bg-[#0f172a] p-3">
                <p className="text-[0.7rem] font-extrabold uppercase tracking-wider text-[#38bdf8]">Today&apos;s mission</p>
                <p className="mt-1 text-[0.82rem] font-semibold leading-snug text-slate-300">
                  {/* This was a hardcoded Math-decimals sentence that showed
                      on every unit in every subject regardless of what it
                      actually was - real user finding 2026-09-22. Build it
                      from this unit's own outcomes instead. */}
                  By the end, you will be able to {unit.intro.outcomes[0] ?? "explain what you have learned in this chapter"}
                  {unit.intro.outcomes[1] ? `, and ${unit.intro.outcomes[1]}` : ""}.
                </p>
                <details className="mt-2 rounded-xl border border-slate-700 bg-[#111c31] px-2.5 py-2">
                  <summary className="cursor-pointer text-[0.72rem] font-bold text-slate-400">See the whole chapter map</summary>
                  <ul className="mt-2 flex flex-col gap-1">
                    {unit.intro.covers.map((c) => <li key={c} className="text-[0.75rem] leading-snug text-slate-400">• {c}</li>)}
                  </ul>
                </details>
                <button
                  type="button"
                  onClick={() => say(`In this chapter we will cover: ${unit.intro.covers.join(". ")}. By the end you will be able to ${unit.intro.outcomes.join(", and ")}.`)}
                  className="mt-3 rounded-xl border-2 border-slate-600 px-3 py-1.5 text-[0.78rem] font-bold text-slate-300 hover:border-[#38bdf8] hover:text-[#38bdf8]"
                >
                  🎙️ Read this to me
                </button>
              </div>
              <div className="rounded-2xl border-2 border-[#f59e0b] bg-[#f59e0b]/10 px-3.5 py-2.5 text-[0.82rem] font-bold leading-snug text-[#fef08a]">
                💡 {unit.concepts[0].summary}
              </div>
              {activeConcept && (
                <>
                  <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#38bdf8]">
                    {activeConcept.icon} {activeConcept.conceptId} {activeConcept.title}
                  </p>
                  <p className="rounded-xl bg-[#0f172a] px-3 py-2 text-[0.8rem] leading-snug text-slate-300">{activeConcept.summary}</p>
                  {(activeConcept.pages?.length || activeConcept.storyReference) && (
                    <p className="rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-2 text-[0.76rem] font-semibold text-[#7dd3fc]">
                      📖 In your book:{" "}
                      {activeConcept.pages?.length
                        ? `page${activeConcept.pages.length > 1 ? "s" : ""} ${activeConcept.pages.join(" and ")}`
                        : ""}
                      {activeConcept.storyReference ? ` · ${activeConcept.storyReference}` : ""}
                    </p>
                  )}
                  {/* Examples sit at the end of each concept, to try before
                      moving on - real user direction 2026-09-14: "we have to
                      have examples at the end of each concept, that will be
                      practice". */}
                  <div ref={examplesPanelRef} className="mt-3 rounded-2xl border-2 border-[#34d399] bg-[#34d399]/10 p-3 shadow-lg shadow-emerald-950/30 scroll-mt-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[0.78rem] font-extrabold uppercase tracking-wider text-[#6ee7b7]">
                        ⭐ Try these before moving on
                      </p>
                      <span className="rounded-full bg-[#34d399] px-2 py-0.5 text-[0.68rem] font-extrabold text-[#022c22]">
                        {exampleProgress[activeConcept.conceptId] ?? 0}/{activeConcept.examples.length}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.75rem] font-semibold leading-snug text-emerald-100">
                      Complete each warm-up first. The next topic unlocks after this.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {activeConcept.examples.map((e, i) => (
                      <ReciteCard key={e.question} prompt={{ ask: `${i + 1}. ${e.question}`, answer: e.answer }} onSay={say} onComplete={() => markExampleComplete(activeConcept.conceptId)} revealLabel="Check my answer" />
                    ))}
                  </div>
                  {activeConcept.quickCheck && activeConcept.quickCheck.length > 0 && (
                    <>
                      <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#f59e0b]">
                        Quick check before the next part
                      </p>
                      {activeConcept.quickCheck.map((t) => (
                        <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} onReplay={() => replayTask(t)} />
                      ))}
                    </>
                  )}
                </>
              )}
              <ul className="hidden flex-col gap-1.5">
                {unit.concepts[0].keyPoints.map((k) => (
                  <li key={k} className="rounded-xl bg-[#0f172a] px-3 py-2 text-[0.8rem] leading-snug text-slate-300">• {k}</li>
                ))}
              </ul>
              <button type="button" onClick={() => goPhase(2)} disabled={!examplesComplete() || !quickChecksComplete()} className="mt-auto rounded-xl bg-[#ec4899] px-4 py-2.5 font-bold text-white shadow-[0_4px_0_#be185d] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45">
                {!examplesComplete() ? "Try all examples to unlock Cover" : quickChecksComplete() ? "Cover it up and try ➔" : "Complete the quick check to unlock Cover"}
              </button>
            </>
          )}

          {(phase === 2 || phase === 4) && (
            <>
              <h2 className="border-b-2 border-slate-700 pb-2 text-lg font-bold text-[#f59e0b]">
                {phase === 2 ? "🙈 Cover - try it from memory" : "📝 Test"}
              </h2>
              {phase === 4 && (
                <p className="text-[0.8rem] text-slate-400">
                  These count. Part A is straight recall; Part B asks you to use the idea somewhere new.
                  {" "}{graded.length} questions in all{paperTasks.length ? `, ${paperTasks.length} of them straight from your question paper` : ""}.
                </p>
              )}
              {/* Answered questions sink and dim so the one still to do has
                  the board to itself - real user direction 2026-09-14: "clear
                  or mark them light or move them backward for each answer
                  done... else old answer stays we work on new question that
                  may confuse". */}
              {byDone(phase === 2 ? topicGuidedTasks : topicPartA).map((t) => (
                <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} onReplay={() => replayTask(t)} />
              ))}
              {phase === 4 && (
                <>
                  <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#f59e0b]">Part B · use it somewhere new</p>
                  {byDone(topicPartB).map((t) => (
                    <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} onReplay={() => replayTask(t)} />
                  ))}
                  {topicPaperTasks.length > 0 && (
                    <>
                      <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#38bdf8]">
                        From your question paper
                      </p>
                      {byDone(topicPaperTasks).map((t) => (
                        <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} onReplay={() => replayTask(t)} />
                      ))}
                    </>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => goPhase(phase === 2 ? 3 : 5)}
                disabled={phase === 2 && topicGuidedTasks.some((task) => !answers[task.title])}
                className="mt-auto rounded-xl bg-[#ec4899] px-4 py-2.5 font-bold text-white shadow-[0_4px_0_#be185d] transition-transform hover:-translate-y-0.5"
              >
                {phase === 2 ? (topicGuidedTasks.every((task) => answers[task.title]) ? "Recite it back ➔" : "Finish this topic's Cover questions") : "See how I did ➔"}
              </button>
            </>
          )}

          {phase === 3 && (
            <>
              <h2 className="border-b-2 border-slate-700 pb-2 text-lg font-bold text-[#f59e0b]">🗣️ Recite</h2>
              <p className="text-[0.8rem] text-slate-400">
                Say the rule and the worked example shown on the board. Each prompt belongs to <strong className="text-slate-200">{activeConcept?.conceptId} {activeConcept?.title}</strong>; nothing from the next topic is included.
              </p>
              {/* The mic below listens and answers in whatever language is
                  picked here - real user finding 2026-09-23: this setting is
                  shared with the Chat tab's own selector and can be left on
                  a language from an earlier session with zero indication,
                  so speaking English got heard and answered as Tamil with no
                  way to see why. Surfaced right next to the mic it controls. */}
              <label className="flex items-center gap-2 text-[0.72rem] font-bold text-slate-400">
                Answer in
                <select
                  value={language}
                  onChange={(event) => {
                    setLanguage(event.target.value);
                    localStorage.setItem("studyezy_language", event.target.value);
                  }}
                  className="rounded-lg border-2 border-slate-700 bg-[#1e293b] px-2 py-1 text-[0.72rem] font-bold text-slate-200 outline-none focus:border-[#38bdf8]"
                >
                  {BOARD_LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
                </select>
              </label>
              <div className="flex flex-col gap-2">
                {topicRecitePrompts.map((r) => (
                  <ReciteCard key={r.ask} prompt={r} onSay={say} unitKey={unit.unitKey} conceptId={activeConceptId ?? unit.concepts[0]?.conceptId ?? ""} languageCode={language} languageLabel={BOARD_LANGUAGES.find((item) => item.code === language)?.label ?? "English"} onComplete={() => activeConceptId && markReciteComplete(activeConceptId)} />
                ))}
              </div>
              <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-slate-500">
                Write these in your rough book, then check
              </p>
              <div className="flex flex-col gap-2">
                {topicWrittenPractice.map((w, i) => (
                  <ReciteCard key={w.question} prompt={{ ask: `${i + 1}. ${w.question}`, answer: w.answer }} onSay={say} onComplete={() => activeConceptId && markReciteComplete(activeConceptId)} revealLabel="I've written it - check me" />
                ))}
              </div>
              <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-slate-500">Then play with it</p>
              <p className="text-[0.82rem] leading-snug text-slate-400">{unit.lab.prompt}</p>
              {unit.lab.kind === "timeZone" ? (
                <div className="rounded-2xl border-2 border-[#38bdf8] bg-[#082f49]/60 p-3 text-[0.82rem] leading-snug text-slate-200">
                  <p className="font-extrabold text-[#7dd3fc]">🌍 Direction rule</p>
                  <p className="mt-1"><strong className="text-[#fbbf24]">EAST → add hours</strong> because east is ahead.</p>
                  <p><strong className="text-[#fb7185]">WEST ← subtract hours</strong> because west is behind.</p>
                  <p className="mt-2 font-bold text-white">Example: 7:00 am − 14 hours = 5:00 pm on the previous day.</p>
                </div>
              ) : unit.lab.kind === "visual" || !unit.lab.prompt ? (
                <div className="rounded-2xl border-2 border-[#34d399] bg-[#052e2b]/70 p-3 text-[0.82rem] leading-snug text-slate-200">
                  <p className="font-extrabold text-[#6ee7b7]">👆 Touch and investigate</p>
                  <p className="mt-1">Tap the labelled parts on the concept visual. Each tap reveals evidence and gives the next sentence you need for your explanation.</p>
                  <p className="mt-2 font-bold text-white">Stay on {activeConcept?.conceptId} · {activeConcept?.title}; this activity belongs only to this topic.</p>
                </div>
              ) : <div className="flex flex-col gap-3 rounded-2xl border border-slate-700 bg-[#0f172a] p-3">
                <label className="flex items-center justify-between gap-3 text-[0.82rem] font-bold">
                  <span>Across</span>
                  <input type="range" min={unit.lab.range.min} max={unit.lab.range.max} value={dx}
                    onChange={(e) => setDx(Number(e.target.value))} className="flex-1 accent-[#38bdf8]" />
                  <strong className="w-20 text-right text-[#38bdf8] tabular-nums">{dx >= 0 ? `${dx} right` : `${-dx} left`}</strong>
                </label>
                <label className="flex items-center justify-between gap-3 text-[0.82rem] font-bold">
                  <span>Up</span>
                  <input type="range" min={unit.lab.range.min} max={unit.lab.range.max} value={dy}
                    onChange={(e) => setDy(Number(e.target.value))} className="flex-1 accent-[#f59e0b]" />
                  <strong className="w-20 text-right text-[#f59e0b] tabular-nums">{dy >= 0 ? `${dy} up` : `${-dy} down`}</strong>
                </label>
                <div className="rounded-2xl border-2 border-[#f59e0b] bg-[#f59e0b]/10 px-3.5 py-2.5 text-[0.85rem] font-bold text-[#fef08a]">
                  📍 Across {Math.abs(dx)} {dx >= 0 ? "right" : "left"}; Up {Math.abs(dy)} {dy >= 0 ? "up" : "down"}.<br />
                  ({unit.lab.start[0]} {dx >= 0 ? "+" : "−"} {Math.abs(dx)}, {unit.lab.start[1]} {dy >= 0 ? "+" : "−"} {Math.abs(dy)}) ={" "}
                  <strong className="text-white">({unit.lab.start[0] + dx}, {unit.lab.start[1] + dy})</strong>
                </div>
              </div>}
              {unit.lab.kind === "coordinate" && <button type="button" onClick={() => { setFrame(labFrame); say(`Landed at ${unit.lab.start[0] + dx}, ${unit.lab.start[1] + dy}.`); }}
                className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2 text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                Show it on the board
              </button>}
              <button type="button" onClick={() => goPhase(4)} className="mt-auto rounded-xl bg-[#ec4899] px-4 py-2.5 font-bold text-white shadow-[0_4px_0_#be185d] transition-transform hover:-translate-y-0.5">
                I'm ready for the test ➔
              </button>
            </>
          )}

          {phase === 5 && (
            <>
              <h2 className="border-b-2 border-slate-700 pb-2 text-lg font-bold text-[#f59e0b]">📊 How it went</h2>
              <div className={`rounded-2xl border-2 px-3.5 py-3 font-bold ${passed ? "border-[#34d399] bg-[#34d399]/15 text-[#a7f3d0]" : "border-[#f43f5e] bg-[#f43f5e]/15 text-[#fecdd3]"}`}>
                {passed ? "🎉 Nicely done" : "🔁 Worth another look"}
                <div className="mt-1 text-2xl tabular-nums text-white">{readiness}%</div>
                <div className="mt-1 text-[0.78rem] font-semibold opacity-80">
                  {gradedCorrect.length} of {graded.length} right{gradedAnswered.length < graded.length ? ` · ${graded.length - gradedAnswered.length} not answered` : ""}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-[#0f172a] p-3 text-[0.82rem] text-slate-300">
                <p className="mb-1.5 font-bold text-white">What we&apos;ll do next</p>
                {passed
                  ? nextGroup ? `Topic complete. The next topic is ${nextGroup.label}.` : "This was the final topic. It comes back in 3 days as a quick brush-up, so it sticks for the test."
                  : "We&apos;ll revisit the concept walkthrough tomorrow, then try the check again."}
              </div>
              {passed && nextGroup && (
                <button
                  type="button"
                  onClick={moveToNextTopic}
                  className="rounded-xl bg-[#38bdf8] px-4 py-2.5 text-center font-extrabold text-[#052e3f] shadow-[0_4px_0_#0369a1] transition-transform hover:-translate-y-0.5"
                >
                  Continue to {nextGroup.label} ➔
                </button>
              )}
              {graded.map((t) => {
                const a = answers[t.title];
                return (
                  <p key={t.title} className="flex items-center justify-between gap-2 rounded-xl bg-[#0f172a] px-3 py-2 text-[0.78rem]">
                    <span className="min-w-0 truncate text-slate-300">{t.title}</span>
                    <span className={a ? (a.correct ? "text-[#34d399]" : "text-[#f43f5e]") : "text-slate-500"}>
                      {a ? (a.correct ? "✓" : "✗") : "—"}
                    </span>
                  </p>
                );
              })}
              <button
                type="button"
                onClick={saveResult}
                disabled={saveState === "saving" || saveState === "saved" || gradedAnswered.length === 0}
                className="rounded-xl bg-[#10b981] px-4 py-2.5 font-bold text-white disabled:opacity-50"
              >
                {saveState === "saved" ? "✓ Saved to your progress" : saveState === "saving" ? "Saving..." : "Save this to my progress"}
              </button>
              {saveState === "error" && <p className="text-[0.78rem] text-red-400">Couldn&apos;t save that - your answers are still on screen, try again.</p>}
              {/* Everything this unit already has, reachable from the end of
                  the board rather than leaving the child at a dead end. */}
              <div className="flex flex-col gap-2">
                <p className="text-[0.7rem] font-extrabold uppercase tracking-wider text-slate-500">Carry on with</p>
                <Link href={`/exam/${unit.unitKey}`} className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 text-center text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                  ✍️ Written exam practice
                </Link>
                <Link href={`/test/${unit.unitKey}`} className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 text-center text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                  📋 Progression test
                </Link>
                <Link href="/plan" className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 text-center text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                  🧠 Prep plan &amp; brush-ups
                </Link>
                <Link href={`/learn/${unit.unitKey}`} className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 text-center text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                  💬 Talk it through with Ezy
                </Link>
              </div>
              <button type="button" onClick={() => { setAnswers({}); goPhase(1); }} className="mt-auto rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 font-bold text-slate-200 hover:border-[#38bdf8]">
                Walk through it again 🔄
              </button>
            </>
          )}

          </div>}

          {/* Ask-me sits under every phase, not just the first - real
              feedback 2026-09-14: "on the chat side there is no change,
              probably we should have some questions there". */}
          {focusPanel === "chat" && <section className="flex min-h-0 flex-1 flex-col rounded-2xl border-2 border-[#38bdf8]/60 bg-[#0f172a] motion-safe:animate-[fadeIn_.35s_ease-out]">
            <h2 className="px-3 py-2 text-[0.82rem] font-extrabold text-[#38bdf8]">
              💬 Ask Ezy about this lesson
            </h2>
            <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-3 pb-3">
              {/* Real user finding 2026-09-23: with a long readymade-question
                  list this input sat below the fold with nothing on screen
                  hinting it existed - moved above the suggestions, which now
                  scroll in their own capped box instead of pushing it down. */}
              <div className="rounded-xl border-2 border-[#38bdf8]/50 bg-[#0b1329] p-2.5">
                <p className="mb-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#34d399]">Ask about this topic</p>
                <div className="flex gap-1.5">
                  <label className="sr-only" htmlFor="board-language">Response language</label>
                  <select
                    id="board-language"
                    value={language}
                    onChange={(event) => {
                      setLanguage(event.target.value);
                      localStorage.setItem("studyezy_language", event.target.value);
                      setChatNotice(`Voice questions and answers will use ${BOARD_LANGUAGES.find((item) => item.code === event.target.value)?.label ?? "English"}`);
                    }}
                    className="w-24 rounded-lg border-2 border-slate-700 bg-[#1e293b] px-1.5 py-2 text-[0.7rem] font-bold text-slate-200 outline-none focus:border-[#38bdf8]"
                  >
                    {BOARD_LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
                  </select>
                  <input
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => { if (event.key === "Enter") submitChatQuestion(); }}
                    placeholder="Type your question…"
                    aria-label="Ask a question about this topic"
                    className="min-w-0 flex-1 rounded-lg border-2 border-slate-700 bg-[#1e293b] px-2.5 py-2 text-[0.8rem] text-white outline-none placeholder:text-slate-500 focus:border-[#38bdf8]"
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    aria-label={listening ? "Stop listening" : "Ask by microphone"}
                    title="Ask by microphone (Chrome or Edge)"
                    className={`rounded-lg border-2 px-2.5 text-lg transition-colors ${listening ? "border-[#f59e0b] bg-[#f59e0b] text-[#020617]" : "border-slate-700 bg-[#1e293b] hover:border-[#38bdf8]"}`}
                  >
                    {listening ? "⏹️" : "🎤"}
                  </button>
                  <button
                    type="button"
                    onClick={() => submitChatQuestion()}
                    disabled={!chatInput.trim()}
                    className="rounded-lg bg-[#0284c7] px-3 text-sm font-extrabold text-white disabled:opacity-40"
                  >
                    Ask
                  </button>
                </div>
                {chatNotice && <p className="mt-1.5 text-[0.68rem] font-semibold text-[#7dd3fc]">{chatNotice}</p>}
              </div>
              <div className="flex max-h-36 flex-col gap-1.5 overflow-y-auto pr-0.5">
                {unit.readymade.map((r) => (
                  <button
                    key={r.q}
                    type="button"
                    onClick={() => ask(r.q, r.a)}
                    className="rounded-xl border-2 border-slate-700 bg-[#1e293b] px-3 py-2 text-left text-[0.8rem] font-semibold text-slate-300 transition-colors hover:border-[#38bdf8] hover:text-[#38bdf8]"
                  >
                    {r.q}
                  </button>
                ))}
              </div>
              <div className={`flex flex-col gap-1.5 overflow-y-auto rounded-xl border border-slate-700 bg-[#090d16] p-2 ${focusPanel === "chat" ? "min-h-0 flex-1" : "max-h-32"}`}>
                {chat.map((m, i) => (
                  <p
                    key={i}
                    className={`rounded-lg px-2.5 py-1.5 text-[0.78rem] font-semibold ${
                      m.who === "kid" ? "self-end bg-[#0284c7] text-white" : "self-start border border-slate-700 bg-[#1e293b] text-[#38bdf8]"
                    }`}
                  >
                    {m.text}
                  </p>
                ))}
              </div>
            </div>
          </section>}
        </aside>
      </div>
    </div>
  );
}

/**
 * A shape polygon that actually slides between positions instead of
 * snapping. SVG `points` is not a CSS-animatable property - a `transition`
 * on it (the previous approach) is silently ignored by every browser - so
 * the move is tweened by hand with requestAnimationFrame, one vertex at a
 * time. Falls back to an instant snap when the vertex count changes (a
 * genuinely different shape, not a move of the same one) or the visitor has
 * asked for reduced motion.
 */
function AnimatedPolygon({
  points,
  gx,
  gy,
  fill,
  stroke,
  strokeWidth,
  strokeDasharray,
}: {
  points: [number, number][];
  gx: (x: number) => number;
  gy: (y: number) => number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
}) {
  const [rendered, setRendered] = useState(points);
  const fromRef = useRef(points);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    if (reduceMotion || from.length !== points.length) {
      fromRef.current = points;
      setRendered(points);
      return;
    }
    if (from.every(([x, y], i) => x === points[i][0] && y === points[i][1])) return;

    const durationMs = 650;
    const start = performance.now();
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setRendered(points.map(([tx, ty], i) => {
        const [fx, fy] = from[i];
        return [fx + (tx - fx) * eased, fy + (ty - fy) * eased];
      }));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = points;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // Re-tween only when the target vertices actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points)]);

  return (
    <polygon
      points={rendered.map(([x, y]) => `${gx(x)},${gy(y)}`).join(" ")}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      strokeLinejoin="round"
    />
  );
}

/**
 * Draws a number line frame: the line and its ticks, marks sitting on it,
 * hops drawn as arcs with their size written above, and place-value parts
 * underneath. Values in, pixels out - the same boundary the grid keeps.
 */
/**
 * A real illustration, panned and zoomed step by step. The transform is what
 * turns one big picture into a walkthrough - each step focuses a region, and
 * the move between them is the animation.
 */
function ReciteBoardCard({ concept }: { concept: { conceptId: string; title: string; icon: string; summary: string; examples: { question: string; answer: string }[] } }) {
  const examples = concept.examples.length
    ? concept.examples
    : [{ question: `Show one example of ${concept.title}.`, answer: `${concept.summary} Say the rule, show the steps, and check the result.` }];
  return (
    <div className="pointer-events-none absolute inset-x-5 bottom-3 z-10 max-h-[48%] overflow-y-auto rounded-2xl border-2 border-[#34d399] bg-[#052e2b]/95 p-3 shadow-2xl shadow-emerald-950/50 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.7rem] font-extrabold uppercase tracking-wider text-[#6ee7b7]">📌 Recite from this example</p>
        <span className="text-[0.68rem] font-bold text-emerald-200">{concept.icon} {concept.conceptId} · {concept.title}</span>
      </div>
      <p className="mt-1 text-[0.78rem] font-semibold leading-snug text-emerald-100">Say the rule, then talk through the worked example before checking the answer.</p>
      <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {examples.map((example, index) => (
          <div key={`${example.question}-${index}`} className="rounded-xl bg-[#064e3b]/80 px-2.5 py-1.5 text-[0.76rem] leading-snug">
            <p className="font-bold text-white">{index + 1}. {example.question}</p>
            <p className="chalkboard mt-1 px-2.5 py-1.5 text-[0.85rem]">{example.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const I = frame.image;
  /**
   * Hotspots are percentages of the PICTURE, so the box they sit in has to be
   * the picture's own shape. Left to object-contain, a portrait panel in a wide
   * box paints a narrow strip down the middle while the labels stay spread
   * across the whole box - every one of them detached from the thing it names.
   * So measure the artwork and let it set the box's aspect ratio.
   */
  /**
   * Measured shape, tagged with the picture it was measured from. It has to be
   * one piece of state: clearing it from an effect on src change loses the
   * measurement entirely for a cached image, whose onLoad fires during the
   * commit - before effects run - so the reset lands after the measurement and
   * wipes it.
   */
  const [shape, setShape] = useState<{ src: string; ratio: number } | null>(null);
  const ratio = shape && shape.src === I?.src ? shape.ratio : null;
  if (!I) return null;
  const f = I.focus;
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
      {I.title && <h3 className="shrink-0 text-center text-xl font-bold text-[#f59e0b]">{I.title}</h3>}
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
                // A tall panel in a short stage would be squeezed to a
                // thumbnail. Give it real height and let the stage scroll -
                // a picture too small to read teaches nothing.
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
            src={I.src}
            alt={I.alt}
            /* onLoad alone misses the common case: the img is in the server
               HTML, so the browser has usually finished loading it before
               React hydrates and the handler never fires. The ref measures
               whatever is already there; returning the previous object when
               nothing changed keeps this from re-rendering in a loop. */
            ref={(img) => {
              if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;
              const r = img.naturalWidth / img.naturalHeight;
              setShape((prev) => (prev && prev.src === I.src && prev.ratio === r ? prev : { src: I.src, ratio: r }));
            }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight)
                setShape({ src: I.src, ratio: img.naturalWidth / img.naturalHeight });
            }}
            className="board-motion-image h-full w-full object-contain motion-safe:animate-[board-image-float_6s_ease-in-out_infinite]"
          />
          {/* Counter-scaled: the labels live in the image's coordinate space
              so they stay pinned to their features, but they must not
              magnify with it - at a 3x zoom a fixed-size label balloons and
              drifts away from the thing it names. */}
          {(I.hotspots ?? []).map((h, i) => {
            // A label centred on a feature near the edge hangs off the picture
            // and gets clipped, so near an edge it anchors inwards instead.
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
        </div>
      </div>
      <p className="shrink-0 text-[0.78rem] text-slate-500">Tap a label to hear more.</p>
    </div>
  );
}

/**
 * A token that travels a hand-authored path once per frame - current round a
 * circuit, water through a cycle, blood round a loop. Same tween technique
 * as the shape/number-line motion, generalised to any SVG path instead of a
 * straight line or a polygon's own vertices.
 */
function AnimatedPathToken({ d, onDone }: { d: string; onDone?: () => void }) {
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
      else { setDone(true); onDone?.(); }
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf != null) cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);

  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      {!done && dotAt && <circle cx={dotAt.x} cy={dotAt.y} r={7} fill="#38bdf8" stroke="#0b1329" strokeWidth={2} />}
    </>
  );
}

/** A labelled figure. Artwork is repo source, still sanitised on the way in. */
function DiagramStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const D = frame.diagram;
  if (!D) return null;
  const [, , vw, vh] = D.viewBox.split(/\s+/).map(Number);
  return (
    <div className="flex h-full w-full select-none flex-col items-center gap-2 overflow-y-auto p-3">
      {D.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{D.title}</h3>}
      <svg viewBox={D.viewBox} className="board-motion-diagram h-full max-h-[24rem] w-full max-w-[44rem] rounded-2xl border-[3px] border-slate-700 bg-[#0b1329] motion-safe:animate-[board-diagram-breathe_5s_ease-in-out_infinite]">
        <g dangerouslySetInnerHTML={{ __html: sanitizeSvgFragment(D.svg) }} />
        {D.motionPath && (
          <AnimatedPathToken d={D.motionPath.d} onDone={D.motionPath.label ? () => onTap?.(D.motionPath!.label!) : undefined} />
        )}
        {(D.parts ?? []).map((p, i) => (
          <g key={i} className="cursor-pointer" onClick={() => onTap?.(`${p.label}. ${p.note}`)}>
            <circle cx={p.at[0]} cy={p.at[1]} r={Math.max(6, vw / 70)} fill={TONE[p.tone ?? "gold"]} stroke="#0b1329" strokeWidth={2} className="motion-safe:animate-pulse" />
            <text
              x={p.at[0] + vw / 55}
              y={p.at[1] - vh / 45}
              fill={TONE[p.tone ?? "gold"]}
              fontSize={Math.max(11, vw / 42)}
              fontWeight="bold"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-[0.78rem] text-slate-500">Tap a label to hear what that part does.</p>
    </div>
  );
}

/** Bar models and arrays. */
function BarStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const B = frame.bar;
  if (!B) return null;
  const max = B.max ?? Math.max(1, ...(B.bars ?? []).map((b) => b.value));
  return (
    <div className="flex h-full w-full select-none flex-col justify-center gap-4 overflow-y-auto p-5">
      {B.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{B.title}</h3>}
      {(B.bars ?? []).map((b, i) => (
        <button key={i} type="button" onClick={() => onTap?.(b.note ?? `${b.label}, ${b.value}`)} className="w-full text-left">
          <div className="mb-1 flex justify-between text-[0.82rem] font-bold text-slate-300">
            <span>{b.label}</span>
            <span className="tabular-nums" style={{ color: TONE[b.tone ?? "blue"] }}>{b.value}</span>
          </div>
          <div className="h-8 w-full overflow-hidden rounded-lg bg-[#0f172a] ring-1 ring-slate-700">
            <div className="h-full rounded-lg transition-all" style={{ width: `${(b.value / max) * 100}%`, backgroundColor: TONE[b.tone ?? "blue"] }} />
          </div>
        </button>
      ))}
      {B.array && (
        <div className="mx-auto flex flex-col gap-1.5">
          {Array.from({ length: B.array.rows }, (_, r) => (
            <div key={r} className="flex gap-1.5">
              {Array.from({ length: B.array!.cols }, (_, c) => {
                const n = r * B.array!.cols + c;
                const on = B.array!.highlight === undefined || n < B.array!.highlight;
                return <span key={c} className="h-6 w-6 rounded-full" style={{ backgroundColor: on ? TONE[B.array!.tone ?? "blue"] : "#1e293b" }} />;
              })}
            </div>
          ))}
        </div>
      )}
      {B.caption && <p className="text-center text-[0.9rem] font-bold text-slate-300">{B.caption}</p>}
    </div>
  );
}

/** A bar chart with axes. */
function ChartStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const C = frame.chart;
  if (!C) return null;
  const W = 620, H = 340, padL = 52, padB = 52;
  const max = Math.max(1, ...C.categories.map((c) => c.value));
  const step = (W - padL - 24) / C.categories.length;
  const ticks = Array.from({ length: max + 1 }, (_, i) => i).filter((i) => max <= 10 || i % Math.ceil(max / 5) === 0);
  return (
    <div className="flex h-full w-full select-none flex-col items-center gap-2 p-3">
      {C.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{C.title}</h3>}
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full max-h-[24rem] w-full max-w-[42rem] rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]">
        {ticks.map((t) => {
          const y = H - padB - (t / max) * (H - padB - 26);
          return (
            <g key={t}>
              <line x1={padL} y1={y} x2={W - 16} y2={y} stroke="#1e293b" strokeWidth={1} />
              <text x={padL - 8} y={y + 4} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="end">{t}</text>
            </g>
          );
        })}
        <line x1={padL} y1={H - padB} x2={W - 16} y2={H - padB} stroke="#64748b" strokeWidth={2.5} />
        <line x1={padL} y1={26} x2={padL} y2={H - padB} stroke="#64748b" strokeWidth={2.5} />
        {C.categories.map((c, i) => {
          const h = (c.value / max) * (H - padB - 26);
          const x = padL + i * step + step * 0.18;
          const w = step * 0.64;
          return (
            <g key={i} className="cursor-pointer" onClick={() => onTap?.(c.note ?? `${c.label}, ${c.value}`)}>
              <rect x={x} y={H - padB - h} width={w} height={h} rx={5} fill={TONE[c.tone ?? "blue"]} />
              <text x={x + w / 2} y={H - padB - h - 7} fill={TONE[c.tone ?? "blue"]} fontSize={12} fontWeight="bold" textAnchor="middle">{c.value}</text>
              <text x={x + w / 2} y={H - padB + 18} fill="#cbd5e1" fontSize={11} fontWeight="bold" textAnchor="middle">{c.label}</text>
            </g>
          );
        })}
        {C.yLabel && <text x={14} y={20} fill="#94a3b8" fontSize={11} fontWeight="bold">{C.yLabel}</text>}
        {C.xLabel && <text x={W - 16} y={H - 10} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="end">{C.xLabel}</text>}
      </svg>
    </div>
  );
}

/** Dated events along a line. */
function TimelineStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const T = frame.timeline;
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!T) return;
    const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) { setRevealed(T.events.length); return; }
    setRevealed(0);
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const next = (i: number) => {
      if (cancelled || i > T.events.length) return;
      setRevealed(i);
      if (i < T.events.length) timer = setTimeout(() => next(i + 1), 420);
    };
    next(1);
    return () => { cancelled = true; if (timer != null) clearTimeout(timer); };
    // Replay whenever the events themselves change (a new step/example).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(T?.events)]);

  if (!T) return null;
  return (
    <div className="flex h-full w-full select-none flex-col gap-3 overflow-y-auto p-5">
      {T.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{T.title}</h3>}
      <ol className="relative ml-3 border-l-[3px] border-[#38bdf8]/50 pl-5">
        {T.events.map((e, i) => {
          if (i >= revealed) return null;
          return (
            <li key={i} className="mb-4 motion-safe:animate-[fadeIn_.4s_ease-out]">
              <button type="button" onClick={() => onTap?.(e.note ?? `${e.when}. ${e.what}`)} className="text-left">
                <span
                  className="absolute -left-[11px] mt-1 h-5 w-5 rounded-full border-[3px] border-[#0f172a]"
                  style={{ backgroundColor: TONE[e.tone ?? "blue"] }}
                />
                <span className="block text-[0.8rem] font-extrabold uppercase tracking-wider" style={{ color: TONE[e.tone ?? "blue"] }}>{e.when}</span>
                <span className="block text-[0.95rem] font-bold text-white">{e.what}</span>
                {e.note && <span className="block text-[0.82rem] leading-snug text-slate-400">{e.note}</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const TONE: Record<string, string> = { gold: "#f59e0b", green: "#34d399", red: "#f43f5e", blue: "#38bdf8" };

/**
 * A sentence assembled piece by piece - the text equivalent of a token
 * sliding along a number line. The first piece appears immediately; each
 * later piece slides in after a pause, so a child watches the sentence grow
 * instead of reading it finished.
 */
function AnimatedTextBuild({ pieces }: { pieces: { text: string; tone?: string }[] }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) { setRevealed(pieces.length); return; }
    setRevealed(0);
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const next = (i: number) => {
      if (cancelled || i > pieces.length) return;
      setRevealed(i);
      if (i < pieces.length) timer = setTimeout(() => next(i + 1), 550);
    };
    next(1);
    return () => { cancelled = true; if (timer != null) clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pieces)]);

  return (
    <p className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-[1.15rem] font-bold leading-relaxed">
      {pieces.map((piece, i) =>
        i >= revealed ? null : (
          <span
            key={i}
            className="motion-safe:animate-[board-piece-in_.4s_ease-out]"
            style={{ color: piece.tone ? TONE[piece.tone] : "#e2e8f0" }}
          >
            {piece.text}
          </span>
        ),
      )}
    </p>
  );
}

/**
 * Renders a text frame: a passage with parts picked out in colour, a row of
 * tappable words, and buckets to sort them into. Every coloured part says its
 * note aloud when tapped, the same way a point on the grid does.
 */
function TextStage({
  frame,
  onTap,
  chipDrag,
  onDropChip,
}: {
  frame: BoardFrame;
  onTap?: (t: string) => void;
  chipDrag?: { chip: string; toColumn: number; hint?: string };
  onDropChip?: (columnIndex: number) => void;
}) {
  const T = frame.text;
  const [over, setOver] = React.useState<number | null>(null);
  if (!T) return <p className="text-sm text-slate-500">Press a step to begin.</p>;

  return (
    <div className="flex h-full w-full select-none flex-col gap-4 overflow-y-auto p-4">
      {T.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{T.title}</h3>}

      {T.build && <AnimatedTextBuild pieces={T.build.pieces} />}

      {T.passage && (
        <p className="mx-auto max-w-3xl text-[1.05rem] leading-relaxed text-slate-200">
          {T.passage.map((part, i) =>
            part.tone ? (
              <button
                key={i}
                type="button"
                onClick={() => onTap?.(part.note ?? part.text)}
                className="mx-0.5 rounded-md px-1 font-bold underline decoration-dotted underline-offset-4"
                style={{ color: TONE[part.tone], backgroundColor: `${TONE[part.tone]}1f` }}
              >
                {part.text}
              </button>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </p>
      )}

      {T.cards && (
        <div className="mx-auto grid w-full max-w-4xl gap-3 sm:grid-cols-2">
          {T.cards.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onTap?.(`${c.title}. ${c.desc}${c.quote ? ` The book says: ${c.quote}` : ""}`)}
              className="flex flex-col items-start gap-1.5 rounded-2xl border-2 border-slate-700 bg-[#0f172a] p-3.5 text-left transition-colors hover:border-[#38bdf8]"
            >
              <span className="rounded-full bg-[#f59e0b]/15 px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-[#f59e0b]">
                {c.tag}
              </span>
              <span className="text-[0.95rem] font-bold text-white">{c.title}</span>
              <span className="text-[0.82rem] leading-snug text-slate-400">{c.desc}</span>
              {c.quote && (
                <span className="mt-1 border-l-[3px] border-[#38bdf8] pl-2.5 text-[0.82rem] italic leading-snug text-[#7dd3fc]">
                  {c.quote}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {T.chips && (
        <div className="flex flex-wrap justify-center gap-2">
          {T.chips.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onTap?.(c.note ?? c.text)}
              className="rounded-xl border-2 px-3.5 py-2 text-[0.95rem] font-bold"
              style={{ borderColor: TONE[c.tone ?? "blue"], color: TONE[c.tone ?? "blue"], backgroundColor: `${TONE[c.tone ?? "blue"]}14` }}
            >
              {c.text}
            </button>
          ))}
        </div>
      )}

      {chipDrag && (
        <div
          className="mx-auto cursor-grab rounded-xl border-2 border-[#ec4899] bg-[#ec4899]/15 px-4 py-2.5 text-[1rem] font-bold text-[#ec4899]"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", chipDrag.chip)}
        >
          {chipDrag.chip}
          <span className="ml-2 text-[0.72rem] font-semibold opacity-80">{chipDrag.hint ?? "drag me into a box"}</span>
        </div>
      )}

      {T.columns && (
        <div className="mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-3">
          {T.columns.map((col, ci) => (
            <div
              key={col.label}
              onDragOver={(e) => {
                if (!chipDrag) return;
                e.preventDefault();
                setOver(ci);
              }}
              onDragLeave={() => setOver((o) => (o === ci ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                onDropChip?.(ci);
              }}
              className={`min-w-[12rem] flex-1 rounded-2xl border-2 p-3 transition-colors ${
                over === ci ? "border-[#ec4899] bg-[#ec4899]/10" : "border-slate-700 bg-[#0f172a]"
              }`}
            >
              <p className="mb-2 text-center text-[0.8rem] font-extrabold uppercase tracking-wider" style={{ color: TONE[col.tone ?? "blue"] }}>
                {col.label}
              </p>
              <ul className="flex flex-col gap-1.5">
                {col.items.map((it) => (
                  <li key={it} className="rounded-lg bg-[#1e293b] px-2.5 py-1.5 text-[0.85rem] text-slate-300">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Plays a number line's jumps one at a time - a token actually slides along
 * each arc, and the next jump only appears once the last one lands. Real
 * user direction 2026-09-20: "show these one by one and make kids
 * understand ... not just read the example, show the examples animated."
 * Previously every jump was drawn at once with no motion at all.
 */
function AnimatedNumberLineJumps({
  jumps,
  px,
  midY,
}: {
  jumps: { from: number; to: number; label?: string }[];
  px: (v: number) => number;
  midY: number;
}) {
  const [revealed, setRevealed] = useState(0);
  const [tokenValue, setTokenValue] = useState<number | null>(jumps[0]?.from ?? null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!jumps.length) {
      setRevealed(0);
      setTokenValue(null);
      return;
    }
    if (reduceMotion) {
      setRevealed(jumps.length);
      setTokenValue(jumps[jumps.length - 1].to);
      setPlaying(false);
      return;
    }

    let cancelled = false;
    let raf: number | null = null;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;
    setRevealed(0);
    setTokenValue(jumps[0].from);
    setPlaying(true);

    const runJump = (i: number) => {
      if (cancelled) return;
      if (i >= jumps.length) {
        setPlaying(false);
        return;
      }
      const { from, to } = jumps[i];
      const durationMs = Math.min(1400, Math.max(500, Math.abs(to - from) * 90));
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setTokenValue(from + (to - from) * eased);
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setRevealed(i + 1);
          pauseTimer = setTimeout(() => runJump(i + 1), 380);
        }
      };
      raf = requestAnimationFrame(tick);
    };
    runJump(0);

    return () => {
      cancelled = true;
      if (raf != null) cancelAnimationFrame(raf);
      if (pauseTimer != null) clearTimeout(pauseTimer);
    };
    // Replay whenever the jump sequence itself changes (a new step/example).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(jumps)]);

  return (
    <>
      {jumps.map((j, i) => {
        if (i >= revealed) return null;
        const x1 = px(j.from);
        const x2 = px(j.to);
        const top = midY - 52;
        return (
          <g key={`j${i}`} className="motion-safe:animate-[fadeIn_.3s_ease-out]">
            <path d={`M ${x1} ${midY - 12} Q ${(x1 + x2) / 2} ${top} ${x2} ${midY - 12}`} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6,4" markerEnd="url(#nl-arrow)" />
            {j.label && <text x={(x1 + x2) / 2} y={top - 4} fill="#f59e0b" fontSize={13} fontWeight="bold" textAnchor="middle">{j.label}</text>}
          </g>
        );
      })}
      {playing && tokenValue != null && (
        <circle cx={px(tokenValue)} cy={midY} r={10} fill="#f59e0b" stroke="#0b1329" strokeWidth={2} />
      )}
    </>
  );
}

function NumberLineStage({
  frame,
  onTap,
  drag,
  onDrag,
  onDrop,
}: {
  frame: BoardFrame;
  onTap?: (v: number) => void;
  drag?: { at: number; hint?: string };
  onDrag?: (v: number) => void;
  onDrop?: (v: number) => void;
}) {
  const L = frame.line;
  if (!L) return <p className="text-sm text-slate-500">Press a step to begin.</p>;

  const W = 640;
  const H = 300;
  const padX = 46;
  const midY = 150;
  const span = L.max - L.min || 1;
  const px = (v: number) => padX + ((v - L.min) / span) * (W - padX * 2);
  const ticks: number[] = [];
  for (let v = L.min; v <= L.max + 1e-9; v += L.step) ticks.push(Number(v.toFixed(6)));
  const tone: Record<string, string> = { gold: "#f59e0b", green: "#34d399", red: "#f43f5e", blue: "#38bdf8" };
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4))));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full max-h-[26rem] w-full max-w-[42rem] select-none touch-none rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]" role="img" aria-label="Number line">
      <defs>
        <marker id="nl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#f59e0b" />
        </marker>
      </defs>

      <line x1={padX - 20} y1={midY} x2={W - padX + 20} y2={midY} stroke="#64748b" strokeWidth={3} />
      {ticks.map((v) => {
        const isZero = Math.abs(v) < 1e-9;
        return (
          <g key={v}>
            <line x1={px(v)} y1={midY - (isZero ? 14 : 9)} x2={px(v)} y2={midY + (isZero ? 14 : 9)} stroke={isZero ? "#94a3b8" : "#475569"} strokeWidth={isZero ? 3 : 2} />
            <text x={px(v)} y={midY + 32} fill={isZero ? "#e2e8f0" : "#94a3b8"} fontSize={12} fontWeight="bold" textAnchor="middle">{fmt(v)}</text>
            {/* Every tick is touchable and says what it is called - real user
                direction 2026-09-14: "sliding 0.1 to any tenths to understand
                how they are called". */}
            <rect x={px(v) - 14} y={midY - 26} width={28} height={64} fill="transparent" className="cursor-pointer" onClick={() => onTap?.(v)} />
          </g>
        );
      })}

      <AnimatedNumberLineJumps jumps={L.jumps ?? []} px={px} midY={midY} />

      {(L.marks ?? []).map((m, i) => (
        <g key={`m${i}`}>
          <circle cx={px(m.at)} cy={midY} r={7} fill={tone[m.tone ?? "gold"]} />
          {m.label && <text x={px(m.at)} y={midY - 18} fill={tone[m.tone ?? "gold"]} fontSize={13} fontWeight="bold" textAnchor="middle">{m.label}</text>}
        </g>
      ))}

      {drag && (
        <g
          className="cursor-grab"
          onPointerDown={(e) => {
            const svg = e.currentTarget.ownerSVGElement;
            if (!svg) return;
            const toValue = (clientX: number) => {
              const r = svg.getBoundingClientRect();
              const vx = ((clientX - r.left) / r.width) * W;
              const raw = L.min + ((vx - padX) / (W - padX * 2)) * span;
              const snapped = L.min + Math.round((raw - L.min) / L.step) * L.step;
              return Number(Math.max(L.min, Math.min(L.max, snapped)).toFixed(6));
            };
            const move = (ev: PointerEvent) => onDrag?.(toValue(ev.clientX));
            const up = (ev: PointerEvent) => {
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerup", up);
              onDrop?.(toValue(ev.clientX));
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
          }}
        >
          <circle cx={px(drag.at)} cy={midY} r={14} fill="#ec4899" fillOpacity={0.25} />
          <circle cx={px(drag.at)} cy={midY} r={9} fill="#ec4899" stroke="#fff" strokeWidth={2} />
          <text x={px(drag.at)} y={midY - 24} fill="#ec4899" fontSize={13} fontWeight="bold" textAnchor="middle">
            {drag.hint ?? "drag me"} · {fmt(drag.at)}
          </text>
        </g>
      )}
      {(L.parts ?? []).map((p, i, arr) => {
        const boxW = Math.min(130, (W - padX * 2) / arr.length - 10);
        const x = padX + i * (boxW + 10);
        return (
          <g key={`p${i}`}>
            <rect x={x} y={midY + 56} width={boxW} height={54} rx={10} fill="#1e293b" stroke={tone[p.tone ?? "blue"]} strokeWidth={2} />
            <text x={x + boxW / 2} y={midY + 78} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="middle">{p.label}</text>
            <text x={x + boxW / 2} y={midY + 99} fill={tone[p.tone ?? "blue"]} fontSize={17} fontWeight="bold" textAnchor="middle">{p.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ReciteCard({
  prompt,
  onSay,
  unitKey,
  conceptId,
  languageCode,
  languageLabel,
  onComplete,
  revealLabel = "I've said it - show me",
}: {
  prompt: { ask: string; answer: string };
  onSay: (t: string) => void;
  unitKey?: string;
  conceptId?: string;
  languageCode?: string;
  languageLabel?: string;
  onComplete?: () => void;
  revealLabel?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="rounded-2xl border-2 border-slate-700 bg-[#0f172a] p-3">
      <p className="text-[0.85rem] font-bold leading-snug text-white">{prompt.ask}</p>
      {shown ? (
        <p className="chalkboard mt-2 px-3.5 py-2.5 text-[0.95rem] leading-snug">{prompt.answer}</p>
      ) : (
        <>
          {unitKey && conceptId ? (
            <VoiceReciteCheck prompt={prompt.ask} answer={prompt.answer} unitKey={unitKey} conceptId={conceptId} languageCode={languageCode ?? "en-IN"} languageLabel={languageLabel ?? "English"} onSay={onSay} onComplete={() => { setShown(true); onComplete?.(); }} />
          ) : (
            <button type="button" onClick={() => { setShown(true); onComplete?.(); onSay(prompt.answer); }} className="mt-2 rounded-xl border-2 border-slate-600 px-3 py-1.5 text-[0.78rem] font-bold text-slate-300 hover:border-[#38bdf8] hover:text-[#38bdf8]">{revealLabel}</button>
          )}
        </>
      )}
    </div>
  );
}

function TaskCard({
  task,
  chosen,
  onPick,
  onReplay,
}: {
  task: BoardTask;
  chosen?: { correct: boolean; label: string; locked?: boolean };
  onPick: (index: number) => void;
  onReplay?: () => void;
}) {
  const done = Boolean(chosen);
  return (
    <div
      className={`flex flex-col gap-2.5 rounded-2xl border-2 p-3.5 transition-all ${
        done ? "scale-[0.98] border-slate-800 bg-[#0b1220] opacity-60" : "border-slate-700 bg-[#0f172a]"
      }`}
    >
      <div className="flex items-center justify-between gap-2 text-[0.9rem] font-bold text-white">
        <span className="min-w-0">{task.title}</span>
        <span className={`shrink-0 text-[0.75rem] ${chosen ? (chosen.correct ? "text-[#34d399]" : "text-[#f43f5e]") : "text-[#f59e0b]"}`}>
          {chosen ? (chosen.correct ? "✅ Right" : "❌ Marked wrong") : "· to do ·"}
        </span>
      </div>
      <p className="text-[0.82rem] font-semibold leading-snug text-slate-400">{task.prompt}</p>
      {done ? (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.78rem] text-slate-400">
            You answered <strong className="text-slate-200">{chosen?.label}</strong>
          </span>
          <button type="button" onClick={onReplay} className="shrink-0 rounded-lg border border-slate-700 px-2 py-1 text-[0.7rem] font-bold text-slate-400 hover:border-[#38bdf8] hover:text-[#38bdf8]">
            Show on board
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-2">
        {task.options.map((o, i) => {
          const isChosen = chosen?.label === o.label;
          return (
            <button
              key={o.label}
              type="button"
              onClick={() => onPick(i)}
              className={`rounded-xl border-2 px-3 py-2.5 text-[0.85rem] font-bold transition-all ${
                isChosen
                  ? o.correct
                    ? "border-[#34d399] bg-[#34d399]/20 text-[#34d399]"
                    : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                  : "border-slate-700 bg-[#1e293b] text-white hover:-translate-y-0.5 hover:border-[#38bdf8]"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      )}
    </div>
  );
}
