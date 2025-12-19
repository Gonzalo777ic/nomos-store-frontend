import { createHttpInstance } from "@/api/http";
import { useAuth } from "@/hooks/useAuth";



export const useAuthHttp = () => {
    const { getAuthToken } = useAuth();

    const authHttp = createHttpInstance(getAuthToken);
    return authHttp;
}





