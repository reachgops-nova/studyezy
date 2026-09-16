CREATE TABLE "TextbookSubmission" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "uploadedByUserId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "validationNote" TEXT,
    "detectedUnits" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    CONSTRAINT "TextbookSubmission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TextbookSubmission_storageKey_key" ON "TextbookSubmission"("storageKey");
CREATE INDEX "TextbookSubmission_subjectId_status_idx" ON "TextbookSubmission"("subjectId", "status");
CREATE INDEX "TextbookSubmission_uploadedByUserId_createdAt_idx" ON "TextbookSubmission"("uploadedByUserId", "createdAt");

CREATE TABLE "ReferenceUpload" (
    "id" TEXT NOT NULL,
    "unitId" TEXT,
    "uploadedByUserId" TEXT NOT NULL,
    "conceptId" TEXT,
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "referenceType" TEXT NOT NULL DEFAULT 'worksheet',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferenceUpload_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ReferenceUpload_storageKey_key" ON "ReferenceUpload"("storageKey");
CREATE INDEX "ReferenceUpload_unitId_status_idx" ON "ReferenceUpload"("unitId", "status");
CREATE INDEX "ReferenceUpload_uploadedByUserId_createdAt_idx" ON "ReferenceUpload"("uploadedByUserId", "createdAt");

ALTER TABLE "TextbookSubmission" ADD CONSTRAINT "TextbookSubmission_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TextbookSubmission" ADD CONSTRAINT "TextbookSubmission_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReferenceUpload" ADD CONSTRAINT "ReferenceUpload_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReferenceUpload" ADD CONSTRAINT "ReferenceUpload_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
