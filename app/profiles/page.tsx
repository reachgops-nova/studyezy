import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getAssignableStages } from "@/lib/catalog";
import { signOut } from "@/app/login/actions";
import Logo from "@/components/Logo";
import { selectProfile, addProfile, setAssignedStage } from "./actions";

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { error } = await searchParams;
  const [profiles, assignableStages] = await Promise.all([
    db.studentProfile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    }),
    getAssignableStages(),
  ]);

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo textClassName="text-3xl" className="h-14 w-14" />
        <p className="text-slate-600">Who&apos;s learning today?</p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error === "unknown_stage"
            ? "That book couldn't be found - please pick from the list."
            : "Add a name for the new profile first."}
        </p>
      )}

      <div className="grid w-full max-w-sm gap-3">
        {profiles.map((profile) => (
          <div key={profile.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <form action={selectProfile}>
              <input type="hidden" name="profileId" value={profile.id} />
              <button
                type="submit"
                className="flex w-full items-center gap-3 px-5 py-4 text-left text-lg transition hover:bg-slate-50"
              >
                <span className="text-2xl" aria-hidden>
                  {profile.avatarEmoji}
                </span>
                <span>{profile.displayName}</span>
              </button>
            </form>
            <form
              action={setAssignedStage}
              className="flex items-center gap-2 border-t border-slate-100 px-5 py-2.5"
            >
              <input type="hidden" name="profileId" value={profile.id} />
              <label htmlFor={`stage-${profile.id}`} className="shrink-0 text-xs text-slate-400">
                Book:
              </label>
              <select
                id={`stage-${profile.id}`}
                name="stageId"
                defaultValue={profile.assignedStageId ?? ""}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
              >
                <option value="">Browse freely (no fixed book)</option>
                {assignableStages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="shrink-0 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Save
              </button>
            </form>
          </div>
        ))}
      </div>
      <p className="-mt-4 max-w-sm text-center text-xs text-slate-400">
        Setting a book keeps a kid on the right grade&apos;s content even if it&apos;s different from their
        usual class - like a Grade 4 kid working from the Grade 5 book.
      </p>

      <form action={addProfile} className="flex w-full max-w-sm gap-2">
        <input
          type="text"
          name="displayName"
          placeholder="Add another kid's name"
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Add
        </button>
      </form>

      <form action={signOut}>
        <button type="submit" className="text-sm text-slate-500 hover:underline">
          Sign out
        </button>
      </form>
    </main>
  );
}
