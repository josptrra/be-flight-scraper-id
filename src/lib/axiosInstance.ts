// src/lib/axiosInstance.ts
import axios from "axios";
import { config } from "../config";

const fr24Api = axios.create({
  baseURL: config.flightradarApiBaseUrl,
  headers: {
    "Accept-Version": "v1",
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.flightradarApiKey}`,
  },
});

fr24Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error(
        "Flightradar24 API Error:",
        error.response?.status,
        error.response?.data
      );
      if (error.response?.status === 401) {
        console.error("Authentication failed. Check your FLIGHTRADAR_API_KEY.");
      }
    } else {
      console.error("An unexpected network error occurred:", error);
    }
    return Promise.reject(error);
  }
);

export default fr24Api;
