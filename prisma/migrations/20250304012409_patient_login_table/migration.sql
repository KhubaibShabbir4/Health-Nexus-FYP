/*
  Warnings:

  - You are about to drop the `PatientSignup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PatientSignup";

-- CreateTable
CREATE TABLE "PatientLogin" (
    "patient_id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "cnic" TEXT,
    "cnic_expiry" TIMESTAMP(3),
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "country" TEXT,
    "medical_condition" TEXT NOT NULL,
    "current_medications" TEXT,
    "allergies" TEXT,
    "prescription_file" TEXT,
    "health_reports" TEXT,
    "financial_support" TEXT NOT NULL,
    "monthly_income" TEXT,
    "occupation" TEXT,
    "dependents" INTEGER,
    "financial_proof" TEXT,
    "emergency_contact_name" TEXT NOT NULL,
    "emergency_contact_relation" TEXT NOT NULL,
    "emergency_contact_phone" TEXT NOT NULL,
    "preferred_ngo" TEXT,
    "preferred_city" TEXT,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientLogin_pkey" PRIMARY KEY ("patient_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientLogin_email_key" ON "PatientLogin"("email");
