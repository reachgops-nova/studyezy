import Link from "next/link";
import Logo from "./Logo";
import AccountMenu from "./AccountMenu";
import { BookIcon, ChartIcon, ClipboardIcon } from "./NavIcons";

type NavKey = "select" | "dashboard" | "plan" | "manage" | "admin" | "admin-resources";

// Primary nav stays to the 3 things used every single day (Learn, Dashboard,
// Prep Plan) - everything else (switching kids, adding content, admin
// tools, signing out) lives in AccountMenu so the bar never grows past what
// fits cleanly in one row, even on a phone.
export default function AppHeader({
  profile,
  active,
  isAdmin,
}: {
  profile: { avatarEmoji: string; displayName: string };
  active?: NavKey;
  isAdmin?: boolean;
}) {
  const accountActive =
    active === "manage" || active === "admin" || active === "admin-resources" ? active : undefined;

  return (
    <header className="mb-6 flex items-center justify-between gap-2 border-b border-slate-200 pb-4">
      <Link href="/select" className="shrink-0" aria-label="StudyEzy home">
        <Logo className="h-8 sm:h-9" />
      </Link>

      <nav className="flex min-w-0 items-center gap-1 text-sm">
        <NavLink href="/select" isActive={active === "select"} icon={<BookIcon />}>
          Learn
        </NavLink>
        <NavLink href="/dashboard" isActive={active === "dashboard"} icon={<ChartIcon />}>
          Dashboard
        </NavLink>
        <NavLink href="/plan" isActive={active === "plan"} icon={<ClipboardIcon />}>
          Prep Plan
        </NavLink>
      </nav>

      <div className="shrink-0">
        <AccountMenu profile={profile} isAdmin={isAdmin} active={accountActive} />
      </div>
    </header>
  );
}

function NavLink({
  href,
  isActive,
  icon,
  children,
}: {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-medium transition sm:px-3 ${
        isActive ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <span className={isActive ? "text-white" : "text-slate-400"}>{icon}</span>
      {/* Visually hidden below sm (icon-only pill to save space), but
          always present for screen readers - not just dropped on mobile. */}
      <span className="sr-only sm:not-sr-only">{children}</span>
    </Link>
  );
}
