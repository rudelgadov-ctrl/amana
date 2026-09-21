type Language = 'es' | 'en';

// Costa Rican colones: es → "₡44.000", en → "₡44,000".
// Regex grouping instead of Intl so output is identical across browsers and tests.
export const formatCRC = (amount: number, language: Language = 'es'): string => {
  const separator = language === 'es' ? '.' : ',';
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  const grouped = Math.abs(safe)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return `${safe < 0 ? '-' : ''}₡${grouped}`;
};

// Turns free-form user input ("25.000", "₡ 25,000", "25000") into an integer, or null when empty.
export const parseAmountInput = (raw: string): number | null => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  const value = parseInt(digits, 10);
  return Number.isFinite(value) ? value : null;
};
