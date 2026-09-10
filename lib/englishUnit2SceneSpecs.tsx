import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 2
// (Non-fiction: Biography) adds a new timeline variant to
// LiteracyConceptScene.tsx (a flat chronological sequence, distinct from
// narrativeMountain's tension arc) for concept 2.2's time-connective
// content; every other concept reuses quotedExcerpt/checklistCard as-is.
// Every value below is grounded in this unit's real, production content
// (fetched via railway ssh), never invented.
export function getEnglishUnit2ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "2.1") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote:
            "Poorna Malavath was born on 10 June 2000 in a village in Telangana, India. Her family was very poor... but she grew up to climb to the peak of Mount Everest on 25 May 2014 aged 13 years and 11 months.",
          tag: "Biography opening",
          caption: "Starts with who the person is and why they're famous, then moves through their life in chronological order",
        }}
      />,
      <LiteracyConceptScene
        key={1}
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
      <LiteracyConceptScene
        key={2}
        spec={{ type: "quotedExcerpt", quote: "he, she, they, him, her", tag: "Third person", caption: "Biographies are written about someone else, from the author's viewpoint - never 'I' or 'me'" }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Exact dates", "Real places", "Factual achievements"],
          caption: "A biography is a true, non-fiction record - not an invented story",
        }}
      />,
    ];
  }

  if (conceptId === "2.2") {
    return [
      <LiteracyConceptScene
        key={0}
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
        key={1}
        spec={{ type: "checklistCard", items: ["first", "now", "soon", "afterwards", "eventually", "finally"], caption: "Adverbs of time tell us WHEN something happened" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["in the end", "throughout her childhood", "later on"],
          caption: "Adverbial phrases of time tell us how long or in what period",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Throughout her childhood, she trained every morning.",
          tag: "Comma after time phrase",
          caption: "When starting a sentence with an adverbial phrase of time, add a comma after it",
        }}
      />,
    ];
  }

  if (conceptId === "2.3") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "I would be grateful if you could provide further information.",
          tag: "Formal",
          caption: "Fuller vocabulary, complete sentences, no contractions - used for official writing",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "Can you tell me more about it?",
          tag: "Informal",
          caption: "The same message, casually phrased - used for messages to friends",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{ type: "checklistCard", items: ["Contractions (don't, it's)?", "Slang?", "-> informal"], caption: "Their presence is the biggest giveaway that a piece is informal" }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Who is going to read this?", "How well do I know them?"],
          caption: "Ask this before writing to decide what register to use",
        }}
      />,
    ];
  }

  if (conceptId === "2.4") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{ type: "quotedExcerpt", quote: "Andre had the strength to hit the ball and beat his opponent.", tag: "Original", caption: "Plain, functional wording" }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "Andre had the power to blast the ball and annihilate his adversary.",
          tag: "With synonyms",
          caption: "Swapping in synonyms makes the same sentence more vivid and dramatic",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["win -> triumph", "win -> succeed", "win -> come out on top"],
          caption: "A thesaurus lists several synonyms depending on how dramatic the sentence should sound",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Circle any word used 3+ times on a page", "That's your shortlist for synonym replacement"],
          caption: "A quick way to spot where your writing needs more variety",
        }}
      />,
    ];
  }

  if (conceptId === "2.5") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "She became a sensation overnight.",
          tag: "Opinion (fact-sounding)",
          caption: "'Sensation' is a judgement, not something you can measure exactly",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "She performed at 17 national concerts in one year.",
          tag: "Fact",
          caption: "This can be checked against a real record",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["prodigy", "sensation", "the greatest"],
          caption: "Words like these are opinion signals, even when written in a confident, fact-sounding way",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Is that provable?", "Can you check a record, date, or count?"],
          caption: "Turn the sentence into a question to test whether it's really a fact or a disguised opinion",
        }}
      />,
    ];
  }

  if (conceptId === "2.6") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{ type: "quotedExcerpt", quote: "patient + im- -> impatient", tag: "Prefix", caption: "Before roots beginning with 'm' or 'p', use 'im-'" }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "regular + ir- -> irregular", tag: "Prefix", caption: "Before roots beginning with 'r', use 'ir-'" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["il- before l (illegal)", "im- before m/p (impossible, immature)", "ir- before r (irresponsible)"],
          caption: "Negative prefixes change depending on the first letter of the root word",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["swim -> swimming (double the letter)", "prefer -> preferred (stressed, double)", "enter -> entered (unstressed, no double)"],
          caption: "Suffix doubling rules for verbs ending in a vowel + consonant",
        }}
      />,
    ];
  }

  return undefined;
}
