import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 8 (Magnetism)
 * - mechanically generated 2026-11-10 from the already-vetted, real-textbook
 * content in lib/boardUnits/cambridge-4-science-8.ts (same concepts, key points,
 * examples, images/hotspots, quick checks and recite prompts), per real
 * user direction: "can you change the entire science and math cambridge
 * 4th grade books into this format". Every image/hotspot/focus region below
 * is reused byte-for-byte from that file, not re-authored.
 */
export const CAMBRIDGE_4_SCIENCE_8_INK: InkUnit = {
  unitKey: "cambridge-4-science-8",
  title: "Magnetism",
  badge: "Grade 4 · Physics · Unit 8",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "8.1",
      title: "🧲 What is a magnet?",
      scenes: [
        {
          label: "1. What is a magnet?",
          say: "Materials made from iron are magnetic. Steel contains iron, so steel objects are attracted to magnets too. Other metals, like aluminium, copper and gold, are not magnetic.",
          ops: [
            { type: "text", value: "🧲 What is a magnet?", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Iron is magnetic; any metal containing iron (like steel) is attracted to magnets.\nAluminium, copper and gold are NOT magnetic - not all metals are attracted to magnets.\nThe word 'magnet' comes from lodestone, a naturally magnetic rock the ancient Greeks called magnetite, discovered in a region called Magnesia.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Magnetic or not?",
          say: "Iron and steel are magnetic - a magnet attracts them. Aluminium, copper and gold are not magnetic at all.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit8-magnetism.png",
            "alt": "Six panels of magnetism: magnetic vs non-magnetic materials, poles, magnetic field lines, magnet shapes, magnets working at a distance, and the Earth as a magnet.",
            "title": "Magnetism",
            "hotspots": [
              {
                "label": "Magnetic (contains iron)",
                "at": [
                  10,
                  53
                ],
                "note": "Steel paper clip, iron nail.",
                "tone": "gold"
              },
              {
                "label": "NOT magnetic",
                "at": [
                  25,
                  53
                ],
                "note": "Aluminium foil, copper coin, gold ring.",
                "tone": "green"
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
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Why are steel paper clips attracted to a magnet?\n2. Name a metal that is NOT attracted to a magnet.\n3. What was the ancient Greek name for a naturally magnetic rock?", labelSize: 18 },
            { type: "text", value: "1) Steel contains iron, and iron is magnetic. (p.106)\n2) Any of: aluminium, copper, gold. (p.106)\n3) Magnetite (lodestone), named after the region of Magnesia. (p.104)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Why are iron and steel magnetic, but aluminium, copper and gold are not? Iron is a magnetic material, and steel contains iron - so both are attracted to magnets. Aluminium, copper and gold are simply not magnetic materials.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Why are iron and steel magnetic, but aluminium, copper and gold are not?\n\nIron is a magnetic material, and steel contains iron - so both are attracted to magnets. Aluminium, copper and gold are simply not magnetic materials.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "8.1-q1", prompt: "Which of these would a magnet attract?", options: ["A steel nail","A gold ring"], correctIndex: 0, explanation: "Correct - steel contains iron, so it's magnetic." },
        { id: "8.1-q2", prompt: "Which of these metals is magnetic?", options: ["Steel","Aluminium"], correctIndex: 0, explanation: "Correct - steel contains iron, so it's magnetic." },
        { id: "8.1-q3", prompt: "Which metal is magnetic?", options: ["Iron","Copper"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "8.2",
      title: "🔴 North and south poles",
      scenes: [
        {
          label: "1. North and south poles",
          say: "Every magnet has a north pole and a south pole. Like poles repel each other; unlike poles attract each other.",
          ops: [
            { type: "text", value: "🔴 North and south poles", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Like poles repel: N + N, or S + S.\nUnlike poles attract: N + S.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Like and unlike poles",
          say: "Every magnet has a north and a south pole. Like poles - two norths, or two souths - push apart. Unlike poles - a north and a south - pull together.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit8-magnetism.png",
            "alt": "Six panels of magnetism: magnetic vs non-magnetic materials, poles, magnetic field lines, magnet shapes, magnets working at a distance, and the Earth as a magnet.",
            "title": "Magnetism",
            "hotspots": [
              {
                "label": "Like poles REPEL",
                "at": [
                  41.75,
                  47
                ],
                "note": "N+N or S+S push apart.",
                "tone": "gold"
              },
              {
                "label": "Unlike poles ATTRACT",
                "at": [
                  60,
                  47
                ],
                "note": "N+S pull together.",
                "tone": "green"
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
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What happens when you put two north poles together?\n2. What happens when you put a north pole and a south pole together?", labelSize: 18 },
            { type: "text", value: "1) They repel (push apart). (p.106)\n2) They attract (pull together). (p.106)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What happens when you put like poles together, and unlike poles together? Like poles (N+N or S+S) repel. Unlike poles (N+S) attract.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What happens when you put like poles together, and unlike poles together?\n\nLike poles (N+N or S+S) repel. Unlike poles (N+S) attract.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "8.2-q1", prompt: "Two magnets are placed with their south poles facing each other. What happens?", options: ["They repel","They attract"], correctIndex: 0, explanation: "Correct - like poles (S + S) repel each other." },
        { id: "8.2-q2", prompt: "Two magnets attract each other. What must be true of the poles facing each other?", options: ["They are unlike poles (N and S)","They are like poles (both N, or both S)"], correctIndex: 0, explanation: "Correct - unlike poles attract." },
        { id: "8.2-q3", prompt: "Do like poles attract or repel?", options: ["Repel","Attract"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "8.3",
      title: "🌀 Magnetic fields",
      scenes: [
        {
          label: "1. Magnetic fields",
          say: "Magnets attract or repel at a distance, through an invisible force called a magnetic field. Iron filings placed near a magnet reveal the field's pattern.",
          ops: [
            { type: "text", value: "🌀 Magnetic fields", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "A magnetic field is the invisible area of force around a magnet.\nIron filings (tiny bits of iron) are attracted along the field, revealing its pattern.\nField lines go out from the north pole and curve round into the south pole.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The invisible field",
          say: "A magnet's force field is invisible, but iron filings reveal its shape - lines curving out from the north pole and round into the south pole.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit8-magnetism.png",
            "alt": "Six panels of magnetism: magnetic vs non-magnetic materials, poles, magnetic field lines, magnet shapes, magnets working at a distance, and the Earth as a magnet.",
            "title": "Magnetism",
            "hotspots": [
              {
                "label": "Magnetic field lines (invisible force)",
                "at": [
                  84.75,
                  47.5
                ],
                "note": "N to S, revealed by iron filings.",
                "tone": "gold"
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
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. How can we see the pattern of an invisible magnetic field?\n2. Which way do magnetic field lines point - into the north pole or out of it?", labelSize: 18 },
            { type: "text", value: "1) By using iron filings, which line up along the field around a magnet. (p.107)\n2) Out of the north pole, curving round into the south pole. (p.107)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is a magnetic field, and how can we see its pattern? An invisible area of force around a magnet. Iron filings line up along it, revealing its pattern.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is a magnetic field, and how can we see its pattern?\n\nAn invisible area of force around a magnet. Iron filings line up along it, revealing its pattern.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "8.3-q1", prompt: "How do scientists reveal the pattern of a magnet's invisible field?", options: ["Using iron filings","Using a magnifying glass"], correctIndex: 0, explanation: "Correct - iron filings line up along the magnetic field, showing its pattern." },
        { id: "8.3-q2", prompt: "What reveals the pattern of an invisible magnetic field?", options: ["Iron filings","A magnifying glass"], correctIndex: 0, explanation: "Correct." },
        { id: "8.3-q3", prompt: "What reveals the shape of a magnetic field?", options: ["Iron filings","Sand"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "8.4",
      title: "📏 Magnets, distance and materials",
      scenes: [
        {
          label: "1. Magnets, distance and materials",
          say: "A magnet does not need to touch an object to attract it - the object just needs to be inside the magnet's field. A magnetic field can also work through some materials, but not others.",
          ops: [
            { type: "text", value: "📏 Magnets, distance and materials", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Magnetic forces work over a distance - no touching needed.\nAn object must be inside the magnetic field to be attracted.\nA magnetic field may not work through a material that is too thick.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Attracting without touching",
          say: "A magnet doesn't need to touch a paper clip to pull it - as soon as the paper clip is inside the magnetic field, the force acts on it.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit8-magnetism.png",
            "alt": "Six panels of magnetism: magnetic vs non-magnetic materials, poles, magnetic field lines, magnet shapes, magnets working at a distance, and the Earth as a magnet.",
            "title": "Magnetism",
            "hotspots": [
              {
                "label": "Magnets can attract without touching",
                "at": [
                  55.5,
                  88.7
                ],
                "note": "Works at a distance.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 33,
              "y": 58,
              "w": 34,
              "h": 42
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Does a magnet have to touch a paper clip to move it?\n2. Why might a magnet fail to attract a paper clip through a thick book?", labelSize: 18 },
            { type: "text", value: "1) No - it just needs to bring the paper clip inside its magnetic field. (p.111)\n2) A magnetic field may not work through a material that is too thick. (p.108)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Does a magnet need to touch an object to attract it? No - the object just needs to be inside the magnet's magnetic field.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Does a magnet need to touch an object to attract it?\n\nNo - the object just needs to be inside the magnet's magnetic field.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "8.4-q1", prompt: "Does a magnet need to touch an object made of magnetic material to move it?", options: ["No - it just needs to be close enough","Yes - they must always touch"], correctIndex: 0, explanation: "Correct - the object needs to be inside the magnetic field, not touching." },
        { id: "8.4-q2", prompt: "For a magnet to attract a paper clip, does the paper clip need to touch the magnet?", options: ["No, just be inside the magnetic field","Yes, they must touch"], correctIndex: 0, explanation: "Correct." },
        { id: "8.4-q3", prompt: "Can a magnet attract an object without touching it?", options: ["Yes, if the object is inside its magnetic field","No, they must always touch"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "8.5",
      title: "🧪 Do all magnets have the same strength?",
      scenes: [
        {
          label: "1. Do all magnets have the same strength?",
          say: "Magnets come in different shapes - horseshoe, ring, bar and circular - and not all magnets are the same strength. Scientists use standard measurements to compare them fairly.",
          ops: [
            { type: "text", value: "🧪 Do all magnets have the same strength?", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Magnet shapes: horseshoe, ring, bar, circular.\nNot all magnets have the same strength - some are stronger than others.\nStandard measurements (like grams or centimetres) let scientists compare and share results; non-standard measurements (like counting different-sized paper clips) cannot be fairly compared.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Not all magnets are equal",
          say: "Magnets come in different shapes - horseshoe, ring, bar and circular - but shape alone doesn't tell you the strength. Some magnets are simply stronger than others.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit8-magnetism.png",
            "alt": "Six panels of magnetism: magnetic vs non-magnetic materials, poles, magnetic field lines, magnet shapes, magnets working at a distance, and the Earth as a magnet.",
            "title": "Magnetism",
            "hotspots": [
              {
                "label": "Not all magnets are the same strength",
                "at": [
                  17.75,
                  92.3
                ],
                "note": "Horseshoe, ring, bar, circular.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 0,
              "y": 58,
              "w": 33,
              "h": 42
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Name the four magnet shapes shown in the book.\n2. Why is counting paper clips of different sizes not a fair way to compare magnet strength?", labelSize: 18 },
            { type: "text", value: "1) Horseshoe, ring, bar, and circular. (p.109)\n2) It's a non-standard measurement - the paper clips need to be a standard size (or use a standard measurement like grams) for the comparison to be fair. (p.111)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Do all magnets have the same strength? No - magnets come in different shapes (horseshoe, ring, bar, circular) and some are stronger than others, regardless of size or shape.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Do all magnets have the same strength?\n\nNo - magnets come in different shapes (horseshoe, ring, bar, circular) and some are stronger than others, regardless of size or shape.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "8.5-q1", prompt: "Does the biggest magnet always have the strongest field?", options: ["Not necessarily - strength varies between magnets","Yes - bigger always means stronger"], correctIndex: 0, explanation: "Correct - not all magnets have the same strength, regardless of shape or size." },
      ],
    },

    {
      topicId: "8.6",
      title: "🌍 The Earth as a magnet",
      scenes: [
        {
          label: "1. The Earth as a magnet",
          say: "The Earth has a magnetic north and south, caused by electric currents inside it and its rotation - its magnetic field looks similar to a bar magnet's. Many animals sense this field to navigate.",
          ops: [
            { type: "text", value: "🌍 The Earth as a magnet", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Electric currents inside the Earth, combined with its rotation, form a magnetic field extending around the planet.\nThe Earth's magnetic field looks similar to the field around a bar magnet.\nSome sharks are repelled by magnets; lobsters, bees, moles, rats, whales and migrating birds use the Earth's magnetic field to navigate.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The Earth's own magnetic field",
          say: "The Earth behaves like a giant bar magnet, with a magnetic north and south caused by electric currents and its spin. Animals like bees, birds and sharks can sense this field.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit8-magnetism.png",
            "alt": "Six panels of magnetism: magnetic vs non-magnetic materials, poles, magnetic field lines, magnet shapes, magnets working at a distance, and the Earth as a magnet.",
            "title": "Magnetism",
            "hotspots": [
              {
                "label": "Caused by electric currents inside the spinning Earth",
                "at": [
                  70,
                  91
                ],
                "note": "Why the Earth has a field.",
                "tone": "gold"
              },
              {
                "label": "Some animals sense the Earth's magnetic field to navigate",
                "at": [
                  95,
                  80
                ],
                "note": "Bees, birds, sharks and more.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 67,
              "y": 58,
              "w": 33,
              "h": 42
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What causes the Earth's magnetic field?\n2. Name two animals that use the Earth's magnetic field to navigate.", labelSize: 18 },
            { type: "text", value: "1) Electric currents inside the Earth, combined with the Earth's rotation on its axis. (p.112)\n2) Any two of: lobsters, bees, moles, rats, whales, migrating birds. (p.112)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What causes the Earth's magnetic field? Electric currents inside the Earth, combined with the Earth's rotation on its axis.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What causes the Earth's magnetic field?\n\nElectric currents inside the Earth, combined with the Earth's rotation on its axis.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "8.6-q1", prompt: "What causes the Earth's magnetic field?", options: ["Electric currents inside the Earth, and its rotation","A giant bar magnet buried inside the Earth"], correctIndex: 0, explanation: "Correct." },
        { id: "8.6-q2", prompt: "Which animal is mentioned as using the Earth's magnetic field to navigate?", options: ["A migrating bird","A goldfish"], correctIndex: 0, explanation: "Correct - migrating birds use the Earth's magnetic field to navigate." },
      ],
    },
  ],
};
