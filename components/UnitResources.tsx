import { RESOURCE_TYPE_LABELS } from "@/lib/unitResources";
import type { ResourceGroup } from "@/lib/queries/unitResources";
import ResourceUploadButton from "./ResourceUploadButton";

// Family-facing view of the admin-curated curriculum materials (PLATFORM_PLAN.md
// §2.7) - only ever shown the four "freezable" types (textbook/worksheet/
// classwork/homework). Once one is approved it's the single shared copy for
// every student of this grade+curriculum, so the upload control disappears;
// until then, a family can contribute one, which goes in as "pending" for an
// admin to review.
export default function UnitResources({ unitKey, groups }: { unitKey: string; groups: ResourceGroup[] }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold">Curriculum materials</h2>
      <p className="mt-1 text-sm text-slate-500">
        Shared, admin-approved textbook, worksheet, classwork, and homework pages for this unit.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.type} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-medium text-slate-700">{RESOURCE_TYPE_LABELS[group.type]}</h3>
              {group.approved.length === 0 && (
                <ResourceUploadButton unitKey={unitKey} resourceType={group.type} label="+ Add" />
              )}
            </div>

            {group.approved.length > 0 ? (
              <ul className="mt-2 grid gap-1">
                {group.approved.map((f) => (
                  <li key={f.id}>
                    <a
                      href={f.path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-brand-ink hover:underline"
                    >
                      ✓ {f.originalFilename}
                    </a>
                  </li>
                ))}
              </ul>
            ) : group.pending.length > 0 ? (
              <p className="mt-2 text-xs text-amber-600">
                {group.pending.length === 1 ? "1 upload" : `${group.pending.length} uploads`} waiting on admin
                review.
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-400">Not added yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
