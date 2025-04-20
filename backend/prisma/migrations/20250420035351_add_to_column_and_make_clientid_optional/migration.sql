/*
  Warnings:

  - Added the required column `to` to the `email` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `email` DROP FOREIGN KEY `email_client_id_fkey`;

-- DropIndex
DROP INDEX `email_client_id_fkey` ON `email`;

-- AlterTable
ALTER TABLE `email` ADD COLUMN `to` VARCHAR(191) NOT NULL,
    MODIFY `client_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `email` ADD CONSTRAINT `email_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `client`(`client_id`) ON DELETE SET NULL ON UPDATE CASCADE;
