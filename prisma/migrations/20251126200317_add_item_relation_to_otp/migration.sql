/*
  Warnings:

  - Added the required column `itemId` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otp` ADD COLUMN `itemId` INTEGER NOT NULL,
    ADD COLUMN `used` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Otp` ADD CONSTRAINT `Otp_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
