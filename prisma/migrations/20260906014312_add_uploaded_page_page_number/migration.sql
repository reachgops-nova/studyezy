-- AlterTable
ALTER TABLE "UploadedPage" ADD COLUMN     "pageNumber" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');
