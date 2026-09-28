import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 9 - Planet Earth.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Earth and Space strand, pages 114-128. Diagram art is real,
 * NotebookLM-generated illustration (Infographic studio, from the unit's
 * own page-cited text as the source) with hotspots laid over it - same
 * method as Units 1-8.
 *
 * Every definition below is pulled from the textbook's own text (the
 * atmosphere, water on Earth, the water cycle, water pollution,
 * microplastics, and other kinds of pollution) rather than invented, so the
 * board and the real book teach the same words in the same order.
 */

const EARTH_IMG = "/board-art/cambridge-4-science-unit9-planet-earth.png";
const EARTH_ALT = "Six panels on Planet Earth: the atmosphere, water on Earth, the water cycle, water pollution, microplastics, and other kinds of pollution.";

const FULL_FOCUS = { x: 0, y: 0, w: 100, h: 100 };
const ATMOSPHERE_FOCUS = { x: 0, y: 8, w: 33, h: 50 };
const WATER_EARTH_FOCUS = { x: 33, y: 8, w: 34, h: 50 };
const WATER_CYCLE_FOCUS = { x: 67, y: 8, w: 33, h: 50 };
const WATER_POLLUTION_FOCUS = { x: 0, y: 52, w: 33, h: 48 };
const MICROPLASTICS_FOCUS = { x: 33, y: 52, w: 34, h: 48 };
const OTHER_POLLUTION_FOCUS = { x: 67, y: 52, w: 33, h: 48 };

