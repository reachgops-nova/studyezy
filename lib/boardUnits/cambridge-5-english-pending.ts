import type { BoardFrame, BoardTask, BoardUnit } from "./types";

/** English units 4–9: the same board contract, using the existing English
 * widget/scene concepts as the source for the topic map and explanations. */
type EnglishDefinition = {
  number: number;
  title: string;
  concepts: { id: string; title: string; icon: string; summary: string }[];
};

const ENGLISH_DEFINITIONS: EnglishDefinition[] = [
  { number: 4, title: "Information and explanation texts", concepts: [
    { id: "4.1", title: "Features of an information text", icon: "📰", summary: "Headings, diagrams, labels and technical vocabulary help readers find and understand facts." },
    { id: "4.2", title: "Explanation processes", icon: "⚙️", summary: "An explanation shows how something happens in order, using time-order words." },
    { id: "4.3", title: "Scanning for answers", icon: "🔍", summary: "Scan for the kind of detail the question asks for, such as a place, reason or step." },
    { id: "4.4", title: "Register and suffixes", icon: "🧠", summary: "Register changes with the audience, while suffixes change a word's meaning or job." },
  ] },
  { number: 5, title: "Classic literature", concepts: [
    { id: "5.1", title: "Verb choice and character", icon: "🎭", summary: "Precise verbs and adverbs show a character's feelings without simply naming them." },
    { id: "5.2", title: "Concrete and abstract nouns", icon: "🧱", summary: "Concrete nouns are physical; abstract nouns name ideas, feelings or qualities." },
    { id: "5.3", title: "Film shot types", icon: "🎬", summary: "A storyboard shot controls what the audience sees and how powerful a character feels." },
  ] },
  { number: 6, title: "Classic literature", concepts: [
    { id: "6.1", title: "Adverbs and adjectives", icon: "✨", summary: "An adverb can intensify an adjective and make a feeling more precise." },
    { id: "6.2", title: "Context clues", icon: "🕵️", summary: "The words around an unfamiliar word can reveal what it means." },
    { id: "6.3", title: "Possibility and certainty", icon: "🌦️", summary: "Modal verbs show how possible, likely or certain something is." },
    { id: "6.4", title: "Adverbial phrases", icon: "🏃", summary: "An adverbial phrase adds detail about how, when or where an action happens." },
    { id: "6.5", title: "Themes in literature", icon: "💡", summary: "A theme is the bigger idea a story makes us think about beyond its events." },
  ] },
  { number: 7, title: "Playscripts", concepts: [
    { id: "7.1", title: "Reading a playscript", icon: "🎭", summary: "Character names, dialogue and stage directions tell actors what to say and do." },
    { id: "7.2", title: "Stagecraft effects", icon: "💡", summary: "Lighting, sound and movement help an audience feel tension and understand action." },
    { id: "7.3", title: "Direct and reported speech", icon: "💬", summary: "Reported speech changes the viewpoint and often shifts the verb tense or pronoun." },
    { id: "7.4", title: "Character viewpoints", icon: "👀", summary: "Different characters can react differently to the same event on stage." },
  ] },
  { number: 8, title: "Poems by famous poets", concepts: [
    { id: "8.1", title: "Unstressed vowel sounds", icon: "🔤", summary: "Some vowel spellings sound like a relaxed uh sound when the syllable is unstressed." },
    { id: "8.2", title: "Sound devices in poetry", icon: "🎶", summary: "Repetition and alliteration create rhythm, emphasis and memorable sounds." },
    { id: "8.3", title: "One word, many meanings", icon: "🔀", summary: "A homonym can sound and look the same while having different meanings." },
    { id: "8.4", title: "Creating mood", icon: "🌈", summary: "Writers build mood through setting details, verbs and carefully chosen words." },
    { id: "8.5", title: "Common exception words", icon: "🧩", summary: "Some spellings do not follow the usual pattern and need a memory aid." },
  ] },
  { number: 9, title: "Persuasive texts", concepts: [
    { id: "9.1", title: "Persuasive devices", icon: "📣", summary: "Questions, exaggeration, alliteration and commands can influence a reader." },
    { id: "9.2", title: "Countable and uncountable nouns", icon: "🔢", summary: "Countable nouns can be counted one by one; uncountable nouns need quantifiers." },
    { id: "9.3", title: "Fact, opinion and viewpoint", icon: "⚖️", summary: "Facts can be checked, opinions express judgement, and viewpoints show a position." },
    { id: "9.4", title: "Imaginative pictures", icon: "🌊", summary: "Vivid description helps a reader imagine a future and feel motivated to act." },
    { id: "9.5", title: "Persuading different audiences", icon: "👥", summary: "Effective writers change their language, evidence and tone for the audience." },
  ] },
];

