import axios from "axios";

const baseURL = (import.meta as any).env?.VITE_API_URL || "/api";

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  try {
    // Avoid circular imports by reading from localStorage where zustand persists
    const persisted = localStorage.getItem("nomos-auth");
    if (persisted) {
      const state = JSON.parse(persisted).state as { token?: string };
      if (state?.token) {
        config.headers = config.headers || {};
        (config.headers as any)["Authorization"] = `Bearer ${state.token}`;
      }
    }
  } catch {}
  return config;
});

export default http;
