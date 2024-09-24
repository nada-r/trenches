/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Power` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_powerId_fkey";

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "Power";

-- CreateTable
CREATE TABLE "Caller" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "power" INTEGER NOT NULL,

    CONSTRAINT "Caller_pkey" PRIMARY KEY ("id")
);
