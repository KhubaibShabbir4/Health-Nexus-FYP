-- CreateTable
CREATE TABLE "FundsTransfer" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundsTransfer_pkey" PRIMARY KEY ("id")
);
