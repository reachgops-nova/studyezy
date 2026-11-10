import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 2 (The life cycle of a flowering plant)
 * - mechanically generated 2026-11-10 from the already-vetted, real-textbook
 * content in lib/boardUnits/cambridge-4-science-2.ts (same concepts, key points,
 * examples, images/hotspots, quick checks and recite prompts), per real
 * user direction: "can you change the entire science and math cambridge
 * 4th grade books into this format". Every image/hotspot/focus region below
 * is reused byte-for-byte from that file, not re-authored.
 */
export const CAMBRIDGE_4_SCIENCE_2_INK: InkUnit = {
  unitKey: "cambridge-4-science-2",
  title: "The life cycle of a flowering plant",
  badge: "Grade 4 · Biology · Unit 2",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "2.1",
      title: "🌼 Pollination",
      scenes: [
        {
          label: "1. Pollination",
          say: "Flowering plants reproduce - they make new plants. Pollination is when pollen moves from the anther (a male part) to the stigma (a female part) of the same flower or another flower.",
          ops: [
            { type: "text", value: "🌼 Pollination", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Pollen is a fine powder found on the anthers of flowers.\nPollination = pollen moving from anther to stigma.\nThis can happen on the same flower, or between two flowers of the same kind of plant.\nThe life cycle has five stages: pollination, fertilisation, seed development, seed dispersal, germination - then it begins again.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The whole life cycle",
          say: "A flowering plant's life cycle has five stages, always in the same order: pollination, fertilisation, seed development, seed dispersal, and germination - and then it begins all over again.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit2-lifecycle.png",
            "alt": "The 5-stage life cycle of a flowering plant: pollination, fertilisation, seed development, seed dispersal, germination, arranged as a circle.",
            "title": "The life cycle of a flowering plant",
            "hotspots": [],
            "focus": {
              "x": 0,
              "y": 0,
              "w": 100,
              "h": 100
            }
          },
        },
        {
          label: "3. 🖼️ Explore: Anther to stigma",
          say: "Pollination is when pollen moves from the anther, a male part, to the stigma, a female part - of the same flower or another flower of the same kind.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit2-lifecycle.png",
            "alt": "The 5-stage life cycle of a flowering plant: pollination, fertilisation, seed development, seed dispersal, germination, arranged as a circle.",
            "title": "The life cycle of a flowering plant",
            "hotspots": [
              {
                "label": "Anther",
                "at": [
                  91,
                  22
                ],
                "note": "Where pollen comes from.",
                "tone": "gold"
              },
              {
                "label": "Stigma",
                "at": [
                  84,
                  34
                ],
                "note": "Where pollen lands.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 58,
              "y": 0,
              "w": 42,
              "h": 50
            },
            "motionPath": {
              "points": [
                [
                  91,
                  22
                ],
                [
                  84,
                  34
                ]
              ],
              "label": "Pollen reaches the stigma.",
              "tone": "green"
            }
          },
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is pollen, and where is it found?\n2. What is pollination?\n3. How many stages does the life cycle of a flowering plant have?", labelSize: 18 },
            { type: "text", value: "1) A fine powder found on the anthers of flowers. (p.19)\n2) Pollen moving from the anther (male part) to the stigma (female part) of the same flower or another flower. (p.19)\n3) Five: pollination, fertilisation, seed development, seed dispersal, germination. (p.18-27)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "What is pollination? Pollen moving from the anther (a male part) to the stigma (a female part) of the same flower or another flower.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is pollination?\n\nPollen moving from the anther (a male part) to the stigma (a female part) of the same flower or another flower.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.1-q1", prompt: "Pollination is pollen moving from the anther to which other part?", options: ["The stigma","The ovary"], correctIndex: 0, explanation: "Yes - pollen moves from the anther (male) to the stigma (female)." },
        { id: "2.1-q2", prompt: "Pollen is produced on which flower part?", options: ["The anther","The stigma"], correctIndex: 0, explanation: "Correct - pollen is found on the anther." },
        { id: "2.1-q3", prompt: "Pollination is pollen moving from the anther to which part?", options: ["The stigma","The petal"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "2.2",
      title: "🐝 Animals and wind as pollinators",
      scenes: [
        {
          label: "1. Animals and wind as pollinators",
          say: "The plant cannot move pollen by itself, so it needs help. Animals such as bees, bats and hummingbirds brush against pollen and carry it to another flower. Some plants use wind instead.",
          ops: [
            { type: "text", value: "🐝 Animals and wind as pollinators", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Pollinators: animals (mammals, birds, insects) that accidentally carry pollen between flowers.\nPlants attract pollinators with brightly coloured petals, a pleasant scent, or nectar (a sugary liquid).\nA butterfly reaching nectar with its tongue brushes against the anthers and picks up pollen.\nSome plants (e.g. those with catkins) use wind instead of animals - wind-pollinated flowers are usually dull, not colourful, and do not need nectar.", labelSize: 20 },
          ],
        },
        {
          label: "2. Animals and wind",
          say: "The plant cannot move its own pollen, so it needs help - from animals like bees, bats and hummingbirds, or sometimes from the wind.",
          ops: [
            { type: "text", value: "Animals and wind", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 295, h: 220, color: "#16a34a", label: "Insect\nBee\nBrushes against anthers while feeding, carrying pollen to the next flower.", labelSize: 17 },
            { type: "box", x: 375, y: 120, w: 295, h: 220, color: "#16a34a", label: "Mammal\nBat\nVisits flowers at night and picks up pollen the same way.", labelSize: 17 },
            { type: "box", x: 690, y: 120, w: 295, h: 220, color: "#16a34a", label: "Bird\nHummingbird\nFeeds on nectar and carries pollen between flowers.", labelSize: 17 },
            { type: "box", x: 1005, y: 120, w: 295, h: 220, color: "#16a34a", label: "No animal\nWind (catkins)\nDull, not colourful, no nectar needed.", labelSize: 17 },
          ],
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Name three animals that can be pollinators.\n2. Why do many flowers have brightly coloured petals or a scent?\n3. Why are wind-pollinated flowers usually dull rather than colourful?", labelSize: 18 },
            { type: "text", value: "1) Any three of: bees, bats, hummingbirds (or other mammals, birds, insects). (p.20)\n2) To attract pollinators so they stop by and pick up pollen. (p.20)\n3) They do not need to attract animal pollinators, since the wind carries their pollen instead. (p.20)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Name two kinds of pollinators. Any two of: bees, bats, hummingbirds, or the wind (e.g. for catkins).",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name two kinds of pollinators.\n\nAny two of: bees, bats, hummingbirds, or the wind (e.g. for catkins).", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.2-q1", prompt: "Why might a flower have brightly coloured petals or a nice scent?", options: ["To attract pollinators","To scare away insects"], correctIndex: 0, explanation: "Right - bright colours and scent attract animals that will carry pollen for the plant." },
      ],
    },

    {
      topicId: "2.3",
      title: "🌱 Fertilisation",
      scenes: [
        {
          label: "1. Fertilisation",
          say: "Fertilisation is the next step: a pollen grain on the stigma grows a pollen tube down through the style to the ovary, where the male cell joins the female cell in the ovule.",
          ops: [
            { type: "text", value: "🌱 Fertilisation", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "A pollen grain lands on the stigma of a flower of the same kind of plant.\nThe pollen grain grows a pollen tube down through the centre of the style towards the ovary.\nThe male cell inside the pollen grain passes down the tube to join the female cell in the ovule - this is fertilisation.\nAfter fertilisation, the ovary develops into a fruit where seeds grow.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The pollen tube",
          say: "Once pollen lands on the stigma, it grows a pollen tube down through the style. The male cell travels down this tube to join the female cell in the ovule - that is fertilisation.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit2-lifecycle.png",
            "alt": "The 5-stage life cycle of a flowering plant: pollination, fertilisation, seed development, seed dispersal, germination, arranged as a circle.",
            "title": "The life cycle of a flowering plant",
            "hotspots": [
              {
                "label": "Pollen grain",
                "at": [
                  90,
                  63
                ],
                "note": "Lands on the stigma.",
                "tone": "gold"
              },
              {
                "label": "Style",
                "at": [
                  86,
                  69
                ],
                "note": "The tube grows down through here.",
                "tone": "blue"
              },
              {
                "label": "Ovary",
                "at": [
                  90,
                  78
                ],
                "note": "Contains the ovule, where fertilisation happens.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 72,
              "y": 50,
              "w": 28,
              "h": 48
            },
            "motionPath": {
              "points": [
                [
                  90,
                  63
                ],
                [
                  86,
                  69
                ],
                [
                  90,
                  78
                ]
              ],
              "label": "The pollen tube reaches the ovary.",
              "tone": "gold"
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What grows down through the style after a pollen grain lands on the stigma?\n2. Where do the male and female cells join during fertilisation?\n3. What does the ovary develop into after fertilisation?", labelSize: 18 },
            { type: "text", value: "1) A pollen tube. (p.22)\n2) In the ovule. (p.22)\n3) A fruit, where seeds grow. (p.22)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What happens during fertilisation? A pollen tube grows down through the style to the ovary, where the male cell joins the female cell in the ovule.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What happens during fertilisation?\n\nA pollen tube grows down through the style to the ovary, where the male cell joins the female cell in the ovule.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.3-q1", prompt: "The pollen tube grows down through which part to reach the ovary?", options: ["The style","The petal"], correctIndex: 0, explanation: "Correct - the pollen tube grows down through the style towards the ovary." },
        { id: "2.3-q2", prompt: "What grows down through the style towards the ovary?", options: ["A pollen tube","A new petal"], correctIndex: 0, explanation: "Yes - the pollen grain grows a pollen tube down through the style." },
        { id: "2.3-q3", prompt: "What does the pollen tube deliver to the ovule?", options: ["The male cell","A new seed coat"], correctIndex: 0, explanation: "Correct - the male cell travels down the pollen tube to join the female cell." },
      ],
    },

    {
      topicId: "2.4",
      title: "🌰 Seed development",
      scenes: [
        {
          label: "1. Seed development",
          say: "Once a flower has been fertilised, the ovary develops into a fruit where seeds grow. A seed has three main parts: an embryo, a food supply, and a seed coat.",
          ops: [
            { type: "text", value: "🌰 Seed development", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Embryo - the baby plant.\nFood supply - feeds the embryo until it can make its own food.\nSeed coat - protects the seed from damage.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Inside a seed",
          say: "After fertilisation, the ovary becomes a fruit, and seeds form inside it. Every seed has the same three parts: an embryo, a food supply, and a protective seed coat.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit2-lifecycle.png",
            "alt": "The 5-stage life cycle of a flowering plant: pollination, fertilisation, seed development, seed dispersal, germination, arranged as a circle.",
            "title": "The life cycle of a flowering plant",
            "hotspots": [
              {
                "label": "Embryo",
                "at": [
                  40,
                  89
                ],
                "note": "The baby plant.",
                "tone": "gold"
              },
              {
                "label": "Food Supply",
                "at": [
                  49,
                  70
                ],
                "note": "Feeds the embryo.",
                "tone": "green"
              },
              {
                "label": "Seed Coat",
                "at": [
                  40,
                  81
                ],
                "note": "Protects the seed.",
                "tone": "blue"
              }
            ],
            "focus": {
              "x": 35,
              "y": 55,
              "w": 37,
              "h": 45
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What are the three main parts of a seed?\n2. What is the embryo?\n3. What job does the seed coat do?", labelSize: 18 },
            { type: "text", value: "1) The embryo, a food supply, and the seed coat. (p.23)\n2) The baby plant, inside the seed. (p.23)\n3) It protects the seed from damage. (p.23)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Name the three parts of a seed. The embryo (baby plant), a food supply, and the seed coat (protects it).",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name the three parts of a seed.\n\nThe embryo (baby plant), a food supply, and the seed coat (protects it).", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.4-q1", prompt: "Which part of the seed is the baby plant?", options: ["The embryo","The seed coat"], correctIndex: 0, explanation: "Yes - the embryo is the baby plant." },
        { id: "2.4-q2", prompt: "Which part of a seed protects it from damage?", options: ["The seed coat","The food supply"], correctIndex: 0, explanation: "Correct - the seed coat protects the seed from damage." },
        { id: "2.4-q3", prompt: "Which part of a seed is the baby plant?", options: ["The embryo","The food supply"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "2.5",
      title: "🍃 Seed dispersal",
      scenes: [
        {
          label: "1. Seed dispersal",
          say: "Seed dispersal is when a ripe fruit, or just its seeds, move away from the parent plant - by wind, by animals, or by other methods.",
          ops: [
            { type: "text", value: "🍃 Seed dispersal", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Wind dispersal has three types: gliders (stiff wings, e.g. Javan cucumber), parachutes (light fluffy parts, e.g. thistle), and shakers (seeds fall from openings when the stalk is shaken, e.g. poppy).\nAnimal dispersal: hooks that catch onto fur or clothing (e.g. burrs - the inspiration for Velcro), or fruits that are eaten and later pass through in droppings (these are often soft, sweet-smelling and juicy).\nOther methods include drop and roll, explosion, and water.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Wind or animal?",
          say: "Seeds move away from the parent plant in different ways: the wind can carry light, fluffy seeds, and animals can carry hooked seeds in their fur or eat fruit and pass the seeds on later.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit2-lifecycle.png",
            "alt": "The 5-stage life cycle of a flowering plant: pollination, fertilisation, seed development, seed dispersal, germination, arranged as a circle.",
            "title": "The life cycle of a flowering plant",
            "hotspots": [
              {
                "label": "Wind Dispersal",
                "at": [
                  10,
                  72
                ],
                "note": "Light seeds carried by the wind.",
                "tone": "gold"
              },
              {
                "label": "Animal Dispersal",
                "at": [
                  25,
                  72
                ],
                "note": "Hooked onto fur, or eaten and passed on.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 0,
              "y": 53,
              "w": 35,
              "h": 46
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Name the three types of wind dispersal.\n2. How do hooked seeds like burrs get dispersed?\n3. Why are animal-eaten fruits often soft, sweet and juicy?", labelSize: 18 },
            { type: "text", value: "1) Gliders, parachutes, and shakers. (p.24-25)\n2) They catch onto the fur of passing animals or onto clothing, and fall off later - sometimes a long way from the parent plant. (p.26)\n3) To attract animals to eat them, so the seeds inside are carried away and later dispersed in the animal's droppings. (p.26)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Name three ways seeds are dispersed. Any three of: wind (gliders, parachutes, shakers), animal hooks, being eaten by animals, drop and roll, explosion, water.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name three ways seeds are dispersed.\n\nAny three of: wind (gliders, parachutes, shakers), animal hooks, being eaten by animals, drop and roll, explosion, water.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.5-q1", prompt: "A dandelion seed with a fluffy 'parachute' is dispersed by which method?", options: ["Wind","Animal"], correctIndex: 0, explanation: "Correct - its fluffy parachute lets the wind carry it away from the parent plant." },
        { id: "2.5-q2", prompt: "A seed covered in tiny hooks that catch onto animal fur is dispersed by which method?", options: ["Animal dispersal","Wind dispersal"], correctIndex: 0, explanation: "Right - hooks that catch onto fur are a form of animal dispersal." },
        { id: "2.5-q3", prompt: "A soft, sweet-smelling fruit that an animal eats disperses its seeds by which method?", options: ["Being eaten, then passed in droppings","Gliding on the wind"], correctIndex: 0, explanation: "Correct - animals eat the fruit and later pass the seeds in their droppings, often far from the parent plant." },
      ],
    },

    {
      topicId: "2.6",
      title: "🌾 Germination",
      scenes: [
        {
          label: "1. Germination",
          say: "When a seed begins to grow, we say it has germinated. Most seeds need water and warmth (not light) to germinate, and use their food supply until they can make their own food.",
          ops: [
            { type: "text", value: "🌾 Germination", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Germinated = a seed has begun to grow.\nMost seeds need water and warmth to germinate - not light, since they are buried in soil.\nThe seed uses its own food supply until the plant has leaves and can use sunlight to make food.\nGermination rate = the percentage of planted seeds that germinate, e.g. 88 out of 100 seeds germinating is a germination rate of 88%.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Root down, shoot up",
          say: "When a seed germinates, it sends a root downward into the soil and a shoot upward, using its own food store until it can grow leaves and make food from sunlight.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit2-lifecycle.png",
            "alt": "The 5-stage life cycle of a flowering plant: pollination, fertilisation, seed development, seed dispersal, germination, arranged as a circle.",
            "title": "The life cycle of a flowering plant",
            "hotspots": [
              {
                "label": "Root growing downward",
                "at": [
                  8,
                  34
                ],
                "note": "Grows down into the soil.",
                "tone": "gold"
              },
              {
                "label": "Shoot growing upward",
                "at": [
                  20,
                  17
                ],
                "note": "Grows up towards the light.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 0,
              "y": 0,
              "w": 28,
              "h": 52
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What two things do most seeds need to germinate?\n2. Why don't seeds need light to germinate?\n3. Class 5 planted 100 tomato seeds and 88 germinated. What is the germination rate?", labelSize: 18 },
            { type: "text", value: "1) Water and warmth. (p.27)\n2) Because they are buried in the soil, and use their own food supply until they have leaves and can use sunlight. (p.27)\n3) 88%. (p.27)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What does a seed need to germinate, and what is a germination rate? Water and warmth (not light). A germination rate is the percentage of planted seeds that germinate.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What does a seed need to germinate, and what is a germination rate?\n\nWater and warmth (not light). A germination rate is the percentage of planted seeds that germinate.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.6-q1", prompt: "In the picture, which two things grow from the germinating seed?", options: ["A root growing down and a shoot growing up","Two roots, both growing down"], correctIndex: 0, explanation: "Yes - the root grows downward into the soil and the shoot grows upward." },
        { id: "2.6-q2", prompt: "100 seeds were planted and 75 germinated. What is the germination rate?", options: ["75%","100%"], correctIndex: 0, explanation: "Correct - 75 out of 100 is a germination rate of 75%." },
        { id: "2.6-q3", prompt: "60 seeds were planted and 45 germinated. What is the germination rate?", options: ["75%","45%"], correctIndex: 0, explanation: "Correct - 45 out of 60 is 75%." },
      ],
    },
  ],
};
