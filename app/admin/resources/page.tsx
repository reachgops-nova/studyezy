import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { unitKey as buildUnitKey } from "@/lib/content";
import { db } from "@/lib/db";
import { getUnitResourceGroups, getAllPendingResources } from "@/lib/queries/unitResources";
import { getQuestionPaperSummaries } from "@/lib/queries/questionPapers";
import { RESOURCE_TYPE_LABELS, isFreezable } from "@/lib/unitResources";
import AppShell from "@/components/AppShell";
import ResourceUploadButton from "@/components/ResourceUploadButton";
import GeneratePaperButton from "@/components/GeneratePaperButton";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { approveResource, rejectResource } from "./actions";

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ unitKey?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { unitKey: selectedUnitKey } = await searchParams;
  const [catalog, pending] = await Promise.all([getCatalog(), getAllPendingResources()]);
  const unitOptions = catalog.flatMap((c) =>
    c.stages.flatMap((s) =>
      s.subjects.flatMap((subj) =>
        subj.units.map((u) => ({
          unitKey: buildUnitKey(c.id, s.id, subj.id, u.id),
          label: `${c.name} - ${s.label} - ${subj.name} - Unit ${u.id}: ${u.title}`,
        }))
      )
    )
  );

  const unitRow = selectedUnitKey ? await db.unit.findUnique({ where: { unitKey: selectedUnitKey } }) : null;
  const [groups, paperSummaries] = unitRow
    ? await Promise.all([getUnitResourceGroups(unitRow.id), getQuestionPaperSummaries(unitRow.id)])
    : [null, null];

  return (
    <AppShell profile={profile} active="admin-resources" isAdmin>
      <div>
        <h1 className="text-2xl font-bold">Curriculum materials</h1>
        <p className="mt-1 text-slate-600">
          Curate the canonical textbook, worksheets, classwork, and homework for a unit. Once you approve
          one, it&apos;s visible to every student of that grade and curriculum, and families stop seeing an
          upload button for that type - one shared copy is enough. Exam question papers and answer sheets
          stay open for families always, since those are each student&apos;s own practice attempt, not shared
          material.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Needs review, all units</h2>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            {pending.length} pending
          </span>
        </div>
        {pending.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">Nothing waiting on approval anywhere right now.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {pending.map((f) => (
              <li key={f.id} className="grid gap-1 rounded-xl bg-amber-50 px-3 py-2 text-sm sm:flex sm:items-center sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <a href={f.path} target="_blank" rel="noreferrer" className="truncate font-medium text-amber-900 hover:underline">
                    {f.originalFilename}
                  </a>
                  <p className="text-xs text-slate-500">
                    {RESOURCE_TYPE_LABELS[f.resourceType]} - {f.unitTitle} - uploaded by {f.uploadedByEmail}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={approveResource}>
                    <input type="hidden" name="id" value={f.id} />
                    <input type="hidden" name="unitKey" value={f.unitKey} />
                    <button type="submit" className="rounded-md bg-brand-navy px-2.5 py-1 text-xs font-medium text-white">
                      Approve
                    </button>
                  </form>
                  <form action={rejectResource}>
                    <input type="hidden" name="id" value={f.id} />
                    <input type="hidden" name="unitKey" value={f.unitKey} />
                    <button type="submit" className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">
                      Reject
                    </button>
                  </form>
                  <a
                    href={`/admin/resources?unitKey=${f.unitKey}`}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Jump to unit
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form method="get" className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Unit
          <select
            name="unitKey"
            defaultValue={selectedUnitKey ?? ""}
            className="min-w-[320px] rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Choose a unit...
            </option>
            {unitOptions.map((o) => (
              <option key={o.unitKey} value={o.unitKey}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 px-5 py-2.5 text-sm font-medium text-white transition active:scale-95">
          View
        </button>
      </form>

      {unitRow && paperSummaries && <GeneratePaperButton unitKey={unitRow.unitKey} summaries={paperSummaries} />}

      {unitRow && groups && (
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map((group) => {
            const frozen = isFreezable(group.type) && group.approved.length > 0;
            return (
              <div key={group.type} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800">
                    {RESOURCE_TYPE_LABELS[group.type]}
                    {frozen && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-green-700">
                        ✓ Shared system-wide
                      </span>
                    )}
                  </h2>
                  <ResourceUploadButton
                    unitKey={unitRow.unitKey}
                    resourceType={group.type}
                    label={group.approved.length > 0 ? "+ Replace/add" : "+ Upload & approve"}
                  />
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {isFreezable(group.type)
                    ? frozen
                      ? "Approved - family uploads for this type are now frozen for this unit."
                      : "Not yet approved - families can still contribute one."
                    : "Never frozen - each family's own upload is personal, not shared."}
                </p>

                {group.approved.length > 0 && (
                  <ul className="mt-3 grid gap-2">
                    {group.approved.map((f) => (
                      <li key={f.id} className="flex items-center justify-between gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm">
                        <a href={f.path} target="_blank" rel="noreferrer" className="truncate text-green-800 hover:underline">
                          ✓ {f.originalFilename}
                        </a>
                        <form action={rejectResource}>
                          <input type="hidden" name="id" value={f.id} />
                          <input type="hidden" name="unitKey" value={unitRow.unitKey} />
                          <ConfirmSubmitButton
                            confirmMessage="Remove this approved resource? Families will be able to upload a replacement."
                            className="shrink-0 text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </ConfirmSubmitButton>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}

                {group.pending.length > 0 && (
                  <ul className="mt-3 grid gap-2">
                    {group.pending.map((f) => (
                      <li key={f.id} className="grid gap-1 rounded-xl bg-amber-50 px-3 py-2 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <a href={f.path} target="_blank" rel="noreferrer" className="truncate text-amber-900 hover:underline">
                            {f.originalFilename}
                          </a>
                          <span className="shrink-0 text-xs text-amber-600">pending</span>
                        </div>
                        <p className="text-xs text-slate-500">Uploaded by {f.uploadedByEmail}</p>
                        <div className="flex gap-2">
                          <form action={approveResource}>
                            <input type="hidden" name="id" value={f.id} />
                            <input type="hidden" name="unitKey" value={unitRow.unitKey} />
                            <button
                              type="submit"
                              className="rounded-md bg-brand-navy px-2.5 py-1 text-xs font-medium text-white"
                            >
                              Approve
                            </button>
                          </form>
                          <form action={rejectResource}>
                            <input type="hidden" name="id" value={f.id} />
                            <input type="hidden" name="unitKey" value={unitRow.unitKey} />
                            <button
                              type="submit"
                              className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                              Reject
                            </button>
                          </form>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {group.approved.length === 0 && group.pending.length === 0 && (
                  <p className="mt-3 text-sm text-slate-400">Nothing uploaded yet.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
