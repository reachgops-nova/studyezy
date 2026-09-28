import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 2 - The life cycle of a flowering plant.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Biology strand, pages 18-27. Diagram art is real, NotebookLM-generated
 * illustration (Infographic studio, from the unit's own page-cited text as
 * the source) with hotspots laid over it - same method as Unit 1's flower
 * parts poster, not hand-drawn SVG.
 *
 * Every definition below is pulled from the textbook's own text (the five
 * named life-cycle steps: pollination, fertilisation, seed development,
 * seed dispersal, germination) rather than invented, so the board and the
 * real book teach the same words in the same order.
 */

const CYCLE_IMG = "/board-art/cambridge-4-science-unit2-lifecycle.png";
const CYCLE_ALT = "The 5-stage life cycle of a flowering plant: pollination, fertilisation, seed development, seed dispersal, germination, arranged as a circle.";

const FULL_FOCUS = { x: 0, y: 0, w: 100, h: 100 };
/** Top-right quadrant: Stage 1 Pollination. Pixel-verified against the
 * actual poster (2026-09-26 fix) - the old box bled Stage 2's title in at
 * the bottom; real user finding: labels were showing next to the wrong
 * neighbouring stage's text. */
const POLLINATION_FOCUS = { x: 58, y: 0, w: 42, h: 50 };
/** Right / lower-right: Stage 2 Fertilisation. Tightened to start after
 * Stage 3's caption block (which runs to ~72% width) so it no longer
 * bleeds Stage 3's title/caption in on the left. */
const FERTILISATION_FOCUS = { x: 72, y: 50, w: 28, h: 48 };
/** Bottom-centre: Stage 3 Seed development. Narrowed on both sides - it
 * was previously wide enough to catch Stage 4's corner illustration on the
 * left and Stage 2's caption on the right. */
const SEED_DEV_FOCUS = { x: 35, y: 55, w: 37, h: 45 };
/** Bottom-left: Stage 4 Seed dispersal. */
const DISPERSAL_FOCUS = { x: 0, y: 53, w: 35, h: 46 };
/** Top-left: Stage 5 Germination. Narrowed - the old box ran wide enough to
 * clip Stage 5's own title mid-word on the right. */
const GERMINATION_FOCUS = { x: 0, y: 0, w: 28, h: 52 };

