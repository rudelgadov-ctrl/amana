interface SendEmailArgs {
  to: string;
  from?: string;
  replyTo?: string;
  subject: string;
  html: string;
}

// Sends one email via Resend's REST API. Throws on any non-2xx response —
// callers decide whether that should block a wider operation or just be logged.
export const sendEmail = async ({ to, from, replyTo, subject, html }: SendEmailArgs): Promise<void> => {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from ?? 'Amana <info@amanacr.com>',
      to: [to],
      reply_to: replyTo,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(`resend_failed:${res.status}:${details}`);
  }
};
