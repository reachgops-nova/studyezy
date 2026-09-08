"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { ChevronDownIcon, FolderPlusIcon, LogoutIcon, ShieldIcon, UsersIcon, ArchiveIcon, TagIcon, ScaleIcon, LayersIcon, CoinIcon } from "./NavIcons";

// Everything that isn't a daily-use action (Switch profile, adding
// content, admin tools, sign out) lives behind one clearly-labeled menu
// instead of competing with Learn/Dashboard/Prep Plan for space in the main
// nav row - a flat row of 7+ pills reads as cluttered, not "superior."
// Sign out gets its own visually separated section at the bottom, per
// standard destructive/account-exit-action placement.
export default function AccountMenu({
  profile,
  isAdmin,
  active,
}: {
  profile: { avatarEmoji: string; displayName: string };
  isAdmin?: boolean;
  active?:
    | "manage"
    | "admin"
    | "admin-resources"
    | "admin-pricing"
    | "admin-compare"
    | "admin-content-packs"
    | "admin-ai-costs";
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-base"
          aria-hidden
        >
          {profile.avatarEmoji}
        </span>
        <span className="hidden sm:inline">{profile.displayName}</span>
        <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-20 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft-lg"
        >
          <div className="grid gap-0.5 p-1.5">
            <MenuLink href="/profiles" icon={<UsersIcon />}>
              Switch profile
            </MenuLink>
            <MenuLink href="/manage" icon={<FolderPlusIcon />} isActive={active === "manage"}>
              Add subject or unit
            </MenuLink>
            {isAdmin && (
              <>
                <div className="my-1 border-t border-slate-100" />
                <MenuLink href="/admin" icon={<ShieldIcon />} isActive={active === "admin"}>
                  Manage accounts
                </MenuLink>
                <MenuLink href="/admin/resources" icon={<ArchiveIcon />} isActive={active === "admin-resources"}>
                  Curriculum materials
                </MenuLink>
                <MenuLink href="/admin/pricing" icon={<TagIcon />} isActive={active === "admin-pricing"}>
                  Pricing
                </MenuLink>
                <MenuLink href="/admin/model-compare" icon={<ScaleIcon />} isActive={active === "admin-compare"}>
                  Model comparison
                </MenuLink>
                <MenuLink
                  href="/admin/content-packs"
                  icon={<LayersIcon />}
                  isActive={active === "admin-content-packs"}
                >
                  Content packs
                </MenuLink>
                <MenuLink href="/admin/ai-costs" icon={<CoinIcon />} isActive={active === "admin-ai-costs"}>
                  AI costs
                </MenuLink>
              </>
            )}
          </div>
          <div className="border-t border-slate-100 p-1.5">
            <form action={signOut}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogoutIcon className="h-5 w-5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  isActive,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
        isActive ? "bg-brand-ink text-white" : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <span className={isActive ? "text-white" : "text-slate-400"}>{icon}</span>
      {children}
    </Link>
  );
}
