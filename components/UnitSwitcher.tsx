"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, ChevronDownIcon } from "./NavIcons";
import type { SwitcherGroup } from "@/lib/catalog";

// Persistent subject/unit switcher, always available from AppShell's header
// (2026-08-26) - a parent reported the app feeling like a separate silo per
// unit, since navigating into a test or exam page meant losing all
// navigation and having to go back to /select to reach a different unit.
// Same underlying routes/URLs as before (still bookmarkable, back/forward
// still works) - this just makes jumping between units possible from
// anywhere, without a bigger single-page-app rewrite.
export default function UnitSwitcher({ groups }: { groups: SwitcherGroup[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

  const currentUnitKey = pathname?.match(/^\/(?:learn|test|exam)\/([a-z0-9-]+)/)?.[1];
  const currentLabel = groups
    .flatMap((g) => g.units)
    .find((u) => u.unitKey === currentUnitKey)?.label;

  if (groups.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 lg:w-56"
      >
        <span className="text-slate-400">
          <BookIcon />
        </span>
        <span className="min-w-0 flex-1 truncate">{currentLabel || "Jump to a unit…"}</span>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+8px)] z-30 max-h-[70vh] w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-soft-lg"
        >
          {groups.map((g) => (
            <div key={g.subjectName} className="mb-1 last:mb-0">
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {g.subjectName}
              </p>
              {g.units.map((u) => (
                <Link
                  key={u.unitKey}
                  href={`/learn/${u.unitKey}`}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                    u.unitKey === currentUnitKey ? "bg-brand-navy text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {u.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
