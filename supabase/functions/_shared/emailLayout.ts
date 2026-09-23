// Minimal branded HTML shell shared by every gift-order email.
// Amana brand colors (from src/index.css): blueberry #002A3A, yolk #E3FF4D, sand #DAD8C9.

export const wrapEmailHtml = (bodyHtml: string): string => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0; padding:0; background-color:#DAD8C9; font-family:Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#DAD8C9; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#FFFFFF; border-radius:12px; overflow:hidden;">
            <tr>
              <td style="background-color:#002A3A; padding:24px 32px;">
                <span style="color:#E3FF4D; font-size:22px; font-weight:bold; letter-spacing:0.05em;">AMANA</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px; color:#002A3A; font-size:15px; line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 24px; color:#7A9A8A; font-size:12px;">
                Amana · Barrio Escalante, San José, Costa Rica
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
