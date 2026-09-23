// Prefill copy for the admin "Enviar correo" compose box in GiftOrderDetailDialog.
// Kept free of React/Supabase, mirroring src/lib/gift.ts. Subject/body are always
// editable before sending — these are just starting points per case.

import { formatCRC } from './format';
import type { OrderType } from './gift';

export const GIFT_EMAIL_TEMPLATE_KEYS = ['payment_confirmed', 'payment_pending', 'gift_card_ready', 'custom'] as const;
export type GiftEmailTemplateKey = (typeof GIFT_EMAIL_TEMPLATE_KEYS)[number];

export const GIFT_EMAIL_TEMPLATE_LABELS: Record<GiftEmailTemplateKey, string> = {
  payment_confirmed: 'Pago confirmado',
  payment_pending: 'Recordatorio de pago pendiente',
  gift_card_ready: 'Tarjeta/experiencia lista',
  custom: 'Personalizado',
};

export interface GiftEmailOrderContext {
  firstName: string;
  orderCode: string;
  total: number;
  orderType: OrderType;
  language: 'es' | 'en';
}

export interface GiftEmailTemplate {
  subject: string;
  body: string;
}

export const getGiftEmailTemplate = (
  key: GiftEmailTemplateKey,
  order: GiftEmailOrderContext
): GiftEmailTemplate => {
  const total = formatCRC(order.total, order.language);
  const greeting = `Hola ${order.firstName},`;
  const signOff = 'Saludos,\nEquipo Amana';

  switch (key) {
    case 'payment_confirmed':
      return {
        subject: `Su pago fue confirmado — pedido ${order.orderCode}`,
        body: `${greeting}\n\nLe confirmamos que recibimos su pago de ${total} correspondiente al pedido ${order.orderCode}. ¡Muchas gracias!\n\n[Detalles de entrega o coordinación]\n\n${signOff}`,
      };
    case 'payment_pending':
      return {
        subject: `Recordatorio: pago pendiente — pedido ${order.orderCode}`,
        body: `${greeting}\n\nLe escribimos para recordarle que su pedido ${order.orderCode} por ${total} aún tiene el pago pendiente.\n\n[Instrucciones de pago]\n\n${signOff}`,
      };
    case 'gift_card_ready': {
      const readyText =
        order.orderType === 'gift_card'
          ? `Su tarjeta de regalo del pedido ${order.orderCode} ya está lista.`
          : `Su experiencia Chef's Table del pedido ${order.orderCode} ya está confirmada.`;
      return {
        subject: `${order.orderType === 'gift_card' ? 'Su tarjeta de regalo está lista' : 'Su experiencia está confirmada'} — pedido ${order.orderCode}`,
        body: `${greeting}\n\n${readyText}\n\n[Detalles de retiro, entrega o reserva]\n\n${signOff}`,
      };
    }
    case 'custom':
    default:
      return {
        subject: `Pedido ${order.orderCode} — Amana`,
        body: `${greeting}\n\n\n\n${signOff}`,
      };
  }
};