function frameFor(concept: EnglishDefinition["concepts"][number]): BoardFrame {
  return {
    diagram: {
      title: concept.title,
      viewBox: "0 0 720 360",
      svg: `<rect x="20" y="25" width="680" height="310" rx="28" fill="#0b1329" stroke="#334155" stroke-width="3" />
        <path d="M230 180 H300 M420 180 H490" stroke="#f59e0b" stroke-width="5" stroke-dasharray="10 8" />
        <path d="M290 170 l18 10 -18 10 M480 170 l18 10 -18 10" fill="#f59e0b" />
        <rect x="45" y="75" width="180" height="210" rx="20" fill="#082f49" stroke="#38bdf8" stroke-width="3" />
        <rect x="270" y="75" width="180" height="210" rx="20" fill="#422006" stroke="#f59e0b" stroke-width="3" />
        <rect x="495" y="75" width="180" height="210" rx="20" fill="#052e2b" stroke="#34d399" stroke-width="3" />
        <circle cx="135" cy="125" r="30" fill="#38bdf8" fill-opacity=".25" /><circle cx="360" cy="125" r="30" fill="#f59e0b" fill-opacity=".25" /><circle cx="585" cy="125" r="30" fill="#34d399" fill-opacity=".25" />
        <text x="135" y="136" text-anchor="middle" fill="#e0f2fe" font-size="30">👀</text><text x="360" y="136" text-anchor="middle" fill="#fef3c7" font-size="30">🔎</text><text x="585" y="136" text-anchor="middle" fill="#d1fae5" font-size="30">💡</text>
        <text x="135" y="185" text-anchor="middle" fill="#7dd3fc" font-size="20" font-weight="bold">NOTICE</text><text x="360" y="185" text-anchor="middle" fill="#fcd34d" font-size="20" font-weight="bold">EVIDENCE</text><text x="585" y="185" text-anchor="middle" fill="#6ee7b7" font-size="20" font-weight="bold">EXPLAIN</text>
        <text x="135" y="225" text-anchor="middle" fill="#cbd5e1" font-size="14">Spot the feature</text><text x="360" y="225" text-anchor="middle" fill="#cbd5e1" font-size="14">Find the clue</text><text x="585" y="225" text-anchor="middle" fill="#cbd5e1" font-size="14">Say its effect</text>
        <text x="360" y="315" text-anchor="middle" fill="#94a3b8" font-size="14">Tap each step, then tell Ezy what you noticed</text>`,
      parts: [
        { label: "Notice", at: [135, 125], note: `First notice the feature: ${concept.summary}`, tone: "blue" },
        { label: "Evidence", at: [360, 125], note: "Next point to the exact word, phrase, punctuation or detail that proves your idea.", tone: "gold" },
        { label: "Explain", at: [585, 125], note: "Finally explain the meaning or effect in your own words.", tone: "green" },
      ],
    },
  };
}

function taskFor(definition: EnglishDefinition, concept: EnglishDefinition["concepts"][number], index: number, prefix: string): BoardTask {
  const frame = frameFor(concept);
  return {
    title: `${prefix} · ${concept.id}`,
    prompt: `Which idea are you practising: ${concept.title}?`,
    conceptId: concept.id,
    setup: frame,
    options: [
      { label: concept.title, correct: true, say: `Yes. This is ${concept.title}. Explain the clue in your own words.`, frame },
      { label: "A different English idea", correct: false, say: `Look again at the highlighted clue. It belongs to ${concept.title}.`, frame: {} },
    ],
  };
}

function makeEnglishUnit(definition: EnglishDefinition): BoardUnit {
  const concepts = definition.concepts.map((concept, index) => ({
    conceptId: concept.id,
    title: concept.title,
    icon: concept.icon,
    summary: concept.summary,
    keyPoints: [concept.summary, "Use a word or phrase from the passage as evidence."],
    examples: [
      { question: `What does ${concept.title} mean?`, answer: concept.summary },
      { question: `How would you show ${concept.title} in your answer?`, answer: "Name the feature, quote a short clue, and explain the effect or meaning." },
      { question: `What should you check for ${concept.title}?`, answer: "Check the exact words, the audience, and the evidence before deciding." },
    ],
    quickCheck: [taskFor(definition, concept, index, "Ready check")],
  }));
  const conceptSteps = definition.concepts.flatMap((concept, index) => [
    { label: `${concept.id} · Meet the idea`, conceptId: concept.id, say: concept.summary, frame: frameFor(concept) },
    { label: `${concept.id} · Find the clue`, conceptId: concept.id, say: `Tap the clue and explain how it helps with ${concept.title}.`, frame: frameFor(concept) },
  ]);
  const guidedTasks = definition.concepts.map((concept, index) => taskFor(definition, concept, index, "Try it"));
  const assessment = definition.concepts.slice(0, 3).map((concept, index) => taskFor(definition, concept, index, "Test"));
  return {
    unitKey: `cambridge-5-english-${definition.number}`,
    title: definition.title,
    badge: `Grade 5 · Unit ${definition.number}`,
    gridMax: 10,
    stage: "text",
    intro: {
      covers: definition.concepts.map((concept) => `${concept.id} ${concept.title}`),
      outcomes: definition.concepts.slice(0, 4).map((concept) => `identify and explain ${concept.title.toLowerCase()}`),
    },
    concepts,
    conceptSteps,
    guidedTasks,
    lab: { prompt: "Move the sliders to make a visible writing plan: idea, evidence, explanation.", start: [2, 2], shape: [[0, 0], [2, 0], [2, 2], [0, 2]], range: { min: -2, max: 6 } },
    recitePrompts: definition.concepts.map((concept) => ({ ask: `Say the rule for ${concept.title}.`, answer: concept.summary })),
    writtenPractice: definition.concepts.slice(0, 4).map((concept) => ({ question: `Write a short example showing ${concept.title}.`, answer: `${concept.summary} Use a short quotation or detail as evidence.` })),
    assessmentStory: frameFor(definition.concepts[0]),
    assessment: { partA: assessment, partB: [] },
    readymade: definition.concepts.slice(0, 4).map((concept) => ({ q: `What is ${concept.title}?`, a: concept.summary })),
    chatAnswers: definition.concepts.map((concept) => ({ question: `What is ${concept.title}?`, answer: concept.summary, keywords: concept.title.toLowerCase().split(/\s+/).filter((word) => word.length > 2), conceptId: concept.id })),
  };
}

export const PENDING_ENGLISH_BOARD_UNITS: Record<string, BoardUnit> = Object.fromEntries(
  ENGLISH_DEFINITIONS.map((definition) => {
    const unit = makeEnglishUnit(definition);
    return [unit.unitKey, unit];
  }),
) as Record<string, BoardUnit>;
