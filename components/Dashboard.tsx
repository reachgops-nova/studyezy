import type { StoredUnitResult } from "@/lib/types";

export default function Dashboard({ results }: { results: StoredUnitResult[] }) {
  if (results.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        No progression tests taken yet. Once you take one, you&apos;ll see what to revisit here.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {results.map((r) => (
        <div key={r.unitKey} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="font-medium">{r.unitKey}</p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${bandColor(r.band)}`}>
              {r.scorePct}%
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Suggested next check-in: {new Date(r.nextReviewDate).toLocaleDateString()}
          </p>
          <div className="mt-3 grid gap-1">
            {Object.entries(r.perConcept).map(([conceptId, stat]) => {
              const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              return (
                <div key={conceptId} className="flex items-center justify-between text-xs text-slate-600">
                  <span>Concept {conceptId}</span>
                  <span>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function bandColor(band: StoredUnitResult["band"]): string {
  switch (band) {
    case "mastered":
      return "bg-green-100 text-green-700";
    case "needs_brush_up":
      return "bg-amber-100 text-amber-700";
    case "needs_reteach":
      return "bg-red-100 text-red-700";
  }
}
