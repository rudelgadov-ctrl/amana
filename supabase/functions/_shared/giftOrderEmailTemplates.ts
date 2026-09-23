// Copy for the two AUTOMATIC gift-order emails (admin notification + customer confirmation).
// Deliberately duplicated from src/lib/gift.ts / src/lib/format.ts — this runs in Deno and
// can't import from the Vite app's src/ tree.

import { escapeHtml } from './html.ts';
import {
  emailButton,
  emailDetailRows,
  emailEyebrow,
  emailHeading,
  emailNote,
  emailOrderCard,
  emailParagraph,
  emailQuote,
  emailSignature,
  emailStrong,
  wrapEmailHtml,
} from './emailLayout.ts';

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

// Both builders return the complete, ready-to-send HTML document.

export const buildAdminNotificationEmail = (order: GiftOrderRecord): { subject: string; html: string } => {
  const typeLabel = ORDER_TYPE_LABELS_ES[order.order_type];
  const total = formatCRC(order.total, 'es');
  const customerName = `${order.first_name} ${order.last_name}`;
  const subject = `Nuevo pedido ${order.order_code} — ${typeLabel} — ${total}`;

  const body = [
    emailEyebrow(`Nuevo pedido · ${typeLabel}`),
    emailHeading('Nuevo pedido recibido'),
    emailParagraph(`${emailStrong(customerName)} acaba de hacer un pedido desde la página de regalos.`),
    emailOrderCard({
      label: typeLabel,
      orderCode: order.order_code,
      total,
      breakdown: describeBreakdown(order, 'es'),
    }),
    emailDetailRows([
      { label: 'Cliente', value: customerName },
      { label: 'Correo', value: order.email, href: `mailto:${order.email}` },
      { label: 'Método de pago', value: PAYMENT_LABELS_ES[order.payment_method] },
      { label: 'Idioma', value: order.language === 'en' ? 'Inglés' : 'Español' },
    ]),
    order.message ? emailQuote({ label: 'Mensaje del cliente', text: order.message }) : '',
    emailButton({ href: 'https://amanacr.com/admin/gifts', label: 'Ver en el panel de administración →' }),
  ].join('');

  const html = wrapEmailHtml(body, {
    language: 'es',
    preheader: `${customerName} · ${typeLabel} · ${total} · ${PAYMENT_LABELS_ES[order.payment_method]}`,
  });

  return { subject, html };
};

export const buildCustomerConfirmationEmail = (order: GiftOrderRecord): { subject: string; html: string } => {
  const language = order.language;
  const typeLabel = language === 'es' ? ORDER_TYPE_LABELS_ES[order.order_type] : ORDER_TYPE_LABELS_EN[order.order_type];
  const total = formatCRC(order.total, language);
  const card = emailOrderCard({
    label: typeLabel,
    orderCode: order.order_code,
    total,
    breakdown: describeBreakdown(order, language),
  });

  if (language === 'en') {
    const subject = `We've received your order ${order.order_code} — Amana`;
    const body = [
      emailEyebrow('Order received'),
      emailHeading('Thank you for your order!'),
      emailParagraph(`Hi ${escapeHtml(order.first_name)},`),
      emailParagraph(`We've received your request for ${emailStrong(typeLabel)}. Here's your order summary:`),
      card,
      order.message ? emailQuote({ label: 'Your message', text: order.message }) : '',
      emailNote({
        title: 'Next step',
        contentHtml: `Our team will contact you by this email to arrange and confirm payment via ${emailStrong(
          PAYMENT_LABELS_EN[order.payment_method]
        )} within 24-48 hours.`,
      }),
      emailParagraph('If you have any questions in the meantime, just reply to this email.'),
      emailSignature({ closing: 'Warm regards,', name: 'Amana Team' }),
    ].join('');
    const html = wrapEmailHtml(body, {
      language: 'en',
      preheader: `Order ${order.order_code} · ${typeLabel} · ${total}. We'll contact you within 24-48 hours to arrange payment.`,
    });
    return { subject, html };
  }

  const subject = `Hemos recibido su pedido ${order.order_code} — Amana`;
  const body = [
    emailEyebrow('Pedido recibido'),
    emailHeading('¡Gracias por su pedido!'),
    emailParagraph(`Hola ${escapeHtml(order.first_name)},`),
    emailParagraph(`Hemos recibido su solicitud de ${emailStrong(typeLabel)}. Este es el resumen de su pedido:`),
    card,
    order.message ? emailQuote({ label: 'Su mensaje', text: order.message }) : '',
    emailNote({
      title: 'Próximo paso',
      contentHtml: `Nuestro equipo le estará contactando por este correo para coordinar y confirmar el pago por ${emailStrong(
        PAYMENT_LABELS_ES[order.payment_method]
      )} en un plazo de 24-48 horas.`,
    }),
    emailParagraph('Si tiene alguna pregunta mientras tanto, puede responder este mismo correo.'),
    emailSignature({ closing: 'Con cariño,', name: 'Equipo Amana' }),
  ].join('');
  const html = wrapEmailHtml(body, {
    language: 'es',
    preheader: `Pedido ${order.order_code} · ${typeLabel} · ${total}. Le contactaremos en 24-48 horas para coordinar el pago.`,
  });
  return { subject, html };
};
