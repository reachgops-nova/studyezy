import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 4 (The digestive system)
 * - mechanically generated 2026-11-10 from the already-vetted, real-textbook
 * content in lib/boardUnits/cambridge-4-science-4.ts (same concepts, key points,
 * examples, images/hotspots, quick checks and recite prompts), per real
 * user direction: "can you change the entire science and math cambridge
 * 4th grade books into this format". Every image/hotspot/focus region below
 * is reused byte-for-byte from that file, not re-authored.
 */
export const CAMBRIDGE_4_SCIENCE_4_INK: InkUnit = {
  unitKey: "cambridge-4-science-4",
  title: "The digestive system",
  badge: "Grade 4 · Biology · Unit 4",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "4.1",
      title: "🐛 Digestion",
      scenes: [
        {
          label: "1. Digestion",
          say: "Digestion is the process of breaking down food so it can be used by the body. The digestive system has three main jobs: it breaks down food, absorbs nutrients, and gets rid of waste.",
          ops: [
            { type: "text", value: "🐛 Digestion", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Digestion starts in the mouth.\nThe digestive system: breaks down food, absorbs nutrients from food, gets rid of waste.\nAll animals have digestive systems; some are very different from a human's.\nA caterpillar's digestive system is simple: a mouth, then a long tube called the intestine (front and back sections), which stores nutrients in a layer of fat called the fat body. Unused food is excreted as droppings.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: What is digestion?",
          say: "Digestion breaks down food so the body can use it. The digestive system has three jobs: breaking down food, absorbing nutrients, and getting rid of waste. A caterpillar has one of the simplest digestive systems of all.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit4-digestive-system.png",
            "alt": "Four panels: the human digestive system, a caterpillar's digestive system, the balanced diet plate, and sugar dangers.",
            "title": "The digestive system",
            "hotspots": [
              {
                "label": "Mouth",
                "at": [
                  56,
                  20
                ],
                "note": "Chews leaf matter.",
                "tone": "green"
              },
              {
                "label": "Intestine (Front & Back Sections)",
                "at": [
                  75,
                  32
                ],
                "note": "Long tube that breaks down food.",
                "tone": "blue"
              },
              {
                "label": "Fat Body",
                "at": [
                  87,
                  19
                ],
                "note": "Stores nutrients as fat.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 50,
              "y": 8,
              "w": 50,
              "h": 47
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What are the three main jobs of the digestive system?\n2. In a caterpillar, what is the 'fat body'?\n3. What happens to food a caterpillar's body cannot use?", labelSize: 18 },
            { type: "text", value: "1) It breaks down food, it absorbs nutrients from food, and it gets rid of waste. (p.45)\n2) A layer of fat where the digestive system eventually stores nutrients. (p.45)\n3) It is excreted (got rid of) as droppings. (p.45)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What are the three main jobs of the digestive system? It breaks down food, absorbs nutrients from food, and gets rid of waste.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What are the three main jobs of the digestive system?\n\nIt breaks down food, absorbs nutrients from food, and gets rid of waste.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.1-q1", prompt: "Which of these is NOT one of the digestive system's three main jobs?", options: ["Pumping blood around the body","Getting rid of waste"], correctIndex: 0, explanation: "Correct - that's the heart's job, not the digestive system's." },
        { id: "4.1-q2", prompt: "What does 'digestion' mean?", options: ["Breaking down food so it can be used by the body","Growing bigger and taller"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "4.2",
      title: "🧑 The human digestive system",
      scenes: [
        {
          label: "1. The human digestive system",
          say: "The human digestive system is made up of several parts that work together to extract the nutrients the body needs from food and drink: mouth, oesophagus, stomach, small intestine, and large intestine.",
          ops: [
            { type: "text", value: "🧑 The human digestive system", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Mouth - food is mixed with saliva, and teeth grind it into smaller pieces.\nOesophagus - the tube between the mouth and the stomach.\nStomach - mixes food with acid.\nSmall intestine - absorbs nutrients.\nLarge intestine - processes waste before it leaves the body.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The human digestive system",
          say: "Food travels through the human digestive system in order: the mouth, then the oesophagus, the stomach, the small intestine, and finally the large intestine.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit4-digestive-system.png",
            "alt": "Four panels: the human digestive system, a caterpillar's digestive system, the balanced diet plate, and sugar dangers.",
            "title": "The digestive system",
            "hotspots": [
              {
                "label": "Mouth",
                "at": [
                  11,
                  18
                ],
                "note": "Grinds food, mixes with saliva.",
                "tone": "gold"
              },
              {
                "label": "Oesophagus",
                "at": [
                  28,
                  21
                ],
                "note": "Connecting tube to the stomach.",
                "tone": "green"
              },
              {
                "label": "Stomach",
                "at": [
                  28,
                  30
                ],
                "note": "Mixes food with acid.",
                "tone": "blue"
              },
              {
                "label": "Small Intestine",
                "at": [
                  16,
                  35
                ],
                "note": "Absorbs liquid nutrients.",
                "tone": "red"
              },
              {
                "label": "Large Intestine",
                "at": [
                  28,
                  38
                ],
                "note": "Processes waste before excretion.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 0,
              "y": 8,
              "w": 50,
              "h": 47
            },
            "motionPath": {
              "points": [
                [
                  11,
                  18
                ],
                [
                  28,
                  21
                ],
                [
                  28,
                  30
                ],
                [
                  16,
                  35
                ],
                [
                  28,
                  38
                ]
              ],
              "label": "Food has travelled the whole digestive system.",
              "tone": "gold"
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What does 'extract' mean, in the context of digestion?\n2. Put these in order: stomach, mouth, oesophagus, small intestine, large intestine.\n3. Why does food need to be broken into smaller pieces in the mouth before it travels down the oesophagus?", labelSize: 18 },
            { type: "text", value: "1) To take out - the digestive system extracts the nutrients the body needs from food and drink. (p.46)\n2) Mouth, oesophagus, stomach, small intestine, large intestine. (p.46)\n3) So it can travel down without causing damage. (p.46)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Name the five main parts of the human digestive system, in order. Mouth, oesophagus, stomach, small intestine, large intestine.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name the five main parts of the human digestive system, in order.\n\nMouth, oesophagus, stomach, small intestine, large intestine.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.2-q1", prompt: "Which part comes right after the stomach?", options: ["Small intestine","Mouth"], correctIndex: 0, explanation: "Yes - after the stomach, food travels into the small intestine." },
        { id: "4.2-q2", prompt: "Which part of the digestive system comes right before the small intestine?", options: ["Stomach","Large intestine"], correctIndex: 0, explanation: "Correct - food goes from the stomach into the small intestine." },
        { id: "4.2-q3", prompt: "Which comes first: the oesophagus or the stomach?", options: ["Oesophagus","Stomach"], correctIndex: 0, explanation: "Correct - food travels down the oesophagus before reaching the stomach." },
      ],
    },

    {
      topicId: "4.3",
      title: "🧪 A model of the digestive system",
      scenes: [
        {
          label: "1. A model of the digestive system",
          say: "A hands-on model can represent the digestive system: a plastic bag with orange juice represents the stomach, a tights leg represents the small intestine, and a cup with a hole represents the large intestine.",
          ops: [
            { type: "text", value: "🧪 A model of the digestive system", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "The liquid that flows out of the 'tights leg' (small intestine) represents nutrients absorbed by the body for growth and energy.\nWhat remains inside represents waste that cannot be absorbed.\nPushing waste through the cup with a hole (large intestine) represents going to the toilet - producing faeces.\nIn real humans: the small intestine is about 5 metres long; the large intestine is about 1.5 metres long.\nHorses, rhinos and rabbits have very large intestines - about 10 to 13 times the length of their bodies.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Modelling the small and large intestine",
          say: "In the model, a tights leg represents the small intestine - the liquid squeezed out is the nutrients your body absorbs. The waste that's left goes into a cup with a hole, representing the large intestine and going to the toilet.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit4-digestive-system.png",
            "alt": "Four panels: the human digestive system, a caterpillar's digestive system, the balanced diet plate, and sugar dangers.",
            "title": "The digestive system",
            "hotspots": [
              {
                "label": "Small Intestine",
                "at": [
                  16,
                  35
                ],
                "note": "About 5 metres long - absorbs nutrients.",
                "tone": "gold"
              },
              {
                "label": "Large Intestine",
                "at": [
                  28,
                  38
                ],
                "note": "About 1.5 metres long - forms faeces.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 0,
              "y": 8,
              "w": 50,
              "h": 47
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. In the model, what does the liquid that flows out of the tights leg represent?\n2. About how long is the human small intestine?\n3. About how long is the human large intestine?", labelSize: 18 },
            { type: "text", value: "1) The nutrients absorbed by the body and used for growth and energy. (p.49)\n2) About 5 metres long. (p.49)\n3) About 1.5 metres long. (p.49)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What do the small intestine and large intestine each do? The small intestine absorbs nutrients for the body. The large intestine processes what's left as waste, before it leaves the body as faeces.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What do the small intestine and large intestine each do?\n\nThe small intestine absorbs nutrients for the body. The large intestine processes what's left as waste, before it leaves the body as faeces.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.3-q1", prompt: "Which is longer in a human: the small intestine or the large intestine?", options: ["The small intestine (about 5 metres)","The large intestine (about 5 metres)"], correctIndex: 0, explanation: "Correct - the small intestine (about 5 m) is much longer than the large intestine (about 1.5 m)." },
        { id: "4.3-q2", prompt: "In the digestive-system model, what does the liquid squeezed from the 'tights leg' represent?", options: ["Nutrients absorbed by the body","Faeces"], correctIndex: 0, explanation: "Correct - that liquid represents the nutrients absorbed for growth and energy." },
        { id: "4.3-q3", prompt: "About how long is the human small intestine?", options: ["About 5 metres","About 1.5 metres"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "4.4",
      title: "🍽️ Thinking about balanced diets",
      scenes: [
        {
          label: "1. Thinking about balanced diets",
          say: "A balanced diet means eating the right amount of food from each food group every day, plus enough water. The balanced food plate has five groups, each with its own job.",
          ops: [
            { type: "text", value: "🍽️ Thinking about balanced diets", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 378, color: "#0369a1", label: "Carbohydrates (bread, rice, potatoes, pasta) - give energy.\nProtein (fish, eggs, meat, beans, pulses) - growth and repair.\nDairy foods (milk, cheese and alternatives) - healthy, strong bones and teeth.\nFruit and vegetables - vitamins and fibre, keep the digestive system healthy.\nFats and oils - help store energy.\nFoods high in fat and sugar (biscuits, crisps, chocolate) - only occasionally, as a treat.\nOur bodies need about 8 glasses of water a day to stay healthy.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The balanced diet plate",
          say: "A balanced diet has the right amount from every food group: carbohydrates for energy, protein for growth and repair, dairy for bones and teeth, fruit and veg for vitamins, and fats for storing energy.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit4-digestive-system.png",
            "alt": "Four panels: the human digestive system, a caterpillar's digestive system, the balanced diet plate, and sugar dangers.",
            "title": "The digestive system",
            "hotspots": [
              {
                "label": "Carbohydrates",
                "at": [
                  17,
                  65
                ],
                "note": "Essential energy.",
                "tone": "gold"
              },
              {
                "label": "Dairy Foods",
                "at": [
                  28,
                  63
                ],
                "note": "Healthy bones and teeth.",
                "tone": "green"
              },
              {
                "label": "Fats and Oils",
                "at": [
                  30,
                  75
                ],
                "note": "Store energy.",
                "tone": "blue"
              },
              {
                "label": "Protein",
                "at": [
                  28,
                  84
                ],
                "note": "Growth and repair.",
                "tone": "red"
              },
              {
                "label": "Fruit and Vegetables",
                "at": [
                  12,
                  81
                ],
                "note": "Vitamins, fibre, healthy digestion.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 0,
              "y": 50,
              "w": 50,
              "h": 50
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Which food group gives the body energy?\n2. Which food group helps the body grow and repair itself?\n3. How much water does the body need each day to stay healthy?", labelSize: 18 },
            { type: "text", value: "1) Carbohydrates. (p.51)\n2) Protein. (p.52)\n3) About 8 glasses. (p.51)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Name the five food groups on the balanced diet plate. Carbohydrates, protein, dairy foods, fruit and vegetables, and fats and oils.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name the five food groups on the balanced diet plate.\n\nCarbohydrates, protein, dairy foods, fruit and vegetables, and fats and oils.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.4-q1", prompt: "Which food group is needed for healthy, strong bones and teeth?", options: ["Dairy foods","Carbohydrates"], correctIndex: 0, explanation: "Correct - dairy foods like milk and cheese are needed for healthy bones and teeth." },
        { id: "4.4-q2", prompt: "Which food group mainly gives the body energy?", options: ["Carbohydrates","Protein"], correctIndex: 0, explanation: "Correct - carbohydrates give the body energy." },
        { id: "4.4-q3", prompt: "Which food group should be eaten only occasionally, as a treat?", options: ["Foods high in fat and sugar","Fruit and vegetables"], correctIndex: 0, explanation: "Correct - foods like biscuits, crisps and chocolate should only be eaten occasionally." },
      ],
    },

    {
      topicId: "4.5",
      title: "🍬 Hidden sugar dangers",
      scenes: [
        {
          label: "1. Hidden sugar dangers",
          say: "The recommended maximum daily sugar for 7-10 year olds is 6 teaspoons (24 grams). Eating too much sugar can lead to tooth decay, obesity, and (later in life) Type 2 diabetes.",
          ops: [
            { type: "text", value: "🍬 Hidden sugar dangers", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Maximum recommended daily sugar for 7-10 year olds: 6 teaspoons (24 g).\nToo much sugar and not brushing teeth regularly can cause tooth decay.\nToo many extra calories can lead to obesity (too much body fat), which can cause heart disease and joint problems.\nEating too much sugar over time can lead to Type 2 diabetes when a person is older.\nSugary foods can make you feel full, so you don't want to eat healthier food - leading to an unbalanced diet.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Sugar dangers",
          say: "The recommended maximum sugar for a 7 to 10 year old is 6 teaspoons a day. Too much sugar can cause tooth decay now, and obesity or Type 2 diabetes later in life.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit4-digestive-system.png",
            "alt": "Four panels: the human digestive system, a caterpillar's digestive system, the balanced diet plate, and sugar dangers.",
            "title": "The digestive system",
            "hotspots": [
              {
                "label": "Max Daily Sugar",
                "at": [
                  64,
                  65
                ],
                "note": "6 teaspoons = 24g, the daily max.",
                "tone": "gold"
              },
              {
                "label": "Tooth Decay",
                "at": [
                  60,
                  81
                ],
                "note": "From excess sugar.",
                "tone": "green"
              },
              {
                "label": "Obesity Risk",
                "at": [
                  75,
                  81
                ],
                "note": "From extra sugary calories.",
                "tone": "blue"
              },
              {
                "label": "Type 2 Diabetes",
                "at": [
                  91,
                  80
                ],
                "note": "Risk increases when older.",
                "tone": "red"
              }
            ],
            "focus": {
              "x": 50,
              "y": 50,
              "w": 50,
              "h": 50
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is the recommended maximum daily sugar for a 7-10 year old?\n2. Name two health problems linked to eating too much sugar.\n3. What does 'obese' mean?", labelSize: 18 },
            { type: "text", value: "1) 6 teaspoons, or 24 grams. (p.54)\n2) Any two of: tooth decay, obesity, Type 2 diabetes. (p.54)\n3) Having too much fat for your body. (p.54)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is the recommended maximum daily sugar for a 7-10 year old, and what can too much sugar cause? 6 teaspoons (24g). Too much can cause tooth decay, obesity, and Type 2 diabetes later in life.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is the recommended maximum daily sugar for a 7-10 year old, and what can too much sugar cause?\n\n6 teaspoons (24g). Too much can cause tooth decay, obesity, and Type 2 diabetes later in life.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.5-q1", prompt: "What is the recommended maximum daily sugar for a 7-10 year old?", options: ["6 teaspoons (24g)","6 teaspoons a meal"], correctIndex: 0, explanation: "Correct - 6 teaspoons, or 24 grams, is the recommended daily maximum." },
        { id: "4.5-q2", prompt: "Which of these is a real risk of eating too much sugar, according to the book?", options: ["Tooth decay","Better eyesight"], correctIndex: 0, explanation: "Correct - too much sugar, without regular brushing, can cause tooth decay." },
        { id: "4.5-q3", prompt: "What is the recommended maximum daily sugar for a 7-10 year old, in teaspoons?", options: ["6 teaspoons","24 teaspoons"], correctIndex: 0, explanation: "Correct - 6 teaspoons, or 24 grams." },
      ],
    },
  ],
};
