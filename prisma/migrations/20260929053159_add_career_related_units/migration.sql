-- AlterTable
ALTER TABLE "CareerPath" ADD COLUMN     "relatedUnitIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');
