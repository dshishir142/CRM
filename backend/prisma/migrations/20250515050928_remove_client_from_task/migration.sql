/*
  Warnings:

  - You are about to drop the column `client_id` on the `task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `task_client_id_fkey`;

-- DropIndex
DROP INDEX `task_client_id_fkey` ON `task`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `client_id`;
