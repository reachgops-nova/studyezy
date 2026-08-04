import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getUnit } from "@/lib/content";
import TestRunner from "@/components/TestRunner";

export default async function TestPage({ params }: { params: Promise<{ unitId: string }> }) {
  const profile = await getActiveProfile();
  if (!profile) redirect("/login");

  const { unitId } = await params;
  const parts = unitId.split("-");
  if (parts.length !== 4) notFound();
  const [curriculumId, stageIdStr, subjectId, unitIdStr] = parts;
  const unit = getUnit(curriculumId, Number(stageIdStr), subjectId, Number(unitIdStr));
  if (!unit) notFound();

  return (
    <main className="grid gap-6">
      <header>
        <Link href={`/learn/${unitId}`} className="text-sm text-slate-500 hover:underline">
          &larr; Back to unit
        </Link>
        <h1 className="mt-1 text-2xl font-bold">
          Progression Test - Unit {unit.unit}: {unit.unit_title}
        </h1>
        {unit.progression_test_draft.note && (
          <p className="mt-1 text-sm text-slate-500">{unit.progression_test_draft.note}</p>
        )}
      </header>

      <TestRunner unit={unit} unitKey={unitId} profileId={profile.id} />
    </main>
  );
}
