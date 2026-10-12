"use client";

import { useEffect, useState } from "react";

type SprintQuestion = {
  conceptId: string;
  conceptTitle: string;
  equation: string;
  answer: string;
  options: string[];
  hint: string;
  coach: string;
};

const SPRINT: SprintQuestion[] = [
  { conceptId: "15.1", conceptTitle: "Missing numbers", equation: "⭐ + ⭐ + ⭐ = 21", answer: "7", options: ["6", "7", "8"], hint: "Three equal stars make 21, so divide 21 by 3.", coach: "We are working backwards. The multiplication is hidden in three equal groups, so division will undo it." },
  { conceptId: "15.1", conceptTitle: "Missing numbers", equation: "100 − 🔺 = 30", answer: "70", options: ["60", "70", "130"], hint: "The missing part is what remains when 30 is taken away from 100.", coach: "This time the missing shape is the part taken away. Subtract the result from the starting amount." },
  { conceptId: "15.1", conceptTitle: "Missing numbers", equation: "? × 4 = 28", answer: "7", options: ["6", "7", "24"], hint: "Multiplication is undone by division: 28 ÷ 4.", coach: "Multiplication and division are inverse partners. Use division to discover the unknown factor." },
  { conceptId: "15.2", conceptTitle: "Order of operations", equation: "4 + 6 × 3", answer: "22", options: ["22", "30", "18"], hint: "Multiplication comes before addition: 6 × 3 = 18, then add 4.", coach: "Now we are deciding which operation gets the first turn. Multiplication and division go before addition and subtraction." },
  { conceptId: "15.3", conceptTitle: "Written multiplication", equation: "273 × 28", answer: "7,644", options: ["7,644", "6,552", "7,284"], hint: "Split 28 into 8 and 20: 273 × 8 plus 273 × 20.", coach: "Written methods make each place value visible. Split the two-digit factor into its ones and tens parts." },
  { conceptId: "15.4", conceptTitle: "Decimal addition", equation: "1.35 + 1.24", answer: "2.59", options: ["2.49", "2.59", "2.69"], hint: "Line up the decimal points, then add ones, tenths, and hundredths.", coach: "Decimals behave like a place-value grid. Tenths must meet tenths and hundredths must meet hundredths." },
  { conceptId: "15.4", conceptTitle: "Decimal subtraction", equation: "6.48 − 3.25", answer: "3.23", options: ["3.13", "3.23", "3.33"], hint: "Keep the decimal points aligned and subtract each place value column.", coach: "Keep the columns lined up. We subtract hundredths, then tenths, then ones." },
  { conceptId: "15.5", conceptTitle: "Multiplying decimals", equation: "0.6 × 4", answer: "2.4", options: ["0.24", "2.4", "24"], hint: "Six tenths multiplied by four makes 24 tenths, which regroup as 2.4.", coach: "Use the whole-number fact 6 × 4 = 24, then put the tenths back into the answer." },
];

