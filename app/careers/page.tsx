import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getAvailableCareerPaths, getCareerInterestIdsForProfile, getLikelyGradeBand } from "@/lib/careers";
import type { CareerGradeGuidance } from "@/lib/careers";
import AppShell from "@/components/AppShell";
import { markCareerInterest } from "./actions";

export default async function CareersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const [paths, interestIds, currentBand] = await Promise.all([
    getAvailableCareerPaths(),
    getCareerInterestIdsForProfile(profile.id),
    getLikelyGradeBand(profile.id),
  ]);

  const byCategory = new Map<string, typeof paths>();
  for (const path of paths) {
    const list = byCategory.get(path.category) ?? [];
    list.push(path);
    byCategory.set(path.category, list);
  }

  return (
    <AppShell profile={profile} active="careers" isAdmin={user.role === "admin"}>
      <div>
        <h1 className="text-2xl font-bold">Career explorer</h1>
        <p className="mt-1 text-slate-600">
          A look at what grown-ups in different jobs actually do, and which school subjects help get there. Browse
          at your own pace - mark the ones you&apos;re curious about, nothing here is required.
        </p>
      </div>

      {[...byCategory.entries()].map(([category, list]) => (
        <div key={category} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <h2 className="font-semibold text-slate-800">{category}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {list.map((path) => {
              const isInterested = interestIds.has(path.id);
              const guidance = path.gradeGuidance as unknown as CareerGradeGuidance[];
              const currentGuidance = guidance.find((g) => g.band === currentBand);
              return (
                <div key={path.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-slate-800">{path.name}</h3>
                    <form action={markCareerInterest}>
                      <input type="hidden" name="careerPathId" value={path.id} />
                      <button
                        type="submit"
                        aria-pressed={isInterested}
                        title={isInterested ? "Marked as curious - click to unmark" : "Mark as curious"}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                          isInterested
                            ? "bg-amber-100 text-amber-700"
                            : "border border-slate-300 text-slate-500 hover:bg-white"
                        }`}
                      >
                        {isInterested ? "★ Curious" : "☆ Mark curious"}
                      </button>
                    </form>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">{path.summary}</p>
                  {path.keySkills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {path.keySkills.map((skill) => (
                        <span key={skill} className="rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-500 ring-1 ring-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {path.relatedSubjectSlugs.length > 0 && (
                    <p className="mt-2 text-xs text-slate-400">
                      Builds on: {path.relatedSubjectSlugs.join(", ")}
                    </p>
                  )}
                  {path.dayInLife && (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer font-medium text-brand-ink">What&apos;s a typical day like?</summary>
                      <p className="mt-1.5 text-slate-600">{path.dayInLife}</p>
                    </details>
                  )}

                  {isInterested && currentGuidance && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                        Right now ({currentGuidance.band})
                      </p>
                      {currentGuidance.focus && <p className="mt-1 text-sm text-amber-900">{currentGuidance.focus}</p>}
                      {currentGuidance.activities.length > 0 && (
                        <ul className="mt-1.5 list-disc pl-4 text-sm text-amber-800">
                          {currentGuidance.activities.map((a) => (
                            <li key={a}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {guidance.length > 0 && (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer font-medium text-brand-ink">See the full grade-by-grade roadmap</summary>
                      <div className="mt-1.5 grid gap-2">
                        {guidance.map((g) => (
                          <div key={g.band} className={`rounded-lg p-2 ${g.band === currentBand ? "bg-amber-50 ring-1 ring-amber-200" : "bg-white ring-1 ring-slate-200"}`}>
                            <p className="text-xs font-semibold text-slate-700">
                              {g.band}
                              {g.band === currentBand && <span className="ml-1.5 font-normal text-amber-600">(you are here)</span>}
                            </p>
                            {g.focus && <p className="mt-0.5 text-slate-600">{g.focus}</p>}
                            {g.activities.length > 0 && (
                              <ul className="mt-1 list-disc pl-4 text-slate-600">
                                {g.activities.map((a) => (
                                  <li key={a}>{a}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {paths.length === 0 && (
        <p className="text-sm text-slate-400">No career paths have been added yet.</p>
      )}
    </AppShell>
  );
}
