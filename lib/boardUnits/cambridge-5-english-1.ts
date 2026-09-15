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
 * Every worked example on this board is the textbook's own, carried across
 * with its page numbers and the fable it came from - Why Cockerels Crow,
 * Why Monkeys live in Trees, The Elephant who lost his Patience, The Lion
 * with the Red Eyes, The Broath with the Rocks. A child can put the board
 * down, open the book at that page, and see the same example.
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
      title: "Features of a Fable",
      icon: "🦊",
      summary: "A fable is a short, fictional story that teaches a moral lesson (a rule about right and wrong) on how to treat others. In fables, characters are often animals who behave and speak like humans.",
      pages: [5, 6],
      keyPoints: [
        "In the Malawian fable 'Why Cockerels Crow', Cockerel has a red spiky comb that looks like flames. Hyena believes it is real fire. This sets up a humorous conflict about deception..."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "In the Malawian fable 'Why Cockerels Crow', Cockerel has a red spiky comb that looks like flames. Hyena believes it is real fire. This sets up a humorous conflict about deception and trust. Moral: Do not take advantage of a friend's helpfulness, and do not let greed blind you to the truth." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.1",
          conceptId: "1.1",
          prompt: "Which of these makes a story a fable?",
          setup: { text: { title: "Is it a fable?" } },
          options: [
            { label: "It teaches a moral, and the animals act like people", correct: true, say: "Right. Short, animal characters who behave like humans, and a lesson at the end - that is a fable.", frame: { text: { title: "A fable", passage: [{ text: "Why Cockerels Crow teaches that deception and arrogance destroy trust. Page 5.", tone: "green" }] } } },
            { label: "It is set a long time ago", correct: false, say: "Lots of stories are set long ago without being fables. The test is the moral and the animals who act like people.", frame: { text: { title: "Not the test", passage: [{ text: "Plenty of stories are old. Only some carry a lesson about right and wrong.", tone: "red" }] } } },
            { label: "It is very long", correct: false, say: "The opposite - fables are short on purpose, so nothing gets in the way of the lesson.", frame: { text: { title: "Fables are short", passage: [{ text: "There is no room for anything that does not carry the moral.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.2",
      title: "Implicit Meaning (Jo's Face)",
      icon: "🕵️",
      summary: "Implicit meaning is a 'hidden meaning' in a text. Writers do not always tell readers directly what a character is like or what is happening. Instead, they show us clues, and we must 'read between the lines' like a detective to figure out...",
      pages: [5],
      keyPoints: [
        "\"Jo winked at Charlie and grinned as she placed the chewing gum on the teacher's chair.\" Explicit clue: winked and grinned. Implicit meaning: Jo is playing a cheeky, mischievous..."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "\"Jo winked at Charlie and grinned as she placed the chewing gum on the teacher's chair.\" Explicit clue: winked and grinned. Implicit meaning: Jo is playing a cheeky, mischievous joke on the teacher, and Charlie is in on the secret." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.2",
          conceptId: "1.2",
          prompt: "'Cockerel sat with his feet up on the table while Hyena fetched the water.' What does that SHOW you about Cockerel?",
          setup: { text: { title: "Read between the lines" } },
          options: [
            { label: "He is lazy and takes advantage of others", correct: true, say: "Exactly. The writer never says lazy - you worked it out from what he did. That is implicit meaning.", frame: { text: { title: "Implicit meaning", passage: [{ text: "'Cockerel was sitting with his feet up on an old table under the trees.' Page 5.", tone: "green" }] } } },
            { label: "He is tired after a long walk", correct: false, say: "That would need evidence from the text. Nothing says he walked anywhere - but it does say Hyena is doing the work.", frame: { text: { title: "Check the evidence", passage: [{ text: "An inference still has to be backed by something on the page.", tone: "red" }] } } },
            { label: "Nothing - it just says where he sat", correct: false, say: "It says more than that. Who is working while he rests? That contrast is the writer showing you his character.", frame: { text: { title: "Look at the contrast", passage: [{ text: "One character works, the other puts his feet up.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.3",
      title: "Explicit Meaning",
      icon: "📌",
      summary: "Explicit meaning is information a writer states directly and plainly in the text - you don't need to infer or guess anything, because the writer has told you outright.",
      pages: [5],
      storyReference: "Why Cockerels Crow (a fable from Malawi)",
      keyPoints: [
        "\"Cockerel had a red, spiky comb on his head\" is explicit - it states a fact directly, nothing to infer."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "\"Cockerel had a red, spiky comb on his head\" is explicit - it states a fact directly, nothing to infer." },
        { question: "Read this from your book, then say it back in your own words:", answer: "\"Hyena's paws trembled as he reached for the comb\" doesn't say 'Hyena was scared' explicitly - that's implicit, since you infer the fear from the trembling." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.3",
          conceptId: "1.3",
          prompt: "Which of these is explicit - stated outright, with nothing to work out?",
          setup: { text: { title: "Told, or shown?" } },
          options: [
            { label: "'Hyena brought back some water and Cockerel drank it.'", correct: true, say: "Yes - it simply tells you what happened. Nothing hidden, nothing to infer.", frame: { text: { title: "Explicit", passage: [{ text: "The writer states it directly. Page 5.", tone: "green" }] } } },
            { label: "'Cockerel's comb glowed red like flames.'", correct: false, say: "That one is doing extra work - it makes you picture fire, and it sets up Hyena's mistake. There is something to infer.", frame: { text: { title: "That one implies", passage: [{ text: "The comb only LOOKS like fire. Hyena infers wrongly - and that is the plot.", tone: "red" }] } } },
            { label: "'Hyena's shoulders sagged as he walked away.'", correct: false, say: "Sagging shoulders is showing, not telling. You have to work out that he feels defeated.", frame: { text: { title: "That one shows", passage: [{ text: "Explicit would be: Hyena was disappointed.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.4",
      title: "Predicting as a reading strategy",
      icon: "🔮",
      summary: "Predicting means using what you already know - from the story so far, the title, or the pictures - to make a sensible guess about what might happen next, before you read on.",
      pages: [8, 9],
      storyReference: "Why Cockerels Crow (a fable from Malawi)",
      keyPoints: [
        "If a story is called The Boy Who Cried Wolf, you can predict the boy will pretend danger is coming when it isn't, because that's what the title hints at."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "If a story is called The Boy Who Cried Wolf, you can predict the boy will pretend danger is coming when it isn't, because that's what the title hints at." },
        { question: "Read this from your book, then say it back in your own words:", answer: "A character has been unkind to everyone else in the story so far, so you predict that unkindness will cause a problem for them later on." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.4",
          conceptId: "1.4",
          prompt: "A story is called 'The Boy Who Cried Wolf'. Before reading, what is a sensible prediction?",
          setup: { text: { title: "Predict from evidence" } },
          options: [
            { label: "Someone will raise a false alarm", correct: true, say: "Good prediction - and you can say why: the title tells you he cries wolf, which means calling danger that is not there.", frame: { text: { title: "Backed by the title", passage: [{ text: "A prediction is a sensible guess made from evidence you already have.", tone: "green" }] } } },
            { label: "The boy will become a vet", correct: false, say: "There is nothing in the title pointing that way. A prediction has to be built on evidence, not invented.", frame: { text: { title: "No evidence", passage: [{ text: "Predicting is using what you know, not guessing at random.", tone: "red" }] } } },
            { label: "You cannot predict before reading", correct: false, say: "You can, and good readers always do. The title, the pictures and the story so far are all evidence.", frame: { text: { title: "Always predict", passage: [{ text: "It is one of the strategies your book teaches on page 9.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.5",
      title: "Perspective / point of view",
      icon: "👀",
      summary: "Perspective (or point of view) is whose eyes a story is being seen through - the same events can feel completely different depending on which character's thoughts and feelings you're following.",
      pages: [12, 13],
      storyReference: "Why Monkeys live in Trees (a fable from South Africa)",
      keyPoints: [
        "A story about a lost dog might feel worrying told from the owner's perspective, but exciting told from the dog's own perspective."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "A story about a lost dog might feel worrying told from the owner's perspective, but exciting told from the dog's own perspective." },
        { question: "Read this from your book, then say it back in your own words:", answer: "From one character's perspective, a story might be about being desperately hungry. From another's, the same event is about being robbed. Same event, two very different feelings." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.5",
          conceptId: "1.5",
          prompt: "The same lost-dog story, told by the dog instead of the owner. What changes?",
          setup: { text: { title: "Whose eyes?" } },
          options: [
            { label: "How the events feel to the reader", correct: true, say: "Yes. The events are the same - what changes is whose eyes you see them through. Worried owner, excited dog.", frame: { text: { title: "Perspective", passage: [{ text: "The same events can feel completely different depending on who tells them.", tone: "green" }] } } },
            { label: "The events themselves change", correct: false, say: "The dog still gets lost and still comes home. Perspective changes the feeling, not the facts.", frame: { text: { title: "Same events", passage: [{ text: "What happened stays the same. How it feels does not.", tone: "red" }] } } },
            { label: "Nothing changes at all", correct: false, say: "A great deal changes. To the owner it is frightening; to the dog it might be the best afternoon of its life.", frame: { text: { title: "A lot changes", passage: [{ text: "That is exactly why writers choose their narrator carefully.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.6",
      title: "Proofreading checklist",
      icon: "🔎",
      summary: "Proofreading means carefully checking your own writing after you've finished a draft, to fix small mistakes in punctuation, spelling, and grammar before it's a finished piece.",
      pages: [10],
      keyPoints: [
        "'She walked to the shop.' has a capital letter, correct spacing, and a full stop - proofread and ready. 'she walked to the shop' is missing its capital letter and needs fixing."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "'She walked to the shop.' has a capital letter, correct spacing, and a full stop - proofread and ready. 'she walked to the shop' is missing its capital letter and needs fixing." },
        { question: "Read this from your book, then say it back in your own words:", answer: "'I like pizza I also like pasta' is missing punctuation between two ideas - proofreading catches that it needs a full stop or connective: 'I like pizza. I also like pasta.'" }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.6",
          conceptId: "1.6",
          prompt: "Which sentence still needs proofreading?",
          setup: { text: { title: "Spot the slip" } },
          options: [
            { label: "'she walked to the shop'", correct: true, say: "Correct - no capital letter at the start and no full stop at the end. Both are checklist items.", frame: { text: { title: "Two fixes needed", passage: [{ text: "She walked to the shop.", tone: "green" }] } } },
            { label: "'She walked to the shop.'", correct: false, say: "That one is already right - capital letter, correct spacing, full stop. Nothing to fix.", frame: { text: { title: "Already correct", passage: [{ text: "Capital, spacing, full stop - all present.", tone: "red" }] } } },
            { label: "Both are fine", correct: false, say: "Look again at the first one. It starts lower case and never ends.", frame: { text: { title: "Check the first", passage: [{ text: "A capital letter and a full stop are the two easiest things to miss.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.7",
      title: "Fact vs. opinion",
      icon: "⚖️",
      summary: "A fact is something that can be proven true or false with evidence. An opinion is what someone personally thinks, feels, or believes - and it can be different from person to person, even about the same thing.",
      pages: [9, 11],
      storyReference: "Why Cockerels Crow (a fable from Malawi)",
      keyPoints: [
        "'The rooster has red feathers on its head' is a fact - you could look and check. 'The rooster is the most impressive animal in the story' is an opinion - someone else might..."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "'The rooster has red feathers on its head' is a fact - you could look and check. 'The rooster is the most impressive animal in the story' is an opinion - someone else might disagree." },
        { question: "Read this from your book, then say it back in your own words:", answer: "'It rained yesterday' is a fact that can be checked against a weather record. 'Yesterday was a terrible day' is an opinion - it depends on how the person felt about it." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.7",
          conceptId: "1.7",
          prompt: "'The rooster is the most impressive animal in the story.' Fact or opinion?",
          setup: { text: { title: "Can you prove it?" } },
          options: [
            { label: "Opinion", correct: true, say: "Right - 'most impressive' is a judgement. Someone else could disagree and neither of you could prove it.", frame: { text: { title: "Opinion", passage: [{ text: "It cannot be checked, only argued about.", tone: "green" }] } } },
            { label: "Fact", correct: false, say: "Ask yourself how you would prove it. There is no measurement for impressive - that makes it an opinion.", frame: { text: { title: "Not provable", passage: [{ text: "'The rooster has red feathers' is a fact. This is not.", tone: "red" }] } } },
            { label: "Both", correct: false, say: "There is no checkable part here at all. Every word of it rests on someone's judgement.", frame: { text: { title: "All judgement", passage: [{ text: "Compare: 'red feathers' can be checked, 'most impressive' cannot.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.8",
      title: "Idiomatic phrases",
      icon: "🗝️",
      summary: "An idiomatic phrase (or idiom) is a group of words that means something different from what the individual words literally say - you have to know the phrase as a whole to understand it.",
      pages: [17],
      storyReference: "The Elephant who lost his Patience (a fable from India)",
      keyPoints: [
        "'Break a leg!' doesn't mean an actual injury - it's an idiom meaning 'good luck', often said before a performance."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "'Break a leg!' doesn't mean an actual injury - it's an idiom meaning 'good luck', often said before a performance." },
        { question: "Read this from your book, then say it back in your own words:", answer: "'She let the cat out of the bag' doesn't involve a real cat - it means she accidentally revealed a secret." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.8",
          conceptId: "1.8",
          prompt: "Your friend says 'break a leg' before your school play. What do they mean?",
          setup: { text: { title: "Idioms" } },
          options: [
            { label: "Good luck", correct: true, say: "Yes. The words say one thing and the phrase means another - that is what makes it an idiom.", frame: { text: { title: "An idiom", passage: [{ text: "You have to know the phrase; the words alone will not tell you.", tone: "green" }] } } },
            { label: "They want you to get hurt", correct: false, say: "Taking the words literally is exactly the trap. An idiom means something different from what its words say.", frame: { text: { title: "Not literal", passage: [{ text: "That is why idioms are hard until someone teaches you them.", tone: "red" }] } } },
            { label: "They think the stage is unsafe", correct: false, say: "Nothing to do with the stage. It is a set phrase that performers say to each other for luck.", frame: { text: { title: "A set phrase", passage: [{ text: "Its meaning is fixed by custom, not by the words.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.9",
      title: "Sentence types: simple, compound, complex + connectives",
      icon: "🔗",
      summary: "Sentences can be simple (one idea), compound (two equal ideas joined by 'and', 'but', or 'or'), or complex/multi-clause (a main idea joined to a dependent clause using a connective like 'because', 'although', or 'when').",
      pages: [16],
      keyPoints: [
        "Simple: 'The kangaroo jumped.' Compound: 'The kangaroo jumped, but it missed the branch.' Complex: 'Although it was tired, the kangaroo kept jumping.'"
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "Simple: 'The kangaroo jumped.' Compound: 'The kangaroo jumped, but it missed the branch.' Complex: 'Although it was tired, the kangaroo kept jumping.'" },
        { question: "Read this from your book, then say it back in your own words:", answer: "'Because the fire had gone out, they couldn't cook dinner' is complex - the comma comes after the dependent clause ('Because the fire had gone out') since it comes first in the sentence." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.9",
          conceptId: "1.9",
          prompt: "'Although it was tired, the kangaroo kept jumping.' What kind of sentence is that?",
          setup: { text: { title: "Name the sentence" } },
          options: [
            { label: "Complex", correct: true, say: "Correct. 'Although it was tired' cannot stand alone - it depends on the main idea, which makes the sentence complex.", frame: { text: { title: "Complex", passage: [{ text: "A main idea joined to a dependent one.", tone: "green" }] } } },
            { label: "Compound", correct: false, say: "Compound joins two ideas that could each stand alone, with and, but or or. 'Although it was tired' could not stand alone.", frame: { text: { title: "Compound needs two equals", passage: [{ text: "The kangaroo jumped, but it missed the branch.", tone: "red" }] } } },
            { label: "Simple", correct: false, say: "A simple sentence has one idea. This one has two, and one of them leans on the other.", frame: { text: { title: "Simple is one idea", passage: [{ text: "The kangaroo jumped.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.10",
      title: "Story structure (the narrative 'mountain')",
      icon: "⛰️",
      summary: "Story structure is the shape a story's events follow from beginning to end. Many stories follow a 'narrative mountain': the beginning sets the scene, then events build up, lead to a challenge, reach a problem (the most tense point), the...",
      pages: [19],
      storyReference: "The Elephant who lost his Patience (a fable from India)",
      keyPoints: [
        "In a fable about a clever ant who tricks a lion, the build up shows the lion boasting, the challenge is the ant deciding to teach him a lesson, the problem is the trick going..."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "In a fable about a clever ant who tricks a lion, the build up shows the lion boasting, the challenge is the ant deciding to teach him a lesson, the problem is the trick going wrong, and the ending shows what the lion learned." },
        { question: "Read this from your book, then say it back in your own words:", answer: "If a story jumps straight from 'the beginning' to 'the ending' with no build up or problem in between, it will feel flat - readers expect that rise and fall in tension." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.10",
          conceptId: "1.10",
          prompt: "Where on the narrative mountain does the problem sit?",
          setup: { text: { title: "The narrative mountain" } },
          options: [
            { label: "At the peak", correct: true, say: "Yes - the problem is the top of the mountain, the most exciting part, before things start to be put right.", frame: { text: { title: "The peak", passage: [{ text: "Beginning, build up, problem, resolution, ending.", tone: "green" }] } } },
            { label: "At the very start", correct: false, say: "The start is the beginning, where you meet the characters and see the setting. The problem comes after the build up.", frame: { text: { title: "That is the beginning", passage: [{ text: "The beginning sets the scene.", tone: "red" }] } } },
            { label: "At the very end", correct: false, say: "The end is where everything comes together. The problem has to come before it, or there is nothing to resolve.", frame: { text: { title: "That is the ending", passage: [{ text: "Resolution first, then the ending.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.11",
      title: "Mood created through setting and word choice",
      icon: "🌧️",
      summary: "Mood is the feeling or atmosphere a writer creates for the reader - like happiness, sadness, fear, or calm - built mainly through the physical setting a writer chooses and the specific words used to describe it.",
      pages: [20],
      storyReference: "The Lion with the Red Eyes (a fable from Somalia)",
      keyPoints: [
        "'The old house creaked and groaned in the wind, its broken windows staring out like empty eyes' creates a scary mood through word choice, not just by saying 'it was scary.'"
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "'The old house creaked and groaned in the wind, its broken windows staring out like empty eyes' creates a scary mood through word choice, not just by saying 'it was scary.'" },
        { question: "Read this from your book, then say it back in your own words:", answer: "The same walk through a forest could feel peaceful ('sunlight dappled gently through the leaves') or frightening ('shadows twisted between the trees, and every snap of a twig echoed'), purely through setting and word choice." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.11",
          conceptId: "1.11",
          prompt: "Which word choice creates a frightening mood?",
          setup: { text: { title: "Mood from words" } },
          options: [
            { label: "The old house creaked and groaned in the wind", correct: true, say: "Yes. Creaked and groaned make the house sound almost alive - the mood comes from word choice, not from saying 'it was scary'.", frame: { text: { title: "Scary mood", passage: [{ text: "Your book's own phrase is 'the gentle crackling of the logs' for the opposite. Page 20.", tone: "green" }] } } },
            { label: "The old house stood at the end of the lane", correct: false, say: "That is neutral. It tells you where the house is without making you feel anything about it.", frame: { text: { title: "No mood yet", passage: [{ text: "Same house, no atmosphere.", tone: "red" }] } } },
            { label: "The house was scary", correct: false, say: "That tells rather than shows. It names the feeling instead of creating it, so the reader does not actually feel it.", frame: { text: { title: "Told, not shown", passage: [{ text: "Creaked and groaned does the work that 'scary' only claims.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.12",
      title: "Comparative and superlative adverbs",
      icon: "🏃",
      summary: "Adverbs have three forms: positive (the plain form, e.g. 'quickly'), comparative (comparing two things, e.g. 'more quickly' or 'faster'), and superlative (comparing three or more things, e.g. 'most quickly' or 'fastest').",
      pages: [20],
      keyPoints: [
        "Positive: 'Zach played well in the match.' Comparative: 'Masie played better than him.' Superlative: 'Ronan played the best of everyone.'"
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "Positive: 'Zach played well in the match.' Comparative: 'Masie played better than him.' Superlative: 'Ronan played the best of everyone.'" },
        { question: "Read this from your book, then say it back in your own words:", answer: "Positive: 'She ran quickly.' Comparative: 'She ran more quickly than her brother.' Superlative: 'She ran the most quickly of the whole team.'" }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.12",
          conceptId: "1.12",
          prompt: "'Ronan played ___ of everyone.' Which form fits?",
          setup: { text: { title: "Three forms" } },
          options: [
            { label: "the best", correct: true, say: "Correct - comparing more than two, so you need the superlative: the best.", frame: { text: { title: "Superlative", passage: [{ text: "Positive: well. Comparative: better. Superlative: best.", tone: "green" }] } } },
            { label: "better", correct: false, say: "Better compares just two. Here it is everyone, so you need the superlative form.", frame: { text: { title: "Comparative", passage: [{ text: "Masie played better than him - that is two people.", tone: "red" }] } } },
            { label: "well", correct: false, say: "Well is the plain form. It describes how he played without comparing him to anyone.", frame: { text: { title: "Positive", passage: [{ text: "Zach played well in the match.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "1.13",
      title: "Full writing checklist (mood, punctuation, apostrophes, direct speech)",
      icon: "✅",
      summary: "A full writing checklist brings together everything you check before calling a piece of writing finished: does it use adjectives/adverbs/adverbial phrases well, does it make sense, is there a clear setting and mood, and is the punctuation...",
      pages: [25],
      storyReference: "The Broath with the Rocks (a fable from Scotland)",
      keyPoints: [
        "'The travellers coat was soaked' is missing an apostrophe (should be 'traveller's') - a small error a full read-through checklist would catch even if the sentence otherwise makes..."
      ],
      examples: [
        { question: "Read this from your book, then say it back in your own words:", answer: "'The travellers coat was soaked' is missing an apostrophe (should be 'traveller's') - a small error a full read-through checklist would catch even if the sentence otherwise makes perfect sense." },
        { question: "Read this from your book, then say it back in your own words:", answer: "'Where did you get that from he asked' is missing direct speech punctuation - it should read: \"Where did you get that from?\" he asked." }
      ],
      quickCheck: [
        {
          title: "Quick check · 1.13",
          conceptId: "1.13",
          prompt: "'The travellers coat was soaked.' What does the checklist catch?",
          setup: { text: { title: "Full writing checklist" } },
          options: [
            { label: "A missing apostrophe", correct: true, say: "Yes - it should be traveller's coat. The sentence makes perfect sense, which is exactly why a checklist catches it and your ear does not.", frame: { text: { title: "traveller's", passage: [{ text: "An apostrophe shows the coat belongs to the traveller.", tone: "green" }] } } },
            { label: "Nothing - it is correct", correct: false, say: "It reads fine, and that is the trap. Whose coat is it? The apostrophe is doing that job and it is missing.", frame: { text: { title: "Read it again", passage: [{ text: "travellers \u2192 traveller's", tone: "red" }] } } },
            { label: "A spelling mistake", correct: false, say: "Every word is spelled correctly. What is missing is punctuation, not letters.", frame: { text: { title: "Punctuation, not spelling", passage: [{ text: "The checklist covers both - this one is the apostrophe.", tone: "red" }] } } },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1.1 Poster · a short animal tale",
      conceptId: "1.1",
      say: "Look at who is in this story. A fox, an owl, a tortoise - animals, but standing and talking and arguing exactly like people. And right in the middle, open on the grass, the lesson. That is a fable.",
      frame: {
        image: {
          src: "/board-art/en1-fable-scene.jpg",
          alt: "Fox, owl and tortoise talking in a forest around an open book marked LESSON",
          title: "A short animal tale",
          hotspots: [
            { label: "A short animal tale", at: [21, 88], note: "Fables are short on purpose. There is no room for anything that does not carry the lesson.", tone: "blue" },
            { label: "Animals that talk", at: [27, 44], note: "Fox, Owl and Tortoise speak and argue exactly like people. That is what makes the lesson easy to see.", tone: "gold" },
            { label: "The lesson", at: [48, 74], note: "The moral sits open in the middle of everything, because it is the reason the story exists.", tone: "green" },
          ],
        },
      },
    },
    {
      label: "1.1 Poster · and what it leaves you with",
      conceptId: "1.1",
      say: "Two more things every fable has. A lesson waiting at the end, about right and wrong. And characters with human strengths and human weaknesses, which is exactly why they end up in conflict.",
      frame: {
        image: {
          src: "/board-art/en1-fable-lesson.jpg",
          alt: "A scroll reading a lesson at the end, beside a child weighing up right and wrong",
          title: "A lesson at the end",
          hotspots: [
            { label: "A lesson at the end", at: [26, 52], note: "In 'Why Cockerels Crow' the lesson lands last: deception and arrogance destroy trust. Page 5.", tone: "green" },
            { label: "Human attributes", at: [78, 62], note: "The characters have human strengths and weaknesses, so they end up in some sort of conflict. Page 5.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "1.1 Features of a Fable",
      conceptId: "1.1",
      say: "A fable is a short, fictional story that teaches a moral lesson (a rule about right and wrong) on how to treat others. In fables, characters are often animals who behave and speak like humans.You will find this on pages 5 and 6 of your book.",
      frame: {
        text: {
          title: "Features of a Fable· Pages 5 and 6",
          cards: [
            { tag: "Moral / Lesson", title: "True Friendship", desc: "Deception and arrogance destroy trust. False claims eventually get exposed.", quote: "Why Cockerels Crow (Malawi)" },
            { tag: "Moral / Lesson", title: "Cooperation", desc: "Working as a team and sharing what you have helps everyone succeed.", quote: "The Broath with the Rocks (Scotland)" },
          ],
        },
      },
    },
    {
      label: "1.2 Poster · shown or told",
      conceptId: "1.2",
      say: "Two ways to say the same thing. On the left the writer tells you: I am hungry. On the right the writer shows you: my stomach rumbled like thunder. Nobody said hungry, but you knew. That hidden half is implicit meaning.",
      frame: {
        image: {
          src: "/board-art/en1-told-shown.jpg",
          alt: "Telling a feeling directly beside showing the same feeling through an action",
          title: "Shown or told",
          hotspots: [
            { label: "Telling", at: [28, 10], note: "The writer tells you exactly how a character feels: 'He was hungry.' Nothing left to work out.", tone: "blue" },
            { label: "Showing", at: [72, 10], note: "'My stomach rumbled like thunder.' The writer describes an action, and you do the working out.", tone: "gold" },
          ],
        },
      },
    },
    {
      label: "1.2 Poster · more than one reading",
      conceptId: "1.2",
      say: "Here is the tricky part. Look at these two faces. Is that one being mischievous, or just pleased with itself? Implicit meaning can have more than one answer, and more than one of them can be right - as long as you can point at your evidence.",
      frame: {
        image: {
          src: "/board-art/en1-hidden-meanings.jpg",
          alt: "Two similar faces labelled mischievous and winking and grinning",
          title: "Hidden meanings",
          hotspots: [
            { label: "Mischievous?", at: [36, 52], note: "Jo winked at Charlie and grinned. Naughty? Mischievous? Or mean? The text does not say. Page 5.", tone: "gold" },
            { label: "Or just pleased?", at: [69, 52], note: "There may be more than one interpretation of implicit meaning - that is what pulls a reader in. Page 5.", tone: "green" },
          ],
        },
      },
    },
    {
      label: "1.2 Implicit Meaning (Jo's Face)",
      conceptId: "1.2",
      say: "Implicit meaning is a 'hidden meaning' in a text. Writers do not always tell readers directly what a character is like or what is happening. Instead, they show us clues, and we must 'read between the lines' like a detective to...You will find this on page 5 of your book.",
      frame: {
        text: {
          title: "Implicit Meaning (Jo's Face)· Page 5",
          cards: [
            { tag: "Implicit Meaning", title: "Hidden traits - shown, not told", desc: "Cockerel sat in the shade with his feet up while Hyena worked. That shows he is lazy and arrogant without ever saying so.", quote: "'Cockerel was sitting with his feet up on an old table under the trees.'" },
            { tag: "Character Motive", title: "Monkey's trickery", desc: "Monkey winked and tied Lioness's tail to a tree - the wink shows he is a clever trickster.", quote: "Why Monkeys Live in Trees (South Africa)" },
          ],
        },
      },
    },
    {
      label: "1.3 Poster · told outright",
      conceptId: "1.3",
      say: "Now zoom in on the telling side. Explicit means the writer has already done the work for you. Hyena brought back some water and Cockerel drank it. There is nothing hidden there - it simply happened.",
      frame: {
        image: {
          src: "/board-art/en1-told-shown.jpg",
          alt: "Zoomed on the telling side: the writer states the feeling directly",
          title: "Told outright · explicit",
          focus: { x: 2, y: 2, w: 47, h: 96 },
          hotspots: [
            { label: "Stated directly", at: [27, 20], note: "'I am hungry.' The feeling is named. You do not have to infer anything.", tone: "green" },
            { label: "No detective work", at: [27, 86], note: "Explicit meaning is the writer telling you exactly how a character feels, e.g. 'He was hungry.' Page 5.", tone: "blue" },
          ],
        },
      },
    },
    {
      label: "1.3 Explicit Meaning",
      conceptId: "1.3",
      say: "Explicit meaning is information a writer states directly and plainly in the text - you don't need to infer or guess anything, because the writer has told you outright.You will find this on page 5 of your book, in Why Cockerels Crow (a fable from Malawi).",
      frame: {
        text: {
          title: "Explicit Meaning· Page 5",
          cards: [
            { tag: "Explicit Meaning", title: "Direct facts - told outright", desc: "The text states it plainly. Nothing to infer, nothing to work out.", quote: "'Hyena brought back some water and Cockerel drank it.'" },
          ],
        },
      },
    },
    {
      label: "1.4 Predicting as a reading strategy",
      conceptId: "1.4",
      say: "Predicting means using what you already know - from the story so far, the title, or the pictures - to make a sensible guess about what might happen next, before you read on.You will find this on pages 8 and 9 of your book, in Why Cockerels Crow (a fable from Malawi).",
      frame: {
        text: {
          title: "Predicting as a reading strategy· Pages 8 and 9",
          chips: [
            { text: "If a story is called The Boy Who Cried Wolf, you can predict the boy will pretend danger is coming when it isn't, because that's what the title hints...", tone: "blue", note: "If a story is called The Boy Who Cried Wolf, you can predict the boy will pretend danger is coming when it isn't, because that's what the title hints at." },
            { text: "A character has been unkind to everyone else in the story so far, so you predict that unkindness will cause a problem for them later on.", tone: "blue", note: "A character has been unkind to everyone else in the story so far, so you predict that unkindness will cause a problem for them later on." }
          ],
        },
      },
    },
    {
      label: "1.5 Perspective / point of view",
      conceptId: "1.5",
      say: "Perspective (or point of view) is whose eyes a story is being seen through - the same events can feel completely different depending on which character's thoughts and feelings you're following.You will find this on pages 12 and 13 of your book, in Why Monkeys live in Trees (a fable from South Africa).",
      frame: {
        text: {
          title: "Perspective / point of view· Pages 12 and 13",
          chips: [
            { text: "A story about a lost dog might feel worrying told from the owner's perspective, but exciting told from the dog's own perspective.", tone: "blue", note: "A story about a lost dog might feel worrying told from the owner's perspective, but exciting told from the dog's own perspective." },
            { text: "From one character's perspective, a story might be about being desperately hungry. From another's, the same event is about being robbed. Same event,...", tone: "blue", note: "From one character's perspective, a story might be about being desperately hungry. From another's, the same event is about being robbed. Same event, two very different feelings." }
          ],
        },
      },
    },
    {
      label: "1.6 Proofreading checklist",
      conceptId: "1.6",
      say: "Proofreading means carefully checking your own writing after you've finished a draft, to fix small mistakes in punctuation, spelling, and grammar before it's a finished piece.You will find this on page 10 of your book.",
      frame: {
        text: {
          title: "Proofreading checklist· Page 10",
          chips: [
            { text: "'She walked to the shop.' has a capital letter, correct spacing, and a full stop - proofread and ready. 'she walked to the shop' is missing its...", tone: "blue", note: "'She walked to the shop.' has a capital letter, correct spacing, and a full stop - proofread and ready. 'she walked to the shop' is missing its capital letter and needs fixing." },
            { text: "'I like pizza I also like pasta' is missing punctuation between two ideas - proofreading catches that it needs a full stop or connective: 'I like...", tone: "blue", note: "'I like pizza I also like pasta' is missing punctuation between two ideas - proofreading catches that it needs a full stop or connective: 'I like pizza. I also like pasta.'" }
          ],
        },
      },
    },
    {
      label: "1.7 Fact vs. opinion",
      conceptId: "1.7",
      say: "A fact is something that can be proven true or false with evidence. An opinion is what someone personally thinks, feels, or believes - and it can be different from person to person, even about the same thing.You will find this on pages 9 and 11 of your book, in Why Cockerels Crow (a fable from Malawi).",
      frame: {
        text: {
          title: "Fact vs. opinion· Pages 9 and 11",
          chips: [
            { text: "'The rooster has red feathers on its head' is a fact - you could look and check. 'The rooster is the most impressive animal in the story' is an...", tone: "blue", note: "'The rooster has red feathers on its head' is a fact - you could look and check. 'The rooster is the most impressive animal in the story' is an opinion - someone else might disagree." },
            { text: "'It rained yesterday' is a fact that can be checked against a weather record. 'Yesterday was a terrible day' is an opinion - it depends on how the...", tone: "blue", note: "'It rained yesterday' is a fact that can be checked against a weather record. 'Yesterday was a terrible day' is an opinion - it depends on how the person felt about it." }
          ],
        },
      },
    },
    {
      label: "1.8 Idiomatic phrases",
      conceptId: "1.8",
      say: "An idiomatic phrase (or idiom) is a group of words that means something different from what the individual words literally say - you have to know the phrase as a whole to understand it.You will find this on page 17 of your book, in The Elephant who lost his Patience (a fable from India).",
      frame: {
        text: {
          title: "Idiomatic phrases· Page 17",
          cards: [
            { tag: "Idiom", title: "was on the fence", desc: "Hyena was hesitant and undecided about taking a flame from Cockerel.", quote: "'Hyena was on the fence: if he could get a flame from Cockerel...'" },
            { tag: "Idiom", title: "under the weather", desc: "Feeling unwell - used by Lioness to trick Monkey into visiting.", quote: "'Tell Monkey that I am feeling really under the weather...'" },
            { tag: "Idiom", title: "in a flash", desc: "Happening very quickly and suddenly.", quote: "'In a flash, Lioness roared loudly and sprang out of bed!'" },
            { tag: "Idiom", title: "heart of gold", desc: "King Elephant was extremely kind, gentle and generous.", quote: "'King Elephant was gentle and had a heart of gold.'" },
            { tag: "Idiom", title: "a piece of cake", desc: "Something was very easy to do.", quote: "'Teasing King Elephant was such a piece of cake!'" },
            { tag: "Idiom", title: "in hot water", desc: "In deep trouble.", quote: "'He is in hot water now, someone murmured.'" },
          ],
        },
      },
    },
    {
      label: "1.9 Sentence types: simple, compound, complex + connectives",
      conceptId: "1.9",
      say: "Sentences can be simple (one idea), compound (two equal ideas joined by 'and', 'but', or 'or'), or complex/multi-clause (a main idea joined to a dependent clause using a connective like 'because', 'although', or 'when').You will find this on page 16 of your book.",
      frame: {
        text: {
          title: "Sentence types: simple, compound, complex + connectives· Page 16",
          cards: [
            { tag: "Simple Sentence", title: "One independent clause", desc: "One subject, one verb, one complete thought.", quote: "'The magpies sang their song.'" },
            { tag: "Compound Sentence", title: "Two clauses + connective", desc: "Two equal clauses joined by and, but or so.", quote: "'The magpies loved the warmth, BUT the wombats missed their burrows.'" },
            { tag: "Complex Sentence", title: "Main + dependent clause", desc: "A main clause joined to one that cannot stand alone, using because, although or while.", quote: "'BECAUSE the magpies had never been able to jump before, they hopped about in joy.'" },
          ],
        },
      },
    },
        {
      label: "1.10 Story structure",
      conceptId: "1.10",
      say: "Many stories follow a narrative mountain. Look at the whole shape first - it climbs to a peak in the middle, then comes back down.",
      frame: {
        image: {
          src: "/board-art/en1-narrative-mountain.jpg", alt: "The narrative mountain: beginning, build up, problem at the peak, resolution and ending.",
          title: "The narrative mountain",
          hotspots: [
            { label: "Beginning", at: [21, 47], note: "The start, where we meet the characters and see the setting.", tone: "gold" },
            { label: "Build up", at: [39, 35], note: "Exciting clues appear and the action starts to move faster.", tone: "green" },
            { label: "Problem", at: [58, 26], note: "The peak, and the most exciting part of the story.", tone: "red" },
            { label: "Resolution", at: [72, 40], note: "The action slows down as the characters find ways to fix things.", tone: "blue" },
            { label: "Ending", at: [86, 47], note: "The story finishes and all the parts come together at last.", tone: "gold" },
          ],
        },
      },
    },
    {
      label: "1.10a Beginning",
      conceptId: "1.10",
      say: "At the foot of the mountain is the beginning, where we meet the characters and see where the story happens.",
      frame: {
        image: {
          src: "/board-art/en1-narrative-mountain.jpg", alt: "The narrative mountain: beginning, build up, problem at the peak, resolution and ending.",
          title: "The narrative mountain",
          focus: { x: 4, y: 28, w: 30, h: 50 },
          hotspots: [
            { label: "Beginning", at: [21, 47], note: "The start, where we meet the characters and see the setting.", tone: "gold" },
            { label: "Build up", at: [39, 35], note: "Exciting clues appear and the action starts to move faster.", tone: "green" },
            { label: "Problem", at: [58, 26], note: "The peak, and the most exciting part of the story.", tone: "red" },
            { label: "Resolution", at: [72, 40], note: "The action slows down as the characters find ways to fix things.", tone: "blue" },
            { label: "Ending", at: [86, 47], note: "The story finishes and all the parts come together at last.", tone: "gold" },
          ],
        },
      },
    },
    {
      label: "1.10b Build up",
      conceptId: "1.10",
      say: "Climbing the mountain is the build up. Exciting clues appear and the action starts to move faster.",
      frame: {
        image: {
          src: "/board-art/en1-narrative-mountain.jpg", alt: "The narrative mountain: beginning, build up, problem at the peak, resolution and ending.",
          title: "The narrative mountain",
          focus: { x: 26, y: 18, w: 30, h: 50 },
          hotspots: [
            { label: "Beginning", at: [21, 47], note: "The start, where we meet the characters and see the setting.", tone: "gold" },
            { label: "Build up", at: [39, 35], note: "Exciting clues appear and the action starts to move faster.", tone: "green" },
            { label: "Problem", at: [58, 26], note: "The peak, and the most exciting part of the story.", tone: "red" },
            { label: "Resolution", at: [72, 40], note: "The action slows down as the characters find ways to fix things.", tone: "blue" },
            { label: "Ending", at: [86, 47], note: "The story finishes and all the parts come together at last.", tone: "gold" },
          ],
        },
      },
    },
    {
      label: "1.10c Problem",
      conceptId: "1.10",
      say: "The peak is the problem - the most exciting part, where everything comes to a head.",
      frame: {
        image: {
          src: "/board-art/en1-narrative-mountain.jpg", alt: "The narrative mountain: beginning, build up, problem at the peak, resolution and ending.",
          title: "The narrative mountain",
          focus: { x: 45, y: 8, w: 30, h: 45 },
          hotspots: [
            { label: "Beginning", at: [21, 47], note: "The start, where we meet the characters and see the setting.", tone: "gold" },
            { label: "Build up", at: [39, 35], note: "Exciting clues appear and the action starts to move faster.", tone: "green" },
            { label: "Problem", at: [58, 26], note: "The peak, and the most exciting part of the story.", tone: "red" },
            { label: "Resolution", at: [72, 40], note: "The action slows down as the characters find ways to fix things.", tone: "blue" },
            { label: "Ending", at: [86, 47], note: "The story finishes and all the parts come together at last.", tone: "gold" },
          ],
        },
      },
    },
    {
      label: "1.10d Resolution",
      conceptId: "1.10",
      say: "Coming down the other side is the resolution. The action slows as the characters find ways to fix things.",
      frame: {
        image: {
          src: "/board-art/en1-narrative-mountain.jpg", alt: "The narrative mountain: beginning, build up, problem at the peak, resolution and ending.",
          title: "The narrative mountain",
          focus: { x: 62, y: 22, w: 30, h: 50 },
          hotspots: [
            { label: "Beginning", at: [21, 47], note: "The start, where we meet the characters and see the setting.", tone: "gold" },
            { label: "Build up", at: [39, 35], note: "Exciting clues appear and the action starts to move faster.", tone: "green" },
            { label: "Problem", at: [58, 26], note: "The peak, and the most exciting part of the story.", tone: "red" },
            { label: "Resolution", at: [72, 40], note: "The action slows down as the characters find ways to fix things.", tone: "blue" },
            { label: "Ending", at: [86, 47], note: "The story finishes and all the parts come together at last.", tone: "gold" },
          ],
        },
      },
    },
    {
      label: "1.10e Ending",
      conceptId: "1.10",
      say: "And at the foot again is the ending, where the story finishes and all the parts come together.",
      frame: {
        image: {
          src: "/board-art/en1-narrative-mountain.jpg", alt: "The narrative mountain: beginning, build up, problem at the peak, resolution and ending.",
          title: "The narrative mountain",
          focus: { x: 74, y: 28, w: 26, h: 50 },
          hotspots: [
            { label: "Beginning", at: [21, 47], note: "The start, where we meet the characters and see the setting.", tone: "gold" },
            { label: "Build up", at: [39, 35], note: "Exciting clues appear and the action starts to move faster.", tone: "green" },
            { label: "Problem", at: [58, 26], note: "The peak, and the most exciting part of the story.", tone: "red" },
            { label: "Resolution", at: [72, 40], note: "The action slows down as the characters find ways to fix things.", tone: "blue" },
            { label: "Ending", at: [86, 47], note: "The story finishes and all the parts come together at last.", tone: "gold" },
          ],
        },
      },
    },
    {
      label: "1.11 Poster · mood from words",
      conceptId: "1.11",
      say: "One room, drawn twice. Same window, same armchair, same fire. Above, the words are perfect, tiny village, gentle crackling, and it feels safe. Below, the words are menacing, trembling, frightful, and the very same room turns frightening. Nothing moved. Only the words changed.",
      frame: {
        image: {
          src: "/board-art/en1-mood-words.jpg",
          alt: "Poster panel: the same fireside room shown calm and then tense, labelled with the words that create each mood",
          title: "Mood from words",
          hotspots: [
            { label: "Calm and gentle", at: [50, 22], note: "Perfect, tiny village, gentle crackling. Your book uses that exact phrase: 'The only sound was the gentle crackling of the logs.' Page 20.", tone: "green" },
            { label: "Same room", at: [20, 48], note: "Look hard at the window and the armchair. Nothing in the room has changed at all.", tone: "blue" },
            { label: "Tense and scary", at: [50, 74], note: "Menacing, trembling, frightful. The writer chose different adjectives, and the safe room became a frightening one.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "1.11 Mood created through setting and word choice",
      conceptId: "1.11",
      say: "Mood is the feeling or atmosphere a writer creates for the reader - like happiness, sadness, fear, or calm - built mainly through the physical setting a writer chooses and the specific words used to describe it.You will find this on page 20 of your book, in The Lion with the Red Eyes (a fable from Somalia).",
      frame: {
        text: {
          title: "Mood created through setting and word choice· Page 20",
          cards: [
            { tag: "Setting Mood", title: "Dreich and rainy", desc: "A gloomy, cold outside makes the warm house inside feel all the cosier.", quote: "'It's awful dreich tonight, said the old man.'" },
            { tag: "Sensory Details", title: "Taste and sound", desc: "Drips from a hat making a puddle, a crackling fire, the soft plop of wooden spoons.", quote: "'The only sound was the gentle crackling of the logs...'" },
            { tag: "Setting Detail", title: "Heat and cold", desc: "A boiling hot day when Lioness stalked her prey, against a cold windy night.", quote: "'It was a boiling hot day and the fleas in her fur were working overtime!'" },
          ],
        },
      },
    },
    {
      label: "1.12 Comparative and superlative adverbs",
      conceptId: "1.12",
      say: "Adverbs have three forms: positive (the plain form, e.g. 'quickly'), comparative (comparing two things, e.g. 'more quickly' or 'faster'), and superlative (comparing three or more things, e.g. 'most quickly' or 'fastest').You will find this on page 20 of your book.",
      frame: {
        text: {
          title: "Comparative and superlative adverbs· Page 20",
          chips: [
            { text: "Positive: 'Zach played well in the match.' Comparative: 'Masie played better than him.' Superlative: 'Ronan played the best of everyone.'", tone: "blue", note: "Positive: 'Zach played well in the match.' Comparative: 'Masie played better than him.' Superlative: 'Ronan played the best of everyone.'" },
            { text: "Positive: 'She ran quickly.' Comparative: 'She ran more quickly than her brother.' Superlative: 'She ran the most quickly of the whole team.'", tone: "blue", note: "Positive: 'She ran quickly.' Comparative: 'She ran more quickly than her brother.' Superlative: 'She ran the most quickly of the whole team.'" }
          ],
        },
      },
    },
    {
      label: "1.13 Poster · which end mark?",
      conceptId: "1.13",
      say: "Before the full checklist, the easiest thing to check is the very last mark of every sentence. A statement ends with a full stop. A question ends with a question mark. An exclamation, showing strong feeling, ends with an exclamation mark. Get the last mark right and half your punctuation is already correct.",
      frame: {
        image: {
          src: "/board-art/en1-sentence-types.jpg",
          alt: "Poster panel: three children speaking a statement, a question and an exclamation, each with its end punctuation drawn large",
          title: "Which end mark?",
          hotspots: [
            { label: "Full stop", at: [80, 20], note: "'The sun rose.' A statement gives information and stops with a plain full stop.", tone: "blue" },
            { label: "Question mark", at: [80, 48], note: "'Where are you?' A question asks for information, so it ends with a question mark. Your book's example: \"Where did you get that from?\" he asked. Page 25.", tone: "gold" },
            { label: "Exclamation mark", at: [84, 77], note: "'What a liar!' An exclamation shows strong emotion or surprise, and ends with an exclamation mark.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "1.13 Full writing checklist (mood, punctuation, apostrophes, direct speech)",
      conceptId: "1.13",
      say: "A full writing checklist brings together everything you check before calling a piece of writing finished: does it use adjectives/adverbs/adverbial phrases well, does it make sense, is there a clear setting and mood, and is the...You will find this on page 25 of your book, in The Broath with the Rocks (a fable from Scotland).",
      frame: {
        text: {
          title: "Full writing checklist (mood, punctuation, apostrophes, direct speech)· Page 25",
          chips: [
            { text: "'The travellers coat was soaked' is missing an apostrophe (should be 'traveller's') - a small error a full read-through checklist would catch even if...", tone: "blue", note: "'The travellers coat was soaked' is missing an apostrophe (should be 'traveller's') - a small error a full read-through checklist would catch even if the sentence otherwise makes perfect sense." },
            { text: "'Where did you get that from he asked' is missing direct speech punctuation - it should read: \"Where did you get that from?\" he asked.", tone: "blue", note: "'Where did you get that from he asked' is missing direct speech punctuation - it should read: \"Where did you get that from?\" he asked." }
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
