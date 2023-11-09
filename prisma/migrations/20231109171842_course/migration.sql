/*
  Warnings:

  - Added the required column `price` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `level` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('beginner', 'intermidiate', 'advanced');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "price" TEXT NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "CourseLevel" NOT NULL;
