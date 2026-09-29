-- AlterTable
ALTER TABLE "CareerPath" ADD COLUMN     "gradeGuidance" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');
