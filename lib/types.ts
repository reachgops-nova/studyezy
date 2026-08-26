export type ConceptStatus = "drafted" | "outline";

/** One multiple-choice vocabulary practice item (synonym, antonym, or idiom meaning) - see lib/vocabPractice.ts. */
export interface VocabItem {
  word: string;
  type: "synonym" | "antonym" | "idiom";
  question: string;
  options: string[];
  correctIndex: number;
}

export interface VoiceQASample {
  question: string;
  answer: string;
}

export interface StoryReference {
  title: string;
  synopsis: string;
}

export interface MarkScheme {
  full_marks: number;
  criteria: string[];
}

export interface ConceptMedia {
  /** Key into the built-in illustration set in components/illustrations.tsx - original artwork, not scanned from the book. */
  illustration_key?: string;
  /** A real uploaded textbook page photo (/uploads/{unitKey}/...) - takes priority over illustration_key when set, since it's the actual source page. */
  source_image_path?: string;
  /** Precise transcript of source_image_path's printed content, generated once via Claude vision when the image is linked - lets the AI tutor answer questions about what's specifically on the page, not just the hand-authored concept text. */
  source_image_transcript?: string;
  illustration_caption?: string;
  /** Real video needs a licensed/production content pipeline - not built yet, so the UI shows a clearly-labeled placeholder instead. */
  video_status: "not_planned" | "coming_soon";
  /** Extra visual analogies beyond the primary illustration - the AI tutor can insert one of these into the chat itself when a student asks to see a picture mid-conversation (see AvatarChat.tsx's illustration token). */
  alternate_illustrations?: { illustration_key: string; caption: string }[];
}

export interface Concept {
  concept_id: string;
  concept_name: string;
  status: ConceptStatus;
  difficulty?: "beginner" | "intermediate" | "advanced";
  book_pages?: number[];
  story_reference?: StoryReference;
  definition?: string;
  key_points?: string[];
  examples?: string[];
  voice_qa_samples?: VoiceQASample[];
  tips_to_remember?: string[];
  reasoning_interview_prompts?: string[];
  media?: ConceptMedia;
  /** True for concepts filled in by the page-extraction pipeline rather than hand-authored. */
  source?: "hand_authored" | "extracted";
}

export interface OutlineConcept {
  concept_id: string;
  concept_name: string;
  status: "outline";
  story_reference?: string;
}

export type TestQuestion =
  | {
      type: "multiple_choice";
      question: string;
      options: string[];
      correct_answer: number;
      concept_tested: string;
    }
  | {
      type: "short_answer";
      question: string;
      concept_tested: string;
      mark_scheme: MarkScheme;
    };

export interface ProgressionTestDraft {
  test_id: string;
  covers_concepts: string[];
  note?: string;
  questions: TestQuestion[];
}

/** A unit can have up to one stored paper per tier - see prisma QuestionPaper model. */
export type QuestionPaperDifficulty = "easy" | "moderate" | "tough";

export const QUESTION_PAPER_DIFFICULTIES: QuestionPaperDifficulty[] = ["easy", "moderate", "tough"];

export interface QuestionPaperSummary {
  difficulty: QuestionPaperDifficulty;
  available: boolean;
  questionCount: number;
}

export interface QuestionPaperContent {
  difficulty: QuestionPaperDifficulty;
  coversConcepts: string[];
  note: string | null;
  questions: TestQuestion[];
}

export interface UnitMasteryChecklist {
  source_note?: string;
  items: string[];
}

export interface CurriculumUnit {
  board: string;
  curriculum: string;
  grade_stage: number;
  subject: string;
  unit: number;
  unit_title: string;
  source_reference: {
    publisher: string;
    title: string;
    authors: string[];
    series_editors: string[];
    note: string;
  };
  unit_status: "in_progress" | "complete";
  concepts: Concept[];
  remaining_unit_outline: OutlineConcept[];
  // Nullable - only Unit 1 was seeded with one; not every unit has this yet
  // (real crash found live 2026-08-26 rolling out Unit 2: the type claimed
  // this was always present, UnitOverview.tsx read .items unguarded, and any
  // unit without one 500'd the whole learn page).
  unit_mastery_checklist: UnitMasteryChecklist | null;
}

// --- mastery / progress tracking ---

export type MasteryBand = "mastered" | "needs_brush_up" | "needs_reteach";

export interface ConceptMastery {
  concept_id: string;
  last_score_pct: number;
  band: MasteryBand;
  attempts: number;
  last_attempt_at: string; // ISO date
  next_review_due: string; // ISO date
}

export type ReasoningClassification =
  | "correct_reasoning"
  | "conceptual_gap"
  | "careless_slip"
  | "misread_question";

export interface ReasoningLogEntry {
  concept_id: string;
  question: string;
  student_answer: string;
  classification: ReasoningClassification;
  notes?: string;
  logged_at: string; // ISO date
}

export interface TestAttemptResult {
  test_id: string;
  taken_at: string; // ISO date
  score_pct: number;
  per_concept: Record<string, { correct: number; total: number }>;
}

/** Shape returned by POST /api/attempts - see app/api/attempts/route.ts. */
export interface StoredUnitResult {
  unitKey: string;
  scorePct: number;
  band: MasteryBand;
  nextReviewDate: string; // ISO date
  perConcept: Record<string, { correct: number; total: number }>;
  takenAt: string; // ISO date
}
