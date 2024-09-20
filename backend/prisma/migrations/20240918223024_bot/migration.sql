/*
  Warnings:

  - You are about to drop the column `callTime` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the column `highestPrice` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the column `startPrice` on the `Call` table. All the data in the column will be lost.
  - Added the required column `highestFDV` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startFDV` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Call" DROP COLUMN "callTime",
DROP COLUMN "highestPrice",
DROP COLUMN "startPrice",
ADD COLUMN     "highestFDV" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startFDV" DOUBLE PRECISION NOT NULL;
