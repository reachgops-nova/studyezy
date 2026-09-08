-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "textbookPageEnd" INTEGER,
ADD COLUMN     "textbookPageStart" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');
