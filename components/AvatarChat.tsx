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
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

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
    /* eslint-enable react-hooks/set-state-in-effect */
    window.speechSynthesis?.cancel();

    const script = buildTeachingScript(concept);
    let cancelled = false;

    function speak(text: string, onDone: () => void) {
      if (readAloud && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-IN";
        utterance.onend = onDone;
        utterance.onerror = onDone;
        setSpeaking(true);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(onDone, 1100);
      }
    }

    function playStep(index: number) {
      if (cancelled || playTokenRef.current !== myToken) return;
      if (index >= script.length) {
        setSpeaking(false);
        const checkIn =
          concept.voice_qa_samples?.[0]?.question ??
          "Want to try answering a quick question, or ask me anything about this?";
        setMessages((prev) => [...prev, { id: nextId(), sender: "avatar", text: checkIn }]);
        setReadyForInput(true);
        return;
      }
      setMessages((prev) => [...prev, { id: nextId(), sender: "avatar", text: script[index] }]);
      speak(script[index], () => {
        if (cancelled || playTokenRef.current !== myToken) return;
        setSpeaking(false);
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
      setMessages((prev) => [...prev, { id: nextId(), sender: "avatar", text: data.answer }]);

      if (readAloud && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(data.answer);
        utterance.lang = "en-IN";
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
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
              <div key={m.id} className="flex items-start gap-2">
                <Avatar speaking={false} />
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm leading-relaxed text-slate-800 shadow-sm">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2 text-sm leading-relaxed text-white shadow-sm">
                  {m.text}
                </div>
              </div>
            )
          )}
          {(loading || speaking) && (
            <div className="flex items-center gap-2">
              <Avatar speaking />
              <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm text-slate-400 shadow-sm">
                {loading ? "Thinking..." : "..."}
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

          <label className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <input type="checkbox" checked={readAloud} onChange={(e) => setReadAloud(e.target.checked)} />
            Read aloud
          </label>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
