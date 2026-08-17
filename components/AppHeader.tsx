import Link from "next/link";
import Logo from "./Logo";

type NavKey = "select" | "dashboard" | "plan" | "manage" | "admin" | "admin-resources";

export default function AppHeader({
  profile,
  active,
  isAdmin,
}: {
  profile: { avatarEmoji: string; displayName: string };
  active?: NavKey;
  isAdmin?: boolean;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <Link href="/select" className="shrink-0">
        <Logo />
      </Link>

      <nav className="flex flex-wrap items-center gap-1 text-sm">
        <span className="mr-2 hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-slate-600 sm:inline-flex">
          <span aria-hidden>{profile.avatarEmoji}</span> {profile.displayName}
        </span>
        <NavLink href="/select" isActive={active === "select"}>
          Learn
        </NavLink>
        <NavLink href="/dashboard" isActive={active === "dashboard"}>
          Dashboard
        </NavLink>
        <NavLink href="/plan" isActive={active === "plan"}>
          Prep Plan
        </NavLink>
        <NavLink href="/manage" isActive={active === "manage"}>
          + Add subject or unit
        </NavLink>
        {isAdmin && (
          <>
            <NavLink href="/admin" isActive={active === "admin"}>
              Admin
            </NavLink>
            <NavLink href="/admin/resources" isActive={active === "admin-resources"}>
              Curriculum materials
            </NavLink>
          </>
        )}
        <Link
          href="/profiles"
          className="rounded-full px-3 py-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          Switch profile
        </Link>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 font-medium transition ${
        isActive ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </Link>
  );
}
