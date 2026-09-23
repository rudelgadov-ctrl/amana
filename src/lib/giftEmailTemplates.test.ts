import { describe, it, expect } from 'vitest';
import { getGiftEmailTemplate, GIFT_EMAIL_TEMPLATE_LABELS, type GiftEmailOrderContext } from './giftEmailTemplates';

const baseOrder: GiftEmailOrderContext = {
  firstName: 'Ana',
  orderCode: 'AM-2026-0005',
  total: 44000,
  orderType: 'chefs_table',
  language: 'es',
};

describe('GIFT_EMAIL_TEMPLATE_LABELS', () => {
  it('has a Spanish label for every template key', () => {
    expect(Object.keys(GIFT_EMAIL_TEMPLATE_LABELS)).toEqual([
      'payment_confirmed',
      'payment_pending',
      'gift_card_ready',
      'custom',
    ]);
  });
});

describe('getGiftEmailTemplate', () => {
  it('interpolates the customer name, order code and formatted total', () => {
    const { subject, body } = getGiftEmailTemplate('payment_confirmed', baseOrder);
    expect(subject).toContain('AM-2026-0005');
    expect(body).toContain('Hola Ana,');
    expect(body).toContain('₡44.000');
    expect(body).toContain('AM-2026-0005');
  });

  it('branches gift_card_ready wording on order type', () => {
    const chefsTable = getGiftEmailTemplate('gift_card_ready', { ...baseOrder, orderType: 'chefs_table' });
    expect(chefsTable.body).toContain('experiencia Chef\'s Table');

    const giftCard = getGiftEmailTemplate('gift_card_ready', { ...baseOrder, orderType: 'gift_card' });
    expect(giftCard.body).toContain('tarjeta de regalo');
  });

  it('falls back to a bare greeting/sign-off skeleton for custom', () => {
    const { body } = getGiftEmailTemplate('custom', baseOrder);
    expect(body).toContain('Hola Ana,');
    expect(body).toContain('Equipo Amana');
  });
});
