import type { BoardUnit } from "./types";

/**
 * English Unit 1 - Fiction: Stories from different cultures.
 *
 * Thirteen concepts, which is far wider than any other board so far. Real
 * user direction 2026-09-14: "we should use existing lessons to get all 13
 * concepts understood, then assess them with an entirely a new story for the
 * 13 concepts. In between at end of each concept we should do quick
 * assessment or worksheet homeworks on what they learnt."
 *
 * So this unit is the template case: every concept carries its own
 * walkthrough step, its own worked example, and its own quick check before
 * the next concept begins - and the Test is set on The Crow and the Pitcher,
 * a fable the child has NOT met during teaching. Applying an idea to
 * unfamiliar material is the only way to tell understanding from recall.
 */
export const CAMBRIDGE_5_ENGLISH_1: BoardUnit = {
  unitKey: "cambridge-5-english-1",
  title: "Fiction: Stories from different cultures",
  badge: "Stage 5 · Unit 1",
  gridMax: 10,
  stage: "text",

  intro: {
    covers: [
      "What makes a fable a fable, and how its moral works",
      "Explicit meaning you can point at, and implicit meaning you work out",
      "Predicting from evidence, and whose eyes a story is told through",
      "Fact and opinion, idioms, and the three sentence types",
      "The narrative mountain, mood, and comparative adverbs",
      "Proofreading and a full writing checklist",
    ],
    outcomes: [
      "Name the features of a fable and state its moral",
      "Tell explicit from implicit meaning, and explain how you knew",
      "Make a prediction and back it with evidence from the text",
      "Retell an event from another character's perspective",
      "Sort fact from opinion, and explain what an idiom really means",
      "Build simple, compound and complex sentences on purpose",
      "Describe the mood a writer has built, and how the words did it",
      "Check your own writing against a full checklist before finishing",
    ],
  },

  concepts: [
    {
      conceptId: "1.1",
      title: "Features of a fable",
      icon: "🦊",
      summary: "A fable is a short, fictional story that teaches a moral lesson about how to treat one another, usually with animal characters.",
      keyPoints: [
        "Animal characters who behave like people.",
        "A moral - the lesson - usually stated at the end."
      ],
      examples: [{ question: "A fable ends with 'Slow and steady wins the race.' What is that line called?", answer: "The moral - the lesson the fable teaches." }],
      quickCheck: [
        {
          title: "Quick check · 1.1",
          conceptId: "1.1",
          prompt: "Which is NOT a usual feature of a fable?",
          options: [
            { label: "A moral at the end", correct: false, say: "Not this one. Fables are short. Ten chapters and a map belong to a novel, not a fable.", frame: { text: { passage: [{ text: "A moral at the end", tone: "red" }] } } },
            { label: "Animal characters who talk", correct: false, say: "Not this one. Fables are short. Ten chapters and a map belong to a novel, not a fable.", frame: { text: { passage: [{ text: "Animal characters who talk", tone: "red" }] } } },
            { label: "Ten chapters and a map", correct: true, say: "Fables are short. Ten chapters and a map belong to a novel, not a fable.", frame: { text: { passage: [{ text: "Ten chapters and a map", tone: "green" }] } } },
            { label: "A short, simple plot", correct: false, say: "Not this one. Fables are short. Ten chapters and a map belong to a novel, not a fable.", frame: { text: { passage: [{ text: "A short, simple plot", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.2",
      title: "Implicit meaning",
      icon: "🕵️",
      summary: "Implicit meaning is hidden meaning. The writer shows you something instead of telling you, and you work it out.",
      keyPoints: [
        "'Jo's face fell' shows disappointment without using the word.",
        "You use clues plus what you already know."
      ],
      examples: [{ question: "'Sam's hands shook as he opened the letter.' What is implied?", answer: "He was nervous or frightened - the shaking shows it without saying it." }],
      quickCheck: [
        {
          title: "Quick check · 1.2",
          conceptId: "1.2",
          prompt: "'Mia pushed her plate away and stared at the table.' What does this imply?",
          options: [
            { label: "She was upset or had lost her appetite", correct: true, say: "Pushing food away and staring down are clues to a feeling the writer never names.", frame: { text: { passage: [{ text: "She was upset or had lost her appetite", tone: "green" }] } } },
            { label: "She was very hungry", correct: false, say: "Not this one. Pushing food away and staring down are clues to a feeling the writer never names.", frame: { text: { passage: [{ text: "She was very hungry", tone: "red" }] } } },
            { label: "She liked the food", correct: false, say: "Not this one. Pushing food away and staring down are clues to a feeling the writer never names.", frame: { text: { passage: [{ text: "She liked the food", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.3",
      title: "Explicit meaning",
      icon: "📌",
      summary: "Explicit meaning is stated directly and plainly. You do not need to infer anything - it is right there on the page.",
      keyPoints: [
        "'Jo was disappointed' states the feeling outright.",
        "If you can point at the words, it is explicit."
      ],
      examples: [{ question: "'The dog was brown and had one white paw.' Explicit or implicit?", answer: "Explicit - it is stated directly." }],
      quickCheck: [
        {
          title: "Quick check · 1.3",
          conceptId: "1.3",
          prompt: "Which sentence gives its meaning explicitly?",
          options: [
            { label: "'Ravi was exhausted.'", correct: true, say: "The first one names the feeling outright. The others show it and leave you to work it out.", frame: { text: { passage: [{ text: "'Ravi was exhausted.'", tone: "green" }] } } },
            { label: "'Ravi dragged his feet up the last step.'", correct: false, say: "Not this one. The first one names the feeling outright. The others show it and leave you to work it out.", frame: { text: { passage: [{ text: "'Ravi dragged his feet up the last step.'", tone: "red" }] } } },
            { label: "'Ravi's eyes kept closing.'", correct: false, say: "Not this one. The first one names the feeling outright. The others show it and leave you to work it out.", frame: { text: { passage: [{ text: "'Ravi's eyes kept closing.'", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.4",
      title: "Predicting",
      icon: "🔮",
      summary: "Predicting means using what you already know - from the story so far, the title, or the pictures - to make a sensible guess about what happens next.",
      keyPoints: [
        "A good prediction uses evidence from the text, not just imagination.",
        "Predictions can be wrong - what matters is the reasoning."
      ],
      examples: [{ question: "A story is called 'The Last Train Home' and opens on an empty platform at midnight. Predict what happens.", answer: "Something about nearly missing the train, or being stranded - both use clues from the title and setting." }],
      quickCheck: [
        {
          title: "Quick check · 1.4",
          conceptId: "1.4",
          prompt: "What makes a prediction a GOOD one?",
          options: [
            { label: "It uses clues from the text", correct: true, say: "A prediction is judged on its reasoning, not on luck. Good ones rest on evidence.", frame: { text: { passage: [{ text: "It uses clues from the text", tone: "green" }] } } },
            { label: "It is the most exciting idea you can think of", correct: false, say: "Not this one. A prediction is judged on its reasoning, not on luck. Good ones rest on evidence.", frame: { text: { passage: [{ text: "It is the most exciting idea you can think of", tone: "red" }] } } },
            { label: "It turns out to be right", correct: false, say: "Not this one. A prediction is judged on its reasoning, not on luck. Good ones rest on evidence.", frame: { text: { passage: [{ text: "It turns out to be right", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.5",
      title: "Perspective",
      icon: "👀",
      summary: "Perspective is whose eyes the story is seen through. The same events can feel completely different told by someone else.",
      keyPoints: [
        "First person uses 'I'. Third person uses 'he', 'she', 'they'.",
        "Changing the narrator changes what the reader is allowed to know."
      ],
      examples: [{ question: "Retell 'the wolf blew the house down' from the wolf's perspective in one sentence.", answer: "Something like: 'I only sneezed, and the flimsy thing collapsed.'" }],
      quickCheck: [
        {
          title: "Quick check · 1.5",
          conceptId: "1.5",
          prompt: "A story says 'I could not believe what she had done.' Whose perspective?",
          options: [
            { label: "First person - the narrator is in the story", correct: true, say: "'I' tells you the narrator is a character inside the story.", frame: { text: { passage: [{ text: "First person - the narrator is in the story", tone: "green" }] } } },
            { label: "Third person", correct: false, say: "Not this one. 'I' tells you the narrator is a character inside the story.", frame: { text: { passage: [{ text: "Third person", tone: "red" }] } } },
            { label: "No perspective at all", correct: false, say: "Not this one. 'I' tells you the narrator is a character inside the story.", frame: { text: { passage: [{ text: "No perspective at all", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.6",
      title: "Proofreading",
      icon: "🔎",
      summary: "Proofreading means checking your own writing after the draft is done, to fix small mistakes in spelling, punctuation and grammar.",
      keyPoints: [
        "Read it slowly, and out loud if you can.",
        "Look for one kind of mistake at a time."
      ],
      examples: [{ question: "Find the error: 'we went to the park on monday.'", answer: "Two capitals missing - 'We' and 'Monday'." }],
      quickCheck: [
        {
          title: "Quick check · 1.6",
          conceptId: "1.6",
          prompt: "Which is the proofreading mistake here: 'She dont like it.'?",
          options: [
            { label: "Missing apostrophe - should be 'doesn't'", correct: true, say: "'Dont' needs an apostrophe, and the correct form here is 'doesn't'.", frame: { text: { passage: [{ text: "Missing apostrophe - should be 'doesn't'", tone: "green" }] } } },
            { label: "Missing full stop", correct: false, say: "Not this one. 'Dont' needs an apostrophe, and the correct form here is 'doesn't'.", frame: { text: { passage: [{ text: "Missing full stop", tone: "red" }] } } },
            { label: "Nothing is wrong", correct: false, say: "Not this one. 'Dont' needs an apostrophe, and the correct form here is 'doesn't'.", frame: { text: { passage: [{ text: "Nothing is wrong", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.7",
      title: "Fact and opinion",
      icon: "⚖️",
      summary: "A fact can be proven true or false with evidence. An opinion is what someone thinks or feels about something.",
      keyPoints: [
        "'The lion weighs 190 kg' is a fact - it can be measured.",
        "'The lion is the most magnificent animal' is an opinion."
      ],
      examples: [{ question: "Fact or opinion: 'This book has 214 pages.'", answer: "Fact - it can be counted." }],
      quickCheck: [
        {
          title: "Quick check · 1.7",
          conceptId: "1.7",
          prompt: "Which of these is an opinion?",
          options: [
            { label: "'Autumn is the loveliest season.'", correct: true, say: "'Loveliest' is a judgement - there is no way to measure it.", frame: { text: { passage: [{ text: "'Autumn is the loveliest season.'", tone: "green" }] } } },
            { label: "'Autumn comes after summer.'", correct: false, say: "Not this one. 'Loveliest' is a judgement - there is no way to measure it.", frame: { text: { passage: [{ text: "'Autumn comes after summer.'", tone: "red" }] } } },
            { label: "'Leaves fall in autumn.'", correct: false, say: "Not this one. 'Loveliest' is a judgement - there is no way to measure it.", frame: { text: { passage: [{ text: "'Leaves fall in autumn.'", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.8",
      title: "Idiomatic phrases",
      icon: "🗝️",
      summary: "An idiom is a group of words that means something different from what the individual words literally say.",
      keyPoints: [
        "'Break a leg' means good luck, not an injury.",
        "'Let the cat out of the bag' means reveal a secret."
      ],
      examples: [{ question: "What does 'it's raining cats and dogs' mean?", answer: "It is raining very heavily - no animals involved." }],
      quickCheck: [
        {
          title: "Quick check · 1.8",
          conceptId: "1.8",
          prompt: "What does 'she was over the moon' mean?",
          options: [
            { label: "She was delighted", correct: true, say: "Idioms do not mean what the words literally say. Over the moon means extremely happy.", frame: { text: { passage: [{ text: "She was delighted", tone: "green" }] } } },
            { label: "She was in space", correct: false, say: "Not this one. Idioms do not mean what the words literally say. Over the moon means extremely happy.", frame: { text: { passage: [{ text: "She was in space", tone: "red" }] } } },
            { label: "She was confused", correct: false, say: "Not this one. Idioms do not mean what the words literally say. Over the moon means extremely happy.", frame: { text: { passage: [{ text: "She was confused", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.9",
      title: "Sentence types",
      icon: "🔗",
      summary: "Sentences can be simple (one idea), compound (two equal ideas joined by and, but or or), or complex (a main idea plus a dependent one).",
      keyPoints: [
        "Simple: 'The dog barked.'",
        "Compound: 'The dog barked and the cat ran.'",
        "Complex: 'Because the dog barked, the cat ran.'"
      ],
      examples: [{ question: "Turn these into one compound sentence: 'It rained.' 'We stayed inside.'", answer: "It rained and we stayed inside. (Or: It rained, so we stayed inside.)" }],
      quickCheck: [
        {
          title: "Quick check · 1.9",
          conceptId: "1.9",
          prompt: "'Although she was tired, she finished the race.' What type is it?",
          options: [
            { label: "Complex", correct: true, say: "'Although she was tired' cannot stand alone - that dependent clause makes it complex.", frame: { text: { passage: [{ text: "Complex", tone: "green" }] } } },
            { label: "Simple", correct: false, say: "Not this one. 'Although she was tired' cannot stand alone - that dependent clause makes it complex.", frame: { text: { passage: [{ text: "Simple", tone: "red" }] } } },
            { label: "Compound", correct: false, say: "Not this one. 'Although she was tired' cannot stand alone - that dependent clause makes it complex.", frame: { text: { passage: [{ text: "Compound", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.10",
      title: "Story structure",
      icon: "⛰️",
      summary: "Many stories follow a narrative mountain: a beginning, a build up, a problem at the peak, then a resolution and an ending.",
      keyPoints: [
        "The problem sits at the top of the mountain.",
        "The resolution comes down the other side."
      ],
      examples: [{ question: "In a fable where an ant tricks a boastful lion, what is the problem?", answer: "The moment the trick goes wrong - the peak of the mountain." }],
      quickCheck: [
        {
          title: "Quick check · 1.10",
          conceptId: "1.10",
          prompt: "Where in the narrative mountain does the problem sit?",
          options: [
            { label: "At the peak", correct: true, say: "The build up climbs towards the problem, which sits at the top, and the resolution comes down the other side.", frame: { text: { passage: [{ text: "At the peak", tone: "green" }] } } },
            { label: "At the very beginning", correct: false, say: "Not this one. The build up climbs towards the problem, which sits at the top, and the resolution comes down the other side.", frame: { text: { passage: [{ text: "At the very beginning", tone: "red" }] } } },
            { label: "After the ending", correct: false, say: "Not this one. The build up climbs towards the problem, which sits at the top, and the resolution comes down the other side.", frame: { text: { passage: [{ text: "After the ending", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.11",
      title: "Mood",
      icon: "🌧️",
      summary: "Mood is the feeling a writer creates - fear, calm, joy - built through the setting and the words chosen.",
      keyPoints: [
        "'The mist curled through the broken gate' builds unease.",
        "Swap the words and the same place can feel welcoming."
      ],
      examples: [{ question: "Rewrite 'the old house stood on the hill' to make it feel frightening.", answer: "Something like: 'The old house loomed on the hill, its windows black and watching.'" }],
      quickCheck: [
        {
          title: "Quick check · 1.11",
          conceptId: "1.11",
          prompt: "Which word choice builds a tense mood?",
          options: [
            { label: "'The floorboards groaned underfoot.'", correct: true, say: "'Groaned' gives the house a voice and makes the reader uneasy. The others are neutral facts.", frame: { text: { passage: [{ text: "'The floorboards groaned underfoot.'", tone: "green" }] } } },
            { label: "'The floorboards were made of oak.'", correct: false, say: "Not this one. 'Groaned' gives the house a voice and makes the reader uneasy. The others are neutral facts.", frame: { text: { passage: [{ text: "'The floorboards were made of oak.'", tone: "red" }] } } },
            { label: "'The floorboards had been swept.'", correct: false, say: "Not this one. 'Groaned' gives the house a voice and makes the reader uneasy. The others are neutral facts.", frame: { text: { passage: [{ text: "'The floorboards had been swept.'", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.12",
      title: "Comparative and superlative adverbs",
      icon: "🏃",
      summary: "Adverbs have three forms: positive (quickly), comparative (more quickly, comparing two) and superlative (most quickly, comparing all).",
      keyPoints: [
        "Positive: 'She ran quickly.'",
        "Comparative: 'She ran more quickly than him.'",
        "Superlative: 'She ran the most quickly of all.'"
      ],
      examples: [{ question: "Give the comparative and superlative of 'well'.", answer: "Better, and best." }],
      quickCheck: [
        {
          title: "Quick check · 1.12",
          conceptId: "1.12",
          prompt: "'Ronan played ___ of everyone.' Which fits?",
          options: [
            { label: "the best", correct: true, say: "Comparing everyone needs the superlative - the best. 'Better' only compares two.", frame: { text: { passage: [{ text: "the best", tone: "green" }] } } },
            { label: "better", correct: false, say: "Not this one. Comparing everyone needs the superlative - the best. 'Better' only compares two.", frame: { text: { passage: [{ text: "better", tone: "red" }] } } },
            { label: "well", correct: false, say: "Not this one. Comparing everyone needs the superlative - the best. 'Better' only compares two.", frame: { text: { passage: [{ text: "well", tone: "red" }] } } }
          ],
        },
      ],
    },
    {
      conceptId: "1.13",
      title: "Full writing checklist",
      icon: "✅",
      summary: "A full checklist brings together everything you check before calling a piece finished - mood, punctuation, apostrophes and direct speech.",
      keyPoints: [
        "'The travellers coat was soaked' is missing an apostrophe - traveller's.",
        "Check one thing at a time rather than everything at once."
      ],
      examples: [{ question: "Punctuate this direct speech: Come inside said Dad.", answer: "\"Come inside,\" said Dad." }],
      quickCheck: [
        {
          title: "Quick check · 1.13",
          conceptId: "1.13",
          prompt: "What is wrong with: 'The travellers coat was soaked.'?",
          options: [
            { label: "A missing apostrophe - traveller's", correct: true, say: "The coat belongs to the traveller, so it needs a possessive apostrophe.", frame: { text: { passage: [{ text: "A missing apostrophe - traveller's", tone: "green" }] } } },
            { label: "A missing capital letter", correct: false, say: "Not this one. The coat belongs to the traveller, so it needs a possessive apostrophe.", frame: { text: { passage: [{ text: "A missing capital letter", tone: "red" }] } } },
            { label: "Nothing", correct: false, say: "Not this one. The coat belongs to the traveller, so it needs a possessive apostrophe.", frame: { text: { passage: [{ text: "Nothing", tone: "red" }] } } }
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1.1 Features of a fable",
      conceptId: "1.1",
      say: "A fable is a short, fictional story that teaches a moral lesson about how to treat one another, usually with animal characters.",
      frame: {
        text: {
          title: "Features of a fable",
          chips: [
            { text: "Animal characters who behave like people.", tone: "blue" },
            { text: "A moral - the lesson - usually stated at the end.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.2 Implicit meaning",
      conceptId: "1.2",
      say: "Implicit meaning is hidden meaning. The writer shows you something instead of telling you, and you work it out.",
      frame: {
        text: {
          title: "Implicit meaning",
          chips: [
            { text: "'Jo's face fell' shows disappointment without using the word.", tone: "blue" },
            { text: "You use clues plus what you already know.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.3 Explicit meaning",
      conceptId: "1.3",
      say: "Explicit meaning is stated directly and plainly. You do not need to infer anything - it is right there on the page.",
      frame: {
        text: {
          title: "Explicit meaning",
          chips: [
            { text: "'Jo was disappointed' states the feeling outright.", tone: "blue" },
            { text: "If you can point at the words, it is explicit.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.4 Predicting",
      conceptId: "1.4",
      say: "Predicting means using what you already know - from the story so far, the title, or the pictures - to make a sensible guess about what happens next.",
      frame: {
        text: {
          title: "Predicting",
          chips: [
            { text: "A good prediction uses evidence from the text, not just imagination.", tone: "blue" },
            { text: "Predictions can be wrong - what matters is the reasoning.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.5 Perspective",
      conceptId: "1.5",
      say: "Perspective is whose eyes the story is seen through. The same events can feel completely different told by someone else.",
      frame: {
        text: {
          title: "Perspective",
          chips: [
            { text: "First person uses 'I'. Third person uses 'he', 'she', 'they'.", tone: "blue" },
            { text: "Changing the narrator changes what the reader is allowed to know.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.6 Proofreading",
      conceptId: "1.6",
      say: "Proofreading means checking your own writing after the draft is done, to fix small mistakes in spelling, punctuation and grammar.",
      frame: {
        text: {
          title: "Proofreading",
          chips: [
            { text: "Read it slowly, and out loud if you can.", tone: "blue" },
            { text: "Look for one kind of mistake at a time.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.7 Fact and opinion",
      conceptId: "1.7",
      say: "A fact can be proven true or false with evidence. An opinion is what someone thinks or feels about something.",
      frame: {
        text: {
          title: "Fact and opinion",
          chips: [
            { text: "'The lion weighs 190 kg' is a fact - it can be measured.", tone: "blue" },
            { text: "'The lion is the most magnificent animal' is an opinion.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.8 Idiomatic phrases",
      conceptId: "1.8",
      say: "An idiom is a group of words that means something different from what the individual words literally say.",
      frame: {
        text: {
          title: "Idiomatic phrases",
          chips: [
            { text: "'Break a leg' means good luck, not an injury.", tone: "blue" },
            { text: "'Let the cat out of the bag' means reveal a secret.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.9 Sentence types",
      conceptId: "1.9",
      say: "Sentences can be simple (one idea), compound (two equal ideas joined by and, but or or), or complex (a main idea plus a dependent one).",
      frame: {
        text: {
          title: "Sentence types",
          chips: [
            { text: "Simple: 'The dog barked.'", tone: "blue" },
            { text: "Compound: 'The dog barked and the cat ran.'", tone: "blue" },
            { text: "Complex: 'Because the dog barked, the cat ran.'", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.10 Story structure",
      conceptId: "1.10",
      say: "Many stories follow a narrative mountain: a beginning, a build up, a problem at the peak, then a resolution and an ending.",
      frame: {
        text: {
          title: "Story structure",
          chips: [
            { text: "The problem sits at the top of the mountain.", tone: "blue" },
            { text: "The resolution comes down the other side.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.11 Mood",
      conceptId: "1.11",
      say: "Mood is the feeling a writer creates - fear, calm, joy - built through the setting and the words chosen.",
      frame: {
        text: {
          title: "Mood",
          chips: [
            { text: "'The mist curled through the broken gate' builds unease.", tone: "blue" },
            { text: "Swap the words and the same place can feel welcoming.", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.12 Comparative and superlative adverbs",
      conceptId: "1.12",
      say: "Adverbs have three forms: positive (quickly), comparative (more quickly, comparing two) and superlative (most quickly, comparing all).",
      frame: {
        text: {
          title: "Comparative and superlative adverbs",
          chips: [
            { text: "Positive: 'She ran quickly.'", tone: "blue" },
            { text: "Comparative: 'She ran more quickly than him.'", tone: "blue" },
            { text: "Superlative: 'She ran the most quickly of all.'", tone: "blue" }
          ],
        },
      },
    },
    {
      label: "1.13 Full writing checklist",
      conceptId: "1.13",
      say: "A full checklist brings together everything you check before calling a piece finished - mood, punctuation, apostrophes and direct speech.",
      frame: {
        text: {
          title: "Full writing checklist",
          chips: [
            { text: "'The travellers coat was soaked' is missing an apostrophe - traveller's.", tone: "blue" },
            { text: "Check one thing at a time rather than everything at once.", tone: "blue" }
          ],
        },
      },
    },
  ],

  // The Test is set on a fable the child has not seen while learning.
  assessmentStory: {
    text: {
      title: "The Crow and the Pitcher - a fable you have not met yet",
      passage: [
        { text: "A thirsty crow found a pitcher with a little water at the very bottom. She pushed her beak in, but it would not reach. " },
        { text: "The crow's shoulders drooped.", tone: "gold", note: "Shown, not told - this implies she felt defeated." },
        { text: " Then she spotted a heap of pebbles. One by one she dropped them in, and the water rose, " },
        { text: "and at last she drank.", tone: "blue", note: "A compound sentence - two equal ideas joined by 'and'." },
        { text: " " },
        { text: "Little by little does the trick.", tone: "green", note: "The moral - the lesson of the fable." },
      ],
    },
  },

  guidedTasks: [
    {
      title: "Practice 1 · Shown or told?",
      conceptId: "1.2",
      prompt: "'Amara's shoulders dropped and she turned away.' Is the feeling explicit or implicit?",
      setup: { text: { title: "Sort it", columns: [{ label: "Explicit", items: ["stated in the words"], tone: "blue" }, { label: "Implicit", items: ["you work it out"], tone: "gold" }] } },
      chipDrag: { chip: "Amara's shoulders dropped and she turned away", toColumn: 1, hint: "which box?" },
      options: [
        { label: "Implicit", correct: true, say: "Right - the writer shows the body language and leaves you to name the feeling.", frame: { text: { passage: [{ text: "shoulders dropped", tone: "gold", note: "A clue, not a statement." }, { text: " - implied, not stated." }] } } },
        { label: "Explicit", correct: false, say: "Nowhere does it say how she felt. You inferred it from what her body did.", frame: { text: { passage: [{ text: "Explicit would say: 'Amara was disappointed.'", tone: "red" }] } } },
      ],
    },
    {
      title: "Practice 2 · Fact or opinion",
      conceptId: "1.7",
      prompt: "'The Sahara is the most beautiful desert on Earth.'",
      setup: { text: { title: "Sort it", columns: [{ label: "Fact", items: ["provable"], tone: "green" }, { label: "Opinion", items: ["a judgement"], tone: "red" }] } },
      chipDrag: { chip: "the most beautiful desert on Earth", toColumn: 1, hint: "which box?" },
      options: [
        { label: "Opinion", correct: true, say: "Yes - 'most beautiful' is a judgement, and no evidence could settle it.", frame: { text: { passage: [{ text: "most beautiful", tone: "red", note: "A judgement." }] } } },
        { label: "Fact", correct: false, say: "You could prove the Sahara's size, but not its beauty. That word is the giveaway.", frame: { text: { passage: [{ text: "Size = fact. Beauty = opinion.", tone: "gold" }] } } },
      ],
    },
    {
      title: "Practice 3 · Sentence type",
      conceptId: "1.9",
      prompt: "'The drum sounded and the village gathered.' What type is it?",
      options: [
        { label: "Compound", correct: true, say: "Correct - two ideas that could each stand alone, joined by 'and'.", frame: { text: { chips: [{ text: "The drum sounded", tone: "blue" }, { text: "and", tone: "gold" }, { text: "the village gathered", tone: "blue" }] } } },
        { label: "Simple", correct: false, say: "A simple sentence has one idea. This has two, joined together.", frame: { text: { chips: [{ text: "Two ideas = not simple", tone: "red" }] } } },
        { label: "Complex", correct: false, say: "Complex needs a part that cannot stand alone, like 'because...' or 'although...'. Both halves here can.", frame: { text: { chips: [{ text: "Both halves stand alone", tone: "red" }] } } },
      ],
    },
    {
      title: "Practice 4 · What does it mean?",
      conceptId: "1.8",
      prompt: "'Grandmother told him to pull his socks up.'",
      options: [
        { label: "Make more effort", correct: true, say: "Yes - an idiom. Nothing to do with actual socks.", frame: { text: { chips: [{ text: "pull your socks up = try harder", tone: "green" }] } } },
        { label: "Fix his clothing", correct: false, say: "That is the literal reading. Idioms mean something different from the words themselves.", frame: { text: { chips: [{ text: "Literal reading ✗", tone: "red" }] } } },
      ],
    },
    {
      title: "Practice 5 · Superlative",
      conceptId: "1.12",
      prompt: "'Of all the dancers, Nia moved ___.'",
      options: [
        { label: "the most gracefully", correct: true, say: "Right - comparing all of them needs the superlative.", frame: { text: { chips: [{ text: "positive: gracefully", tone: "blue" }, { text: "comparative: more gracefully", tone: "gold" }, { text: "superlative: most gracefully", tone: "green" }] } } },
        { label: "more gracefully", correct: false, say: "That compares just two. 'Of all the dancers' needs the superlative.", frame: { text: { chips: [{ text: "comparative compares two only", tone: "red" }] } } },
      ],
    },
    {
      title: "Practice 6 · Build the mood",
      conceptId: "1.11",
      prompt: "Which opening builds a calm mood?",
      options: [
        { label: "'The lake lay still, silvered by early light.'", correct: true, say: "Yes - still, silvered and early light all settle the reader.", frame: { text: { passage: [{ text: "still, silvered, early light", tone: "green", note: "Calm word choices." }] } } },
        { label: "'The lake churned black under a torn sky.'", correct: false, say: "Churned, black and torn build tension, not calm.", frame: { text: { passage: [{ text: "churned, black, torn", tone: "red", note: "Tense word choices." }] } } },
      ],
    },
  ],

  lab: { prompt: "", start: [0, 0], shape: [[0, 0]], range: { min: 0, max: 1 } },

  recitePrompts: [
    { ask: "What are the features of a fable?", answer: "Short, fictional, usually animal characters who act like people, and a moral at the end." },
    { ask: "What is the difference between explicit and implicit meaning?", answer: "Explicit is stated directly in the words. Implicit is shown through clues and you work it out." },
    { ask: "What makes a prediction a good one?", answer: "It uses evidence from the text - the story so far, the title, the pictures - not just imagination." },
    { ask: "What are the three sentence types?", answer: "Simple - one idea. Compound - two equal ideas joined by and, but or or. Complex - a main idea plus one that cannot stand alone." },
    { ask: "What shape does a narrative mountain follow?", answer: "Beginning, build up, the problem at the peak, then the resolution and the ending." },
    { ask: "How does a writer build mood?", answer: "Through the setting and the words they choose - the same place can feel calm or frightening depending on the words." },
  ],

  writtenPractice: [
    { question: "Write a two-sentence fable opening with an animal character, then state its moral.", answer: "Any short opening with an animal behaving like a person, plus a one-line lesson at the end." },
    { question: "Write one sentence that shows a character is frightened WITHOUT using the word frightened.", answer: "Something like: 'His hand hovered over the handle and would not close.'" },
    { question: "Turn into a complex sentence: 'The rain stopped. We went outside.'", answer: "When the rain stopped, we went outside. (Or: Because the rain stopped, we went outside.)" },
    { question: "Write the comparative and superlative of: quietly, well, badly.", answer: "more quietly / most quietly; better / best; worse / worst." },
    { question: "Explain two idioms in your own words: 'a piece of cake', 'under the weather'.", answer: "Very easy; and feeling unwell." },
    { question: "Proofread: 'the childrens books was left on monday.'", answer: "The children's books were left on Monday. - capital, apostrophe, verb agreement, capital for the day." },
    { question: "Describe a forest twice - once to feel welcoming, once to feel threatening. Two sentences each.", answer: "Any answer where the change comes from word choice rather than different events." },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · The moral",
        conceptId: "1.1",
        prompt: "In The Crow and the Pitcher, which line is the moral?",
        options: [
          { label: "'Little by little does the trick.'", correct: true, say: "Yes - the lesson, placed at the end where a fable's moral belongs.", frame: { text: { passage: [{ text: "Little by little does the trick.", tone: "green", note: "The moral." }] } } },
          { label: "'A thirsty crow found a pitcher.'", correct: false, say: "That is the opening situation, not the lesson.", frame: { text: { passage: [{ text: "That sets the scene.", tone: "red" }] } } },
        ],
      },
      {
        title: "Q2 · Shown, not told",
        conceptId: "1.2",
        prompt: "'The crow's shoulders drooped.' What is implied?",
        options: [
          { label: "She felt defeated", correct: true, say: "Right - the writer shows her posture and leaves you to name the feeling.", frame: { text: { passage: [{ text: "shoulders drooped", tone: "gold", note: "Implies defeat." }] } } },
          { label: "She was cold", correct: false, say: "Nothing in the story points to cold. The clue follows her failure to reach the water.", frame: { text: { passage: [{ text: "Read what came just before it.", tone: "red" }] } } },
          { label: "She was flying", correct: false, say: "Drooping shoulders is a still, downcast posture - the opposite of flight.", frame: { text: { passage: [{ text: "Drooping = downcast.", tone: "red" }] } } },
        ],
      },
      {
        title: "Q3 · Sentence type",
        conceptId: "1.9",
        prompt: "'One by one she dropped them in, and the water rose.' What type is this?",
        options: [
          { label: "Compound", correct: true, say: "Correct - two ideas that could each stand alone, joined by 'and'.", frame: { text: { chips: [{ text: "she dropped them in", tone: "blue" }, { text: "and", tone: "gold" }, { text: "the water rose", tone: "blue" }] } } },
          { label: "Simple", correct: false, say: "There are two complete ideas here, not one.", frame: { text: { chips: [{ text: "Two ideas", tone: "red" }] } } },
          { label: "Complex", correct: false, say: "No part depends on the other - both halves stand alone, which makes it compound.", frame: { text: { chips: [{ text: "Both halves stand alone", tone: "red" }] } } },
        ],
      },
      {
        title: "Q4 · Fact or opinion",
        conceptId: "1.7",
        prompt: "'The crow is the cleverest of all birds.'",
        setup: { text: { title: "Sort it", columns: [{ label: "Fact", items: [], tone: "green" }, { label: "Opinion", items: [], tone: "red" }] } },
        chipDrag: { chip: "the cleverest of all birds", toColumn: 1, hint: "which box?" },
        options: [
          { label: "Opinion", correct: true, say: "Yes - 'cleverest' is a judgement, and no evidence settles it.", frame: { text: { passage: [{ text: "cleverest", tone: "red", note: "A judgement." }] } } },
          { label: "Fact", correct: false, say: "It sounds confident, but there is no way to measure it. That is the trap.", frame: { text: { passage: [{ text: "Confident tone is not evidence.", tone: "gold" }] } } },
        ],
      },
    ],
    partB: [
      {
        title: "Q5 · Another perspective",
        conceptId: "1.5",
        prompt: "If the pebbles could speak, whose perspective would 'I was lifted and dropped into the dark' be?",
        options: [
          { label: "A pebble's, in first person", correct: true, say: "Well reasoned - 'I' tells you the narrator is in the story, and only a pebble gets lifted and dropped.", frame: { text: { passage: [{ text: "I was lifted", tone: "green", note: "First person - the narrator is in the story." }] } } },
          { label: "The crow's", correct: false, say: "The crow does the lifting. Whoever says 'I was lifted' is the one being moved.", frame: { text: { passage: [{ text: "The crow lifts; the pebble is lifted.", tone: "red" }] } } },
          { label: "Third person", correct: false, say: "Third person would say 'it was lifted'. The word 'I' makes it first person.", frame: { text: { passage: [{ text: "'I' = first person", tone: "red" }] } } },
        ],
      },
      {
        title: "Q6 · Where is the peak?",
        conceptId: "1.10",
        prompt: "On the narrative mountain, which moment is the problem in this fable?",
        options: [
          { label: "Her beak will not reach the water", correct: true, say: "Yes - that is the problem at the peak. The pebbles are the resolution coming down the other side.", frame: { text: { chips: [{ text: "build up: she is thirsty", tone: "blue" }, { text: "problem: beak will not reach", tone: "green" }, { text: "resolution: the pebbles", tone: "gold" }] } } },
          { label: "She drinks at last", correct: false, say: "That is the ending, after the problem has been solved.", frame: { text: { chips: [{ text: "That is the ending", tone: "red" }] } } },
          { label: "She finds the pitcher", correct: false, say: "That is the build up - the problem only appears when her beak will not reach.", frame: { text: { chips: [{ text: "That is the build up", tone: "red" }] } } },
        ],
      },
      {
        title: "Q7 · Build the mood",
        conceptId: "1.11",
        prompt: "Which rewrite makes the crow's struggle feel desperate?",
        options: [
          { label: "'She stabbed at the pitcher again and again, and still the water sat out of reach.'", correct: true, say: "Yes - 'stabbed', 'again and again' and 'still' pile up the frustration.", frame: { text: { passage: [{ text: "stabbed, again and again, still", tone: "green", note: "Desperate word choices." }] } } },
          { label: "'She tried once and then rested in the shade.'", correct: false, say: "That sounds calm and unhurried - the opposite of desperate.", frame: { text: { passage: [{ text: "rested in the shade", tone: "red", note: "Calm, not desperate." }] } } },
        ],
      },
      {
        title: "Q8 · Proofread it",
        conceptId: "1.13",
        prompt: "Find the error: 'The crows plan worked said the farmer.'",
        options: [
          { label: "Missing apostrophe and speech marks", correct: true, say: "Both - it should read: \"The crow's plan worked,\" said the farmer.", frame: { text: { passage: [{ text: "\"The crow's plan worked,\" said the farmer.", tone: "green" }] } } },
          { label: "Only a missing full stop", correct: false, say: "There is more than that - the plan belongs to the crow, and someone is speaking.", frame: { text: { passage: [{ text: "Two faults, not one.", tone: "red" }] } } },
          { label: "Nothing is wrong", correct: false, say: "Read it aloud - the farmer is speaking, and the plan belongs to the crow.", frame: { text: { passage: [{ text: "Possessive + direct speech", tone: "red" }] } } },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is a fable?", a: "A short fictional story, usually with animal characters, that teaches a moral about how to treat one another." },
    { q: "What is implicit meaning?", a: "Hidden meaning. The writer shows you clues instead of telling you directly, and you work it out." },
    { q: "What is an idiom?", a: "A group of words that means something different from what the words literally say - like 'break a leg' for good luck." },
    { q: "What is mood?", a: "The feeling a writer creates for the reader, built through the setting and the words they choose." },
  ],
};
