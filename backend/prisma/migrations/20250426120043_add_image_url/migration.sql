/*
  Warnings:

  - Added the required column `imageUrl` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "imageUrl" VARCHAR(255) NOT NULL;
