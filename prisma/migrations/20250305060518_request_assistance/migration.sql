/*
  Warnings:

  - Added the required column `updatedAt` to the `AssistanceRequest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `assistanceType` on the `AssistanceRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `preferredNgo` on the `AssistanceRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `medicalReport` on table `AssistanceRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "AssistanceRequest_cnic_key";

-- AlterTable
ALTER TABLE "AssistanceRequest" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "assistanceType",
ADD COLUMN     "assistanceType" TEXT NOT NULL,
DROP COLUMN "preferredNgo",
ADD COLUMN     "preferredNgo" TEXT NOT NULL,
ALTER COLUMN "medicalReport" SET NOT NULL;

-- DropEnum
DROP TYPE "AssistanceType";

-- DropEnum
DROP TYPE "PreferredNGO";

-- CreateTable
CREATE TABLE "AidRequest" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "requestStatus" TEXT NOT NULL,
    "ngoName" TEXT,
    "response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AidRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "dosageTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);
