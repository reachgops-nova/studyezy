import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 4 - The digestive system.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Biology strand, pages 45-56. Diagram art is real, NotebookLM-generated
 * illustration (Infographic studio, from the unit's own page-cited text as
 * the source) with hotspots laid over it - same method as Units 1-3.
 *
 * Every definition below is pulled from the textbook's own text (the
 * caterpillar digestion example, the human digestive system diagram, the
 * digestive-system model activity's real numbers, the balanced food plate,
 * and the hidden sugar dangers page) rather than invented, so the board and
 * the real book teach the same words in the same order.
 */

const DIGEST_IMG = "/board-art/cambridge-4-science-unit4-digestive-system.png";
const DIGEST_ALT = "Four panels: the human digestive system, a caterpillar's digestive system, the balanced diet plate, and sugar dangers.";

const FULL_FOCUS = { x: 0, y: 0, w: 100, h: 100 };
const HUMAN_FOCUS = { x: 0, y: 8, w: 50, h: 47 };
const CATERPILLAR_FOCUS = { x: 50, y: 8, w: 50, h: 47 };
const DIET_PLATE_FOCUS = { x: 0, y: 50, w: 50, h: 50 };
const SUGAR_FOCUS = { x: 50, y: 50, w: 50, h: 50 };

function frame(
  hotspots: NonNullable<ImageFrame["hotspots"]>,
  focus: ImageFrame["focus"] = FULL_FOCUS,
  motionPath?: ImageFrame["motionPath"],
): { image: ImageFrame } {
  return {
    image: {
      src: DIGEST_IMG,
      alt: DIGEST_ALT,
      title: "The digestive system",
      hotspots,
      focus,
      motionPath,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_4: BoardUnit = {
  unitKey: "cambridge-4-science-4",
  title: "The digestive system",
  badge: "Grade 4 · Biology · Unit 4",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "Digestion, and the three main jobs of the digestive system",
      "The main parts of the human digestive system, in order",
      "How a model can represent the stomach, small intestine and large intestine",
      "The balanced diet plate and what each food group does",
      "The dangers of eating too much hidden sugar",
    ],
    outcomes: [
      "Explain what digestion is and name the three jobs of the digestive system",
      "Name the main parts of the human digestive system in the order food travels through them",
      "Explain what the small intestine and large intestine each do",
      "Name the five food groups on the balanced diet plate and say what each one does",
      "Explain why eating too much sugar can be harmful",
    ],
  },

  concepts: [
    {
      conceptId: "4.1",
      title: "Digestion",
      icon: "🐛",
      summary:
        "Digestion is the process of breaking down food so it can be used by the body. The digestive system has three main jobs: it breaks down food, absorbs nutrients, and gets rid of waste.",
      keyPoints: [
        "Digestion starts in the mouth.",
        "The digestive system: breaks down food, absorbs nutrients from food, gets rid of waste.",
        "All animals have digestive systems; some are very different from a human's.",
        "A caterpillar's digestive system is simple: a mouth, then a long tube called the intestine (front and back sections), which stores nutrients in a layer of fat called the fat body. Unused food is excreted as droppings.",
      ],
      pages: [45],
      storyReference: "Digestion, page 45",
      examples: [
        { question: "What are the three main jobs of the digestive system?", answer: "It breaks down food, it absorbs nutrients from food, and it gets rid of waste. (p.45)" },
        { question: "In a caterpillar, what is the 'fat body'?", answer: "A layer of fat where the digestive system eventually stores nutrients. (p.45)" },
        { question: "What happens to food a caterpillar's body cannot use?", answer: "It is excreted (got rid of) as droppings. (p.45)" },
      ],
    },
    {
      conceptId: "4.2",
      title: "The human digestive system",
      icon: "🧑",
      summary:
        "The human digestive system is made up of several parts that work together to extract the nutrients the body needs from food and drink: mouth, oesophagus, stomach, small intestine, and large intestine.",
      keyPoints: [
        "Mouth - food is mixed with saliva, and teeth grind it into smaller pieces.",
        "Oesophagus - the tube between the mouth and the stomach.",
        "Stomach - mixes food with acid.",
        "Small intestine - absorbs nutrients.",
        "Large intestine - processes waste before it leaves the body.",
      ],
      pages: [46],
      storyReference: "The human digestive system, page 46",
      examples: [
        { question: "What does 'extract' mean, in the context of digestion?", answer: "To take out - the digestive system extracts the nutrients the body needs from food and drink. (p.46)" },
        { question: "Put these in order: stomach, mouth, oesophagus, small intestine, large intestine.", answer: "Mouth, oesophagus, stomach, small intestine, large intestine. (p.46)" },
        { question: "Why does food need to be broken into smaller pieces in the mouth before it travels down the oesophagus?", answer: "So it can travel down without causing damage. (p.46)" },
      ],
      quickCheck: [
        {
          title: "Quick check · order of the digestive system",
          prompt: "Which part comes right after the stomach?",
          conceptId: "4.2",
          options: [
            { label: "Small intestine", correct: true, say: "Yes - after the stomach, food travels into the small intestine.", frame: frame([{ label: "Small Intestine", at: [16, 35], note: "Comes after the stomach.", tone: "gold" }], HUMAN_FOCUS) },
            { label: "Mouth", correct: false, say: "The mouth is the very first part, not what comes after the stomach.", frame: frame([{ label: "Mouth", at: [11, 18], note: "This is the first part, not after the stomach.", tone: "red" }], HUMAN_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "4.3",
      title: "A model of the digestive system",
      icon: "🧪",
      summary:
        "A hands-on model can represent the digestive system: a plastic bag with orange juice represents the stomach, a tights leg represents the small intestine, and a cup with a hole represents the large intestine.",
      keyPoints: [
        "The liquid that flows out of the 'tights leg' (small intestine) represents nutrients absorbed by the body for growth and energy.",
        "What remains inside represents waste that cannot be absorbed.",
        "Pushing waste through the cup with a hole (large intestine) represents going to the toilet - producing faeces.",
        "In real humans: the small intestine is about 5 metres long; the large intestine is about 1.5 metres long.",
        "Horses, rhinos and rabbits have very large intestines - about 10 to 13 times the length of their bodies.",
      ],
      pages: [48, 49],
      storyReference: "A model of the digestive system, pages 48-49",
      examples: [
        { question: "In the model, what does the liquid that flows out of the tights leg represent?", answer: "The nutrients absorbed by the body and used for growth and energy. (p.49)" },
        { question: "About how long is the human small intestine?", answer: "About 5 metres long. (p.49)" },
        { question: "About how long is the human large intestine?", answer: "About 1.5 metres long. (p.49)" },
      ],
      quickCheck: [
        {
          title: "Quick check · small vs large intestine length",
          prompt: "Which is longer in a human: the small intestine or the large intestine?",
          conceptId: "4.3",
          options: [
            { label: "The small intestine (about 5 metres)", correct: true, say: "Correct - the small intestine (about 5 m) is much longer than the large intestine (about 1.5 m).", frame: frame([{ label: "Small Intestine", at: [16, 35], note: "About 5 metres long.", tone: "gold" }], HUMAN_FOCUS) },
            { label: "The large intestine (about 5 metres)", correct: false, say: "The large intestine is about 1.5 metres - it is the small intestine that is about 5 metres long.", frame: frame([{ label: "Large Intestine", at: [28, 38], note: "About 1.5 metres, not 5.", tone: "red" }], HUMAN_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "4.4",
      title: "Thinking about balanced diets",
      icon: "🍽️",
      summary:
        "A balanced diet means eating the right amount of food from each food group every day, plus enough water. The balanced food plate has five groups, each with its own job.",
      keyPoints: [
        "Carbohydrates (bread, rice, potatoes, pasta) - give energy.",
        "Protein (fish, eggs, meat, beans, pulses) - growth and repair.",
        "Dairy foods (milk, cheese and alternatives) - healthy, strong bones and teeth.",
        "Fruit and vegetables - vitamins and fibre, keep the digestive system healthy.",
        "Fats and oils - help store energy.",
        "Foods high in fat and sugar (biscuits, crisps, chocolate) - only occasionally, as a treat.",
        "Our bodies need about 8 glasses of water a day to stay healthy.",
      ],
      pages: [51, 52],
      storyReference: "Thinking about balanced diets, pages 51-52",
      examples: [
        { question: "Which food group gives the body energy?", answer: "Carbohydrates. (p.51)" },
        { question: "Which food group helps the body grow and repair itself?", answer: "Protein. (p.52)" },
        { question: "How much water does the body need each day to stay healthy?", answer: "About 8 glasses. (p.51)" },
      ],
      quickCheck: [
        {
          title: "Quick check · food group jobs",
          prompt: "Which food group is needed for healthy, strong bones and teeth?",
          conceptId: "4.4",
          options: [
            { label: "Dairy foods", correct: true, say: "Correct - dairy foods like milk and cheese are needed for healthy bones and teeth.", frame: frame([{ label: "Dairy Foods", at: [28, 63], note: "Healthy bones and teeth.", tone: "gold" }], DIET_PLATE_FOCUS) },
            { label: "Carbohydrates", correct: false, say: "Carbohydrates mainly give the body energy, not bone and teeth health.", frame: frame([{ label: "Carbohydrates", at: [17, 65], note: "Mainly for energy.", tone: "red" }], DIET_PLATE_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "4.5",
      title: "Hidden sugar dangers",
      icon: "🍬",
      summary:
        "The recommended maximum daily sugar for 7-10 year olds is 6 teaspoons (24 grams). Eating too much sugar can lead to tooth decay, obesity, and (later in life) Type 2 diabetes.",
      keyPoints: [
        "Maximum recommended daily sugar for 7-10 year olds: 6 teaspoons (24 g).",
        "Too much sugar and not brushing teeth regularly can cause tooth decay.",
        "Too many extra calories can lead to obesity (too much body fat), which can cause heart disease and joint problems.",
        "Eating too much sugar over time can lead to Type 2 diabetes when a person is older.",
        "Sugary foods can make you feel full, so you don't want to eat healthier food - leading to an unbalanced diet.",
      ],
      pages: [54],
      storyReference: "Hidden sugar dangers, page 54",
      examples: [
        { question: "What is the recommended maximum daily sugar for a 7-10 year old?", answer: "6 teaspoons, or 24 grams. (p.54)" },
        { question: "Name two health problems linked to eating too much sugar.", answer: "Any two of: tooth decay, obesity, Type 2 diabetes. (p.54)" },
        { question: "What does 'obese' mean?", answer: "Having too much fat for your body. (p.54)" },
      ],
      quickCheck: [
        {
          title: "Quick check · max daily sugar",
          prompt: "What is the recommended maximum daily sugar for a 7-10 year old?",
          conceptId: "4.5",
          options: [
            { label: "6 teaspoons (24g)", correct: true, say: "Correct - 6 teaspoons, or 24 grams, is the recommended daily maximum.", frame: frame([{ label: "Max Daily Sugar", at: [64, 65], note: "6 teaspoons = 24g.", tone: "gold" }], SUGAR_FOCUS) },
            { label: "6 teaspoons a meal", correct: false, say: "The 6-teaspoon limit is for the whole day, not per meal.", frame: frame([{ label: "Max Daily Sugar", at: [64, 65], note: "This is a daily limit.", tone: "red" }], SUGAR_FOCUS) },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. What is digestion?",
      conceptId: "4.1",
      say: "Digestion breaks down food so the body can use it. The digestive system has three jobs: breaking down food, absorbing nutrients, and getting rid of waste. A caterpillar has one of the simplest digestive systems of all.",
      frame: frame(
        [
          { label: "Mouth", at: [56, 20], note: "Chews leaf matter.", tone: "green" },
          { label: "Intestine (Front & Back Sections)", at: [75, 32], note: "Long tube that breaks down food.", tone: "blue" },
          { label: "Fat Body", at: [87, 19], note: "Stores nutrients as fat.", tone: "gold" },
        ],
        CATERPILLAR_FOCUS,
      ),
    },
    {
      label: "2. The human digestive system",
      conceptId: "4.2",
      say: "Food travels through the human digestive system in order: the mouth, then the oesophagus, the stomach, the small intestine, and finally the large intestine.",
      frame: frame(
        [
          { label: "Mouth", at: [11, 18], note: "Grinds food, mixes with saliva.", tone: "gold" },
          { label: "Oesophagus", at: [28, 21], note: "Connecting tube to the stomach.", tone: "green" },
          { label: "Stomach", at: [28, 30], note: "Mixes food with acid.", tone: "blue" },
          { label: "Small Intestine", at: [16, 35], note: "Absorbs liquid nutrients.", tone: "red" },
          { label: "Large Intestine", at: [28, 38], note: "Processes waste before excretion.", tone: "gold" },
        ],
        HUMAN_FOCUS,
        { points: [[11, 18], [28, 21], [28, 30], [16, 35], [28, 38]], label: "Food has travelled the whole digestive system.", tone: "gold" },
      ),
    },
    {
      label: "3. Modelling the small and large intestine",
      conceptId: "4.3",
      say: "In the model, a tights leg represents the small intestine - the liquid squeezed out is the nutrients your body absorbs. The waste that's left goes into a cup with a hole, representing the large intestine and going to the toilet.",
      frame: frame(
        [
          { label: "Small Intestine", at: [16, 35], note: "About 5 metres long - absorbs nutrients.", tone: "gold" },
          { label: "Large Intestine", at: [28, 38], note: "About 1.5 metres long - forms faeces.", tone: "green" },
        ],
        HUMAN_FOCUS,
      ),
    },
    {
      label: "4. The balanced diet plate",
      conceptId: "4.4",
      say: "A balanced diet has the right amount from every food group: carbohydrates for energy, protein for growth and repair, dairy for bones and teeth, fruit and veg for vitamins, and fats for storing energy.",
      frame: frame(
        [
          { label: "Carbohydrates", at: [17, 65], note: "Essential energy.", tone: "gold" },
          { label: "Dairy Foods", at: [28, 63], note: "Healthy bones and teeth.", tone: "green" },
          { label: "Fats and Oils", at: [30, 75], note: "Store energy.", tone: "blue" },
          { label: "Protein", at: [28, 84], note: "Growth and repair.", tone: "red" },
          { label: "Fruit and Vegetables", at: [12, 81], note: "Vitamins, fibre, healthy digestion.", tone: "gold" },
        ],
        DIET_PLATE_FOCUS,
      ),
    },
    {
      label: "5. Sugar dangers",
      conceptId: "4.5",
      say: "The recommended maximum sugar for a 7 to 10 year old is 6 teaspoons a day. Too much sugar can cause tooth decay now, and obesity or Type 2 diabetes later in life.",
      frame: frame(
        [
          { label: "Max Daily Sugar", at: [64, 65], note: "6 teaspoons = 24g, the daily max.", tone: "gold" },
          { label: "Tooth Decay", at: [60, 81], note: "From excess sugar.", tone: "green" },
          { label: "Obesity Risk", at: [75, 81], note: "From extra sugary calories.", tone: "blue" },
          { label: "Type 2 Diabetes", at: [91, 80], note: "Risk increases when older.", tone: "red" },
        ],
        SUGAR_FOCUS,
      ),
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Three jobs",
      prompt: "Which of these is NOT one of the digestive system's three main jobs?",
      conceptId: "4.1",
      setup: { text: { cards: [{ tag: "?", title: "Digestive system jobs", desc: "Breaks down food, absorbs nutrients, gets rid of waste." }] } },
      options: [
        { label: "Pumping blood around the body", correct: true, say: "Correct - that's the heart's job, not the digestive system's.", frame: { text: { cards: [{ tag: "Correct", title: "Not a digestive job", desc: "Pumping blood is the heart's job." }] } } },
        { label: "Getting rid of waste", correct: false, say: "Getting rid of waste is one of the digestive system's three real jobs.", frame: { text: { cards: [{ tag: "✗", title: "This IS a digestive job", desc: "One of the three main jobs." }] } } },
      ],
    },
    {
      title: "Task 2 · Order the parts",
      prompt: "Which part of the digestive system comes right before the small intestine?",
      conceptId: "4.2",
      setup: frame([], HUMAN_FOCUS),
      options: [
        { label: "Stomach", correct: true, say: "Correct - food goes from the stomach into the small intestine.", frame: frame([{ label: "Stomach", at: [28, 30], note: "Comes before the small intestine.", tone: "green" }], HUMAN_FOCUS) },
        { label: "Large intestine", correct: false, say: "The large intestine comes after the small intestine, not before it.", frame: frame([{ label: "Large Intestine", at: [28, 38], note: "Comes after, not before.", tone: "red" }], HUMAN_FOCUS) },
      ],
    },
    {
      title: "Task 3 · What the model represents",
      prompt: "In the digestive-system model, what does the liquid squeezed from the 'tights leg' represent?",
      conceptId: "4.3",
      setup: frame([], HUMAN_FOCUS),
      options: [
        { label: "Nutrients absorbed by the body", correct: true, say: "Correct - that liquid represents the nutrients absorbed for growth and energy.", frame: frame([{ label: "Small Intestine", at: [16, 35], note: "Absorbs nutrients.", tone: "green" }], HUMAN_FOCUS) },
        { label: "Faeces", correct: false, say: "Faeces is what's produced by the large intestine (the cup with a hole), not the tights leg.", frame: frame([{ label: "Large Intestine", at: [28, 38], note: "This is where faeces forms.", tone: "red" }], HUMAN_FOCUS) },
      ],
    },
    {
      title: "Task 4 · Food group job",
      prompt: "Which food group mainly gives the body energy?",
      conceptId: "4.4",
      setup: frame([], DIET_PLATE_FOCUS),
      options: [
        { label: "Carbohydrates", correct: true, say: "Correct - carbohydrates give the body energy.", frame: frame([{ label: "Carbohydrates", at: [17, 65], note: "Energy.", tone: "green" }], DIET_PLATE_FOCUS) },
        { label: "Protein", correct: false, say: "Protein is mainly for growth and repair, not energy.", frame: frame([{ label: "Protein", at: [28, 84], note: "Growth and repair.", tone: "red" }], DIET_PLATE_FOCUS) },
      ],
    },
    {
      title: "Task 5 · Sugar and health",
      prompt: "Which of these is a real risk of eating too much sugar, according to the book?",
      conceptId: "4.5",
      setup: frame([], SUGAR_FOCUS),
      options: [
        { label: "Tooth decay", correct: true, say: "Correct - too much sugar, without regular brushing, can cause tooth decay.", frame: frame([{ label: "Tooth Decay", at: [60, 81], note: "A real risk.", tone: "green" }], SUGAR_FOCUS) },
        { label: "Better eyesight", correct: false, say: "The book links too much sugar to tooth decay, obesity and Type 2 diabetes - not eyesight.", frame: frame([{ label: "Tooth Decay", at: [60, 81], note: "The real risks are health problems, not benefits.", tone: "red" }], SUGAR_FOCUS) },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each part of the digestive system on the board, in order, and say what job it does.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "What are the three main jobs of the digestive system?", answer: "It breaks down food, absorbs nutrients from food, and gets rid of waste.", conceptId: "4.1" },
    { ask: "Name the five main parts of the human digestive system, in order.", answer: "Mouth, oesophagus, stomach, small intestine, large intestine.", conceptId: "4.2" },
    { ask: "What do the small intestine and large intestine each do?", answer: "The small intestine absorbs nutrients for the body. The large intestine processes what's left as waste, before it leaves the body as faeces.", conceptId: "4.3" },
    { ask: "Name the five food groups on the balanced diet plate.", answer: "Carbohydrates, protein, dairy foods, fruit and vegetables, and fats and oils.", conceptId: "4.4" },
    { ask: "What is the recommended maximum daily sugar for a 7-10 year old, and what can too much sugar cause?", answer: "6 teaspoons (24g). Too much can cause tooth decay, obesity, and Type 2 diabetes later in life.", conceptId: "4.5" },
  ],

  writtenPractice: [
    { question: "Compare a caterpillar's digestive system to a human's. Name one similarity and one difference.", answer: "Similarity: both break down food and get rid of waste. Difference: a caterpillar's is a simple tube (mouth + intestine + fat body), while a human's has five separate parts including a stomach and two intestines.", conceptId: "4.1" },
    { question: "Explain what happens to food as it travels from the mouth to the large intestine.", answer: "It is chewed and mixed with saliva in the mouth, travels down the oesophagus, is mixed with acid in the stomach, has nutrients absorbed in the small intestine, and waste is processed in the large intestine before leaving the body.", conceptId: "4.2" },
    { question: "Write down one food from each of the five food groups on the balanced diet plate.", answer: "Any correct example per group, e.g. bread (carbohydrates), fish (protein), milk (dairy), carrots (fruit and vegetables), cooking oil (fats and oils).", conceptId: "4.4" },
    { question: "Give three reasons why eating too much sugar is unhealthy.", answer: "Any three of: it can cause tooth decay, it can lead to obesity, it can lead to Type 2 diabetes later in life, and it can make you feel too full to eat healthier food.", conceptId: "4.5" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Digestion",
        prompt: "What does 'digestion' mean?",
        conceptId: "4.1",
        options: [
          { label: "Breaking down food so it can be used by the body", correct: true, say: "Correct.", frame: frame([], CATERPILLAR_FOCUS) },
          { label: "Growing bigger and taller", correct: false, say: "That's growth, not digestion.", frame: frame([], CATERPILLAR_FOCUS) },
        ],
      },
      {
        title: "Q2 · Order of digestion",
        prompt: "Which comes first: the oesophagus or the stomach?",
        conceptId: "4.2",
        options: [
          { label: "Oesophagus", correct: true, say: "Correct - food travels down the oesophagus before reaching the stomach.", frame: frame([{ label: "Oesophagus", at: [28, 21], note: "Comes first.", tone: "green" }], HUMAN_FOCUS) },
          { label: "Stomach", correct: false, say: "The stomach comes after the oesophagus, not before it.", frame: frame([{ label: "Stomach", at: [28, 30], note: "Comes after the oesophagus.", tone: "red" }], HUMAN_FOCUS) },
        ],
      },
      {
        title: "Q3 · Intestine lengths",
        prompt: "About how long is the human small intestine?",
        conceptId: "4.3",
        options: [
          { label: "About 5 metres", correct: true, say: "Correct.", frame: frame([{ label: "Small Intestine", at: [16, 35], note: "About 5 metres.", tone: "green" }], HUMAN_FOCUS) },
          { label: "About 1.5 metres", correct: false, say: "1.5 metres is about the length of the large intestine, not the small intestine.", frame: frame([{ label: "Large Intestine", at: [28, 38], note: "This one is about 1.5 metres.", tone: "red" }], HUMAN_FOCUS) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Balanced diet",
        prompt: "Which food group should be eaten only occasionally, as a treat?",
        conceptId: "4.4",
        options: [
          { label: "Foods high in fat and sugar", correct: true, say: "Correct - foods like biscuits, crisps and chocolate should only be eaten occasionally.", frame: frame([], DIET_PLATE_FOCUS) },
          { label: "Fruit and vegetables", correct: false, say: "Fruit and vegetables should be eaten regularly, not just as an occasional treat.", frame: frame([{ label: "Fruit and Vegetables", at: [12, 81], note: "An everyday food group.", tone: "red" }], DIET_PLATE_FOCUS) },
        ],
      },
      {
        title: "Q5 · Sugar limit",
        prompt: "What is the recommended maximum daily sugar for a 7-10 year old, in teaspoons?",
        conceptId: "4.5",
        options: [
          { label: "6 teaspoons", correct: true, say: "Correct - 6 teaspoons, or 24 grams.", frame: frame([{ label: "Max Daily Sugar", at: [64, 65], note: "6 teaspoons.", tone: "green" }], SUGAR_FOCUS) },
          { label: "24 teaspoons", correct: false, say: "24 is the number of grams, not teaspoons - the teaspoon figure is 6.", frame: frame([{ label: "Max Daily Sugar", at: [64, 65], note: "6 tsp = 24g.", tone: "red" }], SUGAR_FOCUS) },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is digestion?", a: "The process of breaking down food so it can be used by the body." },
    { q: "What are the parts of the human digestive system, in order?", a: "Mouth, oesophagus, stomach, small intestine, large intestine." },
    { q: "What is a balanced diet?", a: "Eating the right amount of food from each food group every day, plus enough water." },
    { q: "How much sugar should a 7-10 year old have at most each day?", a: "6 teaspoons, or 24 grams." },
  ],

  chatAnswers: [
    { question: "What are the parts of the digestive system?", answer: "In order: the mouth, oesophagus, stomach, small intestine, and large intestine. Each does a different job in breaking down food and absorbing nutrients.", keywords: ["digestive system", "parts", "mouth", "stomach", "intestine"], conceptId: "4.2" },
    { question: "What does the small intestine do?", answer: "The small intestine absorbs nutrients from partly-digested food, which the body uses for growth and energy. It's about 5 metres long in humans.", keywords: ["small intestine", "absorbs", "nutrients"], conceptId: "4.3" },
    { question: "What is a balanced diet?", answer: "A balanced diet means eating the right amount of food from each food group every day - carbohydrates, protein, dairy, fruit and vegetables, and fats - plus drinking enough water.", keywords: ["balanced diet", "food groups", "carbohydrates", "protein"], conceptId: "4.4" },
    { question: "Why is too much sugar bad for you?", answer: "Too much sugar can cause tooth decay, can lead to obesity from extra calories, and can increase the risk of Type 2 diabetes later in life.", keywords: ["sugar", "tooth decay", "obesity", "diabetes"], conceptId: "4.5" },
  ],
};
