"use client";

import { useEffect, useRef, useState } from "react";

// Minimal ambient types for the (non-standard, Chrome/Safari-prefixed) Web Speech API.
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

export default function VoiceQA({
  unitKey,
  conceptId,
  conceptName,
}: {
  unitKey: string;
  conceptId: string;
  conceptName: string;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    // Feature detection needs `window`, which doesn't exist during SSR, so
    // this can only run post-mount rather than during the initial render.
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpeechSupported(Boolean(SpeechRecognitionCtor));
  }, []);

  function startListening() {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition: SpeechRecognitionLike = new SpeechRecognitionCtor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
    };
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

  async function ask(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey, conceptId, question: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Try again in a moment.");
      }

      const data = (await res.json()) as { answer: string };
      setAnswer(data.answer);

      if (speakReplies && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(data.answer);
        utterance.lang = "en-IN";
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-practice-border bg-practice-bg p-4">
      <p className="mb-3 text-sm font-medium text-slate-700">
        Ask me anything about &ldquo;{conceptName}&rdquo;
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(question)}
          placeholder="Type or use the mic..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        {speechSupported && (
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            aria-pressed={listening}
            aria-label={listening ? "Stop listening" : "Start voice question"}
            className={`rounded-lg px-3 py-2 text-sm ${
              listening ? "bg-red-500 text-white" : "bg-white border border-slate-300"
            }`}
          >
            🎤
          </button>
        )}
        <button
          type="button"
          onClick={() => ask(question)}
          disabled={loading}
          className="rounded-lg bg-practice-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Ask
        </button>
      </div>

      <label className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <input
          type="checkbox"
          checked={speakReplies}
          onChange={(e) => setSpeakReplies(e.target.checked)}
        />
        Read answers aloud
      </label>

      {loading && <p className="mt-3 text-sm text-slate-500">Thinking...</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {answer && (
        <p className="mt-3 rounded-lg bg-white p-3 text-sm leading-relaxed text-slate-800">{answer}</p>
      )}
    </div>
  );
}
