-- CreateTable
CREATE TABLE "Solider" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solider_pkey" PRIMARY KEY ("id")
);
