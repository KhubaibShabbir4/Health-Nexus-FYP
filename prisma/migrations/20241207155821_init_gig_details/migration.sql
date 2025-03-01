-- CreateTable
CREATE TABLE "GigDetails" (
    "id" SERIAL NOT NULL,
    "gigAmount" INTEGER NOT NULL,
    "caseId" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GigDetails_pkey" PRIMARY KEY ("id")
);
