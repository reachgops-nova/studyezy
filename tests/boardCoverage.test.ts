import { describe, expect, it } from "vitest";
import { BOARD_UNITS } from "../lib/boardUnits";

function hasBoardModel(frame: any): boolean {
  return Boolean(
    frame?.image || frame?.diagram || frame?.line || frame?.text || frame?.bar ||
      frame?.chart || frame?.timeline || frame?.shapes || frame?.arrows || frame?.dots,
  );
}

describe("RCRT_GUI_V1 topic coverage", () => {
  it("keeps every registered topic on the complete Board path", () => {
    for (const unit of Object.values(BOARD_UNITS)) {
      const ids = new Set(unit.concepts.map((concept) => concept.conceptId));
      const owned = (items: { conceptId?: string }[]) => items.filter((item) => item.conceptId).map((item) => item.conceptId!);
      const stepIds = new Set(owned(unit.conceptSteps));
      const guidedIds = new Set(owned(unit.guidedTasks));
      const reciteIds = new Set(owned(unit.recitePrompts));
      const writtenIds = new Set(owned(unit.writtenPractice));
      const testIds = new Set(owned([...unit.assessment.partA, ...unit.assessment.partB]));

      for (const concept of unit.concepts) {
        expect(stepIds.has(concept.conceptId), `${unit.unitKey} ${concept.conceptId} missing Read`).toBe(true);
        expect(guidedIds.has(concept.conceptId), `${unit.unitKey} ${concept.conceptId} missing Cover`).toBe(true);
        expect(reciteIds.has(concept.conceptId), `${unit.unitKey} ${concept.conceptId} missing Recite`).toBe(true);
        expect(writtenIds.has(concept.conceptId), `${unit.unitKey} ${concept.conceptId} missing written Recite`).toBe(true);
        expect(testIds.has(concept.conceptId), `${unit.unitKey} ${concept.conceptId} missing Test`).toBe(true);
        expect(unit.conceptSteps.some((step) => step.conceptId === concept.conceptId && hasBoardModel(step.frame)), `${unit.unitKey} ${concept.conceptId} missing visual/model`).toBe(true);
      }

      for (const item of [...unit.guidedTasks, ...unit.assessment.partA, ...unit.assessment.partB]) {
        expect(ids.has(item.conceptId), `${unit.unitKey} task points outside its topic set`).toBe(true);
      }
    }
  });
});
