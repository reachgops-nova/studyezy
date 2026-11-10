import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 1 (Plant parts)
 * - mechanically generated 2026-11-10 from the already-vetted, real-textbook
 * content in lib/boardUnits/cambridge-4-science-1.ts (same concepts, key points,
 * examples, images/hotspots, quick checks and recite prompts), per real
 * user direction: "can you change the entire science and math cambridge
 * 4th grade books into this format". Every image/hotspot/focus region below
 * is reused byte-for-byte from that file, not re-authored.
 */
export const CAMBRIDGE_4_SCIENCE_1_INK: InkUnit = {
  unitKey: "cambridge-4-science-1",
  title: "Plant parts",
  badge: "Grade 4 · Biology · Unit 1",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "1.1",
      title: "🌸 Flowering plants",
      scenes: [
        {
          label: "1. Flowering plants",
          say: "A botanist is a scientist who studies plants - their parts, functions, growth and reproduction. Flowers vary hugely in colour and scent.",
          ops: [
            { type: "text", value: "🌸 Flowering plants", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "There are hundreds of thousands of species of flowering plants.\nSome flowers are brightly coloured, e.g. the hibiscus.\nSome flowers are scented and usually smell nice, e.g. jasmine.\nSome flowers are neither brightly coloured nor scented, e.g. rice flowers.", labelSize: 20 },
          ],
        },
        {
          label: "2. Meet the flower",
          say: "Botanists are scientists who study plants - their parts, their functions, and how they grow and reproduce. Flowers come in every colour, and some are scented too.",
          ops: [
            { type: "text", value: "Meet the flower", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 400, h: 220, color: "#16a34a", label: "Bright\nHibiscus\nBrightly coloured, to attract attention.", labelSize: 17 },
            { type: "box", x: 480, y: 120, w: 400, h: 220, color: "#16a34a", label: "Scented\nJasmine\nUsually smells nice.", labelSize: 17 },
            { type: "box", x: 900, y: 120, w: 400, h: 220, color: "#16a34a", label: "Neither\nRice flowers\nNot brightly coloured, not scented.", labelSize: 17 },
          ],
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Why might a flower be brightly coloured?\n2. Name a flower that is scented rather than brightly coloured.\n3. Are all flowers colourful or scented?", labelSize: 18 },
            { type: "text", value: "1) To attract pollinators such as insects and birds towards it. (page 10)\n2) Jasmine - it usually smells nice. (page 10)\n3) No - rice flowers are neither brightly coloured nor scented. (page 10)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is a botanist? A scientist who studies plants - their parts, functions, and how they grow and reproduce.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is a botanist?\n\nA scientist who studies plants - their parts, functions, and how they grow and reproduce.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.1-q1", prompt: "Jasmine is described in the book as which kind of flower?", options: ["Scented","Neither coloured nor scented"], correctIndex: 0, explanation: "Right - jasmine is scented and usually smells nice." },
      ],
    },

    {
      topicId: "1.2",
      title: "🌼 Parts of a flower",
      scenes: [
        {
          label: "1. Parts of a flower",
          say: "A flower can be dissected (taken apart) to study its parts: the petal, the sepal, the stamen (male part) and the carpel (female part), all held up by the stem.",
          ops: [
            { type: "text", value: "🌼 Parts of a flower", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Petal - part of the usually colourful outer ring of the flower.\nSepal - sits beneath the petals, nearer the stem.\nStamen - the male part of the flower.\nCarpel - the female part of the flower.\nStem - supports the whole flower.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The outer parts",
          say: "Every flower is held up by its stem. The petal is usually the colourful outer part, and just beneath it sits the sepal.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit1-flower-parts.png",
            "alt": "Anatomy of a flowering plant: a labelled cross-section showing petal, sepal, stamen (anther, filament), and carpel/pistil (stigma, style, ovary, ovule).",
            "title": "A flower, dissected",
            "hotspots": [
              {
                "label": "Petal",
                "at": [
                  48,
                  34
                ],
                "note": "Usually the most colourful, outer part of the flower.",
                "tone": "green"
              },
              {
                "label": "Sepal",
                "at": [
                  38,
                  62
                ],
                "note": "Sits beneath the petals, nearer the stem.",
                "tone": "blue"
              },
              {
                "label": "Stem",
                "at": [
                  49,
                  67
                ],
                "note": "Holds up the whole flower.",
                "tone": "blue"
              }
            ],
            "focus": {
              "x": 2,
              "y": 14,
              "w": 96,
              "h": 82
            }
          },
        },
        {
          label: "3. 🖼️ Explore: Stamen and carpel",
          say: "Inside the petals sit the flower's two most important parts: the stamen, the male part, and the carpel, the female part.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit1-flower-parts.png",
            "alt": "Anatomy of a flowering plant: a labelled cross-section showing petal, sepal, stamen (anther, filament), and carpel/pistil (stigma, style, ovary, ovule).",
            "title": "A flower, dissected",
            "hotspots": [
              {
                "label": "Stamen (male)",
                "at": [
                  8,
                  43
                ],
                "note": "The male part of the flower.",
                "tone": "gold"
              },
              {
                "label": "Carpel / Pistil (female)",
                "at": [
                  92,
                  43
                ],
                "note": "The female part of the flower.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 2,
              "y": 14,
              "w": 96,
              "h": 82
            }
          },
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What does 'dissect' mean?\n2. Which flower part is usually the most colourful, and sits on the outside?\n3. Which part sits below the petals, closer to the stem?", labelSize: 18 },
            { type: "text", value: "1) To take something apart to study it. (page 11)\n2) The petal. (page 11)\n3) The sepal. (page 11)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Name the four main parts of a flower. The petal, the sepal, the stamen and the carpel - all held up by the stem.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name the four main parts of a flower.\n\nThe petal, the sepal, the stamen and the carpel - all held up by the stem.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.2-q1", prompt: "Which of these is the male part of a flower?", options: ["The stamen","The carpel","The petal"], correctIndex: 0, explanation: "Yes - the stamen is the male part." },
        { id: "1.2-q2", prompt: "Which labelled part is usually the most colourful, outer part of the flower?", options: ["Petal","Sepal","Stem"], correctIndex: 0, explanation: "Yes - the petal is usually the colourful outer part." },
        { id: "1.2-q3", prompt: "Which part of the flower is the male part?", options: ["Stamen","Carpel"], correctIndex: 0, explanation: "Correct - the stamen is the male part." },
        { id: "1.2-q4", prompt: "Which is the male part of a flower?", options: ["Stamen","Carpel"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "1.3",
      title: "🌾 The male parts of a flower",
      scenes: [
        {
          label: "1. The male parts of a flower",
          say: "The stamen is the male part of a flower. It is made of the anther (which produces pollen) and the filament (the stalk that holds the anther up).",
          ops: [
            { type: "text", value: "🌾 The male parts of a flower", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Stamen = anther + filament.\nThe anther produces pollen.\nThe filament is the stalk that holds the anther up.\nA flower usually has several stamens, arranged around the carpel.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Anther and filament",
          say: "Zoom into the stamen: the anther sits at the top and produces pollen. The filament is the stalk beneath it that holds the anther up.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit1-flower-parts.png",
            "alt": "Anatomy of a flowering plant: a labelled cross-section showing petal, sepal, stamen (anther, filament), and carpel/pistil (stigma, style, ovary, ovule).",
            "title": "A flower, dissected",
            "hotspots": [
              {
                "label": "Anther",
                "at": [
                  42,
                  43
                ],
                "note": "Produces pollen.",
                "tone": "gold"
              },
              {
                "label": "Filament",
                "at": [
                  44,
                  54
                ],
                "note": "The stalk that holds the anther up.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 2,
              "y": 26,
              "w": 55,
              "h": 48
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What are the two parts of a stamen?\n2. Which part of the stamen produces pollen?\n3. What job does the filament do?", labelSize: 18 },
            { type: "text", value: "1) The anther and the filament. (page 12)\n2) The anther. (page 12)\n3) It is the stalk that holds the anther up. (page 12)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is the stamen made of, and what does each part do? The anther, which produces pollen, and the filament, the stalk that holds the anther up.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is the stamen made of, and what does each part do?\n\nThe anther, which produces pollen, and the filament, the stalk that holds the anther up.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.3-q1", prompt: "Which part of the stamen actually produces the pollen?", options: ["The anther","The filament"], correctIndex: 0, explanation: "Correct - the anther produces the pollen, sitting at the top of the filament." },
        { id: "1.3-q2", prompt: "What is the job of the anther?", options: ["It produces pollen","It holds the anther up"], correctIndex: 0, explanation: "Yes - the anther produces the pollen." },
        { id: "1.3-q3", prompt: "What does the anther do?", options: ["Produces pollen","Joins stigma to ovary"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "1.4",
      title: "🌷 The female parts of a flower",
      scenes: [
        {
          label: "1. The female parts of a flower",
          say: "The carpel is the female part of a flower. It has three parts: the stigma, the style and the ovary. The ovary contains ovules, which eventually become seeds.",
          ops: [
            { type: "text", value: "🌷 The female parts of a flower", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Carpel = stigma + style + ovary (containing ovules).\nThe ovary contains ovules, which eventually become seeds.\nThe style joins the stigma to the ovary.\nThe whole stigma-to-ovule structure is sometimes called the pistil - like a vase, with the stigma as the rim, the style as the neck, and the ovary (with its ovules) as the base.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Stigma, style, ovary, ovule",
          say: "Zoom into the carpel: the stigma is at the top, the style is the neck joining it to the ovary, and the ovary holds the ovules, which eventually become seeds.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit1-flower-parts.png",
            "alt": "Anatomy of a flowering plant: a labelled cross-section showing petal, sepal, stamen (anther, filament), and carpel/pistil (stigma, style, ovary, ovule).",
            "title": "A flower, dissected",
            "hotspots": [
              {
                "label": "Stigma",
                "at": [
                  50,
                  40
                ],
                "note": "The top of the carpel.",
                "tone": "green"
              },
              {
                "label": "Style",
                "at": [
                  54,
                  47
                ],
                "note": "Joins the stigma to the ovary.",
                "tone": "blue"
              },
              {
                "label": "Ovary",
                "at": [
                  57,
                  57
                ],
                "note": "Contains the ovules.",
                "tone": "gold"
              },
              {
                "label": "Ovule",
                "at": [
                  51,
                  58
                ],
                "note": "Eventually becomes a seed.",
                "tone": "red"
              }
            ],
            "focus": {
              "x": 35,
              "y": 26,
              "w": 63,
              "h": 55
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What are the three parts of the carpel?\n2. What does the ovary contain, and what do those eventually become?\n3. What job does the style do?", labelSize: 18 },
            { type: "text", value: "1) The stigma, the style and the ovary. (page 13)\n2) The ovary contains ovules, which eventually become seeds. (page 13)\n3) It joins the stigma to the ovary. (page 13)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is the carpel made of, and what does each part do? The stigma, the style and the ovary. The ovary holds ovules, which eventually become seeds, and the style joins the stigma to the ovary.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is the carpel made of, and what does each part do?\n\nThe stigma, the style and the ovary. The ovary holds ovules, which eventually become seeds, and the style joins the stigma to the ovary.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.4-q1", prompt: "What part of the carpel eventually becomes a seed?", options: ["The ovule","The stigma"], correctIndex: 0, explanation: "Yes - the ovules inside the ovary eventually become seeds." },
        { id: "1.4-q2", prompt: "Which part of the carpel eventually becomes a seed?", options: ["The ovule","The style"], correctIndex: 0, explanation: "Right - the ovule inside the ovary eventually becomes a seed." },
        { id: "1.4-q3", prompt: "Which part eventually becomes a seed?", options: ["Ovule","Petal"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "1.5",
      title: "🌲 Do all plants have flowers?",
      scenes: [
        {
          label: "1. Do all plants have flowers?",
          say: "Botanists divide plants into two main groups: flowering plants and non-flowering plants. Non-flowering plants include conifers, liverworts, mosses and ferns. All plants make their own food and are green, but not all plants have flowers.",
          ops: [
            { type: "text", value: "🌲 Do all plants have flowers?", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Flowering plants: e.g. hibiscus, jasmine, rice.\nNon-flowering plants: conifers, liverworts, mosses, ferns.\nAll plants (flowering or not) make their own food and are green.\nNot all plants have flowers.", labelSize: 20 },
          ],
        },
        {
          label: "2. Flowering or not?",
          say: "Not every plant has flowers. Botanists group plants into flowering plants and non-flowering plants - like conifers, liverworts, mosses and ferns - but all of them make their own food and are green.",
          ops: [
            { type: "text", value: "Flowering or not?", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 610, h: 240, color: "#0369a1", label: "Flowering plants\n- Hibiscus\n- Jasmine\n- Rice", labelSize: 18 },
            { type: "box", x: 690, y: 120, w: 610, h: 240, color: "#0369a1", label: "Non-flowering plants\n- Conifers\n- Liverworts\n- Mosses\n- Ferns", labelSize: 18 },
          ],
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Name two groups that botanists divide plants into.\n2. Name two examples of non-flowering plants.\n3. Is it true that only flowering plants make their own food?", labelSize: 18 },
            { type: "text", value: "1) Flowering plants and non-flowering plants. (page 14)\n2) Any two of: conifers, liverworts, mosses, ferns. (page 14)\n3) No - all plants make their own food and are green, whether or not they flower. (page 14)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Do all plants have flowers? No - non-flowering plants like conifers, liverworts, mosses and ferns exist too, though all plants make their own food and are green.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Do all plants have flowers?\n\nNo - non-flowering plants like conifers, liverworts, mosses and ferns exist too, though all plants make their own food and are green.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.5-q1", prompt: "Which of these is a non-flowering plant?", options: ["Moss","Hibiscus"], correctIndex: 0, explanation: "Correct - moss is a non-flowering plant, along with conifers, liverworts and ferns." },
        { id: "1.5-q2", prompt: "Which pair are both non-flowering plants?", options: ["Moss and fern","Hibiscus and rice"], correctIndex: 0, explanation: "Correct - both are non-flowering plants." },
      ],
    },
  ],
};
