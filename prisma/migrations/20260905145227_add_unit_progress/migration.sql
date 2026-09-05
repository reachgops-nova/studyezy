-- AlterTable
ALTER TABLE "User" ALTER COLUMN "trialEndsAt" SET DEFAULT (now() + interval '30 days');

-- CreateTable
CREATE TABLE "UnitProgress" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "taughtUpToConceptKey" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnitProgress_studentProfileId_unitId_key" ON "UnitProgress"("studentProfileId", "unitId");

-- AddForeignKey
ALTER TABLE "UnitProgress" ADD CONSTRAINT "UnitProgress_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitProgress" ADD CONSTRAINT "UnitProgress_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
