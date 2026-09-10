import DecimalConceptScene, { type DecimalSceneVariant } from "@/components/interactive/DecimalConceptScene";
import NumberConceptScene from "@/components/interactive/NumberConceptScene";
import GeometryConceptScene from "@/components/interactive/GeometryConceptScene";
import StatisticsConceptScene from "@/components/interactive/StatisticsConceptScene";
import { UNIT1_CONCEPT_SCENES } from "@/lib/unit1SceneSpecs";
import { UNIT2_CONCEPT_SCENES } from "@/lib/unit2SceneSpecs";
import { UNIT3_CONCEPT_SCENES } from "@/lib/unit3SceneSpecs";
import { UNIT4_CONCEPT_SCENES } from "@/lib/unit4SceneSpecs";
import { UNIT5_CONCEPT_SCENES } from "@/lib/unit5SceneSpecs";
import { UNIT6_CONCEPT_SCENES } from "@/lib/unit6SceneSpecs";
import { UNIT7_CONCEPT_SCENES } from "@/lib/unit7SceneSpecs";
import { UNIT8_CONCEPT_SCENES } from "@/lib/unit8SceneSpecs";
import { UNIT9_CONCEPT_SCENES } from "@/lib/unit9SceneSpecs";
import { UNIT10_CONCEPT_SCENES } from "@/lib/unit10SceneSpecs";
import { UNIT11_CONCEPT_SCENES } from "@/lib/unit11SceneSpecs";
import { getUnit12ConceptScenes } from "@/lib/unit12SceneSpecs";
import { UNIT13_CONCEPT_SCENES } from "@/lib/unit13SceneSpecs";
import { getUnit14ConceptScenes } from "@/lib/unit14SceneSpecs";
import { UNIT15_CONCEPT_SCENES } from "@/lib/unit15SceneSpecs";
import { getEnglishUnit1ConceptScenes } from "@/lib/englishUnit1SceneSpecs";
import { getEnglishUnit2ConceptScenes } from "@/lib/englishUnit2SceneSpecs";
import { getEnglishUnit3ConceptScenes } from "@/lib/englishUnit3SceneSpecs";
import { getEnglishUnit4ConceptScenes } from "@/lib/englishUnit4SceneSpecs";
import { getUnit16ConceptScenes } from "@/lib/unit16SceneSpecs";
import { UNIT17_CONCEPT_SCENES } from "@/lib/unit17SceneSpecs";
import { UNIT18_CONCEPT_SCENES } from "@/lib/unit18SceneSpecs";
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

  if (unitKey === 'cambridge-4-math-4') {
    const specs = UNIT4_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-5') {
    const specs = UNIT5_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <StatisticsConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-6') {
    const specs = UNIT6_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-7') {
    const specs = UNIT7_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-8') {
    const specs = UNIT8_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <StatisticsConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-9') {
    const specs = UNIT9_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-10') {
    const specs = UNIT10_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <GeometryConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-11') {
    const specs = UNIT11_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-12') {
    return getUnit12ConceptScenes(conceptId);
  }

  if (unitKey === 'cambridge-4-math-13') {
    const specs = UNIT13_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-14') {
    return getUnit14ConceptScenes(conceptId);
  }

  if (unitKey === 'cambridge-4-math-15') {
    const specs = UNIT15_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-5-english-1') {
    return getEnglishUnit1ConceptScenes(conceptId);
  }

  if (unitKey === 'cambridge-5-english-2') {
    return getEnglishUnit2ConceptScenes(conceptId);
  }

  if (unitKey === 'cambridge-5-english-3') {
    return getEnglishUnit3ConceptScenes(conceptId);
  }

  if (unitKey === 'cambridge-5-english-4') {
    return getEnglishUnit4ConceptScenes(conceptId);
  }

  if (unitKey === 'cambridge-4-math-16') {
    return getUnit16ConceptScenes(conceptId);
  }

  if (unitKey === 'cambridge-4-math-17') {
    const specs = UNIT17_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  if (unitKey === 'cambridge-4-math-18') {
    const specs = UNIT18_CONCEPT_SCENES[conceptId];
    if (specs) return specs.map((spec, i) => <NumberConceptScene key={i} spec={spec} />);
  }

  return undefined;
}
