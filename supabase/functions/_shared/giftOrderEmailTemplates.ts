// Copy for the two AUTOMATIC gift-order emails (admin notification + customer confirmation).
// Deliberately duplicated from src/lib/gift.ts / src/lib/format.ts — this runs in Deno and
// can't import from the Vite app's src/ tree.

import { escapeHtml } from './html.ts';

export interface GiftOrderRecord {
  order_code: string;
  order_type: 'chefs_table' | 'gift_card';
  quantity: number;
  pairing_quantity: number | null;
  unit_price: number | null;
  pairing_unit_price: number | null;
  amount: number | null;
  total: number;
  first_name: string;
  last_name: string;
  email: string;
  payment_method: 'payment_link' | 'paypal' | 'sinpe';
  message: string | null;
  language: 'es' | 'en';
}

const ORDER_TYPE_LABELS_ES: Record<GiftOrderRecord['order_type'], string> = {
  chefs_table: "Chef's Table",
  gift_card: 'Tarjeta de regalo',
};

const ORDER_TYPE_LABELS_EN: Record<GiftOrderRecord['order_type'], string> = {
  chefs_table: "Chef's Table",
  gift_card: 'Gift card',
};

const PAYMENT_LABELS_ES: Record<GiftOrderRecord['payment_method'], string> = {
  payment_link: 'Link de pago',
  paypal: 'PayPal',
  sinpe: 'SINPE Móvil',
};

const PAYMENT_LABELS_EN: Record<GiftOrderRecord['payment_method'], string> = {
  payment_link: 'Payment link',
  paypal: 'PayPal',
  sinpe: 'SINPE Móvil',
};

const formatCRC = (amount: number, language: 'es' | 'en' = 'es'): string => {
  const separator = language === 'es' ? '.' : ',';
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  const grouped = Math.abs(safe)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return `${safe < 0 ? '-' : ''}₡${grouped}`;
};

const describeBreakdown = (order: GiftOrderRecord, language: 'es' | 'en'): string => {
  if (order.order_type === 'chefs_table') {
    const base = `${order.quantity} × ${formatCRC(order.unit_price ?? 0, language)}`;
    const pairing = order.pairing_quantity
      ? ` + ${order.pairing_quantity} × ${formatCRC(order.pairing_unit_price ?? 0, language)} (${
          language === 'es' ? 'maridaje' : 'pairing'
        })`
      : '';
    return base + pairing;
  }
  return `${order.quantity} × ${formatCRC(order.amount ?? 0, language)}`;
};

export const buildAdminNotificationEmail = (order: GiftOrderRecord): { subject: string; html: string } => {
  const typeLabel = ORDER_TYPE_LABELS_ES[order.order_type];
  const subject = `Nuevo pedido ${order.order_code} — ${typeLabel} — ${formatCRC(order.total, 'es')}`;

  const html = `
    <p style="margin:0 0 16px; font-size:18px; font-weight:bold;">Nuevo pedido recibido</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; font-size:14px;">
      <tr><td style="padding:4px 0; color:#7A9A8A;">Código</td><td style="padding:4px 0;"><strong>${escapeHtml(order.order_code)}</strong></td></tr>
      <tr><td style="padding:4px 0; color:#7A9A8A;">Tipo</td><td style="padding:4px 0;">${escapeHtml(typeLabel)}</td></tr>
      <tr><td style="padding:4px 0; color:#7A9A8A;">Detalle</td><td style="padding:4px 0;">${escapeHtml(describeBreakdown(order, 'es'))}</td></tr>
      <tr><td style="padding:4px 0; color:#7A9A8A;">Total</td><td style="padding:4px 0;"><strong>${formatCRC(order.total, 'es')}</strong></td></tr>
      <tr><td style="padding:4px 0; color:#7A9A8A;">Método de pago</td><td style="padding:4px 0;">${escapeHtml(PAYMENT_LABELS_ES[order.payment_method])}</td></tr>
      <tr><td style="padding:4px 0; color:#7A9A8A;">Cliente</td><td style="padding:4px 0;">${escapeHtml(order.first_name)} ${escapeHtml(order.last_name)}</td></tr>
      <tr><td style="padding:4px 0; color:#7A9A8A;">Correo</td><td style="padding:4px 0;">${escapeHtml(order.email)}</td></tr>
      <tr><td style="padding:4px 0; color:#7A9A8A;">Idioma</td><td style="padding:4px 0;">${order.language.toUpperCase()}</td></tr>
    </table>
    ${
      order.message
        ? `<p style="margin:16px 0 0; padding:12px; background-color:#DAD8C9; border-left:4px solid #E3FF4D; font-style:italic;">${escapeHtml(order.message)}</p>`
        : ''
    }
    <p style="margin:24px 0 0;">
      <a href="https://amanacr.com/admin/gifts" style="color:#002A3A; font-weight:bold;">Ver en el panel de administración →</a>
    </p>
  `;

  return { subject, html };
};

export const buildCustomerConfirmationEmail = (order: GiftOrderRecord): { subject: string; html: string } => {
  const language = order.language;
  const typeLabel = language === 'es' ? ORDER_TYPE_LABELS_ES[order.order_type] : ORDER_TYPE_LABELS_EN[order.order_type];
  const total = formatCRC(order.total, language);

  if (language === 'en') {
    const subject = `We've received your order ${order.order_code} — Amana`;
    const html = `
      <p style="margin:0 0 16px; font-size:18px; font-weight:bold;">Thank you for your order!</p>
      <p style="margin:0 0 16px;">Hi ${escapeHtml(order.first_name)},</p>
      <p style="margin:0 0 16px;">We've received your request for <strong>${escapeHtml(typeLabel)}</strong> totaling <strong>${total}</strong>.</p>
      <p style="margin:0 0 16px;">Order code: <strong>${escapeHtml(order.order_code)}</strong></p>
      <p style="margin:0 0 16px;">Our team will contact you by this email to arrange and confirm payment within 24-48 hours.</p>
      <p style="margin:0 0 16px;">If you have any questions in the meantime, just reply to this email.</p>
      <p style="margin:24px 0 0;">Warm regards,<br/>Amana Team</p>
    `;
    return { subject, html };
  }

  const subject = `Hemos recibido su pedido ${order.order_code} — Amana`;
  const html = `
    <p style="margin:0 0 16px; font-size:18px; font-weight:bold;">¡Gracias por su pedido!</p>
    <p style="margin:0 0 16px;">Hola ${escapeHtml(order.first_name)},</p>
    <p style="margin:0 0 16px;">Hemos recibido su solicitud de <strong>${escapeHtml(typeLabel)}</strong> por un total de <strong>${total}</strong>.</p>
    <p style="margin:0 0 16px;">Código de pedido: <strong>${escapeHtml(order.order_code)}</strong></p>
    <p style="margin:0 0 16px;">Nuestro equipo le estará contactando por este correo para coordinar y confirmar el pago en un plazo de 24-48 horas.</p>
    <p style="margin:0 0 16px;">Si tiene alguna pregunta mientras tanto, puede responder este mismo correo.</p>
    <p style="margin:24px 0 0;">Con cariño,<br/>Equipo Amana</p>
  `;
  return { subject, html };
};
