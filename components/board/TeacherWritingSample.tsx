"use client";

import { useState } from "react";

type Scene = "teach" | "mistake" | "fix" | "next";

export default function TeacherWritingSample() {
  const [scene, setScene] = useState<Scene>("teach");
  const voiceText = scene === "teach" ? "Watch how I share twenty eight stars into four equal groups." : scene === "mistake" ? "Tell me what you wrote and we will check it together." : scene === "fix" ? "Your exact question is rebuilt step by step." : "Work backwards, then check by multiplying.";

  function readBoard() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(voiceText);
    voice.rate = 0.65;
    window.speechSynthesis.speak(voice);
  }

  return (
    <main className="min-h-screen bg-[#24262c] p-2 text-slate-900 sm:p-5">
      <section className="mx-auto max-w-[1500px] overflow-hidden rounded-xl border-[10px] border-[#343943] bg-[#f8fbf9] shadow-2xl">
        <header className="flex items-center justify-between border-b-2 border-slate-300 bg-white px-4 py-3 sm:px-8">
          <div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-indigo-700">StudyEzy · Unit 15.1 · live board</p><h1 className="hand text-2xl text-slate-800 sm:text-4xl">Let us find the missing number.</h1></div>
          <div className="flex gap-1 rounded-full bg-slate-100 p-1">{(["teach", "mistake", "fix", "next"] as Scene[]).map((item) => <button key={item} type="button" onClick={() => setScene(item)} className={`rounded-full px-3 py-2 text-xs font-black uppercase ${scene === item ? "bg-indigo-700 text-white" : "text-slate-500"}`}>{item}</button>)}</div>
        </header>
        <div className="relative min-h-[760px] overflow-hidden px-4 py-5 sm:px-12 sm:py-8" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 43px, rgba(63,135,163,.19) 44px), linear-gradient(90deg, rgba(238,87,164,.16) 0, rgba(238,87,164,.16) 2px, transparent 2px)" }}>
          <div className="absolute left-6 top-5 h-10 w-10 rounded-full border-2 border-slate-400 bg-[#fffce8] shadow-[3px_3px_0_#9ca3af]" /><div className="absolute right-8 top-5 h-8 w-8 rounded-full border-2 border-slate-400 bg-[#fffce8] shadow-[3px_3px_0_#9ca3af]" />
          <div className="mx-auto max-w-6xl"><p className="hand text-center text-2xl text-pink-600 sm:text-3xl">{scene === "teach" ? "Teacher shows the idea" : scene === "mistake" ? "Your turn — show me your thinking" : scene === "fix" ? "Let us repair your exact mistake" : "Now try one by yourself"}</p>{scene === "teach" && <TeachScene />}{scene === "mistake" && <MistakeScene />}{scene === "fix" && <FixScene />}{scene === "next" && <NextScene />}</div>
          <div className="absolute bottom-5 left-1/2 flex w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border-2 border-slate-400 bg-white/90 px-4 py-3 shadow-lg backdrop-blur"><div className="flex items-center gap-3"><span className="text-3xl">🧑🏽‍🏫</span><p className="hand text-lg text-slate-700">{voiceText}</p></div><button type="button" onClick={readBoard} className="rounded-xl bg-indigo-700 px-4 py-3 text-sm font-black text-white">🔊 Teacher voice</button></div>
        </div>
      </section>
      <style jsx>{styles}</style>
    </main>
  );
}

function TeachScene() { return <div className="mt-8"><svg viewBox="0 0 1100 600" className="w-full" aria-label="Teacher shares 28 stars into four equal groups"><text x="20" y="48" className="hand-fill pink-text">28 stars</text><g>{Array.from({ length: 28 }, (_, i) => <text key={i} x={35 + (i % 14) * 42} y={95 + Math.floor(i / 14) * 45} className="star-text">★</text>)}</g><path d="M540 75 C610 100 650 110 700 145" className="board-line pink-line" /><text x="600" y="80" className="hand-fill pink-text small">Share equally</text><g className="box-line">{[0, 1, 2, 3].map((box) => <g key={box}><rect x={40 + box * 260} y="225" width="220" height="190" rx="18" /><text x={95 + box * 260} y="260" className="box-label">BOX {box + 1}</text>{Array.from({ length: 7 }, (_, star) => <text key={star} x={72 + box * 260 + (star % 4) * 40} y={315 + Math.floor(star / 4) * 44} className="star-text">★</text>)}</g>)}</g><path d="M270 475 C390 525 710 525 830 475" className="board-line green-line" /><text x="365" y="565" className="hand-fill green-text equation">7 × 4 = 28 ✓</text><text x="845" y="455" className="hand-fill green-text small">7 in every box</text></svg></div>; }

