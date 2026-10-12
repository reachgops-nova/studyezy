"use client";

import { useEffect, useRef, useState } from "react";
import Unit15Episode from "./Unit15Episode";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: { [index: number]: { 0: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

type TutorTask = { question: string; answer: string; options: string[]; hint: string };
type TutorCorrection = { equation: string; steps: string[] };

type TutorConcept = {
  id: string;
  title: string;
  explanation: string;
  worked: { equation: string; steps: string[] };
  practice: TutorTask;
  test: TutorTask;
  coached: TutorTask[];
  correction: TutorCorrection;
  visual: "inverse" | "order" | "written" | "decimal" | "multiply";
};

const CONCEPTS: TutorConcept[] = [
  {
    id: "15.1", title: "Missing numbers & inverse operations",
    explanation: "A missing number is a clue. We work backwards by using the operation that undoes the one we can see.",
    worked: { equation: "⭐ × 3 = 21", steps: ["Three equal stars make 21.", "Division undoes multiplication.", "21 ÷ 3 = 7, so ⭐ = 7."] },
    practice: { question: "? × 4 = 28", answer: "7", options: ["6", "7", "24"], hint: "Ask: what number multiplied by 4 makes 28?" },
    test: { question: "100 − 🔺 = 30", answer: "70", options: ["60", "70", "130"], hint: "The missing part is 100 − 30." },
    coached: [
      { question: "? × 5 = 35", answer: "7", options: ["5", "7", "30"], hint: "Use the inverse: 35 ÷ 5." },
      { question: "42 ÷ ? = 6", answer: "7", options: ["6", "7", "8"], hint: "Ask what number multiplied by 6 makes 42." },
    ],
    correction: { equation: "100 − 70 = 30", steps: ["100 is the whole amount.", "The answer says 30 is left.", "So the missing part is 100 − 30 = 70.", "Check it: 100 − 70 = 30. The answer works!"] },
    visual: "inverse",
  },
  {
    id: "15.2", title: "Order of operations",
    explanation: "Operations take turns. Multiplication and division happen before addition and subtraction.",
    worked: { equation: "4 + 6 × 3", steps: ["Give multiplication the first turn.", "6 × 3 = 18.", "Now add 4: 4 + 18 = 22."] },
    practice: { question: "4 + 6 × 3", answer: "22", options: ["22", "30", "18"], hint: "Do 6 × 3 before adding 4." },
    test: { question: "20 − 10 ÷ 2", answer: "15", options: ["5", "15", "25"], hint: "Divide 10 by 2 before subtracting from 20." },
    coached: [
      { question: "5 + 2 × 4", answer: "13", options: ["13", "28", "20"], hint: "Multiply 2 × 4 first, then add 5." },
      { question: "18 ÷ 3 + 2", answer: "8", options: ["5", "8", "12"], hint: "Divide 18 by 3 first, then add 2." },
    ],
    correction: { equation: "20 − 10 ÷ 2 = 15", steps: ["Division goes first.", "10 ÷ 2 = 5.", "Now subtract: 20 − 5 = 15.", "The answer is 15."] },
    visual: "order",
  },
  {
    id: "15.3", title: "Written multiplication & division",
    explanation: "Written methods keep place values visible. We split a large calculation into smaller parts that we can check.",
    worked: { equation: "273 × 28", steps: ["Split 28 into 20 and 8.", "273 × 8 = 2,184.", "273 × 20 = 5,460.", "2,184 + 5,460 = 7,644."] },
    practice: { question: "273 × 28", answer: "7,644", options: ["7,644", "6,552", "7,284"], hint: "Find 273 × 8 and 273 × 20, then add them." },
    test: { question: "247 × 26", answer: "6,422", options: ["6,422", "6,212", "6,942"], hint: "Split 26 into 20 and 6." },
    coached: [
      { question: "124 × 12", answer: "1,488", options: ["1,488", "1,248", "1,612"], hint: "Split 12 into 10 and 2, then add the partial products." },
      { question: "205 × 14", answer: "2,870", options: ["2,870", "2,050", "2,940"], hint: "Find 205 × 10 and 205 × 4, then add." },
    ],
    correction: { equation: "247 × 26 = 6,422", steps: ["Split 26 into 20 and 6.", "247 × 20 = 4,940.", "247 × 6 = 1,482.", "Add: 4,940 + 1,482 = 6,422."] },
    visual: "written",
  },
  {
    id: "15.4", title: "Adding & subtracting decimals",
    explanation: "The decimal point is the anchor. Line it up so ones meet ones, tenths meet tenths, and hundredths meet hundredths.",
    worked: { equation: "1.35 + 1.24", steps: ["Line up the decimal points.", "Add hundredths: 5 + 4 = 9.", "Add tenths and ones: 3 + 2 and 1 + 1.", "The answer is 2.59."] },
    practice: { question: "1.35 + 1.24", answer: "2.59", options: ["2.49", "2.59", "2.69"], hint: "Line up the decimal points before adding." },
    test: { question: "6.48 − 3.25", answer: "3.23", options: ["3.13", "3.23", "3.33"], hint: "Subtract hundredths, tenths, then ones." },
    coached: [
      { question: "2.40 + 1.35", answer: "3.75", options: ["3.65", "3.75", "3.85"], hint: "Keep the decimal points in one vertical line." },
      { question: "5.60 − 2.15", answer: "3.45", options: ["3.35", "3.45", "3.55"], hint: "Subtract hundredths, tenths, then ones." },
    ],
    correction: { equation: "6.48 − 3.25 = 3.23", steps: ["Line up the decimal points.", "Hundredths: 8 − 5 = 3.", "Tenths: 4 − 2 = 2.", "Ones: 6 − 3 = 3. The answer is 3.23."] },
    visual: "decimal",
  },
  {
    id: "15.5", title: "Multiplying decimals",
    explanation: "Use a whole-number fact first, then put the place value back. Six tenths multiplied by four is 24 tenths, or 2.4.",
    worked: { equation: "0.6 × 4", steps: ["Use 6 × 4 = 24.", "The 6 was six tenths.", "24 tenths regroup as 2.4."] },
    practice: { question: "0.6 × 4", answer: "2.4", options: ["0.24", "2.4", "24"], hint: "6 × 4 = 24, but the 6 represents tenths." },
    test: { question: "0.7 × 5", answer: "3.5", options: ["0.35", "3.5", "35"], hint: "7 × 5 = 35 tenths, which is 3.5." },
    coached: [
      { question: "0.8 × 3", answer: "2.4", options: ["0.24", "2.4", "24"], hint: "8 × 3 = 24 tenths, which regroup as 2.4." },
      { question: "0.4 × 6", answer: "2.4", options: ["0.24", "2.4", "24"], hint: "4 × 6 = 24 tenths, which regroup as 2.4." },
    ],
    correction: { equation: "0.7 × 5 = 3.5", steps: ["7 × 5 = 35.", "The 7 means seven tenths.", "35 tenths regroup as 3 wholes and 5 tenths.", "So the answer is 3.5."] },
    visual: "multiply",
  },
];

function correctionFor(concept: TutorConcept, task: TutorTask): TutorCorrection {
  if (concept.id === "15.1" && task.question === "? × 4 = 28") {
    return { equation: "28 ÷ 4 = 7", steps: ["The total is 28.", "Multiplication is undone by division.", "28 ÷ 4 = 7.", "Check it: 7 × 4 = 28. The missing number is 7."] };
  }
  if (concept.id === "15.1" && task.question === "100 − 🔺 = 30") {
    return { equation: "100 − 30 = 70", steps: ["100 is the whole amount.", "The answer says 30 is left.", "So the missing part is 100 − 30 = 70.", "Check it: 100 − 70 = 30. The answer works!"] };
  }
  if (concept.id === "15.2" && task.question === "4 + 6 × 3") {
    return { equation: "6 × 3 = 18; 4 + 18 = 22", steps: ["Multiplication goes first.", "6 × 3 = 18.", "Now add 4: 4 + 18 = 22.", "The answer is 22."] };
  }
  if (concept.id === "15.2" && task.question === "20 − 10 ÷ 2") {
    return { equation: "10 ÷ 2 = 5; 20 − 5 = 15", steps: ["Division goes first.", "10 ÷ 2 = 5.", "Now subtract: 20 − 5 = 15.", "The answer is 15."] };
  }
  if (concept.id === "15.3" && task.question === "273 × 28") {
    return { equation: "273 × 20 + 273 × 8 = 7,644", steps: ["Split 28 into 20 and 8.", "273 × 20 = 5,460.", "273 × 8 = 2,184.", "Add: 5,460 + 2,184 = 7,644."] };
  }
  if (concept.id === "15.4" && task.question === "1.35 + 1.24") {
    return { equation: "1.35 + 1.24 = 2.59", steps: ["Line up the decimal points.", "Hundredths: 5 + 4 = 9.", "Tenths: 3 + 2 = 5.", "Ones: 1 + 1 = 2. The answer is 2.59."] };
  }
  if (concept.id === "15.5" && task.question === "0.6 × 4") {
    return { equation: "6 × 4 = 24 tenths = 2.4", steps: ["6 × 4 = 24.", "The 6 means six tenths.", "24 tenths regroup as 2 wholes and 4 tenths.", "The answer is 2.4."] };
  }
  return concept.correction;
}

function WorkedVisual({ concept, correction }: { concept: TutorConcept; correction?: TutorCorrection }) {
  if (concept.visual === "inverse") return <div className="space-y-4"><div className="flex flex-wrap items-center justify-center gap-3 text-2xl font-black"><span className="rounded-2xl bg-cyan-100 px-4 py-3 text-cyan-900">{correction?.equation ?? "100 whole"}</span><span className="text-cyan-500">→</span><span className="rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-900">Work it backwards</span></div><div className="mx-auto flex max-w-lg gap-1" aria-label="Animated correction model"><div className="flex flex-1 gap-1 rounded-xl bg-amber-100 p-2 motion-safe:animate-[fadeIn_.55s_ease-out]">{Array.from({ length: 7 }, (_, index) => <span key={`remove-${index}`} className="h-8 flex-1 rounded bg-amber-400 motion-safe:animate-pulse" style={{ animationDelay: `${index * 70}ms` }} />)}</div><div className="flex flex-[0.45] gap-1 rounded-xl bg-emerald-100 p-2 motion-safe:animate-[fadeIn_.55s_ease-out]">{Array.from({ length: 3 }, (_, index) => <span key={`left-${index}`} className="h-8 flex-1 rounded bg-emerald-400 motion-safe:animate-pulse" style={{ animationDelay: `${(index + 7) * 70}ms` }} />)}</div></div><p className="text-center text-sm font-black text-slate-700">{correction ? correction.steps[correction.steps.length - 1] : "Watch the parts move, then check the answer."}</p></div>;
  if (concept.visual === "order") return <div className="flex items-center justify-center gap-2 text-xl font-black"><span className="rounded-xl bg-slate-100 px-3 py-3 text-slate-400">4 +</span><span className="rounded-xl bg-amber-100 px-3 py-3 text-amber-900 ring-4 ring-amber-200/70">6 × 3</span><span className="text-cyan-500">→</span><span className="rounded-xl bg-emerald-100 px-3 py-3 text-emerald-900">22</span></div>;
  if (concept.visual === "written") return <div className="mx-auto w-48 rounded-2xl border-2 border-slate-200 bg-white p-4 text-right font-mono text-xl font-black shadow-sm"><div>273</div><div>× 28</div><div className="my-2 border-t-2 border-slate-300" /><div className="text-cyan-700">2184</div><div className="text-amber-700">5460</div><div className="my-2 border-t-2 border-slate-300" /><div className="text-emerald-700">7644</div></div>;
  if (concept.visual === "decimal") return <div className="mx-auto grid max-w-xs grid-cols-4 gap-1 text-center text-lg font-black"><div className="col-span-2 rounded-lg bg-slate-100 p-2">ones</div><div className="rounded-lg bg-amber-100 p-2">tenths</div><div className="rounded-lg bg-cyan-100 p-2">hundredths</div><div className="col-span-2 rounded-lg bg-white p-2">1</div><div className="rounded-lg bg-amber-50 p-2">3</div><div className="rounded-lg bg-cyan-50 p-2">5</div><div className="col-span-2 rounded-lg bg-white p-2">1</div><div className="rounded-lg bg-amber-50 p-2">2</div><div className="rounded-lg bg-cyan-50 p-2">4</div></div>;
  return <div className="flex items-center justify-center gap-3 text-xl font-black"><span className="rounded-2xl bg-cyan-100 px-4 py-3 text-cyan-900">6 × 4 = 24</span><span className="text-cyan-500">→</span><span className="rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-900">24 tenths = 2.4</span></div>;
}

function BlackboardCorrection({ correction }: { correction: TutorCorrection }) {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [replay, setReplay] = useState(0);
  const isInversePractice = correction.equation === "28 ÷ 4 = 7";
  const finalScene = correction.steps.length + (isInversePractice ? 4 : 1);

  useEffect(() => {
    if (!playing || scene >= finalScene) return;
    const timer = window.setTimeout(() => setScene((value) => value + 1), 1100);
    return () => window.clearTimeout(timer);
  }, [finalScene, playing, replay, scene]);

  function replayLesson() {
    setScene(0);
    setPlaying(true);
    setReplay((value) => value + 1);
  }

  return <div className="rounded-3xl border-2 border-cyan-200/30 bg-[#102b3d] p-5 shadow-inner motion-safe:animate-[fadeIn_.4s_ease-out]"><p className="text-center text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Teacher’s blackboard · {scene >= finalScene ? "lesson complete" : "watch the teacher"}</p><div className="mt-4 rounded-2xl border-b-4 border-cyan-200/40 bg-[#173d50] px-4 py-4 text-center font-mono text-2xl font-black text-white motion-safe:animate-[fadeIn_.45s_ease-out]">{scene >= 0 && correction.equation}</div>{isInversePractice && scene >= 1 && <div className="mt-4 grid grid-cols-4 gap-2" aria-label="Four groups of seven make twenty-eight">{Array.from({ length: 4 }, (_, group) => scene >= group + 1 ? <div key={group} className="rounded-xl border border-amber-200/50 bg-amber-300/15 p-2 motion-safe:animate-[fadeIn_.5s_ease-out]"><div className="mb-1 text-center text-xs font-black text-amber-100">group {group + 1}</div><div className="grid grid-cols-7 gap-1">{Array.from({ length: 7 }, (_, dot) => <span key={dot} className="h-2 rounded-full bg-amber-300" />)}</div></div> : <div key={group} className="rounded-xl border border-white/10 bg-white/[0.03] p-2" aria-hidden="true" />)}</div>}{!isInversePractice && scene >= 1 && <div className="mt-4 flex justify-center gap-2">{Array.from({ length: 5 }, (_, index) => <span key={index} className="h-7 w-7 rounded-lg bg-cyan-300/80 motion-safe:animate-pulse" style={{ animationDelay: `${index * 120}ms` }} />)}</div>}<div className="mt-5 min-h-24 space-y-2">{correction.steps.map((step, index) => scene >= (isInversePractice ? index + 5 : index + 2) && <div key={step} className="flex gap-3 border-l-4 border-emerald-300/70 bg-white/[0.06] p-3 text-sm font-bold text-slate-100 motion-safe:animate-[fadeIn_.55s_ease-out]"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-xs font-black text-[#102b3d]">{index + 1}</span><span>{step}</span></div>)}</div>{scene >= finalScene && <p className="mt-4 text-center text-sm font-black text-emerald-200">Now say the rule back to Ezy, then try the next example.</p>}<div className="mt-4 flex gap-2"><button type="button" onClick={() => setPlaying((value) => !value)} className="flex-1 rounded-xl border border-cyan-200/30 bg-cyan-100/10 px-3 py-2 text-xs font-black text-cyan-100">{playing ? "Ⅱ Pause" : "▶ Play"}</button><button type="button" onClick={replayLesson} className="flex-1 rounded-xl border border-cyan-200/30 bg-cyan-100/10 px-3 py-2 text-xs font-black text-cyan-100">↻ Replay lesson</button></div></div>;
}

export default function Unit15TutorJourney({ onDone, onNarrate }: { onDone: () => void; onNarrate?: (text: string) => void }) {
  const [episodeComplete, setEpisodeComplete] = useState(false);
  const [conceptIndex, setConceptIndex] = useState(0);
  const [stage, setStage] = useState<"read" | "practice" | "coach" | "test" | "complete">("read");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hint, setHint] = useState(false);
  const [coachIndex, setCoachIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [mistakeTask, setMistakeTask] = useState<TutorTask | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const concept = CONCEPTS[conceptIndex];
  const task = stage === "test" ? concept.test : stage === "coach" ? concept.coached[coachIndex] : concept.practice;
  const activeCorrection = mistakeTask ? correctionFor(concept, mistakeTask) : concept.correction;

  useEffect(() => {
    onNarrate?.("Welcome. We will learn one calculation idea at a time. First watch a worked example, then try a guided question, then answer a new test question. You can read again or test again whenever you need.");
  }, [onNarrate]);

  useEffect(() => {
    if (stage === "read") onNarrate?.(`${concept.title}. ${concept.explanation}`);
    if (stage === "practice") onNarrate?.(`Now let us practise together. ${task.question}. You may write the answer or speak it.`);
    if (stage === "coach") onNarrate?.(`Let us slow down and do another example together. ${activeCorrection.steps.join(" ")} Now try ${task.question}.`);
    if (stage === "test") onNarrate?.(`Now try a fresh test question without looking at the worked example. ${task.question}`);
    if (stage === "complete") onNarrate?.(`You completed ${concept.title}. You can read it again, test it again, or choose another Unit 15 concept.`);
  }, [activeCorrection, concept, onNarrate, stage, task.question]);

  if (!episodeComplete) return <Unit15Episode onNarrate={onNarrate} onDone={() => setEpisodeComplete(true)} />;

  function check(value = answer) {
    const normalise = (text: string) => text.toLowerCase().replace(/,/g, "").replace(/\s/g, "").trim();
    const correct = normalise(value) === normalise(task.answer);
    setAnswer(value);
    setFeedback(correct ? "correct" : "wrong");
    setHint(!correct);
    if (correct) {
      if (stage === "coach") {
        if (coachIndex < concept.coached.length - 1) {
          onNarrate?.("Good. Here is one more example with different numbers. Use the same steps.");
          setCoachIndex((current) => current + 1);
          setAnswer("");
          setFeedback(null);
          setHint(false);
        } else {
          onNarrate?.("Excellent. You have practised the method twice. Now try a fresh test question.");
          setStage("test");
          setAnswer("");
          setFeedback(null);
          setHint(false);
        }
        return;
      }
      onNarrate?.(stage === "practice" ? `Correct. Now I will give you a new test question.` : `Correct. You have completed this concept.`);
      if (stage === "practice") window.setTimeout(() => { setFeedback(null); setAnswer(""); setHint(false); setStage("test"); }, 700);
      else setCompleted((current) => current.includes(concept.id) ? current : [...current, concept.id]);
      if (stage === "test") setStage("complete");
    } else {
      setMistakeTask(task);
      onNarrate?.("That is not quite right. I will show you this exact question step by step, then give you two similar examples before the next test.");
      setCoachIndex(0);
      setAnswer("");
      setFeedback(null);
      setHint(false);
      setStage("coach");
    }
  }

  function listen() {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
      ?? (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SpeechRecognition) { onNarrate?.("Voice input is not available in this browser. You can type the answer instead."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => { const transcript = event.results[0]?.[0]?.transcript ?? ""; setListening(false); check(transcript); };
    recognition.onerror = () => { setListening(false); onNarrate?.("I could not hear the answer. Try saying it once more or type it."); };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function selectConcept(index: number) {
    // Keep first learning in textbook order. Completed concepts remain
    // available for revision, but a future concept is unlocked only after
    // the current concept's test is passed.
    if (index > completed.length) return;
    setConceptIndex(index);
    setStage("read");
    setAnswer("");
    setFeedback(null);
    setHint(false);
    setCoachIndex(0);
    setMistakeTask(null);
  }

  function nextConcept() {
    const next = (conceptIndex + 1) % CONCEPTS.length;
    selectConcept(next);
  }

  const isQuestionStage = stage === "practice" || stage === "coach" || stage === "test";
  const questionLabel = stage === "coach" ? `Example ${coachIndex + 1} of ${concept.coached.length} · let us do it together` : stage === "practice" ? "Guided practice" : "Fresh test question";
  const questionTitle = stage === "coach" ? "Let us try that method again." : stage === "practice" ? "Your turn with help." : "Now show what you know.";
  const correctionCard = stage === "coach";
  const questionIntro = stage === "coach"
    ? correctionCard
      ? <><span>You made a mistake, so we will slow down and rebuild this exact question. First watch the correction, then use the same idea with two new examples.</span><div className="mt-5"><BlackboardCorrection correction={activeCorrection} /></div></>
      : "You made a mistake, so we will slow down. Watch the method, then practise it with a new example."
    : stage === "practice"
      ? "Use the worked example if you need it. You can speak or write your answer."
      : "This question is new. Think first, then answer in your own way.";

  return <div className="flex min-h-0 w-full items-start justify-center overflow-y-auto p-1 sm:p-3"><section className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-700 bg-[#101c2b] text-white shadow-2xl"><header className="border-b border-white/10 px-6 py-5 sm:px-9"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Ezy tutor studio · Unit 15</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">Learn it, try it, explain it.</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">Choose any concept. We will not show the calculation first and ask you to memorise it. We will watch it being built together.</p></div><div className="rounded-full border border-cyan-200/20 bg-cyan-100/10 px-3 py-1 text-sm font-black text-cyan-100">{completed.length} / {CONCEPTS.length} complete</div></div><nav className="mt-6 grid gap-2 sm:grid-cols-5" aria-label="Unit 15 concepts">{CONCEPTS.map((item, index) => <button key={item.id} type="button" onClick={() => selectConcept(index)} className={`rounded-xl border-2 px-2 py-2 text-left text-xs font-bold transition ${index === conceptIndex ? "border-cyan-300 bg-cyan-100/15 text-cyan-100" : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/30"}`}><span className="block text-[0.65rem] text-slate-500">{item.id} {completed.includes(item.id) ? "✓" : ""}</span>{item.title}</button>)}</nav></header><div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]"><div className="bg-gradient-to-br from-[#19334b] to-[#101c2b] p-6 sm:p-9">{stage === "read" && <><p className="text-sm font-bold text-cyan-200">Worked example · watch the idea move</p><h2 className="mt-2 text-4xl font-black leading-tight">{concept.title}</h2><p className="mt-5 text-base leading-relaxed text-slate-300">{concept.explanation}</p><div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-5"><WorkedVisual concept={concept} /></div><div className="mt-6 space-y-2">{concept.worked.steps.map((step, index) => <div key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm font-bold text-slate-200 motion-safe:animate-[fadeIn_.35s_ease-out]" style={{ animationDelay: `${index * 120}ms` }}><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-black text-[#092035]">{index + 1}</span>{step}</div>)}</div></>}{isQuestionStage && <><p className="text-sm font-bold text-cyan-200">{questionLabel}</p><h2 className="mt-2 text-4xl font-black leading-tight">{questionTitle}</h2><p className="mt-5 text-base leading-relaxed text-slate-300">{questionIntro}</p><div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center text-4xl font-black text-white sm:text-5xl">{task.question}</div><button type="button" onClick={() => { setStage("read"); setFeedback(null); setHint(false); }} className="mt-5 w-full rounded-2xl border border-cyan-200/30 bg-cyan-100/10 px-4 py-3 text-sm font-black text-cyan-100">↺ Read the worked example again</button></>}{stage === "complete" && <><div className="text-6xl">🎉</div><p className="mt-6 text-sm font-bold text-emerald-200">Concept complete</p><h2 className="mt-2 text-4xl font-black leading-tight">You worked through {concept.title}.</h2><p className="mt-5 text-base leading-relaxed text-slate-300">Choose Test again if you want another challenge, or pick another concept above. You decide the pace.</p><div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-5"><WorkedVisual concept={concept} /></div></>}</div><div className="bg-[#f4f7f8] p-6 text-[#10202d] sm:p-9">{stage === "read" && <div className="flex h-full flex-col justify-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Before we calculate</p><h2 className="mt-3 text-2xl font-black">What are we looking for?</h2><p className="mt-3 text-base leading-relaxed text-slate-700">We are looking for the move that makes the calculation easier to understand. Watch the example, listen to Ezy, and then choose whether you are ready to practise.</p><button type="button" onClick={() => onNarrate?.(concept.explanation)} className="mt-6 rounded-2xl border-2 border-cyan-200 bg-cyan-50 px-5 py-3 text-sm font-black text-cyan-800">🔊 Read this explanation aloud</button><button type="button" onClick={() => setStage("practice")} className="mt-3 rounded-2xl bg-[#10202d] px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-white">I understand — let me practise →</button></div>}{isQuestionStage && <div className="flex h-full flex-col justify-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{stage === "coach" ? "Guided correction" : stage === "practice" ? "Talk or write" : "Test again"}</p><h2 className="mt-3 text-2xl font-black">What is the answer?</h2>{stage === "coach" && <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm font-bold leading-relaxed text-cyan-950">🧑‍🏫 Let us do this slowly. Use the same steps from the worked example. You have two new examples here before we test again.</div>}<div className="mt-5 grid grid-cols-3 gap-2">{task.options.map((option) => <button key={option} type="button" onClick={() => check(option)} className={`rounded-xl border-2 px-2 py-3 text-lg font-black ${answer === option ? feedback === "correct" ? "border-emerald-500 bg-emerald-100 text-emerald-800" : "border-rose-400 bg-rose-100 text-rose-800" : "border-slate-200 bg-white hover:border-cyan-400"}`}>{option}</button>)}</div><div className="my-4 flex gap-2"><input value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback(null); }} onKeyDown={(event) => { if (event.key === "Enter") check(); }} placeholder="Or type your answer" className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-3 text-lg font-bold outline-none focus:border-cyan-400" /><button type="button" onClick={listen} className={`rounded-xl border-2 px-3 text-lg ${listening ? "border-amber-400 bg-amber-100" : "border-slate-200 bg-white hover:border-cyan-400"}`} title="Answer by voice">{listening ? "⏹️" : "🎤"}</button><button type="button" onClick={() => check()} className="rounded-xl bg-[#10202d] px-4 text-sm font-black text-white">Check</button></div>{feedback === "correct" && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-900">✅ Correct. {stage === "practice" ? "Now you will get a fresh test question." : stage === "coach" ? "Good. Keep using that method." : "You can test again or choose the next concept."}</div>}{hint && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-relaxed text-amber-900">💡 {task.hint}<button type="button" className="ml-1 underline" onClick={() => { setHint(false); setFeedback(null); setAnswer(""); }}>Try again</button></div>}</div>}{stage === "complete" && <div className="flex h-full flex-col justify-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Your choice</p><h2 className="mt-3 text-2xl font-black">What would you like to do?</h2><button type="button" onClick={() => { setStage("read"); setFeedback(null); setAnswer(""); }} className="mt-6 rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-left text-sm font-black hover:border-cyan-400">📖 Read it again</button><button type="button" onClick={() => { setStage("test"); setFeedback(null); setAnswer(""); setHint(false); }} className="mt-3 rounded-2xl border-2 border-slate-200 px-5 py-4 text-left text-sm font-black hover:border-cyan-400">🧪 Test it again</button><button type="button" onClick={nextConcept} className="mt-3 rounded-2xl bg-emerald-600 px-5 py-4 text-left text-sm font-black text-white">➜ Move to the next concept</button><button type="button" onClick={onDone} className="mt-3 rounded-2xl border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">Open the standard board</button></div>}</div></div></section></div>;
}
