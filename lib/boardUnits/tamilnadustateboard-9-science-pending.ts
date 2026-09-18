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

const imageFrame = (src: string, title: string, alt: string): BoardFrame => ({
  image: { src, title, alt },
});

const cardsFrame = (title: string, cards: { tag: string; title: string; desc: string }[]): BoardFrame => ({
  text: { title, cards },
});

const C = (id: string, title: string, icon: string, summary: string, question: string, answer: string, frame?: BoardFrame): ScienceConcept => ({
  id, title, icon, summary, example: { question, answer }, frame,
});

const SCIENCE_DEFINITIONS: ScienceDefinition[] = [
  {
    number: 2, title: "Motion", concepts: [
      C("2.1", "Distance and displacement", "🛣️", "Distance is the full path travelled; displacement is the shortest directed change from start to finish.", "A runner goes around a track and returns to the start. What are the distance and displacement?", "Distance is the length of the track travelled; displacement is zero.", imageFrame("/board-art/tn9-science-motion-paths.png", "Same start and finish: distance versus displacement", "A car travelling along a straight path and a curved path between the same start and finish points.")),
      C("2.2", "Speed, velocity and acceleration", "🏎️", "Speed tells how fast; velocity includes direction; acceleration is the rate of change of velocity.", "A car changes velocity from 10 m/s to 20 m/s in 5 s. Find its acceleration.", "a = (20 − 10) / 5 = 2 m/s²."),
      C("2.3", "Motion graphs and equations", "📈", "The slope of a distance-time graph gives speed, while the area under a velocity-time graph gives displacement.", "What does the slope of a distance-time graph represent?", "It represents the speed of the object."),
    ],
  },
  {
    number: 3, title: "Fluids", concepts: [
      C("3.1", "Pressure in fluids", "💧", "Pressure is thrust per unit area and liquid pressure increases with depth.", "Why does water come out faster from a lower hole in a tank?", "Pressure is greater at greater depth, so the lower jet travels farther.", imageFrame("/board-art/tn9-science-fluids-pressure-buoyancy.png", "Pressure increases with depth", "A water tank with jets from different depths and a floating block showing upward buoyant force.")),
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

function makeTask(concept: ScienceConcept, prefix: string): BoardTask {
  const frame = concept.frame ?? cardsFrame(concept.title, [
    { tag: "IDEA", title: concept.title, desc: concept.summary },
    { tag: "EXAMPLE", title: concept.example.question, desc: concept.example.answer },
  ]);
  return {
    title: `${prefix} · ${concept.id}`,
    conceptId: concept.id,
    prompt: concept.example.question,
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
    quickCheck: [makeTask(concept, "Quick check")],
  }));
  const frameFor = (concept: ScienceConcept) => concept.frame ?? cardsFrame(concept.title, [
    { tag: "RULE", title: concept.title, desc: concept.summary },
    { tag: "WORKED", title: concept.example.question, desc: concept.example.answer },
  ]);
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
    guidedTasks: definition.concepts.map((concept) => makeTask(concept, "Cover")),
    lab: { prompt: `Use the visible model to explain one ${definition.title.toLowerCase()} example.`, start: [2, 2], shape: [[0, 0], [2, 0], [2, 2], [0, 2]], range: { min: -2, max: 6 } },
    recitePrompts: definition.concepts.map((concept) => ({ ask: `Explain ${concept.title} using this example: ${concept.example.question}`, answer: concept.example.answer, conceptId: concept.id })),
    writtenPractice: definition.concepts.map((concept) => ({ question: `Write and explain: ${concept.example.question}`, answer: concept.example.answer, conceptId: concept.id })),
    assessmentStory: frameFor(definition.concepts[0]),
    assessment: { partA: definition.concepts.map((concept) => makeTask(concept, "Test")), partB: [] },
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
