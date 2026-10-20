// Shared constants, types and pure helpers for the /eventos quote-request flow.
// Kept free of React/Supabase so both the public page and the admin can import it.
// supabase/functions/_shared/eventRequestEmailTemplates.ts mirrors the rules below — keep them in sync.

import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { formatCRC } from './format';

export const EVENT_NAME_MAX = 100;
export const EVENT_COMPANY_MAX = 120;
export const EVENT_EMAIL_MAX = 254;
export const EVENT_PHONE_MIN = 6;
export const EVENT_PHONE_MAX = 30;
export const EVENT_GUESTS_MIN = 1;
export const EVENT_GUESTS_MAX = 500;
export const EVENT_COMMENTS_MAX = 2000;
export const EVENT_BUDGET_MAX = 1_000_000_000;

// Above this many guests (or on Fridays/Saturdays) the event is always quoted on a custom basis.
export const CUSTOM_QUOTE_GUEST_THRESHOLD = 22;

export const EVENT_TYPES = ['corporate', 'celebration', 'launch', 'other'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_SPACES = [
  'salon_azul',
  'salon_verde',
  'salon_principal',
  'chefs_table',
  'full_restaurant',
  'combination',
] as const;
export type EventSpace = (typeof EVENT_SPACES)[number];

// Seated capacity per space; null = no single limit (combination of rooms).
export const SPACE_CAPACITY: Record<EventSpace, number | null> = {
  salon_azul: 8,
  salon_verde: 12,
  salon_principal: 22,
  chefs_table: 8,
  full_restaurant: 42,
  combination: null,
};

// 'other' = the customer explains in the comments. The field is required.
export const MENU_PREFERENCES = ['three_course', 'five_six_course', 'chefs_table', 'other'] as const;
export type MenuPreference = (typeof MENU_PREFERENCES)[number];

// Optional budget: amount + currency + whether it's per person or for the whole event.
export const BUDGET_CURRENCIES = ['CRC', 'USD'] as const;
export type BudgetCurrency = (typeof BUDGET_CURRENCIES)[number];

export const BUDGET_TYPES = ['per_person', 'total'] as const;
export type BudgetType = (typeof BUDGET_TYPES)[number];

export const BUDGET_CURRENCY_SYMBOL: Record<BudgetCurrency, string> = { CRC: '₡', USD: '$' };

export const DEFAULT_BUDGET_CURRENCY: BudgetCurrency = 'CRC';
export const DEFAULT_BUDGET_TYPE: BudgetType = 'per_person';

export const EVENT_REQUEST_STATUSES = [
  'new',
  'contacted',
  'proposal_sent',
  'confirmed',
  'completed',
  'declined',
] as const;
export type EventRequestStatus = (typeof EVENT_REQUEST_STATUSES)[number];

export const DEFAULT_EVENT_TYPE: EventType = 'corporate';
export const DEFAULT_EVENT_SPACE: EventSpace = 'combination';

// Events run Tuesday (2) to Saturday (6).
export const isAllowedEventWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 2 && day <= 6;
};

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const isAllowedEventDate = (date: Date, today: Date = new Date()): boolean =>
  isAllowedEventWeekday(date) && startOfDay(date).getTime() >= startOfDay(today).getTime();

// Fridays, Saturdays and groups above the threshold get a custom proposal with a minimum spend.
export const needsCustomQuote = (date: Date | undefined, guests: number | undefined): boolean => {
  const weekend = date ? date.getDay() === 5 || date.getDay() === 6 : false;
  return weekend || (guests ?? 0) > CUSTOM_QUOTE_GUEST_THRESHOLD;
};

// Returns the space's capacity when the guest count exceeds it, otherwise null.
export const capacityExceeded = (space: EventSpace, guests: number | undefined): number | null => {
  const capacity = SPACE_CAPACITY[space];
  if (capacity == null || !guests) return null;
  return guests > capacity ? capacity : null;
};

