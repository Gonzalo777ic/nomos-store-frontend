import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect } from "react";
import { useAuthStore } from "../store/auth";

/**
 * Hook personalizado que envuelve useAuth0 para proveer funciones esenciales
 * como el estado de autenticación y la obtención del token para el backend.
 */
export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    isLoading,
    logout: auth0Logout,
    getAccessTokenSilently // Esta función debe ser estable para useCallback
  } = useAuth0();

  const { setIsAuthReady } = useAuthStore();

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  /**
   * Función estable para obtener y loguear el token.
   */
  const getAuthToken = useCallback(async (): Promise<string | undefined> => {
    if (!isAuthenticated) return undefined;

    try {
      // Pedimos el token
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://nomos.inventory.api",
          scope: "openid profile email"
        }
      });

      // ✅ LOGGING PARA INSPECCIÓN
      console.log("--- Token JWT de Auth0 Obtenido ---");
      console.log("Token Completo:", token);

      try {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));

          const roleClaim = "https://nomos.inventory.api/roles";
          const roles = decodedPayload[roleClaim];

          console.log(`👤 Usuario: ${user?.name || user?.nickname || 'N/A'}`);
          console.log(`🆔 Sub (UserID): ${user?.sub}`);

          if (roles && roles.length > 0) {
              console.log(`✅ Roles (Claim '${roleClaim}'):`, roles);
          } else {
              console.warn(`❌ Rol no encontrado. Verifica tu Auth0 Action.`);
          }
          console.log("Payload Decodificado (Claims):", decodedPayload);

      } catch(e) {
          console.error("Error al decodificar o analizar el payload del token:", e);
      }
      console.log("---------------------------------------");

      return token;
    } catch (error) {
      console.error("Error al obtener el token de Auth0:", error);
      return undefined;
    }
  }, [isAuthenticated, getAccessTokenSilently, user]); // Dependencias correctas


  // 1. Inicialización de Auth Ready (para evitar renderizados intermedios)
  useEffect(() => {
    if (!isLoading) {
      setIsAuthReady(true);
    }
  }, [isLoading, setIsAuthReady]);

  // 2. Ejecución forzada de getAuthToken para logging inmediato y refresh
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Llama a la función estable getAuthToken
      getAuthToken();
    }
  }, [isAuthenticated, isLoading, getAuthToken]);

  return {
    isAuthenticated,
    user,
    isLoading,
    logout,
    getAuthToken,
  };
};
