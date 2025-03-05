-- CreateTable
CREATE TABLE "patients_signup" (
    "patient_id" SERIAL NOT NULL,
    "patient_name" TEXT NOT NULL,
    "patient_email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "time_slot" TEXT NOT NULL,
    "appointment_date" TEXT NOT NULL,

    CONSTRAINT "patients_signup_pkey" PRIMARY KEY ("patient_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_signup_patient_email_key" ON "patients_signup"("patient_email");
