import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 5 - States of matter.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Chemistry strand, pages 57-65. Diagram art is real, NotebookLM-generated
 * illustration (Infographic studio, from the unit's own page-cited text as
 * the source) with hotspots laid over it - same method as Units 1-4.
 *
 * Every definition below is pulled from the textbook's own text (the
 * particle model, common gases, water's unusual expansion on freezing,
 * boiling point, evaporation and condensation) rather than invented, so the
 * board and the real book teach the same words in the same order.
 */

const MATTER_IMG = "/board-art/cambridge-4-science-unit5-states-of-matter.png";
const MATTER_ALT = "Four panels: the particle model of solids/liquids/gases, the changing-state cycle, water's special freezing property, and common gases around us.";

const FULL_FOCUS = { x: 0, y: 0, w: 100, h: 100 };
const PARTICLE_FOCUS = { x: 0, y: 8, w: 48, h: 52 };
const CYCLE_FOCUS = { x: 48, y: 8, w: 52, h: 52 };
const WATER_PROP_FOCUS = { x: 0, y: 55, w: 48, h: 45 };
const GASES_FOCUS = { x: 48, y: 55, w: 52, h: 45 };

function frame(hotspots: NonNullable<ImageFrame["hotspots"]>, focus: ImageFrame["focus"] = FULL_FOCUS): { image: ImageFrame } {
  return {
    image: {
      src: MATTER_IMG,
      alt: MATTER_ALT,
      title: "States of matter",
      hotspots,
      focus,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_5: BoardUnit = {
  unitKey: "cambridge-4-science-5",
  title: "States of matter",
  badge: "Grade 4 · Chemistry · Unit 5",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "The particle model for solids, liquids and gases, and their properties",
      "Common gases around us: carbon dioxide, oxygen, nitrogen, hydrogen",
      "Melting and freezing, and water's unusual special property",
      "Boiling and the boiling point of water",
      "Evaporation",
      "Condensation",
      "Mixtures and dissolving: solutions, solubility, suspensions",
      "Separating mixtures: filtration and evaporation",
    ],
    outcomes: [
      "Describe how particles are arranged in a solid, a liquid and a gas",
      "Name a use for each of carbon dioxide, oxygen, nitrogen and hydrogen",
      "Explain melting and freezing, and say what is special about water when it freezes",
      "State the boiling point of water and explain what happens when water boils",
      "Explain evaporation and condensation, and say how they are opposites",
      "Define solution, soluble, solvent, solute, suspension and insoluble, with an example of each",
      "Explain why filtration separates a suspension but not a solution, and how evaporation reverses dissolving",
    ],
  },

  concepts: [
    {
      conceptId: "5.1",
      title: "Solids, liquids and gases",
      icon: "🧊",
      summary:
        "The particle model helps us imagine solids, liquids and gases. Particles are packed tightly in a solid, close together but able to flow in a liquid, and spread far apart and moving fast in a gas.",
      keyPoints: [
        "Solid: keeps its shape and volume, cannot be poured, can be cut or shaped.",
        "Liquid: keeps its volume but not its shape, takes the shape of its container, can be poured.",
        "Gas: often invisible, no fixed shape, spreads to fill its container, escapes if not sealed, can be compressed (squashed) much more easily than solids or liquids.",
      ],
      pages: [57, 58],
      storyReference: "Solids, liquids and gases, pages 57-58",
      examples: [
        { question: "Which state of matter can be poured but always keeps the same volume?", answer: "A liquid. (p.57)" },
        { question: "Why do gases need a sealed container?", answer: "Because gases do not have a fixed shape or volume and will escape if the container is not sealed. (p.58)" },
        { question: "Which state of matter can be squashed (compressed) most easily?", answer: "A gas. (p.58)" },
      ],
      quickCheck: [
        {
          title: "Quick check · particle arrangement",
          prompt: "In which state are particles spread far apart and moving fast?",
          conceptId: "5.1",
          options: [
            { label: "Gas", correct: true, say: "Yes - in a gas, particles are spread far apart and move freely at high speed.", frame: frame([{ label: "Gas State", at: [40, 30], note: "Particles spread far apart, fast-moving.", tone: "gold" }], PARTICLE_FOCUS) },
            { label: "Solid", correct: false, say: "In a solid, particles are packed tightly in a fixed arrangement, not spread apart.", frame: frame([{ label: "Solid State", at: [11, 30], note: "Tightly packed, fixed.", tone: "red" }], PARTICLE_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "5.2",
      title: "Common gases around us",
      icon: "💨",
      summary:
        "The air around us is made of four common gases, each useful in different ways: carbon dioxide, oxygen, nitrogen, and hydrogen.",
      keyPoints: [
        "Carbon dioxide - the fizz in fizzy drinks; used in fire extinguishers.",
        "Oxygen - needed for breathing; divers carry it compressed in tanks.",
        "Nitrogen - used in food packaging to keep food fresh; used as a fertiliser.",
        "Hydrogen - catches fire easily, used as rocket fuel; becomes liquid when very cold.",
      ],
      pages: [59],
      storyReference: "Common gases around us, page 59",
      examples: [
        { question: "Which gas is the fizz in fizzy drinks?", answer: "Carbon dioxide. (p.59)" },
        { question: "Why do divers carry oxygen in a tank rather than a huge balloon?", answer: "Because gases like oxygen can be compressed (squashed), so a lot fits into a small tank. (p.59)" },
        { question: "Why is hydrogen used as rocket fuel?", answer: "Because it catches fire easily. (p.59)" },
      ],
      quickCheck: [
        {
          title: "Quick check · which gas",
          prompt: "Which gas is blown into food packaging to keep food fresh?",
          conceptId: "5.2",
          options: [
            { label: "Nitrogen", correct: true, say: "Correct - nitrogen pushes out oxygen so food stays fresher for longer.", frame: frame([{ label: "Nitrogen (N₂)", at: [80.5, 75.7], note: "Keeps food fresh.", tone: "gold" }], GASES_FOCUS) },
            { label: "Hydrogen", correct: false, say: "Hydrogen is used for rocket fuel, not food packaging.", frame: frame([{ label: "Hydrogen (H₂)", at: [91, 75.7], note: "Used for rocket fuel.", tone: "red" }], GASES_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "5.3",
      title: "Melting and freezing",
      icon: "❄️",
      summary:
        "Melting is a solid changing to a liquid when heated. Freezing is a liquid changing to a solid when cooled. Water is unusual: unlike most liquids, it expands (gets bigger) rather than contracts when it freezes.",
      keyPoints: [
        "Melting: solid to liquid, by heating.",
        "Freezing: liquid to solid, by cooling (water freezes at 0°C).",
        "Most liquids contract (get smaller) when they freeze, as particles slow down and pack closer together.",
        "Water is different: its particles link together leaving gaps, so water expands when it freezes - a special property of water.",
      ],
      pages: [60, 61],
      storyReference: "Properties of water / What happens when water freezes, pages 60-61",
      examples: [
        { question: "What is melting?", answer: "A solid changing to a liquid when it is heated. (p.60)" },
        { question: "What happens to most liquids when they freeze?", answer: "They contract (get smaller), as their particles slow down and move closer together. (p.61)" },
        { question: "What is special about water when it freezes?", answer: "Unlike most liquids, water expands (gets bigger) instead of contracting. (p.61)" },
      ],
      quickCheck: [
        {
          title: "Quick check · water's special property",
          prompt: "What happens to water, unlike most other liquids, when it freezes?",
          conceptId: "5.3",
          options: [
            { label: "It expands (gets bigger)", correct: true, say: "Correct - water is unusual because it expands when it freezes.", frame: frame([{ label: "Water Expands When Frozen", at: [31.75, 73.9], note: "Unlike most liquids.", tone: "gold" }], WATER_PROP_FOCUS) },
            { label: "It contracts (gets smaller), like other liquids", correct: false, say: "Most liquids contract, but water is the exception - it expands.", frame: frame([{ label: "Most Liquids Contract When Frozen", at: [9.5, 73.9], note: "This is the normal case, not water.", tone: "red" }], WATER_PROP_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "5.4",
      title: "Boiling",
      icon: "🫧",
      summary:
        "When water is heated to 100°C, it boils and turns into a gas called water vapour. Boiling happens throughout the whole liquid, not just at the surface.",
      keyPoints: [
        "Boiling point of water = 100°C (212°F).",
        "When water boils, it turns into water vapour - a gas.",
        "Bubbles of water vapour form inside the water and rise to the top.",
        "What looks like 'steam' above a boiling pan is actually tiny liquid water droplets - the water vapour has already cooled and condensed by the time you can see it.",
      ],
      pages: [62],
      storyReference: "What happens when water boils?, page 62",
      examples: [
        { question: "What is the boiling point of water?", answer: "100°C (212°F). (p.62)" },
        { question: "What gas does water turn into when it boils?", answer: "Water vapour. (p.62)" },
        { question: "Is the visible 'steam' above a boiling pan a gas or a liquid?", answer: "A liquid - tiny water droplets, formed when the water vapour (gas) rises, cools, and condenses. (p.62)" },
      ],
    },
    {
      conceptId: "5.5",
      title: "Evaporation",
      icon: "☀️",
      summary:
        "Evaporation happens when a liquid is heated and its most energetic particles escape from the surface as a gas (water vapour) - this can happen without the liquid reaching its boiling point.",
      keyPoints: [
        "Heating gives liquid particles more energy, so they move faster.",
        "The most energetic particles escape from the surface of the liquid.",
        "They evaporate as water vapour, an invisible gas.",
        "Example: a puddle heated by the Sun slowly shrinks - the water hasn't disappeared, it has evaporated into the air.",
      ],
      pages: [63, 64],
      storyReference: "Evaporation / Evaporation all around us, pages 63-64",
      examples: [
        { question: "What is evaporation?", answer: "When a liquid's most energetic particles escape from its surface and become a gas (water vapour). (p.63)" },
        { question: "A puddle slowly shrinks in the sun. Where has the water gone?", answer: "It has evaporated - moved into the air as water vapour, an invisible gas. (p.63)" },
        { question: "Does a liquid need to reach its boiling point to evaporate?", answer: "No - evaporation happens at the surface even without boiling, whenever particles have enough energy to escape. (p.63)" },
      ],
      quickCheck: [
        {
          title: "Quick check · what is water vapour",
          prompt: "When a puddle evaporates, what has the water become?",
          conceptId: "5.5",
          options: [
            { label: "Water vapour, an invisible gas", correct: true, say: "Correct - the water has moved into the air as invisible water vapour.", frame: frame([{ label: "Boiling & Evaporation (Liquid to Gas)", at: [57.25, 43.5], note: "Evaporation is a liquid becoming a gas.", tone: "gold" }], CYCLE_FOCUS) },
            { label: "It has completely disappeared", correct: false, say: "The water hasn't disappeared - it's still there, just as an invisible gas in the air.", frame: frame([{ label: "Boiling & Evaporation (Liquid to Gas)", at: [57.25, 43.5], note: "It becomes a gas, it doesn't vanish.", tone: "red" }], CYCLE_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "5.6",
      title: "Condensation",
      icon: "🪞",
      summary:
        "Condensation is the opposite of evaporation. It happens when a gas cools down and changes back into a liquid - for example, water vapour hitting a cold mirror and turning back into water.",
      keyPoints: [
        "Condensation happens when a gas cools.",
        "The gas changes state into a liquid.",
        "Example: water vapour in a bathroom hits the cold mirror, cools, and turns into water droplets - the mirror 'steams up'.",
        "When water vapour condenses, it becomes water again.",
      ],
      pages: [65],
      storyReference: "Condensation, page 65",
      examples: [
        { question: "What is condensation?", answer: "When a gas cools and changes state into a liquid. (p.65)" },
        { question: "Why does a bathroom mirror 'steam up'?", answer: "Water vapour in the air hits the cold mirror, cools, and condenses into water droplets. (p.65)" },
        { question: "Is condensation the same process as evaporation, or the opposite?", answer: "The opposite - evaporation is liquid to gas, condensation is gas to liquid. (p.65)" },
      ],
      quickCheck: [
        {
          title: "Quick check · condensation vs evaporation",
          prompt: "Condensation changes a gas into which state?",
          conceptId: "5.6",
          options: [
            { label: "A liquid", correct: true, say: "Correct - condensation is a gas cooling and becoming a liquid.", frame: frame([{ label: "Condensation (Gas to Liquid)", at: [73.5, 24.6], note: "Gas cools into a liquid.", tone: "gold" }], CYCLE_FOCUS) },
            { label: "A solid", correct: false, say: "A gas turning directly into a solid isn't condensation - condensation is gas becoming liquid.", frame: frame([{ label: "Condensation (Gas to Liquid)", at: [73.5, 24.6], note: "Becomes a liquid, not a solid.", tone: "red" }], CYCLE_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "5.7",
      title: "Mixtures and dissolving",
      icon: "🧂",
      summary:
        "A mixture contains two or more substances mixed together. When some solids dissolve in a liquid, they form a clear solution. A solid that doesn't dissolve forms a cloudy suspension, or is insoluble.",
      keyPoints: [
        "Mixture - two or more substances mixed together (e.g. a bowl of sweets, or soil in water).",
        "Dissolve / solution - a solid mixes into a liquid so completely that it becomes invisible and the mixture stays clear (e.g. salt in water).",
        "Soluble - a solid that dissolves in a liquid (e.g. salt).",
        "Solvent - the liquid that particles dissolve in (e.g. water). Solute - the substance that dissolves (e.g. salt).",
        "Suspension - a cloudy mixture where an undissolved solid's particles float in the liquid (e.g. flour in water).",
        "Insoluble - a solid that does not dissolve, and instead drops to the bottom (e.g. sand in water).",
      ],
      pages: [66, 67],
      storyReference: "Mixtures / Dissolving, pages 66-67",
      examples: [
        { question: "What is a solution?", answer: "A clear mixture formed when a soluble solid dissolves completely in a liquid (solvent). (p.67)" },
        { question: "In a salt water solution, which is the solute and which is the solvent?", answer: "Salt is the solute (it dissolves); water is the solvent (it does the dissolving). (p.67)" },
        { question: "What is the difference between a suspension and an insoluble solid settling out?", answer: "A suspension is cloudy, with the undissolved solid's particles floating in the liquid (e.g. flour in water); an insoluble solid can instead simply drop to the bottom (e.g. sand in water). (p.67)" },
      ],
      quickCheck: [
        {
          title: "Quick check · solute or solvent",
          prompt: "In a salt water solution, what is the water called?",
          conceptId: "5.7",
          options: [
            { label: "The solvent", correct: true, say: "Correct - water is the solvent, the liquid that the salt dissolves in.", frame: { text: { cards: [{ tag: "Solvent", title: "Water", desc: "The liquid that particles dissolve in." }] } } },
            { label: "The solute", correct: false, say: "Salt is the solute (the substance that dissolves) - water is the solvent.", frame: { text: { cards: [{ tag: "Not the solute", title: "Water is the solvent", desc: "Salt is the solute here." }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "5.8",
      title: "Separating mixtures",
      icon: "🔬",
      summary:
        "Dissolving is reversible. Filtration separates an insoluble solid (a suspension) from a liquid, because its particles are too big to pass through the filter paper. But it cannot separate a true solution - evaporation is needed instead.",
      keyPoints: [
        "Filtration: pouring a mixture through filter paper. An insoluble solid (e.g. flour) is caught because its particles are too big to pass through.",
        "Filtration cannot separate a solution: a dissolved solid's particles (e.g. sugar) are small enough to pass through the filter paper along with the water.",
        "Evaporation reverses dissolving in a true solution: heating the solution makes the water evaporate as water vapour, leaving the dissolved solid behind.",
        "Dissolving is a reversible process - it is a change that can be undone.",
      ],
      pages: [69, 70, 71],
      storyReference: "Dissolving is a reversible process: filtration / evaporation, pages 69-71",
      examples: [
        { question: "Why can flour be separated from water by filtration, but sugar cannot?", answer: "Flour's particles are too big to pass through the filter paper, so they are caught. Sugar's particles are small enough to pass through the filter paper along with the water. (p.71)" },
        { question: "How can you get the dissolved sugar back out of a sugar solution?", answer: "By evaporation - heating the solution so the water evaporates as water vapour, leaving the sugar behind. (p.70)" },
        { question: "Is dissolving reversible or permanent?", answer: "Reversible - it is a change that can be undone, for example by evaporation. (p.69)" },
      ],
      quickCheck: [
        {
          title: "Quick check · filtration or evaporation",
          prompt: "How would you get salt back out of a salt water solution?",
          conceptId: "5.8",
          options: [
            { label: "Evaporation", correct: true, say: "Correct - heating the solution evaporates the water and leaves the salt behind.", frame: { text: { cards: [{ tag: "Evaporation", title: "Reverses a solution", desc: "Water evaporates, solid is left behind." }] } } },
            { label: "Filtration", correct: false, say: "Filtration cannot separate a true solution - the dissolved salt's particles pass straight through the filter paper with the water.", frame: { text: { cards: [{ tag: "Not filtration", title: "Filtration only catches insoluble solids", desc: "Dissolved salt passes straight through." }] } } },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. Particles in solids, liquids, gases",
      conceptId: "5.1",
      say: "A solid's particles are packed tightly in a fixed grid. A liquid's particles are close but jumbled, able to flow. A gas's particles are spread far apart, moving fast.",
      frame: frame(
        [
          { label: "Solid State", at: [11, 30], note: "Keeps shape and volume.", tone: "gold" },
          { label: "Liquid State", at: [26, 30], note: "Keeps volume, takes container's shape.", tone: "green" },
          { label: "Gas State", at: [40, 30], note: "No fixed shape or volume, escapes if unsealed.", tone: "blue" },
        ],
        PARTICLE_FOCUS,
      ),
    },
    {
      label: "2. Four common gases",
      conceptId: "5.2",
      say: "Carbon dioxide is the fizz in drinks. Oxygen lets divers breathe underwater. Nitrogen keeps packaged food fresh. Hydrogen is used as rocket fuel.",
      frame: frame(
        [
          { label: "Carbon Dioxide (CO₂)", at: [59.75, 75.7], note: "Fizzy drinks, fire extinguishers.", tone: "gold" },
          { label: "Oxygen (O₂)", at: [70, 75.7], note: "For breathing underwater.", tone: "green" },
          { label: "Nitrogen (N₂)", at: [80.5, 75.7], note: "Keeps food fresh.", tone: "blue" },
          { label: "Hydrogen (H₂)", at: [91, 75.7], note: "Rocket fuel.", tone: "red" },
        ],
        GASES_FOCUS,
      ),
    },
    {
      label: "3. Melting and freezing",
      conceptId: "5.3",
      say: "Melting turns a solid into a liquid when heated. Freezing turns a liquid into a solid when cooled - and water is one of the only substances that expands, not contracts, when it freezes.",
      frame: frame(
        [
          { label: "Melting (Solid to Liquid)", at: [74.5, 41.7], note: "Heating a solid.", tone: "gold" },
          { label: "Freezing (Liquid to Solid)", at: [91.5, 29.6], note: "Cooling a liquid.", tone: "green" },
        ],
        CYCLE_FOCUS,
      ),
    },
    {
      label: "4. Water's special property",
      conceptId: "5.3",
      say: "Most liquids contract - get smaller - when they freeze. Water is different: it expands. That's why ice takes up more space than the water it came from.",
      frame: frame(
        [
          { label: "Most Liquids Contract When Frozen", at: [9.5, 73.9], note: "The normal case.", tone: "green" },
          { label: "Water Expands When Frozen", at: [31.75, 73.9], note: "Water is the unusual exception.", tone: "gold" },
        ],
        WATER_PROP_FOCUS,
      ),
    },
    {
      label: "5. Boiling and evaporation",
      conceptId: "5.4",
      say: "Boiling happens throughout the liquid once it reaches 100°C, turning it into water vapour. Evaporation can happen at any temperature, but only at the liquid's surface.",
      frame: frame(
        [
          { label: "Boiling & Evaporation (Liquid to Gas)", at: [57.25, 43.5], note: "Boils at 100°C, evaporates at the surface.", tone: "gold" },
        ],
        CYCLE_FOCUS,
      ),
    },
    {
      label: "6. Condensation",
      conceptId: "5.6",
      say: "Condensation is the reverse of evaporation: when a gas cools, it changes back into a liquid - like water vapour turning into droplets on a cold mirror.",
      frame: frame(
        [
          { label: "Condensation (Gas to Liquid)", at: [73.5, 24.6], note: "The opposite of evaporation.", tone: "gold" },
        ],
        CYCLE_FOCUS,
      ),
    },
    {
      label: "7. Mixtures, solutions, suspensions",
      conceptId: "5.7",
      say: "A mixture is two or more substances mixed together. When a soluble solid dissolves in a liquid, it forms a clear solution. An insoluble solid stays visible, either floating as a cloudy suspension or settling at the bottom.",
      frame: {
        text: {
          title: "Mixtures and dissolving",
          cards: [
            { tag: "Solution", title: "Salt + water", desc: "Salt (the solute) dissolves completely in water (the solvent) - clear.", quote: "A solid that forms a solution when it is mixed with a liquid is called soluble. (p.67)" },
            { tag: "Suspension", title: "Flour + water", desc: "Flour does not dissolve - it floats, making the water cloudy.", quote: "A suspension is cloudy. You can see the particles of the solid floating in the liquid. (p.67)" },
            { tag: "Insoluble", title: "Sand + water", desc: "Sand does not dissolve and drops to the bottom.", quote: "If a solid does not dissolve in a liquid but drops to the bottom, it is called insoluble. (p.67)" },
          ],
        },
      },
    },
    {
      label: "8. Filtration or evaporation?",
      conceptId: "5.8",
      say: "Filtration catches an insoluble solid, like flour, because its particles are too big for the filter paper. But a dissolved solid, like sugar, passes straight through - to get it back, you have to evaporate the water instead.",
      frame: {
        text: {
          title: "Reversing dissolving",
          columns: [
            { label: "Filtration works on:", items: ["Insoluble solids", "Suspensions (e.g. flour + water)"], tone: "green" },
            { label: "Needs evaporation instead:", items: ["True solutions", "Dissolved solids (e.g. sugar + water)"], tone: "gold" },
          ],
        },
      },
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Which state?",
      prompt: "Which state of matter keeps its volume but changes shape to fit its container?",
      conceptId: "5.1",
      setup: frame([], PARTICLE_FOCUS),
      options: [
        { label: "Liquid", correct: true, say: "Correct - a liquid keeps its volume but takes the shape of its container.", frame: frame([{ label: "Liquid State", at: [26, 30], note: "Keeps volume, changes shape.", tone: "green" }], PARTICLE_FOCUS) },
        { label: "Solid", correct: false, say: "A solid keeps both its shape and volume - it doesn't change shape to fit a container.", frame: frame([{ label: "Solid State", at: [11, 30], note: "Keeps its own shape too.", tone: "red" }], PARTICLE_FOCUS) },
      ],
    },
    {
      title: "Task 2 · Match the gas",
      prompt: "Which gas is essential for breathing, and is compressed into tanks for divers?",
      conceptId: "5.2",
      setup: frame([], GASES_FOCUS),
      options: [
        { label: "Oxygen", correct: true, say: "Correct - oxygen is essential for breathing and compressed into diving tanks.", frame: frame([{ label: "Oxygen (O₂)", at: [70, 75.7], note: "Essential for breathing.", tone: "green" }], GASES_FOCUS) },
        { label: "Carbon dioxide", correct: false, say: "Carbon dioxide is the fizz in drinks and used in fire extinguishers, not for breathing.", frame: frame([{ label: "Carbon Dioxide (CO₂)", at: [59.75, 75.7], note: "Not for breathing.", tone: "red" }], GASES_FOCUS) },
      ],
    },
    {
      title: "Task 3 · Melting or freezing?",
      prompt: "An ice cube left on a warm table turns into a puddle of water. What is this process called?",
      conceptId: "5.3",
      setup: frame([], CYCLE_FOCUS),
      options: [
        { label: "Melting", correct: true, say: "Correct - a solid changing to a liquid by heating is melting.", frame: frame([{ label: "Melting (Solid to Liquid)", at: [74.5, 41.7], note: "Solid to liquid.", tone: "green" }], CYCLE_FOCUS) },
        { label: "Freezing", correct: false, say: "Freezing is the opposite - a liquid changing to a solid by cooling.", frame: frame([{ label: "Freezing (Liquid to Solid)", at: [91.5, 29.6], note: "This is the opposite process.", tone: "red" }], CYCLE_FOCUS) },
      ],
    },
    {
      title: "Task 4 · Boiling point",
      prompt: "At what temperature does water boil?",
      conceptId: "5.4",
      setup: frame([], CYCLE_FOCUS),
      options: [
        { label: "100°C", correct: true, say: "Correct - the boiling point of water is 100°C.", frame: frame([{ label: "Boiling & Evaporation (Liquid to Gas)", at: [57.25, 43.5], note: "100°C boiling point.", tone: "green" }], CYCLE_FOCUS) },
        { label: "0°C", correct: false, say: "0°C is water's freezing point, not its boiling point.", frame: frame([{ label: "Freezing (Liquid to Solid)", at: [91.5, 29.6], note: "0°C is freezing, not boiling.", tone: "red" }], CYCLE_FOCUS) },
      ],
    },
    {
      title: "Task 5 · Evaporation without boiling",
      prompt: "A puddle shrinks on a sunny (but not boiling-hot) day. What is happening?",
      conceptId: "5.5",
      setup: frame([], CYCLE_FOCUS),
      options: [
        { label: "Evaporation", correct: true, say: "Correct - evaporation happens at the surface, at any temperature, not just at boiling point.", frame: frame([{ label: "Boiling & Evaporation (Liquid to Gas)", at: [57.25, 43.5], note: "Evaporation happens at the surface.", tone: "green" }], CYCLE_FOCUS) },
        { label: "Boiling", correct: false, say: "Boiling only happens at 100°C throughout the liquid - a sunny puddle is evaporating, not boiling.", frame: frame([{ label: "Boiling & Evaporation (Liquid to Gas)", at: [57.25, 43.5], note: "This puddle is not at 100°C.", tone: "red" }], CYCLE_FOCUS) },
      ],
    },
    {
      title: "Task 6 · Condensation",
      prompt: "Why does a bathroom mirror 'steam up' when someone showers?",
      conceptId: "5.6",
      setup: frame([], CYCLE_FOCUS),
      options: [
        { label: "Water vapour hits the cold mirror and condenses", correct: true, say: "Correct - the gas cools on the mirror and turns back into liquid water droplets.", frame: frame([{ label: "Condensation (Gas to Liquid)", at: [73.5, 24.6], note: "Gas cools into liquid on the mirror.", tone: "green" }], CYCLE_FOCUS) },
        { label: "The mirror evaporates", correct: false, say: "Mirrors don't evaporate - it's water vapour in the air condensing on the cold glass.", frame: frame([{ label: "Condensation (Gas to Liquid)", at: [73.5, 24.6], note: "It's condensation, not evaporation.", tone: "red" }], CYCLE_FOCUS) },
      ],
    },
    {
      title: "Task 7 · Solute or solvent",
      prompt: "In a sugar-water solution, which one is the solute?",
      conceptId: "5.7",
      setup: { text: { cards: [{ tag: "?", title: "Sugar + water", desc: "Which one dissolves?" }] } },
      options: [
        { label: "Sugar", correct: true, say: "Correct - sugar is the solute, the substance that dissolves.", frame: { text: { cards: [{ tag: "Solute ✓", title: "Sugar", desc: "The substance that dissolves." }] } } },
        { label: "Water", correct: false, say: "Water is the solvent - the liquid that does the dissolving.", frame: { text: { cards: [{ tag: "✗ That's the solvent", title: "Water", desc: "The liquid the sugar dissolves in." }] } } },
      ],
    },
    {
      title: "Task 8 · Filtration or evaporation",
      prompt: "Which method would separate sand from a sand-and-water mixture?",
      conceptId: "5.8",
      setup: { text: { columns: [{ label: "Sand + water", items: ["Insoluble"] }] } },
      options: [
        { label: "Filtration", correct: true, say: "Correct - sand is insoluble, so filtration catches it.", frame: { text: { columns: [{ label: "Filtration ✓", items: ["Sand is insoluble"], tone: "green" }] } } },
        { label: "Evaporation", correct: false, say: "Evaporation is for getting a dissolved solid back from a true solution - sand never dissolved in the first place.", frame: { text: { columns: [{ label: "Not needed here", items: ["Sand never dissolved"], tone: "red" }] } } },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each stage of the changing-state cycle in order and say which process (melting, freezing, boiling/evaporation, condensation) happens there.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "Describe the particle arrangement in a solid, a liquid and a gas.", answer: "Solid: particles packed tightly in a fixed grid. Liquid: particles close together but able to move and flow. Gas: particles spread far apart, moving fast and freely.", conceptId: "5.1" },
    { ask: "Name the four common gases around us and one use for each.", answer: "Carbon dioxide (fizzy drinks, fire extinguishers), oxygen (breathing), nitrogen (food packaging), hydrogen (rocket fuel).", conceptId: "5.2" },
    { ask: "What is special about water when it freezes?", answer: "Unlike most liquids, which contract when they freeze, water expands - it takes up more space as ice than as liquid water.", conceptId: "5.3" },
    { ask: "What is the boiling point of water, and what happens when it boils?", answer: "100°C. The water turns into a gas called water vapour, with bubbles forming throughout the liquid.", conceptId: "5.4" },
    { ask: "What is evaporation?", answer: "When a liquid's most energetic particles escape from its surface as an invisible gas (water vapour) - it can happen without reaching boiling point.", conceptId: "5.5" },
    { ask: "What is condensation, and how is it related to evaporation?", answer: "Condensation is a gas cooling and turning back into a liquid - the opposite process to evaporation.", conceptId: "5.6" },
    { ask: "What are a solute, a solvent, and a solution?", answer: "The solute is the substance that dissolves (e.g. salt); the solvent is the liquid it dissolves in (e.g. water); together they form a solution.", conceptId: "5.7" },
    { ask: "Why does filtration separate flour from water, but not sugar from water?", answer: "Flour is insoluble - its particles are too big to pass through the filter paper. Sugar dissolves - its particles are small enough to pass through with the water.", conceptId: "5.8" },
  ],

  writtenPractice: [
    { question: "Explain, using the particle model, why a gas can be squashed (compressed) much more easily than a solid.", answer: "A gas's particles are spread far apart with lots of space between them, so they can be pushed closer together. A solid's particles are already packed tightly, leaving little room to compress.", conceptId: "5.1" },
    { question: "Explain why water pipes can sometimes crack in very cold weather.", answer: "Water inside the pipe expands as it freezes (unlike most liquids, which contract), and that expansion can crack the pipe.", conceptId: "5.3" },
    { question: "Explain the difference between boiling and evaporation.", answer: "Boiling happens throughout the whole liquid, only at its boiling point (100°C for water). Evaporation happens only at the liquid's surface, and can happen at any temperature.", conceptId: "5.5" },
    { question: "Describe, step by step, what happens to water as it goes from ice, to liquid, to water vapour, and back to liquid again.", answer: "Ice melts into liquid water (melting). The water is heated and turns into water vapour, a gas (boiling/evaporation). The water vapour cools and turns back into liquid water droplets (condensation).", conceptId: "5.6" },
    { question: "Explain the difference between a solution and a suspension, using an example of each.", answer: "A solution is clear because the solid has completely dissolved, e.g. salt in water. A suspension is cloudy because the undissolved solid's particles are floating in the liquid, e.g. flour in water.", conceptId: "5.7" },
    { question: "Explain why evaporation, not filtration, is needed to get salt back from salt water.", answer: "Salt is soluble, so its dissolved particles are small enough to pass straight through filter paper along with the water - filtration cannot catch them. Evaporation instead removes the water as water vapour, leaving the salt behind.", conceptId: "5.8" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Gas properties",
        prompt: "Which property is true of a gas?",
        conceptId: "5.1",
        options: [
          { label: "It has no fixed shape or volume", correct: true, say: "Correct.", frame: frame([{ label: "Gas State", at: [40, 30], note: "No fixed shape or volume.", tone: "green" }], PARTICLE_FOCUS) },
          { label: "It keeps a fixed shape", correct: false, say: "That describes a solid, not a gas.", frame: frame([{ label: "Solid State", at: [11, 30], note: "This one keeps its shape.", tone: "red" }], PARTICLE_FOCUS) },
        ],
      },
      {
        title: "Q2 · Gas uses",
        prompt: "Which gas is used to keep packaged food fresh for longer?",
        conceptId: "5.2",
        options: [
          { label: "Nitrogen", correct: true, say: "Correct.", frame: frame([{ label: "Nitrogen (N₂)", at: [80.5, 75.7], note: "Keeps food fresh.", tone: "green" }], GASES_FOCUS) },
          { label: "Carbon dioxide", correct: false, say: "Carbon dioxide provides fizz in drinks and is used in fire extinguishers - nitrogen is the one used in food packaging.", frame: frame([{ label: "Carbon Dioxide (CO₂)", at: [59.75, 75.7], note: "Not the food-freshness gas.", tone: "red" }], GASES_FOCUS) },
        ],
      },
      {
        title: "Q3 · Water and freezing",
        prompt: "What happens to water's volume when it freezes?",
        conceptId: "5.3",
        options: [
          { label: "It increases (expands)", correct: true, say: "Correct - water is unusual because it expands when it freezes.", frame: frame([{ label: "Water Expands When Frozen", at: [31.75, 73.9], note: "Water's special property.", tone: "green" }], WATER_PROP_FOCUS) },
          { label: "It decreases (contracts), like most liquids", correct: false, say: "Most liquids do contract, but water is the exception - it expands.", frame: frame([{ label: "Most Liquids Contract When Frozen", at: [9.5, 73.9], note: "Not what water does.", tone: "red" }], WATER_PROP_FOCUS) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Boiling vs evaporation",
        prompt: "Which process can happen at any temperature, not just at the boiling point?",
        conceptId: "5.5",
        options: [
          { label: "Evaporation", correct: true, say: "Correct - evaporation happens at the surface at any temperature.", frame: frame([{ label: "Boiling & Evaporation (Liquid to Gas)", at: [57.25, 43.5], note: "Evaporation needs no fixed temperature.", tone: "green" }], CYCLE_FOCUS) },
          { label: "Boiling", correct: false, say: "Boiling only happens once the liquid reaches its boiling point (100°C for water).", frame: frame([{ label: "Boiling & Evaporation (Liquid to Gas)", at: [57.25, 43.5], note: "Boiling needs 100°C.", tone: "red" }], CYCLE_FOCUS) },
        ],
      },
      {
        title: "Q5 · Condensation direction",
        prompt: "Condensation changes matter from which state to which state?",
        conceptId: "5.6",
        options: [
          { label: "Gas to liquid", correct: true, say: "Correct.", frame: frame([{ label: "Condensation (Gas to Liquid)", at: [73.5, 24.6], note: "Gas to liquid.", tone: "green" }], CYCLE_FOCUS) },
          { label: "Liquid to gas", correct: false, say: "Liquid to gas is evaporation or boiling - condensation goes the other way, gas to liquid.", frame: frame([{ label: "Boiling & Evaporation (Liquid to Gas)", at: [57.25, 43.5], note: "This is the opposite direction.", tone: "red" }], CYCLE_FOCUS) },
        ],
      },
      {
        title: "Q6 · Separating mixtures",
        prompt: "Why can't filtration separate sugar from a sugar-water solution?",
        conceptId: "5.8",
        options: [
          { label: "The dissolved sugar particles are small enough to pass through the filter paper", correct: true, say: "Correct.", frame: { text: { columns: [{ label: "Solutions pass through filters", items: ["Sugar-water"], tone: "green" }] } } },
          { label: "Sugar is insoluble", correct: false, say: "Sugar is soluble (it dissolves) - that's exactly why filtration can't catch it.", frame: { text: { columns: [{ label: "Sugar IS soluble", items: ["That's the point"], tone: "red" }] } } },
        ],
      },
    ],
  },

  readymade: [
    { q: "What are the three states of matter?", a: "Solid, liquid and gas." },
    { q: "What happens when water freezes?", a: "It changes from a liquid to a solid (ice), and unlike most liquids, it expands rather than contracts." },
    { q: "What is the boiling point of water?", a: "100°C (212°F)." },
    { q: "What is the difference between evaporation and condensation?", a: "Evaporation is a liquid becoming a gas. Condensation is the opposite - a gas becoming a liquid." },
    { q: "What is a solution?", a: "A clear mixture formed when a soluble solid dissolves completely in a liquid (the solvent)." },
    { q: "How do you separate a dissolved solid from a solution?", a: "By evaporation - heating the solution so the water evaporates, leaving the solid behind. Filtration does not work on a true solution." },
  ],

  chatAnswers: [
    { question: "What are solids, liquids and gases?", answer: "The three states of matter. A solid keeps its shape and volume. A liquid keeps its volume but takes the shape of its container. A gas has no fixed shape or volume and spreads to fill its container.", keywords: ["solid", "liquid", "gas", "states of matter"], conceptId: "5.1" },
    { question: "What is special about water freezing?", answer: "Unlike most liquids, which contract (get smaller) when they freeze, water expands (gets bigger) - a special property of water.", keywords: ["water", "freezing", "expand", "special"], conceptId: "5.3" },
    { question: "What is the boiling point of water?", answer: "100°C (212°F). At this temperature, water turns into a gas called water vapour, all the way through the liquid.", keywords: ["boiling point", "water", "100"], conceptId: "5.4" },
    { question: "What is evaporation?", answer: "Evaporation is when the most energetic particles at a liquid's surface escape as an invisible gas called water vapour. It can happen at any temperature, not just at boiling point.", keywords: ["evaporation", "water vapour", "surface"], conceptId: "5.5" },
    { question: "What is condensation?", answer: "Condensation is the opposite of evaporation - it happens when a gas cools down and changes back into a liquid, like water vapour turning into droplets on a cold mirror.", keywords: ["condensation", "gas", "liquid", "cools"], conceptId: "5.6" },
    { question: "What is a solution, solute and solvent?", answer: "A solution forms when a soluble solid (the solute, e.g. salt) dissolves completely in a liquid (the solvent, e.g. water), making a clear mixture.", keywords: ["solution", "solute", "solvent", "dissolve"], conceptId: "5.7" },
    { question: "How do you separate a solution?", answer: "Filtration cannot separate a true solution, because the dissolved particles pass through the filter paper with the liquid. Instead, evaporation is used - heating the solution so the liquid evaporates and the dissolved solid is left behind.", keywords: ["separate", "solution", "filtration", "evaporation"], conceptId: "5.8" },
  ],
};
