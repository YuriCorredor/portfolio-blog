/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'default';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";
