import { fetchOrderQuote } from "@/api/orderQuote";
import type { CartItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

/** Tiempo en que la cotización se considera fresca sin refetch (UI, no regla de negocio). */
const CART_QUOTE_STALE_MS = 30_000;

/**
 * Obtiene totales del caso de uso / API (o mock). La UI no recalcula subtotales.
 */
export function useCartQuote(items: CartItem[]) {
  const fingerprint = items.map((i) => `${i.product.id}:${i.quantity}`).join("|");

  return useQuery({
    queryKey: ["cart-quote", fingerprint],
    queryFn: () => fetchOrderQuote(items),
    enabled: items.length > 0,
    staleTime: CART_QUOTE_STALE_MS,
  });
}
