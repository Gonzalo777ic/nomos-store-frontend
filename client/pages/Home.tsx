import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/api/products";
import type { Product } from "@/types";

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({ page: 0, size: 4 })
      .then((page) => setFeatured(page.content))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <main>
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Bienvenido a <span className="text-brand">ValeERP</span>
            </h1>
            <p className="mt-4 text-gray-600">
              Tienda del ERP. Los precios y las existencias salen del catálogo y del inventario.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link to="/products" className="inline-flex items-center rounded-md bg-brand px-5 py-3 font-medium text-white hover:bg-brand/90">Explorar productos</Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-brand/10 blur-3xl" />
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border bg-white shadow">
              <img src="/placeholder.svg" alt="ValeERP" className="h-full w-full object-cover" />
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
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
