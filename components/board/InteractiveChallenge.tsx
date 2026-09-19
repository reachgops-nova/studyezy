"use client";

import { useState, type ReactNode } from "react";
import type { BoardTask } from "@/lib/boardUnits/types";

type ConceptLike = { title: string; summary: string; icon: string };

export default function InteractiveChallenge({
  concept,
  task,
  unitTitle,
  onSay,
}: {
  concept?: ConceptLike;
  task?: BoardTask;
  unitTitle: string;
  onSay: (text: string) => void;
}) {
  if (!concept) return null;
  const title = `${concept.title} ${concept.summary} ${unitTitle}`.toLowerCase();
  if (/time|clock|hour|minute|timezone|time zone/.test(title)) {
    return <ClockChallenge onSay={onSay} />;
  }
  if (/acid|base|salt|pipette|volume|millilitre|milliliter|litre|liter|solution/.test(title)) {
    return <VolumeChallenge onSay={onSay} />;
  }
  if (/english|word|vocabulary|meaning|synonym|prefix|suffix|idiom|rhyme|spelling|register/.test(title)) {
    return <WordChallenge onSay={onSay} />;
  }
  return task ? <ChoiceChallenge task={task} onSay={onSay} /> : null;
}

function Shell({ children, prompt }: { children: ReactNode; prompt: string }) {
  return (
    <section className="mx-auto w-full max-w-4xl rounded-2xl border-2 border-[#ec4899]/60 bg-[#190d2e]/95 p-3 shadow-lg shadow-fuchsia-950/30">
      <p className="mb-2 text-[0.72rem] font-extrabold uppercase tracking-wider text-fuchsia-200">🎮 Do it yourself</p>
      <p className="mb-3 text-sm font-bold text-white">{prompt}</p>
      {children}
    </section>
  );
}

function ClockChallenge({ onSay }: { onSay: (text: string) => void }) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [result, setResult] = useState("");
  const targetHour = 4;
  const targetMinute = 30;
  const hand = (value: number, length: number, divisor: number) => {
    const angle = (value / divisor) * Math.PI * 2 - Math.PI / 2;
    return { x: 100 + Math.cos(angle) * length, y: 100 + Math.sin(angle) * length };
  };
  function check() {
    const correct = hour === targetHour && minute === targetMinute;
    const text = correct ? "Correct. The clock shows four thirty." : `Not yet. You set ${hour}:${String(minute).padStart(2, "0")}. Look for four thirty.`;
    setResult(text);
    onSay(text);
  }
  return (
    <Shell prompt="Set the clock to 4:30, then test your result. Watch how the hour hand sits between the numbers.">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 200 200" className="h-32 w-32 rounded-full bg-[#0b1329] ring-4 ring-cyan-400/60" aria-label="interactive clock">
          <circle cx="100" cy="100" r="78" fill="#10233d" stroke="#f59e0b" strokeWidth="4" />
          {Array.from({ length: 12 }, (_, i) => { const p = hand(i, 62, 12); return <text key={i} x={p.x} y={p.y + 5} fill="white" fontSize="12" textAnchor="middle">{i || 12}</text>; })}
          {(() => { const p = hand((hour % 12) + minute / 60, 38, 12); return <line x1="100" y1="100" x2={p.x} y2={p.y} stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />; })()}
          {(() => { const p = hand(minute, 58, 60); return <line x1="100" y1="100" x2={p.x} y2={p.y} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />; })()}
          <circle cx="100" cy="100" r="5" fill="#ec4899" />
        </svg>
        <div className="grid grid-cols-2 gap-2 text-center">
          <button type="button" onClick={() => setHour((h) => h === 12 ? 1 : h + 1)} className="rounded-xl bg-amber-400 px-3 py-2 font-extrabold text-slate-950">Hour: {hour}</button>
          <button type="button" onClick={() => setMinute((m) => (m + 5) % 60)} className="rounded-xl bg-cyan-400 px-3 py-2 font-extrabold text-slate-950">Minutes: {String(minute).padStart(2, "0")}</button>
          <button type="button" onClick={check} className="col-span-2 rounded-xl bg-emerald-400 px-4 py-2 font-extrabold text-emerald-950">Check my clock</button>
        </div>
      </div>
      {result && <p className="mt-2 text-center text-xs font-bold text-fuchsia-100">{result}</p>}
    </Shell>
  );
}

