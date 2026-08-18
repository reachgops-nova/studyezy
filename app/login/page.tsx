import Link from "next/link";
import Logo from "@/components/Logo";
import { authenticate } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo className="h-14 w-14" textClassName="text-3xl" />
        <p className="text-slate-600">Sign in to continue.</p>
      </div>

      <form action={authenticate} className="grid w-full max-w-sm gap-4">
        {error === "invalid_credentials" && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            That email and password combination doesn&apos;t match an account.
          </p>
        )}

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Email
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
            className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="rounded-full bg-brand-navy px-5 py-3 text-base font-medium text-white transition active:scale-95">
          Sign in
        </button>
      </form>

      <p className="text-sm text-slate-500">
        New here?{" "}
        <Link href="/register" className="font-medium text-brand-navy hover:underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
