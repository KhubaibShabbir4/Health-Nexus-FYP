-- CreateTable
CREATE TABLE "patients" (
    "patient_id" SERIAL NOT NULL,
    "patient_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "time_slot" TEXT NOT NULL,
    "appointment_date" TEXT NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "PendingAppointment" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "patient_name" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "appointment_date" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "PendingAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" SERIAL NOT NULL,
    "satisfaction" INTEGER NOT NULL,
    "diagnosis" INTEGER NOT NULL,
    "staffBehaviour" INTEGER NOT NULL,
    "environment" INTEGER NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingAppointment_appointment_id_key" ON "PendingAppointment"("appointment_id");

-- AddForeignKey
ALTER TABLE "PendingAppointment" ADD CONSTRAINT "PendingAppointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
