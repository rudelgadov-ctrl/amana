import { describe, it, expect } from 'vitest';
import {
  computeChefsTableTotal,
  computeGiftCardTotal,
  isValidEmail,
  parseAmountList,
  QUANTITY_OPTIONS,
} from './gift';

describe('gift totals', () => {
  it('adds pairing on top of the per-person price', () => {
    expect(computeChefsTableTotal(4, 2, 44000, 20000)).toBe(216000);
    expect(computeChefsTableTotal(1, 0, 44000, 20000)).toBe(44000);
  });

  it('multiplies gift card amount by quantity', () => {
    expect(computeGiftCardTotal(3, 30000)).toBe(90000);
  });

  it('offers quantities 1 through 8', () => {
    expect(QUANTITY_OPTIONS).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe('isValidEmail', () => {
  it('accepts normal addresses and rejects malformed ones', () => {
    expect(isValidEmail('ana@example.com')).toBe(true);
    expect(isValidEmail('  ana@example.com ')).toBe(true);
    expect(isValidEmail('ana@example')).toBe(false);
    expect(isValidEmail('ana example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('parseAmountList', () => {
  it('parses a comma separated list with mixed formatting', () => {
    expect(parseAmountList('20000,30.000; 40000')).toEqual([20000, 30000, 40000]);
  });

  it('dedupes, drops junk and sorts ascending', () => {
    expect(parseAmountList('50000, abc, 20000, 20000, 0')).toEqual([20000, 50000]);
    expect(parseAmountList('')).toEqual([]);
  });
});
