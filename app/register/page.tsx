import Link from "next/link";
import Logo from "@/components/Logo";
import { register } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_email: "That doesn't look like a valid email address.",
  weak_password: "Password needs to be at least 8 characters.",
  missing_kid_name: "Add the name of the kid who'll be learning.",
  email_taken: "An account with that email already exists - try signing in instead.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo className="h-14 w-14" textClassName="text-3xl" />
        <p className="text-slate-600">Create an account to get started.</p>
      </div>

      <form action={register} className="grid w-full max-w-sm gap-4">
        {error && ERROR_MESSAGES[error] && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{ERROR_MESSAGES[error]}</p>
        )}

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Your email
          <input
            type="email"
            name="email"
            required
            className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            autoComplete="email"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            autoComplete="new-password"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Your kid&apos;s name
          <input
            type="text"
            name="kidName"
            required
            placeholder="e.g. Aarav"
            className="rounded-xl border border-slate-300 px-3 py-2 text-base"
          />
        </label>

        <button type="submit" className="rounded-full bg-brand-navy px-5 py-3 text-base font-medium text-white transition active:scale-95">
          Create account
        </button>
      </form>

      <p className="text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-navy hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
