import { STORE_MONEY_SCALE, STORE_ORDER_CURRENCY } from "@/domain/storeMoneyPolicy";
import type { CatalogPriceProjection, OrderQuoteLineView, OrderQuoteView } from "@/types/orderQuote";

/**
 * Mock local del caso de uso de cotización de pedido.
 * Replica CustomerOrder.addLine: subtotal = unitPrice × quantity (escala Money),
 * total = suma de subtotales. La UI no debe repetir esta aritmética.
 */
export function quoteOrderLocal(projections: CatalogPriceProjection[]): OrderQuoteView {
  if (projections.length === 0) {
    return { currency: STORE_ORDER_CURRENCY, total: 0, lines: [] };
  }

  const lines: OrderQuoteLineView[] = projections.map((line) => {
    const unitPrice = scaleMoney(line.unitPrice);
    const subtotal = scaleMoney(unitPrice * line.quantity);
    return {
      productId: line.productId,
      productName: line.productName,
      quantity: line.quantity,
      unitPrice,
      subtotal,
    };
  });

  const total = scaleMoney(lines.reduce((acc, line) => acc + line.subtotal, 0));
  return { currency: STORE_ORDER_CURRENCY, total, lines };
}

function scaleMoney(amount: number): number {
  const factor = 10 ** STORE_MONEY_SCALE;
  return Math.round(amount * factor) / factor;
}
