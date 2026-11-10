import axios from "axios";


const baseURL = (import.meta as any).env?.VITE_STORE_API_URL || "http://localhost:8083/api";


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