function frame(
  hotspots: NonNullable<ImageFrame["hotspots"]>,
  focus: ImageFrame["focus"] = FULL_FOCUS,
  motionPath?: ImageFrame["motionPath"],
): { image: ImageFrame } {
  return {
    image: {
      src: CYCLE_IMG,
      alt: CYCLE_ALT,
      title: "The life cycle of a flowering plant",
      hotspots,
      focus,
      motionPath,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_2: BoardUnit = {
  unitKey: "cambridge-4-science-2",
  title: "The life cycle of a flowering plant",
  badge: "Grade 4 · Biology · Unit 2",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "Pollination: what it is, and why plants need pollen to move from the anther to the stigma",
      "Animals and wind as pollinators, and how plants attract them",
      "Fertilisation: how a pollen tube joins the male and female cells",
      "Seed development: the embryo, food supply and seed coat",
      "Seed dispersal: wind, animals and other methods",
      "Germination: what a seed needs to grow, and germination rate",
    ],
    outcomes: [
      "Name the five stages of a flowering plant's life cycle in order",
      "Explain pollination and name at least one animal and one non-animal pollinator",
      "Describe what happens during fertilisation, using the words pollen tube, style and ovule",
      "Name the three parts of a seed",
      "Name at least two ways seeds are dispersed",
      "Explain what germination is and calculate a simple germination rate",
    ],
  },

  concepts: [
    {
      conceptId: "2.1",
      title: "Pollination",
      icon: "🌼",
      summary:
        "Flowering plants reproduce - they make new plants. Pollination is when pollen moves from the anther (a male part) to the stigma (a female part) of the same flower or another flower.",
      keyPoints: [
        "Pollen is a fine powder found on the anthers of flowers.",
        "Pollination = pollen moving from anther to stigma.",
        "This can happen on the same flower, or between two flowers of the same kind of plant.",
        "The life cycle has five stages: pollination, fertilisation, seed development, seed dispersal, germination - then it begins again.",
      ],
      pages: [18, 19],
      storyReference: "Flower life cycle step 1: pollination, pages 18-19",
      examples: [
        { question: "What is pollen, and where is it found?", answer: "A fine powder found on the anthers of flowers. (p.19)" },
        { question: "What is pollination?", answer: "Pollen moving from the anther (male part) to the stigma (female part) of the same flower or another flower. (p.19)" },
        { question: "How many stages does the life cycle of a flowering plant have?", answer: "Five: pollination, fertilisation, seed development, seed dispersal, germination. (p.18-27)" },
      ],
      quickCheck: [
        {
          title: "Quick check · what is pollination",
          prompt: "Pollination is pollen moving from the anther to which other part?",
          conceptId: "2.1",
          options: [
            { label: "The stigma", correct: true, say: "Yes - pollen moves from the anther (male) to the stigma (female).", frame: frame([{ label: "Stigma", at: [84, 34], note: "Where pollen lands.", tone: "gold" }], POLLINATION_FOCUS) },
            { label: "The ovary", correct: false, say: "The ovary is reached later, during fertilisation - not during pollination itself.", frame: frame([{ label: "Ovary", at: [90, 78], note: "Reached later, during fertilisation.", tone: "red" }], FERTILISATION_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "2.2",
      title: "Animals and wind as pollinators",
      icon: "🐝",
      summary:
        "The plant cannot move pollen by itself, so it needs help. Animals such as bees, bats and hummingbirds brush against pollen and carry it to another flower. Some plants use wind instead.",
      keyPoints: [
        "Pollinators: animals (mammals, birds, insects) that accidentally carry pollen between flowers.",
        "Plants attract pollinators with brightly coloured petals, a pleasant scent, or nectar (a sugary liquid).",
        "A butterfly reaching nectar with its tongue brushes against the anthers and picks up pollen.",
        "Some plants (e.g. those with catkins) use wind instead of animals - wind-pollinated flowers are usually dull, not colourful, and do not need nectar.",
      ],
      pages: [20],
      storyReference: "Animals and wind as pollinators, page 20",
      examples: [
        { question: "Name three animals that can be pollinators.", answer: "Any three of: bees, bats, hummingbirds (or other mammals, birds, insects). (p.20)" },
        { question: "Why do many flowers have brightly coloured petals or a scent?", answer: "To attract pollinators so they stop by and pick up pollen. (p.20)" },
        { question: "Why are wind-pollinated flowers usually dull rather than colourful?", answer: "They do not need to attract animal pollinators, since the wind carries their pollen instead. (p.20)" },
      ],
    },
    {
      conceptId: "2.3",
      title: "Fertilisation",
      icon: "🌱",
      summary:
        "Fertilisation is the next step: a pollen grain on the stigma grows a pollen tube down through the style to the ovary, where the male cell joins the female cell in the ovule.",
      keyPoints: [
        "A pollen grain lands on the stigma of a flower of the same kind of plant.",
        "The pollen grain grows a pollen tube down through the centre of the style towards the ovary.",
        "The male cell inside the pollen grain passes down the tube to join the female cell in the ovule - this is fertilisation.",
        "After fertilisation, the ovary develops into a fruit where seeds grow.",
      ],
      pages: [22],
      storyReference: "Flower life cycle step 2: fertilisation, page 22",
      examples: [
        { question: "What grows down through the style after a pollen grain lands on the stigma?", answer: "A pollen tube. (p.22)" },
        { question: "Where do the male and female cells join during fertilisation?", answer: "In the ovule. (p.22)" },
        { question: "What does the ovary develop into after fertilisation?", answer: "A fruit, where seeds grow. (p.22)" },
      ],
      quickCheck: [
        {
          title: "Quick check · the pollen tube",
          prompt: "The pollen tube grows down through which part to reach the ovary?",
          conceptId: "2.3",
          options: [
            { label: "The style", correct: true, say: "Correct - the pollen tube grows down through the style towards the ovary.", frame: frame([{ label: "Style", at: [86, 69], note: "The pollen tube grows through here.", tone: "gold" }], FERTILISATION_FOCUS) },
            { label: "The petal", correct: false, say: "The petal is not part of this pathway - the tube travels through the style.", frame: frame([{ label: "Style", at: [86, 69], note: "This is the real pathway.", tone: "red" }], FERTILISATION_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "2.4",
      title: "Seed development",
      icon: "🌰",
      summary:
        "Once a flower has been fertilised, the ovary develops into a fruit where seeds grow. A seed has three main parts: an embryo, a food supply, and a seed coat.",
      keyPoints: [
        "Embryo - the baby plant.",
        "Food supply - feeds the embryo until it can make its own food.",
        "Seed coat - protects the seed from damage.",
      ],
      pages: [23],
      storyReference: "Flower life cycle step 3: seed development, page 23",
      examples: [
        { question: "What are the three main parts of a seed?", answer: "The embryo, a food supply, and the seed coat. (p.23)" },
        { question: "What is the embryo?", answer: "The baby plant, inside the seed. (p.23)" },
        { question: "What job does the seed coat do?", answer: "It protects the seed from damage. (p.23)" },
      ],
      quickCheck: [
        {
          title: "Quick check · parts of a seed",
          prompt: "Which part of the seed is the baby plant?",
          conceptId: "2.4",
          options: [
            { label: "The embryo", correct: true, say: "Yes - the embryo is the baby plant.", frame: frame([{ label: "Embryo", at: [40, 89], note: "The baby plant.", tone: "gold" }], SEED_DEV_FOCUS) },
            { label: "The seed coat", correct: false, say: "The seed coat only protects the seed - it is not the baby plant itself.", frame: frame([{ label: "Seed Coat", at: [40, 81], note: "Protects the seed, not the baby plant.", tone: "red" }], SEED_DEV_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "2.5",
      title: "Seed dispersal",
      icon: "🍃",
      summary:
        "Seed dispersal is when a ripe fruit, or just its seeds, move away from the parent plant - by wind, by animals, or by other methods.",
      keyPoints: [
        "Wind dispersal has three types: gliders (stiff wings, e.g. Javan cucumber), parachutes (light fluffy parts, e.g. thistle), and shakers (seeds fall from openings when the stalk is shaken, e.g. poppy).",
        "Animal dispersal: hooks that catch onto fur or clothing (e.g. burrs - the inspiration for Velcro), or fruits that are eaten and later pass through in droppings (these are often soft, sweet-smelling and juicy).",
        "Other methods include drop and roll, explosion, and water.",
      ],
      pages: [24, 25, 26],
      storyReference: "Flower life cycle step 4: seed dispersal, pages 24-26",
      examples: [
        { question: "Name the three types of wind dispersal.", answer: "Gliders, parachutes, and shakers. (p.24-25)" },
        { question: "How do hooked seeds like burrs get dispersed?", answer: "They catch onto the fur of passing animals or onto clothing, and fall off later - sometimes a long way from the parent plant. (p.26)" },
        { question: "Why are animal-eaten fruits often soft, sweet and juicy?", answer: "To attract animals to eat them, so the seeds inside are carried away and later dispersed in the animal's droppings. (p.26)" },
      ],
      quickCheck: [
        {
          title: "Quick check · wind or animal?",
          prompt: "A dandelion seed with a fluffy 'parachute' is dispersed by which method?",
          conceptId: "2.5",
          options: [
            { label: "Wind", correct: true, say: "Correct - its fluffy parachute lets the wind carry it away from the parent plant.", frame: frame([{ label: "Wind Dispersal", at: [10, 72], note: "Fluffy parts carried by the wind.", tone: "gold" }], DISPERSAL_FOCUS) },
            { label: "Animal", correct: false, say: "That describes seeds with hooks, or ones eaten by animals - not a fluffy wind parachute.", frame: frame([{ label: "Animal Dispersal", at: [25, 72], note: "Hooks or eating, not fluffy parachutes.", tone: "red" }], DISPERSAL_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "2.6",
      title: "Germination",
      icon: "🌾",
      summary:
        "When a seed begins to grow, we say it has germinated. Most seeds need water and warmth (not light) to germinate, and use their food supply until they can make their own food.",
      keyPoints: [
        "Germinated = a seed has begun to grow.",
        "Most seeds need water and warmth to germinate - not light, since they are buried in soil.",
        "The seed uses its own food supply until the plant has leaves and can use sunlight to make food.",
        "Germination rate = the percentage of planted seeds that germinate, e.g. 88 out of 100 seeds germinating is a germination rate of 88%.",
      ],
      pages: [27],
      storyReference: "Flower life cycle step 5: germination, page 27",
      examples: [
        { question: "What two things do most seeds need to germinate?", answer: "Water and warmth. (p.27)" },
        { question: "Why don't seeds need light to germinate?", answer: "Because they are buried in the soil, and use their own food supply until they have leaves and can use sunlight. (p.27)" },
        { question: "Class 5 planted 100 tomato seeds and 88 germinated. What is the germination rate?", answer: "88%. (p.27)" },
      ],
      quickCheck: [
        {
          title: "Quick check · what grows first",
          prompt: "In the picture, which two things grow from the germinating seed?",
          conceptId: "2.6",
          options: [
            { label: "A root growing down and a shoot growing up", correct: true, say: "Yes - the root grows downward into the soil and the shoot grows upward.", frame: frame([{ label: "Root growing downward", at: [8, 34], note: "Grows down into the soil.", tone: "gold" }, { label: "Shoot growing upward", at: [20, 17], note: "Grows up towards the light.", tone: "gold" }], GERMINATION_FOCUS) },
            { label: "Two roots, both growing down", correct: false, say: "Only one part grows down (the root) - the other part, the shoot, grows upward.", frame: frame([{ label: "Shoot growing upward", at: [20, 17], note: "Grows up, not down.", tone: "red" }], GERMINATION_FOCUS) },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. The whole life cycle",
      conceptId: "2.1",
      say: "A flowering plant's life cycle has five stages, always in the same order: pollination, fertilisation, seed development, seed dispersal, and germination - and then it begins all over again.",
      frame: frame([], FULL_FOCUS),
    },
    {
      label: "2. Anther to stigma",
      conceptId: "2.1",
      say: "Pollination is when pollen moves from the anther, a male part, to the stigma, a female part - of the same flower or another flower of the same kind.",
      frame: frame(
        [
          { label: "Anther", at: [91, 22], note: "Where pollen comes from.", tone: "gold" },
          { label: "Stigma", at: [84, 34], note: "Where pollen lands.", tone: "green" },
        ],
        POLLINATION_FOCUS,
        { points: [[91, 22], [84, 34]], label: "Pollen reaches the stigma.", tone: "green" },
      ),
    },
    {
      label: "3. Animals and wind",
      conceptId: "2.2",
      say: "The plant cannot move its own pollen, so it needs help - from animals like bees, bats and hummingbirds, or sometimes from the wind.",
      frame: {
        text: {
          title: "Pollinators",
          cards: [
            { tag: "Insect", title: "Bee", desc: "Brushes against anthers while feeding, carrying pollen to the next flower.", quote: "Animals, such as mammals, birds and insects, brush against the pollen and accidentally carry it to another flower. (p.20)" },
            { tag: "Mammal", title: "Bat", desc: "Visits flowers at night and picks up pollen the same way.", quote: "We call these animals pollinators. (p.20)" },
            { tag: "Bird", title: "Hummingbird", desc: "Feeds on nectar and carries pollen between flowers.", quote: "Some plants also produce a sugary liquid called nectar. (p.20)" },
            { tag: "No animal", title: "Wind (catkins)", desc: "Dull, not colourful, no nectar needed.", quote: "Some flowering plants use the wind to help pollination. (p.20)" },
          ],
        },
      },
    },
    {
      label: "4. The pollen tube",
      conceptId: "2.3",
      say: "Once pollen lands on the stigma, it grows a pollen tube down through the style. The male cell travels down this tube to join the female cell in the ovule - that is fertilisation.",
      frame: frame(
        [
          { label: "Pollen grain", at: [90, 63], note: "Lands on the stigma.", tone: "gold" },
          { label: "Style", at: [86, 69], note: "The tube grows down through here.", tone: "blue" },
          { label: "Ovary", at: [90, 78], note: "Contains the ovule, where fertilisation happens.", tone: "green" },
        ],
        FERTILISATION_FOCUS,
        // Real user direction 2026-09-26: the pollen tube's own journey -
        // stigma, down the style, into the ovary - should be watched, not
        // just labelled. Same three points as the hotspots above, walked in
        // the order fertilisation actually happens.
        { points: [[90, 63], [86, 69], [90, 78]], label: "The pollen tube reaches the ovary.", tone: "gold" },
      ),
    },
    {
      label: "5. Inside a seed",
      conceptId: "2.4",
      say: "After fertilisation, the ovary becomes a fruit, and seeds form inside it. Every seed has the same three parts: an embryo, a food supply, and a protective seed coat.",
      frame: frame(
        [
          { label: "Embryo", at: [40, 89], note: "The baby plant.", tone: "gold" },
          { label: "Food Supply", at: [49, 70], note: "Feeds the embryo.", tone: "green" },
          { label: "Seed Coat", at: [40, 81], note: "Protects the seed.", tone: "blue" },
        ],
        SEED_DEV_FOCUS,
      ),
    },
    {
      label: "6. Wind or animal?",
      conceptId: "2.5",
      say: "Seeds move away from the parent plant in different ways: the wind can carry light, fluffy seeds, and animals can carry hooked seeds in their fur or eat fruit and pass the seeds on later.",
      frame: frame(
        [
          { label: "Wind Dispersal", at: [10, 72], note: "Light seeds carried by the wind.", tone: "gold" },
          { label: "Animal Dispersal", at: [25, 72], note: "Hooked onto fur, or eaten and passed on.", tone: "green" },
        ],
        DISPERSAL_FOCUS,
      ),
    },
    {
      label: "7. Root down, shoot up",
      conceptId: "2.6",
      say: "When a seed germinates, it sends a root downward into the soil and a shoot upward, using its own food store until it can grow leaves and make food from sunlight.",
      frame: frame(
        [
          { label: "Root growing downward", at: [8, 34], note: "Grows down into the soil.", tone: "gold" },
          { label: "Shoot growing upward", at: [20, 17], note: "Grows up towards the light.", tone: "green" },
        ],
        GERMINATION_FOCUS,
      ),
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Anther or stigma?",
      prompt: "Pollen is produced on which flower part?",
      conceptId: "2.1",
      setup: frame([], POLLINATION_FOCUS),
      options: [
        { label: "The anther", correct: true, say: "Correct - pollen is found on the anther.", frame: frame([{ label: "Anther", at: [91, 22], note: "Produces pollen.", tone: "green" }], POLLINATION_FOCUS) },
        { label: "The stigma", correct: false, say: "The stigma is where pollen lands, not where it is produced.", frame: frame([{ label: "Stigma", at: [84, 34], note: "Where pollen lands, not made.", tone: "red" }], POLLINATION_FOCUS) },
      ],
    },
    {
      title: "Task 2 · Attracting pollinators",
      prompt: "Why might a flower have brightly coloured petals or a nice scent?",
      conceptId: "2.2",
      setup: { text: { cards: [{ tag: "?", title: "Why?", desc: "Think about what the flower needs from a visitor." }] } },
      options: [
        { label: "To attract pollinators", correct: true, say: "Right - bright colours and scent attract animals that will carry pollen for the plant.", frame: { text: { cards: [{ tag: "Correct", title: "Attracting pollinators", desc: "Colour and scent bring animals to the flower." }] } } },
        { label: "To scare away insects", correct: false, say: "The opposite is true - the flower wants insects and other animals to visit.", frame: { text: { cards: [{ tag: "✗", title: "Not to scare them away", desc: "Flowers want pollinators to visit, not leave." }] } } },
      ],
    },
    {
      title: "Task 3 · What grows down the style?",
      prompt: "What grows down through the style towards the ovary?",
      conceptId: "2.3",
      setup: frame([], FERTILISATION_FOCUS),
      options: [
        { label: "A pollen tube", correct: true, say: "Yes - the pollen grain grows a pollen tube down through the style.", frame: frame([{ label: "Style", at: [86, 69], note: "The pollen tube grows here.", tone: "green" }], FERTILISATION_FOCUS) },
        { label: "A new petal", correct: false, say: "Petals do not grow after pollination - it is a pollen tube that grows towards the ovary.", frame: frame([{ label: "Style", at: [86, 69], note: "A tube, not a petal.", tone: "red" }], FERTILISATION_FOCUS) },
      ],
    },
    {
      title: "Task 4 · Protecting the seed",
      prompt: "Which part of a seed protects it from damage?",
      conceptId: "2.4",
      setup: frame([], SEED_DEV_FOCUS),
      options: [
        { label: "The seed coat", correct: true, say: "Correct - the seed coat protects the seed from damage.", frame: frame([{ label: "Seed Coat", at: [40, 81], note: "Protects the seed.", tone: "green" }], SEED_DEV_FOCUS) },
        { label: "The food supply", correct: false, say: "The food supply feeds the embryo - it does not protect the seed.", frame: frame([{ label: "Food Supply", at: [49, 70], note: "Feeds, does not protect.", tone: "red" }], SEED_DEV_FOCUS) },
      ],
    },
    {
      title: "Task 5 · Hooks or fluff?",
      prompt: "A seed covered in tiny hooks that catch onto animal fur is dispersed by which method?",
      conceptId: "2.5",
      setup: frame([], DISPERSAL_FOCUS),
      options: [
        { label: "Animal dispersal", correct: true, say: "Right - hooks that catch onto fur are a form of animal dispersal.", frame: frame([{ label: "Animal Dispersal", at: [25, 72], note: "Hooks catch onto fur.", tone: "green" }], DISPERSAL_FOCUS) },
        { label: "Wind dispersal", correct: false, say: "Wind dispersal relies on light, fluffy parts or wings, not hooks.", frame: frame([{ label: "Wind Dispersal", at: [10, 72], note: "Fluffy, not hooked.", tone: "red" }], DISPERSAL_FOCUS) },
      ],
    },
    {
      title: "Task 6 · Germination rate",
      prompt: "100 seeds were planted and 75 germinated. What is the germination rate?",
      conceptId: "2.6",
      setup: frame([], GERMINATION_FOCUS),
      options: [
        { label: "75%", correct: true, say: "Correct - 75 out of 100 is a germination rate of 75%.", frame: frame([{ label: "Germination rate", at: [18, 27], note: "75 out of 100 = 75%.", tone: "green" }], GERMINATION_FOCUS) },
        { label: "100%", correct: false, say: "100% would mean every single seed germinated - only 75 out of 100 did.", frame: frame([{ label: "Germination rate", at: [18, 27], note: "Not all seeds germinated.", tone: "red" }], GERMINATION_FOCUS) },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each stage of the life cycle in order, then say what happens at that stage before moving to the next.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "What is pollination?", answer: "Pollen moving from the anther (a male part) to the stigma (a female part) of the same flower or another flower.", conceptId: "2.1" },
    { ask: "Name two kinds of pollinators.", answer: "Any two of: bees, bats, hummingbirds, or the wind (e.g. for catkins).", conceptId: "2.2" },
    { ask: "What happens during fertilisation?", answer: "A pollen tube grows down through the style to the ovary, where the male cell joins the female cell in the ovule.", conceptId: "2.3" },
    { ask: "Name the three parts of a seed.", answer: "The embryo (baby plant), a food supply, and the seed coat (protects it).", conceptId: "2.4" },
    { ask: "Name three ways seeds are dispersed.", answer: "Any three of: wind (gliders, parachutes, shakers), animal hooks, being eaten by animals, drop and roll, explosion, water.", conceptId: "2.5" },
    { ask: "What does a seed need to germinate, and what is a germination rate?", answer: "Water and warmth (not light). A germination rate is the percentage of planted seeds that germinate.", conceptId: "2.6" },
  ],

  writtenPractice: [
    { question: "Explain, in your own words, the difference between pollination and fertilisation.", answer: "Pollination is pollen moving from anther to stigma. Fertilisation happens after, when the male cell from the pollen travels down a pollen tube to join the female cell in the ovule.", conceptId: "2.3" },
    { question: "Write down the three parts of a seed and what each one does.", answer: "Embryo (the baby plant), food supply (feeds the embryo), seed coat (protects the seed from damage).", conceptId: "2.4" },
    { question: "Describe two different ways a seed could be dispersed by wind.", answer: "Any two of: gliding on stiff wings (e.g. Javan cucumber), floating on a fluffy parachute (e.g. thistle), or falling from a shaker when the stalk is blown (e.g. poppy).", conceptId: "2.5" },
    { question: "50 bean seeds were planted and 40 germinated. What is the germination rate?", answer: "80% (40 out of 50).", conceptId: "2.6" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Pollination",
        prompt: "Pollination is pollen moving from the anther to which part?",
        conceptId: "2.1",
        options: [
          { label: "The stigma", correct: true, say: "Correct.", frame: frame([{ label: "Stigma", at: [84, 34], note: "Where pollen lands.", tone: "green" }], POLLINATION_FOCUS) },
          { label: "The petal", correct: false, say: "Petals attract pollinators, but pollen itself moves to the stigma.", frame: frame([{ label: "Stigma", at: [84, 34], note: "The real destination.", tone: "red" }], POLLINATION_FOCUS) },
        ],
      },
      {
        title: "Q2 · Fertilisation",
        prompt: "What does the pollen tube deliver to the ovule?",
        conceptId: "2.3",
        options: [
          { label: "The male cell", correct: true, say: "Correct - the male cell travels down the pollen tube to join the female cell.", frame: frame([{ label: "Ovary", at: [90, 78], note: "Contains the ovule.", tone: "green" }], FERTILISATION_FOCUS) },
          { label: "A new seed coat", correct: false, say: "The seed coat forms later, during seed development - not during fertilisation.", frame: frame([{ label: "Ovary", at: [90, 78], note: "Not where a seed coat forms yet.", tone: "red" }], FERTILISATION_FOCUS) },
        ],
      },
      {
        title: "Q3 · Seed parts",
        prompt: "Which part of a seed is the baby plant?",
        conceptId: "2.4",
        options: [
          { label: "The embryo", correct: true, say: "Correct.", frame: frame([{ label: "Embryo", at: [40, 89], note: "The baby plant.", tone: "green" }], SEED_DEV_FOCUS) },
          { label: "The food supply", correct: false, say: "The food supply feeds the embryo - it is not the baby plant itself.", frame: frame([{ label: "Food Supply", at: [49, 70], note: "Feeds the embryo.", tone: "red" }], SEED_DEV_FOCUS) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Dispersal methods",
        prompt: "A soft, sweet-smelling fruit that an animal eats disperses its seeds by which method?",
        conceptId: "2.5",
        options: [
          { label: "Being eaten, then passed in droppings", correct: true, say: "Correct - animals eat the fruit and later pass the seeds in their droppings, often far from the parent plant.", frame: frame([{ label: "Animal Dispersal", at: [25, 72], note: "Eaten, then dispersed.", tone: "green" }], DISPERSAL_FOCUS) },
          { label: "Gliding on the wind", correct: false, say: "Gliders are stiff-winged tree fruits - a soft, sweet fruit is dispersed by being eaten instead.", frame: frame([{ label: "Wind Dispersal", at: [10, 72], note: "Not how soft, sweet fruits disperse.", tone: "red" }], DISPERSAL_FOCUS) },
        ],
      },
      {
        title: "Q5 · Germination rate",
        prompt: "60 seeds were planted and 45 germinated. What is the germination rate?",
        conceptId: "2.6",
        options: [
          { label: "75%", correct: true, say: "Correct - 45 out of 60 is 75%.", frame: frame([{ label: "Germination rate", at: [18, 27], note: "45/60 = 75%.", tone: "green" }], GERMINATION_FOCUS) },
          { label: "45%", correct: false, say: "45 is the number of seeds that germinated, not the percentage - divide 45 by 60 first.", frame: frame([{ label: "Germination rate", at: [18, 27], note: "45 is a count, not the rate.", tone: "red" }], GERMINATION_FOCUS) },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is pollination?", a: "Pollen moving from the anther to the stigma of the same flower or another flower." },
    { q: "What is fertilisation?", a: "When the male cell from a pollen grain, carried down a pollen tube, joins the female cell in the ovule." },
    { q: "What are the three parts of a seed?", a: "The embryo, a food supply, and the seed coat." },
    { q: "What does a seed need to germinate?", a: "Water and warmth - not light, since it is buried in soil." },
  ],

  chatAnswers: [
    { question: "What is pollination?", answer: "Pollination is pollen moving from the anther (a male part) to the stigma (a female part) of the same flower or another flower of the same kind.", keywords: ["pollination", "anther", "stigma", "pollen"], conceptId: "2.1" },
    { question: "What is fertilisation?", answer: "Fertilisation happens after pollination: a pollen tube grows down through the style to the ovary, and the male cell joins the female cell inside the ovule.", keywords: ["fertilisation", "pollen tube", "style", "ovary", "ovule"], conceptId: "2.3" },
    { question: "What are the parts of a seed?", answer: "A seed has three main parts: the embryo (the baby plant), a food supply, and the seed coat, which protects it.", keywords: ["seed", "embryo", "food supply", "seed coat"], conceptId: "2.4" },
    { question: "How are seeds dispersed?", answer: "Seeds can be dispersed by wind (gliders, parachutes or shakers), by animals (hooks that catch onto fur, or being eaten and passed in droppings), or by other methods like drop and roll, explosion, or water.", keywords: ["seed dispersal", "wind", "animal", "hooks"], conceptId: "2.5" },
    { question: "What is a germination rate?", answer: "The percentage of planted seeds that germinate. For example, if 88 out of 100 planted seeds germinate, the germination rate is 88%.", keywords: ["germination", "rate", "percentage"], conceptId: "2.6" },
  ],
};
