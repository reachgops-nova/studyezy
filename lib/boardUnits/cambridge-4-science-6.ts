import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 6 - Forces.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Physics strand, pages 76-89. Diagram art is real, NotebookLM-generated
 * illustration (Infographic studio, from the unit's own page-cited text as
 * the source) with hotspots laid over it - same method as Units 1-5.
 *
 * Every definition below is pulled from the textbook's own text (applied
 * force, normal force, weight/reaction force pairs, friction, gravity, air
 * resistance, upthrust, water resistance and streamlining) rather than
 * invented, so the board and the real book teach the same words in the
 * same order.
 */

const FORCES_IMG = "/board-art/cambridge-4-science-unit6-forces.png";
const FORCES_ALT = "Six panels of forces: applied/normal force, force diagrams (weight/reaction), friction, gravity/air resistance, upthrust, water resistance and streamlining.";

const FULL_FOCUS = { x: 0, y: 0, w: 100, h: 100 };
const APPLIED_NORMAL_FOCUS = { x: 0, y: 13, w: 33, h: 44 };
const WEIGHT_REACTION_FOCUS = { x: 33, y: 13, w: 34, h: 44 };
const FRICTION_FOCUS = { x: 67, y: 13, w: 33, h: 44 };
const GRAVITY_AIR_FOCUS = { x: 0, y: 55, w: 33, h: 45 };
const UPTHRUST_FOCUS = { x: 33, y: 55, w: 34, h: 45 };
const WATER_RESIST_FOCUS = { x: 67, y: 55, w: 33, h: 45 };

