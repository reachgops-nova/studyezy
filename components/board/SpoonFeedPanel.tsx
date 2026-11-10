"use client";

import { useEffect, useState } from "react";

type Check = { prompt: string; options: string[]; answer: number; explain: string };

const CHECKS: Check[] = [
  { prompt: "Which one is a solid?", options: ["A brick", "Water", "Air"], answer: 0, explain: "A brick keeps its own shape. That is what makes it a solid." },
  { prompt: "Look at the picture. What are we comparing?", options: ["Three states of matter", "Three kinds of weather", "Three colours"], answer: 0, explain: "The picture compares solid, liquid, and gas particles." },
  { prompt: "Why does a solid keep its shape?", options: ["Its particles are packed in a fixed pattern", "Its particles disappear", "It has no particles"], answer: 0, explain: "Solid particles are close together and can only vibrate in their fixed places." },
  { prompt: "What can a liquid do?", options: ["Flow and take the container's shape", "Fill all space like a gas", "Keep one shape like a brick"], answer: 0, explain: "Liquid particles stay close but slide past each other, so liquids flow." },
  { prompt: "Which state is easiest to compress?", options: ["Gas", "Liquid", "Solid"], answer: 0, explain: "Gas particles are far apart, leaving empty space that can be squeezed." },
  { prompt: "A balloon is full of air. What is air?", options: ["A gas", "A liquid", "A solid"], answer: 0, explain: "Air spreads to fill the balloon, so air is a gas." },
  { prompt: "Playdough is squashed and shaped, but does not flow. Which state?", options: ["Solid", "Liquid", "Gas"], answer: 0, explain: "Playdough keeps its shape when it rests, so we classify it as a solid." },
];

export default function SpoonFeedPanel({ sceneIndex, onComplete, onSpeak }: { sceneIndex: number; onComplete: () => void; onSpeak?: (text: string) => void }) {
  const check = CHECKS[Math.min(sceneIndex, CHECKS.length - 1)];
  const [chosen, setChosen] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);

  useEffect(() => { setChosen(null); setWrong(false); }, [sceneIndex]);

  function choose(index: number) {
    if (chosen !== null) return;
    setChosen(index);
    if (index === check.answer) {
      onSpeak?.(`Correct. ${check.explain}`);
      window.setTimeout(onComplete, 1700);
    } else {
      setWrong(true);
      onSpeak?.(`Let us look again. ${check.explain}`);
    }
  }

  return <div className="border-t-4 border-amber-300 bg-[#fffaf0] px-4 py-5 sm:px-8"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Teacher asks · one small step</p><p className="hand mt-1 text-xl text-slate-900 sm:text-2xl">{check.prompt}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">Answer before we continue</span></div><div className="mx-auto mt-4 grid max-w-5xl gap-2 sm:grid-cols-3">{check.options.map((option, index) => { const correct = chosen !== null && index === check.answer; const selectedWrong = chosen === index && index !== check.answer; return <button key={option} type="button" onClick={() => choose(index)} disabled={chosen !== null && !wrong} className={`rounded-xl border-2 px-4 py-3 text-left font-black transition ${correct ? "border-emerald-500 bg-emerald-100 text-emerald-900" : selectedWrong ? "border-rose-500 bg-rose-100 text-rose-900" : "border-slate-300 bg-white hover:border-amber-400"}`}>{option}{correct ? " ✓" : selectedWrong ? " ✕" : ""}</button>; })}</div>{wrong && <div className="mx-auto mt-3 max-w-5xl rounded-xl border-2 border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-900">That answer needs another look. {check.explain} Choose again.</div>}{chosen === check.answer && <div className="mx-auto mt-3 max-w-5xl rounded-xl border-2 border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-900">Yes. {check.explain} Next, we will look at the next small idea.</div>}</div>;
}
