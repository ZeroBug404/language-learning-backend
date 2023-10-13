/*
  Warnings:

  - You are about to drop the column `studentId` on the `instructor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "instructor" DROP CONSTRAINT "instructor_studentId_fkey";

-- AlterTable
ALTER TABLE "instructor" DROP COLUMN "studentId";
