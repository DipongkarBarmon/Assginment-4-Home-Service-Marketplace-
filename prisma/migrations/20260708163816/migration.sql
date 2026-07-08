/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[availabilityId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availabilityId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bookings_bookingDate_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "bookingDate",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "availabilityId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_availabilityId_key" ON "bookings"("availabilityId");

-- CreateIndex
CREATE INDEX "bookings_availabilityId_idx" ON "bookings"("availabilityId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "availabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
