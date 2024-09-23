-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "walletPubkey" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamenCallerPower" (
    "id" SERIAL NOT NULL,
    "callerId" INTEGER NOT NULL,
    "power" DOUBLE PRECISION NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamenCallerPower_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_walletPubkey_key" ON "Player"("walletPubkey");

-- CreateIndex
CREATE UNIQUE INDEX "TournamenCallerPower_callerId_tournamentId_key" ON "TournamenCallerPower"("callerId", "tournamentId");

-- AddForeignKey
ALTER TABLE "TournamenCallerPower" ADD CONSTRAINT "TournamenCallerPower_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES "Caller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamenCallerPower" ADD CONSTRAINT "TournamenCallerPower_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
