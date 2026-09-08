import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { getModelPricing } from "@/lib/aiCost";
import AppShell from "@/components/AppShell";

const RANGES = {
  "24h": { label: "Last 24 hours", ms: 24 * 60 * 60 * 1000 },
  "7d": { label: "Last 7 days", ms: 7 * 24 * 60 * 60 * 1000 },
  "30d": { label: "Last 30 days", ms: 30 * 24 * 60 * 60 * 1000 },
  all: { label: "All time", ms: null },
} as const;
type RangeKey = keyof typeof RANGES;

function fmtUsd(n: number): string {
  return n < 0.01 ? `$${n.toFixed(6)}` : `$${n.toFixed(4)}`;
}
function fmtTokens(n: number): string {
  return n.toLocaleString("en-US");
}

export default async function AiCostsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { range: rangeParam } = await searchParams;
  const range: RangeKey = rangeParam && rangeParam in RANGES ? (rangeParam as RangeKey) : "7d";
  const since = RANGES[range].ms !== null ? new Date(Date.now() - RANGES[range].ms!) : undefined;

  const grouped = await db.aiCallLog.groupBy({
    by: ["feature", "model"],
    where: since ? { createdAt: { gte: since } } : undefined,
    _sum: { inputTokens: true, outputTokens: true, costUsd: true },
    _count: { _all: true },
  });

  const rows = grouped
    .map((g) => {
      const calls = g._count._all;
      const inputTokens = g._sum.inputTokens ?? 0;
      const outputTokens = g._sum.outputTokens ?? 0;
      const costUsd = g._sum.costUsd ?? 0;
      return {
        feature: g.feature,
        model: g.model,
        calls,
        inputTokens,
        outputTokens,
        costUsd,
        avgCostPerCall: calls > 0 ? costUsd / calls : 0,
      };
    })
    .sort((a, b) => b.costUsd - a.costUsd);

  const totals = rows.reduce(
    (acc, r) => ({
      calls: acc.calls + r.calls,
      inputTokens: acc.inputTokens + r.inputTokens,
      outputTokens: acc.outputTokens + r.outputTokens,
      costUsd: acc.costUsd + r.costUsd,
    }),
    { calls: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 }
  );

  // Real prioritization signal (the actual user ask: "whichever is best and
  // cheap should be prioritized first") - for any feature that has ACTUALLY
  // been served by more than one model in this window, show which one is
  // currently cheapest per call. Doesn't judge quality (that's a real,
  // separate tradeoff some call sites make on purpose - see e.g.
  // lib/groq.ts's groqMicroCheckGrade comment on why grading deliberately
  // isn't just cheapest-model-wins), only surfaces the real cost gap so
  // that judgment call can be made with real numbers instead of a guess.
  const byFeature = new Map<string, typeof rows>();
  for (const r of rows) {
    const list = byFeature.get(r.feature) ?? [];
    list.push(r);
    byFeature.set(r.feature, list);
  }
  const multiModelFeatures = Array.from(byFeature.entries())
    .filter(([, list]) => list.length > 1)
    .map(([feature, list]) => {
      const sorted = [...list].sort((a, b) => a.avgCostPerCall - b.avgCostPerCall);
      return { feature, cheapest: sorted[0], others: sorted.slice(1) };
    });

  const pricing = getModelPricing().sort((a, b) => a.outputPerMillion - b.outputPerMillion);

  return (
    <AppShell profile={profile} active="admin-ai-costs" isAdmin>
      <div>
        <h1 className="text-2xl font-bold">AI costs</h1>
        <p className="mt-1 text-slate-600">
          Real token usage and cost, broken down by feature and model - every AI call in the app logs itself here
          (see <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">lib/aiCost.ts</code>), not an estimate.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(RANGES) as RangeKey[]).map((key) => (
          <a
            key={key}
            href={`/admin/ai-costs?range=${key}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              range === key
                ? "border-brand-ink bg-brand-ink text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {RANGES[key].label}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total cost</p>
          <p className="mt-1 text-xl font-bold text-slate-800">{fmtUsd(totals.costUsd)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-slate-400">Calls</p>
          <p className="mt-1 text-xl font-bold text-slate-800">{fmtTokens(totals.calls)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-slate-400">Input tokens</p>
          <p className="mt-1 text-xl font-bold text-slate-800">{fmtTokens(totals.inputTokens)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-slate-400">Output tokens</p>
          <p className="mt-1 text-xl font-bold text-slate-800">{fmtTokens(totals.outputTokens)}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 text-sm text-slate-500 shadow-soft">
          No AI calls logged in this window yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-soft">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3 text-right">Calls</th>
                <th className="px-4 py-3 text-right">Input tokens</th>
                <th className="px-4 py-3 text-right">Output tokens</th>
                <th className="px-4 py-3 text-right">Avg cost / call</th>
                <th className="px-4 py-3 text-right">Total cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.feature}|${r.model}`} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{r.feature}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {r.model === "cache" ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        cache hit
                      </span>
                    ) : (
                      r.model
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">{fmtTokens(r.calls)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">{fmtTokens(r.inputTokens)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">{fmtTokens(r.outputTokens)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">{fmtUsd(r.avgCostPerCall)}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-800">{fmtUsd(r.costUsd)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-medium text-slate-800">
                <td className="px-4 py-3" colSpan={2}>
                  Total
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtTokens(totals.calls)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtTokens(totals.inputTokens)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtTokens(totals.outputTokens)}</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-right tabular-nums">{fmtUsd(totals.costUsd)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {multiModelFeatures.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="font-semibold text-amber-900">Same feature, more than one model in this window</h2>
          <p className="mt-1 text-sm text-amber-800">
            Real cost gap, not a guess - if the cheaper option isn&apos;t deliberately reserved for a quality-critical
            path (grading, answer verification), it should probably be the default.
          </p>
          <ul className="mt-2 grid gap-1 text-sm text-amber-900">
            {multiModelFeatures.map(({ feature, cheapest, others }) => (
              <li key={feature}>
                <strong>{feature}</strong>: {cheapest.model} averages {fmtUsd(cheapest.avgCostPerCall)}/call, vs{" "}
                {others.map((o) => `${o.model} at ${fmtUsd(o.avgCostPerCall)}`).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-soft">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-700">Model pricing reference</h2>
          <p className="text-xs text-slate-500">
            Every rate this app actually bills against (see{" "}
            <code className="rounded bg-white px-1 py-0.5">lib/aiCost.ts</code>), cheapest output first - the same
            table the numbers above are computed from.
          </p>
        </div>
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3 text-right">Input $/1M</th>
              <th className="px-4 py-3 text-right">Output $/1M</th>
            </tr>
          </thead>
          <tbody>
            {pricing.map((p) => (
              <tr key={p.model} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-800">{p.model}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600">${p.inputPerMillion.toFixed(3)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600">${p.outputPerMillion.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
