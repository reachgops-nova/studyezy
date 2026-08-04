import { DEMO_PROFILES } from "@/lib/auth";
import { selectProfile } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">StudyEzy</h1>
        <p className="mt-2 text-slate-600">Pilot demo - choose who&apos;s learning today.</p>
      </div>

      <div className="grid w-full max-w-sm gap-3">
        {DEMO_PROFILES.map((profile) => (
          <form key={profile.id} action={selectProfile}>
            <input type="hidden" name="profileId" value={profile.id} />
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-left text-lg shadow-sm transition hover:border-blue-400 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>
                {profile.avatar_emoji}
              </span>
              <span>{profile.display_name}</span>
            </button>
          </form>
        ))}
      </div>

      <p className="max-w-sm text-center text-xs text-slate-400">
        Demo mode: no passwords, no personal data collected. Pick a profile to try the app end to end.
      </p>
    </main>
  );
}
