// Shared constants, types and pure helpers for the "Regala Amana" gift flow.
// Kept free of React/Supabase so both the public page and the admin can import it.

export const GIFT_MAX_QUANTITY = 8;
export const GIFT_MESSAGE_MAX = 80;

export const ORDER_TYPES = ['chefs_table', 'gift_card'] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

export const PAYMENT_METHODS = ['payment_link', 'paypal', 'sinpe'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const GIFT_ORDER_STATUSES = ['new', 'contacted', 'paid', 'delivered', 'cancelled'] as const;
export type GiftOrderStatus = (typeof GIFT_ORDER_STATUSES)[number];

// What the public sections hand to the order form once "Ordenar" is pressed.
export type GiftOrderDraft =
  | {
      type: 'chefs_table';
      quantity: number;
      pairingQuantity: number;
      unitPrice: number;
      pairingUnitPrice: number;
      total: number;
    }
  | {
      type: 'gift_card';
      quantity: number;
      amount: number;
      total: number;
    };

export const QUANTITY_OPTIONS = Array.from({ length: GIFT_MAX_QUANTITY }, (_, i) => i + 1);

export const computeChefsTableTotal = (
  quantity: number,
  pairingQuantity: number,
  unitPrice: number,
  pairingUnitPrice: number
): number => quantity * unitPrice + pairingQuantity * pairingUnitPrice;

export const computeGiftCardTotal = (quantity: number, amount: number): number => quantity * amount;

export const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// "20000, 30.000;40000" → [20000, 30000, 40000] (positive ints, deduped, ascending)
export const parseAmountList = (raw: string): number[] => {
  const values = raw
    .split(/[,;\n]/)
    .map((part) => part.replace(/\D/g, ''))
    .filter(Boolean)
    .map((digits) => parseInt(digits, 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return Array.from(new Set(values)).sort((a, b) => a - b);
};

// ---- Admin labels (the admin UI is Spanish-only) ----

export const STATUS_LABELS: Record<GiftOrderStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  paid: 'Pagado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const STATUS_BADGE_CLASS: Record<GiftOrderStatus, string> = {
  new: 'bg-yolk text-blueberry hover:bg-yolk',
  contacted: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  paid: 'bg-green-100 text-green-800 hover:bg-green-100',
  delivered: 'bg-slate-200 text-slate-800 hover:bg-slate-200',
  cancelled: 'bg-destructive/10 text-destructive hover:bg-destructive/10',
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  payment_link: 'Link de pago',
  paypal: 'PayPal',
  sinpe: 'SINPE Móvil',
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  chefs_table: "Chef's Table",
  gift_card: 'Tarjeta de regalo',
};

export const isGiftOrderStatus = (value: string): value is GiftOrderStatus =>
  (GIFT_ORDER_STATUSES as readonly string[]).includes(value);

export const isPaymentMethod = (value: string): value is PaymentMethod =>
  (PAYMENT_METHODS as readonly string[]).includes(value);

export const isOrderType = (value: string): value is OrderType =>
  (ORDER_TYPES as readonly string[]).includes(value);
