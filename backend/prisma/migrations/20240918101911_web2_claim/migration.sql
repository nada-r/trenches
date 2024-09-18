-- CreateTable
CREATE TABLE "Claim" (
    "id" SERIAL NOT NULL,
    "walletPubkey" TEXT NOT NULL,
    "portfolio" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Claim_walletPubkey_key" ON "Claim"("walletPubkey");
