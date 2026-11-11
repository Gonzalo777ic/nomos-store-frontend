/**
 * Contratos alineados con el pedido ecommerce de store-service
 * (líneas con unitPrice/subtotal del agregado + total de OrderView).
 */

export interface QuoteOrderItemInput {
  productId: string | number;
  quantity: number;
}

export interface QuoteOrderRequest {
  items: QuoteOrderItemInput[];
}

/** Proyección de catálogo que el caso de uso usaría vía CatalogClient. */
export interface CatalogPriceProjection {
  productId: string | number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderQuoteLineView {
  productId: string | number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/** Vista de cotización previa al place; total con la misma semántica que OrderView.total. */
export interface OrderQuoteView {
  currency: string;
  total: number;
  lines: OrderQuoteLineView[];
}
