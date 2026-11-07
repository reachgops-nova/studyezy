"use client";

import { useMemo, useState } from "react";
import type { InkTopic } from "@/lib/inkBoard/types";
import { pickRandom, shuffleOptions } from "@/lib/inkBoard/quiz";

// The "Recite" half of RRT (Read, Recite, Test - Cover deliberately dropped,
// real user direction 2026-10-20: "RCRT we can remove C, RRT is still
// fine"). A short, randomly-drawn quick check after a topic's scenes -
// "increase test 2-4 question for every session". Scored as a
// practice_widget attempt (see lib/recordMastery.ts): a real signal, but
// capped below "mastered" on its own, same as every other in-lesson widget
// in this codebase - only the full InkTestSession can certify mastery.
//
// `onClose` reports whether the quick check was actually finished
// (`true`, the learner answered every question) or left early (`false`) -
// InkBoard.tsx only auto-advances to the next topic on a real finish, per
// real direction 2026-11-07: "ensure we move to next topic automatically.
// but ensure RRT is followed on each topic and covered correctly".
const STRINGS = {
  ta: {
    scoreLine: (correct: number, total: number) => `${correct} / ${total} சரியானவை!`,
    saving: "பதிவு செய்கிறோம்...",
    saved: "இந்த பாடத்தின் முன்னேற்றம் பதிவு செய்யப்பட்டது.",
    close: "மூடு",
    closeX: "✕ மூடு",
    header: (topicId: string, index: number, total: number) => `விரைவு சோதனை · ${topicId} · ${index}/${total}`,
    correct: "சரி!",
    wrong: "தவறு.",
    next: "அடுத்தது →",
    finish: "முடி",
  },
  en: {
    scoreLine: (correct: number, total: number) => `${correct} / ${total} correct!`,
    saving: "Saving...",
    saved: "Your progress on this topic has been saved.",
    close: "Close",
    closeX: "✕ Close",
    header: (topicId: string, index: number, total: number) => `Quick check · ${topicId} · ${index}/${total}`,
    correct: "Correct!",
    wrong: "Not quite.",
    next: "Next →",
    finish: "Finish",
  },
};

export default function InkQuickCheck({
  unitKey,
  topic,
  lang = "ta",
  onClose,
}: {
  unitKey: string;
  topic: InkTopic;
  lang?: "ta" | "en";
  onClose: (completed: boolean) => void;
}) {
  const t = STRINGS[lang];
  const questions = useMemo(() => {
    const count = Math.min(topic.questions.length, 2 + Math.floor(Math.random() * 3)); // 2-4
    return pickRandom(topic.questions, count).map(shuffleOptions);
  }, [topic]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const q = questions[index];

  function choose(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === q.correctIndex) setCorrectCount((c) => c + 1);
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
      await fetch("/api/widget-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey, conceptKey: topic.topicId, correct: correctCount, total: questions.length }),
      });
    } catch (err) {
      console.error("InkQuickCheck failed to record result", err);
    } finally {
      setSaving(false);
    }
  }

  if (questions.length === 0) return null;

  if (done) {
    return (
      <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-5 text-center">
        <p className="hand text-2xl text-indigo-800">{t.scoreLine(correctCount, questions.length)}</p>
        <p className="mt-1 text-sm text-slate-600">{saving ? t.saving : t.saved}</p>
        <button type="button" onClick={() => onClose(true)} className="mt-4 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-black text-white">
          {t.close}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-xs font-black uppercase tracking-wider text-indigo-700">{t.header(topic.topicId, index + 1, questions.length)}</p>
        <button type="button" onClick={() => onClose(false)} className="text-xs font-bold text-slate-500">
          {t.closeX}
        </button>
      </div>
      <p className="hand text-xl text-slate-800">{q.prompt}</p>
      <div className="mt-4 flex flex-col gap-2">
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
              className={`rounded-lg border-2 px-4 py-3 text-left text-sm font-medium ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-3">
          <p className={`text-sm font-bold ${selected === q.correctIndex ? "text-green-700" : "text-rose-700"}`}>
            {selected === q.correctIndex ? t.correct : t.wrong} {q.explanation}
          </p>
          <button type="button" onClick={next} className="mt-3 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-black text-white">
            {index + 1 < questions.length ? t.next : t.finish}
          </button>
        </div>
      )}
    </div>
  );
}
