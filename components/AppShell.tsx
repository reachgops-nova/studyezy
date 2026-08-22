import Link from "next/link";
import Logo, { LogoMark } from "./Logo";
import AccountMenu from "./AccountMenu";
import { BookIcon, ChartIcon, ClipboardIcon, FolderPlusIcon, ShieldIcon, ArchiveIcon, TagIcon, ScaleIcon } from "./NavIcons";

type NavKey = "select" | "dashboard" | "plan" | "manage" | "admin" | "admin-resources" | "admin-pricing" | "admin-compare";

// Desktop (lg+): fixed left sidebar for primary nav + a slim top bar holding
// just the account menu ("topside configurations"), main content to the
// right. Below lg: the compact top-nav bar this app already used (icon
// pills + account menu) - a persistent left rail doesn't suit a
// mostly-phone, kid-facing app at narrow widths, per the "sidebar on large
// screens, top/bottom nav on small" pattern.
export default function AppShell({
  profile,
  active,
  isAdmin,
  children,
}: {
  profile: { avatarEmoji: string; displayName: string };
  active?: NavKey;
  isAdmin?: boolean;
  children: React.ReactNode;
}) {
  const accountActive =
    active === "manage" ||
    active === "admin" ||
    active === "admin-resources" ||
    active === "admin-pricing" ||
    active === "admin-compare"
      ? active
      : undefined;

  return (
    <div className="mx-auto flex w-full max-w-6xl lg:min-h-[calc(100vh-3rem)] lg:gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)] lg:w-56 lg:flex-col lg:self-start">
        <Link href="/select" aria-label="StudyEzy home">
          <Logo textClassName="text-base" className="h-8" />
        </Link>

        <nav className="mt-8 grid gap-1">
          <SidebarLink href="/select" isActive={active === "select"} icon={<BookIcon />}>
            Learn
          </SidebarLink>
          <SidebarLink href="/dashboard" isActive={active === "dashboard"} icon={<ChartIcon />}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/plan" isActive={active === "plan"} icon={<ClipboardIcon />}>
            Prep Plan
          </SidebarLink>
        </nav>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Manage</p>
          <nav className="mt-2 grid gap-1">
            <SidebarLink href="/manage" isActive={active === "manage"} icon={<FolderPlusIcon />}>
              Add subject or unit
            </SidebarLink>
            {isAdmin && (
              <>
                <SidebarLink href="/admin" isActive={active === "admin"} icon={<ShieldIcon />}>
                  Manage accounts
                </SidebarLink>
                <SidebarLink href="/admin/resources" isActive={active === "admin-resources"} icon={<ArchiveIcon />}>
                  Curriculum materials
                </SidebarLink>
                <SidebarLink href="/admin/pricing" isActive={active === "admin-pricing"} icon={<TagIcon />}>
                  Pricing
                </SidebarLink>
                <SidebarLink href="/admin/model-compare" isActive={active === "admin-compare"} icon={<ScaleIcon />}>
                  Model comparison
                </SidebarLink>
              </>
            )}
          </nav>
        </div>

        <div className="mt-auto flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-soft">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base" aria-hidden>
            {profile.avatarEmoji}
          </span>
          <span className="truncate text-sm font-medium text-slate-700">{profile.displayName}</span>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile/tablet: the compact top-nav bar */}
        <header className="mb-6 flex items-center justify-between gap-2 border-b border-slate-200 pb-4 lg:hidden">
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
        </header>

        {/* Desktop: slim top bar - just the account/config menu */}
        <div className="mb-6 hidden justify-end lg:flex">
          <AccountMenu profile={profile} isAdmin={isAdmin} active={accountActive} />
        </div>

        <main className="grid gap-6 pb-12">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({
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
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
        isActive ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <span className={isActive ? "text-white" : "text-slate-400"}>{icon}</span>
      {children}
    </Link>
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
        isActive ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <span className={isActive ? "text-white" : "text-slate-400"}>{icon}</span>
      <span className="sr-only sm:not-sr-only">{children}</span>
    </Link>
  );
}
