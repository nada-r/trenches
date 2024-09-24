-- CreateTable
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_powerId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "powerId";

DROP TABLE "User";

DROP TABLE "Power";

DROP TABLE "Card";

DROP TABLE "Test";