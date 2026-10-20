// Copy for the two AUTOMATIC event-request emails (admin notification + customer confirmation).
// Deliberately duplicated from src/lib/eventRequests.ts — this runs in Deno and can't import
// from the Vite app's src/ tree. Keep labels and rules in sync with that file.

import { escapeHtml } from './html.ts';
import {
  emailButton,
  emailDetailRows,
  EmailDetailRow,
  emailEyebrow,
  emailHeading,
  emailNote,
  emailOrderCard,
  emailParagraph,
  emailQuote,
  emailSignature,
  emailStrong,
  SITE_URL,
  wrapEmailHtml,
} from './emailLayout.ts';

type Language = 'es' | 'en';
type EventType = 'corporate' | 'celebration' | 'launch' | 'other';
type EventSpace = 'salon_azul' | 'salon_verde' | 'salon_principal' | 'chefs_table' | 'full_restaurant' | 'combination';
type MenuPreference = 'three_course' | 'five_six_course' | 'chefs_table' | 'other';
type BudgetCurrency = 'CRC' | 'USD';
type BudgetType = 'per_person' | 'total';

export interface EventRequestRecord {
  request_code: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  event_type: EventType;
  event_date: string; // YYYY-MM-DD
  guests: number;
  space: EventSpace;
  menu_preference: MenuPreference | null;
  budget_amount: number | null;
  budget_currency: BudgetCurrency | null;
  budget_type: BudgetType | null;
  comments: string | null;
  language: Language;
}

const EVENT_TYPE_LABELS: Record<Language, Record<EventType, string>> = {
  es: { corporate: 'Corporativo', celebration: 'Celebración', launch: 'Lanzamiento', other: 'Otro' },
  en: { corporate: 'Corporate', celebration: 'Celebration', launch: 'Launch', other: 'Other' },
};

const SPACE_LABELS: Record<Language, Record<EventSpace, string>> = {
  es: {
    salon_azul: 'Salón Azul',
    salon_verde: 'Salón Verde',
    salon_principal: 'Salón principal',
    chefs_table: "Chef's Table",
    full_restaurant: 'Restaurante completo',
    combination: 'Combinación de salones',
  },
  en: {
    salon_azul: 'Blue Room',
    salon_verde: 'Green Room',
    salon_principal: 'Main dining room',
    chefs_table: "Chef's Table",
    full_restaurant: 'Full restaurant',
    combination: 'Combination of rooms',
  },
};

const MENU_LABELS: Record<Language, Record<MenuPreference, string>> = {
  es: {
    three_course: 'Menú de 3 tiempos',
    five_six_course: 'Menú de 5 a 6 tiempos',
    chefs_table: "Chef's Table",
    other: 'Otro (ver comentarios)',
  },
  en: {
    three_course: '3-course menu',
    five_six_course: '5 to 6-course menu',
    chefs_table: "Chef's Table",
    other: 'Other (see comments)',
  },
};

const SPACE_CAPACITY: Record<EventSpace, number | null> = {
  salon_azul: 8,
  salon_verde: 12,
  salon_principal: 22,
  chefs_table: 8,
  full_restaurant: 42,
  combination: null,
};

const CUSTOM_QUOTE_GUEST_THRESHOLD = 22;

const BUDGET_TYPE_TEXT: Record<Language, Record<BudgetType, string>> = {
  es: { per_person: 'por persona', total: 'total' },
  en: { per_person: 'per person', total: 'total' },
};

// → "₡25.000 por persona" / "$3,000 total"
const formatBudget = (record: EventRequestRecord, language: Language): string | null => {
  if (!record.budget_amount || !record.budget_currency || !record.budget_type) return null;
  const grouped = Math.round(record.budget_amount)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, language === 'es' ? '.' : ',');
  const symbol = record.budget_currency === 'USD' ? '$' : '₡';
  return `${symbol}${grouped} ${BUDGET_TYPE_TEXT[language][record.budget_type]}`;
};

