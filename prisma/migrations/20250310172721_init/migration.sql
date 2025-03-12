/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `AssistanceRequest` table. All the data in the column will be lost.
  - You are about to drop the `ManageAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cnic]` on the table `AssistanceRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `AssistanceRequest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `assistanceType` on the `AssistanceRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `preferredNgo` on the `AssistanceRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `FundsTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssistanceType" AS ENUM ('FINANCIAL_AID', 'MEDICATION', 'CONSULTATION');

-- CreateEnum
CREATE TYPE "PreferredNGO" AS ENUM ('AL_KHIDMAT', 'EDHI_FOUNDATION', 'SHAUKAT_KHANUM', 'SAYLANI_WELFARE');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "appointmentId" TEXT NOT NULL,
ADD COLUMN     "doctor_id" INTEGER,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AssistanceRequest" DROP COLUMN "updatedAt",
ADD COLUMN     "Reason" TEXT,
ADD COLUMN     "Status" TEXT DEFAULT 'pending',
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "medicalReport" DROP NOT NULL,
DROP COLUMN "assistanceType",
ADD COLUMN     "assistanceType" "AssistanceType" NOT NULL,
DROP COLUMN "preferredNgo",
ADD COLUMN     "preferredNgo" "PreferredNGO" NOT NULL;

-- AlterTable
ALTER TABLE "FundsTransfer" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ManageAccount";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "loan" (
    "id" SERIAL NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "amountRemaining" DOUBLE PRECISION NOT NULL,
    "Ngo" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "Medicines" TEXT NOT NULL,
    "Tests" TEXT NOT NULL,
    "Operations" TEXT NOT NULL,
    "ExtraInstructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'doctor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NGO" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ngo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NGO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pharmacy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "services" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'pharmacy',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pharmacy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "NGO_email_key" ON "NGO"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NGO_registrationNumber_key" ON "NGO"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_email_key" ON "Pharmacy"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_licenseNumber_key" ON "Pharmacy"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AssistanceRequest_cnic_key" ON "AssistanceRequest"("cnic");
