"use client";

import { useState } from "react";

export interface UnitOption {
  unitKey: string;
  label: string;
  concepts: { id: string; name: string }[];
}

const LANGUAGES = ["English", "Tamil", "Hindi", "Telugu", "Kannada", "Malayalam", "French"];

interface ModelResult {
  model: string;
  answer?: string;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number | null;
  error?: string;
}

function formatCost(costUsd: number | null | undefined): string {
  if (costUsd === null || costUsd === undefined) return "unknown";
  return `$${costUsd.toFixed(6)}`;
}

function ResultCard({ title, result }: { title: string; result: ModelResult | null }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        {result && <code className="truncate text-xs text-slate-400">{result.model}</code>}
      </div>
      {!result ? (
        <p className="mt-3 text-sm text-slate-400">Ask a question to see this model&apos;s answer here.</p>
      ) : result.error ? (
        <p className="mt-3 text-sm text-red-600">{result.error}</p>
      ) : (
        <>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{result.answer}</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
            <dt>Latency</dt>
            <dd className="text-right font-medium text-slate-700">{result.latencyMs} ms</dd>
            <dt>Tokens (in / out)</dt>
            <dd className="text-right font-medium text-slate-700">
              {result.inputTokens} / {result.outputTokens}
            </dd>
            <dt>Cost (this call)</dt>
            <dd className="text-right font-medium text-slate-700">{formatCost(result.costUsd)}</dd>
          </dl>
        </>
      )}
    </div>
  );
}

export default function ModelCompareForm({ unitOptions }: { unitOptions: UnitOption[] }) {
  const [unitKey, setUnitKey] = useState(unitOptions[0]?.unitKey ?? "");
  const selectedUnit = unitOptions.find((u) => u.unitKey === unitKey);
  const [conceptId, setConceptId] = useState(selectedUnit?.concepts[0]?.id ?? "");
  const [language, setLanguage] = useState("English");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<ModelResult | null>(null);
  const [qwen, setQwen] = useState<ModelResult | null>(null);

  function handleUnitChange(newUnitKey: string) {
    setUnitKey(newUnitKey);
    const unit = unitOptions.find((u) => u.unitKey === newUnitKey);
    setConceptId(unit?.concepts[0]?.id ?? "");
  }

  async function handleCompare() {
    if (!unitKey || !conceptId || !question.trim() || loading) return;
    setLoading(true);
    setError(null);
    setCurrent(null);
    setQwen(null);
    try {
      const res = await fetch("/api/admin/compare-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey, conceptId, question, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setCurrent(data.current);
      setQwen(data.qwen);
    } catch {
      setError("Request failed - check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (unitOptions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 text-sm text-slate-500 shadow-soft">
        No units with drafted concepts yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Unit
          <select
            value={unitKey}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            {unitOptions.map((u) => (
              <option key={u.unitKey} value={u.unitKey}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Concept
          <select
            value={conceptId}
            onChange={(e) => setConceptId(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            {selectedUnit?.concepts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
          Question
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type a real question a student might ask on this concept..."
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Response language
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleCompare}
            disabled={loading || !question.trim()}
            className="w-full rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Asking both models..." : "Compare"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard title="Current (openai/gpt-oss-120b)" result={current} />
        <ResultCard title="Qwen3.6-27B" result={qwen} />
      </div>
    </div>
  );
}
