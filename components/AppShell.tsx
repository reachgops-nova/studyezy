import Link from "next/link";
import { LogoMark } from "./Logo";
import AccountMenu from "./AccountMenu";
import DesktopSidebar from "./DesktopSidebar";
import UnitSwitcher from "./UnitSwitcher";
import { BookIcon, ChartIcon, ClipboardIcon } from "./NavIcons";
import { getSwitcherGroups } from "@/lib/catalog";

type NavKey =
  | "select"
  | "dashboard"
  | "plan"
  | "manage"
  | "admin"
  | "admin-resources"
  | "admin-pricing"
  | "admin-compare"
  | "admin-content-packs"
  | "admin-ai-costs";

// Desktop (lg+): fixed left sidebar for primary nav + a slim top bar holding
// just the account menu ("topside configurations"), main content to the
// right. Below lg: the compact top-nav bar this app already used (icon
// pills + account menu) - a persistent left rail doesn't suit a
// mostly-phone, kid-facing app at narrow widths, per the "sidebar on large
// screens, top/bottom nav on small" pattern.
export default async function AppShell({
  profile,
  active,
  isAdmin,
  wide,
  children,
}: {
  profile: { avatarEmoji: string; displayName: string };
  active?: NavKey;
  isAdmin?: boolean;
  /**
   * Real feedback (2026-09-05): the lesson screen's 3-column layout was
   * capped to ~900px by this shell's own max-w-6xl (1152px) minus the
   * sidebar, even on a wide desktop monitor with room to spare. Sizing
   * pages (reading-width prose - dashboard, plan, admin) stay at max-w-6xl;
   * pass `wide` only for pages built to actually use extra width, like the
   * lesson view's 3 columns.
   */
  wide?: boolean;
  children: React.ReactNode;
}) {
  const switcherGroups = await getSwitcherGroups();
  const accountActive =
    active === "manage" ||
    active === "admin" ||
    active === "admin-resources" ||
    active === "admin-pricing" ||
    active === "admin-compare" ||
    active === "admin-content-packs" ||
    active === "admin-ai-costs"
      ? active
      : undefined;

  return (
    <div className={`mx-auto flex w-full lg:min-h-[calc(100vh-3rem)] lg:gap-8 ${wide ? "max-w-[1800px]" : "max-w-6xl"}`}>
      {/* Desktop sidebar - a client component so it can hold collapse state */}
      <DesktopSidebar switcherGroups={switcherGroups} active={active} isAdmin={isAdmin} profile={profile} />

      <div className="min-w-0 flex-1">
        {/* Mobile/tablet: the compact top-nav bar, plus the unit switcher on
            its own row - jumping straight to a different unit from a test/
            exam page shouldn't require going back to /select first. No
            border-bottom here on purpose - the unit switcher's own bordered
            pill already separates this block from page content below;
            stacking a full-width rule on top of that read as two competing
            boundaries rather than one. */}
        <header className="mb-5 lg:hidden">
          <div className="flex items-center justify-between gap-2">
            <Link href="/select" className="shrink-0" aria-label="StudyEzy home">
              <LogoMark className="h-8 w-8" />
            </Link>
            <nav className="flex min-w-0 items-center gap-1 text-sm">
              <NavPill href="/select" isActive={active === "select"} icon={<BookIcon />}>
                Learn
              </NavPill>
              <NavPill href="/dashboard" isActive={active === "dashboard"} icon={<ChartIcon />}>
                Dashboard
              </NavPill>
              <NavPill href="/plan" isActive={active === "plan"} icon={<ClipboardIcon />}>
                Prep Plan
              </NavPill>
            </nav>
            <div className="shrink-0">
              <AccountMenu profile={profile} isAdmin={isAdmin} active={accountActive} />
            </div>
          </div>
          <div className="mt-3">
            <UnitSwitcher groups={switcherGroups} />
          </div>
        </header>

        {/* Desktop: slim top bar - just the account/config menu (the unit
            switcher lives in the sticky sidebar instead, which stays
            visible on scroll, so it doesn't need repeating here). */}
        <div className="mb-6 hidden justify-end lg:flex">
          <AccountMenu profile={profile} isAdmin={isAdmin} active={accountActive} />
        </div>

        <main className="grid gap-6 pb-12">{children}</main>
      </div>
    </div>
  );
}

function NavPill({
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
        isActive ? "bg-brand-ink text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <span className={isActive ? "text-white" : "text-slate-400"}>{icon}</span>
      <span className="sr-only sm:not-sr-only">{children}</span>
    </Link>
  );
}
