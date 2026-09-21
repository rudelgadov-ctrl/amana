import { describe, it, expect } from 'vitest';
import { formatCRC, parseAmountInput } from './format';

describe('formatCRC', () => {
  it('groups thousands with a dot in Spanish', () => {
    expect(formatCRC(44000, 'es')).toBe('₡44.000');
    expect(formatCRC(1500000, 'es')).toBe('₡1.500.000');
    expect(formatCRC(500, 'es')).toBe('₡500');
  });

  it('groups thousands with a comma in English', () => {
    expect(formatCRC(44000, 'en')).toBe('₡44,000');
    expect(formatCRC(216000, 'en')).toBe('₡216,000');
  });

  it('handles zero and non-finite values', () => {
    expect(formatCRC(0, 'es')).toBe('₡0');
    expect(formatCRC(NaN, 'es')).toBe('₡0');
  });
});

describe('parseAmountInput', () => {
  it('extracts digits from formatted input', () => {
    expect(parseAmountInput('25.000')).toBe(25000);
    expect(parseAmountInput('₡ 25,000')).toBe(25000);
    expect(parseAmountInput('25000')).toBe(25000);
  });

  it('returns null when there are no digits', () => {
    expect(parseAmountInput('')).toBeNull();
    expect(parseAmountInput('abc')).toBeNull();
  });
});
