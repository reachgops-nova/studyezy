import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 1 - Plant parts.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Biology strand, pages 8-14. Diagram art is real, NotebookLM-generated
 * illustration (Infographic studio, from the unit's own page-cited text as
 * the source) with hotspots laid over it, mirroring the poster/hotspot
 * pattern used for Math Unit 12, English Unit 6 and TN Science Unit 22 -
 * not hand-drawn SVG, which read as illegible/mismarked on this unit's
 * first pass.
 *
 * Every definition below is pulled from the textbook's own diagrams and text
 * (petal/sepal/stamen/carpel naming, the botanist framing, the flowering vs
 * non-flowering grouping) rather than invented, so the board and the real
 * book teach the same words in the same order.
 */

const FLOWER_IMG = "/board-art/cambridge-4-science-unit1-flower-parts.png";
const FLOWER_ALT = "Anatomy of a flowering plant: a labelled cross-section showing petal, sepal, stamen (anther, filament), and carpel/pistil (stigma, style, ovary, ovule).";

/** Whole poster, title cropped out. */
const FULL_FOCUS = { x: 2, y: 14, w: 96, h: 82 };
/** Left/centre-left: the stamen bracket, anthers and filaments. */
const STAMEN_FOCUS = { x: 2, y: 26, w: 55, h: 48 };
/** Right/centre: the carpel bracket, stigma/style/ovary/ovule. */
const CARPEL_FOCUS = { x: 35, y: 26, w: 63, h: 55 };

