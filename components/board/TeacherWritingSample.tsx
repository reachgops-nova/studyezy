"use client";

import { useEffect, useMemo, useState } from "react";

const steps = [
  { label: "Start with the whole amount", line: "28 stars", note: "We have 28 stars to share." },
  { label: "Count the equal groups", line: "28 ÷ 4", note: "There are 4 equal groups, so we divide by 4." },
  { label: "Find the amount in one group", line: "28 ÷ 4 = 7", note: "Each group gets 7 stars." },
  { label: "Check by multiplying", line: "7 × 4 = 28", note: "Seven in each of four groups makes 28." },
];

export default function TeacherWritingSample() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [voice, setVoice] = useState(true);
  const current = steps[step];

  const speech = useMemo(() => steps.map((item) => `${item.label}. ${item.note}`), []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step < steps.length - 1) setStep((value) => value + 1);
      else setPlaying(false);
    }, 3300);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  useEffect(() => {
    if (!voice || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speech[step]);
    utterance.rate = 0.68;
    utterance.pitch = 1.02;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [speech, step, voice]);

  function replay() {
    window.speechSynthesis?.cancel();
    setStep(0);
    setPlaying(true);
  }

  return (
    <main className="min-h-screen bg-[#08111e] p-4 text-white sm:p-8">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-[#12243a] shadow-2xl">
        <header className="border-b border-white/10 bg-gradient-to-r from-[#123a56] to-[#1b4548] px-6 py-7 sm:px-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">StudyEzy · teacher writing sample</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="text-3xl font-black sm:text-5xl">Watch the teacher build it.</h1><p className="mt-2 max-w-2xl text-slate-300">A live blackboard-style explanation for the missing-number problem.</p></div>
            <span className="rounded-full border border-amber-200/30 bg-amber-100/10 px-4 py-2 text-sm font-black text-amber-100">15.1 · about 2 minutes</span>
          </div>
        </header>
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[560px] overflow-hidden bg-[#0c1c2f] p-6 sm:p-10">
            <div className="absolute right-10 top-8 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="relative h-full rounded-3xl border-2 border-slate-500/40 bg-[#102b3a] p-6 shadow-inner sm:p-10">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-cyan-200"><span>Teacher’s board</span><span>Step {step + 1} / {steps.length}</span></div>
              <div className="mt-10 flex min-h-[270px] flex-col justify-center">
                <p className="text-center text-sm font-black uppercase tracking-[0.18em] text-amber-200">{current.label}</p>
                <div className="relative mt-8 text-center">
                  <div key={current.line} className="teacher-write text-5xl font-black tracking-wide text-white sm:text-7xl">{current.line}</div>
                  <span className="teacher-hand absolute -right-1 bottom-0 text-4xl sm:right-16">✍️</span>
                </div>
                <p className="mx-auto mt-10 max-w-xl text-center text-lg leading-relaxed text-slate-200">{current.note}</p>
              </div>
              <div className="mt-8 grid grid-cols-4 gap-2">{steps.map((item, index) => <button key={item.line} type="button" onClick={() => { setStep(index); setPlaying(false); }} className={`h-2 rounded-full transition-all ${index <= step ? "bg-cyan-300" : "bg-white/15"}`} aria-label={`Show step ${index + 1}`} />)}</div>
            </div>
          </div>
          <aside className="flex flex-col justify-center bg-[#f6f8fa] p-6 text-[#10202d] sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">What the teacher is doing</p>
            <h2 className="mt-3 text-3xl font-black">One idea at a time.</h2>
            <p className="mt-4 leading-relaxed text-slate-700">The equation is not shown all at once. The learner watches the teacher write the total, the groups, the inverse operation, and the check.</p>
            <div className="mt-6 space-y-3">{steps.map((item, index) => <div key={item.line} className={`rounded-2xl border-2 p-4 transition-all ${index === step ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-white"}`}><p className="text-sm font-black text-slate-500">{index + 1}</p><p className="mt-1 font-black">{item.label}</p></div>)}</div>
            <div className="mt-7 flex gap-2"><button type="button" onClick={replay} className="flex-1 rounded-2xl bg-[#10202d] px-4 py-4 text-sm font-black text-white">↻ Replay from start</button><button type="button" onClick={() => setVoice((value) => !value)} className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-sm font-black">{voice ? "🔊 Voice on" : "🔇 Voice off"}</button></div>
          </aside>
        </div>
      </section>
      <style jsx>{`@keyframes writeIn{from{opacity:0;clip-path:inset(0 100% 0 0);transform:translateX(-18px)}to{opacity:1;clip-path:inset(0 0 0 0);transform:translateX(0)}}@keyframes handMove{from{transform:translateX(-22px) rotate(-18deg);opacity:.2}to{transform:translateX(0) rotate(0);opacity:1}}.teacher-write{animation:writeIn 1.35s ease-out both}.teacher-hand{animation:handMove 1.35s ease-out both}`}</style>
    </main>
  );
}
