/*
  Warnings:

  - Added the required column `serviceId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "reviews_serviceId_idx" ON "reviews"("serviceId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
