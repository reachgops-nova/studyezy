import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 4
// (Non-fiction: Information and explanation texts) reuses
// LiteracyConceptScene's existing quotedExcerpt/checklistCard variants as
// -is, no new scene shape needed. Every value below is grounded in this
// unit's real, production content (fetched via railway ssh), never
// invented.
export function getEnglishUnit4ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "4.1") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "checklistCard",
          items: ["Title and introduction", "Sub-headings and sections", "Paragraphs", "Facts, diagrams, bullet points", "Topic-specific technical vocabulary"],
          caption: "Information texts share these features with other non-fiction",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "lava, magma, ash cloud",
          tag: "Technical vocabulary",
          caption: "An information text about volcanoes uses technical vocabulary like this, organized under sub-headings like 'How volcanoes form'",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Can be read in any order", "Not telling a story in sequence", "Also called a non-chronological report"],
          caption: "A reader can jump straight to the section they need instead of reading start to finish",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Skim first for a general impression", "Then scan for specific facts you need"],
          caption: "Two different reading speeds for two different jobs",
        }}
      />,
    ];
  }

  if (conceptId === "4.2") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "checklistCard",
          items: ["Information: non-chronological, read in any order", "Explanation: chronological, describes a process"],
          caption: "The key difference between the two text types",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "Icebergs form when...then...eventually...",
          tag: "Explanation text",
          caption: "Chronologically describes the process using sequencing words",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["first", "next", "afterwards", "eventually"],
          caption: "Explanation texts rely heavily on adverbs and adverbial phrases of time like these",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Does it describe a PROCESS over time?", "Or does it just present facts?"],
          caption: "Ask this to work out which type of text you're reading",
        }}
      />,
    ];
  }

  if (conceptId === "4.3") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "checklistCard",
          items: ["who -> a name or noun", "where -> a place", "when -> a time"],
          caption: "Different question words point you toward different kinds of answers",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "in warm shallow seas and oceans",
          tag: "Scanned answer",
          caption: "For 'Where do coral reefs grow?', scan for a place name like this",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["what / how / why", "need a whole explanation section, not a quick scan"],
          caption: "These question words are harder to scan for",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Skimming: general impression of a whole text", "Scanning: hunts for one specific piece of information"],
          caption: "Scanning is different from skimming",
        }}
      />,
    ];
  }

  if (conceptId === "4.4") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "photosynthesis, biodiversity",
          tag: "Formal (unexplained)",
          caption: "A formal information text uses precise technical vocabulary without explaining it, for readers who already know the topic",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "how plants make food",
          tag: "Informal (explained simply)",
          caption: "An informal version explains the same idea in simpler, everyday language",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["-ology / -ogy = 'the study of'", "biology = the study of living things", "geology = the study of the Earth"],
          caption: "This suffix pattern often signals a field of study",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Unexplained technical terms? -> formal, expert audience", "Simple explained language? -> informal, general audience"],
          caption: "Check who the text seems to be written for",
        }}
      />,
    ];
  }

  return undefined;
}
