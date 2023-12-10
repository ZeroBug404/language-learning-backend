/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the `appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_appointmentId_fkey";

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "appointmentId";

-- DropTable
DROP TABLE "appointment";
