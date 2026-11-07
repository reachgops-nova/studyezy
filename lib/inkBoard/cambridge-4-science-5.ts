import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 5 (States
 * of matter) - same real Hodder Learner's Book 4 content already vetted and
 * used in the card-based lib/boardUnits/cambridge-4-science-5.ts (pages
 * 57-71: the particle model, common gases, water's unusual expansion on
 * freezing, boiling point, evaporation, condensation, mixtures/dissolving,
 * separating mixtures). Added 2026-11-07 per real user direction: "convert
 * IGCSE science states of matter unit into whiteboard learning... make it
 * good and interesting for learning and enable exercise for the kids to
 * work it up cleanly" - lib/unitRouting.ts's resolveUnitHref() prefers an
 * ink board over the card-based Board whenever both exist for the same
 * unitKey, so registering this swaps just Unit 5 to the new whiteboard
 * style while every other Cambridge Grade 4 Science unit keeps its
 * existing card-based Board untouched.
 */
export const CAMBRIDGE_4_SCIENCE_5_INK: InkUnit = {
  unitKey: "cambridge-4-science-5",
  title: "States of Matter",
  badge: "Grade 4 · Chemistry · Unit 5",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "5.1",
      title: "🧊 Solids, Liquids and Gases",
      scenes: [
        {
          label: "1. Three states of matter",
          say: "Everything around us is made of matter, and matter exists in three states: solid, liquid, and gas. A brick is a solid. The water in your glass is a liquid. The air you breathe is a gas. Let's find out what makes each one different.",
          ops: [
            { type: "text", value: "🧊 States of Matter", x: 60, y: 60, color: "#1e293b", size: 30 },
            { type: "box", x: 60, y: 120, w: 380, h: 110, color: "#b45309", label: "SOLID\ne.g. a brick, ice, wood", labelSize: 22 },
            { type: "box", x: 490, y: 120, w: 380, h: 110, color: "#0369a1", label: "LIQUID\ne.g. water, juice, oil", labelSize: 22 },
            { type: "box", x: 920, y: 120, w: 380, h: 110, color: "#6b21a8", label: "GAS\ne.g. air, water vapour", labelSize: 22 },
            { type: "text", value: "All matter is made of tiny particles - the three states just arrange them differently!", x: 60, y: 290, color: "#1e293b", size: 22 },
          ],
        },
        {
          label: "2. Particle picture: solid",
          say: "In a solid, the particles are packed tightly together in a fixed pattern, like soldiers standing in rows. They can only wobble in place - they cannot move past each other. That is why a solid keeps its own shape.",
          ops: [
            { type: "text", value: "A SOLID - particles packed tight, fixed pattern", x: 60, y: 60, color: "#b45309", size: 24 },
            { type: "box", x: 60, y: 100, w: 420, h: 220, color: "#b45309" },
            { type: "text", value: "●●●●●●●●", x: 90, y: 150, color: "#b45309", size: 26 },
            { type: "text", value: "●●●●●●●●", x: 90, y: 190, color: "#b45309", size: 26 },
            { type: "text", value: "●●●●●●●●", x: 90, y: 230, color: "#b45309", size: 26 },
            { type: "text", value: "●●●●●●●●", x: 90, y: 270, color: "#b45309", size: 26 },
            { type: "text", value: "✔ keeps its shape\n✔ keeps its volume\n✘ cannot be poured\n✔ can be cut or shaped", x: 540, y: 140, color: "#1e293b", size: 22 },
          ],
        },
        {
          label: "3. Particle picture: liquid",
          say: "In a liquid, the particles are still close together, but they are jumbled up, not in rows. They can slide and roll past each other. That is why a liquid can flow and be poured, and takes the shape of whatever container it's in.",
          ops: [
            { type: "text", value: "A LIQUID - particles close but jumbled, able to flow", x: 60, y: 60, color: "#0369a1", size: 24 },
            { type: "box", x: 60, y: 100, w: 420, h: 220, color: "#0369a1" },
            { type: "text", value: "●● ●●● ● ●●", x: 90, y: 150, color: "#0369a1", size: 26 },
            { type: "text", value: "● ●● ●●● ●●", x: 90, y: 190, color: "#0369a1", size: 26 },
            { type: "text", value: "●●● ● ●● ●", x: 90, y: 230, color: "#0369a1", size: 26 },
            { type: "text", value: "●● ●●● ●● ●", x: 90, y: 270, color: "#0369a1", size: 26 },
            { type: "text", value: "✔ keeps its volume\n✘ does NOT keep its shape\n✔ can be poured\n✔ takes the shape of its container", x: 540, y: 140, color: "#1e293b", size: 22 },
          ],
        },
        {
          label: "4. Particle picture: gas",
          say: "In a gas, the particles are spread far apart and zoom around freely at high speed, bouncing in every direction. That is why a gas has no fixed shape or volume at all - it spreads out to fill whatever space it is in, and escapes if the container isn't sealed.",
          ops: [
            { type: "text", value: "A GAS - particles spread far apart, moving fast", x: 60, y: 60, color: "#6b21a8", size: 24 },
            { type: "box", x: 60, y: 100, w: 420, h: 220, color: "#6b21a8" },
            { type: "text", value: "●", x: 100, y: 140, color: "#6b21a8", size: 26 },
            { type: "text", value: "●", x: 250, y: 160, color: "#6b21a8", size: 26 },
            { type: "text", value: "●", x: 400, y: 130, color: "#6b21a8", size: 26 },
            { type: "text", value: "●", x: 150, y: 220, color: "#6b21a8", size: 26 },
            { type: "text", value: "●", x: 350, y: 250, color: "#6b21a8", size: 26 },
            { type: "text", value: "●", x: 220, y: 290, color: "#6b21a8", size: 26 },
            { type: "text", value: "●", x: 420, y: 300, color: "#6b21a8", size: 26 },
            { type: "text", value: "✘ no fixed shape\n✘ no fixed volume\n✔ fills the whole container\n✔ can be squashed (compressed) easily", x: 540, y: 140, color: "#1e293b", size: 22 },
          ],
        },
        {
          label: "5. 💡 Tip: the container test",
          say: "Here's a real trick scientists use. If you're not sure which state something is, ask: does it keep its own shape without any container? If yes, it's a solid. If it needs a container to hold a shape but still has a flat top surface, it's a liquid. If it spreads to fill the WHOLE container with no surface at all, it's a gas.",
          ops: [
            { type: "text", value: "💡 Tip: The Container Test", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 260, color: TIP_COLOR, label: "Does it keep its shape with NO container?\n   → YES: it's a SOLID\n\nDoes it need a container, but still has a flat top (a surface)?\n   → YES: it's a LIQUID\n\nDoes it spread out and fill the ENTIRE container, no surface at all?\n   → YES: it's a GAS", labelSize: 22 },
          ],
        },
        {
          label: "6. ✍️ Try it yourself",
          say: "Your turn! Think about playdough, the juice in your lunchbox, and the gas inside a balloon. Which state is each one in, and why? Work it out before checking the answer.",
          ops: [
            { type: "text", value: "✍️ Try it yourself - classify these", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 600, h: 260, color: PRACTICE_COLOR, label: "1. Playdough - can be squashed and shaped\n   but doesn't flow on its own.\n\n2. Juice in a lunchbox - takes the shape\n   of the bottle and can be poured.\n\n3. The gas inside a blown-up balloon.\n\nWhich state is each one? Why?", labelSize: 20 },
            { type: "text", value: "Answers: 1) Solid - keeps its shape at rest.\n2) Liquid - pourable, keeps its volume.\n3) Gas - spreads to fill the whole balloon.", x: 720, y: 160, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "5.1-q1", prompt: "Which state of matter can be poured but always keeps the same volume?", options: ["A liquid", "A solid", "A gas"], correctIndex: 0, explanation: "A liquid keeps its volume but changes shape to fit its container - that's what lets it be poured." },
        { id: "5.1-q2", prompt: "Why does a gas need a sealed container?", options: ["It has no fixed shape or volume, so it escapes if not sealed", "It is always poisonous", "It weighs nothing at all"], correctIndex: 0, explanation: "Gas particles move freely in every direction, so an unsealed gas simply spreads away." },
        { id: "5.1-q3", prompt: "In which state are the particles packed tightly in a fixed pattern?", options: ["Solid", "Liquid", "Gas"], correctIndex: 0, explanation: "A solid's particles can only wobble in place, held in a fixed arrangement - that's why it keeps its shape." },
        { id: "5.1-q4", prompt: "Which state of matter can be squashed (compressed) most easily?", options: ["Gas", "Liquid", "Solid"], correctIndex: 0, explanation: "Gas particles are spread far apart with lots of empty space between them, so they can be pushed much closer together." },
      ],
    },

    {
      topicId: "5.2",
      title: "💨 Common Gases Around Us",
      scenes: [
        {
          label: "1. Four gases, four jobs",
          say: "The air around us is a mixture of gases. Four of them are especially useful: carbon dioxide, oxygen, nitrogen, and hydrogen. Each one has its own special job because of its own special properties.",
          ops: [
            { type: "text", value: "💨 Four Common Gases", x: 60, y: 60, color: "#1e293b", size: 30 },
            { type: "box", x: 60, y: 120, w: 300, h: 150, color: "#16a34a", label: "CARBON DIOXIDE (CO₂)\n• the fizz in fizzy drinks\n• used in fire extinguishers", labelSize: 19 },
            { type: "box", x: 390, y: 120, w: 300, h: 150, color: "#0284c7", label: "OXYGEN (O₂)\n• needed for breathing\n• divers carry it in tanks", labelSize: 19 },
            { type: "box", x: 720, y: 120, w: 300, h: 150, color: "#ca8a04", label: "NITROGEN (N₂)\n• keeps packaged food fresh\n• used as a fertiliser", labelSize: 19 },
            { type: "box", x: 1050, y: 120, w: 300, h: 150, color: "#dc2626", label: "HYDROGEN (H₂)\n• catches fire easily\n• used as rocket fuel", labelSize: 19 },
          ],
        },
        {
          label: "2. Gases can be squashed",
          say: "Divers carry oxygen tanks, not giant balloons. That's because gases, like all gases, can be compressed - squashed into a much smaller space. A tank can hold a huge amount of oxygen squeezed tightly inside it.",
          ops: [
            { type: "text", value: "Why a small tank holds so much oxygen", x: 60, y: 60, color: "#0284c7", size: 24 },
            { type: "box", x: 60, y: 120, w: 1260, h: 180, color: "#0284c7", label: "A gas's particles are spread far apart with lots of space between them.\nSquashing (compressing) the gas pushes the particles closer together -\nso a small, strong tank can store a lot of oxygen for a diver to breathe.", labelSize: 22 },
          ],
        },
        {
          label: "3. 💡 Tip: remembering the four gases",
          say: "Here's a memory trick. C for Carbon dioxide - think 'Cola fizz'. O for Oxygen - think 'Ocean diver'. N for Nitrogen - think 'Nice and fresh food'. H for Hydrogen - think 'High-flying rocket'. The first letter of the job matches the first letter of the gas's use!",
          ops: [
            { type: "text", value: "💡 Tip: C-O-N-H matches the job", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 260, color: TIP_COLOR, label: "Carbon dioxide  →  Cola fizz (and fire extinguishers)\nOxygen          →  Ocean diver breathing underwater\nNitrogen        →  Nice and fresh packaged food\nHydrogen        →  High-flying rocket fuel\n\nMatch the gas's first letter to its most famous job!", labelSize: 22 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! A bag of crisps puffs up a little to stop the crisps breaking, and keeps them fresher for longer. A fizzy drink loses its fizz once the bottle has been open a long time. Which gas is doing each job?",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 620, h: 220, color: PRACTICE_COLOR, label: "1. A bag of crisps is puffed up with gas\n   to protect the crisps and keep them fresh.\n\n2. An open fizzy drink slowly loses its fizz.\n\nWhich gas is at work in each one?", labelSize: 20 },
            { type: "text", value: "Answers: 1) Nitrogen - keeps food fresh.\n2) Carbon dioxide - it's the fizz, and it\nslowly escapes once the bottle is open.", x: 740, y: 160, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "5.2-q1", prompt: "Which gas is the fizz in fizzy drinks?", options: ["Carbon dioxide", "Oxygen", "Nitrogen"], correctIndex: 0, explanation: "Carbon dioxide dissolved in the drink makes the bubbles - the fizz." },
        { id: "5.2-q2", prompt: "Which gas is blown into food packaging to keep food fresh?", options: ["Nitrogen", "Hydrogen", "Oxygen"], correctIndex: 0, explanation: "Nitrogen pushes out the oxygen in the packet, which helps food stay fresh for longer." },
        { id: "5.2-q3", prompt: "Why is hydrogen used as rocket fuel?", options: ["It catches fire easily", "It is the heaviest gas", "It smells nice"], correctIndex: 0, explanation: "Hydrogen burns very easily and powerfully, which is exactly what a rocket needs for lift-off." },
        { id: "5.2-q4", prompt: "Why can a diver's small tank hold so much oxygen?", options: ["The gas is compressed (squashed) into it", "Oxygen has no particles", "The tank is actually a liquid"], correctIndex: 0, explanation: "Gases can be squashed much more easily than liquids or solids, packing a lot of gas into a small space." },
      ],
    },

    {
      topicId: "5.3",
      title: "❄️ Melting and Freezing",
      scenes: [
        {
          label: "1. Melting and freezing",
          say: "Melting is when a solid changes into a liquid because it is heated - like an ice cube turning into a puddle. Freezing is the opposite: a liquid changes into a solid because it is cooled - like water turning into ice at 0 degrees Celsius.",
          ops: [
            { type: "text", value: "❄️ Melting and Freezing", x: 60, y: 60, color: "#1e293b", size: 30 },
            { type: "box", x: 60, y: 130, w: 560, h: 150, color: "#f97316", label: "MELTING\nSolid → Liquid\n(by HEATING)\ne.g. ice cube → puddle of water", labelSize: 22 },
            { type: "box", x: 700, y: 130, w: 560, h: 150, color: "#0ea5e9", label: "FREEZING\nLiquid → Solid\n(by COOLING)\ne.g. water → ice at 0°C", labelSize: 22 },
          ],
        },
        {
          label: "2. Water's strange secret",
          say: "Most liquids get smaller - they contract - when they freeze, because their particles slow down and pack closer together. But water does something very unusual: its particles link together leaving gaps between them, so water actually EXPANDS - gets bigger - when it turns to ice.",
          ops: [
            { type: "text", value: "Water's special property: it EXPANDS when frozen!", x: 60, y: 60, color: "#1e293b", size: 24 },
            { type: "box", x: 60, y: 120, w: 560, h: 180, color: "#64748b", label: "MOST LIQUIDS (normal case)\nparticles slow down,\nmove closer together\n⇒ CONTRACTS (gets smaller)", labelSize: 20 },
            { type: "box", x: 700, y: 120, w: 560, h: 180, color: "#0369a1", label: "WATER (the exception!)\nparticles link up leaving gaps\n⇒ EXPANDS (gets bigger)\nIce takes up MORE room than\nthe water it came from.", labelSize: 20 },
          ],
        },
        {
          label: "3. 💡 Tip: why ice floats, and why pipes burst",
          say: "This one special fact about water explains two real things you may have seen. Because ice expands, it becomes LESS dense than liquid water - that's exactly why ice cubes float instead of sinking. And it's also why water pipes can crack in freezing winter weather: the freezing water inside pushes outward with surprising force.",
          ops: [
            { type: "text", value: "💡 Tip: one fact, two real-world effects", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 260, color: TIP_COLOR, label: "Water expands when it freezes, so ice is LESS DENSE than liquid water.\n\n→ That is exactly why ice cubes FLOAT in your drink instead of sinking.\n\n→ And it's why water pipes can CRACK in very cold weather - the\n   freezing water inside expands and pushes outward on the pipe.", labelSize: 22 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Here's the real experiment from the book. Fill a plastic cup two-thirds with water, mark the water level with a pen, then freeze it overnight. Predict first: will the ice level be higher, lower, or the same as your mark? Then check!",
          ops: [
            { type: "text", value: "✍️ Try it yourself - the freezer test", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 620, h: 240, color: PRACTICE_COLOR, label: "1. Fill a cup two-thirds with water.\n2. Mark the water level on the outside.\n3. Predict: will the ice be higher, lower,\n   or at the same level as your mark?\n4. Freeze it overnight, then check!", labelSize: 20 },
            { type: "text", value: "Answer: the ice will be HIGHER than your\nmark - water expands as it freezes,\nso the frozen level rises above the\noriginal liquid mark.", x: 740, y: 160, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "5.3-q1", prompt: "What is melting?", options: ["A solid changing to a liquid when heated", "A liquid changing to a solid when cooled", "A gas changing to a liquid"], correctIndex: 0, explanation: "Melting is heating a solid until it becomes a liquid - like ice becoming water." },
        { id: "5.3-q2", prompt: "What happens to most liquids when they freeze?", options: ["They contract (get smaller)", "They expand (get bigger)", "Nothing changes at all"], correctIndex: 0, explanation: "As particles cool down they slow and pack closer together, so most liquids shrink slightly when frozen." },
        { id: "5.3-q3", prompt: "What is special about water when it freezes?", options: ["It expands (gets bigger) instead of contracting", "It turns into a gas", "It freezes instantly at any temperature"], correctIndex: 0, explanation: "Unlike almost every other liquid, water's particles link up leaving gaps, so ice takes up more space than the water it came from." },
        { id: "5.3-q4", prompt: "Why do ice cubes float in a drink instead of sinking?", options: ["Ice is less dense than liquid water, because it expanded when it froze", "Ice is magnetic", "Liquid water is heavier than itself"], correctIndex: 0, explanation: "Because water expands on freezing, the same mass of ice takes up more space - making it less dense, so it floats." },
      ],
    },

    {
      topicId: "5.4",
      title: "🫧 Boiling",
      scenes: [
        {
          label: "1. The boiling point of water",
          say: "When water is heated all the way to 100 degrees Celsius, it boils. This is called its boiling point. At this temperature, water turns into a gas called water vapour - and this happens all the way through the liquid, not just at the top.",
          ops: [
            { type: "text", value: "🫧 Boiling: water's special temperature", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 130, w: 1260, h: 150, color: "#dc2626", label: "BOILING POINT OF WATER = 100°C (212°F)\nAt 100°C, water turns into a gas called WATER VAPOUR.\nBubbles of vapour form all the way THROUGH the liquid, not just on top.", labelSize: 24 },
          ],
        },
        {
          label: "2. What is that 'steam' really?",
          say: "Here's a surprise: the white cloud you see above a boiling pan isn't actually a gas at all - it's liquid! The water vapour (gas) rises, and as soon as it meets cooler air above the pan, it cools down and condenses back into tiny droplets of liquid water. That white cloud is liquid, not gas.",
          ops: [
            { type: "text", value: "The 'steam' you SEE is actually a liquid!", x: 60, y: 60, color: "#1e293b", size: 24 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: "#64748b", label: "Inside the pan: boiling water → water vapour (an invisible GAS)\n\nAbove the pan: the vapour rises, cools, and condenses into\ntiny droplets → the white cloud you SEE is tiny LIQUID water\nThere's a small gap above the water where this happens -\nthat's why you can see clear space just above the surface.", labelSize: 20 },
          ],
        },
        {
          label: "3. 💡 Tip: 100°C never changes",
          say: "Here's a real trick worth remembering: no matter how high you turn up the flame, boiling water never gets hotter than 100°C. A bigger flame just makes it boil faster (more bubbles), not hotter. That's a true fact that surprises a lot of people!",
          ops: [
            { type: "text", value: "💡 Tip: a bigger flame = faster, not hotter", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 220, color: TIP_COLOR, label: "Once water reaches 100°C and starts boiling, turning up the heat\ncannot make it any hotter than 100°C.\n\nA bigger flame just makes MORE bubbles form FASTER -\nthe extra heat escapes as more water vapour, not as extra heat.", labelSize: 22 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! If pasta cooks at the boiling temperature of water, would turning the stove to its highest setting cook your pasta any faster once the water is already boiling hard? Think about the tip above before answering.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 620, h: 180, color: PRACTICE_COLOR, label: "Water is already boiling hard in a pot of\npasta. Will turning the flame up even\nhigher cook the pasta noticeably faster?", labelSize: 20 },
            { type: "text", value: "Answer: Not really - the water is already\nat 100°C and can't get any hotter.\nA bigger flame mostly just wastes gas\nand makes more bubbles, not more heat.", x: 740, y: 150, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "5.4-q1", prompt: "What is the boiling point of water?", options: ["100°C", "0°C", "50°C"], correctIndex: 0, explanation: "Water boils at 100°C (212°F) at normal air pressure." },
        { id: "5.4-q2", prompt: "What gas does water turn into when it boils?", options: ["Water vapour", "Oxygen", "Carbon dioxide"], correctIndex: 0, explanation: "Boiling turns liquid water into the gas water vapour." },
        { id: "5.4-q3", prompt: "The white cloud above a boiling pan is actually...", options: ["Tiny liquid water droplets", "Pure water vapour gas", "Smoke"], correctIndex: 0, explanation: "The rising water vapour cools in the air above the pan and condenses back into visible liquid droplets." },
        { id: "5.4-q4", prompt: "If water is already boiling, does turning the flame up higher make it hotter than 100°C?", options: ["No - it stays at 100°C and just boils faster", "Yes - it can reach 150°C easily", "Yes - boiling water has no fixed temperature"], correctIndex: 0, explanation: "Boiling water cannot exceed 100°C at normal pressure; extra heat just speeds up bubble formation." },
      ],
    },

    {
      topicId: "5.5",
      title: "☀️ Evaporation",
      scenes: [
        {
          label: "1. What is evaporation?",
          say: "Evaporation happens when the most energetic particles at the very surface of a liquid escape into the air as a gas, called water vapour. Here's the key difference from boiling: evaporation can happen at ANY temperature, not just at 100°C, and it only happens at the surface.",
          ops: [
            { type: "text", value: "☀️ Evaporation: escaping from the surface", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 130, w: 1260, h: 170, color: "#ca8a04", label: "Heating gives liquid particles more energy, so they move faster.\nThe MOST energetic particles escape from the SURFACE as water vapour.\nThis can happen at ANY temperature - the liquid does NOT need to boil!", labelSize: 22 },
          ],
        },
        {
          label: "2. Where did the puddle go?",
          say: "On a sunny day, a puddle slowly shrinks and disappears. The water hasn't vanished - it has evaporated, turning into invisible water vapour that has floated away into the air. The same thing dries your wet clothes on a washing line.",
          ops: [
            { type: "text", value: "A shrinking puddle: where does the water go?", x: 60, y: 60, color: "#1e293b", size: 24 },
            { type: "box", x: 60, y: 120, w: 1260, h: 180, color: "#64748b", label: "☀️ Sun warms the puddle  →  surface particles gain energy\n   →  the fastest ones escape as invisible water vapour\n   →  the puddle shrinks, but the water is now floating in the air,\n       not gone forever.", labelSize: 22 },
          ],
        },
        {
          label: "3. 💡 Tip: the 3 things that speed up evaporation",
          say: "Remember this with HAW: Heat makes particles move faster. Air-flow (wind or a draught) sweeps escaped vapour away so more can follow. Wide surface area means more particles are at the surface, ready to escape. More of any of these three means faster evaporation.",
          ops: [
            { type: "text", value: "💡 Tip: remember HAW", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 260, color: TIP_COLOR, label: "H - Heat: more warmth gives particles more energy to escape\nA - Air-flow: wind/draught carries vapour away, so more can follow\nW - Wide surface: a bigger surface area means more particles\n    are exposed at the top, ready to escape\n\nMore heat, more airflow, more surface = FASTER evaporation!", labelSize: 22 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Two identical wet T-shirts are hung up to dry. One is on a warm, breezy day, spread out flat. The other is on a cool, still day, bunched up in a ball. Which one dries faster, and why - using the HAW trick?",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 620, h: 220, color: PRACTICE_COLOR, label: "Shirt A: warm, breezy day, spread flat\nShirt B: cool, still day, bunched in a ball\n\nWhich one dries (evaporates) faster?\nExplain using Heat, Air-flow, Wide surface.", labelSize: 19 },
            { type: "text", value: "Answer: Shirt A - it has more HEAT,\nmore AIR-FLOW, and a WIDER spread\nsurface, so evaporation happens\nmuch faster than Shirt B.", x: 740, y: 160, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "5.5-q1", prompt: "What is evaporation?", options: ["A liquid's most energetic surface particles escaping as a gas", "A liquid reaching exactly 100°C", "A gas turning into a solid"], correctIndex: 0, explanation: "Evaporation is particles escaping from the liquid's surface, and it can happen at any temperature." },
        { id: "5.5-q2", prompt: "A puddle slowly shrinks in the sun. Where has the water gone?", options: ["It evaporated into the air as water vapour", "It disappeared completely and no longer exists", "It turned into oxygen"], correctIndex: 0, explanation: "The water is still there - just moved into the air as invisible water vapour." },
        { id: "5.5-q3", prompt: "Does a liquid need to reach its boiling point to evaporate?", options: ["No - evaporation happens at the surface at any temperature", "Yes - evaporation only happens at exactly 100°C", "Yes - but only for water"], correctIndex: 0, explanation: "Evaporation only needs enough energy for surface particles to escape - no need to reach boiling point." },
        { id: "5.5-q4", prompt: "Which of these would make wet washing dry FASTEST?", options: ["A warm, windy day with washing spread out", "A cold, still day with washing bunched up", "Washing kept indoors in a sealed bag"], correctIndex: 0, explanation: "Heat, air-flow, and a wide surface area all speed up evaporation." },
      ],
    },

    {
      topicId: "5.6",
      title: "🪞 Condensation",
      scenes: [
        {
          label: "1. The opposite of evaporation",
          say: "Condensation is the exact opposite of evaporation. Evaporation is a liquid becoming a gas. Condensation is a gas cooling down and changing back into a liquid. You've seen it happen: a bathroom mirror 'steams up' when water vapour in the warm, damp air hits the cold glass, cools, and turns back into tiny water droplets.",
          ops: [
            { type: "text", value: "🪞 Condensation: gas → liquid", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 130, w: 560, h: 170, color: "#ca8a04", label: "EVAPORATION\nLiquid → Gas\n(particles gain energy, escape)", labelSize: 22 },
            { type: "box", x: 700, y: 130, w: 560, h: 170, color: "#0284c7", label: "CONDENSATION\nGas → Liquid\n(particles lose energy, cool down)", labelSize: 22 },
            { type: "text", value: "Example: water vapour hits a cold mirror, cools, and 'steams it up' with droplets.", x: 60, y: 330, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "2. 💡 Tip: con-DENSE-ation",
          say: "Here's a genuine memory trick hidden right in the word. CON-DENSE-ation: when a gas condenses, its spread-out particles pack together into a much DENSER liquid. The word literally contains the clue to what's happening to the particles!",
          ops: [
            { type: "text", value: "💡 Tip: the word hides the answer", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 220, color: TIP_COLOR, label: "con-DENSE-ation\n\nGas particles are spread far apart. When they condense, they pack\ntogether tightly - becoming much more DENSE, as a liquid.\nThe middle of the word literally spells out what happens!", labelSize: 24 },
          ],
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! On a hot day, a cold can of lemonade taken out of the fridge quickly gets 'sweaty' with water droplets on the outside, even though the can is sealed and no liquid leaked out. Where did those droplets come from?",
          ops: [
            { type: "text", value: "✍️ Try it yourself - the sweaty can", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 620, h: 190, color: PRACTICE_COLOR, label: "A sealed, cold can of lemonade is taken\nout of the fridge on a hot day. Soon its\noutside is covered in water droplets.\n\nWhere did the water come from?", labelSize: 20 },
            { type: "text", value: "Answer: it's condensation! Warm water\nvapour in the air touches the cold can,\ncools down, and condenses into liquid\ndroplets on the outside.", x: 740, y: 150, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "5.6-q1", prompt: "What is condensation?", options: ["A gas cooling and changing into a liquid", "A liquid heating and becoming a gas", "A solid melting into a liquid"], correctIndex: 0, explanation: "Condensation happens when a gas loses energy, cools down, and changes state into a liquid." },
        { id: "5.6-q2", prompt: "Why does a bathroom mirror 'steam up' during a shower?", options: ["Water vapour in the air condenses on the cold mirror", "The mirror itself evaporates", "Soap turns into gas"], correctIndex: 0, explanation: "Warm water vapour hits the cooler mirror surface, cools, and condenses into visible droplets." },
        { id: "5.6-q3", prompt: "Condensation is the opposite of which process?", options: ["Evaporation", "Melting", "Freezing"], correctIndex: 0, explanation: "Evaporation is liquid-to-gas; condensation is gas-to-liquid - exact opposites." },
        { id: "5.6-q4", prompt: "Why does a cold drink can get 'sweaty' outside on a hot day?", options: ["Water vapour from the air condenses on its cold surface", "The can is leaking from inside", "Carbon dioxide is escaping as water"], correctIndex: 0, explanation: "Warm, humid air touches the cold can and the water vapour in it condenses into visible droplets." },
      ],
    },

    {
      topicId: "5.7",
      title: "🧂 Mixtures and Dissolving",
      scenes: [
        {
          label: "1. What is a mixture?",
          say: "A mixture is simply two or more substances mixed together, like a bowl of different sweets, or soil stirred into water. When a solid mixes into a liquid so completely that it disappears and the liquid stays clear, we say it has dissolved - forming a solution.",
          ops: [
            { type: "text", value: "🧂 Mixtures and Dissolving", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 130, w: 1260, h: 150, color: "#16a34a", label: "MIXTURE = two or more substances mixed together\nDISSOLVE / SOLUTION = a solid mixes into a liquid so completely that\nit becomes invisible and the mixture stays CLEAR, e.g. salt in water.", labelSize: 22 },
          ],
        },
        {
          label: "2. Solute, solvent, solution",
          say: "Two special words describe a solution. The solute is the substance that dissolves - like salt. The solvent is the liquid doing the dissolving - like water. Put them together and you get a solution. A solid that dissolves is called soluble.",
          ops: [
            { type: "text", value: "Salt + Water = a Solution", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 400, h: 150, color: "#0369a1", label: "SOLUTE\nthe thing that dissolves\ne.g. SALT", labelSize: 22 },
            { type: "text", value: "+", x: 490, y: 190, color: "#1e293b", size: 34 },
            { type: "box", x: 540, y: 120, w: 400, h: 150, color: "#0284c7", label: "SOLVENT\nthe liquid doing the dissolving\ne.g. WATER", labelSize: 22 },
            { type: "text", value: "=", x: 970, y: 190, color: "#1e293b", size: 34 },
            { type: "box", x: 1020, y: 120, w: 280, h: 150, color: "#16a34a", label: "SOLUTION\n(clear mixture)", labelSize: 22 },
          ],
        },
        {
          label: "3. Suspension and insoluble",
          say: "Not everything dissolves. Flour stirred into water doesn't disappear - it floats around making the water cloudy. We call that a suspension. Sand in water doesn't dissolve either, but instead just drops straight to the bottom - we call sand insoluble.",
          ops: [
            { type: "text", value: "When a solid does NOT dissolve", x: 60, y: 60, color: "#1e293b", size: 24 },
            { type: "box", x: 60, y: 120, w: 600, h: 170, color: "#ca8a04", label: "SUSPENSION\ne.g. flour + water\nStays CLOUDY - tiny solid particles\nfloat around in the liquid.", labelSize: 21 },
            { type: "box", x: 700, y: 120, w: 600, h: 170, color: "#78716c", label: "INSOLUBLE\ne.g. sand + water\nDoes not dissolve at all -\ndrops straight to the bottom.", labelSize: 21 },
          ],
        },
        {
          label: "4. 💡 Tip: the torchlight test",
          say: "Real scientists use this trick to tell a solution from a suspension: shine a torch through the liquid! A true solution (like salt water) is clear, so the light beam passes straight through, almost invisible. A suspension (like flour water) is cloudy, so the beam scatters and you can clearly see its path through the liquid.",
          ops: [
            { type: "text", value: "💡 Tip: shine a torch through it", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 220, color: TIP_COLOR, label: "SOLUTION (e.g. salt water): clear - the torch beam passes straight\nthrough, almost invisible inside the liquid.\n\nSUSPENSION (e.g. flour water): cloudy - the torch beam scatters off\nthe floating particles, so you can SEE the beam's path.", labelSize: 22 },
          ],
        },
        {
          label: "5. ✍️ Try it yourself",
          say: "Your turn! Classify each of these as a solution or a suspension: sugar stirred into tea, chalk powder stirred into water, and instant coffee stirred into hot water.",
          ops: [
            { type: "text", value: "✍️ Try it yourself - solution or suspension?", x: 60, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 60, y: 110, w: 620, h: 190, color: PRACTICE_COLOR, label: "1. Sugar stirred into hot tea\n2. Chalk powder stirred into water\n3. Instant coffee stirred into hot water\n\nWhich are solutions? Which are suspensions?", labelSize: 19 },
            { type: "text", value: "Answers: 1) Solution - sugar dissolves,\nstays clear. 2) Suspension - chalk floats,\nmakes it cloudy. 3) Solution - coffee\ngranules fully dissolve.", x: 740, y: 150, color: "#64748b", size: 19 },
          ],
        },
      ],
      questions: [
        { id: "5.7-q1", prompt: "What is a solution?", options: ["A clear mixture formed when a soluble solid dissolves completely in a liquid", "Any two liquids poured together", "A solid floating on top of water"], correctIndex: 0, explanation: "A solution forms when a solute dissolves completely in a solvent, staying clear." },
        { id: "5.7-q2", prompt: "In a salt water solution, which is the solvent?", options: ["Water", "Salt", "Neither - there is no solvent"], correctIndex: 0, explanation: "Water is the solvent - the liquid that does the dissolving. Salt is the solute." },
        { id: "5.7-q3", prompt: "What is the difference between a suspension and a true solution?", options: ["A suspension is cloudy with floating particles; a solution is clear", "A suspension is always a gas", "There is no difference"], correctIndex: 0, explanation: "A suspension's undissolved solid particles float and scatter light, making it cloudy; a solution is clear." },
        { id: "5.7-q4", prompt: "Which best describes sand mixed into water?", options: ["Insoluble - it does not dissolve and drops to the bottom", "A solution - it dissolves completely", "A gas forms"], correctIndex: 0, explanation: "Sand is insoluble: it never dissolves, and instead settles at the bottom." },
      ],
    },

    {
      topicId: "5.8",
      title: "🔬 Separating Mixtures",
      scenes: [
        {
          label: "1. Filtration catches the big bits",
          say: "Filtration means pouring a mixture through filter paper, which works like a very fine sieve. An insoluble solid, like flour or sand, gets caught because its particles are too big to pass through the tiny holes in the paper - while the liquid passes straight through.",
          ops: [
            { type: "text", value: "🔬 Filtration: catching insoluble solids", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 130, w: 1260, h: 160, color: "#16a34a", label: "Pour the mixture through filter paper (like a very fine sieve).\nInsoluble solid (e.g. flour, sand) → particles too BIG → CAUGHT on paper.\nLiquid → particles small enough → passes straight THROUGH.", labelSize: 22 },
          ],
        },
        {
          label: "2. But filtration can't catch a solution!",
          say: "Here's the catch: filtration cannot separate a true solution. When sugar dissolves in water, its particles become so small that they pass straight through the filter paper along with the water. To get a dissolved solid back, you need a different method: evaporation.",
          ops: [
            { type: "text", value: "A true solution passes RIGHT THROUGH a filter!", x: 60, y: 60, color: "#1e293b", size: 22 },
            { type: "box", x: 60, y: 120, w: 1260, h: 180, color: "#dc2626", label: "Dissolved solid (e.g. sugar) → particles are TOO SMALL to catch\n→ they pass through the filter paper together with the water.\n\nSo filtration only works on SUSPENSIONS, never on SOLUTIONS.", labelSize: 22 },
          ],
        },
        {
          label: "3. Evaporation reverses dissolving",
          say: "To get the dissolved solid back from a true solution, heat it so the water evaporates away as water vapour - leaving the dissolved solid behind in the container. This proves dissolving is reversible: it's a change that can be undone.",
          ops: [
            { type: "text", value: "Getting salt back from salt water", x: 60, y: 60, color: "#1e293b", size: 24 },
            { type: "box", x: 60, y: 120, w: 1260, h: 170, color: "#0284c7", label: "Heat the salt water solution.\nThe water evaporates away as water vapour (into the air).\nThe salt (the solute) is left behind, dry, in the container.\nDissolving is REVERSIBLE - this change can be undone.", labelSize: 22 },
          ],
        },
        {
          label: "4. 💡 Tip: match the method to the mixture",
          say: "A simple real rule to remember forever: FILTER catches big bits (a suspension, like flour or sand in water) - just like a kitchen sieve. EVAPORATE to win back a dissolved solid (a true solution, like salt or sugar in water) - the water leaves as a gas, the solid stays behind.",
          ops: [
            { type: "text", value: "💡 Tip: FILTER for big bits, EVAPORATE for dissolved", x: 60, y: 60, color: TIP_COLOR, size: 22 },
            { type: "box", x: 60, y: 110, w: 610, h: 230, color: TIP_COLOR, label: "FILTRATION works on:\n• Suspensions\n• Insoluble solids\n  (flour, sand, chalk powder)", labelSize: 20 },
            { type: "box", x: 700, y: 110, w: 610, h: 230, color: TIP_COLOR, label: "EVAPORATION needed for:\n• True solutions\n• Dissolved solids\n  (salt, sugar in water)", labelSize: 20 },
          ],
        },
        {
          label: "5. ✍️ Try it yourself",
          say: "Your turn! How would you clean muddy river water to drink safely, and separately, how would you get the sugar back out of a cup of sweetened tea you accidentally over-sweetened? Pick filtration or evaporation for each.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 620, h: 190, color: PRACTICE_COLOR, label: "1. Muddy river water (mud does not dissolve)\n2. Sugar dissolved in a cup of tea\n\nWhich method separates each mixture -\nfiltration or evaporation?", labelSize: 20 },
            { type: "text", value: "Answers: 1) Filtration - mud is insoluble,\ncaught by the filter. 2) Evaporation -\nsugar is dissolved, so only evaporating\nthe water leaves it behind.", x: 740, y: 150, color: "#64748b", size: 19 },
          ],
        },
      ],
      questions: [
        { id: "5.8-q1", prompt: "Why can flour be separated from water by filtration, but sugar cannot?", options: ["Flour's particles are too big for the filter paper; sugar's dissolved particles pass through", "Flour is a liquid", "Sugar is magnetic"], correctIndex: 0, explanation: "Filtration only catches particles too large to pass through the paper - a dissolved solid's particles are far too small." },
        { id: "5.8-q2", prompt: "How can you get dissolved salt back out of salt water?", options: ["Evaporation - heat it so the water evaporates, leaving the salt behind", "Filtration - pour it through filter paper", "It is impossible to get it back"], correctIndex: 0, explanation: "Since salt is dissolved, only evaporating the water away leaves the solid salt behind." },
        { id: "5.8-q3", prompt: "Is dissolving reversible or permanent?", options: ["Reversible - it can be undone, e.g. by evaporation", "Permanent - it can never be undone", "It depends on the colour of the solid"], correctIndex: 0, explanation: "Dissolving is a reversible change - the dissolved solid can always be recovered, for example by evaporation." },
        { id: "5.8-q4", prompt: "Which method would separate sand from a sand-and-water mixture?", options: ["Filtration, because sand is insoluble", "Evaporation, because sand is a solution", "Neither method works on sand"], correctIndex: 0, explanation: "Sand never dissolves, so it is simply caught by filter paper as a suspension/insoluble solid." },
      ],
    },

    {
      topicId: "revision",
      title: "🔁 Quick Revision Sheet",
      scenes: [
        {
          label: "1. States and particles",
          say: "Let's do a clean, quick recap before you test yourself. First: the three states of matter and how their particles behave. Read it top to bottom, then close your eyes and try to say it back.",
          ops: [
            { type: "text", value: "🔁 Revision 1 of 4: States & Particles", x: 60, y: 50, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 300, color: "#b45309", label: "SOLID   - particles packed tight, fixed pattern - keeps shape & volume\nLIQUID  - particles close but jumbled, can flow - keeps volume, pourable\nGAS     - particles far apart, fast-moving - no fixed shape or volume,\n          escapes if unsealed, squashes (compresses) easily\n\nTHE CONTAINER TEST: no container needed → solid. Needs a container but\nhas a flat top → liquid. Fills the WHOLE container → gas.", labelSize: 22 },
          ],
        },
        {
          label: "2. Gases, melting, freezing",
          say: "Next: the four common gases, and what happens when matter melts or freezes - including water's one big exception.",
          ops: [
            { type: "text", value: "🔁 Revision 2 of 4: Gases, Melting & Freezing", x: 60, y: 50, color: "#1e293b", size: 24 },
            { type: "box", x: 60, y: 110, w: 1260, h: 300, color: "#0369a1", label: "CO₂ = fizzy drinks, fire extinguishers   |   O₂ = breathing, diver tanks\nN₂ = keeps food fresh                    |   H₂ = rocket fuel\n\nMELTING  = solid → liquid (heating)\nFREEZING = liquid → solid (cooling), water freezes at 0°C\n\nMost liquids CONTRACT when frozen. WATER EXPANDS instead -\nthat's why ice floats, and why pipes can crack in freezing weather.", labelSize: 21 },
          ],
        },
        {
          label: "3. Boiling, evaporation, condensation",
          say: "Now the three big changes involving gas: boiling, evaporation, and condensation. Notice how evaporation and condensation are exact opposites.",
          ops: [
            { type: "text", value: "🔁 Revision 3 of 4: Boiling, Evaporation, Condensation", x: 60, y: 50, color: "#1e293b", size: 21 },
            { type: "box", x: 60, y: 110, w: 1260, h: 300, color: "#dc2626", label: "BOILING: water → water vapour at exactly 100°C, all through the liquid.\n  (The 'steam' you see is actually condensed liquid droplets!)\n\nEVAPORATION: surface particles escape as vapour, at ANY temperature.\n  Faster with more Heat, more Air-flow, a Wider surface (HAW).\n\nCONDENSATION: a gas cools and becomes a liquid - the OPPOSITE of\n  evaporation (con-DENSE-ation = particles pack together densely).", labelSize: 21 },
          ],
        },
        {
          label: "4. Mixtures and separating",
          say: "Finally: mixtures, dissolving, and how to separate them again. This is the one most students mix up, so read it twice.",
          ops: [
            { type: "text", value: "🔁 Revision 4 of 4: Mixtures & Separating", x: 60, y: 50, color: "#1e293b", size: 24 },
            { type: "box", x: 60, y: 110, w: 1260, h: 300, color: "#16a34a", label: "SOLUTE (dissolves) + SOLVENT (does the dissolving) = SOLUTION (clear)\nSUSPENSION = cloudy, undissolved solid floats (e.g. flour + water)\nINSOLUBLE  = does not dissolve, drops to the bottom (e.g. sand)\n\nFILTRATION catches big insoluble bits (a suspension) - like a sieve.\nEVAPORATION wins back a DISSOLVED solid from a true solution -\n  the water leaves as vapour, the solid stays behind.\nDissolving is REVERSIBLE.", labelSize: 21 },
          ],
        },
      ],
      questions: [
        { id: "rev-q1", prompt: "Quick recap: which state has particles packed tightly in a fixed pattern?", options: ["Solid", "Liquid", "Gas"], correctIndex: 0, explanation: "A solid's particles only wobble in a fixed arrangement." },
        { id: "rev-q2", prompt: "Quick recap: what is unusual about water when it freezes?", options: ["It expands instead of contracting", "It turns into a gas", "It freezes at 100°C"], correctIndex: 0, explanation: "Unlike most liquids, water expands as it freezes." },
        { id: "rev-q3", prompt: "Quick recap: HAW stands for the three things that speed up...", options: ["Evaporation (Heat, Air-flow, Wide surface)", "Freezing (Heat, Air, Weight)", "Boiling (High, Always, Water)"], correctIndex: 0, explanation: "Heat, Air-flow, and a Wide surface area all speed up evaporation." },
        { id: "rev-q4", prompt: "Quick recap: filtration works on...", options: ["Suspensions and insoluble solids", "True solutions", "Gases only"], correctIndex: 0, explanation: "Filtration only catches particles too big to pass through - that's suspensions, not dissolved solutions." },
      ],
    },

    {
      topicId: "exercise",
      title: "📘 Worksheet - States of Matter Review",
      scenes: [
        {
          label: "1,2. True or False",
          say: "Let's warm up with some true-or-false statements. Read each one carefully and decide: is it true, or false? Think before you check the answer.",
          ops: [
            { type: "text", value: "📘 Section A: True or False", x: 60, y: 50, color: PRACTICE_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 290, color: PRACTICE_COLOR, label: "1. A gas always keeps a fixed shape.                           FALSE\n2. Water is unusual because it expands when it freezes.         TRUE\n3. Boiling only happens at the surface of a liquid.             FALSE\n4. Evaporation can happen below 100°C.                          TRUE\n5. Filtration can separate sugar from a sugar solution.          FALSE\n6. Condensation is a gas changing into a liquid.                 TRUE", labelSize: 22 },
          ],
        },
        {
          label: "3,4. Fill in the blank",
          say: "Now let's fill in the missing word for each sentence. Say the answer out loud before checking!",
          ops: [
            { type: "text", value: "📘 Section B: Fill in the Blank", x: 60, y: 50, color: PRACTICE_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 290, color: PRACTICE_COLOR, label: "1. Water boils at ____°C.                           → 100\n2. A solid that dissolves in a liquid is called ____.    → soluble\n3. The liquid that a solute dissolves in is the ____.    → solvent\n4. A liquid changing to a solid by cooling is ____.      → freezing\n5. Divers carry ____ gas in tanks so they can breathe.   → oxygen\n6. A gas cooling into a liquid is called ____.           → condensation", labelSize: 20 },
          ],
        },
        {
          label: "5. Match the gas to its use",
          say: "Match each gas on the left to its real-world use on the right. Say your matches before checking the answer key.",
          ops: [
            { type: "text", value: "📘 Section C: Match the Gas", x: 60, y: 50, color: PRACTICE_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 580, h: 260, color: "#1e293b", label: "1. Carbon dioxide\n2. Oxygen\n3. Nitrogen\n4. Hydrogen", labelSize: 24 },
            { type: "box", x: 700, y: 110, w: 620, h: 260, color: "#1e293b", label: "A. Breathing underwater\nB. Rocket fuel\nC. Fizzy drinks / fire extinguishers\nD. Keeping packaged food fresh", labelSize: 22 },
            { type: "text", value: "Answer key: 1-C, 2-A, 3-D, 4-B", x: 60, y: 400, color: "#64748b", size: 22 },
          ],
        },
        {
          label: "6,7. Explain it - short answers",
          say: "Now for two 'explain it' questions, just like a real test. Try to answer in a full sentence or two before you check the model answer.",
          ops: [
            { type: "text", value: "📘 Section D: Explain It", x: 60, y: 50, color: PRACTICE_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 160, color: PRACTICE_COLOR, label: "Q1. Explain the difference between boiling and evaporation.", labelSize: 22 },
            { type: "text", value: "Model answer: Boiling happens throughout the whole liquid, only at its\nboiling point (100°C for water). Evaporation happens only at the surface,\nand can happen at any temperature, even on a cool day.", x: 90, y: 200, color: "#64748b", size: 19 },
          ],
        },
        {
          label: "8. Explain it, part 2",
          say: "One more explain-it question - this time about separating mixtures.",
          ops: [
            { type: "text", value: "📘 Section D: Explain It (continued)", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 1260, h: 160, color: PRACTICE_COLOR, label: "Q2. Why does evaporation, not filtration, get salt back from salt water?", labelSize: 20 },
            { type: "text", value: "Model answer: Salt is soluble, so its dissolved particles are small\nenough to pass straight through filter paper along with the water -\nfiltration cannot catch them. Evaporation removes the water instead,\nas water vapour, leaving the salt behind.", x: 90, y: 200, color: "#64748b", size: 19 },
          ],
        },
      ],
      questions: [
        { id: "ex-q1", prompt: "True or false: a gas always keeps a fixed shape.", options: ["False - a gas has no fixed shape", "True - gases always keep their shape", "True, but only hydrogen"], correctIndex: 0, explanation: "A gas spreads out to fill whatever container it is in - it has no fixed shape." },
        { id: "ex-q2", prompt: "Fill in the blank: a liquid changing to a solid by cooling is called ____.", options: ["Freezing", "Melting", "Evaporating"], correctIndex: 0, explanation: "Freezing is a liquid becoming a solid when it is cooled." },
        { id: "ex-q3", prompt: "Which gas is matched correctly with its use?", options: ["Hydrogen → rocket fuel", "Nitrogen → breathing underwater", "Carbon dioxide → food packaging"], correctIndex: 0, explanation: "Hydrogen burns easily and is used as rocket fuel. Oxygen is for breathing; nitrogen is for food packaging." },
        { id: "ex-q4", prompt: "Why can't filtration get salt back from salt water?", options: ["The dissolved salt particles are small enough to pass through the filter paper with the water", "Salt is a gas, not a solid", "Filter paper dissolves in water"], correctIndex: 0, explanation: "Filtration only catches particles too big to pass through - dissolved salt is far too small to be caught." },
      ],
    },

    {
      topicId: "exerciseB",
      title: "📘 Exercise Set B - Mixed Practice",
      scenes: [
        {
          label: "1,2. Classify 10 real things",
          say: "Here are ten everyday things. For each one, decide: solid, liquid, or gas? Go through all ten before checking the answers - say each one out loud.",
          ops: [
            { type: "text", value: "📘 Classify 10 everyday things", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 320, color: "#1e293b", label: "1. Milk\n2. Helium inside a balloon\n3. A wooden table\n4. Honey\n5. The air you breathe in\n6. An ice cube\n7. Sand\n8. Perfume spreading across a room\n9. A rubber ball\n10. Steam rising from a hot kettle", labelSize: 20 },
            { type: "box", x: 700, y: 110, w: 610, h: 320, color: "#64748b", label: "Answers:\n1. Liquid   2. Gas    3. Solid\n4. Liquid   5. Gas    6. Solid\n7. Solid    8. Gas    9. Solid\n10. Liquid (tiny condensed droplets,\n     not the invisible water vapour gas!)", labelSize: 20 },
          ],
        },
        {
          label: "3. Story sequence: the ice cube's day",
          say: "Here's a mini story. Read it, then put the four changes of state in the correct order as they happen.",
          ops: [
            { type: "text", value: "📘 The Ice Cube's Day - put the changes in order", x: 60, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 60, y: 110, w: 1260, h: 160, color: PRACTICE_COLOR, label: "A frozen ice cube is left on a sunny windowsill all morning. By lunchtime\nit is a puddle. By evening, the puddle has completely disappeared.", labelSize: 20 },
            { type: "text", value: "Order the changes: boiling? melting? evaporation? freezing?", x: 90, y: 300, color: "#1e293b", size: 20 },
            { type: "text", value: "Answer: 1) MELTING (ice → puddle of water, by heating from the sun)\n2) EVAPORATION (the puddle slowly dries up into invisible water\nvapour, even without reaching 100°C - that's why it's evaporation,\nnot boiling).", x: 90, y: 340, color: "#64748b", size: 19 },
          ],
        },
        {
          label: "4. Odd one out",
          say: "In each group of four, three things belong together and one is the odd one out. Find the odd one out and explain why.",
          ops: [
            { type: "text", value: "📘 Odd One Out - and why", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 1260, h: 170, color: "#1e293b", label: "Group 1: carbon dioxide, oxygen, nitrogen, sugar\nGroup 2: melting, freezing, boiling, dissolving\nGroup 3: flour + water, sand + water, salt + water, chalk + water", labelSize: 21 },
            { type: "text", value: "Answers: 1) Sugar - the other three are gases, sugar is a solid.\n2) Dissolving - the other three are changes of STATE; dissolving\nforms a mixture, it isn't a change of state. 3) Salt + water - the\nother three are suspensions/insoluble; salt actually dissolves (a solution).", x: 90, y: 300, color: "#64748b", size: 18 },
          ],
        },
        {
          label: "5. Spot the mistake",
          say: "This short paragraph has THREE science mistakes hidden in it. Read carefully and find all three before you check the answers.",
          ops: [
            { type: "text", value: "📘 Spot the 3 mistakes", x: 60, y: 50, color: PRACTICE_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 180, color: "#1e293b", label: "\"Water boils at 0°C, turning into a gas called oxygen. When this gas\ntouches a cold window, it melts back into liquid water droplets. Most\nliquids, including water, get bigger when they freeze into a solid.\"", labelSize: 20 },
            { type: "text", value: "Mistakes: 1) Water boils at 100°C, not 0°C. 2) Boiling water turns into\nWATER VAPOUR, not oxygen. 3) The gas touching cold glass CONDENSES\n(not 'melts') into liquid - and water is the UNUSUAL exception that\nexpands when frozen; most OTHER liquids contract.", x: 90, y: 310, color: "#64748b", size: 18 },
          ],
        },
        {
          label: "6. Exam-style: explain in full sentences",
          say: "One last challenge - a real exam-style question. Write your full answer first, then compare it with the model answer.",
          ops: [
            { type: "text", value: "📘 Exam-style question", x: 60, y: 50, color: PRACTICE_COLOR, size: 26 },
            { type: "box", x: 60, y: 110, w: 1260, h: 140, color: PRACTICE_COLOR, label: "A student says: \"Filtering salt water should remove the salt, just like\nfiltering flour water removes the flour.\" Is the student correct? Explain.", labelSize: 20 },
            { type: "text", value: "Model answer: The student is NOT correct. Flour is insoluble, so its\nparticles are too big to pass through filter paper and get caught.\nBut salt dissolves completely in water (it is soluble) - its particles\nbecome small enough to pass straight through the filter paper along\nwith the water. To separate the dissolved salt, you must evaporate\nthe water instead, which leaves the salt behind.", x: 90, y: 270, color: "#64748b", size: 19 },
          ],
        },
      ],
      questions: [
        { id: "exB-q1", prompt: "Steam rising visibly from a hot kettle is actually...", options: ["Tiny liquid water droplets (condensed vapour)", "Pure invisible water vapour gas", "Oxygen gas"], correctIndex: 0, explanation: "The vapour condenses into visible liquid droplets as soon as it meets cooler air." },
        { id: "exB-q2", prompt: "A puddle disappears slowly on a warm (not boiling-hot) day. This is an example of...", options: ["Evaporation", "Boiling", "Condensation"], correctIndex: 0, explanation: "Evaporation happens at the surface at any temperature - no need to reach 100°C." },
        { id: "exB-q3", prompt: "Which one of these is the odd one out: carbon dioxide, oxygen, nitrogen, sugar?", options: ["Sugar - it is a solid, the rest are gases", "Oxygen - it is a liquid", "Nitrogen - it cannot be breathed"], correctIndex: 0, explanation: "Carbon dioxide, oxygen and nitrogen are all common gases; sugar is a solid." },
        { id: "exB-q4", prompt: "Would filtering salt water remove the dissolved salt, the same way filtering flour water removes the flour?", options: ["No - dissolved salt passes through the filter with the water", "Yes - both are removed the same way", "No - because salt water isn't a real mixture"], correctIndex: 0, explanation: "Flour is insoluble and gets caught; salt is soluble and its tiny dissolved particles pass straight through filter paper." },
      ],
    },
  ],
};
