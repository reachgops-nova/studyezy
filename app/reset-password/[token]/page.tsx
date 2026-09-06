import Link from "next/link";
import Logo from "@/components/Logo";
import { completePasswordReset } from "../actions";

const ERROR_MESSAGES: Record<string, string> = {
  weak_password: "Password needs to be at least 8 characters.",
  invalid_token: "This reset link is invalid, expired, or has already been used.",
};

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error } = await searchParams;

  // The token itself is only ever validated inside completePasswordReset
  // (on submit) - it stores just a SHA-256 hash, so there's nothing this
  // page can usefully pre-check without re-deriving that same hash; an
  // invalid/expired/reused token simply comes back as ?error=invalid_token
  // after submitting, same round-trip as any other form validation here.

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo textClassName="text-3xl" className="h-14 w-14" />
        <p className="text-slate-600">Set a new password.</p>
      </div>

      <form action={completePasswordReset} className="grid w-full max-w-sm gap-4">
        <input type="hidden" name="token" value={token} />
        {error && ERROR_MESSAGES[error] && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{ERROR_MESSAGES[error]}</p>
        )}

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          New password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            autoComplete="new-password"
          />
        </label>

        <button
          type="submit"
          className="rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-3 text-base font-medium text-white transition active:scale-95"
        >
          Set new password
        </button>
      </form>

      <p className="text-sm text-slate-500">
        <Link href="/login" className="font-medium text-brand-ink hover:underline">
          Back to sign in
        </Link>
      </p>
    </main>
  );
}
