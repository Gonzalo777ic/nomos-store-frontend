import axios from "axios";
import { requireViteEnv } from "@/api/env";

const baseURL = requireViteEnv("VITE_STORE_API_URL");

export const createHttpInstance = (getAuthToken: () => Promise<string | undefined>) => {
  const httpInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  httpInstance.interceptors.request.use(async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return httpInstance;
};

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});
