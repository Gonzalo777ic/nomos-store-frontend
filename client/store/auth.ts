import { create } from "zustand";
// Ya no usamos `persist` ni dependemos de `loginApi` o `registerApi`.
// El estado de autenticación (token, user) es manejado por Auth0.

// Definición de tipos simplificada para el estado de "listo".
interface AuthState {
  // isAuthReady indica si el SDK de Auth0 ha terminado de cargar el estado inicial.
  isAuthReady: boolean;
  setIsAuthReady: (ready: boolean) => void;
}

// Creamos un store simple para manejar el estado de carga inicial
// (útil para ProtectedRoute o LoadingScreen).
export const useAuthStore = create<AuthState>()(
    (set) => ({
      isAuthReady: false,
      setIsAuthReady: (ready) => set({ isAuthReady: ready }),
    })
);

// Nota: Eliminamos `persist` porque el estado de Auth0 no debe guardarse en Zustand.
