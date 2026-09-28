import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 10 - The Earth in space.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Earth and Space strand, pages 129-140 - the final unit of the book.
 * Diagram art is real, NotebookLM-generated illustration (Infographic
 * studio, from the unit's own page-cited text as the source) with hotspots
 * laid over it - same method as Units 1-9. The orbit's elliptical shape did
 * not render as its own panel in this poster, so that one concept uses text
 * cards instead, matching the pattern already used in Unit 5 for content the
 * poster doesn't depict.
 *
 * Every definition below is pulled from the textbook's own text (Earth's
 * rotation and axis, its elliptical orbit, the real cause of seasons,
 * seasons around the world, natural vs artificial satellites, and space
 * junk) rather than invented, so the board and the real book teach the same
 * words in the same order.
 */

const SPACE_IMG = "/board-art/cambridge-4-science-unit10-earth-in-space.png";
const SPACE_ALT = "Five panels on the Earth in space: rotation and axis, why seasons happen, seasons around the world, satellites, and space junk.";

const FULL_FOCUS = { x: 0, y: 0, w: 100, h: 100 };
const ROTATION_FOCUS = { x: 0, y: 0, w: 41, h: 100 };
const SEASONS_WHY_FOCUS = { x: 41, y: 0, w: 32, h: 52 };
const SEASONS_WORLD_FOCUS = { x: 73, y: 0, w: 27, h: 52 };
const SATELLITES_FOCUS = { x: 41, y: 52, w: 32, h: 48 };
const SPACEJUNK_FOCUS = { x: 73, y: 52, w: 27, h: 48 };

