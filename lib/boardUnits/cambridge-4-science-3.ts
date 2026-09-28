import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 3 - Adaptation.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Biology strand, pages 33-43. Diagram art is real, NotebookLM-generated
 * illustration (Infographic studio, from the unit's own page-cited text as
 * the source) with hotspots laid over it - same method as Units 1 and 2.
 *
 * Every definition below is pulled from the textbook's own text (the cotton
 * grass, polar bear, lion, grasshopper, Darwin's finches, Arctic fox and
 * desert/rainforest plant examples) rather than invented, so the board and
 * the real book teach the same words in the same order.
 */

const ADAPT_IMG = "/board-art/cambridge-4-science-unit3-adaptations.png";
const ADAPT_ALT = "Six panels of animal and plant adaptations: polar bear, lion, a small prey animal, Darwin's finches, Arctic fox, and desert vs rainforest plants.";

const FULL_FOCUS = { x: 0, y: 0, w: 100, h: 100 };
const POLAR_BEAR_FOCUS = { x: 0, y: 8, w: 33, h: 50 };
const LION_FOCUS = { x: 33, y: 8, w: 34, h: 50 };
const PREY_FOCUS = { x: 66, y: 8, w: 34, h: 50 };
const FINCHES_FOCUS = { x: 0, y: 52, w: 33, h: 48 };
const FOX_FOCUS = { x: 33, y: 52, w: 34, h: 48 };
const PLANTS_FOCUS = { x: 66, y: 52, w: 34, h: 48 };

