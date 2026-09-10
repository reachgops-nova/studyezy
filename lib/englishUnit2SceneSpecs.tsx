import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 2
// (Non-fiction: Biography). Every value below is grounded in this unit's
// real, production content (fetched via railway ssh), never invented.
//
// Follows the same two fixes as Unit 1's spec file (see its header
// comment for the full explanation): scenes align to AvatarChat's fixed
// checkpoint index ([0] definition, [1] examples, [2] key_points, [3]
// tip), and a scene only appears where it's a genuine FORMAT change
// (checklistCard, a real diagram) rather than prose re-boxed as a quote -
// duplicating a sentence AvatarChat already renders as its own chat
// bubble adds nothing.
export function getEnglishUnit2ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "2.1") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: [
            "Written in the third person (he, she, they)",
            "Opens with who they are and why they're famous",
            "Events told in chronological order",
            "Exact dates, places, and achievements",
            "Quotes from the person or people who knew them",
          ],
          caption: "The five features every biography shares",
        }}
      />,
    ];
  }

  if (conceptId === "2.2") {
    return [
      undefined,
      // The real example ("First, Bolt won locally. Afterwards, injuries.
      // Eventually, fastest on Earth.") IS a chronological sequence, so a
      // timeline diagram is a genuine format change, not a re-quote.
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "timeline",
          points: [
            { label: "First", note: "won locally" },
            { label: "Afterwards", note: "injuries, recovered" },
            { label: "Eventually", note: "fastest on Earth" },
          ],
          caption: "Usain Bolt's Career told in chronological order using time connectives",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Adverbs of time (first, now, eventually)", "Adverbial phrases (in the end, later on)", "Comma after a time phrase that opens a sentence"],
          caption: "How chronological order is signalled in writing",
        }}
      />,
    ];
  }

  if (conceptId === "2.3") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Formal avoids contractions and slang", "Informal uses casual, everyday phrasing", "The right register depends on audience and purpose"],
          caption: "Formal vs. informal register",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "2.4") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["A thesaurus lists synonyms for any word type", "Repeating a word makes writing feel flat", "Not every synonym fits every context"],
          caption: "How to use synonyms well",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "2.5") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["'prodigy', 'sensation' are opinion signals", "Biographies mix real facts and admiring opinions", "Turn a sentence into a question to test it"],
          caption: "Spotting opinions in biographies",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "2.6") {
    return [
      undefined,
      // The real examples are short structured word-equations
      // ("patient + im- -> impatient"), not prose - a checklist of them is
      // a genuine format change (list of formulas vs. a spoken paragraph).
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "checklistCard",
          items: ["patient + im- -> impatient", "regular + ir- -> irregular", "hope + -ful + -ness -> hopefulness"],
          caption: "Prefixes and suffixes changing a root word",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["il- before l, im- before m/p, ir- before r", "Double the final letter (1-syllable verbs)", "Only double if the final syllable is stressed"],
          caption: "The prefix and suffix rules",
        }}
      />,
    ];
  }

  return undefined;
}
