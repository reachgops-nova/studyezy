import type { BoardUnit } from "./types";

/**
 * English Unit 3 - Poetry: Narrative poems.
 *
 * Built from the Hodder Stage 5 learner's book, pages 41-43. The unit is
 * taught from Valerie Bloom's poem "Sandwich" (page 42), which is in
 * copyright: the board points a child at the page and works from the book's
 * own glossary, rhyme pairs and syllable table rather than reproducing
 * verses. The Test is set on an original poem written for it, so a child
 * meets the ideas on material they have not seen and nothing is reprinted.
 */
export const CAMBRIDGE_5_ENGLISH_3: BoardUnit = {
  unitKey: "cambridge-5-english-3",
  title: "Poetry: Narrative poems",
  badge: "Stage 5 · Unit 3",
  gridMax: 10,
  stage: "text",

  intro: {
    covers: [
      "What makes a poem a narrative poem, and how it differs from a story",
      "Syllables: the beats inside a word, and how to count them",
      "Rhyme: which line endings match, and which one is left out",
      "Dialect and standard English, and why a poet would choose dialect",
      "Planning a narrative poem of your own, verse by verse",
    ],
    outcomes: [
      "Say what a narrative poem must have, and what it only might have",
      "Count the syllables in any word by listening for the vowel sounds",
      "Find the rhyming words in a verse and spot the line that does not rhyme",
      "Translate dialect into standard English, and explain what is lost",
      "Plan your own narrative poem with a character, a plot and a rhyme",
    ],
  },

  concepts: [
    {
      conceptId: "3.1",
      title: "Features of narrative poems",
      icon: "📜",
      summary:
        "A narrative poem tells a story. Like any story it has characters and a plot, but it is set out in verses.",
      keyPoints: [
        "The book's definition: narrative poems tell stories. They may or may not rhyme, but they will include characters and a plot.",
        "They may also include dialogue - direct speech - and descriptions of settings, as other stories do.",
        "So characters and plot are the must-haves. Rhyme, dialogue and setting are the maybes.",
      ],
      pages: [41],
      storyReference: "'Sandwich' by Valerie Bloom, page 42 - the narrator is Neil, getting ready for a school trip",
      examples: [
        { question: "Which two things must a narrative poem have?", answer: "Characters and a plot - a story being told. (page 41)" },
        { question: "Must a narrative poem rhyme?", answer: "No. The book says they may or may not rhyme. Rhyme is a choice, not a rule. (page 41)" },
        { question: "Name three characters mentioned in 'Sandwich' on page 42.", answer: "Neil the narrator, the teacher, and Granny Lenore. Lee and Neil's mother are mentioned too." },
        { question: "What is the plot of 'Sandwich' in one sentence?", answer: "Neil packs for a school trip, is told again and again to bring a sandwich, and Granny takes it off him at the door." },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.1",
          conceptId: "3.1",
          prompt: "A poem describes a sunset for twelve lines. Nothing happens and nobody speaks. Is it a narrative poem?",
          setup: { text: { title: "Is this a narrative poem?", cards: [{ tag: "The poem", title: "Twelve lines about a sunset", desc: "Beautiful descriptions of colour and light. No people. Nothing happens." }] } },
          options: [
            { label: "No - there is no story", correct: true, say: "Right. It is a poem, and a good one perhaps, but a narrative poem has to tell a story. No characters and no plot means no narrative.", frame: { text: { title: "Not a narrative poem", cards: [{ tag: "Missing", title: "Characters and a plot", desc: "Those are the two a narrative poem cannot do without.", quote: "Narrative poems tell stories. (page 41)" }] } } },
            { label: "Yes - all poems tell stories", correct: false, say: "Not all of them. Plenty of poems describe a thing or a feeling without telling any story at all. It is the story that makes a poem a narrative poem.", frame: { text: { title: "Not quite", passage: [{ text: "A poem can describe, or argue, or simply paint a picture. Only some poems tell stories.", tone: "red" }] } } },
            { label: "Yes - it rhymes", correct: false, say: "Rhyme is not the test. The book is clear that a narrative poem may or may not rhyme. What it must have is characters and a plot.", frame: { text: { title: "Rhyme is not the test", passage: [{ text: "May or may not rhyme.", tone: "gold" }, { text: " Must have characters and a plot.", tone: "green" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.2",
      title: "Syllables",
      icon: "🥁",
      summary:
        "A syllable is a vowel sound inside a word - one beat. Counting the beats tells you how many syllables a word has.",
      keyPoints: [
        "The book's definition: a syllable is a vowel sound inside a word; it may be a vowel sound on its own, or it may also have consonant sounds.",
        "The vowels are a, e, i, o and u. Every other letter is a consonant.",
        "The book's table: bat and school have 1, orange and water have 2, tomato and beautiful have 3, mysterious and appreciate have 4.",
      ],
      pages: [41],
      storyReference: "The syllable table on page 41, and the syllable count activity on page 42",
      examples: [
        { question: "How many syllables in 'school'?", answer: "One. It is a long word to look at, but only one beat. (page 41)" },
        { question: "How many syllables in 'beautiful'?", answer: "Three - beau-ti-ful. (page 41)" },
        { question: "How many syllables in 'appreciate'?", answer: "Four - a-ppre-ci-ate. (page 41)" },
        { question: "Clap the word 'sandwich'. How many beats?", answer: "Two - sand-wich." },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.2",
          conceptId: "3.2",
          prompt: "Drag 'tomato' into the column with the right number of syllables.",
          setup: {
            text: {
              title: "How many beats?",
              chips: [{ text: "tomato", tone: "blue" }],
              columns: [
                { label: "2 syllables", items: ["orange", "water"], tone: "gold" },
                { label: "3 syllables", items: ["beautiful"], tone: "green" },
                { label: "4 syllables", items: ["mysterious"], tone: "blue" },
              ],
            },
          },
          chipDrag: { chip: "tomato", toColumn: 1, hint: "drag me" },
          options: [
            { label: "3 syllables", correct: true, say: "Yes - to-ma-to. Three beats, three vowel sounds. It sits with beautiful.", frame: { text: { title: "3 syllables", chips: [{ text: "to · ma · to", tone: "green", note: "Three vowel sounds, so three syllables." }] } } },
            { label: "2 syllables", correct: false, say: "Say it slowly and clap: to - ma - to. That is three claps, not two.", frame: { text: { title: "Count again", chips: [{ text: "to · ma · to = 3", tone: "red" }] } } },
            { label: "4 syllables", correct: false, say: "Four would be a word like mysterious or appreciate. Tomato has three beats.", frame: { text: { title: "Four sounds like this", chips: [{ text: "my · ste · ri · ous = 4", tone: "gold" }, { text: "to · ma · to = 3", tone: "green" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.3",
      title: "Rhyme in a verse",
      icon: "🔔",
      summary:
        "Rhyming words end with the same sound. In a verse some lines rhyme with each other, and sometimes one line is deliberately left out.",
      keyPoints: [
        "Rhyme is about sound, not spelling: 'today' and 'Bay' rhyme, though they are spelled quite differently.",
        "In the first verse of 'Sandwich' the first two lines rhyme, then the next three rhyme with each other.",
        "One word is left with no rhyme at all - 'sandwich' - and that is the joke. The odd word out is the one the poem is about.",
      ],
      pages: [42],
      storyReference: "The rhyme table in question 2c, page 42",
      examples: [
        { question: "The book gives 'today / Bay' as the rhyme in the first two lines. Why do they rhyme when they look so different?", answer: "Rhyme is about the sound at the end, not the spelling. Both end with the same -ay sound. (page 42)" },
        { question: "Which word in the first verse has no rhyme?", answer: "Sandwich. Every verse ends on it, and it never rhymes with anything. (page 42)" },
        { question: "Why would a poet leave one word without a rhyme on purpose?", answer: "It makes that word stick out. Your ear expects a rhyme, does not get one, and notices the word instead." },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.3",
          conceptId: "3.3",
          prompt: "Which of these rhymes with 'Bay'?",
          setup: { text: { title: "Listen to the ending", chips: [{ text: "Bay", tone: "gold", note: "Ends with the -ay sound." }] } },
          options: [
            { label: "today", correct: true, say: "Yes. Bay and today end with the same sound, even though one is short and one is long and they are spelled differently.", frame: { text: { title: "They rhyme", chips: [{ text: "B-ay", tone: "green" }, { text: "tod-ay", tone: "green", note: "Same ending sound. (page 42)" }] } } },
            { label: "baby", correct: false, say: "It starts the same, but rhyme is about the end of the word, not the beginning. Baby ends with an -ee sound.", frame: { text: { title: "Same start, different end", chips: [{ text: "Bay / baby", tone: "red", note: "Rhyme lives at the END of a word." }] } } },
            { label: "bat", correct: false, say: "Bat starts like Bay but ends on a t. Listen right to the end of the word.", frame: { text: { title: "Listen to the end", chips: [{ text: "b-at", tone: "red" }, { text: "B-ay", tone: "green" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.4",
      title: "Dialect and standard English",
      icon: "🗣️",
      summary:
        "Dialect is the way people really speak in a place. A poet may spell words the way they sound instead of using standard English.",
      keyPoints: [
        "Valerie Bloom was born in Jamaica and writes in Jamaican Creole, also called Patois. (page 41)",
        "The book's note: her writing aims to capture the voices of the characters by spelling words how they should sound, using local dialect rather than standard English.",
        "The book's glossary translates it: goin' is going, an' is and, o' is of, teck is take, gwine is going to, and Ah is I. (page 42)",
        "Watch for words that already exist but mean something else here - the poem uses 'me' to mean 'my'.",
      ],
      pages: [41, 42],
      storyReference: "The glossary beside 'Sandwich', page 42",
      examples: [
        { question: "The poem uses 'me' where standard English would use a different word. Which?", answer: "'My'. The book points this out directly on page 42." },
        { question: "Put 'Ah teckin' me ball' into standard English.", answer: "I'm taking my ball. (glossary, page 42)" },
        { question: "What does 'gwine' mean?", answer: "Going to. (glossary, page 42)" },
        { question: "Why write in dialect instead of standard English?", answer: "To capture the real voice of the character, so the reader hears Neil rather than a narrator. (page 41)" },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.4",
          conceptId: "3.4",
          prompt: "The poem says 'me new Frisbee'. What would standard English say?",
          setup: { text: { title: "Dialect into standard English", passage: [{ text: "me new Frisbee", tone: "gold", note: "How Neil really speaks." }] } },
          options: [
            { label: "my new Frisbee", correct: true, say: "Correct. The poem uses me where standard English uses my - your book points at that exact word on page 42.", frame: { text: { title: "me = my", passage: [{ text: "me new Frisbee", tone: "gold" }, { text: "  →  " }, { text: "my new Frisbee", tone: "green" }] } } },
            { label: "the new Frisbee", correct: false, say: "Close, but it loses something. 'Me' here means it belongs to him - it is my, not the.", frame: { text: { title: "Whose Frisbee?", passage: [{ text: "'The' does not tell you it is his.", tone: "red" }] } } },
            { label: "It is already standard English", correct: false, say: "Not quite - standard English would not say 'me new Frisbee'. That spelling is the poet catching how Neil really talks.", frame: { text: { title: "This is dialect", passage: [{ text: "Spelling words how they sound is the poet's choice, not a mistake.", tone: "blue" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.5",
      title: "Planning your own narrative poem",
      icon: "✍️",
      summary:
        "Plan before you write: decide the story of each verse first, then find the words and the rhymes.",
      keyPoints: [
        "The book's plan gives one question per verse: where are you going and what will you pack, what food will you take, and who will you meet as you leave.",
        "Decide your narrator first, and how they speak - that voice holds the whole poem together.",
        "Try to keep the same number of syllables in each line, so the poem keeps its beat.",
      ],
      pages: [43],
      storyReference: "The verse planning table and the draft poem to finish, page 43",
      examples: [
        { question: "What does the book suggest each of the three verses should be about?", answer: "Verse 1 where you are going and what you pack, verse 2 what food you take, verse 3 who you meet as you leave. (page 43)" },
        { question: "Why decide your narrator before you write?", answer: "Because how they speak decides every word choice - the book asks 'Who is your narrator, and how might they speak and behave?' (page 43)" },
        { question: "Give a rhyming answer to 'Will the bus get there on time?'", answer: "The book's own example is 'Lateness is such a crime!' - any rhyme on time works. (page 43)" },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.5",
          conceptId: "3.5",
          prompt: "You are writing verse 1 of a school-trip poem. Which line belongs in it?",
          setup: { text: { title: "Verse 1: where you are going, and what you pack", cards: [{ tag: "The plan", title: "Verse 1", desc: "Where are you going? What toys or equipment will you put into your bag?", quote: "page 43" }] } },
          options: [
            { label: "I'll take my beach ball, yellow and bright", correct: true, say: "Yes - that is a thing going into the bag, which is exactly what verse one is for.", frame: { text: { title: "Verse 1", passage: [{ text: "Something packed - it belongs in verse one.", tone: "green" }] } } },
            { label: "And Granny took my sandwich away", correct: false, say: "That is who you meet as you leave, so it belongs in verse three. Keep each verse to its own job.", frame: { text: { title: "That is verse 3", passage: [{ text: "Who will you meet as you leave to go to school? (page 43)", tone: "gold" }] } } },
            { label: "Some crisps and an apple to munch on the sand", correct: false, say: "Food goes in verse two. It is a good line - it is just in the wrong verse.", frame: { text: { title: "That is verse 2", passage: [{ text: "What food will you take, as well as your sandwich? (page 43)", tone: "gold" }] } } },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. A poem that tells a story",
      conceptId: "3.1",
      say: "A narrative poem is a story told in verses. It has characters and a plot, exactly like a story in prose. It may rhyme, and it may have speech and a setting - but those are choices. The story is the part it cannot do without.",
      frame: {
        text: {
          title: "Features of narrative poems · Page 41",
          cards: [
            { tag: "Must have", title: "Characters and a plot", desc: "Someone it happens to, and something that happens.", quote: "Narrative poems tell stories. (page 41)" },
            { tag: "May have", title: "Rhyme", desc: "The book is clear: they may or may not rhyme.", quote: "page 41" },
            { tag: "May have", title: "Dialogue and settings", desc: "Direct speech and descriptions of place, as other stories do.", quote: "page 41" },
          ],
        },
      },
    },
    {
      label: "2. Who is in 'Sandwich'?",
      conceptId: "3.1",
      say: "Open your book at page forty-two. The narrator is Neil, getting ready for a school trip. Look for the teacher, for Lee, for his mother, and for Granny Lenore at the door. Those are the characters - and what happens to them is the plot.",
      frame: {
        text: {
          title: "Characters in 'Sandwich' · Page 42",
          chips: [
            { text: "Neil", tone: "gold", note: "The narrator - the poem is in his voice." },
            { text: "the teacher", tone: "blue", note: "Keeps telling the class to bring a sandwich." },
            { text: "Lee", tone: "blue", note: "Who he will share the gobstoppers with." },
            { text: "me mother", tone: "blue", note: "Who he asks for the bread and butter." },
            { text: "Granny Lenore", tone: "red", note: "Who takes the sandwich away at the very end." },
          ],
        },
      },
    },
    {
      label: "3. Beats in a word",
      conceptId: "3.2",
      say: "A syllable is one beat in a word - one vowel sound. Clap as you say it. Bat is one clap. Water is two. Tomato is three. Mysterious is four. The letter count does not matter: school is a long word with only one beat.",
      frame: {
        text: {
          title: "Syllables · Page 41",
          columns: [
            { label: "1 beat", items: ["bat", "school"], tone: "gold" },
            { label: "2 beats", items: ["orange", "water"], tone: "green" },
            { label: "3 beats", items: ["tomato", "beautiful"], tone: "blue" },
            { label: "4 beats", items: ["mysterious", "appreciate"], tone: "red" },
          ],
        },
      },
    },
    {
      label: "4. Rhyme, and the word left out",
      conceptId: "3.3",
      say: "In the first verse of Sandwich, today and Bay rhyme. So do the next three line endings. But one word never rhymes with anything at all - sandwich. That is the joke of the whole poem, and your ear notices it because the rhyme it expected never comes.",
      frame: {
        text: {
          title: "Rhyme in verse 1 · Page 42",
          cards: [
            { tag: "First two lines", title: "today / Bay", desc: "Different spellings, same ending sound. Rhyme is about sound.", quote: "the book's own example, page 42" },
            { tag: "The odd one out", title: "sandwich", desc: "No rhyme anywhere. Every verse lands on it, and your ear keeps waiting.", quote: "page 42" },
          ],
        },
      },
    },
    {
      label: "5. Hearing Neil's voice",
      conceptId: "3.4",
      say: "Valerie Bloom was born in Jamaica and writes in Jamaican Creole. She spells the words the way Neil would really say them. Use the glossary beside the poem: goin' is going, an' is and, teck is take, and Ah is I. And watch out - me means my.",
      frame: {
        text: {
          title: "Dialect and standard English · Pages 41-42",
          columns: [
            { label: "In the poem", items: ["goin'", "an'", "o'", "teck", "gwine", "Ah", "me"], tone: "gold" },
            { label: "Standard English", items: ["going", "and", "of", "take", "going to", "I", "my"], tone: "green" },
          ],
        },
      },
    },
    {
      label: "6. Planning your own",
      conceptId: "3.5",
      say: "Now plan one of your own. The book gives you a question for each verse. Where are you going, and what goes in your bag? What food are you taking? And who do you meet on the way out? Answer those three and you have a plot.",
      frame: {
        text: {
          title: "Plan your narrative poem · Page 43",
          cards: [
            { tag: "Verse 1", title: "Where, and what you pack", desc: "Where are you going? What toys or equipment go into your bag?", quote: "page 43" },
            { tag: "Verse 2", title: "The food", desc: "What food will you take, as well as your sandwich?", quote: "page 43" },
            { tag: "Verse 3", title: "Who you meet", desc: "Who will you meet as you leave to go to school?", quote: "page 43" },
          ],
        },
      },
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Is it a narrative poem?",
      conceptId: "3.1",
      setup: { text: { title: "Two poems", cards: [{ tag: "Poem A", title: "A cat chases a mouse across a kitchen and knocks over the milk", desc: "Twelve lines, no rhyme." }, { tag: "Poem B", title: "The colours of autumn", desc: "Twelve lines, all rhyming." }] } },
      prompt: "Which one is the narrative poem?",
      options: [
        { label: "Poem A", correct: true, say: "Right. It has a character and a plot - something happens to someone. The fact that it does not rhyme changes nothing.", frame: { text: { title: "Poem A", passage: [{ text: "Character: the cat. Plot: the chase and the spilt milk. That is a story.", tone: "green" }] } } },
        { label: "Poem B", correct: false, say: "Poem B rhymes beautifully, but nothing happens and nobody is in it. Rhyme does not make a poem narrative - a story does.", frame: { text: { title: "Rhyme is not the test", passage: [{ text: "May or may not rhyme.", tone: "gold" }, { text: " Must have characters and a plot.", tone: "green" }] } } },
        { label: "Both of them", correct: false, say: "Only one tells a story. Poem B describes autumn beautifully, but description is not a plot.", frame: { text: { title: "Only one", passage: [{ text: "Describing a thing is not the same as telling what happened to someone.", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 2 · Count the beats",
      conceptId: "3.2",
      setup: { text: { title: "How many syllables?", chips: [{ text: "mysterious", tone: "blue" }] } },
      prompt: "How many syllables are in 'mysterious'?",
      options: [
        { label: "4", correct: true, say: "Yes - my-ste-ri-ous. Four vowel sounds, four beats. The book puts it in the four column on page forty-one.", frame: { text: { title: "4 syllables", chips: [{ text: "my · ste · ri · ous", tone: "green" }] } } },
        { label: "3", correct: false, say: "Nearly. Say it slowly - my-ste-ri-ous. The -ri- in the middle is its own beat, which is easy to swallow.", frame: { text: { title: "Do not swallow the middle", chips: [{ text: "my · ste · ri · ous = 4", tone: "red", note: "The -ri- counts." }] } } },
        { label: "10 - one for each letter", correct: false, say: "Letters are not beats. School has six letters and only one syllable. Listen for the vowel sounds instead.", frame: { text: { title: "Letters are not beats", chips: [{ text: "school = 6 letters, 1 beat", tone: "gold" }] } } },
      ],
    },
    {
      title: "Task 3 · The word with no rhyme",
      conceptId: "3.3",
      setup: { text: { title: "Verse 1 endings", chips: [{ text: "today", tone: "green" }, { text: "Bay", tone: "green" }, { text: "me", tone: "blue" }, { text: "see", tone: "blue" }, { text: "Frisbee", tone: "blue" }, { text: "sandwich", tone: "red" }] } },
      prompt: "Which of these has no rhyming partner in the verse?",
      options: [
        { label: "sandwich", correct: true, say: "Exactly. Today and Bay go together, me and see and Frisbee go together, and sandwich is left standing on its own - which is precisely why you remember it.", frame: { text: { title: "The odd one out", chips: [{ text: "today / Bay", tone: "green" }, { text: "me / see / Frisbee", tone: "blue" }, { text: "sandwich - no partner", tone: "red", note: "And the poem is named after it." }] } } },
        { label: "Frisbee", correct: false, say: "Frisbee does have partners - it rhymes with me and with see. Look for the one with nothing to pair with.", frame: { text: { title: "Frisbee has partners", chips: [{ text: "me / see / Frisbee", tone: "green" }] } } },
        { label: "today", correct: false, say: "Today rhymes with Bay in the very next line - the book gives you that pair on page forty-two.", frame: { text: { title: "today / Bay", chips: [{ text: "Both end with the -ay sound.", tone: "green" }] } } },
      ],
    },
    {
      title: "Task 4 · Into standard English",
      conceptId: "3.4",
      setup: { text: { title: "From the glossary", passage: [{ text: "An' ah just headin' for the door", tone: "gold" }] } },
      prompt: "Which is this line in standard English?",
      options: [
        { label: "And I'm just heading for the door", correct: true, say: "Correct. An' is and, ah is I, and headin' is heading. The glossary on page forty-two gives you every one of them.", frame: { text: { title: "Standard English", passage: [{ text: "And I'm just heading for the door", tone: "green" }] } } },
        { label: "An ant just headed for the door", correct: false, say: "That is reading the letters instead of listening. 'Ah' is how the poem writes I - it is in the glossary.", frame: { text: { title: "Ah = I", passage: [{ text: "Use the glossary beside the poem. (page 42)", tone: "red" }] } } },
        { label: "It cannot be translated", correct: false, say: "It can - the book translates it for you in the glossary. What is lost in translating is Neil's voice, not his meaning.", frame: { text: { title: "Meaning survives, voice does not", passage: [{ text: "The glossary gives the meaning. The dialect gives the person.", tone: "blue" }] } } },
      ],
    },
    {
      title: "Task 5 · Which verse?",
      conceptId: "3.5",
      setup: { text: { title: "Sort the line", columns: [{ label: "Verse 1 · packing", items: [], tone: "gold" }, { label: "Verse 2 · food", items: [], tone: "green" }, { label: "Verse 3 · who you meet", items: [], tone: "blue" }] } },
      prompt: "Where does 'I bumped into Mrs Shah at the gate' belong?",
      options: [
        { label: "Verse 3", correct: true, say: "Yes - that is someone you meet as you leave, which is what the book gives verse three for.", frame: { text: { title: "Verse 3", passage: [{ text: "Who will you meet as you leave to go to school? (page 43)", tone: "green" }] } } },
        { label: "Verse 1", correct: false, say: "Verse one is where you are going and what goes in the bag. Mrs Shah is a person you meet, not a thing you pack.", frame: { text: { title: "Verse 1 is the bag", passage: [{ text: "Where are you going? What goes into your bag? (page 43)", tone: "red" }] } } },
        { label: "Verse 2", correct: false, say: "Verse two is the food. Unless Mrs Shah is edible, she belongs in verse three.", frame: { text: { title: "Verse 2 is the food", passage: [{ text: "What food will you take, as well as your sandwich? (page 43)", tone: "red" }] } } },
      ],
    },
  ],

  lab: { prompt: "", start: [0, 0], shape: [[0, 0]], range: { min: 0, max: 1 } },

  recitePrompts: [
    { ask: "What must a narrative poem have, and what might it have?", answer: "It must have characters and a plot - it tells a story. It may have rhyme, dialogue and a setting, but none of those are required." },
    { ask: "What is a syllable?", answer: "A vowel sound inside a word - one beat. Clap as you say the word and count the claps." },
    { ask: "Is rhyme about spelling or sound?", answer: "Sound. Today and Bay rhyme although they are spelled quite differently." },
    { ask: "Why might a poet write in dialect instead of standard English?", answer: "To catch the real voice of the character, so the reader hears the person speaking rather than a narrator." },
    { ask: "What should you decide before writing your own narrative poem?", answer: "Who the narrator is and how they speak, and what story each verse will tell." },
  ],

  writtenPractice: [
    { question: "Write down five words from around your room. Next to each one, write how many syllables it has. Check by clapping.", answer: "Any five - the check is whether the claps match the number you wrote. Remember school has six letters and one beat." },
    { question: "Find three words that rhyme with 'door'. None of them may be spelled with -oor.", answer: "For example: more, four, your, floor is not allowed, saw is close but does not quite rhyme. This proves rhyme is about sound." },
    { question: "Write these in standard English: 'De whole class goin' to Whitney Bay.'", answer: "The whole class is going to Whitney Bay. (de = the, goin' = going - glossary, page 42)" },
    { question: "Plan a narrative poem about leaving for school. Use the book's three questions on page 43, one per verse. Write only the plan, not the poem.", answer: "Verse 1 where you are going and what you pack. Verse 2 the food. Verse 3 who you meet. A plan is enough - the poem comes after." },
    { question: "Write the first two lines of your poem so that they rhyme, and count the syllables in each. Are they close?", answer: "Lines with a similar number of syllables keep the beat. The book asks you to try for the same number in each line." },
  ],

  // The Test is set on a poem written for this board, so the child meets the
  // ideas on material they have not seen - and nothing in copyright is
  // reprinted to do it.
  assessmentStory: {
    text: {
      title: "The Last Bus - a narrative poem you have not met yet",
      passage: [
        { text: "Me an' Jojo waitin' by the gate, " },
        { text: "The bus is comin' but the bus is late,", tone: "gold", note: "Dialect: 'me' for my or I, and 'comin'' spelled how it sounds." },
        { text: " Ah got me ticket an' me lunch inside, " },
        { text: "A book to read an' a coat to hide " },
        { text: "The rain that's fallin' on me head - " },
        { text: "An' Mum still shoutin' from the shed.", tone: "blue", note: "Gate/late rhyme, and inside/hide rhyme. Head and shed rhyme too." },
        { text: " " },
        { text: "The bus rolls up. The doors go wide. " },
        { text: "Jojo grins an' climbs inside. " },
        { text: "Ah reach me hand into me sleeve - " },
        { text: "Me ticket's gone. Ah cannot leave.", tone: "red", note: "The plot: something happens, and it changes everything." },
      ],
    },
  },

  assessment: {
    partA: [
      {
        title: "Q1 · Is it narrative?",
        conceptId: "3.1",
        prompt: "Is 'The Last Bus' a narrative poem? How do you know?",
        options: [
          { label: "Yes - it has characters and a plot", correct: true, say: "Correct. The narrator and Jojo are the characters, and the plot is waiting for the bus and losing the ticket.", frame: { text: { title: "Narrative", passage: [{ text: "Characters: the narrator, Jojo, Mum. Plot: the bus comes and the ticket is gone.", tone: "green" }] } } },
          { label: "No - it is too short", correct: false, say: "Length is not the test. A narrative poem can be four lines long as long as it tells a story.", frame: { text: { title: "Length is not the test", passage: [{ text: "Characters and a plot. That is the test.", tone: "red" }] } } },
          { label: "No - it rhymes, so it is a rhyming poem", correct: false, say: "A poem can be both. Rhyming does not stop it telling a story, and telling a story is what makes it narrative.", frame: { text: { title: "It can be both", passage: [{ text: "Narrative poems may or may not rhyme.", tone: "gold" }] } } },
        ],
      },
      {
        title: "Q2 · Count the beats",
        conceptId: "3.2",
        prompt: "How many syllables are in the word 'ticket'?",
        options: [
          { label: "2", correct: true, say: "Yes - tick-et. Two vowel sounds, two beats.", frame: { text: { title: "2 syllables", chips: [{ text: "tick · et", tone: "green" }] } } },
          { label: "1", correct: false, say: "Say it aloud and clap - tick-et. That is two claps.", frame: { text: { title: "Two claps", chips: [{ text: "tick · et = 2", tone: "red" }] } } },
          { label: "3", correct: false, say: "Three would be a word like tomato. Ticket has two beats.", frame: { text: { title: "Three sounds like this", chips: [{ text: "to · ma · to = 3", tone: "gold" }, { text: "tick · et = 2", tone: "green" }] } } },
        ],
      },
      {
        title: "Q3 · Find the rhyme",
        conceptId: "3.3",
        prompt: "Which word in the poem rhymes with 'gate'?",
        options: [
          { label: "late", correct: true, say: "Correct - gate and late, right at the end of the first two lines.", frame: { text: { title: "gate / late", chips: [{ text: "Same ending sound.", tone: "green" }] } } },
          { label: "inside", correct: false, say: "Inside rhymes with hide, not with gate. Listen to the ending sound.", frame: { text: { title: "inside / hide", chips: [{ text: "A different pair.", tone: "gold" }] } } },
          { label: "grins", correct: false, say: "Grins does not rhyme with gate at all - it ends on an -ins sound.", frame: { text: { title: "Listen to the end", chips: [{ text: "g-ate / gr-ins", tone: "red" }] } } },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Dialect",
        conceptId: "3.4",
        prompt: "The poem says 'Ah reach me hand into me sleeve'. What is that in standard English?",
        options: [
          { label: "I reach my hand into my sleeve", correct: true, say: "Right. Ah is I and me is my - the same two swaps you met in Sandwich.", frame: { text: { title: "Standard English", passage: [{ text: "I reach my hand into my sleeve", tone: "green" }] } } },
          { label: "A hand reaches into a sleeve", correct: false, say: "That keeps the action but loses the person. 'Ah' means I - it is his hand, and he is telling you.", frame: { text: { title: "Who is speaking?", passage: [{ text: "Ah = I. The narrator is in the sentence.", tone: "red" }] } } },
          { label: "He reached his hand into his sleeve", correct: false, say: "The poem is in the first person - Ah means I, not he. Switching to he changes who is telling the story.", frame: { text: { title: "First person", passage: [{ text: "Ah = I, so it stays I.", tone: "gold" }] } } },
        ],
      },
      {
        title: "Q5 · The plot",
        conceptId: "3.1",
        prompt: "What is the plot of 'The Last Bus'?",
        options: [
          { label: "He waits for the bus and then finds his ticket is gone", correct: true, say: "Yes. A plot is what happens and what changes - and losing the ticket changes everything.", frame: { text: { title: "The plot", passage: [{ text: "Waiting → the bus arrives → the ticket is missing.", tone: "green" }] } } },
          { label: "It is raining", correct: false, say: "The rain is setting, not plot. Setting is where and when; plot is what happens.", frame: { text: { title: "Setting, not plot", passage: [{ text: "Rain tells you the weather. It does not tell you what happened.", tone: "red" }] } } },
          { label: "Jojo grins", correct: false, say: "That is a detail inside the story, not the story itself. Ask what changes by the end.", frame: { text: { title: "A detail, not the plot", passage: [{ text: "What changed between the first line and the last?", tone: "gold" }] } } },
        ],
      },
      {
        title: "Q6 · Why dialect?",
        conceptId: "3.4",
        prompt: "Why might a poet write this poem in dialect rather than standard English?",
        options: [
          { label: "To let you hear the narrator's real voice", correct: true, say: "Exactly - your book says the poet spells words how they should sound to capture the voices of the characters.", frame: { text: { title: "The voice", passage: [{ text: "Spelling words how they sound puts the person in the poem. (page 41)", tone: "green" }] } } },
          { label: "Because the poet cannot spell", correct: false, say: "No - every one of those spellings is a deliberate choice, and the book explains why on page forty-one.", frame: { text: { title: "A choice, not a mistake", passage: [{ text: "Valerie Bloom writes in Jamaican Creole on purpose. (page 41)", tone: "red" }] } } },
          { label: "To make the poem harder", correct: false, say: "It is not there to be difficult. It is there so you hear a real person speaking rather than a narrator.", frame: { text: { title: "Not difficulty - voice", passage: [{ text: "That is why the book gives you a glossary beside it.", tone: "gold" }] } } },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is a narrative poem?", a: "A poem that tells a story. It has characters and a plot, and it may or may not rhyme." },
    { q: "How do I count syllables?", a: "Say the word slowly and clap each beat. Each beat is one vowel sound. School has six letters but only one beat." },
    { q: "Do rhyming words have to be spelled alike?", a: "No. Rhyme is about sound. Today and Bay rhyme, and they are spelled quite differently." },
    { q: "What is dialect?", a: "The way people really speak in a place. A poet may spell words how they sound to catch that voice." },
    { q: "What does 'teck' mean in the poem?", a: "Take. The glossary beside the poem on page 42 translates it for you." },
    { q: "How do I start my own narrative poem?", a: "Plan first. Decide who your narrator is, then answer one question per verse: where you go, what you eat, who you meet." },
  ],
};
