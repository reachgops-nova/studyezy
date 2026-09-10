import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge" - first English
// scene layer, built for Unit 1 (Fiction: Stories from different
// cultures). Every value below is grounded in this unit's real,
// production content (fetched via railway ssh), never invented.
//
// IMPORTANT layout rule, found live 2026-09-10 ("voice is not reading
// this as a point to be noted" - the checklist shown didn't match what
// Ezy was actually saying): AvatarChat.tsx's buildCheckpoints() pairs
// scene nodes to checkpoints by FIXED INDEX, not by topic -
//   [0] intro (definition spoken)
//   [1] examples (concept.examples spoken verbatim, only if any exist)
//   [2] key_points (concept.key_points spoken verbatim, only if any exist)
//   [3] tip (concept.tips_to_remember[0] only, if any exist)
// checkpointSceneNodes[i] must therefore show the SAME content that's
// being spoken at that index, not just "a" relevant visual - so every
// concept below follows: [0] definition quote, [1] first real example
// quote, [2] key points as a checklist, [3] tips_to_remember[0] (omitted
// entirely when a concept has no tips, since that checkpoint never
// fires).
export function getEnglishUnit1ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "1.1") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "A fable is a short, fictional story that teaches a moral lesson on how to treat others. In fables, characters are often animals who behave and speak like humans.",
          tag: "Definition",
          caption: "What a fable is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "In the Malawian fable 'Why Cockerels Crow', Cockerel has a red spiky comb that looks like flames. Hyena believes it is real fire. Moral: Do not take advantage of a friend's helpfulness, and do not let greed blind you to the truth.",
          tag: "Example",
          caption: "A real fable and its moral",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Short and to the point", "Animal characters with human traits", "Setting can be anywhere", "Clear moral at the end"],
          caption: "The four features every fable shares",
        }}
      />,
    ];
  }

  if (conceptId === "1.2") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Implicit meaning is a 'hidden meaning' in a text. Writers show us clues, and we must 'read between the lines' like a detective to figure out the truth.",
          tag: "Definition",
          caption: "What implicit meaning is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "Jo winked at Charlie and grinned as she placed the chewing gum on the teacher's chair.",
          tag: "Example",
          caption: "The explicit clues (winked, grinned) let us infer Jo is playing a mischievous joke",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{ type: "checklistCard", items: ["Actions", "Facial expressions", "Speech"], caption: "Implicit meaning is shown through these three kinds of clues, not stated directly" }}
      />,
    ];
  }

  if (conceptId === "1.3") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Explicit meaning is information a writer states directly and plainly in the text - you don't need to infer or guess anything.",
          tag: "Definition",
          caption: "What explicit meaning is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "Cockerel had a red, spiky comb on his head.", tag: "Example", caption: "This states a fact directly - nothing to infer" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Needs no reading between the lines", "Writers use it when they want certainty", "A passage often mixes explicit and implicit"],
          caption: "How explicit meaning works",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Did the writer just TELL me this, or did I have to figure it out myself? 'Told directly' = explicit.",
          tag: "Tip",
          caption: "Ask yourself this to tell the two apart",
        }}
      />,
    ];
  }

  if (conceptId === "1.4") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Predicting means using what you already know - from the story so far, the title, or the pictures - to make a sensible guess about what might happen next.",
          tag: "Definition",
          caption: "What predicting is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "If a story is called The Boy Who Cried Wolf, you can predict the boy will pretend danger is coming when it isn't, because that's what the title hints at.",
          tag: "Example",
          caption: "A prediction based on the title",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["A good prediction is based on evidence", "Predictions don't have to come true", "Titles, illustrations, and behaviour are all clues"],
          caption: "How to make a good prediction",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{ type: "quotedExcerpt", quote: "I think ___ will happen because ___", tag: "Tip", caption: "Say your prediction this way - the 'because' is the important part" }}
      />,
    ];
  }

  if (conceptId === "1.5") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Perspective is whose eyes a story is being seen through - the same events can feel completely different depending on which character's thoughts and feelings you're following.",
          tag: "Definition",
          caption: "What perspective is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "A story about a lost dog might feel worrying told from the owner's perspective, but exciting told from the dog's own perspective.",
          tag: "Example",
          caption: "Same event, two very different feelings",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["The same event feels different from each character", "Changing perspective can build sympathy", "Writers show it through whose feelings we're told"],
          caption: "How perspective works",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Whose thoughts and feelings am I being told about right now?",
          tag: "Tip",
          caption: "Ask this to work out whose perspective you're in",
        }}
      />,
    ];
  }

  if (conceptId === "1.6") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Proofreading means carefully checking your own writing after you've finished a draft, to fix small mistakes before it's a finished piece.",
          tag: "Definition",
          caption: "What proofreading is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "she walked to the shop", tag: "Example", caption: "Missing its capital letter - proofreading catches this" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Capital letters", "End punctuation", "Spacing", "Spelling", "Grammar", "Does it make sense?"],
          caption: "A good proofreading checklist",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Check one thing at a time - read once just for capital letters and full stops, then again just for spelling.",
          tag: "Tip",
          caption: "Don't try to catch everything at once",
        }}
      />,
    ];
  }

  if (conceptId === "1.7") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "A fact is something that can be proven true or false with evidence. An opinion is what someone personally thinks or feels.",
          tag: "Definition",
          caption: "Fact vs. opinion",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "The rooster has red feathers on its head.", tag: "Example", caption: "A fact - you could look and check this" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["You can check a fact, not an opinion", "'best', 'worst', 'should' signal opinion", "A passage can mix both"],
          caption: "How to tell fact from opinion",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Could two reasonable people disagree about this? If yes, it's probably an opinion, not a fact.",
          tag: "Tip",
          caption: "A quick test for fact vs. opinion",
        }}
      />,
    ];
  }

  if (conceptId === "1.8") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "An idiomatic phrase (or idiom) is a group of words that means something different from what the individual words literally say.",
          tag: "Definition",
          caption: "What an idiom is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "Break a leg!", tag: "Example", caption: "Doesn't mean an actual injury - it's an idiom meaning 'good luck'" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Can't be worked out word-by-word", "Often describe feelings, warnings, advice", "Idioms are cultural, so can confuse"],
          caption: "How idioms work",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "If a phrase makes no literal sense in context, that's a strong sign it's an idiom, not a literal statement.",
          tag: "Tip",
          caption: "How to spot a new idiom",
        }}
      />,
    ];
  }

  if (conceptId === "1.9") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Sentences can be simple (one idea), compound (two equal ideas joined by 'and', 'but', or 'or'), or complex (a main idea joined to a dependent clause).",
          tag: "Definition",
          caption: "Sentence types",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "Simple: 'The kangaroo jumped.' Compound: 'The kangaroo jumped, but it missed the branch.' Complex: 'Although it was tired, the kangaroo kept jumping.'",
          tag: "Example",
          caption: "All three sentence types compared",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Simple = one subject, one verb, one idea", "Compound joins with and/but/or", "Complex uses a connective + comma rule"],
          caption: "The three sentence types",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Split a compound sentence at 'and'/'but'/'or' - if both halves make sense alone, it's compound.",
          tag: "Tip",
          caption: "A quick test to tell compound from complex",
        }}
      />,
    ];
  }

  if (conceptId === "1.10") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "narrativeMountain",
          stages: [
            { name: "Beginning", note: "sets the scene" },
            { name: "Build up", note: "events build" },
            { name: "Challenge", note: "leads to a problem" },
            { name: "Problem", note: "most tense moment" },
            { name: "Resolution", note: "problem gets solved" },
            { name: "Ending", note: "story concludes" },
          ],
          peakIndex: 3,
          caption: "The 'problem' sits at the top of the mountain - everything before builds up, everything after resolves",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "In a fable about a clever ant who tricks a lion, the build up shows the lion boasting, the challenge is the ant deciding to teach him a lesson, the problem is the trick going wrong, and the ending shows what the lion learned.",
          tag: "Example",
          caption: "The narrative mountain applied to a real fable",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["The problem is the most tense moment", "Not every stage gets equal time", "Knowing the structure helps reading and writing"],
          caption: "How story structure works",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Before writing your own story, sketch the six stages first - even just one phrase each.",
          tag: "Tip",
          caption: "Stops you rambling with no clear problem to solve",
        }}
      />,
    ];
  }

  if (conceptId === "1.11") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Mood is the feeling or atmosphere a writer creates for the reader, built mainly through the physical setting and the specific words used to describe it.",
          tag: "Definition",
          caption: "What mood is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "The old house creaked and groaned in the wind, its broken windows staring out like empty eyes.",
          tag: "Example",
          caption: "Creates a scary mood through word choice, not by saying 'it was scary'",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Setting and word choice create mood", "Word connotations matter, not just meaning", "Mood and theme work together but differ"],
          caption: "How mood is built",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Ask which specific words are doing the mood-building work in a sentence - which ones would you change to flip a calm scene into a tense one?",
          tag: "Tip",
          caption: "Spotting the words that build mood",
        }}
      />,
    ];
  }

  if (conceptId === "1.12") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Adverbs have three forms: positive (quickly), comparative - comparing two things (more quickly/faster), and superlative - comparing three or more (most quickly/fastest).",
          tag: "Definition",
          caption: "The three adverb forms",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "Positive: 'Zach played well in the match.' Comparative: 'Masie played better than him.' Superlative: 'Ronan played the best of everyone.'",
          tag: "Example",
          caption: "All three forms in one example",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Most -ly adverbs use more/most", "Short adverbs add -er/-est", "A few are irregular (well/badly/much/little)"],
          caption: "How comparative and superlative adverbs form",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Comparative compares exactly two things ('better than him'); superlative compares three or more, and almost always needs 'the' in front ('the best').",
          tag: "Tip",
          caption: "Comparative vs. superlative",
        }}
      />,
    ];
  }

  if (conceptId === "1.13") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "A full writing checklist brings together everything you check before calling a piece of writing finished - adjectives/adverbs, sense, mood and setting, and punctuation.",
          tag: "Definition",
          caption: "What the full checklist covers",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "The travellers coat was soaked", tag: "Example", caption: "Missing an apostrophe - should be 'traveller's'" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["This combines earlier skills into one final pass", "Content checks and punctuation checks differ", "Apostrophes and speech marks get their own check"],
          caption: "How the full checklist is organised",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Work through a checklist like this in passes, not all at once - one read for mood/setting/sense, a separate read for commas and full stops, a separate read for apostrophes and speech marks.",
          tag: "Tip",
          caption: "Check in passes, not all at once",
        }}
      />,
    ];
  }

  return undefined;
}
