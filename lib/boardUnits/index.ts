import type { BoardFrame, BoardTask, BoardUnit, RecitePrompt, WrittenPractice } from "./types";
import { STAGE_PREVIEWS } from "./stage-previews";
import { CAMBRIDGE_4_MATH_1 } from "./cambridge-4-math-1";
import { CAMBRIDGE_4_MATH_2 } from "./cambridge-4-math-2";
import { CAMBRIDGE_4_MATH_10 } from "./cambridge-4-math-10";
import { CAMBRIDGE_5_ENGLISH_1 } from "./cambridge-5-english-1";
import { CAMBRIDGE_5_ENGLISH_2 } from "./cambridge-5-english-2";
import { CAMBRIDGE_5_ENGLISH_3 } from "./cambridge-5-english-3";
import { PENDING_MATH_BOARD_UNITS } from "./cambridge-4-math-pending";
import { PENDING_ENGLISH_BOARD_UNITS } from "./cambridge-5-english-pending";
import { TAMILNADU_9_SCIENCE_1 } from "./tamilnadustateboard-9-science-1";

/**
 * Every unit that has a Drawing Board, keyed by unitKey. Adding a unit is
 * adding a data file and one line here - see ./types.ts for why that boundary
 * is drawn where it is.
 */
const RAW_BOARD_UNITS: Record<string, BoardUnit> = {
  [STAGE_PREVIEWS.unitKey]: STAGE_PREVIEWS,
  [CAMBRIDGE_4_MATH_1.unitKey]: CAMBRIDGE_4_MATH_1,
  [CAMBRIDGE_4_MATH_2.unitKey]: CAMBRIDGE_4_MATH_2,
  [CAMBRIDGE_4_MATH_10.unitKey]: CAMBRIDGE_4_MATH_10,
  [CAMBRIDGE_5_ENGLISH_1.unitKey]: CAMBRIDGE_5_ENGLISH_1,
  [CAMBRIDGE_5_ENGLISH_2.unitKey]: CAMBRIDGE_5_ENGLISH_2,
  [CAMBRIDGE_5_ENGLISH_3.unitKey]: CAMBRIDGE_5_ENGLISH_3,
  ...PENDING_MATH_BOARD_UNITS,
  ...PENDING_ENGLISH_BOARD_UNITS,
  [TAMILNADU_9_SCIENCE_1.unitKey]: TAMILNADU_9_SCIENCE_1,
};

/**
 * Keep a static visual file safe even when its DB source has not been
 * attached yet. A concept must never silently skip a Read step, topic check,
 * or Cover question. When DB content is present, curriculumAdapter replaces
 * these small safety-net tasks with the real textbook examples.
 */
