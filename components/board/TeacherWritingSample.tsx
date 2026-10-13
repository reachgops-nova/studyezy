"use client";

import { useEffect, useRef, useState } from "react";

const lesson = [
  { title: "First, look at the problem.", voice: "We have twenty eight stars and four empty boxes. We need to share the stars equally." },
  { title: "Share the stars equally.", voice: "Watch carefully. We put seven stars in each box. Every box gets the same amount." },
  { title: "Write the inverse operation.", voice: "Four equal groups share twenty eight stars. Division helps us find one group: twenty eight divided by four equals seven." },
  { title: "Turn it into the missing-number question.", voice: "The star is the missing number. So we write question mark times four equals twenty eight." },
  { title: "Check the answer.", voice: "Seven times four equals twenty eight. The missing number is seven." },
];

export default function TeacherWritingSample() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [voice, setVoice] = useState(true);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { window.speechSynthesis?.cancel(); if (timer.current) window.clearTimeout(timer.current); }, []);

  function advance(index: number) {
    if (index >= lesson.length - 1) { setPlaying(false); return; }
    timer.current = window.setTimeout(() => { const next = index + 1; setStep(next); if (voice) speak(next); else advance(next); }, voice ? 450 : 3000);
  }

  function speak(index: number) {
    if (!voice || typeof window === "undefined" || !window.speechSynthesis) { advance(index); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lesson[index].voice);
    utterance.rate = 0.62;
    utterance.pitch = 1.02;
    utterance.onend = () => advance(index);
    utterance.onerror = () => advance(index);
    window.speechSynthesis.speak(utterance);
  }

  function start() {
    if (timer.current) window.clearTimeout(timer.current);
    window.speechSynthesis?.cancel();
    setStep(0); setPlaying(true);
    if (voice) window.setTimeout(() => speak(0), 250);
    else window.setTimeout(() => advance(0), 3000);
  }

  function chooseStep(index: number) {
    if (timer.current) window.clearTimeout(timer.current);
    window.speechSynthesis?.cancel();
    setStep(index); setPlaying(false);
  }

  const handPosition = ["left-[15%] top-[22%]", "right-[13%] top-[45%]", "left-[43%] bottom-[20%]", "right-[22%] bottom-[16%]", "left-[55%] bottom-[12%]"][step];

  return <main className="min-h-screen bg-[#20242a] p-4 text-slate-900 sm:p-8"><section className="mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border-4 border-slate-700 bg-[#f8fbf8] shadow-2xl"><header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-300 bg-white px-6 py-5 sm:px-10"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-700">StudyEzy · Unit 15.1</p><h1 className="mt-1 text-3xl font-black sm:text-5xl">Teacher whiteboard sample</h1><p className="mt-2 text-slate-600">The pen draws the idea as the teacher explains it.</p></div><span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-black text-pink-800">Handwritten lesson mode</span></header><div className="grid lg:grid-cols-[1.25fr_0.75fr]"><div className="relative min-h-[650px] overflow-hidden p-5 sm:p-10" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 39px, rgba(83,145,173,.2) 40px), linear-gradient(90deg, rgba(244,113,181,.14) 0, rgba(244,113,181,.14) 2px, transparent 2px)" }}><div className="relative mx-auto h-full max-w-3xl rounded-xl border border-slate-300/60 bg-white/35 p-5 shadow-inner sm:p-8"><div className="flex items-center justify-between font-mono text-xs font-black uppercase tracking-widest text-indigo-700"><span>Mr Ezy’s board</span><span>{step + 1} / {lesson.length}</span></div><div className="mt-8 text-center font-hand text-2xl font-black text-pink-600 sm:text-3xl">{lesson[step].title}</div><svg viewBox="0 0 900 510" className="mt-5 h-auto w-full overflow-visible" role="img" aria-label={lesson[step].title}>{step >= 0 && <text x="50" y="70" className="hand-text pink">28 stars</text>}{step >= 1 && <g className="ink-draw purple"><rect x="55" y="120" width="170" height="170" rx="12" /><rect x="260" y="120" width="170" height="170" rx="12" /><rect x="465" y="120" width="170" height="170" rx="12" /><rect x="670" y="120" width="170" height="170" rx="12" /></g>}{step >= 1 && <g className="star-pop">{Array.from({ length: 28 }, (_, index) => { const box = Math.floor(index / 7); const inside = index % 7; return <text key={index} x={83 + box * 205 + (inside % 4) * 38} y={170 + Math.floor(inside / 4) * 48} className="star">★</text>; })}</g>}{step >= 2 && <g className="ink-draw blue"><text x="170" y="370" className="hand-text">28 ÷ 4 = 7</text><path d="M205 390 C280 420 390 420 500 390" /></g>}{step >= 3 && <g className="ink-draw pink"><text x="190" y="460" className="hand-text">? × 4 = 28</text></g>}{step >= 4 && <g className="ink-draw green"><text x="560" y="460" className="hand-text">7 ✓</text></g>}<text x="430" y="515" className="small-note">equal groups</text></svg><div className={`teacher-hand absolute ${handPosition}`}>✍️</div></div></div><aside className="flex flex-col justify-center border-t-2 border-slate-200 bg-white p-6 sm:p-10 lg:border-l-2 lg:border-t-0"><p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">Synchronized explanation</p><h2 className="mt-3 text-3xl font-black">The voice waits for the drawing.</h2><p className="mt-4 leading-relaxed text-slate-600">Each sentence explains one drawing action. The next line is not written until the voice finishes.</p><div className="mt-7 space-y-2">{lesson.map((item, index) => <button key={item.title} type="button" onClick={() => chooseStep(index)} className={`w-full rounded-xl border-2 p-3 text-left transition ${index === step ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white"}`}><span className="mr-2 font-black text-indigo-700">{index + 1}.</span><span className="font-black">{item.title}</span></button>)}</div><div className="mt-7 flex gap-2"><button type="button" onClick={start} className="flex-1 rounded-xl bg-[#182536] px-4 py-4 text-sm font-black text-white">{playing ? "Playing…" : "▶ Start teacher"}</button><button type="button" onClick={() => setVoice((value) => !value)} className="rounded-xl border-2 border-slate-200 px-3 text-sm font-black">{voice ? "🔊" : "🔇"}</button></div></aside></div></section><style jsx>{`@keyframes inkDraw{from{stroke-dasharray:1200;stroke-dashoffset:1200;opacity:.2}to{stroke-dashoffset:0;opacity:1}}@keyframes starPop{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}@keyframes handMove{from{opacity:0;transform:translate(-18px,12px) rotate(-25deg)}to{opacity:1;transform:translate(0) rotate(0)}}.ink-draw{animation:inkDraw 1.4s ease-out both;fill:none;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.ink-draw text{stroke:none;fill:currentColor}.purple{color:#35217d;stroke:#35217d}.blue{color:#139ed0;stroke:#139ed0}.pink{color:#e84eae;stroke:#e84eae}.green{color:#15966c;stroke:#15966c}.star-pop{animation:starPop .55s ease-out both;fill:#f6b928;stroke:#d97706;stroke-width:2}.hand-text{font-family:'Comic Sans MS','Bradley Hand',cursive;font-size:64px;font-weight:700;fill:currentColor}.pink{color:#e84eae}.small-note{font-family:'Comic Sans MS','Bradley Hand',cursive;font-size:22px;fill:#35217d}.teacher-hand{animation:handMove 1s ease-out both;font-size:2.4rem;filter:drop-shadow(2px 3px 1px rgba(0,0,0,.2))}`}</style></main>;
}
