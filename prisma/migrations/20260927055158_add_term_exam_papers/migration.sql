-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');

-- CreateTable
CREATE TABLE "TermExamPaper" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "paperNumber" INTEGER NOT NULL,
    "unitIds" TEXT[],
    "totalMarks" INTEGER NOT NULL,
    "durationMinutes" INTEGER,
    "sections" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermExamPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermExamAnswerKey" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermExamAnswerKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermExamAccessRequest" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "studentProfileId" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "respondedByUserId" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TermExamAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TermExamPaper_subjectId_status_idx" ON "TermExamPaper"("subjectId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TermExamAnswerKey_paperId_key" ON "TermExamAnswerKey"("paperId");

-- CreateIndex
CREATE INDEX "TermExamAccessRequest_paperId_status_idx" ON "TermExamAccessRequest"("paperId", "status");

-- CreateIndex
CREATE INDEX "TermExamAccessRequest_requestedByUserId_idx" ON "TermExamAccessRequest"("requestedByUserId");

-- AddForeignKey
ALTER TABLE "TermExamPaper" ADD CONSTRAINT "TermExamPaper_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermExamPaper" ADD CONSTRAINT "TermExamPaper_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermExamAnswerKey" ADD CONSTRAINT "TermExamAnswerKey_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "TermExamPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermExamAccessRequest" ADD CONSTRAINT "TermExamAccessRequest_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "TermExamPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermExamAccessRequest" ADD CONSTRAINT "TermExamAccessRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermExamAccessRequest" ADD CONSTRAINT "TermExamAccessRequest_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermExamAccessRequest" ADD CONSTRAINT "TermExamAccessRequest_respondedByUserId_fkey" FOREIGN KEY ("respondedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
