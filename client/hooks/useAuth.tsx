import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth";

// Definir el tipo de retorno para getAuthToken
interface AuthTokenResult {
    token: string;
    roles: string[];
    // Otros claims si los necesitas
}

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
    getAccessTokenSilently, // Esta función debe ser estable para useCallback
    getIdTokenClaims // 🛑 NUEVO: Necesario para obtener los claims del token
  } = useAuth0();

  const { setIsAuthReady } = useAuthStore();

  const isSyncedRef = useRef(false); 


  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  /**
   * Función estable para obtener y loguear el token, y DEVOLVER LOS ROLES.
   */
// 🛑 CAMBIAR EL TIPO DE RETORNO para devolver el token y los roles.
const getAuthToken = useCallback(async (): Promise<AuthTokenResult | undefined> => {
    if (!isAuthenticated) return undefined;

    try {
      // 1. Pedimos el token
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://nomos.inventory.api",
          scope: "openid profile email"
        }
      });

      // 2. OBTENER CLAIMS DEL ID TOKEN (donde están los roles)
      const claims = await getIdTokenClaims();
      const roleClaim = "https://nomosstore.com/roles"; 
      
      // 🛑 Extraer los roles. Si no existe, devuelve un array vacío.
      const roles: string[] = claims && claims[roleClaim] ? (claims[roleClaim] as string[]) : [];

      // ✅ LOGGING PARA INSPECCIÓN
      console.log("--- Token JWT de Auth0 Obtenido ---");
      console.log("Token Completo:", token);

      try {
          const payload = token.split('.')[1];
          // Decodificación simplificada (la que funciona)
          const base64 = payload.replace(/-/g, '+').replace(/_/g, '/'); 
          const decodedPayload = JSON.parse(atob(base64)); 
          
          console.log(`👤 Usuario: ${user?.name || user?.nickname || 'N/A'}`);
          console.log(`🆔 Sub (UserID): ${user?.sub}`);

          if (roles && roles.length > 0) {
              console.log(`✅ Roles (Claim '${roleClaim}'):`, roles); 
          } else {
              console.warn(`❌ Rol no encontrado o vacío.`);
          }
          console.log("Payload Decodificado (Claims):", decodedPayload);

      } catch(e) {
          console.error("Error al decodificar o analizar el payload del token:", e);
      }
      console.log("---------------------------------------");

      // 🛑 Devolvemos el token Y los roles.
      return { token, roles }; 
    } catch (error) {
      console.error("Error al obtener el token de Auth0:", error);
      return undefined;
    }
  }, [isAuthenticated, getAccessTokenSilently, user, getIdTokenClaims]); 
  
  
useEffect(() => {
        // 🛑 Eliminamos !isSyncedRef.current para que la sincronización se intente cada vez que 
        // los claims cambian, o si el componente se desmonta y remonta.
        if (isAuthenticated && user && !isLoading) {
            
            // Función para llamar al backend localmente
            const syncUserToBackend = async (roles: string[]) => { 
                
                const userData = {
                    auth0Id: user.sub, 
                    email: user.email, 
                    roles: roles 
                };

                try {
                    console.log("🚀 Sincronizando usuario a backend local...");
                    const response = await fetch('http://localhost:8080/api/auth/auth0-upsert', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData)
                    });

                    if (!response.ok) {
                        const errorBody = await response.text();
                        console.error('❌ Sync failed. Response:', response.status, errorBody);
                        throw new Error('Sincronización fallida al backend local.');
                    }
                    console.log('✅ Usuario sincronizado con éxito vía frontend.');
                    
                    // 🛑 Mantenemos isSyncedRef para evitar sincronización en cada re-render
                    isSyncedRef.current = true; 

                } catch (error) {
                    console.error('❌ Error al llamar al backend de sincronización:', error);
                    isSyncedRef.current = false; // Permite un nuevo intento
                }
            };
            
            // 🛑 1. Ejecutar getAuthToken y obtener el resultado.
            getAuthToken().then((result) => {
                if(result && result.roles) {
                    // 🛑 2. Llamar a syncUserToBackend con los roles obtenidos.
                    syncUserToBackend(result.roles);
                }
            });
        }
        
        // 🏆 NUEVA LÓGICA DE LIMPIEZA
        // Esto garantiza que si el usuario se desautentica, el flag se limpia
        if (!isAuthenticated && !isLoading) {
            isSyncedRef.current = false;
        }

    // Aseguramos que isSyncedRef se limpie al desautenticar, usando el cleanup
    }, [isAuthenticated, user, isLoading, getAuthToken]);


// ... (resto de los useEffects) ...

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