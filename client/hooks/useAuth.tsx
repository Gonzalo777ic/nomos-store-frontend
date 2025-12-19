import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth";


interface AuthTokenResult {
    token: string;
    roles: string[];

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
    getAccessTokenSilently,
    getIdTokenClaims
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

const getAuthToken = useCallback(async (): Promise<AuthTokenResult | undefined> => {
    if (!isAuthenticated) return undefined;

    try {

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://nomos.inventory.api",
          scope: "openid profile email"
        }
      });


      const claims = await getIdTokenClaims();
      const roleClaim = "https://nomosstore.com/roles"; 
      

      const roles: string[] = claims && claims[roleClaim] ? (claims[roleClaim] as string[]) : [];


      console.log("--- Token JWT de Auth0 Obtenido ---");
      console.log("Token Completo:", token);

      try {
          const payload = token.split('.')[1];

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


      return { token, roles }; 
    } catch (error) {
      console.error("Error al obtener el token de Auth0:", error);
      return undefined;
    }
  }, [isAuthenticated, getAccessTokenSilently, user, getIdTokenClaims]); 
  
  
useEffect(() => {


        if (isAuthenticated && user && !isLoading) {
            

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
                    

                    isSyncedRef.current = true; 

                } catch (error) {
                    console.error('❌ Error al llamar al backend de sincronización:', error);
                    isSyncedRef.current = false;
                }
            };
            

            getAuthToken().then((result) => {
                if(result && result.roles) {

                    syncUserToBackend(result.roles);
                }
            });
        }
        


        if (!isAuthenticated && !isLoading) {
            isSyncedRef.current = false;
        }


    }, [isAuthenticated, user, isLoading, getAuthToken]);





  useEffect(() => {
    if (!isLoading) {
      setIsAuthReady(true);
    }
  }, [isLoading, setIsAuthReady]);


  useEffect(() => {
    if (isAuthenticated && !isLoading) {

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