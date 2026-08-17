-- CreateTable
CREATE TABLE "UnitResource" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "uploadedByUserId" TEXT NOT NULL,
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnitResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UnitResource_unitId_resourceType_status_idx" ON "UnitResource"("unitId", "resourceType", "status");

-- AddForeignKey
ALTER TABLE "UnitResource" ADD CONSTRAINT "UnitResource_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitResource" ADD CONSTRAINT "UnitResource_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitResource" ADD CONSTRAINT "UnitResource_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
