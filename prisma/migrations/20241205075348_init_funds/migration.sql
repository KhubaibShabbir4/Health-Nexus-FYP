/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Funds` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Funds` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Status` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Status` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Funds" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Status" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
