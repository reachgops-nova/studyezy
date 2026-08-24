import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { unitKey as buildUnitKey, getUploadedPageStorageKeys } from "@/lib/content";
import { db } from "@/lib/db";
import AppShell from "@/components/AppShell";
import ContentPackForm, { type UnitOption } from "./ContentPackForm";

export default async function ContentPacksPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const catalog = await getCatalog();

  // Same "pre-fetch every available unit's per-unit data up front" pattern as
  // /admin/model-compare - small, fixed content scale today, avoids a second
  // server round-trip on every unit switch.
  const unitOptions: UnitOption[] = (
    await Promise.all(
      catalog.flatMap((c) =>
        c.stages.flatMap((s) =>
          s.subjects.flatMap((subj) =>
            subj.units
              .filter((u) => u.available)
              .map(async (u) => {
                const key = buildUnitKey(c.id, s.id, subj.id, u.id);
                const [pages, existingPacks] = await Promise.all([
                  getUploadedPageStorageKeys(key),
                  db.contentPack.findMany({
                    where: { unit: { unitKey: key } },
                    orderBy: { createdAt: "desc" },
                    select: {
                      packId: true,
                      status: true,
                      sheetsCount: true,
                      questionsCount: true,
                      needsHumanCount: true,
                      errorsCount: true,
                      warningsCount: true,
                      model: true,
                      createdAt: true,
                    },
                  }),
                ]);
                return {
                  unitKey: key,
                  label: `${c.name} - ${s.label} - ${subj.name} - Unit ${u.id}: ${u.title}`,
                  subject: subj.name,
                  board: "Cambridge",
                  stage: s.label,
                  book: u.title,
                  pages,
                  existingPacks: existingPacks.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() })),
                };
              })
          )
        )
      )
    )
  ).filter((u) => u.pages.length > 0);

  return (
    <AppShell profile={profile} active="admin-content-packs" isAdmin>
      <div>
        <h1 className="text-2xl font-bold">Content packs</h1>
        <p className="mt-1 text-slate-600">
          Converts real uploaded pages into <em>markable</em> content - each question carries a declarative check, so
          it can be scored, not just read aloud (see <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">content/HANDOFF.md</code>).
          This is a research/validation surface: nothing here is shown to students yet. Pick a few pages (3 is a good
          start), convert, then preview it exactly as a kid would see it.
        </p>
      </div>

      <ContentPackForm unitOptions={unitOptions} />
    </AppShell>
  );
}
