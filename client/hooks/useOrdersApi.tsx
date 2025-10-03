import { useAuthHttp } from "@/components/AuthAxiosProvider";
import type { CreateOrderInput, Order } from "@/types";

/**
 * Hook personalizado para interactuar con las rutas de API que requieren autenticación (órdenes).
 */
export const useOrdersApi = () => {
  // Obtenemos la instancia de Axios que ya tiene el token de Auth0 inyectado
  const http = useAuthHttp();

  const getOrders = async (): Promise<Order[]> => {
    // La instancia 'http' aquí automáticamente inyecta el token antes de la llamada
    const res = await http.get<Order[]>("/orders");
    return res.data;
  };

  const createOrder = async (data: CreateOrderInput): Promise<Order> => {
    const res = await http.post<Order>("/orders", data);
    return res.data;
  };

  return {
    getOrders,
    createOrder,
  };
};
