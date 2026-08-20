// Client-safe helper for recording a test/diagnostic attempt server-side
// (Postgres now, not localStorage). No "server-only" - this runs in the
// browser. The active student profile is derived from the session cookie
// server-side, never sent from the client.
import type { QuestionPaperDifficulty, StoredUnitResult } from "./types";

export async function recordAttempt(params: {
  unitKey: string;
  attemptType?: "progression_test" | "diagnostic";
  difficulty?: QuestionPaperDifficulty;
  correct: number;
  total: number;
  perConcept: Record<string, { correct: number; total: number }>;
}): Promise<StoredUnitResult> {
  const res = await fetch("/api/attempts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Couldn't save this result - please try again.");
  }
  return res.json();
}
