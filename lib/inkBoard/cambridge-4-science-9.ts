import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 9 (Planet Earth)
 * - mechanically generated 2026-11-10 from the already-vetted, real-textbook
 * content in lib/boardUnits/cambridge-4-science-9.ts (same concepts, key points,
 * examples, images/hotspots, quick checks and recite prompts), per real
 * user direction: "can you change the entire science and math cambridge
 * 4th grade books into this format". Every image/hotspot/focus region below
 * is reused byte-for-byte from that file, not re-authored.
 */
export const CAMBRIDGE_4_SCIENCE_9_INK: InkUnit = {
  unitKey: "cambridge-4-science-9",
  title: "Planet Earth",
  badge: "Grade 4 · Earth & Space · Unit 9",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "9.1",
      title: "🌍 The atmosphere",
      scenes: [
        {
          label: "1. The atmosphere",
          say: "The atmosphere is the blanket of gases (air) around the Earth, held in place by gravity. It protects the planet from harmful rays, provides the air we breathe, and helps keep Earth at a safe temperature.",
          ops: [
            { type: "text", value: "🌍 The atmosphere", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 334, color: "#0369a1", label: "Atmosphere = the blanket of gases we call air, held in place by gravity.\nProtects Earth from harmful rays from space.\nFormed from volcanic gases when the Earth was formed - contained much more carbon dioxide then.\nJohn Dalton (19th century) first suggested air is not just one gas.\nAir is mostly nitrogen, plus oxygen and carbon dioxide.\nThe atmosphere provides breathable air, stops water being lost from the planet, and keeps the Earth from getting too hot or too cold.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The atmosphere",
          say: "The atmosphere is a blanket of gases held around the Earth by gravity - mostly nitrogen, with oxygen and carbon dioxide too. It protects us and keeps the planet at a safe temperature.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit9-planet-earth.png",
            "alt": "Six panels on Planet Earth: the atmosphere, water on Earth, the water cycle, water pollution, microplastics, and other kinds of pollution.",
            "title": "Planet Earth",
            "hotspots": [
              {
                "label": "Atmosphere - a blanket of gases held by gravity",
                "at": [
                  11.5,
                  23
                ],
                "note": "Protects Earth, keeps a safe temperature.",
                "tone": "gold"
              },
              {
                "label": "Nitrogen",
                "at": [
                  28.75,
                  28
                ],
                "note": "Most of the air.",
                "tone": "green"
              },
              {
                "label": "Oxygen",
                "at": [
                  30.25,
                  33
                ],
                "note": "What we breathe.",
                "tone": "blue"
              },
              {
                "label": "Carbon dioxide",
                "at": [
                  31.75,
                  38
                ],
                "note": "A smaller part of the air.",
                "tone": "red"
              }
            ],
            "focus": {
              "x": 0,
              "y": 8,
              "w": 33,
              "h": 50
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is the atmosphere held in place by?\n2. Who first suggested that air is not just one gas?\n3. Name the three main gases in air.", labelSize: 18 },
            { type: "text", value: "1) The force of gravity. (p.115)\n2) John Dalton, a 19th-century scientist. (p.115)\n3) Nitrogen (most of the air), oxygen, and carbon dioxide. (p.115)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is the atmosphere, and what does it do for us? A blanket of gases (mostly nitrogen, plus oxygen and carbon dioxide) held around Earth by gravity - it protects us, gives us air to breathe, and keeps a safe temperature.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is the atmosphere, and what does it do for us?\n\nA blanket of gases (mostly nitrogen, plus oxygen and carbon dioxide) held around Earth by gravity - it protects us, gives us air to breathe, and keeps a safe temperature.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.1-q1", prompt: "What holds the atmosphere in place around the Earth?", options: ["Gravity","Magnetism"], correctIndex: 0, explanation: "Correct - gravity holds the blanket of gases in place." },
        { id: "9.1-q2", prompt: "Which gas makes up most of the air?", options: ["Nitrogen","Carbon dioxide"], correctIndex: 0, explanation: "Correct - nitrogen makes up most of the air." },
        { id: "9.1-q3", prompt: "Which gas makes up most of the atmosphere?", options: ["Nitrogen","Oxygen"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "9.2",
      title: "💧 Water on Earth",
      scenes: [
        {
          label: "1. Water on Earth",
          say: "About 96% of Earth's water is in the oceans, with just under 2% in lakes, rivers and soil, and just under 2% in snow, glaciers and ice caps. Around 785 million people lack access to clean water near their homes.",
          ops: [
            { type: "text", value: "💧 Water on Earth", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "About 96% of Earth's water is in the oceans.\nJust under 2% is in lakes, rivers and soil.\nJust under 2% is in snow, glaciers and polar ice caps.\nAround 785 million people (about 1 in 10 people) do not have access to clean water near their homes.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Where Earth's water is",
          say: "Almost all of Earth's water - 96% - is in the oceans. Only a tiny amount is in lakes, rivers, soil, snow and ice.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit9-planet-earth.png",
            "alt": "Six panels on Planet Earth: the atmosphere, water on Earth, the water cycle, water pollution, microplastics, and other kinds of pollution.",
            "title": "Planet Earth",
            "hotspots": [
              {
                "label": "96% Oceans",
                "at": [
                  57.75,
                  54.7
                ],
                "note": "Almost all of Earth's water.",
                "tone": "gold"
              },
              {
                "label": "Lakes, rivers, soil (<2%)",
                "at": [
                  41.25,
                  21
                ],
                "note": "A tiny fraction.",
                "tone": "green"
              },
              {
                "label": "Snow, glaciers, ice caps (<2%)",
                "at": [
                  42.75,
                  27
                ],
                "note": "Another tiny fraction.",
                "tone": "blue"
              }
            ],
            "focus": {
              "x": 33,
              "y": 8,
              "w": 34,
              "h": 50
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What percentage of Earth's water is found in the oceans?\n2. Roughly how many people in the world lack access to clean water near their homes?", labelSize: 18 },
            { type: "text", value: "1) About 96%. (p.116)\n2) Around 785 million - about 1 in every 10 people. (p.116)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Where is most of Earth's water found? About 96% is in the oceans; just under 2% is in lakes/rivers/soil, and just under 2% in snow/glaciers/ice caps.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Where is most of Earth's water found?\n\nAbout 96% is in the oceans; just under 2% is in lakes/rivers/soil, and just under 2% in snow/glaciers/ice caps.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.2-q1", prompt: "Where is most of Earth's water found?", options: ["The oceans","Snow and glaciers"], correctIndex: 0, explanation: "Correct - about 96% of Earth's water is in the oceans." },
        { id: "9.2-q2", prompt: "Roughly how many people worldwide lack access to clean water near their homes?", options: ["About 785 million","Almost everyone in the world"], correctIndex: 0, explanation: "Correct - roughly 1 in every 10 people." },
        { id: "9.2-q3", prompt: "About what percentage of Earth's water is in the oceans?", options: ["96%","50%"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "9.3",
      title: "☁️ The water cycle",
      scenes: [
        {
          label: "1. The water cycle",
          say: "Water never leaves the planet - it moves in a journey called the water cycle: evaporation (heated water rises as water vapour), condensation (it cools and forms clouds), and precipitation (it falls back as rain, hail, sleet or snow).",
          ops: [
            { type: "text", value: "☁️ The water cycle", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Evaporation - the Sun heats water, which turns into water vapour and rises into the air.\nCondensation - rising water vapour cools, changes back into tiny liquid droplets, and forms clouds.\nPrecipitation - when droplets get too heavy, water falls back to the ground as rain, hail, sleet or snow.\nThe cycle then begins again - water never leaves the planet.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Evaporation, condensation, precipitation",
          say: "The Sun heats water so it evaporates and rises. It cools and condenses into clouds. Then it falls back down as precipitation - and the whole cycle begins again.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit9-planet-earth.png",
            "alt": "Six panels on Planet Earth: the atmosphere, water on Earth, the water cycle, water pollution, microplastics, and other kinds of pollution.",
            "title": "Planet Earth",
            "hotspots": [
              {
                "label": "Evaporation",
                "at": [
                  72.25,
                  43
                ],
                "note": "Water rises as vapour.",
                "tone": "gold"
              },
              {
                "label": "Condensation",
                "at": [
                  80,
                  29
                ],
                "note": "Vapour cools into clouds.",
                "tone": "green"
              },
              {
                "label": "Precipitation",
                "at": [
                  88.5,
                  37
                ],
                "note": "Falls back as rain, hail, sleet or snow.",
                "tone": "blue"
              }
            ],
            "focus": {
              "x": 67,
              "y": 8,
              "w": 33,
              "h": 50
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is evaporation, in the water cycle?\n2. What happens during condensation?\n3. What is precipitation?", labelSize: 18 },
            { type: "text", value: "1) The Sun heating water so it turns into water vapour and rises into the air. (p.117)\n2) Rising water vapour cools down, condenses, and changes back into tiny drops of liquid water, forming clouds. (p.117)\n3) Water falling back to the ground as rain, hail, sleet or snow, once cloud droplets get too heavy. (p.117)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Describe the three stages of the water cycle. Evaporation (water heats up and rises as vapour), condensation (vapour cools into clouds), and precipitation (water falls back as rain, hail, sleet or snow).",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Describe the three stages of the water cycle.\n\nEvaporation (water heats up and rises as vapour), condensation (vapour cools into clouds), and precipitation (water falls back as rain, hail, sleet or snow).", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.3-q1", prompt: "Which comes first: evaporation or condensation?", options: ["Evaporation","Condensation"], correctIndex: 0, explanation: "Correct - water evaporates and rises before it condenses into clouds." },
        { id: "9.3-q2", prompt: "What happens right after precipitation falls to the ground?", options: ["It collects, and the Sun starts evaporating it again","The water leaves the planet forever"], correctIndex: 0, explanation: "Correct - the water cycle begins again." },
        { id: "9.3-q3", prompt: "What is it called when water vapour cools and turns into clouds?", options: ["Condensation","Precipitation"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "9.4",
      title: "🏭 Water pollution",
      scenes: [
        {
          label: "1. Water pollution",
          say: "Water is a solvent, so it picks up natural and human-made substances - meaning fresh water must be treated before drinking. Water pollution happens when harmful substances get into water by human action.",
          ops: [
            { type: "text", value: "🏭 Water pollution", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 334, color: "#0369a1", label: "Water has been on Earth for 4.6 billion years.\nWater is a solvent - substances dissolve in it, including natural particles like dust and rocks.\nFresh water needs to be treated before it is safe to drink.\nWater pollution = harmful substances entering water by human action.\nReal investigation: pondweed grew healthily in eco-friendly washing-up liquid, but turned brown or died in ordinary washing-up liquid.\nIn 2019, London sewer workers found a fatberg (from fat, oil, grease and wipes) as big as a double-decker bus.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Water pollution",
          say: "Water dissolves substances easily, so pollution from factories and homes can make it unsafe - which is why it must be treated before we drink it.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit9-planet-earth.png",
            "alt": "Six panels on Planet Earth: the atmosphere, water on Earth, the water cycle, water pollution, microplastics, and other kinds of pollution.",
            "title": "Planet Earth",
            "hotspots": [
              {
                "label": "Human pollution makes water unsafe to drink without treatment",
                "at": [
                  23,
                  65
                ],
                "note": "Why treatment is needed.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 0,
              "y": 52,
              "w": 33,
              "h": 48
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Why does fresh water need to be treated before drinking?\n2. What is water pollution?\n3. What was a London fatberg made from?", labelSize: 18 },
            { type: "text", value: "1) Because water is a solvent and picks up natural particles (like dust, soil and rocks) as it falls and flows. (p.120)\n2) Substances that harm plants, people and other animals getting into the water by human action. (p.120)\n3) Fat, oil and grease poured down drains, plus items like nappies, cotton buds and wet wipes flushed down toilets. (p.122)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Why does water often need to be treated before drinking? Because water is a solvent, it dissolves natural and human-made substances as it falls and flows - some of which are harmful.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Why does water often need to be treated before drinking?\n\nBecause water is a solvent, it dissolves natural and human-made substances as it falls and flows - some of which are harmful.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.4-q1", prompt: "Why does fresh water usually need treatment before we drink it?", options: ["Water is a solvent and picks up dissolved particles","Water is always completely pure by itself"], correctIndex: 0, explanation: "Correct - water dissolves natural and human-made substances as it falls and flows." },
        { id: "9.4-q2", prompt: "Why can't we always drink water straight from a river or lake?", options: ["It may contain dissolved or harmful substances","All natural water is always perfectly safe"], correctIndex: 0, explanation: "Correct - water is a solvent and can pick up harmful substances, so it must often be treated." },
      ],
    },

    {
      topicId: "9.5",
      title: "🧴 Microplastics: microbeads and microfibres",
      scenes: [
        {
          label: "1. Microplastics: microbeads and microfibres",
          say: "Microbeads are tiny plastic beads in cosmetics and toothpaste; microfibres shed from synthetic clothes when washed. Both are microplastics that pollute water and harm sea life.",
          ops: [
            { type: "text", value: "🧴 Microplastics: microbeads and microfibres", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Microbeads - tiny plastic beads in facial scrubs, toothpaste and other products; a small tube of toothpaste can contain over 2.8 million.\nFound in oceans worldwide, even remote Arctic ice; 38 countries banned them in 2017.\nFish that swallow microbeads become ill, and microbeads pass into the food chain.\nMicrofibres shed from synthetic clothes (like polyester) when washed - small enough to pass through water treatment filters into rivers, seas and oceans.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Microbeads and microfibres",
          say: "Microbeads from cosmetics and microfibres from washing synthetic clothes are both tiny plastics that slip past filters and pollute the sea.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit9-planet-earth.png",
            "alt": "Six panels on Planet Earth: the atmosphere, water on Earth, the water cycle, water pollution, microplastics, and other kinds of pollution.",
            "title": "Planet Earth",
            "hotspots": [
              {
                "label": "Microbeads",
                "at": [
                  39.5,
                  92
                ],
                "note": "From cosmetics and toothpaste.",
                "tone": "gold"
              },
              {
                "label": "Microfibres (from synthetic clothes)",
                "at": [
                  52.5,
                  92
                ],
                "note": "Shed when washing clothes.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 33,
              "y": 52,
              "w": 34,
              "h": 48
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. How many microbeads can a small tube of toothpaste contain?\n2. In 2017, how many countries made microbeads illegal in products?\n3. Why can microfibres from washing clothes end up in the sea?", labelSize: 18 },
            { type: "text", value: "1) More than 2.8 million. (p.123)\n2) 38 countries. (p.123)\n3) They are small enough to pass through water treatment plant filters. (p.124)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What are microbeads and microfibres? Microbeads are tiny plastic beads in cosmetics and toothpaste; microfibres are shed from synthetic clothes when washed. Both are microplastics that pollute water.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What are microbeads and microfibres?\n\nMicrobeads are tiny plastic beads in cosmetics and toothpaste; microfibres are shed from synthetic clothes when washed. Both are microplastics that pollute water.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.5-q1", prompt: "Tiny plastic beads found in toothpaste and facial scrubs are called...", options: ["Microbeads","Microfibres"], correctIndex: 0, explanation: "Correct." },
        { id: "9.5-q2", prompt: "Washing a fleece jacket made of polyester releases which kind of microplastic?", options: ["Microfibres","Microbeads"], correctIndex: 0, explanation: "Correct - synthetic clothes shed microfibres when washed." },
        { id: "9.5-q3", prompt: "Which of these is a microbead source?", options: ["Toothpaste","A polyester jacket"], correctIndex: 0, explanation: "Correct - some toothpaste contains millions of microbeads." },
      ],
    },

    {
      topicId: "9.6",
      title: "🏗️ Other kinds of pollution",
      scenes: [
        {
          label: "1. Other kinds of pollution",
          say: "Pollution takes many forms: oil spills harm wildlife, fertilisers/pesticides poison plants and animals, air pollution affects breathing, and landfill chemicals seep into water.",
          ops: [
            { type: "text", value: "🏗️ Other kinds of pollution", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 334, color: "#0369a1", label: "Oil spills (e.g. from damaged tankers) pollute water and harm wildlife.\nToo much fertiliser washes into streams/rivers, causing algae that can poison plants and animals.\nPesticides protect crops but can poison birds, fish and pollinating insects.\nAir pollution (from cars, factories, fires) makes breathing harder and can cause or worsen asthma, lung cancer and heart disease.\nLandfill chemicals dissolve in rainwater and reach soil, streams, rivers and oceans; burnt litter pollutes air too.\nAbout 4,500 children die every day from lack of access to clean water.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Other kinds of pollution",
          say: "Pollution comes in many forms - oil spills, pesticides, air pollution, and landfill waste all harm the environment in their own way.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit9-planet-earth.png",
            "alt": "Six panels on Planet Earth: the atmosphere, water on Earth, the water cycle, water pollution, microplastics, and other kinds of pollution.",
            "title": "Planet Earth",
            "hotspots": [
              {
                "label": "Oil spills",
                "at": [
                  64.5,
                  94.5
                ],
                "note": "Harms water and wildlife.",
                "tone": "gold"
              },
              {
                "label": "Pesticides",
                "at": [
                  74,
                  94.5
                ],
                "note": "Can poison birds, fish, pollinators.",
                "tone": "green"
              },
              {
                "label": "Air pollution",
                "at": [
                  83.25,
                  94.5
                ],
                "note": "From cars, factories, fires.",
                "tone": "blue"
              },
              {
                "label": "Landfill waste",
                "at": [
                  92.75,
                  94.5
                ],
                "note": "Chemicals dissolve into water.",
                "tone": "red"
              }
            ],
            "focus": {
              "x": 67,
              "y": 52,
              "w": 33,
              "h": 48
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What can happen if farmers add too much fertiliser to soil?\n2. Name two health problems air pollution can cause or worsen.\n3. About how many children die every day from lack of clean water access?", labelSize: 18 },
            { type: "text", value: "1) It washes into streams and rivers, causing algae to grow that can be poisonous to plants and animals. (p.126)\n2) Any two of: asthma, lung cancer, heart disease. (p.126)\n3) About 4,500. (p.126)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Name three other kinds of pollution and their sources. Any three of: oil spills (tankers), fertiliser/pesticide runoff (farming), air pollution (cars, factories, fires), landfill waste (rubbish).",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name three other kinds of pollution and their sources.\n\nAny three of: oil spills (tankers), fertiliser/pesticide runoff (farming), air pollution (cars, factories, fires), landfill waste (rubbish).", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.6-q1", prompt: "Smoke from factories and cars causing breathing problems is an example of which kind of pollution?", options: ["Air pollution","Oil spills"], correctIndex: 0, explanation: "Correct." },
        { id: "9.6-q2", prompt: "Chemicals from a rubbish mound seeping into rainwater is an example of which pollution source?", options: ["Landfill waste","Pesticides"], correctIndex: 0, explanation: "Correct." },
        { id: "9.6-q3", prompt: "Which pollution source is linked to damaged tankers at sea?", options: ["Oil spills","Air pollution"], correctIndex: 0, explanation: "Correct." },
      ],
    },
  ],
};
