import type { InkQuestion } from "./types";

// Shared by InkQuickCheck.tsx and InkTestSession.tsx. Real bug caught live
// 2026-10-20 while verifying the first test session: every authored
// question in tamilnadustateboard-10-math-1.ts happens to have its correct
// option written first (index 0) - an automated click-through of "always
// pick the first option" scored 8/8, which means a real student could too,
// without knowing any of the material. shuffleOptions fixes this at
// display time so the data can stay simple to author (correct answer
// always written first) while what's actually shown is never predictable.
export function shuffleOptions(q: InkQuestion): InkQuestion {
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.correctIndex),
  };
}

export function pickRandom<T>(items: T[], count: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
