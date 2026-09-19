import type { BoardFrame, BoardTask, BoardUnit } from "./types";

const siFrame: BoardFrame = {
  image: {
    src: "/board-art/tn9-science-measurement-lab.png",
    alt: "Illustrated measurement laboratory with instruments and derived quantity examples",
    title: "Touch an instrument or example: what does it measure?",
    hotspots: [
      { label: "Length", at: [12, 37], note: "A ruler measures length. Its SI unit is the metre.", tone: "gold" },
      { label: "Mass", at: [33, 37], note: "A balance measures mass. Its SI unit is the kilogram.", tone: "blue" },
      { label: "Time", at: [51, 38], note: "A stopwatch measures time. Its SI unit is the second.", tone: "red" },
      { label: "Temperature", at: [70, 38], note: "A thermometer measures temperature. Its SI unit is the kelvin.", tone: "green" },
      { label: "Current", at: [89, 38], note: "An ammeter measures electric current. Its SI unit is the ampere.", tone: "gold" },
      { label: "Area", at: [13, 79], note: "Area is derived from length multiplied by length.", tone: "blue" },
      { label: "Speed", at: [51, 79], note: "Speed is derived from distance divided by time.", tone: "green" },
      { label: "Density", at: [86, 79], note: "Density compares mass with volume. It is a derived quantity.", tone: "red" },
    ],
  },
};

const prefixesFrame: BoardFrame = {
  timeline: {
    title: "From a tiny atom to a huge galaxy",
    events: [
      { when: "10⁻¹⁰ m", what: "angstrom", note: "Useful for atomic distances.", tone: "blue" },
      { when: "10⁻⁶ m", what: "micrometre", note: "A millionth of a metre.", tone: "green" },
      { when: "10³ m", what: "kilometre", note: "A thousand metres.", tone: "gold" },
      { when: "1.496 × 10¹¹ m", what: "astronomical unit", note: "Average Earth–Sun distance.", tone: "red" },
    ],
  },
};

const caliperFrame: BoardFrame = {
  image: {
    src: "/board-art/tn9-science-vernier-caliper.png",
    alt: "Detailed vernier caliper measuring a cylinder with scale and jaw insets",
    title: "Explore the caliper: tap each part before reading it",
    hotspots: [
      { label: "Main scale", at: [66, 31], note: "The main scale gives the whole part of the reading.", tone: "gold" },
      { label: "Vernier scale", at: [42, 45], note: "The vernier scale gives the fractional part when one division aligns.", tone: "blue" },
      { label: "Outside jaws", at: [12, 20], note: "The outside jaws grip the outside of a cylinder or object.", tone: "green" },
      { label: "Inside jaws", at: [83, 69], note: "The inside jaws measure the inside of a hollow tube.", tone: "green" },
      { label: "Depth rod", at: [90, 37], note: "The depth rod measures the depth of a hole or container.", tone: "red" },
      { label: "Coinciding mark", at: [49, 78], note: "Find the vernier division that lines up with a main-scale mark, then multiply it by the least count.", tone: "gold" },
    ],
  },
  diagram: {
    title: "Vernier caliper: measure small lengths",
    viewBox: "0 0 520 260",
    svg: `<rect x="45" y="82" width="425" height="24" rx="4" fill="#263449" stroke="#93a4bc" stroke-width="2"/><g stroke="#d8e2ee" stroke-width="1.5">${Array.from({ length: 18 }, (_, i) => `<line x1="65" y1="82" x2="65" y2="96" transform="translate(${i * 22} 0)"/>`).join("")}</g><rect x="170" y="108" width="150" height="26" rx="4" fill="#123d59" stroke="#38bdf8" stroke-width="2"/><g stroke="#38bdf8" stroke-width="1.5">${Array.from({ length: 11 }, (_, i) => `<line x1="180" y1="121" x2="180" y2="135" transform="translate(${i * 13} 0)"/>`).join("")}</g><path d="M45 82V190H70V106M170 134V190H195V134M45 82V45H68V82M170 82V45H193V82M320 114H470" fill="none" stroke="#93a4bc" stroke-width="7" stroke-linejoin="round"/>`,
    parts: [
      { label: "Main scale", at: [410, 82], note: "Gives the whole part of the reading.", tone: "gold" },
      { label: "Vernier scale", at: [245, 140], note: "The matching division gives the fractional part.", tone: "blue" },
      { label: "Outside jaws", at: [57, 194], note: "Grip the outside of an object.", tone: "green" },
      { label: "Inside jaws", at: [58, 42], note: "Measure the inside of a hollow object.", tone: "green" },
      { label: "Depth rod", at: [452, 114], note: "Measures the depth of a hole.", tone: "red" },
    ],
  },
};

