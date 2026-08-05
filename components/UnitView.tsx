"use client";

import { useState } from "react";
import type { CurriculumUnit } from "@/lib/types";
import AvatarChat from "./AvatarChat";

export default function UnitView({ unit, unitKey }: { unit: CurriculumUnit; unitKey: string }) {
  const [selectedId, setSelectedId] = useState(unit.concepts[0]?.concept_id);
  const selected = unit.concepts.find((c) => c.concept_id === selectedId);

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <nav className="grid gap-1">
        {unit.concepts.map((c) => (
          <button
            key={c.concept_id}
            onClick={() => setSelectedId(c.concept_id)}
            className={`rounded-lg px-3 py-2 text-left text-sm ${
              c.concept_id === selectedId ? "bg-blue-600 text-white" : "hover:bg-slate-100"
            }`}
          >
            {c.concept_id} {c.concept_name}
          </button>
        ))}
        {unit.remaining_unit_outline.map((c) => (
          <div
            key={c.concept_id}
            className="rounded-lg px-3 py-2 text-left text-sm text-slate-400"
            title="Not built yet"
          >
            {c.concept_id} {c.concept_name} <span className="text-[10px] uppercase">soon</span>
          </div>
        ))}
      </nav>

      {selected && (
        <div className="grid gap-2">
          {selected.story_reference && (
            <p className="text-xs uppercase tracking-wide text-slate-400">
              From: {selected.story_reference.title}
            </p>
          )}
          <AvatarChat key={selected.concept_id} unitKey={unitKey} concept={selected} />
        </div>
      )}
    </div>
  );
}
