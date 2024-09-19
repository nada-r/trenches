/*
  Warnings:

  - You are about to drop the column `highestFDV` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the column `startFDV` on the `Call` table. All the data in the column will be lost.
  - Made the column `data` on table `Call` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Call" DROP COLUMN "highestFDV",
DROP COLUMN "startFDV",
ALTER COLUMN "data" SET NOT NULL;