const screwGaugeFrame: BoardFrame = {
  diagram: {
    title: "Screw gauge: measure very small thickness",
    viewBox: "0 0 520 280",
    svg: `<path d="M145 55C70 55 55 95 55 140s15 85 90 85h125v-42h-88c-30 0-45-17-45-43s15-43 45-43h88V55Z" fill="#263449" stroke="#93a4bc" stroke-width="3"/><rect x="270" y="80" width="80" height="120" rx="9" fill="#123d59" stroke="#38bdf8" stroke-width="3"/><circle cx="350" cy="140" r="42" fill="#334b63" stroke="#f6c85f" stroke-width="4"/><line x1="165" y1="140" x2="270" y2="140" stroke="#e8eef5" stroke-width="10"/><line x1="165" y1="100" x2="165" y2="180" stroke="#f6c85f" stroke-width="8"/>`,
    parts: [
      { label: "Frame", at: [100, 65], note: "Supports the fixed and movable parts.", tone: "blue" },
      { label: "Anvil", at: [165, 92], note: "The fixed plane that holds one side of the object.", tone: "gold" },
      { label: "Spindle", at: [220, 140], note: "Moves towards the anvil when the screw turns.", tone: "green" },
      { label: "Thimble", at: [350, 80], note: "Rotates to move the spindle.", tone: "red" },
      { label: "Ratchet", at: [395, 140], note: "Helps apply gentle, steady pressure.", tone: "green" },
    ],
  },
};

const massFrame: BoardFrame = {
  bar: {
    title: "Mass and weight are not the same",
    bars: [
      { label: "mass: amount of matter", value: 50, tone: "blue", note: "Measured in kilograms; it stays the same." },
      { label: "Earth weight: mg", value: 490, tone: "green", note: "50 × 9.8 = 490 N." },
      { label: "Moon weight", value: 82, tone: "gold", note: "Gravity is about one-sixth as strong." },
    ],
    max: 490,
    caption: "Weight depends on gravity; mass does not.",
  },
};

function option(label: string, correct: boolean, say: string, frame: BoardFrame): { label: string; correct: boolean; say: string; frame: BoardFrame } {
  return { label, correct, say, frame };
}

function task(title: string, conceptId: string, prompt: string, options: ReturnType<typeof option>[], setup?: BoardFrame): BoardTask {
  return { title, conceptId, prompt, options, setup };
}

