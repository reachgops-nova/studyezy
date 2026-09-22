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
  { number: 5, title: "Stories that have been developed into a film", concepts: [
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

/**
 * Real per-concept content for units that have been deepened from the real
 * textbook pages, checked ahead of the generic Notice/Evidence/Explain
 * frame below. Real user direction 2026-09-21/22: "complete the entire
 * textbook ... finalise this and share it for practice."
 */
function realFrameFor(id: string): BoardFrame | undefined {
  switch (id) {
    case "4.1":
      // Real book content, p60: comparative/superlative adjectives, used
      // inside information texts to make comparisons.
      return {
        text: {
          title: "Features of an information text · p60",
          cards: [
            { tag: "Feature", title: "Sub-headings and sections", desc: "Readers can jump straight to the part they need, rather than reading start to finish - that is why information texts are sometimes called non-chronological reports." },
            { tag: "Feature", title: "Technical vocabulary", desc: "Topic-specific words, e.g. for a volcano: lava, magma, crater, ash cloud." },
            { tag: "Feature", title: "Comparisons", desc: "tall → taller → the tallest. beautiful → more beautiful → the most beautiful." },
          ],
          columns: [
            { label: "Comparative (compares two)", items: [], tone: "blue" },
            { label: "Superlative (compares many)", items: [], tone: "gold" },
          ],
        },
      };
    case "4.2":
      // Real book process, p64: how sea ice becomes an ice floe, told with
      // real sequence words - built one step at a time, not read whole.
      return {
        text: {
          title: "How an ice floe forms · p64",
          build: {
            pieces: [
              { text: "First, floating ice crystals give the sea a greasy look. " },
              { text: "Then, ", tone: "gold" }, { text: "this grease ice thickens into wave-shaped discs. " },
              { text: "Eventually, ", tone: "gold" }, { text: "the discs are pushed together and jam to form an ice floe. " },
              { text: "Finally, ", tone: "green" }, { text: "ice floes collide and join into a mighty sheet of pack ice." },
            ],
          },
        },
      };
    case "4.3":
      // Real book fact file, p68: coral reef facts, scanned for a specific
      // kind of detail (a rate, a duration, a fraction) - not read start to end.
      return {
        text: {
          title: "Scan for the answer · coral reefs, p68",
          passage: [
            { text: "Large reefs grow at the rate of " },
            { text: "1-2 cm per year", tone: "gold", note: "How much does coral grow in a year? Scan for a rate, not a story." },
            { text: ". It is estimated that some of the largest reefs took as long as " },
            { text: "30 million years", tone: "blue", note: "When did some corals begin to grow? Scan for a length of time." },
            { text: " to form. Coral reefs are sometimes called the rainforests of the sea because " },
            { text: "one quarter of all the world's marine life", tone: "green", note: "Why are coral reefs important? Scan for a fraction or a reason." },
            { text: " lives on them." },
          ],
        },
      };
    case "4.4":
      // Real book table + example, p70: -graphy/-ology suffixes, and a
      // real informal-register extract to sort against the formal features.
      return {
        text: {
          title: "Register and suffixes · p70",
          cards: [
            { tag: "Suffix", title: "-graphy means 'writing'", desc: "biography = the story of someone's life.", quote: "bio (life) + graphy (writing)" },
            { tag: "Suffix", title: "-ology means 'the study of'", desc: "biology = the study of living things.", quote: "bio (life) + ology (study of)" },
          ],
          columns: [
            { label: "Formal (serious, impersonal)", items: [], tone: "blue" },
            { label: "Informal (personal, fun)", items: [], tone: "gold" },
          ],
        },
      };
    case "5.1":
      // Real book example, p76: "Hugo trudged up the staircase" - watched
      // building up feeling one addition at a time, not read finished.
      return {
        text: {
          title: "Building feeling into a sentence · The Invention of Hugo Cabret, p76",
          build: {
            pieces: [
              { text: "Hugo trudged" }, { text: " up the staircase." },
              { text: " The word 'trudged' already suggests reluctance." },
            ],
          },
        },
      };
    case "5.2":
      // Real book example, p79: the same extract naming a concrete noun
      // (something physical) and an abstract noun (something not physical).
      return {
        text: {
          title: "Concrete and abstract nouns · The Invention of Hugo Cabret, p79",
          cards: [
            { tag: "Concrete noun", title: "clocks", desc: "A physical thing you could touch.", quote: "'Hugo wound the clocks.'" },
            { tag: "Abstract noun", title: "knowledge", desc: "Not physical - an idea, not a thing.", quote: "'Hugo had gained the knowledge of how to care for them.'" },
          ],
          columns: [
            { label: "Concrete (physical)", items: [], tone: "blue" },
            { label: "Abstract (an idea, not physical)", items: [], tone: "gold" },
          ],
        },
      };
    case "5.3":
      // Real book storyboard, p87: two real shot choices and the effect
      // each one has on how the audience feels about the same character.
      return {
        text: {
          title: "Storyboard shots · The Invention of Hugo Cabret, p87",
          cards: [
            { tag: "High-angle long-shot", title: "Shows the whole room from above", desc: "As if someone is watching Hugo from above - this adds tension to the moment." },
            { tag: "High-angle mid-shot", title: "From the top of the armoire", desc: "Makes Hugo seem smaller and a little afraid." },
            { tag: "Low-angle shot", title: "Camera looks up at the subject", desc: "Makes a character or object seem more important or powerful - the opposite effect of a high angle." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function frameFor(concept: EnglishDefinition["concepts"][number]): BoardFrame {
  const real = realFrameFor(concept.id);
  if (real) return real;
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
  if (concept.id === "4.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      prompt: "Sort 'the most beautiful' - is it comparative or superlative? Drag it to where it belongs.",
      conceptId: concept.id,
      setup: frame,
      chipDrag: { chip: "the most beautiful", toColumn: 1, hint: "drag it to where it belongs" },
      options: [
        { label: "Superlative", correct: true, say: "Yes - 'most' compares three or more things, which makes it superlative, not comparative.", frame },
        { label: "Comparative", correct: false, say: "Comparative only compares two things, like 'more beautiful'. 'The most beautiful' compares many, which makes it superlative.", frame },
      ],
    };
  }
  if (concept.id === "4.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      prompt: "Put these ice-floe steps in order: (1) discs jam together, (2) grease ice forms, (3) pack ice forms, (4) ice floe forms. Which comes first?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "Grease ice forms", correct: true, say: "Correct. First the sea gets a greasy look from floating ice crystals - everything else builds on that first step.", frame },
        { label: "Pack ice forms", correct: false, say: "Pack ice is the last stage, not the first - it only forms after ice floes have already joined together.", frame },
        { label: "Discs jam together", correct: false, say: "That happens after the grease ice has already thickened into discs - it can't be the very first step.", frame },
      ],
    };
  }
  if (concept.id === "4.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      prompt: "You need to answer 'How much does coral grow in a year?'. What kind of detail should you scan for?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "A rate, like a measurement per year", correct: true, say: "Yes - 'how much... in a year' is asking for a rate, and the text gives '1-2 cm per year'.", frame },
        { label: "A place name", correct: false, say: "That would answer a 'where' question. This question asks 'how much', so scan for a measurement, not a location.", frame },
        { label: "A reason", correct: false, say: "That would answer a 'why' question. This one asks 'how much', so scan for a number or rate.", frame },
      ],
    };
  }
  if (concept.id === "4.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      prompt: "'Have you ever heard stories of strange sea beasts?' - drag this to where it belongs.",
      conceptId: concept.id,
      setup: frame,
      chipDrag: { chip: "Have you ever heard stories of strange sea beasts?", toColumn: 1, hint: "drag it to where it belongs" },
      options: [
        { label: "Informal", correct: true, say: "Yes - a direct question to the reader is a personal, informal touch, not the serious, impersonal tone of a formal text.", frame },
        { label: "Formal", correct: false, say: "Formal writing keeps a serious, impersonal tone and avoids speaking directly to the reader. A question like this is informal.", frame },
      ],
    };
  }
  if (concept.id === "5.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      prompt: "'Hugo trudged ___ up the staircase.' Which adverb best shows he felt unwilling?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "reluctantly", correct: true, say: "Yes - 'reluctantly' directly adds the feeling of not wanting to go, matching what 'trudged' already suggests.", frame },
        { label: "quickly", correct: false, say: "'Trudged' already suggests heavy, effortful walking - 'quickly' contradicts that feeling rather than adding to it.", frame },
        { label: "happily", correct: false, say: "'Trudged' suggests reluctance or a burden, not enjoyment - 'happily' contradicts the verb's own feeling.", frame },
      ],
    };
  }
  if (concept.id === "5.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      prompt: "'Hugo had gained the knowledge of how to care for them.' Drag 'knowledge' to where it belongs.",
      conceptId: concept.id,
      setup: frame,
      chipDrag: { chip: "knowledge", toColumn: 1, hint: "drag it to where it belongs" },
      options: [
        { label: "Abstract", correct: true, say: "Yes - you cannot touch 'knowledge'. It is an idea, which makes it an abstract noun.", frame },
        { label: "Concrete", correct: false, say: "Concrete nouns are physical things you could touch, like 'clocks'. 'Knowledge' is an idea, not a physical thing, so it is abstract.", frame },
      ],
    };
  }
  if (concept.id === "5.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      prompt: "You want the audience to feel a character is powerful and important. Which shot should you use?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "A low-angle shot", correct: true, say: "Correct. A low-angle shot, looking up at the subject, makes a character or object seem more important or powerful.", frame },
        { label: "A high-angle shot", correct: false, say: "That has the opposite effect - a high-angle shot, looking down, makes a character seem less powerful, smaller or more afraid.", frame },
      ],
    };
  }
  return {
    title: `${prefix} · ${concept.id}`,
    prompt: `Use Notice → Evidence → Explain for this ${concept.title} example. Which response follows the method?`,
    conceptId: concept.id,
    setup: frame,
    options: [
      { label: `The evidence supports ${concept.title}`, correct: true, say: `Yes. Name the feature, point to the exact clue, and explain its effect or meaning.`, frame },
      { label: "Make a claim without evidence", correct: false, say: `Return to the highlighted clue. An answer needs a precise word or phrase as evidence.`, frame: {} },
    ],
  };
}

