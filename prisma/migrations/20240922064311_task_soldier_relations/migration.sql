/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Soldier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "TaskSoldier" (
    "taskId" INTEGER NOT NULL,
    "soldierId" INTEGER NOT NULL,

    CONSTRAINT "TaskSoldier_pkey" PRIMARY KEY ("taskId","soldierId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Soldier_userId_key" ON "Soldier"("userId");

-- AddForeignKey
ALTER TABLE "TaskSoldier" ADD CONSTRAINT "TaskSoldier_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSoldier" ADD CONSTRAINT "TaskSoldier_soldierId_fkey" FOREIGN KEY ("soldierId") REFERENCES "Soldier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
