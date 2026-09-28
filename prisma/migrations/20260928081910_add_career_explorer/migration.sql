-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');

-- CreateTable
CREATE TABLE "CareerPath" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "dayInLife" TEXT,
    "keySkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relatedSubjectSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerInterest" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CareerPath_slug_key" ON "CareerPath"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CareerInterest_studentProfileId_careerPathId_key" ON "CareerInterest"("studentProfileId", "careerPathId");

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerInterest" ADD CONSTRAINT "CareerInterest_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerInterest" ADD CONSTRAINT "CareerInterest_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "CareerPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;
