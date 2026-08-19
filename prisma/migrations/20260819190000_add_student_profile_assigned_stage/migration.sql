-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "assignedStageId" TEXT;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_assignedStageId_fkey" FOREIGN KEY ("assignedStageId") REFERENCES "Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