function VolumeChallenge({ onSay }: { onSay: (text: string) => void }) {
  const [volume, setVolume] = useState(0);
  const [result, setResult] = useState("");
  function check() {
    const correct = volume === 10;
    const text = correct ? "Correct. The pipette contains 10 millilitres." : `You measured ${volume} millilitres. Adjust the meniscus to 10 millilitres.`;
    setResult(text);
    onSay(text);
  }
  return (
    <Shell prompt="Fill the virtual pipette to exactly 10 mL. Move the slider, read the scale, then check it.">
      <div className="flex flex-wrap items-center justify-center gap-5">
        <div className="relative h-32 w-12 rounded-b-full border-4 border-cyan-300 bg-cyan-400/20">
          <div className="absolute bottom-0 w-full rounded-b-full bg-cyan-400/80 transition-all" style={{ height: `${Math.max(8, volume * 5)}%` }} />
          <span className="absolute -right-14 bottom-1 text-xs font-bold text-cyan-200">{volume} mL</span>
        </div>
        <input aria-label="pipette volume" type="range" min="0" max="20" step="1" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-48 accent-cyan-400" />
        <button type="button" onClick={check} className="rounded-xl bg-emerald-400 px-4 py-2 font-extrabold text-emerald-950">Check 10 mL</button>
      </div>
      {result && <p className="mt-2 text-center text-xs font-bold text-fuchsia-100">{result}</p>}
    </Shell>
  );
}

function WordChallenge({ onSay }: { onSay: (text: string) => void }) {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [result, setResult] = useState("");
  function check() {
    const ok = word.trim().length >= 2 && meaning.trim().length >= 3;
    const text = ok ? `Good. You chose “${word.trim()}” and explained it in your own words.` : "Write a word and explain its meaning in a few words.";
    setResult(text);
    onSay(text);
  }
  return (
    <Shell prompt="Choose one word from this topic, write it in your own way, and explain what it means. Your answer becomes your vocabulary card.">
      <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
        <input value={word} onChange={(e) => setWord(e.target.value)} placeholder="Your word" className="rounded-xl border-2 border-fuchsia-300/50 bg-[#0b1329] px-3 py-2 text-sm text-white outline-none" />
        <input value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Meaning in your own words" className="rounded-xl border-2 border-fuchsia-300/50 bg-[#0b1329] px-3 py-2 text-sm text-white outline-none" />
        <button type="button" onClick={check} className="rounded-xl bg-emerald-400 px-4 py-2 font-extrabold text-emerald-950">Save & check</button>
      </div>
      {result && <p className="mt-2 text-center text-xs font-bold text-fuchsia-100">{result}</p>}
    </Shell>
  );
}

function ChoiceChallenge({ task, onSay }: { task: BoardTask; onSay: (text: string) => void }) {
  const [chosen, setChosen] = useState<number | null>(null);
  return (
    <Shell prompt={task.prompt}>
      <div className="grid gap-2 sm:grid-cols-2">
        {task.options.map((option, index) => (
          <button key={option.label} type="button" onClick={() => { setChosen(index); onSay(option.say); }} className={`rounded-xl border-2 px-3 py-2 text-left text-sm font-bold transition-colors ${chosen === index ? option.correct ? "border-emerald-400 bg-emerald-400/20 text-emerald-100" : "border-rose-400 bg-rose-400/20 text-rose-100" : "border-slate-700 bg-[#0b1329] text-slate-200 hover:border-fuchsia-300"}`}>
            {option.label}
          </button>
        ))}
      </div>
    </Shell>
  );
}
