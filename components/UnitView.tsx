"use client";

import { useState } from "react";
import type { CurriculumUnit } from "@/lib/types";
import VoiceQA from "./VoiceQA";

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
        <article className="grid gap-4">
          {selected.story_reference && (
            <p className="text-xs uppercase tracking-wide text-slate-400">
              From: {selected.story_reference.title}
            </p>
          )}

          <h2 className="text-xl font-semibold">{selected.concept_name}</h2>

          {selected.definition && <p className="text-slate-700">{selected.definition}</p>}

          {selected.key_points && selected.key_points.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500">Key points</h3>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                {selected.key_points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {selected.examples && selected.examples.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500">Examples</h3>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                {selected.examples.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {selected.tips_to_remember && selected.tips_to_remember.length > 0 && (
            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              {selected.tips_to_remember.map((t, i) => (
                <p key={i}>💡 {t}</p>
              ))}
            </div>
          )}

          <VoiceQA unitKey={unitKey} conceptId={selected.concept_id} conceptName={selected.concept_name} />

          {selected.reasoning_interview_prompts && selected.reasoning_interview_prompts.length > 0 && (
            <details className="rounded-lg border border-slate-200 p-3 text-sm">
              <summary className="cursor-pointer font-medium text-slate-600">
                Talk it through (optional)
              </summary>
              <ul className="mt-2 list-disc pl-5 text-slate-600">
                {selected.reasoning_interview_prompts.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </details>
          )}
        </article>
      )}
    </div>
  );
}
