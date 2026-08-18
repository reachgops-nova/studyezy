"use client";

import { useEffect, useState } from "react";

const SAMPLE_TEXT = "Hi! Let's learn about today's story together. Does that sound clear so far?";
const VOICE_KEY = "studyezy_voice_name";
const RATE_KEY = "studyezy_speech_rate";
const DEFAULT_RATE = 0.7;

export function getSavedVoiceName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(VOICE_KEY);
}

export function getSavedRate(): number {
  if (typeof window === "undefined") return DEFAULT_RATE;
  const raw = localStorage.getItem(RATE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : DEFAULT_RATE;
}

export default function VoicePicker({ onClose }: { onClose: () => void }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState<string | null>(getSavedVoiceName());
  const [rate, setRate] = useState(getSavedRate());
  const [previewing, setPreviewing] = useState<string | null>(null);

  useEffect(() => {
    function load() {
      const all = window.speechSynthesis
        .getVoices()
        .filter((v) => v.lang?.toLowerCase().startsWith("en"));
      all.sort((a, b) => {
        const aGb = a.lang.toLowerCase() === "en-gb" ? 0 : 1;
        const bGb = b.lang.toLowerCase() === "en-gb" ? 0 : 1;
        if (aGb !== bGb) return aGb - bGb;
        return a.name.localeCompare(b.name);
      });
      setVoices(all);
    }
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  function preview(voice: SpeechSynthesisVoice) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(SAMPLE_TEXT);
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.onstart = () => setPreviewing(voice.name);
    utterance.onend = () => setPreviewing(null);
    utterance.onerror = () => setPreviewing(null);
    window.speechSynthesis.speak(utterance);
  }

  function choose(voice: SpeechSynthesisVoice) {
    setSelected(voice.name);
    localStorage.setItem(VOICE_KEY, voice.name);
  }

  function updateRate(next: number) {
    setRate(next);
    localStorage.setItem(RATE_KEY, String(next));
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Choose Ezy&apos;s voice</h3>
        <button type="button" onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600">
          Close
        </button>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        These come from this device&apos;s own voices, not two devices sound the same - tap{" "}
        <span aria-hidden>▶</span> to preview, then pick whichever sounds best here.
      </p>

      <label className="mt-3 grid gap-1 text-xs text-slate-600">
        Speed: {rate.toFixed(2)}x
        <input
          type="range"
          min={0.6}
          max={1.1}
          step={0.05}
          value={rate}
          onChange={(e) => updateRate(Number(e.target.value))}
        />
      </label>

      {voices.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">
          No voices found on this device/browser yet - give it a second and reopen this panel.
        </p>
      ) : (
        <ul className="mt-3 grid max-h-64 gap-1 overflow-y-auto">
          {voices.map((v) => (
            <li
              key={v.name}
              className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-50"
            >
              <button
                type="button"
                onClick={() => preview(v)}
                className="flex flex-1 items-center gap-2 text-left text-sm text-slate-700"
              >
                <span
                  aria-hidden
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                    previewing === v.name ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  ▶
                </span>
                <span className="truncate">
                  {v.name} <span className="text-xs text-slate-400">({v.lang})</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => choose(v)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  selected === v.name
                    ? "bg-brand-navy text-white"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {selected === v.name ? "Selected" : "Use this"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
