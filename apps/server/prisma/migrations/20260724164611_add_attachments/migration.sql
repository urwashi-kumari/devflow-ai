/*
  Warnings:

  - Added the required column `mimeType` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploaderId` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Made the column `fileSize` on table `Attachment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "uploaderId" TEXT NOT NULL,
ALTER COLUMN "fileSize" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
