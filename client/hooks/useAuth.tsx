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
          // La función atob() no maneja caracteres especiales de URL, 
          // es mejor usar un enfoque que maneje la codificación base64url.
          // Para simpleza, reemplazamos caracteres comunes de URL antes de decodificar:
          const base64 = payload.replace(/-/g, '+').replace(/_/g, '/'); 
          
          const decodedPayload = JSON.parse(atob(base64)); 
          
          // 🛑 CAMBIO CLAVE AQUÍ: Usa el claim exacto que pusiste en la Action.
          const roleClaim = "https://nomosstore.com/roles"; 
          const roles = decodedPayload[roleClaim];

          console.log(`👤 Usuario: ${user?.name || user?.nickname || 'N/A'}`);
          console.log(`🆔 Sub (UserID): ${user?.sub}`);

          if (roles && roles.length > 0) {
              // Ahora debería mostrar el rol correctamente
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
  }, [isAuthenticated, getAccessTokenSilently, user]); 



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
