import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 3 (Adaptation)
 * - mechanically generated 2026-11-10 from the already-vetted, real-textbook
 * content in lib/boardUnits/cambridge-4-science-3.ts (same concepts, key points,
 * examples, images/hotspots, quick checks and recite prompts), per real
 * user direction: "can you change the entire science and math cambridge
 * 4th grade books into this format". Every image/hotspot/focus region below
 * is reused byte-for-byte from that file, not re-authored.
 */
export const CAMBRIDGE_4_SCIENCE_3_INK: InkUnit = {
  unitKey: "cambridge-4-science-3",
  title: "Adaptation",
  badge: "Grade 4 · Biology · Unit 3",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "3.1",
      title: "🌾 What is adaptation?",
      scenes: [
        {
          label: "1. What is adaptation?",
          say: "An adaptation is something about an animal or plant that allows it to live in its habitat - the place where it has what it needs to survive. Adaptations can be physical or behavioural, and not adapting can lead to a species becoming extinct.",
          ops: [
            { type: "text", value: "🌾 What is adaptation?", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Habitat - the place where a plant or animal has what it needs to survive: food, water, shelter, a place to raise young.\nAdaptations can be physical (e.g. waxy leaves) or behavioural (e.g. birds flying south for winter).\nSpecies - the type of animal or plant.\nExtinct - no more of that species left in the world.\nCotton grass example: small seeds (dispersed by wind), thin leaves (less water loss), short height (protects from cold wind), fluffy white tufts (traps solar heat), and fast seed production (uses the short warm summer).", labelSize: 20 },
          ],
        },
        {
          label: "2. What is an adaptation?",
          say: "An adaptation is something about an animal or plant that lets it live in its habitat. If a species doesn't adapt to changes, it can become extinct - no more left in the world.",
          ops: [
            { type: "text", value: "What is an adaptation?", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 295, h: 220, color: "#16a34a", label: "Seeds\nSmall seeds\nEasily dispersed by the wind.", labelSize: 17 },
            { type: "box", x: 375, y: 120, w: 295, h: 220, color: "#16a34a", label: "Leaves\nThin leaves\nReduce water loss from the plant.", labelSize: 17 },
            { type: "box", x: 690, y: 120, w: 295, h: 220, color: "#16a34a", label: "Height\nNot very tall\nProtects from strong cold winds.", labelSize: 17 },
            { type: "box", x: 1005, y: 120, w: 295, h: 220, color: "#16a34a", label: "Tufts\nFluffy white tufts\nTraps solar heat to keep the plant warm.", labelSize: 17 },
          ],
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is a habitat?\n2. What does 'extinct' mean?\n3. Why does cotton grass have fluffy white tufts?", labelSize: 18 },
            { type: "text", value: "1) The place where a plant or animal has what it needs to survive - food, water, shelter, and a place to raise young. (p.33)\n2) No more of that species left in the world. (p.33)\n3) To trap solar heat and keep the plant warm in a cold climate. (p.33)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is an adaptation, and what is a habitat? An adaptation is something about an animal or plant that lets it live in its habitat - the place where it has what it needs to survive.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is an adaptation, and what is a habitat?\n\nAn adaptation is something about an animal or plant that lets it live in its habitat - the place where it has what it needs to survive.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.1-q1", prompt: "What word means 'the place where a plant or animal has what it needs to survive'?", options: ["Habitat","Adaptation"], correctIndex: 0, explanation: "Correct - a habitat is where a plant or animal has what it needs to survive." },
        { id: "3.1-q2", prompt: "What is a habitat?", options: ["The place where a plant or animal has what it needs to survive","A feature that helps an animal survive"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "3.2",
      title: "🐻‍❄️ Adaptations to different habitats",
      scenes: [
        {
          label: "1. Adaptations to different habitats",
          say: "A polar bear has several physical adaptations that let it survive the cold, icy conditions of the North Pole.",
          ops: [
            { type: "text", value: "🐻‍❄️ Adaptations to different habitats", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Thick layer of fat under the skin - keeps the bear warm.\nSmall ears and small tail - less surface area to lose heat from.\nWhite fur - camouflage against snow and ice.\nBlack nose and a good sense of smell - for finding prey.\nLarge, rough, sandpaper-like paws and big claws - grip on ice, help catch prey.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The whole poster",
          say: "Here are six real examples of adaptation: a polar bear, a lion, a small prey animal, Darwin's finches, an Arctic fox, and desert vs rainforest plants.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit3-adaptations.png",
            "alt": "Six panels of animal and plant adaptations: polar bear, lion, a small prey animal, Darwin's finches, Arctic fox, and desert vs rainforest plants.",
            "title": "Animal and plant adaptations",
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
          label: "3. 🖼️ Explore: Polar bear adaptations",
          say: "The polar bear is physically adapted to the cold: a thick fat layer, small ears and tail to reduce heat loss, white fur for camouflage, and large rough paws with big claws for grip on ice.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit3-adaptations.png",
            "alt": "Six panels of animal and plant adaptations: polar bear, lion, a small prey animal, Darwin's finches, Arctic fox, and desert vs rainforest plants.",
            "title": "Animal and plant adaptations",
            "hotspots": [
              {
                "label": "Fat Layer for Thermal Insulation",
                "at": [
                  8,
                  20
                ],
                "note": "Keeps the bear warm.",
                "tone": "gold"
              },
              {
                "label": "White Fur for Camouflage",
                "at": [
                  30,
                  20
                ],
                "note": "Blends into snow and ice.",
                "tone": "green"
              },
              {
                "label": "Large Rough Paws",
                "at": [
                  17,
                  82
                ],
                "note": "Grip on ice.",
                "tone": "blue"
              },
              {
                "label": "Big Claws for Traction & Hunting",
                "at": [
                  28,
                  78
                ],
                "note": "Helps catch prey and grip ice.",
                "tone": "blue"
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
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Why does a polar bear have a thick layer of fat?\n2. Why is a polar bear's fur white?\n3. Why are a polar bear's ears and tail small?", labelSize: 18 },
            { type: "text", value: "1) To keep it warm in the cold, icy conditions of the North Pole. (p.34)\n2) For camouflage against the snow and ice. (p.34)\n3) Smaller body parts lose less heat, which helps it survive the cold. (p.34)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Name three physical adaptations that help a polar bear survive the cold. Any three of: thick fat layer, small ears, white fur, small tail, large rough paws, big claws.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name three physical adaptations that help a polar bear survive the cold.\n\nAny three of: thick fat layer, small ears, white fur, small tail, large rough paws, big claws.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.2-q1", prompt: "Why is a polar bear's fur white?", options: ["Camouflage in snow and ice","To reflect the sun's heat away"], correctIndex: 0, explanation: "Yes - white fur camouflages the bear against its snowy, icy habitat." },
        { id: "3.2-q2", prompt: "Why does a polar bear have large, rough, sandpaper-like paws?", options: ["For grip on ice and snow","To help it swim faster"], correctIndex: 0, explanation: "Correct - large, rough paws give the bear grip on slippery ice." },
        { id: "3.2-q3", prompt: "Why is the polar bear's fur white?", options: ["Camouflage against snow and ice","To keep it cool in summer"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "3.3",
      title: "🦁 Predator adaptations",
      scenes: [
        {
          label: "1. Predator adaptations",
          say: "A predator hunts and kills other animals (prey) for food. Predators have physical and behavioural adaptations that help them catch their prey.",
          ops: [
            { type: "text", value: "🦁 Predator adaptations", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Physical: sharp teeth and claws, camouflage colouring, streamlined bodies for speed.\nLion example: strong sense of smell, forward-facing eyes (judge distance), loose belly skin (less injury risk), sun-coloured camouflaged fur, rough tongue (peels skin/scrapes flesh), retractable claws, big shoulder/leg muscles (strength to chase prey).\nBehavioural: trapping (e.g. most spiders), ambush (e.g. octopuses, grass snakes, crocodiles, leopards), pack hunting (e.g. hyenas, wolves, army ants, dolphins).", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Lion predator adaptations",
          say: "The lion has many predator adaptations: a strong sense of smell, forward-facing eyes to judge distance, camouflaged fur, a rough tongue, retractable claws, and powerful muscles for chasing prey.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit3-adaptations.png",
            "alt": "Six panels of animal and plant adaptations: polar bear, lion, a small prey animal, Darwin's finches, Arctic fox, and desert vs rainforest plants.",
            "title": "Animal and plant adaptations",
            "hotspots": [
              {
                "label": "Forward-Facing Eyes",
                "at": [
                  58,
                  18
                ],
                "note": "Judges distance when stalking.",
                "tone": "gold"
              },
              {
                "label": "Camouflaged Sun-Coloured Fur",
                "at": [
                  62,
                  25
                ],
                "note": "Blends into dry grassland.",
                "tone": "green"
              },
              {
                "label": "Rough Texture Tongue",
                "at": [
                  37,
                  35
                ],
                "note": "Peels skin, scrapes flesh.",
                "tone": "blue"
              },
              {
                "label": "Loose Belly Skin",
                "at": [
                  40,
                  68
                ],
                "note": "Reduces injury risk from a kick.",
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
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Why do lions have forward-facing eyes?\n2. What job does a lion's rough tongue do?\n3. Name the three types of hunting behaviour described in the book, with an example animal for each.", labelSize: 18 },
            { type: "text", value: "1) To help judge distances accurately when stalking prey. (p.36)\n2) It peels the skin off prey and scrapes flesh from the bone. (p.36)\n3) Trapping (most spiders), ambush (e.g. leopards, crocodiles), pack hunting (e.g. wolves, hyenas). (p.37)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Name three predator adaptations of a lion. Any three of: strong sense of smell, forward-facing eyes, loose belly skin, camouflaged fur, rough tongue, retractable claws, big muscles.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name three predator adaptations of a lion.\n\nAny three of: strong sense of smell, forward-facing eyes, loose belly skin, camouflaged fur, rough tongue, retractable claws, big muscles.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.3-q1", prompt: "Why is loose skin on a lion's belly useful?", options: ["Less chance of injury if kicked by prey","It helps the lion swim"], correctIndex: 0, explanation: "Correct - loose belly skin reduces injury risk if the lion is kicked while grabbing prey." },
        { id: "3.3-q2", prompt: "A leopard hiding, then pouncing when prey comes close, is an example of which hunting behaviour?", options: ["Ambush","Pack hunting"], correctIndex: 0, explanation: "Correct - hiding then pouncing is ambush hunting." },
        { id: "3.3-q3", prompt: "What does a lion's loose belly skin help protect against?", options: ["Injury if kicked by prey","Losing too much body heat"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "3.4",
      title: "🦗 Prey adaptations",
      scenes: [
        {
          label: "1. Prey adaptations",
          say: "Prey adaptations are features that help animals avoid being caught and eaten by predators.",
          ops: [
            { type: "text", value: "🦗 Prey adaptations", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Eyes on the side of the head - wider field of view to spot predators.\nA body built for speed - to escape predators.\nCamouflage - to avoid being seen.\nLiving in groups - safety in numbers.\nGrasshopper example: green colouring like grass makes it harder for birds and snakes to see it.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Prey adaptations",
          say: "Prey animals like this grasshopper have their own adaptations: eyes on the side of the head for a wide view, a fast streamlined body, and camouflage to avoid being seen.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit3-adaptations.png",
            "alt": "Six panels of animal and plant adaptations: polar bear, lion, a small prey animal, Darwin's finches, Arctic fox, and desert vs rainforest plants.",
            "title": "Animal and plant adaptations",
            "hotspots": [
              {
                "label": "Side-Mounted Eyes",
                "at": [
                  15,
                  20
                ],
                "note": "Wide field of view.",
                "tone": "gold"
              },
              {
                "label": "Streamlined Anatomy Built for Speed",
                "at": [
                  85,
                  20
                ],
                "note": "Fast escape from predators.",
                "tone": "green"
              },
              {
                "label": "Environmental Camouflage",
                "at": [
                  85,
                  42
                ],
                "note": "Green colouring like grass.",
                "tone": "blue"
              }
            ],
            "focus": {
              "x": 66,
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
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Why do many prey animals have eyes on the side of their head, rather than the front?\n2. How is the grasshopper camouflaged?", labelSize: 18 },
            { type: "text", value: "1) It gives a wider field of view, helping them spot predators approaching from more directions. (p.38)\n2) It is green, like grass, which makes it harder for its predators (birds and snakes) to see it. (p.38)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Name three prey adaptations. Any three of: eyes on the side of the head, a body built for speed, camouflage, living in groups.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name three prey adaptations.\n\nAny three of: eyes on the side of the head, a body built for speed, camouflage, living in groups.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.4-q1", prompt: "Why do many prey animals have eyes on the sides of their heads?", options: ["A wider field of view to spot predators","To see prey of their own more easily"], correctIndex: 0, explanation: "Yes - side-mounted eyes give a much wider view, helping spot danger from more angles." },
        { id: "3.4-q2", prompt: "Which is a prey adaptation, not a predator adaptation?", options: ["Living in groups","Retractable claws"], correctIndex: 0, explanation: "Correct - living in groups is a prey adaptation for safety in numbers." },
      ],
    },

    {
      topicId: "3.5",
      title: "🐦 Darwin's finches",
      scenes: [
        {
          label: "1. Darwin's finches",
          say: "Charles Darwin noticed that finches on different Galapagos islands had different beaks, adapted to the food available in their habitat. Beaks not adapted to their environment would not survive.",
          ops: [
            { type: "text", value: "🐦 Darwin's finches", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 334, color: "#0369a1", label: "Darwin sailed the world on The Beagle and visited the Galapagos Islands.\nDifferent finch species had different beaks, adapted to their environment's food.\nChisel - finds hidden insects.\nHook - tears flesh.\nNutcracker - cracks nuts and seeds.\nSpear - catches fish in streams.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Darwin's finches",
          say: "Darwin noticed finches on different Galapagos islands had different beaks, each adapted to the food available: a chisel for hidden insects, a hook for tearing flesh, a nutcracker for nuts and seeds, and a spear for fish.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit3-adaptations.png",
            "alt": "Six panels of animal and plant adaptations: polar bear, lion, a small prey animal, Darwin's finches, Arctic fox, and desert vs rainforest plants.",
            "title": "Animal and plant adaptations",
            "hotspots": [
              {
                "label": "Chisel-Like Beak",
                "at": [
                  5,
                  90
                ],
                "note": "Finds hidden insects.",
                "tone": "gold"
              },
              {
                "label": "Hooked Beak",
                "at": [
                  13,
                  90
                ],
                "note": "Tears flesh.",
                "tone": "green"
              },
              {
                "label": "Nutcracker Beak",
                "at": [
                  20,
                  90
                ],
                "note": "Cracks nuts and seeds.",
                "tone": "blue"
              },
              {
                "label": "Spear-Like Beak",
                "at": [
                  28,
                  90
                ],
                "note": "Catches fish in streams.",
                "tone": "red"
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
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What did Darwin notice about finches on different Galapagos islands?\n2. What job does a hooked beak do?\n3. What kind of beak would be best for cracking nuts and seeds?", labelSize: 18 },
            { type: "text", value: "1) They had different beaks, each adapted to the food available on that island. (p.40)\n2) Tears flesh. (p.40)\n3) A nutcracker beak - short and thick. (p.40)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What did Darwin discover about finch beaks? Finches on different Galapagos islands had different beaks, each adapted to the food available on that island.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What did Darwin discover about finch beaks?\n\nFinches on different Galapagos islands had different beaks, each adapted to the food available on that island.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.5-q1", prompt: "Which beak shape is adapted for catching fish in a stream?", options: ["A long, thin spear-like beak","A short, thick nutcracker beak"], correctIndex: 0, explanation: "Correct - a spear-like beak is adapted for catching fish." },
        { id: "3.5-q2", prompt: "A finch that eats mostly hidden insects would be best adapted with which beak?", options: ["A chisel-like beak","A hooked beak"], correctIndex: 0, explanation: "Correct - a chisel-like beak is adapted for finding hidden insects." },
        { id: "3.5-q3", prompt: "Which beak would be best adapted for cracking nuts and seeds?", options: ["A short, thick nutcracker beak","A long, thin spear-like beak"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "3.6",
      title: "🌵 Hot and cold environments",
      scenes: [
        {
          label: "1. Hot and cold environments",
          say: "Animals and plants have adaptations for surviving extreme environments - very cold, or very hot and dry or wet.",
          ops: [
            { type: "text", value: "🌵 Hot and cold environments", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "The Arctic fox has a dark summer coat and a white winter coat - a seasonal camouflage adaptation.\nDesert plants: thick waxy leaves (stop water loss), fleshy stems (store water), spikes (protect stored water from animals).\nRainforest plants: pointed leaves (let rainwater run off), climbing stems (reach light).", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Arctic fox, summer and winter",
          say: "The Arctic fox's coat changes colour with the seasons - dark in summer to match bare ground, and white in winter to match the snow. Both are camouflage.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit3-adaptations.png",
            "alt": "Six panels of animal and plant adaptations: polar bear, lion, a small prey animal, Darwin's finches, Arctic fox, and desert vs rainforest plants.",
            "title": "Animal and plant adaptations",
            "hotspots": [
              {
                "label": "Dark Summer Coat",
                "at": [
                  37,
                  65
                ],
                "note": "Camouflage against rock and soil.",
                "tone": "gold"
              },
              {
                "label": "Pure White Winter Coat",
                "at": [
                  61,
                  65
                ],
                "note": "Camouflage against snow.",
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
          label: "3. 🖼️ Explore: Desert or rainforest plant?",
          say: "Desert plants store and protect water: thick waxy leaves, a fleshy water-storing stem, and sharp spikes. Rainforest plants have plenty of water, but need light: pointed leaves shed rain, and climbing stems reach up to the sun.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit3-adaptations.png",
            "alt": "Six panels of animal and plant adaptations: polar bear, lion, a small prey animal, Darwin's finches, Arctic fox, and desert vs rainforest plants.",
            "title": "Animal and plant adaptations",
            "hotspots": [
              {
                "label": "Thick Waxy Leaves",
                "at": [
                  82,
                  65
                ],
                "note": "Stops water loss (desert).",
                "tone": "gold"
              },
              {
                "label": "Fleshy Water-Storing Stem",
                "at": [
                  82,
                  75
                ],
                "note": "Stores water (desert).",
                "tone": "gold"
              },
              {
                "label": "Pointed Drip-Tip Leaves",
                "at": [
                  94,
                  65
                ],
                "note": "Sheds rainwater (rainforest).",
                "tone": "green"
              },
              {
                "label": "Structural Climbing Stems",
                "at": [
                  94,
                  75
                ],
                "note": "Climbs to reach light (rainforest).",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 66,
              "y": 52,
              "w": 34,
              "h": 48
            }
          },
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Why does the Arctic fox's coat change colour between summer and winter?\n2. Why do desert plants often have thick, waxy leaves?\n3. Why do rainforest plant leaves often have a pointed tip?", labelSize: 18 },
            { type: "text", value: "1) To stay camouflaged as its surroundings change colour across the seasons - dark in summer, white in winter snow. (p.43)\n2) To stop the plant losing water in the hot, dry conditions. (p.43)\n3) So rainwater runs off them easily. (p.43)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Name one adaptation of a desert plant and one of a rainforest plant. Desert: thick waxy leaves, fleshy water-storing stem, or spikes. Rainforest: pointed drip-tip leaves, or climbing stems.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Name one adaptation of a desert plant and one of a rainforest plant.\n\nDesert: thick waxy leaves, fleshy water-storing stem, or spikes. Rainforest: pointed drip-tip leaves, or climbing stems.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.6-q1", prompt: "Thick, waxy leaves that stop water loss belong to which kind of plant?", options: ["A desert plant","A rainforest plant"], correctIndex: 0, explanation: "Correct - desert plants need to stop water loss in hot, dry conditions." },
        { id: "3.6-q2", prompt: "Which feature helps a desert plant protect the water it has stored?", options: ["Sharp spikes","Pointed drip-tip leaves"], correctIndex: 0, explanation: "Correct - spikes protect a desert plant's stored water from thirsty animals." },
        { id: "3.6-q3", prompt: "Why do rainforest plants often have pointed, drip-tip leaves?", options: ["So rainwater runs off them easily","To store water for the dry season"], correctIndex: 0, explanation: "Correct." },
      ],
    },
  ],
};
