// src/types/flightradar24.d.ts

// Definisi tipe untuk objek flight tunggal dari Live flight positions full
export interface FlightRadar24LiveFlightFull {
  fr24_id: string;
  flight: string; // Flight number, e.g., "AF1463"
  callsign: string; // Callsign, e.g., "AFR1463"
  lat: number; // Latitude
  lon: number; // Longitude
  track: number; // Heading/track
  alt: number; // Altitude in feet
  gspeed: number; // Ground speed in knots
  vspeed: number; // Vertical speed
  squawk: number; // Squawk code
  timestamp: string; // UTC timestamp, e.g., "2023-11-08T10:10:00Z"
  source: string; // Data source, e.g., "ADSB"
  hex: string; // ICAO 24-bit address of the aircraft
  type: string; // Aircraft ICAO type code, e.g., "A321"
  reg: string; // Aircraft registration
  painted_as?: string; // Airline ICAO code if painted as
  operating_as?: string; // Airline ICAO code if operating as
  orig_iata?: string; // Origin airport IATA code
  orig_icao?: string; // Origin airport ICAO code
  dest_iata?: string; // Destination airport IATA code
  dest_icao?: string; // Destination airport ICAO code
  eta?: string; // Estimated Time of Arrival
}

// Definisi tipe untuk respons Live flight positions full
export interface FlightRadar24LiveFlightsResponse {
  data: FlightRadar24LiveFlightFull[];
}

// Tambahkan definisi tipe untuk endpoint lain jika diperlukan
export interface FlightRadar24AirportFull {
  name: string;
  iata: string;
  icao: string;
  lon: number;
  lat: number;
  elevation: number;
  country: {
    code: string;
    name: string;
  };
  city: string;
  state: string | null;
  timezone: {
    name: string;
    offset: number;
  };
  runways: any[]; // Sesuaikan lebih detail jika diperlukan
}

export interface FlightRadar24AirportLight {
  name: string;
  iata: string;
  icao: string;
}