/** Real worked examples for deepened concepts, taught in Read and shown on
 * the Recite board card - checked ahead of the generic N-E-E filler. */
function realExamplesFor(id: string): { question: string; answer: string }[] | undefined {
  switch (id) {
    case "4.1":
      return [
        { question: "Give the comparative and superlative of 'tall'.", answer: "taller (comparative, compares two); the tallest (superlative, compares three or more)." },
        { question: "Name three features that make a text an information text.", answer: "Any three of: a title and introduction, sub-headings, paragraphs within sections, facts, diagrams with labels, bullet points, technical vocabulary, comparative/superlative adjectives." },
      ];
    case "4.2":
      return [
        { question: "What are the four sequence words used to explain how an ice floe forms?", answer: "First, then/eventually, eventually, finally - they show the order the process happens in." },
        { question: "Why is an explanation of a process always chronological, in order?", answer: "Because a process is a series of actions with a beginning and an end, so it has to be told in the order it happens." },
      ];
    case "4.3":
      return [
        { question: "Scanning for 'why are coral reefs important', what kind of answer are you looking for?", answer: "A reason or a fraction - the text says coral reefs support 'one quarter of all the world's marine life'." },
        { question: "What is the difference between skimming and scanning?", answer: "Skimming gets a general impression of a whole text; scanning reads more thoroughly to find one specific piece of information." },
      ];
    case "4.4":
      return [
        { question: "Split 'biology' into its root and suffix, and give the meaning of each part.", answer: "bio (Greek for 'life') + ology ('the study of something') = the study of living things." },
        { question: "Name two features of a formal information text.", answer: "Any two of: a serious, impersonal tone; precise, formal language; adjectives that give factual information (e.g. colour, size)." },
      ];
    case "5.1":
      return [
        { question: "What does the verb 'trudged' suggest about how Hugo feels, without saying it directly?", answer: "That walking up the stairs is hard work, or that he doesn't want to go - the verb itself carries the feeling, not a stated emotion." },
        { question: "What is the difference between an adverb and an adverbial phrase? Give the book's examples.", answer: "An adverb is one word ('Hugo trudged reluctantly'); an adverbial phrase is a group of words doing the same job ('Hugo trudged with heavy footsteps')." },
      ];
    case "5.2":
      return [
        { question: "Give one example each of a concrete noun and an abstract noun from the Hugo extract.", answer: "Concrete: 'clocks' (physical). Abstract: 'knowledge' (an idea, not physical)." },
        { question: "Why can't you touch an abstract noun?", answer: "Because abstract nouns name things that are not physical, like imagination, thoughts or knowledge - only concrete nouns name physical things." },
      ];
    case "5.3":
      return [
        { question: "What effect does a high-angle long-shot of the whole room have on the audience?", answer: "It feels as if someone is watching from above, which adds tension to the moment." },
        { question: "What effect does an over-the-shoulder shot have?", answer: "It shows events from a character's own viewpoint, so the audience sees what that character sees." },
      ];
    default:
      return undefined;
  }
}

