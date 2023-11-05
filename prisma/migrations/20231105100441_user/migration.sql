/*
  Warnings:

  - You are about to drop the column `userId` on the `students` table. All the data in the column will be lost.
  - Added the required column `instructorId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructorId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "userId",
ADD COLUMN     "instructorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "instructorId" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
