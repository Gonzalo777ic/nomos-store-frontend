import axios from "axios";
// NO necesitamos importar useAuthStore ni lógica de localStorage

const baseURL = (import.meta as any).env?.VITE_API_URL || "/api";

// 1. Exportamos la función de configuración para ser llamada en un componente o wrapper
export const createHttpInstance = (getAuthToken: () => Promise<string | undefined>) => {
  const httpInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // 2. Interceptor de Solicitud: Inyecta el token de Auth0 ANTES de cada solicitud
  httpInstance.interceptors.request.use(async (config) => {
    // LLamamos a la función getAuthToken que viene del hook useAuth()
    const token = await getAuthToken();

    if (token) {
      // Aseguramos que el token se inyecte correctamente
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return httpInstance;
};

// 3. Exportamos una instancia sin token (solo para llamadas no autenticadas, ej. productos)
export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});
