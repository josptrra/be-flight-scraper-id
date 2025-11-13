// src/services/flightradarService.ts
import fr24Api from "../lib/axiosInstance";
import {
  FlightRadar24LiveFlightsResponse,
  FlightRadar24AirportFull,
  FlightRadar24AirportLight,
} from "../types/flightradar24";
// import { config } from '../config'; // Tidak perlu lagi mengimpor config di sini jika airportCode diberikan sebagai argumen

/**
 * Mengambil data penerbangan live (full detail) untuk bandara tertentu.
 * Termasuk penerbangan inbound dan outbound.
 * @param airportIcao Kode ICAO bandara (misal: 'WADD' untuk Ngurah Rai, 'WIII' untuk Soekarno-Hatta).
 * @returns Promise<FlightRadar24LiveFlightsResponse['data']> Array of live flight objects.
 */
export const getLiveFlightsByAirport = async (
  airportIcao: string
): Promise<FlightRadar24LiveFlightsResponse["data"]> => {
  try {
    const response = await fr24Api.get<FlightRadar24LiveFlightsResponse>(
      "/live/flight-positions/full",
      {
        params: {
          airports: `both:${airportIcao}`, // Mendapatkan penerbangan inbound dan outbound untuk bandara tertentu
          limit: 3000, // Batasan jumlah hasil, sesuaikan jika perlu
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(
      `Error in getLiveFlightsByAirport for ${airportIcao}:`,
      error
    );
    throw error; // Re-throw untuk ditangani di layer controller
  }
};

/**
 * Mengambil informasi detail bandara.
 * @param code IATA atau ICAO code bandara.
 * @returns Promise<FlightRadar24AirportFull> Airport full details.
 */
export const getAirportDetails = async (
  code: string
): Promise<FlightRadar24AirportFull> => {
  try {
    const response = await fr24Api.get<FlightRadar24AirportFull>(
      `/static/airports/${code}/full`
    );
    return response.data;
  } catch (error) {
    console.error(`Error in getAirportDetails for ${code}:`, error);
    throw error;
  }
};

/**
 * Mengambil informasi dasar bandara.
 * @param code IATA atau ICAO code bandara.
 * @returns Promise<FlightRadar24AirportLight> Airport light details.
 */
export const getAirportLightDetails = async (
  code: string
): Promise<FlightRadar24AirportLight> => {
  try {
    const response = await fr24Api.get<FlightRadar24AirportLight>(
      `/static/airports/${code}/light`
    );
    return response.data;
  } catch (error) {
    console.error(`Error in getAirportLightDetails for ${code}:`, error);
    throw error;
  }
};
