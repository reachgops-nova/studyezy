import type { VocabItem } from "./types";

// Always-available fallback set (no AI call needed) - same "never dead-end"
// philosophy as lib/localAnswers.ts. Mixes general Grade 5 vocabulary with a
// few words that actually appear in this unit's fables (e.g. "furious",
// "enormous"), so it's useful even before Groq is configured or if a call
// fails. Regenerated fresh from Groq when available (see
// generateVocabPracticeGroq in lib/groq.ts) - this is just the floor, not
// the primary content source.
export const FALLBACK_VOCAB_ITEMS: VocabItem[] = [
  {
    word: "enormous",
    type: "synonym",
    question: "Which word means the SAME as 'enormous'?",
    options: ["tiny", "huge", "quiet", "narrow"],
    correctIndex: 1,
  },
  {
    word: "furious",
    type: "synonym",
    question: "Which word means the SAME as 'furious'?",
    options: ["sleepy", "curious", "extremely angry", "confused"],
    correctIndex: 2,
  },
  {
    word: "generous",
    type: "antonym",
    question: "Which word means the OPPOSITE of 'generous'?",
    options: ["selfish", "kind", "wealthy", "cheerful"],
    correctIndex: 0,
  },
  {
    word: "ancient",
    type: "antonym",
    question: "Which word means the OPPOSITE of 'ancient'?",
    options: ["old", "modern", "historic", "faded"],
    correctIndex: 1,
  },
  {
    word: "brave",
    type: "synonym",
    question: "Which word means the SAME as 'brave'?",
    options: ["fearful", "courageous", "careless", "gentle"],
    correctIndex: 1,
  },
  {
    word: "silent",
    type: "antonym",
    question: "Which word means the OPPOSITE of 'silent'?",
    options: ["quiet", "calm", "noisy", "still"],
    correctIndex: 2,
  },
  {
    word: "delighted",
    type: "synonym",
    question: "Which word means the SAME as 'delighted'?",
    options: ["thrilled", "annoyed", "worried", "tired"],
    correctIndex: 0,
  },
  {
    word: "abandon",
    type: "antonym",
    question: "Which word means the OPPOSITE of 'abandon'?",
    options: ["leave", "keep", "discard", "escape"],
    correctIndex: 1,
  },
  {
    word: "raining cats and dogs",
    type: "idiom",
    question: "What does 'it's raining cats and dogs' mean?",
    options: ["It's raining pets", "It's raining very heavily", "Animals are falling", "It's a calm drizzle"],
    correctIndex: 1,
  },
  {
    word: "break the ice",
    type: "idiom",
    question: "What does 'to break the ice' mean?",
    options: [
      "To end an awkward silence and start a conversation",
      "To literally crack ice",
      "To cancel a plan",
      "To make someone angry",
    ],
    correctIndex: 0,
  },
  {
    word: "piece of cake",
    type: "idiom",
    question: "If something is 'a piece of cake', it means it is...",
    options: ["Delicious", "Very easy", "Made of dessert", "Difficult"],
    correctIndex: 1,
  },
];

/** A small random-without-repeat sample - used whenever Groq isn't available or fails. */
export function pickFallbackVocab(count = 3): VocabItem[] {
  const shuffled = [...FALLBACK_VOCAB_ITEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
