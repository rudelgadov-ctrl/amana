import { describe, it, expect } from 'vitest';
import {
  capacityExceeded,
  formatBudget,
  isAllowedEventDate,
  isAllowedEventWeekday,
  needsCustomQuote,
  parseBudgetAmount,
  parseISODate,
  toISODate,
  toWhatsAppNumber,
} from './eventRequests';

// 2026-10-20 is a Tuesday.
const tuesday = new Date(2026, 9, 20);
const thursday = new Date(2026, 9, 22);
const friday = new Date(2026, 9, 23);
const saturday = new Date(2026, 9, 24);
const sunday = new Date(2026, 9, 25);
const monday = new Date(2026, 9, 26);

describe('event dates', () => {
  it('only allows Tuesday to Saturday', () => {
    expect(isAllowedEventWeekday(tuesday)).toBe(true);
    expect(isAllowedEventWeekday(saturday)).toBe(true);
    expect(isAllowedEventWeekday(sunday)).toBe(false);
    expect(isAllowedEventWeekday(monday)).toBe(false);
  });

  it('rejects past dates but allows today', () => {
    const today = new Date(2026, 9, 22, 15, 30);
    expect(isAllowedEventDate(tuesday, today)).toBe(false);
    expect(isAllowedEventDate(thursday, today)).toBe(true);
    expect(isAllowedEventDate(friday, today)).toBe(true);
  });

  it('round-trips YYYY-MM-DD without shifting the day', () => {
    expect(toISODate(friday)).toBe('2026-10-23');
    expect(toISODate(new Date(2027, 0, 5, 23, 59))).toBe('2027-01-05');
    expect(parseISODate('2026-10-23').getDate()).toBe(23);
    expect(parseISODate('2026-10-23').getDay()).toBe(5);
  });
});

describe('needsCustomQuote', () => {
  it('flags Fridays, Saturdays and groups above 22', () => {
    expect(needsCustomQuote(friday, 10)).toBe(true);
    expect(needsCustomQuote(saturday, undefined)).toBe(true);
    expect(needsCustomQuote(thursday, 22)).toBe(false);
    expect(needsCustomQuote(thursday, 23)).toBe(true);
    expect(needsCustomQuote(undefined, 30)).toBe(true);
    expect(needsCustomQuote(undefined, undefined)).toBe(false);
  });
});

describe('capacityExceeded', () => {
  it('returns the capacity only when the guest count is over it', () => {
    expect(capacityExceeded('salon_verde', 13)).toBe(12);
    expect(capacityExceeded('salon_verde', 12)).toBeNull();
    expect(capacityExceeded('full_restaurant', 50)).toBe(42);
    expect(capacityExceeded('combination', 80)).toBeNull();
    expect(capacityExceeded('salon_azul', undefined)).toBeNull();
  });
});

describe('toWhatsAppNumber', () => {
  it('adds the Costa Rica prefix to 8-digit numbers', () => {
    expect(toWhatsAppNumber('6143-6871')).toBe('50661436871');
    expect(toWhatsAppNumber('+506 6143 6871')).toBe('50661436871');
    expect(toWhatsAppNumber('+1 (305) 555-1234')).toBe('13055551234');
  });
});

describe('budget', () => {
  it('keeps digits only and rejects empty or out-of-range amounts', () => {
    expect(parseBudgetAmount('25.000')).toBe(25000);
    expect(parseBudgetAmount('₡ 1,500,000')).toBe(1500000);
    expect(parseBudgetAmount('')).toBeUndefined();
    expect(parseBudgetAmount('0')).toBeUndefined();
    expect(parseBudgetAmount('99999999999')).toBeUndefined();
  });

  it('formats amount, currency and type per language', () => {
    expect(formatBudget(25000, 'CRC', 'per_person', 'es')).toBe('₡25.000 por persona');
    expect(formatBudget(3000, 'USD', 'total', 'en')).toBe('$3,000 total');
    expect(formatBudget(1200, 'USD', 'per_person', 'es')).toBe('$1.200 por persona');
  });
});
