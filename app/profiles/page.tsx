import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { signOut } from "@/app/login/actions";
import Logo from "@/components/Logo";
import { selectProfile, addProfile } from "./actions";

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { error } = await searchParams;
  const profiles = await db.studentProfile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo textClassName="text-3xl" className="h-14 w-14" />
        <p className="text-slate-600">Who&apos;s learning today?</p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          Add a name for the new profile first.
        </p>
      )}

      <div className="grid w-full max-w-sm gap-3">
        {profiles.map((profile) => (
          <form key={profile.id} action={selectProfile}>
            <input type="hidden" name="profileId" value={profile.id} />
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-left text-lg shadow-sm transition hover:border-brand-navy-light hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>
                {profile.avatarEmoji}
              </span>
              <span>{profile.displayName}</span>
            </button>
          </form>
        ))}
      </div>

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
