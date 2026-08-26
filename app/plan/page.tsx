import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveProfile } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { getPrepPlan } from "@/lib/queries/prepPlanner";
import AppShell from "@/components/AppShell";
import VocabPractice from "@/components/VocabPractice";

export default async function PlanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const items = await getPrepPlan(profile.id);

  return (
    <AppShell profile={profile} active="plan" isAdmin={user.role === "admin"}>
      <div>
        <h1 className="text-2xl font-bold">This week&apos;s prep plan</h1>
        <p className="mt-1 text-slate-600">
          Not a to-do list - just the handful of things worth 20 minutes each this week, based on how
          {" "}{profile.displayName}&apos;s actually been doing.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Nothing urgent right now - either everything&apos;s mastered, or there&apos;s no test history yet. Take a
          progression test to get a plan tailored to what actually needs review.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.conceptId}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft"
            >
              <div>
                <span
                  className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    item.band === "needs_reteach" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.band === "needs_reteach" ? "Needs reteach" : "Needs brush-up"}
                </span>
                <p className="font-medium text-slate-800">
                  {item.conceptKey} {item.conceptName}
                </p>
                <p className="text-xs text-slate-400">{item.unitTitle}</p>
                <p className="mt-1 text-sm text-slate-600">{item.reason}</p>
              </div>
              <Link
                href={`/learn/${item.unitKey}`}
                className="shrink-0 rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 hover:brightness-110"
              >
                Practice this
              </Link>
            </div>
          ))}
        </div>
      )}

      <VocabPractice />
    </AppShell>
  );
}
