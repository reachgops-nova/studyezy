import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getUnit } from "@/lib/content";
import { LogoMark } from "@/components/Logo";
import TestRunner from "@/components/TestRunner";

export default async function TestPage({ params }: { params: Promise<{ unitId: string }> }) {
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

  return (
    <main className="mx-auto grid w-full max-w-3xl gap-6">
      <header>
        <Link
          href={`/learn/${unitId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
        >
          <LogoMark className="h-6 w-6" />
          &larr; Back to unit
        </Link>
        <h1 className="mt-2 text-2xl font-bold">
          Progression Test - Unit {unit.unit}: {unit.unit_title}
        </h1>
        {unit.progression_test_draft.note && (
          <p className="mt-1 text-sm text-slate-500">{unit.progression_test_draft.note}</p>
        )}
      </header>

      <TestRunner unit={unit} unitKey={unitId} />
    </main>
  );
}