export default function Unit15MissionPanel({
  onEnterBoard,
  onNarrate,
  embedded = false,
}: {
  onEnterBoard: () => void;
  onNarrate?: (text: string) => void;
  embedded?: boolean;
}) {
  const [mode, setMode] = useState<"mission" | "sprint" | "done">("mission");
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const question = SPRINT[step];

  useEffect(() => {
    onNarrate?.("Hi, I am Ezy. In this Unit 15 mission, we are going to become missing-number detectives. First I will show you what we are looking for, then you will try a clue, and I will help you understand every answer. You do not need to guess fast - think, talk, and try.");
  }, [onNarrate]);

  useEffect(() => {
    if (mode === "sprint") {
      const previous = SPRINT[step - 1];
      const opening = !previous || previous.conceptId !== question.conceptId
        ? `We are moving into ${question.conceptTitle}. ${question.coach}`
        : `Clue ${step + 1}. ${question.coach}`;
      onNarrate?.(`${opening} Look carefully at ${question.equation}. Take your time and tell me what you notice.`);
    }
    if (mode === "done") onNarrate?.(`Fantastic work. You completed all five Unit 15 calculation missions and earned ${stars} stars. Now we can continue to the deeper learning board.`);
  }, [mode, onNarrate, question.equation, stars, step]);

  function answer(value: string) {
    if (selected) return;
    setSelected(value);
    if (value === question.answer) {
      onNarrate?.(`Yes, ${value} is correct. ${question.coach} Let us try the next clue.`);
      setStars((current) => current + 1);
      window.setTimeout(() => {
        if (step === SPRINT.length - 1) setMode("done");
        else {
          setStep((current) => current + 1);
          setSelected(null);
          setShowHint(false);
        }
      }, 650);
    } else {
      onNarrate?.(`That answer is not quite right. Let us slow down and use the hint together.`);
      setShowHint(true);
    }
  }

  return (
    <div className={embedded ? "flex min-h-0 w-full items-start justify-center overflow-y-auto p-1 sm:p-3" : "fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#08111b]/80 p-4 backdrop-blur-sm"}>
      <section className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#101c2b] text-white shadow-2xl">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#19334b] via-[#13283c] to-[#101c2b] p-7 sm:p-10">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-300/10 blur-2xl" />
            <div className="relative">
              <div className="mb-8 flex items-center justify-between">
                <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.18em] text-cyan-100">Unit 15 mission</span>
                <span className="text-xl" aria-label={`${stars} stars`}>{"⭐".repeat(Math.max(stars, 1))}</span>
              </div>
              <p className="mb-2 text-sm font-bold text-cyan-200">Calculation crew · IGCSE / Cambridge</p>
              <h1 className="max-w-lg text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl">Train your calculation brain.</h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">We will work through five Unit 15 missions together. Ezy will explain the idea, ask you to think, and help you recover from mistakes.</p>
              <div className="mt-9 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <div className="mb-4 flex items-center justify-between text-xs font-bold text-slate-300"><span>Mission preview</span><span>5 concepts · guided practice</span></div>
                <div className="flex items-center justify-center gap-2 sm:gap-4"><div className="rounded-2xl border border-cyan-200/30 bg-cyan-200/10 px-4 py-3 text-center text-2xl font-black">⭐</div><div className="text-2xl font-black text-cyan-200">× 3</div><div className="text-2xl font-black text-slate-400">=</div><div className="rounded-2xl border border-amber-200/30 bg-amber-200/10 px-4 py-3 text-center text-2xl font-black text-amber-100">21</div><div className="text-2xl font-black text-slate-400">→</div><div className="rounded-2xl border border-emerald-200/30 bg-emerald-200/10 px-4 py-3 text-center text-2xl font-black text-emerald-100">7</div></div>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-cyan-100"><span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" /> inverse · order · written methods · decimals</div>
              </div>
              <button type="button" onClick={() => onNarrate?.("Here is our plan. First we will look at the clue together. Then you will choose an answer. If it is wrong, I will explain the next step. Ready? Start when you are ready.")} className="mt-5 w-full rounded-2xl border border-cyan-200/30 bg-cyan-100/10 px-5 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-100/20">🔊 Hear Ezy explain the plan</button>
              <button type="button" onClick={() => setMode("sprint")} className="mt-3 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#092035] shadow-lg shadow-cyan-950/40 transition hover:-translate-y-0.5 hover:bg-cyan-200">Start Unit 15 training →</button>
              <button type="button" onClick={onEnterBoard} className="mt-3 w-full rounded-2xl border border-white/15 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10">Go straight to the learning board</button>
            </div>
          </div>
          <div className="bg-[#f4f7f8] p-6 text-[#10202d] sm:p-9">
            {mode === "mission" && <div className="flex h-full flex-col justify-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Your toolkit</p><h2 className="mt-2 text-2xl font-black">Five missions, one growing skill</h2><div className="mt-6 space-y-3">{[["🔁", "Work backwards", "Find missing numbers with inverse operations."], ["🧭", "Choose the right turn", "Put operations in the correct order."], ["🧱", "Show every place", "Build written multiplication and division step by step."], ["🔟", "Line up the grid", "Keep decimal places aligned before calculating."], ["🏆", "Train and remember", "Use hints, retries, and spoken explanations until it makes sense."]].map(([icon, title, copy]) => <div key={title} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-2xl">{icon}</span><div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{copy}</p></div></div>)}</div></div>}
            {mode === "sprint" && <div className="flex h-full flex-col justify-center"><div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-slate-500"><span>{question.conceptId} · {question.conceptTitle}</span><span>Clue {step + 1} of {SPRINT.length}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${(step / SPRINT.length) * 100}%` }} /></div><div className="mt-7 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold leading-relaxed text-cyan-950"><span className="mr-1">🧑‍🏫</span>{question.coach}</div><p className="mt-5 text-center text-sm font-bold text-cyan-700">Which answer fits? Think aloud if you can.</p><div className="my-5 rounded-3xl border-2 border-slate-200 bg-white px-5 py-8 text-center text-4xl font-black shadow-sm sm:text-5xl">{question.equation}</div><div className="grid grid-cols-3 gap-3">{question.options.map((option) => { const isSelected = selected === option; const isCorrect = isSelected && option === question.answer; return <button key={option} type="button" onClick={() => answer(option)} className={`rounded-2xl border-2 px-3 py-4 text-xl font-black transition ${isSelected ? (isCorrect ? "border-emerald-500 bg-emerald-100 text-emerald-800" : "border-rose-400 bg-rose-100 text-rose-800") : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-cyan-400"}`}>{option}</button>; })}</div>{showHint && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-relaxed text-amber-900">💡 {question.hint} <button type="button" className="ml-1 underline" onClick={() => { setSelected(null); onNarrate?.(question.hint); }}>Try again</button></div>}</div>}
            {mode === "done" && <div className="flex h-full flex-col items-center justify-center text-center"><div className="text-6xl">🎉</div><p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Unit 15 training complete</p><h2 className="mt-2 text-3xl font-black">You worked through all five calculation missions.</h2><p className="mt-3 max-w-sm text-slate-600">You used inverse operations, order of operations, written methods, and decimal place value. You earned {stars} stars.</p><button type="button" onClick={onEnterBoard} className="mt-7 rounded-2xl bg-[#10202d] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#1d3548]">Continue to deeper Unit 15 board →</button></div>}
          </div>
        </div>
      </section>
    </div>
  );
}
