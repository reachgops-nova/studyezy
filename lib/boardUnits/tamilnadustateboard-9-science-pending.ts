import type { BoardFrame, BoardTask, BoardUnit } from "./types";

/**
 * The 2024 Tamil Nadu Standard IX Science contents map. Unit 1 is the first
 * fully authored Board lesson; these source-grounded unit shells make Units
 * 2–24 available in the same Read -> Cover -> Recite -> Test template while
 * their page-specific worked examples are deepened from the textbook.
 *
 * This is deliberately data, not a second Science player. Future units add
 * richer frames/examples here and keep the renderer unchanged.
 */
type ScienceConcept = { id: string; title: string; icon: string; summary: string; example: { question: string; answer: string }; frame?: BoardFrame };

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
    4: { src: "/board-art/tn9-science-atlas-2-4.png", panel: 2 },
    5: { src: "/board-art/tn9-science-atlas-5-7.png", panel: 0 },
    // Unit 6 is light, so it intentionally keeps its dedicated reflection/refraction frame.
    7: { src: "/board-art/tn9-science-atlas-5-7.png", panel: 1 },
    8: { src: "/board-art/tn9-science-atlas-5-7.png", panel: 2 },
    9: { src: "/board-art/tn9-science-atlas-8-10.png", panel: 0 },
    10: { src: "/board-art/tn9-science-atlas-8-10.png", panel: 1 },
    11: { src: "/board-art/tn9-science-atlas-8-10.png", panel: 2 },
    12: { src: "/board-art/tn9-science-atlas-11-13.png", panel: 0 },
    13: { src: "/board-art/tn9-science-atlas-11-13.png", panel: 1 },
    14: { src: "/board-art/tn9-science-atlas-11-13.png", panel: 2 },
    15: { src: "/board-art/tn9-science-atlas-14-16.png", panel: 0 },
    16: { src: "/board-art/tn9-science-atlas-14-16.png", panel: 1 },
  };
  const selected = atlasByUnit[definition.number];
  if (!selected) return undefined;
  const atlas = selected.src;
  const panel = selected.panel;
  const focus = definition.number <= 4
    ? { x: 0, y: panel * 33.34, w: 100, h: 33.34 }
    : { x: panel * 33.34, y: 0, w: 33.34, h: 100 };
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
      { label: "Field lines", at: [10, 24], tone: "blue", note: "The field is strongest where the lines are closest near the poles." },
      { label: "Electromagnet", at: [19, 48], tone: "gold", note: "Current through a coil creates a magnetic field that can lift clips." },
      { label: "Motor", at: [18, 86], tone: "green", note: "Electrical energy makes the coil rotate in a magnetic field." },
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
      { label: "Vibration", at: [84, 15], tone: "gold", note: "Sound begins when an object vibrates the surrounding medium." },
      { label: "Amplitude", at: [76, 48], tone: "red", note: "A taller wave represents a larger amplitude and a louder sound." },
      { label: "Frequency", at: [87, 83], tone: "blue", note: "More cycles in the same time mean greater frequency and higher pitch." },
    ],
    9: [
      { label: "Orbit", at: [20, 26], tone: "blue", note: "Gravity keeps planets moving in their orbits around the Sun." },
      { label: "Moon phases", at: [16, 67], tone: "gold", note: "The Moon appears to change shape as its sunlit half is viewed from Earth." },
      { label: "Telescope", at: [84, 53], tone: "green", note: "A telescope collects more light so distant objects can be observed." },
    ],
    10: [
      { label: "Solid", at: [49, 20], tone: "blue", note: "Particles in a solid are closely packed and vibrate in fixed positions." },
      { label: "Liquid", at: [50, 52], tone: "green", note: "Liquid particles stay close but slide past one another." },
      { label: "Gas", at: [50, 84], tone: "red", note: "Gas particles are far apart and move freely in all directions." },
    ],
    11: [
      { label: "Nucleus", at: [85, 21], tone: "gold", note: "Almost all the atom's mass is concentrated in its tiny nucleus." },
      { label: "Electron shell", at: [88, 54], tone: "blue", note: "Electrons occupy regions of space around the nucleus." },
      { label: "Spectrum", at: [85, 86], tone: "green", note: "Light from excited atoms produces characteristic spectral lines." },
    ],
    12: [
      { label: "Periodic table", at: [12, 22], tone: "blue", note: "Elements are arranged by increasing atomic number and repeating properties." },
      { label: "Group", at: [21, 56], tone: "gold", note: "Elements in a group have similar outer-electron patterns." },
      { label: "Period", at: [12, 84], tone: "green", note: "A period shows the number of occupied electron shells." },
    ],
    13: [
      { label: "Electron transfer", at: [50, 21], tone: "gold", note: "Ionic bonding forms when electrons transfer and oppositely charged ions attract." },
      { label: "Shared pair", at: [50, 55], tone: "blue", note: "Covalent bonding forms when atoms share electrons." },
      { label: "Molecule", at: [86, 82], tone: "green", note: "A molecule is a stable group of atoms held together by shared electrons." },
    ],
    14: [
      { label: "Acid", at: [84, 20], tone: "red", note: "An acid changes blue litmus red and has a pH below 7." },
      { label: "Neutralisation", at: [84, 52], tone: "gold", note: "An acid and a base react to form salt and water." },
      { label: "Crystals", at: [84, 84], tone: "green", note: "Dissolved salt can be recovered as crystals when water evaporates." },
    ],
    15: [
      { label: "Carbon chain", at: [16, 22], tone: "blue", note: "Carbon atoms bond into chains and rings, creating many compounds." },
      { label: "Combustion", at: [18, 58], tone: "gold", note: "Carbon compounds burn in oxygen to release energy and form new substances." },
      { label: "Molecule", at: [17, 84], tone: "green", note: "The shape and bonding of a molecule help determine its properties." },
    ],
    16: [
      { label: "Micelle", at: [50, 24], tone: "blue", note: "Soap molecules surround grease so it can be carried away by water." },
      { label: "Fertiliser", at: [50, 58], tone: "green", note: "Fertilisers supply nutrients that support healthy plant growth." },
      { label: "Medicine", at: [84, 84], tone: "gold", note: "Chemistry helps formulate medicines and preserve useful products safely." },
    ],
  };
  return imageFrame(atlas, `${definition.title} · ${concept.title}`, `HD conceptual visual for ${concept.title}`, presets[definition.number] ?? [], focus);
}

