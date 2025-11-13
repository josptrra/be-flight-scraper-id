// src/config/index.ts
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000, // Gunakan 5000 sesuai .env Anda
  flightradarApiKey: process.env.FLIGHTRADAR_API_KEY,
  flightradarApiBaseUrl: "https://fr24api.flightradar24.com/api",
  // ngurahRaiIcao: 'WADD', // Ini bisa dihapus jika ingin lebih generik, atau biarkan sebagai contoh
  // ngurahRaiIata: 'DPS',  // Ini bisa dihapus jika ingin lebih generik, atau biarkan sebagai contoh
};

if (!config.flightradarApiKey) {
  console.warn("WARNING: FLIGHTRADAR_API_KEY is not set in .env file.");
  //throw new Error('FLIGHTRADAR_API_KEY is required.');
}
