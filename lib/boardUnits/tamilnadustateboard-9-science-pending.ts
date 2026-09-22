import type { BoardFrame, BoardTask, BoardUnit, ConceptStep } from "./types";

/**
 * The 2024 Tamil Nadu Standard IX Science contents map. Unit 1 is the first
 * fully authored Board lesson; these source-grounded unit shells make Units
 * 2–24 available in the same Read -> Cover -> Recite -> Test template while
 * their page-specific worked examples are deepened from the textbook.
 *
 * This is deliberately data, not a second Science player. Future units add
 * richer frames/examples here and keep the renderer unchanged.
 */
type ScienceConcept = { id: string; title: string; icon: string; summary: string; example: { question: string; answer: string }; frame?: BoardFrame; pages?: number[] };

type ScienceDefinition = { number: number; title: string; concepts: ScienceConcept[] };

const imageFrame = (src: string, title: string, alt: string, hotspots: { label: string; at: [number, number]; note: string; tone?: "gold" | "green" | "red" | "blue" }[] = [], focus?: { x: number; y: number; w: number; h: number }): BoardFrame => ({
  image: { src, title, alt, hotspots, focus },
});

const cardsFrame = (title: string, cards: { tag: string; title: string; desc: string }[]): BoardFrame => ({
  text: { title, cards },
});

/**
 * Codex-generated atlas artwork. One HD scene can serve a small related set
 * of units; focus keeps the current phenomenon large while the hotspots stay
 * owned by the textbook data. The artwork is deliberately text-free so the
 * labels and Tamil/local-language narration remain accurate in code.
 */
function codexAtlasFrame(definition: ScienceDefinition, concept: ScienceConcept): BoardFrame | undefined {
  const atlasByUnit: Record<number, { src: string; panel: number }> = {
    2: { src: "/board-art/tn9-science-atlas-2-4.png", panel: 0 },
    3: { src: "/board-art/tn9-science-atlas-2-4.png", panel: 1 },
    // Unit 4 has its own per-section diagrams (unit4Frame) - one shared
    // circuit photo cannot honestly stand in for seven different real
    // textbook sections (charge/field, AC/DC and safety are not circuits).
    5: { src: "/board-art/tn9-science-unit-5-magnetism.png", panel: 0 },
    // Unit 6 is light, so it intentionally keeps its dedicated reflection/refraction frame.
    // Unit 7 has its own per-section diagrams/text cards (unit7Frame).
    // Unit 8 has its own per-section diagrams/text cards (unit8Frame).
    // Unit 9 has its own per-section diagrams/text cards (unit9Frame).
    // Unit 10 has its own per-section diagrams/text cards (unit10Frame).
    // Unit 11 has its own per-section diagrams/text cards (unit11Frame).
    // Unit 12 has its own per-section diagrams/text cards (unit12Frame).
    // Unit 13 has its own per-section diagrams/text cards (unit13Frame).
    // Unit 14 has its own per-section diagrams/text cards (unit14Frame).
    // Unit 15 has its own per-section diagrams/text cards (unit15Frame).
    // Unit 16 has its own per-section diagrams/text cards (unit16Frame).
  };
  const selected = atlasByUnit[definition.number];
  if (!selected) return undefined;
  const atlas = selected.src;
  const panel = selected.panel;
  const splitUnit = definition.number >= 5;
  const focus = !splitUnit && definition.number <= 4
    ? { x: 0, y: panel * 33.34, w: 100, h: 33.34 }
    : undefined;
  const presets: Record<number, { label: string; at: [number, number]; tone: "gold" | "green" | "red" | "blue"; note: string }[]> = {
    2: [
      { label: "Path travelled", at: [26, 13], tone: "gold", note: "The full route is distance; the straight arrow is displacement." },
      { label: "Displacement", at: [52, 24], tone: "blue", note: "The direct change from start to finish has direction." },
      { label: "Speed", at: [57, 11], tone: "green", note: "The speedometer shows how fast the object is moving." },
      { label: "Graph", at: [86, 15], tone: "red", note: "A steeper distance-time line means greater speed." },
    ],
    3: [
      { label: "Depth pressure", at: [14, 48], tone: "gold", note: "The lower opening has more fluid above it and sends water farther." },
      { label: "Hydraulic force", at: [51, 46], tone: "blue", note: "Pressure applied to an enclosed liquid is transmitted through the liquid." },
      { label: "Buoyancy", at: [85, 51], tone: "green", note: "The upward fluid force helps the block float." },
    ],
    4: [
      { label: "Cell", at: [10, 82], tone: "gold", note: "The cell supplies energy to move charge around a closed circuit." },
      { label: "Closed path", at: [27, 91], tone: "blue", note: "Current flows only when the conducting path is complete." },
      { label: "Bulb and meter", at: [52, 82], tone: "green", note: "The load uses electrical energy and the meter measures current." },
      { label: "Electric field", at: [86, 83], tone: "red", note: "Opposite charges have an electric field between them." },
    ],
    5: [
      { label: "Field lines", at: [30, 24], tone: "blue", note: "The field is strongest where the lines are closest near the poles." },
      { label: "Electromagnet", at: [57, 48], tone: "gold", note: "Current through a coil creates a magnetic field that can lift clips." },
      { label: "Motor", at: [54, 86], tone: "green", note: "Electrical energy makes the coil rotate in a magnetic field." },
    ],
    6: [
      { label: "Particle vibration", at: [50, 15], tone: "gold", note: "Conduction passes energy as neighbouring particles vibrate." },
      { label: "Convection", at: [50, 48], tone: "blue", note: "Warm fluid rises and cool fluid sinks, carrying heat around." },
      { label: "Radiation", at: [51, 88], tone: "red", note: "The Sun transfers heat to Earth through electromagnetic radiation." },
    ],
    7: [
      { label: "Particle vibration", at: [50, 15], tone: "gold", note: "Conduction passes energy as neighbouring particles vibrate." },
      { label: "Convection", at: [50, 48], tone: "blue", note: "Warm fluid rises and cool fluid sinks, carrying heat around." },
      { label: "Radiation", at: [51, 88], tone: "red", note: "The Sun transfers heat to Earth through electromagnetic radiation." },
    ],
    8: [
      { label: "Vibration", at: [52, 15], tone: "gold", note: "Sound begins when an object vibrates the surrounding medium." },
      { label: "Amplitude", at: [28, 48], tone: "red", note: "A taller wave represents a larger amplitude and a louder sound." },
      { label: "Frequency", at: [61, 83], tone: "blue", note: "More cycles in the same time mean greater frequency and higher pitch." },
    ],
    9: [
      { label: "Orbit", at: [20, 26], tone: "blue", note: "Gravity keeps planets moving in their orbits around the Sun." },
      { label: "Moon phases", at: [16, 67], tone: "gold", note: "The Moon appears to change shape as its sunlit half is viewed from Earth." },
      { label: "Telescope", at: [70, 53], tone: "green", note: "A telescope collects more light so distant objects can be observed." },
    ],
    10: [
      { label: "Solid", at: [49, 20], tone: "blue", note: "Particles in a solid are closely packed and vibrate in fixed positions." },
      { label: "Liquid", at: [50, 52], tone: "green", note: "Liquid particles stay close but slide past one another." },
      { label: "Gas", at: [50, 84], tone: "red", note: "Gas particles are far apart and move freely in all directions." },
    ],
    11: [
      { label: "Nucleus", at: [55, 21], tone: "gold", note: "Almost all the atom's mass is concentrated in its tiny nucleus." },
      { label: "Electron shell", at: [64, 54], tone: "blue", note: "Electrons occupy regions of space around the nucleus." },
      { label: "Spectrum", at: [55, 86], tone: "green", note: "Light from excited atoms produces characteristic spectral lines." },
    ],
    12: [
      { label: "Periodic table", at: [36, 22], tone: "blue", note: "Elements are arranged by increasing atomic number and repeating properties." },
      { label: "Group", at: [63, 56], tone: "gold", note: "Elements in a group have similar outer-electron patterns." },
      { label: "Period", at: [36, 84], tone: "green", note: "A period shows the number of occupied electron shells." },
    ],
    13: [
      { label: "Electron transfer", at: [50, 21], tone: "gold", note: "Ionic bonding forms when electrons transfer and oppositely charged ions attract." },
      { label: "Shared pair", at: [50, 55], tone: "blue", note: "Covalent bonding forms when atoms share electrons." },
      { label: "Molecule", at: [86, 82], tone: "green", note: "A molecule is a stable group of atoms held together by shared electrons." },
    ],
    14: [
      { label: "Acid", at: [52, 20], tone: "red", note: "An acid changes blue litmus red and has a pH below 7." },
      { label: "Neutralisation", at: [52, 52], tone: "gold", note: "An acid and a base react to form salt and water." },
      { label: "Crystals", at: [52, 84], tone: "green", note: "Dissolved salt can be recovered as crystals when water evaporates." },
    ],
    15: [
      { label: "Carbon chain", at: [48, 22], tone: "blue", note: "Carbon atoms bond into chains and rings, creating many compounds." },
      { label: "Combustion", at: [54, 58], tone: "gold", note: "Carbon compounds burn in oxygen to release energy and form new substances." },
      { label: "Molecule", at: [51, 84], tone: "green", note: "The shape and bonding of a molecule help determine its properties." },
    ],
    16: [
      { label: "Micelle", at: [50, 24], tone: "blue", note: "Soap molecules surround grease so it can be carried away by water." },
      { label: "Fertiliser", at: [50, 58], tone: "green", note: "Fertilisers supply nutrients that support healthy plant growth." },
      { label: "Medicine", at: [52, 84], tone: "gold", note: "Chemistry helps formulate medicines and preserve useful products safely." },
    ],
  };
  return imageFrame(atlas, `${definition.title} · ${concept.title}`, `HD conceptual visual for ${concept.title}`, presets[definition.number] ?? [], focus);
}

/** Topic infographics: each textbook domain has its own visual language. */
/**
 * Unit 4's own diagrams, one per real textbook section - checked in ahead of
 * the shared atlas photo. Real user direction 2026-09-21: the one shared
 * circuit-scene photo (even cropped correctly) cannot honestly represent
 * seven different real sections of the book; a charge/field diagram and an
 * AC/DC diagram are not the same picture as a circuit.
 */
function unit4Frame(concept: ScienceConcept): BoardFrame | undefined {
  const blue = "#38bdf8", gold = "#f59e0b", green = "#34d399", red = "#f43f5e";
  switch (concept.id) {
    case "4.1": {
      // Two circles pushed apart (repel), two pulled together (attract),
      // and 8 field lines radiating from a point charge at evenly spaced
      // octagon points around (260,170), radius 45 - computed, not eyeballed.
      const svg = `
        <circle cx="70" cy="65" r="20" fill="${red}" stroke="white" stroke-width="2"/><text x="70" y="71" font-size="20" fill="white" text-anchor="middle">+</text>
        <circle cx="150" cy="65" r="20" fill="${red}" stroke="white" stroke-width="2"/><text x="150" y="71" font-size="20" fill="white" text-anchor="middle">+</text>
        <path d="M92 65h-14M128 65h14" stroke="${red}" stroke-width="4" marker-end="url(#u4arrow-red)"/>
        <circle cx="370" cy="65" r="20" fill="${red}" stroke="white" stroke-width="2"/><text x="370" y="71" font-size="20" fill="white" text-anchor="middle">+</text>
        <circle cx="450" cy="65" r="20" fill="${blue}" stroke="white" stroke-width="2"/><text x="450" y="71" font-size="20" fill="white" text-anchor="middle">−</text>
        <path d="M400 65h14M436 65h-14" stroke="${blue}" stroke-width="4" marker-end="url(#u4arrow-blue)"/>
        <circle cx="260" cy="170" r="18" fill="${gold}" stroke="white" stroke-width="2"/><text x="260" y="176" font-size="18" fill="white" text-anchor="middle">+</text>
        <path d="M260 170L260 125M260 170L292 138M260 170L305 170M260 170L292 202M260 170L260 215M260 170L228 202M260 170L215 170M260 170L228 138" stroke="${gold}" stroke-width="2.5"/>
        <marker id="u4arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${red}"/></marker>
        <marker id="u4arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${blue}"/></marker>
      `;
      return {
        diagram: {
          title: "Electric force and field · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Like charges repel", at: [110, 40], tone: "red", note: "Two positive charges push each other apart - like charges repel." },
            { label: "Unlike charges attract", at: [410, 40], tone: "blue", note: "A positive and a negative charge pull toward each other - unlike charges attract." },
            { label: "Field lines", at: [260, 235], tone: "gold", note: "The electric field is the region around a charge where another charge feels a force - shown by lines radiating outward from a positive charge." },
          ],
        },
      };
    }
    case "4.2": {
      // Same loop geometry as the 4.4 circuit, swapping the bulb for an
      // ammeter symbol - always closed, since this is about measuring
      // current, not the open/closed idea that belongs to 4.4.
      const svg = `
        <path d="M100 150V190H420V60H295" fill="none" stroke="${blue}" stroke-width="6"/>
        <path d="M100 100V60H225" fill="none" stroke="${blue}" stroke-width="6"/>
        <line x1="78" y1="112" x2="122" y2="112" stroke="white" stroke-width="7"/>
        <line x1="88" y1="138" x2="112" y2="138" stroke="white" stroke-width="4"/>
        <circle cx="260" cy="60" r="32" fill="#0b1329" stroke="white" stroke-width="4"/>
        <text x="260" y="70" font-size="26" font-weight="bold" fill="white" text-anchor="middle">A</text>
        <path d="M340 60l24-9v18z" fill="${gold}"/>
        <path d="M420 130l-9-24h18z" fill="${gold}"/>
      `;
      return {
        diagram: {
          title: "Measuring current · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Cell", at: [100, 125], tone: "gold", note: "The cell drives charge round the loop." },
            { label: "Ammeter (A)", at: [260, 60], tone: "blue", note: "An ammeter is always connected in series, in the main path, to measure the current flowing through it." },
            { label: "Conventional current", at: [420, 130], tone: "green", note: "Arrows show conventional current: the direction positive charge would flow, from the cell's positive terminal round to its negative terminal." },
          ],
        },
      };
    }
    case "4.3": {
      // Same loop again, this time with a zigzag resistor and a voltmeter
      // drawn in parallel across it (branching off, not in the main loop) -
      // the one connection rule this concept is actually testing.
      const svg = `
        <path d="M100 150V190H420V60H310" fill="none" stroke="${blue}" stroke-width="6"/>
        <path d="M100 100V60H210" fill="none" stroke="${blue}" stroke-width="6"/>
        <line x1="78" y1="112" x2="122" y2="112" stroke="white" stroke-width="7"/>
        <line x1="88" y1="138" x2="112" y2="138" stroke="white" stroke-width="4"/>
        <path d="M210 60l12 -16 16 32 16 -32 16 32 16 -32 16 32 12 -16" fill="none" stroke="${gold}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M225 60V30M295 60V30" stroke="${green}" stroke-width="3" stroke-dasharray="4 4"/>
        <circle cx="260" cy="18" r="20" fill="#0b1329" stroke="${green}" stroke-width="3"/>
        <text x="260" y="25" font-size="18" font-weight="bold" fill="${green}" text-anchor="middle">V</text>
      `;
      return {
        diagram: {
          title: "EMF, potential difference and resistance · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Cell (emf)", at: [100, 125], tone: "gold", note: "The emf is the work the cell does driving one coulomb all the way round the complete circuit." },
            { label: "Resistor", at: [260, 60], tone: "gold", note: "The resistor opposes current - the zigzag is its circuit symbol." },
            { label: "Voltmeter (V), in parallel", at: [260, 18], tone: "green", note: "A voltmeter connects in parallel, across the component, to measure the potential difference over just that part." },
          ],
        },
      };
    }
    case "4.4":
      return circuit43Frame(true);
    case "4.5": {
      // Three panels: heating (resistor + heat lines), chemical
      // (electrolysis cell), magnetic (wire + field loops) - x-bands
      // [30,180] [200,350] [370,510], each internally self-contained.
      const svg = `
        <path d="M60 190l14 -20 16 40 16 -40 16 40 16 -40 14 20" fill="none" stroke="${gold}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M75 130q10 -20 0 -35M100 130q10 -20 0 -35M125 130q10 -20 0 -35" stroke="${red}" stroke-width="3" fill="none"/>
        <text x="105" y="225" font-size="13" font-weight="bold" fill="white" text-anchor="middle">Heating</text>
        <path d="M225 100H305V190H225Z" fill="none" stroke="white" stroke-width="3"/>
        <rect x="235" y="70" width="8" height="120" fill="${blue}"/>
        <rect x="287" y="70" width="8" height="120" fill="${gold}"/>
        <path d="M291 70L291 40" stroke="white" stroke-width="2"/><path d="M239 70L239 40" stroke="white" stroke-width="2"/>
        <path d="M291 40h-52" stroke="white" stroke-width="2"/>
        <text x="265" y="225" font-size="13" font-weight="bold" fill="white" text-anchor="middle">Chemical</text>
        <line x1="440" y1="60" x2="440" y2="190" stroke="white" stroke-width="6"/>
        <ellipse cx="440" cy="125" rx="45" ry="16" fill="none" stroke="${blue}" stroke-width="3"/>
        <ellipse cx="440" cy="125" rx="70" ry="26" fill="none" stroke="${blue}" stroke-width="2" stroke-dasharray="6 5"/>
        <path d="M440 60l-9 16h18z" fill="${gold}"/>
        <text x="440" y="225" font-size="13" font-weight="bold" fill="white" text-anchor="middle">Magnetic</text>
      `;
      return {
        diagram: {
          title: "Three effects of current · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Heating effect", at: [105, 155], tone: "gold", note: "Current meeting resistance produces heat - Joule heating, the principle behind heaters and toasters." },
            { label: "Chemical effect", at: [265, 130], tone: "blue", note: "Current through an electrolyte causes a chemical change - electrolysis, used in electroplating." },
            { label: "Magnetic effect", at: [440, 125], tone: "green", note: "Every current-carrying wire creates a magnetic field around itself." },
          ],
        },
      };
    }
    case "4.6": {
      // Two waveforms sharing one time axis: dc flat, ac a real sine curve
      // built from four quarter-period cubic-bezier arcs (verified to
      // start/end on the axis and hit + / - the given amplitude at the
      // quarter points, not a freehand squiggle).
      const svg = `
        <line x1="40" y1="70" x2="240" y2="70" stroke="#475569" stroke-width="2"/>
        <line x1="40" y1="30" x2="40" y2="110" stroke="#475569" stroke-width="2"/>
        <path d="M50 70H230" stroke="${blue}" stroke-width="5" fill="none"/>
        <text x="140" y="145" font-size="14" font-weight="bold" fill="white" text-anchor="middle">DC - one direction</text>
        <line x1="290" y1="125" x2="490" y2="125" stroke="#475569" stroke-width="2"/>
        <line x1="290" y1="70" x2="290" y2="180" stroke="#475569" stroke-width="2"/>
        <path d="M300 125C325 75,345 75,340 125S355 175,390 125S415 75,440 125S465 175,480 125" stroke="${gold}" stroke-width="5" fill="none"/>
        <text x="390" y="205" font-size="14" font-weight="bold" fill="white" text-anchor="middle">AC - reverses periodically</text>
      `;
      return {
        diagram: {
          title: "AC and DC waveforms · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "DC", at: [140, 70], tone: "blue", note: "Direct current always flows the same way - a flat line above the axis, from cells, batteries and solar cells." },
            { label: "AC", at: [390, 125], tone: "gold", note: "Alternating current reverses direction periodically, tracing a wave - domestic supply in India is ac at 220 V, 50 Hz." },
          ],
        },
      };
    }
    case "4.7": {
      // A resistance comparison, computed to scale (dry ~1,00,000 ohm vs
      // wet a few hundred - the wet bar is drawn at a token minimum height,
      // not to true scale, since true scale would make it invisible; the
      // spoken note carries the real numbers).
      const svg = `
        <rect x="90" y="40" width="80" height="150" fill="${blue}" opacity="0.85"/>
        <rect x="290" y="178" width="80" height="12" fill="${red}"/>
        <line x1="40" y1="190" x2="480" y2="190" stroke="white" stroke-width="3"/>
        <text x="130" y="30" font-size="13" font-weight="bold" fill="${blue}" text-anchor="middle">Dry skin</text>
        <text x="330" y="170" font-size="13" font-weight="bold" fill="${red}" text-anchor="middle">Wet skin</text>
        <text x="130" y="215" font-size="12" fill="white" text-anchor="middle">~1,00,000 Ω</text>
        <text x="330" y="215" font-size="12" fill="white" text-anchor="middle">a few 100 Ω</text>
      `;
      return {
        diagram: {
          title: "Why water makes a shock worse · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Dry body: high resistance", at: [130, 40], tone: "blue", note: "Dry skin resists about 1,00,000 ohms, which limits how much current can flow." },
            { label: "Wet body: low resistance", at: [330, 178], tone: "red", note: "Moisture drops the body's resistance to only a few hundred ohms, so far more current can flow at the same voltage - this is why wet hands and electricity are dangerous." },
          ],
        },
      };
    }
    default:
      return undefined;
  }
}

/**
 * Unit 2's own diagrams for the sections that don't already have a real
 * photo - real user direction 2026-09-22: "everything has to be deeper in
 * line with textbook only." 2.2 deliberately returns undefined so its
 * existing real image (concept.frame) is used unchanged.
 */
function unit2Frame(concept: ScienceConcept): BoardFrame | undefined {
  const blue = "#38bdf8", gold = "#f59e0b", green = "#34d399", red = "#f43f5e";
  switch (concept.id) {
    case "2.1":
      return {
        text: {
          title: "Types and uniformity of motion · p14-15",
          cards: [
            { tag: "Types", title: "Linear, circular, oscillatory, random", desc: "Linear: a straight line. Circular: a circular path. Oscillatory: repetitive to-and-fro. Random: none of the above." },
            { tag: "Uniform", title: "Equal distances, equal times", desc: "A car covering 60 km every hour, for three hours in a row, is in uniform motion." },
            { tag: "Non-uniform", title: "Unequal distances, equal times", desc: "A bus covering only 100 m in 5 minutes of heavy traffic, then 2 km in the next 5 clear minutes, is non-uniform." },
          ],
        },
      };
    case "2.3":
      return {
        text: {
          title: "Speed, velocity and acceleration · p16-17",
          cards: [
            { tag: "Speed", title: "Speed = Distance ÷ Time", desc: "A scalar - how fast, with no direction. SI unit: m/s." },
            { tag: "Velocity", title: "Velocity = Displacement ÷ Time", desc: "A vector - speed with a direction. SI unit: m/s." },
            { tag: "Acceleration", title: "a = (v − u) ÷ t", desc: "The rate of change of velocity. Negative acceleration is called retardation or deceleration." },
          ],
        },
      };
    case "2.4": {
      // Both real graphs, computed to scale from the book's own tables -
      // distance-time (0-25 min, 0-2500 m) and velocity-time (0-30 s, 0-54
      // m/s), both perfectly linear, exactly as the book's data is.
      const svg = `
        <line x1="60" y1="210" x2="60" y2="40" stroke="#475569" stroke-width="2"/>
        <line x1="60" y1="210" x2="260" y2="210" stroke="#475569" stroke-width="2"/>
        <line x1="60" y1="210" x2="260" y2="40" stroke="${blue}" stroke-width="4"/>
        <circle cx="60" cy="210" r="5" fill="${gold}"/><circle cx="140" cy="142" r="5" fill="${gold}"/><circle cx="220" cy="74" r="5" fill="${gold}"/>
        <text x="160" y="228" font-size="12" fill="white" text-anchor="middle">Time (min)</text>
        <text x="160" y="30" font-size="13" font-weight="bold" fill="${blue}" text-anchor="middle">Distance-time (uniform)</text>
        <line x1="300" y1="210" x2="300" y2="40" stroke="#475569" stroke-width="2"/>
        <line x1="300" y1="210" x2="500" y2="210" stroke="#475569" stroke-width="2"/>
        <line x1="300" y1="210" x2="500" y2="40" stroke="${green}" stroke-width="4"/>
        <circle cx="300" cy="210" r="5" fill="${gold}"/><circle cx="400" cy="125" r="5" fill="${gold}"/><circle cx="500" cy="40" r="5" fill="${gold}"/>
        <text x="400" y="228" font-size="12" fill="white" text-anchor="middle">Time (s)</text>
        <text x="400" y="30" font-size="13" font-weight="bold" fill="${green}" text-anchor="middle">Velocity-time (accelerating)</text>
      `;
      return {
        diagram: {
          title: "Graphs of motion · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Straight line = uniform", at: [160, 125], tone: "blue", note: "Equal distances in equal times give a straight line: 0, 500, 1000, 1500, 2000, 2500 m every 5 minutes - a slope of 100 m/min." },
            { label: "Straight line = constant acceleration", at: [400, 125], tone: "green", note: "Velocity rising by equal amounts each second (0, 9, 18, 27... m/s) also gives a straight line - a constant acceleration of 1.8 m/s²." },
          ],
        },
      };
    }
    case "2.5":
      return {
        text: {
          title: "Equations of motion · p19-22",
          cards: [
            { tag: "Equation 1", title: "v = u + at", desc: "Final velocity = initial velocity + (acceleration × time)." },
            { tag: "Equation 2", title: "s = ut + ½at²", desc: "Distance = (initial velocity × time) + half × acceleration × time²." },
            { tag: "Equation 3", title: "v² = u² + 2as", desc: "Final velocity squared = initial velocity squared + (2 × acceleration × distance)." },
            { tag: "Free fall", title: "a is replaced by g", desc: "For a freely falling body, use g (about 10 m/s²) in place of a in all three equations." },
          ],
        },
      };
    case "2.6": {
      const svg = `
        <circle cx="260" cy="125" r="90" fill="none" stroke="#475569" stroke-width="3" stroke-dasharray="8 6"/>
        <circle cx="350" cy="125" r="9" fill="${gold}"/>
        <path d="M350 125L350 65" stroke="${blue}" stroke-width="5" marker-end="url(#u2v)"/>
        <path d="M350 125L285 125" stroke="${red}" stroke-width="5" marker-end="url(#u2f)"/>
        <text x="360" y="60" font-size="13" font-weight="bold" fill="${blue}">velocity (v)</text>
        <text x="230" y="150" font-size="13" font-weight="bold" fill="${red}">centripetal force</text>
        <marker id="u2v" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${blue}"/></marker>
        <marker id="u2f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${red}"/></marker>
      `;
      return {
        diagram: {
          title: "Centripetal force · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Velocity - tangent to the circle", at: [350, 90], tone: "blue", note: "At any instant, the object's velocity points along the circle's edge (tangent), not toward or away from the centre." },
            { label: "Centripetal force - toward the centre", at: [310, 125], tone: "red", note: "This force always points toward the centre of the circle - it is what keeps the object turning instead of flying off in a straight line. F = mv²/r." },
          ],
        },
      };
    }
    case "2.7": {
      const svg = `
        <circle cx="260" cy="125" r="90" fill="none" stroke="#475569" stroke-width="3" stroke-dasharray="8 6"/>
        <circle cx="350" cy="125" r="9" fill="${gold}"/>
        <path d="M350 125L415 125" stroke="${red}" stroke-width="5" marker-end="url(#u2cf)"/>
        <path d="M350 125L285 125" stroke="#64748b" stroke-width="3" stroke-dasharray="5 4" marker-end="url(#u2cp)"/>
        <text x="360" y="150" font-size="13" font-weight="bold" fill="${red}">centrifugal force (felt)</text>
        <text x="180" y="150" font-size="12" fill="#94a3b8">centripetal (for comparison)</text>
        <marker id="u2cf" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${red}"/></marker>
        <marker id="u2cp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#64748b"/></marker>
      `;
      return {
        diagram: {
          title: "Centrifugal force · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Centrifugal force - away from the centre", at: [370, 125], tone: "red", note: "Felt pulling outward, away from the centre - the same size as the centripetal force, but in the opposite direction. This is what a washing machine drum uses to fling water out." },
            { label: "Centripetal, for comparison", at: [310, 125], tone: "blue", note: "The real force that keeps the object turning points the other way, toward the centre." },
          ],
        },
      };
    }
    default:
      return undefined;
  }
}

/** Unit 3's two genuinely new sections - 3.2, 3.4 and 3.5 keep their
 * existing real image/text; only Pascal's law and flotation need a new
 * diagram since nothing already covers them. */
function unit3Frame(concept: ScienceConcept): BoardFrame | undefined {
  const blue = "#38bdf8", gold = "#f59e0b", green = "#34d399", red = "#f43f5e";
  switch (concept.id) {
    case "3.3": {
      const svg = `
        <rect x="60" y="185" width="400" height="18" fill="none" stroke="${blue}" stroke-width="3"/>
        <rect x="95" y="120" width="50" height="65" fill="none" stroke="${blue}" stroke-width="3"/>
        <rect x="100" y="90" width="40" height="30" fill="${gold}"/>
        <path d="M120 88V50" stroke="${red}" stroke-width="5" marker-end="url(#u3f1)"/>
        <rect x="330" y="90" width="110" height="95" fill="none" stroke="${blue}" stroke-width="3"/>
        <rect x="335" y="55" width="100" height="35" fill="${green}"/>
        <path d="M385 53V18" stroke="${red}" stroke-width="5" marker-end="url(#u3f2)"/>
        <text x="120" y="40" font-size="12" font-weight="bold" fill="${red}" text-anchor="middle">small F in</text>
        <text x="385" y="12" font-size="12" font-weight="bold" fill="${red}" text-anchor="middle">large F out</text>
        <marker id="u3f1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${red}"/></marker>
        <marker id="u3f2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${red}"/></marker>
      `;
      return {
        diagram: {
          title: "Hydraulic press · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Small piston (small area)", at: [120, 90], tone: "blue", note: "A small force pushes down on this narrow piston, creating pressure in the liquid below." },
            { label: "Large piston (large area)", at: [385, 55], tone: "green", note: "Pascal's law means the same pressure acts here too - but because this piston's area is much bigger, it produces a much bigger force. F2 = F1 × (A/a)." },
          ],
        },
      };
    }
    case "3.6": {
      const svg = `
        <line x1="40" y1="140" x2="480" y2="140" stroke="${blue}" stroke-width="3"/>
        <path d="M180 90L340 90L370 140L150 140Z" fill="${gold}" fill-opacity="0.85" stroke="white" stroke-width="2"/>
        <circle cx="260" cy="108" r="6" fill="white"/><text x="260" y="100" font-size="12" font-weight="bold" fill="white" text-anchor="middle">G</text>
        <circle cx="260" cy="128" r="6" fill="${red}"/><text x="260" y="150" font-size="12" font-weight="bold" fill="${red}" text-anchor="middle">B</text>
        <line x1="260" y1="80" x2="260" y2="170" stroke="white" stroke-width="1.5" stroke-dasharray="4 4"/>
        <path d="M260 108V60" stroke="${red}" stroke-width="5" marker-end="url(#u3w)"/>
        <path d="M260 128V176" stroke="${green}" stroke-width="5" marker-end="url(#u3b)"/>
        <text x="285" y="60" font-size="12" font-weight="bold" fill="${red}">Weight (down)</text>
        <text x="285" y="190" font-size="12" font-weight="bold" fill="${green}">Buoyant force (up)</text>
        <marker id="u3w" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 10L10 5L0 0z" fill="${red}"/></marker>
        <marker id="u3b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${green}"/></marker>
      `;
      return {
        diagram: {
          title: "Laws of flotation · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Centre of gravity (G)", at: [260, 100], tone: "gold", note: "The point where the boat's whole weight acts, pulling straight down." },
            { label: "Centre of buoyancy (B)", at: [260, 150], tone: "red", note: "The point where the upthrust acts, pushing straight up. For a floating body at rest, G and B sit on the same vertical line." },
            { label: "Weight equals upthrust", at: [370, 125], tone: "green", note: "A floating body's weight always equals the weight of the fluid it displaces - that balance is what keeps it floating, neither sinking nor rising." },
          ],
        },
      };
    }
    default:
      return undefined;
  }
}

/**
 * Unit 6's own diagram for 6.1 only - computed exactly (angle of incidence
 * and angle of reflection both 40deg from the normal: O=(260,150), points
 * at (260 ± 100*sin40, 150-100*cos40) = (195.7 or 324.3, 73.4), verified
 * equal offsets both sides), replacing the old shared per-unit fallback
 * whose two rays were not actually drawn at equal angles. 6.2-6.7 are real
 * mirror/refraction formulas with the book's own numbers, safer as text
 * cards than a hand-drawn ray diagram risking subtly wrong geometry.
 */
function unit6Frame(concept: ScienceConcept): BoardFrame | undefined {
  const blue = "#38bdf8", gold = "#f59e0b", green = "#34d399";
  switch (concept.id) {
    case "6.1": {
      const svg = `
        <line x1="100" y1="150" x2="420" y2="150" stroke="white" stroke-width="4"/>
        <line x1="260" y1="150" x2="260" y2="50" stroke="${blue}" stroke-width="3" stroke-dasharray="7 6"/>
        <line x1="195.7" y1="73.4" x2="260" y2="150" stroke="${gold}" stroke-width="5"/>
        <line x1="260" y1="150" x2="324.3" y2="73.4" stroke="${green}" stroke-width="5"/>
        <path d="M225 132a40 40 0 0 1 15 -12" fill="none" stroke="white" stroke-width="2"/>
        <path d="M280 120a40 40 0 0 1 15 12" fill="none" stroke="white" stroke-width="2"/>
        <text x="205" y="118" font-size="13" fill="white">i</text>
        <text x="308" y="118" font-size="13" fill="white">r</text>
      `;
      return {
        diagram: {
          title: "Laws of reflection · tap a labelled part",
          viewBox: "0 0 520 250",
          svg,
          parts: [
            { label: "Incident ray", at: [195.7, 73.4], tone: "gold", note: "The ray of light arriving at the mirror." },
            { label: "Normal", at: [260, 60], tone: "blue", note: "An imaginary line at right angles to the mirror, at the point of reflection - both angles are measured from this line, not from the mirror's surface." },
            { label: "Reflected ray", at: [324.3, 73.4], tone: "green", note: "The angle of reflection (r) always equals the angle of incidence (i) - here, both are 40 degrees from the normal." },
          ],
        },
      };
    }
    case "6.2":
      return {
        text: {
          title: "Curved mirrors and ray rules · p68-69",
          cards: [
            { tag: "Concave", title: "Curves inward", desc: "The reflecting surface faces toward the centre of the sphere it is part of." },
            { tag: "Convex", title: "Curves outward", desc: "The reflecting surface faces away from the centre of the sphere." },
            { tag: "Ray rule 1", title: "Parallel to axis → through the focus", desc: "A ray travelling parallel to the principal axis reflects through the principal focus." },
            { tag: "Ray rule 2", title: "Through the focus → parallel to axis", desc: "A ray travelling through the focus reflects parallel to the principal axis - the reverse of rule 1." },
          ],
        },
      };
    case "6.3":
      return {
        text: {
          title: "Concave mirror · the mirror equation, p71-72",
          cards: [
            { tag: "Mirror equation", title: "1/v + 1/u = 1/f", desc: "Links image distance (v), object distance (u) and focal length (f)." },
            { tag: "Magnification", title: "m = −v/u = hi/ho", desc: "Negative m means a real, inverted image; positive m means a virtual, upright image." },
            { tag: "Worked example", title: "u = −15 cm, f = −10 cm", desc: "1/v = 1/f − 1/u = 1/(−10) − 1/(−15) = −1/30, so v = −30 cm: a real image, 30 cm in front of the mirror." },
          ],
        },
      };
    case "6.4":
      return {
        text: {
          title: "Convex mirror · always virtual and small, p72-73",
          cards: [
            { tag: "Always", title: "Virtual, upright, diminished", desc: "A convex mirror always forms a smaller, upright image that appears behind the mirror - unlike a concave mirror, whose image type depends on distance." },
            { tag: "Real use", title: "'Objects are closer than they appear'", desc: "A car's convex side mirror shows a wide field of view, but makes everything look smaller and farther away than it really is." },
            { tag: "Worked example", title: "f = 20 cm, object 600 cm away", desc: "The image forms only about 19.35 cm behind the mirror - a huge distance (600 cm) compressed into a small image distance." },
          ],
        },
      };
    case "6.5":
      return {
        text: {
          title: "Speed of light · p73",
          cards: [
            { tag: "First estimate", title: "Ole Roemer, 1676", desc: "Timed the eclipses of one of Jupiter's moons from different points in Earth's orbit, and estimated light's speed at about 220,000 km per second." },
            { tag: "Why it's hard to measure", title: "Light travels extremely fast", desc: "Over everyday distances, light arrives almost instantly - Roemer needed astronomical distances to even detect a delay." },
          ],
        },
      };
    case "6.6":
      return {
        text: {
          title: "Refraction and Snell's law · p74",
          cards: [
            { tag: "Rarer → denser", title: "Bends toward the normal", desc: "Light entering an optically denser medium (like glass or water) slows down and bends toward the normal line." },
            { tag: "Denser → rarer", title: "Bends away from the normal", desc: "Light leaving a denser medium for a rarer one speeds up and bends away from the normal." },
            { tag: "Snell's law", title: "sin(i) / sin(r) = constant", desc: "This constant is called the refractive index of the second medium relative to the first." },
          ],
        },
      };
    case "6.7":
      return {
        text: {
          title: "Total internal reflection · p75",
          cards: [
            { tag: "Critical angle", title: "The angle where r = 90°", desc: "As the angle of incidence in a denser medium increases, so does the angle of refraction - until it reaches 90°, grazing the surface." },
            { tag: "Beyond it", title: "Total internal reflection", desc: "If the angle of incidence exceeds the critical angle, no refracted ray is possible - all the light reflects back into the denser medium." },
            { tag: "Two conditions", title: "Denser → rarer, and past the critical angle", desc: "Both conditions are needed together: light must be leaving a denser medium, AND its angle of incidence must exceed the critical angle." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit7Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b", blue = "#38bdf8", green = "#34d399", red = "#f87171";
  switch (concept.id) {
    case "7.1":
      return {
        text: {
          title: "Effects of heat · p80",
          cards: [
            { tag: "Expansion", title: "Substances expand when heated", desc: "Greatest in gases, less in liquids, least in solids - railway tracks are given gaps so summer heat has room to expand them." },
            { tag: "Change of state", title: "Solid → liquid → gas", desc: "Ice heated becomes water; water heated further becomes vapour. Removing heat reverses the process." },
            { tag: "Change in temperature", title: "More heat, faster particles", desc: "Added heat energy speeds up a substance's particles, which we feel as a rise in temperature." },
          ],
        },
      };
    case "7.2": {
      const svg = `
        <rect x="60" y="132" width="360" height="36" rx="6" fill="#64748b"/>
        <circle cx="55" cy="150" r="26" fill="${red}"/>
        <path d="M55 118c-6 10 6 12 0 22M42 122c-5 9 5 11 0 20" stroke="${gold}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="420" cy="150" r="10" fill="${blue}"/>
        <text x="45" y="200" font-size="13" fill="white">hot end</text>
        <text x="395" y="200" font-size="13" fill="white">cool end</text>
      `;
      return {
        diagram: {
          title: "Conduction · watch heat travel along the rod",
          viewBox: "0 0 480 220",
          svg,
          motionPath: { d: "M80,150 L420,150", label: "Heat energy passed molecule to molecule" },
          parts: [
            { label: "Hot end", at: [55, 150], tone: "red", note: "Molecules here vibrate fastest and collide with their neighbours, passing energy along." },
            { label: "Cool end", at: [420, 150], tone: "blue", note: "The far end heats up last - the molecules there receive energy only after every molecule in between has passed it on." },
          ],
        },
      };
    }
    case "7.3":
      return {
        text: {
          title: "Convection · p82-83",
          cards: [
            { tag: "Definition", title: "Heat carried by the fluid's own movement", desc: "Unlike conduction, the heated liquid or gas itself moves - warm fluid rises (it is less dense), cooler fluid sinks to replace it." },
            { tag: "Sea breeze", title: "Day: sea breeze blows in from the sea", desc: "Land heats faster than sea in daytime; hot air over land rises, and cooler sea air flows in to replace it." },
            { tag: "Land breeze", title: "Night: land breeze blows out to sea", desc: "At night the sea stays warmer than the land; air over the sea rises, and cooler land air flows out to replace it." },
          ],
        },
      };
    case "7.4":
      return {
        text: {
          title: "Radiation · p83",
          cards: [
            { tag: "No medium needed", title: "Travels as electromagnetic waves", desc: "Radiation is the only one of the three heat-transfer methods that works through a vacuum - it is how the Sun's heat crosses empty space to reach Earth." },
            { tag: "Absorbing", title: "Dark, dull surfaces absorb radiation well", desc: "A cooking pot's base is blackened so it absorbs heat quickly from the flame beneath it." },
            { tag: "Reflecting", title: "Light, polished surfaces reflect radiation well", desc: "An aeroplane's skin is kept highly polished to reflect away the Sun's heat instead of absorbing it." },
          ],
        },
      };
    case "7.5":
      return {
        text: {
          title: "Temperature scales · p83-84",
          cards: [
            { tag: "Three scales", title: "Fahrenheit, Celsius, Kelvin", desc: "Fahrenheit: water freezes at 32°F, boils at 212°F. Celsius: 0°C to 100°C. Kelvin (absolute): 0 K is absolute zero, the coldest possible temperature." },
            { tag: "Formulas", title: "°F = °C × 1.8 + 32, K = °C + 273.15", desc: "The two conversions you need most often, both starting from a Celsius reading." },
            { tag: "Worked example", title: "25°C → 298.15 K, 200 K → -73.15°C", desc: "TK = 25 + 273.15 = 298.15 K. Going the other way: T°C = 200 - 273.15 = -73.15°C." },
          ],
        },
      };
    case "7.6":
      return {
        text: {
          title: "Specific heat capacity · p84-85",
          cards: [
            { tag: "Formula", title: "Q = m × C × ΔT", desc: "Heat absorbed depends on mass (m), the substance's specific heat capacity (C), and the temperature change (ΔT)." },
            { tag: "Water is special", title: "C = 4200 J/kg·K - unusually high", desc: "Water heats up and cools down slowly compared to most substances, which is why it is used as a coolant in car radiators and factory machinery." },
            { tag: "Worked example", title: "2 kg of water, 10°C → 50°C", desc: "Q = mCΔT = 2 × 4200 × 40 = 3,36,000 J, since ΔT = 50 - 10 = 40°C." },
          ],
        },
      };
    case "7.7":
      return {
        text: {
          title: "Heat capacity (thermal capacity) · p85-86",
          cards: [
            { tag: "Formula", title: "C' = Q / ΔT", desc: "Heat capacity is the energy needed to raise an entire body's temperature by 1°C - not per kilogram, unlike specific heat capacity." },
            { tag: "Worked example", title: "5000 J raises an iron ball by 20 K", desc: "Heat capacity = Q/ΔT = 5000/20 = 250 J/K." },
            { tag: "SI unit", title: "J/K", desc: "Also sometimes written as J/°C, cal/°C or kcal/°C." },
          ],
        },
      };
    case "7.8": {
      const svg = `
        <rect x="45" y="70" width="110" height="90" rx="10" fill="#123d59" stroke="${blue}" stroke-width="3"/>
        <rect x="195" y="70" width="110" height="90" rx="10" fill="#30205c" stroke="${green}" stroke-width="3"/>
        <rect x="345" y="70" width="110" height="90" rx="10" fill="#123d3a" stroke="${gold}" stroke-width="3"/>
        <text x="72" y="120" font-size="16" fill="white">Solid</text>
        <text x="222" y="120" font-size="16" fill="white">Liquid</text>
        <text x="378" y="120" font-size="16" fill="white">Gas</text>
        <path d="M158 92h35" stroke="${gold}" stroke-width="3" marker-end="url(#arrow7)"/>
        <path d="M193 140h-35" stroke="${blue}" stroke-width="3" marker-end="url(#arrow7)"/>
        <path d="M308 92h35" stroke="${gold}" stroke-width="3" marker-end="url(#arrow7)"/>
        <path d="M343 140h-35" stroke="${blue}" stroke-width="3" marker-end="url(#arrow7)"/>
        <text x="158" y="85" font-size="11" fill="${gold}">melting</text>
        <text x="158" y="158" font-size="11" fill="${blue}">freezing</text>
        <text x="308" y="85" font-size="11" fill="${gold}">boiling</text>
        <text x="300" y="158" font-size="11" fill="${blue}">condensing</text>
        <defs><marker id="arrow7" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="${gold}"/></marker></defs>
      `;
      return {
        diagram: {
          title: "Change of state · tap a labelled part",
          viewBox: "0 0 500 200",
          svg,
          parts: [
            { label: "Melting / freezing", at: [175, 70], tone: "gold", note: "Absorbing heat melts a solid to liquid at its melting point; releasing that same heat freezes it back." },
            { label: "Boiling / condensation", at: [325, 70], tone: "gold", note: "Absorbing heat boils a liquid to gas at its boiling point; releasing that same heat condenses it back." },
            { label: "Sublimation", at: [100, 190], tone: "green", note: "Some solids (dry ice, iodine, naphthalene) skip the liquid stage entirely and pass straight from solid to gas." },
          ],
        },
      };
    }
    case "7.9":
      return {
        text: {
          title: "Latent heat · p86-87",
          cards: [
            { tag: "The key idea", title: "Heat absorbed with NO temperature change", desc: "While ice melts or water boils, the temperature holds steady - every joule of heat goes into changing state, not raising the thermometer." },
            { tag: "Specific latent heat", title: "L = Q / m, unit J/kg", desc: "The heat absorbed or released per unit mass during a change of state at constant temperature." },
            { tag: "Worked example", title: "Melting 5 kg of ice (L = 336 J/g)", desc: "Heat energy = m × L = 5000 g × 336 J/g = 1,680,000 J." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit8Frame(concept: ScienceConcept): BoardFrame | undefined {
  const blue = "#38bdf8", gold = "#f59e0b", green = "#34d399", red = "#f87171";
  switch (concept.id) {
    case "8.1":
      return {
        text: {
          title: "Production of sound and the need for a medium · p91-92",
          cards: [
            { tag: "Production", title: "Vibrations make sound", desc: "Striking a tuning fork makes it vibrate; those vibrations disturb the nearby air molecules and that disturbance is what we hear as sound." },
            { tag: "Bell-Jar experiment", title: "No air, no sound", desc: "A ringing bell sits inside a sealed jar connected to a vacuum pump. As air is pumped out, the sound gets fainter and fainter, and vanishes completely once the jar is fully evacuated." },
            { tag: "Conclusion", title: "Sound cannot travel through vacuum", desc: "Sound needs a material medium - solid, liquid or gas - to travel through. Space is a vacuum, which is why explosions in space movies would actually be silent." },
          ],
        },
      };
    case "8.2": {
      const clusters = [70, 150, 230, 310, 390];
      const lines = clusters.flatMap((cx) => [cx - 7, cx, cx + 7]).map((x) => `<line x1="${x}" y1="50" x2="${x}" y2="150" stroke="${blue}" stroke-width="4"/>`).join("");
      const cLabels = clusters.map((cx) => `<text x="${cx - 4}" y="175" font-size="13" fill="${gold}">C</text>`).join("");
      const rLabels = [110, 190, 270, 350].map((x) => `<text x="${x - 4}" y="175" font-size="13" fill="${green}">R</text>`).join("");
      return {
        diagram: {
          title: "Longitudinal sound wave · compressions and rarefactions",
          viewBox: "0 0 460 190",
          svg: `${lines}${cLabels}${rLabels}`,
          parts: [
            { label: "Compression (C)", at: [70, 50], tone: "gold", note: "Particles are crowded close together here - a region of higher pressure." },
            { label: "Rarefaction (R)", at: [110, 50], tone: "green", note: "Particles are spread further apart here - a region of lower pressure. Compressions and rarefactions alternate as the wave travels." },
          ],
        },
      };
    }
    case "8.3": {
      const svg = `
        <line x1="20" y1="110" x2="400" y2="110" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>
        <path d="M30 110 C60 40, 100 40, 130 110 C160 180, 200 180, 230 110 C260 40, 300 40, 330 110" fill="none" stroke="${blue}" stroke-width="5"/>
        <line x1="80" y1="110" x2="80" y2="40" stroke="${gold}" stroke-width="3"/>
        <line x1="30" y1="130" x2="230" y2="130" stroke="${green}" stroke-width="3"/>
      `;
      return {
        diagram: {
          title: "Characteristics of a sound wave",
          viewBox: "0 0 400 200",
          svg,
          motionPath: { d: "M20,110 L380,110", label: "The wave pattern travels this way" },
          parts: [
            { label: "Amplitude", at: [80, 40], tone: "gold", note: "The maximum displacement from the resting position - a bigger amplitude means a louder sound." },
            { label: "Wavelength", at: [130, 130], tone: "green", note: "The distance over which the wave pattern repeats itself - here, from one crest to the next." },
          ],
        },
      };
    }
    case "8.4":
      return {
        text: {
          title: "Loudness, pitch and timbre · p93-94",
          cards: [
            { tag: "Loudness", title: "Set by amplitude", desc: "A bigger amplitude vibration makes a louder sound. Loudness is measured in decibels (dB)." },
            { tag: "Pitch", title: "Set by frequency", desc: "A higher frequency makes a higher, shriller pitch; a lower frequency makes a flatter, deeper pitch." },
            { tag: "Timbre (quality)", title: "Tells two instruments apart", desc: "Two instruments playing the same note at the same loudness still sound different - that difference is timbre." },
          ],
        },
      };
    case "8.5":
      return {
        text: {
          title: "Speed of sound · p94-96",
          cards: [
            { tag: "Formula", title: "v = n λ", desc: "Speed equals frequency times wavelength." },
            { tag: "Medium matters", title: "Fastest in solids, slowest in gases", desc: "Sound travels about 5 times faster in water than in air, and even faster through solids like steel." },
            { tag: "Worked example", title: "n = 425 Hz, λ = 0.8 m", desc: "v = nλ = 425 × 0.8 = 340 m/s - matching air's real speed of sound near room temperature." },
          ],
        },
      };
    case "8.6":
      return {
        text: {
          title: "Reflection of sound · p96",
          cards: [
            { tag: "Law of reflection", title: "Angle of incidence = angle of reflection", desc: "Just like light, sound obeys this rule when it bounces off a surface." },
            { tag: "Megaphones and horns", title: "Repeated reflection focuses sound", desc: "A cone-shaped tube reflects sound successively off its walls, directing most of the sound energy forward instead of letting it spread out." },
            { tag: "Stethoscope", title: "Multiple reflections carry body sounds", desc: "Sounds from inside the body reach the doctor's ears through repeated reflections inside the connecting tube." },
          ],
        },
      };
    case "8.7": {
      const svg = `
        <circle cx="55" cy="110" r="16" fill="${gold}"/>
        <rect x="405" y="40" width="35" height="140" fill="#475569"/>
        <text x="35" y="150" font-size="13" fill="white">source</text>
        <text x="385" y="30" font-size="13" fill="white">wall</text>
      `;
      return {
        diagram: {
          title: "Echo · sound's round trip to the wall and back",
          viewBox: "0 0 460 200",
          svg,
          motionPath: { d: "M55,110 L400,110 L55,110", label: "Out and back - the round trip must take at least 0.1 s to hear a distinct echo" },
          parts: [
            { label: "Source", at: [55, 110], tone: "gold", note: "Where the sound starts - a shout or a clap." },
            { label: "Reflecting surface", at: [420, 60], tone: "blue", note: "The sound bounces straight back from here, retracing its path to the listener's ear." },
          ],
        },
      };
    }
    case "8.8":
      return {
        text: {
          title: "Reverberation · p97",
          cards: [
            { tag: "Definition", title: "Sound persisting from repeated reflection", desc: "In a large hall, sound keeps bouncing off the walls, ceiling and floor until it fades below audibility - that persistence is reverberation." },
            { tag: "The problem", title: "Too much reverberation blurs speech", desc: "Excessive reverberation in an auditorium makes speech and music sound muddled and unclear." },
            { tag: "The fix", title: "Sound-absorbing materials", desc: "Fibreboard, thick curtains, rough plaster and carpeted, padded seats absorb sound instead of reflecting it, controlling reverberation." },
          ],
        },
      };
    case "8.9":
      return {
        text: {
          title: "Ultrasonic sound · p97-98",
          cards: [
            { tag: "Definition", title: "Frequency above 20,000 Hz", desc: "Too high for human ears, but audible to some animals - dogs, bats, dolphins and whales." },
            { tag: "Echolocation", title: "Bats and dolphins navigate by echo", desc: "They emit ultrasonic clicks and listen for the echoes to locate prey and find their way, even in total darkness or murky water." },
            { tag: "Human uses", title: "Cleaning, crack detection, medical imaging", desc: "Ultrasound cleans objects in a liquid bath, finds cracks in metal blocks, images the heart (echocardiography), and can break kidney stones into fine grains." },
          ],
        },
      };
    case "8.10":
      return {
        text: {
          title: "SONAR · p98",
          cards: [
            { tag: "What it stands for", title: "SOund Navigation And Ranging", desc: "A transmitter sends ultrasonic waves; they reflect off the seabed or an object and return to a detector on the same boat." },
            { tag: "Formula", title: "2d = v × t", desc: "The depth d is found from the speed of sound in water and the round-trip time t." },
            { tag: "Worked example", title: "t = 4 s, v = 1500 m/s", desc: "2d = 1500 × 4 = 6000 m, so d = 3000 m (3 km) deep." },
          ],
        },
      };
    case "8.11":
      return {
        text: {
          title: "How the human ear hears · p98-99",
          cards: [
            { tag: "Outer ear", title: "Pinna collects sound", desc: "Sound travels down the auditory canal to the eardrum (tympanic membrane), which vibrates as compressions and rarefactions reach it." },
            { tag: "Middle ear", title: "Three tiny bones amplify it", desc: "The hammer, anvil and stirrup amplify the eardrum's vibrations before passing them to the inner ear." },
            { tag: "Inner ear", title: "The cochlea converts it to electrical signals", desc: "These signals travel to the brain via the auditory nerve, where they are interpreted as sound." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit9Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b", blue = "#38bdf8", green = "#34d399", pink = "#f472b6";
  switch (concept.id) {
    case "9.1":
      return {
        text: {
          title: "The universe and the Big Bang · p102-103",
          cards: [
            { tag: "Scale", title: "Observable universe: ~93 billion light years across", desc: "1 light year = the distance light travels in one year, about 9.46 × 10¹² km. The universe is expanding, and the expansion itself is speeding up." },
            { tag: "What it's made of", title: "Atoms are only ~4% of the universe", desc: "The rest is dark matter and dark energy - things scientists know exist from their effects, but cannot directly see." },
            { tag: "The Big Bang", title: "~13.7 billion years ago", desc: "All matter was concentrated in a single point of hot, dense matter, which exploded outward - the hydrogen and helium formed then are still the most common elements in the universe today." },
          ],
        },
      };
    case "9.2":
      return {
        text: {
          title: "Galaxies and stars · p103-104",
          cards: [
            { tag: "Galaxy shapes", title: "Spiral, elliptical or irregular", desc: "Our Milky Way is spiral-shaped, about 100,000 light years across, holding roughly 100 billion stars. Andromeda is our closest neighbouring galaxy." },
            { tag: "Star colour = temperature", title: "Hot stars are white/blue, cool stars orange/red", desc: "A star's colour is a direct clue to how hot it burns." },
            { tag: "Constellations", title: "Recognisable star patterns", desc: "88 constellations are formally recognised - Orion, Leo and Scorpius among them - each a pattern people once read as an animal, person or object." },
          ],
        },
      };
    case "9.3":
      return {
        text: {
          title: "The Sun · p104-105",
          cards: [
            { tag: "Composition", title: "~75% hydrogen, ~25% helium", desc: "A medium-sized star, over a million times bigger than Earth, more than 4.6 billion years old." },
            { tag: "Nuclear fusion", title: "Hydrogen fuses into helium", desc: "Under enormous pressure, hydrogen atoms combine to form helium, releasing the light and heat that makes the Sun shine." },
            { tag: "Its role", title: "Anchors the whole solar system", desc: "The Sun's strong gravity is what keeps planets, asteroids, comets and other debris orbiting around it." },
          ],
        },
      };
    case "9.4": {
      const inner = [110, 140, 170, 200];
      const outer = [280, 340, 400, 460];
      const innerDots = inner.map((x, i) => `<circle cx="${x}" cy="110" r="${5 + i}" fill="${blue}"/>`).join("");
      const outerDots = outer.map((x, i) => `<circle cx="${x}" cy="110" r="${9 + i * 1.5}" fill="${pink}"/>`).join("");
      return {
        diagram: {
          title: "Inner (rocky) vs outer (gas giant) planets",
          viewBox: "0 0 500 200",
          svg: `<circle cx="55" cy="110" r="22" fill="${gold}"/>${innerDots}${outerDots}`,
          parts: [
            { label: "Sun", at: [55, 110], tone: "gold", note: "The centre of the solar system." },
            { label: "Inner (rocky) planets", at: [155, 150], tone: "blue", note: "Mercury, Venus, Earth, Mars - close together, close to the Sun, solid rocky surfaces." },
            { label: "Outer (gas giant) planets", at: [370, 150], tone: "red", note: "Jupiter, Saturn, Uranus, Neptune - spread far apart, made mostly of hydrogen and helium gas, and the only ones with rings." },
          ],
        },
      };
    }
    case "9.5":
      return {
        text: {
          title: "Other bodies of the solar system · p106-107",
          cards: [
            { tag: "Asteroids", title: "Rocky leftovers, mostly between Mars and Jupiter", desc: "The biggest, Ceres, is about 946 km across." },
            { tag: "Comets", title: "Dust and ice, highly elliptical orbits", desc: "Grow a glowing head and tail near the Sun. Halley's Comet returns roughly every 76 years - last seen 1986, next due 2062." },
            { tag: "Meteors vs meteorites", title: "Burns up vs. reaches the ground", desc: "A meteor burns up completely from friction in Earth's atmosphere. A meteorite is one that survives and actually lands." },
            { tag: "Satellites", title: "Any body orbiting a planet", desc: "Natural satellites (moons) like Earth's Moon, or artificial satellites launched by people - held in orbit by gravity and centripetal force." },
          ],
        },
      };
    case "9.6": {
      const svg = `
        <circle cx="250" cy="150" r="26" fill="${blue}"/>
        <circle cx="250" cy="150" r="100" fill="none" stroke="white" stroke-width="2" stroke-dasharray="6 6"/>
        <circle cx="250" cy="50" r="9" fill="${gold}"/>
        <line x1="250" y1="50" x2="320" y2="50" stroke="${green}" stroke-width="5" marker-end="url(#arrow9)"/>
        <line x1="250" y1="50" x2="250" y2="110" stroke="${pink}" stroke-width="4" marker-end="url(#arrow9)"/>
        <defs><marker id="arrow9" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="white"/></marker></defs>
      `;
      return {
        diagram: {
          title: "Orbital velocity · velocity is always tangent to the orbit",
          viewBox: "0 0 460 220",
          svg,
          parts: [
            { label: "Satellite", at: [250, 50], tone: "gold", note: "Moving along its circular orbit around Earth." },
            { label: "Orbital velocity", at: [320, 50], tone: "green", note: "Points sideways, tangent to the circular path - this is the speed needed to keep the satellite in orbit rather than falling or flying away." },
            { label: "Centripetal force (gravity)", at: [250, 90], tone: "red", note: "Points straight down toward Earth's centre, always at right angles to the velocity - this is what continuously bends the satellite's path into a circle." },
          ],
        },
      };
    }
    case "9.7":
      return {
        text: {
          title: "Time period of a satellite · p108",
          cards: [
            { tag: "Formula", title: "T = 2π(R + h) / v", desc: "Distance travelled in one orbit (the circle's circumference) divided by orbital velocity." },
            { tag: "Worked example", title: "At 500 km altitude, T ≈ 5667 s ≈ 95 min", desc: "A satellite this close to Earth completes an orbit in under two hours." },
            { tag: "Geostationary", title: "T = 24 hours matches Earth's own rotation", desc: "A satellite with exactly a 24-hour period appears fixed over the same spot on the ground, because Earth rotates at the same rate beneath it." },
          ],
        },
      };
    case "9.8": {
      const cx = 250, cy = 120, a = 180, b = 90;
      const c = Math.sqrt(a * a - b * b);
      const sunX = cx - c;
      const periX = cx - a;
      const apheX = cx + a;
      const svg = `
        <ellipse cx="${cx}" cy="${cy}" rx="${a}" ry="${b}" fill="none" stroke="${blue}" stroke-width="4"/>
        <circle cx="${sunX.toFixed(1)}" cy="${cy}" r="16" fill="${gold}"/>
        <circle cx="${periX}" cy="${cy}" r="6" fill="${green}"/>
        <circle cx="${apheX}" cy="${cy}" r="6" fill="${pink}"/>
      `;
      return {
        diagram: {
          title: "Kepler's First Law · the ellipse, Sun at one focus",
          viewBox: "0 0 500 220",
          svg,
          parts: [
            { label: "Sun (at one focus)", at: [sunX, cy], tone: "gold", note: "The Sun sits at one focus of the ellipse - NOT at its centre. This is Kepler's First Law." },
            { label: "Perihelion (closest point)", at: [periX, cy], tone: "green", note: "Where the planet passes closest to the Sun - and moves fastest, by Kepler's Second Law." },
            { label: "Aphelion (farthest point)", at: [apheX, cy], tone: "red", note: "Where the planet is farthest from the Sun - and moves slowest." },
          ],
        },
      };
    }
    case "9.9":
      return {
        text: {
          title: "The International Space Station · p109-110",
          cards: [
            { tag: "Orbit", title: "~400 km above Earth, continuously crewed since 2000", desc: "The largest human-made object in space - visible from the ground with the naked eye." },
            { tag: "International cooperation", title: "5 space agencies, 16 countries", desc: "NASA (USA), Roskosmos (Russia), ESA (Europe), JAXA (Japan) and CSA (Canada) jointly provide, maintain and operate it." },
            { tag: "Real benefits", title: "Water purification, eye-tracking, robotic surgery", desc: "ISS-developed water/oxygen recovery systems have saved a water-scarce village in Iraq; eye-tracking tech helps disabled people and laser surgery; robotic arms enable highly precise tumour removal and biopsies." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit10Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b", blue = "#38bdf8", green = "#34d399";
  switch (concept.id) {
    case "10.1": {
      const box = (x: number, y: number, w: number, label: string, fill: string) =>
        `<rect x="${x}" y="${y}" width="${w}" height="36" rx="6" fill="${fill}"/><text x="${x + w / 2}" y="${y + 23}" font-size="13" fill="white" text-anchor="middle">${label}</text>`;
      const svg = `
        ${box(190, 10, 100, "Matter", gold)}
        ${box(50, 90, 150, "Pure substances", blue)}
        ${box(280, 90, 150, "Mixtures", green)}
        ${box(20, 160, 100, "Elements", blue)}
        ${box(150, 160, 110, "Compounds", blue)}
        <line x1="240" y1="46" x2="125" y2="90" stroke="white" stroke-width="2"/>
        <line x1="240" y1="46" x2="355" y2="90" stroke="white" stroke-width="2"/>
        <line x1="125" y1="126" x2="70" y2="160" stroke="white" stroke-width="2"/>
        <line x1="125" y1="126" x2="205" y2="160" stroke="white" stroke-width="2"/>
      `;
      return {
        diagram: {
          title: "Classifying matter by chemical composition",
          viewBox: "0 0 480 210",
          svg,
          parts: [
            { label: "Pure substances", at: [125, 90], tone: "blue", note: "Contain only ONE kind of particle - elements and compounds." },
            { label: "Mixtures", at: [355, 90], tone: "green", note: "Contain more than one kind of particle, physically combined - can be separated without a chemical reaction." },
          ],
        },
      };
    }
    case "10.2":
      return {
        text: {
          title: "Compounds · p115",
          cards: [
            { tag: "Definition", title: "Two or more elements combined chemically", desc: "The compound's properties are completely different from the elements it's made of - reactive sodium metal and toxic chlorine gas combine to form safe, edible table salt." },
            { tag: "Fixed ratio", title: "Always in a definite proportion", desc: "Cane sugar is always C₁₂H₂₂O₁₁ - the same exact ratio of carbon, hydrogen and oxygen atoms, every time." },
            { tag: "Only chemically separable", title: "Cannot be split by physical means", desc: "Breaking a compound back into its elements always requires a chemical reaction, unlike a mixture." },
          ],
        },
      };
    case "10.3":
      return {
        text: {
          title: "Mixtures vs. compounds · p115-116",
          cards: [
            { tag: "The iron + sulphur test", title: "Un-mixed vs. heated together", desc: "Iron filings and sulphur powder simply stirred together still act like iron (magnetic) and sulphur separately. Heated together, they form iron sulphide - a new black compound, no longer magnetic at all." },
            { tag: "Any proportion", title: "Mixtures have no fixed ratio", desc: "Unlike a compound, the substances in a mixture can be combined in any amount." },
            { tag: "Physically separable", title: "No chemical reaction needed", desc: "A mixture's components can be separated by ordinary physical methods - filtering, dissolving, picking out by hand." },
          ],
        },
      };
    case "10.4":
      return {
        text: {
          title: "Homogeneous and heterogeneous mixtures · p116-117",
          cards: [
            { tag: "Homogeneous", title: "Components can't be seen separately", desc: "Uniform composition throughout - tap water, milk, air, steel, salt solution." },
            { tag: "Heterogeneous", title: "Components CAN be seen separately", desc: "Composition varies from part to part - soil, oil and water, sugar and sand." },
          ],
        },
      };
    case "10.5":
      return {
        text: {
          title: "Separating mixtures I · p117-118",
          cards: [
            { tag: "Sublimation", title: "Solid straight to vapour, and back", desc: "Separates a substance like iodine or camphor (which turns directly to vapour on heating) from one that doesn't." },
            { tag: "Centrifugation", title: "Spin fast; heavy settles, light stays", desc: "Used to separate cream from milk, or blood cells from plasma, by spinning at very high speed." },
            { tag: "Solvent extraction", title: "Separates two immiscible liquids", desc: "Uses a separating funnel - works for mixtures like oil and water, based on their difference in solubility." },
          ],
        },
      };
    case "10.6":
      return {
        text: {
          title: "Separating mixtures II · p118-119",
          cards: [
            { tag: "Simple distillation", title: "Evaporation + condensation", desc: "Purifies a liquid from a solution - e.g. turning seawater into drinking water. Used when two liquids' boiling points differ by MORE than 25 K." },
            { tag: "Fractional distillation", title: "For liquids with closer boiling points", desc: "Used when boiling points differ by LESS than 25 K - e.g. refining crude petroleum into its different fractions." },
            { tag: "Chromatography", title: "Separates by different solubility", desc: "Paper chromatography separates the different coloured dyes in ink, as the solvent carries each dye up the paper at its own speed." },
          ],
        },
      };
    case "10.7": {
      const dots = (n: number, xBase: number, r: number, spread: boolean, settle: boolean) =>
        Array.from({ length: n }, (_, i) => {
          const x = xBase + (i % 4) * 22 + (Math.sin(i) * 4);
          const y = settle ? 155 + (i % 2) * 12 : 60 + Math.floor(i / 4) * 30 + (i % 3) * 10;
          return `<circle cx="${x}" cy="${spread ? y : 100}" r="${r}" fill="${blue}"/>`;
        }).join("");
      const svg = `
        <rect x="20" y="40" width="120" height="150" fill="none" stroke="white" stroke-width="3"/>
        <rect x="180" y="40" width="120" height="150" fill="none" stroke="white" stroke-width="3"/>
        <line x1="185" y1="55" x2="290" y2="130" stroke="${gold}" stroke-width="3" opacity="0.6"/>
        <rect x="340" y="40" width="120" height="150" fill="none" stroke="white" stroke-width="3"/>
        ${dots(12, 30, 1.6, true, false)}
        ${dots(10, 190, 3.2, true, false)}
        ${dots(10, 350, 5, true, true)}
      `;
      return {
        diagram: {
          title: "True solution vs colloid vs suspension",
          viewBox: "0 0 480 210",
          svg,
          parts: [
            { label: "True solution", at: [80, 25], tone: "blue", note: "Particles are so small they never settle and stay perfectly clear - like sugar dissolved in water." },
            { label: "Colloid", at: [240, 25], tone: "gold", note: "Mid-sized particles stay suspended and scatter light visibly (the Tyndall effect) - like starch in water." },
            { label: "Suspension", at: [400, 25], tone: "green", note: "Particles are large enough to visibly settle to the bottom over time - like wheat flour in water." },
          ],
        },
      };
    }
    case "10.8":
      return {
        text: {
          title: "Colloidal solutions · p120",
          cards: [
            { tag: "Sol", title: "Solid dispersed in liquid", desc: "Examples: paints, inks, egg white." },
            { tag: "Gel", title: "Liquid dispersed in solid", desc: "Examples: curd, cheese, jelly." },
            { tag: "Aerosol", title: "Solid or liquid dispersed in gas", desc: "Examples: smoke and dust (solid in gas), mist and fog (liquid in gas)." },
            { tag: "Foam / solid foam", title: "Gas dispersed in liquid or solid", desc: "Foam: soap lather, aerated water (gas in liquid). Solid foam: cake, bread (gas in solid)." },
          ],
        },
      };
    case "10.9":
      return {
        text: {
          title: "Emulsions · p121-122",
          cards: [
            { tag: "Definition", title: "A colloid of two immiscible liquids", desc: "One liquid is dispersed as droplets throughout the other." },
            { tag: "Oil-in-water (O/W)", title: "Oil droplets dispersed in water", desc: "Example: cream." },
            { tag: "Water-in-oil (W/O)", title: "Water droplets dispersed in oil", desc: "Example: butter." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit11Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b", blue = "#38bdf8", green = "#34d399", red = "#f87171";
  switch (concept.id) {
    case "11.1": {
      const svg = `
        <rect x="230" y="30" width="10" height="160" fill="#d4af37"/>
        <text x="200" y="20" font-size="12" fill="white">gold foil</text>
        <line x1="30" y1="60" x2="220" y2="60" stroke="${green}" stroke-width="3" marker-end="url(#a11)"/>
        <line x1="240" y1="60" x2="440" y2="60" stroke="${green}" stroke-width="3" marker-end="url(#a11)"/>
        <line x1="30" y1="110" x2="228" y2="110" stroke="${gold}" stroke-width="3" marker-end="url(#a11)"/>
        <line x1="240" y1="105" x2="400" y2="70" stroke="${gold}" stroke-width="3" marker-end="url(#a11)"/>
        <line x1="30" y1="160" x2="228" y2="160" stroke="${red}" stroke-width="3" marker-end="url(#a11)"/>
        <line x1="228" y1="160" x2="60" y2="185" stroke="${red}" stroke-width="3" marker-end="url(#a11)"/>
        <defs><marker id="a11" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="white"/></marker></defs>
      `;
      return {
        diagram: {
          title: "Rutherford's gold foil experiment",
          viewBox: "0 0 460 210",
          svg,
          parts: [
            { label: "Most pass straight through", at: [130, 45], tone: "green", note: "Proves the atom is mostly empty space - alpha particles hit nothing solid in their path." },
            { label: "Some deflect slightly", at: [130, 95], tone: "gold", note: "These passed near the small positive nucleus and were pushed off course by its charge." },
            { label: "Very few bounce almost straight back", at: [130, 145], tone: "red", note: "Only a direct hit on the tiny, dense, positively charged nucleus could repel a fast alpha particle this strongly." },
          ],
        },
      };
    }
    case "11.2":
      return {
        text: {
          title: "Bohr's model of the atom · p126-127",
          cards: [
            { tag: "Fixed orbits", title: "Stationary shells: K, L, M, N... (n=1,2,3,4...)", desc: "Electrons move in these fixed circular paths without gaining or losing energy while they stay put." },
            { tag: "Jumping shells", title: "Only by absorbing/releasing a FIXED amount of energy", desc: "An electron moves to a higher shell by absorbing energy, or drops to a lower shell by releasing energy - never gradually." },
            { tag: "Limitation", title: "Only worked for hydrogen-like atoms", desc: "Bohr's model applied only to hydrogen and single-electron ions (He⁺, Li²⁺...) - it couldn't be extended to atoms with multiple electrons." },
          ],
        },
      };
    case "11.3":
      return {
        text: {
          title: "Discovery of neutrons · p127",
          cards: [
            { tag: "Chadwick, 1932", title: "Bombarded beryllium with alpha particles", desc: "A new particle was emitted, with about the same mass as a proton." },
            { tag: "Electrically neutral", title: "Not deflected by any magnetic or electric field", desc: "This proved the new particle carried no electric charge at all - hence the name neutron." },
            { tag: "Symbol", title: "₀n¹ - mass 1, charge 0", desc: "The superscript 1 is its mass (in amu); the subscript 0 is its electric charge." },
          ],
        },
      };
    case "11.4":
      return {
        text: {
          title: "The three fundamental particles · p127",
          cards: [
            { tag: "Electron", title: "Charge -1, mass ≈ 1/1837 amu", desc: "Found in the space around the nucleus - its mass is small enough to be treated as negligible for the atom's total mass." },
            { tag: "Proton", title: "Charge +1, mass ≈ 1 amu", desc: "Found in the nucleus." },
            { tag: "Neutron", title: "Charge 0, mass ≈ 1 amu", desc: "Found in the nucleus. Protons and neutrons together are called nucleons." },
          ],
        },
      };
    case "11.5":
      return {
        text: {
          title: "Atomic number and mass number · p128",
          cards: [
            { tag: "Atomic number (Z)", title: "= number of protons = number of electrons", desc: "This is what identifies which element an atom is." },
            { tag: "Mass number (A)", title: "= number of protons + number of neutrons", desc: "So: number of neutrons = A − Z." },
            { tag: "Worked example", title: "Mass number 39, 20 neutrons", desc: "Atomic number = 39 − 20 = 19 (this is potassium)." },
          ],
        },
      };
    case "11.6": {
      const kElectrons = [0, 180];
      const lElectrons = [0, 60, 120, 180, 240, 300];
      const dot = (angleDeg: number, r: number) => {
        const rad = (angleDeg * Math.PI) / 180;
        return `<circle cx="${(260 + r * Math.cos(rad)).toFixed(1)}" cy="${(120 + r * Math.sin(rad)).toFixed(1)}" r="6" fill="white"/>`;
      };
      const svg = `
        <circle cx="260" cy="120" r="45" fill="none" stroke="${blue}" stroke-width="2" stroke-dasharray="5 5"/>
        <circle cx="260" cy="120" r="85" fill="none" stroke="${green}" stroke-width="2" stroke-dasharray="5 5"/>
        <circle cx="260" cy="120" r="20" fill="${gold}"/>
        <text x="245" y="116" font-size="10" fill="black">8p</text>
        <text x="245" y="128" font-size="10" fill="black">8n</text>
        ${kElectrons.map((a) => dot(a, 45)).join("")}
        ${lElectrons.map((a) => dot(a, 85)).join("")}
      `;
      return {
        diagram: {
          title: "Electronic configuration · oxygen (Z=8), 2,6",
          viewBox: "0 0 520 240",
          svg,
          parts: [
            { label: "Nucleus (8p, 8n)", at: [260, 120], tone: "gold", note: "8 protons and 8 neutrons - oxygen's atomic number is 8, mass number 16." },
            { label: "K shell - 2 electrons", at: [260, 75], tone: "blue", note: "The innermost shell, filled to its maximum of 2 (2n² with n=1)." },
            { label: "L shell - 6 electrons", at: [260, 35], tone: "green", note: "The outer (valence) shell, holding oxygen's remaining 6 electrons - these are its valence electrons." },
          ],
        },
      };
    }
    case "11.7":
      return {
        text: {
          title: "Valence electrons and valency · p129-131",
          cards: [
            { tag: "Valence electrons", title: "Electrons in the OUTERMOST shell", desc: "These decide an element's chemical properties, since they're the ones involved in reactions." },
            { tag: "Valency rule", title: "1-4 valence electrons → valency = that number", desc: "5-7 valence electrons → valency = 8 minus that number. A completely filled outer shell → valency 0." },
            { tag: "Worked example", title: "Magnesium (2,8,2) and Sulphur (2,8,6)", desc: "Magnesium: valency = 2 (has 2 valence electrons). Sulphur: valency = 8 − 6 = 2 (has 6 valence electrons)." },
          ],
        },
      };
    case "11.8":
      return {
        text: {
          title: "Isotopes, isobars and isotones · p131-133",
          cards: [
            { tag: "Isotopes", title: "Same atomic number, different mass number", desc: "Same element, different neutron count - hydrogen's 3 forms all have Z=1 but mass numbers 1, 2 and 3." },
            { tag: "Isobars", title: "Different atomic number, SAME mass number", desc: "Calcium (Z=20) and Argon (Z=18) - different elements, but both have mass number 40." },
            { tag: "Isotones", title: "Same number of neutrons, different Z and A", desc: "Boron (Z=5, A=11 → 6 neutrons) and Carbon (Z=6, A=12 → 6 neutrons) - same neutron count, different everything else." },
          ],
        },
      };
    case "11.9":
      return {
        text: {
          title: "Laws of chemical combination · p133-134",
          cards: [
            { tag: "Multiple proportions (Dalton)", title: "CO and CO2, oxygen ratio 1:2", desc: "For the same fixed mass of carbon, the masses of oxygen in CO and CO2 are in a simple ratio." },
            { tag: "Reciprocal proportions (Richter)", title: "H and O each with fixed carbon: ratio 1:8, matching H2O's own 1:8", desc: "Hydrogen and oxygen combining separately with the same mass of carbon give the same ratio as hydrogen and oxygen combining directly." },
            { tag: "Gay-Lussac's Law", title: "1 volume H2 + 1 volume Cl2 → 2 volumes HCl", desc: "Reacting gas volumes are always in a simple whole-number ratio (here, 1:1:2)." },
          ],
        },
      };
    case "11.10":
      return {
        text: {
          title: "Quantum numbers · p134",
          cards: [
            { tag: "Principal (n)", title: "Main energy level", desc: "Like knowing which country a building is in - the broadest part of an electron's 'address'." },
            { tag: "Azimuthal (l)", title: "Sub-shell / orbital shape", desc: "Like the state or region within that country." },
            { tag: "Magnetic (m) and Spin (s)", title: "Orbital orientation, and electron spin", desc: "The final two numbers that complete an electron's full four-part 'address'." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit12Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b", blue = "#38bdf8", green = "#34d399", pink = "#f472b6";
  switch (concept.id) {
    case "12.1":
      return {
        text: {
          title: "Dobereiner's triads · p138-139",
          cards: [
            { tag: "The rule", title: "Middle element's mass ≈ average of the other two", desc: "Arrange three similar elements by increasing atomic mass - the middle one's mass is close to the average of the first and third." },
            { tag: "Worked example", title: "Li (6.9), Na (23), K (39.1)", desc: "(6.9 + 39.1) / 2 = 23 - matching sodium's real atomic mass almost exactly." },
            { tag: "Limitations", title: "Only 3 triads could be found", desc: "And the law failed completely for elements with very low or very high atomic mass." },
          ],
        },
      };
    case "12.2":
      return {
        text: {
          title: "Newlands' law of octaves · p139-140",
          cards: [
            { tag: "The rule", title: "Every 8th element resembles the 1st", desc: "Arranged by increasing atomic mass, element 8 was similar to element 1 - like the 8th note in a musical octave." },
            { tag: "Example", title: "Hydrogen (1st) and Fluorine (8th)", desc: "Placed in the same group because of their similar properties under this pattern." },
            { tag: "Limitations", title: "Broke down after calcium", desc: "Sometimes 2 elements crammed into 1 slot; later-discovered noble gases disrupted the whole pattern (a 9th element became the similar one instead)." },
          ],
        },
      };
    case "12.3":
      return {
        text: {
          title: "Mendeleev's periodic table · p139-141",
          cards: [
            { tag: "The law of periodicity", title: "Properties repeat periodically with atomic MASS", desc: "56 known elements arranged into 8 groups and 7 periods." },
            { tag: "Real predictive power", title: "'Eka-Silicon' predicted at mass ~72", desc: "Germanium, discovered in 1886, had a real atomic mass of 72.59 - an almost perfect match to Mendeleev's 1871 prediction." },
            { tag: "Limitation", title: "Very different elements grouped together", desc: "Hard metals like copper and silver ended up in the same group as soft metals like sodium and potassium." },
          ],
        },
      };
    case "12.4":
      return {
        text: {
          title: "The modern periodic law and table · p141",
          cards: [
            { tag: "Moseley, 1913", title: "Properties depend on atomic NUMBER, not mass", desc: "X-ray diffraction experiments proved this, correcting Mendeleev's original basis." },
            { tag: "Modern periodic law", title: "Properties are periodic functions of atomic number", desc: "The single fix that resolved most of Mendeleev's misfit elements." },
            { tag: "Structure", title: "7 periods, 18 groups", desc: "Periods (rows) are based on the number of shells; groups (columns) share similar properties and valence electron counts." },
          ],
        },
      };
    case "12.5": {
      const svg = `
        <rect x="30" y="20" width="70" height="160" fill="${blue}" opacity="0.85" rx="6"/>
        <rect x="260" y="20" width="180" height="90" fill="${green}" opacity="0.85" rx="6"/>
        <rect x="110" y="70" width="140" height="80" fill="${gold}" opacity="0.85" rx="6"/>
        <rect x="90" y="190" width="330" height="30" fill="${pink}" opacity="0.85" rx="6"/>
        <text x="45" y="105" font-size="16" fill="black">s</text>
        <text x="335" y="70" font-size="16" fill="black">p</text>
        <text x="175" y="115" font-size="16" fill="black">d</text>
        <text x="245" y="210" font-size="16" fill="black">f</text>
      `;
      return {
        diagram: {
          title: "Periodic table shape · s, p, d and f blocks",
          viewBox: "0 0 460 230",
          svg,
          parts: [
            { label: "s-block", at: [65, 100], tone: "blue", note: "Groups 1-2: alkali metals and alkaline earth metals." },
            { label: "p-block", at: [350, 60], tone: "green", note: "Groups 13-18: the most varied block - contains metals, non-metals AND metalloids." },
            { label: "d-block", at: [180, 110], tone: "gold", note: "Groups 3-12: the transition elements, in the middle of the table." },
            { label: "f-block", at: [255, 205], tone: "red", note: "Lanthanides and actinides - the inner transition elements, placed at the very bottom." },
          ],
        },
      };
    }
    case "12.6":
      return {
        text: {
          title: "Hydrogen's position and the noble gases · p143-144",
          cards: [
            { tag: "Modern table's advantages", title: "Based on atomic number, isotopes get one shared position", desc: "It also cleanly separates metals (left/centre) from non-metals (upper right)." },
            { tag: "Hydrogen's dual nature", title: "Can lose 1 electron (like alkali metals) OR gain 1 (like halogens)", desc: "Its position in the periodic table is genuinely unique and still debated." },
            { tag: "Noble gases", title: "Completely filled valence shells → barely react at all", desc: "Helium, Neon, Argon, Krypton, Xenon, Radon - found in tiny quantities, hence also called 'rare gases'." },
          ],
        },
      };
    case "12.7":
      return {
        text: {
          title: "Metals, non-metals and metalloids · p144",
          cards: [
            { tag: "Metals", title: "Hard, shiny, malleable, ductile, good conductors", desc: "Mercury is the one metal that is liquid at room temperature." },
            { tag: "Non-metals", title: "Lack metallic properties, found only in the p-block", desc: "Examples: carbon, nitrogen, oxygen, phosphorus, sulphur, the halogens, and the noble gases." },
            { tag: "Metalloids", title: "Properties of BOTH metals and non-metals", desc: "Examples: boron, arsenic." },
          ],
        },
      };
    case "12.8":
      return {
        text: {
          title: "Alloys · p144-145",
          cards: [
            { tag: "Definition", title: "A mixture of two or more metals", desc: "Made by thoroughly mixing molten metals - e.g. brass is copper + zinc." },
            { tag: "Why alloy?", title: "Often more useful than the pure metals alone", desc: "Less corrosion, more hardness (gold + copper is harder than pure gold), lower conductivity, and sometimes a lower melting point (solder: lead + tin)." },
            { tag: "Amalgam", title: "An alloy specifically with mercury", desc: "A special name reserved just for mercury-containing alloys." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit13Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b";
  switch (concept.id) {
    case "13.1":
      return {
        text: {
          title: "The octet rule (Kossel-Lewis theory) · p148-149",
          cards: [
            { tag: "Why noble gases don't react", title: "Their valence shells are already stable", desc: "Except helium (2 electrons), all noble gases have exactly 8 valence electrons - a complete, stable octet." },
            { tag: "The octet rule", title: "Other atoms want that same stability", desc: "Atoms with incomplete valence shells lose, gain, or share electrons to reach 8 (an octet) too." },
            { tag: "Who loses, who gains", title: "1-3 valence electrons → lose; 5-7 → gain", desc: "It's easier to give away 1-3 electrons than to gain 5-7, and vice versa." },
          ],
        },
      };
    case "13.2": {
      const atom = (cx: number, label: string, counts: { top: number; right: number; bottom: number; left: number }) => {
        const dot = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${gold}"/>`;
        const dots: string[] = [];
        if (counts.top >= 1) dots.push(dot(cx, 55));
        if (counts.top >= 2) dots.push(dot(cx + 10, 55));
        if (counts.right >= 1) dots.push(dot(cx + 22, 80));
        if (counts.right >= 2) dots.push(dot(cx + 22, 90));
        if (counts.bottom >= 1) dots.push(dot(cx, 105));
        if (counts.bottom >= 2) dots.push(dot(cx + 10, 105));
        if (counts.left >= 1) dots.push(dot(cx - 22, 80));
        if (counts.left >= 2) dots.push(dot(cx - 22, 90));
        return `<text x="${cx}" y="88" font-size="22" fill="white" text-anchor="middle">${label}</text>${dots.join("")}`;
      };
      const svg = `
        ${atom(60, "H", { top: 1, right: 0, bottom: 0, left: 0 })}
        ${atom(160, "Be", { top: 1, right: 1, bottom: 0, left: 0 })}
        ${atom(260, "C", { top: 1, right: 1, bottom: 1, left: 1 })}
        ${atom(360, "N", { top: 2, right: 1, bottom: 1, left: 1 })}
        ${atom(460, "O", { top: 2, right: 2, bottom: 1, left: 1 })}
      `;
      return {
        diagram: {
          title: "Lewis dot structures · one dot per valence electron",
          viewBox: "0 0 520 130",
          svg,
          parts: [
            { label: "H - 1 valence electron", at: [60, 40], tone: "gold", note: "Hydrogen has just 1 valence electron, so it gets a single dot." },
            { label: "C - 4 valence electrons", at: [260, 40], tone: "gold", note: "One dot goes on each of the four sides (top, right, bottom, left) before any side gets a second dot." },
            { label: "O - 6 valence electrons", at: [460, 40], tone: "gold", note: "After all four sides have one dot each, the remaining electrons pair up on two of the sides." },
          ],
        },
      };
    }
    case "13.3":
      return {
        text: {
          title: "Ionic (electrovalent) bond · p150-152",
          cards: [
            { tag: "Formation", title: "Electron transfer, then electrostatic attraction", desc: "One atom loses electrons (becomes a cation, +), another gains them (becomes an anion, -). The oppositely charged ions attract." },
            { tag: "Worked example: NaCl", title: "Na (2,8,1) loses 1 electron; Cl (2,8,7) gains 1", desc: "Both reach a stable octet - Na+ (2,8) and Cl- (2,8,8)." },
            { tag: "Properties of ionic compounds", title: "Crystalline solids, high melting point, water-soluble", desc: "Don't conduct electricity as solids (ions are locked in place), but do conduct when molten or dissolved in water." },
          ],
        },
      };
    case "13.4":
      return {
        text: {
          title: "Covalent bond · p152-155",
          cards: [
            { tag: "Formation", title: "Atoms SHARE electron pairs", desc: "Each atom contributes one electron to the shared pair, and both count the shared pair toward their own octet." },
            { tag: "Bond types", title: "Single (H-H), double (O=O), triple (N≡N)", desc: "The number of shared electron pairs determines the bond type - 1 pair, 2 pairs, or 3 pairs." },
            { tag: "Properties", title: "Lower melting points, poor conductors", desc: "Covalent compounds can be gases, liquids or solids, and don't conduct electricity since they have no charged ions." },
          ],
        },
      };
    case "13.5":
      return {
        text: {
          title: "Fajan's rule: ionic vs. covalent character · p154-155",
          cards: [
            { tag: "The rule", title: "Small, highly charged cation + large anion → more covalent", desc: "A small, high-charge cation can distort (polarise) a large anion's electron cloud, preventing complete charge separation." },
            { tag: "Example: NaCl", title: "Low charge (+1), fairly large cation, small anion → ionic", desc: "Complete charge separation happens easily here." },
            { tag: "Example: AlI3", title: "High charge (+3), large anion → more covalent", desc: "The highly charged aluminium cation distorts the large iodide anion, giving the bond real covalent character." },
          ],
        },
      };
    case "13.6":
      return {
        text: {
          title: "Coordinate covalent (dative) bond · p155-156",
          cards: [
            { tag: "The key difference", title: "BOTH shared electrons come from ONE atom", desc: "Unlike a normal covalent bond, where each atom contributes one electron." },
            { tag: "Donor and acceptor", title: "One atom donates a lone pair; the other accepts it", desc: "Shown with an arrow (→) pointing from the donor atom to the acceptor atom." },
            { tag: "Worked example", title: "NH3 → BF3", desc: "Ammonia's lone pair is donated to electron-deficient boron trifluoride, forming a coordinate bond between them." },
          ],
        },
      };
    case "13.7":
      return {
        text: {
          title: "Oxidation, reduction and redox reactions · p156-157",
          cards: [
            { tag: "Oxidation", title: "Add oxygen, remove hydrogen, OR lose electrons", desc: "Example: 2Mg + O2 → 2MgO (magnesium is oxidised)." },
            { tag: "Reduction", title: "Add hydrogen, remove oxygen, OR gain electrons", desc: "Example: CuO + H2 → Cu + H2O (copper oxide is reduced)." },
            { tag: "Redox reaction", title: "Oxidation and reduction happen together", desc: "Whatever gets oxidised gives up electrons to whatever gets reduced, in the same reaction." },
          ],
        },
      };
    case "13.8":
      return {
        text: {
          title: "Oxidation number · p157-158",
          cards: [
            { tag: "The rule", title: "Sums to 0 in a neutral compound, to the charge in an ion", desc: "Standard assumptions: H is usually +1, oxygen is usually -2." },
            { tag: "Worked example: H2SO4", title: "Find the oxidation number of sulphur", desc: "2×(+1) + x + 4×(-2) = 0 → +2 + x − 8 = 0 → x = +6." },
            { tag: "Worked example: K2Cr2O7", title: "Find the oxidation number of chromium", desc: "2×(+1) + 2x + 7×(-2) = 0 → +2 + 2x − 14 = 0 → 2x = 12 → x = +6." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit14Frame(concept: ScienceConcept): BoardFrame | undefined {
  switch (concept.id) {
    case "14.1":
      return {
        text: {
          title: "Acids: definition and classification · p162-163",
          cards: [
            { tag: "Arrhenius definition", title: "Furnishes H+ (or H3O+) ions in water", desc: "Acids taste sour and contain one or more replaceable hydrogen atoms." },
            { tag: "By source", title: "Organic (from living things) vs. Inorganic (from rocks/minerals)", desc: "Citric acid (from fruit) is organic; hydrochloric acid is inorganic." },
            { tag: "By basicity", title: "Monobasic (1 H+), dibasic (2 H+), tribasic (3 H+)", desc: "HCl and HNO3 are monobasic; H2SO4 is dibasic; H3PO4 is tribasic." },
          ],
        },
      };
    case "14.2":
      return {
        text: {
          title: "Properties and uses of acids · p164",
          cards: [
            { tag: "Key properties", title: "Sour, conduct electricity, turn blue litmus red", desc: "React with active metals to release H2 gas, with carbonates to release CO2, and with bases to neutralise." },
            { tag: "Worked example", title: "Zn + 2HCl → ZnCl2 + H2", desc: "Zinc displaces hydrogen gas from dilute hydrochloric acid - confirmed by a 'popping' sound near a flame." },
            { tag: "Real uses", title: "Sulphuric acid = 'King of Chemicals'", desc: "Used in car batteries; hydrochloric acid cleans toilets; citric acid preserves food." },
          ],
        },
      };
    case "14.3":
      return {
        text: {
          title: "Aquaregia · p165",
          cards: [
            { tag: "What it is", title: "3:1 molar mix of HCl and HNO3", desc: "A yellow-orange, highly corrosive, fuming liquid." },
            { tag: "The name", title: "Latin for 'king's water'", desc: "Because it can dissolve gold - the 'king' of metals - which neither acid dissolves alone." },
            { tag: "Uses", title: "Dissolving, cleaning and refining gold and platinum", desc: "Noble metals that resist ordinary acids." },
          ],
        },
      };
    case "14.4":
      return {
        text: {
          title: "Bases: definition and classification · p165-166",
          cards: [
            { tag: "Arrhenius definition", title: "Releases OH- ions in water", desc: "Water-soluble bases are specifically called alkalis - all alkalis are bases, but not all bases are alkalis." },
            { tag: "Example", title: "NaOH and KOH are alkalis; Al(OH)3 is a base but NOT an alkali", desc: "Al(OH)3 doesn't dissolve well in water." },
            { tag: "By acidity", title: "Monoacidic (1 OH-), diacidic (2 OH-), triacidic (3 OH-)", desc: "NaOH is monoacidic; Ca(OH)2 is diacidic; Al(OH)3 is triacidic." },
          ],
        },
      };
    case "14.5":
      return {
        text: {
          title: "Properties and uses of bases · p166-167",
          cards: [
            { tag: "Key properties", title: "Bitter, soapy feel, turn red litmus blue", desc: "Conduct electricity in solution and react with acids to neutralise (forming salt and water)." },
            { tag: "Worked example", title: "Zn + 2NaOH → Na2ZnO2 + H2", desc: "Bases can react with certain metals to liberate hydrogen gas, just like acids do." },
            { tag: "Real uses", title: "NaOH makes soap; Ca(OH)2 whitewashes buildings", desc: "Magnesium hydroxide treats stomach acidity; ammonium hydroxide removes grease stains." },
          ],
        },
      };
    case "14.6":
      return {
        text: {
          title: "Testing for acids and bases · p167",
          cards: [
            { tag: "Litmus paper", title: "Acid: blue → red. Base: red → blue.", desc: "The simplest, most common test." },
            { tag: "Phenolphthalein", title: "Colourless in acid, PINK in base", desc: "No colour change at all in acidic solutions." },
            { tag: "Methyl orange", title: "PINK in acid, yellow in base", desc: "The opposite colour behaviour to phenolphthalein." },
          ],
        },
      };
    case "14.7": {
      const svg = `<rect x="55" y="105" width="410" height="45" rx="22" fill="url(#ph14)"/><defs><linearGradient id="ph14"><stop offset="0" stop-color="#ef4444"/><stop offset=".5" stop-color="#facc15"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs><path d="M55 80v95M260 80v95M465 80v95" stroke="white" stroke-width="3" stroke-dasharray="7 6"/><text x="45" y="180" font-size="13" fill="white">0</text><text x="255" y="180" font-size="13" fill="white">7</text><text x="455" y="180" font-size="13" fill="white">14</text>`;
      return {
        diagram: {
          title: "The pH scale · 0 to 14",
          viewBox: "0 0 520 200",
          svg,
          parts: [
            { label: "Acidic (pH < 7)", at: [130, 70], tone: "red", note: "The closer to 0, the more strongly acidic." },
            { label: "Neutral (pH = 7)", at: [260, 70], tone: "gold", note: "Pure water sits exactly here." },
            { label: "Basic (pH > 7)", at: [390, 70], tone: "blue", note: "The closer to 14, the more strongly basic." },
          ],
        },
      };
    }
    case "14.8":
      return {
        text: {
          title: "Types of salts · p168",
          cards: [
            { tag: "Normal salt", title: "Complete neutralisation", desc: "NaOH + HCl → NaCl + H2O." },
            { tag: "Acid salt", title: "Partial replacement of a polybasic acid's H+", desc: "NaOH + H2SO4 → NaHSO4 + H2O - still has one replaceable hydrogen left." },
            { tag: "Basic salt / Double salt", title: "Partial OH- replacement / two salts crystallised together", desc: "Double salt example: potash alum, KAl(SO4)2·12H2O - potassium sulphate + aluminium sulphate crystallised together." },
          ],
        },
      };
    case "14.9":
      return {
        text: {
          title: "Properties, hydration and identification of salts · p168-169",
          cards: [
            { tag: "General properties", title: "Mostly solids, often water-soluble, hygroscopic", desc: "Salts absorb moisture from the air over time." },
            { tag: "Water of crystallisation", title: "CuSO4·5H2O - blue when hydrated, white when heated", desc: "Heating drives off the water molecules bound into the crystal structure." },
            { tag: "Flame test", title: "Ca2+ = brick red, Na+ = golden yellow, K+ = pink-violet", desc: "Different metal ions colour a flame differently when burned as chlorides." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit15Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b", blue = "#38bdf8", green = "#34d399";
  switch (concept.id) {
    case "15.1":
      return {
        text: {
          title: "Discovery of carbon - milestones · p172-173",
          cards: [
            { tag: "1772 - Lavoisier", title: "Proved diamond is carbon", desc: "Burned a diamond and found it combined with oxygen to form carbon dioxide, just like charcoal." },
            { tag: "1796 - Tennant", title: "Equal weights, equal CO2", desc: "Proved that burning equal weights of diamond and charcoal produced the same amount of CO2 - both are pure carbon." },
            { tag: "1955 & 1985", title: "Graphite → diamond, and fullerenes discovered", desc: "Bundy's team created diamond from graphite under heat and pressure; Curl, Kroto and Smalley discovered soccer-ball-shaped fullerenes." },
          ],
        },
      };
    case "15.2": {
      const box = (x: number, y: number, w: number, label: string, fill: string) =>
        `<rect x="${x}" y="${y}" width="${w}" height="36" rx="6" fill="${fill}"/><text x="${x + w / 2}" y="${y + 23}" font-size="13" fill="white" text-anchor="middle">${label}</text>`;
      const svg = `
        ${box(180, 10, 120, "Carbon compounds", gold)}
        ${box(50, 90, 150, "Organic", blue)}
        ${box(280, 90, 150, "Inorganic", green)}
        <line x1="240" y1="46" x2="125" y2="90" stroke="white" stroke-width="2"/>
        <line x1="240" y1="46" x2="355" y2="90" stroke="white" stroke-width="2"/>
      `;
      return {
        diagram: {
          title: "Classifying carbon compounds by source",
          viewBox: "0 0 480 140",
          svg,
          parts: [
            { label: "Organic", at: [125, 90], tone: "blue", note: "From living organisms - plants and animals. Example: ethanol, cellulose, starch." },
            { label: "Inorganic", at: [355, 90], tone: "green", note: "From non-living sources. Example: CO, CO2, CaCO3, NaHCO3." },
          ],
        },
      };
    }
    case "15.3":
      return {
        text: {
          title: "Catenation · p174-175",
          cards: [
            { tag: "Definition", title: "An element bonding repeatedly with itself", desc: "Through covalent bonds, forming open or closed chains." },
            { tag: "Three shapes", title: "Linear, branched, or ring chains", desc: "Carbon atoms can link in any of these three patterns." },
            { tag: "Why it matters", title: "The main reason organic chemistry has millions of compounds", desc: "No other element catenates as extensively as carbon does." },
          ],
        },
      };
    case "15.4":
      return {
        text: {
          title: "Tetravalency and multiple bonds · p175",
          cards: [
            { tag: "Tetravalency", title: "Carbon (2,4) needs 4 more electrons for a stable octet", desc: "So it forms exactly 4 covalent bonds - with itself or other elements." },
            { tag: "Single bond", title: "Methane (alkane class): H-H style, one shared pair", desc: "The simplest hydrocarbon bond type." },
            { tag: "Double and triple bonds", title: "Ethene (alkene, 2 pairs) and ethyne (alkyne, 3 pairs)", desc: "H-C≡C-H (ethyne) shares three electron pairs between its two carbons." },
          ],
        },
      };
    case "15.5":
      return {
        text: {
          title: "Isomerism · p175-176",
          cards: [
            { tag: "The puzzle", title: "C2H6O - which compound is it?", desc: "The molecular formula alone can't tell you - it only counts atoms, not their arrangement." },
            { tag: "Two real answers", title: "CH3-CH2-OH (ethanol) or CH3-O-CH3 (dimethyl ether)", desc: "Same atoms, different arrangement, completely different properties - one is an alcohol, the other an ether." },
            { tag: "The term", title: "Isomerism - same formula, different structure", desc: "Compounds like these are called isomers." },
          ],
        },
      };
    case "15.6": {
      const diamondDots = Array.from({ length: 9 }, (_, i) => `<circle cx="${75 + (i % 3) * 20}" cy="${50 + Math.floor(i / 3) * 20}" r="6" fill="${blue}"/>`).join("");
      const graphiteLines = [55, 90, 125].map((y) => `<line x1="180" y1="${y}" x2="300" y2="${y}" stroke="${green}" stroke-width="4"/>`).join("");
      const svg = `
        ${diamondDots}
        ${graphiteLines}
        <circle cx="400" cy="90" r="35" fill="none" stroke="${gold}" stroke-width="4"/>
        <path d="M375 65 L425 115 M425 65 L375 115" stroke="${gold}" stroke-width="2" opacity="0.6"/>
      `;
      return {
        diagram: {
          title: "Diamond, graphite and fullerene - the same element, three forms",
          viewBox: "0 0 460 160",
          svg,
          parts: [
            { label: "Diamond", at: [95, 140], tone: "blue", note: "Every carbon bonds to 4 neighbours in a rigid 3D lattice - hard, doesn't conduct electricity." },
            { label: "Graphite", at: [240, 140], tone: "green", note: "Flat hexagonal layers, each carbon bonded to only 3 others - layers slide easily (soft), and it conducts electricity." },
            { label: "Fullerene (C60)", at: [400, 140], tone: "gold", note: "60 carbon atoms in a hollow, soccer-ball-shaped sphere - the 'Buckyball'." },
          ],
        },
      };
    }
    case "15.7":
      return {
        text: {
          title: "Physical and chemical properties of carbon · p177-178",
          cards: [
            { tag: "Combustion (oxidation)", title: "C + O2 → CO or CO2, releasing heat", desc: "Hydrocarbons burn to give CO2, steam and heat too." },
            { tag: "Reaction with steam", title: "C + H2O → CO + H2 ('water gas')", desc: "A useful industrial fuel mixture." },
            { tag: "Reaction with metals", title: "Carbon + metal → carbide (e.g. W + C → WC)", desc: "Happens at elevated temperatures with metals like tungsten and titanium." },
          ],
        },
      };
    case "15.8":
      return {
        text: {
          title: "Plastics: benefits and drawbacks · p178",
          cards: [
            { tag: "Real benefits", title: "Healthcare, food safety, smartphones, computers", desc: "Plastics enabled major technological and lifestyle breakthroughs." },
            { tag: "Real drawbacks", title: "Extremely slow to break down; too few microbes to cope", desc: "Much plastic goes unrecycled and pollutes the environment." },
            { tag: "The cost", title: "Harmful additives and toxic gases when burned", desc: "Both are real health risks associated with some plastics." },
          ],
        },
      };
    case "15.9":
      return {
        text: {
          title: "Resin codes and harmful plastics · p179-180",
          cards: [
            { tag: "Resin codes", title: "Numbered 1-7, designed in 1988", desc: "Identify the polymer type, helping recyclers sort plastic correctly." },
            { tag: "PVC (#3)", title: "Contains heavy metals; releases toxic dioxins when burned", desc: "One of the most dangerous plastics when incinerated." },
            { tag: "PS/Thermocol (#6) and PC/ABS (#7)", title: "Styrene (possibly carcinogenic) and BPA (hormone-disrupting)", desc: "Both leak more readily into hot or oily food." },
          ],
        },
      };
    case "15.10":
      return {
        text: {
          title: "Tamil Nadu's plastic ban and your role · p180-182",
          cards: [
            { tag: "The ban", title: "One-time-use plastics banned from 1 January 2019", desc: "Under the Environment (Protection) Act, 1988 - covers bags, plates, water pouches, straws, sheets." },
            { tag: "The scale of the problem", title: "2 million plastic bags used every minute worldwide", desc: "97% of them are never recycled." },
            { tag: "What you can do", title: "Learn resin codes, avoid one-time plastics, educate others", desc: "Small daily choices add up against a global-scale problem." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit16Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b", blue = "#38bdf8", green = "#34d399";
  switch (concept.id) {
    case "16.1":
      return {
        text: {
          title: "Nanochemistry · p185-186",
          cards: [
            { tag: "The scale", title: "1 nanometre = 1/1,000,000,000 metre", desc: "A DNA double helix is 2 nm across; a hydrogen atom is about 0.2 nm; a cold virus is about 30 nm." },
            { tag: "Special properties", title: "Larger surface area, higher surface energy", desc: "Properties genuinely different from both individual atoms and bulk materials." },
            { tag: "Uses and risks", title: "Stain-resistant textiles, sunscreens, electronics - but also toxic and unstable", desc: "Nanoparticles are highly reactive and can be biologically harmful." },
          ],
        },
      };
    case "16.2":
      return {
        text: {
          title: "Pharmaceutical chemistry: drugs · p186-187",
          cards: [
            { tag: "WHO definition", title: "A substance used to modify physiological/pathological states, for the patient's benefit", desc: "" },
            { tag: "Required characteristics", title: "Not toxic, no side effects, doesn't disrupt normal physiology, effective", desc: "" },
            { tag: "Sources", title: "Plants, chemical synthesis, animals, minerals, microorganisms, genetic engineering", desc: "E.g. morphine (plant), aspirin (synthesis), insulin (animal), penicillin (microorganism)." },
          ],
        },
      };
    case "16.3":
      return {
        text: {
          title: "Anaesthetics, analgesics, antipyretics · p187-188",
          cards: [
            { tag: "Anaesthetics", title: "General (full unconsciousness) vs. local (one area numbed)", desc: "Chemicals used: nitrous oxide (safest), ether; chloroform is no longer used." },
            { tag: "Analgesics", title: "Relieve pain WITHOUT loss of consciousness", desc: "E.g. aspirin, Novalgin." },
            { tag: "Antipyretics", title: "Reduce fever", desc: "E.g. aspirin, paracetamol, phenacetin." },
          ],
        },
      };
    case "16.4":
      return {
        text: {
          title: "Antiseptics, antimalarial, antibiotics, antacids · p188-189",
          cards: [
            { tag: "Antiseptics", title: "Prevent infection from microorganisms", desc: "E.g. iodoform, phenol, hydrogen peroxide." },
            { tag: "Antimalarial & Antibiotics", title: "Quinine (from Cinchona bark); Penicillin (Fleming, 1929, from mold)", desc: "Penicillin came specifically from Penicillium notatum mold." },
            { tag: "Antacids", title: "Relieve stomach acidity", desc: "Contain magnesium and aluminium hydroxides." },
          ],
        },
      };
    case "16.5": {
      const svg = `
        <rect x="40" y="60" width="140" height="120" rx="8" fill="none" stroke="${blue}" stroke-width="3"/>
        <rect x="300" y="60" width="140" height="120" rx="8" fill="none" stroke="${green}" stroke-width="3"/>
        <rect x="95" y="40" width="30" height="120" fill="${blue}"/>
        <rect x="355" y="40" width="30" height="120" fill="${green}"/>
        <line x1="110" y1="40" x2="370" y2="40" stroke="white" stroke-width="3" marker-end="url(#a16)"/>
        <path d="M180 155 H300" stroke="${gold}" stroke-width="10"/>
        <defs><marker id="a16" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="white"/></marker></defs>
      `;
      return {
        diagram: {
          title: "Galvanic cell · chemical energy becomes electricity",
          viewBox: "0 0 480 200",
          svg,
          parts: [
            { label: "Anode", at: [110, 40], tone: "blue", note: "Oxidation happens here - the electrode releases electrons." },
            { label: "Cathode", at: [370, 40], tone: "green", note: "Reduction happens here - this electrode gains the electrons." },
            { label: "Salt bridge", at: [240, 155], tone: "gold", note: "Connects the two electrolytes, keeping the circuit complete without letting them mix directly." },
          ],
        },
      };
    }
    case "16.6":
      return {
        text: {
          title: "Radiochemistry · p191",
          cards: [
            { tag: "Radioactive decay", title: "Unstable isotopes lose energy as radiation to become stable", desc: "Such an isotope is called a radioisotope." },
            { tag: "Radiocarbon dating", title: "C-14 dates fossil wood or animal remains", desc: "" },
            { tag: "Diagnosis & treatment", title: "I-131 (thyroid), Na-24 (blood clots), Co-60 (cancer)", desc: "Different radioisotopes target different medical uses." },
          ],
        },
      };
    case "16.7":
      return {
        text: {
          title: "Dye chemistry · p191-193",
          cards: [
            { tag: "A good dye must be...", title: "Well-coloured, fixable, light-fast, and resistant to water/acid/alkali", desc: "" },
            { tag: "By application", title: "Acid dyes (wool/silk), direct dyes (cotton), vat dyes (cotton, e.g. indigo)", desc: "Mordant dyes need fibre pretreatment first, since they don't fix directly (e.g. alizarin)." },
            { tag: "By structure", title: "Azo, anthraquinone, indigo and several other structural classes", desc: "" },
          ],
        },
      };
    case "16.8":
      return {
        text: {
          title: "Agricultural chemistry · p193",
          cards: [
            { tag: "Goals", title: "Increase yield, improve food quality, reduce production cost", desc: "" },
            { tag: "Soil testing", title: "pH, porosity, texture", desc: "Guides which crop and which fertilizer to use." },
            { tag: "Fertilizers and pesticides", title: "NPK fertilizers; chlorinated hydrocarbons/organophosphates/carbamates as pesticides", desc: "" },
          ],
        },
      };
    case "16.9":
      return {
        text: {
          title: "Food chemistry · p193-194",
          cards: [
            { tag: "Three kinds of food", title: "Body-building (protein), energy-giving (carbs/fats), protective (vitamins/minerals)", desc: "Together in the right proportion, this makes a balanced diet." },
            { tag: "Food additives", title: "Preservatives, colourants, sweeteners, flavour enhancers, antioxidants", desc: "E.g. Vitamin C/E as antioxidants, which also protect against cardiovascular disease." },
          ],
        },
      };
    case "16.10":
      return {
        text: {
          title: "Forensic chemistry · p194-195",
          cards: [
            { tag: "Four steps", title: "Collect evidence → analyse (blood/DNA) → collaborate → report", desc: "" },
            { tag: "Fingerprints", title: "Ninhydrin turns purple, reacting with amino acids in perspiration", desc: "Reveals otherwise invisible (occult) fingerprints." },
            { tag: "Alcohol test", title: "Orange-to-green colour change is a redox reaction", desc: "Oxidation of alcohol reduces orange dichromate to green chromic ion." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit17Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b", blue = "#38bdf8", green = "#34d399";
  switch (concept.id) {
    case "17.1": {
      const ranks = ["Kingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species"];
      const colors = [gold, blue, green, gold, blue, green, gold];
      const w = 480, boxH = 24, gap = 4;
      const svg = ranks
        .map((r, i) => {
          const y = i * (boxH + gap) + 4;
          const width = w - i * 40;
          const x = (w - width) / 2;
          return `<rect x="${x}" y="${y}" width="${width}" height="${boxH}" rx="5" fill="${colors[i]}" opacity="0.85"/><text x="${w / 2}" y="${y + 17}" font-size="13" fill="black" text-anchor="middle">${r}</text>`;
        })
        .join("");
      return {
        diagram: {
          title: "The taxonomic hierarchy · broadest to narrowest",
          viewBox: `0 0 ${w} ${ranks.length * (boxH + gap) + 8}`,
          svg,
          parts: [
            { label: "Kingdom", at: [w / 2, 16], tone: "gold", note: "The broadest, largest category - e.g. Animalia." },
            { label: "Species", at: [w / 2, ranks.length * (boxH + gap) - 8], tone: "gold", note: "The narrowest, most specific category - organisms that can interbreed." },
          ],
        },
      };
    }
    case "17.2":
      return {
        text: {
          title: "Basis for classification · p200-201",
          cards: [
            { tag: "Symmetry", title: "Radial (Hydra, starfish) vs. bilateral (Frog)", desc: "Radial: cut any way through the centre, get similar halves. Bilateral: only one cut gives two identical halves." },
            { tag: "Germ layers", title: "Diploblastic (2 layers, Hydra) vs. triploblastic (3 layers, Rabbit)", desc: "Ectoderm + endoderm vs. ectoderm + mesoderm + endoderm." },
            { tag: "Coelom", title: "Acoelomate, pseudocoelomate, or (true) coelomate", desc: "No cavity (Tapeworm), false cavity (Roundworm), or true mesoderm-lined cavity (Earthworm)." },
          ],
        },
      };
    case "17.3":
      return {
        text: {
          title: "Binomial nomenclature · p203",
          cards: [
            { tag: "The system", title: "Genus (capitalized) + species (lowercase)", desc: "Introduced by Carolus Linnaeus, using Latin terms." },
            { tag: "Examples", title: "Homo sapiens (Man), Panthera tigris (Tiger)", desc: "Canis familiaris (Dog), Felis felis (Cat)." },
          ],
        },
      };
    case "17.4":
      return {
        text: {
          title: "Phylum Porifera (sponges) · p202",
          cards: [
            { tag: "Grade of organization", title: "Cellular - the simplest level", desc: "Multicellular, non-motile, mostly marine (Euplectella, Sycon)." },
            { tag: "Key structures", title: "Ostia (pores) → canal system → spicules", desc: "Water enters through ostia, circulates via the canal system carrying food and oxygen; spicules form the skeleton." },
          ],
        },
      };
    case "17.5":
      return {
        text: {
          title: "Phylum Coelenterata (Cnidaria) · p202",
          cards: [
            { tag: "Body plan", title: "Radially symmetrical, diploblastic, tissue-grade", desc: "Mesoglea (jelly-like layer) separates ectoderm and endoderm." },
            { tag: "Key structures", title: "Coelenteron (gastrovascular cavity), cnidoblasts (stinging cells)", desc: "Many show polymorphism (varied individual forms in one species). E.g. Hydra, Jellyfish." },
          ],
        },
      };
    case "17.6":
      return {
        text: {
          title: "Phylum Platyhelminthes (flatworms) · p202-203",
          cards: [
            { tag: "Body plan", title: "Bilateral, triploblastic, ACOELOMATE (no body cavity)", desc: "Mostly parasitic, using suckers/hooks to attach to a host." },
            { tag: "Key features", title: "Flame cells (excretion); hermaphrodites", desc: "E.g. Liver fluke, Tapeworm." },
          ],
        },
      };
    case "17.7":
      return {
        text: {
          title: "Phylum Aschelminthes (roundworms) · p203",
          cards: [
            { tag: "Body plan", title: "Bilateral, triploblastic, PSEUDOcoelomate", desc: "Round body, pointed at both ends, unsegmented, thin cuticle. Sexes separate." },
            { tag: "Real-world impact", title: "Cause elephantiasis and ascariasis", desc: "E.g. Ascaris, Wuchereria." },
          ],
        },
      };
    case "17.8":
      return {
        text: {
          title: "Phylum Annelida (segmented worms) · p203",
          cards: [
            { tag: "Body plan", title: "Bilateral, triploblastic - the FIRST true coelomates", desc: "Organ-system grade of organization." },
            { tag: "Key features", title: "Metameres (segments) joined by annuli", desc: "Setae and parapodia aid locomotion. E.g. Nereis, Earthworm, Leech." },
          ],
        },
      };
    case "17.9":
      return {
        text: {
          title: "Phylum Arthropoda (jointed legs) · p203",
          cards: [
            { tag: "The largest phylum", title: "Head, thorax, abdomen + paired jointed legs", desc: "Bilateral, triploblastic, coelomate." },
            { tag: "Key features", title: "Chitin exoskeleton (shed via moulting), open circulatory system", desc: "Haemolymph flows freely, not through vessels. E.g. Prawn, Crab, Cockroach, Spider, Scorpion." },
          ],
        },
      };
    case "17.10":
      return {
        text: {
          title: "Phylum Mollusca (soft-bodied animals) · p204",
          cards: [
            { tag: "Body plan", title: "Head, muscular foot, visceral mass", desc: "Soft, unsegmented, bilaterally symmetrical." },
            { tag: "Key structure", title: "The mantle secretes the hard calcareous shell", desc: "Respiration via gills, lungs, or both. E.g. Garden snail, Octopus." },
          ],
        },
      };
    case "17.11":
      return {
        text: {
          title: "Phylum Echinodermata (spiny-skinned) · p204",
          cards: [
            { tag: "Body plan", title: "Adults radially symmetrical; LARVAE bilateral", desc: "Exclusively marine, triploblastic, TRUE coelomates, organ-system grade." },
            { tag: "Key structure", title: "Water vascular system → tube feet for locomotion", desc: "Spiny calcareous ossicles cover the body. E.g. Starfish, Sea urchin." },
          ],
        },
      };
    case "17.12":
      return {
        text: {
          title: "Phylum Hemichordata · p204",
          cards: [
            { tag: "A genuine in-between", title: "Has gill slits (chordate-like), but NO notochord", desc: "Marine, soft, worm-like (vermiform), unsegmented, bilateral, coelomate." },
            { tag: "Lifestyle", title: "Ciliary feeder, mostly tube-dwelling (tubiculous)", desc: "E.g. Balanoglossus (Acorn worm)." },
          ],
        },
      };
    case "17.13":
      return {
        text: {
          title: "Phylum Chordata and Prochordata · p204-205",
          cards: [
            { tag: "Chordate features", title: "Notochord, dorsal nerve cord, paired gill pouches", desc: "All triploblastic and coelomate." },
            { tag: "Urochordata", title: "Notochord only in the larva's tail", desc: "Adults are sessile and degenerate. E.g. Ascidian." },
            { tag: "Cephalochordata", title: "Notochord runs the FULL body length", desc: "Small, fish-like. E.g. Amphioxus." },
          ],
        },
      };
    case "17.14":
      return {
        text: {
          title: "Vertebrata: jawless fish and Pisces · p205",
          cards: [
            { tag: "Cyclostomata", title: "Jawless, eel-like, circular mouth", desc: "Slimy, scaleless skin; ectoparasites of fish. E.g. Hagfish, Lamprey." },
            { tag: "Pisces", title: "Cold-blooded, jawed, aquatic, 2-chambered heart", desc: "Cartilaginous (sharks) vs. bony (carps) fishes." },
          ],
        },
      };
    case "17.15":
      return {
        text: {
          title: "Vertebrata: the four tetrapod classes · p205-207",
          cards: [
            { tag: "Amphibia", title: "Moist skin, 3-chambered heart, eggs laid in water", desc: "First 4-legged vertebrates; tadpole larva. E.g. Frog, Toad." },
            { tag: "Reptilia", title: "Scaly skin, 3-chambered heart (crocodiles: 4), tough eggs", desc: "Fully land-adapted. E.g. Lizard, Snake, Turtle." },
            { tag: "Aves", title: "Feathers, wings, pneumatic (air-filled) bones", desc: "Warm-blooded; hard-shelled, yolk-rich eggs. E.g. Pigeon, Ostrich." },
            { tag: "Mammalia", title: "Hair, mammary glands, 4-chambered heart, mostly viviparous", desc: "Placenta is the unique feature (except egg-laying Platypus). E.g. Rat, Rabbit, Man." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit18Frame(concept: ScienceConcept): BoardFrame | undefined {
  switch (concept.id) {
    case "18.1":
      return {
        text: {
          title: "Meristematic tissues · p210-211",
          cards: [
            { tag: "Apical meristem", title: "At root/shoot tips - increases LENGTH", desc: "" },
            { tag: "Intercalary meristem", title: "Between permanent tissue regions", desc: "E.g. at the base of a grass leaf or internode - lets grass regrow after mowing." },
            { tag: "Lateral meristem", title: "Increases THICKNESS", desc: "Arranged parallel to the plant's surface." },
          ],
        },
      };
    case "18.2":
      return {
        text: {
          title: "Simple permanent plant tissues · p211-212",
          cards: [
            { tag: "Parenchyma", title: "Thin-walled, living cells - storage, photosynthesis", desc: "Aerenchyma (air spaces, aquatic plants); Chlorenchyma (chloroplasts, when exposed to light)." },
            { tag: "Collenchyma", title: "Living cells, unevenly thickened walls", desc: "Provides mechanical support to growing organs, beneath the epidermis." },
            { tag: "Sclerenchyma", title: "Dead, lignified, thick-walled - fibres and sclereids", desc: "Rigid support; found in fruits, seeds and fibre-yielding plants like jute." },
          ],
        },
      };
    case "18.3":
      return {
        text: {
          title: "Complex tissue: Xylem · p212-213",
          cards: [
            { tag: "Tracheids and fibres", title: "Dead, tapering, lignified", desc: "Conduct water and provide mechanical support." },
            { tag: "Vessels", title: "Long, tube-like, dead - main water transport", desc: "Perforated end walls make the whole structure look like a pipe." },
            { tag: "Xylem parenchyma", title: "The ONLY living xylem cells", desc: "Store starch and fatty substances." },
          ],
        },
      };
    case "18.4":
      return {
        text: {
          title: "Complex tissue: Phloem · p213-214",
          cards: [
            { tag: "Sieve tubes", title: "Perforated end walls (sieve plates)", desc: "Translocate food from leaves to storage organs." },
            { tag: "Companion cells", title: "Attached to the sieve tube's lateral wall", desc: "" },
            { tag: "Phloem parenchyma & fibres", title: "Living storage cells; lignified support cells", desc: "" },
          ],
        },
      };
    case "18.5":
      return {
        text: {
          title: "Epithelial tissue: simple types · p214-215",
          cards: [
            { tag: "Squamous", title: "Thin, flat cells - protective lining", desc: "Buccal cavity, lung alveoli, skin covering." },
            { tag: "Cuboidal & Columnar", title: "Cube-shaped / tall pillar-shaped - secretion & absorption", desc: "Cuboidal: glands, kidney tubules. Columnar: stomach, intestine." },
            { tag: "Ciliated & Glandular", title: "Move mucus / secrete chemicals", desc: "Ciliated: trachea, bronchioles. Glandular: gastric and pancreatic glands." },
          ],
        },
      };
    case "18.6":
      return {
        text: {
          title: "Epithelial tissue: compound · p215-216",
          cards: [
            { tag: "Structure", title: "MULTIPLE cell layers (stratified)", desc: "Only the deepest layer rests on the basement membrane." },
            { tag: "Function", title: "Strong protection against mechanical/chemical stress", desc: "Covers dry skin and moist buccal cavity/pharynx linings." },
          ],
        },
      };
    case "18.7":
      return {
        text: {
          title: "Connective tissue proper & supportive · p216-217",
          cards: [
            { tag: "Areolar", title: "Loosely arranged fibres/cells", desc: "Joins skin to muscle; repairs tissue after injury." },
            { tag: "Adipose", title: "Fat cells (adipocytes)", desc: "Insulation and shock absorption (around kidneys, eyeballs)." },
            { tag: "Cartilage & Bone", title: "Chondrocytes in lacunae / Osteocytes in lacunae + canaliculi", desc: "Cartilage: nose tip, ear, trachea. Bone: rigid skeletal framework." },
          ],
        },
      };
    case "18.8":
      return {
        text: {
          title: "Dense and fluid connective tissue · p217-218",
          cards: [
            { tag: "Tendon", title: "Joins MUSCLE to bone", desc: "Collagen bundles, great strength, limited flexibility." },
            { tag: "Ligament", title: "Joins BONE to bone", desc: "Highly elastic, strengthens joints." },
            { tag: "Blood & Lymph", title: "RBCs (oxygen), WBCs (defence), platelets (clotting), plasma", desc: "Lymph exchanges materials between blood and tissue fluid." },
          ],
        },
      };
    case "18.9":
      return {
        text: {
          title: "Muscular tissue · p218",
          cards: [
            { tag: "Skeletal (striated)", title: "Voluntary, striped, multinucleate", desc: "Attached to bones - e.g. biceps, triceps." },
            { tag: "Smooth (non-striated)", title: "Involuntary, uninucleate, spindle-shaped", desc: "Blood vessels, intestine walls, urinary bladder." },
            { tag: "Cardiac", title: "Involuntary, rhythmic, branched with intercalated discs", desc: "Found only in the heart." },
          ],
        },
      };
    case "18.10":
      return {
        text: {
          title: "Nervous tissue · p219",
          cards: [
            { tag: "Neuron", title: "The longest cell in the body", desc: "The structural and functional unit of the nervous system." },
            { tag: "Cyton, dendrites, axon", title: "Cell body → short branched receivers → one long sender", desc: "Dendrites receive signals; the axon sends them to terminal branches." },
          ],
        },
      };
    case "18.11":
      return {
        text: {
          title: "Mitosis · p219-220",
          cards: [
            { tag: "Equational division", title: "1 cell → 2 IDENTICAL diploid (2n) cells", desc: "Discovered by Fleming, 1879." },
            { tag: "Four phases", title: "Prophase → Metaphase → Anaphase → Telophase", desc: "Metaphase: chromosomes align at the equator (metaphase plate)." },
            { tag: "Significance", title: "Growth, organ development, tissue repair", desc: "" },
          ],
        },
      };
    case "18.12":
      return {
        text: {
          title: "Meiosis · p220-221",
          cards: [
            { tag: "Reduction division", title: "1 diploid cell → 4 haploid (n) gametes", desc: "Named by Farmer, 1905. Involves two divisions." },
            { tag: "Crossing over", title: "Homologous chromosomes pair (synapsis) and exchange segments at chiasmata", desc: "Produces genetic recombination (variation)." },
            { tag: "Significance", title: "Keeps chromosome number constant across generations", desc: "" },
          ],
        },
      };
    case "18.13":
      return {
        text: {
          title: "Mitosis vs. meiosis · p221-222",
          cards: [
            { tag: "Where", title: "Mitosis: somatic (body) cells. Meiosis: reproductive cells only.", desc: "" },
            { tag: "Result", title: "Mitosis: 2 identical diploid cells (1 division). Meiosis: 4 non-identical haploid cells (2 divisions).", desc: "" },
            { tag: "Purpose", title: "Mitosis: growth/repair, continuous. Meiosis: gamete formation, only during reproduction.", desc: "" },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit19Frame(concept: ScienceConcept): BoardFrame | undefined {
  const gold = "#f59e0b", blue = "#38bdf8", green = "#34d399";
  switch (concept.id) {
    case "19.1":
      return {
        text: {
          title: "Types of tropism · p226",
          cards: [
            { tag: "Phototropism & Geotropism", title: "Toward light / in response to gravity", desc: "E.g. shoot (light), root (gravity)." },
            { tag: "Hydrotropism & Thigmotropism", title: "Toward water / in response to touch", desc: "E.g. root (water), climbing vines (touch)." },
            { tag: "Chemotropism", title: "In response to a chemical", desc: "E.g. pollen tube growing toward sugar on the stigma." },
          ],
        },
      };
    case "19.2":
      return {
        text: {
          title: "Positive and negative tropism · p226-227",
          cards: [
            { tag: "The rule", title: "Positive = toward the stimulus; negative = away from it", desc: "" },
            { tag: "Typical shoot", title: "Positively phototropic, negatively geotropic", desc: "Grows toward light, away from gravity." },
            { tag: "Typical root - and an exception", title: "Negatively phototropic, positively geotropic", desc: "Except Rhizophora (mangrove): its roots are negatively geotropic, turning 180° upright for respiration." },
          ],
        },
      };
    case "19.3":
      return {
        text: {
          title: "Nastic movements · p227-228",
          cards: [
            { tag: "Photonasty", title: "Response to light", desc: "Taraxacum blooms morning, closes evening. Ipomea alba (moonflower) does the reverse." },
            { tag: "Thigmonasty (Seismonasty)", title: "Response to touch", desc: "Mimosa pudica folds its leaves; the Venus flytrap shows one of the fastest known nastic movements." },
            { tag: "Thermonasty", title: "Response to temperature", desc: "Tulip flowers bloom as temperature rises." },
          ],
        },
      };
    case "19.4":
      return {
        text: {
          title: "Tropic vs. nastic movements · p228",
          cards: [
            { tag: "Tropic", title: "Unidirectional, growth-dependent, slow", desc: "Permanent/irreversible; found in ALL plants." },
            { tag: "Nastic", title: "Non-directional, growth-independent, immediate", desc: "Temporary/reversible; found only in a FEW specialized plants." },
          ],
        },
      };
    case "19.5":
      return {
        text: {
          title: "Photosynthesis · p228-229",
          cards: [
            { tag: "The word", title: "'Building up with the help of light'", desc: "Converts light energy into chemical energy." },
            { tag: "The equation", title: "6CO2 + 12H2O → C6H12O6 + 6H2O + 6O2", desc: "Requires sunlight and chlorophyll." },
            { tag: "Autotrophic nutrition", title: "Green plants make their own food", desc: "Glucose produced is converted to starch for storage." },
          ],
        },
      };
    case "19.6":
      return {
        text: {
          title: "Requirements for photosynthesis · p228-229",
          cards: [
            { tag: "The four requirements", title: "Chlorophyll, water, carbon dioxide, sunlight", desc: "Demonstrated by de-starching a plant, covering part of a leaf, then testing with iodine." },
            { tag: "The result", title: "Only light-exposed, chlorophyll-containing parts turn blue-black with iodine", desc: "Proving starch (from photosynthesis) formed only there." },
          ],
        },
      };
    case "19.7":
      return {
        text: {
          title: "Transpiration: types and importance · p229",
          cards: [
            { tag: "Stomatal", title: "90-95% of water loss - through stomata", desc: "" },
            { tag: "Cuticular & Lenticular", title: "Through the cuticle / through lenticels in bark", desc: "The remaining minor routes of water loss." },
            { tag: "Why it matters", title: "Pull in leaf/stem, root absorption force, mineral supply, temperature regulation", desc: "" },
          ],
        },
      };
    case "19.8": {
      const svg = `
        <ellipse cx="200" cy="100" rx="70" ry="30" fill="none" stroke="${green}" stroke-width="6" transform="rotate(-20 200 100)"/>
        <ellipse cx="320" cy="100" rx="70" ry="30" fill="none" stroke="${green}" stroke-width="6" transform="rotate(20 320 100)"/>
        <ellipse cx="260" cy="100" rx="22" ry="12" fill="${gold}"/>
        <path d="M180 40 L340 40" stroke="white" stroke-width="2" stroke-dasharray="5 5" opacity="0.4"/>
      `;
      return {
        diagram: {
          title: "Stomata · guard cells controlling a central pore",
          viewBox: "0 0 480 170",
          svg,
          parts: [
            { label: "Guard cells", at: [200, 100], tone: "green", note: "A pair of curved cells that change shape to open or close the pore between them." },
            { label: "Stoma (pore)", at: [260, 100], tone: "gold", note: "Water vapour, CO2 and O2 pass in and out through this opening, whose size the guard cells control." },
          ],
        },
      };
    }
    default:
      return undefined;
  }
}

function unit20Frame(concept: ScienceConcept): BoardFrame | undefined {
  switch (concept.id) {
    case "20.1":
      return {
        text: {
          title: "Organ systems overview · p234",
          cards: [
            { tag: "Skeletal, Muscular, Nervous", title: "Support / movement / control", desc: "Skull, vertebral column etc. → support. Muscle fibres → movement. Brain, spinal cord, nerves → impulse conduction." },
            { tag: "Circulatory, Respiratory, Digestive, Excretory", title: "Transport, breathing, digestion, waste removal", desc: "" },
            { tag: "Endocrine system", title: "Coordinates ALL the other organ systems", desc: "Pituitary, thyroid, adrenals, pancreas and more." },
          ],
        },
      };
    case "20.2":
      return {
        text: {
          title: "Mouth, teeth and salivary glands · p235-236",
          cards: [
            { tag: "Two sets of teeth", title: "20 milk teeth → 32 permanent teeth", desc: "Four types: incisors (8, cutting), canines (4, tearing), premolars (8, crushing), molars (12, crushing/grinding)." },
            { tag: "Three salivary gland pairs", title: "Parotid (largest), sublingual (smallest), submandibular", desc: "Secrete ~1.5 L saliva/day." },
            { tag: "Ptyalin", title: "Converts starch → maltose", desc: "Saliva also contains the antibacterial enzyme lysozyme." },
          ],
        },
      };
    case "20.3":
      return {
        text: {
          title: "Pharynx, oesophagus and stomach · p236",
          cards: [
            { tag: "Peristalsis", title: "Wave-like muscle contractions", desc: "Moves the food bolus down the oesophagus to the stomach." },
            { tag: "Gastric juice", title: "Mucus + HCl + pepsin/rennin", desc: "HCl activates pepsinogen into active pepsin, and kills swallowed bacteria." },
            { tag: "Chyme", title: "The semi-digested food leaving the stomach", desc: "Passes slowly into the intestine through the pylorus." },
          ],
        },
      };
    case "20.4":
      return {
        text: {
          title: "Small intestine: duodenum, jejunum, ileum · p236-237",
          cards: [
            { tag: "Duodenum", title: "C-shaped; receives bile duct + pancreatic duct", desc: "" },
            { tag: "Jejunum", title: "Short middle part", desc: "Secretes intestinal juice (sucrase, maltase, lactase, lipase)." },
            { tag: "Ileum", title: "The LONGEST part - lined with ~4 million villi", desc: "Where the actual absorption of digested food happens." },
          ],
        },
      };
    case "20.5":
      return {
        text: {
          title: "The liver · p237",
          cards: [
            { tag: "Bile", title: "Emulsifies fat droplets", desc: "Made by the liver, stored temporarily in the gall bladder." },
            { tag: "Blood clotting", title: "Produces fibrinogen and prothrombin", desc: "" },
            { tag: "Storage & detox", title: "Stores iron, copper, vitamins A & D; detoxifies drugs/alcohol", desc: "Also destroys old red blood cells and produces heparin." },
          ],
        },
      };
    case "20.6":
      return {
        text: {
          title: "The pancreas and digestive enzymes · p237-238",
          cards: [
            { tag: "Exocrine role", title: "Pancreatic juice: lipase, trypsin, amylase", desc: "Act on fats, proteins and starch respectively." },
            { tag: "Endocrine role", title: "Islets of Langerhans: alpha cells → glucagon, beta cells → insulin", desc: "" },
            { tag: "Intestinal enzymes", title: "Maltase, lactase, sucrase, lipase", desc: "Complete the breakdown of sugars and fats." },
          ],
        },
      };
    case "20.7":
      return {
        text: {
          title: "Absorption, assimilation, large intestine · p237-238",
          cards: [
            { tag: "Absorption vs. assimilation", title: "Villi absorb nutrients → incorporated into tissue cells", desc: "Excess sugar becomes glycogen (liver); excess fat is stored in adipose tissue." },
            { tag: "Large intestine", title: "Caecum (with vestigial appendix) → colon → rectum", desc: "~1.5 m long." },
            { tag: "Egestion", title: "Undigested food leaves as faeces, through the anus", desc: "" },
          ],
        },
      };
    case "20.8":
      return {
        text: {
          title: "Skin as an excretory organ · p239",
          cards: [
            { tag: "Sweat", title: "Water + ammonia, urea, lactic acid, salts (mainly NaCl)", desc: "Released when the body (normally ~37°C) gets hot." },
            { tag: "Lungs, too", title: "Eliminate CO2 and water vapour", desc: "" },
            { tag: "Skin's scale", title: "~15% of an adult's body weight", desc: "" },
          ],
        },
      };
    case "20.9":
      return {
        text: {
          title: "Kidney structure and function · p239-240",
          cards: [
            { tag: "Structure", title: "Bean-shaped; outer cortex, inner medulla", desc: "Right kidney sits lower (liver takes space on the right)." },
            { tag: "Functions", title: "Fluid/electrolyte balance, acid-base regulation, osmotic pressure", desc: "Also retains essential substances like glucose and amino acids." },
          ],
        },
      };
    case "20.10":
      return {
        text: {
          title: "Structure of the nephron · p240",
          cards: [
            { tag: "Renal corpuscle", title: "Bowman's capsule + glomerulus (capillaries)", desc: "Blood enters via the afferent arteriole, leaves via the efferent arteriole." },
            { tag: "Renal tubule", title: "Proximal tubule → loop of Henle → distal tubule → collecting tubule", desc: "" },
            { tag: "Scale", title: "Over 1 million nephrons per kidney", desc: "" },
          ],
        },
      };
    case "20.11":
      return {
        text: {
          title: "Mechanism of urine formation · p240-241",
          cards: [
            { tag: "1. Glomerular filtration", title: "Blood filtered through glomerulus/Bowman's capsule", desc: "" },
            { tag: "2. Tubular reabsorption", title: "Glucose, amino acids, water reabsorbed (proximal tubule)", desc: "" },
            { tag: "3. Tubular secretion", title: "H+/K+ ions added → final urine", desc: "170-180 L filtered daily, only ~1% becomes urine." },
          ],
        },
      };
    case "20.12":
      return {
        text: {
          title: "Male reproductive system · p241-242",
          cards: [
            { tag: "Testes", title: "Male gonads - produce sperm and testosterone", desc: "Epididymis nourishes developing sperm." },
            { tag: "Scrotum", title: "Keeps testes 1-3°C cooler than body temperature", desc: "Necessary for sperm formation (spermatogenesis)." },
            { tag: "Vas deferens & accessory glands", title: "Carry sperm; seminal vesicles/prostate/Cowper's form semen", desc: "" },
          ],
        },
      };
    case "20.13":
      return {
        text: {
          title: "Female reproductive system · p242-243",
          cards: [
            { tag: "Ovaries", title: "Female gonads - produce ova, oestrogen, progesterone", desc: "" },
            { tag: "Fallopian tubes", title: "Fimbriae pick up the released ovum", desc: "" },
            { tag: "Uterus, cervix, vagina", title: "Foetus develops in uterus; vagina is the birth canal", desc: "" },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit21Frame(concept: ScienceConcept): BoardFrame | undefined {
  switch (concept.id) {
    case "21.1":
      return {
        text: {
          title: "Carbohydrates, proteins and fats · p247-248",
          cards: [
            { tag: "Carbohydrates", title: "Chief energy source", desc: "Monosaccharide (glucose), disaccharide (sucrose), polysaccharide (cellulose)." },
            { tag: "Proteins", title: "Building blocks - growth and repair", desc: "9 essential amino acids can't be made by the body; must come from diet." },
            { tag: "Fats", title: "Energy + cell structure", desc: "Essential fatty acids (omega fatty acids) must also come from diet." },
          ],
        },
      };
    case "21.2":
      return {
        text: {
          title: "Fat-soluble vitamins · p249",
          cards: [
            { tag: "A (Retinol)", title: "Deficiency → night blindness, xerophthalmia", desc: "" },
            { tag: "D (Calciferol)", title: "Deficiency → rickets (children)", desc: "The 'sunshine vitamin' - made by skin in sunlight." },
            { tag: "E (Tocopherol) & K", title: "Deficiency → sterility / bleeding disorders", desc: "Vitamin K deficiency prevents normal blood clotting." },
          ],
        },
      };
    case "21.3":
      return {
        text: {
          title: "Water-soluble vitamins · p249",
          cards: [
            { tag: "B1, B2, B3", title: "Beriberi, Ariboflavinosis, Pellagra", desc: "Thiamine, riboflavin, niacin deficiencies respectively." },
            { tag: "B6, B12", title: "Dermatitis; Pernicious anaemia", desc: "Pyridoxine and cyanocobalamine deficiencies." },
            { tag: "C (Ascorbic acid)", title: "Deficiency → Scurvy", desc: "Bleeding gums, slow wound healing." },
          ],
        },
      };
    case "21.4":
      return {
        text: {
          title: "Minerals: macro and micro · p250",
          cards: [
            { tag: "Macrominerals", title: "Calcium, sodium, potassium", desc: "Bones/clotting, fluid balance, nerve/muscle activity." },
            { tag: "Microminerals (trace)", title: "Iron, iodine", desc: "Iron → haemoglobin (deficiency: anaemia). Iodine → thyroid hormones (deficiency: goitre)." },
          ],
        },
      };
    case "21.5":
      return {
        text: {
          title: "Protein energy malnutrition (PEM) · p250",
          cards: [
            { tag: "Kwashiorkor", title: "Children 1-5 years", desc: "Diet has carbohydrates but lacks protein." },
            { tag: "Marasmus", title: "Infants under 1 year", desc: "Diet poor in carbohydrates, fats AND proteins together." },
          ],
        },
      };
    case "21.6":
      return {
        text: {
          title: "Food hygiene and spoilage · p250",
          cards: [
            { tag: "Signs of spoilage", title: "Changes in appearance, colour, texture, odour, taste", desc: "" },
            { tag: "Internal factors", title: "Enzymatic activity, moisture content", desc: "" },
            { tag: "External factors", title: "Adulterants, contaminated utensils, unhygienic storage", desc: "" },
          ],
        },
      };
    case "21.7":
      return {
        text: {
          title: "Methods of food preservation · p250-251",
          cards: [
            { tag: "Drying & Smoking", title: "Remove moisture / smoke's drying action", desc: "" },
            { tag: "Freezing & Cold storage", title: "Below 0°C - stops microbial growth, slows reactions", desc: "" },
            { tag: "Pasteurization & Canning", title: "63°C for 30 min then rapid cooling / sealed sterilized containers", desc: "" },
          ],
        },
      };
    case "21.8":
      return {
        text: {
          title: "Natural and synthetic preservatives · p251",
          cards: [
            { tag: "Salt", title: "Removes moisture via osmosis", desc: "" },
            { tag: "Sugar/honey & Oil", title: "Hygroscopic (absorbs moisture) / blocks air contact", desc: "" },
            { tag: "Synthetic preservatives", title: "Sodium benzoate, citric acid, vinegar and others", desc: "Delay microbial growth in sauces, jams, packaged foods." },
          ],
        },
      };
    case "21.9":
      return {
        text: {
          title: "Food adulteration: types · p252",
          cards: [
            { tag: "Natural adulterants", title: "Naturally occurring toxins", desc: "E.g. Prussic acid in apple/cherry seeds." },
            { tag: "Incidental adulterants", title: "Added unknowingly", desc: "Pesticide residues, pest droppings, microbial contamination." },
            { tag: "Intentionally added adulterants", title: "Added deliberately for profit", desc: "Calcium carbide (ripening), toxic colours, wax coatings." },
          ],
        },
      };
    case "21.10":
      return {
        text: {
          title: "Health effects of adulterated food · p252",
          cards: [
            { tag: "Common effects", title: "Fever, diarrhoea, nausea, vomiting, allergies", desc: "" },
            { tag: "Serious effects", title: "Kidney/liver failure, colon cancer, birth defects", desc: "Also neurological disorders and immune suppression." },
          ],
        },
      };
    case "21.11":
      return {
        text: {
          title: "Food quality control: the law · p252-253",
          cards: [
            { tag: "1954 Act", title: "Prevention of Food Adulteration Act", desc: "Rules added in 1955 - sets minimum quality/hygiene standards." },
            { tag: "The goal", title: "Pure food, protection from fraud", desc: "World Health Day 2015 slogan: 'From farm to plate, make food safe.'" },
          ],
        },
      };
    case "21.12":
      return {
        text: {
          title: "Food quality control agencies · p253",
          cards: [
            { tag: "ISI", title: "Industrial products (Bureau of Indian Standards)", desc: "" },
            { tag: "AGMARK & FPO", title: "Agricultural/livestock products; fruit products", desc: "" },
            { tag: "FCI & FSSAI", title: "Food grain distribution/price support; overall food safety regulation", desc: "FCI established 1965." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit22Frame(concept: ScienceConcept): BoardFrame | undefined {
  switch (concept.id) {
    case "22.1":
      return {
        text: {
          title: "Bacteria: shapes and structure · p258-259",
          cards: [
            { tag: "Prokaryotic", title: "No true nucleus - just a nucleoid", desc: "Single-celled, 1-10 μm long." },
            { tag: "Three shapes", title: "Cocci (spherical), bacilli (rod), spirilla (spiral)", desc: "" },
            { tag: "Structure", title: "Cell wall, membrane, ribosomes, plasmid (extra DNA)", desc: "Some have flagella (motility) or a protective capsule." },
          ],
        },
      };
    case "22.2":
      return {
        text: {
          title: "Viruses: structure and characters · p259",
          cards: [
            { tag: "Structure", title: "Protein coat around DNA or RNA", desc: "18-400 nm in size; a single particle is a virion." },
            { tag: "Living traits", title: "Replicating genetic material, multiply in host cells", desc: "Attack specific hosts." },
            { tag: "Non-living traits", title: "Inert outside a host, no cell membrane/organelles", desc: "Can be crystallised." },
          ],
        },
      };
    case "22.3":
      return {
        text: {
          title: "Types of viruses, fungi and prions · p259-260",
          cards: [
            { tag: "Virus types", title: "Plant (TMV), animal (HIV, Influenza, Polio), bacteriophage (T4)", desc: "" },
            { tag: "Fungi", title: "No chlorophyll - parasites or saprophytes", desc: "Yeast (single-celled); mycelium of hyphae (multicellular)." },
            { tag: "Prions", title: "Protein-only infectious particles, no nucleic acid", desc: "Found in neurons - cause nervous tissue degeneration." },
          ],
        },
      };
    case "22.4":
      return {
        text: {
          title: "Microbes in agriculture · p261",
          cards: [
            { tag: "Biofertilizers", title: "Free-living (Azotobacter, Nostoc) & symbiotic (Rhizobium, Frankia)", desc: "Enrich soil by fixing atmospheric nitrogen." },
            { tag: "Biocontrol agents", title: "Bacillus thuringiensis (Bt) produces 'cry' protein", desc: "Toxic to insect larvae - a natural biopesticide." },
          ],
        },
      };
    case "22.5":
      return {
        text: {
          title: "Microbes in industry · p261",
          cards: [
            { tag: "Fermented products", title: "Wine (Saccharomyces cerevisiae), curd (Lactobacillus)", desc: "Bacillus megaterium cures coffee/tea/tobacco leaves for aroma." },
            { tag: "Organic acids", title: "Oxalic, acetic, citric acid from Aspergillus niger", desc: "" },
            { tag: "Enzymes & vitamins", title: "Lipases, proteases; yeasts rich in Vitamin B complex", desc: "" },
          ],
        },
      };
    case "22.6":
      return {
        text: {
          title: "Microbes in medicine: antibiotics · p261",
          cards: [
            { tag: "Fleming, 1929", title: "Discovered the first antibiotic - penicillin", desc: "" },
            { tag: "From bacteria", title: "Streptomycin, Erythromycin, Bacitracin", desc: "" },
            { tag: "From fungi", title: "Penicillin (P. notatum), Cephalosporin", desc: "" },
          ],
        },
      };
    case "22.7":
      return {
        text: {
          title: "Microbes in medicine: vaccines · p261-262",
          cards: [
            { tag: "Live attenuated", title: "MMR, BCG", desc: "" },
            { tag: "Inactivated (killed)", title: "IPV (Polio)", desc: "" },
            { tag: "Subunit & Toxoid", title: "Hepatitis B vaccine; TT, Diphtheria toxoid", desc: "" },
          ],
        },
      };
    case "22.8":
      return {
        text: {
          title: "Classifying diseases · p262",
          cards: [
            { tag: "By occurrence", title: "Endemic, epidemic, pandemic, sporadic", desc: "Goitre (endemic), Influenza (epidemic), AIDS (pandemic), Malaria (sporadic)." },
            { tag: "Infectious", title: "Communicable - external pathogens", desc: "E.g. TB, Cholera." },
            { tag: "Non-infectious", title: "Non-communicable - internal causes", desc: "E.g. Diabetes, Cancer." },
          ],
        },
      };
    case "22.9":
      return {
        text: {
          title: "How disease manifests · p262-263",
          cards: [
            { tag: "Point of entry", title: "Contaminated air/water/food, contact, infected animals", desc: "" },
            { tag: "Reservoir of infection", title: "Where a pathogen thrives WITHOUT causing disease", desc: "Water, soil, animal populations." },
            { tag: "Incubation period & harmful effects", title: "Gap before symptoms; tissue damage or toxin secretion", desc: "" },
          ],
        },
      };
    case "22.10":
      return {
        text: {
          title: "Airborne diseases · p263-264",
          cards: [
            { tag: "Viral", title: "Common Cold, Influenza, Measles, Mumps, Chicken Pox", desc: "" },
            { tag: "Bacterial", title: "Tuberculosis (lungs), Diphtheria (throat), Whooping Cough", desc: "" },
          ],
        },
      };
    case "22.11":
      return {
        text: {
          title: "Waterborne diseases · p264",
          cards: [
            { tag: "Bacterial", title: "Cholera (Vibrio cholerae), Typhoid (Salmonella typhi)", desc: "" },
            { tag: "Viral", title: "Poliomyelitis, Hepatitis A, Acute Diarrhoea (Rotavirus)", desc: "" },
          ],
        },
      };
    case "22.12":
      return {
        text: {
          title: "Malaria · p265",
          cards: [
            { tag: "Cause", title: "Plasmodium protozoan (4 species)", desc: "P. falciparum is malignant/fatal." },
            { tag: "Spread", title: "Female Anopheles mosquito bite", desc: "~300 million infected worldwide yearly." },
            { tag: "Treatment", title: "Quinine drugs", desc: "Ronald Ross proved mosquito transmission (Nobel Prize, 1902)." },
          ],
        },
      };
    case "22.13":
      return {
        text: {
          title: "Chikungunya, Dengue, Filaria and mosquito control · p265-266",
          cards: [
            { tag: "Chikungunya & Dengue", title: "Both spread by Aedes aegypti", desc: "Dengue = 'break bone fever' - intense joint/muscle pain." },
            { tag: "Filaria", title: "Wuchereria bancrofti worm, Culex mosquito", desc: "Chronic form causes elephantiasis." },
            { tag: "Prevention", title: "Nets, repellents, no stagnant water, insecticides", desc: "" },
          ],
        },
      };
    case "22.14":
      return {
        text: {
          title: "Diseases transmitted by animals · p266-267",
          cards: [
            { tag: "Swine Flu", title: "H1N1 virus, from pigs, airborne, respiratory system", desc: "Declared pandemic by WHO in June 2009." },
            { tag: "Avian Influenza", title: "H5N1 virus, from birds (poultry/wild/pet)", desc: "Spread via contact with infected birds' secretions." },
          ],
        },
      };
    case "22.15":
      return {
        text: {
          title: "Sexually transmitted diseases · p267-268",
          cards: [
            { tag: "AIDS", title: "HIV (retrovirus) attacks white blood cells", desc: "Weakens immunity - via sexual contact, blood, needles, mother-to-foetus." },
            { tag: "Hepatitis B", title: "HBV damages the liver (cirrhosis)", desc: "" },
            { tag: "Others", title: "Gonorrhoea, Syphilis (bacterial); Genital Herpes, Warts (viral)", desc: "" },
          ],
        },
      };
    case "22.16":
      return {
        text: {
          title: "Immunization: vaccine types and schedule · p268-269",
          cards: [
            { tag: "Live vaccines", title: "Weakened living pathogen", desc: "E.g. BCG, Oral Polio Vaccine." },
            { tag: "Killed vaccines", title: "Heat/chemical-killed - needs a booster dose", desc: "E.g. Typhoid, Cholera vaccines." },
            { tag: "History", title: "Jenner introduced vaccination; Pasteur coined 'vaccine'", desc: "WHO's 1970 schedule starts with BCG at birth." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit23Frame(concept: ScienceConcept): BoardFrame | undefined {
  switch (concept.id) {
    case "23.1":
      return {
        text: {
          title: "Horticulture: its four branches · p273-275",
          cards: [
            { tag: "Pomology & Olericulture", title: "Fruit farming; vegetable farming", desc: "Olericulture includes kitchen, commercial and greenhouse/forcing growing." },
            { tag: "Floriculture", title: "Flower and ornamental plant farming", desc: "Cut flowers, essential oils, beautification." },
            { tag: "Landscape gardening", title: "Designing outdoor spaces to imitate nature", desc: "" },
          ],
        },
      };
    case "23.2":
      return {
        text: {
          title: "Manuring: types of organic manure · p275",
          cards: [
            { tag: "Animal manure", title: "Farmyard (~0.5% N) vs. sheep/goat manure (~3% N)", desc: "Sheep/goat manure is richer in nutrients." },
            { tag: "Compost", title: "Decomposed organic matter (crop/animal/food waste)", desc: "" },
            { tag: "Green manure", title: "Undecomposed green legume material (e.g. Sunhemp)", desc: "Improves soil structure and water retention." },
          ],
        },
      };
    case "23.3":
      return {
        text: {
          title: "Biofertilizers: types · p275-276",
          cards: [
            { tag: "Rhizobium & Azospirillum", title: "Legume root nodules / boosts cereal yield 5-20%", desc: "" },
            { tag: "Azotobacter & Mycorrhizae", title: "Boosts wheat/rice yield / boosts phosphorus uptake", desc: "" },
            { tag: "Azolla", title: "Floating fern, fixes nitrogen via symbiotic Anabaena", desc: "Powered by its own photosynthesis." },
          ],
        },
      };
    case "23.4":
      return {
        text: {
          title: "Medicinal plants · p276-277",
          cards: [
            { tag: "Quinine (Cinchona bark)", title: "Malaria, pneumonia", desc: "" },
            { tag: "Reserpine (Sarpagandha root)", title: "Blood pressure, snakebite antidote", desc: "" },
            { tag: "Alkaloids (Catharanthus roseus)", title: "Leukemia, cancer", desc: "Papain (papaya) treats dengue." },
          ],
        },
      };
    case "23.5":
      return {
        text: {
          title: "Mushroom cultivation · p277-278",
          cards: [
            { tag: "Composting & Spawning", title: "Paddy straw + cow dung (~50°C) → mycelium 'seed' sown", desc: "" },
            { tag: "Casing & Pinning", title: "Soil layer for humidity → buds ('pins') form", desc: "" },
            { tag: "Harvesting", title: "Grows ~3 cm/week at 15-23°C", desc: "" },
          ],
        },
      };
    case "23.6":
      return {
        text: {
          title: "Hydroponics, aeroponics and aquaponics · p278-279",
          cards: [
            { tag: "Hydroponics", title: "Roots submerged in nutrient water", desc: "Need mechanical support - roots don't anchor." },
            { tag: "Aeroponics", title: "Roots hang in air, misted with nutrients", desc: "Roots dry out fast if misting stops." },
            { tag: "Aquaponics", title: "Fish waste → nitrifying bacteria → nitrates → plant food", desc: "Combines aquaculture and hydroponics." },
          ],
        },
      };
    case "23.7":
      return {
        text: {
          title: "Dairy farming: cattle breeds · p279-280",
          cards: [
            { tag: "Indigenous vs. Exotic", title: "Sahiwal, Gir (disease-resistant) vs. Jersey, Holstein (long lactation)", desc: "Indian cows/bulls = Bos indicus; buffaloes = Bos bubalis." },
            { tag: "Draught breeds", title: "Kangayam, Hallikar - farm labour", desc: "" },
            { tag: "Dual-purpose breeds", title: "Haryana, Ongole - milk AND labour", desc: "" },
          ],
        },
      };
    case "23.8":
      return {
        text: {
          title: "Cattle feed and livestock improvement · p280-281",
          cards: [
            { tag: "Feed types", title: "Roughages (fodder) and concentrates (high protein/carbs)", desc: "" },
            { tag: "Intensive Cattle Development", title: "Cross-breeding indigenous × exotic cows", desc: "" },
            { tag: "Operation Flood", title: "Dr. Verghese Kurien, NDDB - boosted national milk supply", desc: "" },
          ],
        },
      };
    case "23.9":
      return {
        text: {
          title: "Aquaculture · p281-282",
          cards: [
            { tag: "Freshwater aquaculture", title: "Ponds/rivers/lakes - Tilapia, carps, catfish", desc: "" },
            { tag: "Mariculture", title: "Sea coast/deep sea - shrimps, pearl oysters, salmon", desc: "" },
            { tag: "Goal", title: "The 'Blue Revolution' - major export/employment sector", desc: "" },
          ],
        },
      };
    case "23.10":
      return {
        text: {
          title: "Pisciculture: methods and ponds · p282",
          cards: [
            { tag: "Culture types", title: "Extensive, intensive, mono/poly, integrated", desc: "" },
            { tag: "Pond stages", title: "Breeding → hatching → nursery → rearing → stocking", desc: "" },
          ],
        },
      };
    case "23.11":
      return {
        text: {
          title: "Cultivable fishes and nutritional value · p282",
          cards: [
            { tag: "Freshwater / Marine", title: "Catla, Rohu, Mrigal / Sea bass, Milk fish", desc: "" },
            { tag: "Nutrition", title: "Essential amino acids, PUFA, minerals, vitamins A/D/B-complex", desc: "" },
          ],
        },
      };
    case "23.12":
      return {
        text: {
          title: "Prawn culture · p282-283",
          cards: [
            { tag: "Marine / Freshwater", title: "Penaeus species / Macrobrachium species", desc: "" },
            { tag: "Methods", title: "Seed collection/hatchery; Paddy-cum-prawn (Pokkali)", desc: "Pokkali culture is Kerala's traditional method." },
          ],
        },
      };
    case "23.13":
      return {
        text: {
          title: "Vermitechnology · p283-284",
          cards: [
            { tag: "Vermiculture", title: "Rearing earthworms artificially", desc: "Perionyx excavatus, Eisenia fetida, Eudrilus eugeniae." },
            { tag: "Vermicomposting", title: "Bio-waste → nutrient-rich castings (~60 days, bin method)", desc: "Pathogen-free, rich in beneficial microflora." },
          ],
        },
      };
    case "23.14":
      return {
        text: {
          title: "Apiculture: bee types and varieties · p284-285",
          cards: [
            { tag: "Queen, Drones, Workers", title: "Egg-layer / fertilize queen / collect honey+defend hive", desc: "" },
            { tag: "Indigenous varieties", title: "Apis dorsata, Apis florea, Apis indica", desc: "" },
            { tag: "Exotic variety", title: "Apis mellifera (Italian bee)", desc: "" },
          ],
        },
      };
    case "23.15":
      return {
        text: {
          title: "Products from honey bees · p285-286",
          cards: [
            { tag: "Honey formation", title: "Nectar + acidic secretion → enzymatic conversion", desc: "Stored in hexagonal wax comb cells." },
            { tag: "Key facts", title: "Formic acid preserves it; invertase is the key enzyme", desc: "" },
            { tag: "Uses", title: "Antiseptic, builds haemoglobin, soothes sore throat", desc: "Other products: beeswax, royal jelly, propolis, venom." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function unit24Frame(concept: ScienceConcept): BoardFrame | undefined {
  switch (concept.id) {
    case "24.1":
      return {
        text: {
          title: "Biosphere and the water cycle · p290-292",
          cards: [
            { tag: "Biotic / Abiotic", title: "Living factors vs. temperature, water, soil, air, sunlight", desc: "" },
            { tag: "Water cycle processes", title: "Evaporation, sublimation, transpiration, condensation", desc: "Then precipitation, runoff, infiltration, percolation." },
            { tag: "Human impacts", title: "Urbanisation, plastic dumping, pollution, deforestation", desc: "" },
          ],
        },
      };
    case "24.2":
      return {
        text: {
          title: "The nitrogen cycle · p292-293",
          cards: [
            { tag: "Fixation → Assimilation", title: "Rhizobium etc. fix N₂ → plants absorb nitrates", desc: "" },
            { tag: "Ammonification → Nitrification", title: "Bacteria/fungi decompose waste → oxidised to nitrates", desc: "Nitrosomonas, Nitrobacter carry out nitrification." },
            { tag: "Denitrification", title: "Pseudomonas returns nitrogen gas to the air", desc: "" },
          ],
        },
      };
    case "24.3":
      return {
        text: {
          title: "The carbon cycle and greenhouse effect · p293-294",
          cards: [
            { tag: "In: Photosynthesis", title: "CO2 → plants → herbivores → carnivores", desc: "" },
            { tag: "Out: Respiration, decomposition, burning, volcanoes", title: "Returns CO2 to the atmosphere", desc: "" },
            { tag: "Human impact", title: "Fossil fuels + deforestation → more CO2 → greenhouse effect", desc: "Leads to global warming." },
          ],
        },
      };
    case "24.4":
      return {
        text: {
          title: "Hydrophytes: plants adapted to water · p294",
          cards: [
            { tag: "Challenges", title: "Excess water, currents, changing levels, need buoyancy", desc: "" },
            { tag: "Adaptations", title: "Poor/absent roots (Hydrilla, Wolffia); reduced body (Lemna)", desc: "Narrow submerged leaves; long-stalked floating leaves (Lotus)." },
            { tag: "Buoyancy", title: "Air-filled spongy petioles (Eichhornia)", desc: "" },
          ],
        },
      };
    case "24.5":
      return {
        text: {
          title: "Xerophytes: plants adapted to dry habitats · p294-295",
          cards: [
            { tag: "Needs", title: "Absorb + retain max water, minimise transpiration", desc: "" },
            { tag: "Adaptations", title: "Very deep roots (Calotropis); succulent tissue (Opuntia)", desc: "Small waxy leaves (Acacia); leaves as spines (Opuntia)." },
          ],
        },
      };
    case "24.6":
      return {
        text: {
          title: "Mesophytes: plants of moderate habitats · p295",
          cards: [
            { tag: "Habitat", title: "Neither too wet nor too dry - no extreme adaptations", desc: "" },
            { tag: "Features", title: "Well-developed roots, broad thin leaves, waxy cuticle", desc: "Stomata close under extreme heat/wind to prevent transpiration." },
          ],
        },
      };
    case "24.7":
      return {
        text: {
          title: "Adaptations of the bat · p295",
          cards: [
            { tag: "Nocturnality & Flight", title: "Avoids daytime heat/energy cost; forelimbs as wings", desc: "" },
            { tag: "Hibernation", title: "Lowered temperature/metabolism while resting", desc: "" },
            { tag: "Echolocation", title: "Ultrasonic sounds reflect off prey as echoes", desc: "" },
          ],
        },
      };
    case "24.8":
      return {
        text: {
          title: "Adaptations of the earthworm · p296",
          cards: [
            { tag: "Body & Skin", title: "Streamlined, segmented body; mucus-covered moist skin", desc: "" },
            { tag: "Setae & Aestivation", title: "Anchor/move in burrows; dormancy during heat/dryness", desc: "" },
            { tag: "Photophobic nocturnality", title: "Senses light via skin photoreceptors (no eyes)", desc: "" },
          ],
        },
      };
    case "24.9":
      return {
        text: {
          title: "Water conservation: importance and measures · p296",
          cards: [
            { tag: "Industrial", title: "Dry cooling systems, water reuse", desc: "" },
            { tag: "Agricultural", title: "Lined canals, drip irrigation, drought-resistant crops", desc: "" },
            { tag: "Domestic", title: "Bucket baths, low-flow taps, fixing leaks", desc: "" },
          ],
        },
      };
    case "24.10":
      return {
        text: {
          title: "Conservation strategies and farm ponds · p296-297",
          cards: [
            { tag: "Farm ponds", title: "Dugout structure storing runoff for irrigation", desc: "Also reduces erosion, recharges groundwater, supports fish rearing." },
            { tag: "World Water Day", title: "22nd March every year", desc: "" },
          ],
        },
      };
    case "24.11":
      return {
        text: {
          title: "Water recycling: treatment stages · p297-298",
          cards: [
            { tag: "Primary", title: "Physical - solids settle/float, removed", desc: "" },
            { tag: "Secondary", title: "Biological oxidation - aerobic microbes remove organic matter", desc: "" },
            { tag: "Tertiary", title: "Removes N/P, coagulants precipitate particles, chlorination", desc: "" },
          ],
        },
      };
    case "24.12":
      return {
        text: {
          title: "Uses of recycled water · p298",
          cards: [
            { tag: "Agriculture & Landscape", title: "Irrigation, public parks", desc: "" },
            { tag: "Industry", title: "Cooling water for power plants and oil refineries", desc: "" },
            { tag: "Other", title: "Toilet flushing, dust control, construction", desc: "" },
          ],
        },
      };
    case "24.13":
      return {
        text: {
          title: "IUCN · p298-299",
          cards: [
            { tag: "Founded 1948", title: "Gland, Switzerland", desc: "Vision: 'a just world that values and conserves nature.'" },
            { tag: "IUCN Red List", title: "Assesses conservation status of species worldwide", desc: "" },
            { tag: "India's biodiversity", title: "7-8% of all species, 4 of 34 global hotspots", desc: "Himalayas, Western Ghats, North-East, Nicobar Islands." },
          ],
        },
      };
    default:
      return undefined;
  }
}

function scienceVisualFrame(definition: ScienceDefinition, concept: ScienceConcept, index: number): BoardFrame {
  if (definition.number === 4) {
    const frame = unit4Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 13) {
    const frame = unit13Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 14) {
    const frame = unit14Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 15) {
    const frame = unit15Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 16) {
    const frame = unit16Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 17) {
    const frame = unit17Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 18) {
    const frame = unit18Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 19) {
    const frame = unit19Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 20) {
    const frame = unit20Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 21) {
    const frame = unit21Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 22) {
    const frame = unit22Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 23) {
    const frame = unit23Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 24) {
    const frame = unit24Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 12) {
    const frame = unit12Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 11) {
    const frame = unit11Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 8) {
    const frame = unit8Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 9) {
    const frame = unit9Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 10) {
    const frame = unit10Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 2) {
    const frame = unit2Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 6) {
    const frame = unit6Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 3) {
    const frame = unit3Frame(concept);
    if (frame) return frame;
  }
  if (definition.number === 7) {
    const frame = unit7Frame(concept);
    if (frame) return frame;
  }
  const atlasFrame = codexAtlasFrame(definition, concept);
  if (atlasFrame) return atlasFrame;
  if (concept.frame) return concept.frame;
  const blue = "#38bdf8", gold = "#f59e0b", green = "#34d399", pink = "#f472b6", ink = "#0b1329";
  let title = concept.title;
  let svg = "";
  let labels: { label: string; at: [number, number]; tone?: "gold" | "green" | "red" | "blue" }[] = [];
  switch (definition.number) {
    // Unit 4 is handled entirely by unit4Frame() above, before this switch
    // is ever reached - no case 4 here.
    case 5:
      title = "Magnetic field around a current-carrying wire";
      svg = `<circle cx="260" cy="125" r="90" fill="none" stroke="${blue}" stroke-width="4" stroke-dasharray="14 8"/><circle cx="260" cy="125" r="55" fill="none" stroke="${green}" stroke-width="4" stroke-dasharray="11 7"/><circle cx="260" cy="125" r="18" fill="${pink}"/><path d="M260 22V228" stroke="${gold}" stroke-width="10"/><path d="M260 34l-10 18h20zM260 216l-10-18h20z" fill="${gold}"/>`;
      labels = [{ label: "Current", at: [260, 34], tone: "gold" }, { label: "Field line", at: [350, 83], tone: "blue" }, { label: "Direction", at: [260, 125], tone: "green" }]; break;
    case 6:
      title = "Reflection · incident ray, normal and reflected ray";
      svg = `<path d="M260 32V215M90 180H440" stroke="white" stroke-width="4"/><path d="M120 80L260 180L398 82" fill="none" stroke="${gold}" stroke-width="6" stroke-dasharray="12 8"/><path d="M260 180L260 120" stroke="${blue}" stroke-width="4" stroke-dasharray="8 7"/><path d="M238 155h22M260 155h22" stroke="${green}" stroke-width="3"/>`;
      labels = [{ label: "Incident ray", at: [150, 95], tone: "gold" }, { label: "Normal", at: [270, 125], tone: "blue" }, { label: "Reflected ray", at: [350, 95], tone: "green" }]; break;
    // Unit 7 is handled entirely by unit7Frame() above, before this switch
    // is ever reached - no case 7 here.
    // Unit 8 is handled entirely by unit8Frame() above, before this switch
    // is ever reached - no case 8 here.
    // Unit 9 is handled entirely by unit9Frame() above, before this switch
    // is ever reached - no case 9 here.
    // Unit 10 is handled entirely by unit10Frame() above, before this
    // switch is ever reached - no case 10 here.
    // Unit 11 is handled entirely by unit11Frame() above, before this
    // switch is ever reached - no case 11 here.
    // Unit 12 is handled entirely by unit12Frame() above, before this
    // switch is ever reached - no case 12 here.
    // Unit 13 is handled entirely by unit13Frame() above, before this
    // switch is ever reached - no case 13 here.
    // Unit 14 is handled entirely by unit14Frame() above, before this
    // switch is ever reached - no case 14 here.
    // Unit 15 is handled entirely by unit15Frame() above, before this
    // switch is ever reached - no case 15 here.
    // Unit 16 is handled entirely by unit16Frame() above, before this
    // switch is ever reached - no case 16 here.
    // Unit 17 is handled entirely by unit17Frame() above, before this
    // switch is ever reached - no case 17 here.
    // Unit 18 is handled entirely by unit18Frame() above, before this
    // switch is ever reached - no case 18 here.
    // Unit 19 is handled entirely by unit19Frame() above, before this
    // switch is ever reached - no case 19 here.
    // Unit 20 is handled entirely by unit20Frame() above, before this
    // switch is ever reached - no case 20 here.
    // Unit 21 is handled entirely by unit21Frame() above, before this
    // switch is ever reached - no case 21 here.
    // Unit 22 is handled entirely by unit22Frame() above, before this
    // switch is ever reached - no case 22 here.
    // Unit 23 is handled entirely by unit23Frame() above, before this
    // switch is ever reached - no case 23 here.
    // Unit 24 is handled entirely by unit24Frame() above, before this
    // switch is ever reached - no case 24 here.
    default:
      title = `${definition.title} · visual model`;
      svg = `<rect x="70" y="70" width="380" height="110" rx="22" fill="#123d59" stroke="${blue}" stroke-width="4"/><path d="M105 125H415" stroke="${gold}" stroke-width="8" stroke-dasharray="18 10"/><circle cx="135" cy="125" r="23" fill="${green}"/><circle cx="385" cy="125" r="23" fill="${pink}"/>`;
      labels = [{ label: concept.title, at: [260, 65], tone: "blue" }, { label: "Process", at: [260, 205], tone: "gold" }];
  }
  // Keep the touch targets owned by the current textbook topic. A unit can
  // contain several different phenomena, so its concepts must not all reuse
  // the same generic labels.
  const topicLabels: Record<string, { label: string; at: [number, number]; tone: "gold" | "green" | "red" | "blue" }[]> = {
    "6.1": [{ label: "Incident ray", at: [120, 105], tone: "gold" }, { label: "Normal", at: [260, 125], tone: "blue" }, { label: "Reflected ray", at: [390, 105], tone: "green" }],
    "6.2": [{ label: "Parallel ray", at: [120, 80], tone: "gold" }, { label: "Focus", at: [260, 130], tone: "red" }, { label: "Principal axis", at: [360, 185], tone: "blue" }],
    "6.3": [{ label: "Object", at: [110, 160], tone: "gold" }, { label: "Image", at: [400, 160], tone: "green" }, { label: "Magnification", at: [260, 60], tone: "blue" }],
    "17.1": [{ label: "Body plan", at: [260, 42], tone: "gold" }, { label: "Symmetry", at: [125, 175], tone: "blue" }, { label: "Classification", at: [395, 175], tone: "green" }],
    "17.2": [{ label: "Invertebrate", at: [125, 175], tone: "blue" }, { label: "Phylum", at: [260, 42], tone: "gold" }, { label: "Specialised organ", at: [395, 175], tone: "green" }],
    "17.3": [{ label: "Notochord", at: [260, 42], tone: "gold" }, { label: "Fish", at: [125, 175], tone: "blue" }, { label: "Mammal", at: [395, 175], tone: "green" }],
    "18.1": [{ label: "Meristem", at: [105, 115], tone: "green" }, { label: "Xylem", at: [260, 115], tone: "blue" }, { label: "Phloem", at: [415, 115], tone: "gold" }],
    "18.2": [{ label: "Epithelial", at: [105, 115], tone: "green" }, { label: "Muscle", at: [260, 115], tone: "red" }, { label: "Nerve", at: [415, 115], tone: "blue" }],
    "18.3": [{ label: "Mitosis", at: [105, 115], tone: "green" }, { label: "Chromosomes", at: [260, 115], tone: "red" }, { label: "Meiosis", at: [415, 115], tone: "blue" }],
    "19.1": [{ label: "Light stimulus", at: [260, 55], tone: "gold" }, { label: "Growth direction", at: [150, 125], tone: "green" }, { label: "Tropism", at: [330, 150], tone: "blue" }],
    "19.2": [{ label: "Light energy", at: [260, 55], tone: "gold" }, { label: "Carbon dioxide", at: [150, 125], tone: "blue" }, { label: "Oxygen", at: [350, 125], tone: "green" }],
    "19.3": [{ label: "Stomata", at: [330, 150], tone: "blue" }, { label: "Water vapour", at: [260, 90], tone: "gold" }, { label: "Leaf", at: [150, 125], tone: "green" }],
    "20.1": [{ label: "Digestive path", at: [165, 145], tone: "red" }, { label: "Villi", at: [250, 220], tone: "gold" }, { label: "Absorption", at: [165, 220], tone: "green" }],
    "20.2": [{ label: "Kidney", at: [330, 58], tone: "blue" }, { label: "Nephron", at: [330, 140], tone: "gold" }, { label: "Urine path", at: [330, 220], tone: "green" }],
    "20.3": [{ label: "Gamete", at: [165, 45], tone: "gold" }, { label: "Fertilisation", at: [250, 140], tone: "red" }, { label: "Uterus", at: [330, 220], tone: "blue" }],
    "21.1": [{ label: "Vitamin", at: [220, 88], tone: "gold" }, { label: "Mineral", at: [300, 88], tone: "green" }, { label: "Deficiency", at: [220, 162], tone: "red" }],
    "21.2": [{ label: "Drying", at: [110, 130], tone: "blue" }, { label: "Freezing", at: [260, 130], tone: "green" }, { label: "Canning", at: [410, 130], tone: "red" }],
    "21.3": [{ label: "Adulteration", at: [260, 125], tone: "gold" }, { label: "Hygiene", at: [100, 125], tone: "green" }, { label: "Safe label", at: [420, 125], tone: "blue" }],
    "22.1": [{ label: "Bacteria", at: [125, 125], tone: "blue" }, { label: "Fungus", at: [260, 125], tone: "green" }, { label: "Virus", at: [395, 125], tone: "red" }],
    "22.2": [{ label: "Curd culture", at: [125, 125], tone: "green" }, { label: "Decomposer", at: [260, 125], tone: "gold" }, { label: "Medicine", at: [395, 125], tone: "blue" }],
    "22.3": [{ label: "Pathogen", at: [125, 125], tone: "red" }, { label: "Vaccine", at: [260, 125], tone: "green" }, { label: "Prevention", at: [395, 125], tone: "blue" }],
    "23.1": [{ label: "Horticulture", at: [120, 90], tone: "green" }, { label: "Floriculture", at: [260, 90], tone: "gold" }, { label: "Harvest", at: [400, 90], tone: "blue" }],
    "23.2": [{ label: "Nutrient solution", at: [120, 180], tone: "blue" }, { label: "Aquaponics", at: [260, 180], tone: "green" }, { label: "Biofertiliser", at: [400, 180], tone: "gold" }],
    "23.3": [{ label: "Dairy", at: [120, 180], tone: "gold" }, { label: "Poultry", at: [260, 180], tone: "green" }, { label: "Fishery", at: [400, 180], tone: "blue" }],
    "24.1": [{ label: "Evaporation", at: [260, 30], tone: "blue" }, { label: "Condensation", at: [390, 125], tone: "gold" }, { label: "Collection", at: [260, 225], tone: "green" }],
    "24.2": [{ label: "Fixation", at: [260, 30], tone: "blue" }, { label: "Nitrification", at: [390, 125], tone: "gold" }, { label: "Denitrification", at: [260, 225], tone: "green" }],
    "24.3": [{ label: "Pollution", at: [260, 30], tone: "red" }, { label: "Conservation", at: [390, 125], tone: "green" }, { label: "Biodiversity", at: [260, 225], tone: "blue" }],
  };
  if (topicLabels[concept.id]) labels = topicLabels[concept.id];
  return {
    diagram: {
      title: `${title} · tap a labelled part`,
      viewBox: "0 0 520 250",
      svg,
      parts: labels.map((part, partIndex) => ({
        ...part,
        note: partIndex === 0 ? concept.summary : partIndex === 1 ? `Look at this in the example: ${concept.example.question}` : concept.example.answer,
      })),
    },
  };
}

const C = (id: string, title: string, icon: string, summary: string, question: string, answer: string, frame?: BoardFrame, pages?: number[]): ScienceConcept => ({
  id, title, icon, summary, example: { question, answer }, frame, pages,
});

const SCIENCE_DEFINITIONS: ScienceDefinition[] = [
  {
    // Deepened to match the real textbook pages 14-25 - real user direction
    // 2026-09-22: "everything has to be deeper in line with textbook only."
    // Seven real sections instead of three collapsed ones, each with the
    // book's own worked problem or example, not an invented one.
    number: 2, title: "Motion", concepts: [
      C("2.1", "Rest, motion and types of motion", "🚶", "An object is at rest if its position stays the same, in motion if it changes - and motion is relative to the observer. Motion can be linear, circular, oscillatory or random, and uniform (equal distances in equal times) or non-uniform (unequal distances in equal times).", "A car covers 60 km in the first hour, 60 km in the second hour, and 60 km in the third hour. Is this uniform or non-uniform motion?", "Uniform - it covers equal distances (60 km) in equal time intervals (each hour), no matter how big or small those intervals are.", undefined, [14, 15]),
      C("2.2", "Distance and displacement", "🛣️", "Distance is the full path travelled, a scalar; displacement is the straight-line change from start to finish, a vector - the same journey can have very different distance and displacement.", "A runner goes around a track and returns to the start. What are the distance and displacement?", "Distance is the length of the track travelled; displacement is zero, because start and finish are the same point.", imageFrame("/board-art/tn9-science-motion-paths.png", "Same start and finish: distance versus displacement", "A car travelling along a straight path and a curved path between the same start and finish points.", [
        { label: "Straight path", at: [51, 39], note: "This is the shortest change from the start flag to the finish flag: displacement.", tone: "blue" },
        { label: "Curved path", at: [50, 63], note: "This is the full route travelled by the car: distance.", tone: "gold" },
        { label: "Same finish", at: [92, 39], note: "Both journeys finish at the same flag, so compare the paths, not just the destination.", tone: "green" },
      ]), [15, 16]),
      C("2.3", "Speed, velocity and acceleration", "🏎️", "Speed is distance covered per unit time (a scalar); velocity is displacement per unit time, so it has a direction (a vector); acceleration is the rate of change of velocity, a = (v − u)/t.", "An object travels 16 m in 4 s, then another 16 m in 2 s. What is its average speed?", "5.33 m/s: total distance 16+16=32 m, total time 4+2=6 s, average speed = 32/6 = 5.33 m/s.", undefined, [16, 17]),
      C("2.4", "Distance-time and velocity-time graphs", "📈", "The slope of a distance-time graph gives speed - a straight line means uniform motion. On a velocity-time graph, the area under the line gives the distance travelled.", "A person walks 500 m every 5 minutes at a steady rate. What does the distance-time graph look like, and what is the speed?", "A straight line; speed = 500 ÷ 5 = 100 m/min - equal distances in equal times always give a straight-line graph.", undefined, [17, 19]),
      C("2.5", "Equations of motion and free fall", "🧮", "Three equations link a body's motion under uniform acceleration: v = u + at, s = ut + ½at², v² = u² + 2as. For a freely falling body, the acceleration a is replaced by g.", "A car's velocity rises from 0 to 9 m/s in 5 s. Find its acceleration and the distance it covers.", "a = 1.8 m/s² (from v=u+at: (9−0)/5); distance s = ut + ½at² = 0 + ½×1.8×25 = 22.5 m.", undefined, [19, 22]),
      C("2.6", "Circular motion and centripetal force", "🎡", "An object moving in a circle needs a centripetal force directed toward the centre. Centripetal acceleration a = v²/r, so the force is F = mv²/r.", "A 900 kg car moving at 10 m/s turns around a circle of radius 25 m. Find its acceleration and the net force.", "a = v²/r = 100/25 = 4 m/s². F = ma = 900 × 4 = 3600 N.", undefined, [22, 23]),
      C("2.7", "Centrifugal force", "🌀", "Centrifugal force is felt pulling a body away from the centre of a circular path - the same size as the centripetal force, but in the opposite direction. A washing machine dryer and a merry-go-round both rely on it.", "Why does a spinning washing machine drum push water out through its holes?", "The water is flung outward by centrifugal force as the drum spins, away from the centre, through the holes in the drum wall.", undefined, [22, 23]),
    ],
  },
  {
    // Deepened to match the real textbook pages 26-37 - real user direction
    // 2026-09-22: "everything has to be deeper in line with textbook only."
    // Six real sections instead of three collapsed ones (thrust/pressure,
    // pressure-in-fluids+atmospheric, Pascal's law, density, buoyancy+
    // apparent weight, laws of flotation), each with the book's own worked
    // problem, not an invented one.
    number: 3, title: "Fluids", concepts: [
      C("3.1", "Thrust and pressure", "💧", "The force per unit area acting on a surface is pressure: P = F/A, measured in pascals (Pa). For the same force, a larger area means lower pressure, and vice versa.", "A 90 kg man stands with his feet covering 0.036 m² of floor. Using g = 10 m/s², find the pressure he exerts.", "25 000 Pa: thrust F = mg = 90 × 10 = 900 N, then pressure P = F/A = 900 / 0.036 = 25 000 Pa.", undefined, [26, 27]),
      C("3.2", "Pressure in fluids and atmospheric pressure", "🌡️", "Pressure due to a liquid column is P = hρg - it depends on depth, density and gravity, not on the container's shape or area. The atmosphere presses down too: atmospheric pressure equals a 760 mm column of mercury.", "Find the pressure exerted by a 0.85 m column of water (ρ = 1000 kg/m³) and the same height of kerosene (ρ = 800 kg/m³).", "Water: P = hρg = 0.85 × 1000 × 10 = 8500 Pa. Kerosene: P = 0.85 × 800 × 10 = 6800 Pa - the denser fluid exerts more pressure at the same depth.", imageFrame("/board-art/tn9-science-fluids-pressure-buoyancy.png", "Pressure increases with depth", "A water tank with jets from different depths and a floating block showing upward buoyant force.", [
        { label: "Deeper hole", at: [35, 63], note: "There is more water above this hole, so pressure is greater and the jet travels farther.", tone: "gold" },
        { label: "Shallow hole", at: [35, 29], note: "There is less water above this hole, so the pressure and jet range are smaller.", tone: "blue" },
        { label: "Buoyant force", at: [75, 55], note: "The upward arrows show the fluid force supporting the floating block.", tone: "green" },
      ]), [27, 30]),
      C("3.3", "Pascal's law and the hydraulic press", "🧴", "Pascal's law: pressure applied to an enclosed liquid is transmitted equally in all directions. A hydraulic press uses this - a small force on a small piston creates a large force on a large piston, since pressure is equal: F1/a = F2/A.", "A hydraulic press has a small piston of area 2 cm² and a large piston of area 200 cm². A force of 50 N is applied to the small piston. What force does the large piston produce?", "5000 N: pressure is equal on both sides, so F2 = F1 × (A/a) = 50 × (200/2) = 5000 N - a 100x force multiplier from the 100x area ratio.", undefined, [31, 32]),
      C("3.4", "Density and relative density", "⚖️", "Density is mass per unit volume, ρ = m/V. Relative density compares a substance's density to water's (1 g/cm³). A hydrometer (like a lactometer for milk) measures it by how deep the instrument sinks.", "250 cm³ of water has a mass of 250 g, and 250 cm³ of kerosene has a mass of 200 g. Find each density.", "Water: 250/250 = 1 g/cm³. Kerosene: 200/250 = 0.8 g/cm³ - kerosene is less dense, which is why it floats on water.", undefined, [32, 33]),
      C("3.5", "Buoyancy and apparent weight", "⚓", "An immersed body experiences an upward buoyant force (upthrust). An object less dense than the fluid is 'positively buoyant' and floats; denser is 'negatively buoyant' and sinks. Apparent weight = true weight − upthrust.", "A stone weighs 5 N in air but only 3 N when fully submerged in water. Find the upthrust acting on it.", "2 N: apparent weight = true weight − upthrust, so upthrust = true weight − apparent weight = 5 − 3 = 2 N.", undefined, [34, 35]),
      C("3.6", "Laws of flotation", "🚢", "A floating body's weight equals the weight of fluid it displaces, and its centre of gravity sits directly above its centre of buoyancy on the same vertical line. Why does a steel ship float even though steel is denser than water?", "A boat and its cargo weigh 5000 N altogether. How much water must it displace to float?", "5000 N worth of water: by the first law of flotation, a floating body always displaces fluid whose weight exactly equals its own weight.", undefined, [35, 36]),
    ],
  },
  {
    // Deepened from the real textbook pages 39-48 - real user direction
    // 2026-09-21: "in textbook from page 39-51 we have more details on this
    // concept, however we have not covered most of them ... this is the gap
    // we have." The book has six real sections (4.1-4.6) plus safety; the
    // three concepts this unit had before collapsed all of that into three
    // shallow lines and merged two unrelated sections (circuits, safety)
    // into one. Seven concepts now, one per real section, each with the
    // book's own worked problem or activity, not an invented example.
    number: 4, title: "Electric charge and Electric current", concepts: [
      C("4.1", "Electric charge, force and field", "⚡", "Charge is a fundamental property measured in coulombs (q = ne). Like charges repel, unlike charges attract. The region where a charge feels this force is its electric field, shown by field lines.", "How many electrons make up a total charge of 1 coulomb?", "n = q/e = 1 / (1.6 × 10⁻¹⁹) = 6.25 × 10¹⁸ electrons.", undefined, [39, 40, 41]),
      C("4.2", "Electric current and how we measure it", "🔌", "Current is the rate charge flows past a point: I = q/t, measured in amperes. An ammeter measures it, connected in series. Conventional current is the direction positive charge would flow; electrons actually flow the other way.", "25 C of charge passes through a wire in 50 s. What is the current?", "I = q/t = 25/50 = 0.5 A.", undefined, [41, 42]),
      C("4.3", "EMF, potential difference and resistance", "🔋", "EMF is the work a source does driving one coulomb all the way round a circuit (ε = W/q). Potential difference is the work converted per coulomb across one component (V = W/q). Resistance (ohms) opposes current; conductors have very little, insulators block it almost entirely.", "A charge of 2 × 10⁴ C flows through a heater, converting 5 × 10⁶ J to heat. Find the potential difference across it.", "V = W/q = (5 × 10⁶) / (2 × 10⁴) = 250 V.", undefined, [42, 43, 44]),
      C("4.4", "Circuit diagrams: series and parallel", "🔗", "Circuit diagrams use standard symbols for cells, wires, switches and resistors. In series, components share one loop and the same current throughout. In parallel, components sit on separate branches with the same potential difference, and branch currents add up to the total.", "How are the bulbs in a home wired so each one keeps working even if another fails?", "In parallel - each bulb has its own complete path back to the supply, so it works independently of the others.", undefined, [44, 45]),
      C("4.5", "Effects of electric current: heat, chemistry, magnetism", "🔥", "Current through a resistance produces heat (Joule heating - the basis of heaters and toasters). Current through an electrolyte causes a chemical change, such as electroplating. Every current-carrying wire creates a magnetic field around itself.", "In the electroplating activity, the copper wire is the anode and the carbon rod is the cathode. What gets deposited, and where?", "Copper metal is deposited onto the carbon rod (the cathode), since electrolysis carries copper from the anode across to it.", undefined, [45, 46]),
      C("4.6", "Types of current: AC and DC", "🔁", "Direct current (dc) flows one way only - from cells, batteries, solar cells. Alternating current (ac) reverses direction periodically, described by its frequency. Domestic supply is ac; a rectifier converts ac to dc, an inverter converts dc to ac.", "What are the voltage and frequency of India's domestic ac supply?", "220 V at 50 Hz (the USA uses 110 V at 60 Hz).", undefined, [46, 47]),
      C("4.7", "Electrical safety and precautions", "⚠️", "Damaged insulation, overloaded sockets, wrong appliance ratings, moisture and children's reach are the main electrical dangers. A dry body resists about 1,00,000 ohms, but moisture drops that to a few hundred ohms - which is why a wet body is far more dangerous around electricity.", "Why does water on the skin make an electric shock more dangerous?", "Dry skin resists about 1,00,000 ohms, but moisture reduces the body's resistance to only a few hundred ohms, so far more current can flow through a wet body at the same voltage.", undefined, [47, 48]),
    ],
  },
  {
    // Deepened to match the real textbook pages 52-64 - real user direction
    // 2026-09-22: "everything has to be deeper in line with textbook only."
    // Eight real sections instead of three collapsed ones, each with the
    // book's own worked problem or rule, not an invented one.
    number: 5, title: "Magnetism and Electromagnetism", concepts: [
      C("5.1", "Magnetic field, field lines and flux", "🧲", "A magnetic field (B) is the region where magnetic influence can be felt, measured in tesla. Field lines run from north to south pole; magnetic flux (φ, in weber) is the number of field lines through an area.", "Where are a bar magnet's field lines closest together, and what does that tell you?", "Nearest the poles - field lines drawn closer together show where the magnetic field is strongest.", undefined, [52, 53]),
      C("5.2", "Magnetic effect of current", "🌀", "Oersted's experiment showed a current-carrying wire produces a magnetic field around itself. The right hand thumb rule finds its direction: thumb points along the current, curled fingers show the field's direction.", "Oersted placed a compass above a wire and another below it. When current flowed, which way did each needle turn?", "The compass above pointed east and the one below pointed west - opposite deflections, proving the current itself was creating a magnetic field around the wire.", undefined, [53, 54]),
      C("5.3", "Force on a current-carrying conductor", "🧭", "A current-carrying conductor in a magnetic field feels a force, F = BIL (maximum when the wire is perpendicular to the field, zero when parallel). Fleming's Left Hand Rule gives its direction. Two parallel wires attract if their currents flow the same way, and repel if opposite.", "A 2 m wire carries a current of 3 A, held perpendicular to a magnetic field of strength 0.5 T. Find the force on it.", "3 N: F = BIL = 0.5 × 3 × 2 = 3 N.", undefined, [55, 57]),
      C("5.4", "Electric motor", "⚙️", "An electric motor converts electrical energy into mechanical energy. Current flowing in opposite directions through the two sides of a coil, inside a magnetic field, creates a turning force (torque) that spins the coil.", "Name two ways to make an electric motor's coil turn with more force.", "Any two of: increase the current, increase the number of turns in the coil, increase the coil's area, or use a stronger magnet.", undefined, [58, 59]),
      C("5.5", "Electromagnetic induction", "⚡", "Faraday showed that changing the magnetic flux through a coil induces an emf (a voltage) in it - by switching a nearby circuit on/off, or moving a magnet in and out of the coil. Fleming's Right Hand Rule (the 'generator rule') gives the induced current's direction.", "In Faraday's experiment, moving a magnet in and out of a coil with more turns produces what change in the induced voltage?", "A higher voltage - the greater the number of turns in the coil, the higher the voltage generated by the same magnet movement.", undefined, [59, 60]),
      C("5.6", "Electric generator", "🔌", "A generator converts mechanical energy into electrical energy - the reverse of a motor. A rotating coil (armature) between magnet poles induces a current. Slip rings produce alternating current (AC); a split-ring commutator produces direct current (DC).", "What is the key difference between an AC generator and a DC generator?", "An AC generator uses slip rings and produces current that keeps reversing direction; a DC generator uses a split-ring commutator, so one brush always contacts the arm moving the same way, producing current in one direction only.", undefined, [60, 61]),
      C("5.7", "Transformer", "🔋", "A transformer changes an alternating voltage using two coils on an iron core: Es/Ep = Ns/Np. A step-up transformer has more secondary turns and raises the voltage; a step-down transformer has fewer and lowers it.", "A transformer's primary coil has 800 turns and its secondary has 8 turns. If the primary is connected to 220 V ac, what is the output voltage?", "2.2 V: Es = (Ns/Np) × Ep = (8/800) × 220 = 2.2 V - a step-down transformer, since the secondary has far fewer turns.", undefined, [61, 62]),
      C("5.8", "Applications of electromagnets", "🔊", "Electromagnets power real devices: a speaker's electromagnet vibrates against a fixed permanent magnet as the current pulses, pumping sound into the air. Maglev trains use magnets to both lift the train off the track and push it forward, without friction.", "How does a maglev train stay above the track and move forward without wheels touching it?", "One set of magnets repels and lifts the train off the track; a second set pushes the floating train forward - both without any friction from touching the track.", undefined, [62, 62]),
    ],
  },
  {
    // Deepened to match the real textbook pages 66-76 - real user direction
    // 2026-09-22: "everything has to be deeper in line with textbook only."
    // Seven real sections, each with the book's own worked problem or rule.
    // Ray-diagram geometry is genuinely easy to draw subtly wrong, so the
    // mirror/refraction formulas are kept as text cards with the book's own
    // real numbers rather than a risky hand-drawn ray diagram; only 6.1's
    // simple, exactly-symmetric reflection angle gets a diagram.
    number: 6, title: "Light", concepts: [
      C("6.1", "Reflection and lateral inversion", "🪞", "The laws of reflection: the incident ray, reflected ray and normal all lie in the same plane, and the angle of incidence always equals the angle of reflection. A plane mirror also produces lateral inversion - left and right appear swapped.", "If the angle of incidence is 40°, what is the angle of reflection?", "40° - the laws of reflection say the angle of incidence always equals the angle of reflection.", undefined, [66, 67]),
      C("6.2", "Curved mirrors and ray rules", "🔎", "A concave mirror curves inward (toward the centre); a convex mirror curves outward. Four ray rules locate an image: a ray parallel to the axis reflects through the focus, one through the focus reflects parallel to the axis, and one hitting the pole reflects at an equal angle.", "A ray of light travels parallel to a concave mirror's principal axis. Where does it go after reflecting?", "Through the principal focus - that is the first ray rule used to construct images in curved mirrors.", undefined, [68, 69]),
      C("6.3", "Concave mirror: image formation and the mirror equation", "🖼️", "The mirror equation 1/v + 1/u = 1/f relates object distance (u), image distance (v) and focal length (f). Magnification m = -v/u = hi/ho - a negative m means a real image, positive means virtual.", "An object 1 cm tall is placed 15 cm from a concave mirror of focal length 10 cm. Find the image distance.", "v = -30 cm: using 1/v + 1/u = 1/f with u = -15 and f = -10, the image forms 30 cm in front of the mirror - real and inverted.", undefined, [71, 72]),
      C("6.4", "Convex mirror: image formation and uses", "🚗", "A convex mirror always forms a smaller, upright, virtual image - which is why it shows a wider field of view. That is why car mirrors that warn 'objects are closer than they appear' are convex.", "A car's convex mirror has a focal length of 20 cm. Another car is 6 m (600 cm) away. About how far behind the mirror does its image form?", "About 19.35 cm - much closer to the mirror than the real 600 cm distance, which is exactly why a convex mirror makes objects look small and far away, even when they are close.", undefined, [72, 73]),
      C("6.5", "Speed of light", "💫", "Light is a form of energy that travels extremely fast. In 1676, Ole Roemer made the first estimate of its speed by observing one of Jupiter's moons, arriving at about 220,000 km per second.", "How did Ole Roemer first estimate the speed of light?", "By timing the eclipses of one of Jupiter's moons from Earth at different points in Earth's orbit - the timing differences let him estimate light's speed at about 220,000 km per second.", undefined, [73, 73]),
      C("6.6", "Refraction and Snell's law", "🌈", "Light bends when it crosses into a different medium: toward the normal when entering a denser medium, away from the normal when entering a rarer one. Snell's law: sin(i)/sin(r) is a constant, called the refractive index.", "Light travels from air into glass (a denser medium). Does it bend toward or away from the normal?", "Toward the normal - light always bends toward the normal when it enters an optically denser medium, and away from the normal when leaving one.", undefined, [74, 74]),
      C("6.7", "Total internal reflection", "💎", "When light travels from a denser to a rarer medium and the angle of incidence exceeds the critical angle (where the refracted ray would graze the surface, r = 90°), it reflects entirely back into the denser medium instead of refracting.", "What two conditions must be met for total internal reflection to happen?", "Light must travel from a denser medium to a rarer one, and its angle of incidence inside the denser medium must be greater than the critical angle.", undefined, [75, 75]),
    ],
  },
  {
    // Deepened to match the real textbook pages 80-90 - real user direction
    // 2026-09-22: "everything has to be deeper in line with textbook only."
    // Nine real sections/sub-sections (7.1, 7.2.1-7.2.3, 7.3, 7.4, both of
    // the book's two "7.5"s - a genuine printing duplication in the source
    // for heat capacity and change of state - and 7.6), each with the
    // book's own worked problem or rule. Conduction gets an animated
    // motion-path diagram (a straight line - safe geometry); change of
    // state gets a simple solid/liquid/gas box diagram (also safe, no
    // angle claims). The rest use text cards for the formula-heavy content.
    number: 7, title: "Heat", concepts: [
      C("7.1", "Effects of heat", "🌡️", "Heat can expand a substance, change its state (solid to liquid to gas), raise its temperature, or drive a chemical change. Expansion is greatest in gases, less in liquids, least in solids.", "Why is a gap always left between sections of railway track?", "Metal expands when it heats up in summer sun. The gap gives the track room to expand without bending or buckling.", undefined, [80, 80]),
      C("7.2", "Conduction", "🔥", "Conduction is the transfer of heat through a solid from hot to cold, without the molecules themselves moving - each molecule vibrates faster and passes energy to its neighbour. Metals are good conductors; liquids and gases conduct very slowly.", "Copper, aluminium, brass and iron rods are all heated at one end, with a wax-stuck match on the far end of each. Which match falls off first?", "The one on the copper rod - copper is the best conductor of these four, so heat reaches its far end fastest, melting the wax soonest.", undefined, [81, 82]),
      C("7.3", "Convection", "💨", "Convection is the transfer of heat through a fluid (liquid or gas) by the actual movement of the heated fluid itself. Warm fluid is less dense, so it rises; cooler, denser fluid sinks to take its place, creating a circulating current.", "During the day, why does a sea breeze blow from the sea toward the land?", "Land heats up faster than the sea in daytime. The hot air over the land rises, and cooler air from over the sea flows in to replace it - that flow is the sea breeze.", undefined, [82, 83]),
      C("7.4", "Radiation", "☀️", "Radiation transfers heat as electromagnetic waves, needing no medium at all - it is the only one of the three that works through a vacuum, which is how the Sun's heat reaches Earth.", "Why are cooking pots often blackened on the outside bottom, while an aeroplane's surface is kept highly polished?", "A black surface absorbs radiation well, so blackening the pot's base helps it absorb heat faster. A polished surface reflects radiation well, so polishing the plane's skin reflects away the Sun's heat instead of absorbing it.", undefined, [83, 83]),
      C("7.5", "Temperature and its scales", "🌡️", "Temperature is measured on three scales: Fahrenheit (freezing 32°F, boiling 212°F), Celsius (freezing 0°C, boiling 100°C), and Kelvin, the absolute scale where 0 K is absolute zero. °F = °C × 1.8 + 32, and K = °C + 273.15.", "Convert 25°C to Kelvin, and convert 200 K to °C.", "298.15 K: TK = 25 + 273.15 = 298.15 K. And -73.15°C: T°C = 200 - 273.15 = -73.15°C.", undefined, [83, 84]),
      C("7.6", "Specific heat capacity", "💧", "The heat absorbed by a body depends on its mass, its change in temperature, and its material: Q = mCΔT. Specific heat capacity (C) is the heat needed to raise 1 kg of a substance by 1°C. Water's is unusually high (4200 J/kg·K), so it heats and cools slowly.", "Calculate the heat energy required to raise the temperature of 2 kg of water from 10°C to 50°C (specific heat capacity of water = 4200 J/kg·K).", "336,000 J: Q = mCΔT = 2 × 4200 × 40 = 3,36,000 J, since the temperature rises by 50 - 10 = 40°C.", undefined, [84, 85]),
      C("7.7", "Heat capacity (thermal capacity)", "🏺", "Heat capacity is the heat needed to raise the temperature of an entire body (not just 1 kg of it) by 1°C: C' = Q/ΔT. Its SI unit is J/K.", "An iron ball needs 5000 J of heat energy to raise its temperature by 20 K. Find its heat capacity.", "250 J/K: Heat capacity = Q/ΔT = 5000/20 = 250 J/K.", undefined, [85, 86]),
      C("7.8", "Change of state", "🧊", "Matter changes state at a fixed temperature for a given substance: melting/freezing (solid ↔ liquid), boiling/condensation (liquid ↔ gas), and sublimation (solid → gas directly, skipping liquid, as in dry ice or naphthalene balls).", "What is the process called when a solid changes directly into a gas, without ever becoming a liquid - and name one substance that does this.", "Sublimation - dry ice (solid carbon dioxide), iodine, and naphthalene balls all sublime directly from solid to gas.", undefined, [86, 86]),
      C("7.9", "Latent heat", "🌀", "Latent heat is the heat absorbed or released during a change of state, with NO change in temperature - which is why boiling water stays at exactly 100°C until every last drop has turned to steam. Specific latent heat L = Q/m; its SI unit is J/kg.", "How much heat energy is required to melt 5 kg of ice, if the specific latent heat of ice is 336 J/g?", "1,680,000 J (1.68 × 10⁶ J): Heat energy = m × L = 5000 g × 336 J/g = 1,680,000 J.", undefined, [86, 87]),
    ],
  },
  {
    // Deepened to match the real textbook pages 91-101 - real user direction
    // 2026-09-22: "everything has to be deeper in line with textbook only."
    // Eleven real sections consolidated from the book's twelve numbered
    // sub-sections (8.1-8.12; ECG folded into the closing human-ear
    // concept since it is one short paragraph, not a full teachable
    // section on its own). Longitudinal-wave spacing and the echo
    // round-trip are safe straight-line/spacing geometry, so they get
    // diagrams; the rest use text cards for the formula-heavy content.
    number: 8, title: "Sound", concepts: [
      C("8.1", "Production of sound and the need for a medium", "🔔", "Sound is produced by vibrating bodies - striking a tuning fork makes it vibrate, and those vibrations disturb nearby molecules. The Bell-Jar experiment proves sound needs a material medium: as air is pumped out of a jar around a ringing bell, the sound fades until nothing is heard at all - sound cannot travel through vacuum.", "In the Bell-Jar experiment, what happens to the sound of the ringing bell as the air is gradually pumped out?", "It becomes fainter and fainter, and eventually disappears completely once the jar is fully evacuated - proving that sound needs a material medium (like air) to travel, and cannot pass through a vacuum.", undefined, [91, 92]),
      C("8.2", "Sound as a longitudinal wave", "🌀", "Sound travels as a disturbance, not as moving particles - each particle vibrates briefly and passes the disturbance to its neighbour. This produces compressions (regions where particles are crowded together) and rarefactions (regions where particles are spread apart), moving along the same direction the wave travels - which is why sound is called a longitudinal wave.", "As a sound wave passes through air, do the air molecules themselves travel all the way from the source to your ear?", "No - each molecule only vibrates back and forth a little around its own position. It is the disturbance (the pattern of compressions and rarefactions) that travels to your ear, not the molecules themselves.", undefined, [92, 93]),
      C("8.3", "Characteristics of a sound wave", "📈", "A sound wave is described by five quantities: amplitude (A, the maximum displacement of particles - louder if larger), frequency (n, vibrations per second, in Hz), time period (T = 1/n, time for one vibration), wavelength (λ, the distance over which the wave pattern repeats), and speed (v).", "A sound wave has a frequency of 500 Hz. What is its time period?", "0.002 s (2 ms): T = 1/n = 1/500 = 0.002 s.", undefined, [93, 93]),
      C("8.4", "Distinguishing sounds: loudness, pitch and timbre", "🎵", "Loudness depends on amplitude (bigger amplitude, louder sound) and is measured in decibels. Pitch depends on frequency (higher frequency, higher/shriller pitch). Timbre (or quality) is what lets you tell two instruments apart even when they play the same note equally loudly.", "Two identical drums are struck - one softly, one hard - producing the exact same musical note. What differs between the two sounds, and why?", "Only the loudness differs, because striking harder produces a larger amplitude vibration. The pitch stays the same, because the frequency of vibration is unchanged - it is the same note either way.", undefined, [93, 94]),
      C("8.5", "Speed of sound", "💨", "Speed v = nλ (frequency times wavelength). Sound travels fastest in solids, slower in liquids, slowest in gases, and faster at higher temperatures within the same medium - for example, 330 m/s in air at 0°C but 340 m/s at 25°C.", "A sound wave in air has a frequency of 425 Hz and a wavelength of 0.8 m. Find its speed.", "340 m/s: v = nλ = 425 × 0.8 = 340 m/s - matching air's real speed of sound near room temperature.", undefined, [94, 96]),
      C("8.6", "Reflection of sound", "📯", "Like light, sound obeys the laws of reflection: the angle of incidence always equals the angle of reflection, and the incident sound, reflected sound and normal all lie in the same plane. Megaphones and stethoscopes both use repeated reflections inside a tube to direct sound efficiently.", "A megaphone's cone-shaped tube helps a shout carry further in one direction. What principle of sound is it using?", "Reflection - the cone reflects the sound waves successively off its inner walls, guiding most of the sound energy forward in one direction toward the audience, instead of spreading out in all directions.", undefined, [96, 96]),
      C("8.7", "Echo", "🏔️", "An echo is a reflected sound heard separately from the original. Since a sound sensation persists in the brain for about 0.1 s, the reflecting surface must be at least 17 m away (so the round trip covers at least 34 m) for a distinct echo to be heard, at sound's speed of 340 m/s.", "A boy shouts toward a cliff and hears the echo 0.4 s later. If the speed of sound is 340 m/s, how far away is the cliff?", "68 m: the sound travels out and back, so total distance = 340 × 0.4 = 136 m, and the cliff is half of that, 68 m, away.", undefined, [96, 97]),
      C("8.8", "Reverberation", "🏛️", "Reverberation is the persistence of sound in a large hall from repeated reflections off the walls, ceiling and floor, until it fades below audibility. Too much reverberation makes speech unclear, so auditoriums use sound-absorbing materials (fibreboard, curtains, carpets) to control it.", "Why are the walls and roof of a concert hall often covered with fibreboard, thick curtains and carpets instead of bare, hard, reflective surfaces?", "Soft materials absorb sound rather than reflecting it, which reduces reverberation - without them, sound would keep reflecting off hard surfaces and blur speech and music into an unclear echo.", undefined, [97, 97]),
      C("8.9", "Ultrasonic sound and its applications", "🦇", "Ultrasonic sound has a frequency above 20,000 Hz - too high for humans to hear, though some animals (dogs, bats, dolphins) can. Bats and dolphins use echolocation to navigate and hunt. Applications include cleaning objects, detecting cracks in metal, echocardiography, and breaking kidney stones.", "A dog reacts to a whistle that a person standing right beside it cannot hear at all. What does this tell you about the whistle's frequency?", "It must be above 20,000 Hz - ultrasonic, and therefore beyond the range of human hearing, but still within the range dogs can hear.", undefined, [97, 98]),
      C("8.10", "SONAR", "🚢", "SONAR (SOund Navigation And Ranging) uses ultrasonic waves to find the distance, direction and speed of underwater objects. A transmitter sends out ultrasound; it reflects off the seabed or an object and returns to a detector, and the depth is found from 2d = v × t.", "A ship's SONAR sends an ultrasound pulse that returns after 4 s. If the speed of ultrasound in sea water is 1500 m/s, how deep is the seabed below the ship?", "3000 m (3 km): 2d = v × t = 1500 × 4 = 6000 m, so d = 3000 m.", undefined, [98, 98]),
      C("8.11", "How the human ear hears", "👂", "Sound enters through the pinna (outer ear), travels down the auditory canal, and strikes the eardrum, making it vibrate. Three tiny bones - the hammer, anvil and stirrup - amplify this vibration in the middle ear. The cochlea, in the inner ear, converts these vibrations into electrical signals sent to the brain via the auditory nerve.", "Which part of the ear vibrates first when a sound wave arrives, and which structure finally converts the vibration into an electrical signal for the brain?", "The eardrum (tympanic membrane) vibrates first. The cochlea, in the inner ear, is what finally converts the amplified vibrations into electrical signals sent to the brain.", undefined, [98, 99]),
    ],
  },
  {
    // Deepened to match the real textbook pages 102-110 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Nine real sections consolidated from the book's
    // numbered sub-sections (9.1-9.1.3, 9.2-9.2.3, 9.3, 9.4, 9.5, 9.6-9.6.2).
    // Inner/outer planet grouping and the orbital-velocity vector are safe
    // (no precise angle claims - the velocity/radius pair is drawn exactly
    // perpendicular by construction); the ellipse's focus is placed using
    // the real c = sqrt(a^2 - b^2) formula, not eyeballed.
    number: 9, title: "Universe", concepts: [
      C("9.1", "The universe and the Big Bang", "🌌", "The universe contains all matter, energy and space - its observable part is about 93 billion light years across. Atoms make up only about 4% of it; the rest is dark matter and dark energy. The Big Bang theory says the universe began about 13.7 billion years ago from an explosion of a single point of hot, dense matter, and it has been expanding ever since.", "About how long ago did the Big Bang occur, according to current scientific understanding?", "About 13.7 billion years ago - when a single point of hot, dense matter exploded outward in all directions, forming the galaxies we see today.", undefined, [102, 103]),
      C("9.2", "Galaxies and stars", "🌠", "A galaxy is a massive collection of gas, dust and billions of stars, classified as spiral, elliptical or irregular. Our Sun lies in the spiral Milky Way galaxy, about 100,000 light years across. A star's colour reveals its temperature - hot stars are white or blue, cooler stars are orange or red. A group of stars forming a recognisable pattern is a constellation.", "The Milky Way is classified as which shape of galaxy, and roughly how many stars does it contain?", "Spiral - and it contains approximately 100 billion stars.", undefined, [103, 104]),
      C("9.3", "The Sun", "☀️", "The Sun is a medium-sized star made mostly of hydrogen (three-quarters) with some helium. Nuclear fusion - hydrogen atoms combining under enormous pressure to form helium - releases the energy that makes the Sun shine and give off heat. It sits at the centre of the solar system, and its gravity keeps the planets, asteroids and comets in orbit.", "What process inside the Sun releases the enormous energy that makes it shine, and what does that process actually do?", "Nuclear fusion - it fuses hydrogen atoms together under enormous pressure to form helium, releasing energy as light and heat in the process.", undefined, [104, 105]),
      C("9.4", "Planets: inner and outer", "🪐", "The four inner planets (Mercury, Venus, Earth, Mars) are close to the Sun and close together, with solid rocky surfaces - they are called terrestrial planets. The four outer planets (Jupiter, Saturn, Uranus, Neptune) are spread far apart, made mostly of hydrogen and helium gas, and are called gas giants - only these four have rings.", "Which group of planets has solid rocky surfaces and lies closest to the Sun, and which group are gas giants with rings?", "The inner planets (Mercury, Venus, Earth, Mars) are the rocky, terrestrial ones closest to the Sun. The outer planets (Jupiter, Saturn, Uranus, Neptune) are the gas giants, and only they have rings.", undefined, [104, 106]),
      C("9.5", "Other bodies of the solar system", "☄️", "Asteroids are rocky leftovers from planet formation, mostly orbiting in a belt between Mars and Jupiter. Comets are lumps of dust and ice on highly elliptical orbits that grow a head and tail when they near the Sun (Halley's Comet returns every 76 years). Meteors are small rocks that burn up entering Earth's atmosphere; ones that survive and hit the ground are meteorites. A satellite is any body orbiting a planet - the Moon is Earth's natural satellite.", "What is the key difference between a meteor and a meteorite?", "A meteor is a small rock that burns up completely in Earth's atmosphere due to friction. A meteorite is one that does NOT burn up completely and actually reaches the ground.", undefined, [106, 107]),
      C("9.6", "Orbital velocity", "🛰️", "Orbital velocity is the horizontal velocity a satellite needs at a given height to stay in a circular orbit: v = √(GM/(R+h)). The closer a satellite is to Earth, the greater the orbital velocity it needs. A satellite at 500 km altitude needs about 7.613 km/s.", "Which needs a greater orbital velocity: a satellite orbiting at 200 km altitude, or one orbiting at 36,000 km altitude?", "The one at 200 km - the closer a satellite is to Earth, the faster it must travel to maintain a stable circular orbit against Earth's stronger gravity there.", undefined, [107, 108]),
      C("9.7", "Time period of a satellite", "⏱️", "The time period of a satellite is the time it takes to complete one revolution: T = 2π(R+h)/v. A geostationary satellite has a time period of exactly 24 hours, matching Earth's own rotation, so it appears to stay fixed over the same spot on the ground.", "A satellite orbiting at 500 km altitude has a time period of about 5667 seconds (about 95 minutes) - much shorter than a geostationary satellite's 24 hours. Why is it so much shorter?", "It orbits much closer to Earth than a geostationary satellite does, and closer satellites both need higher orbital velocity and travel a shorter path - both effects make their time period far shorter.", undefined, [108, 108]),
      C("9.8", "Kepler's three laws", "📐", "Kepler's First Law (Ellipses): planets orbit the Sun in ellipses, with the Sun at one focus. Second Law (Equal Areas): the line joining a planet and the Sun sweeps out equal areas in equal times - so planets move faster when closer to the Sun. Third Law (Harmonies): T² is directly proportional to R³, linking a planet's orbital period to its distance from the Sun.", "A planet's period of revolution around the Sun is 8 times that of another planet. Using Kepler's third law (T² ∝ R³), how many times greater is its distance from the Sun?", "4 times: T² ∝ R³ means 8² = R-ratio³, so R-ratio³ = 64, and the cube root of 64 is 4.", undefined, [108, 109]),
      C("9.9", "The International Space Station (ISS)", "🛰️", "The ISS is a large spacecraft orbiting about 400 km above Earth, built through international cooperation between five space agencies (NASA, Roskosmos, ESA, JAXA, CSA) and 16 countries. Continuously crewed since 2000, it serves as a science laboratory that has produced real benefits: water-purification technology, eye-tracking devices used in surgery and by disabled people, and precision robotic-arm surgery.", "Name one real-world technology that came out of ISS research, beyond just scientific knowledge about space.", "Any one of: water-purification/filtration technology (already used to help a water-scarce village in Iraq), eye-tracking technology (used in laser surgery and to help people with severe disabilities), or robotic arms (used in precise tumour-removal surgery and biopsies).", undefined, [109, 110]),
    ],
  },
  {
    // Deepened to match the real textbook pages 113-122 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." The original 3-concept version did not even match
    // the book's real subject (states of matter) - the real Unit 10 is
    // about chemical classification of matter (elements/compounds/
    // mixtures) and separation techniques, consolidated here into nine
    // real sections. The classification tree and the three-jar solution
    // comparison are safe box/dot layouts with no angle claims; the six
    // separation methods and the colloid table use text cards.
    number: 10, title: "Matter Around Us", concepts: [
      C("10.1", "Elements: the building blocks of matter", "🧱", "Matter is classified by chemical composition into pure substances (one kind of particle - elements and compounds) and mixtures (more than one kind, physically combined). An element cannot be broken down into a simpler substance - e.g. aluminium is made of only aluminium atoms. An atom is the smallest unit of an element; a molecule is the smallest unit of a pure substance that exists independently.", "Aluminium foil is made of only aluminium atoms and cannot be broken down into anything simpler by chemical means. Is it an element, a compound, or a mixture?", "An element - it contains only one kind of atom and cannot be broken down into a simpler substance chemically, which is exactly the definition of an element.", undefined, [113, 114]),
      C("10.2", "Compounds", "⚗️", "A compound forms when two or more elements combine chemically into a new substance with entirely different properties from the elements it's made of - e.g. sodium (a reactive metal) and chlorine (a toxic gas) combine to form common salt, safe to eat. Unlike a mixture, a compound can only be broken back into its elements by a chemical reaction, and its components are always in a fixed ratio.", "Water (H2O) can be split into hydrogen gas and oxygen gas by passing electricity through it (electrolysis) - a chemical reaction. What does this tell you about water?", "Water is a compound, not an element - it can only be broken down into simpler substances (hydrogen and oxygen) through a chemical reaction, which is exactly what defines a compound.", undefined, [115, 115]),
      C("10.3", "Mixtures, and how they differ from compounds", "🥣", "A mixture contains two or more substances physically combined in any proportion, each keeping its own properties - unlike a compound. Heating iron and sulphur together forms iron sulphide, a compound with entirely new properties (not attracted to a magnet); the un-heated mixture still shows both iron's (magnetic) and sulphur's own separate properties, and can be separated by simple physical means.", "A mixture of sand and salt can be separated just by adding water (the salt dissolves, the sand doesn't) and then filtering - no chemical reaction is needed anywhere. What does that tell you about sand and salt mixed together?", "It is a mixture, not a compound - the components kept their own separate properties (only salt dissolves) and could be separated by a simple physical method, not a chemical reaction, which is exactly how mixtures behave.", undefined, [115, 116]),
      C("10.4", "Homogeneous and heterogeneous mixtures", "🧉", "In a homogeneous mixture, the components cannot be seen separately and every part has the same composition - like salt solution or steel. In a heterogeneous mixture, the components CAN be seen separately and composition varies from part to part - like soil, or oil and water.", "Tea with sugar dissolved in it and stirred well looks completely uniform - you cannot see separate tea and sugar particles anywhere in the cup. Is this a homogeneous or heterogeneous mixture?", "Homogeneous - the components are mixed so thoroughly that they cannot be seen or distinguished separately anywhere in the mixture.", undefined, [116, 117]),
      C("10.5", "Separating mixtures I: sublimation, centrifugation, solvent extraction", "🌀", "Sublimation separates a solid that turns straight to vapour on heating (like iodine or camphor) from one that doesn't. Centrifugation spins a mixture at high speed so heavier solids move outward/down and lighter liquid stays put - used to separate cream from milk or blood cells from plasma. Solvent extraction separates two immiscible liquids (like oil and water) using a separating funnel.", "A washing machine spins wet clothes at very high speed to fling the water out of them. Which separation method is this an everyday example of?", "Centrifugation - spinning at high speed uses centrifugal force to separate the denser material (the wet clothes) from the lighter liquid (the water), pushing the water outward and away.", undefined, [117, 118]),
      C("10.6", "Separating mixtures II: distillation and chromatography", "🧫", "Simple distillation (evaporation + condensation) purifies a liquid from a solution - used to turn seawater into drinking water - and separates two liquids whose boiling points differ by more than 25 K. Fractional distillation separates liquids whose boiling points differ by less than 25 K, as in refining petroleum. Chromatography separates components of a mixture by their different solubilities in a solvent - as in paper chromatography, which separates the different coloured dyes in ink.", "Seawater is heated in a flask; the water vapour that rises is cooled back into pure liquid in a separate container, and the salt is left behind. Which separation method is this?", "Simple distillation - it combines evaporation (turning the water to vapour, leaving the salt behind) and condensation (cooling the vapour back into pure liquid water) to purify the liquid from the solution.", undefined, [118, 119]),
      C("10.7", "Solutions: true solutions, colloids and suspensions", "🥛", "A solution is a homogeneous mixture of a solute (lesser amount) in a solvent (greater amount). Based on particle size: a true solution's particles never settle and stay clear; a colloid's particles are bigger, stay cloudy and suspended, and show the Tyndall effect (a visible light beam scattering through it); a suspension's particles are biggest and visibly settle out over time.", "You shine a bright flashlight through a glass of milky liquid and can clearly see the beam's path glowing as it crosses the liquid. What is this glowing-beam effect called, and what kind of mixture shows it?", "This is the Tyndall effect, and it happens in a colloid - the beam scatters visibly off the colloid's mid-sized particles, something a true solution's much smaller particles do not do.", undefined, [119, 120]),
      C("10.8", "Colloidal solutions", "🫧", "A colloidal solution has a dispersed phase (like the solute) and a dispersion medium (like the solvent), each of which can be solid, liquid or gas - giving eight possible combinations, each with its own name: sol (solid in liquid, e.g. paint), gel (liquid in solid, e.g. jelly), aerosol (solid or liquid in gas, e.g. smoke or fog), foam (gas in liquid, e.g. soap lather), and solid foam (gas in solid, e.g. bread).", "Shaving foam is made of tiny bubbles of gas trapped inside a liquid. What type of colloid is this called?", "A foam - it is the name for a colloid where gas is the dispersed phase and liquid is the dispersion medium.", undefined, [120, 120]),
      C("10.9", "Emulsions", "🥧", "An emulsion is a colloid formed from two immiscible liquids, one dispersed as droplets inside the other. An oil-in-water (O/W) emulsion has oil droplets dispersed in water (e.g. cream); a water-in-oil (W/O) emulsion has water droplets dispersed in oil (e.g. butter). Milk, cough syrups and facial creams are other common emulsions.", "In butter, tiny droplets of water are dispersed throughout a continuous layer of fat. Is this an oil-in-water or a water-in-oil emulsion?", "A water-in-oil (W/O) emulsion - the water forms the scattered droplets, and the oil/fat forms the continuous medium they are dispersed in, exactly the reverse of an oil-in-water emulsion like cream.", undefined, [121, 122]),
    ],
  },
  {
    // Deepened to match the real textbook pages 125-134 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Ten real sections (11.1-11.8 with their
    // sub-sections) - the densest unit rebuilt so far. The gold-foil
    // experiment and the electron-shell diagram (Oxygen, Z=8, matching
    // the book's own Figure 11.7) are safe illustrative/concentric-circle
    // layouts; the formula-heavy sections use text cards.
    number: 11, title: "Atomic Structure", concepts: [
      C("11.1", "Discovery of the nucleus: Rutherford's model", "⚛️", "Rutherford fired alpha particles at thin gold foil: most passed straight through (atoms are mostly empty space), some deflected slightly, and very few bounced almost straight back (a tiny, dense, positively charged nucleus at the centre repelled them). Electrons revolve around this nucleus in orbits; the atom overall is electrically neutral (protons = electrons).", "In Rutherford's gold foil experiment, a few alpha particles bounced almost straight back the way they came. What did this specific observation prove about the atom?", "That the atom has a tiny, extremely dense, positively charged nucleus at its centre - only something that small, dense and positively charged could repel a fast, positive alpha particle straight back.", undefined, [125, 126]),
      C("11.2", "Bohr's model of the atom", "🪐", "Rutherford's model couldn't explain why electrons don't spiral into the nucleus and lose energy. Bohr fixed this: electrons move in fixed, stationary circular orbits (shells: K, L, M, N... or n = 1,2,3,4...) without gaining or losing energy while they stay in that orbit - they only jump shells by absorbing or releasing a fixed amount of energy. Bohr's model applied only to hydrogen and hydrogen-like single-electron ions.", "According to Bohr's model, what has to happen for an electron to jump from a lower shell up to a higher energy shell?", "It must absorb a fixed amount of energy - an electron only moves between shells by absorbing energy (to go up) or releasing energy (to go down), never gradually.", undefined, [126, 127]),
      C("11.3", "Discovery of neutrons", "🎯", "In 1932, James Chadwick found that bombarding beryllium with alpha particles released a new particle with about the same mass as a proton, but no electric charge at all - the neutron. Its symbol is ₀n¹ (mass 1, charge 0), and its mass is about 1.676 × 10⁻²⁴ g (1 amu).", "Chadwick's newly discovered particle was not deflected at all by any magnetic or electric field. What did this prove about it?", "That it was electrically neutral (uncharged) - only a particle with no electric charge would be completely unaffected by magnetic or electric fields, which is exactly why it was named the neutron.", undefined, [127, 127]),
      C("11.4", "The three fundamental particles", "🧩", "Electrons (charge -1, mass ≈ 1/1837 amu, found orbiting the nucleus), protons (charge +1, mass ≈ 1 amu, in the nucleus) and neutrons (charge 0, mass ≈ 1 amu, in the nucleus) are the atom's three key sub-atomic particles. Protons and neutrons together are called nucleons.", "Which of the three fundamental particles has a mass so small compared to the other two that it's usually treated as negligible when calculating an atom's total mass?", "The electron - its mass is only about 1/1837th of a proton's or neutron's mass, so an atom's mass essentially comes from its protons and neutrons (nucleons) alone.", undefined, [127, 127]),
      C("11.5", "Atomic number and mass number", "🔢", "Atomic number (Z) = number of protons = number of electrons - it's what identifies which element an atom is. Mass number (A) = number of protons + number of neutrons. So number of neutrons = A − Z.", "An element has a mass number of 35 and 18 neutrons in its nucleus. Find its atomic number.", "17: Atomic number = Mass number − Number of neutrons = 35 − 18 = 17 (this is chlorine).", undefined, [128, 128]),
      C("11.6", "Electronic configuration", "🌀", "Electrons fill shells (K, L, M, N...) following the Bohr-Bury rules: a shell can hold at most 2n² electrons (K=2, L=8, M=18, N=32), shells fill in order of increasing energy, and the outermost shell can never hold more than 8 electrons even if it has room for more. Oxygen (Z=8) has configuration 2, 6.", "What is the electronic configuration of chlorine (atomic number 17)?", "2, 8, 7: the K shell holds 2, the L shell holds its maximum of 8, and the remaining 7 electrons go into the M shell.", undefined, [129, 130]),
      C("11.7", "Valence electrons and valency", "🔗", "The outermost shell is the valence shell, and its electrons (valence electrons) determine an element's chemical properties. Valency = number of electrons involved in a reaction: for 1-4 valence electrons, valency equals that number; for 5-7, valency = 8 minus that number; a completely filled outer shell (like neon's 2,8) gives zero valency.", "Chlorine's electronic configuration is 2, 8, 7 - seven valence electrons. What is its valency?", "1: since chlorine has more than 4 valence electrons, valency = 8 − 7 = 1.", undefined, [129, 131]),
      C("11.8", "Isotopes, isobars and isotones", "🧬", "Isotopes: same atomic number, different mass number (same element, different neutron count) - like hydrogen's three forms, all with Z=1 but mass numbers 1, 2, 3. Isobars: different atomic number, same mass number - calcium (Z=20) and argon (Z=18), both mass number 40. Isotones: same number of neutrons, but different atomic AND mass numbers - boron and carbon, both with 6 neutrons.", "Chlorine-35 and Chlorine-37 both have atomic number 17, but different mass numbers (35 and 37). What are atoms like these called?", "Isotopes - atoms of the same element (same atomic number/proton count) that differ only in their mass number, because they have different numbers of neutrons.", undefined, [131, 133]),
      C("11.9", "Laws of chemical combination", "⚖️", "Law of multiple proportions (Dalton): when carbon combines with oxygen to form CO and CO2, the oxygen masses for the same fixed mass of carbon are in a simple ratio (1:2). Law of reciprocal proportions (Richter): hydrogen and oxygen each combining separately with a fixed mass of carbon gives the same mass ratio (1:8) as hydrogen and oxygen combining directly in water. Gay-Lussac's Law of Combining Volumes: reacting gas volumes are in a simple whole-number ratio - 1 volume hydrogen + 1 volume chlorine → 2 volumes hydrogen chloride (1:1:2).", "In a real reaction, 1 volume of nitrogen combines with 3 volumes of hydrogen to produce 2 volumes of ammonia gas (NH3). What ratio does this show, and which law does it confirm?", "A ratio of 1:3:2 - a simple whole-number ratio of reacting and product gas volumes, which is exactly what Gay-Lussac's Law of Combining Volumes predicts.", undefined, [133, 134]),
      C("11.10", "Quantum numbers", "🔬", "Just as a building's full address needs country, state, city and street, an electron's full 'address' needs four quantum numbers: principal (n, main energy level), azimuthal (l, sub-shell/orbital shape), magnetic (m, orbital orientation), and spin (s, the electron's spin).", "Which quantum number tells you an electron's main energy level - the broadest part of its 'address', similar to knowing which country a building is in?", "The principal quantum number (n) - it identifies the main energy level (shell) the electron occupies, the broadest piece of information in its four-part 'address'.", undefined, [134, 134]),
    ],
  },
  {
    // Deepened to match the real textbook pages 138-145 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Eight real sections tracing the actual historical
    // progression the book teaches (Dobereiner -> Newlands -> Mendeleev
    // -> modern table), each with the book's own real facts/examples. The
    // s/p/d/f block diagram is a schematic (relative block positions,
    // which are factually correct) rather than a cell-by-cell periodic
    // table; everything else uses text cards.
    number: 12, title: "Periodic Classification of Elements", concepts: [
      C("12.1", "Dobereiner's triads", "🔺", "In 1817, Dobereiner grouped elements into 'triads' of three, based on atomic mass - when arranged in increasing order, the middle element's atomic mass was nearly the average of the other two. Limitation: he could find only 3 such triads, and it failed for very light or very heavy elements.", "In the halogen triad, chlorine's atomic mass is 35.5 and iodine's is 126.9. Using Dobereiner's law, about what atomic mass would you predict for the middle element, bromine?", "About 81.2: the average of 35.5 and 126.9 is (35.5 + 126.9)/2 = 81.2 - very close to bromine's real atomic mass of 79.9.", undefined, [138, 139]),
      C("12.2", "Newlands' law of octaves", "🎵", "In 1866, Newlands arranged 56 known elements by increasing atomic mass and found every eighth element had similar properties to the first - like the eighth note in a musical octave. Limitations: it broke down after calcium, sometimes squeezed two elements into one slot, and later discoveries (noble gases) disrupted the pattern entirely.", "Newlands placed hydrogen (1st) and fluorine (8th) in the same group. Why, according to his law?", "Because every eighth element, counted in increasing order of atomic mass, was found to have properties similar to the first element - just like the eighth note in a musical octave returns to a note similar to the first.", undefined, [139, 140]),
      C("12.3", "Mendeleev's periodic table", "📊", "In 1869, Mendeleev arranged 56 elements by atomic mass into 8 groups and 7 periods, based on his law of periodicity. He famously left gaps for undiscovered elements and predicted their properties - his 'Eka-Silicon' prediction (atomic mass ~72) matched germanium (72.59) almost exactly when it was discovered in 1886. Limitation: elements with very different properties (like copper and sodium) ended up in the same group.", "Mendeleev predicted an undiscovered element he called 'Eka-Silicon' would have an atomic mass of about 72. When germanium was discovered in 1886, its actual atomic mass turned out to be 72.59. What does this show about Mendeleev's table?", "It shows the table's real predictive power - it successfully predicted the properties of an element that had not even been discovered yet, which was powerful evidence the underlying pattern was real.", undefined, [139, 141]),
      C("12.4", "The modern periodic law and table", "🧮", "In 1913, Moseley proved element properties depend on atomic number, not atomic mass. The modern periodic law: properties are periodic functions of atomic number. The modern table has 7 periods (rows, based on number of shells) and 18 groups (columns, based on similar properties/valence electrons).", "According to the modern periodic law, which single property determines an element's position in the periodic table?", "Atomic number - not atomic mass, which is what both Mendeleev's and the earlier classifications had mistakenly used.", undefined, [141, 141]),
      C("12.5", "Classification into s, p, d and f blocks", "🧱", "Elements are grouped by which subshell their valence electrons fill: s-block (groups 1-2, alkali/alkaline earth metals), p-block (groups 13-18, the most varied block - metals, non-metals AND metalloids), d-block (groups 3-12, in the middle, called transition elements), and f-block (lanthanides and actinides, placed at the very bottom, called inner transition elements).", "An element's valence electrons are in a d subshell, and it sits in the middle columns of the periodic table with properties in between typical s-block and p-block elements. Which block is it in?", "The d-block - these are the transition elements, found in groups 3 to 12, with properties intermediate between the s-block and p-block elements on either side.", undefined, [141, 143]),
      C("12.6", "Hydrogen's position and the noble gases", "🎈", "The modern table's advantages: it's based on atomic number (a more fundamental property), justifies isotopes sharing one position, and cleanly separates metals from non-metals. Hydrogen occupies a genuinely unique, debated position - it can lose its one electron like alkali metals, OR gain one electron like halogens. Noble gases (group 18) barely react at all, since their valence shells are already completely filled.", "Hydrogen can lose its only electron to form H+ (like alkali metals), but can also gain an electron to form H- (like halogens). What does this behavior tell you about hydrogen's position in the periodic table?", "That hydrogen has a genuinely unique position that is still debated - it shares real properties with two very different groups (alkali metals and halogens), unlike almost any other element.", undefined, [143, 144]),
      C("12.7", "Metals, non-metals and metalloids", "🔧", "Metals are typically hard, shiny, malleable and ductile with good electrical/thermal conductivity (mercury is the one liquid metal). Non-metals lack these properties and are found only in the p-block. Metalloids (like boron and arsenic) have properties of BOTH metals and non-metals.", "An element is hard, shiny, can be hammered into thin sheets (malleable), drawn into wire (ductile), and conducts electricity well. Is it a metal, a non-metal, or a metalloid?", "A metal - hardness, shininess, malleability, ductility and good electrical conductivity are the classic defining properties of metals.", undefined, [144, 144]),
      C("12.8", "Alloys", "⚙️", "An alloy is a mixture of two or more metals (occasionally with a non-metal), made by thoroughly mixing molten metals. Alloys often have more useful properties than the pure metals alone: less corrosion, greater hardness, lower conductivity, and sometimes a lower melting point (like solder, an alloy of lead and tin). An alloy of a metal with mercury is specifically called an amalgam.", "Solder, an alloy of lead and tin, has a LOWER melting point than either pure lead or pure tin alone. What does this demonstrate about a key advantage of alloying metals together?", "That alloying can give a metal more useful properties than either pure metal it's made from - here, a lower, more easily workable melting point than either lead or tin has on its own.", undefined, [144, 145]),
    ],
  },
  {
    // Deepened to match the real textbook pages 148-158 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Eight real sections. The Lewis dot symbols use the
    // book's own stated placement rule (one dot per side until all four
    // sides are occupied, then pair up) with real electron counts from
    // Table 13.3, so the dot counts are exact, not eyeballed; the rest use
    // text cards to avoid risking subtly wrong ionic/covalent structure
    // diagrams.
    number: 13, title: "Chemical Bonding", concepts: [
      C("13.1", "The octet rule (Kossel-Lewis theory)", "🔗", "Noble gases barely react because their valence shells are stable and complete. Kossel and Lewis proposed that other atoms combine because they have an INCOMPLETE valence shell and want to reach that same stable, 8-electron ('octet') configuration - either by losing, gaining, or sharing electrons. Atoms with 1-3 valence electrons tend to lose; atoms with 5-7 tend to gain.", "Sodium (electronic configuration 2,8,1) and chlorine (2,8,7) react together. Which one will lose an electron, and which will gain one, so both reach a stable 8-electron valence shell?", "Sodium loses its 1 valence electron (having only 1 is easier to give away than gain 7 more); chlorine gains 1 electron to complete its 7 up to 8 - both end up with a stable, noble-gas-like configuration.", undefined, [148, 149]),
      C("13.2", "Lewis dot structures", "⚫", "A Lewis dot structure shows an element's symbol surrounded by dots representing its valence electrons - one dot to each side (top, right, bottom, left) until all four sides have one, then dots are added in pairs. Hydrogen has 1 dot, carbon has 4 (one per side), oxygen has 6 (two sides paired, two single).", "How many dots would you draw around the symbol for nitrogen (electronic configuration 2,5) in its Lewis dot structure?", "5 dots - one for each of nitrogen's 5 valence electrons (four sides get one dot each, and the fifth electron pairs up with one of them).", undefined, [149, 150]),
      C("13.3", "Ionic (electrovalent) bond", "🧲", "An ionic bond forms when one atom transfers electrons to another - the atom that loses electrons becomes a positive cation, and the one that gains becomes a negative anion. Electrostatic attraction between them forms the bond. Ionic compounds are crystalline solids with high melting points, don't conduct electricity as solids (but do when molten or dissolved), and are soluble in water.", "Magnesium (electronic configuration 2,8,2) reacts with two chlorine atoms to form magnesium chloride (MgCl2). How many electrons does one magnesium atom lose, and what charge does the resulting ion carry?", "It loses 2 electrons, forming a magnesium cation with a 2+ charge (Mg2+) - since magnesium has 2 electrons more than the nearest stable noble-gas configuration (neon).", undefined, [150, 152]),
      C("13.4", "Covalent bond", "🤝", "A covalent bond forms when two atoms SHARE electrons, each contributing one to the shared pair, until both reach a stable octet. A single bond shares 1 pair (H-H), a double bond shares 2 pairs (O=O), and a triple bond shares 3 pairs (N≡N). Covalent compounds have lower melting points than ionic ones, don't conduct electricity, and are often gases or liquids.", "Two oxygen atoms combine to form O2, sharing TWO pairs of electrons between them. What type of covalent bond is this, and how is it written in line notation?", "A double covalent bond, written as O=O - each line represents one shared pair of electrons.", undefined, [152, 155]),
      C("13.5", "Fajan's rule: ionic vs. covalent character", "⚖️", "Not every ionic-looking bond is purely ionic. Fajan's rule (1923): a bond shows MORE covalent character when the cation is small and highly charged, and the anion is large - since the small, high-charge cation can distort (polarise) the large anion's electron cloud, preventing complete charge separation.", "A compound has a cation with a very high positive charge (+3) and a large anion. According to Fajan's rule, would you expect this compound to lean more ionic or more covalent?", "More covalent - a high cation charge combined with a large anion both push a bond toward covalent character, since the small, highly charged cation distorts the large anion's electron cloud rather than fully separating its charge.", undefined, [154, 155]),
      C("13.6", "Coordinate covalent (dative) bond", "➡️", "In a normal covalent bond, both atoms contribute one electron each. In a coordinate bond, BOTH shared electrons come from just one atom (the donor) - the other atom (the acceptor) contributes none. It's shown with an arrow (→) pointing from donor to acceptor, as in NH3→BF3.", "In the NH3→BF3 coordinate bond, ammonia donates a full lone pair of electrons to boron trifluoride, which is electron-deficient and accepts them. Which molecule is the donor, and which is the acceptor?", "NH3 (ammonia) is the donor - it provides both electrons of the shared pair. BF3 (boron trifluoride) is the acceptor - it receives them, since it doesn't have enough electrons of its own to complete a stable octet.", undefined, [155, 156]),
      C("13.7", "Oxidation, reduction and redox reactions", "🔄", "Oxidation = addition of oxygen, removal of hydrogen, or loss of electrons. Reduction = addition of hydrogen, removal of oxygen, or gain of electrons. When both happen together in the same reaction (as they usually do), it's called a redox reaction. An oxidising agent removes electrons from others (gets reduced itself); a reducing agent donates electrons to others (gets oxidised itself).", "In the reaction Zn + CuSO4 → ZnSO4 + Cu, zinc atoms lose electrons to become Zn2+ ions, while copper ions gain electrons to become copper metal. Which process is the zinc undergoing?", "Oxidation - losing electrons is exactly what defines oxidation. (The copper, gaining electrons at the same time, is being reduced - together this makes it a redox reaction.)", undefined, [156, 157]),
      C("13.8", "Oxidation number", "🔢", "Oxidation number is the charge an atom would have if electrons were fully assigned to the more electronegative atom in each bond. The oxidation numbers in a neutral compound always sum to zero; in an ion, they sum to the ion's overall charge. Standard values: H is usually +1, oxygen is usually -2.", "Find the oxidation number of manganese (Mn) in KMnO4, given K is +1 and O is -2.", "+7: (+1) + x + 4×(-2) = 0, so +1 + x − 8 = 0, giving x = +7.", undefined, [157, 158]),
    ],
  },
  {
    // Deepened to match the real textbook pages 162-169 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Nine real sections. The pH scale gradient bar is
    // safe (just marking real 0/7/14 boundaries, no false precision);
    // everything else uses text cards.
    number: 14, title: "Acids, Bases and Salts", concepts: [
      C("14.1", "Acids: definition and classification", "🍋", "An acid furnishes H+ (or H3O+) ions in water. Classified by source (organic: from living things, e.g. citric acid; inorganic: from rocks/minerals, e.g. HCl), by basicity (monobasic - 1 replaceable H, like HCl; dibasic - 2, like H2SO4; tribasic - 3, like H3PO4), and by ionisation (strong: ionise completely, like HCl; weak: partially, like CH3COOH).", "Sulphuric acid (H2SO4) gives 2 hydrogen ions per molecule in solution. What is this classification called?", "A dibasic acid - basicity refers to the number of replaceable hydrogen atoms per molecule, and H2SO4 gives 2.", undefined, [162, 163]),
      C("14.2", "Properties and uses of acids", "⚗️", "Acids taste sour, conduct electricity in solution, turn blue litmus red, react with active metals to release hydrogen gas, react with carbonates to release CO2, and neutralise bases to form salt and water. Sulphuric acid ('King of Chemicals') is used in car batteries; hydrochloric acid cleans toilets; citric acid preserves food.", "Magnesium reacts with dilute sulphuric acid: Mg + H2SO4 → MgSO4 + H2. What gas is produced, and how could you test for its presence?", "Hydrogen gas - you can test for it by bringing a burning candle or splint near the gas; it goes out with a characteristic 'popping' sound.", undefined, [164, 164]),
      C("14.3", "Aquaregia", "🥇", "Gold and silver don't react with HCl or HNO3 alone, but a 3:1 molar mixture of HCl and HNO3 (called aquaregia, Latin for 'king's water') can dissolve gold. It's a yellow-orange, highly corrosive fuming liquid, used to dissolve, clean and refine gold and platinum.", "Aquaregia is a mixture of hydrochloric acid and nitric acid in what molar ratio, and what can it dissolve that neither acid can dissolve alone?", "A 3:1 ratio (HCl:HNO3) - and it can dissolve noble metals like gold and platinum, which resist both acids individually.", undefined, [165, 165]),
      C("14.4", "Bases: definition and classification", "🧴", "A base releases OH- ions in water. Bases soluble in water are specifically called alkalis (all alkalis are bases, but not all bases are alkalis - e.g. Al(OH)3 is a base but not an alkali). Classified by acidity (monoacidic - 1 OH-, like NaOH; diacidic - 2, like Ca(OH)2; triacidic - 3, like Al(OH)3).", "Calcium hydroxide, Ca(OH)2, ionises to release 2 hydroxide ions per molecule. What is this classification called?", "A diacidic base - acidity (for a base) refers to the number of replaceable hydroxide ions per molecule, and Ca(OH)2 releases 2.", undefined, [165, 166]),
      C("14.5", "Properties and uses of bases", "🧼", "Bases taste bitter, feel soapy, turn red litmus blue, conduct electricity in solution, react with metals to release hydrogen gas, and neutralise acids to form salt and water. Sodium hydroxide makes soap; calcium hydroxide whitewashes buildings; magnesium hydroxide treats stomach acidity.", "Zinc reacts with sodium hydroxide: Zn + 2NaOH → Na2ZnO2 + H2. What gas is liberated - just like when a metal reacts with an acid?", "Hydrogen gas - bases can react with certain metals to liberate hydrogen, just as acids do.", undefined, [166, 167]),
      C("14.6", "Testing for acids and bases", "🎨", "Litmus paper: acids turn blue litmus red; bases turn red litmus blue. Phenolphthalein: colourless in acid, pink in base. Methyl orange: pink in acid, yellow in base.", "A colourless liquid turns phenolphthalein indicator pink. Is the liquid acidic or basic?", "Basic - phenolphthalein specifically turns pink in a basic (alkaline) solution, and stays colourless in an acidic one.", undefined, [167, 167]),
      C("14.7", "The pH scale", "📏", "The pH scale (0-14) measures hydrogen ion concentration. Acids have pH less than 7, bases have pH greater than 7, and a neutral solution (like pure water) has pH exactly 7. 'p' stands for the German 'potenz' (power).", "A solution has a pH of 3. Is it acidic, neutral, or basic?", "Acidic - any pH below 7 indicates an acidic solution, and 3 is well below 7.", undefined, [168, 168]),
      C("14.8", "Types of salts", "🧂", "Salts form when acids and bases react. Normal salt: complete neutralisation (NaOH + HCl → NaCl + H2O). Acid salt: partial replacement of a polybasic acid's hydrogens (NaOH + H2SO4 → NaHSO4 + H2O). Basic salt: partial replacement of a base's hydroxides. Double salt: two simple salts combined and crystallised together, like potash alum.", "When a base only PARTIALLY neutralises a polybasic acid like H2SO4, forming NaHSO4 (which still has one replaceable hydrogen left), what type of salt is this?", "An acid salt - formed by only partial replacement of a polybasic acid's hydrogen ions, unlike a normal salt where neutralisation is complete.", undefined, [168, 168]),
      C("14.9", "Properties, hydration and identification of salts", "🔬", "Salts are mostly solids, often water-soluble, and hygroscopic. Many contain 'water of crystallisation' (hydrated salts) - like blue CuSO4·5H2O, which turns white when heated as the water is driven off. Flame tests identify metal ions by colour: Ca2+ gives brick red, Na+ gives golden yellow, K+ gives pink-violet.", "Blue copper sulphate crystals (CuSO4·5H2O) turn white when heated strongly. Why?", "Heating drives off the water of crystallisation, turning the blue hydrated salt into its white anhydrous (water-free) form.", undefined, [168, 169]),
    ],
  },
  {
    // Deepened to match the real textbook pages 172-182 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Ten real sections, including the book's real-world
    // plastics/resin-code/Tamil-Nadu-plastic-ban content, which the
    // original 3-concept version omitted entirely. The classification
    // tree and allotrope comparison are safe box/line layouts; the rest
    // use text cards.
    number: 15, title: "Carbon and its Compounds", concepts: [
      C("15.1", "Discovery of carbon - milestones", "🕰️", "In 1772, Lavoisier proved diamond is made of carbon by burning it to CO2. In 1796, Tennant proved diamond and charcoal burn to give the same amount of CO2 for equal weights - proving both are pure carbon. In 1955, Bundy's team at General Electric transformed graphite into diamond under high temperature and pressure. In 1985, fullerenes were discovered; graphene followed in 2004.", "In 1796, Smithson Tennant burned equal weights of diamond and charcoal. What did he find, and what did it prove?", "He found they produced the same amount of carbon dioxide - proving that diamond and charcoal are both pure carbon, just in different forms.", undefined, [172, 173]),
      C("15.2", "Classification of carbon compounds", "🗂️", "Organic carbon compounds come from living organisms (plants/animals) - like ethanol, cellulose and starch. Inorganic carbon compounds come from non-living sources - like carbon monoxide (CO), carbon dioxide (CO2), calcium carbonate (CaCO3) and sodium bicarbonate (NaHCO3). Organic compounds vastly outnumber inorganic ones (over 5 million known).", "Kerosene and cellulose both ultimately come from living organisms or their remains. What classification of carbon compound is this?", "Organic - carbon compounds obtained from living organisms (plants and animals) are classified as organic, regardless of how they're later processed.", undefined, [173, 174]),
      C("15.3", "Catenation", "🔗", "Catenation is an element's ability to bond repeatedly with itself through covalent bonds, forming linear chains, branched chains, or rings. Carbon does this more than any other element, which is the main reason so many organic carbon compounds exist.", "Starch and cellulose are both made of chains of hundreds of carbon atoms linked together. What is this carbon-to-carbon self-linking property called?", "Catenation - carbon's ability to bond repeatedly to itself, forming long chains, branches, or rings.", undefined, [174, 175]),
      C("15.4", "Tetravalency and multiple bonds", "🔢", "Carbon (electronic configuration 2,4) needs 4 more electrons for a stable octet, so it forms 4 covalent bonds - its tetravalency. These bonds can be single (methane, alkanes), double (ethene, alkenes), or triple (ethyne, alkynes) - carbon's tetravalency lets it combine with itself or other elements through any of these.", "In ethyne (acetylene), written H-C≡C-H, how many electron pairs are shared between the two carbon atoms?", "3 pairs - the three lines in H-C≡C-H represent a triple bond, meaning three shared electron pairs between the carbon atoms.", undefined, [175, 175]),
      C("15.5", "Isomerism", "🔀", "The molecular formula C2H6O can be arranged as CH3-CH2-OH (ethanol, an alcohol) or CH3-O-CH3 (dimethyl ether) - the same atoms, different arrangement, completely different properties. This is isomerism: the same molecular formula giving different structural arrangements. Compounds like these are called isomers.", "The molecular formula C2H6O can form either an alcohol or an ether, depending on how its atoms are arranged, with each having completely different properties. What is this phenomenon called?", "Isomerism - the same molecular formula can produce different structural arrangements (isomers) with different physical and chemical properties.", undefined, [175, 176]),
      C("15.6", "Allotropy: diamond, graphite and fullerene", "💎", "Allotropy is an element existing in more than one physically different, chemically similar form. Diamond: each carbon bonds to 4 others in a rigid 3D tetrahedral lattice - hard, non-conducting. Graphite: each carbon bonds to only 3 others in flat hexagonal layers held together by weak Van der Waals forces - soft, slippery, and conducts electricity. Fullerene (C60, 'Buckyball'): 60 carbon atoms in a soccer-ball-shaped sphere.", "In graphite, carbon atoms form flat hexagonal layers held together only by weak forces between layers. Why does this structure make graphite soft and able to conduct electricity, unlike diamond?", "The weak forces between layers let them slide past each other easily (making graphite soft and slippery), and its structure leaves electrons free to move, letting it conduct electricity - unlike diamond's rigid, fully covalent 3D lattice with no free electrons.", undefined, [176, 177]),
      C("15.7", "Physical and chemical properties of carbon", "🔥", "Carbon's allotropes are all solids; its compounds can be solid, liquid or gas. Carbon burns in oxygen to form CO or CO2 (oxidation/combustion). It reacts with steam to form 'water gas' (CO + H2), with sulphur to form CS2, and with metals like tungsten at high temperature to form carbides (like WC).", "Carbon reacts with steam to form a mixture of carbon monoxide and hydrogen gas. What is this specific mixture called?", "Water gas - the name for the CO + H2 mixture produced when carbon reacts with steam.", undefined, [177, 178]),
      C("15.8", "Plastics: benefits and drawbacks", "🧴", "Plastics are catenated organic carbon compounds (polymer resins). They've enabled real benefits: better healthcare, food safety, smartphones and computers. But drawbacks are real too: plastics take extremely long to break down, too few microbes exist to handle the volume produced, much doesn't get recycled, some contain harmful additives, and burning releases toxic gases.", "Plastics have enabled major technological breakthroughs like smartphones and modern healthcare, but they also take an extremely long time to break down in nature, faster than microbes can handle. What does this reveal about the tradeoff plastics represent?", "That plastics bring real, significant benefits to daily life and technology, but at a real environmental cost - they persist in nature far longer than they can naturally be broken down, given how much is produced.", undefined, [178, 178]),
      C("15.9", "Resin codes and harmful plastics", "♻️", "Resin codes (numbered 1-7, designed in 1988) identify the polymer type in a plastic item, helping recyclers sort them. Three types use notably harmful additives: PVC (#3, contains heavy metals; releases toxic dioxins when burned), PS/Thermocol (#6, contains styrene, possibly carcinogenic, leaks into hot/oily food), and PC/ABS (#7, contains BPA, which disrupts hormones).", "PVC (resin code #3) contains heavy metals like cadmium and lead, and releases dioxins - among the most toxic chemicals known - when burned. What does this show about a source of harm plastics can cause, even before disposal?", "That plastics can be harmful because of the toxic chemical additives put into them (for properties like flexibility or fire resistance) - dioxins released when burning PVC are one of the most dangerous real examples.", undefined, [179, 180]),
      C("15.10", "Tamil Nadu's plastic ban and your role", "🚫", "Under the Environment (Protection) Act 1988, Tamil Nadu banned one-time-use and throwaway plastics (bags, plates, water pouches, straws, sheets) from 1st January 2019. Globally, 2 million plastic bags are used every minute, and 97% are never recycled. Students can help by learning resin codes, avoiding harmful/one-time plastics, and educating others.", "Tamil Nadu banned one-time use and throwaway plastics starting from a specific date. What date, and under which law?", "From 1st January 2019, under provisions of the Environment (Protection) Act, 1988.", undefined, [180, 182]),
    ],
  },
  {
    // Deepened to match the real textbook pages 185-195 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." The original 3-concept version covered materials
    // the book doesn't even discuss (cement, glass, detergents) - the
    // real Unit 16 surveys seven distinct branches of applied chemistry
    // (nano, pharmaceutical, electro, radio, dye, agricultural/food,
    // forensic), consolidated into ten concepts here. Entirely
    // definitional/classificatory content, so text cards throughout
    // except one safe electrochemical-cell diagram.
    number: 16, title: "Applied Chemistry", concepts: [
      C("16.1", "Nanochemistry", "🔬", "Nanochemistry studies materials at the atomic/molecular scale (1 nanometre = 1/1,000,000,000 metre - a DNA double helix is 2 nm across, a hydrogen atom about 0.2 nm). Nanomaterials have unique properties (larger surface area, higher surface energy) not seen in bulk materials, used in stain-resistant textiles, sunscreens and electronics - but they're also unstable, highly reactive, and can be biologically toxic.", "A cold-causing virus has a diameter of about 30 nm, while a hydrogen atom is about 0.2 nm across. Roughly how many hydrogen atoms could fit side by side across the width of that virus?", "About 150: 30 ÷ 0.2 = 150 hydrogen atoms could fit across the virus's width.", undefined, [185, 186]),
      C("16.2", "Pharmaceutical chemistry: drugs", "💊", "A drug is a substance used to modify physiological or pathological states for the patient's benefit (WHO). A proper drug must not be toxic, cause side effects, or disrupt normal physiology, and must be effective. Drugs come from plants (morphine), chemical synthesis (aspirin), animals (insulin), minerals (liquid paraffin), microorganisms (penicillin), or genetic engineering (growth hormone).", "A new chemical compound causes a serious side effect and disrupts normal physiological activity. According to the required characteristics of a proper drug, should it be approved?", "No - a proper drug must NOT cause side effects and must NOT affect normal physiological activities, alongside not being toxic and being effective.", undefined, [186, 187]),
      C("16.3", "Types of drugs I: anaesthetics, analgesics, antipyretics", "💉", "Anaesthetics cause loss of sensation - general (full unconsciousness, for major surgery) or local (numbs one area, e.g. dental work). Chemicals used: nitrous oxide (safest), ether, and formerly chloroform. Analgesics relieve pain without unconsciousness (aspirin). Antipyretics reduce fever (aspirin, paracetamol).", "A dentist needs to numb just one tooth for a minor procedure, without making the patient lose consciousness. Which type of anaesthetic should be used?", "A local anaesthetic - it numbs sensation in a specific area without affecting the patient's overall consciousness, unlike a general anaesthetic.", undefined, [187, 188]),
      C("16.4", "Types of drugs II: antiseptics, antimalarial, antibiotics, antacids", "🦠", "Antiseptics prevent infection (iodoform, phenol, hydrogen peroxide). Antimalarials treat malaria (quinine, from Cinchona bark). Antibiotics inhibit disease-causing microorganisms - Fleming discovered the first, penicillin, in 1929 from the mold Penicillium notatum. Antacids relieve stomach acidity (contain magnesium/aluminium hydroxides).", "Alexander Fleming discovered the first antibiotic in 1929. What was it called, and from which mold did it come?", "Penicillin - discovered from the mold Penicillium notatum.", undefined, [188, 189]),
      C("16.5", "Electrochemistry", "🔋", "Electrochemistry studies the link between electrical energy and chemical change, via electrochemical cells with two electrodes (anode: oxidation/electron loss; cathode: reduction/electron gain) in an electrolyte. A galvanic cell converts chemical energy INTO electricity (half-cells separated, connected by a salt bridge); an electrolytic cell uses electricity to drive a chemical reaction (electrolysis) - both involve redox reactions.", "In an electrochemical cell, at which electrode does oxidation take place - the anode or the cathode?", "The anode - oxidation (loss of electrons) always happens at the anode, while reduction (gain of electrons) happens at the cathode.", undefined, [189, 191]),
      C("16.6", "Radiochemistry", "☢️", "Unstable isotopes lose energy as radiation to become stable - this is radioactive decay, and such isotopes are radioisotopes. Applications: radiocarbon dating (using C-14 to date fossils), medical diagnosis (Iodine-131 for thyroid, Sodium-24 for blood clots, Cobalt-60 for cancer), and radiotherapy (treating cancer, hyperthyroidism).", "A doctor wants to check a patient's thyroid gland for disorders using a radioisotope. Which radioisotope does the book specifically list for this?", "Iodine-131 - used for the location and detection of thyroid gland disorders (and brain tumours).", undefined, [191, 191]),
      C("16.7", "Dye chemistry", "🎨", "A dye must have a suitable colour, be fixable to fabric, resist fading in light, and resist water/acid/alkali. Classified by application: acid dyes (wool/silk), basic dyes, mordant/indirect dyes (need pretreatment, e.g. alizarin), direct dyes (fix straight onto cotton, e.g. Congo red), and vat dyes (cotton only, continuous process, e.g. indigo).", "A dye has a poor natural affinity for cotton fabric and needs the fibre pretreated with a special substance before it will fix properly. What type of dye is this?", "A mordant dye (indirect dye) - it requires pretreatment of the fibre with a mordant before the dye can combine with it to form a fixed, insoluble complex.", undefined, [191, 193]),
      C("16.8", "Agricultural chemistry", "🌾", "Agricultural chemistry applies chemistry to farming, aiming to increase crop yield, improve food quality, and reduce production costs. Key applications: soil testing (pH, porosity, texture), chemical fertilizers (NPK - Nitrogen, Phosphorous, Potassium), and pesticides/insecticides (chlorinated hydrocarbons, organophosphates, carbamates) to protect crops.", "A farmer's field has crops being damaged by insects. What category of chemical would specifically address this problem?", "Pesticides/insecticides - chemically synthesized compounds (like chlorinated hydrocarbons, organophosphates or carbamates) used to protect crops from pests and insects.", undefined, [193, 193]),
      C("16.9", "Food chemistry", "🍽️", "The body needs three kinds of food: body-building (proteins), energy-giving (carbohydrates and fats), and protective (vitamins and minerals, preventing deficiency diseases) - together in the right proportion, a balanced diet. Food additives serve specific functions: preservatives, colourants, artificial sweeteners, flavour enhancers, and antioxidants (like Vitamin C/E, which also protect against cardiovascular disease).", "Vitamin C is added to a packaged food specifically to prevent the food from reacting with oxygen and spoiling. What type of food additive is this?", "An antioxidant - it prevents oxidation of the food, and also helps protect the body against cardiovascular disease.", undefined, [193, 194]),
      C("16.10", "Forensic chemistry", "🔎", "Forensic chemists apply scientific principles to crime investigation in four steps: collecting evidence, analysing it (blood, DNA), collaborating with investigators, and reporting findings. Methods include fingerprint analysis (ninhydrin turns purple reacting with amino acids in perspiration), biometrics, and the alcohol breath test (a redox reaction turns the test solution from orange to green as alcohol is oxidised).", "A hidden (occult) fingerprint on a cheque is made visible using a chemical that turns purple when it reacts with amino acids in perspiration. What is this chemical?", "Ninhydrin - it reacts with amino acids present in perspiration, turning purple to reveal otherwise invisible fingerprints.", undefined, [194, 195]),
    ],
  },
  {
    // Deepened to match the real textbook pages 199-209 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Fifteen real sections - the book's 9 invertebrate
    // phyla (17.2.1-17.2.9) each kept as their own concept, matching
    // real textbook granularity, plus taxonomy basics and vertebrate
    // classes. The taxonomic-hierarchy tree is a safe box/line layout;
    // everything else uses text cards (purely classificatory content,
    // no geometry to risk).
    number: 17, title: "Animal Kingdom", concepts: [
      C("17.1", "The taxonomic hierarchy", "🗂️", "Classification arranges organisms into a hierarchy of seven ranks, from broadest to narrowest: Kingdom, Phylum, Class, Order, Family, Genus, Species. Each rank groups organisms that share more specific characteristics than the rank above it.", "What are the seven ranks of the taxonomic hierarchy, from broadest to narrowest?", "Kingdom → Phylum → Class → Order → Family → Genus → Species.", undefined, [200, 200]),
      C("17.2", "Basis for classification: symmetry, germ layers, coelom", "🔬", "Symmetry: radial (body parts around a central axis, like Hydra/starfish) or bilateral (two identical halves, like Frog). Germ layers: diploblastic (2 layers - ectoderm/endoderm, like Hydra) or triploblastic (3 layers, adding mesoderm, like Rabbit). Coelom: acoelomate (no cavity, e.g. Tapeworm), pseudocoelomate (false cavity, e.g. Roundworm), or coelomate (true, mesoderm-lined cavity, e.g. Earthworm).", "A tapeworm has no body cavity at all between its gut and body wall. What is this classification of coelom called?", "Acoelomate - animals with no body cavity at all, unlike pseudocoelomates (false cavity) or true coelomates.", undefined, [200, 201]),
      C("17.3", "Binomial nomenclature", "🏷️", "Carolus Linnaeus introduced naming organisms with two Latin names: genus (capitalized) then species (lowercase). E.g. Homo sapiens (Man), Panthera tigris (Tiger), Canis familiaris (Dog).", "In the scientific name 'Panthera tigris' (tiger), which part is the genus and which is the species - and how is each capitalized?", "'Panthera' is the genus, written with a capital letter; 'tigris' is the species, written in lowercase.", undefined, [203, 203]),
      C("17.4", "Phylum Porifera (sponges)", "🧽", "Multicellular, non-motile, mostly marine animals with cellular grade of organization. The body is perforated with pores (ostia) leading to a canal system that circulates water carrying food and oxygen. Spicules form the skeletal framework. E.g. Euplectella, Sycon.", "Sponges have tiny pores called ostia all over their bodies. What passes through these pores, and where does it go?", "Water passes through the ostia into a canal system that circulates it through the body, carrying food and oxygen.", undefined, [202, 202]),
      C("17.5", "Phylum Coelenterata (Cnidaria)", "🪼", "Aquatic, radially symmetrical, diploblastic animals with tissue-grade organization. A jelly-like mesoglea separates the ectoderm and endoderm. A central coelenteron (gastrovascular cavity) has a mouth ringed by stinging tentacles (cnidoblasts/nematocysts). Many show polymorphism. E.g. Hydra, Jellyfish.", "Hydra's tentacles have stinging cells used to capture prey. What are these specialised cells called?", "Cnidoblasts (also called nematocysts).", undefined, [202, 202]),
      C("17.6", "Phylum Platyhelminthes (flatworms)", "🪱", "Bilaterally symmetrical, triploblastic, acoelomate animals, mostly parasitic - using suckers and hooks to attach to a host. Excretion happens through flame cells. Most are hermaphrodites (both sexes in one individual). E.g. Liver fluke, Tapeworm.", "Most flatworms are parasitic, using suckers and hooks to attach to a host. What specialised cells do they use for excretion?", "Flame cells.", undefined, [202, 203]),
      C("17.7", "Phylum Aschelminthes (roundworms)", "🐛", "Bilaterally symmetrical, triploblastic animals with a pseudocoelom (false body cavity). The body is round, pointed at both ends, unsegmented, and covered by a thin cuticle. Sexes are separate. Cause diseases like elephantiasis and ascariasis. E.g. Ascaris, Wuchereria.", "Roundworms like Ascaris have separate sexes and cause diseases like ascariasis in humans. What type of body cavity do they have?", "A pseudocoelom - a false body cavity, unlike a true coelom.", undefined, [203, 203]),
      C("17.8", "Phylum Annelida (segmented worms)", "🪱", "Bilaterally symmetrical, triploblastic - the first TRUE coelomate animals, with organ-system grade of organization. The body is externally divided into segments (metameres) joined by annuli. Setae and parapodia aid locomotion. E.g. Nereis, Earthworm, Leech.", "The earthworm's body is externally divided into ring-like segments. What are these individual segments called?", "Metameres - joined together by ring-like structures called annuli.", undefined, [203, 203]),
      C("17.9", "Phylum Arthropoda (jointed-legged animals)", "🦂", "The LARGEST animal phylum. Bilaterally symmetrical, triploblastic, coelomate, with a body divided into head, thorax and abdomen, and paired jointed legs. A chitin exoskeleton is shed periodically (moulting). Blood (haemolymph) flows freely (open circulatory system). E.g. Prawn, Crab, Cockroach, Centipede, Spider, Scorpion.", "As an arthropod like a crab grows, it periodically sheds and regrows its hard exoskeleton. What is this process called?", "Moulting.", undefined, [203, 203]),
      C("17.10", "Phylum Mollusca (soft-bodied animals)", "🐚", "A diverse group living in marine, freshwater and land habitats. The soft, unsegmented, bilaterally symmetrical body divides into head, muscular foot and visceral mass. A mantle (fold of skin) secretes the hard calcareous shell. Respiration is via gills, lungs, or both. E.g. Garden snail, Octopus.", "A snail's shell is hard and calcareous, but what thin fold of skin actually secretes it?", "The mantle.", undefined, [204, 204]),
      C("17.11", "Phylum Echinodermata (spiny-skinned animals)", "⭐", "Exclusively marine, triploblastic, TRUE coelomates with organ-system organization. Adults are radially symmetrical, but larvae are bilaterally symmetrical. A unique water vascular system powers locomotion via tube feet. Body wall is covered with spiny calcareous ossicles. E.g. Starfish, Sea urchin.", "A starfish moves using a unique fluid-filled system found in no other animal group. What is this system called, and what body part provides actual locomotion?", "The water vascular system - locomotion happens through tube feet powered by this system.", undefined, [204, 204]),
      C("17.12", "Phylum Hemichordata", "🪸", "Marine organisms with soft, worm-like (vermiform), unsegmented bodies. Bilaterally symmetrical and coelomate, with a genuine mix of non-chordate and chordate features - they have gill slits but NO true notochord. Ciliary feeders, mostly tube-dwelling. E.g. Balanoglossus (Acorn worm).", "Balanoglossus has gill slits, a feature shared with chordates, but it lacks one key chordate structure. What is missing?", "A notochord - it has gill slits but no true notochord, giving it a genuine mix of chordate and non-chordate features.", undefined, [204, 204]),
      C("17.13", "Phylum Chordata and Prochordata", "🐡", "Chordates are defined by a notochord, dorsal nerve cord, and paired gill pouches - all triploblastic and coelomate. Prochordata (the forerunners of vertebrates) splits into Urochordata (notochord only in the larva's tail; adults sessile, e.g. Ascidian) and Cephalochordata (notochord runs the full body length, fish-like, e.g. Amphioxus).", "In Amphioxus (Cephalochordata), the notochord runs the full length of the body. In Ascidians (Urochordata), where is the notochord found instead?", "Only in the tail region of the free-living larva - in the sessile adult, the notochord degenerates.", undefined, [204, 205]),
      C("17.14", "Vertebrata: jawless fish and Pisces", "🦈", "Vertebrates have a backbone replacing the embryonic notochord. Cyclostomata are jawless, eel-like, with a circular mouth and slimy scaleless skin (e.g. Lamprey, Hagfish). Pisces are cold-blooded, jawed, aquatic, with fins, scales, gills and a 2-chambered heart - split into cartilaginous fishes (sharks) and bony fishes (carps).", "A shark's skeleton is made of a flexible material, unlike a carp's bony skeleton. What are these two categories of fish called?", "Cartilaginous fishes (like sharks) and bony fishes (like carps).", undefined, [205, 205]),
      C("17.15", "Vertebrata: the four tetrapod classes", "🦎", "Amphibia: first four-legged vertebrates, moist skin, 3-chambered heart, eggs laid in water, tadpole larva (Frog). Reptilia: fully land-adapted, scaly skin, 3-chambered heart (except crocodiles: 4), tough-shelled eggs (Lizard, Snake). Aves: warm-blooded, feathers, wings, pneumatic bones, hard-shelled eggs (Pigeon). Mammalia: warm-blooded, hair, mammary glands, 4-chambered heart, mostly viviparous with a placenta (except egg-laying Platypus).", "A crocodile is the one reptile exception with a four-chambered heart, unlike other reptiles' three chambers. According to the book, which other vertebrate class is described as always having a four-chambered heart?", "Mammalia (mammals) - the book states mammals have a four-chambered heart, like the crocodile's exception among reptiles.", undefined, [205, 207]),
    ],
  },
  {
    // Deepened to match the real textbook pages 210-222 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Thirteen real sections covering plant tissues,
    // animal tissues and cell division. Entirely microscopic/cellular
    // content - text cards throughout, since hand-drawn cell/chromosome
    // diagrams risk being subtly wrong in ways a labelled fact card
    // cannot be.
    number: 18, title: "Organisation of Tissues", concepts: [
      C("18.1", "Meristematic tissues", "🌱", "Meristems are groups of immature, actively dividing (living) cells found in growth zones. Apical meristem (at root/shoot tips) increases length. Intercalary meristem (e.g. at the base of grass leaves) sits between permanent tissue regions. Lateral meristem increases thickness.", "Grasses have a region of actively dividing cells at the base of each leaf blade, letting grass keep growing after being mowed. What type of meristem is this?", "Intercalary meristem - found either at the base of a leaf (like grasses) or at the base of internodes.", undefined, [210, 211]),
      C("18.2", "Simple permanent plant tissues", "🍃", "Simple tissues are made of structurally similar cells. Parenchyma: thin-walled, living cells for storage/photosynthesis (Aerenchyma = with air spaces, in aquatic plants; Chlorenchyma = with chloroplasts). Collenchyma: living cells with unevenly thickened walls, giving mechanical support to growing organs. Sclerenchyma: dead, lignified, thick-walled cells (fibres and sclereids) for rigid support.", "In an aquatic plant, parenchyma cells develop large intercellular air spaces to help the plant float. What is this specific type of parenchyma called?", "Aerenchyma - parenchyma with intercellular air spaces, found in aquatic plants.", undefined, [211, 212]),
      C("18.3", "Complex tissue: Xylem", "🌳", "Xylem conducts water and minerals upward from root to leaves, and gives mechanical support. It's made of 4 elements: xylem tracheids (dead, tapering, conduct water), xylem fibres (dead, provide support), xylem vessels (dead, tube-like, main water transport - looks like a pipe), and xylem parenchyma (the ONLY living xylem cells - store starch and fats).", "Which type of xylem cell has NO role in conducting water, and instead stores starch and fatty substances?", "Xylem parenchyma - the only living, thin-walled cell type in xylem, specialised for storage rather than conduction.", undefined, [212, 213]),
      C("18.4", "Complex tissue: Phloem", "🍁", "Phloem transports food (organic solutes), usually bidirectionally. Made of: sieve tubes (elongated cells with perforated end walls called sieve plates, carrying food from leaves to storage organs), companion cells (attached to sieve tubes), phloem fibres (mechanical support), and phloem parenchyma (living cells that store food).", "The transverse end walls of sieve tubes are perforated, letting food pass from one cell to the next. What are these perforated end walls called?", "Sieve plates.", undefined, [213, 214]),
      C("18.5", "Epithelial tissue: simple types", "🔬", "Simple epithelium is a single layer of cells on a basement membrane. Squamous: thin, flat cells (lines lungs, buccal cavity) - protective. Cuboidal: cube-shaped (glands, kidney tubules) - secretion/absorption. Columnar: tall, pillar-like (stomach, intestine) - secretion/absorption. Ciliated: columnar cells with cilia (trachea) - moves mucus. Glandular: modified secretory cells.", "Cells lining the trachea (windpipe) have delicate hair-like outgrowths that move mucus in a specific direction. What type of epithelium is this?", "Ciliated epithelium - columnar cells bearing cilia, which sweep mucus and particles along in a specific direction.", undefined, [214, 215]),
      C("18.6", "Epithelial tissue: compound", "🧱", "Compound (stratified) epithelium has MULTIPLE cell layers, with only the deepest layer resting on the basement membrane. It gives strong protection against mechanical and chemical stress, covering the dry skin surface and the moist buccal cavity/pharynx lining.", "The dry surface of the skin and the moist lining of the buccal cavity are both covered by an epithelium made of multiple cell layers, for extra protection. What is this type of epithelium called?", "Compound (stratified) epithelium - made of several layers, unlike simple epithelium's single layer.", undefined, [215, 216]),
      C("18.7", "Connective tissue proper and supportive connective tissue", "🦴", "Connective tissue proper: Areolar (loosely arranged fibres/cells, joins skin to muscle, repairs injuries) and Adipose (fat cells, insulation, shock absorption). Supportive connective tissue: Cartilage (soft, flexible, chondrocytes in lacunae - in the nose, ear, trachea) and Bone (rigid, calcium-rich, osteocytes in lacunae connected by canaliculi).", "A layer of tissue found in the subcutaneous layer and around the kidneys acts as a shock absorber and insulates the body by storing fat. What is this tissue called?", "Adipose tissue - the aggregation of fat cells (adipocytes), which insulates and cushions organs.", undefined, [216, 217]),
      C("18.8", "Dense and fluid connective tissue", "🩸", "Dense connective tissue: Tendons (join muscle to bone, strong collagen bundles, limited flexibility) and Ligaments (join bone to bone, highly elastic). Fluid connective tissue: Blood (red cells/erythrocytes carry oxygen via haemoglobin, white cells/leucocytes fight infection, platelets aid clotting, all in plasma) and Lymph (filtered from blood, exchanges materials between blood and tissues).", "A structure joins a skeletal muscle to a bone, made of parallel bundles of collagen fibres, with great strength but limited flexibility. What is this structure called?", "A tendon - which connects muscle to bone (a ligament, by contrast, connects bone to bone).", undefined, [217, 218]),
      C("18.9", "Muscular tissue", "💪", "Skeletal (striated) muscle: attached to bones, voluntary, striped appearance, multinucleate - e.g. biceps. Smooth (non-striated) muscle: spindle-shaped, involuntary, uninucleate, no stripes - in blood vessels and intestine walls. Cardiac muscle: branched, uninucleate, joined by intercalated discs, involuntary and rhythmic - found only in the heart.", "A type of muscle has branched, uninucleate fibres joined by structures called intercalated discs, and contracts involuntarily and rhythmically throughout life. What type of muscle is this?", "Cardiac muscle - the unique muscle type of the heart, distinguished by its branched fibres and intercalated discs.", undefined, [218, 218]),
      C("18.10", "Nervous tissue", "🧠", "Nervous tissue is made of neurons - the longest cells in the body, and the structural/functional unit of the nervous system. Each neuron has a cell body (cyton) with nucleus, short branched dendrites (receive signals), and one long axon (sends signals to terminal branches). Neurons don't divide, lacking centrioles.", "A neuron's short, highly branched processes receive signals and carry them toward the cell body. What are these processes called?", "Dendrites (or dendrons).", undefined, [219, 219]),
      C("18.11", "Mitosis", "🔬", "Mitosis (discovered by Fleming, 1879) is 'equational division' - one cell divides into two IDENTICAL diploid (2n) daughter cells. It has 4 phases: Prophase (chromosomes visible, spindle forms), Metaphase (chromosomes align at the equator - the metaphase plate), Anaphase (chromatids separate, move to poles), Telophase (nuclei reform). Vital for growth, development and tissue repair.", "During which specific phase of mitosis do duplicated chromosomes line up along the equatorial plane of the cell, forming the 'metaphase plate'?", "Metaphase - when chromosomes align on the equator and each attaches to a spindle fibre by its centromere.", undefined, [219, 220]),
      C("18.12", "Meiosis", "🧬", "Meiosis (named by Farmer, 1905) is 'reduction division' - it produces FOUR haploid (n) gametes from one diploid parent cell, through two divisions. In Prophase I, homologous chromosomes pair (synapsis) and may exchange segments at chiasmata (crossing over), producing genetic recombination. Meiosis maintains a species' constant chromosome number across generations.", "Meiosis produces four daughter cells from one parent cell, each with HALF the original chromosome number. What is this reduction process specifically important for maintaining, generation after generation?", "A constant chromosome number for the species - without this halving, chromosome counts would double every generation if gametes fused normally.", undefined, [220, 221]),
      C("18.13", "Mitosis vs. meiosis", "⚖️", "Mitosis: occurs in body (somatic) cells, one division, produces 2 identical diploid cells, happens continuously for growth/repair. Meiosis: occurs only in reproductive cells, two divisions, produces 4 non-identical haploid cells, happens only during reproduction, and introduces genetic variation through crossing over.", "Mitosis produces 2 identical diploid daughter cells from 1 division. How many daughter cells does meiosis produce, from how many divisions, and are they identical to each other?", "4 daughter cells, from 2 divisions - and unlike mitosis, they are NOT identical to each other, since crossing over during meiosis randomly reassorts genetic material.", undefined, [221, 222]),
    ],
  },
  {
    // Deepened to match the real textbook pages 226-232 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Eight real sections. The stomata/guard-cell
    // diagram is a safe two-bean-shape layout; the rest use text cards.
    number: 19, title: "Plant Physiology", concepts: [
      C("19.1", "Types of tropism", "🌻", "Tropism is unidirectional movement of a plant part toward a stimulus. Phototropism (toward light), geotropism (toward gravity), hydrotropism (toward water), thigmotropism (in response to touch, e.g. climbing vines), and chemotropism (toward a chemical, e.g. pollen tube growth toward stigma sugar).", "A pollen tube grows toward the sugar present on a flower's stigma. What type of tropism is this?", "Chemotropism - movement of a plant part in response to a chemical stimulus.", undefined, [226, 226]),
      C("19.2", "Positive and negative tropism", "🧭", "Tropism is positive if growth is toward the stimulus, negative if away from it. A typical shoot is positively phototropic (toward light) and negatively geotropic (away from gravity). A typical root is the reverse: negatively phototropic, positively geotropic. Exception: Rhizophora (a mangrove) grows negatively geotropic roots that turn 180° upright for respiration.", "The shoot of a typical plant grows toward light (positive) but away from gravity (negative). What about the root's response to light and gravity?", "The root is the reverse: negatively phototropic (grows away from light) and positively geotropic (grows toward/with gravity, i.e. downward).", undefined, [226, 227]),
      C("19.3", "Nastic movements", "🌙", "Nastic movements are non-directional responses to a stimulus. Photonasty: response to light (Taraxacum blooms morning, closes evening; Ipomea alba/moonflower does the reverse - opens at night). Thigmonasty (seismonasty): response to touch (Mimosa pudica folds its leaves; the Venus flytrap shows one of the fastest known nastic movements). Thermonasty: response to temperature (Tulip flowers bloom as temperature rises).", "Ipomea alba (moonflower) opens its petals at night and closes them during the bright day - the opposite pattern of most flowers. What type of nastic movement is this?", "Photonasty - a non-directional response to light.", undefined, [227, 228]),
      C("19.4", "Tropic vs. nastic movements", "⚖️", "Tropic movements: unidirectional, growth-dependent, permanent/irreversible, found in ALL plants, slow. Nastic movements: non-directional, growth-independent, temporary/reversible, found only in a FEW specialized plants, immediate.", "A plant response happens immediately, is found only in a few specialized plants, and is temporary/reversible. Is this a tropic or a nastic movement?", "A nastic movement - tropic movements, by contrast, are slow, permanent/irreversible, and found in all plants.", undefined, [228, 228]),
      C("19.5", "Photosynthesis", "☀️", "Photosynthesis ('building up with light') converts light energy into chemical energy: 6CO2 + 12H2O --(sunlight, chlorophyll)--> C6H12O6 + 6H2O + 6O2. Green plants are autotrophic because they make their own food this way. Glucose is converted to starch for storage.", "In the photosynthesis equation, water appears on BOTH sides (12 H2O as a reactant, 6 H2O as a product). What is the true net amount of water actually consumed?", "Only 6 H2O molecules net - 12 are used as reactants, but 6 are released as a product, so the true consumption is 12 minus 6 = 6.", undefined, [228, 229]),
      C("19.6", "Requirements for photosynthesis", "🧪", "Classic leaf experiments (de-starching a plant in the dark, then testing covered vs. uncovered leaf parts with iodine) show photosynthesis needs: chlorophyll (green pigment), water, carbon dioxide (from air), and sunlight - only the parts that received light and had chlorophyll test positive for starch.", "In the classic leaf experiment, a plant is kept in a dark room for 2 days before testing. Why is this 'de-starching' step necessary?", "To use up any starch already stored in the leaves beforehand, so any starch found afterward can be attributed only to photosynthesis that happened during the actual experiment.", undefined, [228, 229]),
      C("19.7", "Transpiration: types and importance", "💧", "Transpiration is water loss as vapour from the plant. Stomatal transpiration (through stomata) accounts for 90-95% of it; cuticular (through the cuticle) and lenticular (through lenticels in bark) account for the rest. It's necessary because it creates a pull in the leaf/stem, an absorption force in roots, ensures continuous mineral supply, and regulates plant temperature.", "About 90-95% of the water a plant loses through transpiration escapes through one specific route. Which one?", "Stomatal transpiration - loss of water vapour through the stomata.", undefined, [229, 229]),
      C("19.8", "Exchange of gases", "🌬️", "Leaves have microscopic pores called stomata, each surrounded by guard cells that open and close to regulate both transpiration and gas exchange (CO2 in for photosynthesis, O2 out, and the reverse for respiration) continuously.", "What cells surround each stoma and control its opening and closing, regulating the rate of transpiration and gas exchange?", "Guard cells.", undefined, [229, 229]),
    ],
  },
  {
    // Deepened to match the real textbook pages 234-243 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Thirteen real sections covering digestion,
    // excretion and reproduction in humans - one of the densest units in
    // the book. Heavily anatomical content throughout, so text cards
    // only (a hand-drawn digestive tract, kidney or reproductive-organ
    // diagram risks being subtly wrong in ways a labelled fact card
    // cannot be).
    number: 20, title: "Organ Systems in Animals", concepts: [
      C("20.1", "Organ systems overview", "🧩", "The body has ten coordinated organ systems: integumentary (skin), skeletal, muscular, nervous, circulatory, respiratory, digestive, excretory, reproductive, sensory, and endocrine - the last one specifically coordinates the functions of all the others.", "Which organ system's main organs are the skull, vertebral column, sternum, girdles and limbs, and whose function is to give support, shape and form to the body?", "The skeletal system.", undefined, [234, 234]),
      C("20.2", "Mouth, teeth and salivary glands", "🦷", "Humans develop two sets of teeth (diphyodont): 20 temporary (milk) teeth, replaced by 32 permanent teeth of four types (heterodont): incisors (8, cutting), canines (4, tearing), premolars (8, crushing) and molars (12, crushing/grinding). Three pairs of salivary glands (parotid - largest; sublingual - smallest; submandibular) secrete saliva (~1.5 L/day) containing ptyalin, which converts starch into maltose.", "How many teeth are in a complete set of permanent (adult) human teeth, and how many types are there?", "32 teeth, of 4 types (heterodont): incisors, canines, premolars, and molars.", undefined, [235, 236]),
      C("20.3", "Pharynx, oesophagus and stomach", "🫃", "Food becomes a bolus, passes through the pharynx and oesophagus (via peristalsis - wave-like muscle contractions) into the J-shaped stomach. Gastric glands secrete gastric juice (mucus, HCl, and the enzymes pepsin and rennin). HCl activates pepsinogen into pepsin and kills bacteria; the resulting semi-digested food is called chyme.", "The oesophagus moves food down to the stomach using rhythmic, wave-like contractions of its muscular walls. What is this movement called?", "Peristalsis.", undefined, [236, 236]),
      C("20.4", "Small intestine: duodenum, jejunum, ileum", "🌀", "The small intestine (5-7 m, the longest part of the canal) has three parts: duodenum (C-shaped, receives bile and pancreatic ducts), jejunum (short middle part, secretes intestinal juice), and ileum (the longest part, lined with about 4 million villi where absorption happens).", "Which part of the small intestine is the LONGEST, and contains the millions of finger-like villi where absorption of food actually takes place?", "The ileum.", undefined, [236, 237]),
      C("20.5", "The liver", "🫀", "The liver is the largest digestive gland, secreting bile (stored in the gall bladder) that emulsifies fat droplets. It also controls blood sugar/amino acid levels, produces fibrinogen and prothrombin (blood clotting), destroys old red blood cells, stores iron/copper/vitamins A and D, produces heparin, and detoxifies drugs, alcohol and poisons.", "The liver produces two substances, fibrinogen and prothrombin, that serve a specific role elsewhere in the body. What is that role?", "Blood clotting.", undefined, [237, 237]),
      C("20.6", "The pancreas and digestive enzymes", "🧪", "The pancreas is both exocrine (secretes pancreatic juice: lipase, trypsin and amylase, acting on fats, proteins and starch) and endocrine (islets of Langerhans: alpha cells secrete glucagon, beta cells secrete insulin). Intestinal glands add maltase, lactase, sucrase and lipase.", "Trypsin, secreted by the pancreas, acts specifically on which nutrient, breaking it into peptides and amino acids?", "Proteins (and peptones).", undefined, [237, 238]),
      C("20.7", "Absorption, assimilation and the large intestine", "🔄", "Absorption: nutrients pass through villi into blood/lymph. Assimilation: absorbed nutrients are incorporated into tissue cells (excess sugar becomes glycogen in the liver, excess fat is stored in adipose tissue). Unabsorbed food passes into the large intestine (caecum, colon, rectum) and leaves as faeces through the anus - egestion.", "The unabsorbed, undigested food eventually leaves the body as faecal matter through the anus. What is this final process called?", "Egestion (or defaecation).", undefined, [237, 238]),
      C("20.8", "Skin as an excretory organ", "🧴", "Besides the kidneys, skin (via sweat: water plus ammonia, urea, lactic acid and salts) and lungs (CO2 and water vapour) also excrete waste. Skin makes up about 15% of an adult's body weight, and sweat glands activate when the body (normally ~37°C) gets hot.", "Besides the kidneys, name two other organs that also help eliminate waste from the body.", "Skin (removes water, urea and salts via sweat) and lungs (eliminate carbon dioxide and water vapour).", undefined, [239, 239]),
      C("20.9", "Kidney structure and function", "🫘", "Kidneys are bean-shaped, reddish-brown organs on either side of the vertebral column (the right sits lower, since the liver takes up space on the right). Internally: outer cortex, inner medulla. Functions: maintain fluid/electrolyte balance, regulate blood acid-base balance, maintain osmotic pressure, and retain essential substances like glucose and amino acids.", "Why is the right kidney positioned slightly lower than the left kidney?", "Because the liver takes up much of the space on the right side of the body.", undefined, [239, 240]),
      C("20.10", "Structure of the nephron", "🔬", "Each kidney has over 1 million nephrons - its structural and functional units. Each has a renal corpuscle (Bowman's capsule containing the glomerulus, a bunch of capillaries) and a renal tubule (proximal convoluted tubule → loop of Henle → distal convoluted tubule → collecting tubule).", "What is the cup-shaped structure that contains a bunch of capillaries called the glomerulus, together forming the renal corpuscle?", "Bowman's capsule.", undefined, [240, 240]),
      C("20.11", "Mechanism of urine formation", "💧", "Urine forms in three stages: glomerular filtration (blood is filtered through the glomerulus/Bowman's capsule), tubular reabsorption (essential substances like glucose, amino acids and water are reabsorbed, mainly in the proximal tubule), and tubular secretion (H+/K+ ions are added). Kidneys filter 170-180 L of blood daily, but only about 1% becomes actual urine.", "What are the three stages of urine formation, in order?", "Glomerular filtration, tubular reabsorption, and tubular secretion.", undefined, [240, 241]),
      C("20.12", "Male reproductive system", "♂️", "Testes (the male gonads, outside the abdominal cavity) produce sperm and testosterone. The epididymis (coiled tubules on the testis) nourishes developing sperm. The scrotum keeps testes 1-3°C cooler than body temperature for sperm formation. Vas deferens carries sperm to seminal vesicles; accessory glands (seminal vesicles, prostate, Cowper's) form semen.", "The scrotum keeps the testes at a temperature 1-3°C lower than the rest of the body. Why is this specifically necessary?", "Sperm formation (spermatogenesis) requires this slightly cooler temperature than normal body temperature.", undefined, [241, 242]),
      C("20.13", "Female reproductive system", "♀️", "Ovaries (the female gonads, near the kidneys) produce ova and the hormones oestrogen and progesterone. Fallopian tubes (with finger-like fimbriae) carry the released ovum toward the uterus, a pear-shaped organ where the foetus develops - its narrower lower part is the cervix, leading to the vagina (the birth canal).", "The funnel-shaped end of the fallopian tube has finger-like projections that pick up the released ovum. What are these projections called?", "Fimbriae.", undefined, [242, 243]),
    ],
  },
  {
    // Deepened to match the real textbook pages 247-257 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Twelve real sections covering nutrients,
    // deficiency diseases, food preservation, adulteration and quality
    // control - extremely fact-dense. Purely definitional/tabular
    // content throughout, so text cards only.
    number: 21, title: "Nutrition and Health", concepts: [
      C("21.1", "Carbohydrates, proteins and fats", "🍚", "Carbohydrates (mono/di/polysaccharides like glucose/sucrose/cellulose) are the chief energy source. Proteins, built from amino acids, are the body's building blocks for growth and repair - 9 essential amino acids can't be made by the body and must come from diet. Fats provide energy and maintain cell structure - essential fatty acids (omega fatty acids) must also come from diet.", "The body cannot make 9 specific amino acids on its own and must get them from food. What are these called?", "Essential amino acids - phenylalanine, valine, threonine, tryptophan, methionine, leucine, isoleucine, lysine and histidine.", undefined, [247, 248]),
      C("21.2", "Fat-soluble vitamins", "🥕", "Vitamin A (retinol): deficiency causes night blindness/xerophthalmia. Vitamin D (calciferol): deficiency causes rickets (bow legs, pigeon chest) - made by skin in sunlight ('sunshine vitamin'). Vitamin E (tocopherol): deficiency causes sterility. Vitamin K: deficiency prevents blood clotting, causing excessive bleeding.", "A person has been getting excessive bleeding from even minor cuts because their blood isn't clotting properly. Which fat-soluble vitamin deficiency could cause this?", "Vitamin K - its deficiency prevents normal blood clotting, causing excessive bleeding.", undefined, [249, 249]),
      C("21.3", "Water-soluble vitamins", "🍊", "Vitamin B1 (thiamine): deficiency causes Beriberi (nerve damage, paralysis). B2 (riboflavin): Ariboflavinosis. B3 (niacin): Pellagra. B6 (pyridoxine): dermatitis. B12 (cyanocobalamine): pernicious anaemia. Vitamin C (ascorbic acid): Scurvy (bleeding gums, slow wound healing).", "Which vitamin deficiency causes scurvy, with symptoms like swollen bleeding gums and slow wound healing?", "Vitamin C (ascorbic acid).", undefined, [249, 249]),
      C("21.4", "Minerals: macro and micro", "🧂", "Macrominerals (needed in larger amounts): calcium (bones/teeth, clotting), sodium (fluid balance, nerve signals), potassium (nerve/muscle activity). Microminerals (trace amounts): iron (haemoglobin - deficiency causes anaemia), iodine (thyroid hormones - deficiency causes goitre).", "Which mineral deficiency causes goitre, and what is this mineral needed for?", "Iodine deficiency - iodine is needed for forming thyroid hormones.", undefined, [250, 250]),
      C("21.5", "Protein energy malnutrition (PEM)", "😔", "Prolonged nutrient deficiency causes malnutrition. Kwashiorkor: severe protein deficiency in children aged 1-5, whose diet has carbohydrates but lacks protein. Marasmus: affects infants under 1 year, from a diet poor in carbohydrates, fats AND proteins together.", "What is the key difference between Kwashiorkor and Marasmus, in terms of age group and diet?", "Kwashiorkor affects children aged 1-5 whose diet has carbohydrates but lacks protein; Marasmus affects infants under 1 year whose diet is poor in carbohydrates, fats AND proteins all together.", undefined, [250, 250]),
      C("21.6", "Food hygiene and spoilage", "🦠", "Food spoilage is an undesirable change making food unfit to eat, signalled by changes in appearance, colour, texture, odour or taste. Internal factors: enzymatic activity, moisture content. External factors: adulterants, contaminated utensils, unhygienic storage.", "A batch of food is spoiling faster due to naturally-occurring enzymatic activity and high moisture content within the food itself, not any outside contamination. What category of spoilage factor is this?", "An internal factor - as opposed to external factors like contaminated utensils or unhygienic storage.", undefined, [250, 250]),
      C("21.7", "Methods of food preservation", "🧊", "Drying (removes moisture), smoking (meat/fish), irradiation (kills bacteria with radiation), cold storage/freezing (slows biological/chemical reactions, below 0°C for freezing), and pasteurization (heating milk to 63°C for 30 min, then rapid cooling, to destroy microbes) and canning (sealed, sterilized containers).", "Food is stored at a temperature below 0°C, where microorganisms cannot grow and chemical reactions slow down. What preservation method is this?", "Freezing.", undefined, [250, 251]),
      C("21.8", "Natural and synthetic preservatives", "🧴", "Natural preservatives: salt (removes moisture via osmosis), sugar/honey (hygroscopic, reduces water content, e.g. in jams), oil (blocks air contact, e.g. in pickles). Synthetic preservatives: sodium benzoate, citric acid, vinegar and others, added to sauces, jams and packaged foods to delay microbial growth.", "Sugar or honey is added to jams and jellies as a preservative. What property of sugar/honey specifically helps reduce the food's water content?", "Its hygroscopic nature - the ability to absorb moisture from its surroundings.", undefined, [251, 251]),
      C("21.9", "Food adulteration: types", "⚠️", "Adulteration is adding or removing a substance so a food's natural composition/quality is affected. Natural adulterants: naturally occurring toxins (e.g. Prussic acid in apple/cherry seeds). Incidental adulterants: added unknowingly (pesticide residues, pest droppings, microbial contamination). Intentionally added adulterants: added deliberately for profit (calcium carbide to ripen fruit, toxic colours, wax coatings).", "A shopkeeper adds a chemical like calcium carbide specifically to artificially ripen bananas faster, purely for financial gain. What category of adulterant is this?", "An intentionally added adulterant - added deliberately for financial gain, unlike natural or incidental adulterants.", undefined, [252, 252]),
      C("21.10", "Health effects of adulterated food", "🏥", "Consuming adulterated food can cause fever, diarrhoea, nausea, vomiting, gastrointestinal disorders, asthma, allergy, neurological disorders, skin allergies, immune suppression, kidney and liver failure, colon cancer, and even birth defects.", "Which two vital organs does the book specifically mention can suffer FAILURE from consuming adulterated food over time?", "Kidney and liver.", undefined, [252, 252]),
      C("21.11", "Food quality control: the law", "⚖️", "In 1954, India enacted the Prevention of Food Adulteration Act (with Rules in 1955), setting minimum quality standards and hygienic conditions for food sale, to ensure pure food and protect consumers from fraud. World Health Day 2015's slogan: 'From farm to plate, make food safe.'", "What was the purpose of the Prevention of Food Adulteration Act, enacted by the Indian Government in 1954?", "To ensure pure and wholesome food for consumers, and protect them from fraudulent trade practices.", undefined, [252, 253]),
      C("21.12", "Food quality control agencies", "🏷️", "ISI (Bureau of Indian Standards): certifies industrial products (appliances, wiring). AGMARK: certifies agricultural/livestock products (cereals, honey, butter). FPO: certifies fruit products (juice, jam, pickles). FCI (Food Corporation of India, est. 1965): price support for farmers, distributing food grains. FSSAI: regulates and supervises food safety overall.", "A jar of honey carries the AGMARK certification. What type of products does AGMARK specifically certify?", "Agricultural and livestock products, like cereals, essential oils, pulses, honey and butter.", undefined, [253, 253]),
    ],
  },
  {
    // Deepened to match the real textbook pages 258-269 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Sixteen real sections - the single densest unit in
    // the book, covering microbe types, their applications and an
    // extensive real disease catalogue. Entirely definitional/medical
    // content, so text cards throughout.
    number: 22, title: "World of Microbes", concepts: [
      C("22.1", "Bacteria: shapes and structure", "🦠", "Bacteria are microscopic, single-celled PROKARYOTIC organisms (no true nucleus - just a nucleoid). Shapes: cocci (spherical), bacilli (rod), spirilla (spiral). Structure: cell wall, cell membrane, cytoplasm, ribosomes, a circular extra-chromosomal DNA called a plasmid, and sometimes flagella (motility) or a protective capsule.", "Rod-shaped bacteria are called by what name?", "Bacilli (singular: bacillus).", undefined, [258, 259]),
      C("22.2", "Viruses: structure and characters", "🧬", "Viruses are non-cellular, self-replicating parasites: a protein coat around DNA or RNA. Size: 18-400 nm. Living traits: replicating genetic material, multiply in living cells, attack specific hosts. Non-living traits: inert outside a host, no cell membrane/wall/organelles, can be crystallised.", "Viruses can be crystallised, remain completely inert outside a host, and lack cell membranes or organelles. Are these living or non-living characteristics of a virus?", "Non-living characteristics - alongside these, viruses also show living traits like replicating genetic material and multiplying inside host cells.", undefined, [259, 259]),
      C("22.3", "Types of viruses, fungi and prions", "🍄", "Viruses: plant viruses (Tobacco Mosaic Virus), animal viruses (HIV, Influenza, Polio), bacteriophages (infect bacteria, e.g. T4). Fungi: lack chlorophyll, live as parasites or saprophytes; body is a thallus (yeast: single-celled; moulds: mycelium of hyphae). Prions: infectious protein-only particles (no nucleic acid), found in neurons, cause nervous tissue degeneration.", "T4 bacteriophage specifically infects which type of organism?", "Bacterial cells - a bacteriophage is a virus that specifically infects bacteria.", undefined, [259, 260]),
      C("22.4", "Microbes in agriculture", "🌾", "Biofertilizers enrich soil with nutrients: free-living nitrogen-fixers (Azotobacter, Nostoc) and symbiotic ones (Rhizobium in legume root nodules, Frankia). Biocontrol agents (biopesticides) fight plant pests naturally: Bacillus thuringiensis (Bt) produces a 'cry' protein toxic to insect larvae.", "Rhizobium lives symbiotically in the root nodules of leguminous plants. What does it do there?", "It fixes atmospheric nitrogen, converting it into a usable form the plant can absorb.", undefined, [261, 261]),
      C("22.5", "Microbes in industry", "🍷", "Saccharomyces cerevisiae ferments grapes into wine. Bacillus megaterium cures coffee/tea/tobacco leaves for aroma. Lactobacillus converts milk into curd. Aspergillus niger (a fungus) produces oxalic, acetic and citric acid. Yeasts are rich in vitamin B complex; microbes also yield enzymes like lipases and proteases.", "Which fungus is used to produce oxalic acid, acetic acid and citric acid industrially?", "Aspergillus niger.", undefined, [261, 261]),
      C("22.6", "Microbes in medicine: antibiotics", "💊", "Antibiotics are microbial metabolic products that inhibit other microbes at low concentration. Fleming discovered the first, penicillin, in 1929. Bacteria produce Streptomycin (Streptomyces griseus), Erythromycin (S. erythreus), Bacitracin (Bacillus subtilis); fungi produce Penicillin (Penicillium notatum) and Cephalosporin (Cephalosporium acremonium).", "Streptomycin, an antibiotic, is produced by which microorganism?", "Streptomyces griseus (a bacterium).", undefined, [261, 261]),
      C("22.7", "Microbes in medicine: vaccines", "💉", "Vaccines are made from killed or weakened (attenuated) microbes. Live attenuated: MMR (Measles, Mumps, Rubella), BCG (Tuberculosis). Inactivated (killed): IPV (Polio). Subunit (purified antigens): Hepatitis B vaccine. Toxoid (inactivated antigen): TT (Tetanus), Diphtheria toxoid.", "BCG is a live attenuated vaccine. Which disease does it protect against?", "Tuberculosis.", undefined, [261, 262]),
      C("22.8", "Classifying diseases", "🏥", "By occurrence: endemic (low incidence, one region, e.g. goitre in sub-Himalayan areas), epidemic (breaks out, affects many in one region at once, e.g. Influenza), pandemic (global scale, e.g. AIDS), sporadic (occasional, e.g. Malaria). By communicability: infectious/communicable (external pathogens, e.g. TB) vs. non-infectious/non-communicable (internal causes, e.g. Diabetes, Cancer).", "Goitre occurs in the sub-Himalayan region, affecting a relatively small number of people in that specific geographic area. What classification of disease occurrence is this?", "Endemic - a disease found in a certain geographical area, affecting a fewer number of people (low incidence).", undefined, [262, 262]),
      C("22.9", "How disease manifests", "🔬", "Pathogens enter via contaminated air/water/food/soil, physical/sexual contact, or infected animals. A reservoir of infection is where a pathogen thrives without causing disease (water, soil, animal populations). The incubation period is the gap between infection and first symptoms. Pathogens harm the body via tissue damage (e.g. TB damaging lungs) or toxin secretion.", "Water, soil and animal populations are described as places where a pathogen can thrive and multiply WITHOUT actually causing disease. What is this specific environment called?", "A reservoir of infection.", undefined, [262, 263]),
      C("22.10", "Airborne diseases", "🤧", "Spread via droplets from coughing/sneezing, dust and spores. Viral: Common Cold (Rhinovirus), Influenza (Myxovirus), Measles (Rubeola virus, skin rashes), Mumps (parotid gland swelling), Chicken Pox (Varicella zoster). Bacterial: Tuberculosis (Mycobacterium tuberculosis, lungs), Diphtheria (Corynebacterium diphtheriae, throat), Whooping Cough (Bordetella pertussis).", "Mumps causes enlargement of a specific gland, making jaw movement difficult. Which gland?", "The parotid gland.", undefined, [263, 264]),
      C("22.11", "Waterborne diseases", "💧", "Bacterial: Cholera (Vibrio cholerae, rice-watery stools, treated with ORS), Typhoid (Salmonella typhi, high fever). Viral: Poliomyelitis (Polio virus, attacks the central nervous system, causes limb paralysis; prevented by Salk's/OPV vaccine), Hepatitis A (HAV, liver inflammation, jaundice), Acute Diarrhoea (Rotavirus).", "Poliomyelitis affects which part of the body, causing paralysis of the limbs?", "The central nervous system.", undefined, [264, 264]),
      C("22.12", "Malaria", "🦟", "Caused by the protozoan parasite Plasmodium (4 species; P. falciparum is malignant/fatal). Spread by the bite of the FEMALE Anopheles mosquito. ~300 million infected worldwide yearly. Symptoms: headache, nausea, muscle pain, chills then fever, then sweating. Treated with quinine drugs. Ronald Ross proved mosquito transmission (Nobel Prize, 1902).", "Which species of Plasmodium causes the most malignant and fatal form of malaria?", "Plasmodium falciparum.", undefined, [265, 265]),
      C("22.13", "Chikungunya, Dengue, Filaria and mosquito control", "🩹", "Chikungunya (virus, Aedes aegypti, joint pain). Dengue ('break bone fever', virus, Aedes aegypti, high fever + platelet drop). Filaria (Wuchereria bancrofti worm, Culex mosquito, chronic form causes elephantiasis). Prevention: nets, repellents, eliminating stagnant water, insecticides.", "Dengue fever is nicknamed 'break bone fever'. Why?", "Because of the intense joint and muscle pain it causes.", undefined, [265, 266]),
      C("22.14", "Diseases transmitted by animals", "🐷", "Swine Flu: H1N1 influenza virus, originated in pigs, airborne, affects the respiratory system (declared a pandemic by WHO in June 2009). Avian Influenza: H5N1 virus, from birds (poultry, wild, pet), transmitted via contact with infected birds' secretions or droppings.", "Swine flu, caused by which virus strain, first originated in which animal?", "Influenza virus H1N1, which originated in pigs.", undefined, [266, 267]),
      C("22.15", "Sexually transmitted diseases", "🎗️", "AIDS: caused by HIV (a retrovirus), attacks white blood cells/lymphocytes, weakening immunity; transmitted via sexual contact, blood, infected needles, or mother-to-foetus. Hepatitis B: HBV damages the liver (cirrhosis); transmitted via sexual contact, infected secretions, or mother-to-baby. Others: Gonorrhoea and Syphilis (bacterial), Genital Herpes and Genital Warts (viral).", "AIDS is caused by HIV, which specifically attacks which type of blood cell, weakening the body's immunity?", "White blood cells (lymphocytes).", undefined, [267, 268]),
      C("22.16", "Immunization: vaccine types and schedule", "🗓️", "Immunization builds disease resistance via antigens/antibodies. Live vaccines use a weakened living pathogen (BCG, Oral Polio Vaccine). Killed vaccines use a heat/chemical-killed pathogen and need a booster dose (Typhoid, Cholera vaccines). Edward Jenner introduced vaccination (eliminated smallpox); Louis Pasteur coined the term 'vaccine'. WHO's 1970 schedule starts with BCG at birth.", "According to the immunization schedule, which vaccine is given to a newborn baby as their very first dose?", "BCG (Bacillus Calmette Guerin) - given against tuberculosis, as the newborn's first vaccine dose.", undefined, [268, 269]),
    ],
  },
  {
    // Deepened to match the real textbook pages 273-286 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Fifteen real sections spanning horticulture,
    // biofertilizers, medicinal plants, soil-less farming, dairy,
    // aquaculture, vermitechnology and apiculture - another exceptionally
    // dense unit. Entirely definitional/agricultural content, so text
    // cards throughout.
    number: 23, title: "Economic Biology", concepts: [
      C("23.1", "Horticulture: its four branches", "🌺", "Horticulture (Latin: 'hortus' = garden, 'colere' = cultivate) has four branches: Pomology (fruit farming), Olericulture (vegetable farming - kitchen, commercial, and forcing/greenhouse growing), Floriculture (flower farming - decoration, essential oils), and Landscape gardening (designing outdoor spaces to imitate nature).", "Growing ornamental and flowering plants specifically for beauty, cut flowers or essential oils is called what branch of horticulture?", "Floriculture.", undefined, [273, 275]),
      C("23.2", "Manuring: types of organic manure", "🐄", "Organic manures enrich soil, derived from plant debris, animal waste and microbes. Animal manure: farmyard manure (cattle dung/urine/litter, ~0.5% nitrogen) and sheep/goat manure (richer, ~3% nitrogen). Compost: decomposed organic matter (crop residues, wastes). Green manure: undecomposed green material from legumes (e.g. Sunhemp), improving soil structure and water retention.", "Well-decomposed farmyard manure contains about 0.5% nitrogen. How does sheep/goat manure compare?", "It contains much higher nutrients: about 3% nitrogen, 1% phosphorus pentoxide, and 2% potassium oxide.", undefined, [275, 275]),
      C("23.3", "Biofertilizers: types", "🦠", "Rhizobium fixes nitrogen in legume root nodules. Azospirillum boosts cereal yield 5-20%, millets 30%. Azotobacter increases wheat/rice/maize yield and produces antifungal compounds. Mycorrhizae (fungi) boost phosphorus uptake in roots. Azolla (a floating fern) fixes nitrogen via a symbiotic cyanobacterium, Anabaena.", "Azolla, a floating aquatic fern, fixes atmospheric nitrogen using a symbiotic partner. Which organism is it, and what powers this process?", "A cyanobacterium called Anabaena - the process is powered by energy from Azolla's own photosynthesis.", undefined, [275, 276]),
      C("23.4", "Medicinal plants", "🌿", "Plant-derived drugs (secondary metabolites) treat real diseases: Quinine (Cinchona bark) for malaria/pneumonia; Reserpine (Sarpagandha root) for blood pressure and snakebite antidote; Alkaloids (Catharanthus roseus/Nithya kalyani) for leukemia and cancer; Papain (papaya) for dengue; Anthraquinones (Aloe vera) for wounds and skin disease.", "Rauwolfia serpentina (Sarpagandha) yields the drug Reserpine from its root. What two conditions is it used to treat?", "Blood pressure, and as an antidote for snake bite.", undefined, [276, 277]),
      C("23.5", "Mushroom cultivation", "🍄", "A 'wealth from waste' technology using plant/animal/industrial waste. Stages: composting (paddy straw + cow dung, ~50°C for a week), spawning (sowing fungal mycelium 'seed'), casing (soil layer for humidity/support), pinning (buds forming), harvesting (grows ~3 cm/week at 15-23°C).", "After spawning, compost is covered with a thin layer of soil to support the growing mushroom and regulate humidity/temperature. What is this stage called?", "Casing.", undefined, [277, 278]),
      C("23.6", "Hydroponics, aeroponics and aquaponics", "💧", "Hydroponics: growing plants in nutrient-water without soil (roots need mechanical support since they don't anchor). Aeroponics: roots hang in air, misted with nutrients (needs frequent misting or roots dry out). Aquaponics: combines aquaculture and hydroponics - fish waste, broken down by nitrifying bacteria into nitrates, feeds the plants.", "In aeroponics, the roots hang in the air and are misted with nutrient solution rather than submerged. Why must the misting cycles never be interrupted for long?", "Because the roots will dry out rapidly without frequent misting.", undefined, [278, 279]),
      C("23.7", "Dairy farming: cattle breeds", "🐮", "Indian cows/bulls are Bos indicus; buffaloes are Bos bubalis. Dairy breeds: indigenous (Sahiwal, Gir - disease-resistant) and exotic/Bos taurus (Jersey, Holstein-Friesian - long lactation, imported). Draught breeds (Kangayam, Hallikar) do farm work. Dual-purpose breeds (Haryana, Ongole) give both milk and labour.", "Jersey, Brown Swiss and Holstein-Friesian are all examples of what type of cattle breed, selected for long lactation periods?", "Exotic (Bos taurus) dairy breeds, imported from foreign countries.", undefined, [279, 280]),
      C("23.8", "Cattle feed and livestock improvement", "🌾", "Cattle feed: roughages (coarse fodder - grass, hay, straw) and concentrates (high carbs/protein - bran, oilseed cakes). A milking cow needs 15-25 kg roughage, 4-5 kg grain mixture, 100-150 L water daily. The Intensive Cattle Development Programme cross-breeds indigenous cows with exotic breeds; Operation Flood (Dr. Verghese Kurien, NDDB) boosted milk supply nationally.", "The Intensive Cattle Development Programme is based on cross-breeding indigenous cows with what type of breed, specifically to increase milk production?", "Exotic (European) breeds.", undefined, [280, 281]),
      C("23.9", "Aquaculture", "🐟", "Aquaculture rears economically important aquatic organisms (fish, prawns, oysters) under controlled conditions. Freshwater aquaculture: ponds/rivers/lakes (Tilapia, carps, catfish). Marine aquaculture (Mariculture/sea farming): sea coast/deep sea (shrimps, pearl oysters, salmon). Aims at the 'Blue Revolution' - a major export/employment sector.", "Tilapia, carps (Catla, Rohu, Mrigal) and catfishes are cultured in which type of aquaculture?", "Freshwater aquaculture.", undefined, [281, 282]),
      C("23.10", "Pisciculture: methods and ponds", "🎣", "Fish culture types: extensive (large area, low density, natural feed), intensive (small area, high density, artificial feed), monoculture (1 species), polyculture (multiple species), integrated (with crops/livestock). Pond stages: breeding pond → hatching pits → nursery pond (60 days, to ~2-2.5cm fry) → rearing pond (~3 months, to fingerlings) → stocking pond (to market size).", "A fish farm culturing fish in a large area with low stocking density and relying on natural feeding is practicing what type of fish culture?", "Extensive fish culture.", undefined, [282, 282]),
      C("23.11", "Cultivable fishes and their nutritional value", "🐠", "Freshwater: Indian major carps (Catla, Rohu, Mrigal), catfish, Murrels, Tilapia. Marine: Sea bass, Grey mullet, Milk fish. Fish are highly nutritious: rich in essential amino acids (lysine, methionine), polyunsaturated fatty acids (PUFA), minerals (calcium, iron), and vitamins A, D and B-complex.", "Fish are described as a rich source of essential amino acids like lysine and methionine, plus what type of beneficial fatty acid?", "Polyunsaturated fatty acid (PUFA).", undefined, [282, 282]),
      C("23.12", "Prawn culture", "🦐", "Marine prawn culture (shrimp culture): Penaeus indicus and Penaeus monodon in sea water. Freshwater prawn culture: Macrobrachium rosenbergii and M. malcomsonii. Methods: seed collection/hatchery (larvae from estuaries or controlled breeding) and paddy-cum-prawn culture (Pokkali culture - Kerala's traditional method, in coastal paddy fields after harvest).", "What is the traditional method of prawn culture practiced in Kerala, using low-lying paddy fields after the rice harvest?", "Paddy cum prawn culture (also called Pokkali culture).", undefined, [282, 283]),
      C("23.13", "Vermitechnology", "🪱", "Vermiculture: artificially rearing earthworms (Perionyx excavatus, Eisenia fetida, Eudrilus eugeniae) to produce compost. Vermicomposting: earthworms convert bio-waste (crop residues, animal waste, kitchen waste) into nutrient-rich castings (vermicompost) - in the bin method, this takes about 60 days. Vermicompost is pathogen-free and rich in beneficial microflora.", "In the bin method of vermicomposting, how many days does it typically take for organic waste to be completely transformed into worm castings?", "About 60 days.", undefined, [283, 284]),
      C("23.14", "Apiculture: bee types and varieties", "🐝", "A honey bee colony has three castes: the queen (fertile female, lays all eggs), drones (fertile males, develop from unfertilized eggs, fertilize the queen), and worker bees (sterile females, collect honey, build/defend the hive). Indigenous varieties: Apis dorsata (rock bee), Apis florea (little bee), Apis indica. Exotic: Apis mellifera (Italian bee).", "Drones develop from unfertilized eggs and are larger than workers but smaller than the queen. What is their main function?", "To fertilize the eggs produced by the queen.", undefined, [284, 285]),
      C("23.15", "Products from honey bees", "🍯", "Bees suck nectar, which mixes with acidic secretions in the honey sac and is enzymatically converted to honey, stored in hexagonal wax comb cells. Formic acid preserves honey; invertase is its key enzyme. Uses: antiseptic/antibacterial, builds haemoglobin, soothes sore throat, used in Ayurveda/Unani medicine. Other bee products: beeswax, bee pollen, royal jelly, propolis, venom.", "What natural substance acts as a preservative in honey, according to the book?", "Formic acid.", undefined, [285, 286]),
    ],
  },
  {
    // Deepened to match the real textbook pages 290-299 - real user
    // direction 2026-09-22: "everything has to be deeper in line with
    // textbook only." Thirteen real sections completing the science
    // textbook - biogeochemical cycles, plant/animal adaptations, water
    // conservation/recycling and IUCN. Purely definitional/process
    // content, so text cards throughout.
    number: 24, title: "Environmental Science", concepts: [
      C("24.1", "Biosphere and the water cycle", "💧", "The biosphere has biotic (living) and abiotic (non-living: temperature, water, soil, air, sunlight) factors. The water cycle moves water via evaporation, sublimation (ice directly to vapour), transpiration, condensation, precipitation, runoff, infiltration and percolation. Human impacts: urbanisation, plastic dumping, water pollution, deforestation.", "Ice sheets and icecaps convert directly into water vapour without ever becoming liquid first. What is this specific process called?", "Sublimation - conversion of solid directly to gas, skipping the liquid phase.", undefined, [290, 292]),
      C("24.2", "The nitrogen cycle", "🌾", "Nitrogen fixation (Rhizobium, Azotobacter, Nostoc convert inert atmospheric N₂ to usable compounds) → nitrogen assimilation (plants absorb nitrates to build proteins) → ammonification (putrefying bacteria/fungi decompose waste into ammonium) → nitrification (Nitrosomonas/Nitrobacter oxidise ammonium to nitrates) → denitrification (Pseudomonas returns nitrogen gas to air).", "Putrefying bacteria and fungi decompose animal proteins, dead animals and plants into ammonium compounds. What is this process called?", "Ammonification.", undefined, [292, 293]),
      C("24.3", "The carbon cycle and greenhouse effect", "🌡️", "Atmospheric CO2 enters plants via photosynthesis, passes through herbivores/carnivores, and returns to the atmosphere via respiration, decomposition, burning fossil fuels, and volcanic activity. Human impact: burning fossil fuels and deforestation increase atmospheric CO2 (a greenhouse gas), warming the Earth (greenhouse effect, global warming).", "Carbon dioxide is returned to the atmosphere through respiration and decomposition of dead organic matter, plus one more major human-caused route. What is it?", "Burning fossil fuels (also volcanic activity, naturally).", undefined, [293, 294]),
      C("24.4", "Hydrophytes: plants adapted to water", "🪷", "Hydrophytes (in/near water) face too much water, currents, changing water levels, and need buoyancy. Adaptations: poorly developed/absent roots (Hydrilla, Wolffia), reduced body (Lemna), narrow/divided submerged leaves (Hydrilla), long-stalked floating leaves (Lotus), and air-filled spongy petioles for buoyancy (Eichhornia).", "Eichhornia has swollen, spongy petioles containing air chambers. What is the specific function of these air chambers?", "They provide buoyancy and mechanical support, helping the plant float.", undefined, [294, 294]),
      C("24.5", "Xerophytes: plants adapted to dry habitats", "🌵", "Xerophytes need to absorb maximum water, retain it long-term, and minimise transpiration/consumption. Adaptations: very deep roots (Calotropis), succulent water-storing tissue (Opuntia, Aloe vera), small waxy-coated leaves (Acacia) or leaves modified into spines (Opuntia), and some complete their life cycle quickly when moisture is available.", "Opuntia's leaves are modified into spines rather than broad leaves. Why would this specifically help a xerophyte conserve water?", "It reduces the transpiration rate - spines have far less surface area than broad leaves, so much less water is lost through them.", undefined, [294, 295]),
      C("24.6", "Mesophytes: plants of moderate habitats", "🌳", "Mesophytes grow where conditions are neither too wet nor too dry, needing no extreme adaptations. Features: well-developed roots with root caps, straight branched stems, broad thin leaves, a waxy cuticle that traps moisture, and stomata that close under extreme heat/wind to prevent transpiration.", "Mesophyte leaves have stomata that close under extreme heat and wind. What is this adaptation specifically preventing?", "Transpiration - excessive loss of water vapour through the stomata.", undefined, [295, 295]),
      C("24.7", "Adaptations of the bat", "🦇", "Bats (the only flying mammals) show: nocturnality (avoids daytime flight's high energy cost and their thin wing membrane overheating), flight adaptations (forelimbs as wings, tail controls flight, tendons grip while hanging upside down), hibernation (lowered temperature/metabolism when resting, to conserve energy), and echolocation (ultrasonic sounds reflect off prey as echoes).", "Bats use a remarkable high-frequency sound system to locate prey by listening for reflected echoes. What is this system called?", "Echolocation.", undefined, [295, 295]),
      C("24.8", "Adaptations of the earthworm", "🪱", "Earthworms show: a streamlined, cylindrical, segmented body (for burrowing), mucus-covered moist skin (prevents soil sticking, aids oxygenation), setae on each segment (for movement/anchoring in burrows), aestivation (going dormant deep in soil during heat/dryness, lowering metabolism), and photophobic nocturnality (sensing light via skin photoreceptors despite having no eyes).", "When soil becomes too hot or dry, earthworms move deeper into the soil, secrete mucus, and lower their metabolic rate to reduce water loss, remaining dormant. What is this state called?", "Aestivation.", undefined, [296, 296]),
      C("24.9", "Water conservation: importance and measures", "🚰", "Water conservation ensures efficient use, enough usable water, less pollution, and energy savings. Industrial: dry cooling systems, water reuse. Agricultural: lined canals, sprinkler/drip irrigation, drought-resistant crops, mulching. Domestic: bucket baths over showers, low-flow taps, fixing leaks, reusing water.", "Using lined or covered canals, sprinklers, and drip irrigation are all examples of water conservation measures in which sector?", "Agricultural conservation.", undefined, [296, 296]),
      C("24.10", "Water conservation strategies and farm ponds", "🏞️", "Strategies: rainwater harvesting, improved irrigation, traditional harvesting structures, minimising domestic use, awareness, farm ponds, recycling. A farm pond is a dugout structure with inlet/outlet, storing surface runoff for irrigation - it also reduces soil erosion, recharges groundwater, and supports fish rearing. World Water Day is 22nd March.", "Name one advantage of farm ponds, besides simply storing water for irrigation.", "Any one of: reducing soil erosion, recharging groundwater, improving drainage, promoting fish rearing, or providing water for domestic/livestock use.", undefined, [296, 297]),
      C("24.11", "Water recycling: treatment stages", "🔄", "Water recycling reuses treated wastewater for irrigation, industry, toilets, groundwater recharge. Three stages: primary (physical - settling/floating solids removed), secondary (biological - aerobic microbes remove dissolved organic matter via biological oxidation), tertiary (physio-chemical - removes nitrogen/phosphorus, coagulants precipitate fine particles, chlorination disinfects).", "In secondary treatment, biodegradable dissolved organic matter is removed by aerobic microorganisms in the presence of oxygen. What is this specific process called?", "Biological oxidation.", undefined, [297, 298]),
      C("24.12", "Uses of recycled water", "🌊", "Recycled water is used for: agriculture and landscape irrigation, public parks, cooling water for power plants and oil refineries, toilet flushing, dust control, and construction activities.", "Recycled water is used as cooling water for two specific types of industrial facilities. Name them.", "Power plants and oil refineries.", undefined, [298, 298]),
      C("24.13", "IUCN", "🌍", "IUCN (International Union for Conservation of Nature and Natural Resources), founded 1948 in Gland, Switzerland, is the global authority on nature's status and safeguarding measures. Its vision: 'a just world that values and conserves nature.' It compiles the IUCN Red List of threatened species. India (2.4% of world's land) hosts 7-8% of all recorded species and 4 of 34 global biodiversity hotspots (Himalayas, Western Ghats, North-East, Nicobar Islands).", "What is IUCN best known for compiling and publishing, which assesses the conservation status of species worldwide?", "The IUCN Red List of threatened species.", undefined, [298, 299]),
    ],
  },
];

/**
 * A clean, self-authored circuit loop for 4.3 - deliberately not reusing the
 * decorative Unit 4 sketch above, whose wire gaps don't trace a single
 * verifiable path. Rectangle corners (100,60)-(420,60)-(420,190)-(100,190),
 * cell breaking the left edge, bulb breaking the top edge, switch breaking
 * the bottom edge - every coordinate below is computed from that, not eyeballed.
 */
function circuit43Frame(closed: boolean): BoardFrame {
  const blue = "#38bdf8", gold = "#f59e0b", bulbFill = closed ? "#f59e0b" : "#1e293b";
  const svg = `
    <path d="M100 150V190H220" fill="none" stroke="${blue}" stroke-width="6"/>
    <path d="M100 100V60H225" fill="none" stroke="${blue}" stroke-width="6"/>
    <path d="M295 60H420V190H280" fill="none" stroke="${blue}" stroke-width="6"/>
    <line x1="78" y1="112" x2="122" y2="112" stroke="white" stroke-width="7"/>
    <line x1="88" y1="138" x2="112" y2="138" stroke="white" stroke-width="4"/>
    <circle cx="260" cy="60" r="32" fill="${bulbFill}" stroke="white" stroke-width="4"/>
    <path d="M246 46l28 28M274 46l-28 28" stroke="${closed ? "#1e293b" : "#64748b"}" stroke-width="4"/>
    ${closed
      ? `<line x1="220" y1="190" x2="280" y2="190" stroke="${gold}" stroke-width="6"/>`
      : `<line x1="220" y1="190" x2="245" y2="172" stroke="${gold}" stroke-width="6" stroke-linecap="round"/><circle cx="220" cy="190" r="5" fill="white"/><circle cx="280" cy="190" r="5" fill="white"/>`}
  `;
  return {
    diagram: {
      title: closed ? "Closed circuit - the loop is complete" : "Open circuit - the switch has broken the loop",
      viewBox: "0 0 520 250",
      svg,
      motionPath: closed ? { d: "M100 125 L100 60 L420 60 L420 190 L100 190 Z", label: "Current flows all the way round and the bulb lights." } : undefined,
      parts: [
        { label: "Cell", at: [100, 125], tone: "gold", note: "The cell supplies the energy that pushes charge around the loop." },
        { label: "Bulb", at: [260, 60], tone: "blue", note: closed ? "Current flowing through the bulb's filament makes it light." : "No current reaches the bulb while the loop is open, so it stays dark." },
        { label: "Switch", at: [250, 190], tone: closed ? "green" : "red", note: closed ? "Closed - the path is complete, so current can flow." : "Open - the gap breaks the path. Current cannot jump across it." },
      ],
    },
  };
}

/**
 * Extra Part B test questions for Unit 4, taken from the textbook's own
 * "Choose the correct answer" / "True or false" review section (p49-50) -
 * real user finding 2026-09-22: "test questinos are repeated... textbook
 * got more questoins too, which can be used across." These are additional
 * real questions, not a substitute for Part A's one-per-concept set.
 */
function unit4PartB(definition: ScienceDefinition): BoardTask[] {
  if (definition.number !== 4) return [];
  const frameFor4 = (id: string) => unit4Frame(definition.concepts.find((c) => c.id === id)!) ?? {};
  return [
    {
      title: "Test B · 4.1",
      conceptId: "4.1",
      prompt: "Electric field lines ___ from a positive charge and ___ in a negative charge.",
      setup: frameFor4("4.1"),
      options: [
        { label: "start; end", correct: true, say: "Correct. Field lines point radially outward from an isolated positive charge (they start there) and radially inward to a negative charge (they end there).", frame: frameFor4("4.1") },
        { label: "end; start", correct: false, say: "That is backwards. A positive charge pushes a test charge away, so lines start (point outward) from it, not end there.", frame: frameFor4("4.1") },
        { label: "start; start", correct: false, say: "Lines cannot start at both ends of the same field - they start at the positive charge and end at the negative one.", frame: frameFor4("4.1") },
      ],
    },
    {
      title: "Test B · 4.2",
      conceptId: "4.2",
      prompt: "True or false: an ammeter is connected in parallel in an electric circuit.",
      setup: frameFor4("4.2"),
      options: [
        { label: "False - it is connected in series", correct: true, say: "Correct. An ammeter sits in the main path of the circuit, in series, so the same current that flows through the circuit flows through it.", frame: frameFor4("4.2") },
        { label: "True", correct: false, say: "Not quite - a voltmeter is the one connected in parallel, across a component. An ammeter is connected in series, in the main path.", frame: frameFor4("4.2") },
      ],
    },
    {
      title: "Test B · 4.3",
      conceptId: "4.3",
      prompt: "The resistance of a wire depends on:",
      setup: frameFor4("4.3"),
      options: [
        { label: "Its temperature, geometry and the material it is made of", correct: true, say: "Correct - all three matter: hotter wires resist more, a longer/thinner wire resists more, and different materials (like copper versus nichrome) resist differently.", frame: frameFor4("4.3") },
        { label: "Only the material it is made of", correct: false, say: "Material matters, but it is not the only factor - a wire's length and thickness (its geometry) and its temperature affect resistance too.", frame: frameFor4("4.3") },
        { label: "Only its length", correct: false, say: "Length is only one factor. Thickness, temperature and the material itself all affect resistance as well.", frame: frameFor4("4.3") },
      ],
    },
    {
      title: "Test B · 4.5",
      conceptId: "4.5",
      prompt: "Electroplating, like copper depositing onto a carbon rod, is an example of which effect of current?",
      setup: frameFor4("4.5"),
      options: [
        { label: "Chemical effect", correct: true, say: "Correct. Electroplating happens through electrolysis, the chemical effect of current passing through a solution.", frame: frameFor4("4.5") },
        { label: "Heating effect", correct: false, say: "Heating effect is what warms a resistor (Joule heating), like in a toaster - it does not deposit metal. That is the chemical effect.", frame: frameFor4("4.5") },
        { label: "Magnetic effect", correct: false, say: "The magnetic effect creates a field around a current-carrying wire - it does not move metal between electrodes. That is the chemical effect.", frame: frameFor4("4.5") },
      ],
    },
    {
      title: "Test B · 4.6",
      conceptId: "4.6",
      prompt: "Why is ac preferred over dc for carrying electricity over long distances?",
      setup: frameFor4("4.6"),
      options: [
        { label: "Its voltage can be raised or lowered with a transformer, and the energy loss is negligible", correct: true, say: "Correct - a step-up transformer raises ac voltage for efficient long-distance transmission, and very little energy is lost this way. dc cannot be transformed like this.", frame: frameFor4("4.6") },
        { label: "It only flows in one direction, so it is simpler", correct: false, say: "That describes dc, not ac - ac actually reverses direction periodically. Its advantage is how easily a transformer can change its voltage.", frame: frameFor4("4.6") },
        { label: "It cannot be converted to dc", correct: false, say: "It can be converted - a rectifier turns ac into dc. The real advantage is easy transformation and low transmission loss.", frame: frameFor4("4.6") },
      ],
    },
  ];
}

function makeTask(definition: ScienceDefinition, concept: ScienceConcept, prefix: string): BoardTask {
  const frame = scienceVisualFrame(definition, concept, 0);
  if (definition.number === 2 && concept.id === "2.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A bus travels 100 m in the first 5 minutes but only 20 m in the next 5 minutes because of heavy traffic. Is this uniform or non-uniform motion?",
      setup: frame,
      options: [
        { label: "Non-uniform", correct: true, say: "Correct. It covers unequal distances (100 m, then 20 m) in equal time intervals (5 minutes each) - that is exactly non-uniform motion.", frame },
        { label: "Uniform", correct: false, say: "Uniform motion needs equal distances in equal times. Here the bus covers 100 m then only 20 m in the same 5 minutes each time, so it is non-uniform.", frame },
        { label: "Circular motion", correct: false, say: "Circular motion describes the shape of the path, not whether the speed is steady. This bus is describing how steady its speed is, which makes it uniform or non-uniform motion.", frame },
      ],
    };
  }
  if (definition.number === 2 && concept.id === "2.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A cyclist rides 400 m around a circular track and stops back at the start. What is the displacement?",
      setup: frame,
      options: [
        { label: "0 m", correct: true, say: "Correct. Displacement is the straight-line change from start to finish - since both are the same point, the displacement is zero, even though the distance travelled was 400 m.", frame },
        { label: "400 m", correct: false, say: "400 m is the distance - the full length of the path. Displacement only cares about start and finish position, which are the same point here, so it is 0 m.", frame },
        { label: "200 m", correct: false, say: "That would be half the track, not the straight-line change from start to finish. Since the cyclist ends exactly where they started, displacement is 0 m.", frame },
      ],
    };
  }
  if (definition.number === 2 && concept.id === "2.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Thunder is heard 5 s after lightning is seen. Sound travels at 346 m/s. How far away was the lightning?",
      setup: frame,
      options: [
        { label: "1730 m", correct: true, say: "Correct. Distance = Speed × Time = 346 × 5 = 1730 m.", frame },
        { label: "351 m", correct: false, say: "That adds 346 + 5 instead of multiplying. Distance = Speed × Time = 346 × 5 = 1730 m.", frame },
        { label: "69.2 m", correct: false, say: "That divides instead of multiplying. To find distance from speed and time, multiply them: 346 × 5 = 1730 m.", frame },
      ],
    };
  }
  if (definition.number === 2 && concept.id === "2.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A person walks and covers 500 m every 5 minutes, at a constant rate. What does the distance-time graph look like, and what is the speed?",
      setup: frame,
      options: [
        { label: "A straight line; 100 m/min", correct: true, say: "Correct. Equal distances in equal times give a straight line, and the slope (speed) is 500 ÷ 5 = 100 m/min.", frame },
        { label: "A curve; 100 m/min", correct: false, say: "A curve would mean changing speed. Covering equal distances in equal times gives a straight line - only the slope value, 100 m/min, was right.", frame },
        { label: "A straight line; 2500 m/min", correct: false, say: "That divided the wrong way round. Speed is distance ÷ time: 500 m ÷ 5 min = 100 m/min, not 2500.", frame },
      ],
    };
  }
  if (definition.number === 2 && concept.id === "2.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A stone is dropped from rest and falls for 3 s. Using g = 10 m/s², find its velocity at that moment.",
      setup: frame,
      options: [
        { label: "30 m/s", correct: true, say: "Correct. v = u + gt = 0 + (10 × 3) = 30 m/s - starting from rest, u = 0.", frame },
        { label: "13 m/s", correct: false, say: "That adds g and t instead of multiplying. v = u + gt = 0 + (10 × 3) = 30 m/s.", frame },
        { label: "3.33 m/s", correct: false, say: "That divides instead of multiplying. v = u + gt = 0 + (10 × 3) = 30 m/s.", frame },
      ],
    };
  }
  if (definition.number === 2 && concept.id === "2.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A 1000 kg car moves at 10 m/s around a circle of radius 20 m. Find the centripetal force.",
      setup: frame,
      options: [
        { label: "5000 N", correct: true, say: "Correct. a = v²/r = 100/20 = 5 m/s², then F = ma = 1000 × 5 = 5000 N.", frame },
        { label: "500 N", correct: false, say: "That used v instead of v² in the acceleration formula. a = v²/r = 10²/20 = 5 m/s², then F = ma = 1000 × 5 = 5000 N.", frame },
        { label: "50000 N", correct: false, say: "That forgot to divide by the radius. a = v²/r = 100/20 = 5 m/s², then F = ma = 1000 × 5 = 5000 N.", frame },
      ],
    };
  }
  if (definition.number === 2 && concept.id === "2.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In which direction does centrifugal force act on an object moving in a circle?",
      setup: frame,
      options: [
        { label: "Away from the centre", correct: true, say: "Correct. Centrifugal force acts outward, away from the centre - the opposite direction to centripetal force, though the same size.", frame },
        { label: "Toward the centre", correct: false, say: "That describes centripetal force, not centrifugal. Centrifugal force pulls the opposite way - away from the centre.", frame },
        { label: "Along the direction of motion", correct: false, say: "Centrifugal force acts outward, perpendicular to the direction of motion at any instant - not along the path itself.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A box exerts a thrust of 600 N over a contact area of 0.2 m². What pressure does it exert?",
      setup: frame,
      options: [
        { label: "3000 Pa", correct: true, say: "Correct. P = F/A = 600 ÷ 0.2 = 3000 Pa.", frame },
        { label: "120 Pa", correct: false, say: "That multiplies instead of dividing. Pressure = Force ÷ Area = 600 ÷ 0.2 = 3000 Pa.", frame },
        { label: "600.2 Pa", correct: false, say: "That added the numbers together. Pressure = Force ÷ Area = 600 ÷ 0.2 = 3000 Pa.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A mercury barometer reads 760 mm (0.76 m). Using density of mercury = 13600 kg/m³ and g = 10 m/s², find the atmospheric pressure.",
      setup: frame,
      options: [
        { label: "≈103 360 Pa", correct: true, say: "Correct. P = hρg = 0.76 × 13600 × 10 ≈ 103 360 Pa - close to the book's own value of 1.013 × 10⁵ Pa using g = 9.8.", frame },
        { label: "≈10 336 Pa", correct: false, say: "That is missing a factor of 10 somewhere in the multiplication. P = hρg = 0.76 × 13600 × 10 ≈ 103 360 Pa.", frame },
        { label: "760 Pa", correct: false, say: "That is just the height in mm, not a real pressure calculation. Use P = hρg with h in metres: 0.76 × 13600 × 10 ≈ 103 360 Pa.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A hydraulic press has a small piston of area 5 cm² and a large piston of area 250 cm². A force of 20 N is applied to the small piston. What force does the large piston produce?",
      setup: frame,
      options: [
        { label: "1000 N", correct: true, say: "Correct. Pressure is equal throughout: F2 = F1 × (A/a) = 20 × (250/5) = 1000 N.", frame },
        { label: "50 N", correct: false, say: "That divided instead of multiplying by the area ratio. F2 = F1 × (A/a) = 20 × (250/5) = 1000 N.", frame },
        { label: "20 N", correct: false, say: "The force is not the same on both pistons - only the pressure is equal. Because the large piston has 50 times the area, it produces 50 times the force: 20 × 50 = 1000 N.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "280 g of kerosene fills a 350 cm³ container exactly. What is its density?",
      setup: frame,
      options: [
        { label: "0.8 g/cm³", correct: true, say: "Correct. Density = mass ÷ volume = 280 ÷ 350 = 0.8 g/cm³ - the same value the book gets for kerosene.", frame },
        { label: "1.25 g/cm³", correct: false, say: "That divides the wrong way round. Density is mass ÷ volume: 280 ÷ 350 = 0.8 g/cm³.", frame },
        { label: "98 g/cm³", correct: false, say: "That multiplies mass and volume instead of dividing. Density = mass ÷ volume = 280 ÷ 350 = 0.8 g/cm³.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A block is denser than the water it is placed in. Is it positively or negatively buoyant, and does it float or sink?",
      setup: frame,
      options: [
        { label: "Negatively buoyant - it sinks", correct: true, say: "Correct. When an object is denser than the fluid, the buoyant force is not enough to balance its weight, so it is negatively buoyant and sinks.", frame },
        { label: "Positively buoyant - it floats", correct: false, say: "Positively buoyant objects are less dense than the fluid, not more. A denser object sinks - it is negatively buoyant.", frame },
        { label: "Neutrally buoyant - it stays still anywhere", correct: false, say: "Neutral buoyancy needs equal density to the fluid. This block is denser, so the buoyant force loses out to its weight and it sinks.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A raft floats, displacing water that weighs 800 N. What is the weight of the raft?",
      setup: frame,
      options: [
        { label: "800 N", correct: true, say: "Correct. By the first law of flotation, a floating body's weight always equals the weight of the fluid it displaces.", frame },
        { label: "Less than 800 N", correct: false, say: "For a body that is floating (not sinking or rising), its weight exactly equals the weight of fluid displaced - not less. That is the first law of flotation.", frame },
        { label: "More than 800 N", correct: false, say: "If the raft weighed more than the water it displaced, it would sink further and displace more water until the two weights matched - that is the first law of flotation.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A bar magnet's field lines are drawn closer together near the poles and more spread out further away. What does that tell you about the field?",
      setup: frame,
      options: [
        { label: "The field is strongest near the poles", correct: true, say: "Correct. Field lines drawn closer together always show a stronger magnetic field - that is why they bunch up near the poles.", frame },
        { label: "The field is weakest near the poles", correct: false, say: "It is the opposite - closer field lines mean a stronger field, and lines are always closest together right at the poles.", frame },
        { label: "Spacing of field lines has no meaning", correct: false, say: "It does - the spacing shows field strength. Closer lines mean a stronger field, which is why they crowd together near the poles.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Using the right hand thumb rule, if current flows upward through a vertical wire, which way do the magnetic field lines curl around it?",
      setup: frame,
      options: [
        { label: "Anticlockwise, viewed from above", correct: true, say: "Correct. Point your right thumb up (the current's direction) and your curled fingers show the field circling anticlockwise when viewed from above.", frame },
        { label: "Clockwise, viewed from above", correct: false, say: "That would be the direction for current flowing downward. With current flowing up, the right hand thumb rule gives an anticlockwise field viewed from above.", frame },
        { label: "Straight lines, parallel to the wire", correct: false, say: "The field forms circles around the wire, not straight lines - that is exactly what the thumb rule's curled fingers represent.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A 4 m wire carries a current of 2 A, perpendicular to a magnetic field of 1.5 T. Find the force on it.",
      setup: frame,
      options: [
        { label: "12 N", correct: true, say: "Correct. F = BIL = 1.5 × 2 × 4 = 12 N.", frame },
        { label: "7.5 N", correct: false, say: "That added the numbers instead of multiplying them. F = BIL = 1.5 × 2 × 4 = 12 N.", frame },
        { label: "0.75 N", correct: false, say: "That divided somewhere it shouldn't have. F = BIL = 1.5 × 2 × 4 = 12 N.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "You want an electric motor to turn with more force. Which of these would NOT help?",
      setup: frame,
      options: [
        { label: "Decreasing the number of turns in the coil", correct: true, say: "Correct - that would make it weaker, not stronger. Increasing the turns, the current, the coil's area, or the magnet's strength all increase the turning force.", frame },
        { label: "Increasing the current in the coil", correct: false, say: "That does help - a stronger current increases the turning force. The one that does NOT help is decreasing the number of turns.", frame },
        { label: "Using a stronger magnet", correct: false, say: "That does help - a stronger magnetic field increases the turning force. The one that does NOT help is decreasing the number of turns.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "You move a bar magnet into a coil connected to a galvanometer, then hold it still inside the coil. What happens to the galvanometer reading?",
      setup: frame,
      options: [
        { label: "It shows a deflection while moving, then returns to zero when still", correct: true, say: "Correct. Electromagnetic induction needs a changing magnetic flux - once the magnet stops moving, the flux through the coil stops changing, and the induced current stops too.", frame },
        { label: "It stays deflected as long as the magnet is inside the coil", correct: false, say: "It only deflects while the flux is changing, which means while the magnet is moving. A stationary magnet inside the coil produces no induced current at all.", frame },
        { label: "It shows nothing at any point", correct: false, say: "It does deflect - while the magnet is actually moving in or out, which changes the magnetic flux through the coil and induces a current.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which type of generator uses a split-ring commutator instead of slip rings?",
      setup: frame,
      options: [
        { label: "A DC generator", correct: true, say: "Correct. The split-ring commutator keeps one brush always in contact with the arm moving the same way, producing current in one direction only - direct current.", frame },
        { label: "An AC generator", correct: false, say: "An AC generator uses slip rings, which let the current keep reversing direction. The split-ring commutator is what makes a generator produce direct current instead.", frame },
        { label: "Both use the same rings", correct: false, say: "They are different - AC generators use plain slip rings, DC generators use a split-ring commutator, and that difference is exactly what makes the output alternating or direct.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A transformer's primary coil has 100 turns and its secondary has 500 turns. If 20 V ac is applied to the primary, what is the secondary voltage - and is this step-up or step-down?",
      setup: frame,
      options: [
        { label: "100 V, step-up", correct: true, say: "Correct. Es = (Ns/Np) × Ep = (500/100) × 20 = 100 V. More turns in the secondary than the primary makes this a step-up transformer.", frame },
        { label: "4 V, step-down", correct: false, say: "That inverted the turns ratio. Es = (Ns/Np) × Ep = (500/100) × 20 = 100 V - and since the secondary has more turns, it steps the voltage up, not down.", frame },
        { label: "20 V, no change", correct: false, say: "A transformer with different numbers of turns always changes the voltage. Es = (Ns/Np) × Ep = (500/100) × 20 = 100 V.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Inside a speaker, why does the electromagnet vibrate back and forth against the permanent magnet?",
      setup: frame,
      options: [
        { label: "Because the electrical pulses rapidly change the electromagnet's field direction, alternately attracting and repelling it", correct: true, say: "Correct. As the current pulses change direction, the electromagnet's field flips too, so it is alternately attracted to and repelled from the fixed permanent magnet - that vibration is what makes the sound.", frame },
        { label: "Because the permanent magnet physically moves back and forth", correct: false, say: "The permanent magnet stays fixed in place - it is the electromagnet that moves, driven by the changing current pulses.", frame },
        { label: "Because sound waves push the magnets apart", correct: false, say: "It works the other way round - the magnets' vibration is what creates the sound waves, not the reverse.", frame },
      ],
    };
  }
  if (definition.number === 7 && concept.id === "7.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "You heat equal amounts of a solid, a liquid and a gas by the same small amount. In which does the volume expand the most?",
      setup: frame,
      options: [
        { label: "The gas", correct: true, say: "Correct. Expansion on heating is greatest in gases, less in liquids, and least in solids - their particles are already loosely arranged and spread apart the most easily.", frame },
        { label: "The liquid", correct: false, say: "Liquids expand more than solids, but gases expand even more - their particles are the least tightly held together, so heating spreads them apart the most.", frame },
        { label: "The solid", correct: false, say: "Solids expand the LEAST of the three - their tightly packed particles resist spreading apart. Gases expand the most.", frame },
      ],
    };
  }
  if (definition.number === 7 && concept.id === "7.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A metal spoon left in a hot cup of tea soon feels hot at the handle too, even though only the bowl end touches the tea. Why?",
      setup: frame,
      options: [
        { label: "Conduction - heat passes molecule to molecule along the solid metal", correct: true, say: "Correct. In a solid, molecules do not move from place to place - they vibrate faster and pass energy on to their neighbours, carrying heat along the spoon to your fingers.", frame },
        { label: "Convection - the metal itself flows toward your hand", correct: false, say: "Convection needs a fluid that can actually flow - a solid spoon cannot do that. Heat moves along a solid by conduction instead.", frame },
        { label: "Radiation - the tea emits waves that skip straight to your fingers", correct: false, say: "Radiation would heat your fingers directly through the air, not specifically travel up the spoon. The spoon heats up along its length by conduction.", frame },
      ],
    };
  }
  if (definition.number === 7 && concept.id === "7.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A room is heated by a radiator placed near the floor rather than near the ceiling. Why does this warm the whole room more effectively?",
      setup: frame,
      options: [
        { label: "Warm air rises from the radiator, and cooler air sinks to replace it, circulating heat through the room", correct: true, say: "Correct. That rising-and-sinking circulation is convection - warm, less dense air rises from the radiator, and cooler, denser air sinks down to take its place, spreading heat through the whole room.", frame },
        { label: "Heat only travels straight up in a fixed beam", correct: false, say: "Heat from a radiator spreads by convection currents circulating through the room, not a fixed straight beam - that circulation is exactly what carries warmth everywhere.", frame },
        { label: "The floor conducts the heat to the walls directly", correct: false, say: "The room warms mainly through air movement (convection), not through the floor conducting heat into the walls.", frame },
      ],
    };
  }
  if (definition.number === 7 && concept.id === "7.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Astronauts in space feel the Sun's heat even though space is a vacuum with no air or matter to carry heat. How does that heat reach them?",
      setup: frame,
      options: [
        { label: "Radiation - electromagnetic waves that need no medium at all", correct: true, say: "Correct. Radiation is the only heat-transfer method that works through a vacuum, since it travels as electromagnetic waves rather than through the movement or vibration of particles.", frame },
        { label: "Conduction through empty space", correct: false, say: "Conduction needs particles to vibrate and pass energy along - there are none to speak of in a vacuum. Radiation is what crosses empty space.", frame },
        { label: "Convection currents in the vacuum", correct: false, say: "Convection needs a fluid that can flow - a vacuum has no matter to circulate. Radiation is what carries the Sun's heat across empty space.", frame },
      ],
    };
  }
  if (definition.number === 7 && concept.id === "7.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Convert 40°C to Kelvin, and convert 250 K to °C.",
      setup: frame,
      options: [
        { label: "313.15 K, and -23.15°C", correct: true, say: "Correct. TK = 40 + 273.15 = 313.15 K. And T°C = 250 - 273.15 = -23.15°C.", frame },
        { label: "40 K, and 250°C", correct: false, say: "Kelvin and Celsius are not interchangeable without adding or subtracting 273.15. Correctly: 40 + 273.15 = 313.15 K, and 250 - 273.15 = -23.15°C.", frame },
        { label: "273.15 K, and 23.15°C", correct: false, say: "That used 273.15 alone instead of adding it to 40. Correctly: TK = 40 + 273.15 = 313.15 K, and T°C = 250 - 273.15 = -23.15°C.", frame },
      ],
    };
  }
  if (definition.number === 7 && concept.id === "7.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Calculate the heat energy required to raise the temperature of 3 kg of water from 20°C to 60°C (specific heat capacity of water = 4200 J/kg·K).",
      setup: frame,
      options: [
        { label: "504,000 J", correct: true, say: "Correct. Q = mCΔT = 3 × 4200 × 40 = 5,04,000 J, since ΔT = 60 - 20 = 40°C.", frame },
        { label: "252,000 J", correct: false, say: "That used half the correct mass or temperature change. Q = mCΔT = 3 × 4200 × 40 = 5,04,000 J.", frame },
        { label: "12,600 J", correct: false, say: "That left out the mass or the temperature change. Q = mCΔT = 3 × 4200 × 40 = 5,04,000 J.", frame },
      ],
    };
  }
  if (definition.number === 7 && concept.id === "7.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A copper block needs 8000 J of heat energy to raise its temperature by 40 K. Find its heat capacity.",
      setup: frame,
      options: [
        { label: "200 J/K", correct: true, say: "Correct. Heat capacity = Q/ΔT = 8000/40 = 200 J/K.", frame },
        { label: "320,000 J/K", correct: false, say: "That multiplied instead of dividing. Heat capacity = Q/ΔT = 8000/40 = 200 J/K.", frame },
        { label: "8000 J/K", correct: false, say: "That ignored the temperature change entirely. Heat capacity = Q/ΔT = 8000/40 = 200 J/K.", frame },
      ],
    };
  }
  if (definition.number === 7 && concept.id === "7.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A block of solid iodine is left in a warm room. After a while, it disappears entirely, with no puddle of liquid ever forming. What just happened?",
      setup: frame,
      options: [
        { label: "Sublimation - it passed directly from solid to gas", correct: true, say: "Correct. Iodine is one of the substances that sublimes - it skips the liquid stage completely and turns straight from solid into gas, which is why no liquid ever appears.", frame },
        { label: "Melting, followed by a very fast evaporation nobody noticed", correct: false, say: "If it had melted, a liquid stage would have existed, however briefly. Iodine instead sublimes directly from solid to gas, with no liquid stage at all.", frame },
        { label: "Freezing", correct: false, say: "Freezing is a liquid turning to solid, the opposite direction. A solid disappearing straight into gas, with no liquid stage, is sublimation.", frame },
      ],
    };
  }
  if (definition.number === 7 && concept.id === "7.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A pot of water is boiling steadily on a stove at 100°C. You keep the flame on for another five minutes. What happens to the water's temperature?",
      setup: frame,
      options: [
        { label: "It stays at 100°C - the extra heat goes into turning more water to steam", correct: true, say: "Correct. While a substance is changing state, all the added heat becomes latent heat, absorbed to change liquid into gas - the temperature holds steady at 100°C until every drop has boiled away.", frame },
        { label: "It keeps rising above 100°C the longer the flame stays on", correct: false, say: "Temperature stays fixed during a change of state - the extra heat is latent heat, going into turning the water to steam, not into raising the thermometer reading.", frame },
        { label: "It starts falling once boiling begins", correct: false, say: "It does not fall - it holds steady at exactly 100°C throughout the boiling, because the added heat is being used as latent heat rather than raising the temperature.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Ice sheets and icecaps convert directly into water vapour without ever becoming liquid first. What is this specific process called?",
      setup: frame,
      options: [
        { label: "Sublimation", correct: true, say: "Correct. Sublimation is the conversion of solid directly to gas, skipping the liquid phase entirely - exactly what happens to polar/mountain ice.", frame },
        { label: "Evaporation", correct: false, say: "Evaporation is liquid turning to gas, not solid turning directly to gas. Ice skipping the liquid phase entirely is sublimation.", frame },
        { label: "Condensation", correct: false, say: "Condensation is gas turning to liquid - the reverse process. Ice turning directly into vapour is sublimation.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Nitrifying bacteria like Nitrosomonas and Nitrobacter oxidise ammonium compounds into soluble nitrates. What is this process called?",
      setup: frame,
      options: [
        { label: "Nitrification", correct: true, say: "Correct. Nitrification is the process of converting ammonium compounds into nitrates, carried out by nitrifying bacteria.", frame },
        { label: "Nitrogen fixation", correct: false, say: "Nitrogen fixation converts atmospheric nitrogen gas into reactive compounds (done by Rhizobium, Azotobacter) - a different, earlier step. Ammonium-to-nitrate conversion is nitrification.", frame },
        { label: "Denitrification", correct: false, say: "Denitrification does the OPPOSITE - it converts nitrates back into nitrogen gas, returning it to the atmosphere. Ammonium-to-nitrate conversion is nitrification.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Why does increasing atmospheric carbon dioxide lead to global warming?",
      setup: frame,
      options: [
        { label: "CO2 is a greenhouse gas, so more of it traps more heat, warming the Earth (the greenhouse effect)", correct: true, say: "Correct. As a greenhouse gas, increasing CO2 traps more heat in the atmosphere, causing the greenhouse effect and global warming.", frame },
        { label: "CO2 blocks sunlight from reaching Earth at all", correct: false, say: "CO2 doesn't block sunlight from arriving - it traps the heat that radiates back out, acting like a greenhouse. That trapped heat is what causes global warming.", frame },
        { label: "CO2 has no real connection to Earth's temperature", correct: false, say: "CO2 has a well-established, direct connection to temperature - as a greenhouse gas, more of it traps more heat, warming the planet.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Lotus has floating leaves with unusually long leaf stalks. Why is this adaptation useful?",
      setup: frame,
      options: [
        { label: "It lets the leaves move up and down in response to changing water levels, keeping them at the surface", correct: true, say: "Correct. The long stalks let floating leaves track rising and falling water levels, staying at the surface to capture sunlight.", frame },
        { label: "It helps the plant absorb more sunlight by growing taller than nearby trees", correct: false, say: "Hydrophyte leaf stalks aren't competing with trees for height - their long stalks specifically let floating leaves adjust to changing water levels.", frame },
        { label: "It has no functional purpose - it's just decorative", correct: false, say: "It's a genuine functional adaptation - the long stalks let the leaves rise and fall with the water level, keeping them floating at the surface.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Calotropis has very deep-growing roots. Why is this adaptation useful in a dry habitat?",
      setup: frame,
      options: [
        { label: "To reach deeper layers of soil where water is still available", correct: true, say: "Correct. Xerophytes like Calotropis grow deep roots specifically to access water that has sunk below the dry surface layers.", frame },
        { label: "To anchor the plant against strong winds only", correct: false, say: "Wind resistance isn't the primary reason for deep xerophyte roots - the book specifically explains it as reaching water available deeper in the soil.", frame },
        { label: "To avoid competing with nearby plants for sunlight", correct: false, say: "Root depth is unrelated to sunlight competition (that's about height/canopy) - deep roots in xerophytes specifically reach water deeper in the soil.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the function of the waxy cuticle found on mesophyte leaves?",
      setup: frame,
      options: [
        { label: "It traps moisture and lessens water loss", correct: true, say: "Correct. The waxy cuticle on mesophyte leaves helps retain moisture, reducing water loss even though mesophytes don't face extreme water stress.", frame },
        { label: "It attracts more sunlight to the leaf surface", correct: false, say: "The waxy cuticle's role is moisture retention, not attracting sunlight. It traps moisture and lessens water loss.", frame },
        { label: "It helps the plant absorb nutrients directly through the leaf surface", correct: false, say: "Nutrient absorption isn't the cuticle's function - it specifically traps moisture and reduces water loss from the leaf.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Bats are warm-blooded, but unlike most other mammals, they let their internal body temperature drop with a lowered metabolic rate while resting, especially in winter. What is this adaptation called?",
      setup: frame,
      options: [
        { label: "Hibernation", correct: true, say: "Correct. Hibernation is this state of lowered body temperature and metabolic rate during winter rest, conserving energy.", frame },
        { label: "Echolocation", correct: false, say: "Echolocation is bats' ultrasonic sound-based navigation and prey-finding system, unrelated to temperature/metabolism. The rest-state adaptation is hibernation.", frame },
        { label: "Nocturnality", correct: false, say: "Nocturnality is being active at night, a different adaptation from lowering body temperature/metabolism while resting. That specific adaptation is hibernation.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Earthworms have no eyes, yet they can sense light and react negatively to it (photophobic), staying in their burrow during the day. What structures let them sense light without eyes?",
      setup: frame,
      options: [
        { label: "Photoreceptors (light-sensitive cells) present in their skin", correct: true, say: "Correct. Earthworms sense light through photoreceptors in their skin, despite having no eyes at all.", frame },
        { label: "Setae", correct: false, say: "Setae are hair-like structures that help with movement and anchoring in burrows, not light detection. Light sensing happens via skin photoreceptors.", frame },
        { label: "Their mucus coating", correct: false, say: "Mucus prevents soil from sticking and aids oxygenation - it doesn't detect light. Light sensing happens via photoreceptors in the skin.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Using lined or covered canals, sprinklers, and drip irrigation are all examples of water conservation measures in which sector?",
      setup: frame,
      options: [
        { label: "Agricultural conservation", correct: true, say: "Correct. These are all agricultural water conservation techniques, reducing losses from canal leaks, runoff and evaporation.", frame },
        { label: "Industrial conservation", correct: false, say: "Industrial conservation involves things like dry cooling systems and reusing cooling water - canals and drip irrigation are specifically agricultural measures.", frame },
        { label: "Domestic conservation", correct: false, say: "Domestic conservation involves household habits like bucket baths and low-flow taps - canals and drip irrigation are specifically agricultural measures.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "On what date is World Water Day observed each year?",
      setup: frame,
      options: [
        { label: "22nd March", correct: true, say: "Correct. World Water Day is observed on 22nd March every year, focusing attention on the importance of water.", frame },
        { label: "7th April", correct: false, say: "That's World Health Day, not World Water Day. World Water Day is 22nd March.", frame },
        { label: "5th June", correct: false, say: "That's World Environment Day, not World Water Day. World Water Day is 22nd March.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.11") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In secondary treatment, biodegradable dissolved organic matter is removed by aerobic microorganisms in the presence of oxygen. What is this specific process called?",
      setup: frame,
      options: [
        { label: "Biological oxidation", correct: true, say: "Correct. Biological oxidation, performed by aerobic microorganisms, removes the dissolved organic matter during secondary treatment.", frame },
        { label: "Chlorination", correct: false, say: "Chlorination is a disinfection step used in tertiary treatment, not the microbial removal of organic matter. That's biological oxidation.", frame },
        { label: "Sedimentation", correct: false, say: "Sedimentation is a physical settling process (used in primary treatment and to separate biological solids afterward), not the microbial breakdown itself. That's biological oxidation.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.12") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Recycled water is used as cooling water for two specific types of industrial facilities. Name them.",
      setup: frame,
      options: [
        { label: "Power plants and oil refineries", correct: true, say: "Correct. The book specifically lists power plants and oil refineries as using recycled water for cooling.", frame },
        { label: "Hospitals and schools", correct: false, say: "Those aren't the industrial cooling-water users the book lists. Recycled water is used to cool power plants and oil refineries.", frame },
        { label: "Only nuclear power plants, nothing else", correct: false, say: "The book lists both power plants AND oil refineries, not just nuclear plants specifically, as using recycled cooling water.", frame },
      ],
    };
  }
  if (definition.number === 24 && concept.id === "24.13") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "India, despite having only 2.4% of the world's land area, accounts for what percentage of all recorded species worldwide?",
      setup: frame,
      options: [
        { label: "7-8%", correct: true, say: "Correct. India accounts for 7-8% of all recorded species worldwide, despite having only 2.4% of the world's land area - making it a mega-diverse country.", frame },
        { label: "50%", correct: false, say: "That's far too high - no single country holds half of all recorded species. India accounts for 7-8% of all recorded species.", frame },
        { label: "Less than 1%", correct: false, say: "That underestimates India's real biodiversity - it actually accounts for 7-8% of all recorded species worldwide, disproportionate to its 2.4% land share.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which branch of horticulture specifically studies fruit farming - developing fruit quality and cultivation techniques?",
      setup: frame,
      options: [
        { label: "Pomology", correct: true, say: "Correct. Pomology (from Latin 'pomum' = fruit) is the branch of horticulture dealing with fruit farming.", frame },
        { label: "Olericulture", correct: false, say: "Olericulture is the science of growing VEGETABLES, not fruits. Fruit farming is pomology.", frame },
        { label: "Floriculture", correct: false, say: "Floriculture is flower and ornamental plant farming, not fruit farming. Fruit farming is pomology.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Green manure is made from undecomposed green leaves of leguminous plants like Sunhemp. Name one benefit of green manure for soil, besides adding nutrients.",
      setup: frame,
      options: [
        { label: "It improves soil structure and increases water holding capacity", correct: true, say: "Correct. Green manure also decreases soil loss by erosion, helps reclaim alkaline soils, and reduces weed growth.", frame },
        { label: "It instantly kills all soil bacteria", correct: false, say: "Green manure doesn't kill soil bacteria - it actually improves soil health, structure and water retention.", frame },
        { label: "It permanently removes all nitrogen from the soil", correct: false, say: "Green manure ADDS nutrients including nitrogen to the soil (from decomposing legume material), not removes them.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Azospirillum bacteria increase cereal productivity by 5-20%. By how much does it increase millet productivity, according to the book?",
      setup: frame,
      options: [
        { label: "30%", correct: true, say: "Correct. Azospirillum increases millet productivity by 30%, and fodder productivity by over 50%.", frame },
        { label: "5%", correct: false, say: "That's the low end of the cereal productivity increase, not the millet figure. Azospirillum boosts millet productivity by 30%.", frame },
        { label: "90%", correct: false, say: "That's higher than any figure the book states. Azospirillum boosts millet productivity by 30% (and fodder by over 50%).", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Catharanthus roseus (Nithya kalyani) yields alkaloids used to treat which two serious diseases?",
      setup: frame,
      options: [
        { label: "Leukemia and cancer", correct: true, say: "Correct. The alkaloids from Catharanthus roseus (all parts of the plant) treat leukemia and cancer.", frame },
        { label: "Malaria and pneumonia", correct: false, say: "Those are treated by quinine, from Cinchona bark, not Catharanthus roseus. Catharanthus roseus's alkaloids treat leukemia and cancer.", frame },
        { label: "Blood pressure and snake bite", correct: false, say: "Those are treated by reserpine, from Sarpagandha root, not Catharanthus roseus. Catharanthus roseus's alkaloids treat leukemia and cancer.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "At what temperature range do mushrooms grow best, and how much do they typically grow in a week?",
      setup: frame,
      options: [
        { label: "15°C to 23°C; about 3 cm per week", correct: true, say: "Correct. Mushrooms grow best in this temperature range, growing about 3 cm weekly - reaching harvestable size by the third week.", frame },
        { label: "30°C to 40°C; about 10 cm per week", correct: false, say: "Those figures are too high on both counts. Mushrooms grow best at 15-23°C, growing about 3 cm per week.", frame },
        { label: "0°C to 5°C; no growth at all", correct: false, say: "Mushrooms do grow, and not at freezing temperatures - they grow best at 15-23°C, about 3 cm per week.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In aquaponics, nitrifying bacteria break down aquatic animals' waste into nitrites and then into what, which plants can use as nutrients?",
      setup: frame,
      options: [
        { label: "Nitrates", correct: true, say: "Correct. The waste is broken down first into nitrites, then into nitrates, which the plants absorb as nutrients.", frame },
        { label: "Pure nitrogen gas", correct: false, say: "Plants can't directly absorb nitrogen gas as a nutrient. The waste is broken down into nitrates, which plants CAN use.", frame },
        { label: "Ammonia only, with no further breakdown", correct: false, say: "The process goes further than just ammonia - nitrifying bacteria convert it through nitrites into nitrates, which plants use.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Dual purpose cattle breeds provide both milk from the cows and farm labour from the bulls. Name one example given in the book.",
      setup: frame,
      options: [
        { label: "Any one of: Haryana, Ongole, Kankrej, Tharparkar", correct: true, say: "Correct. These are the dual-purpose breeds the book lists, favoured by Indian farmers for providing both milk and labour.", frame },
        { label: "Jersey", correct: false, say: "Jersey is an exotic DAIRY breed (milk only, not farm labour), not a dual-purpose breed. Dual-purpose examples are Haryana, Ongole, Kankrej, Tharparkar.", frame },
        { label: "Kangayam", correct: false, say: "Kangayam is a DRAUGHT breed (farm labour, poor milk yield), not dual-purpose. Dual-purpose examples are Haryana, Ongole, Kankrej, Tharparkar.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Who founded the National Dairy Development Board and is called the 'Father of White Revolution' in India?",
      setup: frame,
      options: [
        { label: "Dr. Verghese Kurien", correct: true, say: "Correct. Dr. Verghese Kurien founded the NDDB and implemented Operation Flood, the world's largest dairy development programme.", frame },
        { label: "Sir Ronald Ross", correct: false, say: "Ronald Ross is known for proving mosquito transmission of malaria, unrelated to dairy farming. The 'Father of White Revolution' is Dr. Verghese Kurien.", frame },
        { label: "Robert Koch", correct: false, say: "Robert Koch is the 'Father of Bacteriology', unrelated to dairy farming. The 'Father of White Revolution' is Dr. Verghese Kurien.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Aquaculture is described as aiming for what specific 'revolution', similar to how dairy farming aims for the White Revolution?",
      setup: frame,
      options: [
        { label: "The Blue Revolution", correct: true, say: "Correct. Aquaculture aims at the Blue Revolution, boosting food/nutrition production from aquatic resources.", frame },
        { label: "The Green Revolution", correct: false, say: "The Green Revolution refers to increased crop/grain production, not aquaculture specifically. Aquaculture aims at the Blue Revolution.", frame },
        { label: "The Golden Revolution", correct: false, say: "That's not the term the book uses for aquaculture's growth goal. Aquaculture aims at the Blue Revolution.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is it called when fish are cultured alongside agricultural crops or livestock, like paddy, poultry or cattle?",
      setup: frame,
      options: [
        { label: "Integrated fish farming", correct: true, say: "Correct. Integrated fish farming combines fish culture with crops or animal husbandry, like paddy, poultry, cattle, pigs or ducks.", frame },
        { label: "Monoculture", correct: false, say: "Monoculture means culturing just ONE type of fish in a water body, unrelated to combining with crops/livestock. That's integrated fish farming.", frame },
        { label: "Extensive fish culture", correct: false, say: "Extensive fish culture describes low-density culturing in a large area with natural feeding, not combining with crops/livestock. That's integrated fish farming.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.11") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Fish fry grow into fingerlings while being maintained in which type of pond for about three months?",
      setup: frame,
      options: [
        { label: "The rearing pond", correct: true, say: "Correct. Fry are transferred from the nursery pond to the rearing pond, where they develop into fingerlings over about three months.", frame },
        { label: "The breeding pond", correct: false, say: "The breeding pond is where mature fish spawn and eggs are fertilized - not where fry develop into fingerlings. That's the rearing pond.", frame },
        { label: "The stocking pond", correct: false, say: "The stocking (or culture/production) pond rears fingerlings up to marketable size - the earlier stage of growing into fingerlings happens in the rearing pond.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.12") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Penaeus indicus and Penaeus monodon are cultured in which type of water - marine or freshwater?",
      setup: frame,
      options: [
        { label: "Marine water", correct: true, say: "Correct. These Penaeus species are cultured in marine water - this is called marine prawn culture or shrimp culture.", frame },
        { label: "Freshwater", correct: false, say: "Freshwater prawn culture instead uses Macrobrachium species. Penaeus indicus and P. monodon are marine species.", frame },
        { label: "Brackish water only, never marine or fresh", correct: false, say: "The book specifically classifies Penaeus indicus and P. monodon as marine water prawn species.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.13") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Name one of the three earthworm species specifically used for vermicompost production, according to the book.",
      setup: frame,
      options: [
        { label: "Any one of: Perionyx excavatus, Eisenia fetida, Eudrilus eugeniae", correct: true, say: "Correct. These three species (Indian blueworm, Red worm, African night crawler) are the ones the book lists for vermiculture.", frame },
        { label: "Wuchereria bancrofti", correct: false, say: "That's the nematode worm causing filariasis - a parasitic disease-causing worm, not a vermicomposting species. The right ones are Perionyx excavatus, Eisenia fetida, or Eudrilus eugeniae.", frame },
        { label: "Ascaris lumbricoides", correct: false, say: "That's the roundworm causing ascariasis in humans, not a vermicomposting species. The right ones are Perionyx excavatus, Eisenia fetida, or Eudrilus eugeniae.", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.14") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Apis mellifera (the Italian bee) is described as which type of variety - indigenous or exotic?",
      setup: frame,
      options: [
        { label: "Exotic", correct: true, say: "Correct. Apis mellifera (Italian bee) is an exotic variety, along with Apis adamsoni (African bee).", frame },
        { label: "Indigenous", correct: false, say: "Indigenous varieties are Apis dorsata, Apis florea and Apis indica. Apis mellifera is specifically an exotic variety.", frame },
        { label: "Neither - it's not a real honey bee variety", correct: false, say: "Apis mellifera is a real, well-documented honey bee variety - specifically an exotic one (the Italian bee).", frame },
      ],
    };
  }
  if (definition.number === 23 && concept.id === "23.15") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "About how many flowers does a honey bee visit during a single collection trip?",
      setup: frame,
      options: [
        { label: "50 to 100 flowers", correct: true, say: "Correct. A honey bee visits 50 to 100 flowers during one collection trip.", frame },
        { label: "1 to 2 flowers", correct: false, say: "That's far too few - a bee visits many more flowers, 50 to 100, in a single collection trip.", frame },
        { label: "5,000 to 10,000 flowers", correct: false, say: "That's far too many for a single trip - a bee visits 50 to 100 flowers per collection trip.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Rod-shaped bacteria are called by what name?",
      setup: frame,
      options: [
        { label: "Bacilli", correct: true, say: "Correct. Rod-shaped bacteria are called bacilli (singular: bacillus).", frame },
        { label: "Cocci", correct: false, say: "Cocci are SPHERICAL bacteria, not rod-shaped. Rod-shaped bacteria are called bacilli.", frame },
        { label: "Spirilla", correct: false, say: "Spirilla are SPIRAL-shaped bacteria, not rod-shaped. Rod-shaped bacteria are called bacilli.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is a single virus particle called?",
      setup: frame,
      options: [
        { label: "A virion", correct: true, say: "Correct. A simple virus particle is often called a virion.", frame },
        { label: "A viroid", correct: false, say: "A viroid is protein-free pathogenic RNA that causes plant disease - a different, related concept. A single virus particle is a virion.", frame },
        { label: "A prion", correct: false, say: "A prion is an infectious protein-only particle with no nucleic acid at all - a completely different infectious agent. A single virus particle is a virion.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "T4 bacteriophage specifically infects which type of organism?",
      setup: frame,
      options: [
        { label: "Bacterial cells", correct: true, say: "Correct. A bacteriophage is specifically a virus that infects bacteria - T4 is a classic example.", frame },
        { label: "Plant cells", correct: false, say: "Viruses that infect plants (like TMV) are called plant viruses, a different category. T4 specifically infects bacteria - it's a bacteriophage.", frame },
        { label: "Human cells", correct: false, say: "Viruses infecting humans/animals are called animal viruses, a different category. T4 specifically infects bacteria - it's a bacteriophage.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Bacillus thuringiensis (Bt) produces a protein toxic to insect larvae, used as a natural pest control. What is this protein called?",
      setup: frame,
      options: [
        { label: "The 'cry' protein", correct: true, say: "Correct. Bt produces the 'cry' protein, which is toxic to insect larvae, making Bt a natural biocontrol agent (biopesticide).", frame },
        { label: "Haemoglobin", correct: false, say: "Haemoglobin is the oxygen-carrying protein in blood, unrelated to Bt's pest-control action. Bt's toxic protein is called the 'cry' protein.", frame },
        { label: "Insulin", correct: false, say: "Insulin is a hormone regulating blood sugar, unrelated to Bt's pest-control action. Bt's toxic protein is called the 'cry' protein.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which fungus is used to produce oxalic acid, acetic acid and citric acid industrially?",
      setup: frame,
      options: [
        { label: "Aspergillus niger", correct: true, say: "Correct. Aspergillus niger, a fungus, is used to produce these organic acids industrially.", frame },
        { label: "Saccharomyces cerevisiae", correct: false, say: "That yeast is used to ferment grapes into wine, not to produce organic acids. Organic acids come from Aspergillus niger.", frame },
        { label: "Lactobacillus", correct: false, say: "Lactobacillus converts milk into curd, not organic acids. Organic acids come from Aspergillus niger.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Streptomycin, an antibiotic, is produced by which microorganism?",
      setup: frame,
      options: [
        { label: "Streptomyces griseus", correct: true, say: "Correct. Streptomycin is produced by the bacterium Streptomyces griseus.", frame },
        { label: "Penicillium notatum", correct: false, say: "That fungus produces penicillin, not streptomycin. Streptomycin comes from Streptomyces griseus.", frame },
        { label: "Bacillus subtilis", correct: false, say: "That bacterium produces bacitracin, not streptomycin. Streptomycin comes from Streptomyces griseus.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "MMR is what type of vaccine, and what three diseases does it protect against?",
      setup: frame,
      options: [
        { label: "A live attenuated vaccine, protecting against Measles, Mumps and Rubella", correct: true, say: "Correct. MMR is a live attenuated vaccine protecting against exactly these three diseases.", frame },
        { label: "A killed (inactivated) vaccine, protecting against Polio", correct: false, say: "IPV (inactivated polio vaccine) is the killed vaccine for polio - MMR is a live attenuated vaccine, protecting against Measles, Mumps and Rubella.", frame },
        { label: "A toxoid vaccine, protecting against Tetanus", correct: false, say: "TT (tetanus toxoid) is the toxoid vaccine for tetanus - MMR is a live attenuated vaccine protecting against Measles, Mumps and Rubella.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Diabetes and cancer are caused by internal factors like organ malfunction or genetic causes, not external pathogens. What broad category of disease are these?",
      setup: frame,
      options: [
        { label: "Non-infectious (non-communicable) diseases", correct: true, say: "Correct. Non-infectious diseases are caused by internal factors, unlike infectious diseases, which spread via external pathogens.", frame },
        { label: "Infectious (communicable) diseases", correct: false, say: "Infectious diseases are caused by external pathogens invading the body and CAN spread person to person - diabetes and cancer, caused by internal factors, are non-infectious diseases instead.", frame },
        { label: "Pandemic diseases", correct: false, say: "Pandemic describes the SCALE of spread (global), not the cause. Diabetes and cancer, from internal causes, are non-infectious diseases.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Pathogens can cause disease in two main ways: physically damaging tissue, or through a second mechanism. What is the second way?",
      setup: frame,
      options: [
        { label: "Toxin secretion - releasing poisonous substances that cause tissue damage", correct: true, say: "Correct. Alongside direct tissue damage, many pathogens secrete toxins - poisonous substances that damage tissue and lead to disease.", frame },
        { label: "Increasing the incubation period", correct: false, say: "Incubation period is just the time between infection and symptoms appearing, not a way pathogens actively cause harm. The second harm mechanism is toxin secretion.", frame },
        { label: "Creating a new reservoir of infection", correct: false, say: "A reservoir of infection is where a pathogen thrives WITHOUT causing disease - it's not itself a way pathogens cause harm. The second harm mechanism is toxin secretion.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which virus causes measles, and how is it primarily transmitted?",
      setup: frame,
      options: [
        { label: "Rubeola virus, transmitted by droplet infection and direct contact with an infected person", correct: true, say: "Correct. Measles is caused by the Rubeola virus, spread through droplet infection and direct contact.", frame },
        { label: "Myxovirus, transmitted only through contaminated water", correct: false, say: "Myxovirus causes influenza, not measles - and measles isn't waterborne. Measles is caused by the Rubeola virus, spread by droplets and contact.", frame },
        { label: "Rhinovirus, transmitted through mosquito bites", correct: false, say: "Rhinovirus causes the common cold, not measles - and measles isn't spread by mosquitoes. Measles is caused by the Rubeola virus, spread by droplets and contact.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.11") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which virus causes Hepatitis A, and what symptom involving skin/eye colour does it cause?",
      setup: frame,
      options: [
        { label: "Hepatitis A virus (HAV); causes jaundice (yellowing of skin and eyes)", correct: true, say: "Correct. HAV inflames the liver, causing jaundice among its symptoms.", frame },
        { label: "Rotavirus; causes watery diarrhoea only, no skin/eye changes", correct: false, say: "Rotavirus causes acute diarrhoea, a different waterborne disease. HAV specifically causes jaundice as a symptom.", frame },
        { label: "Polio virus; causes paralysis, no skin/eye changes", correct: false, say: "Polio virus causes limb paralysis, a different waterborne disease. HAV specifically causes jaundice.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.12") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Malaria is spread by the bite of a specific mosquito. Which one, and is it male or female?",
      setup: frame,
      options: [
        { label: "The FEMALE Anopheles mosquito", correct: true, say: "Correct. Only the female Anopheles mosquito, which feeds on blood, transmits malaria.", frame },
        { label: "The male Anopheles mosquito", correct: false, say: "It's specifically the FEMALE Anopheles mosquito that transmits malaria, since only females feed on blood.", frame },
        { label: "The female Aedes aegypti mosquito", correct: false, say: "Aedes aegypti transmits dengue and chikungunya, not malaria. Malaria is spread by the female Anopheles mosquito.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.13") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Filariasis, caused by the nematode worm Wuchereria bancrofti, is transmitted by which mosquito?",
      setup: frame,
      options: [
        { label: "The Culex mosquito", correct: true, say: "Correct. Filaria is transmitted specifically by the bite of an infected Culex mosquito.", frame },
        { label: "The Anopheles mosquito", correct: false, say: "Anopheles transmits malaria, not filaria. Filaria is transmitted by the Culex mosquito.", frame },
        { label: "The Aedes aegypti mosquito", correct: false, say: "Aedes aegypti transmits dengue and chikungunya, not filaria. Filaria is transmitted by the Culex mosquito.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.14") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Avian influenza is caused by which virus strain, and in what kind of animals was it first identified?",
      setup: frame,
      options: [
        { label: "Influenza Virus H5N1, first identified in birds", correct: true, say: "Correct. Avian influenza (H5N1) was first identified in birds in Southern China and Hong Kong.", frame },
        { label: "Influenza Virus H1N1, first identified in pigs", correct: false, say: "H1N1, from pigs, is swine flu - a different disease. Avian influenza is caused by H5N1, first identified in birds.", frame },
        { label: "HIV, first identified in monkeys", correct: false, say: "HIV causes AIDS, an entirely unrelated disease. Avian influenza is caused by H5N1, first identified in birds.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.15") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Hepatitis B damages which organ, potentially causing cirrhosis?",
      setup: frame,
      options: [
        { label: "The liver", correct: true, say: "Correct. Hepatitis B virus (HBV) damages the liver, causing acute inflammation and cirrhosis.", frame },
        { label: "The kidneys", correct: false, say: "Hepatitis B specifically targets the liver, not the kidneys - the name 'hepatitis' itself refers to liver inflammation.", frame },
        { label: "The lungs", correct: false, say: "Hepatitis B specifically targets the liver, not the lungs.", frame },
      ],
    };
  }
  if (definition.number === 22 && concept.id === "22.16") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the key difference between a live vaccine and a killed vaccine?",
      setup: frame,
      options: [
        { label: "A live vaccine uses a weakened living pathogen; a killed vaccine uses a heat/chemical-killed pathogen and needs a booster dose", correct: true, say: "Correct. Live vaccines (like BCG) use weakened living organisms; killed vaccines (like the typhoid vaccine) use inactivated pathogens and require a primary dose plus a booster.", frame },
        { label: "A live vaccine is given only to adults; a killed vaccine only to children", correct: false, say: "The distinction isn't about age - it's about whether the pathogen used is weakened-but-living or fully killed/inactivated.", frame },
        { label: "There is no real difference between them", correct: false, say: "There is a real, important difference: live vaccines use weakened living pathogens, while killed vaccines use inactivated ones and need a booster dose.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "The body cannot make 9 specific amino acids on its own and must get them from food. What are these called?",
      setup: frame,
      options: [
        { label: "Essential amino acids", correct: true, say: "Correct. The 9 essential amino acids (phenylalanine, valine, threonine, tryptophan, methionine, leucine, isoleucine, lysine, histidine) cannot be biosynthesized by the body and must come from the diet.", frame },
        { label: "Essential fatty acids", correct: false, say: "Essential fatty acids are a fat-related nutrient the body can't make (like omega fatty acids) - not amino acids. The amino acids the body can't make are essential amino acids.", frame },
        { label: "Monosaccharides", correct: false, say: "Monosaccharides are simple sugars (a carbohydrate classification), unrelated to amino acids. The amino acids the body can't make are essential amino acids.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A person has been getting excessive bleeding from even minor cuts because their blood isn't clotting properly. Which fat-soluble vitamin deficiency could cause this?",
      setup: frame,
      options: [
        { label: "Vitamin K", correct: true, say: "Correct. Vitamin K deficiency prevents normal blood clotting, causing excessive bleeding from even minor injuries.", frame },
        { label: "Vitamin A", correct: false, say: "Vitamin A deficiency causes night blindness and dry cornea, not clotting problems. The vitamin linked to clotting is Vitamin K.", frame },
        { label: "Vitamin E", correct: false, say: "Vitamin E deficiency causes sterility, not clotting problems. The vitamin linked to blood clotting is Vitamin K.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A patient shows degenerative nerve changes, weak muscles and even paralysis - a condition called Beriberi. Which water-soluble vitamin deficiency causes this?",
      setup: frame,
      options: [
        { label: "Vitamin B1 (Thiamine)", correct: true, say: "Correct. Vitamin B1 (Thiamine) deficiency causes Beriberi, with degenerative nerve changes, muscle weakness and paralysis.", frame },
        { label: "Vitamin B12", correct: false, say: "Vitamin B12 deficiency causes pernicious anaemia, not Beriberi. Beriberi is specifically caused by Vitamin B1 (Thiamine) deficiency.", frame },
        { label: "Vitamin C", correct: false, say: "Vitamin C deficiency causes scurvy, not Beriberi. Beriberi is specifically caused by Vitamin B1 (Thiamine) deficiency.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A person experiences muscular cramps, and their nerve impulses aren't transmitting properly. Which mineral, related to fluid balance and neurotransmission, could be deficient?",
      setup: frame,
      options: [
        { label: "Sodium", correct: true, say: "Correct. Sodium deficiency causes muscular cramps and prevents nerve impulses from being transmitted properly, since sodium maintains fluid balance and is involved in neurotransmission.", frame },
        { label: "Iron", correct: false, say: "Iron deficiency causes anaemia (it's important for haemoglobin), not muscular cramps and nerve transmission problems - that's a sodium deficiency symptom.", frame },
        { label: "Iodine", correct: false, say: "Iodine deficiency causes goitre (thyroid hormone formation), not muscular cramps and nerve transmission problems - that's a sodium deficiency symptom.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A child's diet mainly consists of carbohydrates but severely lacks protein. What condition, common in children aged 1-5, could this lead to?",
      setup: frame,
      options: [
        { label: "Kwashiorkor", correct: true, say: "Correct. Kwashiorkor is severe protein deficiency, specifically affecting children aged 1-5 whose diet has carbohydrates but lacks protein.", frame },
        { label: "Marasmus", correct: false, say: "Marasmus affects infants under 1 year old, from a diet poor in carbohydrates, fats AND proteins together - not this scenario of a carb-rich, protein-poor diet in a 1-5 year old, which is Kwashiorkor.", frame },
        { label: "Scurvy", correct: false, say: "Scurvy is caused by Vitamin C deficiency, unrelated to protein-energy malnutrition. This scenario describes Kwashiorkor.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A batch of food spoils faster due to unhygienic storage conditions and contaminated utensils used during preparation - not because of anything happening inside the food itself. What category of spoilage factor is this?",
      setup: frame,
      options: [
        { label: "An external factor", correct: true, say: "Correct. Contaminated utensils, unhygienic storage and adulterants are external factors, as opposed to internal factors like the food's own enzymatic activity or moisture content.", frame },
        { label: "An internal factor", correct: false, say: "Internal factors are about the food itself (enzymatic activity, moisture content). Unhygienic storage and contaminated utensils are external factors instead.", frame },
        { label: "Neither - contaminated utensils don't cause spoilage", correct: false, say: "Contaminated utensils and unhygienic storage genuinely do cause spoilage - they're classified as external factors.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Meat and fish are exposed to smoke, whose drying action helps preserve them. What preservation method is this?",
      setup: frame,
      options: [
        { label: "Smoking", correct: true, say: "Correct. Smoking exposes food (commonly meat and fish) to smoke, whose drying action preserves the food.", frame },
        { label: "Pasteurization", correct: false, say: "Pasteurization is a heat treatment for liquid foods like milk, not a smoke-exposure method. The smoke-based method is smoking.", frame },
        { label: "Irradiation", correct: false, say: "Irradiation uses ionizing radiation (x-rays, gamma rays, UV), not smoke, to kill bacteria. The smoke-based method is smoking.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Oil is added to pickles as a preservative. How does this specifically help prevent spoilage?",
      setup: frame,
      options: [
        { label: "It prevents contact between the food and air, so microorganisms can't grow", correct: true, say: "Correct. The oil layer blocks air from reaching the food, preventing microorganisms from growing and spoiling it.", frame },
        { label: "It removes moisture from the food through osmosis", correct: false, say: "That's how SALT preserves food, not oil. Oil works by blocking air contact with the food, preventing microbial growth.", frame },
        { label: "It kills microbes using ionizing radiation", correct: false, say: "That describes irradiation, a completely different preservation method. Oil works by physically blocking air contact with the food.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Pesticide residues found on fruits and vegetables are usually not added on purpose - they end up there due to ignorance or carelessness during handling. What category of adulterant is this?",
      setup: frame,
      options: [
        { label: "An incidental (unintentionally added) adulterant", correct: true, say: "Correct. Pesticide residues are a classic example of incidental adulterants - added unknowingly due to carelessness during food handling and packaging, not deliberately for profit.", frame },
        { label: "A natural adulterant", correct: false, say: "Natural adulterants are substances that occur naturally IN the food itself (like Prussic acid in apple seeds), not pesticide residue from handling. Pesticide residue is an incidental adulterant.", frame },
        { label: "An intentionally added adulterant", correct: false, say: "Intentional adulterants are added deliberately for financial gain, unlike pesticide residue which ends up in food by accident/carelessness. That makes it an incidental adulterant.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Besides physical illness like fever and diarrhoea, what type of disorder related to the nervous system can result from consuming adulterated food?",
      setup: frame,
      options: [
        { label: "Neurological disorders", correct: true, say: "Correct. The book specifically lists neurological disorders among the serious health effects of consuming adulterated food, alongside allergies and organ failure.", frame },
        { label: "Only common cold symptoms", correct: false, say: "A common cold isn't among the health effects listed for adulterated food - the book specifically lists more serious effects like neurological disorders, kidney/liver failure and cancer.", frame },
        { label: "No effect on the nervous system at all", correct: false, say: "The book specifically lists neurological disorders as one of the real health effects of consuming adulterated food.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.11") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What was the purpose of the Prevention of Food Adulteration Act, enacted by the Indian Government in 1954?",
      setup: frame,
      options: [
        { label: "To ensure pure and wholesome food for consumers, and protect them from fraudulent trade practices", correct: true, say: "Correct. The Act, with its 1955 Rules, set minimum quality standards and hygienic conditions specifically to protect consumers from fraud and ensure food purity.", frame },
        { label: "To regulate food prices only, with no quality standards", correct: false, say: "The Act's purpose was ensuring food purity and protecting consumers from fraud - not simply price regulation (that's closer to what the FCI does).", frame },
        { label: "To ban all food imports into India", correct: false, say: "The Act has nothing to do with import bans - its purpose is ensuring pure, wholesome food and protecting consumers from fraudulent trade practices.", frame },
      ],
    };
  }
  if (definition.number === 21 && concept.id === "21.12") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A jar of honey carries the AGMARK certification. What type of products does AGMARK specifically certify?",
      setup: frame,
      options: [
        { label: "Agricultural and livestock products (like cereals, essential oils, pulses, honey, butter)", correct: true, say: "Correct. AGMARK (Agricultural Marking) certifies agricultural and livestock products specifically.", frame },
        { label: "Industrial products like electrical appliances", correct: false, say: "That's what ISI (Bureau of Indian Standards) certifies, not AGMARK. AGMARK certifies agricultural and livestock products.", frame },
        { label: "Fruit products like juice, jam and pickles", correct: false, say: "That's what FPO (Fruit Process Order) certifies specifically, not AGMARK. AGMARK covers agricultural and livestock products more broadly.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which organ system's organs are the heart, blood and blood vessels, and whose function is transporting respiratory gases, nutrients and waste products?",
      setup: frame,
      options: [
        { label: "The circulatory system", correct: true, say: "Correct. The circulatory system (heart, blood, blood vessels) transports respiratory gases, nutritive substances and waste products throughout the body.", frame },
        { label: "The respiratory system", correct: false, say: "The respiratory system (respiratory tract and lungs) handles breathing specifically - transporting substances throughout the body is the circulatory system's job.", frame },
        { label: "The excretory system", correct: false, say: "The excretory system (kidneys, ureters, bladder, urethra) eliminates nitrogenous waste specifically - general transport of gases/nutrients/waste is the circulatory system's job.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Molars are used for crushing, grinding and mastication, and there are 12 of them in a full permanent set. Which type of tooth, with only 4 in a full set, is instead specialized for tearing and piercing?",
      setup: frame,
      options: [
        { label: "Canines", correct: true, say: "Correct. Canines (4 in a full permanent set) are specialized for tearing and piercing food.", frame },
        { label: "Incisors", correct: false, say: "Incisors (8 in a full set) are for cutting and biting, not tearing and piercing. That's the canines' job (4 in a full set).", frame },
        { label: "Premolars", correct: false, say: "Premolars (8 in a full set) are for crushing and grinding, not tearing and piercing. That's the canines' job (4 in a full set).", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the name of the flap-like structure at the top of the trachea that closes during swallowing to stop food from entering the windpipe?",
      setup: frame,
      options: [
        { label: "The epiglottis", correct: true, say: "Correct. The epiglottis closes over the entrance to the trachea during swallowing, preventing food from entering the windpipe.", frame },
        { label: "The pylorus", correct: false, say: "The pylorus is the opening between the stomach and the small intestine, unrelated to swallowing. The structure that closes the windpipe during swallowing is the epiglottis.", frame },
        { label: "The oesophagus", correct: false, say: "The oesophagus is the food pipe itself, not the flap that protects the windpipe. That flap is the epiglottis.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which part of the small intestine is C-shaped and receives both the bile duct from the liver and the pancreatic duct from the pancreas?",
      setup: frame,
      options: [
        { label: "The duodenum", correct: true, say: "Correct. The duodenum is C-shaped and is where both the bile duct and pancreatic duct empty their secretions.", frame },
        { label: "The jejunum", correct: false, say: "The jejunum is the short middle part of the small intestine, not where the bile and pancreatic ducts empty. That's the duodenum.", frame },
        { label: "The ileum", correct: false, say: "The ileum is the longest part, where absorption happens via villi, not where the bile and pancreatic ducts empty. That's the duodenum.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Name two vitamins the liver stores, according to the book.",
      setup: frame,
      options: [
        { label: "Vitamin A and Vitamin D", correct: true, say: "Correct. The liver stores vitamins A and D, along with iron and copper.", frame },
        { label: "Vitamin B12 and Vitamin K", correct: false, say: "Those aren't the vitamins the book specifically lists as stored in the liver - it specifically names Vitamin A and Vitamin D.", frame },
        { label: "Vitamin C and Vitamin E", correct: false, say: "Those aren't the vitamins the book specifically lists as stored in the liver - it specifically names Vitamin A and Vitamin D.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which pancreatic enzyme specifically breaks down starch into maltose?",
      setup: frame,
      options: [
        { label: "Pancreatic amylase", correct: true, say: "Correct. Pancreatic amylase converts starch into maltose - the same conversion ptyalin (salivary amylase) does in the mouth.", frame },
        { label: "Trypsin", correct: false, say: "Trypsin acts on proteins and peptones, not starch. Starch is broken down by pancreatic amylase.", frame },
        { label: "Pancreatic lipase", correct: false, say: "Pancreatic lipase acts on emulsified fats, not starch. Starch is broken down by pancreatic amylase.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the name of the small, blind pouch-like structure at the junction of the small and large intestine, from which the vestigial vermiform appendix arises?",
      setup: frame,
      options: [
        { label: "The caecum", correct: true, say: "Correct. The caecum is this blind pouch, and the vermiform appendix arises from its blind end.", frame },
        { label: "The rectum", correct: false, say: "The rectum is the LAST part of the large intestine, opening into the anus - not the junction with the small intestine. That's the caecum.", frame },
        { label: "The duodenum", correct: false, say: "The duodenum is the first part of the SMALL intestine, not the junction with the large intestine. That junction, with the appendix, is the caecum.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Sweat contains water along with small amounts of several other chemicals. Name two of them.",
      setup: frame,
      options: [
        { label: "Any two of: ammonia, urea, lactic acid, salts (mainly sodium chloride)", correct: true, say: "Correct. Sweat contains water with small amounts of ammonia, urea, lactic acid and salts (mainly sodium chloride).", frame },
        { label: "Glucose and haemoglobin", correct: false, say: "Those are not components of normal sweat. Sweat contains water plus small amounts of ammonia, urea, lactic acid and salts.", frame },
        { label: "Bile and pepsin", correct: false, say: "Bile and pepsin are digestive substances, not sweat components. Sweat contains water plus ammonia, urea, lactic acid and salts.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the name of the notch on the inner, concave side of each kidney, through which blood vessels, nerves and the ureter connect?",
      setup: frame,
      options: [
        { label: "The hilum", correct: true, say: "Correct. The hilum is the notch on the kidney's concave inner side where blood vessels and nerves enter, and the ureter carries urine out.", frame },
        { label: "The cortex", correct: false, say: "The cortex is the kidney's outer, darker region - not a notch or opening. The notch where vessels/ureter connect is the hilum.", frame },
        { label: "The medulla", correct: false, say: "The medulla is the kidney's inner, lighter region containing renal pyramids - not a notch or opening. That notch is the hilum.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Blood enters the glomerulus through one type of arteriole and leaves through another. What are these two arterioles called?",
      setup: frame,
      options: [
        { label: "Afferent arteriole (blood enters) and efferent arteriole (blood leaves)", correct: true, say: "Correct. Blood enters the glomerular capillaries through the afferent arteriole and leaves through the efferent arteriole.", frame },
        { label: "Proximal arteriole and distal arteriole", correct: false, say: "Proximal and distal describe parts of the renal TUBULE, not the arterioles carrying blood to/from the glomerulus. Those are the afferent and efferent arterioles.", frame },
        { label: "Renal artery and renal vein only", correct: false, say: "Those are the larger vessels serving the whole kidney - the specific arterioles at the glomerulus itself are called afferent (in) and efferent (out).", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.11") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "During tubular reabsorption, essential substances like glucose, amino acids and water are taken back INTO the blood from the filtrate. Where in the nephron does this reabsorption mainly happen?",
      setup: frame,
      options: [
        { label: "The proximal convoluted tubule", correct: true, say: "Correct. The proximal convoluted tubule is where essential substances (glucose, amino acids, vitamins, sodium, potassium, bicarbonates, water) are reabsorbed by selective reabsorption.", frame },
        { label: "The Bowman's capsule", correct: false, say: "Bowman's capsule is where filtration happens (both essential and non-essential substances pass through), not where selective reabsorption occurs. That happens in the proximal convoluted tubule.", frame },
        { label: "The ureter", correct: false, say: "The ureter simply carries finished urine to the bladder - reabsorption happens earlier, in the proximal convoluted tubule of the nephron.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.12") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the name of the coiled mass of tubules lying along the inner side of each testis, which provides nourishment to developing sperm?",
      setup: frame,
      options: [
        { label: "The epididymis", correct: true, say: "Correct. The epididymis, containing the Sertoli cells, nourishes developing sperm along the inner side of each testis.", frame },
        { label: "The vas deferens", correct: false, say: "The vas deferens is the straight tube that carries sperm TO the seminal vesicles, not the coiled tubule mass that nourishes them. That's the epididymis.", frame },
        { label: "The scrotum", correct: false, say: "The scrotum is the pouch of skin housing the testes for thermoregulation, not the coiled nourishing tubule mass on the testis itself. That's the epididymis.", frame },
      ],
    };
  }
  if (definition.number === 20 && concept.id === "20.13") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the narrower lower part of the uterus called, which leads into the vagina?",
      setup: frame,
      options: [
        { label: "The cervix", correct: true, say: "Correct. The cervix is the uterus's narrower lower part, leading into the vagina.", frame },
        { label: "The fimbriae", correct: false, say: "Fimbriae are the finger-like projections at the fallopian tube's end that pick up the ovum - not part of the uterus itself. The uterus's narrow lower part is the cervix.", frame },
        { label: "The oviduct", correct: false, say: "The oviduct is another name for the fallopian tube, which carries the ovum toward the uterus - not the uterus's own narrow lower part. That's the cervix.", frame },
      ],
    };
  }
  if (definition.number === 19 && concept.id === "19.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Climbing vines wrap around a fence or pole they touch, letting them find support. What type of tropism causes this?",
      setup: frame,
      options: [
        { label: "Thigmotropism", correct: true, say: "Correct. Thigmotropism is movement of a plant part in response to touch - exactly how climbing vines find and wrap around a support.", frame },
        { label: "Chemotropism", correct: false, say: "Chemotropism is response to a chemical stimulus (like a pollen tube growing toward stigma sugar), not physical touch. Vines finding support by touch is thigmotropism.", frame },
        { label: "Hydrotropism", correct: false, say: "Hydrotropism is response to water, typically seen in roots - not what lets a vine wrap around a fence it touches. That's thigmotropism.", frame },
      ],
    };
  }
  if (definition.number === 19 && concept.id === "19.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Rhizophora (a mangrove/halophyte) produces roots that turn 180° to point upright, out of the waterlogged soil. What unusual tropism does this show, compared to a typical plant's roots?",
      setup: frame,
      options: [
        { label: "Negative geotropism - unlike a typical root's positive geotropism", correct: true, say: "Correct. These special roots (pneumatophores) grow AWAY from gravity, pointing upward for respiration in waterlogged soil - the opposite of a typical root's positively geotropic, downward growth.", frame },
        { label: "Positive phototropism - unlike a typical root's negative phototropism", correct: false, say: "The book specifically describes this as an exception in GEOTROPISM (response to gravity), not phototropism. These roots show negative geotropism.", frame },
        { label: "Positive geotropism, exactly like a typical root", correct: false, say: "That's the opposite of what makes Rhizophora's roots unusual - they specifically show NEGATIVE geotropism, growing upward against gravity, unlike a typical positively geotropic root.", frame },
      ],
    };
  }
  if (definition.number === 19 && concept.id === "19.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "The Venus flytrap snaps shut almost instantly when an insect touches its trigger hairs - one of the fastest known plant movements. What type of nastic movement is this?",
      setup: frame,
      options: [
        { label: "Thigmonasty (seismonasty)", correct: true, say: "Correct. Thigmonasty (also called seismonasty) is a non-directional response to touch - the Venus flytrap is the book's own example of one of the fastest known such movements.", frame },
        { label: "Photonasty", correct: false, say: "Photonasty is a non-directional response to LIGHT (like flowers opening/closing), not touch. The Venus flytrap responding to touch is thigmonasty.", frame },
        { label: "Thermonasty", correct: false, say: "Thermonasty is a non-directional response to TEMPERATURE (like tulips blooming as it warms), not touch. The Venus flytrap responding to touch is thigmonasty.", frame },
      ],
    };
  }
  if (definition.number === 19 && concept.id === "19.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A plant response is slow, growth-dependent, found in essentially all plants, and permanent/irreversible once it happens. Is this a tropic or a nastic movement?",
      setup: frame,
      options: [
        { label: "A tropic movement", correct: true, say: "Correct. Tropic movements are slow, growth-dependent, found in all plants, and permanent/irreversible - unlike nastic movements, which are immediate, temporary and limited to a few specialized plants.", frame },
        { label: "A nastic movement", correct: false, say: "That description is the opposite of nastic movements, which are immediate, temporary/reversible, and found only in a few specialized plants. Slow, permanent, all-plants behavior describes a tropic movement.", frame },
        { label: "Neither - this describes something else entirely", correct: false, say: "This description matches exactly one of the two categories the book defines: tropic movements (slow, growth-dependent, permanent, found in all plants).", frame },
      ],
    };
  }
  if (definition.number === 19 && concept.id === "19.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What does the word 'photosynthesis' literally mean, based on its Greek roots?",
      setup: frame,
      options: [
        { label: "'Building up with the help of light'", correct: true, say: "Correct. 'Photo' means light and 'synthesis' means to build - together, 'building up with the help of light'.", frame },
        { label: "'Breaking down for energy'", correct: false, say: "That describes respiration, roughly the reverse process. Photosynthesis literally means 'building up with the help of light'.", frame },
        { label: "'Releasing water vapour'", correct: false, say: "That describes transpiration, an unrelated process. Photosynthesis literally means 'building up with the help of light'.", frame },
      ],
    };
  }
  if (definition.number === 19 && concept.id === "19.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "List the four things the classic leaf experiments show are necessary for photosynthesis.",
      setup: frame,
      options: [
        { label: "Chlorophyll, water, carbon dioxide, and sunlight", correct: true, say: "Correct. These are the four requirements demonstrated by the de-starching and iodine-testing experiments.", frame },
        { label: "Oxygen, nitrogen, glucose, and starch", correct: false, say: "Glucose and starch are PRODUCTS of photosynthesis, and oxygen/nitrogen aren't required inputs. The real requirements are chlorophyll, water, carbon dioxide, and sunlight.", frame },
        { label: "Soil, fertilizer, warmth, and darkness", correct: false, say: "Darkness specifically prevents photosynthesis, and soil/fertilizer aren't direct requirements for the reaction itself. The real requirements are chlorophyll, water, carbon dioxide, and sunlight.", frame },
      ],
    };
  }
  if (definition.number === 19 && concept.id === "19.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Name one reason, besides simply losing water, why transpiration is actually necessary for a plant.",
      setup: frame,
      options: [
        { label: "It creates an absorption force that pulls water up into the roots", correct: true, say: "Correct - this is one of the book's four listed reasons. Others include creating a pull in the leaf/stem, ensuring continuous mineral supply, and regulating the plant's temperature.", frame },
        { label: "It prevents the plant from ever needing sunlight", correct: false, say: "Transpiration has nothing to do with the plant's need for sunlight - photosynthesis still requires it. Transpiration is important for reasons like creating root absorption force and regulating temperature.", frame },
        { label: "It stops the plant from photosynthesising too much", correct: false, say: "Transpiration doesn't limit photosynthesis - it's actually necessary for water/mineral transport and temperature regulation, among other real reasons.", frame },
      ],
    };
  }
  if (definition.number === 19 && concept.id === "19.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Besides releasing water vapour, what else passes in and out of a leaf through its stomata?",
      setup: frame,
      options: [
        { label: "Gases - carbon dioxide and oxygen, for photosynthesis and respiration", correct: true, say: "Correct. Stomata continuously exchange gases too - carbon dioxide in and oxygen out for photosynthesis, and the reverse for respiration.", frame },
        { label: "Solid food particles", correct: false, say: "Plants don't take in solid food through stomata - they exchange gases (CO2 and O2) and lose water vapour through them.", frame },
        { label: "Only sunlight, not any actual substance", correct: false, say: "Sunlight isn't something that 'passes through' the stomata physically - stomata exchange actual gases (CO2, O2) and water vapour.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which type of meristem, found at the growing tips of roots and shoots, is responsible for increasing a plant's LENGTH?",
      setup: frame,
      options: [
        { label: "Apical meristem", correct: true, say: "Correct. Apical meristem sits at the growing points (apices) of root and shoot, and is responsible for increasing the plant's length.", frame },
        { label: "Lateral meristem", correct: false, say: "Lateral meristem increases THICKNESS, not length, and is arranged parallel to the plant's surface. Length comes from apical meristem.", frame },
        { label: "Intercalary meristem", correct: false, say: "Intercalary meristem sits between permanent tissue regions (like at the base of a grass leaf), not at the growing tips. Length increase happens at the apical meristem.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Sclerenchyma cells are dead at maturity and have thick, lignified walls. Name the two types of sclerenchyma cells.",
      setup: frame,
      options: [
        { label: "Fibres and sclereids", correct: true, say: "Correct. Sclerenchyma cells are grouped into fibres (elongated, pointed) and sclereids (broad, isodiametric) - both dead, lignified and rigid.", frame },
        { label: "Tracheids and vessels", correct: false, say: "Tracheids and vessels are XYLEM cell types, a different complex tissue, not sclerenchyma. Sclerenchyma consists of fibres and sclereids.", frame },
        { label: "Chlorenchyma and aerenchyma", correct: false, say: "Those are both types of PARENCHYMA, a different simple tissue. Sclerenchyma is made up of fibres and sclereids.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Xylem vessels are long, tube-like, dead cells with perforated transverse walls, making the whole structure resemble a water pipe. What is their main function?",
      setup: frame,
      options: [
        { label: "Transport of water, and providing mechanical strength", correct: true, say: "Correct. Xylem vessels are the main water-conducting elements, and their lignified walls also provide mechanical support.", frame },
        { label: "Storing starch and fatty substances", correct: false, say: "That's the role of xylem PARENCHYMA, the only living xylem cell type. Vessels themselves are dead and specialise in transporting water and providing strength.", frame },
        { label: "Translocating food from leaves to storage organs", correct: false, say: "That's the role of phloem's sieve tubes, not xylem vessels. Xylem vessels transport water and provide mechanical strength.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which phloem cells are living, containing cytoplasm and a nucleus, and function specifically to store food materials?",
      setup: frame,
      options: [
        { label: "Phloem parenchyma", correct: true, say: "Correct. Phloem parenchyma cells are living, with cytoplasm and a nucleus, and their function is to store food materials.", frame },
        { label: "Sieve tubes", correct: false, say: "Sieve tubes are the conducting elements that carry food from leaves to storage organs - they don't specialise in storage themselves. That's phloem parenchyma's role.", frame },
        { label: "Phloem fibres", correct: false, say: "Phloem fibres are sclerenchymatous cells that provide mechanical strength, not storage. Storage is the role of phloem parenchyma.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which type of simple epithelium is made of tall, pillar-like cells and lines the stomach and small intestine?",
      setup: frame,
      options: [
        { label: "Columnar epithelium", correct: true, say: "Correct. Columnar epithelium is made of tall, slender, pillar-like cells, lining the stomach, small intestine and other organs, mainly for secretion and absorption.", frame },
        { label: "Squamous epithelium", correct: false, say: "Squamous epithelium is made of thin, flat cells (like in the buccal cavity or lung alveoli), not tall pillar-like cells. The stomach/intestine lining is columnar epithelium.", frame },
        { label: "Cuboidal epithelium", correct: false, say: "Cuboidal epithelium is made of cube-shaped cells (found in glands and kidney tubules), not tall pillar-like cells. The stomach/intestine lining is columnar epithelium.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In compound epithelium, only cells in which specific layer rest directly on the basement membrane?",
      setup: frame,
      options: [
        { label: "The deepest (innermost) layer", correct: true, say: "Correct. In compound (stratified) epithelium, only the deepest layer of cells rests on the basement membrane - the other layers stack above it.", frame },
        { label: "Every layer equally", correct: false, say: "That would describe simple epithelium's one-layer structure. In COMPOUND epithelium, only the single deepest layer touches the basement membrane.", frame },
        { label: "The outermost (surface) layer", correct: false, say: "It's the opposite - the deepest layer touches the basement membrane, while outer layers stack above it, away from the membrane.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Bone cells sit in fluid-filled spaces and communicate with each other through a network of fine canals. What are these two structures called respectively?",
      setup: frame,
      options: [
        { label: "The spaces are lacunae (containing osteocytes); the canals are canaliculi", correct: true, say: "Correct. Osteocytes (bone cells) sit in fluid-filled lacunae, connected to each other by a network of fine canals called canaliculi.", frame },
        { label: "The spaces are chondrocytes; the canals are lacunae", correct: false, say: "Chondrocytes are cartilage cells, not spaces - and lacunae are the spaces, not canals. Bone cells (osteocytes) sit in lacunae, connected by canaliculi.", frame },
        { label: "The spaces are canaliculi; the canals are lacunae", correct: false, say: "That's swapped - lacunae are the fluid-filled spaces where osteocytes sit, and canaliculi are the connecting canals between them.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "White blood cells (leucocytes) are divided into two categories based on whether their cytoplasm has visible granules. Name the two categories.",
      setup: frame,
      options: [
        { label: "Granulocytes (e.g. neutrophils, basophils, eosinophils) and agranulocytes (e.g. lymphocytes, monocytes)", correct: true, say: "Correct. Granulocytes have irregular nuclei and cytoplasmic granules; agranulocytes lack those granules.", frame },
        { label: "Erythrocytes and thrombocytes", correct: false, say: "Erythrocytes (red blood cells) and thrombocytes (platelets) are different blood components entirely, not subtypes of white blood cells. WBCs split into granulocytes and agranulocytes.", frame },
        { label: "Plasma cells and serum cells", correct: false, say: "Those aren't the real WBC categories described in the book. White blood cells are divided into granulocytes and agranulocytes.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which type of muscle is spindle-shaped, has a single central nucleus, shows no striations, and is found in the walls of blood vessels and the intestine?",
      setup: frame,
      options: [
        { label: "Smooth (non-striated) muscle", correct: true, say: "Correct. Smooth muscle is spindle-shaped, uninucleate, unstriated, and involuntary - found in the walls of internal organs like blood vessels and the intestine.", frame },
        { label: "Skeletal (striated) muscle", correct: false, say: "Skeletal muscle is striped, multinucleate, and voluntary, attached to bones - not what's found in blood vessel or intestine walls. That's smooth muscle.", frame },
        { label: "Cardiac muscle", correct: false, say: "Cardiac muscle is branched with intercalated discs, found only in the heart - not in blood vessel or intestine walls. That's smooth muscle.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the single, long fibre-like process of a neuron called, which carries signals away from the cell body to its terminal branches?",
      setup: frame,
      options: [
        { label: "The axon", correct: true, say: "Correct. The axon is the single, long fibre-like process that carries signals from the cell body (cyton) out to the terminal branches.", frame },
        { label: "The dendron", correct: false, say: "Dendrons (dendrites) are the short, highly branched processes that RECEIVE signals toward the cell body - the opposite direction. Sending signals away is the axon's job.", frame },
        { label: "The cyton", correct: false, say: "The cyton is the neuron's cell body itself, containing the nucleus - not the signal-sending fibre. That's the axon.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.11") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "During which specific phase of mitosis do the separated chromatids (now called daughter chromosomes) actually migrate toward the two opposite poles of the cell?",
      setup: frame,
      options: [
        { label: "Anaphase", correct: true, say: "Correct. In anaphase, the centromeres divide and the two daughter chromatids of each chromosome separate and migrate to opposite poles.", frame },
        { label: "Metaphase", correct: false, say: "In metaphase, chromosomes ALIGN at the equator, but haven't yet separated and moved. The actual migration to opposite poles happens in anaphase.", frame },
        { label: "Prophase", correct: false, say: "In prophase, chromosomes become visible and the spindle forms - separation and migration haven't started yet. That happens in anaphase.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.12") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "During Prophase I of meiosis, homologous chromosomes pair up and may exchange genetic segments at points called chiasmata. What is this exchange process called, and what does it produce?",
      setup: frame,
      options: [
        { label: "Crossing over - it produces genetic recombination (variation)", correct: true, say: "Correct. Crossing over, happening at the chiasmata during Prophase I, exchanges genetic segments between homologous chromosomes, producing genetic recombination.", frame },
        { label: "Synapsis - it produces identical daughter cells", correct: false, say: "Synapsis is the PAIRING of homologous chromosomes (an earlier step), not the exchange of segments - and meiosis produces genetically DIFFERENT daughter cells, not identical ones. The exchange process is crossing over.", frame },
        { label: "Cytokinesis - it produces four identical cells", correct: false, say: "Cytokinesis is the division of the cytoplasm, unrelated to chromosome segment exchange - and meiosis's four cells are NOT identical to each other. The exchange process at chiasmata is crossing over.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.13") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Mitosis occurs continuously throughout life in body (somatic) cells. When does meiosis occur?",
      setup: frame,
      options: [
        { label: "Only in reproductive cells, during the reproductively active age", correct: true, say: "Correct. Unlike mitosis's continuous role in growth, meiosis is restricted to reproductive cells and only occurs during the reproductively active age, to form gametes.", frame },
        { label: "Continuously, in every cell of the body", correct: false, say: "That describes mitosis, not meiosis. Meiosis is restricted specifically to reproductive cells during the reproductively active age.", frame },
        { label: "Only immediately after birth", correct: false, say: "Meiosis isn't tied to a specific early life stage - it occurs in reproductive cells throughout the organism's reproductively active age.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "The Indian wolf (Canis pallipes) and the Indian jackal (Canis aureus) share the same first name in their scientific names. What taxonomic rank does this shared first name represent?",
      setup: frame,
      options: [
        { label: "Genus", correct: true, say: "Correct. The genus is the shared first name in a binomial scientific name - Canis pallipes and Canis aureus are different species within the same genus, Canis.", frame },
        { label: "Family", correct: false, say: "Family is a broader rank that groups several genera together. The shared FIRST name in a two-part scientific name specifically identifies the genus.", frame },
        { label: "Species", correct: false, say: "The species is the SECOND part of the name (pallipes vs aureus), which differs between them. It's the shared first part - the genus - that they have in common.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "An earthworm has a true, mesoderm-lined body cavity separating its gut from its body wall. What is this called?",
      setup: frame,
      options: [
        { label: "A coelomate (true coelom)", correct: true, say: "Correct. A true coelom - a body cavity lined within the mesoderm - is what makes an animal a coelomate, unlike acoelomates (no cavity) or pseudocoelomates (false cavity).", frame },
        { label: "An acoelomate", correct: false, say: "Acoelomate means having NO body cavity at all, like a tapeworm. An earthworm has a true, mesoderm-lined cavity, making it a coelomate.", frame },
        { label: "A pseudocoelomate", correct: false, say: "Pseudocoelomate means having a FALSE body cavity, like a roundworm. An earthworm's true, mesoderm-lined cavity makes it a coelomate instead.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the scientific (binomial) name for the domestic dog?",
      setup: frame,
      options: [
        { label: "Canis familiaris", correct: true, say: "Correct. Canis is the genus (capitalized), familiaris is the species (lowercase) - the book's own listed binomial name for the dog.", frame },
        { label: "Felis felis", correct: false, say: "That is the binomial name for the cat, not the dog. The dog's binomial name is Canis familiaris.", frame },
        { label: "Homo sapiens", correct: false, say: "That is the binomial name for humans. The dog's binomial name is Canis familiaris.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What structures form the skeletal framework inside a sponge's (Porifera's) body wall?",
      setup: frame,
      options: [
        { label: "Spicules", correct: true, say: "Correct. Spicules, found in the body wall, form the sponge's skeletal framework.", frame },
        { label: "Ossicles", correct: false, say: "Ossicles are the spiny calcareous structures found in echinoderms (like starfish), not sponges. A sponge's skeleton is made of spicules.", frame },
        { label: "Cnidoblasts", correct: false, say: "Cnidoblasts are the stinging cells found in coelenterates (like Hydra), not related to a sponge's skeleton. A sponge's skeleton is made of spicules.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the jelly-like, non-cellular substance that separates the ectoderm and endoderm layers in a coelenterate's (like Hydra's) body wall?",
      setup: frame,
      options: [
        { label: "Mesoglea", correct: true, say: "Correct. Mesoglea is the non-cellular, jelly-like layer between a coelenterate's ectoderm and endoderm.", frame },
        { label: "Mesoderm", correct: false, say: "Mesoderm is a true cellular germ layer, found in triploblastic animals - coelenterates are diploblastic and don't have one. The jelly-like layer between their two layers is mesoglea.", frame },
        { label: "Coelenteron", correct: false, say: "The coelenteron is the central gastrovascular cavity, not the layer between ectoderm and endoderm. That layer is the mesoglea.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Most flatworms, like tapeworms, have both male and female reproductive organs present in a single individual. What is this called?",
      setup: frame,
      options: [
        { label: "Hermaphroditism (they are hermaphrodites)", correct: true, say: "Correct. Most flatworms are hermaphrodites, having both male and female reproductive organs in one individual.", frame },
        { label: "Polymorphism", correct: false, say: "Polymorphism refers to variation in structure/function between individuals of the same species (seen in coelenterates), not one individual having both sexes. Having both sexes is hermaphroditism.", frame },
        { label: "Parthenogenesis", correct: false, say: "Parthenogenesis is reproduction from an unfertilized egg - a different concept entirely. Having both male and female organs in one individual is hermaphroditism.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the shape of a roundworm's (Aschelminthes) body, and is it segmented?",
      setup: frame,
      options: [
        { label: "Round, pointed at both ends, and unsegmented", correct: true, say: "Correct. Roundworms have a round body pointed at both ends, covered by a thin cuticle, and are unsegmented (unlike annelids).", frame },
        { label: "Flat and segmented, like a tapeworm", correct: false, say: "That describes segmented flatworm-like features, which roundworms don't have. Roundworms are round, pointed at both ends, and unsegmented.", frame },
        { label: "Spherical with jointed legs", correct: false, say: "Jointed legs belong to arthropods, a completely different phylum. Roundworms are simply round, pointed at both ends, and unsegmented.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What two structures help annelids like earthworms move (locomotion)?",
      setup: frame,
      options: [
        { label: "Setae and parapodia", correct: true, say: "Correct. Setae and parapodia are the locomotor structures used by annelids like earthworms and Nereis.", frame },
        { label: "Tube feet and a water vascular system", correct: false, say: "Those belong to echinoderms (like starfish), a different phylum entirely. Annelids use setae and parapodia for locomotion.", frame },
        { label: "Jointed legs and an exoskeleton", correct: false, say: "Those belong to arthropods. Annelids use setae and parapodia instead, since their bodies are soft and segmented, not jointed and armoured.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Arthropod blood (haemolymph) doesn't flow through blood vessels - it circulates freely through the body cavity instead. What is this type of circulatory system called?",
      setup: frame,
      options: [
        { label: "An open circulatory system", correct: true, say: "Correct. Arthropods have an open circulatory system, where haemolymph flows freely through the body rather than being confined to vessels.", frame },
        { label: "A closed circulatory system", correct: false, say: "A closed system confines blood to vessels - the opposite of what arthropods have. Arthropod blood flows freely, making it an OPEN circulatory system.", frame },
        { label: "A double circulatory system", correct: false, say: "That term describes blood passing through the heart twice per circuit (like in mammals), unrelated to arthropods. Arthropods have an open circulatory system.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Molluscs like the octopus respire (breathe) using which organs?",
      setup: frame,
      options: [
        { label: "Gills (ctenidia), or lungs, or both", correct: true, say: "Correct. Molluscs respire through gills (called ctenidia), lungs, or a combination of both, depending on the species.", frame },
        { label: "Tracheae only", correct: false, say: "Tracheae (air tubes) are how many arthropods, like insects, respire - not molluscs. Molluscs use gills and/or lungs.", frame },
        { label: "Malpighian tubules", correct: false, say: "Malpighian tubules are excretory organs in arthropods, not respiratory organs in molluscs. Molluscs respire via gills and/or lungs.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.11") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Adult starfish are radially symmetrical, but what about their larvae?",
      setup: frame,
      options: [
        { label: "The larvae are bilaterally symmetrical", correct: true, say: "Correct. Echinoderm larvae are bilaterally symmetrical, and only become radially symmetrical as they develop into adults.", frame },
        { label: "The larvae are also radially symmetrical", correct: false, say: "That's the defining exception the book highlights - echinoderm larvae are actually BILATERALLY symmetrical, unlike the radially symmetrical adults.", frame },
        { label: "Starfish larvae have no symmetry at all", correct: false, say: "They do have symmetry - specifically bilateral symmetry as larvae, which changes to radial symmetry in the adult form.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.12") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "How does Balanoglossus (Hemichordata) feed?",
      setup: frame,
      options: [
        { label: "As a ciliary feeder, mostly living in tube-dwelling (tubiculous) forms", correct: true, say: "Correct. Balanoglossus is a ciliary feeder, using cilia to gather food, and mostly lives as a tube-dwelling organism.", frame },
        { label: "By filtering water through pores (ostia)", correct: false, say: "That describes how sponges (Porifera) feed, a different phylum. Balanoglossus is a ciliary feeder.", frame },
        { label: "By using stinging tentacles to capture prey", correct: false, say: "That describes coelenterates (like Hydra) using cnidoblasts, a different phylum. Balanoglossus is a ciliary feeder instead.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.13") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What three features define Phylum Chordata?",
      setup: frame,
      options: [
        { label: "A notochord, a dorsal nerve cord, and paired gill pouches", correct: true, say: "Correct. These three features together define what makes an animal a chordate.", frame },
        { label: "A shell, a mantle, and a muscular foot", correct: false, say: "Those are mollusc features, a completely different phylum. Chordates are defined by a notochord, dorsal nerve cord, and paired gill pouches.", frame },
        { label: "Jointed legs, an exoskeleton, and a segmented body", correct: false, say: "Those are arthropod features. Chordates are instead defined by a notochord, dorsal nerve cord, and paired gill pouches.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.14") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Lampreys and hagfish are described as 'jawless vertebrates' with a circular mouth. What class do they belong to?",
      setup: frame,
      options: [
        { label: "Cyclostomata", correct: true, say: "Correct. Cyclostomes (Cyclostomata) are the jawless vertebrates, with a circular mouth, elongated eel-like body, and slimy scaleless skin.", frame },
        { label: "Pisces", correct: false, say: "Pisces (true fishes) have JAWS, unlike lampreys and hagfish. The jawless vertebrates are classified as Cyclostomata instead.", frame },
        { label: "Amphibia", correct: false, say: "Amphibians are four-legged, land-and-water vertebrates like frogs - not jawless, eel-like fish. Lampreys and hagfish belong to Cyclostomata.", frame },
      ],
    };
  }
  if (definition.number === 17 && concept.id === "17.15") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What unique structure, found in almost all mammals (except egg-laying ones like the platypus), nourishes the developing young before birth?",
      setup: frame,
      options: [
        { label: "The placenta", correct: true, say: "Correct. The placenta is the unique characteristic feature of (most) mammals, nourishing the developing young before birth - it's why most mammals are viviparous.", frame },
        { label: "The mantle", correct: false, say: "The mantle is a mollusc structure that secretes a shell - unrelated to mammal reproduction. The placenta is the mammalian structure that nourishes developing young.", frame },
        { label: "Pneumatic bones", correct: false, say: "Pneumatic (air-filled) bones are a bird adaptation for flight, unrelated to nourishing young before birth. That's the placenta, in mammals.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "The DNA double helix is about 2 nm across, and a hydrogen atom is about 0.2 nm across. Roughly how many hydrogen atoms could fit side by side across the width of the DNA double helix?",
      setup: frame,
      options: [
        { label: "About 10", correct: true, say: "Correct. 2 ÷ 0.2 = 10 hydrogen atoms could fit side by side across the DNA double helix's width.", frame },
        { label: "About 100", correct: false, say: "That's off by a factor of 10. 2 ÷ 0.2 = 10, not 100.", frame },
        { label: "About 2", correct: false, say: "That just used the DNA measurement alone without dividing by the hydrogen atom's size. 2 ÷ 0.2 = 10.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Morphine and quinine both come from plants, according to the book's table of drug sources. Insulin and heparin, by contrast, come from which source?",
      setup: frame,
      options: [
        { label: "Animals", correct: true, say: "Correct. Insulin and heparin are both listed as animal-sourced drugs, unlike morphine and quinine, which are plant-sourced.", frame },
        { label: "Microorganisms", correct: false, say: "Penicillin is the microorganism-sourced example. Insulin and heparin are specifically listed as animal-sourced.", frame },
        { label: "Genetic engineering", correct: false, say: "Human growth hormone is the genetic-engineering example. Insulin and heparin come from animal sources.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A patient takes a drug that both reduces their fever AND relieves their headache pain, at the same time. What TWO drug categories does this single drug belong to?",
      setup: frame,
      options: [
        { label: "Antipyretic (reduces fever) and analgesic (relieves pain) - like aspirin", correct: true, say: "Correct. The book specifically describes aspirin as acting as both an antipyretic and an analgesic at once - reducing fever while also relieving pain.", frame },
        { label: "General anaesthetic and local anaesthetic", correct: false, say: "Anaesthetics cause loss of sensation/consciousness, not fever reduction or pain relief without loss of consciousness. Reducing fever + relieving pain describes an antipyretic + analgesic, like aspirin.", frame },
        { label: "Antiseptic and antibiotic", correct: false, say: "Those prevent or fight infection-causing microorganisms - unrelated to reducing fever or pain relief. This describes an antipyretic + analgesic, like aspirin.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Quinine, a natural antimalarial drug, is obtained from which plant source?",
      setup: frame,
      options: [
        { label: "Cinchona bark", correct: true, say: "Correct. Quinine is a natural antimalarial obtained from the bark of the Cinchona tree.", frame },
        { label: "Penicillium notatum mold", correct: false, say: "That mold is the source of penicillin (an antibiotic), not quinine. Quinine comes from Cinchona bark.", frame },
        { label: "Willow tree bark", correct: false, say: "That's not the source described in the book. Quinine specifically comes from Cinchona bark.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A galvanic cell converts chemical energy into electrical energy. What does an electrolytic cell do, in the opposite direction?",
      setup: frame,
      options: [
        { label: "It converts electrical energy into chemical energy (via electrolysis)", correct: true, say: "Correct. An electrolytic cell uses electricity to drive a chemical reaction - the electrolyte dissociates into its ions, which is called electrolysis.", frame },
        { label: "It also converts chemical energy into electrical energy, just less efficiently", correct: false, say: "That describes a galvanic cell again. An electrolytic cell works in the opposite direction - it uses ELECTRICAL energy to produce a CHEMICAL change.", frame },
        { label: "It stores energy without converting it at all", correct: false, say: "An electrolytic cell actively converts electrical energy into chemical energy (electrolysis) - it doesn't just store energy unchanged.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which radioisotope is used specifically to determine the age of a fossil wood or dead animal?",
      setup: frame,
      options: [
        { label: "Carbon-14 (C-14), through radiocarbon dating", correct: true, say: "Correct. Radiocarbon dating uses the C-14 isotope to determine the age of once-living material like fossil wood or animal remains.", frame },
        { label: "Iodine-131", correct: false, say: "Iodine-131 is used for thyroid gland diagnosis and treatment, not dating fossils. Radiocarbon dating uses C-14 instead.", frame },
        { label: "Cobalt-60", correct: false, say: "Cobalt-60 is used to diagnose and treat cancer, not to date fossils. Radiocarbon dating specifically uses C-14.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Indigo dye is used only on cotton, not silk or wool, and the dyeing is a continuous process carried out in a large vessel. What type of dye is Indigo?",
      setup: frame,
      options: [
        { label: "A vat dye", correct: true, say: "Correct. Vat dyes, like indigo, are used only on cotton (not silk or wool), and are applied in a continuous process carried out in a large vessel called a vat - which is exactly where the name comes from.", frame },
        { label: "A direct dye", correct: false, say: "Direct dyes have high affinity for cotton and fix directly without needing a vat process. Indigo's continuous, large-vessel application is what specifically makes it a vat dye.", frame },
        { label: "A mordant dye", correct: false, say: "Mordant dyes need pretreatment with a mordant substance before they fix. Indigo's defining feature - a continuous vat process on cotton only - makes it a vat dye instead.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Before choosing which crop to plant or how to treat a field, a farmer tests the soil for what three things?",
      setup: frame,
      options: [
        { label: "pH, porosity, and texture", correct: true, say: "Correct. Soil testing specifically involves determining pH, porosity and texture - these guide crop selection and soil remediation decisions.", frame },
        { label: "Colour, temperature, and weight", correct: false, say: "Those aren't the criteria the book describes for soil testing. It specifically involves pH, porosity, and texture.", frame },
        { label: "Only pH - nothing else matters", correct: false, say: "pH is one factor, but soil testing also checks porosity and texture - all three together guide crop and treatment decisions.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A meal contains proteins (for body building), carbohydrates and fats (for energy), and vitamins and minerals (for protection from deficiency diseases), all in the right proportion. What is this kind of meal called?",
      setup: frame,
      options: [
        { label: "A balanced diet", correct: true, say: "Correct. A diet containing body-building, energy-giving and protective foods all in the right proportion is called a balanced diet.", frame },
        { label: "A food additive", correct: false, say: "Food additives are chemicals added for specific functions like preserving or flavouring - not a description of a well-proportioned meal, which is a balanced diet.", frame },
        { label: "A preservative mixture", correct: false, say: "Preservatives are just one type of food additive, protecting against spoilage - not what describes a well-proportioned meal, which is a balanced diet.", frame },
      ],
    };
  }
  if (definition.number === 16 && concept.id === "16.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In the breathalyzer alcohol test, the test solution changes colour from orange to green as it reacts with a driver's breath. What causes this colour change?",
      setup: frame,
      options: [
        { label: "Oxidation of the alcohol reduces the orange dichromate ion to the green chromic ion - a redox reaction", correct: true, say: "Correct. As the alcohol in the breath is oxidised, the dichromate ion is correspondingly reduced from orange to green - a classic redox reaction used to measure alcohol content.", frame },
        { label: "The colour change is simply due to temperature from breathing into the tube", correct: false, say: "Temperature isn't the cause - it's a genuine chemical redox reaction: oxidation of the alcohol reduces the dichromate ion, causing the orange-to-green colour change.", frame },
        { label: "It's caused by carbon dioxide in the breath reacting with water", correct: false, say: "The colour change is specifically caused by the redox reaction between alcohol and the dichromate solution, not CO2 and water.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In 1955, Francis Bundy and his team at General Electric demonstrated something that had been attempted before without success. What did they achieve?",
      setup: frame,
      options: [
        { label: "Transformed graphite into diamond, using high temperature and pressure", correct: true, say: "Correct. Bundy's team successfully created diamond from graphite under extreme heat and pressure in 1955 - the first successful demonstration of this transformation.", frame },
        { label: "Discovered that diamond and charcoal are the same element", correct: false, say: "That discovery belongs to Tennant, back in 1796. Bundy's 1955 achievement was actually transforming graphite into diamond using high temperature and pressure.", frame },
        { label: "Discovered fullerenes for the first time", correct: false, say: "Fullerenes were discovered later, in 1985, by Curl, Kroto and Smalley - a different team and discovery. Bundy's 1955 breakthrough was turning graphite into diamond.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Calcium carbonate (CaCO3) and carbon monoxide (CO) are obtained from non-living/mineral sources, not from living organisms. What classification of carbon compound is this?",
      setup: frame,
      options: [
        { label: "Inorganic", correct: true, say: "Correct. Carbon compounds obtained from non-living matter are classified as inorganic, unlike organic compounds which come from living organisms.", frame },
        { label: "Organic", correct: false, say: "Organic compounds specifically come from living organisms (plants and animals). CaCO3 and CO come from non-living/mineral sources, making them inorganic.", frame },
        { label: "Catenated", correct: false, say: "Catenation describes carbon bonding to itself in chains - a structural property, not a source classification. CaCO3 and CO, from non-living sources, are classified as inorganic.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What three shapes can a catenated carbon chain form?",
      setup: frame,
      options: [
        { label: "Linear (straight) chains, branched chains, or ring (closed) structures", correct: true, say: "Correct. Carbon's catenation lets it link into any of these three patterns - a straight line, a branching structure, or a closed ring.", frame },
        { label: "Only straight lines", correct: false, say: "Carbon's catenation isn't limited to straight chains - it can also form branched chains and closed rings.", frame },
        { label: "Only rings", correct: false, say: "Rings are just one of three possible shapes - carbon can also catenate into linear (straight) or branched chains.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Carbon's electronic configuration is 2,4. According to the octet rule, how many more electrons does it need for a stable configuration, and what is its resulting tendency to share exactly that many electrons called?",
      setup: frame,
      options: [
        { label: "It needs 4 more electrons; this is called tetravalency", correct: true, say: "Correct. Carbon has 4 valence electrons and needs 4 more to complete its octet, giving it the tendency to form 4 covalent bonds - its tetravalency.", frame },
        { label: "It needs 2 more electrons; this is called divalency", correct: false, say: "Carbon has 4 valence electrons (from 2,4), not 6, so it needs 4 more to complete an octet, not 2. This 4-bond tendency is called tetravalency.", frame },
        { label: "It needs 8 more electrons; this is called octavalency", correct: false, say: "The octet target is 8 electrons TOTAL in the valence shell, not 8 MORE. Carbon already has 4, so it needs 4 more - its tetravalency.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What are compounds called that share the same molecular formula but have different structural arrangements of their atoms?",
      setup: frame,
      options: [
        { label: "Isomers", correct: true, say: "Correct. Isomers share an identical molecular formula but differ in how their atoms are arranged, giving them different properties.", frame },
        { label: "Isotopes", correct: false, say: "Isotopes are atoms of the same ELEMENT with different numbers of neutrons - a completely different concept. Compounds sharing a formula but differing in structure are isomers.", frame },
        { label: "Allotropes", correct: false, say: "Allotropes are different physical forms of the same single ELEMENT (like diamond and graphite), not different compounds sharing a molecular formula. Those are isomers.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Buckminsterfullerene, the best-known fullerene, has the formula C60 and is shaped like a soccer ball. Why was it named after Buckminster Fuller?",
      setup: frame,
      options: [
        { label: "Its spherical, dome-like structure resembled the geodesic dome designs the architect created for large exhibitions", correct: true, say: "Correct. The molecule's structure reminded scientists of Buckminster Fuller's dome-shaped exhibition hall designs, so it was named after him - and nicknamed the 'Bucky Ball'.", frame },
        { label: "Buckminster Fuller was the scientist who discovered it", correct: false, say: "Fullerene was actually discovered by Curl, Kroto and Smalley in 1985 - Buckminster Fuller was an architect, not the discoverer. It was named after him because of a structural resemblance to his dome designs.", frame },
        { label: "It was first found inside a building Fuller designed", correct: false, say: "The naming has nothing to do with where it was found - it's because the molecule's spherical structure resembled the geodesic domes Fuller designed for exhibitions.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "At elevated temperatures, carbon reacts with metals like tungsten to form compounds. What is this class of compound called?",
      setup: frame,
      options: [
        { label: "Carbides", correct: true, say: "Correct. Carbon reacting with a metal at high temperature forms a carbide - tungsten and carbon specifically form tungsten carbide (WC).", frame },
        { label: "Carbonates", correct: false, say: "Carbonates are a different class of compound (like CaCO3), not formed by carbon reacting directly with metals at high temperature. That reaction produces carbides.", frame },
        { label: "Water gas", correct: false, say: "Water gas is the CO + H2 mixture formed when carbon reacts with STEAM, a different reaction entirely. Carbon reacting with metals at high temperature forms carbides.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Why does burning plastic waste cause additional harm, beyond ordinary environmental littering?",
      setup: frame,
      options: [
        { label: "Burning releases toxic gases that harm human health and contribute to climate change", correct: true, say: "Correct. Burning plastics doesn't just remove the litter - it actively releases toxic gases that are harmful to breathe and contribute to climate change.", frame },
        { label: "Burning plastic makes it biodegrade faster afterward", correct: false, say: "Burning doesn't help plastic biodegrade - it instead releases genuinely toxic gases into the air, harming health and contributing to climate change.", frame },
        { label: "It has no additional effect beyond ordinary littering", correct: false, say: "Burning specifically adds a real, distinct harm on top of littering - the release of toxic gases that damage health and the climate.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "PS (Polystyrene, resin code #6, commonly called Thermocol) contains styrene, which may cause cancer and leaks more readily into food when it's hot or oily. Why is it particularly risky to serve hot food in Thermocol containers?",
      setup: frame,
      options: [
        { label: "Higher amounts of the toxic styrene leak into food and drinks specifically when they are hot or oily", correct: true, say: "Correct. Heat and oil both increase how much styrene leaches out of Thermocol into the food itself, increasing exposure to a chemical that may cause cancer.", frame },
        { label: "Hot food makes Thermocol biodegrade faster, which is actually safer", correct: false, say: "Thermocol doesn't biodegrade meaningfully faster from heat, and this isn't the concern - the real risk is that heat and oil cause MORE toxic styrene to leak into the food itself.", frame },
        { label: "It has no extra risk - Thermocol is equally safe for hot or cold food", correct: false, say: "There is a real extra risk - heat and oil specifically increase how much toxic styrene leaks out of Thermocol into food.", frame },
      ],
    };
  }
  if (definition.number === 15 && concept.id === "15.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "The book states that globally, 2 million plastic bags are used every single minute, and 97% of them are never recycled. What does this fact best illustrate?",
      setup: frame,
      options: [
        { label: "The massive, largely unrecycled scale of plastic bag use, which is why bags were specifically targeted for banning", correct: true, say: "Correct. This statistic shows both the enormous scale of plastic bag consumption and how little of it gets recycled - exactly why plastic carry bags were singled out as a major, preventable source of pollution to ban.", frame },
        { label: "That plastic bags are actually mostly recycled successfully worldwide", correct: false, say: "It's the opposite - the 97% figure specifically shows that almost none of these bags get recycled, which is the real problem the statistic highlights.", frame },
        { label: "That plastic bag production has recently stopped growing", correct: false, say: "The 2-million-per-minute figure shows an enormous, ongoing scale of production and use, not a sign that it has slowed or stopped.", frame },
      ],
    };
  }
  if (definition.number === 14 && concept.id === "14.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Phosphoric acid (H3PO4) gives 3 hydrogen ions per molecule in solution. What is this classification called?",
      setup: frame,
      options: [
        { label: "A tribasic acid", correct: true, say: "Correct. Basicity is the number of replaceable hydrogen atoms per molecule - H3PO4 gives 3, making it tribasic.", frame },
        { label: "A monobasic acid", correct: false, say: "Monobasic means only 1 replaceable hydrogen, like HCl. H3PO4 gives 3, making it tribasic instead.", frame },
        { label: "A dibasic acid", correct: false, say: "Dibasic means 2 replaceable hydrogens, like H2SO4. H3PO4 gives 3, making it tribasic instead.", frame },
      ],
    };
  }
  if (definition.number === 14 && concept.id === "14.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Sodium bicarbonate reacts with hydrochloric acid: NaHCO3 + HCl → NaCl + H2O + CO2. What gas is released, and what would you observe?",
      setup: frame,
      options: [
        { label: "Carbon dioxide gas, with brisk effervescence (bubbling)", correct: true, say: "Correct. Acids reacting with a metal carbonate or bicarbonate always release CO2 gas, visible as brisk bubbling/effervescence.", frame },
        { label: "Hydrogen gas, with a popping sound", correct: false, say: "That's the gas released when an acid reacts with an ACTIVE METAL, not a carbonate. A carbonate/bicarbonate reacting with acid releases CO2 instead.", frame },
        { label: "Oxygen gas, with a glowing splint test", correct: false, say: "Oxygen isn't produced by this reaction at all. Acids reacting with carbonates or bicarbonates release CO2 gas.", frame },
      ],
    };
  }
  if (definition.number === 14 && concept.id === "14.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Aquaregia is a mixture of hydrochloric acid and nitric acid in what molar ratio, and what is it able to dissolve that neither acid can alone?",
      setup: frame,
      options: [
        { label: "3:1 (HCl:HNO3), and it can dissolve gold and platinum", correct: true, say: "Correct. The 3:1 mixture of HCl and HNO3 is uniquely able to dissolve noble metals like gold and platinum, which resist each acid on its own.", frame },
        { label: "1:1, and it can dissolve iron and zinc", correct: false, say: "Iron and zinc already dissolve in ordinary acids alone - aquaregia's special ability is dissolving noble metals like gold. And the real ratio is 3:1, not 1:1.", frame },
        { label: "3:1, and it can dissolve only silver", correct: false, say: "The ratio is right, but aquaregia's defining ability is dissolving gold (and platinum) specifically - not silver, which actually resists it.", frame },
      ],
    };
  }
  if (definition.number === 14 && concept.id === "14.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Aluminium hydroxide, Al(OH)3, ionises to release 3 hydroxide ions per molecule. What is this classification called?",
      setup: frame,
      options: [
        { label: "A triacidic base", correct: true, say: "Correct. Acidity (for a base) is the number of replaceable hydroxide ions per molecule - Al(OH)3 releases 3, making it triacidic.", frame },
        { label: "A monoacidic base", correct: false, say: "Monoacidic means only 1 replaceable hydroxide, like NaOH. Al(OH)3 releases 3, making it triacidic instead.", frame },
        { label: "A diacidic base", correct: false, say: "Diacidic means 2 replaceable hydroxides, like Ca(OH)2. Al(OH)3 releases 3, making it triacidic instead.", frame },
      ],
    };
  }
  if (definition.number === 14 && concept.id === "14.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Magnesium hydroxide is commonly used as a medicine. What condition is it used to treat, and why does it work?",
      setup: frame,
      options: [
        { label: "Stomach acidity/indigestion - being a base, it neutralises excess stomach acid", correct: true, say: "Correct. Magnesium hydroxide is a base, so it reacts with and neutralises the excess hydrochloric acid in the stomach, relieving acidity/indigestion.", frame },
        { label: "Skin burns - it cools the skin on contact", correct: false, say: "Magnesium hydroxide's real medical use is treating stomach acidity, by neutralising excess stomach acid as a base - not treating skin burns.", frame },
        { label: "Vitamin deficiency - it supplies essential nutrients", correct: false, say: "It isn't a nutrient supplement - its real use is as an antacid, neutralising excess stomach acid because it's a base.", frame },
      ],
    };
  }
  if (definition.number === 14 && concept.id === "14.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A solution turns methyl orange indicator from yellow to pink. Is the solution acidic or basic?",
      setup: frame,
      options: [
        { label: "Acidic", correct: true, say: "Correct. Methyl orange is pink in acid and yellow in base - turning pink means the solution is acidic.", frame },
        { label: "Basic", correct: false, say: "That's backwards for methyl orange - it turns YELLOW in a basic solution and PINK in an acidic one. Turning pink means the solution is acidic.", frame },
        { label: "Neutral - methyl orange doesn't change colour for neutral solutions", correct: false, say: "Methyl orange does respond specifically: pink means acidic, yellow means basic. A colour change to pink means the solution is acidic, not neutral.", frame },
      ],
    };
  }
  if (definition.number === 14 && concept.id === "14.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A solution has a pH of 11. Is it acidic, neutral, or basic?",
      setup: frame,
      options: [
        { label: "Basic", correct: true, say: "Correct. Any pH above 7 indicates a basic solution, and 11 is well above 7.", frame },
        { label: "Acidic", correct: false, say: "Acidic solutions have pH BELOW 7. A pH of 11 is well above 7, making the solution basic instead.", frame },
        { label: "Neutral", correct: false, say: "Neutral is exactly pH 7 - a pH of 11 is significantly higher than that, making the solution basic.", frame },
      ],
    };
  }
  if (definition.number === 14 && concept.id === "14.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Potash alum, KAl(SO4)2·12H2O, is formed by combining two simple salts (potassium sulphate and aluminium sulphate) in equimolar ratio and then crystallising them together. What type of salt is this?",
      setup: frame,
      options: [
        { label: "A double salt", correct: true, say: "Correct. A double salt forms from the saturated solutions of two simple salts, combined in equimolar ratio and crystallised together - exactly how potash alum is made.", frame },
        { label: "A normal salt", correct: false, say: "A normal salt comes from complete neutralisation of a single acid and base, like NaCl. Combining two separate salts together, like potash alum, makes a double salt instead.", frame },
        { label: "An acid salt", correct: false, say: "An acid salt still has a replaceable hydrogen from partial acid neutralisation, like NaHSO4. Potash alum is formed by combining two whole salts together - a double salt.", frame },
      ],
    };
  }
  if (definition.number === 14 && concept.id === "14.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In a flame test, an unknown salt burns with a golden yellow flame. Which metal ion is most likely present?",
      setup: frame,
      options: [
        { label: "Sodium (Na+)", correct: true, say: "Correct. Sodium ions give a distinctive golden yellow flame in the flame test.", frame },
        { label: "Calcium (Ca2+)", correct: false, say: "Calcium gives a brick red flame, not golden yellow. A golden yellow flame indicates sodium.", frame },
        { label: "Potassium (K+)", correct: false, say: "Potassium gives a pink-violet (lilac) flame, not golden yellow. A golden yellow flame indicates sodium.", frame },
      ],
    };
  }
  if (definition.number === 13 && concept.id === "13.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Magnesium has electronic configuration 2,8,2 (2 valence electrons) and oxygen has 2,6 (6 valence electrons). According to the octet rule, which one will lose electrons and which will gain them?",
      setup: frame,
      options: [
        { label: "Magnesium loses electrons; oxygen gains electrons", correct: true, say: "Correct. Magnesium has only 2 valence electrons (in the 1-3 range, so it tends to lose), while oxygen has 6 (in the 5-7 range, so it tends to gain) - both reach a stable octet this way.", frame },
        { label: "Magnesium gains electrons; oxygen loses electrons", correct: false, say: "That's backwards. Atoms with 1-3 valence electrons (like magnesium's 2) tend to LOSE them; atoms with 5-7 (like oxygen's 6) tend to GAIN them.", frame },
        { label: "Both lose electrons", correct: false, say: "They can't both lose - one must gain what the other loses. Magnesium (2 valence electrons) loses; oxygen (6 valence electrons) gains.", frame },
      ],
    };
  }
  if (definition.number === 13 && concept.id === "13.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "How many dots would you draw around the symbol for oxygen (electronic configuration 2,6) in its Lewis dot structure?",
      setup: frame,
      options: [
        { label: "6 dots", correct: true, say: "Correct. Oxygen has 6 valence electrons, so its Lewis dot structure gets 6 dots - one on each of the four sides first, then two more sides get a second dot each.", frame },
        { label: "2 dots", correct: false, say: "That used the inner-shell electron count (2), not the valence shell. Oxygen's VALENCE electrons (the outer 6, from 2,6) are what get shown as dots: 6 total.", frame },
        { label: "8 dots", correct: false, say: "8 would be a completely full octet - oxygen still needs 2 more electrons to reach that. Its own valence electron count is 6, so it gets 6 dots.", frame },
      ],
    };
  }
  if (definition.number === 13 && concept.id === "13.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Aluminium (electronic configuration 2,8,3) forms an ionic compound with chlorine. How many electrons would one aluminium atom need to lose to reach a stable noble-gas configuration, and what charge would the resulting ion carry?",
      setup: frame,
      options: [
        { label: "It loses 3 electrons, forming Al3+", correct: true, say: "Correct. Aluminium has 3 valence electrons in excess of neon's stable configuration, so it loses all 3, forming an ion with a 3+ charge.", frame },
        { label: "It gains 5 electrons, forming Al5-", correct: false, say: "With only 3 valence electrons, it's far easier for aluminium to lose those 3 than to gain 5 more. It loses 3, forming Al3+.", frame },
        { label: "It loses 8 electrons, forming Al8+", correct: false, say: "That would strip electrons from an inner shell too, which doesn't happen in ordinary ionic bonding. Aluminium only loses its 3 VALENCE electrons, forming Al3+.", frame },
      ],
    };
  }
  if (definition.number === 13 && concept.id === "13.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Two nitrogen atoms combine to form N2, sharing THREE pairs of electrons between them. What type of covalent bond is this, and how is it written in line notation?",
      setup: frame,
      options: [
        { label: "A triple covalent bond, written as N≡N", correct: true, say: "Correct. Three shared electron pairs make a triple bond, shown with three lines between the atoms: N≡N.", frame },
        { label: "A single covalent bond, written as N-N", correct: false, say: "A single bond shares only 1 pair of electrons. Sharing three pairs makes this a triple bond: N≡N.", frame },
        { label: "A double covalent bond, written as N=N", correct: false, say: "A double bond shares 2 pairs, like O=O. Sharing three pairs, as nitrogen does, makes a triple bond: N≡N.", frame },
      ],
    };
  }
  if (definition.number === 13 && concept.id === "13.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Sodium chloride has a low-charge cation (+1), a fairly large cation, and a small anion. According to Fajan's rule, is NaCl more ionic or more covalent in character?",
      setup: frame,
      options: [
        { label: "More ionic", correct: true, say: "Correct. A low cation charge and a small anion both favour complete charge separation - exactly the conditions Fajan's rule says lead to more ionic character.", frame },
        { label: "More covalent", correct: false, say: "Fajan's rule says a SMALL cation with a LARGE anion and HIGH charge favours covalent character - NaCl has a low charge and a small anion, so it leans strongly ionic instead.", frame },
        { label: "Fajan's rule doesn't apply to sodium chloride at all", correct: false, say: "Fajan's rule applies to any ionic-looking compound to judge its real character - NaCl's low charge and small anion place it firmly on the ionic end of the scale.", frame },
      ],
    };
  }
  if (definition.number === 13 && concept.id === "13.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In a coordinate covalent bond, does the acceptor atom contribute any electrons to the shared pair - unlike in a normal covalent bond, where both atoms contribute one each?",
      setup: frame,
      options: [
        { label: "No - the acceptor contributes zero electrons; the donor supplies the entire shared pair", correct: true, say: "Correct. That's the defining feature of a coordinate bond: only the donor atom supplies electrons (both of them), while the acceptor contributes none - unlike a normal covalent bond's one-each split.", frame },
        { label: "Yes - each atom still contributes one electron, exactly like a normal covalent bond", correct: false, say: "That describes a NORMAL covalent bond. In a coordinate bond specifically, the donor supplies BOTH electrons and the acceptor supplies none - that's what makes it different.", frame },
        { label: "Yes - the acceptor actually contributes both electrons", correct: false, say: "That's backwards - it's the DONOR that supplies both electrons in a coordinate bond, while the acceptor (which is short of electrons) contributes none.", frame },
      ],
    };
  }
  if (definition.number === 13 && concept.id === "13.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In the reaction CuO + H2 → Cu + H2O, copper oxide loses its oxygen. Is copper oxide being oxidised or reduced?",
      setup: frame,
      options: [
        { label: "Reduced", correct: true, say: "Correct. Removal of oxygen is one of the definitions of reduction - copper oxide loses oxygen and is reduced to copper metal.", frame },
        { label: "Oxidised", correct: false, say: "Oxidation is ADDING oxygen (or removing hydrogen, or losing electrons) - copper oxide is LOSING oxygen here, which is reduction, not oxidation.", frame },
        { label: "Neither - no oxidation or reduction is happening", correct: false, say: "Oxygen is clearly being removed from copper oxide here, which is exactly the definition of reduction.", frame },
      ],
    };
  }
  if (definition.number === 13 && concept.id === "13.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Find the oxidation number of chromium (Cr) in Na2Cr2O7, given Na is +1 and O is -2.",
      setup: frame,
      options: [
        { label: "+6", correct: true, say: "Correct. 2×(+1) + 2x + 7×(-2) = 0 → +2 + 2x − 14 = 0 → 2x = 12 → x = +6.", frame },
        { label: "+12", correct: false, say: "That forgot to divide by 2 for the two chromium atoms. Correctly: 2×(+1) + 2x + 7×(-2) = 0 gives 2x = 12, so x = +6.", frame },
        { label: "+3", correct: false, say: "That used the wrong total charge balance. Correctly: 2×(+1) + 2x + 7×(-2) = 0 → 2x = 12 → x = +6.", frame },
      ],
    };
  }
  if (definition.number === 12 && concept.id === "12.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In the calcium-strontium-barium triad, calcium's atomic mass is 40.1 and barium's is 137.3. Using Dobereiner's law, about what atomic mass would you predict for the middle element, strontium?",
      setup: frame,
      options: [
        { label: "About 88.7", correct: true, say: "Correct. (40.1 + 137.3) / 2 = 88.7 - very close to strontium's real atomic mass of 87.6, exactly the kind of pattern Dobereiner's triads predicted.", frame },
        { label: "About 177.4", correct: false, say: "That is the sum, not the average. Dobereiner's law uses the average: (40.1 + 137.3) / 2 = 88.7.", frame },
        { label: "About 48.6", correct: false, say: "That divided by 2 incorrectly or used the wrong numbers. Correctly: (40.1 + 137.3) / 2 = 88.7.", frame },
      ],
    };
  }
  if (definition.number === 12 && concept.id === "12.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "One major limitation of Newlands' law of octaves was that after the later discovery of noble gases like neon, the pattern broke - a 9th element (not the 8th) turned out to be similar to the first. What does this show about the law?",
      setup: frame,
      options: [
        { label: "It only worked for the elements known at the time, and couldn't accommodate later discoveries", correct: true, say: "Correct. The law of octaves was built entirely around the 56 elements known in 1866. Once noble gases were discovered and had to be fitted in, the 'every eighth element' pattern broke down completely.", frame },
        { label: "It proved the law of octaves was completely correct and permanent", correct: false, say: "The opposite - the discovery of noble gases actually broke the octave pattern, since an inserted 9th element (not the 8th) ended up similar to the first, exposing a real limitation of the law.", frame },
        { label: "It had nothing to do with the law of octaves at all", correct: false, say: "It directly undermined the law's core claim - that every EIGHTH element resembles the first. Once a 9th element became the similar one instead, that pattern no longer held.", frame },
      ],
    };
  }
  if (definition.number === 12 && concept.id === "12.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Mendeleev's original atomic mass measurement for beryllium was 14, but this placed it in the wrong group. He reassessed it as 9, giving it a proper place in his table - and this correction later proved accurate. What does this reveal about how Mendeleev used his periodic table?",
      setup: frame,
      options: [
        { label: "He trusted the periodic pattern strongly enough to question and correct a wrongly measured atomic mass rather than break the pattern", correct: true, say: "Correct. Mendeleev's confidence in the underlying periodic pattern was strong enough that when an element's measured mass didn't fit, he suspected the measurement (not the pattern) was wrong - and history proved him right.", frame },
        { label: "He randomly guessed at atomic masses with no real justification", correct: false, say: "It wasn't a random guess - he specifically reassessed beryllium's mass because 14 didn't fit its proper place in the pattern, and his correction to 9 was later confirmed accurate.", frame },
        { label: "He ignored beryllium entirely and left it out of the table", correct: false, say: "He didn't leave it out - he actively corrected its atomic mass value so it would fit properly into the table's pattern, and that correction turned out to be right.", frame },
      ],
    };
  }
  if (definition.number === 12 && concept.id === "12.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which scientist's X-ray diffraction experiments proved that element properties depend on atomic number rather than atomic mass, leading to the modern periodic law?",
      setup: frame,
      options: [
        { label: "Henry Moseley", correct: true, say: "Correct. Moseley's 1913 X-ray diffraction experiments proved atomic number - not atomic mass - was the fundamental property behind element periodicity, which is exactly what the modern periodic table is based on.", frame },
        { label: "Dmitri Mendeleev", correct: false, say: "Mendeleev's table was based on atomic MASS, which is precisely what got superseded. It was Moseley who proved atomic number was the correct underlying property.", frame },
        { label: "John Newlands", correct: false, say: "Newlands proposed the law of octaves, also based on atomic mass, decades before Moseley's atomic-number discovery. Moseley is the one who established the modern periodic law.", frame },
      ],
    };
  }
  if (definition.number === 12 && concept.id === "12.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which block of the periodic table contains ALL THREE types of elements - metals, non-metals, AND metalloids - making it the most varied block?",
      setup: frame,
      options: [
        { label: "The p-block", correct: true, say: "Correct. The p-block (groups 13-18) is uniquely home to metals, non-metals and metalloids all together, unlike the s-block (all metals) or d-block (all transition metals).", frame },
        { label: "The s-block", correct: false, say: "The s-block (groups 1-2) contains only metals - alkali metals and alkaline earth metals. The p-block is the one with all three types.", frame },
        { label: "The d-block", correct: false, say: "The d-block (groups 3-12) contains only transition metals. The p-block is the block with metals, non-metals AND metalloids all together.", frame },
      ],
    };
  }
  if (definition.number === 12 && concept.id === "12.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Noble gases like helium, neon and argon almost never react with other substances. Why?",
      setup: frame,
      options: [
        { label: "Their valence shells are already completely filled, giving them a stable electronic configuration", correct: true, say: "Correct. A completely filled valence shell means no tendency to gain or lose electrons at all - which is exactly why noble gases are so chemically inert (and why their valency is zero).", frame },
        { label: "They have too many protons to react with anything", correct: false, say: "Number of protons (atomic number) isn't what makes them unreactive - it's their completely filled, stable valence shell electronic configuration that gives them no tendency to gain or lose electrons.", frame },
        { label: "They simply haven't been tested with enough other elements yet", correct: false, say: "Their inertness is a real, well-established chemical property caused by their completely filled valence shells - not a gap in testing.", frame },
      ],
    };
  }
  if (definition.number === 12 && concept.id === "12.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Boron shows some properties typical of metals and some typical of non-metals, not clearly fitting either category. What is this type of element called?",
      setup: frame,
      options: [
        { label: "A metalloid", correct: true, say: "Correct. Metalloids (like boron and arsenic) are specifically defined as elements showing properties of BOTH metals and non-metals.", frame },
        { label: "A transition metal", correct: false, say: "Transition metals are a specific set of true metals found in groups 3-12 (the d-block) - a different concept entirely from an element straddling metal/non-metal properties, which is a metalloid.", frame },
        { label: "A noble gas", correct: false, say: "Noble gases are the chemically inert group 18 elements - unrelated to having mixed metal/non-metal properties. An element with both metal and non-metal properties is a metalloid.", frame },
      ],
    };
  }
  if (definition.number === 12 && concept.id === "12.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Pure gold is relatively soft, but gold mixed (alloyed) with copper becomes noticeably harder. What does this demonstrate about alloys?",
      setup: frame,
      options: [
        { label: "Alloying can give a metal more useful properties (here, greater hardness) than the pure metal alone", correct: true, say: "Correct. This is a real, book-documented example - gold alloyed with copper is harder than pure gold, showing exactly how alloying can improve on a pure metal's properties.", frame },
        { label: "Alloying always makes a metal weaker and softer", correct: false, say: "It's the opposite here - gold alloyed with copper becomes HARDER, not weaker. Alloys often gain more useful properties than the pure metals they're made from.", frame },
        { label: "Alloying has no effect on a metal's physical properties", correct: false, say: "Alloying clearly does change physical properties - gold mixed with copper becomes measurably harder than pure gold, which is exactly the point of many real alloys.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In Rutherford's gold foil experiment, the vast majority of alpha particles passed straight through the foil with no deflection at all. What did this specific observation prove about the atom?",
      setup: frame,
      options: [
        { label: "That an atom is mostly empty space", correct: true, say: "Correct. If most fast-moving alpha particles could pass straight through with nothing in their way, the atom must be almost entirely empty space, with only a tiny solid region somewhere inside it.", frame },
        { label: "That the atom has no nucleus at all", correct: false, say: "The experiment actually proved the OPPOSITE for a small number of particles - a few bounced almost straight back, proving a tiny, dense nucleus DOES exist. The straight-through majority instead proved the atom is mostly empty space.", frame },
        { label: "That electrons are heavier than protons", correct: false, say: "This experiment wasn't about comparing particle masses at all - it was about mapping the atom's internal structure. Most particles passing straight through showed the atom is mostly empty space.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What was the key problem with Rutherford's model that Bohr's model specifically fixed?",
      setup: frame,
      options: [
        { label: "Rutherford's model implied electrons should continuously lose energy and spiral into the nucleus, making atoms unstable; Bohr said electrons in a fixed orbit neither gain nor lose energy", correct: true, say: "Correct. Electromagnetic theory said a moving, accelerating electron should radiate away energy and spiral inward, collapsing the atom - but atoms are stable. Bohr fixed this by saying electrons in a fixed orbit simply don't lose energy at all.", frame },
        { label: "Rutherford's model didn't include a nucleus at all", correct: false, say: "Rutherford's model DID include the nucleus - discovering it was Rutherford's key contribution. The problem Bohr fixed was different: explaining why orbiting electrons don't lose energy and spiral inward.", frame },
        { label: "Rutherford's model said atoms have no electrons", correct: false, say: "Rutherford's model did include orbiting electrons. The specific flaw Bohr fixed was that Rutherford's model couldn't explain why those electrons don't lose energy and spiral into the nucleus.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Neutrons and protons have almost exactly the same mass. What is the key difference between them?",
      setup: frame,
      options: [
        { label: "A proton carries a positive electric charge; a neutron carries no charge at all", correct: true, say: "Correct. Their masses are nearly identical, but a proton has charge +1 while a neutron is completely electrically neutral - which is exactly how Chadwick identified it (it wasn't deflected by any magnetic or electric field).", frame },
        { label: "A neutron is found outside the nucleus; a proton is found inside it", correct: false, say: "Both neutrons and protons are found together inside the nucleus - electrons are the ones found outside it. The real difference between protons and neutrons is electric charge.", frame },
        { label: "A neutron has almost no mass at all; a proton has significant mass", correct: false, say: "Neutrons and protons have almost exactly the same mass as each other - it's the electron that has negligible mass by comparison. The key proton/neutron difference is electric charge.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the collective name for protons and neutrons together, since both are found in the nucleus?",
      setup: frame,
      options: [
        { label: "Nucleons", correct: true, say: "Correct. Protons and neutrons together are called nucleons, since both reside in the atom's nucleus.", frame },
        { label: "Isotopes", correct: false, say: "Isotopes are atoms of the same element with different numbers of neutrons - a completely different concept. Protons and neutrons together are called nucleons.", frame },
        { label: "Valence particles", correct: false, say: "That is not a real term used for nucleus particles - electrons in the outer (valence) shell are called valence electrons. Protons and neutrons together are called nucleons.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "An element has a mass number of 27 and 14 neutrons in its nucleus. Find its atomic number.",
      setup: frame,
      options: [
        { label: "13", correct: true, say: "Correct. Atomic number = Mass number − Number of neutrons = 27 − 14 = 13 (this is aluminium).", frame },
        { label: "41", correct: false, say: "That added instead of subtracting. Atomic number = Mass number − Number of neutrons = 27 − 14 = 13.", frame },
        { label: "27", correct: false, say: "That just used the mass number directly, ignoring the neutrons entirely. Atomic number = 27 − 14 = 13.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What is the electronic configuration of sulphur (atomic number 16)?",
      setup: frame,
      options: [
        { label: "2, 8, 6", correct: true, say: "Correct. K shell fills to its maximum of 2, L shell fills to its maximum of 8, leaving the remaining 16 − 2 − 8 = 6 electrons for the M shell.", frame },
        { label: "2, 8, 8", correct: false, say: "That would need 18 total electrons, but sulphur only has 16. Correctly: K=2, L=8, and the remaining 6 go into the M shell: 2, 8, 6.", frame },
        { label: "8, 8", correct: false, say: "The innermost K shell must fill first and can only hold 2 electrons, not 8. Correctly: 2, 8, 6.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Chlorine's electronic configuration is 2, 8, 7 - seven valence electrons. What is its valency?",
      setup: frame,
      options: [
        { label: "1", correct: true, say: "Correct. Since chlorine has more than 4 valence electrons, valency = 8 − 7 = 1.", frame },
        { label: "7", correct: false, say: "That used the valence electron count directly, but the 8-minus rule only applies when there are 1-4 valence electrons. With 7, valency = 8 − 7 = 1.", frame },
        { label: "8", correct: false, say: "That is the target electron count for a stable shell, not the valency itself. Valency = 8 − 7 = 1.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Boron (atomic number 5, mass number 11) and Carbon (atomic number 6, mass number 12) both have exactly 6 neutrons, but different atomic numbers and different mass numbers. What are atoms like these called?",
      setup: frame,
      options: [
        { label: "Isotones", correct: true, say: "Correct. Same number of neutrons, but different atomic number AND different mass number, is exactly the definition of isotones.", frame },
        { label: "Isotopes", correct: false, say: "Isotopes have the SAME atomic number but different mass numbers - here the atomic numbers (5 and 6) are different, so this isn't isotopes. Same neutron count with different Z and A makes them isotones.", frame },
        { label: "Isobars", correct: false, say: "Isobars have the SAME mass number but different atomic numbers - here both the atomic number and mass number differ. Same neutron count with different Z and A makes them isotones.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Sulphur combines with oxygen to form SO2 and SO3. For a fixed mass of sulphur, the masses of oxygen that combine are in the simple ratio 2:3. Which law does this illustrate?",
      setup: frame,
      options: [
        { label: "The law of multiple proportions", correct: true, say: "Correct. When one element (sulphur) combines with another (oxygen) to form more than one compound, the different masses of oxygen that combine with the same fixed mass of sulphur are in a simple ratio - exactly Dalton's law of multiple proportions.", frame },
        { label: "Gay-Lussac's law of combining volumes", correct: false, say: "Gay-Lussac's law is specifically about the VOLUMES of reacting and product GASES being in a simple ratio, not about masses combining with a fixed mass of a third element. This mass-ratio example is the law of multiple proportions.", frame },
        { label: "The law of conservation of mass", correct: false, say: "That law says mass is neither created nor destroyed in a reaction - a different idea entirely. A simple ratio between different masses of oxygen combining with a fixed mass of sulphur is the law of multiple proportions.", frame },
      ],
    };
  }
  if (definition.number === 11 && concept.id === "11.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which quantum number describes the spin of the electron - the last, most specific piece of its four-part 'address'?",
      setup: frame,
      options: [
        { label: "The spin quantum number (s)", correct: true, say: "Correct. The spin quantum number (s) is specifically the one that describes the electron's own spin.", frame },
        { label: "The principal quantum number (n)", correct: false, say: "The principal quantum number (n) describes the main energy level - the broadest part of the 'address', not the electron's spin. That's the spin quantum number (s).", frame },
        { label: "The azimuthal quantum number (l)", correct: false, say: "The azimuthal quantum number (l) describes the sub-shell/orbital shape, not spin. The spin quantum number (s) is the one that describes the electron's spin.", frame },
      ],
    };
  }
  if (definition.number === 10 && concept.id === "10.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A block of pure copper is made of only copper atoms, and no chemical process can break it down into a simpler substance. Is copper an element, a compound, or a mixture?",
      setup: frame,
      options: [
        { label: "An element", correct: true, say: "Correct. Containing only one kind of atom and being impossible to break down into a simpler substance is exactly the definition of an element.", frame },
        { label: "A compound", correct: false, say: "A compound is made of TWO OR MORE different kinds of atoms combined chemically. Copper has only one kind of atom throughout, making it an element.", frame },
        { label: "A mixture", correct: false, say: "A mixture contains more than one kind of particle, physically combined. Pure copper has only one kind of atom throughout - it is an element.", frame },
      ],
    };
  }
  if (definition.number === 10 && concept.id === "10.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Table salt (NaCl) can be broken down into sodium metal and chlorine gas, but only by passing electricity through it (electrolysis) - a chemical reaction. Is salt an element or a compound?",
      setup: frame,
      options: [
        { label: "A compound", correct: true, say: "Correct. Needing a chemical reaction to split it into simpler substances (sodium and chlorine) is exactly what defines a compound - and its properties (edible salt) are completely different from either of its elements (reactive metal, toxic gas).", frame },
        { label: "An element", correct: false, say: "An element cannot be broken down into anything simpler at all. Since salt CAN be split into sodium and chlorine by a chemical reaction, it must be a compound, not an element.", frame },
        { label: "A mixture", correct: false, say: "A mixture's components can be separated by simple physical means, without any chemical reaction. Salt requires electrolysis (a chemical reaction) to split apart, which makes it a compound.", frame },
      ],
    };
  }
  if (definition.number === 10 && concept.id === "10.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Brass (30% zinc, 70% copper) can be melted and separated back into pure zinc and pure copper without any chemical reaction at all. Is brass a mixture or a compound?",
      setup: frame,
      options: [
        { label: "A mixture (specifically, an alloy)", correct: true, say: "Correct. Since it can be separated back into its original metals by a purely physical process (melting/separating), with no chemical reaction needed, brass is a mixture - specifically an alloy of two metals.", frame },
        { label: "A compound", correct: false, say: "A compound can ONLY be separated back into its elements by a chemical reaction. Since brass separates by physical means alone, it is a mixture, not a compound.", frame },
        { label: "An element", correct: false, say: "Brass contains two different metals (zinc and copper) mixed together, not one single kind of atom - so it cannot be an element.", frame },
      ],
    };
  }
  if (definition.number === 10 && concept.id === "10.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A jar of trail mix contains clearly visible separate raisins, nuts and pretzels that you can pick out individually. Is this a homogeneous or heterogeneous mixture?",
      setup: frame,
      options: [
        { label: "Heterogeneous", correct: true, say: "Correct. Being able to see and pick out the separate components individually is exactly what makes a mixture heterogeneous - its composition is not uniform throughout.", frame },
        { label: "Homogeneous", correct: false, say: "A homogeneous mixture's components CANNOT be told apart - trail mix's clearly separate raisins, nuts and pretzels make it heterogeneous instead.", frame },
        { label: "Neither - it's a compound", correct: false, say: "Trail mix's ingredients are just physically combined, not chemically reacted into a new substance, so it's a mixture - specifically a heterogeneous one, since you can see the separate pieces.", frame },
      ],
    };
  }
  if (definition.number === 10 && concept.id === "10.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "You need to separate naphthalene balls (which turn straight to vapour on heating) mixed with sand (which doesn't). Which separation method should you use?",
      setup: frame,
      options: [
        { label: "Sublimation", correct: true, say: "Correct. Naphthalene sublimes - turning directly from solid to vapour on heating - so heating the mixture lets the naphthalene vapour escape and be collected, leaving the sand behind.", frame },
        { label: "Centrifugation", correct: false, say: "Centrifugation separates a solid-liquid mixture by spinning it at high speed - there's no liquid here. Since naphthalene turns straight to vapour on heating, sublimation is the right method.", frame },
        { label: "Solvent extraction", correct: false, say: "Solvent extraction is for two immiscible liquids using a separating funnel - not applicable to a solid-solid mixture. Sublimation is the method that fits naphthalene's vapour-forming behaviour.", frame },
      ],
    };
  }
  if (definition.number === 10 && concept.id === "10.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A black ink spot is placed on paper, then the paper is dipped in water. The water slowly carries different-coloured dye bands up the paper at different speeds, separating them. Which method is this, and what property of the dyes makes it work?",
      setup: frame,
      options: [
        { label: "Chromatography - it relies on the dyes having different solubilities in the solvent (water)", correct: true, say: "Correct. Chromatography separates a mixture's components by how differently soluble they are in the same solvent - dyes with higher solubility travel further and faster up the paper than less-soluble ones.", frame },
        { label: "Fractional distillation - it relies on different boiling points", correct: false, say: "Boiling points matter for distillation methods, not paper chromatography - here nothing is being boiled at all. It's chromatography, based on the dyes' different solubilities in the solvent.", frame },
        { label: "Centrifugation - it relies on different particle densities", correct: false, say: "Centrifugation needs spinning at high speed - nothing is spinning here. This is chromatography, which separates the dyes by their different solubilities in the solvent as it moves up the paper.", frame },
      ],
    };
  }
  if (definition.number === 10 && concept.id === "10.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A glass of muddy river water is left standing overnight, and by morning the mud has settled to the bottom, leaving mostly clear water on top. Is muddy water a true solution, a colloid, or a suspension?",
      setup: frame,
      options: [
        { label: "A suspension", correct: true, say: "Correct. Particles large enough to visibly settle out on standing is exactly the defining property of a suspension - true solutions and colloids do not settle out like this.", frame },
        { label: "A true solution", correct: false, say: "A true solution's particles are so small they never settle out at all. Since the mud visibly settled to the bottom overnight, this is a suspension instead.", frame },
        { label: "A colloid", correct: false, say: "A colloid's particles stay suspended and don't settle out on standing. Since the mud DID settle to the bottom, muddy water is a suspension, not a colloid.", frame },
      ],
    };
  }
  if (definition.number === 10 && concept.id === "10.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Jelly is a liquid trapped inside a solid-like, wobbly network. What type of colloid is this called?",
      setup: frame,
      options: [
        { label: "A gel", correct: true, say: "Correct. A gel is the name for a colloid where the dispersed phase is a liquid and the dispersion medium is a solid - exactly jelly's structure.", frame },
        { label: "A sol", correct: false, say: "A sol is a solid dispersed in a liquid (like paint), the reverse arrangement. Jelly is a liquid trapped in a solid-like network, which makes it a gel.", frame },
        { label: "A foam", correct: false, say: "A foam is a gas dispersed in a liquid (like soap lather). Jelly has no gas bubbles involved - it's a liquid within a solid network, making it a gel.", frame },
      ],
    };
  }
  if (definition.number === 10 && concept.id === "10.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In fresh cream, tiny droplets of fat are dispersed throughout a continuous watery liquid. Is this an oil-in-water or a water-in-oil emulsion?",
      setup: frame,
      options: [
        { label: "Oil-in-water (O/W)", correct: true, say: "Correct. The fat (oil) forms the scattered droplets, and water forms the continuous medium they're dispersed in - exactly what defines an oil-in-water emulsion.", frame },
        { label: "Water-in-oil (W/O)", correct: false, say: "That's the reverse arrangement, like butter (water droplets in a continuous fat layer). Cream has fat droplets in a continuous watery liquid, making it oil-in-water.", frame },
        { label: "Neither - cream isn't an emulsion at all", correct: false, say: "Cream is a classic example of an emulsion - specifically oil-in-water, since fat droplets are dispersed throughout a continuous watery liquid.", frame },
      ],
    };
  }
  if (definition.number === 9 && concept.id === "9.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Scientists say atoms make up only about 4% of the universe. What makes up most of the rest?",
      setup: frame,
      options: [
        { label: "Dark matter and dark energy", correct: true, say: "Correct. The vast majority of the universe is dark matter and dark energy - things scientists know exist from their gravitational and expansive effects, even though they cannot be directly seen.", frame },
        { label: "Empty space with absolutely nothing in it", correct: false, say: "While much of the universe is indeed empty of ordinary atoms, scientists specifically attribute the majority of its mass-energy content to dark matter and dark energy, not literal nothingness.", frame },
        { label: "Hydrogen gas alone", correct: false, say: "Hydrogen is the most common ordinary element, but ordinary atoms (including hydrogen) only make up about 4% of the universe - the rest is dark matter and dark energy.", frame },
      ],
    };
  }
  if (definition.number === 9 && concept.id === "9.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "You spot a star that glows distinctly red in the night sky, and another that glows blue-white. Which one is hotter?",
      setup: frame,
      options: [
        { label: "The blue-white star", correct: true, say: "Correct. A star's colour reveals its temperature: hot stars burn white or blue, while cooler stars glow orange or red.", frame },
        { label: "The red star", correct: false, say: "It is the other way round - red stars are the cooler ones. Hot stars burn white or blue.", frame },
        { label: "Colour tells you nothing about a star's temperature", correct: false, say: "Colour is actually a direct clue to temperature - hot stars are white or blue, cooler stars are orange or red.", frame },
      ],
    };
  }
  if (definition.number === 9 && concept.id === "9.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "What actually happens inside the Sun to release the light and heat that reaches Earth?",
      setup: frame,
      options: [
        { label: "Hydrogen atoms fuse together under enormous pressure to form helium, releasing energy", correct: true, say: "Correct - this is nuclear fusion. Hydrogen atoms combining into helium under the Sun's enormous internal pressure is exactly what releases the light and heat we feel on Earth.", frame },
        { label: "The Sun is simply on fire, burning like a bonfire", correct: false, say: "Ordinary burning (chemical combustion) is not what powers the Sun - it is nuclear fusion, hydrogen atoms combining into helium under enormous pressure, releasing far more energy than burning ever could.", frame },
        { label: "Sunlight is reflected light from other, brighter stars", correct: false, say: "The Sun generates its own light and heat through nuclear fusion - it is not reflecting light from elsewhere.", frame },
      ],
    };
  }
  if (definition.number === 9 && concept.id === "9.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Jupiter is made mostly of hydrogen and helium gas, has rings, and lies far from the Sun. Which group of planets does it belong to?",
      setup: frame,
      options: [
        { label: "The outer planets (gas giants)", correct: true, say: "Correct. Gas composition, rings, and being spread far out from the Sun are exactly the hallmarks of the outer planets: Jupiter, Saturn, Uranus and Neptune.", frame },
        { label: "The inner planets (terrestrial)", correct: false, say: "Inner planets are rocky, ring-less, and close together near the Sun - the opposite of Jupiter's gas composition, rings and great distance. Jupiter is an outer, gas-giant planet.", frame },
        { label: "Neither group - Jupiter is a dwarf planet", correct: false, say: "Jupiter is a full planet, and specifically the largest of the four outer, gas-giant planets - not a dwarf planet.", frame },
      ],
    };
  }
  if (definition.number === 9 && concept.id === "9.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A small rock from space enters Earth's atmosphere, glows brightly, and burns up completely before reaching the ground. What is it called while this is happening, and would it be called something different if a chunk of it survived and landed?",
      setup: frame,
      options: [
        { label: "It is a meteor while burning up; if a piece survives and lands, that surviving piece is a meteorite", correct: true, say: "Correct. Meteor describes the glowing streak as the rock burns up in the atmosphere; if any part survives to actually reach the ground, that surviving piece is specifically called a meteorite.", frame },
        { label: "It is called a comet the whole time", correct: false, say: "A comet is a completely different object - a lump of dust and ice on a long elliptical orbit around the Sun. A small rock burning up in the atmosphere is a meteor (or a meteorite if it lands).", frame },
        { label: "It is called an asteroid the whole time, with no name change", correct: false, say: "Asteroids are the rocky bodies orbiting mainly between Mars and Jupiter. Once a small rock enters and burns in Earth's atmosphere it is called a meteor, and a meteorite if part of it survives to land.", frame },
      ],
    };
  }
  if (definition.number === 9 && concept.id === "9.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Which satellite needs a greater orbital velocity to stay in a stable circular orbit: one at 300 km altitude, or one at 20,000 km altitude?",
      setup: frame,
      options: [
        { label: "The one at 300 km altitude", correct: true, say: "Correct. The closer a satellite is to Earth, the greater the orbital velocity it needs to counteract Earth's stronger gravitational pull at that height and stay in a stable circular orbit.", frame },
        { label: "The one at 20,000 km altitude", correct: false, say: "It is the opposite - closer satellites need GREATER orbital velocity, not less, because Earth's gravity is stronger nearer the surface.", frame },
        { label: "Both need exactly the same orbital velocity", correct: false, say: "Orbital velocity depends on altitude - a satellite closer to Earth needs a higher orbital velocity than one farther away.", frame },
      ],
    };
  }
  if (definition.number === 9 && concept.id === "9.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Why does a geostationary satellite, with a time period of exactly 24 hours, appear to stay fixed over the same spot on Earth's surface?",
      setup: frame,
      options: [
        { label: "Because Earth itself also completes one full rotation in 24 hours, so the satellite and the ground point stay in sync", correct: true, say: "Correct. Since both the satellite's orbit and Earth's own rotation take 24 hours, the satellite stays positioned above the same spot on the ground the entire time, appearing motionless from below.", frame },
        { label: "Because the satellite has stopped moving entirely", correct: false, say: "The satellite is still moving fast along its orbit - it only APPEARS still because Earth is rotating at the same rate underneath it, keeping the same ground spot beneath it at all times.", frame },
        { label: "Because it orbits very close to Earth's surface", correct: false, say: "Geostationary satellites actually orbit very far out (about 36,000 km) - it is matching Earth's 24-hour rotation period, not closeness, that keeps them appearing fixed.", frame },
      ],
    };
  }
  if (definition.number === 9 && concept.id === "9.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Planet C's orbital period around the Sun is 27 times that of Planet D. Using Kepler's third law (T² ∝ R³), how many times farther from the Sun is Planet C than Planet D?",
      setup: frame,
      options: [
        { label: "9 times farther", correct: true, say: "Correct. T² ∝ R³ means 27² = R-ratio³, so R-ratio³ = 729, and the cube root of 729 is 9.", frame },
        { label: "27 times farther", correct: false, say: "That just repeated the period ratio instead of applying Kepler's third law. Correctly: 27² = 729 = R-ratio³, so R-ratio = the cube root of 729 = 9.", frame },
        { label: "3 times farther", correct: false, say: "That is the cube root of 27, not of 27². Correctly: 27² = 729 = R-ratio³, so R-ratio = the cube root of 729 = 9.", frame },
      ],
    };
  }
  if (definition.number === 9 && concept.id === "9.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "How many countries' space agencies are involved in providing, maintaining and operating the ISS?",
      setup: frame,
      options: [
        { label: "16 countries, through 5 space agencies", correct: true, say: "Correct. NASA (USA), Roskosmos (Russia), ESA (Europe), JAXA (Japan) and CSA (Canada) lead it, with several more European nations also part of the consortium - 16 countries in total.", frame },
        { label: "Only 1 country - the USA built and runs it alone", correct: false, say: "The ISS is a genuinely international project - 5 space agencies representing 16 countries jointly provide, maintain and operate it, not just the USA.", frame },
        { label: "Exactly 2 countries, the USA and Russia", correct: false, say: "While NASA (USA) and Roskosmos (Russia) are two of the lead agencies, the full consortium spans 5 agencies and 16 countries in total, including Japan, Canada and several European nations.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Two astronauts stand right next to each other outside their spacecraft on the Moon, which has essentially no atmosphere. Can one shout to the other and be heard?",
      setup: frame,
      options: [
        { label: "No - sound cannot travel through the near-vacuum of the Moon's surroundings", correct: true, say: "Correct. The Bell-Jar experiment shows sound cannot travel without a material medium. With almost no atmosphere on the Moon, there is no medium to carry the vibrations, so a shout could not be heard, no matter how close the astronauts stand.", frame },
        { label: "Yes - sound always travels, medium or not", correct: false, say: "It does not - sound absolutely needs a material medium (solid, liquid or gas) to travel. The Moon's near-vacuum leaves nothing for the sound to travel through.", frame },
        { label: "Yes, but only because they are standing close together", correct: false, say: "Distance is not the issue here - even standing right next to each other, there is no medium on the Moon's surface to carry the vibrations at all.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "In a longitudinal sound wave, at a rarefaction, is the air pressure higher or lower than the surrounding undisturbed air?",
      setup: frame,
      options: [
        { label: "Lower - particles are spread further apart there", correct: true, say: "Correct. A rarefaction is a region where the medium's particles are spread apart, which means fewer particles per unit volume there - lower pressure than normal.", frame },
        { label: "Higher - particles are crowded together there", correct: false, say: "That describes a compression, not a rarefaction. A rarefaction is the opposite: particles spread apart, giving lower pressure.", frame },
        { label: "Exactly the same as the undisturbed air", correct: false, say: "It is not the same - a rarefaction is specifically a region of lower pressure, where particles have spread apart from their normal spacing.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A sound wave has a frequency of 250 Hz. What is its time period?",
      setup: frame,
      options: [
        { label: "0.004 s (4 ms)", correct: true, say: "Correct. T = 1/n = 1/250 = 0.004 s.", frame },
        { label: "250 s", correct: false, say: "That used the frequency directly as the time, instead of taking its reciprocal. T = 1/n = 1/250 = 0.004 s.", frame },
        { label: "25 s", correct: false, say: "That is not the reciprocal of 250. T = 1/n = 1/250 = 0.004 s.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A guitar's low string and high string are both plucked with exactly the same force. What differs between the two sounds produced, and what stays the same?",
      setup: frame,
      options: [
        { label: "Pitch differs (different frequencies); loudness stays about the same (same force/amplitude)", correct: true, say: "Correct. The two strings vibrate at different frequencies, giving different pitches. Since they were plucked with the same force, their amplitudes - and so their loudness - stay about the same.", frame },
        { label: "Loudness differs; pitch stays the same", correct: false, say: "It is the other way round here - plucking with the same force keeps the amplitude (and so loudness) similar, while the strings' different frequencies give them different pitches.", frame },
        { label: "Both loudness and pitch stay exactly the same", correct: false, say: "Pitch does differ - the two strings are tuned to different frequencies, so even plucked with equal force they produce different pitches.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A sound wave has a frequency of 680 Hz and a wavelength of 0.5 m. Find its speed.",
      setup: frame,
      options: [
        { label: "340 m/s", correct: true, say: "Correct. v = nλ = 680 × 0.5 = 340 m/s.", frame },
        { label: "1360 m/s", correct: false, say: "That divided instead of multiplied. v = nλ = 680 × 0.5 = 340 m/s.", frame },
        { label: "680.5 m/s", correct: false, say: "That added the two numbers instead of multiplying them. v = nλ = 680 × 0.5 = 340 m/s.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A sound wave strikes a wall at an angle of 60 degrees from the normal. At what angle does it reflect, measured from the normal?",
      setup: frame,
      options: [
        { label: "60 degrees", correct: true, say: "Correct. Just like light, sound's angle of reflection always equals its angle of incidence - both measured from the normal.", frame },
        { label: "30 degrees", correct: false, say: "That measured from the surface instead of the normal, or used the wrong reference. The angle of reflection equals the angle of incidence: 60 degrees, both from the normal.", frame },
        { label: "120 degrees", correct: false, say: "That doubled the angle. The angle of reflection simply equals the angle of incidence: 60 degrees, both measured from the normal.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A girl claps near a cliff and hears the echo 0.6 s later. If the speed of sound is 340 m/s, how far away is the cliff?",
      setup: frame,
      options: [
        { label: "102 m", correct: true, say: "Correct. Round-trip distance = v × t = 340 × 0.6 = 204 m, so the cliff is half of that, 102 m, away.", frame },
        { label: "204 m", correct: false, say: "That is the full round-trip distance, not the distance to the cliff. The cliff is half of 204 m, so 102 m away.", frame },
        { label: "566.7 m", correct: false, say: "That divided speed by time instead of multiplying. Round-trip distance = 340 × 0.6 = 204 m, so the cliff is 102 m away (half the round trip).", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.8") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Why are movie theatres usually fitted with padded, fabric-covered seats and carpeted floors, rather than bare hard benches and tiled floors?",
      setup: frame,
      options: [
        { label: "Soft materials absorb sound, reducing reverberation so dialogue and music stay clear", correct: true, say: "Correct. Hard, bare surfaces reflect sound repeatedly, building up reverberation that blurs speech. Padded seats and carpets absorb sound instead, keeping the audio clear.", frame },
        { label: "Soft materials make the room warmer, which improves sound quality", correct: false, say: "Temperature is not the reason - padding and carpeting are chosen specifically because they absorb sound and reduce reverberation, keeping speech and music from blurring together.", frame },
        { label: "It has no effect on the sound at all, only on comfort", correct: false, say: "It does affect the sound - soft materials absorb sound energy rather than reflecting it, which is exactly what controls reverberation in a large room.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.9") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Bats fly and hunt insects successfully in complete darkness using echolocation. What kind of sound are they emitting and listening for?",
      setup: frame,
      options: [
        { label: "Ultrasonic sound - above 20,000 Hz, beyond human hearing", correct: true, say: "Correct. Bats emit ultrasonic clicks (above 20,000 Hz) and listen for the echoes bouncing back off obstacles and prey, letting them navigate and hunt without needing any light at all.", frame },
        { label: "Infrasonic sound - below 20 Hz", correct: false, say: "Infrasonic sound is too low-frequency for this kind of precise echolocation. Bats use ultrasonic sound instead, above 20,000 Hz.", frame },
        { label: "Ordinary sound within the human hearing range", correct: false, say: "If it were in the human range, we would hear bats' echolocation clicks clearly - we do not, because they are ultrasonic, above 20,000 Hz.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.10") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A ship's SONAR sends an ultrasound pulse that returns after 2.5 s. If the speed of ultrasound in sea water is 1500 m/s, how far below the ship is the seabed?",
      setup: frame,
      options: [
        { label: "1875 m", correct: true, say: "Correct. 2d = v × t = 1500 × 2.5 = 3750 m, so d = 1875 m.", frame },
        { label: "3750 m", correct: false, say: "That is the full round-trip distance the sound travelled, not the one-way depth. Dividing by 2 gives the actual depth: 1875 m.", frame },
        { label: "600 m", correct: false, say: "That divided speed by time instead of multiplying. 2d = 1500 × 2.5 = 3750 m, so d = 1875 m.", frame },
      ],
    };
  }
  if (definition.number === 8 && concept.id === "8.11") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Put these in the correct order for how a sound reaches the brain: (a) cochlea converts vibrations to electrical signals, (b) eardrum vibrates, (c) hammer/anvil/stirrup amplify the vibration, (d) pinna collects the sound.",
      setup: frame,
      options: [
        { label: "d, b, c, a", correct: true, say: "Correct. The pinna collects sound first; it travels down the canal and makes the eardrum vibrate; the three middle-ear bones amplify that vibration; finally the cochlea converts it into the electrical signal sent to the brain.", frame },
        { label: "a, b, c, d", correct: false, say: "That runs the process backwards - the cochlea acts last, not first. Sound is collected by the pinna first, then vibrates the eardrum, then gets amplified, then converted by the cochlea.", frame },
        { label: "b, d, a, c", correct: false, say: "The pinna collects sound before the eardrum can vibrate, and the cochlea converts the signal only after the middle-ear bones amplify it - so the order is pinna, eardrum, bones, cochlea.", frame },
      ],
    };
  }
  if (definition.number === 6 && concept.id === "6.1") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A ray of light hits a plane mirror and makes a 25 degree angle with the normal. What is the angle of reflection, and what is the angle between the incident ray and the mirror's surface?",
      setup: frame,
      options: [
        { label: "25 degrees from the normal; 65 degrees from the surface", correct: true, say: "Correct. The law of reflection always measures from the normal: angle of reflection = angle of incidence = 25 degrees. From the surface itself, that is 90 - 25 = 65 degrees.", frame },
        { label: "65 degrees from the normal; 25 degrees from the surface", correct: false, say: "That swaps the two. The angle of reflection is measured from the normal and equals the angle of incidence: 25 degrees. From the surface it is 90 - 25 = 65 degrees.", frame },
        { label: "25 degrees from the normal; 25 degrees from the surface", correct: false, say: "The angle from the surface is not the same number - normal and surface are 90 degrees apart. Reflection = 25 degrees from the normal, so 90 - 25 = 65 degrees from the surface.", frame },
      ],
    };
  }
  if (definition.number === 6 && concept.id === "6.2") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A ray of light travels parallel to the principal axis and strikes a concave mirror. Which path does it take after reflecting?",
      setup: frame,
      options: [
        { label: "It passes through the principal focus", correct: true, say: "Correct. Ray rule 1: any ray travelling parallel to the principal axis reflects through the principal focus.", frame },
        { label: "It travels back parallel to the axis", correct: false, say: "That is the rule for a ray that arrives THROUGH the focus - it reflects back parallel. A ray arriving parallel to the axis instead passes through the focus after reflecting.", frame },
        { label: "It reflects straight back along the same path", correct: false, say: "That only happens for a ray striking exactly along the normal at the pole. A ray parallel to the axis instead reflects through the principal focus.", frame },
      ],
    };
  }
  if (definition.number === 6 && concept.id === "6.3") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "An object is placed 20 cm from a concave mirror whose focal length is 5 cm. Use 1/v + 1/u = 1/f (with u = -20 cm, f = -5 cm) to find v.",
      setup: frame,
      options: [
        { label: "v = -6.67 cm", correct: true, say: "Correct. 1/v = 1/f - 1/u = 1/(-5) - 1/(-20) = -0.2 + 0.05 = -0.15, so v = -6.67 cm - a real, inverted image close to the mirror.", frame },
        { label: "v = -25 cm", correct: false, say: "That added u and f instead of using 1/v = 1/f - 1/u. Correctly: 1/v = 1/(-5) - 1/(-20) = -0.15, so v = -6.67 cm.", frame },
        { label: "v = -4 cm", correct: false, say: "That divided f by u directly instead of using the mirror equation. Correctly: 1/v = 1/f - 1/u = 1/(-5) - 1/(-20) = -0.15, so v = -6.67 cm.", frame },
      ],
    };
  }
  if (definition.number === 6 && concept.id === "6.4") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A convex mirror is used as a shop's security mirror. Compared to the real objects it shows, what does the image always look like?",
      setup: frame,
      options: [
        { label: "Smaller, upright, and appears to be behind the mirror", correct: true, say: "Correct. A convex mirror always produces a diminished, virtual, upright image behind the mirror's surface, no matter how far away the object is - which is exactly why it can fit a wide shop floor into one small mirror.", frame },
        { label: "Larger, upright, and appears to be behind the mirror", correct: false, say: "A convex mirror always shrinks the image, never enlarges it - that is what lets it show a wide field of view. It is still upright and behind the mirror, though.", frame },
        { label: "The same size, inverted, and in front of the mirror", correct: false, say: "A convex mirror's image is always smaller and upright, and forms behind the mirror (virtual) - never the same size, inverted, or in front.", frame },
      ],
    };
  }
  if (definition.number === 6 && concept.id === "6.5") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Why did Ole Roemer need to observe an event happening far out in space (a moon of Jupiter) to first estimate the speed of light, instead of just timing light across a room?",
      setup: frame,
      options: [
        { label: "Because light travels so fast that over short, everyday distances the travel time is too tiny to notice", correct: true, say: "Correct. Light moves at roughly 300,000 km per second, so across a room it arrives essentially instantly - Roemer needed the vast distances of the solar system for the delay to become measurable at all.", frame },
        { label: "Because light does not travel through air at all", correct: false, say: "Light does travel through air - that is how we see anything at all. Roemer needed huge astronomical distances simply because light is too fast for any delay to show up over short ones.", frame },
        { label: "Because Jupiter's moon glows on its own and light does not", correct: false, say: "That is not related to why astronomical distances were needed - it was purely because light's speed is so great that only a very long distance makes its travel time measurable.", frame },
      ],
    };
  }
  if (definition.number === 6 && concept.id === "6.6") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "A pencil half-dipped in a glass of water looks bent at the water's surface. Which way does the light bend as it leaves the water (denser) and enters the air (rarer)?",
      setup: frame,
      options: [
        { label: "It bends away from the normal", correct: true, say: "Correct. Going from a denser medium (water) into a rarer one (air), light speeds up and bends away from the normal - that bending is exactly what makes the pencil appear to kink at the surface.", frame },
        { label: "It bends toward the normal", correct: false, say: "Bending toward the normal happens going INTO a denser medium. Here light is leaving water (denser) for air (rarer), so it bends away from the normal.", frame },
        { label: "It does not bend at all", correct: false, say: "It does bend - that bending is exactly why the pencil looks broken at the surface. Light leaving a denser medium for a rarer one always bends away from the normal.", frame },
      ],
    };
  }
  if (definition.number === 6 && concept.id === "6.7") {
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "Light is travelling inside a glass block (denser medium) and hits the glass-air boundary at an angle smaller than the critical angle. What happens?",
      setup: frame,
      options: [
        { label: "Most of the light refracts out into the air, bending away from the normal", correct: true, say: "Correct. Total internal reflection only happens when the angle of incidence exceeds the critical angle. Below it, light still mostly refracts out into the rarer medium, bending away from the normal.", frame },
        { label: "All of the light reflects back into the glass", correct: false, say: "Total internal reflection needs the angle to EXCEED the critical angle. Below the critical angle, light instead refracts out into the air as usual.", frame },
        { label: "The light stops travelling entirely", correct: false, say: "Light does not simply stop - below the critical angle it refracts out into the air, bending away from the normal. Total internal reflection only happens past the critical angle.", frame },
      ],
    };
  }
  if (definition.number === 4 && concept.id === "4.4") {
    // Give them the ball, then name the exact mistake - real user direction
    // 2026-09-20: predict first, then get told why, not just the answer.
    const openFrame = circuit43Frame(false);
    return {
      title: `${prefix} · ${concept.id}`,
      conceptId: concept.id,
      prompt: "The cell and bulb are wired correctly, but the switch is left open. Will the bulb light?",
      setup: openFrame,
      options: [
        {
          label: "No - the loop is broken",
          correct: true,
          say: "Right. An open switch breaks the path. Charge cannot cross the gap, so the whole loop has no current - not just the part near the switch.",
          frame: openFrame,
        },
        {
          label: "Yes - the cell still works fine",
          correct: false,
          say: "The cell being fine is not enough. Current needs a complete, unbroken path all the way round. One open gap anywhere stops current everywhere in the loop.",
          frame: openFrame,
        },
      ],
    };
  }
  return {
    title: `${prefix} · ${concept.id}`,
    conceptId: concept.id,
    prompt: `Tap the model's parts, then answer: ${concept.example.question}`,
    setup: frame,
    options: [
      { label: concept.example.answer, correct: true, say: `Correct. ${concept.example.answer}`, frame },
      { label: "I need to revisit the model", correct: false, say: `Return to ${concept.title}, then use the example step by step.`, frame },
    ],
  };
}

function makeUnit(definition: ScienceDefinition): BoardUnit {
  const concepts = definition.concepts.map((concept) => ({
    conceptId: concept.id,
    title: concept.title,
    icon: concept.icon,
    summary: concept.summary,
    keyPoints: [concept.summary, "Use the worked example and name the evidence before giving your answer."],
    examples: [concept.example],
    quickCheck: [makeTask(definition, concept, "Quick check")],
    pages: concept.pages,
  }));
  const frameFor = (concept: ScienceConcept) => scienceVisualFrame(definition, concept, 0);
  const conceptSteps = definition.concepts.flatMap((concept): ConceptStep[] => {
    const base: ConceptStep[] = [
      { label: `${concept.id} · Meet the idea`, conceptId: concept.id, say: concept.summary, frame: frameFor(concept) },
      { label: `${concept.id} · Revisit the example`, conceptId: concept.id, say: `${concept.example.question} ${concept.example.answer}`, frame: frameFor(concept) },
    ];
    if (definition.number === 4 && concept.id === "4.4") {
      // Watched, not just labelled - real user direction 2026-09-20: "show
      // the examples animated ... make kids understand." The dot actually
      // travels the loop once, then the bulb lights.
      base.push({
        label: "4.4 · Watch current flow round a closed loop",
        conceptId: concept.id,
        say: "Watch current travel the whole loop once. Only when it completes the full circuit does the bulb light.",
        frame: circuit43Frame(true),
      });
    }
    return base;
  });
  return {
    unitKey: `tamilnadustateboard-9-science-${definition.number}`,
    title: `Unit ${definition.number} · ${definition.title}`,
    badge: `Tamil Nadu State Board · Standard IX Science · Unit ${definition.number}`,
    gridMax: 10,
    stage: "diagram",
    intro: {
      covers: concepts.map((concept) => `${concept.conceptId} ${concept.title}`),
      outcomes: concepts.map((concept) => `explain ${concept.title.toLowerCase()} using a worked example`),
    },
    concepts,
    conceptSteps,
    guidedTasks: definition.concepts.map((concept) => makeTask(definition, concept, "Cover")),
    lab: { kind: "visual", prompt: `Touch the pictured parts for ${definition.title.toLowerCase()}, then explain what evidence each part shows.`, start: [0, 0], shape: [[0, 0]], range: { min: 0, max: 1 } },
    recitePrompts: definition.concepts.flatMap((concept) => {
      const base = { ask: `Explain ${concept.title} using this example: ${concept.example.question}`, answer: concept.example.answer, conceptId: concept.id };
      // Fresh scenarios, not the loop just watched - real user direction
      // 2026-09-20: "recite can have different example ... practise them
      // with more at each stage so they are well trained."
      if (definition.number === 2 && concept.id === "2.1") {
        return [
          base,
          { ask: "A train covers 40 km every hour for three hours straight. Is this uniform or non-uniform motion?", answer: "Uniform - it covers equal distances (40 km) in equal time intervals (each hour).", conceptId: concept.id },
        ];
      }
      if (definition.number === 2 && concept.id === "2.2") {
        return [
          base,
          { ask: "A ball is thrown straight up and caught again at the same spot. What is its displacement for the whole trip?", answer: "0 m - it returns to exactly the point it started from, even though the distance it travelled (up and back down) is not zero.", conceptId: concept.id },
        ];
      }
      if (definition.number === 2 && concept.id === "2.3") {
        return [
          base,
          { ask: "A cyclist covers 30 m in 6 s. What is the average speed?", answer: "5 m/s: speed = distance ÷ time = 30 ÷ 6 = 5 m/s.", conceptId: concept.id },
        ];
      }
      if (definition.number === 2 && concept.id === "2.4") {
        return [
          base,
          { ask: "On a distance-time graph, what does a steeper line mean?", answer: "A greater speed - the steeper the slope, the more distance is covered in the same amount of time.", conceptId: concept.id },
        ];
      }
      if (definition.number === 2 && concept.id === "2.5") {
        return [
          base,
          { ask: "A cyclist speeds up from 4 m/s to 10 m/s in 3 s. Find the acceleration.", answer: "2 m/s²: a = (v − u)/t = (10 − 4)/3 = 2 m/s².", conceptId: concept.id },
        ];
      }
      if (definition.number === 2 && concept.id === "2.6") {
        return [
          base,
          { ask: "A 500 kg go-kart moves at 8 m/s around a bend of radius 16 m. Find the centripetal force.", answer: "2000 N: a = v²/r = 64/16 = 4 m/s², then F = ma = 500 × 4 = 2000 N.", conceptId: concept.id },
        ];
      }
      if (definition.number === 2 && concept.id === "2.7") {
        return [
          base,
          { ask: "Why do passengers feel pushed sideways when a car turns a sharp corner quickly?", answer: "Centrifugal force - as the car turns, the passengers' own inertia keeps pulling them outward, away from the centre of the turn.", conceptId: concept.id },
        ];
      }
      if (definition.number === 3 && concept.id === "3.1") {
        return [
          base,
          { ask: "A crate exerts a thrust of 450 N over an area of 0.3 m². What pressure does it exert?", answer: "1500 Pa: P = F/A = 450 ÷ 0.3 = 1500 Pa.", conceptId: concept.id },
        ];
      }
      if (definition.number === 3 && concept.id === "3.2") {
        return [
          base,
          { ask: "Find the pressure due to a 0.5 m column of oil, density 900 kg/m³ (g = 10 m/s²).", answer: "4500 Pa: P = hρg = 0.5 × 900 × 10 = 4500 Pa.", conceptId: concept.id },
        ];
      }
      if (definition.number === 3 && concept.id === "3.3") {
        return [
          base,
          { ask: "In a hydraulic press, why does a small force on a small piston lift a much heavier load on the large piston?", answer: "Because pressure is transmitted equally throughout the liquid (Pascal's law) - since the large piston has a much bigger area, the same pressure produces a much bigger force on it.", conceptId: concept.id },
        ];
      }
      if (definition.number === 3 && concept.id === "3.4") {
        return [
          base,
          { ask: "A liquid has a mass of 540 g and a volume of 600 cm³. Find its density.", answer: "0.9 g/cm³: density = mass ÷ volume = 540 ÷ 600 = 0.9 g/cm³.", conceptId: concept.id },
        ];
      }
      if (definition.number === 3 && concept.id === "3.5") {
        return [
          base,
          { ask: "A block of wood is less dense than water. What happens when it is placed in water?", answer: "It floats - it is positively buoyant, since the buoyant force is enough to balance its (smaller) weight.", conceptId: concept.id },
        ];
      }
      if (definition.number === 3 && concept.id === "3.6") {
        return [
          base,
          { ask: "A toy boat weighs 12 N. According to the laws of flotation, how much water must it displace to float?", answer: "12 N worth of water - a floating body always displaces fluid whose weight exactly equals its own weight.", conceptId: concept.id },
        ];
      }
      if (definition.number === 5 && concept.id === "5.1") {
        return [
          base,
          { ask: "What is the SI unit of magnetic field, and what does it measure?", answer: "The tesla - it measures the strength of a magnetic field (denoted B).", conceptId: concept.id },
        ];
      }
      if (definition.number === 5 && concept.id === "5.2") {
        return [
          base,
          { ask: "What did Oersted's experiment prove?", answer: "That an electric current produces a magnetic field around the wire it flows through - the two compass needles deflected in opposite directions the moment the circuit was closed.", conceptId: concept.id },
        ];
      }
      if (definition.number === 5 && concept.id === "5.3") {
        return [
          base,
          { ask: "A 3 m wire carries a current of 5 A, perpendicular to a 2 T magnetic field. Find the force on it.", answer: "30 N: F = BIL = 2 × 5 × 3 = 30 N.", conceptId: concept.id },
        ];
      }
      if (definition.number === 5 && concept.id === "5.4") {
        return [
          base,
          { ask: "What energy conversion does an electric motor perform?", answer: "It converts electrical energy into mechanical energy - the opposite conversion to a generator.", conceptId: concept.id },
        ];
      }
      if (definition.number === 5 && concept.id === "5.5") {
        return [
          base,
          { ask: "Does a magnet sitting still, already inside a coil, induce any current?", answer: "No - electromagnetic induction needs a changing magnetic flux. A stationary magnet produces no change, so no current is induced, even though it is inside the coil.", conceptId: concept.id },
        ];
      }
      if (definition.number === 5 && concept.id === "5.6") {
        return [
          base,
          { ask: "What energy conversion does a generator perform?", answer: "It converts mechanical energy into electrical energy - the reverse of what a motor does.", conceptId: concept.id },
        ];
      }
      if (definition.number === 5 && concept.id === "5.7") {
        return [
          base,
          { ask: "A transformer has 50 turns on its primary coil and 10 turns on its secondary. If 30 V ac is applied, what is the output voltage?", answer: "6 V: Es = (Ns/Np) × Ep = (10/50) × 30 = 6 V - a step-down transformer, since the secondary has fewer turns.", conceptId: concept.id },
        ];
      }
      if (definition.number === 5 && concept.id === "5.8") {
        return [
          base,
          { ask: "What are the two sets of magnets used for in a maglev train?", answer: "One set repels and lifts the train off the track; a second set moves the floating train forward - both without friction from the track.", conceptId: concept.id },
        ];
      }
      if (definition.number === 4 && concept.id === "4.4") {
        return [
          base,
          { ask: "A torch has a battery, a bulb and a slide switch, but a wire has come loose from the battery. Will the torch light?", answer: "No - a loose wire breaks the loop just like an open switch. Current cannot flow anywhere in the circuit until every connection is complete.", conceptId: concept.id },
          { ask: "Two bulbs are wired in parallel and one burns out. What happens to the other bulb?", answer: "It stays lit - each bulb in a parallel circuit has its own complete path back to the cell, so one failing does not break the other's loop.", conceptId: concept.id },
        ];
      }
      if (definition.number === 7 && concept.id === "7.1") {
        return [
          base,
          { ask: "A metal lid on a glass jar is hard to open, but runs it under hot water for a minute and it loosens. Why?", answer: "The metal lid expands more than the glass jar underneath it when heated, since metal expands faster - that slight extra expansion loosens its grip on the jar.", conceptId: concept.id },
        ];
      }
      if (definition.number === 7 && concept.id === "7.2") {
        return [
          base,
          { ask: "Why are cooking pots often made with metal bodies but wooden or plastic handles?", answer: "Metal conducts heat well, so it quickly carries heat from the stove to the food. Wood and plastic are poor conductors, so the handle stays cool enough to hold safely.", conceptId: concept.id },
        ];
      }
      if (definition.number === 7 && concept.id === "7.3") {
        return [
          base,
          { ask: "At night, why does a land breeze blow from the land out toward the sea?", answer: "At night the sea stays warmer than the land, so air over the sea rises, and cooler air from the land flows out to sea to replace it - that outward flow is the land breeze.", conceptId: concept.id },
        ];
      }
      if (definition.number === 7 && concept.id === "7.4") {
        return [
          base,
          { ask: "Why do people often wear white or light-coloured clothes in summer rather than dark ones?", answer: "Light-coloured surfaces reflect radiant heat well, so white clothes reflect away more of the Sun's heat, keeping the wearer cooler than dark clothes would.", conceptId: concept.id },
        ];
      }
      if (definition.number === 7 && concept.id === "7.5") {
        return [
          base,
          { ask: "Convert 35°C to Fahrenheit.", answer: "95°F: T°F = T°C × 1.8 + 32 = 35 × 1.8 + 32 = 63 + 32 = 95°F.", conceptId: concept.id },
        ];
      }
      if (definition.number === 7 && concept.id === "7.6") {
        return [
          base,
          { ask: "How much heat energy is needed to raise the temperature of 500 g (0.5 kg) of water by 30°C, given C = 4200 J/kg·K?", answer: "63,000 J: Q = mCΔT = 0.5 × 4200 × 30 = 63,000 J.", conceptId: concept.id },
        ];
      }
      if (definition.number === 7 && concept.id === "7.7") {
        return [
          base,
          { ask: "A brass block absorbs 1200 J of heat and its temperature rises by 15 K. What is its heat capacity?", answer: "80 J/K: Heat capacity = Q/ΔT = 1200/15 = 80 J/K.", conceptId: concept.id },
        ];
      }
      if (definition.number === 7 && concept.id === "7.8") {
        return [
          base,
          { ask: "What is the fixed temperature called at which a liquid changes to a solid, and what happens to it if heat is added again?", answer: "The freezing point - and if heat is added again, the solid melts back into liquid at that same temperature (its melting point, which for a pure substance is the same value).", conceptId: concept.id },
        ];
      }
      if (definition.number === 7 && concept.id === "7.9") {
        return [
          base,
          { ask: "How much heat energy is released when 3 kg of steam condenses back into water, if the specific latent heat of vaporisation is 2260 J/g?", answer: "6,780,000 J (6.78 × 10⁶ J): Heat energy released = m × L = 3000 g × 2260 J/g = 6,780,000 J.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.1") {
        return [
          base,
          { ask: "What is the process by which plants release water vapour into the atmosphere through the stomata in their leaves and stems, as part of the water cycle?", answer: "Transpiration.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.2") {
        return [
          base,
          { ask: "What is the name of the process where atmospheric nitrogen (inert) is converted into reactive compounds usable by living organisms, done by bacteria like Rhizobium?", answer: "Nitrogen fixation.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.3") {
        return [
          base,
          { ask: "How does atmospheric carbon dioxide first enter plants to be converted into carbohydrates?", answer: "Through the process of photosynthesis.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.4") {
        return [
          base,
          { ask: "Hydrilla has poorly developed roots and narrow, finely divided submerged leaves. What type of plant, adapted to living in or near water, is this?", answer: "A hydrophyte.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.5") {
        return [
          base,
          { ask: "What type of coating do small xerophyte leaves, like those of Acacia, often have, to reduce water loss?", answer: "A waxy coating.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.6") {
        return [
          base,
          { ask: "What defines a mesophyte's habitat, compared to hydrophytes and xerophytes?", answer: "It grows in conditions that are neither too wet nor too dry - it needs no extreme adaptations.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.7") {
        return [
          base,
          { ask: "Why are bats specifically active at night (nocturnal) rather than during the day?", answer: "Because daytime flight requires a lot of energy, and their thin, dark wing membrane (patagium) would absorb excessive heat in daylight, risking dehydration.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.8") {
        return [
          base,
          { ask: "What structures, found on each segment of an earthworm's lower body surface, help it move through soil and anchor itself in burrows?", answer: "Setae.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.9") {
        return [
          base,
          { ask: "What domestic water conservation habit does the book suggest as an alternative to taking a shower?", answer: "Using a bucket of water to bathe instead.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.10") {
        return [
          base,
          { ask: "What is a farm pond, and what is its main purpose?", answer: "A dugout structure with a definite shape and size, with inlet/outlet structures, used to collect and store surface runoff water for irrigation.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.11") {
        return [
          base,
          { ask: "In tertiary treatment, fine colloidal particles are precipitated by adding chemical coagulants. Name one such coagulant mentioned in the book.", answer: "Alum or ferric sulphate.", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.12") {
        return [
          base,
          { ask: "Besides agriculture and landscaping, name one everyday household use of recycled water mentioned in the book.", answer: "Toilet flushing (dust control and construction activities are other non-household uses).", conceptId: concept.id },
        ];
      }
      if (definition.number === 24 && concept.id === "24.13") {
        return [
          base,
          { ask: "What does IUCN stand for, and what is its main global role?", answer: "International Union for Conservation of Nature and Natural Resources - it is the global authority on the status of the natural world and the measures needed to safeguard it.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.1") {
        return [
          base,
          { ask: "What is the Latin origin of the word 'horticulture'?", answer: "'Hortus' (garden) combined with 'colere' (to cultivate).", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.2") {
        return [
          base,
          { ask: "What is compost specifically produced from, through natural decomposition by microorganisms?", answer: "Organic matter, such as crop residues, animal wastes, food wastes, and industrial/municipal wastes.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.3") {
        return [
          base,
          { ask: "Which biofertilizer is a fungus that increases a plant's uptake of phosphorus, in symbiotic association with roots?", answer: "Mycorrhizae.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.4") {
        return [
          base,
          { ask: "Andrographis paniculata (Nilavembu) is used to treat which three real diseases, according to the book?", answer: "Dengue fever, diabetes, and chikungunya.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.5") {
        return [
          base,
          { ask: "Name one method used to preserve mushrooms after harvesting.", answer: "Any one of: freezing, drying, canning, vacuum cooling, or gamma radiation with cold storage.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.6") {
        return [
          base,
          { ask: "In hydroponics, since the roots don't perform their normal anchoring function while submerged in nutrient water, what must be done instead?", answer: "The plants must be mechanically supported from above.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.7") {
        return [
          base,
          { ask: "Indian cows and bulls belong to which species, and buffaloes to which?", answer: "Bos indicus (cows/bulls) and Bos bubalis (buffaloes).", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.8") {
        return [
          base,
          { ask: "What are the two broad categories cattle feed is classified into?", answer: "Roughages (coarse, fibrous fodder) and concentrates (low fibre, high in carbohydrates/protein).", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.9") {
        return [
          base,
          { ask: "What is the specific term for marine water aquaculture, also called sea farming?", answer: "Mariculture.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.10") {
        return [
          base,
          { ask: "What is the difference between monoculture and polyculture in fish farming?", answer: "Monoculture is culturing a single type of fish in a water body; polyculture is culturing more than one type together.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.11") {
        return [
          base,
          { ask: "Name one freshwater cultivable fish mentioned in the book, besides the Indian major carps.", answer: "Any one of: catfish (Keluthi), Murrels (Veral), or Tilapia (Jilebi kendai).", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.12") {
        return [
          base,
          { ask: "Macrobrachium rosenbergii is an example of which type of prawn culture - marine or freshwater?", answer: "Freshwater prawn culture.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.13") {
        return [
          base,
          { ask: "What is vermicompost, specifically?", answer: "The excreta (castings) of earthworms - fine, granular organic matter formed by their decomposition of organic material.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.14") {
        return [
          base,
          { ask: "In a honey bee colony, what is the role of the queen bee?", answer: "She is the largest, fertile female of the colony, responsible for laying all the eggs.", conceptId: concept.id },
        ];
      }
      if (definition.number === 23 && concept.id === "23.15") {
        return [
          base,
          { ask: "How is nectar converted into honey inside the bee's body?", answer: "Nectar passes into the honey sac, where sucrose mixes with an acidic secretion and is converted into honey by enzymatic action.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.1") {
        return [
          base,
          { ask: "What is the name of the extra, small circular DNA found separately in bacterial cytoplasm, apart from the main chromosome?", answer: "A plasmid.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.2") {
        return [
          base,
          { ask: "What size range do viruses typically fall into?", answer: "18 to 400 nanometres (nm) - making them the smallest infective agents.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.3") {
        return [
          base,
          { ask: "Prions, unlike viruses, contain only one type of molecule and completely lack nucleic acid. What is that molecule?", answer: "Protein.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.4") {
        return [
          base,
          { ask: "What term describes microorganisms that enrich the soil with nutrients, like nitrogen?", answer: "Biofertilizers.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.5") {
        return [
          base,
          { ask: "Which yeast species ferments grapes to produce wine?", answer: "Saccharomyces cerevisiae.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.6") {
        return [
          base,
          { ask: "Cephalosporin, an antibiotic, is produced by which type of microorganism - a bacterium or a fungus?", answer: "A fungus (Cephalosporium acremonium).", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.7") {
        return [
          base,
          { ask: "The Hepatitis B vaccine is classified as what type of vaccine, using purified antigens rather than the whole live or killed organism?", answer: "A subunit vaccine.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.8") {
        return [
          base,
          { ask: "Influenza breaks out and affects large numbers of people in one region at the same time. What classification of disease occurrence is this?", answer: "Epidemic.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.9") {
        return [
          base,
          { ask: "What is the interval between infection and the first appearance of disease symptoms called?", answer: "The incubation period.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.10") {
        return [
          base,
          { ask: "Tuberculosis is caused by which bacterium, and which organ does it primarily affect?", answer: "Mycobacterium tuberculosis; it primarily affects the lungs.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.11") {
        return [
          base,
          { ask: "Cholera is caused by which bacterium, and what is the recommended fluid-replacement treatment?", answer: "Vibrio cholerae; treated with Oral Rehydration Solution (ORS).", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.12") {
        return [
          base,
          { ask: "Which drug is traditionally used to kill the stages of the malaria parasite in the body?", answer: "Quinine.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.13") {
        return [
          base,
          { ask: "Chronic Filaria infection specifically leads to which condition, affecting the legs, scrotum and arms?", answer: "Elephantiasis.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.14") {
        return [
          base,
          { ask: "In what year was swine flu declared a pandemic by the World Health Organization?", answer: "2009 (June 2009).", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.15") {
        return [
          base,
          { ask: "Gonorrhoea and Syphilis are both bacterial sexually transmitted diseases. Name the bacterium that causes Syphilis.", answer: "Treponema pallidum.", conceptId: concept.id },
        ];
      }
      if (definition.number === 22 && concept.id === "22.16") {
        return [
          base,
          { ask: "Who is credited with introducing the process of vaccination, having (according to WHO) eliminated smallpox from the human population?", answer: "Edward Jenner.", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.1") {
        return [
          base,
          { ask: "What type of fatty acids cannot be made by the body and must come from the diet, such as omega fatty acids?", answer: "Essential fatty acids.", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.2") {
        return [
          base,
          { ask: "Which fat-soluble vitamin's deficiency causes night blindness (nyctalopia) and dryness of the cornea?", answer: "Vitamin A (retinol).", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.3") {
        return [
          base,
          { ask: "Which vitamin deficiency causes pernicious anaemia - a decrease in red blood cell production and degeneration of the spinal cord?", answer: "Vitamin B12 (cyanocobalamine).", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.4") {
        return [
          base,
          { ask: "Which mineral is an important component of haemoglobin, and what deficiency disease results from its lack?", answer: "Iron; deficiency causes anaemia.", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.5") {
        return [
          base,
          { ask: "Which malnutrition condition specifically affects infants under one year old, caused by a diet poor in carbohydrates, fats and proteins altogether?", answer: "Marasmus.", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.6") {
        return [
          base,
          { ask: "Name two visible signs that indicate food has spoiled.", answer: "Any two of: changes in appearance, colour, texture, odour, or taste.", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.7") {
        return [
          base,
          { ask: "What temperature and duration does pasteurization use to destroy microbes in milk?", answer: "Boiling to 63°C for about 30 minutes, then sudden cooling.", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.8") {
        return [
          base,
          { ask: "Name one synthetic preservative mentioned in the book.", answer: "Any one of: sodium benzoate, citric acid, vinegar, sodium meta bisulphate, potassium bisulphate.", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.9") {
        return [
          base,
          { ask: "Prussic acid, naturally found in apple and cherry seeds, is an example of which category of food adulterant?", answer: "A natural adulterant - a toxic substance that occurs naturally in the food itself.", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.10") {
        return [
          base,
          { ask: "Name two digestive/gastrointestinal symptoms that can result from consuming adulterated food.", answer: "Any two of: diarrhoea, nausea, vomiting, or gastrointestinal disorders.", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.11") {
        return [
          base,
          { ask: "What slogan was raised on World Health Day (7th April 2015) to promote food safety?", answer: "'From farm to plate, make food safe.'", conceptId: concept.id },
        ];
      }
      if (definition.number === 21 && concept.id === "21.12") {
        return [
          base,
          { ask: "Which agency was set up in 1965 with objectives including price support for farmers and distributing food grains across the country?", answer: "FCI (Food Corporation of India).", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.1") {
        return [
          base,
          { ask: "Which organ system's organs are the eyes, nose, ears, tongue and skin, whose function is sight, smell, hearing, taste and touch?", answer: "The sensory system.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.2") {
        return [
          base,
          { ask: "Which type of salivary gland is the SMALLEST, and lies beneath the tongue?", answer: "The sublingual glands.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.3") {
        return [
          base,
          { ask: "What word describes the masticated (chewed) food formed in the buccal cavity, before it is swallowed?", answer: "A bolus.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.4") {
        return [
          base,
          { ask: "Roughly how many villi does the small intestine (mostly the ileum) contain, according to the book?", answer: "Approximately 4 million.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.5") {
        return [
          base,
          { ask: "The liver has two main lobes. Which one is larger, right or left?", answer: "The right lobe.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.6") {
        return [
          base,
          { ask: "In the islets of Langerhans, what do the beta cells specifically secrete?", answer: "Insulin (alpha cells, by contrast, secrete glucagon).", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.7") {
        return [
          base,
          { ask: "The colon has three parts based on its path up and across the abdomen. Name them in order.", answer: "Ascending colon, transverse colon, and descending colon.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.8") {
        return [
          base,
          { ask: "What percentage of an adult human's body weight does skin account for?", answer: "About 15%.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.9") {
        return [
          base,
          { ask: "Name one function of the kidney, besides producing urine.", answer: "Any one of: maintaining fluid/electrolyte balance, regulating acid-base balance of blood, maintaining osmotic pressure, or retaining important plasma constituents like glucose and amino acids.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.10") {
        return [
          base,
          { ask: "After the proximal convoluted tubule, what U-shaped structure does the renal tubule pass through next?", answer: "The loop of Henle.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.11") {
        return [
          base,
          { ask: "About how many litres of urine does a healthy person excrete per day?", answer: "About 1 to 2 litres.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.12") {
        return [
          base,
          { ask: "What is the fluid called that results when the secretions of the seminal vesicles, prostate gland and Cowper's glands mix with sperm?", answer: "Semen.", conceptId: concept.id },
        ];
      }
      if (definition.number === 20 && concept.id === "20.13") {
        return [
          base,
          { ask: "What are the two hormones secreted by the ovaries?", answer: "Oestrogen and progesterone.", conceptId: concept.id },
        ];
      }
      if (definition.number === 19 && concept.id === "19.1") {
        return [
          base,
          { ask: "The root of a plant curves and grows toward moisture in the soil. What type of tropism is this?", answer: "Hydrotropism - movement of a plant part toward water.", conceptId: concept.id },
        ];
      }
      if (definition.number === 19 && concept.id === "19.2") {
        return [
          base,
          { ask: "Is a typical plant's shoot positively or negatively geotropic?", answer: "Negatively geotropic - it grows away from gravity, upward (while being positively phototropic, growing toward light).", conceptId: concept.id },
        ];
      }
      if (definition.number === 19 && concept.id === "19.3") {
        return [
          base,
          { ask: "Taraxacum officinale (dandelion) blooms in the morning and closes in the evening. What type of nastic movement is this?", answer: "Photonasty - a non-directional response to light.", conceptId: concept.id },
        ];
      }
      if (definition.number === 19 && concept.id === "19.4") {
        return [
          base,
          { ask: "Which of the two movement types - tropic or nastic - is found in only a few specialized plants, rather than all plants?", answer: "Nastic movements - tropic movements, by contrast, are found in all plants.", conceptId: concept.id },
        ];
      }
      if (definition.number === 19 && concept.id === "19.5") {
        return [
          base,
          { ask: "What gas is released as a byproduct of photosynthesis?", answer: "Oxygen (O2).", conceptId: concept.id },
        ];
      }
      if (definition.number === 19 && concept.id === "19.6") {
        return [
          base,
          { ask: "In the classic leaf experiment, part of a leaf is covered with black paper before being placed in sunlight. When tested with iodine afterward, does the covered part turn blue-black?", answer: "No - the covered part does NOT turn blue-black (no starch formed, since it got no light), while the uncovered part does turn blue-black.", conceptId: concept.id },
        ];
      }
      if (definition.number === 19 && concept.id === "19.7") {
        return [
          base,
          { ask: "Which type of transpiration occurs through the lenticels - tiny openings protruding from the bark in woody stems and twigs?", answer: "Lenticular transpiration.", conceptId: concept.id },
        ];
      }
      if (definition.number === 19 && concept.id === "19.8") {
        return [
          base,
          { ask: "What is the tiny, microscopic pore on a leaf called, through which water vapour and gases pass?", answer: "A stoma (plural: stomata).", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.1") {
        return [
          base,
          { ask: "What is the difference in role between apical meristem and lateral meristem?", answer: "Apical meristem (at root/shoot tips) increases the plant's LENGTH; lateral meristem increases its THICKNESS.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.2") {
        return [
          base,
          { ask: "When parenchyma cells are exposed to light and develop chloroplasts, what is this specific type of parenchyma called?", answer: "Chlorenchyma - parenchyma cells containing chloroplasts, able to photosynthesise.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.3") {
        return [
          base,
          { ask: "Name the four cell types that make up xylem tissue.", answer: "Xylem tracheids, xylem fibres, xylem vessels, and xylem parenchyma.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.4") {
        return [
          base,
          { ask: "What is the main function of phloem's sieve tubes?", answer: "Translocation of food from the leaves to the storage organs of the plant.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.5") {
        return [
          base,
          { ask: "Which type of simple epithelium lines the buccal cavity, lung alveoli, and covers the skin, protecting against mechanical injury and drying?", answer: "Squamous epithelium - thin, flat cells forming a delicate protective lining.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.6") {
        return [
          base,
          { ask: "What is compound epithelium also called, because of its layered structure?", answer: "Stratified epithelium.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.7") {
        return [
          base,
          { ask: "Which connective tissue joins skin to muscles, fills spaces inside organs, and helps repair tissue after an injury?", answer: "Areolar tissue.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.8") {
        return [
          base,
          { ask: "What is the main function of blood platelets?", answer: "They play an important role in the blood clotting mechanism.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.9") {
        return [
          base,
          { ask: "Which muscle type is attached to bones, works under voluntary control, and has an alternating dark/light striped appearance?", answer: "Skeletal (striated) muscle.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.10") {
        return [
          base,
          { ask: "Why can't nerve cells (neurons) undergo cell division?", answer: "Because they lack centrioles - though new neurons can still form from glial cells through a process called neurogenesis.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.11") {
        return [
          base,
          { ask: "In amitosis - the simplest, most direct form of cell division - what happens first: the nucleus elongates and constricts, or the cytoplasm divides first?", answer: "The nucleus elongates and develops a constriction first, dividing into two; the cytoplasm divides afterward.", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.12") {
        return [
          base,
          { ask: "What are the two main divisions of meiosis called?", answer: "Heterotypic division (First Meiotic Division) and Homotypic division (Second Meiotic Division).", conceptId: concept.id },
        ];
      }
      if (definition.number === 18 && concept.id === "18.13") {
        return [
          base,
          { ask: "In mitosis, is the chromosome number in the daughter cells the SAME as the parent cell, or HALF? What about in meiosis?", answer: "Mitosis: the same (2n, diploid). Meiosis: half (n, haploid).", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.1") {
        return [
          base,
          { ask: "Monkeys, baboons, apes and Man belong to different families, but are grouped together because they share several common features. What taxonomic rank are they grouped at?", answer: "Order - specifically Order Primates, which groups related families sharing common characteristics.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.2") {
        return [
          base,
          { ask: "A roundworm has a body cavity, but it isn't a TRUE coelom - it isn't fully lined by mesoderm. What is this kind of cavity called?", answer: "A pseudocoelom (a false body cavity) - making the roundworm a pseudocoelomate.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.3") {
        return [
          base,
          { ask: "What is the scientific (binomial) name for humans?", answer: "Homo sapiens.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.4") {
        return [
          base,
          { ask: "What is the common name for animals in Phylum Porifera?", answer: "Sponges.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.5") {
        return [
          base,
          { ask: "What is the name of the central cavity in a coelenterate's body, where the mouth is surrounded by tentacles?", answer: "The coelenteron (gastrovascular cavity).", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.6") {
        return [
          base,
          { ask: "What grade of body-cavity organization do flatworms (Platyhelminthes) have?", answer: "Acoelomate - they have no body cavity at all.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.7") {
        return [
          base,
          { ask: "Name one human disease caused by a roundworm (nematode), as listed in the book.", answer: "Either elephantiasis or ascariasis.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.8") {
        return [
          base,
          { ask: "What grade of body organization do annelids (like earthworms) have, being the FIRST phylum to achieve it?", answer: "Organ-system grade of organization - annelids are the first true coelomates with this level of organization.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.9") {
        return [
          base,
          { ask: "What excretory organs does an arthropod like a cockroach use?", answer: "Malpighian tubules (or green glands, in some arthropods).", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.10") {
        return [
          base,
          { ask: "A mollusc's body is divided into three main parts. Name them.", answer: "The head, the muscular foot, and the visceral mass.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.11") {
        return [
          base,
          { ask: "What covers the body wall of an echinoderm like a starfish, giving it its characteristic 'spiny skin'?", answer: "Spiny, hard calcareous ossicles.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.12") {
        return [
          base,
          { ask: "What body shape do Hemichordates like Balanoglossus have?", answer: "A soft, worm-like (vermiform), unsegmented body.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.13") {
        return [
          base,
          { ask: "Prochordata is described as 'the forerunners of vertebrates'. What are its two subphyla called?", answer: "Urochordata and Cephalochordata.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.14") {
        return [
          base,
          { ask: "How many chambers does a fish's (Pisces) heart have?", answer: "Two chambers - one auricle and one ventricle.", conceptId: concept.id },
        ];
      }
      if (definition.number === 17 && concept.id === "17.15") {
        return [
          base,
          { ask: "Name two mammals that are exceptions to giving live birth, because they lay eggs instead.", answer: "The Platypus and the Spiny anteater.", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.1") {
        return [
          base,
          { ask: "1 nanometre equals what fraction of a metre?", answer: "1/1,000,000,000 of a metre (10⁻⁹ m).", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.2") {
        return [
          base,
          { ask: "According to the WHO's definition, what is a drug?", answer: "A substance or product used or intended to be used to modify or explore physiological systems or pathological states, for the benefit of the recipient.", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.3") {
        return [
          base,
          { ask: "Nitrous oxide (N2O) is described as the safest of the anaesthetic agents. What category of anaesthetic chemical is it, alongside ether and (formerly) chloroform?", answer: "It's one of the three major chemicals used as anaesthetics, mixed with general anaesthetics like ether during major surgeries.", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.4") {
        return [
          base,
          { ask: "What are the three main natural sources of antibiotics, according to the book?", answer: "Bacteria, fungi, and actinomycetes.", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.5") {
        return [
          base,
          { ask: "In an electrochemical cell, does reduction happen at the anode or the cathode?", answer: "The cathode - reduction (gain of electrons) happens at the cathode, while oxidation (loss of electrons) happens at the anode.", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.6") {
        return [
          base,
          { ask: "Which radioisotope from the book's treatment table is used for cancer AND appears twice - once for diagnosis and once for treatment?", answer: "Cobalt-60 - it's used both to diagnose cancer and to treat it (radiotherapy).", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.7") {
        return [
          base,
          { ask: "What must every dye be resistant to, according to the book's list of dye characteristics, besides being light-fast?", answer: "Water, dilute acids and alkalies - a proper dye must resist all of these without fading or washing out.", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.8") {
        return [
          base,
          { ask: "What does NPK stand for in a chemical fertilizer?", answer: "Nitrogen, Phosphorous, and Potassium - three key nutrients crops need.", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.9") {
        return [
          base,
          { ask: "Monosodium glutamate (MSG) is added to food for what specific function?", answer: "It's a flavour enhancer - it's used to enhance the flavour of food items.", conceptId: concept.id },
        ];
      }
      if (definition.number === 16 && concept.id === "16.10") {
        return [
          base,
          { ask: "What are the four general steps forensic chemists follow when investigating a crime?", answer: "Collection of evidence, analysis of evidence, collaboration with other investigators, and reporting the findings.", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.1") {
        return [
          base,
          { ask: "In 1985, Curl, Kroto and Smalley discovered a new form of carbon shaped like a soccer ball. What is this new allotrope called?", answer: "Fullerene - carbon atoms arranged in a hollow, spherical, soccer-ball-like shape, with the best-known example being Buckminsterfullerene (C60).", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.2") {
        return [
          base,
          { ask: "Ethanol and starch both come from living organisms. What classification of carbon compound is this?", answer: "Organic - carbon compounds obtained from living organisms (plants and animals) are classified as organic.", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.3") {
        return [
          base,
          { ask: "Plastics used in daily life are described as 'macromolecules of catenated carbon compounds'. What does 'catenated' mean here?", answer: "It means the carbon atoms are linked repeatedly to themselves through covalent bonds, forming very long chains - which is exactly what catenation is.", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.4") {
        return [
          base,
          { ask: "In methane (CH4), how many separate covalent bonds does the single carbon atom form with its four hydrogen atoms?", answer: "4 - carbon's tetravalency means it forms exactly four covalent bonds, one with each hydrogen atom in methane.", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.5") {
        return [
          base,
          { ask: "In the two isomers of C2H6O, one has oxygen bonded to a hydrogen and a carbon (an alcohol), and the other has oxygen bonded to two carbons (an ether). What does this show about isomers in general?", answer: "It shows that isomers, despite sharing an identical molecular formula, can have genuinely different structures (different bonding arrangements) and therefore different physical and chemical properties.", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.6") {
        return [
          base,
          { ask: "Diamond is transparent, extremely hard, and does not conduct electricity. What about its atomic structure explains all three of these properties?", answer: "Each carbon atom forms four strong covalent bonds to four other carbons in a rigid, repeating three-dimensional (tetrahedral) lattice, with every electron locked into a bond - explaining diamond's hardness, rigidity and lack of free electrons to conduct electricity.", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.7") {
        return [
          base,
          { ask: "Carbon reacts with sulphur at high temperature to form which compound?", answer: "Carbon disulphide (CS2).", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.8") {
        return [
          base,
          { ask: "Name two real technological breakthroughs the book credits to plastics.", answer: "Any two of: smartphones, computers, the internet, improvements in health care, transport, or food safety.", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.9") {
        return [
          base,
          { ask: "PC (Polycarbonate) plastic contains a chemical called BPA (Bisphenol A). What effect does BPA have on the human body when it leaks out of food/drink containers?", answer: "It increases or decreases certain hormones, changing the way the body works - a form of hormone disruption.", conceptId: concept.id },
        ];
      }
      if (definition.number === 15 && concept.id === "15.10") {
        return [
          base,
          { ask: "According to the book, a cow was found with how much plastic in its stomach, from accidentally eating discarded plastic bags?", answer: "Over 70 kilos of plastic - a real, documented example of the harm plastic litter causes to animals.", conceptId: concept.id },
        ];
      }
      if (definition.number === 14 && concept.id === "14.1") {
        return [
          base,
          { ask: "Acetic acid (CH3COOH) has four hydrogen atoms in its formula, but only one is replaceable in solution. What basicity classification does this give it?", answer: "Monobasic - basicity counts only the REPLACEABLE hydrogens, and acetic acid gives just 1 hydrogen ion per molecule despite having 4 hydrogen atoms total.", conceptId: concept.id },
        ];
      }
      if (definition.number === 14 && concept.id === "14.2") {
        return [
          base,
          { ask: "Acids react with metallic oxides according to the pattern CaO + H2SO4 → CaSO4 + H2O. What two products does an acid always form when it reacts with a metallic oxide?", answer: "A salt and water - metallic oxides react with acids to give salt and water, similar to how a base neutralises an acid.", conceptId: concept.id },
        ];
      }
      if (definition.number === 14 && concept.id === "14.3") {
        return [
          base,
          { ask: "What does the Latin term 'aquaregia' literally mean, and why is that name fitting?", answer: "'King's water' - a fitting name because it can dissolve gold, often called the 'king' of metals, which neither of its two component acids can dissolve alone.", conceptId: concept.id },
        ];
      }
      if (definition.number === 14 && concept.id === "14.4") {
        return [
          base,
          { ask: "NaOH and KOH are both alkalis. Al(OH)3 is a base but NOT an alkali. What is the key difference that makes something an alkali specifically?", answer: "Solubility in water - an alkali is specifically a base that dissolves in water. NaOH and KOH dissolve readily; Al(OH)3 does not, so it's a base but not an alkali.", conceptId: concept.id },
        ];
      }
      if (definition.number === 14 && concept.id === "14.5") {
        return [
          base,
          { ask: "Bases react with non-metallic oxides according to the pattern Ca(OH)2 + CO2 → CaCO3 + H2O. Since this reaction looks just like a base neutralising an acid, what does that tell you about the nature of non-metallic oxides?", answer: "It shows non-metallic oxides are acidic in nature - they react with bases the same way acids do, forming a salt and water.", conceptId: concept.id },
        ];
      }
      if (definition.number === 14 && concept.id === "14.6") {
        return [
          base,
          { ask: "A blue litmus paper is dipped into a solution and turns red. Is the solution acidic or basic?", answer: "Acidic - acids turn blue litmus red (bases turn red litmus blue).", conceptId: concept.id },
        ];
      }
      if (definition.number === 14 && concept.id === "14.7") {
        return [
          base,
          { ask: "Pure water has a pH of exactly 7. What does that tell you about pure water?", answer: "It is neutral - neither acidic nor basic, since pH 7 is exactly the boundary between the two.", conceptId: concept.id },
        ];
      }
      if (definition.number === 14 && concept.id === "14.8") {
        return [
          base,
          { ask: "NaOH + HCl → NaCl + H2O is a case of COMPLETE neutralisation. What type of salt does this produce?", answer: "A normal salt - formed by the complete neutralisation of an acid by a base, unlike an acid salt (partial neutralisation).", conceptId: concept.id },
        ];
      }
      if (definition.number === 14 && concept.id === "14.9") {
        return [
          base,
          { ask: "Why are many salts described as hygroscopic?", answer: "Because they absorb moisture (water) from the surrounding air over time.", conceptId: concept.id },
        ];
      }
      if (definition.number === 13 && concept.id === "13.1") {
        return [
          base,
          { ask: "Why do atoms of elements other than noble gases tend to combine with other atoms at all?", answer: "Because they have an incomplete valence shell and react (by losing, gaining, or sharing electrons) to attain a stable, noble-gas-like configuration of 8 valence electrons - the octet rule.", conceptId: concept.id },
        ];
      }
      if (definition.number === 13 && concept.id === "13.2") {
        return [
          base,
          { ask: "How many dots would you draw around the symbol for beryllium (electronic configuration 2,2) in its Lewis dot structure?", answer: "2 dots - one for each of beryllium's 2 valence electrons, placed on two different sides of the symbol.", conceptId: concept.id },
        ];
      }
      if (definition.number === 13 && concept.id === "13.3") {
        return [
          base,
          { ask: "What is the general name for the type of atom (metal or non-metal) that forms ionic bonds when they react with each other?", answer: "A metal and a non-metal - ionic bonds generally form between them, since metals tend to lose electrons and non-metals tend to gain them.", conceptId: concept.id },
        ];
      }
      if (definition.number === 13 && concept.id === "13.4") {
        return [
          base,
          { ask: "Two hydrogen atoms combine to form H2, sharing just ONE pair of electrons. What type of bond is this, and how is it written in line notation?", answer: "A single covalent bond, written as H-H.", conceptId: concept.id },
        ];
      }
      if (definition.number === 13 && concept.id === "13.5") {
        return [
          base,
          { ask: "According to Fajan's rule, does a LARGER cation charge push a bond toward more ionic character, or more covalent character?", answer: "More covalent character - a greater cation charge increases its ability to distort (polarise) the anion's electron cloud, preventing complete charge separation.", conceptId: concept.id },
        ];
      }
      if (definition.number === 13 && concept.id === "13.6") {
        return [
          base,
          { ask: "How is a coordinate covalent bond represented in a diagram, to show which atom donated the electron pair?", answer: "With an arrow (→) pointing from the donor atom (which supplied both electrons) to the acceptor atom (which received them).", conceptId: concept.id },
        ];
      }
      if (definition.number === 13 && concept.id === "13.7") {
        return [
          base,
          { ask: "In the reaction Fe2+ → Fe3+ + e-, is iron being oxidised or reduced?", answer: "Oxidised - losing an electron is exactly the definition of oxidation.", conceptId: concept.id },
        ];
      }
      if (definition.number === 13 && concept.id === "13.8") {
        return [
          base,
          { ask: "Find the oxidation number of iron (Fe) in FeO, given oxygen is -2.", answer: "+2: x + (-2) = 0, so x = +2.", conceptId: concept.id },
        ];
      }
      if (definition.number === 12 && concept.id === "12.1") {
        return [
          base,
          { ask: "In the lithium-sodium-potassium triad, lithium's atomic mass is 6.9 and potassium's is 39.1. What would Dobereiner's law predict for sodium's atomic mass?", answer: "23: (6.9 + 39.1) / 2 = 23, which matches sodium's real atomic mass almost exactly - this was Dobereiner's own original worked example.", conceptId: concept.id },
        ];
      }
      if (definition.number === 12 && concept.id === "12.2") {
        return [
          base,
          { ask: "Newlands found that sometimes two very different elements, like cobalt and nickel, ended up crammed into the same slot in his table. What does this show about the law of octaves?", answer: "It shows a real limitation of the law - the 'every eighth element' pattern didn't hold perfectly, forcing dissimilar elements into shared positions.", conceptId: concept.id },
        ];
      }
      if (definition.number === 12 && concept.id === "12.3") {
        return [
          base,
          { ask: "In Mendeleev's table, hard metals like copper and silver ended up grouped together with soft metals like sodium and potassium. What kind of problem does this show?", answer: "A real limitation of Mendeleev's table - it grouped elements with genuinely very different properties together, a flaw the modern (atomic-number-based) table later resolved.", conceptId: concept.id },
        ];
      }
      if (definition.number === 12 && concept.id === "12.4") {
        return [
          base,
          { ask: "How many periods and how many groups does the modern periodic table have?", answer: "7 periods (rows) and 18 groups (columns).", conceptId: concept.id },
        ];
      }
      if (definition.number === 12 && concept.id === "12.5") {
        return [
          base,
          { ask: "The lanthanides and actinides, placed at the very bottom of the periodic table, belong to which block?", answer: "The f-block - also called the inner transition elements.", conceptId: concept.id },
        ];
      }
      if (definition.number === 12 && concept.id === "12.6") {
        return [
          base,
          { ask: "Hydrogen is placed at the top of the alkali metals in the periodic table, but it's a gas while alkali metals are solids. What does this show about hydrogen's placement?", answer: "It shows hydrogen's position is imperfect and still debated - it behaves like alkali metals in some ways (losing 1 electron) but differs in obvious physical ways too, like being a gas rather than a solid.", conceptId: concept.id },
        ];
      }
      if (definition.number === 12 && concept.id === "12.7") {
        return [
          base,
          { ask: "Which single metal is liquid at room temperature, unlike almost every other metal?", answer: "Mercury - nearly all other metals are solid at room temperature.", conceptId: concept.id },
        ];
      }
      if (definition.number === 12 && concept.id === "12.8") {
        return [
          base,
          { ask: "When a metal is alloyed specifically with mercury, what is the resulting alloy called?", answer: "An amalgam - a special name reserved just for mercury-containing alloys.", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.1") {
        return [
          base,
          { ask: "A small number of alpha particles bounced almost straight back from the gold foil. What did this prove?", answer: "That the atom has a tiny, extremely dense, positively charged nucleus at its centre - only that could repel a fast alpha particle so strongly.", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.2") {
        return [
          base,
          { ask: "In Bohr's model, does an electron gain or lose energy while it stays within one fixed orbit?", answer: "Neither - it neither gains nor loses energy while it stays in a given stationary orbit, which is exactly what kept Bohr's atom stable.", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.3") {
        return [
          base,
          { ask: "What was Chadwick bombarding with alpha particles when he discovered the neutron in 1932?", answer: "Beryllium - bombarding it with alpha particles released the previously-unknown, electrically neutral particle he named the neutron.", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.4") {
        return [
          base,
          { ask: "Which of the three fundamental particles is found orbiting OUTSIDE the nucleus, rather than inside it?", answer: "The electron - protons and neutrons (the nucleons) are both found inside the nucleus, while electrons occupy the space around it.", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.5") {
        return [
          base,
          { ask: "An element has a mass number of 31 and 16 neutrons. Find its atomic number.", answer: "15: Atomic number = Mass number − Number of neutrons = 31 − 16 = 15 (this is phosphorus).", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.6") {
        return [
          base,
          { ask: "What is the electronic configuration of magnesium (atomic number 12)?", answer: "2, 8, 2: K shell fills to 2, L shell fills to its maximum of 8, and the remaining 12 − 2 − 8 = 2 electrons go into the M shell.", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.7") {
        return [
          base,
          { ask: "Phosphorus's electronic configuration is 2, 8, 5 - five valence electrons. What is its valency?", answer: "3: since phosphorus has more than 4 valence electrons, valency = 8 − 5 = 3.", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.8") {
        return [
          base,
          { ask: "Potassium (atomic number 19, mass number 39) and Calcium (atomic number 20, mass number 40) have different atomic numbers and different mass numbers, so they aren't isotopes or isobars of each other. If they happen to have the same number of neutrons, what would that make them?", answer: "Isotones - atoms with the same number of neutrons but different atomic numbers and different mass numbers.", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.9") {
        return [
          base,
          { ask: "Hydrogen and oxygen each combine separately with a fixed mass of carbon (forming methane, CH4, and carbon dioxide, CO2) in the mass ratio 1:8 - the very same ratio hydrogen and oxygen use when they combine directly to form water (H2O). Which law does this confirm?", answer: "The law of reciprocal proportions - the ratio in which hydrogen and oxygen each separately combine with a fixed mass of a third element (carbon) matches the ratio in which they combine directly with each other.", conceptId: concept.id },
        ];
      }
      if (definition.number === 11 && concept.id === "11.10") {
        return [
          base,
          { ask: "Which quantum number describes a sub-shell's orbital shape - similar to knowing the state or region within a building's country?", answer: "The azimuthal quantum number (l) - it conveys the sub-shell and the shape of the orbital.", conceptId: concept.id },
        ];
      }
      if (definition.number === 10 && concept.id === "10.1") {
        return [
          base,
          { ask: "Diamond is pure carbon - just carbon atoms, nothing else. Is diamond an element or a compound?", answer: "An element - it contains only one kind of atom (carbon), which is exactly the definition of an element.", conceptId: concept.id },
        ];
      }
      if (definition.number === 10 && concept.id === "10.2") {
        return [
          base,
          { ask: "Carbon dioxide (CO2) can be broken down into carbon and oxygen only through a chemical reaction. Is carbon dioxide an element or a compound?", answer: "A compound - needing a chemical reaction to split it into simpler substances (carbon and oxygen) is exactly what defines a compound.", conceptId: concept.id },
        ];
      }
      if (definition.number === 10 && concept.id === "10.3") {
        return [
          base,
          { ask: "A mixture of iron filings and sand can be separated just by using a magnet to pull out the iron, with no chemical reaction needed. What does this tell you about iron and sand mixed together?", answer: "It is a mixture, not a compound - both iron and sand kept their own separate properties (iron still responds to a magnet), and they could be separated by a purely physical method.", conceptId: concept.id },
        ];
      }
      if (definition.number === 10 && concept.id === "10.4") {
        return [
          base,
          { ask: "Steel (iron mixed with a small amount of carbon) looks completely uniform throughout, with no visible separate particles anywhere. Is steel a homogeneous or heterogeneous mixture?", answer: "Homogeneous - its components are mixed so thoroughly that no separate particles can be seen anywhere in the sample.", conceptId: concept.id },
        ];
      }
      if (definition.number === 10 && concept.id === "10.5") {
        return [
          base,
          { ask: "In a pathology lab, a blood sample is spun at very high speed in a machine to separate the blood cells from the liquid plasma. Which separation method is this?", answer: "Centrifugation - spinning at high speed pushes the denser blood cells outward/down, separating them from the lighter plasma.", conceptId: concept.id },
        ];
      }
      if (definition.number === 10 && concept.id === "10.6") {
        return [
          base,
          { ask: "Crude petroleum contains many different liquids whose boiling points are all fairly close together (within about 25 K of each other). Which distillation method is used to separate them into different fractions?", answer: "Fractional distillation - used specifically when the liquids' boiling points are close together (differing by less than 25 K), unlike simple distillation.", conceptId: concept.id },
        ];
      }
      if (definition.number === 10 && concept.id === "10.7") {
        return [
          base,
          { ask: "Starch stirred into water forms a cloudy mixture that never settles, and a light beam shone through it becomes visible as it crosses the liquid. Is starch-in-water a true solution, colloid, or suspension?", answer: "A colloid - its particles are too small to settle but big enough to scatter light visibly (the Tyndall effect), unlike a true solution's much smaller, non-scattering particles.", conceptId: concept.id },
        ];
      }
      if (definition.number === 10 && concept.id === "10.8") {
        return [
          base,
          { ask: "Fog is made of tiny liquid water droplets dispersed throughout the air (a gas). What type of colloid is this called?", answer: "An aerosol - the name for a colloid where a liquid (or solid) is dispersed in a gas.", conceptId: concept.id },
        ];
      }
      if (definition.number === 10 && concept.id === "10.9") {
        return [
          base,
          { ask: "In mayonnaise, tiny droplets of oil are dispersed throughout a watery mixture (egg, vinegar). Is this an oil-in-water or water-in-oil emulsion?", answer: "Oil-in-water (O/W) - the oil forms the scattered droplets, and the watery mixture is the continuous medium they're dispersed in.", conceptId: concept.id },
        ];
      }
      if (definition.number === 9 && concept.id === "9.1") {
        return [
          base,
          { ask: "About how many light years across is the observable universe, and what does 'observable' mean here?", answer: "About 93 billion light years across. 'Observable' means the part scientists can actually detect - the true size of the whole universe is unknown, and could be infinite.", conceptId: concept.id },
        ];
      }
      if (definition.number === 9 && concept.id === "9.2") {
        return [
          base,
          { ask: "What is the name of the galaxy closest to our own Milky Way?", answer: "The Andromeda galaxy - our nearest neighbouring galaxy, roughly 2.5 million light years away.", conceptId: concept.id },
        ];
      }
      if (definition.number === 9 && concept.id === "9.3") {
        return [
          base,
          { ask: "Roughly what fraction of the Sun is hydrogen, and what fraction is helium?", answer: "About three-quarters (75%) hydrogen and about one-quarter (25%) helium.", conceptId: concept.id },
        ];
      }
      if (definition.number === 9 && concept.id === "9.4") {
        return [
          base,
          { ask: "Mars has a solid rocky surface and lies relatively close to the Sun. Which group of planets does it belong to?", answer: "The inner (terrestrial) planets - along with Mercury, Venus and Earth, all close together near the Sun with solid rocky surfaces.", conceptId: concept.id },
        ];
      }
      if (definition.number === 9 && concept.id === "9.5") {
        return [
          base,
          { ask: "Where in the solar system is most of the asteroid belt located, and roughly how big is the largest known asteroid, Ceres?", answer: "In the gap between the orbits of Mars and Jupiter. Ceres, the biggest asteroid, is about 946 km across.", conceptId: concept.id },
        ];
      }
      if (definition.number === 9 && concept.id === "9.6") {
        return [
          base,
          { ask: "A satellite is moved from a lower orbit to a much higher one. Does its required orbital velocity increase or decrease?", answer: "It decreases - the farther a satellite is from Earth, the lower the orbital velocity it needs to maintain a stable circular orbit.", conceptId: concept.id },
        ];
      }
      if (definition.number === 9 && concept.id === "9.7") {
        return [
          base,
          { ask: "The ISS orbits at about 400 km altitude and takes roughly 90 minutes to complete one orbit, while a geostationary satellite takes 24 hours. Which one is closer to Earth, and how does that connect to its shorter time period?", answer: "The ISS is much closer to Earth. Closer satellites need higher orbital velocity and travel a shorter path around the planet, so they complete each orbit much faster - giving the ISS its short roughly 90-minute time period.", conceptId: concept.id },
        ];
      }
      if (definition.number === 9 && concept.id === "9.8") {
        return [
          base,
          { ask: "According to Kepler's Second Law (equal areas in equal times), does a planet move faster or slower when it is closest to the Sun (at perihelion)?", answer: "Faster - to sweep out the same area in the same time near the Sun (where it is closer) as it does far from the Sun, the planet must move more quickly at its closest point.", conceptId: concept.id },
        ];
      }
      if (definition.number === 9 && concept.id === "9.9") {
        return [
          base,
          { ask: "Roughly how high above Earth does the ISS orbit, and in what year did it become continuously crewed by humans?", answer: "About 400 km above Earth, and it has been continuously crewed since 2000, when the first human crew arrived.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.1") {
        return [
          base,
          { ask: "If you strike a bell inside a sealed glass jar and then slowly pump all the air out, what happens to the sound you hear?", answer: "It gradually fades to nothing, because the air (the medium carrying the vibrations) is being removed - once the jar is fully evacuated, no sound reaches your ear at all.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.2") {
        return [
          base,
          { ask: "As a sound wave travels through air, do the individual air molecules travel all the way from the source to your ear, or just vibrate in place?", answer: "They just vibrate back and forth around their own position - it is the disturbance (the compressions and rarefactions) that travels to your ear, not the molecules themselves.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.3") {
        return [
          base,
          { ask: "A sound wave has a time period of 0.005 s. What is its frequency?", answer: "200 Hz: frequency n = 1/T = 1/0.005 = 200 Hz.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.4") {
        return [
          base,
          { ask: "Two singers hit the exact same musical note, but one sounds unmistakably different from the other. Which characteristic of sound explains this, if it is not loudness or pitch?", answer: "Timbre (quality) - it is what lets you tell two voices or instruments apart even when they produce the same note at the same loudness.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.5") {
        return [
          base,
          { ask: "A sound wave in water has a frequency of 1000 Hz and a wavelength of 1.5 m. Find its speed.", answer: "1500 m/s: v = nλ = 1000 × 1.5 = 1500 m/s - close to the real speed of sound in water.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.6") {
        return [
          base,
          { ask: "A stethoscope's tube carries faint body sounds to a doctor's ears using which property of sound?", answer: "Reflection - the sound waves reflect repeatedly off the inside walls of the tube, being guided along it to the doctor's ears.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.7") {
        return [
          base,
          { ask: "What is the minimum distance a reflecting wall must be from a listener for them to hear a distinct echo, given sound travels at 340 m/s and takes at least 0.1 s to be distinguished from the original sound?", answer: "17 m: the round trip must cover at least 340 × 0.1 = 34 m, and the wall itself is half that distance away, 17 m.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.8") {
        return [
          base,
          { ask: "A completely empty, bare concrete room makes even a normal conversation sound echo-y and hard to follow. What is this effect called, and what causes it?", answer: "Reverberation - caused by sound reflecting repeatedly off the hard, bare concrete surfaces instead of being absorbed.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.9") {
        return [
          base,
          { ask: "Doctors use ultrasonic waves to form a moving image of a beating heart. What is this technique called?", answer: "Echocardiography - ultrasonic waves reflect off the heart's structures and are used to build the image.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.10") {
        return [
          base,
          { ask: "What does the acronym SONAR stand for, and what does it use to find underwater objects?", answer: "SOund Navigation And Ranging - it uses ultrasonic waves, sent out and reflected back, to find the distance, direction and speed of underwater objects.", conceptId: concept.id },
        ];
      }
      if (definition.number === 8 && concept.id === "8.11") {
        return [
          base,
          { ask: "What job do the three tiny bones (hammer, anvil and stirrup) do in the middle ear?", answer: "They amplify the eardrum's vibrations before passing them on to the inner ear, so faint sounds are strong enough for the cochlea to convert into electrical signals.", conceptId: concept.id },
        ];
      }
      if (definition.number === 6 && concept.id === "6.1") {
        return [
          base,
          { ask: "A ray strikes a plane mirror at 40 degrees to the mirror's surface. What is the angle of reflection, measured from the normal?", answer: "50 degrees: from the surface it is 40 degrees, so from the normal it is 90 - 40 = 50 degrees, and the angle of reflection always equals the angle of incidence.", conceptId: concept.id },
        ];
      }
      if (definition.number === 6 && concept.id === "6.2") {
        return [
          base,
          { ask: "A ray travels through a concave mirror's principal focus and strikes the mirror. Which way does it reflect?", answer: "Parallel to the principal axis - ray rule 2 says a ray passing through the focus reflects back parallel to the axis, the reverse of the parallel-in rule.", conceptId: concept.id },
        ];
      }
      if (definition.number === 6 && concept.id === "6.3") {
        return [
          base,
          { ask: "An object sits 30 cm from a concave mirror with a focal length of 10 cm. Use 1/v + 1/u = 1/f (u = -30 cm, f = -10 cm) to find v.", answer: "v = -15 cm: 1/v = 1/f - 1/u = 1/(-10) - 1/(-30) = -0.1 + 0.0333 = -0.0667, so v = -15 cm - a real, inverted image.", conceptId: concept.id },
        ];
      }
      if (definition.number === 6 && concept.id === "6.4") {
        return [
          base,
          { ask: "A driver looks in a convex side mirror and a cyclist appears small and far away, though the cyclist is actually much closer. Why?", answer: "A convex mirror always shrinks the image it forms - that is why cars carry the warning 'objects in mirror are closer than they appear'.", conceptId: concept.id },
        ];
      }
      if (definition.number === 6 && concept.id === "6.5") {
        return [
          base,
          { ask: "About how fast does light travel, and could you notice its travel time crossing an ordinary room?", answer: "About 300,000 km per second - so fast that crossing a room takes a fraction of a billionth of a second, far too short for a person to ever notice.", conceptId: concept.id },
        ];
      }
      if (definition.number === 6 && concept.id === "6.6") {
        return [
          base,
          { ask: "A beam of light enters a glass block from air. Does it speed up or slow down, and which way does it bend?", answer: "It slows down, and bends toward the normal - light entering a denser medium (air to glass) always slows and bends toward the normal.", conceptId: concept.id },
        ];
      }
      if (definition.number === 6 && concept.id === "6.7") {
        return [
          base,
          { ask: "Light inside water hits the water-air surface at an angle greater than water's critical angle. What happens to it?", answer: "It undergoes total internal reflection - none of it escapes into the air; all of it reflects back into the water, because the angle exceeds the critical angle.", conceptId: concept.id },
        ];
      }
      return [base];
    }),
    writtenPractice: definition.concepts.map((concept) => ({ question: `Write and explain: ${concept.example.question}`, answer: concept.example.answer, conceptId: concept.id })),
    assessmentStory: frameFor(definition.concepts[0]),
    assessment: { partA: definition.concepts.map((concept) => makeTask(definition, concept, "Test")), partB: unit4PartB(definition) },
    readymade: concepts.map((concept) => ({ q: `What is ${concept.title}?`, a: concept.summary })),
    chatAnswers: concepts.map((concept) => ({ question: `What is ${concept.title}?`, answer: concept.summary, keywords: concept.title.toLowerCase().split(/\s+/).filter((word) => word.length > 2), conceptId: concept.conceptId })),
  };
}

export const PENDING_TAMILNADU_9_SCIENCE_UNITS: Record<string, BoardUnit> = Object.fromEntries(
  SCIENCE_DEFINITIONS.map((definition) => {
    const unit = makeUnit(definition);
    return [unit.unitKey, unit];
  }),
) as Record<string, BoardUnit>;
