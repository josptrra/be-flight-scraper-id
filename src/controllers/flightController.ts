// src/controllers/flightController.ts
import { Request, Response, RequestHandler } from "express";
// Ganti getLiveFlightsForNgurahRai menjadi getLiveFlightsByAirport
import {
  getLiveFlightsByAirport as getLiveFlightsByAirportService,
  getAirportDetails,
} from "../services/flightRadarService";
// Ganti getNgurahRaiFlightsFromDb menjadi getFlightsByAirportFromDb
import {
  upsertFlight,
  getFlightsByAirportFromDb,
  upsertAirport,
} from "../services/flightService";
// import { config } from '../config'; // Tidak perlu config di sini lagi

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Endpoint untuk fetch dan menyimpan live flights untuk bandara tertentu.
 * Ini adalah endpoint yang harus dipicu oleh cron job atau scheduler.
 * @param req.params.airportCode Kode ICAO atau IATA bandara.
 */
export const fetchAndStoreLiveFlightsByAirport: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { airportCode } = req.params; // Ambil airportCode dari URL parameter

  if (!airportCode) {
    res.status(400).json({ message: "Airport code is required." });
    return;
  }

  try {
    const flightsData = await getLiveFlightsByAirportService(
      airportCode.toUpperCase()
    ); // Pastikan uppercase untuk konsistensi
    let storedFlights = [];

    // Ambil detail bandara target jika belum ada di DB
    const targetAirport = await prisma.airport.findUnique({
      where: { icao: airportCode.toUpperCase() },
    });
    if (!targetAirport) {
      try {
        const airportDetails = await getAirportDetails(
          airportCode.toUpperCase()
        );
        if (airportDetails) {
          await upsertAirport({
            icao: airportDetails.icao,
            iata: airportDetails.iata,
            name: airportDetails.name,
            city: airportDetails.city,
            countryCode: airportDetails.country?.code,
            latitude: airportDetails.lat,
            longitude: airportDetails.lon,
            elevation: airportDetails.elevation,
            timezone: airportDetails.timezone?.name,
          });
          console.log(
            `Successfully stored Airport details for ${airportCode}.`
          );
        }
      } catch (airportError) {
        console.warn(
          `Could not fetch/store Airport details for ${airportCode}:`,
          airportError
        );
      }
    }

    if (flightsData && flightsData.length > 0) {
      for (const flight of flightsData) {
        try {
          const savedFlight = await upsertFlight(flight);
          storedFlights.push(savedFlight);
        } catch (dbError) {
          console.error(
            `Failed to save/update flight ${flight.fr24_id}:`,
            dbError
          );
        }
      }
      console.log(
        `Successfully processed ${storedFlights.length} live flights for ${airportCode}.`
      );
      res.status(200).json({
        message: `Live flights for ${airportCode} fetched and stored successfully.`,
        count: storedFlights.length,
      });
    } else {
      res.status(200).json({
        message: `No live flights found for ${airportCode} at this time.`,
        count: 0,
      });
    }
  } catch (error: any) {
    console.error(
      `Error in fetchAndStoreLiveFlightsByAirport controller for ${airportCode}:`,
      error
    );
    res.status(500).json({
      message: `Failed to fetch and store live flights for ${airportCode}.`,
      error: error.message,
    });
  }
};

/**
 * Endpoint untuk mendapatkan live flights untuk bandara tertentu dari database.
 * Ini adalah endpoint yang akan dipanggil oleh frontend.
 * @param req.params.airportCode Kode ICAO atau IATA bandara.
 */
export const getLiveFlightsByAirport: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { airportCode } = req.params; // Ambil airportCode dari URL parameter

  if (!airportCode) {
    res.status(400).json({ message: "Airport code is required." });
    return;
  }

  try {
    const flights = await getFlightsByAirportFromDb(airportCode.toUpperCase()); // Pastikan uppercase
    res.status(200).json({
      message: `Live flights for ${airportCode} retrieved from DB.`,
      count: flights.length,
      data: flights,
    });
  } catch (error: any) {
    console.error(
      `Error in getLiveFlightsByAirport controller for ${airportCode}:`,
      error
    );
    res.status(500).json({
      message: `Failed to retrieve flights for ${airportCode} from database.`,
      error: error.message,
    });
  }
};
