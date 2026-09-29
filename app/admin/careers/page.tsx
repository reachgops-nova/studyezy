import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getAllCareerPaths, getUnitPickerOptions, CAREER_GRADE_BANDS } from "@/lib/careers";
import type { CareerGradeGuidance } from "@/lib/careers";
import AppShell from "@/components/AppShell";
import { addCareerPath, toggleCareerPathAvailability, updateCareerPathUnits, removeCareerPath } from "./actions";

export default async function AdminCareersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const [paths, unitSubjects] = await Promise.all([getAllCareerPaths(), getUnitPickerOptions()]);
  const byCategory = new Map<string, typeof paths>();
  for (const path of paths) {
    const list = byCategory.get(path.category) ?? [];
    list.push(path);
    byCategory.set(path.category, list);
  }

  return (
    <AppShell profile={profile} active="admin-careers" isAdmin>
      <div>
        <h1 className="text-2xl font-bold">Career explorer paths</h1>
        <p className="mt-1 text-slate-600">
          A lightweight, browsable directory - kids opt in to mark paths they&apos;re curious about. No assessment
          gating yet; this is the v1 discussed for goal-based learning.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
        <h2 className="font-semibold text-slate-800">Add a career path</h2>
        <form action={addCareerPath} className="mt-3 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Name
              <input name="name" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. Veterinarian" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Category
              <input name="category" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. Health & Care" />
            </label>
          </div>
          <label className="text-sm font-medium text-slate-700">
            Summary
            <textarea name="summary" required rows={2} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="One or two sentences a kid would understand" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            What's a typical day like? (optional)
            <textarea name="dayInLife" rows={2} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Key skills (comma separated)
              <input name="keySkills" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Curiosity, Care for animals, Steady hands" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Related subjects (comma separated)
              <input name="relatedSubjectSlugs" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="science, math" />
            </label>
          </div>

          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-800">Grade-by-grade roadmap (optional)</p>
            <p className="mt-0.5 text-xs text-slate-500">
              What should a kid actually do at each stage to move toward this path? One focus line + a few concrete
              activities per band, one activity per line.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {CAREER_GRADE_BANDS.map((band) => (
                <div key={band} className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="text-xs font-semibold text-slate-700">{band}</p>
                  <input
                    name={`focus_${band}`}
                    placeholder="Focus for this stage"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                  />
                  <textarea
                    name={`activities_${band}`}
                    rows={3}
                    placeholder={"One activity per line"}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-800">Related lessons (optional)</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Real units already in the curriculum that build toward this path - shown as "open real lessons" when a
              kid marks this path curious, instead of a separate career-specific curriculum.
            </p>
            <UnitCheckboxes unitSubjects={unitSubjects} />
          </div>

          <button type="submit" className="w-fit rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95">
            Add career path
          </button>
        </form>
      </div>

      {[...byCategory.entries()].map(([category, list]) => (
        <div key={category} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <h2 className="font-semibold text-slate-800">{category}</h2>
          <ul className="mt-3 grid gap-2">
            {list.map((path) => {
              const relatedUnitIds = new Set(path.relatedUnitIds);
              return (
                <li key={path.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-medium text-slate-800">{path.name}</span>
                      <p className="text-xs text-slate-500">{path.summary}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          relatedUnitIds.size > 0 ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        lessons: {relatedUnitIds.size}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          (path.gradeGuidance as unknown as CareerGradeGuidance[]).length > 0
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        roadmap: {(path.gradeGuidance as unknown as CareerGradeGuidance[]).length}/{CAREER_GRADE_BANDS.length}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                          path.available ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {path.available ? "visible" : "hidden"}
                      </span>
                      <form action={toggleCareerPathAvailability}>
                        <input type="hidden" name="id" value={path.id} />
                        <input type="hidden" name="available" value={(!path.available).toString()} />
                        <button type="submit" className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white">
                          {path.available ? "Hide" : "Show"}
                        </button>
                      </form>
                      <form action={removeCareerPath}>
                        <input type="hidden" name="id" value={path.id} />
                        <button type="submit" className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>

                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-medium text-brand-ink">Edit related lessons</summary>
                    <form action={updateCareerPathUnits} className="mt-2">
                      <input type="hidden" name="id" value={path.id} />
                      <UnitCheckboxes unitSubjects={unitSubjects} selectedUnitIds={relatedUnitIds} />
                      <button type="submit" className="mt-2 rounded-md bg-brand-ink px-2.5 py-1 text-xs font-medium text-white">
                        Save lessons
                      </button>
                    </form>
                  </details>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {paths.length === 0 && <p className="text-sm text-slate-400">No career paths added yet.</p>}
    </AppShell>
  );
}

function UnitCheckboxes({
  unitSubjects,
  selectedUnitIds = new Set(),
}: {
  unitSubjects: { id: string; label: string; units: { id: string; number: number; title: string }[] }[];
  selectedUnitIds?: Set<string>;
}) {
  return (
    <div className="mt-3 grid gap-3">
      {unitSubjects.map((subject) => (
        <div key={subject.id}>
          <p className="text-xs font-semibold text-slate-600">{subject.label}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {subject.units.map((unit) => (
              <label
                key={unit.id}
                className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-600 has-[:checked]:border-brand-ink has-[:checked]:bg-brand-ink has-[:checked]:text-white"
              >
                <input type="checkbox" name="relatedUnitIds" value={unit.id} defaultChecked={selectedUnitIds.has(unit.id)} className="sr-only" />
                {unit.title}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
