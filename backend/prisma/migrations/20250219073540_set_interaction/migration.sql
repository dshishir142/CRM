/*
  Warnings:

  - Added the required column `interaction_date` to the `interaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interaction_type` to the `interaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `interaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `interaction` ADD COLUMN `interaction_date` DATETIME(3) NOT NULL,
    ADD COLUMN `interaction_type` ENUM('CALL', 'EMAIL', 'MEETING', 'CHAT', 'OTHER') NOT NULL,
    ADD COLUMN `next_followup_date` DATETIME(3) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `summary` VARCHAR(191) NOT NULL;
