-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trophy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trophy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nominee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "trophyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nominee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trophyId" TEXT NOT NULL,
    "nomineeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_user_token_key" ON "VerificationToken"("user", "token");

-- CreateIndex
CREATE INDEX "Trophy_createdAt_idx" ON "Trophy"("createdAt");

-- CreateIndex
CREATE INDEX "Nominee_trophyId_idx" ON "Nominee"("trophyId");

-- CreateIndex
CREATE INDEX "Nominee_createdAt_idx" ON "Nominee"("createdAt");

-- CreateIndex
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");

-- CreateIndex
CREATE INDEX "Vote_trophyId_idx" ON "Vote"("trophyId");

-- CreateIndex
CREATE INDEX "Vote_nomineeId_idx" ON "Vote"("nomineeId");

-- CreateIndex
CREATE INDEX "Vote_createdAt_idx" ON "Vote"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_trophyId_key" ON "Vote"("userId", "trophyId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nominee" ADD CONSTRAINT "Nominee_trophyId_fkey" FOREIGN KEY ("trophyId") REFERENCES "Trophy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_trophyId_fkey" FOREIGN KEY ("trophyId") REFERENCES "Trophy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "Nominee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