function completeBoardUnit(unit: BoardUnit): BoardUnit {
  const frameFor = (conceptId: string): BoardFrame => unit.conceptSteps.find((step) => step.conceptId === conceptId)?.frame ?? {};
  const taskFor = (conceptId: string, title: string, prompt: string): BoardTask => {
    const concept = unit.concepts.find((item) => item.conceptId === conceptId);
    const frame = frameFor(conceptId);
    return {
      title,
      conceptId,
      prompt,
      setup: frame,
      options: [
        { label: `I can explain ${concept?.title ?? conceptId}`, correct: true, say: `Good. Explain the rule and check it against the example.`, frame },
        { label: "I need another walkthrough", correct: false, say: `Return to the Read step, then try the example again.`, frame },
      ],
    };
  };
  const missingConcepts = unit.concepts.filter((concept) => !unit.conceptSteps.some((step) => step.conceptId === concept.conceptId));
  const missingGuided = unit.concepts.filter((concept) => !unit.guidedTasks.some((task) => task.conceptId === concept.conceptId));
  const words = (text: string) => new Set(text.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter((word) => word.length > 2));
  const conceptWords = unit.concepts.map((concept) => words([
    concept.title,
    concept.summary,
    ...concept.keyPoints,
    ...concept.examples.flatMap((example) => [example.question, example.answer]),
  ].join(" ")));
  const ownerFor = (text: string, index: number, counts: number[]): string => {
    const itemWords = words(text);
    let bestIndex = -1;
    let bestScore = 0;
    conceptWords.forEach((candidate, candidateIndex) => {
      let score = 0;
      for (const word of itemWords) if (candidate.has(word)) score++;
      if (score > bestScore || (score === bestScore && score > 0 && counts[candidateIndex] < counts[bestIndex] )) {
        bestScore = score;
        bestIndex = candidateIndex;
      }
    });
    if (bestIndex < 0) bestIndex = index % Math.max(1, unit.concepts.length);
    counts[bestIndex]++;
    return unit.concepts[bestIndex]?.conceptId ?? "";
  };
  const assignReciteOwners = (prompts: RecitePrompt[]): RecitePrompt[] => {
    const counts = unit.concepts.map(() => 0);
    return prompts.map((prompt, index) => ({ ...prompt, conceptId: prompt.conceptId ?? ownerFor(prompt.ask, index, counts) }));
  };
  const assignWrittenOwners = (practice: WrittenPractice[]): WrittenPractice[] => {
    const counts = unit.concepts.map(() => 0);
    return practice.map((item, index) => ({ ...item, conceptId: item.conceptId ?? ownerFor(item.question, index, counts) }));
  };
  const concepts = unit.concepts.map((concept) => ({
    ...concept,
    quickCheck: concept.quickCheck?.length
      ? concept.quickCheck
      : [taskFor(concept.conceptId, `Quick check · ${concept.conceptId}`, `Explain one example of ${concept.title}.`)],
  }));
  const conceptSteps = [
    ...unit.conceptSteps,
    ...missingConcepts.map((concept) => ({
      label: `${concept.conceptId} · Read the idea`,
      conceptId: concept.conceptId,
      say: concept.summary,
      frame: frameFor(concept.conceptId),
    })),
  ];
  const recitePrompts = assignReciteOwners(unit.recitePrompts);
  const writtenPractice = assignWrittenOwners(unit.writtenPractice);
  const reciteByConcept = new Set(recitePrompts.map((prompt) => prompt.conceptId));
  const writtenByConcept = new Set(writtenPractice.map((item) => item.conceptId));
  for (const concept of unit.concepts) {
    if (!reciteByConcept.has(concept.conceptId)) {
      recitePrompts.push({ ask: `Explain ${concept.title} in your own words.`, answer: concept.summary, conceptId: concept.conceptId });
    }
    if (!writtenByConcept.has(concept.conceptId)) {
      writtenPractice.push({ question: `Write one worked example of ${concept.title}.`, answer: `${concept.summary} Show the important steps and check your result.`, conceptId: concept.conceptId });
    }
  }
  const testedConcepts = new Set([...unit.assessment.partA, ...unit.assessment.partB].map((task) => task.conceptId));
  const assessmentPartA = [...unit.assessment.partA];
  for (const concept of unit.concepts) {
    if (testedConcepts.has(concept.conceptId)) continue;
    const frame = frameFor(concept.conceptId);
    const example = concept.examples[0]?.question ?? concept.summary;
    assessmentPartA.push({
      title: `Test · ${concept.conceptId}`,
      conceptId: concept.conceptId,
      prompt: `Use ${concept.title}: ${example}`,
      setup: frame,
      options: [
        { label: `The answer applies ${concept.title}`, correct: true, say: `Correct. Explain why the example follows the ${concept.title} rule.`, frame },
        { label: "The answer skips the rule", correct: false, say: `Check the example again and apply the ${concept.title} rule step by step.`, frame },
      ],
    });
  }
  return {
    ...unit,
    concepts,
    conceptSteps,
    guidedTasks: [
      ...unit.guidedTasks,
      ...missingGuided.map((concept) => taskFor(concept.conceptId, `Try it · ${concept.conceptId}`, `Use the Board to show one example of ${concept.title}.`)),
    ],
    recitePrompts,
    writtenPractice,
    assessment: { ...unit.assessment, partA: assessmentPartA },
  };
}

export const BOARD_UNITS: Record<string, BoardUnit> = Object.fromEntries(
  Object.entries(RAW_BOARD_UNITS).map(([key, unit]) => [key, completeBoardUnit(unit)]),
) as Record<string, BoardUnit>;

/** Cambridge textbook units are DB-processed and can use the generic Board
 * adapter even before a bespoke visual file is authored. */
export function hasBoardRoute(unitKey: string): boolean {
  return Boolean(BOARD_UNITS[unitKey]) || /^cambridge-(?:4-math|5-english)-\d+$/.test(unitKey) || /^tamilnadustateboard-9-science-\d+$/.test(unitKey);
}
