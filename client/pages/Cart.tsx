import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/utils/format";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCartStore();
  const navigate = useNavigate();

  const total = totalPrice();

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Carrito</h1>
      {items.length === 0 ? (
        <div className="rounded-md border p-6 text-center">
          <p className="mb-4 text-gray-600">Tu carrito está vacío.</p>
          <Link to="/products" className="text-brand hover:underline">Explorar productos</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_360px]">
          <ul className="divide-y rounded-md border bg-white">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 p-4 sm:grid-cols-[100px_1fr_auto]">
                <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="h-20 w-20 rounded object-cover" />
                <div>
                  <Link to={`/product/${product.id}`} className="font-medium hover:underline">{product.name}</Link>
                  <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))} className="h-8 w-8 rounded border">-</button>
                  <input value={quantity} onChange={(e)=>updateQuantity(product.id, Number(e.target.value)||1)} className="h-8 w-12 rounded border text-center" />
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} className="h-8 w-8 rounded border">+</button>
                  <button onClick={() => removeFromCart(product.id)} className="ml-2 text-sm text-red-600 hover:underline">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-max rounded-md border bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-semibold text-brand">{formatPrice(total)}</span>
            </div>
            <button onClick={()=>navigate('/checkout')} className="mt-4 w-full rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90">Ir al pago</button>
          </aside>
        </div>
      )}
    </main>
  );
}
