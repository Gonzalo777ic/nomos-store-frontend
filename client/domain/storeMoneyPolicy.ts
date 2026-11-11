/**
 * Política de moneda del contexto Pedido / store (misma convención que valeerp.currency).
 * Solo la consume el mock del caso de uso; la UI lee currency del DTO.
 */
export const STORE_ORDER_CURRENCY = "PEN";

/** Escala Money del kernel store-service. */
export const STORE_MONEY_SCALE = 2;
