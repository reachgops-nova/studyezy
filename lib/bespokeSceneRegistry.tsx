import DecimalConceptScene, { type DecimalSceneVariant } from "@/components/interactive/DecimalConceptScene";
import NumberConceptScene from "@/components/interactive/NumberConceptScene";
import GeometryConceptScene from "@/components/interactive/GeometryConceptScene";
import { UNIT1_CONCEPT_SCENES } from "@/lib/unit1SceneSpecs";
import { UNIT2_CONCEPT_SCENES } from "@/lib/unit2SceneSpecs";
import { UNIT3_CONCEPT_SCENES } from "@/lib/unit3SceneSpecs";
import type { ReactNode } from "react";

// Central place to look up "what should Ezy show on screen while narrating
// this concept's checkpoints" across every unit that has a bespoke,
// NotebookLM-generated lesson (scenes + practice widget) - see
// WidgetDispatcher.tsx's BESPOKE_PLAYERS for the matching practice-widget
// side of the same per-unit registry. Kept as one small lookup per unit
// (rather than growing UnitView.tsx itself) so adding the next unit is a
// few lines here, not a UnitView.tsx edit - real user direction
// 2026-09-10: "start working on the other units... prepare those lessons
// for english and math cambridge."
const DECIMAL_PILOT_SCENES: DecimalSceneVariant[] = ['split', 'rodExample', 'placeValue', 'doorway'];

export function getCheckpointSceneNodes(unitKey: string | undefined, conceptId: string): (ReactNode | undefined)[] | undefined {
  if (!unitKey) return undefined;

  if (unitKey === 'cambridge-4-math-1') {
    if (conceptId === '1.1') {
      return DECIMAL_PILOT_SCENES.map((variant) => <DecimalConceptScene key={variant} variant={variant} />);
    }
    const specs = UNIT1_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-2') {
    const specs = UNIT2_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <GeometryConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-3') {
    const specs = UNIT3_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  return undefined;
}
