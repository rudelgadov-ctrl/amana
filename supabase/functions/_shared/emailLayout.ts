// Branded HTML shell + building blocks shared by every gift-order email.
// Brand tokens mirror src/index.css. Everything is table-based with inline styles so it
// survives Gmail, Outlook and Apple Mail alike.
//
// Logo and font files live in public/email/ and are served from amanacr.com once the site is
// published — keep those paths stable, emails already sent keep pointing at them.

import { escapeHtml } from './html.ts';

export type EmailLanguage = 'es' | 'en';

const ASSETS_URL = 'https://amanacr.com/email';
const SITE_URL = 'https://amanacr.com';
const OPENTABLE_URL = 'https://www.opentable.com/r/amana-san-jose-1160';
const INSTAGRAM_URL = 'https://www.instagram.com/amana.escalante/';
const WHATSAPP_URL = 'https://wa.me/50661436871';

const C = {
  blueberry: '#002A3A',
  yolk: '#E3FF4D',
  sand: '#DAD8C9',
  sandLight: '#F3F2EC',
  line: '#E6E4DA',
  white: '#FFFFFF',
  muted: '#587666', // asparagus, darkened to stay legible as small text on white
  mutedOnSand: '#40575E',
  onBlueberryMuted: '#B3BFC4', // eggshell at ~70% over blueberry
};

// Brand fonts load in clients that support web fonts (Apple Mail, iOS, Outlook for Mac);
// everyone else gets the fallbacks. Outlook for Windows is forced onto them in <head>,
// since it falls back to Times New Roman when the first font in a stack is missing.
const SERIF = "'Quincy CF', Georgia, 'Times New Roman', serif";
// Quincy Bold, registered at weight 400: its visual weight matches Georgia Regular, whereas
// asking for 700 would turn the Gmail/Outlook fallback into a much heavier Georgia Bold.
const SERIF_DISPLAY = "'Quincy CF Display', Georgia, 'Times New Roman', serif";
const SANS = "'Maison Neue', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const FOOTER_COPY: Record<EmailLanguage, { tagline: string; address: string; book: string; brand: string }> = {
  es: {
    tagline: 'Cocina honesta',
    address: '125m oeste del Fresh Market, Barrio Escalante, San&nbsp;José, Costa&nbsp;Rica',
    book: 'Reservar',
    brand: 'Una marca de Gastronomía GCK S.A.',
  },
  en: {
    tagline: 'Honest cooking',
    address: '125m west of Fresh Market, Barrio Escalante, San&nbsp;José, Costa&nbsp;Rica',
    book: 'Book a table',
    brand: 'A brand of Gastronomía GCK S.A.',
  },
};

// ---------------------------------------------------------------------------
// Building blocks. Each takes plain text and escapes it, unless the parameter is named *Html.
// ---------------------------------------------------------------------------

export const emailEyebrow = (text: string): string =>
  `<p style="margin:0 0 12px; font-family:${SANS}; font-size:12px; line-height:1.4; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:${C.muted};">${escapeHtml(text)}</p>`;

export const emailHeading = (text: string): string =>
  `<h1 class="am-serif am-h1" style="margin:0 0 20px; font-family:${SERIF_DISPLAY}; font-size:34px; line-height:1.12; font-weight:400; color:${C.blueberry};">${escapeHtml(text)}</h1>`;

export const emailParagraph = (contentHtml: string): string =>
  `<p style="margin:0 0 16px; font-family:${SANS}; font-size:16px; line-height:1.6; color:${C.blueberry};">${contentHtml}</p>`;

export const emailStrong = (text: string): string => `<strong style="font-weight:600;">${escapeHtml(text)}</strong>`;

