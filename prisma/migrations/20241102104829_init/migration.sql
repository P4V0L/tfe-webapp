/*
  Warnings:

  - You are about to drop the `Nominee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trophy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Nominee" DROP CONSTRAINT "Nominee_trophyId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_nomineeId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_trophyId_fkey";

-- DropTable
DROP TABLE "Nominee";

-- DropTable
DROP TABLE "Trophy";

-- DropTable
DROP TABLE "Vote";
