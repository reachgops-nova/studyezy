import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 8 - Magnetism.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Physics strand, pages 104-113. Diagram art is real, NotebookLM-generated
 * illustration (Infographic studio, from the unit's own page-cited text as
 * the source) with hotspots laid over it - same method as Units 1-6.
 *
 * Every definition below is pulled from the textbook's own text (magnetic
 * vs non-magnetic materials, poles, magnetic fields, distance and
 * materials, magnet strength/shapes, and the Earth as a magnet) rather than
 * invented, so the board and the real book teach the same words in the
 * same order.
 */

const MAGNET_IMG = "/board-art/cambridge-4-science-unit8-magnetism.png";
const MAGNET_ALT = "Six panels of magnetism: magnetic vs non-magnetic materials, poles, magnetic field lines, magnet shapes, magnets working at a distance, and the Earth as a magnet.";

const FULL_FOCUS = { x: 0, y: 0, w: 100, h: 100 };
const MAGNETIC_OR_NOT_FOCUS = { x: 0, y: 8, w: 33, h: 50 };
const POLES_FOCUS = { x: 33, y: 8, w: 34, h: 50 };
const FIELD_FOCUS = { x: 67, y: 8, w: 33, h: 50 };
const SHAPES_FOCUS = { x: 0, y: 58, w: 33, h: 42 };
const DISTANCE_FOCUS = { x: 33, y: 58, w: 34, h: 42 };
const EARTH_FOCUS = { x: 67, y: 58, w: 33, h: 42 };

