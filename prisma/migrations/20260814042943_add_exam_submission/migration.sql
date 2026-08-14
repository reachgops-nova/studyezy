-- AlterTable
ALTER TABLE "UploadedPage" ADD COLUMN     "examSubmissionId" TEXT,
ADD COLUMN     "purpose" TEXT NOT NULL DEFAULT 'textbook_source';

-- CreateTable
CREATE TABLE "ExamSubmission" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "timeSpentMinutes" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "techniqueNotes" TEXT[],
    "overallNote" TEXT,
    "marksNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UploadedPage" ADD CONSTRAINT "UploadedPage_examSubmissionId_fkey" FOREIGN KEY ("examSubmissionId") REFERENCES "ExamSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubmission" ADD CONSTRAINT "ExamSubmission_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubmission" ADD CONSTRAINT "ExamSubmission_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
