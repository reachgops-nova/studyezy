-- Low-stakes ContentPack worksheet practice, deliberately separate from
-- TestAttempt/ConceptMastery - unlocks the formal test and informs
-- cross-unit adaptive difficulty, but never itself affects mastery data.
CREATE TABLE "WorksheetAttempt" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "contentPackId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "totalCount" INTEGER NOT NULL,
    "scorePct" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorksheetAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WorksheetAttempt_studentProfileId_unitId_idx" ON "WorksheetAttempt"("studentProfileId", "unitId");

ALTER TABLE "WorksheetAttempt" ADD CONSTRAINT "WorksheetAttempt_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorksheetAttempt" ADD CONSTRAINT "WorksheetAttempt_contentPackId_fkey" FOREIGN KEY ("contentPackId") REFERENCES "ContentPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorksheetAttempt" ADD CONSTRAINT "WorksheetAttempt_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
