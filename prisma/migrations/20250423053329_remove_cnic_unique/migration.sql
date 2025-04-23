/*
  Warnings:

  - You are about to drop the column `preferredNgo` on the `AssistanceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `profile_photo` on the `PatientLogin` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AssistanceRequest_cnic_key";

-- AlterTable
ALTER TABLE "AssistanceRequest" DROP COLUMN "preferredNgo";

-- AlterTable
ALTER TABLE "PatientLogin" DROP COLUMN "profile_photo";

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "appointment_id" INTEGER;

-- CreateTable
CREATE TABLE "manageAccount" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manageAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nGOImpact" (
    "id" SERIAL NOT NULL,
    "patientsHelped" INTEGER NOT NULL,
    "fundsDistributed" INTEGER NOT NULL,
    "pendingRequests" INTEGER NOT NULL,
    "avgApprovalTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nGOImpact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manageAccount_email_key" ON "manageAccount"("email");
