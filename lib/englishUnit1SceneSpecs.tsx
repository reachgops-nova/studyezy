import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge" - first English
// scene layer, built for Unit 1 (Fiction: Stories from different
// cultures). Every value below is grounded in this unit's real,
// production content (fetched via railway ssh), never invented.
//
// Two real bugs found live 2026-09-10, both from the same root cause -
// AvatarChat.tsx's buildCheckpoints() pairs checkpointSceneNodes[i] to a
// FIXED checkpoint index ([0] definition, [1] examples, [2] key_points,
// [3] tips_to_remember[0] - each spoken/rendered verbatim as its own chat
// bubble, only if that field exists on the concept):
//   1. "voice is not reading this as a point to be noted" - a scene's
//      visual didn't match what was actually being spoken at that index
//      (fixed by aligning content to the right index).
//   2. "repeated sentence to narrate it separately instead of using the
//      image text itself" - even once aligned, a quotedExcerpt card showing
//      the SAME sentence AvatarChat already renders as a full chat bubble
//      is pure duplication, not a genuine visual - a card only earns its
//      place when it's a real FORMAT change (checklistCard turns a
//      paragraph into scannable checkmarks; narrativeMountain/timeline are
//      real diagrams), never just prose re-boxed as a "quote."
// So: index 0 (definition) and index 3 (tip) are almost always undefined
// below - plain text prose with no format transformation available -
// index 1 (examples) only gets a scene where the example is itself a real
// diagram, and index 2 (key_points) always gets a checklistCard, the one
// universal case where restructuring genuinely helps.
export function getEnglishUnit1ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "1.1") {
    return [
      undefined,
      undefined,
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
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{ type: "checklistCard", items: ["Actions", "Facial expressions", "Speech"], caption: "Implicit meaning is shown through these three kinds of clues, not stated directly" }}
      />,
    ];
  }

  if (conceptId === "1.3") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Needs no reading between the lines", "Writers use it when they want certainty", "A passage often mixes explicit and implicit"],
          caption: "How explicit meaning works",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "1.4") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["A good prediction is based on evidence", "Predictions don't have to come true", "Titles, illustrations, and behaviour are all clues"],
          caption: "How to make a good prediction",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "1.5") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["The same event feels different from each character", "Changing perspective can build sympathy", "Writers show it through whose feelings we're told"],
          caption: "How perspective works",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "1.6") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Capital letters", "End punctuation", "Spacing", "Spelling", "Grammar", "Does it make sense?"],
          caption: "A good proofreading checklist",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "1.7") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["You can check a fact, not an opinion", "'best', 'worst', 'should' signal opinion", "A passage can mix both"],
          caption: "How to tell fact from opinion",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "1.8") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Can't be worked out word-by-word", "Often describe feelings, warnings, advice", "Idioms are cultural, so can confuse"],
          caption: "How idioms work",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "1.9") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Simple = one subject, one verb, one idea", "Compound joins with and/but/or", "Complex uses a connective + comma rule"],
          caption: "The three sentence types",
        }}
      />,
      undefined,
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
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["The problem is the most tense moment", "Not every stage gets equal time", "Knowing the structure helps reading and writing"],
          caption: "How story structure works",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "1.11") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Setting and word choice create mood", "Word connotations matter, not just meaning", "Mood and theme work together but differ"],
          caption: "How mood is built",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "1.12") {
    return [
      undefined,
      // Real example content ("Positive: 'played well.' Comparative: 'played
      // better.' Superlative: 'played the best.'") is itself already
      // structured as three labeled forms - a table is a genuine format
      // change from prose, not a re-quote, so this one earns its place.
      <LiteracyConceptScene key={1} spec={{ type: "checklistCard", items: ["well (positive)", "better (comparative)", "best (superlative)"], caption: "Zach played well. Masie played better. Ronan played the best." }} />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Most -ly adverbs use more/most", "Short adverbs add -er/-est", "A few are irregular (well/badly/much/little)"],
          caption: "How comparative and superlative adverbs form",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "1.13") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["This combines earlier skills into one final pass", "Content checks and punctuation checks differ", "Apostrophes and speech marks get their own check"],
          caption: "How the full checklist is organised",
        }}
      />,
      undefined,
    ];
  }

  return undefined;
}
