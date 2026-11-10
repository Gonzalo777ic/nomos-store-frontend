import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/api/products";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    (async () => {
      try {
        setFailed(false);
        const res = await getProducts({ page: page - 1, size: pageSize, search });
        setProducts(res.content);
      } catch {
        setFailed(true);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, search]);

  const filtered = useMemo(() => {
    if (!search) return products;
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Todos los productos</h1>
        <input
          type="search"
          placeholder="Buscar…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border px-4 py-2 sm:max-w-xs"
        />
      </div>

      {loading ? (
        <Loader />
      ) : failed ? (
        <p className="text-sm text-red-600">No se pudo leer el catálogo.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border px-3 py-1.5 text-sm">Anterior</button>
        <span className="text-sm text-gray-600">Página {page}</span>
        <button onClick={() => setPage((p) => p + 1)} className="rounded-md border px-3 py-1.5 text-sm">Siguiente</button>
      </div>
    </main>
  );
}
