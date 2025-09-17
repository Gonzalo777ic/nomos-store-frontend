import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";

const featured = [
  { id: 1, name: "Camiseta Nomos Verde", price: 24.99, imageUrl: "/placeholder.svg" },
  { id: 2, name: "Taza Nomos", price: 9.99, imageUrl: "/placeholder.svg" },
  { id: 3, name: "Gorra Nomos", price: 14.99, imageUrl: "/placeholder.svg" },
  { id: 4, name: "Mochila Nomos", price: 49.99, imageUrl: "/placeholder.svg" },
];

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Bienvenido a <span className="text-brand">Nomos Store</span>
            </h1>
            <p className="mt-4 text-gray-600">
              Una tienda online moderna y rápida. Descubre productos seleccionados con un diseño limpio y mobile-first.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link to="/products" className="inline-flex items-center rounded-md bg-brand px-5 py-3 font-medium text-white hover:bg-brand/90">Explorar productos</Link>
              <a href="#destacados" className="inline-flex items-center rounded-md border px-5 py-3 font-medium text-gray-700 hover:bg-gray-50">Ver destacados</a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-brand/10 blur-3xl" />
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border bg-white shadow">
              <img src="/placeholder.svg" alt="Nomos hero" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section id="destacados" className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Destacados</h2>
          <Link to="/products" className="text-brand hover:underline">Ver todo</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>
    </main>
  );
}
