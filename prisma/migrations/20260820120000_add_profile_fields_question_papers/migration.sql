-- AlterTable: parent/account-level contact + location (optional, never sent to AI)
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "state" TEXT;
ALTER TABLE "User" ADD COLUMN "district" TEXT;

-- AlterTable: per-kid declared context (optional, admin-visible "intelligence" fields)
ALTER TABLE "StudentProfile" ADD COLUMN "schoolName" TEXT;
ALTER TABLE "StudentProfile" ADD COLUMN "preferredCurriculumLabel" TEXT;
ALTER TABLE "StudentProfile" ADD COLUMN "enrolledSubjectSlugs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- CreateTable: QuestionPaper (replaces the single-blob Unit.progressionTestDraft)
CREATE TABLE "QuestionPaper" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "coversConcepts" TEXT[],
    "note" TEXT,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionPaper_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "QuestionPaper_unitId_difficulty_key" ON "QuestionPaper"("unitId", "difficulty");

ALTER TABLE "QuestionPaper" ADD CONSTRAINT "QuestionPaper_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data migration: preserve any existing hand-authored/generated test paper as
-- the "moderate" tier before the old column is dropped - one source of
-- truth, nothing lost. Only migrates units that actually have real questions
-- (empty placeholder drafts from unit creation are skipped, not migrated as
-- empty QuestionPaper rows).
INSERT INTO "QuestionPaper" ("id", "unitId", "difficulty", "coversConcepts", "note", "questions", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  "id",
  'moderate',
  COALESCE(
    (SELECT array_agg(value) FROM jsonb_array_elements_text("progressionTestDraft"->'covers_concepts')),
    ARRAY[]::TEXT[]
  ),
  "progressionTestDraft"->>'note',
  COALESCE("progressionTestDraft"->'questions', '[]'::jsonb),
  now(),
  now()
FROM "Unit"
WHERE "progressionTestDraft" IS NOT NULL
  AND jsonb_typeof("progressionTestDraft"->'questions') = 'array'
  AND jsonb_array_length("progressionTestDraft"->'questions') > 0;

-- AlterTable: drop the now-superseded single-blob column
ALTER TABLE "Unit" DROP COLUMN "progressionTestDraft";

-- AlterTable: tag which difficulty tier each attempt was taken against
ALTER TABLE "TestAttempt" ADD COLUMN "difficulty" TEXT NOT NULL DEFAULT 'moderate';
