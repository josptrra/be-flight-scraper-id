/*
  Warnings:

  - You are about to drop the `flight` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `flight`;

-- CreateTable
CREATE TABLE `airports` (
    `uuid` VARCHAR(191) NOT NULL,
    `icao` VARCHAR(191) NOT NULL,
    `iata` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `countryCode` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `elevation` INTEGER NULL,
    `timezone` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `airports_icao_key`(`icao`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flights` (
    `uuid` VARCHAR(191) NOT NULL,
    `fr24_id` VARCHAR(191) NOT NULL,
    `flight_number` VARCHAR(191) NULL,
    `callsign` VARCHAR(191) NULL,
    `aircraft_hex` VARCHAR(191) NULL,
    `aircraft_type` VARCHAR(191) NULL,
    `registration` VARCHAR(191) NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `track` INTEGER NULL,
    `altitude` INTEGER NULL,
    `ground_speed` INTEGER NULL,
    `vertical_speed` INTEGER NULL,
    `squawk` INTEGER NULL,
    `last_updated_at` DATETIME(3) NOT NULL,
    `source` VARCHAR(191) NULL,
    `origin_iata` VARCHAR(191) NULL,
    `origin_icao` VARCHAR(191) NULL,
    `origin_airport_id` VARCHAR(191) NULL,
    `destination_iata` VARCHAR(191) NULL,
    `destination_icao` VARCHAR(191) NULL,
    `destination_airport_id` VARCHAR(191) NULL,
    `eta` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `flights_fr24_id_key`(`fr24_id`),
    INDEX `flights_origin_icao_idx`(`origin_icao`),
    INDEX `flights_destination_icao_idx`(`destination_icao`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `flights` ADD CONSTRAINT `flights_origin_airport_id_fkey` FOREIGN KEY (`origin_airport_id`) REFERENCES `airports`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flights` ADD CONSTRAINT `flights_destination_airport_id_fkey` FOREIGN KEY (`destination_airport_id`) REFERENCES `airports`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
