/*
  Warnings:

  - You are about to drop the column `role` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'default';

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "role";
