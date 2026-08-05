export type ConceptStatus = "drafted" | "outline";

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
  illustration_caption?: string;
  /** Real video needs a licensed/production content pipeline - not built yet, so the UI shows a clearly-labeled placeholder instead. */
  video_status: "not_planned" | "coming_soon";
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
  /** Paths under /public to the family's own scanned textbook pages for this unit, if provided. */
  page_images?: string[];
  concepts: Concept[];
  remaining_unit_outline: OutlineConcept[];
  unit_mastery_checklist: UnitMasteryChecklist;
  progression_test_draft: ProgressionTestDraft;
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

export interface DemoProfile {
  id: string;
  display_name: string;
  avatar_emoji: string;
}
