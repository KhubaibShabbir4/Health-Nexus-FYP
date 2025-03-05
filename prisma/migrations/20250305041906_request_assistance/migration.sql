-- CreateEnum
CREATE TYPE "AssistanceType" AS ENUM ('FINANCIAL_AID', 'MEDICATION', 'CONSULTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "PreferredNGO" AS ENUM ('AL_KHIDMAT', 'EDHI_FOUNDATION', 'SHAUKAT_KHANUM', 'SAYLANI_WELFARE');

-- CreateTable
CREATE TABLE "AssistanceRequest" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "medicalCondition" TEXT NOT NULL,
    "assistanceType" "AssistanceType" NOT NULL,
    "preferredNgo" "PreferredNGO" NOT NULL,
    "medicalReport" TEXT,
    "additionalMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssistanceRequest_cnic_key" ON "AssistanceRequest"("cnic");
