import type { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";
import { Link } from "react-router-dom";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <div className="group rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-md bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="aspect-square w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="mt-3">
        <Link to={`/product/${product.id}`} className="line-clamp-1 font-medium text-gray-900">
          {product.name}
        </Link>
        <p className="mt-1 text-brand font-semibold">{formatPrice(product.price)}</p>
        <Button onClick={() => addToCart(product)} className="mt-3 w-full bg-brand hover:bg-brand/90">
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
}
