import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "@/api/products";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { formatPrice } from "@/utils/format";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    (async () => {
      try {
        const p = await getProductById(String(id));
        setProduct(p);
      } catch {
        setProduct({ id: id || "local", name: "Producto de ejemplo", price: 19.99, imageUrl: "/placeholder.svg" });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p className="p-10 text-center">Producto no encontrado</p>;

  return (
    <main className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border bg-white">
        <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="w-full object-cover" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-2xl text-brand font-semibold">{formatPrice(product.price)}</p>
        <p className="mt-4 text-gray-600">{product.description || "Descripción no disponible."}</p>
        <Button onClick={() => addToCart(product)} className="mt-6 bg-brand hover:bg-brand/90">Agregar al carrito</Button>
      </div>
    </main>
  );
}
