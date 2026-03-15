-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "stake" DOUBLE PRECISION NOT NULL,
    "focusScore" DOUBLE PRECISION,
    "success" BOOLEAN,
    "reward" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settledAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