function frame(hotspots: NonNullable<ImageFrame["hotspots"]>, focus: ImageFrame["focus"] = FULL_FOCUS, motionPath?: ImageFrame["motionPath"]): { image: ImageFrame } {
  return {
    image: {
      src: EARTH_IMG,
      alt: EARTH_ALT,
      title: "Planet Earth",
      hotspots,
      focus,
      motionPath,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_9: BoardUnit = {
  unitKey: "cambridge-4-science-9",
  title: "Planet Earth",
  badge: "Grade 4 · Earth & Space · Unit 9",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "The atmosphere: what it's made of and why it matters",
      "How much of Earth's water is in the oceans, and access to clean water",
      "The water cycle: evaporation, condensation, precipitation",
      "Water pollution and why fresh water needs treatment",
      "Microplastics: microbeads and microfibres",
      "Other kinds of pollution: oil, pesticides, air, landfill",
    ],
    outcomes: [
      "Explain what the atmosphere is and name the gases it is made up of",
      "Explain why most of the water on Earth is not pure, drinkable water",
      "Describe the water cycle using the words evaporation, condensation and precipitation",
      "Explain what water pollution is and give a real example",
      "Explain what microbeads and microfibres are and why they are harmful",
      "Describe different kinds of pollution and say why each is harmful",
    ],
  },

  concepts: [
    {
      conceptId: "9.1",
      title: "The atmosphere",
      icon: "🌍",
      summary:
        "The atmosphere is the blanket of gases (air) around the Earth, held in place by gravity. It protects the planet from harmful rays, provides the air we breathe, and helps keep Earth at a safe temperature.",
      keyPoints: [
        "Atmosphere = the blanket of gases we call air, held in place by gravity.",
        "Protects Earth from harmful rays from space.",
        "Formed from volcanic gases when the Earth was formed - contained much more carbon dioxide then.",
        "John Dalton (19th century) first suggested air is not just one gas.",
        "Air is mostly nitrogen, plus oxygen and carbon dioxide.",
        "The atmosphere provides breathable air, stops water being lost from the planet, and keeps the Earth from getting too hot or too cold.",
      ],
      pages: [115],
      storyReference: "The atmosphere, page 115",
      examples: [
        { question: "What is the atmosphere held in place by?", answer: "The force of gravity. (p.115)" },
        { question: "Who first suggested that air is not just one gas?", answer: "John Dalton, a 19th-century scientist. (p.115)" },
        { question: "Name the three main gases in air.", answer: "Nitrogen (most of the air), oxygen, and carbon dioxide. (p.115)" },
      ],
      quickCheck: [
        {
          title: "Quick check · what holds the atmosphere",
          prompt: "What holds the atmosphere in place around the Earth?",
          conceptId: "9.1",
          options: [
            { label: "Gravity", correct: true, say: "Correct - gravity holds the blanket of gases in place.", frame: frame([{ label: "Atmosphere - a blanket of gases held by gravity", at: [11.5, 23], note: "Held in place by gravity.", tone: "gold" }], ATMOSPHERE_FOCUS) },
            { label: "Magnetism", correct: false, say: "Gravity holds the atmosphere in place, not magnetism.", frame: frame([{ label: "Atmosphere - a blanket of gases held by gravity", at: [11.5, 23], note: "It's gravity, not magnetism.", tone: "red" }], ATMOSPHERE_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "9.2",
      title: "Water on Earth",
      icon: "💧",
      summary:
        "About 96% of Earth's water is in the oceans, with just under 2% in lakes, rivers and soil, and just under 2% in snow, glaciers and ice caps. Around 785 million people lack access to clean water near their homes.",
      keyPoints: [
        "About 96% of Earth's water is in the oceans.",
        "Just under 2% is in lakes, rivers and soil.",
        "Just under 2% is in snow, glaciers and polar ice caps.",
        "Around 785 million people (about 1 in 10 people) do not have access to clean water near their homes.",
      ],
      pages: [116],
      storyReference: "Water on Earth, page 116",
      examples: [
        { question: "What percentage of Earth's water is found in the oceans?", answer: "About 96%. (p.116)" },
        { question: "Roughly how many people in the world lack access to clean water near their homes?", answer: "Around 785 million - about 1 in every 10 people. (p.116)" },
      ],
      quickCheck: [
        {
          title: "Quick check · where is Earth's water",
          prompt: "Where is most of Earth's water found?",
          conceptId: "9.2",
          options: [
            { label: "The oceans", correct: true, say: "Correct - about 96% of Earth's water is in the oceans.", frame: frame([{ label: "96% Oceans", at: [57.75, 54.7], note: "The vast majority of Earth's water.", tone: "gold" }], WATER_EARTH_FOCUS) },
            { label: "Snow and glaciers", correct: false, say: "Snow, glaciers and ice caps hold just under 2% - the oceans hold far more.", frame: frame([{ label: "Snow, glaciers, ice caps (<2%)", at: [42.75, 27], note: "Just under 2%, not the majority.", tone: "red" }], WATER_EARTH_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "9.3",
      title: "The water cycle",
      icon: "☁️",
      summary:
        "Water never leaves the planet - it moves in a journey called the water cycle: evaporation (heated water rises as water vapour), condensation (it cools and forms clouds), and precipitation (it falls back as rain, hail, sleet or snow).",
      keyPoints: [
        "Evaporation - the Sun heats water, which turns into water vapour and rises into the air.",
        "Condensation - rising water vapour cools, changes back into tiny liquid droplets, and forms clouds.",
        "Precipitation - when droplets get too heavy, water falls back to the ground as rain, hail, sleet or snow.",
        "The cycle then begins again - water never leaves the planet.",
      ],
      pages: [117],
      storyReference: "The water cycle, page 117",
      examples: [
        { question: "What is evaporation, in the water cycle?", answer: "The Sun heating water so it turns into water vapour and rises into the air. (p.117)" },
        { question: "What happens during condensation?", answer: "Rising water vapour cools down, condenses, and changes back into tiny drops of liquid water, forming clouds. (p.117)" },
        { question: "What is precipitation?", answer: "Water falling back to the ground as rain, hail, sleet or snow, once cloud droplets get too heavy. (p.117)" },
      ],
      quickCheck: [
        {
          title: "Quick check · order of the water cycle",
          prompt: "Which comes first: evaporation or condensation?",
          conceptId: "9.3",
          options: [
            { label: "Evaporation", correct: true, say: "Correct - water evaporates and rises before it condenses into clouds.", frame: frame([{ label: "Evaporation", at: [72.25, 43], note: "Water rises as vapour first.", tone: "gold" }], WATER_CYCLE_FOCUS) },
            { label: "Condensation", correct: false, say: "Condensation happens after evaporation, once the water vapour has risen and cooled.", frame: frame([{ label: "Condensation", at: [80, 29], note: "This comes after evaporation.", tone: "red" }], WATER_CYCLE_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "9.4",
      title: "Water pollution",
      icon: "🏭",
      summary:
        "Water is a solvent, so it picks up natural and human-made substances - meaning fresh water must be treated before drinking. Water pollution happens when harmful substances get into water by human action.",
      keyPoints: [
        "Water has been on Earth for 4.6 billion years.",
        "Water is a solvent - substances dissolve in it, including natural particles like dust and rocks.",
        "Fresh water needs to be treated before it is safe to drink.",
        "Water pollution = harmful substances entering water by human action.",
        "Real investigation: pondweed grew healthily in eco-friendly washing-up liquid, but turned brown or died in ordinary washing-up liquid.",
        "In 2019, London sewer workers found a fatberg (from fat, oil, grease and wipes) as big as a double-decker bus.",
      ],
      pages: [120, 121, 122],
      storyReference: "Water pollution (1) and (2), pages 120-122",
      examples: [
        { question: "Why does fresh water need to be treated before drinking?", answer: "Because water is a solvent and picks up natural particles (like dust, soil and rocks) as it falls and flows. (p.120)" },
        { question: "What is water pollution?", answer: "Substances that harm plants, people and other animals getting into the water by human action. (p.120)" },
        { question: "What was a London fatberg made from?", answer: "Fat, oil and grease poured down drains, plus items like nappies, cotton buds and wet wipes flushed down toilets. (p.122)" },
      ],
      quickCheck: [
        {
          title: "Quick check · why treat water",
          prompt: "Why does fresh water usually need treatment before we drink it?",
          conceptId: "9.4",
          options: [
            { label: "Water is a solvent and picks up dissolved particles", correct: true, say: "Correct - water dissolves natural and human-made substances as it falls and flows.", frame: frame([{ label: "Human pollution makes water unsafe to drink without treatment", at: [23, 65], note: "Water dissolves many substances.", tone: "gold" }], WATER_POLLUTION_FOCUS) },
            { label: "Water is always completely pure by itself", correct: false, say: "Water is a good solvent, so it is rarely pure by the time it reaches us - that's exactly why treatment is needed.", frame: frame([{ label: "Human pollution makes water unsafe to drink without treatment", at: [23, 65], note: "Water is not naturally pure.", tone: "red" }], WATER_POLLUTION_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "9.5",
      title: "Microplastics: microbeads and microfibres",
      icon: "🧴",
      summary:
        "Microbeads are tiny plastic beads in cosmetics and toothpaste; microfibres shed from synthetic clothes when washed. Both are microplastics that pollute water and harm sea life.",
      keyPoints: [
        "Microbeads - tiny plastic beads in facial scrubs, toothpaste and other products; a small tube of toothpaste can contain over 2.8 million.",
        "Found in oceans worldwide, even remote Arctic ice; 38 countries banned them in 2017.",
        "Fish that swallow microbeads become ill, and microbeads pass into the food chain.",
        "Microfibres shed from synthetic clothes (like polyester) when washed - small enough to pass through water treatment filters into rivers, seas and oceans.",
      ],
      pages: [123, 124],
      storyReference: "The plastic problem: microbeads / Washing clothes and water pollution, pages 123-124",
      examples: [
        { question: "How many microbeads can a small tube of toothpaste contain?", answer: "More than 2.8 million. (p.123)" },
        { question: "In 2017, how many countries made microbeads illegal in products?", answer: "38 countries. (p.123)" },
        { question: "Why can microfibres from washing clothes end up in the sea?", answer: "They are small enough to pass through water treatment plant filters. (p.124)" },
      ],
      quickCheck: [
        {
          title: "Quick check · microbeads or microfibres",
          prompt: "Tiny plastic beads found in toothpaste and facial scrubs are called...",
          conceptId: "9.5",
          options: [
            { label: "Microbeads", correct: true, say: "Correct.", frame: frame([{ label: "Microbeads", at: [39.5, 92], note: "Found in cosmetics and toothpaste.", tone: "gold" }], MICROPLASTICS_FOCUS) },
            { label: "Microfibres", correct: false, say: "Microfibres come from washing synthetic clothes, not from cosmetics.", frame: frame([{ label: "Microfibres (from synthetic clothes)", at: [52.5, 92], note: "These come from clothes, not cosmetics.", tone: "red" }], MICROPLASTICS_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "9.6",
      title: "Other kinds of pollution",
      icon: "🏗️",
      summary:
        "Pollution takes many forms: oil spills harm wildlife, fertilisers/pesticides poison plants and animals, air pollution affects breathing, and landfill chemicals seep into water.",
      keyPoints: [
        "Oil spills (e.g. from damaged tankers) pollute water and harm wildlife.",
        "Too much fertiliser washes into streams/rivers, causing algae that can poison plants and animals.",
        "Pesticides protect crops but can poison birds, fish and pollinating insects.",
        "Air pollution (from cars, factories, fires) makes breathing harder and can cause or worsen asthma, lung cancer and heart disease.",
        "Landfill chemicals dissolve in rainwater and reach soil, streams, rivers and oceans; burnt litter pollutes air too.",
        "About 4,500 children die every day from lack of access to clean water.",
      ],
      pages: [126, 127],
      storyReference: "The positive and negative effects of science, pages 126-127",
      examples: [
        { question: "What can happen if farmers add too much fertiliser to soil?", answer: "It washes into streams and rivers, causing algae to grow that can be poisonous to plants and animals. (p.126)" },
        { question: "Name two health problems air pollution can cause or worsen.", answer: "Any two of: asthma, lung cancer, heart disease. (p.126)" },
        { question: "About how many children die every day from lack of clean water access?", answer: "About 4,500. (p.126)" },
      ],
      quickCheck: [
        {
          title: "Quick check · which pollution is which",
          prompt: "Smoke from factories and cars causing breathing problems is an example of which kind of pollution?",
          conceptId: "9.6",
          options: [
            { label: "Air pollution", correct: true, say: "Correct.", frame: frame([{ label: "Air pollution", at: [83.25, 94.5], note: "From cars, factories, fires.", tone: "gold" }], OTHER_POLLUTION_FOCUS) },
            { label: "Oil spills", correct: false, say: "Oil spills pollute water and harm wildlife - this describes air pollution instead.", frame: frame([{ label: "Oil spills", at: [64.5, 94.5], note: "This is a water pollution example.", tone: "red" }], OTHER_POLLUTION_FOCUS) },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. The atmosphere",
      conceptId: "9.1",
      say: "The atmosphere is a blanket of gases held around the Earth by gravity - mostly nitrogen, with oxygen and carbon dioxide too. It protects us and keeps the planet at a safe temperature.",
      frame: frame(
        [
          { label: "Atmosphere - a blanket of gases held by gravity", at: [11.5, 23], note: "Protects Earth, keeps a safe temperature.", tone: "gold" },
          { label: "Nitrogen", at: [28.75, 28], note: "Most of the air.", tone: "green" },
          { label: "Oxygen", at: [30.25, 33], note: "What we breathe.", tone: "blue" },
          { label: "Carbon dioxide", at: [31.75, 38], note: "A smaller part of the air.", tone: "red" },
        ],
        ATMOSPHERE_FOCUS,
      ),
    },
    {
      label: "2. Where Earth's water is",
      conceptId: "9.2",
      say: "Almost all of Earth's water - 96% - is in the oceans. Only a tiny amount is in lakes, rivers, soil, snow and ice.",
      frame: frame(
        [
          { label: "96% Oceans", at: [57.75, 54.7], note: "Almost all of Earth's water.", tone: "gold" },
          { label: "Lakes, rivers, soil (<2%)", at: [41.25, 21], note: "A tiny fraction.", tone: "green" },
          { label: "Snow, glaciers, ice caps (<2%)", at: [42.75, 27], note: "Another tiny fraction.", tone: "blue" },
        ],
        WATER_EARTH_FOCUS,
      ),
    },
    {
      label: "3. Evaporation, condensation, precipitation",
      conceptId: "9.3",
      say: "The Sun heats water so it evaporates and rises. It cools and condenses into clouds. Then it falls back down as precipitation - and the whole cycle begins again.",
      frame: frame(
        [
          { label: "Evaporation", at: [72.25, 43], note: "Water rises as vapour.", tone: "gold" },
          { label: "Condensation", at: [80, 29], note: "Vapour cools into clouds.", tone: "green" },
          { label: "Precipitation", at: [88.5, 37], note: "Falls back as rain, hail, sleet or snow.", tone: "blue" },
        ],
        WATER_CYCLE_FOCUS,
      ),
    },
    {
      label: "4. Water pollution",
      conceptId: "9.4",
      say: "Water dissolves substances easily, so pollution from factories and homes can make it unsafe - which is why it must be treated before we drink it.",
      frame: frame(
        [
          { label: "Human pollution makes water unsafe to drink without treatment", at: [23, 65], note: "Why treatment is needed.", tone: "gold" },
        ],
        WATER_POLLUTION_FOCUS,
      ),
    },
    {
      label: "5. Microbeads and microfibres",
      conceptId: "9.5",
      say: "Microbeads from cosmetics and microfibres from washing synthetic clothes are both tiny plastics that slip past filters and pollute the sea.",
      frame: frame(
        [
          { label: "Microbeads", at: [39.5, 92], note: "From cosmetics and toothpaste.", tone: "gold" },
          { label: "Microfibres (from synthetic clothes)", at: [52.5, 92], note: "Shed when washing clothes.", tone: "green" },
        ],
        MICROPLASTICS_FOCUS,
      ),
    },
    {
      label: "6. Other kinds of pollution",
      conceptId: "9.6",
      say: "Pollution comes in many forms - oil spills, pesticides, air pollution, and landfill waste all harm the environment in their own way.",
      frame: frame(
        [
          { label: "Oil spills", at: [64.5, 94.5], note: "Harms water and wildlife.", tone: "gold" },
          { label: "Pesticides", at: [74, 94.5], note: "Can poison birds, fish, pollinators.", tone: "green" },
          { label: "Air pollution", at: [83.25, 94.5], note: "From cars, factories, fires.", tone: "blue" },
          { label: "Landfill waste", at: [92.75, 94.5], note: "Chemicals dissolve into water.", tone: "red" },
        ],
        OTHER_POLLUTION_FOCUS,
      ),
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Gases in air",
      prompt: "Which gas makes up most of the air?",
      conceptId: "9.1",
      setup: frame([], ATMOSPHERE_FOCUS),
      options: [
        { label: "Nitrogen", correct: true, say: "Correct - nitrogen makes up most of the air.", frame: frame([{ label: "Nitrogen", at: [28.75, 28], note: "Most of the air.", tone: "green" }], ATMOSPHERE_FOCUS) },
        { label: "Carbon dioxide", correct: false, say: "Carbon dioxide is only a small part of the air - nitrogen is the largest part.", frame: frame([{ label: "Carbon dioxide", at: [31.75, 38], note: "A smaller part, not most of it.", tone: "red" }], ATMOSPHERE_FOCUS) },
      ],
    },
    {
      title: "Task 2 · Clean water access",
      prompt: "Roughly how many people worldwide lack access to clean water near their homes?",
      conceptId: "9.2",
      setup: frame([], WATER_EARTH_FOCUS),
      options: [
        { label: "About 785 million", correct: true, say: "Correct - roughly 1 in every 10 people.", frame: frame([{ label: "96% Oceans", at: [57.75, 54.7], note: "Water is plentiful, but not all of it is accessible or clean.", tone: "green" }], WATER_EARTH_FOCUS) },
        { label: "Almost everyone in the world", correct: false, say: "Most people do have access - it's about 1 in 10 people (785 million) who do not.", frame: frame([{ label: "96% Oceans", at: [57.75, 54.7], note: "Most people DO have access.", tone: "red" }], WATER_EARTH_FOCUS) },
      ],
    },
    {
      title: "Task 3 · Water cycle order",
      prompt: "What happens right after precipitation falls to the ground?",
      conceptId: "9.3",
      setup: frame([], WATER_CYCLE_FOCUS),
      options: [
        { label: "It collects, and the Sun starts evaporating it again", correct: true, say: "Correct - the water cycle begins again.", frame: frame([{ label: "Evaporation", at: [72.25, 43], note: "The cycle starts over.", tone: "green" }], WATER_CYCLE_FOCUS) },
        { label: "The water leaves the planet forever", correct: false, say: "Water never leaves the planet - it cycles round again through evaporation.", frame: frame([{ label: "Evaporation", at: [72.25, 43], note: "Water stays and cycles again.", tone: "red" }], WATER_CYCLE_FOCUS) },
      ],
    },
    {
      title: "Task 4 · Why treat water",
      prompt: "Why can't we always drink water straight from a river or lake?",
      conceptId: "9.4",
      setup: frame([], WATER_POLLUTION_FOCUS),
      options: [
        { label: "It may contain dissolved or harmful substances", correct: true, say: "Correct - water is a solvent and can pick up harmful substances, so it must often be treated.", frame: frame([{ label: "Human pollution makes water unsafe to drink without treatment", at: [23, 65], note: "May need treatment first.", tone: "green" }], WATER_POLLUTION_FOCUS) },
        { label: "All natural water is always perfectly safe", correct: false, say: "Natural and human-made substances can dissolve in water, which is why treatment is often needed.", frame: frame([{ label: "Human pollution makes water unsafe to drink without treatment", at: [23, 65], note: "Not always safe untreated.", tone: "red" }], WATER_POLLUTION_FOCUS) },
      ],
    },
    {
      title: "Task 5 · Microplastic source",
      prompt: "Washing a fleece jacket made of polyester releases which kind of microplastic?",
      conceptId: "9.5",
      setup: frame([], MICROPLASTICS_FOCUS),
      options: [
        { label: "Microfibres", correct: true, say: "Correct - synthetic clothes shed microfibres when washed.", frame: frame([{ label: "Microfibres (from synthetic clothes)", at: [52.5, 92], note: "From washing clothes.", tone: "green" }], MICROPLASTICS_FOCUS) },
        { label: "Microbeads", correct: false, say: "Microbeads come from cosmetics and toothpaste, not from washing clothes.", frame: frame([{ label: "Microbeads", at: [39.5, 92], note: "From cosmetics, not clothes.", tone: "red" }], MICROPLASTICS_FOCUS) },
      ],
    },
    {
      title: "Task 6 · Match the pollution",
      prompt: "Chemicals from a rubbish mound seeping into rainwater is an example of which pollution source?",
      conceptId: "9.6",
      setup: frame([], OTHER_POLLUTION_FOCUS),
      options: [
        { label: "Landfill waste", correct: true, say: "Correct.", frame: frame([{ label: "Landfill waste", at: [92.75, 94.5], note: "Chemicals leach into water.", tone: "green" }], OTHER_POLLUTION_FOCUS) },
        { label: "Pesticides", correct: false, say: "Pesticides are sprayed on crops - this describes landfill waste instead.", frame: frame([{ label: "Pesticides", at: [74, 94.5], note: "Sprayed on crops, not landfill.", tone: "red" }], OTHER_POLLUTION_FOCUS) },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each panel on the board and explain what it teaches about planet Earth.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "What is the atmosphere, and what does it do for us?", answer: "A blanket of gases (mostly nitrogen, plus oxygen and carbon dioxide) held around Earth by gravity - it protects us, gives us air to breathe, and keeps a safe temperature.", conceptId: "9.1" },
    { ask: "Where is most of Earth's water found?", answer: "About 96% is in the oceans; just under 2% is in lakes/rivers/soil, and just under 2% in snow/glaciers/ice caps.", conceptId: "9.2" },
    { ask: "Describe the three stages of the water cycle.", answer: "Evaporation (water heats up and rises as vapour), condensation (vapour cools into clouds), and precipitation (water falls back as rain, hail, sleet or snow).", conceptId: "9.3" },
    { ask: "Why does water often need to be treated before drinking?", answer: "Because water is a solvent, it dissolves natural and human-made substances as it falls and flows - some of which are harmful.", conceptId: "9.4" },
    { ask: "What are microbeads and microfibres?", answer: "Microbeads are tiny plastic beads in cosmetics and toothpaste; microfibres are shed from synthetic clothes when washed. Both are microplastics that pollute water.", conceptId: "9.5" },
    { ask: "Name three other kinds of pollution and their sources.", answer: "Any three of: oil spills (tankers), fertiliser/pesticide runoff (farming), air pollution (cars, factories, fires), landfill waste (rubbish).", conceptId: "9.6" },
  ],

  writtenPractice: [
    { question: "Explain why the atmosphere is important for life on Earth.", answer: "It provides the air we breathe, stops water being lost from the planet, protects us from harmful rays from space, and keeps the Earth at a safe temperature.", conceptId: "9.1" },
    { question: "Describe, step by step, what happens to a raindrop from the moment it falls until it evaporates again.", answer: "It falls as precipitation, collects in a river, lake or ocean, is heated by the Sun and evaporates into water vapour, then cools and condenses into a cloud, ready to fall again as precipitation.", conceptId: "9.3" },
    { question: "Explain the difference between microbeads and microfibres, with an example source of each.", answer: "Microbeads are tiny plastic beads used in products like toothpaste or facial scrubs. Microfibres are tiny plastic fibres shed from synthetic clothing (like polyester) when it's washed.", conceptId: "9.5" },
    { question: "Choose one kind of pollution from this unit and explain how it harms the environment.", answer: "Any valid explanation, e.g. pesticides can poison birds, fish and pollinating insects even though they are meant to protect crops from pests.", conceptId: "9.6" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Atmosphere gases",
        prompt: "Which gas makes up most of the atmosphere?",
        conceptId: "9.1",
        options: [
          { label: "Nitrogen", correct: true, say: "Correct.", frame: frame([{ label: "Nitrogen", at: [28.75, 28], note: "Most of the air.", tone: "green" }], ATMOSPHERE_FOCUS) },
          { label: "Oxygen", correct: false, say: "Oxygen is important for breathing, but nitrogen makes up most of the air.", frame: frame([{ label: "Oxygen", at: [30.25, 33], note: "Not the largest part.", tone: "red" }], ATMOSPHERE_FOCUS) },
        ],
      },
      {
        title: "Q2 · Water on Earth",
        prompt: "About what percentage of Earth's water is in the oceans?",
        conceptId: "9.2",
        options: [
          { label: "96%", correct: true, say: "Correct.", frame: frame([{ label: "96% Oceans", at: [57.75, 54.7], note: "Correct.", tone: "green" }], WATER_EARTH_FOCUS) },
          { label: "50%", correct: false, say: "It's much higher than half - about 96% is in the oceans.", frame: frame([{ label: "96% Oceans", at: [57.75, 54.7], note: "Higher than 50%.", tone: "red" }], WATER_EARTH_FOCUS) },
        ],
      },
      {
        title: "Q3 · Water cycle terms",
        prompt: "What is it called when water vapour cools and turns into clouds?",
        conceptId: "9.3",
        options: [
          { label: "Condensation", correct: true, say: "Correct.", frame: frame([{ label: "Condensation", at: [80, 29], note: "Correct.", tone: "green" }], WATER_CYCLE_FOCUS) },
          { label: "Precipitation", correct: false, say: "Precipitation is water falling back down, not clouds forming.", frame: frame([{ label: "Precipitation", at: [88.5, 37], note: "This is falling water, not cloud formation.", tone: "red" }], WATER_CYCLE_FOCUS) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Microplastics",
        prompt: "Which of these is a microbead source?",
        conceptId: "9.5",
        options: [
          { label: "Toothpaste", correct: true, say: "Correct - some toothpaste contains millions of microbeads.", frame: frame([{ label: "Microbeads", at: [39.5, 92], note: "Correct source.", tone: "green" }], MICROPLASTICS_FOCUS) },
          { label: "A polyester jacket", correct: false, say: "A polyester jacket sheds microfibres, not microbeads.", frame: frame([{ label: "Microfibres (from synthetic clothes)", at: [52.5, 92], note: "This is a microfibre source.", tone: "red" }], MICROPLASTICS_FOCUS) },
        ],
      },
      {
        title: "Q5 · Pollution sources",
        prompt: "Which pollution source is linked to damaged tankers at sea?",
        conceptId: "9.6",
        options: [
          { label: "Oil spills", correct: true, say: "Correct.", frame: frame([{ label: "Oil spills", at: [64.5, 94.5], note: "Correct.", tone: "green" }], OTHER_POLLUTION_FOCUS) },
          { label: "Air pollution", correct: false, say: "Air pollution comes from cars, factories and fires - oil spills come from damaged tankers at sea.", frame: frame([{ label: "Air pollution", at: [83.25, 94.5], note: "Not from tankers.", tone: "red" }], OTHER_POLLUTION_FOCUS) },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is the atmosphere?", a: "A blanket of gases (mostly nitrogen, with oxygen and carbon dioxide) held around Earth by gravity." },
    { q: "What percentage of Earth's water is in the oceans?", a: "About 96%." },
    { q: "What are the three stages of the water cycle?", a: "Evaporation, condensation, and precipitation." },
    { q: "What are microbeads and microfibres?", a: "Microbeads are tiny plastic beads in cosmetics/toothpaste; microfibres are shed from synthetic clothes when washed." },
  ],

  chatAnswers: [
    { question: "What is the atmosphere made of?", answer: "The atmosphere is a blanket of gases held around Earth by gravity - mostly nitrogen, with oxygen and carbon dioxide too. It protects us from harmful rays and keeps a safe temperature.", keywords: ["atmosphere", "nitrogen", "oxygen", "gravity"], conceptId: "9.1" },
    { question: "How much water is in Earth's oceans?", answer: "About 96% of all the water on Earth is in the oceans. Less than 2% is in lakes, rivers and soil, and less than 2% is in snow, glaciers and ice caps.", keywords: ["water", "oceans", "96%"], conceptId: "9.2" },
    { question: "What is the water cycle?", answer: "The journey water takes around the Earth: evaporation (heated water rises as vapour), condensation (it cools into clouds), and precipitation (it falls back as rain, hail, sleet or snow). Water never leaves the planet.", keywords: ["water cycle", "evaporation", "condensation", "precipitation"], conceptId: "9.3" },
    { question: "What is water pollution?", answer: "Water pollution is when harmful substances get into water because of human action, making it unsafe. Because water is a good solvent, fresh water often needs treatment before it's safe to drink.", keywords: ["water pollution", "solvent", "treatment"], conceptId: "9.4" },
    { question: "What are microbeads and microfibres?", answer: "Microbeads are tiny plastic beads found in cosmetics and toothpaste. Microfibres are tiny plastic fibres shed from synthetic clothing when washed. Both are microplastics that pollute oceans and can harm fish.", keywords: ["microbeads", "microfibres", "microplastics"], conceptId: "9.5" },
    { question: "What other kinds of pollution are there?", answer: "Oil spills harm water and wildlife; too much fertiliser or pesticide can poison plants, animals and pollinators; air pollution from cars and factories affects breathing; and landfill chemicals can seep into water supplies.", keywords: ["pollution", "oil spills", "pesticides", "air pollution", "landfill"], conceptId: "9.6" },
  ],
};
