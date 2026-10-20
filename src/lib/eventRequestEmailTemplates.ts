// Prefill copy for the admin "Enviar correo" compose box in EventRequestDetailDialog.
// Kept free of React/Supabase, mirroring src/lib/giftEmailTemplates.ts. Written in the language the
// customer used on the form ("usted" in Spanish). Subject/body are always editable before sending.

import { formatEventDate } from './eventRequests';

export const EVENT_EMAIL_TEMPLATE_KEYS = ['proposal_sent', 'more_info', 'advance_received', 'event_reminder', 'custom'] as const;
export type EventEmailTemplateKey = (typeof EVENT_EMAIL_TEMPLATE_KEYS)[number];

export const EVENT_EMAIL_TEMPLATE_LABELS: Record<EventEmailTemplateKey, string> = {
  proposal_sent: 'Propuesta enviada',
  more_info: 'Solicitar más información',
  advance_received: 'Adelanto recibido / reserva confirmada',
  event_reminder: 'Recordatorio del evento',
  custom: 'Personalizado',
};

export interface EventEmailRequestContext {
  name: string;
  requestCode: string;
  eventDate: string; // YYYY-MM-DD
  guests: number;
  language: 'es' | 'en';
}

export interface EventEmailTemplate {
  subject: string;
  body: string;
}

const firstNameOf = (name: string): string => name.trim().split(/\s+/)[0] ?? name;

export const getEventRequestEmailTemplate = (
  key: EventEmailTemplateKey,
  request: EventEmailRequestContext
): EventEmailTemplate => {
  const date = formatEventDate(request.eventDate, request.language);
  const firstName = firstNameOf(request.name);
  const code = request.requestCode;

  if (request.language === 'en') {
    const greeting = `Hi ${firstName},`;
    const signOff = 'Best regards,\nThe Amana team';
    const people = `${request.guests} ${request.guests === 1 ? 'guest' : 'guests'}`;
    switch (key) {
      case 'proposal_sent':
        return {
          subject: `Your event proposal — request ${code}`,
          body: `${greeting}\n\nThank you for considering Amana for your event on ${date} (${people}). Here is our proposal:\n\n[Proposal details: space, menu, drinks, price]\n\nTo confirm, simply reply to this email. Depending on the date and number of guests, we may require an advance payment.\n\n${signOff}`,
        };
      case 'more_info':
        return {
          subject: `A few details about your event — request ${code}`,
          body: `${greeting}\n\nThank you for your request for ${date}. To prepare a tailored proposal, it would help us to know:\n\n[Questions]\n\n${signOff}`,
        };
      case 'advance_received':
        return {
          subject: `Your event is confirmed — request ${code}`,
          body: `${greeting}\n\nWe've received your advance payment, and your event on ${date} for ${people} is confirmed. Thank you!\n\n[Final details: arrival time, menu, setup]\n\n${signOff}`,
        };
      case 'event_reminder':
        return {
          subject: `Reminder: your event at Amana — ${date}`,
          body: `${greeting}\n\nJust a reminder that your event at Amana is on ${date}, for ${people}. We look forward to welcoming you!\n\n[Time, address or details to confirm]\n\n${signOff}`,
        };
      case 'custom':
      default:
        return {
          subject: `Request ${code} — Amana`,
          body: `${greeting}\n\n\n\n${signOff}`,
        };
    }
  }

  const greeting = `Hola ${firstName},`;
  const signOff = 'Saludos,\nEl equipo de Amana';
  const people = `${request.guests} ${request.guests === 1 ? 'persona' : 'personas'}`;
  switch (key) {
    case 'proposal_sent':
      return {
        subject: `Propuesta para su evento — solicitud ${code}`,
        body: `${greeting}\n\nGracias por considerar Amana para su evento del ${date} (${people}). Le compartimos nuestra propuesta:\n\n[Detalle de la propuesta: espacio, menú, bebidas, precio]\n\nPara confirmar, solo responda este correo. Según la fecha y el número de personas, podríamos requerir un adelanto.\n\n${signOff}`,
      };
    case 'more_info':
      return {
        subject: `Algunos detalles sobre su evento — solicitud ${code}`,
        body: `${greeting}\n\nGracias por su solicitud para el ${date}. Para preparar una propuesta a la medida, nos ayudaría saber:\n\n[Preguntas]\n\n${signOff}`,
      };
    case 'advance_received':
      return {
        subject: `Su evento está confirmado — solicitud ${code}`,
        body: `${greeting}\n\nRecibimos su adelanto y su evento del ${date} para ${people} queda confirmado. ¡Muchas gracias!\n\n[Detalles finales: hora de llegada, menú, montaje]\n\n${signOff}`,
      };
    case 'event_reminder':
      return {
        subject: `Recordatorio: su evento en Amana — ${date}`,
        body: `${greeting}\n\nLe recordamos que su evento en Amana es el ${date}, para ${people}. ¡Les esperamos!\n\n[Hora, dirección o detalles a confirmar]\n\n${signOff}`,
      };
    case 'custom':
    default:
      return {
        subject: `Solicitud ${code} — Amana`,
        body: `${greeting}\n\n\n\n${signOff}`,
      };
  }
};
