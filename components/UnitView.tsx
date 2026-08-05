"use client";

import { useState } from "react";
import type { CurriculumUnit } from "@/lib/types";
import AvatarChat from "./AvatarChat";
import UnitOverview from "./UnitOverview";
import UnitDiagnostic from "./UnitDiagnostic";

type Stage = "overview" | "diagnostic" | "lesson";

export default function UnitView({
  unit,
  unitKey,
  profileId,
}: {
  unit: CurriculumUnit;
  unitKey: string;
  profileId: string;
}) {
  const [stage, setStage] = useState<Stage>("overview");
  const [selectedId, setSelectedId] = useState(unit.concepts[0]?.concept_id);
  const selected = unit.concepts.find((c) => c.concept_id === selectedId);

  if (stage === "overview") {
    return (
      <UnitOverview
        unit={unit}
        onStartDiagnostic={() => setStage("diagnostic")}
        onSkipToTeaching={() => setStage("lesson")}
      />
    );
  }

  if (stage === "diagnostic") {
    return (
      <UnitDiagnostic
        unit={unit}
        unitKey={unitKey}
        profileId={profileId}
        onReviewConcept={(conceptId) => {
          setSelectedId(conceptId);
          setStage("lesson");
        }}
        onAllMastered={() => setStage("lesson")}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <nav className="grid gap-1">
        <button
          onClick={() => setStage("overview")}
          className="mb-2 rounded-lg px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-400 hover:text-slate-600"
        >
          &larr; Unit overview
        </button>
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
