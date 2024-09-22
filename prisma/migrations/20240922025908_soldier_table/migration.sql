/*
  Warnings:

  - You are about to drop the `Solider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Solider";

-- CreateTable
CREATE TABLE "Soldier" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Soldier_pkey" PRIMARY KEY ("id")
);
