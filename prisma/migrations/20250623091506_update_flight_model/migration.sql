/*
  Warnings:

  - You are about to drop the column `aircraft` on the `flight` table. All the data in the column will be lost.
  - You are about to drop the column `flightCode` on the `flight` table. All the data in the column will be lost.
  - You are about to drop the column `icao` on the `flight` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `flight` table. All the data in the column will be lost.
  - You are about to drop the column `lon` on the `flight` table. All the data in the column will be lost.
  - You are about to drop the column `speed` on the `flight` table. All the data in the column will be lost.
  - Added the required column `airportIcao` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direction` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `flight` DROP COLUMN `aircraft`,
    DROP COLUMN `flightCode`,
    DROP COLUMN `icao`,
    DROP COLUMN `lat`,
    DROP COLUMN `lon`,
    DROP COLUMN `speed`,
    ADD COLUMN `airportIcao` VARCHAR(191) NOT NULL,
    ADD COLUMN `callsign` VARCHAR(191) NULL,
    ADD COLUMN `direction` VARCHAR(191) NOT NULL,
    ADD COLUMN `groundSpeed` INTEGER NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `source` VARCHAR(191) NULL,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `verticalSpeed` INTEGER NULL;
