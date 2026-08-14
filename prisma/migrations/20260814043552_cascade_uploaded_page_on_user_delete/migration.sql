-- DropForeignKey
ALTER TABLE "UploadedPage" DROP CONSTRAINT "UploadedPage_uploadedByUserId_fkey";

-- AddForeignKey
ALTER TABLE "UploadedPage" ADD CONSTRAINT "UploadedPage_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
