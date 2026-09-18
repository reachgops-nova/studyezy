import { BOARD_UNITS } from "../lib/boardUnits";

const GENERIC_PROMPTS = [
  "Which idea is this practice for",
  "Which idea are you practising",
  "explore the move",
  "Move the point and describe",
];

const failures: string[] = [];
const cambridgeUnits = Object.entries(BOARD_UNITS).filter(([key]) => key.startsWith("cambridge-"));

for (const [unitKey, unit] of cambridgeUnits) {
  const conceptIds = new Set(unit.concepts.map((concept) => concept.conceptId));
  const stepsByConcept = new Set(unit.conceptSteps.map((step) => step.conceptId).filter(Boolean));
  const guidedByConcept = new Set(unit.guidedTasks.map((task) => task.conceptId));
  const testedByConcept = new Set([...unit.assessment.partA, ...unit.assessment.partB].map((task) => task.conceptId));
  const recitedByConcept = new Set(unit.recitePrompts.map((prompt) => prompt.conceptId));
  const writtenByConcept = new Set(unit.writtenPractice.map((practice) => practice.conceptId));

  if (!unit.concepts.length) failures.push(`${unitKey}: no concepts`);
  for (const concept of unit.concepts) {
    if (!stepsByConcept.has(concept.conceptId)) failures.push(`${unitKey}/${concept.conceptId}: no Read step`);
    if (!concept.examples.length) failures.push(`${unitKey}/${concept.conceptId}: no worked example`);
    if (!concept.quickCheck?.length) failures.push(`${unitKey}/${concept.conceptId}: no topic quick check`);
    if (!guidedByConcept.has(concept.conceptId)) failures.push(`${unitKey}/${concept.conceptId}: no Cover task`);
    if (!recitedByConcept.has(concept.conceptId)) failures.push(`${unitKey}/${concept.conceptId}: no Recite prompt`);
    if (!writtenByConcept.has(concept.conceptId)) failures.push(`${unitKey}/${concept.conceptId}: no written Recite practice`);
    if (!testedByConcept.has(concept.conceptId)) failures.push(`${unitKey}/${concept.conceptId}: no Test task`);
  }
  if (!testedByConcept.size) failures.push(`${unitKey}: no Test tasks`);
  const surfaced = JSON.stringify({ intro: unit.intro, concepts: unit.concepts, conceptSteps: unit.conceptSteps, guidedTasks: unit.guidedTasks, lab: unit.lab, assessment: unit.assessment });
  for (const phrase of GENERIC_PROMPTS) if (surfaced.includes(phrase)) failures.push(`${unitKey}: generic placeholder "${phrase}"`);

  if (unitKey === "cambridge-4-math-18") {
    const content = JSON.stringify(unit);
    for (const phrase of ["Lagos", "Delhi", "17:00", "11:20", "12:05"]) {
      if (!content.includes(phrase)) failures.push(`${unitKey}: missing concrete example marker ${phrase}`);
    }
  }

  if (unitKey === "cambridge-4-math-3") {
    const negativeTopic = unit.conceptSteps.find((step) => step.conceptId === "3.1");
    if ((negativeTopic?.frame.line?.min ?? 0) >= 0) failures.push(`${unitKey}/3.1: signed number line must include values below zero`);
    if (!JSON.stringify(unit).includes("−4") && !JSON.stringify(unit).includes("-4")) failures.push(`${unitKey}/3.1: missing negative-number worked example`);
  }

  if (new Set([...conceptIds, ...stepsByConcept, ...guidedByConcept]).size !== conceptIds.size) {
    failures.push(`${unitKey}: concept/step/task IDs are inconsistent`);
  }
}

console.log(`Audited ${cambridgeUnits.length} Cambridge Board units.`);
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: every concept has a Board step, worked example, quick check, Cover task, and Test coverage; no known generic placeholders surfaced.");
}
