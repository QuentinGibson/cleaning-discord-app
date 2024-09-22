/*
  Warnings:

  - Added the required column `username` to the `Soldier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Soldier" ADD COLUMN     "username" VARCHAR(255) NOT NULL;