function frame(hotspots: NonNullable<ImageFrame["hotspots"]>, focus: ImageFrame["focus"] = FULL_FOCUS, motionPath?: ImageFrame["motionPath"]): { image: ImageFrame } {
  return {
    image: {
      src: SPACE_IMG,
      alt: SPACE_ALT,
      title: "The Earth in space",
      hotspots,
      focus,
      motionPath,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_10: BoardUnit = {
  unitKey: "cambridge-4-science-10",
  title: "The Earth in space",
  badge: "Grade 4 · Earth & Space · Unit 10",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "Earth's rotation and its tilted axis",
      "Earth's elliptical orbit around the Sun",
      "What really causes the seasons (and the misconception it isn't)",
      "Seasons around the world, including at the equator",
      "Natural and artificial satellites",
      "Space junk",
    ],
    outcomes: [
      "Explain that the Earth's rotation on its axis causes day and night, and takes 24 hours",
      "Describe the shape of Earth's orbit and how long it takes",
      "Explain the real cause of the seasons, and correct the 'closer to the Sun' misconception",
      "Explain why the northern and southern hemispheres have opposite seasons, and why the equator has none",
      "Explain the difference between a natural and an artificial satellite",
      "Explain what space junk is and why it is dangerous",
    ],
  },

  concepts: [
    {
      conceptId: "10.1",
      title: "Earth's rotation and axis",
      icon: "🌐",
      summary:
        "The Earth spins on an imaginary line called its axis. One full rotation takes 24 hours (one day), and this rotation causes day and night. The axis is always tilted at 23.5 degrees.",
      keyPoints: [
        "Axis - the imaginary line the Earth spins (rotates) around, running between the North Pole and South Pole.",
        "One complete rotation = one day (24 hours).",
        "The Earth's rotation causes day and night.",
        "The axis is always tilted at 23.5 degrees, and always points in the same direction.",
        "The equator is an imaginary line around the middle, dividing the Earth into the northern and southern hemispheres.",
      ],
      pages: [133, 134],
      storyReference: "Elliptical path of the Earth around the Sun / Understanding the seasons, pages 133-134",
      examples: [
        { question: "How long does it take the Earth to make one complete rotation?", answer: "One day - 24 hours. (p.133)" },
        { question: "What does the Earth's rotation cause?", answer: "Day and night. (p.133)" },
        { question: "At what angle is the Earth's axis tilted?", answer: "23.5 degrees. (p.134)" },
      ],
      quickCheck: [
        {
          title: "Quick check · rotation time",
          prompt: "How long does one full rotation of the Earth take?",
          conceptId: "10.1",
          options: [
            { label: "24 hours (one day)", correct: true, say: "Correct - one rotation is one day.", frame: frame([{ label: "1 rotation = 1 day (24 hours)", at: [17.5, 90], note: "One full spin on its axis.", tone: "gold" }], ROTATION_FOCUS) },
            { label: "365 days (one year)", correct: false, say: "365 days is how long the Earth takes to orbit the Sun, not to rotate once on its axis.", frame: frame([{ label: "1 rotation = 1 day (24 hours)", at: [17.5, 90], note: "Rotation is much faster than a full orbit.", tone: "red" }], ROTATION_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "10.2",
      title: "Earth's elliptical orbit",
      icon: "🛰️",
      summary:
        "The Earth's path around the Sun is not a perfect circle - it is an ellipse, so we say the Earth takes an elliptical orbit. It travels anticlockwise, taking 365 days (about a year) to go all the way around.",
      keyPoints: [
        "The Earth's orbit is shaped like an ellipse, not a circle.",
        "The Earth travels anticlockwise around the Sun.",
        "It takes 365 days (approximately one year) to complete one orbit.",
        "The Earth orbits the Sun at around 107,807 kilometres per hour.",
      ],
      pages: [132, 133],
      storyReference: "Shape of the Earth's orbit around the Sun / Elliptical path, pages 132-133",
      examples: [
        { question: "What shape is the Earth's orbit around the Sun?", answer: "An ellipse - not a perfect circle. (p.133)" },
        { question: "How long does it take the Earth to orbit the Sun once?", answer: "365 days - about one year. (p.133)" },
        { question: "Which direction does the Earth travel around the Sun?", answer: "Anticlockwise. (p.133)" },
      ],
      quickCheck: [
        {
          title: "Quick check · shape of the orbit",
          prompt: "What shape best describes the Earth's orbit around the Sun?",
          conceptId: "10.2",
          options: [
            { label: "An ellipse (oval)", correct: true, say: "Correct - the Earth's orbit is elliptical, not a perfect circle.", frame: { text: { cards: [{ tag: "Ellipse ✓", title: "Earth's orbit", desc: "Not a perfect circle - an ellipse." }] } } },
            { label: "A perfect circle", correct: false, say: "The book is explicit: the Earth's orbit is NOT a perfect circle - it's an ellipse.", frame: { text: { cards: [{ tag: "✗", title: "Not a perfect circle", desc: "The real shape is an ellipse." }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "10.3",
      title: "Understanding the seasons: the real cause",
      icon: "☀️",
      summary:
        "It is a misconception that summer happens because Earth is closer to the Sun. The real cause is Earth's tilt: when a place is tilted towards the Sun, sunlight is more direct and concentrated (hotter); tilted away, sunlight is angled and spread out (colder).",
      keyPoints: [
        "Misconception: summer is NOT caused by the Earth being closer to the Sun, nor winter by being farther away.",
        "Real cause: as Earth orbits, different parts tilt towards or away from the Sun, because the axis always points the same way.",
        "Tilted towards the Sun: direct/overhead rays = concentrated energy = hotter, with longer daylight hours.",
        "Tilted away from the Sun: angled rays = spread-out energy = colder, with shorter daylight hours.",
      ],
      pages: [134, 135],
      storyReference: "Understanding the seasons (1) and (2), pages 134-135",
      examples: [
        { question: "Is it true that summer happens because the Earth is closer to the Sun?", answer: "No - that is a misconception. The real cause is the Earth's tilt. (p.134)" },
        { question: "Why is it hotter when a place is tilted towards the Sun?", answer: "The Sun's rays hit more directly, concentrating the energy (light and heat). (p.134)" },
        { question: "Why is it colder when a place is tilted away from the Sun?", answer: "The Sun's rays hit at an angle and are spread out over a larger area, so the energy is less concentrated. (p.135)" },
      ],
      quickCheck: [
        {
          title: "Quick check · true cause of seasons",
          prompt: "What actually causes the seasons?",
          conceptId: "10.3",
          options: [
            { label: "The Earth's tilt, which changes which parts face the Sun directly", correct: true, say: "Correct - the tilt causes different amounts of direct sunlight throughout the year.", frame: frame([{ label: "Concentrated Light = Hotter", at: [49.5, 46], note: "Direct sunlight, from being tilted towards the Sun.", tone: "gold" }], SEASONS_WHY_FOCUS) },
            { label: "The changing distance between the Earth and the Sun", correct: false, say: "That's the misconception the book specifically corrects - distance isn't the real cause.", frame: frame([{ label: "Angled Light = Colder", at: [65.25, 46], note: "Caused by tilt, not distance.", tone: "red" }], SEASONS_WHY_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "10.4",
      title: "Seasons around the world",
      icon: "🌍",
      summary:
        "The northern and southern hemispheres have opposite seasons at the same time. Some tropical places have just two seasons (rainy and dry) instead of four, and the equator has no seasons at all.",
      keyPoints: [
        "Northern and southern hemispheres have opposite seasons at the same time (summer in one = winter in the other).",
        "A year is 12 months, so each of the four seasons lasts about three months.",
        "Tropical/subtropical places may have just two seasons: rainy (wet/monsoon) and dry.",
        "No seasons at the equator - the Sun strikes at about the same angle every day, giving about 12 hours of sunlight daily, all year.",
      ],
      pages: [137],
      storyReference: "Seasons around the world, page 137",
      examples: [
        { question: "If it is summer in the northern hemisphere, what season is it in the southern hemisphere?", answer: "Winter - the hemispheres have opposite seasons at the same time. (p.137)" },
        { question: "What two seasons do some tropical and subtropical places have, instead of four?", answer: "A rainy (wet/monsoon) season and a dry season. (p.137)" },
        { question: "Why are there no seasons at the equator?", answer: "The Sun strikes the Earth at about the same angle every day of the year there, giving about 12 hours of sunlight daily with no temperature difference. (p.137)" },
      ],
      quickCheck: [
        {
          title: "Quick check · opposite hemispheres",
          prompt: "It is winter in the northern hemisphere. What season is it in the southern hemisphere?",
          conceptId: "10.4",
          options: [
            { label: "Summer", correct: true, say: "Correct - the hemispheres always have opposite seasons at the same time.", frame: frame([{ label: "Opposite seasons at the same time", at: [90, 46], note: "Winter in one = summer in the other.", tone: "gold" }], SEASONS_WORLD_FOCUS) },
            { label: "Winter, the same as the north", correct: false, say: "The hemispheres have opposite seasons, not matching ones.", frame: frame([{ label: "Opposite seasons at the same time", at: [90, 46], note: "Never the same season together.", tone: "red" }], SEASONS_WORLD_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "10.5",
      title: "Satellites",
      icon: "🛰️",
      summary:
        "A natural satellite orbits a planet naturally, like the Moon orbiting Earth. An artificial satellite is human-built and orbits Earth, like the International Space Station.",
      keyPoints: [
        "Natural satellite - an object that naturally orbits a planet, e.g. the Moon (Earth's natural satellite).",
        "There are hundreds of natural satellites (moons) in the Solar System - Saturn alone has 82.",
        "Artificial satellites - built by humans, orbiting Earth: communication satellites, weather satellites, the International Space Station.",
      ],
      pages: [138],
      storyReference: "Satellites, page 138",
      examples: [
        { question: "What is Earth's natural satellite called?", answer: "The Moon. (p.138)" },
        { question: "How many natural satellites (moons) does Saturn have?", answer: "82. (p.138)" },
        { question: "Name two kinds of artificial satellites.", answer: "Any two of: communication satellites, weather satellites, the International Space Station. (p.138)" },
      ],
      quickCheck: [
        {
          title: "Quick check · natural or artificial",
          prompt: "Which of these is a natural satellite?",
          conceptId: "10.5",
          options: [
            { label: "The Moon", correct: true, say: "Correct - the Moon is Earth's natural satellite.", frame: frame([{ label: "Natural satellite (e.g. the Moon)", at: [50.75, 64], note: "Orbits Earth naturally.", tone: "gold" }], SATELLITES_FOCUS) },
            { label: "The International Space Station", correct: false, say: "The ISS is an artificial satellite - built and launched by humans.", frame: frame([{ label: "Artificial satellite (e.g. the ISS)", at: [67.25, 64], note: "Human-built, not natural.", tone: "red" }], SATELLITES_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "10.6",
      title: "Space junk",
      icon: "🚀",
      summary:
        "Space junk is old spacecraft parts and dropped tools that orbit the Earth. Even tiny pieces are dangerous because they travel so fast, acting like bullets and threatening spacecraft and astronauts.",
      keyPoints: [
        "Trillions of pieces of space junk are currently orbiting Earth.",
        "Space junk includes old spacecraft and tools dropped during spacewalk repairs.",
        "Even very small pieces are hazardous because they travel so fast they act like bullets.",
        "Space agencies are trying to invent ways to collect space junk and clean up space.",
      ],
      pages: [139],
      storyReference: "Science in context: Space junk, page 139",
      examples: [
        { question: "What is space junk?", answer: "Anything from old spacecraft to tools dropped by astronauts during spacewalks, orbiting the Earth. (p.139)" },
        { question: "Why can even a tiny piece of space junk be dangerous?", answer: "Because it travels so fast that it acts like a bullet, and can damage spacecraft or harm astronauts. (p.139)" },
      ],
      quickCheck: [
        {
          title: "Quick check · why space junk is dangerous",
          prompt: "Why can even a small piece of space junk be dangerous?",
          conceptId: "10.6",
          options: [
            { label: "It travels extremely fast, like a bullet", correct: true, say: "Correct - its high speed makes it dangerous, no matter its size.", frame: frame([{ label: "Space junk - travels so fast it can act like a bullet", at: [89.75, 93], note: "Speed makes it dangerous.", tone: "gold" }], SPACEJUNK_FOCUS) },
            { label: "It is radioactive", correct: false, say: "The book explains the danger comes from its speed, not radioactivity.", frame: frame([{ label: "Space junk - travels so fast it can act like a bullet", at: [89.75, 93], note: "It's about speed, not radiation.", tone: "red" }], SPACEJUNK_FOCUS) },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. Rotation and axis",
      conceptId: "10.1",
      say: "The Earth spins around its axis once every 24 hours - that's a day. The axis runs from the North Pole to the South Pole, always tilted at 23.5 degrees.",
      frame: frame(
        [
          { label: "North Pole", at: [25, 23], note: "Top of the axis.", tone: "gold" },
          { label: "Axis (tilted 23.5 degrees)", at: [32.25, 29], note: "The imaginary line it spins around.", tone: "green" },
          { label: "Equator", at: [4.4, 30], note: "The middle line, dividing hemispheres.", tone: "blue" },
          { label: "South Pole", at: [7, 74], note: "Bottom of the axis.", tone: "red" },
        ],
        ROTATION_FOCUS,
      ),
    },
    {
      label: "2. An elliptical orbit",
      conceptId: "10.2",
      say: "The Earth doesn't travel in a perfect circle around the Sun - its path is an ellipse, and it takes 365 days, travelling anticlockwise, to go all the way round.",
      frame: {
        text: {
          title: "Earth's elliptical orbit",
          cards: [
            { tag: "Shape", title: "Ellipse, not a circle", desc: "The Earth's orbit is oval-shaped.", quote: "The correct word to describe the shape is an ellipse. (p.133)" },
            { tag: "Direction", title: "Anticlockwise", desc: "The Earth travels anticlockwise around the Sun.", quote: "The Earth travels in an anticlockwise direction around the Sun. (p.133)" },
            { tag: "Time", title: "365 days = 1 year", desc: "One full orbit takes about a year.", quote: "It takes the Earth 365 days to travel around the Sun. (p.133)" },
          ],
        },
      },
    },
    {
      label: "3. Direct or angled sunlight",
      conceptId: "10.3",
      say: "It's not about distance from the Sun. When a place is tilted towards the Sun, the light hits it directly and concentrated - hotter. Tilted away, the light spreads out at an angle - colder.",
      frame: frame(
        [
          { label: "Concentrated Light = Hotter", at: [49.5, 46], note: "Direct, overhead sunlight.", tone: "gold" },
          { label: "Angled Light = Colder", at: [65.25, 46], note: "Spread-out, angled sunlight.", tone: "green" },
        ],
        SEASONS_WHY_FOCUS,
      ),
    },
    {
      label: "4. Opposite hemispheres",
      conceptId: "10.4",
      say: "While the northern hemisphere has summer, the southern hemisphere has winter - always the opposite, at the same time.",
      frame: frame(
        [
          { label: "Summer", at: [94.25, 20], note: "Northern hemisphere, in this example.", tone: "gold" },
          { label: "Winter", at: [77.5, 37], note: "Southern hemisphere, at the same time.", tone: "blue" },
          { label: "Opposite seasons at the same time", at: [90, 46], note: "Always opposite.", tone: "green" },
        ],
        SEASONS_WORLD_FOCUS,
      ),
    },
    {
      label: "5. Natural and artificial satellites",
      conceptId: "10.5",
      say: "The Moon is a natural satellite - it orbits Earth naturally. The International Space Station is an artificial satellite - built and launched by people.",
      frame: frame(
        [
          { label: "Natural satellite (e.g. the Moon)", at: [50.75, 64], note: "Orbits naturally.", tone: "gold" },
          { label: "Artificial satellite (e.g. the ISS)", at: [67.25, 64], note: "Built by humans.", tone: "green" },
        ],
        SATELLITES_FOCUS,
      ),
    },
    {
      label: "6. Space junk",
      conceptId: "10.6",
      say: "Trillions of pieces of space junk orbit the Earth - old spacecraft parts and dropped tools. Even tiny pieces are dangerous because they travel so fast.",
      frame: frame(
        [
          { label: "Space junk - travels so fast it can act like a bullet", at: [89.75, 93], note: "Danger comes from speed.", tone: "gold" },
        ],
        SPACEJUNK_FOCUS,
      ),
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · What causes day and night",
      prompt: "What causes day and night on Earth?",
      conceptId: "10.1",
      setup: frame([], ROTATION_FOCUS),
      options: [
        { label: "The Earth rotating on its axis", correct: true, say: "Correct - one full rotation, every 24 hours, causes day and night.", frame: frame([{ label: "1 rotation = 1 day (24 hours)", at: [17.5, 90], note: "This rotation causes day and night.", tone: "green" }], ROTATION_FOCUS) },
        { label: "The Earth orbiting the Sun", correct: false, say: "Orbiting the Sun takes a full year and causes the seasons, not day and night.", frame: frame([{ label: "1 rotation = 1 day (24 hours)", at: [17.5, 90], note: "Rotation, not orbit, causes day/night.", tone: "red" }], ROTATION_FOCUS) },
      ],
    },
    {
      title: "Task 2 · Orbit shape",
      prompt: "The Earth's path around the Sun is best described as...",
      conceptId: "10.2",
      setup: { text: { cards: [{ tag: "?", title: "Shape of the orbit", desc: "Is it a circle?" }] } },
      options: [
        { label: "An ellipse", correct: true, say: "Correct.", frame: { text: { cards: [{ tag: "Correct", title: "Ellipse", desc: "Not a perfect circle." }] } } },
        { label: "A perfect circle", correct: false, say: "The book is explicit that it is NOT a perfect circle.", frame: { text: { cards: [{ tag: "✗", title: "Not a circle", desc: "It's an ellipse instead." }] } } },
      ],
    },
    {
      title: "Task 3 · Misconception check",
      prompt: "Why is it summer in a place at a certain time of year?",
      conceptId: "10.3",
      setup: frame([], SEASONS_WHY_FOCUS),
      options: [
        { label: "That part of Earth is tilted towards the Sun", correct: true, say: "Correct - being tilted towards the Sun causes direct, concentrated sunlight.", frame: frame([{ label: "Concentrated Light = Hotter", at: [49.5, 46], note: "Caused by the tilt.", tone: "green" }], SEASONS_WHY_FOCUS) },
        { label: "The Earth is closer to the Sun at that time", correct: false, say: "That's the misconception the book corrects - distance from the Sun isn't the real cause.", frame: frame([{ label: "Angled Light = Colder", at: [65.25, 46], note: "This is about the tilt, not distance.", tone: "red" }], SEASONS_WHY_FOCUS) },
      ],
    },
    {
      title: "Task 4 · Equator seasons",
      prompt: "Why does the equator have no seasons?",
      conceptId: "10.4",
      setup: frame([], SEASONS_WORLD_FOCUS),
      options: [
        { label: "The Sun strikes it at about the same angle every day, all year", correct: true, say: "Correct - roughly 12 hours of sunlight daily, with no temperature change.", frame: frame([{ label: "Opposite seasons at the same time", at: [90, 46], note: "The equator itself has no seasonal change.", tone: "green" }], SEASONS_WORLD_FOCUS) },
        { label: "It has all four seasons at once", correct: false, say: "The equator has no seasons at all - not all four together, none.", frame: frame([{ label: "Opposite seasons at the same time", at: [90, 46], note: "This describes hemispheres, not the equator.", tone: "red" }], SEASONS_WORLD_FOCUS) },
      ],
    },
    {
      title: "Task 5 · Natural vs artificial",
      prompt: "The International Space Station is an example of...",
      conceptId: "10.5",
      setup: frame([], SATELLITES_FOCUS),
      options: [
        { label: "An artificial satellite", correct: true, say: "Correct - it was built by humans.", frame: frame([{ label: "Artificial satellite (e.g. the ISS)", at: [67.25, 64], note: "Human-built.", tone: "green" }], SATELLITES_FOCUS) },
        { label: "A natural satellite", correct: false, say: "Natural satellites, like the Moon, occur naturally - the ISS was built by people.", frame: frame([{ label: "Natural satellite (e.g. the Moon)", at: [50.75, 64], note: "This is the natural kind - not the ISS.", tone: "red" }], SATELLITES_FOCUS) },
      ],
    },
    {
      title: "Task 6 · Why space junk is risky",
      prompt: "Why is a tiny piece of space junk still dangerous?",
      conceptId: "10.6",
      setup: frame([], SPACEJUNK_FOCUS),
      options: [
        { label: "It travels so fast it can act like a bullet", correct: true, say: "Correct.", frame: frame([{ label: "Space junk - travels so fast it can act like a bullet", at: [89.75, 93], note: "Speed is the danger.", tone: "green" }], SPACEJUNK_FOCUS) },
        { label: "It's too small to cause any real damage", correct: false, say: "Even small pieces are dangerous, because of how fast they travel.", frame: frame([{ label: "Space junk - travels so fast it can act like a bullet", at: [89.75, 93], note: "Small pieces are still dangerous.", tone: "red" }], SPACEJUNK_FOCUS) },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each panel on the board and explain what it teaches about the Earth in space.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "What causes day and night, and how long does it take?", answer: "The Earth's rotation on its axis - one full rotation takes 24 hours (one day).", conceptId: "10.1" },
    { ask: "What shape is the Earth's orbit, and how long does it take?", answer: "An ellipse, not a perfect circle - it takes 365 days (about a year), travelling anticlockwise.", conceptId: "10.2" },
    { ask: "What is the real cause of the seasons?", answer: "The Earth's tilt - not its distance from the Sun. Being tilted towards the Sun gives direct, concentrated sunlight (hotter); tilted away gives angled, spread-out sunlight (colder).", conceptId: "10.3" },
    { ask: "Why do the northern and southern hemispheres have opposite seasons, and why does the equator have none?", answer: "Opposite hemispheres tilt towards/away from the Sun at opposite times. The equator gets sunlight at about the same angle all year, so there's no seasonal change.", conceptId: "10.4" },
    { ask: "What is the difference between a natural and an artificial satellite?", answer: "A natural satellite (like the Moon) orbits a planet naturally. An artificial satellite (like the ISS) is built by humans.", conceptId: "10.5" },
    { ask: "What is space junk, and why is it dangerous?", answer: "Old spacecraft parts and dropped tools orbiting Earth. Even tiny pieces are dangerous because they travel so fast they act like bullets.", conceptId: "10.6" },
  ],

  writtenPractice: [
    { question: "Explain, using the word 'axis', why we have day and night.", answer: "The Earth rotates (spins) around its axis once every 24 hours. As it spins, different parts face the Sun (day) or face away from it (night).", conceptId: "10.1" },
    { question: "A friend says the Earth's orbit is a perfect circle. Correct them, using the right scientific word.", answer: "The Earth's orbit is not a perfect circle - it is an ellipse, so we say the Earth takes an elliptical path around the Sun.", conceptId: "10.2" },
    { question: "Explain the misconception about what causes summer and winter, and give the real explanation.", answer: "The misconception is that summer happens because the Earth is closer to the Sun, and winter because it's farther away. The real cause is the Earth's tilt: a hemisphere tilted towards the Sun gets more direct, concentrated sunlight (summer); tilted away, it gets angled, spread-out sunlight (winter).", conceptId: "10.3" },
    { question: "Explain why a country near the equator might not experience four distinct seasons.", answer: "Places near the equator can have just two seasons (rainy and dry) instead of four, and right at the equator there are no seasons at all, because the Sun strikes at about the same angle every day of the year.", conceptId: "10.4" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Rotation",
        prompt: "One full rotation of the Earth on its axis takes...",
        conceptId: "10.1",
        options: [
          { label: "24 hours", correct: true, say: "Correct.", frame: frame([{ label: "1 rotation = 1 day (24 hours)", at: [17.5, 90], note: "Correct.", tone: "green" }], ROTATION_FOCUS) },
          { label: "365 days", correct: false, say: "365 days is a full orbit of the Sun, not a single rotation.", frame: frame([{ label: "1 rotation = 1 day (24 hours)", at: [17.5, 90], note: "That's an orbit, not a rotation.", tone: "red" }], ROTATION_FOCUS) },
        ],
      },
      {
        title: "Q2 · Orbit",
        prompt: "What shape is the Earth's orbit?",
        conceptId: "10.2",
        options: [
          { label: "An ellipse", correct: true, say: "Correct.", frame: { text: { cards: [{ tag: "Correct", title: "Ellipse", desc: "Not a circle." }] } } },
          { label: "A square", correct: false, say: "Orbits are curved paths - the Earth's is an ellipse, not any straight-edged shape.", frame: { text: { cards: [{ tag: "✗", title: "Not a square", desc: "It's a curved ellipse." }] } } },
        ],
      },
      {
        title: "Q3 · Seasons cause",
        prompt: "What really causes the seasons?",
        conceptId: "10.3",
        options: [
          { label: "The Earth's tilt", correct: true, say: "Correct.", frame: frame([{ label: "Concentrated Light = Hotter", at: [49.5, 46], note: "Caused by tilt.", tone: "green" }], SEASONS_WHY_FOCUS) },
          { label: "Distance from the Sun", correct: false, say: "This is the misconception the unit corrects - it's the tilt, not the distance.", frame: frame([{ label: "Angled Light = Colder", at: [65.25, 46], note: "Not about distance.", tone: "red" }], SEASONS_WHY_FOCUS) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Seasons around the world",
        prompt: "When it's summer in the northern hemisphere, what season is it in the southern hemisphere?",
        conceptId: "10.4",
        options: [
          { label: "Winter", correct: true, say: "Correct - opposite hemispheres have opposite seasons.", frame: frame([{ label: "Opposite seasons at the same time", at: [90, 46], note: "Correct.", tone: "green" }], SEASONS_WORLD_FOCUS) },
          { label: "Summer, the same as the north", correct: false, say: "The hemispheres always have opposite seasons at the same time.", frame: frame([{ label: "Opposite seasons at the same time", at: [90, 46], note: "Never the same.", tone: "red" }], SEASONS_WORLD_FOCUS) },
        ],
      },
      {
        title: "Q5 · Satellites and space junk",
        prompt: "Which is a natural satellite of Earth?",
        conceptId: "10.5",
        options: [
          { label: "The Moon", correct: true, say: "Correct.", frame: frame([{ label: "Natural satellite (e.g. the Moon)", at: [50.75, 64], note: "Correct.", tone: "green" }], SATELLITES_FOCUS) },
          { label: "A weather satellite", correct: false, say: "Weather satellites are artificial, built by humans - not natural.", frame: frame([{ label: "Artificial satellite (e.g. the ISS)", at: [67.25, 64], note: "Weather satellites are artificial.", tone: "red" }], SATELLITES_FOCUS) },
        ],
      },
    ],
  },

  readymade: [
    { q: "What causes day and night?", a: "The Earth's rotation on its axis, once every 24 hours." },
    { q: "What shape is the Earth's orbit?", a: "An ellipse, not a perfect circle - it takes 365 days to complete." },
    { q: "What really causes the seasons?", a: "The Earth's tilt - not its distance from the Sun." },
    { q: "What is the difference between a natural and artificial satellite?", a: "A natural satellite (like the Moon) orbits a planet naturally; an artificial satellite (like the ISS) is built by humans." },
  ],

  chatAnswers: [
    { question: "Why do we have day and night?", answer: "The Earth rotates on its axis, and one full rotation takes 24 hours - that's one day. As different parts face the Sun or face away, they experience day or night.", keywords: ["day", "night", "rotation", "axis"], conceptId: "10.1" },
    { question: "What shape is Earth's orbit?", answer: "The Earth's orbit around the Sun is an ellipse, not a perfect circle. It takes 365 days, travelling anticlockwise, to complete one orbit.", keywords: ["orbit", "ellipse", "elliptical"], conceptId: "10.2" },
    { question: "What causes the seasons?", answer: "Not the Earth's distance from the Sun - that's a misconception. The real cause is the Earth's tilt: a hemisphere tilted towards the Sun gets direct, concentrated sunlight (summer); tilted away, it gets angled, spread-out sunlight (winter).", keywords: ["seasons", "tilt", "misconception"], conceptId: "10.3" },
    { question: "Why are seasons different around the world?", answer: "The northern and southern hemispheres have opposite seasons at the same time. Some tropical places have just two seasons (rainy and dry), and the equator has no seasons at all, since the Sun strikes it at about the same angle every day.", keywords: ["seasons", "hemisphere", "equator"], conceptId: "10.4" },
    { question: "What is a satellite?", answer: "A natural satellite is an object that orbits a planet naturally, like the Moon orbiting Earth. An artificial satellite is built by humans and orbits Earth, like the International Space Station.", keywords: ["satellite", "natural", "artificial", "moon", "ISS"], conceptId: "10.5" },
    { question: "What is space junk?", answer: "Old spacecraft parts and tools dropped during spacewalks, orbiting the Earth. Even tiny pieces are dangerous because they travel so fast they act like bullets.", keywords: ["space junk", "debris", "dangerous"], conceptId: "10.6" },
  ],
};
