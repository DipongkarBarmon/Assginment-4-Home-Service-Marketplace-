-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_availabilityId_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "availabilityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "availabilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
