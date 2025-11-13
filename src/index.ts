// src/app.ts
import express from "express";
import cors from "cors";
import { config } from "./config"; // Pastikan config dimuat di awal
import flightRoutes from "./routes/flightRoutes";

const app = express();

// Middleware
app.use(express.json()); // Untuk parse JSON body
app.use(cors()); // Untuk mengizinkan permintaan dari frontend Anda

// Routes
app.use("/api", flightRoutes);

// Basic health check endpoint
app.get("/", (req, res) => {
  res.send("Flightradar24 Backend API is running!");
});

// Error handling middleware (opsional, untuk penanganan error global)
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
