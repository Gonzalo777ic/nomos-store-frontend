import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/utils/format";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items, clearCart, totalPrice } = useCartStore();
  const isAuthed = useAuthStore((s) => s.isAuthenticated());
  const navigate = useNavigate();

  if (!isAuthed()) {
    navigate("/login");
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearCart();
    navigate("/orders");
  };

  return (
    <main className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-[1fr_360px]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-md border bg-white p-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="grid gap-2">
          <label className="text-sm">Nombre completo</label>
          <input required className="rounded-md border px-4 py-2" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Dirección</label>
          <input required className="rounded-md border px-4 py-2" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Tarjeta</label>
          <input required className="rounded-md border px-4 py-2" placeholder="0000 0000 0000 0000" />
        </div>
        <button type="submit" className="w-full rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90">Confirmar pedido</button>
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