function frame(hotspots: NonNullable<ImageFrame["hotspots"]>, focus: ImageFrame["focus"] = FULL_FOCUS): { image: ImageFrame } {
  return {
    image: {
      src: FLOWER_IMG,
      alt: FLOWER_ALT,
      title: "A flower, dissected",
      hotspots,
      focus,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_1: BoardUnit = {
  unitKey: "cambridge-4-science-1",
  title: "Plant parts",
  badge: "Grade 4 · Biology · Unit 1",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "What a botanist studies, and why plants are worth studying scientifically",
      "The parts of a flower: petal, sepal, stamen and carpel",
      "The male parts of a flower: the anther and the filament",
      "The female parts of a flower: the stigma, style, ovary and ovule",
      "Flowering plants compared with non-flowering plants such as conifers, mosses and ferns",
    ],
    outcomes: [
      "Name the parts of a flower on a real, dissected example",
      "Explain that the stamen is the male part and the carpel is the female part",
      "Say what the anther, filament, stigma, style, ovary and ovule each do",
      "Say whether all plants produce flowers, and name some that do not",
    ],
  },

  concepts: [
    {
      conceptId: "1.1",
      title: "Flowering plants",
      icon: "🌸",
      summary:
        "A botanist is a scientist who studies plants - their parts, functions, growth and reproduction. Flowers vary hugely in colour and scent.",
      keyPoints: [
        "There are hundreds of thousands of species of flowering plants.",
        "Some flowers are brightly coloured, e.g. the hibiscus.",
        "Some flowers are scented and usually smell nice, e.g. jasmine.",
        "Some flowers are neither brightly coloured nor scented, e.g. rice flowers.",
      ],
      pages: [8, 10],
      storyReference: "Working like a botanist / Flowering plants, pages 8 and 10",
      examples: [
        { question: "Why might a flower be brightly coloured?", answer: "To attract pollinators such as insects and birds towards it. (page 10)" },
        { question: "Name a flower that is scented rather than brightly coloured.", answer: "Jasmine - it usually smells nice. (page 10)" },
        { question: "Are all flowers colourful or scented?", answer: "No - rice flowers are neither brightly coloured nor scented. (page 10)" },
      ],
    },
    {
      conceptId: "1.2",
      title: "Parts of a flower",
      icon: "🌼",
      summary:
        "A flower can be dissected (taken apart) to study its parts: the petal, the sepal, the stamen (male part) and the carpel (female part), all held up by the stem.",
      keyPoints: [
        "Petal - part of the usually colourful outer ring of the flower.",
        "Sepal - sits beneath the petals, nearer the stem.",
        "Stamen - the male part of the flower.",
        "Carpel - the female part of the flower.",
        "Stem - supports the whole flower.",
      ],
      pages: [11],
      storyReference: "Parts of a flower, page 11",
      examples: [
        { question: "What does 'dissect' mean?", answer: "To take something apart to study it. (page 11)" },
        { question: "Which flower part is usually the most colourful, and sits on the outside?", answer: "The petal. (page 11)" },
        { question: "Which part sits below the petals, closer to the stem?", answer: "The sepal. (page 11)" },
      ],
      quickCheck: [
        {
          title: "Quick check · name the parts",
          prompt: "Which of these is the male part of a flower?",
          conceptId: "1.2",
          options: [
            { label: "The stamen", correct: true, say: "Yes - the stamen is the male part.", frame: frame([{ label: "Stamen (male)", at: [22, 47], note: "The male part of the flower.", tone: "gold" }], STAMEN_FOCUS) },
            { label: "The carpel", correct: false, say: "The carpel is the female part, not the male part.", frame: frame([{ label: "Carpel/Pistil (female)", at: [88, 47], note: "This is the female part.", tone: "red" }]) },
            { label: "The petal", correct: false, say: "The petal is not male or female - it is the usually colourful outer part.", frame: frame([{ label: "Petal", at: [48, 34], note: "Colourful outer part, not male or female.", tone: "red" }]) },
          ],
        },
      ],
    },
    {
      conceptId: "1.3",
      title: "The male parts of a flower",
      icon: "🌾",
      summary:
        "The stamen is the male part of a flower. It is made of the anther (which produces pollen) and the filament (the stalk that holds the anther up).",
      keyPoints: [
        "Stamen = anther + filament.",
        "The anther produces pollen.",
        "The filament is the stalk that holds the anther up.",
        "A flower usually has several stamens, arranged around the carpel.",
      ],
      pages: [12],
      storyReference: "The male parts of a flower, page 12",
      examples: [
        { question: "What are the two parts of a stamen?", answer: "The anther and the filament. (page 12)" },
        { question: "Which part of the stamen produces pollen?", answer: "The anther. (page 12)" },
        { question: "What job does the filament do?", answer: "It is the stalk that holds the anther up. (page 12)" },
      ],
      quickCheck: [
        {
          title: "Quick check · anther or filament",
          prompt: "Which part of the stamen actually produces the pollen?",
          conceptId: "1.3",
          options: [
            { label: "The anther", correct: true, say: "Correct - the anther produces the pollen, sitting at the top of the filament.", frame: frame([{ label: "Anther", at: [42, 43], note: "Produces pollen.", tone: "gold" }], STAMEN_FOCUS) },
            { label: "The filament", correct: false, say: "The filament is only the stalk that holds the anther up - it does not produce pollen itself.", frame: frame([{ label: "Filament", at: [44, 54], note: "The stalk, not the pollen-producer.", tone: "red" }], STAMEN_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "1.4",
      title: "The female parts of a flower",
      icon: "🌷",
      summary:
        "The carpel is the female part of a flower. It has three parts: the stigma, the style and the ovary. The ovary contains ovules, which eventually become seeds.",
      keyPoints: [
        "Carpel = stigma + style + ovary (containing ovules).",
        "The ovary contains ovules, which eventually become seeds.",
        "The style joins the stigma to the ovary.",
        "The whole stigma-to-ovule structure is sometimes called the pistil - like a vase, with the stigma as the rim, the style as the neck, and the ovary (with its ovules) as the base.",
      ],
      pages: [13],
      storyReference: "The female parts of a flower, page 13",
      examples: [
        { question: "What are the three parts of the carpel?", answer: "The stigma, the style and the ovary. (page 13)" },
        { question: "What does the ovary contain, and what do those eventually become?", answer: "The ovary contains ovules, which eventually become seeds. (page 13)" },
        { question: "What job does the style do?", answer: "It joins the stigma to the ovary. (page 13)" },
      ],
      quickCheck: [
        {
          title: "Quick check · what becomes a seed",
          prompt: "What part of the carpel eventually becomes a seed?",
          conceptId: "1.4",
          options: [
            { label: "The ovule", correct: true, say: "Yes - the ovules inside the ovary eventually become seeds.", frame: frame([{ label: "Ovule", at: [51, 58], note: "The ovules inside eventually become seeds.", tone: "gold" }], CARPEL_FOCUS) },
            { label: "The stigma", correct: false, say: "The stigma sits at the top of the carpel - it is not what becomes the seed.", frame: frame([{ label: "Stigma", at: [50, 40], note: "Top of the carpel, not the seed.", tone: "red" }], CARPEL_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "1.5",
      title: "Do all plants have flowers?",
      icon: "🌲",
      summary:
        "Botanists divide plants into two main groups: flowering plants and non-flowering plants. Non-flowering plants include conifers, liverworts, mosses and ferns. All plants make their own food and are green, but not all plants have flowers.",
      keyPoints: [
        "Flowering plants: e.g. hibiscus, jasmine, rice.",
        "Non-flowering plants: conifers, liverworts, mosses, ferns.",
        "All plants (flowering or not) make their own food and are green.",
        "Not all plants have flowers.",
      ],
      pages: [14],
      storyReference: "Do all plants have flowers?, page 14",
      examples: [
        { question: "Name two groups that botanists divide plants into.", answer: "Flowering plants and non-flowering plants. (page 14)" },
        { question: "Name two examples of non-flowering plants.", answer: "Any two of: conifers, liverworts, mosses, ferns. (page 14)" },
        { question: "Is it true that only flowering plants make their own food?", answer: "No - all plants make their own food and are green, whether or not they flower. (page 14)" },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. Meet the flower",
      conceptId: "1.1",
      say: "Botanists are scientists who study plants - their parts, their functions, and how they grow and reproduce. Flowers come in every colour, and some are scented too.",
      frame: {
        text: {
          title: "Flowering plants",
          cards: [
            { tag: "Bright", title: "Hibiscus", desc: "Brightly coloured, to attract attention.", quote: "Some flowers are brightly coloured, such as the hibiscus flower. (p.10)" },
            { tag: "Scented", title: "Jasmine", desc: "Usually smells nice.", quote: "Some flowers are scented and usually smell nice, for example jasmine. (p.10)" },
            { tag: "Neither", title: "Rice flowers", desc: "Not brightly coloured, not scented.", quote: "Some flowers, however, are neither brightly coloured nor scented, such as rice flowers. (p.10)" },
          ],
        },
      },
    },
    {
      label: "2. The outer parts",
      conceptId: "1.2",
      say: "Every flower is held up by its stem. The petal is usually the colourful outer part, and just beneath it sits the sepal.",
      frame: frame([
        { label: "Petal", at: [48, 34], note: "Usually the most colourful, outer part of the flower.", tone: "green" },
        { label: "Sepal", at: [38, 62], note: "Sits beneath the petals, nearer the stem.", tone: "blue" },
        { label: "Stem", at: [49, 67], note: "Holds up the whole flower.", tone: "blue" },
      ]),
    },
    {
      label: "3. Stamen and carpel",
      conceptId: "1.2",
      say: "Inside the petals sit the flower's two most important parts: the stamen, the male part, and the carpel, the female part.",
      frame: frame([
        { label: "Stamen (male)", at: [8, 43], note: "The male part of the flower.", tone: "gold" },
        { label: "Carpel / Pistil (female)", at: [92, 43], note: "The female part of the flower.", tone: "gold" },
      ]),
    },
    {
      label: "4. Anther and filament",
      conceptId: "1.3",
      say: "Zoom into the stamen: the anther sits at the top and produces pollen. The filament is the stalk beneath it that holds the anther up.",
      frame: frame(
        [
          { label: "Anther", at: [42, 43], note: "Produces pollen.", tone: "gold" },
          { label: "Filament", at: [44, 54], note: "The stalk that holds the anther up.", tone: "green" },
        ],
        STAMEN_FOCUS,
      ),
    },
    {
      label: "5. Stigma, style, ovary, ovule",
      conceptId: "1.4",
      say: "Zoom into the carpel: the stigma is at the top, the style is the neck joining it to the ovary, and the ovary holds the ovules, which eventually become seeds.",
      frame: frame(
        [
          { label: "Stigma", at: [50, 40], note: "The top of the carpel.", tone: "green" },
          { label: "Style", at: [54, 47], note: "Joins the stigma to the ovary.", tone: "blue" },
          { label: "Ovary", at: [57, 57], note: "Contains the ovules.", tone: "gold" },
          { label: "Ovule", at: [51, 58], note: "Eventually becomes a seed.", tone: "red" },
        ],
        CARPEL_FOCUS,
      ),
    },
    {
      label: "6. Flowering or not?",
      conceptId: "1.5",
      say: "Not every plant has flowers. Botanists group plants into flowering plants and non-flowering plants - like conifers, liverworts, mosses and ferns - but all of them make their own food and are green.",
      frame: {
        text: {
          title: "Flowering vs non-flowering",
          columns: [
            { label: "Flowering plants", items: ["Hibiscus", "Jasmine", "Rice"], tone: "green" },
            { label: "Non-flowering plants", items: ["Conifers", "Liverworts", "Mosses", "Ferns"], tone: "blue" },
          ],
        },
      },
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Brightly coloured or scented?",
      prompt: "Jasmine is described in the book as which kind of flower?",
      conceptId: "1.1",
      setup: { text: { cards: [{ tag: "?", title: "Jasmine", desc: "What kind of flower is it?" }] } },
      options: [
        { label: "Scented", correct: true, say: "Right - jasmine is scented and usually smells nice.", frame: { text: { cards: [{ tag: "Scented ✓", title: "Jasmine", desc: "Usually smells nice." }] } } },
        { label: "Neither coloured nor scented", correct: false, say: "That describes rice flowers, not jasmine.", frame: { text: { cards: [{ tag: "✗", title: "Jasmine is scented", desc: "Rice flowers are the neither/nor example." }] } } },
      ],
    },
    {
      title: "Task 2 · Find the petal",
      prompt: "Which labelled part is usually the most colourful, outer part of the flower?",
      conceptId: "1.2",
      setup: frame([]),
      options: [
        { label: "Petal", correct: true, say: "Yes - the petal is usually the colourful outer part.", frame: frame([{ label: "Petal", at: [48, 34], note: "Correct.", tone: "green" }]) },
        { label: "Sepal", correct: false, say: "The sepal sits beneath the petals, nearer the stem - it is not the outer, colourful part.", frame: frame([{ label: "Sepal", at: [38, 62], note: "Not the outer, colourful part.", tone: "red" }]) },
        { label: "Stem", correct: false, say: "The stem holds the flower up - it is not a petal.", frame: frame([{ label: "Stem", at: [49, 67], note: "Support, not the colourful part.", tone: "red" }]) },
      ],
    },
    {
      title: "Task 3 · Male or female?",
      prompt: "Which part of the flower is the male part?",
      conceptId: "1.2",
      setup: frame([]),
      options: [
        { label: "Stamen", correct: true, say: "Correct - the stamen is the male part.", frame: frame([{ label: "Stamen (male)", at: [8, 43], note: "Male part.", tone: "gold" }]) },
        { label: "Carpel", correct: false, say: "The carpel is the female part.", frame: frame([{ label: "Carpel/Pistil (female)", at: [92, 43], note: "Female part.", tone: "red" }]) },
      ],
    },
    {
      title: "Task 4 · What does the anther do?",
      prompt: "What is the job of the anther?",
      conceptId: "1.3",
      setup: frame([{ label: "Anther", at: [42, 43], note: "?", tone: "gold" }], STAMEN_FOCUS),
      options: [
        { label: "It produces pollen", correct: true, say: "Yes - the anther produces the pollen.", frame: frame([{ label: "Anther", at: [42, 43], note: "Produces pollen. ✓", tone: "green" }], STAMEN_FOCUS) },
        { label: "It holds the anther up", correct: false, say: "That is the filament's job, not the anther's - the filament is the stalk.", frame: frame([{ label: "Filament", at: [44, 54], note: "This is the stalk.", tone: "red" }], STAMEN_FOCUS) },
      ],
    },
    {
      title: "Task 5 · What becomes a seed?",
      prompt: "Which part of the carpel eventually becomes a seed?",
      conceptId: "1.4",
      setup: frame([{ label: "Ovary", at: [57, 57], note: "?", tone: "gold" }], CARPEL_FOCUS),
      options: [
        { label: "The ovule", correct: true, say: "Right - the ovule inside the ovary eventually becomes a seed.", frame: frame([{ label: "Ovule", at: [51, 58], note: "Becomes a seed. ✓", tone: "green" }], CARPEL_FOCUS) },
        { label: "The style", correct: false, say: "The style only joins the stigma to the ovary - it does not become a seed.", frame: frame([{ label: "Style", at: [54, 47], note: "Just a connector.", tone: "red" }], CARPEL_FOCUS) },
      ],
    },
    {
      title: "Task 6 · Flowering or non-flowering",
      prompt: "Which of these is a non-flowering plant?",
      conceptId: "1.5",
      setup: { text: { columns: [{ label: "Sort it", items: ["Moss"] }] } },
      options: [
        { label: "Moss", correct: true, say: "Correct - moss is a non-flowering plant, along with conifers, liverworts and ferns.", frame: { text: { columns: [{ label: "Non-flowering ✓", items: ["Moss"], tone: "green" }] } } },
        { label: "Hibiscus", correct: false, say: "Hibiscus is a flowering plant.", frame: { text: { columns: [{ label: "Flowering, not non-flowering", items: ["Hibiscus"], tone: "red" }] } } },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each part of the dissected flower on the board, then say its name and its job out loud.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "What is a botanist?", answer: "A scientist who studies plants - their parts, functions, and how they grow and reproduce.", conceptId: "1.1" },
    { ask: "Name the four main parts of a flower.", answer: "The petal, the sepal, the stamen and the carpel - all held up by the stem.", conceptId: "1.2" },
    { ask: "What is the stamen made of, and what does each part do?", answer: "The anther, which produces pollen, and the filament, the stalk that holds the anther up.", conceptId: "1.3" },
    { ask: "What is the carpel made of, and what does each part do?", answer: "The stigma, the style and the ovary. The ovary holds ovules, which eventually become seeds, and the style joins the stigma to the ovary.", conceptId: "1.4" },
    { ask: "Do all plants have flowers?", answer: "No - non-flowering plants like conifers, liverworts, mosses and ferns exist too, though all plants make their own food and are green.", conceptId: "1.5" },
  ],

  writtenPractice: [
    { question: "Explain, in your own words, what 'dissect' means and why a botanist might dissect a flower.", answer: "Dissect means to take something apart. A botanist dissects a flower to study its different parts closely.", conceptId: "1.2" },
    { question: "Write down the two parts of the stamen and what each one does.", answer: "The anther, which produces pollen, and the filament, the stalk that holds the anther up.", conceptId: "1.3" },
    { question: "Write down the three parts of the carpel and what each one does.", answer: "The stigma (top), the style (joins stigma to ovary) and the ovary (holds the ovules, which become seeds).", conceptId: "1.4" },
    { question: "Name one flowering plant and one non-flowering plant from the book.", answer: "Any flowering example (hibiscus, jasmine, rice) and any non-flowering example (conifer, liverwort, moss, fern).", conceptId: "1.5" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Male part",
        prompt: "Which is the male part of a flower?",
        conceptId: "1.2",
        options: [
          { label: "Stamen", correct: true, say: "Correct.", frame: frame([{ label: "Stamen (male)", at: [8, 43], note: "Male part.", tone: "green" }]) },
          { label: "Carpel", correct: false, say: "The carpel is the female part.", frame: frame([{ label: "Carpel/Pistil (female)", at: [92, 43], note: "Female part.", tone: "red" }]) },
        ],
      },
      {
        title: "Q2 · Anther's job",
        prompt: "What does the anther do?",
        conceptId: "1.3",
        options: [
          { label: "Produces pollen", correct: true, say: "Correct.", frame: frame([{ label: "Anther", at: [42, 43], note: "Produces pollen.", tone: "green" }], STAMEN_FOCUS) },
          { label: "Joins stigma to ovary", correct: false, say: "That is the style's job, and the style belongs to the carpel, not the stamen.", frame: frame([{ label: "Style", at: [54, 47], note: "Not the anther.", tone: "red" }], CARPEL_FOCUS) },
        ],
      },
      {
        title: "Q3 · What becomes a seed",
        prompt: "Which part eventually becomes a seed?",
        conceptId: "1.4",
        options: [
          { label: "Ovule", correct: true, say: "Correct.", frame: frame([{ label: "Ovule", at: [51, 58], note: "Becomes a seed.", tone: "green" }], CARPEL_FOCUS) },
          { label: "Petal", correct: false, say: "The petal is the colourful outer part, not part of the seed-forming carpel.", frame: frame([{ label: "Petal", at: [48, 34], note: "Not part of the carpel.", tone: "red" }]) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Non-flowering plants",
        prompt: "Which pair are both non-flowering plants?",
        conceptId: "1.5",
        options: [
          { label: "Moss and fern", correct: true, say: "Correct - both are non-flowering plants.", frame: { text: { columns: [{ label: "Non-flowering ✓", items: ["Moss", "Fern"], tone: "green" }] } } },
          { label: "Hibiscus and rice", correct: false, say: "Both of those are flowering plants.", frame: { text: { columns: [{ label: "Flowering, not non-flowering", items: ["Hibiscus", "Rice"], tone: "red" }] } } },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is a botanist?", a: "A scientist who studies plants." },
    { q: "What are the four main parts of a flower?", a: "Petal, sepal, stamen and carpel." },
    { q: "What is the stamen?", a: "The male part of the flower, made of the anther and the filament." },
    { q: "What is the carpel?", a: "The female part of the flower, made of the stigma, style and ovary." },
  ],

  chatAnswers: [
    { question: "What is the stamen?", answer: "The stamen is the male part of a flower. It is made of the anther, which produces pollen, and the filament, the stalk that holds the anther up.", keywords: ["stamen", "male", "anther", "filament"], conceptId: "1.3" },
    { question: "What is the carpel?", answer: "The carpel is the female part of a flower. It has three parts: the stigma, the style and the ovary, which contains ovules that eventually become seeds.", keywords: ["carpel", "female", "stigma", "style", "ovary", "ovule"], conceptId: "1.4" },
    { question: "Do all plants have flowers?", answer: "No. Botanists group plants into flowering plants and non-flowering plants, such as conifers, liverworts, mosses and ferns. All plants make their own food and are green, whether or not they flower.", keywords: ["all plants", "flowers", "non-flowering", "conifer", "moss", "fern"], conceptId: "1.5" },
  ],
};
