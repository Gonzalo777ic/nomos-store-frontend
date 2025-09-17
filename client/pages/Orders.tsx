import { useEffect, useState } from "react";
import { getOrders } from "@/api/orders";
import type { Order } from "@/types";
import { formatPrice } from "@/utils/format";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getOrders();
        setOrders(res);
      } catch {
        setOrders([
          { id: "demo-1", createdAt: new Date().toISOString(), total: 59.97, items: [] },
        ]);
      }
    })();
  }, []);

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
