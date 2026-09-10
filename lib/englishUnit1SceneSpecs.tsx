import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import NumberConceptScene from "@/components/interactive/NumberConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 1
// (Fiction: Stories from different cultures) is the first English unit
// in this rollout - uses the new LiteracyConceptScene.tsx (quotedExcerpt/
// narrativeMountain/checklistCard) plus NumberConceptScene's existing
// placeValueChart (reused as-is for the comparative/superlative adverb
// table - three labeled columns is exactly its existing shape, no new
// variant needed). Every value below is grounded in this unit's real,
// production content (fetched via railway ssh), never invented.
export function getEnglishUnit1ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "1.1") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Cockerel has a red spiky comb that looks like flames. Hyena believes it is real fire.",
          tag: "Fable setup",
          caption: "In the Malawian fable 'Why Cockerels Crow', this sets up a humorous conflict about deception and trust",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "checklistCard",
          items: ["Short and to the point", "Animal characters with human traits", "Setting can be anywhere", "Clear moral at the end"],
          caption: "The four features every fable shares",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "quotedExcerpt",
          quote: "Do not take advantage of a friend's helpfulness, and do not let greed blind you to the truth.",
          tag: "Moral",
          caption: "Fables almost always end with a clear moral or lesson like this one",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Characters are often animals with distinct human traits - greedy, hard-working, selfish.",
          tag: "Characters",
          caption: "Animal characters in fables behave and speak like humans",
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
          quote: "Jo winked at Charlie and grinned as she placed the chewing gum on the teacher's chair.",
          tag: "Explicit clue: winked, grinned",
          caption: "The explicit clues (winking, grinning) let us infer the implicit meaning: Jo is playing a cheeky, mischievous joke",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "checklistCard", items: ["Actions", "Facial expressions", "Speech"], caption: "Implicit meaning is shown through these three kinds of clues, not stated directly" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{ type: "quotedExcerpt", quote: "Jo was mischievous.", tag: "Explicit (stated directly)", caption: "This tells us directly - no reading between the lines needed" }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{ type: "checklistCard", items: ["Background knowledge", "Text clues", "= an inference"], caption: "We combine background knowledge with text clues to make inferences" }}
      />,
    ];
  }

  if (conceptId === "1.3") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{ type: "quotedExcerpt", quote: "Cockerel had a red, spiky comb on his head.", tag: "Explicit", caption: "This states a fact directly - nothing to infer" }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "Hyena's paws trembled as he reached for the comb.",
          tag: "Implicit (infer: scared)",
          caption: "This doesn't say 'Hyena was scared' explicitly - that's implicit, inferred from the trembling",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Did the writer just TELL me this?", "Or did I have to figure it out myself?"],
          caption: "'Told directly' = explicit - ask this question to tell the two apart",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Check explicit information first when answering a comprehension question.",
          tag: "Strategy",
          caption: "Explicit information doesn't require interpretation, so it's a good place to start",
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
          quote: "The Boy Who Cried Wolf",
          tag: "Title clue",
          caption: "You can predict the boy will pretend danger is coming when it isn't, because that's what the title hints at",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "checklistCard",
          items: ["Title", "Illustrations", "How a character has behaved so far"],
          caption: "These are all clues you can use to predict what happens next",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "quotedExcerpt",
          quote: "I think ___ will happen because ___",
          tag: "Prediction format",
          caption: "Say your prediction this way - the 'because' is the important part, not the guess itself",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Right?", "Partly right?", "Completely wrong?"],
          caption: "Keep reading with your prediction in mind, then check which of these happened",
        }}
      />,
    ];
  }

  if (conceptId === "1.5") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "A story about a lost dog might feel worrying told from the owner's perspective, but exciting told from the dog's own perspective.",
          tag: "Same event, two feelings",
          caption: "The same event can feel completely different depending on whose eyes we see it through",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "checklistCard",
          items: ["Whose thoughts and feelings am I being told about right now?"],
          caption: "That question tells you whose perspective you're in",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "quotedExcerpt",
          quote: "Only include what THAT character would actually know, see, or feel.",
          tag: "Retelling rule",
          caption: "To retell a story from a different character's perspective, stick to only what they'd actually know",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Whose thoughts/feelings are shown?", "What does that character notice?"],
          caption: "Writers show perspective through these two choices",
        }}
      />,
    ];
  }

  if (conceptId === "1.6") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "checklistCard",
          items: ["Capital letters", "End punctuation", "Spacing", "Spelling", "Grammar", "Does it make sense?"],
          caption: "A good proofreading checklist covers all of these",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "she walked to the shop", tag: "Needs fixing", caption: "Missing its capital letter - proofreading catches this" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "quotedExcerpt",
          quote: "I like pizza I also like pasta",
          tag: "Needs fixing",
          caption: "Missing punctuation between two ideas - needs a full stop or connective",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Read once for capitals & full stops", "Read again for spelling", "Read again: does it make sense?"],
          caption: "Check one thing at a time rather than everything at once",
        }}
      />,
    ];
  }

  if (conceptId === "1.7") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{ type: "quotedExcerpt", quote: "The rooster has red feathers on its head.", tag: "Fact", caption: "You could look and check this - that makes it a fact" }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "The rooster is the most impressive animal in the story.",
          tag: "Opinion",
          caption: "Someone else might disagree - that makes it an opinion",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Could two reasonable people disagree?", "Yes -> probably an opinion"],
          caption: "This is the quickest way to tell fact from opinion",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "best, worst, should, beautiful, boring",
          tag: "Opinion words",
          caption: "Words like these are usually signs of an opinion, not a fact",
        }}
      />,
    ];
  }

  if (conceptId === "1.8") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{ type: "quotedExcerpt", quote: "Break a leg!", tag: "Idiom = good luck", caption: "Doesn't mean an actual injury - it's said before a performance" }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "She let the cat out of the bag.",
          tag: "Idiom = revealed a secret",
          caption: "No real cat involved - it means she accidentally revealed a secret",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Makes no literal sense in context?", "-> probably an idiom"],
          caption: "That's a strong sign you've spotted an idiom, not a literal statement",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Guess the meaning from how it's used", "Then check if you were right"],
          caption: "This trains you to spot the pattern in new idioms",
        }}
      />,
    ];
  }

  if (conceptId === "1.9") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{ type: "quotedExcerpt", quote: "The kangaroo jumped.", tag: "Simple", caption: "One subject, one main verb, one complete idea" }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "The kangaroo jumped, but it missed the branch.",
          tag: "Compound",
          caption: "Two equal ideas joined by 'but' - both halves could stand alone",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "quotedExcerpt",
          quote: "Although it was tired, the kangaroo kept jumping.",
          tag: "Complex",
          caption: "A main idea joined to a dependent clause with 'although' - comma needed since it comes first",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Split at and/but/or", "Both halves make sense alone? -> compound", "One half fails? -> complex"],
          caption: "This test tells compound and complex sentences apart",
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
          quote: "A fable might rush through the beginning in a sentence but spend paragraphs on the problem.",
          tag: "Uneven pacing",
          caption: "Not every story spends equal time on each stage",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Sketch the six stages first", "Even just one phrase each"],
          caption: "This stops you rambling in the middle with no clear problem to solve",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Can you name the problem in one sentence?", "If not, you haven't found the turning point yet"],
          caption: "Use this check when retelling a story",
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
          quote: "The old house creaked and groaned in the wind, its broken windows staring out like empty eyes.",
          tag: "Scary mood",
          caption: "Creates a scary mood through word choice, not just by saying 'it was scary'",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "Sunlight dappled gently through the leaves.", tag: "Peaceful mood", caption: "The same forest walk described peacefully" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "quotedExcerpt",
          quote: "Shadows twisted between the trees, and every snap of a twig echoed.",
          tag: "Frightening mood",
          caption: "...or described frighteningly - purely through setting and word choice",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["'skinny' feels negative", "'slender' feels positive", "Same meaning, different mood"],
          caption: "Word connotations matter, not just their literal meaning",
        }}
      />,
    ];
  }

  if (conceptId === "1.12") {
    return [
      <NumberConceptScene
        key={0}
        spec={{ type: "placeValueChart", columns: ["Positive", "Comparative", "Superlative"], values: ["well", "better", "best"], caption: "Irregular adverb: 'well' becomes 'better'/'best'" }}
      />,
      <NumberConceptScene
        key={1}
        spec={{
          type: "placeValueChart",
          columns: ["Positive", "Comparative", "Superlative"],
          values: ["quickly", "more quickly", "most quickly"],
          caption: "Most -ly adverbs use 'more'/'most' in front rather than changing the word itself",
        }}
      />,
      <NumberConceptScene
        key={2}
        spec={{
          type: "placeValueChart",
          columns: ["Positive", "Comparative", "Superlative"],
          values: ["fast", "faster", "fastest"],
          caption: "Some short adverbs add -er/-est directly instead of using 'more'/'most'",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["well -> better -> best", "badly -> worse -> worst", "much -> more -> most", "little -> less -> least"],
          caption: "A handful of common adverbs are irregular and just have to be learned",
        }}
      />,
    ];
  }

  if (conceptId === "1.13") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "checklistCard",
          items: ["Adjectives/adverbs used well", "Makes sense", "Clear setting and mood", "Punctuation all correct"],
          caption: "The full checklist brings together everything you check before calling a piece finished",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "The travellers coat was soaked",
          tag: "Missing apostrophe",
          caption: "Should be 'traveller's' - a small error a full read-through would catch",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "quotedExcerpt",
          quote: "Where did you get that from he asked",
          tag: "Missing speech punctuation",
          caption: 'Should read: "Where did you get that from?" he asked.',
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Showing possession", "Showing a missing letter in a contraction"],
          caption: "Apostrophes have exactly two jobs - if it's doing neither, it probably doesn't belong there",
        }}
      />,
    ];
  }

  return undefined;
}
