-- AlterTable
ALTER TABLE "Concept" ADD COLUMN     "generatedIllustrationUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');
