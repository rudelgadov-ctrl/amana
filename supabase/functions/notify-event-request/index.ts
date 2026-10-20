import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { sendEmail } from '../_shared/resend.ts';
import {
  buildAdminNotificationEmail,
  buildCustomerConfirmationEmail,
  EventRequestRecord,
} from '../_shared/eventRequestEmailTemplates.ts';

const AMANA_INBOX = 'info@amanacr.com';

// Called by the client right after a successful anonymous insert into event_requests.
// Looks up the most recent not-yet-notified request for the given email, sends the
// internal notification + customer confirmation, and marks it notified (idempotent).
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Always the same generic response — never reveal whether a matching request was found.
  const genericOk = () =>
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return genericOk();
    }

    const { email } = await req.json().catch(() => ({ email: null }));
    if (typeof email !== 'string' || !email.trim()) {
      return genericOk();
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: request, error: selectError } = await supabase
      .from('event_requests')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .is('notified_at', null)
      .gt('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (selectError) {
      console.error('notify-event-request: select failed', selectError);
      return genericOk();
    }

    if (!request) {
      console.log('notify-event-request: no matching un-notified request found');
      return genericOk();
    }

    const record = request as EventRequestRecord & { id: string };
    let adminEmailSent = false;
    let customerEmailSent = false;

    try {
      const { subject, html } = buildAdminNotificationEmail(record);
      await sendEmail({ to: AMANA_INBOX, replyTo: record.email, subject, html });
      adminEmailSent = true;
    } catch (err) {
      console.error('notify-event-request: admin notification failed', err);
    }

    try {
      const { subject, html } = buildCustomerConfirmationEmail(record);
      await sendEmail({ to: record.email, replyTo: AMANA_INBOX, subject, html });
      customerEmailSent = true;
    } catch (err) {
      console.error('notify-event-request: customer confirmation failed', err);
    }

    const { error: updateError } = await supabase
      .from('event_requests')
      .update({ notified_at: new Date().toISOString() })
      .eq('id', record.id)
      .is('notified_at', null);

    if (updateError) {
      console.error('notify-event-request: failed to mark notified_at', updateError);
    }

    console.log(
      `notify-event-request: request ${record.request_code} — admin=${adminEmailSent} customer=${customerEmailSent}`
    );

    return new Response(JSON.stringify({ ok: true, adminEmailSent, customerEmailSent }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('notify-event-request: unexpected error', err);
    return genericOk();
  }
});
