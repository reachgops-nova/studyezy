"use client";

import { useEffect, useRef, useState } from "react";
import type { Concept } from "@/lib/types";
import Avatar from "./Avatar";
import { Illustration } from "./illustrations";

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

function buildTeachingScript(concept: Concept): string[] {
  const script: string[] = [];
  script.push(`Hi! Let's learn about ${concept.concept_name}.`);
  if (concept.definition) script.push(concept.definition);
  for (const point of concept.key_points ?? []) script.push(point);
  if (concept.examples?.length) {
    script.push(`Here's an example: ${concept.examples[0]}`);
  }
  if (concept.tips_to_remember?.[0]) {
    script.push(`Quick tip: ${concept.tips_to_remember[0]}`);
  }
  return script;
}

// A slower-than-default pace reads clearly for a 9-10 year old without
// dragging - 1.0 (browser default) reads too fast to follow along with.
const SPEECH_RATE = 0.7;
const SPEECH_LANG = "en-GB";

let cachedVoices: SpeechSynthesisVoice[] = [];

function pickVoice(): SpeechSynthesisVoice | null {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  const pool = cachedVoices.length ? cachedVoices : voices;

  // Prefer an explicit British English voice; most platforms ship at least
  // one (e.g. "Google UK English Female", "Daniel", "Kate", "Serena").
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
  const [speaking, setSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [highlightRange, setHighlightRange] = useState<[number, number] | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speechInputSupported, setSpeechInputSupported] = useState(false);
  const [readAloud, setReadAloud] = useState(true);

  const playTokenRef = useRef(0);
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
    utterance.rate = SPEECH_RATE;
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
    setSpeaking(false);
    setSpeakingMessageId(null);
    setHighlightRange(null);
    /* eslint-enable react-hooks/set-state-in-effect */
    window.speechSynthesis?.cancel();

    const script = buildTeachingScript(concept);
    let cancelled = false;

    function playStep(index: number) {
      if (cancelled || playTokenRef.current !== myToken) return;
      if (index >= script.length) {
        const checkIn =
          concept.voice_qa_samples?.[0]?.question ??
          "Want to try answering a quick question, or ask me anything about this?";
        setMessages((prev) => [...prev, { id: nextId(), sender: "avatar", text: checkIn }]);
        setReadyForInput(true);
        return;
      }
      const id = nextId();
      setMessages((prev) => [...prev, { id, sender: "avatar", text: script[index] }]);
      speakText(script[index], id, () => {
        if (cancelled || playTokenRef.current !== myToken) return;
        playStep(index + 1);
      });
    }

    playStep(0);

    return () => {
      cancelled = true;
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept.concept_id, readAloud]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { id: nextId(), sender: "kid", text: trimmed }]);
    setInputText("");
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
      {concept.media?.illustration_key && (
        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="h-24 w-40 shrink-0 overflow-hidden rounded-lg">
            <Illustration illustrationKey={concept.media.illustration_key} />
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-sm text-slate-600">{concept.media.illustration_caption}</p>
            {concept.media.video_status === "coming_soon" && (
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
                <div className="rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2 text-sm leading-relaxed text-white shadow-sm">
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
          {readyForInput && quickReplies.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="rounded-full border border-blue-300 bg-white px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
              disabled={!readyForInput}
              placeholder={readyForInput ? "Type or use the mic..." : "Ezy is teaching..."}
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
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input type="checkbox" checked={readAloud} onChange={(e) => setReadAloud(e.target.checked)} />
              Read aloud
            </label>
            {speaking && (
              <span className="flex items-center gap-1 text-xs text-blue-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" /> reading...
              </span>
            )}
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
