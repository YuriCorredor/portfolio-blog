/*
  Warnings:

  - You are about to drop the column `userRole` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userRole",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'default';