function frame(hotspots: NonNullable<ImageFrame["hotspots"]>, focus: ImageFrame["focus"] = FULL_FOCUS): { image: ImageFrame } {
  return {
    image: {
      src: FORCES_IMG,
      alt: FORCES_ALT,
      title: "Forces",
      hotspots,
      focus,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_6: BoardUnit = {
  unitKey: "cambridge-4-science-6",
  title: "Forces",
  badge: "Grade 4 · Physics · Unit 6",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "Applied forces (pushes and pulls) and normal forces",
      "Force diagrams: weight and reaction force",
      "Friction, and how it affects motion",
      "Gravity and air resistance",
      "Upthrust",
      "Water resistance and streamlining",
    ],
    outcomes: [
      "Explain what an applied force and a normal force are, with an example of each",
      "Draw a force diagram showing weight and reaction force acting on a resting object",
      "Explain what friction is, and give a useful and a not-useful example",
      "Explain gravity and air resistance, and why a bigger surface area means more air resistance",
      "Explain upthrust and why objects weigh less in water",
      "Explain water resistance and what it means for a shape to be streamlined",
    ],
  },

  concepts: [
    {
      conceptId: "6.1",
      title: "Applied forces and normal forces",
      icon: "👐",
      summary:
        "Pushes and pulls are forces called applied forces. A normal force only happens when objects are touching - like a wall pushing back when you lean on it.",
      keyPoints: [
        "Applied force - a push or pull applied to an object by a person or another object.",
        "Example: pushing a chair under a desk applies a force to the chair; pulling it out also applies a force to it.",
        "Normal force - only happens when objects are touching (e.g. a wall pushing back on you when you lean against it, or a chair pushing back when you sit on it).",
        "Even a still object, like you sitting on a chair, has forces acting on it.",
      ],
      pages: [76, 77],
      storyReference: "Learning about applied forces / normal forces, pages 76-77",
      examples: [
        { question: "What is an applied force?", answer: "A push or a pull applied to an object by a person or another object. (p.76)" },
        { question: "When does a normal force happen?", answer: "Only when objects are touching. (p.77)" },
        { question: "If you lean against a wall, what force is the wall applying back on you?", answer: "A normal force. (p.77)" },
      ],
      quickCheck: [
        {
          title: "Quick check · applied or normal",
          prompt: "Pushing a box across the floor is an example of which force?",
          conceptId: "6.1",
          options: [
            { label: "An applied force", correct: true, say: "Yes - a push you apply to an object is an applied force.", frame: frame([{ label: "Applied Force", at: [15, 20], note: "A push or pull on an object.", tone: "gold" }], APPLIED_NORMAL_FOCUS) },
            { label: "A normal force", correct: false, say: "A normal force is the pushing-back force from a touching surface, not the push you apply.", frame: frame([{ label: "Normal Force", at: [26, 27], note: "The pushing-back force, not the push itself.", tone: "red" }], APPLIED_NORMAL_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "6.2",
      title: "Force diagrams: weight and reaction force",
      icon: "📐",
      summary:
        "Force diagrams use arrows to show forces: direction shows which way the force acts, and length shows strength. Weight (from gravity) and reaction force are a commonly used pair, acting in opposite directions.",
      keyPoints: [
        "Force diagram arrows: direction = direction of the force; longer arrow = stronger force.",
        "Forces act in pairs, in opposite directions.",
        "Weight - the downward force acting on all objects that are not falling, caused by gravity, measured in newtons (N).",
        "Reaction force - an upward force that acts against a weight.",
        "Example: a mug on a table isn't moving, but its weight pulls down while the table's reaction force pushes up.",
      ],
      pages: [78],
      storyReference: "Force diagrams (1), page 78",
      examples: [
        { question: "What does a longer force arrow mean in a force diagram?", answer: "A stronger force. (p.78)" },
        { question: "What is weight, and what unit is it measured in?", answer: "The downward force on an object, caused by gravity, measured in newtons (N). (p.78)" },
        { question: "A book rests on a table. What two forces act on it?", answer: "Its weight (down) and a reaction force from the table (up). (p.78)" },
      ],
      quickCheck: [
        {
          title: "Quick check · reaction force",
          prompt: "What is the reaction force in the mug-on-table example?",
          conceptId: "6.2",
          options: [
            { label: "The upward force from the table", correct: true, say: "Correct - the table pushes up against the mug's weight.", frame: frame([{ label: "Reaction Force", at: [55, 20], note: "Pushes up against weight.", tone: "gold" }], WEIGHT_REACTION_FOCUS) },
            { label: "The downward pull of gravity", correct: false, say: "That's the weight, not the reaction force - the reaction force pushes the opposite way, upward.", frame: frame([{ label: "Weight", at: [51, 39], note: "This is weight, not reaction force.", tone: "red" }], WEIGHT_REACTION_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "6.3",
      title: "Friction",
      icon: "🧱",
      summary:
        "Friction is a force that acts in the opposite direction to an applied force, created by contact between an object and a surface. Friction slows moving objects down, and can be useful or not useful.",
      keyPoints: [
        "Friction acts opposite to the applied force's direction.",
        "Friction is created by contact between an object and a surface.",
        "Different surfaces create different amounts of friction.",
        "Friction can be useful (e.g. gripping, striking a match) or not useful (e.g. making heavy furniture harder to push).",
        "Friction can be measured in newtons (N) with a force meter.",
      ],
      pages: [79, 80, 81, 82],
      storyReference: "Force diagrams (2) / How friction affects motion / Investigating friction, pages 79-82",
      examples: [
        { question: "Which direction does friction act, compared to the applied force?", answer: "The opposite direction. (p.79)" },
        { question: "What creates friction?", answer: "Contact between an object and a surface. (p.79)" },
        { question: "Give one example each of friction being useful and not useful.", answer: "Useful: e.g. striking a match, gripping an object. Not useful: e.g. making it harder to push heavy furniture. (p.80)" },
      ],
      quickCheck: [
        {
          title: "Quick check · direction of friction",
          prompt: "A box is pushed to the right. Which direction does friction act?",
          conceptId: "6.3",
          options: [
            { label: "To the left", correct: true, say: "Correct - friction always opposes the direction of the applied force.", frame: frame([{ label: "Friction", at: [82.5, 41], note: "Opposes the applied force.", tone: "gold" }], FRICTION_FOCUS) },
            { label: "To the right, same as the push", correct: false, say: "Friction acts opposite to the applied force, not the same way.", frame: frame([{ label: "Applied Force", at: [91, 30], note: "This is the push - friction opposes it.", tone: "red" }], FRICTION_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "6.4",
      title: "Gravity and air resistance",
      icon: "🪂",
      summary:
        "Gravity pulls objects towards huge objects like the Earth. As an object falls, air resistance (a type of friction with the air) pushes back - a bigger surface area means more air resistance and a slower fall.",
      keyPoints: [
        "Gravity - the force with which the Sun, Earth, Moon and other huge objects pull objects towards themselves.",
        "Gravity makes dropped objects fall, and keeps objects on the ground.",
        "Air resistance - the force of air pushing up on a falling/moving object; a type of friction, caused by contact with the surrounding air.",
        "Bigger surface area = more air resistance = falls more slowly (a flat sheet of paper falls slower than the same paper scrunched up).",
        "A parachute uses a large canopy to increase air resistance and slow a fall - a bigger parachute takes longer to fall than a smaller one.",
      ],
      pages: [83, 84, 85],
      storyReference: "Air resistance / Parachutes / Using data, pages 83-85",
      examples: [
        { question: "Why does a scrunched-up ball of paper fall faster than a flat sheet of the same paper?", answer: "The flat sheet has a bigger surface area, so it experiences more air resistance and falls more slowly. (p.83)" },
        { question: "How does a parachute slow a fall?", answer: "Its large canopy increases air resistance. (p.84)" },
        { question: "Would a bigger or smaller parachute take longer to land?", answer: "A bigger parachute - more area means more air resistance. (p.85)" },
      ],
      quickCheck: [
        {
          title: "Quick check · air resistance and surface area",
          prompt: "Which falls more slowly: a flat sheet of paper or the same paper scrunched into a ball?",
          conceptId: "6.4",
          options: [
            { label: "The flat sheet", correct: true, say: "Correct - its bigger surface area means more air resistance, so it falls more slowly.", frame: frame([{ label: "Air Resistance", at: [24, 64], note: "More air resistance on the flat sheet.", tone: "gold" }], GRAVITY_AIR_FOCUS) },
            { label: "The scrunched-up ball", correct: false, say: "The scrunched ball has less surface area, so less air resistance - it falls faster, not slower.", frame: frame([{ label: "Air Resistance", at: [9.5, 65], note: "Less air resistance on the ball.", tone: "red" }], GRAVITY_AIR_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "6.5",
      title: "Upthrust",
      icon: "🛁",
      summary:
        "Upthrust is the force of water pushing up on an object placed in it. Two forces act on an object in water: weight pulling down, and upthrust pushing up - which is why objects weigh less in water than in air.",
      keyPoints: [
        "Upthrust = 'up' + 'thrust' (a push) = a push upward.",
        "An object in water has weight (down, from gravity) and upthrust (up, from the water) acting on it.",
        "A force meter shows a smaller reading for an object's weight in water than in air, because upthrust supports part of its weight.",
      ],
      pages: [86],
      storyReference: "Upthrust, page 86",
      examples: [
        { question: "What is upthrust?", answer: "The upward force of water pushing on an object placed in it. (p.86)" },
        { question: "Why does an object weigh less in water than in air?", answer: "Because upthrust from the water supports part of its weight. (p.86)" },
        { question: "What two forces act on an object under water?", answer: "Its weight (down) and upthrust (up). (p.86)" },
      ],
      quickCheck: [
        {
          title: "Quick check · why lighter in water",
          prompt: "Why does a force meter show a smaller reading when an object is lowered into water?",
          conceptId: "6.5",
          options: [
            { label: "Upthrust supports part of its weight", correct: true, say: "Correct - upthrust pushes up on the object, so the force meter reads a smaller weight.", frame: frame([{ label: "Upthrust", at: [48.5, 70], note: "Supports part of the weight.", tone: "gold" }], UPTHRUST_FOCUS) },
            { label: "The object actually becomes lighter", correct: false, say: "The object's real weight hasn't changed - upthrust from the water is just supporting part of it.", frame: frame([{ label: "Weight", at: [39.5, 83], note: "Weight itself is unchanged.", tone: "red" }], UPTHRUST_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "6.6",
      title: "Water resistance and streamlining",
      icon: "🐬",
      summary:
        "Friction happens in water too - it's called water resistance, caused by contact between a moving object and the water. Streamlined shapes let objects move through water more easily, with less resistance.",
      keyPoints: [
        "Water resistance - friction between a moving object and the surrounding water.",
        "Streamlined - a shape that allows an object to move through water (or air) more easily, with less resistance.",
        "Many animals (like sharks and turtles) have adapted a streamlined shape.",
        "Humans design streamlined objects too, like racing bikes, cars and boats, to reduce friction and move more easily.",
      ],
      pages: [87, 88],
      storyReference: "Water resistance / Uses of streamlining, pages 87-88",
      examples: [
        { question: "What is water resistance?", answer: "Friction between a moving object and the surrounding water. (p.87)" },
        { question: "What does 'streamlined' mean?", answer: "A shape that lets an object move through water or air more easily, with less resistance. (p.87)" },
        { question: "Name an animal and a human-made object that are both streamlined.", answer: "Any real example, e.g. a shark or turtle (animal) and a racing bike, car, or boat (human-made). (p.88)" },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. Applied and normal forces",
      conceptId: "6.1",
      say: "Pushing an object applies a force to it - an applied force. When you lean against a wall, the wall pushes back - that's a normal force, which only happens when objects are touching.",
      frame: frame(
        [
          { label: "Applied Force", at: [15, 20], note: "A push or pull on an object.", tone: "gold" },
          { label: "Normal Force", at: [26, 27], note: "The wall pushing back - only when touching.", tone: "green" },
        ],
        APPLIED_NORMAL_FOCUS,
      ),
    },
    {
      label: "2. Weight and reaction force",
      conceptId: "6.2",
      say: "A resting mug isn't moving, but two forces still act on it: its weight pulling down, and a reaction force from the table pushing up, exactly balancing it.",
      frame: frame(
        [
          { label: "Reaction Force", at: [55, 20], note: "Pushes up, from the table.", tone: "gold" },
          { label: "Weight", at: [51, 39], note: "Pulls down, from gravity.", tone: "green" },
        ],
        WEIGHT_REACTION_FOCUS,
      ),
    },
    {
      label: "3. Friction opposes the push",
      conceptId: "6.3",
      say: "Friction acts in the opposite direction to the applied force, slowing the box down as it's pushed along the ground.",
      frame: frame(
        [
          { label: "Applied Force", at: [91, 30], note: "The push, moving the box right.", tone: "gold" },
          { label: "Friction", at: [82.5, 41], note: "Opposes the push.", tone: "green" },
        ],
        FRICTION_FOCUS,
      ),
    },
    {
      label: "4. Air resistance and surface area",
      conceptId: "6.4",
      say: "Both the ball and the flat sheet are pulled down by gravity, but the flat sheet's bigger surface area means more air resistance, so it falls more slowly.",
      frame: frame(
        [
          { label: "Air Resistance", at: [9.5, 65], note: "Less on the small ball.", tone: "gold" },
          { label: "Gravity", at: [11.5, 83], note: "Pulls both down equally.", tone: "blue" },
          { label: "Air Resistance", at: [24, 64], note: "More on the flat sheet.", tone: "green" },
        ],
        GRAVITY_AIR_FOCUS,
      ),
    },
    {
      label: "5. Weighing less in water",
      conceptId: "6.5",
      say: "In air, the force meter reads the object's full weight. Lowered into water, upthrust pushes up on the object, so the force meter reads a smaller weight.",
      frame: frame(
        [
          { label: "Weight", at: [39.5, 83], note: "Full weight, measured in air.", tone: "gold" },
          { label: "Upthrust", at: [48.5, 70], note: "Pushes up in water.", tone: "green" },
        ],
        UPTHRUST_FOCUS,
      ),
    },
    {
      label: "6. Streamlined for less resistance",
      conceptId: "6.6",
      say: "A streamlined shape, like this dolphin, lets water flow smoothly around it - reducing water resistance so it can move faster and more easily.",
      frame: frame(
        [
          { label: "Streamlined shape", at: [88.5, 72], note: "Water flows smoothly around it - less resistance.", tone: "gold" },
        ],
        WATER_RESIST_FOCUS,
      ),
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Applied or normal force",
      prompt: "Sitting still on a chair, which force does the chair apply to you?",
      conceptId: "6.1",
      setup: frame([], APPLIED_NORMAL_FOCUS),
      options: [
        { label: "A normal force", correct: true, say: "Correct - the chair pushes back because you are touching it, even though nothing is moving.", frame: frame([{ label: "Normal Force", at: [26, 27], note: "Pushes back when touching.", tone: "green" }], APPLIED_NORMAL_FOCUS) },
        { label: "An applied force", correct: false, say: "An applied force is a push or pull you make on something - sitting still, you are not pushing or pulling the chair.", frame: frame([{ label: "Applied Force", at: [15, 20], note: "A push or pull, not just resting.", tone: "red" }], APPLIED_NORMAL_FOCUS) },
      ],
    },
    {
      title: "Task 2 · Balanced forces",
      prompt: "A book rests still on a table. What must be true of its weight and reaction force?",
      conceptId: "6.2",
      setup: frame([], WEIGHT_REACTION_FOCUS),
      options: [
        { label: "They are equal, balancing each other out", correct: true, say: "Correct - for a resting object, weight and reaction force are equal and opposite.", frame: frame([{ label: "Reaction Force", at: [55, 20], note: "Equal to the weight.", tone: "green" }], WEIGHT_REACTION_FOCUS) },
        { label: "The reaction force must be bigger", correct: false, say: "If the reaction force were bigger, the book would fly upward - they must be equal for it to stay still.", frame: frame([{ label: "Weight", at: [51, 39], note: "Equal to the reaction force.", tone: "red" }], WEIGHT_REACTION_FOCUS) },
      ],
    },
    {
      title: "Task 3 · Useful or not useful friction",
      prompt: "Which is an example of friction being useful?",
      conceptId: "6.3",
      setup: frame([], FRICTION_FOCUS),
      options: [
        { label: "Gripping a jar lid to open it", correct: true, say: "Correct - friction between your hand and the lid helps you grip and turn it.", frame: frame([{ label: "Friction", at: [82.5, 41], note: "Useful here for gripping.", tone: "green" }], FRICTION_FOCUS) },
        { label: "Struggling to push heavy furniture across the floor", correct: false, say: "That is friction being unhelpful, making the push harder - not a useful example.", frame: frame([{ label: "Friction", at: [82.5, 41], note: "Not useful in this case.", tone: "red" }], FRICTION_FOCUS) },
      ],
    },
    {
      title: "Task 4 · Parachute size",
      prompt: "Which parachute takes longer to reach the ground: a large one or a small one?",
      conceptId: "6.4",
      setup: frame([], GRAVITY_AIR_FOCUS),
      options: [
        { label: "The large parachute", correct: true, say: "Correct - more area means more air resistance, so it falls more slowly.", frame: frame([{ label: "Air Resistance", at: [24, 64], note: "More area, more air resistance.", tone: "green" }], GRAVITY_AIR_FOCUS) },
        { label: "The small parachute", correct: false, say: "A smaller parachute has less air resistance, so it falls faster, not slower.", frame: frame([{ label: "Air Resistance", at: [9.5, 65], note: "Less area, less air resistance.", tone: "red" }], GRAVITY_AIR_FOCUS) },
      ],
    },
    {
      title: "Task 5 · Upthrust",
      prompt: "An object weighs 10N in air. In water, would you expect the force meter to read more or less than 10N?",
      conceptId: "6.5",
      setup: frame([], UPTHRUST_FOCUS),
      options: [
        { label: "Less than 10N", correct: true, say: "Correct - upthrust from the water supports part of the object's weight.", frame: frame([{ label: "Upthrust", at: [48.5, 70], note: "Reduces the reading in water.", tone: "green" }], UPTHRUST_FOCUS) },
        { label: "More than 10N", correct: false, say: "Upthrust pushes up, reducing the reading - it never increases it.", frame: frame([{ label: "Weight", at: [39.5, 83], note: "The reading gets smaller, not bigger.", tone: "red" }], UPTHRUST_FOCUS) },
      ],
    },
    {
      title: "Task 6 · Streamlining",
      prompt: "Why are boat hulls often shaped to be streamlined?",
      conceptId: "6.6",
      setup: frame([], WATER_RESIST_FOCUS),
      options: [
        { label: "To reduce water resistance and move more easily", correct: true, say: "Correct - a streamlined hull lets water flow around it smoothly, reducing friction.", frame: frame([{ label: "Streamlined shape", at: [88.5, 72], note: "Reduces water resistance.", tone: "green" }], WATER_RESIST_FOCUS) },
        { label: "To increase water resistance for extra grip", correct: false, say: "The whole point of streamlining is to reduce resistance, not increase it.", frame: frame([{ label: "Streamlined shape", at: [88.5, 72], note: "Reduces, doesn't increase, resistance.", tone: "red" }], WATER_RESIST_FOCUS) },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each panel of the forces poster and explain which forces are acting and in which direction.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "What is an applied force, and what is a normal force?", answer: "An applied force is a push or pull on an object. A normal force only happens when objects are touching, like a wall pushing back when you lean on it.", conceptId: "6.1" },
    { ask: "What are weight and reaction force, and how do they relate for a resting object?", answer: "Weight is the downward force from gravity; reaction force is the upward force against it. For a resting object, they are equal and opposite.", conceptId: "6.2" },
    { ask: "What is friction, and which direction does it act?", answer: "Friction is a force created by contact between an object and a surface, acting in the opposite direction to the applied force.", conceptId: "6.3" },
    { ask: "What are gravity and air resistance?", answer: "Gravity pulls objects towards the Earth (or other huge objects). Air resistance is a type of friction from the air pushing up on a falling object - more surface area means more air resistance.", conceptId: "6.4" },
    { ask: "What is upthrust, and why do objects weigh less in water?", answer: "Upthrust is the upward force of water pushing on an object. Objects weigh less in water because upthrust supports part of their weight.", conceptId: "6.5" },
    { ask: "What is water resistance, and what does streamlined mean?", answer: "Water resistance is friction between a moving object and water. A streamlined shape lets an object move through water (or air) more easily, with less resistance.", conceptId: "6.6" },
  ],

  writtenPractice: [
    { question: "Draw and label a simple force diagram for a mug resting on a table, showing weight and reaction force.", answer: "A downward arrow labelled weight, and an equal-length upward arrow labelled reaction force, both acting on the mug.", conceptId: "6.2" },
    { question: "Explain why a scrunched-up ball of paper falls faster than a flat sheet of the same paper.", answer: "The flat sheet has a bigger surface area, so it experiences more air resistance, which slows its fall more than the smaller-area, scrunched-up ball.", conceptId: "6.4" },
    { question: "Explain, using the word upthrust, why a force meter shows a smaller reading for an object in water than in air.", answer: "In water, upthrust (the upward push of the water) acts on the object alongside its weight, supporting part of it - so the force meter reads a smaller overall weight.", conceptId: "6.5" },
    { question: "Explain why sharks and racing bikes are both shaped to be streamlined.", answer: "A streamlined shape reduces water resistance (for the shark) or air resistance (for the bike) - both are types of friction - letting them move through water or air more easily and quickly.", conceptId: "6.6" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Normal force",
        prompt: "A normal force only happens when objects are...",
        conceptId: "6.1",
        options: [
          { label: "Touching", correct: true, say: "Correct.", frame: frame([{ label: "Normal Force", at: [26, 27], note: "Only when touching.", tone: "green" }], APPLIED_NORMAL_FOCUS) },
          { label: "Far apart", correct: false, say: "A normal force needs contact - objects far apart cannot exert a normal force on each other.", frame: frame([{ label: "Normal Force", at: [26, 27], note: "Requires contact.", tone: "red" }], APPLIED_NORMAL_FOCUS) },
        ],
      },
      {
        title: "Q2 · Weight unit",
        prompt: "Weight is measured in which unit?",
        conceptId: "6.2",
        options: [
          { label: "Newtons (N)", correct: true, say: "Correct.", frame: frame([{ label: "Weight", at: [51, 39], note: "Measured in newtons.", tone: "green" }], WEIGHT_REACTION_FOCUS) },
          { label: "Metres (m)", correct: false, say: "Metres measure length or distance, not force - weight is measured in newtons.", frame: frame([{ label: "Weight", at: [51, 39], note: "Not a length.", tone: "red" }], WEIGHT_REACTION_FOCUS) },
        ],
      },
      {
        title: "Q3 · Friction direction",
        prompt: "Friction acts in which direction, relative to the applied force?",
        conceptId: "6.3",
        options: [
          { label: "The opposite direction", correct: true, say: "Correct.", frame: frame([{ label: "Friction", at: [82.5, 41], note: "Opposes the applied force.", tone: "green" }], FRICTION_FOCUS) },
          { label: "The same direction", correct: false, say: "Friction opposes motion - it acts opposite to the applied force, not the same way.", frame: frame([{ label: "Applied Force", at: [91, 30], note: "Friction is the opposite of this.", tone: "red" }], FRICTION_FOCUS) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Air resistance",
        prompt: "Which object experiences more air resistance: one with a bigger surface area, or a smaller one?",
        conceptId: "6.4",
        options: [
          { label: "The one with a bigger surface area", correct: true, say: "Correct - bigger surface area means more air resistance.", frame: frame([{ label: "Air Resistance", at: [24, 64], note: "More on bigger surface area.", tone: "green" }], GRAVITY_AIR_FOCUS) },
          { label: "The smaller one", correct: false, say: "A smaller surface area means less air resistance, not more.", frame: frame([{ label: "Air Resistance", at: [9.5, 65], note: "Less on smaller surface area.", tone: "red" }], GRAVITY_AIR_FOCUS) },
        ],
      },
      {
        title: "Q5 · Upthrust and streamlining",
        prompt: "What force pushes up on an object placed in water?",
        conceptId: "6.5",
        options: [
          { label: "Upthrust", correct: true, say: "Correct.", frame: frame([{ label: "Upthrust", at: [48.5, 70], note: "The upward push from water.", tone: "green" }], UPTHRUST_FOCUS) },
          { label: "Water resistance", correct: false, say: "Water resistance is friction that opposes a moving object's motion through water - upthrust is the specific upward push supporting its weight.", frame: frame([{ label: "Streamlined shape", at: [88.5, 72], note: "Water resistance is a different force.", tone: "red" }], WATER_RESIST_FOCUS) },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is an applied force?", a: "A push or pull applied to an object by a person or another object." },
    { q: "What is friction?", a: "A force created by contact between an object and a surface, acting opposite to the applied force." },
    { q: "What is upthrust?", a: "The upward force of water pushing on an object placed in it." },
    { q: "What does streamlined mean?", a: "A shape that lets an object move through water or air more easily, with less resistance." },
  ],

  chatAnswers: [
    { question: "What is an applied force?", answer: "An applied force is a push or pull applied to an object by a person or another object.", keywords: ["applied force", "push", "pull"], conceptId: "6.1" },
    { question: "What is a normal force?", answer: "A normal force only happens when objects are touching - like a wall pushing back when you lean against it, or a chair pushing back when you sit on it.", keywords: ["normal force", "touching", "wall"], conceptId: "6.1" },
    { question: "What are weight and reaction force?", answer: "Weight is the downward force on an object caused by gravity, measured in newtons. Reaction force is an equal upward force acting against it, for an object resting on a surface.", keywords: ["weight", "reaction force", "gravity", "newtons"], conceptId: "6.2" },
    { question: "What is friction?", answer: "Friction is a force created by contact between an object and a surface. It acts in the opposite direction to the applied force, slowing moving objects down.", keywords: ["friction", "surface", "slows"], conceptId: "6.3" },
    { question: "What is air resistance?", answer: "Air resistance is the force of air pushing up on a falling or moving object - a type of friction. A bigger surface area means more air resistance and a slower fall.", keywords: ["air resistance", "gravity", "surface area"], conceptId: "6.4" },
    { question: "What is upthrust?", answer: "Upthrust is the upward force of water pushing on an object placed in it - it's why objects weigh less in water than in air.", keywords: ["upthrust", "water", "weigh less"], conceptId: "6.5" },
    { question: "What is water resistance and streamlining?", answer: "Water resistance is friction between a moving object and water. A streamlined shape reduces that resistance, letting the object move through water more easily.", keywords: ["water resistance", "streamlined", "friction"], conceptId: "6.6" },
  ],
};
