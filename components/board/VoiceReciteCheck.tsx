"use client";

import { useRef, useState } from "react";

type SpeechResult = { 0: { transcript: string }; length: number };
type SpeechEvent = { results: { [index: number]: SpeechResult } };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type Verdict = "correct" | "partial" | "incorrect" | "uncertain";

function importantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}.%/+\-]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !new Set(["the", "and", "this", "that", "with", "from", "when", "what", "into", "are", "you", "your"]).has(word));
}

function localVerdict(expected: string, heard: string): { verdict: Verdict; feedback: string } {
  const expectedWords = importantWords(expected);
  const heardText = heard.toLowerCase();
  const shared = expectedWords.filter((word) => heardText.includes(word));
  const ratio = expectedWords.length ? shared.length / expectedWords.length : 0;
  const expectedNumbers = expected.match(/-?\d+(?:\.\d+)?(?:\s*\/\s*\d+)?%?/g) ?? [];
  const numbersMatch = expectedNumbers.every((number) => heardText.includes(number.replace(/\s+/g, "")) || heardText.includes(number));

  if ((expectedNumbers.length > 0 && numbersMatch && ratio >= 0.35) || ratio >= 0.62) {
    return { verdict: "correct", feedback: "Good — your explanation includes the key idea." };
  }
  if (ratio >= 0.25) {
    return { verdict: "partial", feedback: `You are close. Remember: ${expected}` };
  }
  return { verdict: "uncertain", feedback: "I heard your answer, but I need to check it more carefully." };
}

export default function VoiceReciteCheck({
  prompt,
  answer,
  unitKey,
  conceptId,
  languageCode,
  languageLabel,
  onSay,
  onComplete,
}: {
  prompt: string;
  answer: string;
  unitKey: string;
  conceptId: string;
  languageCode: string;
  languageLabel: string;
  onSay: (text: string) => void;
  onComplete?: () => void;
}) {
  const [heard, setHeard] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [passed, setPassed] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  function getRecognition(): SpeechRecognitionConstructor | undefined {
    if (typeof window === "undefined") return undefined;
    return (window as Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition
      ?? (window as Window & { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
  }

  function startListening() {
    const SpeechRecognition = getRecognition();
    if (!SpeechRecognition) {
      setFeedback("Voice input is not available in this browser. You can reveal the reference answer instead.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = languageCode;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() ?? "";
      setHeard(transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setFeedback("I could not hear that clearly. Please try once more.");
    };
    recognitionRef.current = recognition;
    setFeedback("");
    setListening(true);
    recognition.start();
  }

  async function checkAnswer() {
    if (!heard.trim() || busy) return;
    setBusy(true);
    const local = localVerdict(answer, heard);
    let result = local;
    if (local.verdict === "uncertain") {
      try {
        const response = await fetch("/api/micro-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unitKey,
            conceptId,
            question: prompt,
            expectedAnswer: answer,
            answer: heard,
            language: languageLabel,
          }),
        });
        if (response.ok) {
          const payload = (await response.json()) as { verdict?: Verdict; feedback?: string };
          if (payload.verdict && ["correct", "partial", "incorrect"].includes(payload.verdict)) {
            result = { verdict: payload.verdict, feedback: payload.feedback ?? answer };
          }
        }
      } catch {
        // A failed optional check must not trap the learner; the reference remains available.
      }
    }
    const didPass = result.verdict === "correct";
    setPassed(didPass);
    setFeedback(result.feedback);
    setBusy(false);
    onSay(result.feedback);
    if (didPass) onComplete?.();
  }

  function revealAnswer() {
    setFeedback(answer);
    onSay(answer);
    onComplete?.();
  }

  return (
    <div className="mt-2 rounded-xl border border-slate-700 bg-[#0b1220] px-3 py-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={listening ? () => { recognitionRef.current?.stop(); setListening(false); } : startListening} className="rounded-xl border-2 border-[#38bdf8] px-3 py-1.5 text-[0.78rem] font-bold text-[#7dd3fc] hover:bg-[#38bdf8]/10">
          {listening ? "⏹ Stop listening" : "🎙️ Say your answer"}
        </button>
        <button type="button" onClick={revealAnswer} className="rounded-xl border-2 border-slate-600 px-3 py-1.5 text-[0.78rem] font-bold text-slate-300 hover:border-[#f59e0b]">
          Show reference answer
        </button>
      </div>
      {heard && <p className="mt-2 text-[0.78rem] text-slate-400"><strong className="text-slate-200">I heard:</strong> {heard}</p>}
      {heard && !passed && <button type="button" disabled={busy} onClick={checkAnswer} className="mt-2 rounded-xl bg-[#ec4899] px-3 py-1.5 text-[0.78rem] font-bold text-white disabled:opacity-50">{busy ? "Checking…" : "Check my answer"}</button>}
      {feedback && <p className={`mt-2 rounded-xl px-3 py-2 text-[0.78rem] leading-snug ${passed ? "bg-[#34d399]/10 text-[#a7f3d0]" : "bg-[#f59e0b]/10 text-[#fde68a]"}`}>{feedback}</p>}
    </div>
  );
}
