/*
  Warnings:

  - You are about to drop the column `bio` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "bio";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;