// Optional rows shared by both emails
const menuAndBudgetRows = (record: EventRequestRecord, language: Language): EmailDetailRow[] => {
  const rows: EmailDetailRow[] = [];
  if (record.menu_preference) {
    rows.push({ label: language === 'es' ? 'Menú' : 'Menu', value: MENU_LABELS[language][record.menu_preference] });
  }
  const budget = formatBudget(record, language);
  if (budget) rows.push({ label: language === 'es' ? 'Presupuesto' : 'Budget', value: budget });
  return rows;
};

// Date-only values are formatted in UTC so the calendar day never shifts.
const asUtcDate = (value: string) => new Date(`${value}T00:00:00Z`);
const localeOf = (language: Language) => (language === 'es' ? 'es-CR' : 'en-US');

const formatShortDate = (value: string, language: Language) =>
  new Intl.DateTimeFormat(localeOf(language), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(asUtcDate(value))
    .replace('.', '');

const formatWeekday = (value: string, language: Language) => {
  const text = new Intl.DateTimeFormat(localeOf(language), { weekday: 'long', timeZone: 'UTC' }).format(asUtcDate(value));
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const needsCustomQuote = (record: EventRequestRecord) => {
  const day = asUtcDate(record.event_date).getUTCDay();
  return day === 5 || day === 6 || record.guests > CUSTOM_QUOTE_GUEST_THRESHOLD;
};

const capacityExceeded = (record: EventRequestRecord): number | null => {
  const capacity = SPACE_CAPACITY[record.space];
  return capacity != null && record.guests > capacity ? capacity : null;
};

// Costa Rican 8-digit numbers get the 506 prefix for wa.me links.
const whatsAppHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits.length === 8 ? `506${digits}` : digits}`;
};

const guestsText = (guests: number, language: Language) =>
  language === 'es' ? `${guests} ${guests === 1 ? 'persona' : 'personas'}` : `${guests} ${guests === 1 ? 'guest' : 'guests'}`;

const summaryCard = (record: EventRequestRecord, language: Language) =>
  emailOrderCard({
    label: EVENT_TYPE_LABELS[language][record.event_type],
    orderCode: record.request_code,
    total: formatShortDate(record.event_date, language),
    breakdown: [
      formatWeekday(record.event_date, language),
      guestsText(record.guests, language),
      SPACE_LABELS[language][record.space],
    ].join(' · '),
  });

// Both builders return the complete, ready-to-send HTML document.

export const buildAdminNotificationEmail = (record: EventRequestRecord): { subject: string; html: string } => {
  const typeLabel = EVENT_TYPE_LABELS.es[record.event_type];
  const shortDate = formatShortDate(record.event_date, 'es');
  const guests = guestsText(record.guests, 'es');
  const subject = `Nueva solicitud de evento ${record.request_code} — ${typeLabel} — ${shortDate} — ${guests}`;

  const flags: string[] = [];
  if (needsCustomQuote(record)) {
    flags.push('Cotización a la medida: es viernes o sábado, o son más de 22 personas. Incluir consumo mínimo.');
  }
  const exceeded = capacityExceeded(record);
  if (exceeded) {
    flags.push(`El ${SPACE_LABELS.es[record.space]} recibe hasta ${exceeded} personas: sugerir otra opción.`);
  }

  const rows: EmailDetailRow[] = [
    { label: 'Nombre', value: record.name },
    ...(record.company ? [{ label: 'Empresa', value: record.company }] : []),
    { label: 'Correo', value: record.email, href: `mailto:${record.email}` },
    { label: 'Teléfono', value: record.phone, href: `tel:${record.phone.replace(/[^\d+]/g, '')}` },
    { label: 'WhatsApp', value: 'Abrir chat', href: whatsAppHref(record.phone) },
    ...menuAndBudgetRows(record, 'es'),
    { label: 'Idioma', value: record.language === 'en' ? 'Inglés' : 'Español' },
  ];

  const body = [
    emailEyebrow(`Nueva solicitud · ${typeLabel}`),
    emailHeading('Nueva solicitud de evento'),
    emailParagraph(
      `${emailStrong(record.name)}${record.company ? ` (${escapeHtml(record.company)})` : ''} envió una solicitud desde la página de eventos.`
    ),
    summaryCard(record, 'es'),
    flags.length ? emailNote({ title: 'Atención', contentHtml: flags.map(escapeHtml).join('<br/>') }) : '',
    emailDetailRows(rows),
    record.comments ? emailQuote({ label: 'Comentarios del cliente', text: record.comments }) : '',
    emailParagraph('Recuerda enviar la propuesta en menos de 48 horas.'),
    emailButton({ href: `${SITE_URL}/admin/event-requests`, label: 'Ver en el panel de administración →' }),
  ].join('');

  const html = wrapEmailHtml(body, {
    language: 'es',
    preheader: `${record.name} · ${typeLabel} · ${shortDate} · ${guests} · ${SPACE_LABELS.es[record.space]}`,
  });

  return { subject, html };
};

export const buildCustomerConfirmationEmail = (record: EventRequestRecord): { subject: string; html: string } => {
  const language = record.language;
  const firstName = record.name.trim().split(/\s+/)[0] ?? record.name;
  const customQuote = needsCustomQuote(record);
  const menuRows = menuAndBudgetRows(record, language);
  const companyRow = record.company ? [{ label: language === 'es' ? 'Empresa' : 'Company', value: record.company }] : [];

  if (language === 'en') {
    const subject = `We've received your event request ${record.request_code} — Amana`;
    const body = [
      emailEyebrow('Request received'),
      emailHeading('Thank you for thinking of Amana!'),
      emailParagraph(`Hi ${escapeHtml(firstName)},`),
      emailParagraph("We've received your event request. Here's a summary:"),
      summaryCard(record, 'en'),
      emailDetailRows([
        { label: 'Name', value: record.name },
        ...companyRow,
        { label: 'Phone', value: record.phone },
        ...menuRows,
      ]),
      record.comments ? emailQuote({ label: 'Your comments', text: record.comments }) : '',
      emailNote({
        title: 'Next step',
        contentHtml: `We'll send you a proposal ${emailStrong('within 48 hours')}.${
          customQuote ? ' Since it is a Friday or Saturday, or a group of more than 22, the proposal will include the minimum spend for that date.' : ''
        }`,
      }),
      emailParagraph('If you have any questions in the meantime, just reply to this email.'),
      emailSignature({ closing: 'Warm regards,', name: 'The team at Amana' }),
    ].join('');
    const html = wrapEmailHtml(body, {
      language: 'en',
      preheader: `Request ${record.request_code} · ${formatShortDate(record.event_date, 'en')} · ${guestsText(record.guests, 'en')}. We'll send you a proposal within 48 hours.`,
    });
    return { subject, html };
  }

  const subject = `Hemos recibido su solicitud de evento ${record.request_code} — Amana`;
  const body = [
    emailEyebrow('Solicitud recibida'),
    emailHeading('¡Gracias por pensar en Amana!'),
    emailParagraph(`Hola ${escapeHtml(firstName)},`),
    emailParagraph('Hemos recibido su solicitud para un evento. Este es el resumen:'),
    summaryCard(record, 'es'),
    emailDetailRows([
      { label: 'Nombre', value: record.name },
      ...companyRow,
      { label: 'Teléfono', value: record.phone },
      ...menuRows,
    ]),
    record.comments ? emailQuote({ label: 'Sus comentarios', text: record.comments }) : '',
    emailNote({
      title: 'Próximo paso',
      contentHtml: `Le enviaremos una propuesta ${emailStrong('en menos de 48 horas')}.${
        customQuote ? ' Como es viernes o sábado, o un grupo de más de 22 personas, la propuesta incluirá el consumo mínimo para esa fecha.' : ''
      }`,
    }),
    emailParagraph('Si tiene alguna pregunta mientras tanto, puede responder este mismo correo.'),
    emailSignature({ closing: 'Con cariño,', name: 'El equipo de Amana' }),
  ].join('');
  const html = wrapEmailHtml(body, {
    language: 'es',
    preheader: `Solicitud ${record.request_code} · ${formatShortDate(record.event_date, 'es')} · ${guestsText(record.guests, 'es')}. Le enviaremos una propuesta en menos de 48 horas.`,
  });
  return { subject, html };
};
