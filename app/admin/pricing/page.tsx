import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/session";
import { getActiveProfile } from "@/lib/auth";
import { getAllPricingPlans, TRIAL_LENGTH_DAYS } from "@/lib/pricing";
import AppShell from "@/components/AppShell";
import { updatePricing } from "./actions";

const GRADE_BANDS = ["Grade 3-5", "Grade 6-8", "Grade 9-10", "Grade 11-12"];
const CURRICULA = ["Matric / State Board", "CBSE", "ICSE", "Cambridge IGCSE", "IB"];

export default async function AdminPricingPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const profile = await getActiveProfile();
  if (!profile) redirect("/profiles");

  const { saved } = await searchParams;
  const plans = await getAllPricingPlans();
  const byKey = new Map(plans.map((p) => [`${p.curriculumLabel}|${p.gradeBandLabel}`, p]));

  return (
    <AppShell profile={profile} active="admin-pricing" isAdmin>
      <div>
        <h1 className="text-2xl font-bold">Pricing</h1>
        <p className="mt-1 text-slate-600">
          What each subject costs per month, by grade and curriculum. Every new account gets a {TRIAL_LENGTH_DAYS}-day
          free trial from signup - once it ends, a family sees the price for their kid&apos;s grade here instead of
          the lesson. Admin accounts are never gated by the trial. Edit any cell and save - there&apos;s no payment
          collection wired up yet, so this only controls what price is shown, not billing.
        </p>
      </div>

      {saved && (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">Pricing updated.</p>
      )}

      <form action={updatePricing} className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Grade band</th>
              {CURRICULA.map((c) => (
                <th key={c} className="px-4 py-3">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GRADE_BANDS.map((band) => (
              <tr key={band} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-800">{band}</td>
                {CURRICULA.map((curriculum) => {
                  const plan = byKey.get(`${curriculum}|${band}`);
                  return (
                    <td key={curriculum} className="px-4 py-3">
                      {plan ? (
                        <label className="flex items-center gap-1 text-slate-600">
                          <span aria-hidden>₹</span>
                          <input
                            type="number"
                            name={`price_${plan.id}`}
                            defaultValue={plan.pricePerSubjectInr}
                            min={0}
                            step={1}
                            className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm tabular-nums"
                          />
                          <span className="text-xs text-slate-400">/mo</span>
                        </label>
                      ) : (
                        <span className="text-xs text-slate-300">not offered</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end border-t border-slate-100 p-4">
          <button
            type="submit"
            className="rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95"
          >
            Save pricing
          </button>
        </div>
      </form>
    </AppShell>
  );
}