function MistakeScene() { return <div className="mt-14"><svg viewBox="0 0 1100 500" className="w-full" aria-label="Student writes a wrong answer"><text x="80" y="95" className="hand-fill purple-text equation">? × 5 = 35</text><path d="M170 145 C280 175 400 175 500 145" className="board-line purple-line" /><text x="95" y="275" className="hand-fill slate-text small">Student writes:</text><text x="110" y="390" className="hand-fill purple-text huge">6</text><text x="220" y="385" className="hand-fill red-text huge">✕</text><text x="370" y="345" className="hand-fill red-text mistake">This answer does not make 35.</text><path d="M370 370 C500 430 680 420 770 350" className="board-line red-line" /><text x="715" y="260" className="hand-fill slate-text small">Stop here.</text><text x="715" y="300" className="hand-fill slate-text small">Do not jump to</text><text x="715" y="335" className="hand-fill slate-text small">a new topic yet.</text></svg></div>; }

function FixScene() { return <div className="mt-10"><svg viewBox="0 0 1100 580" className="w-full" aria-label="Teacher corrects the exact student mistake"><text x="25" y="70" className="hand-fill purple-text equation">? × 5 = 35</text><text x="475" y="70" className="hand-fill red-text mistake">student wrote 6</text><path d="M330 85 C410 130 430 190 340 240" className="board-line pink-line" /><text x="50" y="210" className="hand-fill pink-text small">Use the inverse</text><text x="60" y="315" className="hand-fill pink-text equation">35 ÷ 5 = 7</text><path d="M390 320 C480 370 590 370 680 315" className="board-line green-line" /><text x="700" y="270" className="hand-fill green-text small">Now check</text><text x="650" y="370" className="hand-fill green-text equation">7 × 5 = 35 ✓</text><path d="M700 400 C810 470 900 450 980 375" className="board-line green-line" /><text x="705" y="500" className="hand-fill slate-text small">Same question. Same numbers. Clear method.</text></svg></div>; }

function NextScene() { return <div className="mt-14"><svg viewBox="0 0 1100 500" className="w-full" aria-label="Fresh practice question"><text x="75" y="110" className="hand-fill purple-text equation">? × 3 = 24</text><text x="80" y="190" className="hand-fill slate-text small">Your working:</text><path d="M80 275 L1000 275" className="dashed-line" /><path d="M80 375 L1000 375" className="dashed-line" /><text x="110" y="455" className="hand-fill pink-text small">Work backwards → then check by multiplying</text></svg></div>; }

const styles = `.hand{font-family:'Comic Sans MS','Bradley Hand',cursive;font-weight:700}.hand-fill{font-family:'Comic Sans MS','Bradley Hand',cursive;font-weight:700}.pink-text{fill:#e44aa9}.purple-text{fill:#35217d}.green-text{fill:#148c68}.slate-text{fill:#475569}.red-text{fill:#dc2626}.equation{font-size:64px}.huge{font-size:110px}.small{font-size:30px}.mistake{font-size:28px}.box-line{fill:none;stroke:#35217d;stroke-width:6}.box-label{font-family:'Comic Sans MS','Bradley Hand',cursive;font-size:21px;font-weight:700;fill:#35217d}.star-text{font-family:Georgia,serif;font-size:29px;fill:#f5b719;stroke:#d97706;stroke-width:1px}.board-line{stroke:#3730a3;stroke-width:6;fill:none;stroke-linecap:round;stroke-linejoin:round}.pink-line{stroke:#e44aa9}.green-line{stroke:#148c68}.red-line{stroke:#dc2626}.purple-line{stroke:#35217d}.dashed-line{stroke:#94a3b8;stroke-width:3;stroke-dasharray:14 12;fill:none}`;
