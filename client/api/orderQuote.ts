import { http } from "@/api/http";
import { quoteOrderLocal } from "@/api/orderQuoteMock";
import type { CartItem } from "@/types";
import type { OrderQuoteView, QuoteOrderRequest } from "@/types/orderQuote";

const QUOTE_SOURCE_API = "api";
const QUOTE_SOURCE_MOCK = "mock";

/**
 * Cotiza el carrito vía store API (`POST /orders/quote`) o mock local
 * con la misma forma de DTO. La UI solo muestra el resultado.
 */
export async function fetchOrderQuote(items: CartItem[]): Promise<OrderQuoteView> {
  const source = resolveQuoteSource();
  if (source === QUOTE_SOURCE_MOCK) {
    return quoteOrderLocal(
      items.map(({ product, quantity }) => ({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
      })),
    );
  }

  const body: QuoteOrderRequest = {
    items: items.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    })),
  };
  const res = await http.post<OrderQuoteView>("/orders/quote", body);
  return res.data;
}

function resolveQuoteSource(): string {
  const raw = import.meta.env.VITE_STORE_QUOTE_SOURCE;
  if (typeof raw !== "string" || raw.trim() === "") {
    return QUOTE_SOURCE_MOCK;
  }
  const normalized = raw.trim().toLowerCase();
  if (normalized === QUOTE_SOURCE_API || normalized === QUOTE_SOURCE_MOCK) {
    return normalized;
  }
  throw new Error(`VITE_STORE_QUOTE_SOURCE debe ser "${QUOTE_SOURCE_API}" o "${QUOTE_SOURCE_MOCK}"`);
}