// Local calendar date → 'YYYY-MM-DD' (no UTC conversion, so the day never shifts).
export const toISODate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 'YYYY-MM-DD' → local Date at midnight (new Date('YYYY-MM-DD') would parse as UTC).
export const parseISODate = (value: string): Date => {
  const [y, m, d] = value.split('-').map((part) => parseInt(part, 10));
  return new Date(y, (m || 1) - 1, d || 1);
};

// 'YYYY-MM-DD' → "sábado 24 de octubre de 2026" / "Saturday, October 24, 2026"
export const formatEventDate = (value: string, language: 'es' | 'en'): string =>
  language === 'es'
    ? format(parseISODate(value), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
    : format(parseISODate(value), 'EEEE, MMMM d, yyyy', { locale: enUS });

// Budget input keeps digits only ("25.000" → "25000"); returns undefined when empty or out of range.
export const parseBudgetAmount = (raw: string): number | undefined => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return undefined;
  const n = parseInt(digits, 10);
  return n >= 1 && n <= EVENT_BUDGET_MAX ? n : undefined;
};

const BUDGET_TYPE_TEXT: Record<'es' | 'en', Record<BudgetType, string>> = {
  es: { per_person: 'por persona', total: 'total' },
  en: { per_person: 'per person', total: 'total' },
};

// → "₡25.000 por persona" / "$3,000 total" (same thousands separator as formatCRC per language)
export const formatBudget = (
  amount: number,
  currency: BudgetCurrency,
  type: BudgetType,
  language: 'es' | 'en'
): string => {
  const money = formatCRC(amount, language).replace('₡', BUDGET_CURRENCY_SYMBOL[currency]);
  return `${money} ${BUDGET_TYPE_TEXT[language][type]}`;
};

// Strips everything but digits; Costa Rican 8-digit numbers get the 506 prefix for wa.me links.
export const toWhatsAppNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 8 ? `506${digits}` : digits;
};

// ---- Admin labels (the admin UI is Spanish-only) ----

export const STATUS_LABELS: Record<EventRequestStatus, string> = {
  new: 'Nueva',
  contacted: 'Contactada',
  proposal_sent: 'Propuesta enviada',
  confirmed: 'Confirmada',
  completed: 'Realizada',
  declined: 'Descartada',
};

export const STATUS_BADGE_CLASS: Record<EventRequestStatus, string> = {
  new: 'bg-yolk text-blueberry hover:bg-yolk',
  contacted: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  proposal_sent: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  confirmed: 'bg-green-100 text-green-800 hover:bg-green-100',
  completed: 'bg-slate-200 text-slate-800 hover:bg-slate-200',
  declined: 'bg-destructive/10 text-destructive hover:bg-destructive/10',
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  corporate: 'Corporativo',
  celebration: 'Celebración',
  launch: 'Lanzamiento',
  other: 'Otro',
};

export const SPACE_LABELS: Record<EventSpace, string> = {
  salon_azul: 'Salón Azul',
  salon_verde: 'Salón Verde',
  salon_principal: 'Salón principal',
  chefs_table: "Chef's Table",
  full_restaurant: 'Restaurante completo',
  combination: 'Combinación de salones',
};

export const MENU_PREFERENCE_LABELS: Record<MenuPreference, string> = {
  three_course: 'Menú de 3 tiempos',
  five_six_course: 'Menú de 5 a 6 tiempos',
  chefs_table: "Chef's Table",
  other: 'Otro (ver comentarios)',
};

export const isEventRequestStatus = (value: string): value is EventRequestStatus =>
  (EVENT_REQUEST_STATUSES as readonly string[]).includes(value);

export const isEventType = (value: string): value is EventType => (EVENT_TYPES as readonly string[]).includes(value);

export const isEventSpace = (value: string): value is EventSpace => (EVENT_SPACES as readonly string[]).includes(value);

export const isMenuPreference = (value: string): value is MenuPreference =>
  (MENU_PREFERENCES as readonly string[]).includes(value);

export const isBudgetCurrency = (value: string): value is BudgetCurrency =>
  (BUDGET_CURRENCIES as readonly string[]).includes(value);

export const isBudgetType = (value: string): value is BudgetType => (BUDGET_TYPES as readonly string[]).includes(value);
