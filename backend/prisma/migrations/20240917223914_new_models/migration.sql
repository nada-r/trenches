/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Card` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('HIDDEN', 'UPCOMING', 'STARTED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_ownerId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "ownerId";

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TournamentStatus" NOT NULL DEFAULT 'HIDDEN',
    "startedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentParticipation" (
    "id" SERIAL NOT NULL,
    "walletPubkey" TEXT NOT NULL,
    "callers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tournamentId" INTEGER NOT NULL,

    CONSTRAINT "TournamentParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caller" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "telegramId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" SERIAL NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "startPrice" DOUBLE PRECISION NOT NULL,
    "callTime" TIMESTAMP(3) NOT NULL,
    "highestPrice" DOUBLE PRECISION NOT NULL,
    "callerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "data" JSONB,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentParticipation_walletPubkey_tournamentId_key" ON "TournamentParticipation"("walletPubkey", "tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "Caller_telegramId_key" ON "Caller"("telegramId");

-- AddForeignKey
ALTER TABLE "TournamentParticipation" ADD CONSTRAINT "TournamentParticipation_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES "Caller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
