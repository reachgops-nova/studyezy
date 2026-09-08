-- AlterTable
ALTER TABLE "Concept" ADD COLUMN     "generatedWidget" JSONB;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');
