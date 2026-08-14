-- CreateTable
CREATE TABLE "ReasoningLog" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "studentAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReasoningLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReasoningLog_studentProfileId_createdAt_idx" ON "ReasoningLog"("studentProfileId", "createdAt");

-- AddForeignKey
ALTER TABLE "ReasoningLog" ADD CONSTRAINT "ReasoningLog_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReasoningLog" ADD CONSTRAINT "ReasoningLog_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;
