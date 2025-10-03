import { createHttpInstance } from "@/api/http";
import { useAuth } from "@/hooks/useAuth";

// Aquí creamos y exportamos la instancia de Axios autenticada para que
// las funciones de la API puedan usarla.
export const useAuthHttp = () => {
    const { getAuthToken } = useAuth();
    // Creamos la instancia de http con el interceptor
    const authHttp = createHttpInstance(getAuthToken);
    return authHttp;
}

// Este componente no es estrictamente necesario, pero es un patrón común
// export default function AuthAxiosProvider({ children }) {
//     return <>{children}</>;
// }