/** Topic infographics: each textbook domain has its own visual language. */
function scienceVisualFrame(definition: ScienceDefinition, concept: ScienceConcept, index: number): BoardFrame {
  const atlasFrame = codexAtlasFrame(definition, concept);
  if (atlasFrame) return atlasFrame;
  if (concept.frame) return concept.frame;
  const blue = "#38bdf8", gold = "#f59e0b", green = "#34d399", pink = "#f472b6", ink = "#0b1329";
  let title = concept.title;
  let svg = "";
  let labels: { label: string; at: [number, number]; tone?: "gold" | "green" | "red" | "blue" }[] = [];
  switch (definition.number) {
    case 4:
      title = "Electric circuit · charge to useful work";
      svg = `<path d="M100 80H420V175H100Z" fill="none" stroke="${blue}" stroke-width="6"/><circle cx="100" cy="128" r="25" fill="${gold}" stroke="white" stroke-width="3"/><path d="M100 103V80M100 153v22M420 80V55M420 175v25" stroke="white" stroke-width="5"/><rect x="255" y="63" width="54" height="40" rx="8" fill="${green}"/><path d="M282 103v25" stroke="white" stroke-width="5"/><path d="M218 128h42M322 128h98" stroke="${gold}" stroke-width="7" stroke-dasharray="14 9"/>`;
      labels = [{ label: "Cell", at: [100, 128], tone: "gold" }, { label: "Current path", at: [180, 80], tone: "blue" }, { label: "Bulb/load", at: [282, 63], tone: "green" }]; break;
    case 5:
      title = "Magnetic field around a current-carrying wire";
      svg = `<circle cx="260" cy="125" r="90" fill="none" stroke="${blue}" stroke-width="4" stroke-dasharray="14 8"/><circle cx="260" cy="125" r="55" fill="none" stroke="${green}" stroke-width="4" stroke-dasharray="11 7"/><circle cx="260" cy="125" r="18" fill="${pink}"/><path d="M260 22V228" stroke="${gold}" stroke-width="10"/><path d="M260 34l-10 18h20zM260 216l-10-18h20z" fill="${gold}"/>`;
      labels = [{ label: "Current", at: [260, 34], tone: "gold" }, { label: "Field line", at: [350, 83], tone: "blue" }, { label: "Direction", at: [260, 125], tone: "green" }]; break;
    case 6:
      title = "Reflection · incident ray, normal and reflected ray";
      svg = `<path d="M260 32V215M90 180H440" stroke="white" stroke-width="4"/><path d="M120 80L260 180L398 82" fill="none" stroke="${gold}" stroke-width="6" stroke-dasharray="12 8"/><path d="M260 180L260 120" stroke="${blue}" stroke-width="4" stroke-dasharray="8 7"/><path d="M238 155h22M260 155h22" stroke="${green}" stroke-width="3"/>`;
      labels = [{ label: "Incident ray", at: [150, 95], tone: "gold" }, { label: "Normal", at: [270, 125], tone: "blue" }, { label: "Reflected ray", at: [350, 95], tone: "green" }]; break;
    case 7:
      title = "Heat transfer · conduction, convection and radiation";
      svg = `<rect x="65" y="155" width="110" height="35" rx="8" fill="${gold}"/><path d="M175 172H350" stroke="${blue}" stroke-width="10" stroke-dasharray="16 9"/><path d="M390 190C330 145 430 115 365 72M405 205C355 165 440 140 390 100" fill="none" stroke="${pink}" stroke-width="7"/><circle cx="160" cy="65" r="42" fill="${gold}"/><path d="M160 8v-20M160 142v20M103 65H83M237 65h20" stroke="${gold}" stroke-width="6"/>`;
      labels = [{ label: "Conduction", at: [230, 150], tone: "blue" }, { label: "Convection", at: [400, 130], tone: "red" }, { label: "Radiation", at: [160, 65], tone: "gold" }]; break;
    case 8:
      title = "Sound wave · vibration, amplitude and frequency";
      svg = `<path d="M45 125H475" stroke="#64748b" stroke-width="3"/><path d="M45 125C80 35 115 215 150 125S220 35 255 125S325 215 360 125S430 35 475 125" fill="none" stroke="${blue}" stroke-width="6"/><path d="M45 45V205M150 45V205" stroke="${gold}" stroke-width="3" stroke-dasharray="7 7"/>`;
      labels = [{ label: "Amplitude", at: [45, 50], tone: "gold" }, { label: "Wavelength", at: [100, 215], tone: "green" }, { label: "Vibration", at: [270, 115], tone: "blue" }]; break;
    case 9:
      title = "Solar system · gravity keeps orbits";
      svg = `<circle cx="260" cy="125" r="28" fill="${gold}"/><ellipse cx="260" cy="125" rx="90" ry="42" fill="none" stroke="${blue}" stroke-width="3"/><ellipse cx="260" cy="125" rx="160" ry="78" fill="none" stroke="${green}" stroke-width="3"/><circle cx="350" cy="125" r="10" fill="${blue}"/><circle cx="420" cy="125" r="14" fill="${pink}"/><path d="M340 108l18 17-18 17" fill="none" stroke="${gold}" stroke-width="4"/>`;
      labels = [{ label: "Sun", at: [260, 125], tone: "gold" }, { label: "Orbit", at: [350, 90], tone: "blue" }, { label: "Gravity", at: [385, 125], tone: "green" }]; break;
    case 10:
      title = "Matter · particle arrangements";
      svg = `<rect x="45" y="58" width="125" height="135" rx="10" fill="#123d59" stroke="${blue}" stroke-width="3"/><rect x="197" y="58" width="125" height="135" rx="10" fill="#30205c" stroke="${pink}" stroke-width="3"/><rect x="349" y="58" width="125" height="135" rx="10" fill="#123d3a" stroke="${green}" stroke-width="3"/>${Array.from({length:6},(_,i)=>`<circle cx="${75+(i%2)*55}" cy="${85+Math.floor(i/2)*43}" r="9" fill="${blue}"/><circle cx="${225+(i%2)*55}" cy="${85+Math.floor(i/2)*43}" r="9" fill="${pink}"/>`).join("")}<circle cx="375" cy="75" r="8" fill="${green}"/><circle cx="440" cy="180" r="8" fill="${green}"/>`;
      labels = [{ label: "Solid", at: [105, 210], tone: "blue" }, { label: "Liquid", at: [257, 210], tone: "red" }, { label: "Gas", at: [412, 210], tone: "green" }]; break;
    case 11:
      title = "Atom · nucleus and electron shells";
      svg = `<circle cx="260" cy="125" r="25" fill="${pink}"/><ellipse cx="260" cy="125" rx="85" ry="38" fill="none" stroke="${blue}" stroke-width="4"/><ellipse cx="260" cy="125" rx="145" ry="65" fill="none" stroke="${gold}" stroke-width="4" transform="rotate(-35 260 125)"/><circle cx="345" cy="125" r="9" fill="${blue}"/><circle cx="380" cy="72" r="9" fill="${gold}"/><circle cx="175" cy="178" r="9" fill="${gold}"/>`;
      labels = [{ label: "Nucleus", at: [260, 125], tone: "red" }, { label: "Electron shell", at: [350, 118], tone: "blue" }, { label: "Electron", at: [380, 72], tone: "gold" }]; break;
    case 12:
      title = "Periodic table · groups and periods";
      svg = Array.from({length:4},(_,row)=>Array.from({length:8},(_,col)=>`<rect x="${55+col*52}" y="${42+row*42}" width="42" height="32" rx="4" fill="${(col+row)%3===0?blue:(col+row)%3===1?green:gold}" opacity=".85"/>`).join("")).join("");
      labels = [{ label: "Group", at: [465, 55], tone: "gold" }, { label: "Period", at: [70, 220], tone: "blue" }, { label: "Similar properties", at: [260, 110], tone: "green" }]; break;
    case 13:
      title = "Chemical bonding · transfer and sharing";
      svg = `<circle cx="170" cy="125" r="52" fill="${blue}"/><circle cx="350" cy="125" r="52" fill="${pink}"/><circle cx="260" cy="125" r="13" fill="${gold}"/><path d="M222 125h25M273 125h25" stroke="${gold}" stroke-width="8" stroke-dasharray="8 6"/><path d="M170 52v-28M350 52v-28" stroke="white" stroke-width="3"/>`;
      labels = [{ label: "Ion", at: [170, 125], tone: "blue" }, { label: "Shared pair", at: [260, 125], tone: "gold" }, { label: "Covalent bond", at: [350, 125], tone: "red" }]; break;
    case 14:
      title = "Acids, bases and pH · indicator colour";
      svg = `<rect x="55" y="105" width="410" height="45" rx="22" fill="url(#ph)"/><defs><linearGradient id="ph"><stop offset="0" stop-color="#ef4444"/><stop offset=".5" stop-color="#facc15"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs><path d="M105 80v95M260 80v95M415 80v95" stroke="white" stroke-width="3" stroke-dasharray="7 6"/><circle cx="105" cy="128" r="16" fill="white"/><circle cx="415" cy="128" r="16" fill="white"/>`;
      labels = [{ label: "Acid", at: [105, 70], tone: "red" }, { label: "Neutral", at: [260, 70], tone: "gold" }, { label: "Base", at: [415, 70], tone: "blue" }]; break;
    case 15:
      title = "Carbon compounds · chains and functional groups";
      svg = `<path d="M90 125L170 75L250 125L330 75L410 125" fill="none" stroke="${blue}" stroke-width="8"/><circle cx="90" cy="125" r="19" fill="${gold}"/><circle cx="170" cy="75" r="19" fill="${gold}"/><circle cx="250" cy="125" r="19" fill="${gold}"/><circle cx="330" cy="75" r="19" fill="${gold}"/><circle cx="410" cy="125" r="19" fill="${pink}"/>`;
      labels = [{ label: "Carbon chain", at: [250, 170], tone: "gold" }, { label: "Covalent links", at: [170, 75], tone: "blue" }, { label: "Functional group", at: [410, 125], tone: "red" }]; break;
    case 16:
      title = "Applied chemistry · raw materials to useful products";
      svg = `<path d="M80 125H170M260 125H350" stroke="${gold}" stroke-width="8" stroke-dasharray="15 8"/><rect x="45" y="85" width="70" height="80" rx="12" fill="${blue}"/><path d="M195 85h70v80h-70z" fill="${green}"/><path d="M375 85h70v80h-70z" fill="${pink}"/>`;
      labels = [{ label: "Raw material", at: [80, 185], tone: "blue" }, { label: "Chemical process", at: [230, 75], tone: "green" }, { label: "Useful product", at: [410, 185], tone: "red" }]; break;
    case 17:
      title = "Animal kingdom · classification tree";
      svg = `<path d="M260 48V90M260 90L125 160M260 90L395 160M125 160V205M395 160V205" stroke="${green}" stroke-width="5"/><circle cx="260" cy="42" r="25" fill="${gold}"/><circle cx="125" cy="175" r="25" fill="${blue}"/><circle cx="395" cy="175" r="25" fill="${pink}"/>`;
      labels = [{ label: "Animal", at: [260, 42], tone: "gold" }, { label: "Non-chordate", at: [125, 215], tone: "blue" }, { label: "Chordate", at: [395, 215], tone: "red" }]; break;
    case 18:
      title = "Organisation of tissues · cells working together";
      svg = `<rect x="55" y="65" width="100" height="100" rx="12" fill="${green}" opacity=".75"/><rect x="210" y="65" width="100" height="100" rx="12" fill="${pink}" opacity=".75"/><rect x="365" y="65" width="100" height="100" rx="12" fill="${blue}" opacity=".75"/><path d="M155 115h55M310 115h55" stroke="${gold}" stroke-width="7" stroke-dasharray="12 7"/><circle cx="105" cy="115" r="22" fill="${ink}"/><circle cx="260" cy="115" r="22" fill="${ink}"/><circle cx="415" cy="115" r="22" fill="${ink}"/>`;
      labels = [{ label: "Cells", at: [105, 195], tone: "green" }, { label: "Tissue", at: [260, 195], tone: "red" }, { label: "Organ", at: [415, 195], tone: "blue" }]; break;
    case 19:
      title = "Plant physiology · leaf, light and gas exchange";
      svg = `<path d="M260 210V90M260 120C160 45 85 75 100 150C170 175 230 160 260 120ZM260 120C360 45 435 75 420 150C350 175 290 160 260 120Z" fill="${green}" opacity=".75" stroke="${green}" stroke-width="4"/><circle cx="260" cy="55" r="25" fill="${gold}"/><path d="M210 55h-55M310 55h55M260 28V5" stroke="${gold}" stroke-width="5"/>`;
      labels = [{ label: "Sunlight", at: [260, 55], tone: "gold" }, { label: "Leaf", at: [150, 125], tone: "green" }, { label: "Stomata", at: [330, 150], tone: "blue" }]; break;
    case 20:
      title = "Organ systems · digestion and excretion";
      svg = `<path d="M165 45C115 90 175 110 145 145C120 175 180 192 170 220" fill="none" stroke="${pink}" stroke-width="13" stroke-linecap="round"/><path d="M330 58C300 85 340 110 310 140C285 170 340 190 330 220" fill="none" stroke="${blue}" stroke-width="13" stroke-linecap="round"/><circle cx="165" cy="45" r="18" fill="${gold}"/><circle cx="330" cy="58" r="18" fill="${gold}"/>`;
      labels = [{ label: "Digestive path", at: [165, 145], tone: "red" }, { label: "Kidney path", at: [330, 140], tone: "blue" }, { label: "Absorb / filter", at: [250, 220], tone: "gold" }]; break;
    case 21:
      if (concept.id === "21.1") {
        title = "Nutrients and deficiency · what the body needs";
        svg = `<circle cx="260" cy="125" r="78" fill="#fbbf24" stroke="#fff" stroke-width="5"/><path d="M260 47v156M182 125h156" stroke="#fff" stroke-width="4"/><circle cx="220" cy="88" r="22" fill="#f97316"/><circle cx="300" cy="88" r="22" fill="#22c55e"/><circle cx="220" cy="162" r="22" fill="#ef4444"/><circle cx="300" cy="162" r="22" fill="#3b82f6"/>`;
        labels = [{ label: "Vitamin A", at: [220, 88], tone: "gold" }, { label: "Iron", at: [300, 88], tone: "green" }, { label: "Vitamin C", at: [220, 162], tone: "red" }, { label: "Vitamin D", at: [300, 162], tone: "blue" }];
      } else if (concept.id === "21.2") {
        title = "Food preservation · slow spoilage";
        svg = `<path d="M80 130H440" stroke="${gold}" stroke-width="6"/><circle cx="110" cy="130" r="30" fill="${blue}"/><circle cx="260" cy="130" r="30" fill="${green}"/><circle cx="410" cy="130" r="30" fill="${pink}"/><path d="M140 130h85M290 130h85" stroke="white" stroke-width="5" stroke-dasharray="12 8"/>`;
        labels = [{ label: "Drying", at: [110, 190], tone: "blue" }, { label: "Freezing", at: [260, 190], tone: "green" }, { label: "Canning", at: [410, 190], tone: "red" }];
      } else {
        title = "Food safety · from source to plate";
        svg = `<circle cx="100" cy="125" r="38" fill="${green}"/><path d="M140 125H370" stroke="${gold}" stroke-width="7" stroke-dasharray="15 8"/><circle cx="420" cy="125" r="38" fill="${blue}"/><path d="M390 125l20 20 40-45" fill="none" stroke="white" stroke-width="8"/>`;
        labels = [{ label: "Safe food", at: [100, 190], tone: "green" }, { label: "Adulteration risk", at: [260, 80], tone: "gold" }, { label: "Check label", at: [420, 190], tone: "blue" }];
      } break;
    case 22:
      title = "World of microbes · useful and harmful roles";
      svg = `<circle cx="125" cy="125" r="42" fill="${blue}"/><circle cx="260" cy="125" r="42" fill="${green}"/><circle cx="395" cy="125" r="42" fill="${pink}"/><path d="M92 95l-25-20M158 95l25-20M227 160l-25 22M293 90l25-20M362 160l-25 22M428 90l25-20" stroke="white" stroke-width="6"/>`;
      labels = [{ label: "Bacteria", at: [125, 195], tone: "blue" }, { label: "Fungus", at: [260, 195], tone: "green" }, { label: "Virus", at: [395, 195], tone: "red" }]; break;
    case 23:
      title = "Economic biology · growing systems";
      svg = `<path d="M70 180H450" stroke="#64748b" stroke-width="6"/><path d="M120 180V120M260 180V120M400 180V120" stroke="${blue}" stroke-width="8"/><path d="M80 90Q120 40 160 90M220 90Q260 40 300 90M360 90Q400 40 440 90" fill="none" stroke="${green}" stroke-width="8"/><path d="M120 180V215M260 180V215M400 180V215" stroke="${gold}" stroke-width="7"/>`;
      labels = [{ label: "Hydroponics", at: [120, 235], tone: "blue" }, { label: "Aquaponics", at: [260, 235], tone: "green" }, { label: "Crop / animal care", at: [400, 235], tone: "gold" }]; break;
    case 24:
      title = "Environmental cycles · matter keeps moving";
      svg = `<circle cx="260" cy="125" r="78" fill="none" stroke="${blue}" stroke-width="12" stroke-dasharray="90 22"/><path d="M260 36l-18 25h36zM349 125l-25-18v36zM260 214l18-25h-36zM171 125l25 18V107z" fill="${gold}"/><circle cx="260" cy="125" r="28" fill="${green}"/>`;
      labels = [{ label: "Water cycle", at: [260, 30], tone: "blue" }, { label: "Carbon / nitrogen", at: [390, 125], tone: "gold" }, { label: "Ecosystem balance", at: [260, 225], tone: "green" }]; break;
    default:
      title = `${definition.title} · visual model`;
      svg = `<rect x="70" y="70" width="380" height="110" rx="22" fill="#123d59" stroke="${blue}" stroke-width="4"/><path d="M105 125H415" stroke="${gold}" stroke-width="8" stroke-dasharray="18 10"/><circle cx="135" cy="125" r="23" fill="${green}"/><circle cx="385" cy="125" r="23" fill="${pink}"/>`;
      labels = [{ label: concept.title, at: [260, 65], tone: "blue" }, { label: "Process", at: [260, 205], tone: "gold" }];
  }
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

const C = (id: string, title: string, icon: string, summary: string, question: string, answer: string, frame?: BoardFrame): ScienceConcept => ({
  id, title, icon, summary, example: { question, answer }, frame,
});

const SCIENCE_DEFINITIONS: ScienceDefinition[] = [
  {
    number: 2, title: "Motion", concepts: [
      C("2.1", "Distance and displacement", "🛣️", "Distance is the full path travelled; displacement is the shortest directed change from start to finish.", "A runner goes around a track and returns to the start. What are the distance and displacement?", "Distance is the length of the track travelled; displacement is zero.", imageFrame("/board-art/tn9-science-motion-paths.png", "Same start and finish: distance versus displacement", "A car travelling along a straight path and a curved path between the same start and finish points.", [
        { label: "Straight path", at: [51, 39], note: "This is the shortest change from the start flag to the finish flag: displacement.", tone: "blue" },
        { label: "Curved path", at: [50, 63], note: "This is the full route travelled by the car: distance.", tone: "gold" },
        { label: "Same finish", at: [92, 39], note: "Both journeys finish at the same flag, so compare the paths, not just the destination.", tone: "green" },
      ])),
      C("2.2", "Speed, velocity and acceleration", "🏎️", "Speed tells how fast; velocity includes direction; acceleration is the rate of change of velocity.", "A car changes velocity from 10 m/s to 20 m/s in 5 s. Find its acceleration.", "a = (20 − 10) / 5 = 2 m/s²."),
      C("2.3", "Motion graphs and equations", "📈", "The slope of a distance-time graph gives speed, while the area under a velocity-time graph gives displacement.", "What does the slope of a distance-time graph represent?", "It represents the speed of the object."),
    ],
  },
  {
    number: 3, title: "Fluids", concepts: [
      C("3.1", "Pressure in fluids", "💧", "Pressure is thrust per unit area and liquid pressure increases with depth.", "Why does water come out faster from a lower hole in a tank?", "Pressure is greater at greater depth, so the lower jet travels farther.", imageFrame("/board-art/tn9-science-fluids-pressure-buoyancy.png", "Pressure increases with depth", "A water tank with jets from different depths and a floating block showing upward buoyant force.", [
        { label: "Deeper hole", at: [35, 63], note: "There is more water above this hole, so pressure is greater and the jet travels farther.", tone: "gold" },
        { label: "Shallow hole", at: [35, 29], note: "There is less water above this hole, so the pressure and jet range are smaller.", tone: "blue" },
        { label: "Buoyant force", at: [75, 55], note: "The upward arrows show the fluid force supporting the floating block.", tone: "green" },
      ])),
      C("3.2", "Pascal's law and density", "🧴", "Pressure applied to an enclosed fluid is transmitted in all directions; density is mass divided by volume.", "Find the density of 200 g of liquid occupying 100 cm³.", "Density = mass / volume = 200 / 100 = 2 g/cm³."),
      C("3.3", "Buoyancy and flotation", "⚓", "An immersed body experiences an upward force; a floating body displaces fluid whose weight equals its own weight.", "Why does a steel ship float even though steel is denser than water?", "Its hollow shape makes the average density of the ship less than water and it displaces enough water to balance its weight."),
    ],
  },
  {
    number: 4, title: "Electric charge and Electric current", concepts: [
      C("4.1", "Charge and electric field", "⚡", "Electric charge produces electric force and an electric field around it.", "How many electrons have a total charge of 1 C?", "n = q/e = 1/(1.6 × 10⁻¹⁹) = 6.25 × 10¹⁸ electrons."),
      C("4.2", "Current, potential and resistance", "🔋", "Current is charge flow per time; potential difference provides energy per charge; resistance opposes current.", "25 C passes through a wire in 50 s. Find the current.", "I = Q/t = 25/50 = 0.5 A."),
      C("4.3", "Circuits and electrical safety", "🔌", "Cells, wires, switches and loads form circuits; correct connections and safe handling prevent shocks and fires.", "How are bulbs connected for independent operation in a home circuit?", "They are connected in parallel so each receives the supply and can work independently."),
    ],
  },
  {
    number: 5, title: "Magnetism and Electromagnetism", concepts: [
      C("5.1", "Magnetic fields", "🧲", "A magnetic field is the region where magnetic influence acts; field lines show its direction and strength.", "Where are magnetic field lines closest around a bar magnet?", "Near the poles, where the field is strongest."),
      C("5.2", "Magnetic effect of current", "🌀", "A current-carrying conductor produces a magnetic field, with direction found by the right-hand thumb rule.", "What happens around a straight wire when current flows?", "A circular magnetic field forms around the wire."),
      C("5.3", "Induction, generators and transformers", "⚙️", "Changing magnetic flux can induce current; generators and transformers transfer energy using electromagnetic induction.", "What change produces induced current in a coil?", "A change in magnetic flux through the coil."),
    ],
  },
  {
    number: 6, title: "Light", concepts: [
      C("6.1", "Reflection and plane mirrors", "🪞", "Reflection follows the laws of reflection: the angle of incidence equals the angle of reflection.", "If the angle of incidence is 35°, what is the angle of reflection?", "35°."),
      C("6.2", "Spherical mirrors and ray diagrams", "🔎", "Principal rays help locate images in concave and convex mirrors; the mirror equation links object, image and focal distances.", "What happens to a ray parallel to the principal axis of a concave mirror?", "It reflects through the principal focus."),
      C("6.3", "Image formation and magnification", "🖼️", "Image position, size and nature depend on object position relative to the pole, focus and centre of curvature.", "What does magnification compare?", "Image height with object height, m = image height / object height."),
    ],
  },
  {
    number: 7, title: "Heat", concepts: [
      C("7.1", "Temperature and thermal expansion", "🌡️", "Temperature indicates how hot a body is; most materials expand when heated and contract when cooled.", "Why are gaps left between railway tracks?", "The gaps allow expansion in hot weather without bending the tracks."),
      C("7.2", "Heat transfer", "🔥", "Heat moves by conduction, convection and radiation, each suited to different materials and situations.", "How does heat from the Sun reach Earth?", "By radiation, which does not need a material medium."),
      C("7.3", "Specific heat and change of state", "🧊", "Specific heat measures energy needed to raise temperature; latent heat changes state without changing temperature.", "Why does temperature remain constant while ice melts?", "Supplied energy is used as latent heat to change state."),
    ],
  },
  {
    number: 8, title: "Sound", concepts: [
      C("8.1", "Production and propagation of sound", "🔊", "Sound is produced by vibrating bodies and travels as a mechanical wave through a medium.", "Can sound travel through vacuum?", "No. Sound needs a material medium to transfer vibrations."),
      C("8.2", "Characteristics of sound", "🎵", "Amplitude relates to loudness, frequency to pitch, and waveform to quality or timbre.", "Which property determines pitch?", "Frequency."),
      C("8.3", "Reflection, echo and ultrasound", "🏔️", "Sound can reflect to make echoes; high-frequency ultrasound has medical and industrial uses.", "What minimum time gap is needed to hear a distinct echo?", "About 0.1 second."),
    ],
  },
  {
    number: 9, title: "Universe", concepts: [
      C("9.1", "Stars and galaxies", "🌌", "Stars form galaxies; their distances are described with astronomical units, light years and parsecs.", "What is a galaxy?", "A vast system of stars, gas, dust and other matter held together by gravity."),
      C("9.2", "Solar system", "☀️", "The Sun and the bodies orbiting it form our solar system.", "Why do planets remain in orbit around the Sun?", "The Sun's gravity provides the centripetal force needed for their orbits."),
      C("9.3", "Space exploration", "🚀", "Observation and spacecraft extend our understanding of planets, stars and the origin of the universe.", "Why do astronomers use telescopes?", "To collect more light and observe distant or faint objects."),
    ],
  },
  {
    number: 10, title: "Matter Around Us", concepts: [
      C("10.1", "States and properties of matter", "🧊", "Particles in solids, liquids and gases differ in spacing, motion and attraction.", "Why does a gas fill its container?", "Its particles are far apart and move freely in all directions."),
      C("10.2", "Changes of state", "♨️", "Heating or cooling can change matter between solid, liquid and gas without changing its chemical identity.", "What is evaporation?", "The slow change of a liquid into vapour from its surface."),
      C("10.3", "Mixtures and separation", "🧪", "Mixtures can be separated using physical properties such as particle size, boiling point or solubility.", "How can sand be separated from water?", "By filtration."),
    ],
  },
  {
    number: 11, title: "Atomic Structure", concepts: [
      C("11.1", "Subatomic particles", "⚛️", "Atoms contain protons and neutrons in the nucleus and electrons around it.", "What determines the atomic number?", "The number of protons in the nucleus."),
      C("11.2", "Atomic models and electronic arrangement", "🪐", "Atomic models developed as evidence improved; electrons occupy shells or energy levels.", "How many electrons can the first shell hold?", "Two electrons."),
      C("11.3", "Isotopes and isobars", "🔢", "Isotopes have the same atomic number but different mass numbers; isobars have the same mass number but different atomic numbers.", "What is common to isotopes of an element?", "They have the same number of protons."),
    ],
  },
  {
    number: 12, title: "Periodic Classification of Elements", concepts: [
      C("12.1", "Periodic law and table", "🗂️", "Elements are arranged so properties repeat periodically with atomic number.", "What is the modern periodic law based on?", "Atomic number."),
      C("12.2", "Groups and periods", "📋", "A period is a row and a group is a column; position helps predict valence electrons and properties.", "What do elements in one group generally share?", "Similar chemical properties and the same number of valence electrons."),
      C("12.3", "Periodic trends", "📉", "Atomic size, metallic character and valency show patterns across periods and down groups.", "How does atomic size generally change across a period?", "It generally decreases from left to right."),
    ],
  },
  {
    number: 13, title: "Chemical Bonding", concepts: [
      C("13.1", "Valency and octet idea", "🔗", "Atoms bond to reach a more stable outer electron arrangement.", "Why do atoms form chemical bonds?", "To achieve a more stable electron configuration."),
      C("13.2", "Ionic bonding", "🧲", "An ionic bond forms when electrons transfer and oppositely charged ions attract.", "What happens when sodium forms sodium ion?", "It loses one electron and becomes Na⁺."),
      C("13.3", "Covalent bonding", "🤝", "A covalent bond forms when atoms share electron pairs.", "How many shared pairs are in an oxygen molecule O₂?", "Two shared electron pairs, forming a double bond."),
    ],
  },
  {
    number: 14, title: "Acids, Bases and Salts", concepts: [
      C("14.1", "Acids and bases", "🍋", "Acids and bases have characteristic properties and react with each other in neutralisation.", "What is neutralisation?", "The reaction of an acid and a base to form salt and water."),
      C("14.2", "Indicators and pH", "🧪", "Indicators change colour with acidity; pH describes how acidic or basic a solution is.", "What does pH less than 7 indicate?", "An acidic solution."),
      C("14.3", "Salts and everyday uses", "🧂", "Salts form in neutralisation and have many uses in homes, agriculture and industry.", "What are the products of hydrochloric acid reacting with sodium hydroxide?", "Sodium chloride and water."),
    ],
  },
  {
    number: 15, title: "Carbon and its Compounds", concepts: [
      C("15.1", "Carbon bonding and chains", "🧱", "Carbon forms four covalent bonds and can link into chains, branches and rings.", "Why can carbon form many compounds?", "It is tetravalent and shows catenation, forming strong bonds with itself and other elements."),
      C("15.2", "Hydrocarbons and functional groups", "🧬", "Hydrocarbons contain carbon and hydrogen; functional groups determine characteristic reactions.", "What elements are present in a hydrocarbon?", "Only carbon and hydrogen."),
      C("15.3", "Useful carbon compounds", "🧼", "Alcohols, acids, soaps, detergents and polymers have different structures and everyday uses.", "Why do soaps clean oily dirt?", "Their molecules have a water-loving end and an oil-loving end that help lift grease into water."),
    ],
  },
  {
    number: 16, title: "Applied Chemistry", concepts: [
      C("16.1", "Chemistry in materials", "🏗️", "Chemical processes produce useful materials such as cement, glass, ceramics and alloys.", "Why is cement useful in construction?", "It sets and hardens, binding materials into a strong structure."),
      C("16.2", "Fertilisers and agriculture", "🌱", "Fertilisers supply essential mineral nutrients to improve plant growth when used carefully.", "Why are fertilisers added to soil?", "To replace mineral nutrients needed for healthy plant growth."),
      C("16.3", "Soaps, detergents and safety", "🧴", "Cleaning agents remove dirt through surface chemistry; safe handling protects people and water systems.", "What should be considered when choosing a detergent?", "Its cleaning ability, safety, biodegradability and effect on water."),
    ],
  },
  {
    number: 17, title: "Animal Kingdom", concepts: [
      C("17.1", "Basis of classification", "🦋", "Animals are grouped by body organisation, symmetry, germ layers, coelom and other shared features.", "Why do scientists classify animals?", "To organise diversity and show relationships using shared characteristics."),
      C("17.2", "Non-chordates", "🐌", "Invertebrate phyla differ in body plan, symmetry, segmentation and specialised organs.", "What is an invertebrate?", "An animal without a vertebral column."),
      C("17.3", "Chordates and vertebrates", "🐟", "Chordates have a notochord or backbone-related plan; vertebrates include fish, amphibians, reptiles, birds and mammals.", "Name one feature of vertebrates.", "They possess a vertebral column or backbone."),
    ],
  },
  {
    number: 18, title: "Organisation of Tissues", concepts: [
      C("18.1", "Plant tissues", "🌿", "Meristematic tissues divide actively; permanent tissues provide support, transport, storage and protection.", "What is the function of xylem?", "It transports water and minerals from roots to other parts of the plant."),
      C("18.2", "Animal tissues", "🫀", "Epithelial, connective, muscular and nervous tissues work together in animal bodies.", "Which tissue carries messages through the body?", "Nervous tissue."),
      C("18.3", "Cell division", "🧬", "Mitosis supports growth and repair; meiosis forms reproductive cells with half the chromosome number.", "Why is meiosis important?", "It produces haploid gametes for sexual reproduction."),
    ],
  },
  {
    number: 19, title: "Plant Physiology", concepts: [
      C("19.1", "Plant movements and tropisms", "🌻", "Plants respond directionally to light, gravity, water and touch.", "What is phototropism?", "Growth or movement of a plant part in response to light."),
      C("19.2", "Photosynthesis", "☀️", "Green plants use light energy to make glucose from carbon dioxide and water, releasing oxygen.", "What raw materials are needed for photosynthesis?", "Carbon dioxide and water, with light and chlorophyll."),
      C("19.3", "Transpiration", "🍃", "Transpiration is loss of water vapour, mainly through stomata, and helps movement of water through plants.", "Through which structures does most leaf transpiration occur?", "Stomata."),
    ],
  },
  {
    number: 20, title: "Organ Systems in Animals", concepts: [
      C("20.1", "Human digestive system", "🥗", "The alimentary canal and digestive glands break complex food into absorbable nutrients.", "Where does most nutrient absorption occur?", "In the small intestine through villi."),
      C("20.2", "Human excretory system", "🫘", "Kidneys filter blood, regulate water and salts, and form urine through nephrons.", "What is the functional unit of the kidney?", "The nephron."),
      C("20.3", "Human reproductive system", "👶", "Reproductive organs produce gametes and support fertilisation and development.", "Where does the human embryo develop?", "Inside the uterus."),
    ],
  },
  {
    number: 21, title: "Nutrition and Health", concepts: [
      C("21.1", "Nutrients and deficiency", "🥦", "Carbohydrates, proteins, fats, vitamins, minerals, water and fibre support growth and health.", "Which vitamin is called the sunshine vitamin?", "Vitamin D."),
      C("21.2", "Food preservation", "🥫", "Drying, salting, freezing, canning and irradiation slow spoilage by controlling microbes or moisture.", "How does drying preserve food?", "It removes moisture needed for microbial growth."),
      C("21.3", "Food adulteration and safety", "🧼", "Adulteration lowers food quality; hygiene, standards and careful choices reduce risk.", "What is food adulteration?", "Adding or removing a substance so the natural composition or quality of food is affected."),
    ],
  },
  {
    number: 22, title: "World of Microbes", concepts: [
      C("22.1", "Microbial diversity", "🦠", "Bacteria, fungi, algae, protozoa and viruses are microscopic organisms with different structures and roles.", "What is microbiology?", "The study of microscopic living organisms and their activities."),
      C("22.2", "Useful microbes", "🥣", "Microbes help in food production, agriculture, medicine, decomposition and biotechnology.", "Which microbe helps make curd?", "Lactobacillus bacteria."),
      C("22.3", "Diseases and prevention", "🛡️", "Pathogens cause disease; sanitation, vaccination and vector control reduce transmission.", "What is a vaccine?", "A preparation that stimulates the body to develop protection against a pathogen."),
    ],
  },
  {
    number: 23, title: "Economic Biology", concepts: [
      C("23.1", "Horticulture and floriculture", "🌺", "Horticulture grows fruits, vegetables and ornamental plants using planned cultivation.", "What is floriculture?", "The cultivation and management of flowering and ornamental plants."),
      C("23.2", "Hydroponics, aquaponics and biofertilisers", "🌱", "Plants can be grown with nutrient solutions, fish-linked systems or beneficial microbes instead of ordinary soil nutrients.", "What is hydroponics?", "Growing plants without soil using a nutrient solution."),
      C("23.3", "Animal husbandry and fisheries", "🐄", "Dairy, poultry, beekeeping, sericulture and fisheries apply biology to food and livelihoods.", "What is pisciculture?", "The production and management of fish."),
    ],
  },
  {
    number: 24, title: "Environmental Science", concepts: [
      C("24.1", "Water and carbon cycles", "♻️", "Matter moves through ecosystems in cycles such as evaporation, condensation, photosynthesis and respiration.", "What powers evaporation in the water cycle?", "Heat energy, mainly from the Sun."),
      C("24.2", "Nitrogen cycle", "🌾", "Nitrogen-fixing, nitrifying, assimilating and denitrifying processes move nitrogen between air, soil and organisms.", "Why is nitrogen fixation important?", "It converts atmospheric nitrogen into usable compounds for plants."),
      C("24.3", "Human impact and protection", "🌍", "Pollution, resource use and habitat loss affect ecosystems; conservation and responsible choices reduce harm.", "Why should biodiversity be protected?", "It supports stable ecosystems, resources and resilience to change."),
    ],
  },
];

function makeTask(definition: ScienceDefinition, concept: ScienceConcept, prefix: string): BoardTask {
  const frame = scienceVisualFrame(definition, concept, 0);
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
  }));
  const frameFor = (concept: ScienceConcept) => scienceVisualFrame(definition, concept, 0);
  const conceptSteps = definition.concepts.flatMap((concept) => [
    { label: `${concept.id} · Meet the idea`, conceptId: concept.id, say: concept.summary, frame: frameFor(concept) },
    { label: `${concept.id} · Revisit the example`, conceptId: concept.id, say: `${concept.example.question} ${concept.example.answer}`, frame: frameFor(concept) },
  ]);
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
    recitePrompts: definition.concepts.map((concept) => ({ ask: `Explain ${concept.title} using this example: ${concept.example.question}`, answer: concept.example.answer, conceptId: concept.id })),
    writtenPractice: definition.concepts.map((concept) => ({ question: `Write and explain: ${concept.example.question}`, answer: concept.example.answer, conceptId: concept.id })),
    assessmentStory: frameFor(definition.concepts[0]),
    assessment: { partA: definition.concepts.map((concept) => makeTask(definition, concept, "Test")), partB: [] },
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