// The order summary, styled after the gift card mock-up on /gift.
export const emailOrderCard = ({
  label,
  orderCode,
  total,
  breakdown,
}: {
  label: string;
  orderCode: string;
  total: string;
  breakdown: string;
}): string => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 28px;">
    <tr>
      <td bgcolor="${C.blueberry}" style="background-color:${C.blueberry}; border-radius:14px; padding:24px 28px 26px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:${SANS}; font-size:11px; line-height:1.4; font-weight:600; letter-spacing:0.22em; text-transform:uppercase; color:${C.yolk};">${escapeHtml(label)}</td>
            <td align="right" style="font-family:${SANS}; font-size:12px; line-height:1.4; letter-spacing:0.08em; color:${C.onBlueberryMuted};">${escapeHtml(orderCode)}</td>
          </tr>
          <tr>
            <td colspan="2" class="am-serif am-total" style="padding-top:30px; font-family:${SERIF_DISPLAY}; font-size:44px; line-height:1; font-weight:400; color:${C.white};">${escapeHtml(total)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:10px; font-family:${SANS}; font-size:13px; line-height:1.5; color:${C.onBlueberryMuted};">${escapeHtml(breakdown)}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;

export interface EmailDetailRow {
  label: string;
  value: string;
  href?: string;
}

export const emailDetailRows = (rows: EmailDetailRow[]): string => {
  const cellBorder = `border-top:1px solid ${C.line};`;
  const body = rows
    .map(({ label, value, href }, index) => {
      const border = index === 0 ? '' : cellBorder;
      const valueHtml = href
        ? `<a href="${escapeHtml(href)}" style="color:${C.blueberry}; text-decoration:underline;">${escapeHtml(value)}</a>`
        : escapeHtml(value);
      return `
        <tr>
          <td valign="middle" style="${border} padding:12px 16px 12px 0; font-family:${SANS}; font-size:13px; line-height:1.5; color:${C.muted}; white-space:nowrap;">${escapeHtml(label)}</td>
          <td valign="middle" align="right" style="${border} padding:12px 0; font-family:${SANS}; font-size:15px; line-height:1.5; font-weight:600; color:${C.blueberry}; word-break:break-word;">${valueHtml}</td>
        </tr>`;
    })
    .join('');
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px; border-top:1px solid ${C.line}; border-bottom:1px solid ${C.line};">
    ${body}
  </table>`;
};

// Soft sand panel for "what happens next" style copy.
export const emailNote = ({ title, contentHtml }: { title: string; contentHtml: string }): string => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
    <tr>
      <td bgcolor="${C.sandLight}" style="background-color:${C.sandLight}; border-radius:12px; padding:20px 24px;">
        <p style="margin:0 0 6px; font-family:${SANS}; font-size:12px; line-height:1.4; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:${C.muted};">${escapeHtml(title)}</p>
        <p style="margin:0; font-family:${SANS}; font-size:15px; line-height:1.6; color:${C.blueberry};">${contentHtml}</p>
      </td>
    </tr>
  </table>`;

// A customer-written message (dedication/comment), set in the display serif.
export const emailQuote = ({ label, text }: { label: string; text: string }): string => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
    <tr>
      <td style="border-left:3px solid ${C.blueberry}; padding:4px 0 4px 20px;">
        <p style="margin:0 0 8px; font-family:${SANS}; font-size:12px; line-height:1.4; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:${C.muted};">${escapeHtml(label)}</p>
        <p class="am-serif" style="margin:0; font-family:${SERIF}; font-size:19px; line-height:1.5; font-style:italic; color:${C.blueberry};">${escapeHtml(text).replace(/\n/g, '<br/>')}</p>
      </td>
    </tr>
  </table>`;

// Yolk is reserved for CTAs across the brand.
export const emailButton = ({ href, label }: { href: string; label: string }): string => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0;">
    <tr>
      <td bgcolor="${C.yolk}" style="background-color:${C.yolk}; border-radius:999px; mso-padding-alt:14px 30px;">
        <a href="${escapeHtml(href)}" style="display:inline-block; padding:14px 30px; font-family:${SANS}; font-size:15px; line-height:1.2; font-weight:600; color:${C.blueberry}; text-decoration:none; border-radius:999px;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;

export const emailSignature = ({ closing, name }: { closing: string; name: string }): string => `
  <p style="margin:32px 0 4px; font-family:${SANS}; font-size:16px; line-height:1.6; color:${C.blueberry};">${escapeHtml(closing)}</p>
  <p class="am-serif" style="margin:0; font-family:${SERIF}; font-size:24px; line-height:1.2; color:${C.blueberry};">${escapeHtml(name)}</p>`;

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

interface EmailShellOptions {
  // Inbox preview line shown next to the subject.
  preheader?: string;
  language?: EmailLanguage;
}

const fontFace = (family: string, file: string, weight: number) =>
  `@font-face { font-family: '${family}'; src: url('${ASSETS_URL}/fonts/${file}') format('opentype'); font-weight: ${weight}; font-style: normal; }`;

const footerLink = (href: string, label: string) =>
  `<a href="${href}" style="color:${C.blueberry}; text-decoration:none; font-weight:600;">${label}</a>`;

export const wrapEmailHtml = (bodyHtml: string, { preheader = '', language = 'es' }: EmailShellOptions = {}): string => {
  const footer = FOOTER_COPY[language];
  const year = new Date().getFullYear();
  const separator = `<span style="color:${C.muted};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>`;
  // Filler after the preheader keeps clients from pulling body text into the inbox preview.
  const preheaderFiller = '&#847;&zwnj;&nbsp;'.repeat(80);

  return `<!DOCTYPE html>
<html lang="${language}" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Amana</title>
    <!--[if mso]>
    <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
    <style>
      body, table, td, p, a, span, h1 { font-family: Arial, Helvetica, sans-serif !important; }
      .am-serif { font-family: Georgia, 'Times New Roman', serif !important; }
    </style>
    <![endif]-->
    <style>
      ${fontFace('Quincy CF', 'QuincyCF-Regular.otf', 400)}
      ${fontFace('Quincy CF Display', 'QuincyCF-Bold.otf', 400)}
      ${fontFace('Maison Neue', 'MaisonNeue-Book.otf', 400)}
      ${fontFace('Maison Neue', 'MaisonNeue-Demi.otf', 600)}
    </style>
    <style>
      body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
      @media only screen and (max-width: 620px) {
        .am-outer { padding: 16px 8px 24px !important; }
        .am-px { padding-left: 24px !important; padding-right: 24px !important; }
        .am-header { padding-top: 36px !important; padding-bottom: 32px !important; }
        .am-body { padding-top: 36px !important; padding-bottom: 36px !important; }
        .am-h1 { font-size: 28px !important; }
        .am-total { font-size: 36px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:${C.sand};">
    <div style="display:none; max-height:0; max-width:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:${C.sand}; opacity:0;">${escapeHtml(preheader)}${preheaderFiller}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.sand}" style="background-color:${C.sand};">
      <tr>
        <td align="center" class="am-outer" style="padding:40px 16px 32px;">
          <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:0 auto;">
            <tr>
              <td align="center" bgcolor="${C.blueberry}" class="am-px am-header" style="background-color:${C.blueberry}; border-radius:16px 16px 0 0; padding:44px 48px 40px;">
                <a href="${SITE_URL}" style="text-decoration:none;">
                  <img src="${ASSETS_URL}/amana-logo-yolk.png" width="180" height="33" alt="amana" style="display:block; width:180px; max-width:180px; height:auto; border:0; font-family:${SERIF}; font-size:30px; line-height:33px; color:${C.yolk};" />
                </a>
              </td>
            </tr>
            <tr>
              <td bgcolor="${C.white}" class="am-px am-body" style="background-color:${C.white}; border-radius:0 0 16px 16px; padding:48px 48px 44px; font-family:${SANS}; font-size:16px; line-height:1.6; color:${C.blueberry};">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td align="center" class="am-px" style="padding:36px 32px 8px;">
                <a href="${SITE_URL}" style="text-decoration:none;">
                  <img src="${ASSETS_URL}/amana-monogram-blueberry.png" width="56" height="37" alt="Amana" style="display:block; width:56px; height:auto; border:0; font-family:${SERIF}; font-size:18px; color:${C.blueberry};" />
                </a>
                <p class="am-serif" style="margin:14px 0 0; font-family:${SERIF}; font-size:18px; line-height:1.4; font-style:italic; color:${C.blueberry};">${footer.tagline}</p>
                <p style="margin:14px 0 0; font-family:${SANS}; font-size:13px; line-height:1.6; color:${C.blueberry};">${footer.address}<br />
                  <a href="tel:+50661436871" style="color:${C.blueberry}; text-decoration:none;">+506 6143-6871</a>
                </p>
                <p style="margin:16px 0 0; font-family:${SANS}; font-size:13px; line-height:1.6; color:${C.blueberry};">
                  ${footerLink(OPENTABLE_URL, footer.book)}${separator}${footerLink(INSTAGRAM_URL, 'Instagram')}${separator}${footerLink(WHATSAPP_URL, 'WhatsApp')}${separator}${footerLink(SITE_URL, 'amanacr.com')}
                </p>
                <p style="margin:20px 0 0; font-family:${SANS}; font-size:11px; line-height:1.6; color:${C.mutedOnSand};">© ${year} Amana. ${footer.brand}</p>
              </td>
            </tr>
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
