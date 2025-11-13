-- CreateTable
CREATE TABLE `Flight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `icao` VARCHAR(191) NOT NULL,
    `flightId` VARCHAR(191) NOT NULL,
    `flightCode` VARCHAR(191) NULL,
    `aircraft` VARCHAR(191) NULL,
    `altitude` INTEGER NULL,
    `lat` DOUBLE NULL,
    `lon` DOUBLE NULL,
    `heading` INTEGER NULL,
    `speed` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Flight_flightId_key`(`flightId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
