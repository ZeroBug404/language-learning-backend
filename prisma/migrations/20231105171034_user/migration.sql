/*
  Warnings:

  - You are about to drop the column `firstName` on the `instructor` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `instructor` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `instructor` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `contactNo` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profileImg` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `instructor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_studentId_fkey";

-- AlterTable
ALTER TABLE "instructor" DROP COLUMN "firstName",
DROP COLUMN "gender",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "address",
DROP COLUMN "contactNo",
DROP COLUMN "name",
DROP COLUMN "profileImg",
ALTER COLUMN "instructorId" DROP NOT NULL,
ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
