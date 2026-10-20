import { describe, it, expect } from 'vitest';
import {
  EVENT_EMAIL_TEMPLATE_KEYS,
  EVENT_EMAIL_TEMPLATE_LABELS,
  getEventRequestEmailTemplate,
  EventEmailRequestContext,
} from './eventRequestEmailTemplates';
import { formatEventDate } from './eventRequests';

const baseRequest: EventEmailRequestContext = {
  name: 'Ana María Rojas',
  requestCode: 'EV-2026-0007',
  eventDate: '2026-10-24',
  guests: 15,
  language: 'es',
};

describe('formatEventDate', () => {
  it('formats the calendar date per language without shifting the day', () => {
    expect(formatEventDate('2026-10-24', 'es')).toBe('sábado 24 de octubre de 2026');
    expect(formatEventDate('2026-10-24', 'en')).toBe('Saturday, October 24, 2026');
  });
});

describe('getEventRequestEmailTemplate', () => {
  it('labels every template key', () => {
    expect(EVENT_EMAIL_TEMPLATE_KEYS).toEqual(['proposal_sent', 'more_info', 'advance_received', 'event_reminder', 'custom']);
    EVENT_EMAIL_TEMPLATE_KEYS.forEach((key) => expect(EVENT_EMAIL_TEMPLATE_LABELS[key]).toBeTruthy());
  });

  it('fills first name, code, date and guests in Spanish ("usted")', () => {
    const { subject, body } = getEventRequestEmailTemplate('proposal_sent', baseRequest);
    expect(subject).toContain('EV-2026-0007');
    expect(body).toContain('Hola Ana,');
    expect(body).toContain('sábado 24 de octubre de 2026');
    expect(body).toContain('15 personas');
    expect(body).toContain('El equipo de Amana');
  });

  it('switches to English for English-speaking customers', () => {
    const { subject, body } = getEventRequestEmailTemplate('advance_received', { ...baseRequest, language: 'en', guests: 1 });
    expect(subject).toBe('Your event is confirmed — request EV-2026-0007');
    expect(body).toContain('Hi Ana,');
    expect(body).toContain('Saturday, October 24, 2026');
    expect(body).toContain('1 guest ');
  });

  it('gives a blank skeleton for custom emails', () => {
    const { subject, body } = getEventRequestEmailTemplate('custom', baseRequest);
    expect(subject).toBe('Solicitud EV-2026-0007 — Amana');
    expect(body.startsWith('Hola Ana,')).toBe(true);
    expect(body.endsWith('El equipo de Amana')).toBe(true);
  });
});