function frame(hotspots: NonNullable<ImageFrame["hotspots"]>, focus: ImageFrame["focus"] = FULL_FOCUS): { image: ImageFrame } {
  return {
    image: {
      src: ADAPT_IMG,
      alt: ADAPT_ALT,
      title: "Animal and plant adaptations",
      hotspots,
      focus,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_3: BoardUnit = {
  unitKey: "cambridge-4-science-3",
  title: "Adaptation",
  badge: "Grade 4 · Biology · Unit 3",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "What adaptation and habitat mean, and why species can become extinct",
      "How animals like the polar bear are physically adapted to their habitat",
      "Predator adaptations - physical and behavioural",
      "Prey adaptations that help animals avoid being eaten",
      "Darwin's finches and how beaks adapt to available food",
      "How animals and plants adapt to very hot or very cold environments",
    ],
    outcomes: [
      "Explain what an adaptation is, using the words habitat, species and extinct",
      "Name physical adaptations of an animal suited to a cold habitat",
      "Name at least three predator adaptations and three prey adaptations",
      "Explain what Darwin observed about finch beaks, and match a beak shape to its food",
      "Compare how a desert plant and a rainforest plant are each adapted to their environment",
    ],
  },

  concepts: [
    {
      conceptId: "3.1",
      title: "What is adaptation?",
      icon: "🌾",
      summary:
        "An adaptation is something about an animal or plant that allows it to live in its habitat - the place where it has what it needs to survive. Adaptations can be physical or behavioural, and not adapting can lead to a species becoming extinct.",
      keyPoints: [
        "Habitat - the place where a plant or animal has what it needs to survive: food, water, shelter, a place to raise young.",
        "Adaptations can be physical (e.g. waxy leaves) or behavioural (e.g. birds flying south for winter).",
        "Species - the type of animal or plant.",
        "Extinct - no more of that species left in the world.",
        "Cotton grass example: small seeds (dispersed by wind), thin leaves (less water loss), short height (protects from cold wind), fluffy white tufts (traps solar heat), and fast seed production (uses the short warm summer).",
      ],
      pages: [33],
      storyReference: "What is adaptation?, page 33",
      examples: [
        { question: "What is a habitat?", answer: "The place where a plant or animal has what it needs to survive - food, water, shelter, and a place to raise young. (p.33)" },
        { question: "What does 'extinct' mean?", answer: "No more of that species left in the world. (p.33)" },
        { question: "Why does cotton grass have fluffy white tufts?", answer: "To trap solar heat and keep the plant warm in a cold climate. (p.33)" },
      ],
    },
    {
      conceptId: "3.2",
      title: "Adaptations to different habitats",
      icon: "🐻‍❄️",
      summary:
        "A polar bear has several physical adaptations that let it survive the cold, icy conditions of the North Pole.",
      keyPoints: [
        "Thick layer of fat under the skin - keeps the bear warm.",
        "Small ears and small tail - less surface area to lose heat from.",
        "White fur - camouflage against snow and ice.",
        "Black nose and a good sense of smell - for finding prey.",
        "Large, rough, sandpaper-like paws and big claws - grip on ice, help catch prey.",
      ],
      pages: [34],
      storyReference: "Adaptations to different habitats, page 34",
      examples: [
        { question: "Why does a polar bear have a thick layer of fat?", answer: "To keep it warm in the cold, icy conditions of the North Pole. (p.34)" },
        { question: "Why is a polar bear's fur white?", answer: "For camouflage against the snow and ice. (p.34)" },
        { question: "Why are a polar bear's ears and tail small?", answer: "Smaller body parts lose less heat, which helps it survive the cold. (p.34)" },
      ],
      quickCheck: [
        {
          title: "Quick check · polar bear adaptations",
          prompt: "Why is a polar bear's fur white?",
          conceptId: "3.2",
          options: [
            { label: "Camouflage in snow and ice", correct: true, say: "Yes - white fur camouflages the bear against its snowy, icy habitat.", frame: frame([{ label: "White Fur for Camouflage", at: [30, 20], note: "Blends into snow and ice.", tone: "gold" }], POLAR_BEAR_FOCUS) },
            { label: "To reflect the sun's heat away", correct: false, say: "The book explains the white fur as camouflage against snow and ice, not as a heat reflector.", frame: frame([{ label: "White Fur for Camouflage", at: [30, 20], note: "It's about camouflage, not heat.", tone: "red" }], POLAR_BEAR_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "3.3",
      title: "Predator adaptations",
      icon: "🦁",
      summary:
        "A predator hunts and kills other animals (prey) for food. Predators have physical and behavioural adaptations that help them catch their prey.",
      keyPoints: [
        "Physical: sharp teeth and claws, camouflage colouring, streamlined bodies for speed.",
        "Lion example: strong sense of smell, forward-facing eyes (judge distance), loose belly skin (less injury risk), sun-coloured camouflaged fur, rough tongue (peels skin/scrapes flesh), retractable claws, big shoulder/leg muscles (strength to chase prey).",
        "Behavioural: trapping (e.g. most spiders), ambush (e.g. octopuses, grass snakes, crocodiles, leopards), pack hunting (e.g. hyenas, wolves, army ants, dolphins).",
      ],
      pages: [36, 37],
      storyReference: "Predator adaptations / Adapting behaviour, pages 36-37",
      examples: [
        { question: "Why do lions have forward-facing eyes?", answer: "To help judge distances accurately when stalking prey. (p.36)" },
        { question: "What job does a lion's rough tongue do?", answer: "It peels the skin off prey and scrapes flesh from the bone. (p.36)" },
        { question: "Name the three types of hunting behaviour described in the book, with an example animal for each.", answer: "Trapping (most spiders), ambush (e.g. leopards, crocodiles), pack hunting (e.g. wolves, hyenas). (p.37)" },
      ],
      quickCheck: [
        {
          title: "Quick check · why loose belly skin",
          prompt: "Why is loose skin on a lion's belly useful?",
          conceptId: "3.3",
          options: [
            { label: "Less chance of injury if kicked by prey", correct: true, say: "Correct - loose belly skin reduces injury risk if the lion is kicked while grabbing prey.", frame: frame([{ label: "Loose Belly Skin", at: [40, 68], note: "Reduces injury from a kick.", tone: "gold" }], LION_FOCUS) },
            { label: "It helps the lion swim", correct: false, say: "The book explains this adaptation as protection from injury, not swimming.", frame: frame([{ label: "Loose Belly Skin", at: [40, 68], note: "About injury, not swimming.", tone: "red" }], LION_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "3.4",
      title: "Prey adaptations",
      icon: "🦗",
      summary:
        "Prey adaptations are features that help animals avoid being caught and eaten by predators.",
      keyPoints: [
        "Eyes on the side of the head - wider field of view to spot predators.",
        "A body built for speed - to escape predators.",
        "Camouflage - to avoid being seen.",
        "Living in groups - safety in numbers.",
        "Grasshopper example: green colouring like grass makes it harder for birds and snakes to see it.",
      ],
      pages: [38],
      storyReference: "Prey adaptations, page 38",
      examples: [
        { question: "Why do many prey animals have eyes on the side of their head, rather than the front?", answer: "It gives a wider field of view, helping them spot predators approaching from more directions. (p.38)" },
        { question: "How is the grasshopper camouflaged?", answer: "It is green, like grass, which makes it harder for its predators (birds and snakes) to see it. (p.38)" },
      ],
      quickCheck: [
        {
          title: "Quick check · why side-mounted eyes",
          prompt: "Why do many prey animals have eyes on the sides of their heads?",
          conceptId: "3.4",
          options: [
            { label: "A wider field of view to spot predators", correct: true, say: "Yes - side-mounted eyes give a much wider view, helping spot danger from more angles.", frame: frame([{ label: "Side-Mounted Eyes", at: [15, 20], note: "Wide field of view.", tone: "gold" }], PREY_FOCUS) },
            { label: "To see prey of their own more easily", correct: false, say: "This is a prey adaptation for spotting predators, not for hunting.", frame: frame([{ label: "Side-Mounted Eyes", at: [15, 20], note: "For spotting predators.", tone: "red" }], PREY_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "3.5",
      title: "Darwin's finches",
      icon: "🐦",
      summary:
        "Charles Darwin noticed that finches on different Galapagos islands had different beaks, adapted to the food available in their habitat. Beaks not adapted to their environment would not survive.",
      keyPoints: [
        "Darwin sailed the world on The Beagle and visited the Galapagos Islands.",
        "Different finch species had different beaks, adapted to their environment's food.",
        "Chisel - finds hidden insects.",
        "Hook - tears flesh.",
        "Nutcracker - cracks nuts and seeds.",
        "Spear - catches fish in streams.",
      ],
      pages: [40],
      storyReference: "Darwin's finches, page 40",
      examples: [
        { question: "What did Darwin notice about finches on different Galapagos islands?", answer: "They had different beaks, each adapted to the food available on that island. (p.40)" },
        { question: "What job does a hooked beak do?", answer: "Tears flesh. (p.40)" },
        { question: "What kind of beak would be best for cracking nuts and seeds?", answer: "A nutcracker beak - short and thick. (p.40)" },
      ],
      quickCheck: [
        {
          title: "Quick check · match the beak",
          prompt: "Which beak shape is adapted for catching fish in a stream?",
          conceptId: "3.5",
          options: [
            { label: "A long, thin spear-like beak", correct: true, say: "Correct - a spear-like beak is adapted for catching fish.", frame: frame([{ label: "Spear-Like Beak", at: [28, 90], note: "Catches fish in streams.", tone: "gold" }], FINCHES_FOCUS) },
            { label: "A short, thick nutcracker beak", correct: false, say: "A nutcracker beak is adapted for cracking nuts and seeds, not catching fish.", frame: frame([{ label: "Nutcracker Beak", at: [20, 90], note: "For nuts and seeds, not fish.", tone: "red" }], FINCHES_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "3.6",
      title: "Hot and cold environments",
      icon: "🌵",
      summary:
        "Animals and plants have adaptations for surviving extreme environments - very cold, or very hot and dry or wet.",
      keyPoints: [
        "The Arctic fox has a dark summer coat and a white winter coat - a seasonal camouflage adaptation.",
        "Desert plants: thick waxy leaves (stop water loss), fleshy stems (store water), spikes (protect stored water from animals).",
        "Rainforest plants: pointed leaves (let rainwater run off), climbing stems (reach light).",
      ],
      pages: [34, 43],
      storyReference: "Hot and cold environments, pages 34 and 43",
      examples: [
        { question: "Why does the Arctic fox's coat change colour between summer and winter?", answer: "To stay camouflaged as its surroundings change colour across the seasons - dark in summer, white in winter snow. (p.43)" },
        { question: "Why do desert plants often have thick, waxy leaves?", answer: "To stop the plant losing water in the hot, dry conditions. (p.43)" },
        { question: "Why do rainforest plant leaves often have a pointed tip?", answer: "So rainwater runs off them easily. (p.43)" },
      ],
      quickCheck: [
        {
          title: "Quick check · desert or rainforest",
          prompt: "Thick, waxy leaves that stop water loss belong to which kind of plant?",
          conceptId: "3.6",
          options: [
            { label: "A desert plant", correct: true, say: "Correct - desert plants need to stop water loss in hot, dry conditions.", frame: frame([{ label: "Thick Waxy Leaves", at: [82, 65], note: "Stops water loss in the desert.", tone: "gold" }], PLANTS_FOCUS) },
            { label: "A rainforest plant", correct: false, say: "Rainforest plants have plenty of water - it's desert plants that need to stop losing it.", frame: frame([{ label: "Thick Waxy Leaves", at: [82, 65], note: "A desert adaptation.", tone: "red" }], PLANTS_FOCUS) },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. What is an adaptation?",
      conceptId: "3.1",
      say: "An adaptation is something about an animal or plant that lets it live in its habitat. If a species doesn't adapt to changes, it can become extinct - no more left in the world.",
      frame: {
        text: {
          title: "Cotton grass, adapted to a cold habitat",
          cards: [
            { tag: "Seeds", title: "Small seeds", desc: "Easily dispersed by the wind.", quote: "Small seeds - are easily dispersed by the wind. (p.33)" },
            { tag: "Leaves", title: "Thin leaves", desc: "Reduce water loss from the plant.", quote: "Thin leaves - reduce water loss from the plant. (p.33)" },
            { tag: "Height", title: "Not very tall", desc: "Protects from strong cold winds.", quote: "Not very tall - protect from strong cold winds. (p.33)" },
            { tag: "Tufts", title: "Fluffy white tufts", desc: "Traps solar heat to keep the plant warm.", quote: "Fluffy white tufts - traps solar heat to keep the plant warm when the climate is cold. (p.33)" },
          ],
        },
      },
    },
    {
      label: "2. The whole poster",
      conceptId: "3.2",
      say: "Here are six real examples of adaptation: a polar bear, a lion, a small prey animal, Darwin's finches, an Arctic fox, and desert vs rainforest plants.",
      frame: frame([], FULL_FOCUS),
    },
    {
      label: "3. Polar bear adaptations",
      conceptId: "3.2",
      say: "The polar bear is physically adapted to the cold: a thick fat layer, small ears and tail to reduce heat loss, white fur for camouflage, and large rough paws with big claws for grip on ice.",
      frame: frame(
        [
          { label: "Fat Layer for Thermal Insulation", at: [8, 20], note: "Keeps the bear warm.", tone: "gold" },
          { label: "White Fur for Camouflage", at: [30, 20], note: "Blends into snow and ice.", tone: "green" },
          { label: "Large Rough Paws", at: [17, 82], note: "Grip on ice.", tone: "blue" },
          { label: "Big Claws for Traction & Hunting", at: [28, 78], note: "Helps catch prey and grip ice.", tone: "blue" },
        ],
        POLAR_BEAR_FOCUS,
      ),
    },
    {
      label: "4. Lion predator adaptations",
      conceptId: "3.3",
      say: "The lion has many predator adaptations: a strong sense of smell, forward-facing eyes to judge distance, camouflaged fur, a rough tongue, retractable claws, and powerful muscles for chasing prey.",
      frame: frame(
        [
          { label: "Forward-Facing Eyes", at: [58, 18], note: "Judges distance when stalking.", tone: "gold" },
          { label: "Camouflaged Sun-Coloured Fur", at: [62, 25], note: "Blends into dry grassland.", tone: "green" },
          { label: "Rough Texture Tongue", at: [37, 35], note: "Peels skin, scrapes flesh.", tone: "blue" },
          { label: "Loose Belly Skin", at: [40, 68], note: "Reduces injury risk from a kick.", tone: "blue" },
        ],
        LION_FOCUS,
      ),
    },
    {
      label: "5. Prey adaptations",
      conceptId: "3.4",
      say: "Prey animals like this grasshopper have their own adaptations: eyes on the side of the head for a wide view, a fast streamlined body, and camouflage to avoid being seen.",
      frame: frame(
        [
          { label: "Side-Mounted Eyes", at: [15, 20], note: "Wide field of view.", tone: "gold" },
          { label: "Streamlined Anatomy Built for Speed", at: [85, 20], note: "Fast escape from predators.", tone: "green" },
          { label: "Environmental Camouflage", at: [85, 42], note: "Green colouring like grass.", tone: "blue" },
        ],
        PREY_FOCUS,
      ),
    },
    {
      label: "6. Darwin's finches",
      conceptId: "3.5",
      say: "Darwin noticed finches on different Galapagos islands had different beaks, each adapted to the food available: a chisel for hidden insects, a hook for tearing flesh, a nutcracker for nuts and seeds, and a spear for fish.",
      frame: frame(
        [
          { label: "Chisel-Like Beak", at: [5, 90], note: "Finds hidden insects.", tone: "gold" },
          { label: "Hooked Beak", at: [13, 90], note: "Tears flesh.", tone: "green" },
          { label: "Nutcracker Beak", at: [20, 90], note: "Cracks nuts and seeds.", tone: "blue" },
          { label: "Spear-Like Beak", at: [28, 90], note: "Catches fish in streams.", tone: "red" },
        ],
        FINCHES_FOCUS,
      ),
    },
    {
      label: "7. Arctic fox, summer and winter",
      conceptId: "3.6",
      say: "The Arctic fox's coat changes colour with the seasons - dark in summer to match bare ground, and white in winter to match the snow. Both are camouflage.",
      frame: frame(
        [
          { label: "Dark Summer Coat", at: [37, 65], note: "Camouflage against rock and soil.", tone: "gold" },
          { label: "Pure White Winter Coat", at: [61, 65], note: "Camouflage against snow.", tone: "green" },
        ],
        FOX_FOCUS,
      ),
    },
    {
      label: "8. Desert or rainforest plant?",
      conceptId: "3.6",
      say: "Desert plants store and protect water: thick waxy leaves, a fleshy water-storing stem, and sharp spikes. Rainforest plants have plenty of water, but need light: pointed leaves shed rain, and climbing stems reach up to the sun.",
      frame: frame(
        [
          { label: "Thick Waxy Leaves", at: [82, 65], note: "Stops water loss (desert).", tone: "gold" },
          { label: "Fleshy Water-Storing Stem", at: [82, 75], note: "Stores water (desert).", tone: "gold" },
          { label: "Pointed Drip-Tip Leaves", at: [94, 65], note: "Sheds rainwater (rainforest).", tone: "green" },
          { label: "Structural Climbing Stems", at: [94, 75], note: "Climbs to reach light (rainforest).", tone: "green" },
        ],
        PLANTS_FOCUS,
      ),
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Habitat or adaptation?",
      prompt: "What word means 'the place where a plant or animal has what it needs to survive'?",
      conceptId: "3.1",
      setup: { text: { cards: [{ tag: "?", title: "Definition check", desc: "Food, water, shelter, a place to raise young." }] } },
      options: [
        { label: "Habitat", correct: true, say: "Correct - a habitat is where a plant or animal has what it needs to survive.", frame: { text: { cards: [{ tag: "Correct", title: "Habitat", desc: "Where a plant or animal has what it needs." }] } } },
        { label: "Adaptation", correct: false, say: "An adaptation is a feature that helps a plant or animal survive in its habitat - not the place itself.", frame: { text: { cards: [{ tag: "✗", title: "Adaptation is a feature, not a place", desc: "The place is called a habitat." }] } } },
      ],
    },
    {
      title: "Task 2 · Polar bear paws",
      prompt: "Why does a polar bear have large, rough, sandpaper-like paws?",
      conceptId: "3.2",
      setup: frame([], POLAR_BEAR_FOCUS),
      options: [
        { label: "For grip on ice and snow", correct: true, say: "Correct - large, rough paws give the bear grip on slippery ice.", frame: frame([{ label: "Large Rough Paws", at: [17, 82], note: "Grip on ice.", tone: "green" }], POLAR_BEAR_FOCUS) },
        { label: "To help it swim faster", correct: false, say: "The book describes these paws as helping grip on ice, not swimming speed.", frame: frame([{ label: "Large Rough Paws", at: [17, 82], note: "About grip, not swimming.", tone: "red" }], POLAR_BEAR_FOCUS) },
      ],
    },
    {
      title: "Task 3 · Predator behaviour",
      prompt: "A leopard hiding, then pouncing when prey comes close, is an example of which hunting behaviour?",
      conceptId: "3.3",
      setup: frame([], LION_FOCUS),
      options: [
        { label: "Ambush", correct: true, say: "Correct - hiding then pouncing is ambush hunting.", frame: frame([{ label: "Forward-Facing Eyes", at: [58, 18], note: "Helps judge distance for the pounce.", tone: "green" }], LION_FOCUS) },
        { label: "Pack hunting", correct: false, say: "Pack hunting means hunting in a group, like wolves - a leopard hiding alone is ambush.", frame: frame([{ label: "Forward-Facing Eyes", at: [58, 18], note: "This is ambush, done alone.", tone: "red" }], LION_FOCUS) },
      ],
    },
    {
      title: "Task 4 · Prey adaptation",
      prompt: "Which is a prey adaptation, not a predator adaptation?",
      conceptId: "3.4",
      setup: frame([], PREY_FOCUS),
      options: [
        { label: "Living in groups", correct: true, say: "Correct - living in groups is a prey adaptation for safety in numbers.", frame: frame([{ label: "Streamlined Anatomy Built for Speed", at: [85, 20], note: "A prey adaptation.", tone: "green" }], PREY_FOCUS) },
        { label: "Retractable claws", correct: false, say: "Retractable claws are a predator adaptation, used to grab and hold prey.", frame: frame([{ label: "Environmental Camouflage", at: [85, 42], note: "This unit's prey adaptations don't include claws.", tone: "red" }], PREY_FOCUS) },
      ],
    },
    {
      title: "Task 5 · Match the beak",
      prompt: "A finch that eats mostly hidden insects would be best adapted with which beak?",
      conceptId: "3.5",
      setup: frame([], FINCHES_FOCUS),
      options: [
        { label: "A chisel-like beak", correct: true, say: "Correct - a chisel-like beak is adapted for finding hidden insects.", frame: frame([{ label: "Chisel-Like Beak", at: [5, 90], note: "Finds hidden insects.", tone: "green" }], FINCHES_FOCUS) },
        { label: "A hooked beak", correct: false, say: "A hooked beak is adapted for tearing flesh, not finding hidden insects.", frame: frame([{ label: "Hooked Beak", at: [13, 90], note: "For tearing flesh.", tone: "red" }], FINCHES_FOCUS) },
      ],
    },
    {
      title: "Task 6 · Desert plant feature",
      prompt: "Which feature helps a desert plant protect the water it has stored?",
      conceptId: "3.6",
      setup: frame([], PLANTS_FOCUS),
      options: [
        { label: "Sharp spikes", correct: true, say: "Correct - spikes protect a desert plant's stored water from thirsty animals.", frame: frame([{ label: "Thick Waxy Leaves", at: [82, 65], note: "Spikes also protect stored water.", tone: "green" }], PLANTS_FOCUS) },
        { label: "Pointed drip-tip leaves", correct: false, say: "Pointed drip-tip leaves are a rainforest adaptation for shedding rain, not a desert water-protection feature.", frame: frame([{ label: "Pointed Drip-Tip Leaves", at: [94, 65], note: "A rainforest adaptation.", tone: "red" }], PLANTS_FOCUS) },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each animal or plant on the board and explain out loud how one of its features helps it survive.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "What is an adaptation, and what is a habitat?", answer: "An adaptation is something about an animal or plant that lets it live in its habitat - the place where it has what it needs to survive.", conceptId: "3.1" },
    { ask: "Name three physical adaptations that help a polar bear survive the cold.", answer: "Any three of: thick fat layer, small ears, white fur, small tail, large rough paws, big claws.", conceptId: "3.2" },
    { ask: "Name three predator adaptations of a lion.", answer: "Any three of: strong sense of smell, forward-facing eyes, loose belly skin, camouflaged fur, rough tongue, retractable claws, big muscles.", conceptId: "3.3" },
    { ask: "Name three prey adaptations.", answer: "Any three of: eyes on the side of the head, a body built for speed, camouflage, living in groups.", conceptId: "3.4" },
    { ask: "What did Darwin discover about finch beaks?", answer: "Finches on different Galapagos islands had different beaks, each adapted to the food available on that island.", conceptId: "3.5" },
    { ask: "Name one adaptation of a desert plant and one of a rainforest plant.", answer: "Desert: thick waxy leaves, fleshy water-storing stem, or spikes. Rainforest: pointed drip-tip leaves, or climbing stems.", conceptId: "3.6" },
  ],

  writtenPractice: [
    { question: "Explain why a species might become extinct if it does not adapt to changes in its environment.", answer: "If it cannot survive the changes, it will die out, and if none of that species are left anywhere in the world, it has become extinct.", conceptId: "3.1" },
    { question: "Write down two predator adaptations and two prey adaptations.", answer: "Predator: e.g. sharp claws, camouflage to sneak up on prey. Prey: e.g. eyes on the side of the head, living in groups.", conceptId: "3.4" },
    { question: "Explain, using Darwin's finches, how a beak shape can be an adaptation.", answer: "Different finches had beaks shaped for the food available on their island - e.g. a nutcracker beak for cracking nuts and seeds. A poorly adapted beak would make it harder to find food and survive.", conceptId: "3.5" },
    { question: "Explain why an Arctic fox's coat changes colour between summer and winter.", answer: "So it stays camouflaged against its surroundings, which change colour with the seasons - dark ground in summer, white snow in winter.", conceptId: "3.6" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · What is a habitat",
        prompt: "What is a habitat?",
        conceptId: "3.1",
        options: [
          { label: "The place where a plant or animal has what it needs to survive", correct: true, say: "Correct.", frame: { text: { cards: [{ tag: "Correct", title: "Habitat", desc: "Food, water, shelter, a place to raise young." }] } } },
          { label: "A feature that helps an animal survive", correct: false, say: "That describes an adaptation, not a habitat.", frame: { text: { cards: [{ tag: "✗", title: "That's an adaptation", desc: "A habitat is the place, not the feature." }] } } },
        ],
      },
      {
        title: "Q2 · Polar bear fur",
        prompt: "Why is the polar bear's fur white?",
        conceptId: "3.2",
        options: [
          { label: "Camouflage against snow and ice", correct: true, say: "Correct.", frame: frame([{ label: "White Fur for Camouflage", at: [30, 20], note: "Blends into its habitat.", tone: "green" }], POLAR_BEAR_FOCUS) },
          { label: "To keep it cool in summer", correct: false, say: "The book explains this as camouflage, in a permanently cold habitat.", frame: frame([{ label: "White Fur for Camouflage", at: [30, 20], note: "About camouflage.", tone: "red" }], POLAR_BEAR_FOCUS) },
        ],
      },
      {
        title: "Q3 · Predator adaptation",
        prompt: "What does a lion's loose belly skin help protect against?",
        conceptId: "3.3",
        options: [
          { label: "Injury if kicked by prey", correct: true, say: "Correct.", frame: frame([{ label: "Loose Belly Skin", at: [40, 68], note: "Reduces injury risk.", tone: "green" }], LION_FOCUS) },
          { label: "Losing too much body heat", correct: false, say: "That's not the reason given in the book - it's about reducing injury from a kick.", frame: frame([{ label: "Loose Belly Skin", at: [40, 68], note: "About injury, not heat.", tone: "red" }], LION_FOCUS) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Darwin's finches",
        prompt: "Which beak would be best adapted for cracking nuts and seeds?",
        conceptId: "3.5",
        options: [
          { label: "A short, thick nutcracker beak", correct: true, say: "Correct.", frame: frame([{ label: "Nutcracker Beak", at: [20, 90], note: "Cracks nuts and seeds.", tone: "green" }], FINCHES_FOCUS) },
          { label: "A long, thin spear-like beak", correct: false, say: "A spear-like beak is adapted for catching fish, not cracking nuts and seeds.", frame: frame([{ label: "Spear-Like Beak", at: [28, 90], note: "For catching fish.", tone: "red" }], FINCHES_FOCUS) },
        ],
      },
      {
        title: "Q5 · Desert vs rainforest",
        prompt: "Why do rainforest plants often have pointed, drip-tip leaves?",
        conceptId: "3.6",
        options: [
          { label: "So rainwater runs off them easily", correct: true, say: "Correct.", frame: frame([{ label: "Pointed Drip-Tip Leaves", at: [94, 65], note: "Sheds rainwater.", tone: "green" }], PLANTS_FOCUS) },
          { label: "To store water for the dry season", correct: false, say: "Storing water is what a fleshy desert stem does - rainforests aren't short of water.", frame: frame([{ label: "Fleshy Water-Storing Stem", at: [82, 75], note: "That's a desert adaptation.", tone: "red" }], PLANTS_FOCUS) },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is an adaptation?", a: "Something about an animal or plant that allows it to live in its habitat." },
    { q: "What is a habitat?", a: "The place where a plant or animal has what it needs to survive - food, water, shelter, a place to raise young." },
    { q: "What is a predator adaptation?", a: "A feature that helps a predator catch its prey, like sharp claws or camouflage." },
    { q: "What did Darwin learn from the Galapagos finches?", a: "That different finches had different beaks, each adapted to the food available in their habitat." },
  ],

  chatAnswers: [
    { question: "What is an adaptation?", answer: "An adaptation is something about an animal or plant that allows it to live in its habitat. Adaptations can be physical, like white fur, or behavioural, like flying south for winter.", keywords: ["adaptation", "habitat", "physical", "behavioural"], conceptId: "3.1" },
    { question: "What are predator adaptations?", answer: "Features that help a predator catch its prey, such as sharp claws, camouflage, a streamlined body for speed, or hunting behaviours like ambush and pack hunting.", keywords: ["predator", "adaptations", "claws", "camouflage"], conceptId: "3.3" },
    { question: "What are prey adaptations?", answer: "Features that help prey avoid being caught, such as eyes on the side of the head, a body built for speed, camouflage, or living in groups.", keywords: ["prey", "adaptations", "camouflage", "speed"], conceptId: "3.4" },
    { question: "What did Darwin discover about finches?", answer: "On the Galapagos Islands, Darwin noticed finches on different islands had different beaks, each adapted to the food available there - like a hooked beak for tearing flesh or a nutcracker beak for seeds.", keywords: ["darwin", "finches", "beaks", "galapagos"], conceptId: "3.5" },
  ],
};
