import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOrdersApi } from "@/hooks/useOrdersApi";

export default function Checkout() {
  const { items, clearCart, totalPrice } = useCartStore();
  const isAuthed = useAuthStore((s) => s.isAuthenticated());
  const navigate = useNavigate();
  const { createOrder } = useOrdersApi();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");

  if (!isAuthed()) {
    navigate("/login");
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createOrder({
        fullName,
        address,
        items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
      });
      clearCart();
      navigate("/orders");
    } catch {
      setError("No se pudo registrar el pedido. Revisa existencias y que exista la tasa de impuesto configurada.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-[1fr_360px]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-md border bg-white p-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="grid gap-2">
          <label className="text-sm">Nombre completo</label>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-md border px-4 py-2" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Dirección</label>
          <input required value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-md border px-4 py-2" />
        </div>
        <p className="text-sm text-gray-600">El pedido queda al contado y descuenta existencias. El cobro con tarjeta no pasa por ValeERP.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="w-full rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90">
          {submitting ? "Registrando pedido..." : "Confirmar pedido"}
        </button>
      </form>
      <aside className="h-max rounded-md border bg-white p-6">
        <h2 className="mb-3 font-semibold">Resumen</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center justify-between">
              <span className="line-clamp-1">{product.name} × {quantity}</span>
              <span>{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <span className="text-gray-600">Total</span>
          <span className="text-lg font-semibold text-brand">{formatPrice(totalPrice())}</span>
        </div>
      </aside>
    </main>
  );
}
