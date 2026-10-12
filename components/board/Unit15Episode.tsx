"use client";

import { useEffect, useMemo, useState } from "react";

type EpisodeStage = "welcome" | "story" | "demo" | "guided" | "coach" | "practice" | "test" | "complete";

export default function Unit15Episode({ onNarrate, onDone }: { onNarrate?: (text: string) => void; onDone: () => void }) {
  const [stage, setStage] = useState<EpisodeStage>("welcome");
  const [scene, setScene] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [listening, setListening] = useState(false);
  const [replay, setReplay] = useState(0);
  const [mistake, setMistake] = useState("");

  const task = useMemo(() => {
    if (stage === "guided" || stage === "coach") return { question: "? × 4 = 28", answer: "7", options: ["5", "6", "7"] };
    if (stage === "practice") return { question: "? × 5 = 35", answer: "7", options: ["5", "7", "8"] };
    return { question: "42 ÷ ? = 6", answer: "7", options: ["6", "7", "8"] };
  }, [stage]);

  useEffect(() => {
    if (stage === "welcome") onNarrate?.("Welcome to your first Ezy Maths episode. We are going to discover a missing number by sharing stars into equal groups.");
    if (stage === "story") onNarrate?.("Ezy has 28 stars and 4 boxes. Can we share the stars equally? Watch what happens.");
    if (stage === "demo") onNarrate?.(scene < 2 ? "First, we see 28 stars. Next, we make 4 equal groups." : scene < 5 ? `Group ${scene - 1} is receiving 7 stars.` : "Every group has 7 stars. That means the missing number is 7.");
    if (stage === "guided") onNarrate?.("Now help Ezy. What number multiplied by 4 makes 28? You can choose, type, or speak.");
    if (stage === "coach") onNarrate?.("Let us repair that exact question. 28 shared into 4 equal groups gives 7 in each group. Check it: 7 times 4 equals 28.");
    if (stage === "practice") onNarrate?.("Good. Try another example with the same idea: what number times 5 makes 35?");
    if (stage === "test") onNarrate?.("Final mini-test. What number is missing in 42 divided by the box equals 6?");
    if (stage === "complete") onNarrate?.("Episode complete. You found the missing number, checked it, and practised the idea.");
  }, [onNarrate, replay, scene, stage]);

  useEffect(() => {
    if (stage !== "demo" || scene >= 5) return;
    const timer = window.setTimeout(() => setScene((value) => value + 1), 1200);
    return () => window.clearTimeout(timer);
  }, [scene, stage, replay]);

  function startDemo() {
    setScene(0);
    setReplay((value) => value + 1);
    setStage("demo");
  }

  function check(value = answer) {
    const correct = value.trim().replace(/,/g, "") === task.answer;
    setAnswer(value);
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      if (stage === "guided") { setStage("practice"); setAnswer(""); setFeedback(null); }
      else if (stage === "practice") { setStage("test"); setAnswer(""); setFeedback(null); }
      else setStage("complete");
    } else {
      setMistake(value);
      setStage("coach");
      setAnswer("");
      setFeedback(null);
    }
  }

  function listen() {
    if (typeof window === "undefined") return;
    const Recognition = (window as Window & { SpeechRecognition?: new () => { lang: string; interimResults: boolean; maxAlternatives: number; onresult: (event: { results: { [key: number]: { 0: { transcript: string } } } }) => void; onerror: () => void; onend: () => void; start: () => void }; webkitSpeechRecognition?: new () => never }).SpeechRecognition
      ?? (window as Window & { webkitSpeechRecognition?: new () => { lang: string; interimResults: boolean; maxAlternatives: number; onresult: (event: { results: { [key: number]: { 0: { transcript: string } } } }) => void; onerror: () => void; onend: () => void; start: () => void } }).webkitSpeechRecognition;
    if (!Recognition) { onNarrate?.("Voice input is not available here. You can type the answer instead."); return; }
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => { setListening(false); check(event.results[0]?.[0]?.transcript ?? ""); };
    recognition.onerror = () => { setListening(false); onNarrate?.("I could not hear that. Try again or type the answer."); };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  const starsVisible = stage === "demo" ? Math.min(28, Math.max(0, scene * 7)) : stage === "welcome" || stage === "story" ? 0 : 28;

  return <div className="flex min-h-0 w-full items-start justify-center overflow-y-auto p-1 sm:p-3"><section className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-700 bg-[#101c2b] text-white shadow-2xl"><header className="border-b border-white/10 bg-gradient-to-r from-[#132f4b] to-[#183b45] px-6 py-6 sm:px-9"><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Ezy learning episode · Unit 15.1</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-black sm:text-5xl">The Missing Number Mission</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">A short story, an animated demonstration, guided practice, and a mini-test.</p></div><span className="rounded-full border border-amber-200/30 bg-amber-100/10 px-4 py-2 text-sm font-black text-amber-100">Episode 1 · 10 minutes</span></div></header><div className="grid lg:grid-cols-[1.1fr_0.9fr]"><div className="relative min-h-[540px] overflow-hidden bg-gradient-to-b from-[#1d5270] via-[#163b59] to-[#10263c] p-6 sm:p-10"><div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-300/15 blur-2xl" /><div className="relative flex h-full flex-col justify-between"><div>{stage === "welcome" && <><div className="text-7xl motion-safe:animate-bounce">🧑‍🏫</div><p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-cyan-200">Today’s mission</p><h2 className="mt-2 text-4xl font-black">Can we rescue the missing number?</h2><p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-200">Ezy has 28 stars. We need to share them equally into 4 boxes. You will watch first, then help, then solve a new one.</p></>}{stage === "story" && <><div className="text-7xl motion-safe:animate-bounce">⭐</div><h2 className="mt-5 text-4xl font-black">Ezy has a star problem.</h2><p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-200">There are 28 stars and 4 equal boxes. Equal means every box must get the same number.</p></>}{stage === "demo" && <><p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">Watch the teacher</p><h2 className="mt-2 text-4xl font-black">Let us share the stars.</h2><p className="mt-4 text-lg leading-relaxed text-slate-200">The groups appear one at a time. Look for the number in every box.</p></>}{(stage === "guided" || stage === "coach" || stage === "practice" || stage === "test") && <><p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">{stage === "coach" ? "Let us repair the exact mistake" : stage === "test" ? "Final mini-test" : "Your turn"}</p><h2 className="mt-2 text-4xl font-black">{stage === "coach" ? "Watch it again, then try." : stage === "test" ? "Show what you know." : "Help Ezy choose."}</h2><p className="mt-4 text-lg leading-relaxed text-slate-200">{stage === "coach" ? `You answered ${mistake || "a different number"}. That is okay. We will use the same question and show why 7 works.` : "You can choose, write, or speak your answer."}</p></>}</div><div className="mt-8"><div className="mb-4 flex items-center justify-between text-sm font-black text-cyan-100"><span>{stage === "demo" ? `Stars shared: ${starsVisible} / 28` : "28 stars · 4 equal groups"}</span><span>{stage === "complete" ? "Mission complete" : "Learning together"}</span></div><div className="grid grid-cols-4 gap-2">{Array.from({ length: 4 }, (_, box) => <div key={box} className={`min-h-28 rounded-2xl border-2 p-2 transition-all duration-700 ${starsVisible >= (box + 1) * 7 ? "border-amber-200 bg-amber-100/20 shadow-[0_0_24px_rgba(251,191,36,0.25)]" : "border-white/20 bg-white/[0.05]"}`}><div className="mb-2 text-center text-xs font-black text-cyan-100">BOX {box + 1}</div><div className="grid grid-cols-4 gap-1">{Array.from({ length: 7 }, (_, star) => <span key={star} className={`text-center text-lg transition-all duration-500 ${starsVisible >= (box * 7) + star + 1 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>⭐</span>)}</div></div>)}</div><div className="mt-5 rounded-2xl border border-white/15 bg-black/15 p-4 text-center font-mono text-2xl font-black text-white">{stage === "coach" ? "28 ÷ 4 = 7" : stage === "demo" && scene >= 5 ? "7 × 4 = 28" : "? × 4 = 28"}</div></div></div></div><div className="bg-[#f5f8fa] p-6 text-[#10202d] sm:p-10">{stage === "welcome" && <div className="flex h-full flex-col justify-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Before we start</p><h2 className="mt-3 text-3xl font-black">First we watch. Then we help. Then we try.</h2><p className="mt-4 leading-relaxed text-slate-700">You do not need to know the answer yet. Just notice how equal groups help us find the missing number.</p><button type="button" onClick={() => setStage("story")} className="mt-8 rounded-2xl bg-[#10202d] px-5 py-4 text-sm font-black text-white">Start the story →</button></div>}{stage === "story" && <div className="flex h-full flex-col justify-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Your prediction</p><h2 className="mt-3 text-3xl font-black">What should each box get?</h2><div className="mt-6 grid grid-cols-3 gap-2">{[5, 7, 8].map((choice) => <button key={choice} type="button" onClick={startDemo} className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-5 text-2xl font-black hover:border-cyan-400">{choice}</button>)}</div><p className="mt-4 text-sm text-slate-500">It is okay if you are unsure. We will watch the demonstration next.</p></div>}{stage === "demo" && <div className="flex h-full flex-col justify-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Animated demonstration</p><h2 className="mt-3 text-3xl font-black">Four equal groups make 28.</h2><p className="mt-4 leading-relaxed text-slate-700">Every box receives 7 stars. We can write that as <strong>28 ÷ 4 = 7</strong>, then check it with <strong>7 × 4 = 28</strong>.</p>{scene >= 5 && <button type="button" onClick={() => { setStage("guided"); setAnswer(""); }} className="mt-8 rounded-2xl bg-[#10202d] px-5 py-4 text-sm font-black text-white">I saw it — let me help Ezy →</button>}{scene < 5 && <p className="mt-8 rounded-2xl bg-cyan-50 p-4 text-sm font-bold text-cyan-900">Watch the stars move into equal groups…</p>}<button type="button" onClick={startDemo} className="mt-3 rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-black">↻ Replay demonstration</button></div>}{(stage === "guided" || stage === "coach" || stage === "practice" || stage === "test") && <div className="flex h-full flex-col justify-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{stage === "coach" ? "Exact mistake lesson" : stage === "practice" ? "Another example" : stage === "test" ? "Mini-test" : "Help Ezy"}</p><h2 className="mt-3 text-3xl font-black">{task.question}</h2>{stage === "coach" && <div className="mt-4 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-relaxed text-amber-950">You answered {mistake || "another number"}. Watch: 28 shared into 4 equal groups gives 7 in each group. Check: 7 × 4 = 28.</div>}{stage === "coach" && <button type="button" onClick={() => { setStage("practice"); setAnswer(""); }} className="mt-5 rounded-2xl bg-[#10202d] px-5 py-4 text-sm font-black text-white">I understand — give me a similar example →</button>}{stage !== "coach" && <><div className="mt-5 grid grid-cols-3 gap-2">{task.options.map((option) => <button key={option} type="button" onClick={() => check(option)} className={`rounded-xl border-2 px-3 py-4 text-xl font-black ${answer === option ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white hover:border-cyan-400"}`}>{option}</button>)}</div><div className="my-4 flex gap-2"><input value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback(null); }} onKeyDown={(event) => { if (event.key === "Enter") check(); }} placeholder="Type your answer" className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-3 text-lg font-bold" /><button type="button" onClick={listen} className="rounded-xl border-2 border-slate-200 bg-white px-3 text-lg">{listening ? "⏹️" : "🎤"}</button><button type="button" onClick={() => check()} className="rounded-xl bg-[#10202d] px-4 text-sm font-black text-white">Check</button></div><p className="text-sm text-slate-500">{stage === "guided" ? "Choose the number that makes 4 equal groups." : stage === "practice" ? "Same idea, new numbers." : "A fresh question—take your time."}</p></>}</div>}{stage === "complete" && <div className="flex h-full flex-col justify-center"><div className="text-6xl">🏆</div><h2 className="mt-3 text-3xl font-black">You completed the episode!</h2><p className="mt-4 leading-relaxed text-slate-700">You watched the idea, helped Ezy, repaired a mistake, and passed the mini-test.</p><button type="button" onClick={onDone} className="mt-8 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-black text-white">Continue to Unit 15 →</button></div>}</div></div></section></div>;
}