export const TAMILNADU_9_SCIENCE_1: BoardUnit = {
  unitKey: "tamilnadustateboard-9-science-1",
  title: "Unit 1 · Measurement",
  badge: "Tamil Nadu State Board · Standard IX Science · Unit 1",
  gridMax: 10,
  stage: "diagram",
  intro: {
    covers: [
      "Physical quantities, base quantities, derived quantities, and SI symbols",
      "Unit prefixes, scientific notation, and astronomical distances",
      "Vernier caliper and least count, including zero correction",
      "Screw gauge, pitch, least count, and zero error",
      "Mass, weight, measuring instruments, and accuracy",
    ],
    outcomes: [
      "Choose a suitable instrument and unit for a measurement",
      "Read a vernier caliper or screw gauge using the correct formula",
      "Explain why accurate measurements and correct SI notation matter",
    ],
  },
  concepts: [
    { conceptId: "1.1", title: "Physical quantities and SI units", icon: "📐", summary: "A measurement combines a numerical value with a standard unit. SI gives scientists a shared system.", keyPoints: ["A physical quantity can be measured and expressed with a number and unit.", "The seven SI base quantities are length, mass, time, temperature, electric current, luminous intensity, and amount of substance.", "Derived quantities such as area, volume, speed, and density are built from base quantities.", "Write a space between the value and symbol, and do not pluralise the symbol."], pages: [1, 2, 4, 5], examples: [{ question: "Classify speed as a base or derived quantity and give its SI unit.", answer: "Speed is derived from distance and time; its SI unit is metre per second (m/s or m s⁻¹)." }], quickCheck: [task("Quick check · SI", "1.1", "Which is written correctly?", [option("25 kg", true, "Correct. The number and SI symbol are separated by a space, and kg is not pluralised.", siFrame), option("25 kgs", false, "SI symbols do not take a plural s. Write 25 kg.", siFrame)], siFrame)] },
    { conceptId: "1.2", title: "Prefixes and astronomical units", icon: "🌌", summary: "Prefixes show powers of ten, helping us write both tiny and enormous measurements clearly.", keyPoints: ["A kilometre is 10³ m, a micrometre is 10⁻⁶ m, and a nanometre is 10⁻⁹ m.", "An astronomical unit is about 1.496 × 10¹¹ m, the average Earth–Sun distance.", "A light year is the distance light travels in one year; a parsec is used for still larger astronomical distances."], pages: [3, 4], examples: [{ question: "Write 3 km in metres.", answer: "3 km = 3 × 10³ m = 3000 m." }], quickCheck: [task("Quick check · prefixes", "1.2", "Which prefix means 10⁻⁶?", [option("micro (µ)", true, "Yes. Micro means one millionth, or 10⁻⁶.", prefixesFrame), option("kilo (k)", false, "Kilo means 10³, or one thousand. Micro means 10⁻⁶.", prefixesFrame)], prefixesFrame)] },
    { conceptId: "1.3", title: "Vernier caliper", icon: "🛠️", summary: "A vernier caliper measures small lengths, internal and external diameters, and depth more precisely than a metre scale.", keyPoints: ["Least count = one main scale division − one vernier scale division.", "Reading = main scale reading + (coinciding vernier division × least count) + zero correction.", "Check zero error before taking the final reading."], pages: [5, 6, 9, 10, 12], examples: [{ question: "Main scale = 8 cm, 4th vernier division coincides, zero correction = +0.02 cm. Find the reading.", answer: "8 + (4 × 0.01) + 0.02 = 8.06 cm." }], quickCheck: [task("Quick check · vernier", "1.3", "Main scale = 2.4 cm and the 6th vernier division coincides. What is the reading if the least count is 0.01 cm and there is no zero error?", [option("2.46 cm", true, "Correct: 2.4 + (6 × 0.01) = 2.46 cm.", caliperFrame), option("2.60 cm", false, "Each division contributes 0.01 cm, so 6 divisions contribute 0.06 cm, not 0.6 cm.", caliperFrame)], caliperFrame)] },
    { conceptId: "1.4", title: "Screw gauge", icon: "⚙️", summary: "A screw gauge measures very small thicknesses using the motion of a screw through a nut.", keyPoints: ["Pitch is the distance moved by the screw tip in one complete rotation.", "Least count = pitch ÷ number of divisions on the circular scale.", "The final reading must include the zero correction when an error is present."], pages: [7, 11, 12], examples: [{ question: "A screw gauge has pitch 1 mm and 100 circular-scale divisions. Find its least count.", answer: "Least count = 1 ÷ 100 = 0.01 mm." }], quickCheck: [task("Quick check · screw gauge", "1.4", "What is the least count when pitch = 1 mm and the circular scale has 100 divisions?", [option("0.01 mm", true, "Correct: least count = pitch ÷ divisions = 1 ÷ 100 = 0.01 mm.", screwGaugeFrame), option("0.1 mm", false, "Divide by all 100 divisions, not ten: 1 ÷ 100 = 0.01 mm.", screwGaugeFrame)], screwGaugeFrame)] },
    { conceptId: "1.5", title: "Mass, weight, and accuracy", icon: "⚖️", summary: "Mass is the amount of matter; weight is the gravitational force on that mass. Good instruments and careful technique improve accuracy.", keyPoints: ["Mass is measured in kilogram and remains the same when gravity changes.", "Weight is a force: W = mg, measured in newton.", "A beam balance compares masses; a spring balance measures force/weight; digital balances can give precise readings.", "Accuracy matters: choose a suitable instrument, avoid parallax, and record the correct least count."], pages: [8, 12, 13, 14], examples: [{ question: "Find the Earth weight of a 50 kg person when g = 9.8 m/s².", answer: "W = mg = 50 × 9.8 = 490 N." }], quickCheck: [task("Quick check · mass and weight", "1.5", "What happens to a person's mass and weight on the Moon?", [option("Mass stays the same; weight becomes about one-sixth.", true, "Correct. Mass is the amount of matter, while weight depends on the Moon's weaker gravity.", massFrame), option("Both mass and weight become one-sixth.", false, "Only weight depends on gravity. The person's mass stays the same.", massFrame)], massFrame)] },
  ],
  conceptSteps: [
    { label: "1.1 · SI quantities", conceptId: "1.1", say: "A physical quantity has a number and a unit. SI gives us one shared language for measuring length, mass, time and other quantities.", frame: siFrame },
    { label: "1.2 · Prefixes", conceptId: "1.2", say: "Prefixes let us move across powers of ten, from the tiny micrometre to the huge astronomical unit.", frame: prefixesFrame },
    { label: "1.3 · Vernier caliper", conceptId: "1.3", say: "The main scale gives the whole reading. The matching vernier division gives the fraction, and zero correction keeps the result accurate.", frame: caliperFrame },
    { label: "1.4 · Screw gauge", conceptId: "1.4", say: "A screw gauge turns rotation into a very small straight movement. Its least count is pitch divided by circular-scale divisions.", frame: screwGaugeFrame },
    { label: "1.5 · Mass and weight", conceptId: "1.5", say: "Mass is matter; weight is gravitational force. On Earth, a 50 kilogram mass weighs 490 newtons when g is 9.8 metres per second squared.", frame: massFrame },
  ],
  guidedTasks: [
    task("Practice · SI notation", "1.1", "Which is a derived quantity?", [option("Speed", true, "Yes. Speed is distance divided by time, so it is derived.", siFrame), option("Mass", false, "Mass is one of the seven SI base quantities.", siFrame)], siFrame),
    task("Practice · unit conversion", "1.2", "How many metres are in 4 km?", [option("4000 m", true, "Correct: 4 × 10³ = 4000 m.", prefixesFrame), option("40 m", false, "Kilo means 1000, so 4 km is 4000 m.", prefixesFrame)], prefixesFrame),
    task("Practice · caliper reading", "1.3", "Main scale = 5.7 cm, 3rd vernier division, least count = 0.01 cm. What is the reading?", [option("5.73 cm", true, "Correct: 5.7 + (3 × 0.01) = 5.73 cm.", caliperFrame), option("5.03 cm", false, "Keep the main scale reading 5.7 cm, then add 0.03 cm.", caliperFrame)], caliperFrame),
    task("Practice · screw gauge", "1.4", "Why is pitch needed?", [option("It tells how far the screw moves in one full turn.", true, "Exactly. Pitch is the distance moved in one complete rotation.", screwGaugeFrame), option("It tells the mass of the object.", false, "A screw gauge measures length or thickness; pitch describes its screw movement.", screwGaugeFrame)], screwGaugeFrame),
    task("Practice · calculate weight", "1.5", "What is the weight of a 10 kg object when g = 9.8 m/s²?", [option("98 N", true, "Correct: W = mg = 10 × 9.8 = 98 N.", massFrame), option("10 N", false, "Weight is not numerically the same as mass here; multiply mass by g.", massFrame)], massFrame),
  ],
  lab: { kind: "visual", prompt: "Touch the instrument parts on the board, then explain which scale or quantity each one measures.", start: [0, 0], shape: [[0, 0]], range: { min: 0, max: 1 } },
  recitePrompts: [
    { ask: "What is a physical quantity?", answer: "A property that can be measured and expressed with a number and a unit.", conceptId: "1.1" },
    { ask: "What does the prefix kilo mean?", answer: "Kilo means 10³, or one thousand.", conceptId: "1.2" },
    { ask: "How do you calculate a vernier caliper reading?", answer: "Main scale reading + (coinciding vernier division × least count) + zero correction.", conceptId: "1.3" },
    { ask: "What is the least count of a screw gauge?", answer: "Pitch divided by the number of divisions on its circular scale.", conceptId: "1.4" },
    { ask: "How are mass and weight different?", answer: "Mass is the amount of matter; weight is the gravitational force W = mg.", conceptId: "1.5" },
  ],
  writtenPractice: [
    { question: "Write the SI units of length, mass, time, and temperature.", answer: "metre (m), kilogram (kg), second (s), and kelvin (K).", conceptId: "1.1" },
    { question: "Convert 2.5 km into metres and 4 mm into metres.", answer: "2500 m and 0.004 m.", conceptId: "1.2" },
    { question: "A vernier reading has main scale 8 cm, coincidence 4, LC 0.01 cm, and positive correction 0.02 cm. Find the corrected reading.", answer: "8.06 cm.", conceptId: "1.3" },
    { question: "A screw gauge has pitch 0.5 mm and 50 circular-scale divisions. Find the least count.", answer: "0.01 mm.", conceptId: "1.4" },
    { question: "Explain why an astronaut's mass stays the same but weight changes on the Moon.", answer: "Mass is the amount of matter; weight depends on gravitational acceleration, which is weaker on the Moon.", conceptId: "1.5" },
  ],
  assessmentStory: { text: { title: "The science-lab measurement challenge", passage: [{ text: "A group measures a pen cap with a vernier caliper, a sheet with a screw gauge, and a stone with a balance. They must choose units, read instruments, and explain accuracy.", tone: "blue" }] } },
  assessment: {
    partA: [
      task("Test · SI", "1.1", "Which symbol is the SI symbol for kilogram?", [option("kg", true, "Correct.", siFrame), option("kgs", false, "SI symbols are not pluralised.", siFrame)], siFrame),
      task("Test · prefix", "1.2", "Which is equal to 1.496 × 10¹¹ m?", [option("One astronomical unit", true, "Correct: this is the average Earth–Sun distance.", prefixesFrame), option("One micrometre", false, "A micrometre is 10⁻⁶ m, much smaller.", prefixesFrame)], prefixesFrame),
      task("Test · vernier", "1.3", "A 6th division coincides, LC is 0.01 cm, and the main scale is 2.4 cm. Find the reading.", [option("2.46 cm", true, "Correct.", caliperFrame), option("2.04 cm", false, "Add 0.06 cm to 2.4 cm, not 0.04 cm.", caliperFrame)], caliperFrame),
    ],
    partB: [
      task("Test · screw gauge", "1.4", "Pitch is 1 mm and the circular scale has 100 divisions. Find the least count.", [option("0.01 mm", true, "Correct.", screwGaugeFrame), option("100 mm", false, "Least count is pitch divided by divisions.", screwGaugeFrame)], screwGaugeFrame),
      task("Test · weight", "1.5", "A 70 kg person has g = 9.8 m/s² on Earth. What is the weight?", [option("686 N", true, "Correct: 70 × 9.8 = 686 N.", massFrame), option("70 N", false, "70 kg is the mass; weight is mg.", massFrame)], massFrame),
    ],
  },
  readymade: [
    { q: "What is the SI system?", a: "A shared system of units used to measure physical quantities consistently." },
    { q: "What is least count?", a: "The smallest measurement an instrument can read." },
    { q: "What is the formula for weight?", a: "Weight equals mass multiplied by gravitational acceleration: W = mg." },
  ],
  chatAnswers: [
    { question: "What is a physical quantity?", answer: "A physical quantity is a property that can be measured and written with a number and a unit.", keywords: ["physical", "quantity"], conceptId: "1.1" },
    { question: "What is least count?", answer: "Least count is the smallest measurement an instrument can read.", keywords: ["least", "count"], conceptId: "1.3" },
    { question: "How do I calculate weight?", answer: "Use W = mg. Multiply the mass in kilograms by gravitational acceleration in metres per second squared.", keywords: ["weight", "mass", "gravity"], conceptId: "1.5" },
  ],
};
