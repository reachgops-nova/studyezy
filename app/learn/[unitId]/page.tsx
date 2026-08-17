import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit, getUploadedPageImages } from "@/lib/content";
import { getUnitResourceGroupsByKey } from "@/lib/queries/unitResources";
import { FREEZABLE_TYPES } from "@/lib/unitResources";
import { LogoMark } from "@/components/Logo";
import UnitView from "@/components/UnitView";

export default async function LearnPage({ params }: { params: Promise<{ unitId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { unitId } = await params;
  const parts = unitId.split("-");
  if (parts.length !== 4) notFound();
  const [curriculumId, stageIdStr, subjectId, unitIdStr] = parts;
  const unit = await getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) notFound();

  const pageImages = await getUploadedPageImages(unitId);
  const resourceGroups = (await getUnitResourceGroupsByKey(unitId)).filter((g) =>
    (FREEZABLE_TYPES as string[]).includes(g.type)
  );

  return (
    <main className="grid gap-6">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/select" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
            <LogoMark className="h-6 w-6" />
            &larr; Change unit
          </Link>
          <h1 className="mt-2 text-2xl font-bold">
            Unit {unit.unit}: {unit.unit_title}
          </h1>
          <p className="text-sm text-slate-500">
            {unit.subject} - {unit.curriculum}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href={`/exam/${unitId}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Written exam practice
          </Link>
          <Link
            href={`/test/${unitId}`}
            className="rounded-lg border border-test-border bg-test-bg px-4 py-2 text-center text-sm font-medium text-test-accent"
          >
            Take Progression Test
          </Link>
        </div>
      </header>

      <UnitView unit={unit} unitKey={unitId} initialPageImages={pageImages} resourceGroups={resourceGroups} />
    </main>
  );
}
