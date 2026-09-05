"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo, { LogoMark } from "./Logo";
import UnitSwitcher from "./UnitSwitcher";
import { BookIcon, ChartIcon, ClipboardIcon, FolderPlusIcon, ShieldIcon, ArchiveIcon, TagIcon, ScaleIcon, LayersIcon } from "./NavIcons";
import type { SwitcherGroup } from "@/lib/catalog";

type NavKey =
  | "select"
  | "dashboard"
  | "plan"
  | "manage"
  | "admin"
  | "admin-resources"
  | "admin-pricing"
  | "admin-compare"
  | "admin-content-packs";

const STORAGE_KEY = "studyezy_sidebar_collapsed";

// Split out of AppShell (which stays a server component fetching
// switcherGroups) so this one piece can hold client-side collapse state.
// Real feedback (2026-09-05): on the lesson screen this fixed 224px rail was
// competing with the lesson's own sidebar/textbook/chat columns for a
// student who wanted the lesson content, not navigation, to have the room.
// Collapsing to an icon rail (not fully hidden) keeps every link one click
// away instead of forcing a trip back through /select. Persisted so a kid
// who collapses it once doesn't have to redo it on every page.
export default function DesktopSidebar({
  switcherGroups,
  active,
  isAdmin,
  profile,
}: {
  switcherGroups: SwitcherGroup[];
  active?: NavKey;
  isAdmin?: boolean;
  profile: { avatarEmoji: string; displayName: string };
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // ignore - localStorage unavailable, stay expanded
    }
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <aside
      className={`hidden shrink-0 lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)] lg:flex-col lg:self-start transition-[width] duration-200 ${
        collapsed ? "lg:w-14" : "lg:w-56"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <Link href="/select" aria-label="StudyEzy home" className="min-w-0">
          {collapsed ? <LogoMark className="h-8 w-8" /> : <Logo textClassName="text-base" className="h-8" />}
        </Link>
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expand menu" : "Collapse menu - more room for the lesson"}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <span className={`text-xs transition-transform ${collapsed ? "rotate-180" : ""}`}>&#8249;</span>
        </button>
      </div>

      {!collapsed && (
        <div className="mt-6">
          <UnitSwitcher groups={switcherGroups} />
        </div>
      )}

      <nav className="mt-4 grid gap-1">
        <SidebarLink href="/select" isActive={active === "select"} icon={<BookIcon />} collapsed={collapsed}>
          Learn
        </SidebarLink>
        <SidebarLink href="/dashboard" isActive={active === "dashboard"} icon={<ChartIcon />} collapsed={collapsed}>
          Dashboard
        </SidebarLink>
        <SidebarLink href="/plan" isActive={active === "plan"} icon={<ClipboardIcon />} collapsed={collapsed}>
          Prep Plan
        </SidebarLink>
      </nav>

      <div className="mt-6 border-t border-slate-200 pt-6">
        {!collapsed && <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Manage</p>}
        <nav className="mt-2 grid gap-1">
          <SidebarLink href="/manage" isActive={active === "manage"} icon={<FolderPlusIcon />} collapsed={collapsed}>
            Add subject or unit
          </SidebarLink>
          {isAdmin && (
            <>
              <SidebarLink href="/admin" isActive={active === "admin"} icon={<ShieldIcon />} collapsed={collapsed}>
                Manage accounts
              </SidebarLink>
              <SidebarLink href="/admin/resources" isActive={active === "admin-resources"} icon={<ArchiveIcon />} collapsed={collapsed}>
                Curriculum materials
              </SidebarLink>
              <SidebarLink href="/admin/pricing" isActive={active === "admin-pricing"} icon={<TagIcon />} collapsed={collapsed}>
                Pricing
              </SidebarLink>
              <SidebarLink href="/admin/model-compare" isActive={active === "admin-compare"} icon={<ScaleIcon />} collapsed={collapsed}>
                Model comparison
              </SidebarLink>
              <SidebarLink
                href="/admin/content-packs"
                isActive={active === "admin-content-packs"}
                icon={<LayersIcon />}
                collapsed={collapsed}
              >
                Content packs
              </SidebarLink>
            </>
          )}
        </nav>
      </div>

      <div className="mt-auto flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white p-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base" aria-hidden>
          {profile.avatarEmoji}
        </span>
        {!collapsed && <span className="truncate text-sm font-medium text-slate-700">{profile.displayName}</span>}
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  isActive,
  icon,
  collapsed,
  children,
}: {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? String(children) : undefined}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
        collapsed ? "justify-center" : ""
      } ${isActive ? "bg-brand-ink text-white" : "text-slate-600 hover:bg-slate-100"}`}
    >
      <span className={isActive ? "text-white" : "text-slate-400"}>{icon}</span>
      {!collapsed && children}
    </Link>
  );
}
