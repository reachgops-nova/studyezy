import type { BoardConcept, BoardFrame, BoardOption, BoardTask, BoardUnit } from "./types";
import type { Concept, CurriculumUnit } from "@/lib/types";

function conceptFrame(concept: Concept): BoardFrame {
  return {
    text: {
      title: concept.concept_name,
      cards: [
        { tag: "RULE", title: concept.concept_name, desc: concept.definition ?? concept.key_points?.[0] ?? "Explain the idea in your own words." },
        ...(concept.key_points ?? []).slice(0, 3).map((point, index) => ({
          tag: `KEY ${index + 1}`,
          title: "Remember this",
          desc: point,
        })),
      ],
    },
  };
}

function taskFor(concept: Concept, index: number, prefix: string): BoardTask {
  const answer = concept.key_points?.[0] ?? concept.definition ?? `Explain ${concept.concept_name}.`;
  const frame = conceptFrame(concept);
  const correct: BoardOption = { label: "That matches the textbook idea", correct: true, say: answer, frame };
  const wrong: BoardOption = { label: "That does not match yet", correct: false, say: `Look again at ${concept.concept_name}. ${answer}`, frame };
  return {
    title: `${prefix} · ${concept.concept_id}`,
    prompt: `Which explanation best shows ${concept.concept_name}?`,
    conceptId: concept.concept_id,
    setup: frame,
    options: [correct, wrong],
  };
}

function toBoardConcept(concept: Concept, existing?: BoardConcept): BoardConcept {
  const textbookExamples = (concept.examples ?? []).map((answer, index) => ({
    question: `${concept.concept_name}: textbook example ${index + 1}`,
    answer,
  }));
  return {
    conceptId: concept.concept_id,
    title: concept.concept_name,
    icon: existing?.icon ?? "📘",
    summary: concept.definition ?? existing?.summary ?? concept.concept_name,
    keyPoints: concept.key_points?.length ? concept.key_points : existing?.keyPoints ?? [],
    pages: concept.book_pages,
    storyReference: concept.story_reference?.title,
    examples: textbookExamples.length ? textbookExamples : existing?.examples ?? [],
    quickCheck: existing?.quickCheck?.length ? existing.quickCheck : [taskFor(concept, 0, "Quick check")],
  };
}

/**
 * Enriches a hand-authored/pending Board definition with the DB-backed
 * textbook record. The Board remains one shared renderer; this function is
 * the bridge that prevents a short visual skeleton from replacing the real
 * Learn/textbook content.
 */
export function enrichBoardUnit(board: BoardUnit, source: CurriculumUnit): BoardUnit {
  const sourceById = new Map(source.concepts.map((concept) => [concept.concept_id, concept]));
  const concepts = board.concepts.map((concept) => toBoardConcept(sourceById.get(concept.conceptId) ?? {
    concept_id: concept.conceptId,
    concept_name: concept.title,
    status: "drafted",
    definition: concept.summary,
    key_points: concept.keyPoints,
    examples: concept.examples.map((example) => example.answer),
  }, concept));
  const textbookSteps = source.concepts.flatMap((sourceConcept) => {
    const frame = board.conceptSteps.find((step) => step.conceptId === sourceConcept.concept_id)?.frame ?? conceptFrame(sourceConcept);
    const points = sourceConcept.key_points?.length
      ? sourceConcept.key_points
      : [sourceConcept.definition ?? `Explain ${sourceConcept.concept_name} in your own words.`];
    return points.map((point, index) => ({
      label: `${sourceConcept.concept_id} · Key point ${index + 1}`,
      conceptId: sourceConcept.concept_id,
      say: point,
      frame,
    }));
  });
  const textbookRecite = source.concepts.flatMap((concept) => [
    { ask: `Explain ${concept.concept_name} in your own words.`, answer: concept.definition ?? concept.key_points?.[0] ?? concept.concept_name, conceptId: concept.concept_id },
    ...(concept.tips_to_remember ?? []).slice(0, 1).map((tip) => ({ ask: `What should you remember about ${concept.concept_name}?`, answer: tip, conceptId: concept.concept_id })),
  ]);
  const textbookWritten = source.concepts.flatMap((concept) => (concept.examples ?? []).map((example) => ({
    question: `${concept.concept_name}: work this textbook example on paper.`,
    answer: example,
    conceptId: concept.concept_id,
  })));
  // Pending Board units previously left their generic factory task first
  // ("Which idea is this practice for?") even when the DB already contained
  // the real textbook example. That made a topic such as world time zones
  // look like an abstract number-line move. Put one concrete source example
  // into Cover for every concept; the final Test remains separate and graded.
  const sourceGuidedTasks: BoardTask[] = source.concepts.map((concept) => {
    const example = concept.examples?.[0] ?? concept.definition ?? concept.key_points?.[0] ?? `Explain ${concept.concept_name} in your own words.`;
    const frame = board.conceptSteps.find((step) => step.conceptId === concept.concept_id)?.frame ?? conceptFrame(concept);
    return {
      title: `Textbook example · ${concept.concept_id}`,
      prompt: example,
      conceptId: concept.concept_id,
      setup: frame,
      options: [
        { label: "I can explain this example", correct: true, say: `Good. Explain each step and check the result against this source example: ${example}`, frame },
        { label: "I need the walkthrough again", correct: false, say: `Return to the Read step for ${concept.concept_name}, then try this example again.`, frame },
      ],
    };
  });
  const genericFactoryBoard = board.conceptSteps.some((step) => step.label.includes("Meet the idea"));
  return {
    ...board,
    concepts,
    conceptSteps: genericFactoryBoard ? [...textbookSteps, ...board.conceptSteps] : [...board.conceptSteps, ...textbookSteps],
    guidedTasks: sourceGuidedTasks.length ? sourceGuidedTasks : board.guidedTasks,
    recitePrompts: [...board.recitePrompts, ...textbookRecite],
    writtenPractice: [...board.writtenPractice, ...textbookWritten],
    intro: {
      covers: concepts.map((concept) => `${concept.conceptId} ${concept.title}`),
      outcomes: concepts.slice(0, 6).map((concept) => `explain ${concept.title.toLowerCase()} using the textbook examples`),
    },
  };
}