function frame(hotspots: NonNullable<ImageFrame["hotspots"]>, focus: ImageFrame["focus"] = FULL_FOCUS, motionPath?: ImageFrame["motionPath"]): { image: ImageFrame } {
  return {
    image: {
      src: MAGNET_IMG,
      alt: MAGNET_ALT,
      title: "Magnetism",
      hotspots,
      focus,
      motionPath,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_8: BoardUnit = {
  unitKey: "cambridge-4-science-8",
  title: "Magnetism",
  badge: "Grade 4 · Physics · Unit 8",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "What makes a material magnetic - and which common metals are not",
      "North and south poles, and whether like or unlike poles attract",
      "Magnetic fields - the invisible force around a magnet",
      "Magnets working through materials and at a distance",
      "Magnet shapes, and whether all magnets are equally strong",
      "The Earth as a magnet, and animals that sense its magnetic field",
    ],
    outcomes: [
      "Explain why iron and steel are attracted to magnets, but aluminium, copper and gold are not",
      "State whether like poles or unlike poles attract each other",
      "Describe what a magnetic field is, and how iron filings reveal it",
      "Explain that magnets can attract at a distance, without touching",
      "Say whether all magnets have the same strength",
      "Explain, in simple terms, why the Earth behaves like a giant magnet",
    ],
  },

  concepts: [
    {
      conceptId: "8.1",
      title: "What is a magnet?",
      icon: "🧲",
      summary:
        "Materials made from iron are magnetic. Steel contains iron, so steel objects are attracted to magnets too. Other metals, like aluminium, copper and gold, are not magnetic.",
      keyPoints: [
        "Iron is magnetic; any metal containing iron (like steel) is attracted to magnets.",
        "Aluminium, copper and gold are NOT magnetic - not all metals are attracted to magnets.",
        "The word 'magnet' comes from lodestone, a naturally magnetic rock the ancient Greeks called magnetite, discovered in a region called Magnesia.",
      ],
      pages: [104, 106],
      storyReference: "Exploring magnets / North and south poles, pages 104 and 106",
      examples: [
        { question: "Why are steel paper clips attracted to a magnet?", answer: "Steel contains iron, and iron is magnetic. (p.106)" },
        { question: "Name a metal that is NOT attracted to a magnet.", answer: "Any of: aluminium, copper, gold. (p.106)" },
        { question: "What was the ancient Greek name for a naturally magnetic rock?", answer: "Magnetite (lodestone), named after the region of Magnesia. (p.104)" },
      ],
      quickCheck: [
        {
          title: "Quick check · magnetic or not",
          prompt: "Which of these would a magnet attract?",
          conceptId: "8.1",
          options: [
            { label: "A steel nail", correct: true, say: "Correct - steel contains iron, so it's magnetic.", frame: frame([{ label: "Magnetic (contains iron)", at: [10, 53], note: "Steel and iron are attracted.", tone: "gold" }], MAGNETIC_OR_NOT_FOCUS) },
            { label: "A gold ring", correct: false, say: "Gold is not magnetic - a magnet will not attract it.", frame: frame([{ label: "NOT magnetic", at: [25, 53], note: "Gold, copper and aluminium are not magnetic.", tone: "red" }], MAGNETIC_OR_NOT_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "8.2",
      title: "North and south poles",
      icon: "🔴",
      summary:
        "Every magnet has a north pole and a south pole. Like poles repel each other; unlike poles attract each other.",
      keyPoints: [
        "Like poles repel: N + N, or S + S.",
        "Unlike poles attract: N + S.",
      ],
      pages: [106],
      storyReference: "North and south poles, page 106",
      examples: [
        { question: "What happens when you put two north poles together?", answer: "They repel (push apart). (p.106)" },
        { question: "What happens when you put a north pole and a south pole together?", answer: "They attract (pull together). (p.106)" },
      ],
      quickCheck: [
        {
          title: "Quick check · attract or repel",
          prompt: "Two magnets are placed with their south poles facing each other. What happens?",
          conceptId: "8.2",
          options: [
            { label: "They repel", correct: true, say: "Correct - like poles (S + S) repel each other.", frame: frame([{ label: "Like poles REPEL", at: [41.75, 47], note: "Same poles push apart.", tone: "gold" }], POLES_FOCUS) },
            { label: "They attract", correct: false, say: "Two of the same pole (like poles) repel - only unlike poles (N + S) attract.", frame: frame([{ label: "Unlike poles ATTRACT", at: [60, 47], note: "This needs a N and a S, not two S poles.", tone: "red" }], POLES_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "8.3",
      title: "Magnetic fields",
      icon: "🌀",
      summary:
        "Magnets attract or repel at a distance, through an invisible force called a magnetic field. Iron filings placed near a magnet reveal the field's pattern.",
      keyPoints: [
        "A magnetic field is the invisible area of force around a magnet.",
        "Iron filings (tiny bits of iron) are attracted along the field, revealing its pattern.",
        "Field lines go out from the north pole and curve round into the south pole.",
      ],
      pages: [106, 107],
      storyReference: "How do we know there is a magnetic field?, page 107",
      examples: [
        { question: "How can we see the pattern of an invisible magnetic field?", answer: "By using iron filings, which line up along the field around a magnet. (p.107)" },
        { question: "Which way do magnetic field lines point - into the north pole or out of it?", answer: "Out of the north pole, curving round into the south pole. (p.107)" },
      ],
      quickCheck: [
        {
          title: "Quick check · seeing the invisible",
          prompt: "How do scientists reveal the pattern of a magnet's invisible field?",
          conceptId: "8.3",
          options: [
            { label: "Using iron filings", correct: true, say: "Correct - iron filings line up along the magnetic field, showing its pattern.", frame: frame([{ label: "Magnetic field lines (invisible force)", at: [84.75, 47.5], note: "Revealed using iron filings.", tone: "gold" }], FIELD_FOCUS) },
            { label: "Using a magnifying glass", correct: false, say: "A magnetic field is invisible even under magnification - iron filings are what reveal its pattern.", frame: frame([{ label: "Magnetic field lines (invisible force)", at: [84.75, 47.5], note: "Not visible even magnified.", tone: "red" }], FIELD_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "8.4",
      title: "Magnets, distance and materials",
      icon: "📏",
      summary:
        "A magnet does not need to touch an object to attract it - the object just needs to be inside the magnet's field. A magnetic field can also work through some materials, but not others.",
      keyPoints: [
        "Magnetic forces work over a distance - no touching needed.",
        "An object must be inside the magnetic field to be attracted.",
        "A magnetic field may not work through a material that is too thick.",
      ],
      pages: [108, 111],
      storyReference: "Marvellous magnets / Do magnetic forces work over a distance?, pages 108 and 111",
      examples: [
        { question: "Does a magnet have to touch a paper clip to move it?", answer: "No - it just needs to bring the paper clip inside its magnetic field. (p.111)" },
        { question: "Why might a magnet fail to attract a paper clip through a thick book?", answer: "A magnetic field may not work through a material that is too thick. (p.108)" },
      ],
      quickCheck: [
        {
          title: "Quick check · touching or not",
          prompt: "Does a magnet need to touch an object made of magnetic material to move it?",
          conceptId: "8.4",
          options: [
            { label: "No - it just needs to be close enough", correct: true, say: "Correct - the object needs to be inside the magnetic field, not touching.", frame: frame([{ label: "Magnets can attract without touching", at: [55.5, 88.7], note: "Works at a distance.", tone: "gold" }], DISTANCE_FOCUS) },
            { label: "Yes - they must always touch", correct: false, say: "Magnets can attract objects at a distance, without touching them.", frame: frame([{ label: "Magnets can attract without touching", at: [55.5, 88.7], note: "No touching required.", tone: "red" }], DISTANCE_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "8.5",
      title: "Do all magnets have the same strength?",
      icon: "🧪",
      summary:
        "Magnets come in different shapes - horseshoe, ring, bar and circular - and not all magnets are the same strength. Scientists use standard measurements to compare them fairly.",
      keyPoints: [
        "Magnet shapes: horseshoe, ring, bar, circular.",
        "Not all magnets have the same strength - some are stronger than others.",
        "Standard measurements (like grams or centimetres) let scientists compare and share results; non-standard measurements (like counting different-sized paper clips) cannot be fairly compared.",
      ],
      pages: [109, 110],
      storyReference: "Working like scientists / Do magnets have different strengths?, pages 109-110",
      examples: [
        { question: "Name the four magnet shapes shown in the book.", answer: "Horseshoe, ring, bar, and circular. (p.109)" },
        { question: "Why is counting paper clips of different sizes not a fair way to compare magnet strength?", answer: "It's a non-standard measurement - the paper clips need to be a standard size (or use a standard measurement like grams) for the comparison to be fair. (p.111)" },
      ],
    },
    {
      conceptId: "8.6",
      title: "The Earth as a magnet",
      icon: "🌍",
      summary:
        "The Earth has a magnetic north and south, caused by electric currents inside it and its rotation - its magnetic field looks similar to a bar magnet's. Many animals sense this field to navigate.",
      keyPoints: [
        "Electric currents inside the Earth, combined with its rotation, form a magnetic field extending around the planet.",
        "The Earth's magnetic field looks similar to the field around a bar magnet.",
        "Some sharks are repelled by magnets; lobsters, bees, moles, rats, whales and migrating birds use the Earth's magnetic field to navigate.",
      ],
      pages: [112],
      storyReference: "Magnetism in space / The Earth as a magnet, page 112",
      examples: [
        { question: "What causes the Earth's magnetic field?", answer: "Electric currents inside the Earth, combined with the Earth's rotation on its axis. (p.112)" },
        { question: "Name two animals that use the Earth's magnetic field to navigate.", answer: "Any two of: lobsters, bees, moles, rats, whales, migrating birds. (p.112)" },
      ],
      quickCheck: [
        {
          title: "Quick check · Earth's field",
          prompt: "What causes the Earth's magnetic field?",
          conceptId: "8.6",
          options: [
            { label: "Electric currents inside the Earth, and its rotation", correct: true, say: "Correct.", frame: frame([{ label: "Caused by electric currents inside the spinning Earth", at: [70, 91], note: "The real cause.", tone: "gold" }], EARTH_FOCUS) },
            { label: "A giant bar magnet buried inside the Earth", correct: false, say: "The book is explicit: this does NOT mean the Earth has a magnet inside it - it's electric currents and rotation.", frame: frame([{ label: "Caused by electric currents inside the spinning Earth", at: [70, 91], note: "Not a literal magnet inside.", tone: "red" }], EARTH_FOCUS) },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. Magnetic or not?",
      conceptId: "8.1",
      say: "Iron and steel are magnetic - a magnet attracts them. Aluminium, copper and gold are not magnetic at all.",
      frame: frame(
        [
          { label: "Magnetic (contains iron)", at: [10, 53], note: "Steel paper clip, iron nail.", tone: "gold" },
          { label: "NOT magnetic", at: [25, 53], note: "Aluminium foil, copper coin, gold ring.", tone: "green" },
        ],
        MAGNETIC_OR_NOT_FOCUS,
      ),
    },
    {
      label: "2. Like and unlike poles",
      conceptId: "8.2",
      say: "Every magnet has a north and a south pole. Like poles - two norths, or two souths - push apart. Unlike poles - a north and a south - pull together.",
      frame: frame(
        [
          { label: "Like poles REPEL", at: [41.75, 47], note: "N+N or S+S push apart.", tone: "gold" },
          { label: "Unlike poles ATTRACT", at: [60, 47], note: "N+S pull together.", tone: "green" },
        ],
        POLES_FOCUS,
      ),
    },
    {
      label: "3. The invisible field",
      conceptId: "8.3",
      say: "A magnet's force field is invisible, but iron filings reveal its shape - lines curving out from the north pole and round into the south pole.",
      frame: frame(
        [
          { label: "Magnetic field lines (invisible force)", at: [84.75, 47.5], note: "N to S, revealed by iron filings.", tone: "gold" },
        ],
        FIELD_FOCUS,
      ),
    },
    {
      label: "4. Attracting without touching",
      conceptId: "8.4",
      say: "A magnet doesn't need to touch a paper clip to pull it - as soon as the paper clip is inside the magnetic field, the force acts on it.",
      frame: frame(
        [
          { label: "Magnets can attract without touching", at: [55.5, 88.7], note: "Works at a distance.", tone: "gold" },
        ],
        DISTANCE_FOCUS,
      ),
    },
    {
      label: "5. Not all magnets are equal",
      conceptId: "8.5",
      say: "Magnets come in different shapes - horseshoe, ring, bar and circular - but shape alone doesn't tell you the strength. Some magnets are simply stronger than others.",
      frame: frame(
        [
          { label: "Not all magnets are the same strength", at: [17.75, 92.3], note: "Horseshoe, ring, bar, circular.", tone: "gold" },
        ],
        SHAPES_FOCUS,
      ),
    },
    {
      label: "6. The Earth's own magnetic field",
      conceptId: "8.6",
      say: "The Earth behaves like a giant bar magnet, with a magnetic north and south caused by electric currents and its spin. Animals like bees, birds and sharks can sense this field.",
      frame: frame(
        [
          { label: "Caused by electric currents inside the spinning Earth", at: [70, 91], note: "Why the Earth has a field.", tone: "gold" },
          { label: "Some animals sense the Earth's magnetic field to navigate", at: [95, 80], note: "Bees, birds, sharks and more.", tone: "green" },
        ],
        EARTH_FOCUS,
      ),
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Which metals are magnetic?",
      prompt: "Which of these metals is magnetic?",
      conceptId: "8.1",
      setup: frame([], MAGNETIC_OR_NOT_FOCUS),
      options: [
        { label: "Steel", correct: true, say: "Correct - steel contains iron, so it's magnetic.", frame: frame([{ label: "Magnetic (contains iron)", at: [10, 53], note: "Steel contains iron.", tone: "green" }], MAGNETIC_OR_NOT_FOCUS) },
        { label: "Aluminium", correct: false, say: "Aluminium is not magnetic - only metals like iron and steel are attracted to magnets.", frame: frame([{ label: "NOT magnetic", at: [25, 53], note: "Aluminium is not magnetic.", tone: "red" }], MAGNETIC_OR_NOT_FOCUS) },
      ],
    },
    {
      title: "Task 2 · Poles",
      prompt: "Two magnets attract each other. What must be true of the poles facing each other?",
      conceptId: "8.2",
      setup: frame([], POLES_FOCUS),
      options: [
        { label: "They are unlike poles (N and S)", correct: true, say: "Correct - unlike poles attract.", frame: frame([{ label: "Unlike poles ATTRACT", at: [60, 47], note: "N facing S.", tone: "green" }], POLES_FOCUS) },
        { label: "They are like poles (both N, or both S)", correct: false, say: "Like poles repel, not attract - only unlike poles pull together.", frame: frame([{ label: "Like poles REPEL", at: [41.75, 47], note: "This is the repelling case.", tone: "red" }], POLES_FOCUS) },
      ],
    },
    {
      title: "Task 3 · Seeing the field",
      prompt: "What reveals the pattern of an invisible magnetic field?",
      conceptId: "8.3",
      setup: frame([], FIELD_FOCUS),
      options: [
        { label: "Iron filings", correct: true, say: "Correct.", frame: frame([{ label: "Magnetic field lines (invisible force)", at: [84.75, 47.5], note: "Revealed by iron filings.", tone: "green" }], FIELD_FOCUS) },
        { label: "A magnifying glass", correct: false, say: "The field is invisible - only iron filings reveal its shape by lining up along it.", frame: frame([{ label: "Magnetic field lines (invisible force)", at: [84.75, 47.5], note: "Not visible under magnification.", tone: "red" }], FIELD_FOCUS) },
      ],
    },
    {
      title: "Task 4 · Distance",
      prompt: "For a magnet to attract a paper clip, does the paper clip need to touch the magnet?",
      conceptId: "8.4",
      setup: frame([], DISTANCE_FOCUS),
      options: [
        { label: "No, just be inside the magnetic field", correct: true, say: "Correct.", frame: frame([{ label: "Magnets can attract without touching", at: [55.5, 88.7], note: "Distance is fine.", tone: "green" }], DISTANCE_FOCUS) },
        { label: "Yes, they must touch", correct: false, say: "Magnets work at a distance - touching isn't required.", frame: frame([{ label: "Magnets can attract without touching", at: [55.5, 88.7], note: "No touching needed.", tone: "red" }], DISTANCE_FOCUS) },
      ],
    },
    {
      title: "Task 5 · Magnet strength",
      prompt: "Does the biggest magnet always have the strongest field?",
      conceptId: "8.5",
      setup: frame([], SHAPES_FOCUS),
      options: [
        { label: "Not necessarily - strength varies between magnets", correct: true, say: "Correct - not all magnets have the same strength, regardless of shape or size.", frame: frame([{ label: "Not all magnets are the same strength", at: [17.75, 92.3], note: "Strength varies.", tone: "green" }], SHAPES_FOCUS) },
        { label: "Yes - bigger always means stronger", correct: false, say: "The book explicitly asks you to test this - size alone doesn't guarantee strength.", frame: frame([{ label: "Not all magnets are the same strength", at: [17.75, 92.3], note: "Size isn't the only factor.", tone: "red" }], SHAPES_FOCUS) },
      ],
    },
    {
      title: "Task 6 · Earth's magnetism",
      prompt: "Which animal is mentioned as using the Earth's magnetic field to navigate?",
      conceptId: "8.6",
      setup: frame([], EARTH_FOCUS),
      options: [
        { label: "A migrating bird", correct: true, say: "Correct - migrating birds use the Earth's magnetic field to navigate.", frame: frame([{ label: "Some animals sense the Earth's magnetic field to navigate", at: [95, 80], note: "Birds, bees, sharks and more.", tone: "green" }], EARTH_FOCUS) },
        { label: "A goldfish", correct: false, say: "Goldfish aren't mentioned - the book names sharks, lobsters, bees, moles, rats, whales and migrating birds.", frame: frame([{ label: "Some animals sense the Earth's magnetic field to navigate", at: [95, 80], note: "Not goldfish specifically.", tone: "red" }], EARTH_FOCUS) },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each panel on the board and explain what it shows about magnets and magnetism.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "Why are iron and steel magnetic, but aluminium, copper and gold are not?", answer: "Iron is a magnetic material, and steel contains iron - so both are attracted to magnets. Aluminium, copper and gold are simply not magnetic materials.", conceptId: "8.1" },
    { ask: "What happens when you put like poles together, and unlike poles together?", answer: "Like poles (N+N or S+S) repel. Unlike poles (N+S) attract.", conceptId: "8.2" },
    { ask: "What is a magnetic field, and how can we see its pattern?", answer: "An invisible area of force around a magnet. Iron filings line up along it, revealing its pattern.", conceptId: "8.3" },
    { ask: "Does a magnet need to touch an object to attract it?", answer: "No - the object just needs to be inside the magnet's magnetic field.", conceptId: "8.4" },
    { ask: "Do all magnets have the same strength?", answer: "No - magnets come in different shapes (horseshoe, ring, bar, circular) and some are stronger than others, regardless of size or shape.", conceptId: "8.5" },
    { ask: "What causes the Earth's magnetic field?", answer: "Electric currents inside the Earth, combined with the Earth's rotation on its axis.", conceptId: "8.6" },
  ],

  writtenPractice: [
    { question: "Explain why a steel paper clip is attracted to a magnet, but a gold ring is not.", answer: "Steel contains iron, which is magnetic, so it is attracted to a magnet. Gold is not a magnetic material, so it is not attracted at all.", conceptId: "8.1" },
    { question: "Draw two magnets positioned so they would repel each other, and label their poles.", answer: "Two magnets with the same pole facing each other, e.g. N facing N (or S facing S).", conceptId: "8.2" },
    { question: "Explain how you know a magnetic field exists, even though you cannot see it.", answer: "Iron filings placed near a magnet line up along the invisible field, showing its shape and how far it extends.", conceptId: "8.3" },
    { question: "Explain why using standard measurements is important when comparing which magnet is strongest.", answer: "Standard measurements (like grams or centimetres) let different people's results be fairly compared and shared - non-standard measurements, like counting different-sized paper clips, cannot be compared fairly.", conceptId: "8.5" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Magnetic materials",
        prompt: "Which metal is magnetic?",
        conceptId: "8.1",
        options: [
          { label: "Iron", correct: true, say: "Correct.", frame: frame([{ label: "Magnetic (contains iron)", at: [10, 53], note: "Iron is magnetic.", tone: "green" }], MAGNETIC_OR_NOT_FOCUS) },
          { label: "Copper", correct: false, say: "Copper is not magnetic.", frame: frame([{ label: "NOT magnetic", at: [25, 53], note: "Copper is not magnetic.", tone: "red" }], MAGNETIC_OR_NOT_FOCUS) },
        ],
      },
      {
        title: "Q2 · Poles",
        prompt: "Do like poles attract or repel?",
        conceptId: "8.2",
        options: [
          { label: "Repel", correct: true, say: "Correct.", frame: frame([{ label: "Like poles REPEL", at: [41.75, 47], note: "Correct.", tone: "green" }], POLES_FOCUS) },
          { label: "Attract", correct: false, say: "Like poles repel each other - only unlike poles attract.", frame: frame([{ label: "Unlike poles ATTRACT", at: [60, 47], note: "This is unlike poles, not like poles.", tone: "red" }], POLES_FOCUS) },
        ],
      },
      {
        title: "Q3 · Magnetic field",
        prompt: "What reveals the shape of a magnetic field?",
        conceptId: "8.3",
        options: [
          { label: "Iron filings", correct: true, say: "Correct.", frame: frame([{ label: "Magnetic field lines (invisible force)", at: [84.75, 47.5], note: "Iron filings reveal the pattern.", tone: "green" }], FIELD_FOCUS) },
          { label: "Sand", correct: false, say: "Sand is not attracted to magnets - iron filings are used because iron is magnetic.", frame: frame([{ label: "Magnetic field lines (invisible force)", at: [84.75, 47.5], note: "Not sand.", tone: "red" }], FIELD_FOCUS) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Distance",
        prompt: "Can a magnet attract an object without touching it?",
        conceptId: "8.4",
        options: [
          { label: "Yes, if the object is inside its magnetic field", correct: true, say: "Correct.", frame: frame([{ label: "Magnets can attract without touching", at: [55.5, 88.7], note: "Correct.", tone: "green" }], DISTANCE_FOCUS) },
          { label: "No, they must always touch", correct: false, say: "Magnets can attract at a distance - touching is not required.", frame: frame([{ label: "Magnets can attract without touching", at: [55.5, 88.7], note: "Touching is not required.", tone: "red" }], DISTANCE_FOCUS) },
        ],
      },
      {
        title: "Q5 · The Earth's field",
        prompt: "What causes the Earth's magnetic field?",
        conceptId: "8.6",
        options: [
          { label: "Electric currents inside the Earth and its rotation", correct: true, say: "Correct.", frame: frame([{ label: "Caused by electric currents inside the spinning Earth", at: [70, 91], note: "Correct cause.", tone: "green" }], EARTH_FOCUS) },
          { label: "A physical bar magnet buried at the Earth's core", correct: false, say: "The book explicitly says this is NOT the case - it's electric currents and rotation, not a literal magnet.", frame: frame([{ label: "Caused by electric currents inside the spinning Earth", at: [70, 91], note: "Not a literal magnet inside.", tone: "red" }], EARTH_FOCUS) },
        ],
      },
    ],
  },

  readymade: [
    { q: "What makes a material magnetic?", a: "Containing iron - iron itself, and metals like steel that contain iron, are magnetic." },
    { q: "Do like poles attract or repel?", a: "Repel. Only unlike poles (N and S) attract." },
    { q: "What is a magnetic field?", a: "The invisible area of force around a magnet, revealed using iron filings." },
    { q: "Why is the Earth like a magnet?", a: "Electric currents inside the Earth, combined with its rotation, create a magnetic field extending around the planet." },
  ],

  chatAnswers: [
    { question: "What is magnetic and what isn't?", answer: "Iron and metals containing iron (like steel) are magnetic. Aluminium, copper and gold are not magnetic.", keywords: ["magnetic", "iron", "steel", "aluminium", "copper", "gold"], conceptId: "8.1" },
    { question: "Do like poles attract or repel?", answer: "Like poles (N+N or S+S) repel each other. Unlike poles (N+S) attract each other.", keywords: ["poles", "attract", "repel", "north", "south"], conceptId: "8.2" },
    { question: "What is a magnetic field?", answer: "The invisible area of force around a magnet. Iron filings placed near a magnet line up along the field, revealing its pattern.", keywords: ["magnetic field", "invisible", "iron filings"], conceptId: "8.3" },
    { question: "Can magnets work without touching?", answer: "Yes - a magnet can attract an object at a distance, as long as the object is inside its magnetic field.", keywords: ["distance", "touching", "attract"], conceptId: "8.4" },
    { question: "Why is the Earth like a magnet?", answer: "Electric currents inside the Earth, combined with the Earth's rotation on its axis, create a magnetic field that extends around the planet - similar to the field around a bar magnet. Some animals, like bees, birds and sharks, can sense this field to navigate.", keywords: ["earth", "magnet", "magnetic field", "electric currents"], conceptId: "8.6" },
  ],
};
