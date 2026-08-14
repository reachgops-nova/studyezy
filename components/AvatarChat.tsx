"use client";

import { useEffect, useRef, useState } from "react";
import type { Concept } from "@/lib/types";
import Avatar from "./Avatar";
import { Illustration } from "./illustrations";
import VoicePicker, { getSavedRate, getSavedVoiceName } from "./VoicePicker";

interface SpeechRecognitionResultLike {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface ChatMessage {
  id: string;
  sender: "avatar" | "kid";
  text: string;
}

let messageCounter = 0;
function nextId() {
  messageCounter += 1;
  return `m${messageCounter}`;
}

// Teaching content is grouped into small checkpoints - the avatar pauses
// and waits for the kid to react after each one, rather than reading the
// whole concept straight through and only checking in once at the very end.
function buildCheckpoints(concept: Concept): string[][] {
  const checkpoints: string[][] = [];

  const intro: string[] = [`Hi! Let's learn about ${concept.concept_name}.`];
  if (concept.definition) intro.push(concept.definition);
  checkpoints.push(intro);

  if (concept.key_points?.length) {
    checkpoints.push(concept.key_points);
  }

  const closing: string[] = [];
  if (concept.examples?.length) closing.push(`Here's an example: ${concept.examples[0]}`);
  if (concept.tips_to_remember?.[0]) closing.push(`Quick tip: ${concept.tips_to_remember[0]}`);
  if (closing.length) checkpoints.push(closing);

  return checkpoints;
}

const PAUSE_PROMPTS = [
  "Does that make sense so far?",
  "Following okay? Tell me when you're ready to keep going.",
  "All good? Say the word and we'll keep going.",
];

const CONTINUE_ACKS = ["Great, let's keep going!", "Awesome, moving on!", "Nice, here we go!"];
const REPEAT_ACKS = ["No problem, let me explain that again.", "Sure, here it is again."];

// In-Unit Micro-Checks (PLATFORM_PLAN.md §2.2): a couple of short, ungraded
// questions once teaching finishes, to catch confusion while it's still
// cheap to fix - before the formal progression test. Reuses the concept's
// own voice_qa_samples rather than generating new questions, so this works
// even without Anthropic credit. Answers aren't graded - just logged as an
// InteractionEvent for future adaptive-teaching work.
const MICRO_CHECK_COUNT = 2;
const MICRO_CHECK_ACKS = ["Nice thinking!", "Good effort - thanks for trying that one!", "Noted, thank you!"];

// A real explanation gets real praise; a low-effort reply ("ok", "yes", "idk")
// gets an honest, still-warm response instead of pretending it was an answer
// - no AI call needed, just a length/pattern check.
const LOW_EFFORT_PATTERN =
  /^(ok(ay)?|k|yes|yeah|yep|no|nope|sure|fine|good|nice|idk|i ?don'?t ?know|dunno|hmm+|maybe|not sure)[.!?]*$/i;
const LOW_EFFORT_ACKS = [
  "That's okay if you're not sure yet - we'll come back to this kind of question.",
  "No worries - it'll come with more practice. Let's keep going.",
];

function isLowEffortAnswer(text: string): boolean {
  return text.trim().length < 4 || LOW_EFFORT_PATTERN.test(text.trim());
}

// Recognizes natural replies to a checkpoint pause ("okay", "got it", "again?")
// without needing an AI call - this is what lets typing/saying a normal
// response act like tapping the pause buttons, instead of always being sent
// off as a real question.
const REPEAT_INTENT = /\b(again|repeat|didn'?t (get|catch|understand)|not clear|confused|explain again|don'?t (get|understand)|what does that mean|come again|one more time|slower)\b/i;
const CONTINUE_INTENT = /\b(ok(ay)?|yes|yeah|yep|yup|got it|good|fine|sure|continue|next|go on|keep going|ready|understood|makes sense|i (understand|get it)|alright)\b/i;

function matchCheckpointIntent(text: string): "continue" | "repeat" | null {
  const t = text.trim().toLowerCase();
  if (REPEAT_INTENT.test(t)) return "repeat";
  if (CONTINUE_INTENT.test(t)) return "continue";
  return null;
}

// Default speech rate lives in VoicePicker.tsx (getSavedRate) - a kid or
// parent can tune it per-device now instead of a single fixed value.
const SPEECH_LANG = "en-GB";

let cachedVoices: SpeechSynthesisVoice[] = [];

function pickVoice(): SpeechSynthesisVoice | null {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  const pool = cachedVoices.length ? cachedVoices : voices;

  // A voice picked and previewed in VoicePicker always wins - it's a real
  // choice made against what's actually installed on this device, better
  // than any heuristic guess.
  const savedName = getSavedVoiceName();
  if (savedName) {
    const saved = pool.find((v) => v.name === savedName);
    if (saved) return saved;
  }

  // Otherwise fall back to a British English voice as the default; most
  // platforms ship at least one (e.g. "Google UK English Female", "Daniel",
  // "Kate", "Serena").
  const gb = pool.filter((v) => v.lang?.toLowerCase() === "en-gb");
  if (gb.length === 0) return null;
  return gb.find((v) => /female|kate|serena/i.test(v.name)) ?? gb[0];
}

function getWordRange(text: string, charIndex: number, charLength?: number): [number, number] {
  const start = Math.max(0, Math.min(charIndex, text.length));
  if (charLength && charLength > 0) {
    return [start, Math.min(start + charLength, text.length)];
  }
  let end = start;
  while (end < text.length && !/\s/.test(text[end])) end++;
  if (end === start) end = Math.min(start + 1, text.length);
  return [start, end];
}

function HighlightedText({ text, range }: { text: string; range: [number, number] | null }) {
  if (!range || range[0] >= text.length) return <>{text}</>;
  const [start, end] = range;
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded bg-yellow-300 px-0.5 text-slate-900">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

export default function AvatarChat({
  unitKey,
  concept,
}: {
  unitKey: string;
  concept: Concept;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [readyForInput, setReadyForInput] = useState(false);
  const [awaitingContinue, setAwaitingContinue] = useState(false);
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [inMicroCheck, setInMicroCheck] = useState(false);
  const [microCheckIndex, setMicroCheckIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [highlightRange, setHighlightRange] = useState<[number, number] | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speechInputSupported, setSpeechInputSupported] = useState(false);
  const [readAloud, setReadAloud] = useState(true);
  const [showVoicePicker, setShowVoicePicker] = useState(false);

  const playTokenRef = useRef(0);
  const checkpointsRef = useRef<string[][]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpeechInputSupported(Boolean(SpeechRecognitionCtor));

    // Voice lists load asynchronously in most browsers - warm the cache now
    // so the first line spoken already has a chance to use a UK voice
    // instead of falling back to the system default.
    if ("speechSynthesis" in window) {
      pickVoice();
      window.speechSynthesis.onvoiceschanged = () => pickVoice();
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function speakText(text: string, messageId: string, onDone: () => void) {
    if (!(readAloud && "speechSynthesis" in window)) {
      setTimeout(onDone, 1400);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG;
    utterance.rate = getSavedRate();
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.onboundary = (event) => {
      if (event.name === "sentence") return;
      const charLength = (event as unknown as { charLength?: number }).charLength;
      setHighlightRange(getWordRange(text, event.charIndex, charLength));
    };
    utterance.onend = () => {
      setSpeaking(false);
      setSpeakingMessageId(null);
      setHighlightRange(null);
      onDone();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setSpeakingMessageId(null);
      setHighlightRange(null);
      onDone();
    };
    setSpeaking(true);
    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  }

  function startFinalCheckIn(token: number) {
    if (playTokenRef.current !== token) return;
    const samples = concept.voice_qa_samples ?? [];
    if (samples.length > 0) {
      askMicroCheck(0, token);
      return;
    }
    const checkIn = "Want to try answering a quick question, or ask me anything about this?";
    const id = nextId();
    setMessages((prev) => [...prev, { id, sender: "avatar", text: checkIn }]);
    speakText(checkIn, id, () => {});
    setReadyForInput(true);
    setAwaitingContinue(false);
  }

  function askMicroCheck(index: number, token: number) {
    if (playTokenRef.current !== token) return;
    const samples = concept.voice_qa_samples ?? [];
    const count = Math.min(MICRO_CHECK_COUNT, samples.length);

    if (index >= count) {
      setInMicroCheck(false);
      const checkIn = "Ready to move on, or want to ask me anything else about this first?";
      const id = nextId();
      setMessages((prev) => [...prev, { id, sender: "avatar", text: checkIn }]);
      speakText(checkIn, id, () => {});
      setReadyForInput(true);
      setAwaitingContinue(false);
      return;
    }

    const question = samples[index].question;
    const id = nextId();
    setMessages((prev) => [...prev, { id, sender: "avatar", text: question }]);
    speakText(question, id, () => {});
    setReadyForInput(true);
    setAwaitingContinue(false);
    setInMicroCheck(true);
    setMicroCheckIndex(index);
  }

  function playCheckpoint(index: number, token: number) {
    if (playTokenRef.current !== token) return;
    const checkpoints = checkpointsRef.current;

    if (checkpoints.length === 0 || index > checkpoints.length - 1) {
      startFinalCheckIn(token);
      return;
    }

    const isLast = index === checkpoints.length - 1;
    const msgs = checkpoints[index];

    function speakStep(i: number) {
      if (playTokenRef.current !== token) return;
      if (i >= msgs.length) {
        if (isLast) {
          startFinalCheckIn(token);
        } else {
          const prompt = PAUSE_PROMPTS[index % PAUSE_PROMPTS.length];
          const id = nextId();
          setMessages((prev) => [...prev, { id, sender: "avatar", text: prompt }]);
          speakText(prompt, id, () => {});
          setReadyForInput(true);
          setAwaitingContinue(true);
        }
        return;
      }
      const id = nextId();
      setMessages((prev) => [...prev, { id, sender: "avatar", text: msgs[i] }]);
      speakText(msgs[i], id, () => {
        if (playTokenRef.current !== token) return;
        speakStep(i + 1);
      });
    }

    speakStep(0);
  }

  useEffect(() => {
    const myToken = playTokenRef.current + 1;
    playTokenRef.current = myToken;

    // Resetting chat state here is synchronizing with an external system
    // (speechSynthesis playback) that has to restart whenever the concept
    // changes - there's no render-time equivalent for "cancel in-flight speech
    // and begin a new teaching sequence."
    /* eslint-disable react-hooks/set-state-in-effect */
    setMessages([]);
    setReadyForInput(false);
    setAwaitingContinue(false);
    setCheckpointIndex(0);
    setInMicroCheck(false);
    setMicroCheckIndex(0);
    setSpeaking(false);
    setSpeakingMessageId(null);
    setHighlightRange(null);
    /* eslint-enable react-hooks/set-state-in-effect */
    window.speechSynthesis?.cancel();

    checkpointsRef.current = buildCheckpoints(concept);
    playCheckpoint(0, myToken);

    return () => {
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept.concept_id, readAloud]);

  function handleContinueCheckpoint() {
    window.speechSynthesis?.cancel();
    setAwaitingContinue(false);
    const ack = CONTINUE_ACKS[checkpointIndex % CONTINUE_ACKS.length];
    const ackId = nextId();
    setMessages((prev) => [...prev, { id: ackId, sender: "avatar", text: ack }]);
    const nextIndex = checkpointIndex + 1;
    setCheckpointIndex(nextIndex);
    const token = playTokenRef.current;
    speakText(ack, ackId, () => playCheckpoint(nextIndex, token));
  }

  function handleRepeatCheckpoint() {
    window.speechSynthesis?.cancel();
    setAwaitingContinue(false);
    const ack = REPEAT_ACKS[checkpointIndex % REPEAT_ACKS.length];
    const ackId = nextId();
    setMessages((prev) => [...prev, { id: ackId, sender: "avatar", text: ack }]);
    const token = playTokenRef.current;
    speakText(ack, ackId, () => playCheckpoint(checkpointIndex, token));
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { id: nextId(), sender: "kid", text: trimmed }]);
    setInputText("");

    // A natural "okay" / "again?" style reply during a checkpoint pause acts
    // like tapping the pause buttons - no need to send it off as a real
    // question (and no AI call needed, so this works even without credits).
    if (awaitingContinue) {
      const intent = matchCheckpointIntent(trimmed);
      if (intent === "continue") {
        handleContinueCheckpoint();
        return;
      }
      if (intent === "repeat") {
        handleRepeatCheckpoint();
        return;
      }
    }

    // Micro-check answers aren't graded or routed to Claude - just
    // acknowledged warmly and logged for later, so this works even without
    // Anthropic credit.
    if (inMicroCheck) {
      const questionAsked = concept.voice_qa_samples?.[microCheckIndex]?.question ?? "";
      const ack = isLowEffortAnswer(trimmed)
        ? LOW_EFFORT_ACKS[microCheckIndex % LOW_EFFORT_ACKS.length]
        : MICRO_CHECK_ACKS[microCheckIndex % MICRO_CHECK_ACKS.length];
      const ackId = nextId();
      setMessages((prev) => [...prev, { id: ackId, sender: "avatar", text: ack }]);
      fetch("/api/micro-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey, conceptId: concept.concept_id, question: questionAsked, answer: trimmed }),
      }).catch(() => {});
      const token = playTokenRef.current;
      speakText(ack, ackId, () => askMicroCheck(microCheckIndex + 1, token));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey, conceptId: concept.concept_id, question: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Try again in a moment.");
      }

      const data = (await res.json()) as { answer: string };
      const answerId = nextId();
      setMessages((prev) => [...prev, { id: answerId, sender: "avatar", text: data.answer }]);
      speakText(data.answer, answerId, () => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function startListening() {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;
    const recognition: SpeechRecognitionLike = new SpeechRecognitionCtor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => setInputText(event.results[0][0].transcript);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  const quickReplies = [
    ...(concept.voice_qa_samples?.map((q) => q.question) ?? []),
    "Can you explain that differently?",
    "Give me another example",
    ...(concept.reasoning_interview_prompts ?? []),
  ].slice(0, 5);

  return (
    <div className="grid gap-4">
      {(concept.media?.source_image_path || concept.media?.illustration_key) && (
        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="h-24 w-40 shrink-0 overflow-hidden rounded-lg">
            {concept.media?.source_image_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={concept.media.source_image_path}
                alt={concept.media.illustration_caption ?? concept.concept_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Illustration illustrationKey={concept.media!.illustration_key!} />
            )}
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-sm text-slate-600">{concept.media?.illustration_caption}</p>
            {concept.media?.video_status === "coming_soon" && (
              <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                🎬 Video coming soon
              </span>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-practice-border bg-practice-bg">
        <div ref={scrollRef} className="flex max-h-[420px] flex-col gap-3 overflow-y-auto p-4">
          {messages.map((m) =>
            m.sender === "avatar" ? (
              <div key={m.id} className="message-enter flex items-start gap-2">
                <Avatar speaking={m.id === speakingMessageId} />
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm leading-relaxed text-slate-800 shadow-sm">
                  <HighlightedText text={m.text} range={m.id === speakingMessageId ? highlightRange : null} />
                </div>
              </div>
            ) : (
              <div key={m.id} className="message-enter flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-brand-navy px-4 py-2 text-sm leading-relaxed text-white shadow-sm">
                  {m.text}
                </div>
              </div>
            )
          )}
          {loading && (
            <div className="flex items-center gap-2">
              <Avatar speaking />
              <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm text-slate-400 shadow-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-practice-border p-4">
          {awaitingContinue ? (
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleContinueCheckpoint}
                disabled={loading}
                className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                👍 Got it, keep going
              </button>
              <button
                type="button"
                onClick={handleRepeatCheckpoint}
                disabled={loading}
                className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                🔁 Can you say that again?
              </button>
            </div>
          ) : inMicroCheck ? (
            <p className="mb-3 text-xs text-slate-400">
              Quick check - just for you, no pressure. Type whatever comes to mind.
            </p>
          ) : (
            readyForInput &&
            quickReplies.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {quickReplies.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    className="rounded-full border border-brand-navy-light bg-white px-3 py-1.5 text-xs text-brand-navy hover:bg-brand-cream disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
              disabled={!readyForInput}
              placeholder={
                !readyForInput ? "Ezy is teaching..." : inMicroCheck ? "Type your answer..." : "Type or use the mic..."
              }
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50"
            />
            {speechInputSupported && (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                disabled={!readyForInput}
                aria-pressed={listening}
                aria-label={listening ? "Stop listening" : "Start voice question"}
                className={`rounded-lg px-3 py-2 text-sm disabled:opacity-40 ${
                  listening ? "bg-red-500 text-white" : "border border-slate-300 bg-white"
                }`}
              >
                🎤
              </button>
            )}
            <button
              type="button"
              onClick={() => sendMessage(inputText)}
              disabled={!readyForInput || loading}
              className="rounded-lg bg-practice-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" checked={readAloud} onChange={(e) => setReadAloud(e.target.checked)} />
                Read aloud
              </label>
              <button
                type="button"
                onClick={() => setShowVoicePicker((prev) => !prev)}
                className="text-xs font-medium text-brand-navy hover:underline"
              >
                🔊 Choose voice
              </button>
            </div>
            {speaking && (
              <span className="flex items-center gap-1 text-xs text-orange-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" /> reading...
              </span>
            )}
          </div>

          {showVoicePicker && (
            <div className="mt-2">
              <VoicePicker onClose={() => setShowVoicePicker(false)} />
            </div>
          )}

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