/** Fresh recite prompts, different from what was just taught - real user
 * direction 2026-09-20/21: vary the example, then practise more of them. */
function realRecitePromptsFor(id: string): { ask: string; answer: string }[] | undefined {
  switch (id) {
    case "4.1":
      return [{ ask: "Give the comparative and superlative of 'happy'.", answer: "happier (comparative); the happiest (superlative)." }];
    case "4.2":
      return [{ ask: "Put in order: the coral polyp feeds; it is dark; the polyp comes out of its skeleton; prey is pulled into its mouth. What happens first?", answer: "It becomes dark - the polyps only come out of their hard skeletons to feed once night falls." }];
    case "4.3":
      return [{ ask: "If a question asks 'where', what kind of detail should you scan for?", answer: "A place name or location, not a reason, a rate or a time." }];
    case "4.4":
      return [{ ask: "Is 'Well, everyone loves a good story!' formal or informal? Why?", answer: "Informal - it uses a casual opener ('Well,') and an exclamation, not the serious, impersonal tone of formal writing." }];
    case "5.1":
      return [{ ask: "Rewrite 'Hugo walked to the door' to show he felt nervous, using an adverb.", answer: "Something like: 'Hugo walked nervously to the door' - the adverb adds the feeling without stating 'Hugo felt nervous' directly." }];
    case "5.2":
      return [{ ask: "Is 'imagination' a concrete noun or an abstract noun?", answer: "Abstract - you cannot touch or see imagination itself, only its effects, which makes it an idea rather than a physical thing." }];
    case "5.3":
      return [{ ask: "Which shot would you choose to make a villain seem frightening and dominant - high-angle or low-angle?", answer: "Low-angle - looking up at the villain would make them seem more powerful and important, the effect the scene needs." }];
    default:
      return undefined;
  }
}

function makeEnglishUnit(definition: EnglishDefinition): BoardUnit {
  const concepts = definition.concepts.map((concept, index) => ({
    conceptId: concept.id,
    title: concept.title,
    icon: concept.icon,
    summary: concept.summary,
    keyPoints: [concept.summary, "Use a word or phrase from the passage as evidence."],
    examples: realExamplesFor(concept.id) ?? [
      { question: `Use Notice → Evidence → Explain to show ${concept.title}.`, answer: `${concept.summary} Name the feature, quote a short clue, and explain the effect or meaning.` },
      { question: `What exact evidence would you choose for ${concept.title}?`, answer: "Choose the relevant word, phrase, punctuation or stage/text detail, then explain why it matters." },
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
    lab: { kind: "visual", prompt: "Touch the Notice, Evidence and Explain parts on the board, then say what each one proves.", start: [0, 0], shape: [[0, 0]], range: { min: 0, max: 1 } },
    recitePrompts: definition.concepts.flatMap((concept) => [
      { ask: `Say the rule for ${concept.title}.`, answer: concept.summary, conceptId: concept.id },
      ...(realRecitePromptsFor(concept.id)?.map((p) => ({ ...p, conceptId: concept.id })) ?? []),
    ]),
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
