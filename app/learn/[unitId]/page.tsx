import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit, getUploadedPageImages } from "@/lib/content";
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

  return (
    <main className="grid gap-6">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/select" className="text-sm text-slate-500 hover:underline">
            &larr; Change unit
          </Link>
          <h1 className="mt-1 text-2xl font-bold">
            Unit {unit.unit}: {unit.unit_title}
          </h1>
          <p className="text-sm text-slate-500">
            {unit.subject} - {unit.curriculum}
          </p>
        </div>
        <Link
          href={`/test/${unitId}`}
          className="rounded-lg border border-test-border bg-test-bg px-4 py-2 text-sm font-medium text-test-accent"
        >
          Take Progression Test
        </Link>
      </header>

      <UnitView unit={unit} unitKey={unitId} initialPageImages={pageImages} />
    </main>
  );
}
