"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { InkQuestion, InkUnit } from "@/lib/inkBoard/types";
import { pickRandom, shuffleOptions } from "@/lib/inkBoard/quiz";
import type { StoredUnitResult } from "@/lib/types";

// The "Test" half of RRT (Read, Recite, Test - see InkQuickCheck.tsx for
// why there's no Cover step). A longer, randomly-drawn test spanning every
// topic in the unit - "atleast 5-10 for test session" - scored as a real
// progression_test through the exact same lib/recordMastery.ts path every
// other Board test uses, so it shows up in the dashboard/prep planner like
// any other unit test, not a parallel, invisible score.
const MIN_QUESTIONS = 5;
const MAX_QUESTIONS = 10;

interface PooledQuestion extends InkQuestion {
  topicId: string;
}

export default function InkTestSession({ unit }: { unit: InkUnit }) {
  const questions = useMemo<PooledQuestion[]>(() => {
    const pool: PooledQuestion[] = unit.topics.flatMap((t) => t.questions.map((q) => ({ ...q, topicId: t.topicId })));
    const target = MIN_QUESTIONS + Math.floor(Math.random() * (MAX_QUESTIONS - MIN_QUESTIONS + 1));
    return pickRandom(pool, target).map((q) => ({ ...shuffleOptions(q), topicId: q.topicId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit.unitKey]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [perTopic, setPerTopic] = useState<Record<string, { correct: number; total: number }>>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<StoredUnitResult | null>(null);

  const q = questions[index];
  const totalCorrect = Object.values(perTopic).reduce((sum, t) => sum + t.correct, 0);

  function choose(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === q.correctIndex;
    setPerTopic((prev) => {
      const current = prev[q.topicId] ?? { correct: 0, total: 0 };
      return { ...prev, [q.topicId]: { correct: current.correct + (isCorrect ? 1 : 0), total: current.total + 1 } };
    });
  }

  async function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
      return;
    }
    setDone(true);
    setSaving(true);
    try {
      const total = questions.length;
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey: unit.unitKey, attemptType: "progression_test", correct: totalCorrect, total, perConcept: perTopic }),
      });
      if (res.ok) setResult((await res.json()) as StoredUnitResult);
    } catch (err) {
      console.error("InkTestSession failed to record result", err);
    } finally {
      setSaving(false);
    }
  }

  if (questions.length === 0) {
    return <p className="p-8 text-center text-white">இந்த பாடத்திற்கு இன்னும் தேர்வு கேள்விகள் இல்லை.</p>;
  }

  if (done) {
    const total = questions.length;
    const bandLabel: Record<string, string> = {
      mastered: "சிறப்பாகக் கற்றுவிட்டீர்கள்! 🌟",
      needs_brush_up: "நன்று! இன்னும் கொஞ்சம் பயிற்சி தேவை.",
      needs_reteach: "கவலை வேண்டாம், மீண்டும் பாடங்களைப் பார்த்துப் பயிற்சி செய்வோம்.",
    };
    return (
      <main className="min-h-screen bg-[#20242b] p-6">
        <div className="mx-auto max-w-xl rounded-2xl border-[6px] border-[#343943] bg-[#f5f8f5] p-8 text-center shadow-2xl">
          <p className="hand text-4xl text-indigo-800">
            {totalCorrect} / {total}
          </p>
          <p className="mt-2 text-lg font-bold text-slate-700">{saving ? "பதிவு செய்கிறோம்..." : result ? `மதிப்பெண்: ${result.band}` : "முடிவு பதிவு செய்யப்பட்டது"}</p>
          {result && <p className="mt-1 text-sm text-slate-500">{bandLabel[result.band] ?? ""}</p>}
          <Link href={`/board-ink/${unit.unitKey}`} className="mt-6 inline-block rounded-lg bg-indigo-700 px-5 py-3 text-sm font-black text-white">
            பாடத்திற்குத் திரும்பு
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#20242b] p-2 sm:p-6">
      <section className="mx-auto max-w-[900px] overflow-hidden rounded-xl border-[10px] border-[#343943] bg-[#f5f8f5] shadow-2xl">
        <header className="border-b-2 border-slate-300 bg-white px-4 py-3 sm:px-8">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-indigo-700">
            {unit.badge} · முழு தேர்வு · {index + 1}/{questions.length}
          </p>
          <h1 className="hand text-2xl text-slate-800">{unit.title}</h1>
        </header>
        <div className="p-6 sm:p-8">
          <p className="font-mono text-xs font-bold text-slate-400">தலைப்பு {q.topicId}</p>
          <p className="hand mt-2 text-2xl text-slate-800">{q.prompt}</p>
          <div className="mt-5 flex flex-col gap-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isChosen = i === selected;
              const revealed = selected !== null;
              const style = !revealed
                ? "border-slate-300 bg-white hover:border-indigo-400"
                : isCorrect
                  ? "border-green-500 bg-green-50"
                  : isChosen
                    ? "border-rose-500 bg-rose-50"
                    : "border-slate-200 bg-white opacity-60";
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={revealed}
                  className={`rounded-lg border-2 px-4 py-3 text-left text-base font-medium ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div className="mt-4">
              <p className={`text-sm font-bold ${selected === q.correctIndex ? "text-green-700" : "text-rose-700"}`}>
                {selected === q.correctIndex ? "சரி!" : "தவறு."} {q.explanation}
              </p>
              <button type="button" onClick={next} className="mt-4 rounded-lg bg-indigo-700 px-5 py-3 text-sm font-black text-white">
                {index + 1 < questions.length ? "அடுத்தது →" : "தேர்வை முடி"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
