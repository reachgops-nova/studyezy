import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import AppShell from "@/components/AppShell";
import { getActiveProfile } from "@/lib/auth";
import { COMPLETED_PILOTS } from "@/lib/completedPilots";

/**
 * A quick way for one reviewer to jump straight to a finished concept
 * instead of clicking through a unit's unfinished topics to find it.
 *
 * Deliberately restricted to one named account, not the admin role - real
 * user direction 2026-09-21: "only for Admin reachgops@gmail.com for other
 * it can be as-is." Everyone else, admins included, gets a 404 here; the
 * rest of the app is completely unaffected either way.
 */
const OWNER_EMAIL = "reachgops@gmail.com";

export default async function CompletedPilotsPage() {
  const user = await getCurrentUser();
  if (!user || user.email.toLowerCase() !== OWNER_EMAIL) redirect("/select");

  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const bySubject = COMPLETED_PILOTS.reduce<Record<string, typeof COMPLETED_PILOTS>>((acc, pilot) => {
    (acc[pilot.subject] ??= []).push(pilot);
    return acc;
  }, {});

  return (
    <AppShell profile={{ avatarEmoji: profile.avatarEmoji, displayName: profile.displayName }} active="admin">
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-bold text-slate-900">Completed pilots</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every concept below has the full template: watched, not just read; a real drag-it-yourself task; a
          diagnosed wrong answer; recite examples different from the ones taught. Everything else in these units is
          still the generic scaffold - this list is only what to actually test.
        </p>

        <div className="mt-8 space-y-8">
          {Object.entries(bySubject).map(([subject, pilots]) => (
            <div key={subject}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{subject}</h2>
              <div className="mt-2 space-y-2">
                {pilots.map((pilot) => (
                  <a
                    key={`${pilot.unitKey}-${pilot.conceptId}`}
                    href={`/board/${pilot.unitKey}?concept=${encodeURIComponent(pilot.conceptId)}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors hover:border-slate-400"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {pilot.conceptId} · {pilot.conceptTitle}
                      </div>
                      <div className="text-sm text-slate-500">{pilot.unitTitle}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-slate-400">added {pilot.addedOn}</span>
                      <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white">Open →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {COMPLETED_PILOTS.length === 0 && <p className="mt-8 text-sm text-slate-500">Nothing finished yet.</p>}
      </div>
    </AppShell>
  );
}
