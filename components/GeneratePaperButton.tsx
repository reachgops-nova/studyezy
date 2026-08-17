"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneratePaperButton({ unitKey }: { unitKey: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function handleClick() {
    setBusy(true);
    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch("/api/resources/generate-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Couldn't generate a question paper.");
      setMessage(`Generated ${body.questionCount} questions - saved as this unit's progression test.`);
      router.refresh();
    } catch (e) {
      setIsError(true);
      setMessage(e instanceof Error ? e.message : "Couldn't generate a question paper.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-800">Generate practice question paper</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Builds original questions from this unit&apos;s approved textbook/worksheet/classwork/homework
            material and saves them as the unit&apos;s progression test.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          className="shrink-0 rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? "Generating..." : "Generate from approved material"}
        </button>
      </div>
      {message && <p className={`mt-2 text-sm ${isError ? "text-red-600" : "text-green-600"}`}>{message}</p>}
    </div>
  );
}