/** Creates a full Board route for a processed DB unit that has no static
 * visual file yet. It deliberately uses the same phases and topic gates, so
 * no processed textbook unit is forced back into the retired Learn layout. */
export function boardUnitFromCurriculum(source: CurriculumUnit, unitKey: string): BoardUnit {
  const concepts = source.concepts.map((concept) => toBoardConcept(concept));
  const steps = concepts.flatMap((concept) => [
    { label: `${concept.conceptId} · Read the rule`, conceptId: concept.conceptId, say: concept.summary, frame: conceptFrame(source.concepts.find((item) => item.concept_id === concept.conceptId)!) },
    { label: `${concept.conceptId} · Check the key points`, conceptId: concept.conceptId, say: (concept.keyPoints[0] ?? concept.summary), frame: conceptFrame(source.concepts.find((item) => item.concept_id === concept.conceptId)!) },
  ]);
  const guidedTasks = source.concepts.map((concept, index) => taskFor(concept, index, "Try it"));
  const assessment = source.concepts.slice(0, Math.min(5, source.concepts.length)).map((concept, index) => taskFor(concept, index, "Test"));
  const recitePrompts = source.concepts.flatMap((concept) => [
    { ask: `What is ${concept.concept_name}?`, answer: concept.definition ?? concept.key_points?.[0] ?? concept.concept_name, conceptId: concept.concept_id },
    ...(concept.tips_to_remember ?? []).slice(0, 1).map((tip) => ({ ask: `What should you remember about ${concept.concept_name}?`, answer: tip, conceptId: concept.concept_id })),
  ]);
  const writtenPractice = source.concepts.flatMap((concept) => (concept.examples ?? []).slice(0, 2).map((example) => ({
    question: `${concept.concept_name}: work this textbook example on paper.`,
    answer: example,
    conceptId: concept.concept_id,
  })));
  const first = source.concepts[0];
  return {
    unitKey,
    title: source.unit_title,
    badge: `${source.curriculum} · ${source.subject} · Unit ${source.unit}`,
    gridMax: 10,
    stage: source.subject.toLowerCase().includes("english") ? "text" : "diagram",
    intro: {
      covers: concepts.map((concept) => `${concept.conceptId} ${concept.title}`),
      outcomes: concepts.slice(0, 6).map((concept) => `explain ${concept.title.toLowerCase()} using the textbook examples`),
    },
    concepts,
    conceptSteps: steps,
    guidedTasks,
    lab: { prompt: `Build and explain an example of ${first?.concept_name ?? "this unit"}.`, start: [2, 2], shape: [[0, 0], [2, 0], [2, 2], [0, 2]], range: { min: -2, max: 6 } },
    recitePrompts,
    writtenPractice,
    assessmentStory: first ? conceptFrame(first) : undefined,
    assessment: { partA: assessment, partB: [] },
    readymade: concepts.slice(0, 6).map((concept) => ({ q: `What is ${concept.title}?`, a: concept.summary })),
    chatAnswers: source.concepts.flatMap((concept) => (concept.voice_qa_samples ?? []).map((sample) => ({
      question: sample.question,
      answer: sample.answer,
      keywords: concept.concept_name.toLowerCase().split(/\s+/).filter((word) => word.length > 2),
      conceptId: concept.concept_id,
    }))),
  };
}
