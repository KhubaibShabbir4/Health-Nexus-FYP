-- CreateTable
CREATE TABLE "CaseStatus" (
    "id" SERIAL NOT NULL,
    "patientName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "CaseStatus_pkey" PRIMARY KEY ("id")
);
