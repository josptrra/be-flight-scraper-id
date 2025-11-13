// src/routes/flightRoutes.ts
import { Router, RequestHandler } from "express";
// Ganti nama fungsi yang diimpor
import {
  fetchAndStoreLiveFlightsByAirport,
  getLiveFlightsByAirport,
} from "../controllers/flightController";

const router = Router();

// Route untuk memicu pengambilan data dari FR24 API dan menyimpannya ke DB
// PENTING: Endpoint ini tidak boleh diekspos langsung ke frontend
// Ini lebih cocok dipanggil oleh cron job internal atau sebagai endpoint admin.
// Gunakan :airportCode sebagai placeholder untuk kode bandara (misal: WADD, WIII)
router.post(
  "/flights/:airportCode/fetch-and-store",
  fetchAndStoreLiveFlightsByAirport
);

// Route untuk mengambil data penerbangan bandara tertentu dari DB (untuk frontend)
router.get("/flights/:airportCode", getLiveFlightsByAirport);

export default router;
