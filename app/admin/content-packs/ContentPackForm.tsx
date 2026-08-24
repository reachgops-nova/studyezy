"use client";

import { useState } from "react";

export interface UnitOption {
  unitKey: string;
  label: string;
  subject: string;
  board: string;
  stage: string;
  book: string;
  pages: { storageKey: string; originalFilename: string }[];
  existingPacks: {
    packId: string;
    status: string;
    sheetsCount: number;
    questionsCount: number;
    needsHumanCount: number;
    errorsCount: number;
    warningsCount: number;
    model: string;
    createdAt: string;
  }[];
}

interface ConvertResponse {
  packId: string;
  status: string;
  counts: { sheets: number; questions: number; fields: number; needsHuman: number };
  errors: string[];
  warnings: string[];
  perPage: { imagePath: string; sheets: number; questions: number; errors: string[]; modelUsed: string }[];
  inputTokens: number;
  outputTokens: number;
  costUsd: number | null;
}

function statusPill(status: string) {
  const styles: Record<string, string> = {
    clean: "bg-emerald-100 text-emerald-700",
    needs_review: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700",
    draft: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? styles.draft}`}>{status}</span>
  );
}

export default function ContentPackForm({ unitOptions }: { unitOptions: UnitOption[] }) {
  const [unitKey, setUnitKey] = useState(unitOptions[0]?.unitKey ?? "");
  const selectedUnit = unitOptions.find((u) => u.unitKey === unitKey);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    selectedUnit ? selectedUnit.pages.slice(0, 3).map((p) => p.storageKey) : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertResponse | null>(null);

  function handleUnitChange(newUnitKey: string) {
    setUnitKey(newUnitKey);
    const unit = unitOptions.find((u) => u.unitKey === newUnitKey);
    setSelectedKeys(unit ? unit.pages.slice(0, 3).map((p) => p.storageKey) : []);
    setResult(null);
    setError(null);
  }

  function toggleKey(storageKey: string) {
    setSelectedKeys((prev) => (prev.includes(storageKey) ? prev.filter((k) => k !== storageKey) : [...prev, storageKey]));
  }

  async function handleConvert() {
    if (!selectedUnit || selectedKeys.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/content-packs/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitKey: selectedUnit.unitKey,
          storageKeys: selectedKeys,
          book: selectedUnit.book,
          subject: selectedUnit.subject,
          board: selectedUnit.board,
          stage: selectedUnit.stage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult(data);
    } catch {
      setError("Request failed - check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (unitOptions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 text-sm text-slate-500 shadow-soft">
        No units with uploaded pages yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Unit
          <select
            value={unitKey}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            {unitOptions.map((u) => (
              <option key={u.unitKey} value={u.unitKey}>
                {u.label} ({u.pages.length} pages)
              </option>
            ))}
          </select>
        </label>

        {selectedUnit && (
          <div className="grid gap-1.5">
            <p className="text-sm font-medium text-slate-700">Pages to convert (3 is a good start, not the whole book)</p>
            <div className="grid max-h-56 gap-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {selectedUnit.pages.map((p) => (
                <label key={p.storageKey} className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(p.storageKey)}
                    onChange={() => toggleKey(p.storageKey)}
                  />
                  <span className="truncate text-slate-700">{p.originalFilename}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={handleConvert}
            disabled={loading || selectedKeys.length === 0}
            className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
          >
            {loading
              ? `Converting ${selectedKeys.length} page${selectedKeys.length === 1 ? "" : "s"} (~30-90s per page, paced to stay under Groq's rate limit)...`
              : `Convert ${selectedKeys.length} page${selectedKeys.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-800">
              {result.packId} {statusPill(result.status)}
            </h3>
            <a
              href={`/admin/content-packs/${result.packId}/preview`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-brand-navy underline"
            >
              Preview as a kid would see it →
            </a>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-500 sm:grid-cols-4">
            <dt>Sheets</dt>
            <dd className="text-right font-medium text-slate-700">{result.counts.sheets}</dd>
            <dt>Questions</dt>
            <dd className="text-right font-medium text-slate-700">{result.counts.questions}</dd>
            <dt>Needs human</dt>
            <dd className="text-right font-medium text-slate-700">{result.counts.needsHuman}</dd>
            <dt>Cost</dt>
            <dd className="text-right font-medium text-slate-700">
              {result.costUsd === null ? "unknown" : `$${result.costUsd.toFixed(6)}`}
            </dd>
          </dl>

          {result.perPage.length > 0 && (
            <div className="mt-3 grid gap-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
              {result.perPage.map((p, i) => (
                <p key={i}>
                  page {i + 1} ({p.modelUsed}): {p.sheets} sheet(s), {p.questions} question(s)
                  {p.errors.length > 0 && <span className="text-red-600"> - {p.errors.length} unresolved error(s)</span>}
                </p>
              ))}
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="text-xs font-semibold text-amber-700">Warnings</p>
              {result.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-700">
                  {w}
                </p>
              ))}
            </div>
          )}
          {result.errors.length > 0 && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="text-xs font-semibold text-red-700">Errors (unresolved after repair attempts)</p>
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-700">
                  {e}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedUnit && selectedUnit.existingPacks.length > 0 && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <h3 className="font-semibold text-slate-800">Previously converted for this unit</h3>
          <div className="mt-2 grid gap-2">
            {selectedUnit.existingPacks.map((p) => (
              <div key={p.packId} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-700">
                    {p.packId} {statusPill(p.status)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {p.sheetsCount} sheets · {p.questionsCount} questions · {p.needsHumanCount} needs human ·{" "}
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
                <a
                  href={`/admin/content-packs/${p.packId}/preview`}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-sm font-medium text-brand-navy underline"
                >
                  Preview
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
