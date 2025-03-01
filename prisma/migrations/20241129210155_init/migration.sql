-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "caseId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "requestedAmount" DOUBLE PRECISION NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "actions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseId_key" ON "Case"("caseId");
