// src/services/flightService.ts
import { PrismaClient } from "@prisma/client";
import {
  FlightRadar24LiveFlightFull,
  FlightRadar24AirportFull,
} from "../types/flightradar24";

const prisma = new PrismaClient();

// ... (fungsi upsertAirport dan upsertFlight tetap sama) ...
export const upsertAirport = async (airportData: {
  icao: string;
  iata?: string;
  name: string;
  city?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  timezone?: string;
}) => {
  try {
    const airport = await prisma.airport.upsert({
      where: { icao: airportData.icao },
      update: {
        iata: airportData.iata,
        name: airportData.name,
        city: airportData.city,
        countryCode: airportData.countryCode,
        latitude: airportData.latitude,
        longitude: airportData.longitude,
        elevation: airportData.elevation,
        timezone: airportData.timezone,
      },
      create: {
        icao: airportData.icao,
        iata: airportData.iata,
        name: airportData.name,
        city: airportData.city,
        countryCode: airportData.countryCode,
        latitude: airportData.latitude,
        longitude: airportData.longitude,
        elevation: airportData.elevation,
        timezone: airportData.timezone,
      },
    });
    return airport;
  } catch (error) {
    console.error(`Error upserting airport ${airportData.icao}:`, error);
    throw error;
  }
};

export const upsertFlight = async (flightData: FlightRadar24LiveFlightFull) => {
  try {
    // Pastikan origin dan destination airport sudah ada di DB
    let originAirportDbId: string | undefined;
    let destinationAirportDbId: string | undefined;

    if (flightData.orig_icao) {
      const originAirport = await prisma.airport.findUnique({
        where: { icao: flightData.orig_icao },
      });
      if (originAirport) {
        originAirportDbId = originAirport.id;
      } else {
        // Jika tidak ada di DB, coba ambil dari API FR24 dan simpan
        try {
          // Untuk menghindari circular dependency dengan flightradarService,
          // kita akan menambahkan logic sederhana untuk upsert airport jika tidak ada.
          // Jika ingin lebih robust, bisa dipisah ke module AirportService.
          const airportDetails = await prisma.airport.upsert({
            where: { icao: flightData.orig_icao },
            update: {
              name: flightData.orig_icao, // placeholder, bisa diupdate nanti
              iata: flightData.orig_iata,
            },
            create: {
              icao: flightData.orig_icao,
              iata: flightData.orig_iata,
              name: flightData.orig_icao, // Gunakan ICAO sebagai nama sementara
            },
          });
          originAirportDbId = airportDetails.id;
        } catch (e) {
          console.warn(
            `Could not upsert origin airport ${flightData.orig_icao}:`,
            e
          );
        }
      }
    }

    if (flightData.dest_icao) {
      const destAirport = await prisma.airport.findUnique({
        where: { icao: flightData.dest_icao },
      });
      if (destAirport) {
        destinationAirportDbId = destAirport.id;
      } else {
        // Jika tidak ada di DB, coba ambil dari API FR24 dan simpan
        try {
          const airportDetails = await prisma.airport.upsert({
            where: { icao: flightData.dest_icao },
            update: {
              name: flightData.dest_icao,
              iata: flightData.dest_iata,
            },
            create: {
              icao: flightData.dest_icao,
              iata: flightData.dest_iata,
              name: flightData.dest_icao,
            },
          });
          destinationAirportDbId = airportDetails.id;
        } catch (e) {
          console.warn(
            `Could not upsert destination airport ${flightData.dest_icao}:`,
            e
          );
        }
      }
    }

    const flight = await prisma.flight.upsert({
      where: { fr24Id: flightData.fr24_id },
      update: {
        flightNumber: flightData.flight,
        callsign: flightData.callsign,
        hex: flightData.hex,
        aircraftType: flightData.type,
        registration: flightData.reg,
        latitude: flightData.lat,
        longitude: flightData.lon,
        track: flightData.track,
        altitude: flightData.alt,
        groundSpeed: flightData.gspeed,
        verticalSpeed: flightData.vspeed,
        squawk: flightData.squawk,
        timestamp: new Date(flightData.timestamp),
        source: flightData.source,
        originIata: flightData.orig_iata,
        originIcao: flightData.orig_icao,
        originAirportId: originAirportDbId,
        destinationIata: flightData.dest_iata,
        destinationIcao: flightData.dest_icao,
        destinationAirportId: destinationAirportDbId,
        eta: flightData.eta ? new Date(flightData.eta) : null,
        // updatedAt akan otomatis diatur oleh @updatedAt
      },
      create: {
        fr24Id: flightData.fr24_id,
        flightNumber: flightData.flight,
        callsign: flightData.callsign,
        hex: flightData.hex,
        aircraftType: flightData.type,
        registration: flightData.reg,
        latitude: flightData.lat,
        longitude: flightData.lon,
        track: flightData.track,
        altitude: flightData.alt,
        groundSpeed: flightData.gspeed,
        verticalSpeed: flightData.vspeed,
        squawk: flightData.squawk,
        timestamp: new Date(flightData.timestamp),
        source: flightData.source,
        originIata: flightData.orig_iata,
        originIcao: flightData.orig_icao,
        originAirportId: originAirportDbId,
        destinationIata: flightData.dest_iata,
        destinationIcao: flightData.dest_icao,
        destinationAirportId: destinationAirportDbId,
        eta: flightData.eta ? new Date(flightData.eta) : null,
      },
    });
    return flight;
  } catch (error) {
    console.error(`Error upserting flight ${flightData.fr24_id}:`, error);
    throw error;
  }
};

/**
 * Mengambil data penerbangan dari database (yang terkait dengan bandara tertentu).
 * @param airportIcao Kode ICAO bandara.
 * @returns Promise<Flight[]> Array of flight objects.
 */
export const getFlightsByAirportFromDb = async (airportIcao: string) => {
  // Ambil penerbangan yang asal atau tujuannya bandara tertentu, dan belum kadaluwarsa (misal, 30 hari)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return prisma.flight.findMany({
    where: {
      OR: [{ originIcao: airportIcao }, { destinationIcao: airportIcao }],
      // Filter hanya data yang masih 'fresh' sesuai aturan penyimpanan FR24
      updatedAt: {
        gte: thirtyDaysAgo,
      },
    },
    include: {
      originAirport: true,
      destinationAirport: true,
    },
    orderBy: {
      timestamp: "desc", // Urutkan berdasarkan waktu terbaru
    },
  });
};
