import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { getUnit, unitKey as buildUnitKey } from "@/lib/content";
import AppShell from "@/components/AppShell";
import ModelCompareForm, { type UnitOption } from "./ModelCompareForm";

export default async function ModelComparePage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const catalog = await getCatalog();

  // Small, fixed content scale today (2 real units) - pre-fetching every
  // unit's concept list server-side avoids a second client round-trip per
  // unit change, and stays cheap even as a few more units get added.
  const unitOptions: UnitOption[] = (
    await Promise.all(
      catalog.flatMap((c) =>
        c.stages.flatMap((s) =>
          s.subjects.flatMap((subj) =>
            subj.units
              .filter((u) => u.available)
              .map(async (u) => {
                const key = buildUnitKey(c.id, s.id, subj.id, u.id);
                const fullUnit = await getUnit(c.id, s.id, subj.id, u.id);
                return {
                  unitKey: key,
                  label: `${c.name} - ${s.label} - ${subj.name} - Unit ${u.id}: ${u.title}`,
                  concepts: (fullUnit?.concepts ?? []).map((concept) => ({
                    id: concept.concept_id,
                    name: concept.concept_name,
                  })),
                };
              })
          )
        )
      )
    )
  ).filter((u) => u.concepts.length > 0);

  return (
    <AppShell profile={profile} active="admin-compare" isAdmin>
      <div>
        <h1 className="text-2xl font-bold">Model comparison</h1>
        <p className="mt-1 text-slate-600">
          Ask the same real question against the model currently used in production (
          <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">openai/gpt-oss-120b</code>) and against{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">qwen/qwen3.6-27b</code> (an open-source model,
          hosted on Groq - Railway has no GPU compute, so this is how an open-source model actually gets tried
          here) - side by side, with real latency and cost from that call, not an estimate. Admin-only, doesn&apos;t
          touch what students see or the answer cache.
        </p>
      </div>

      <ModelCompareForm unitOptions={unitOptions} />
    </AppShell>
  );
}
