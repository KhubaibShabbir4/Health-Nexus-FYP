/*
  Warnings:

  - You are about to drop the column `caseId` on the `GigDetails` table. All the data in the column will be lost.
  - You are about to drop the column `gigAmount` on the `GigDetails` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `GigDetails` table. All the data in the column will be lost.
  - Added the required column `availability` to the `GigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryPreference` to the `GigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicationId` to the `GigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicationName` to the `GigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pharmacistId` to the `GigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prescriptionId` to the `GigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `GigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `GigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `GigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ngold` to the `nGOImpact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GigDetails" DROP COLUMN "caseId",
DROP COLUMN "gigAmount",
DROP COLUMN "patientName",
ADD COLUMN     "availability" TEXT NOT NULL,
ADD COLUMN     "deliveryPreference" TEXT NOT NULL,
ADD COLUMN     "medicationId" TEXT NOT NULL,
ADD COLUMN     "medicationName" TEXT NOT NULL,
ADD COLUMN     "pharmacistId" INTEGER NOT NULL,
ADD COLUMN     "prescriptionId" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "nGOImpact" ADD COLUMN     "ngold" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "ngoId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NGOMonthlyDonation" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ngoId" INTEGER NOT NULL,

    CONSTRAINT "NGOMonthlyDonation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NGOMonthlyPatient" (
    "id" SERIAL NOT NULL,
    "patientCount" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ngoId" INTEGER NOT NULL,

    CONSTRAINT "NGOMonthlyPatient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rating_ngoId_idx" ON "Rating"("ngoId");

-- CreateIndex
CREATE INDEX "Rating_patientId_idx" ON "Rating"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_patientId_ngoId_key" ON "Rating"("patientId", "ngoId");

-- CreateIndex
CREATE INDEX "NGOMonthlyDonation_month_idx" ON "NGOMonthlyDonation"("month");

-- CreateIndex
CREATE INDEX "NGOMonthlyDonation_ngoId_idx" ON "NGOMonthlyDonation"("ngoId");

-- CreateIndex
CREATE UNIQUE INDEX "NGOMonthlyDonation_ngoId_month_key" ON "NGOMonthlyDonation"("ngoId", "month");

-- CreateIndex
CREATE INDEX "NGOMonthlyPatient_month_idx" ON "NGOMonthlyPatient"("month");

-- CreateIndex
CREATE INDEX "NGOMonthlyPatient_ngoId_idx" ON "NGOMonthlyPatient"("ngoId");

-- CreateIndex
CREATE UNIQUE INDEX "NGOMonthlyPatient_ngoId_month_key" ON "NGOMonthlyPatient"("ngoId", "month");

-- CreateIndex
CREATE INDEX "nGOImpact_ngold_idx" ON "nGOImpact"("ngold");

-- AddForeignKey
ALTER TABLE "GigDetails" ADD CONSTRAINT "GigDetails_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientLogin"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NGOMonthlyDonation" ADD CONSTRAINT "NGOMonthlyDonation_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NGOMonthlyPatient" ADD CONSTRAINT "NGOMonthlyPatient_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nGOImpact" ADD CONSTRAINT "nGOImpact_ngold_fkey" FOREIGN KEY ("ngold") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
