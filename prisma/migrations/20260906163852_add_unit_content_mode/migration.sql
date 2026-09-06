-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "contentMode" TEXT NOT NULL DEFAULT 'curriculum';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');
