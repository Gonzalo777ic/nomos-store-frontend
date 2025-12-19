
import { useOrdersApi } from "@/hooks/useOrdersApi";
import type { Order } from "@/types";
import { formatPrice } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";


function OrderListFallback() {
  return (
    <li className="rounded-md border bg-white p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-brand/50 rounded w-1/5"></div>
      </div>
    </li>
  );
}

export default function Orders() {

  const { getOrders } = useOrdersApi();


  const { data: orders, isLoading, isError } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: getOrders,

    staleTime: 5 * 60 * 1000,
  });


  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Mis pedidos</h1>
        <ul className="space-y-3">
            <OrderListFallback />
            <OrderListFallback />
            <OrderListFallback />
        </ul>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Mis pedidos</h1>
        <p className="text-red-500">❌ Error al cargar los pedidos. ¿Estás logueado?</p>
      </main>
    );
  }


  if (!orders || orders.length === 0) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Mis pedidos</h1>
        <p className="text-gray-500">Aún no has realizado ningún pedido.</p>
      </main>
    );
  }



  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Mis pedidos</h1>
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="rounded-md border bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</span>
              <span className="font-semibold text-brand">{formatPrice(o.total)}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
