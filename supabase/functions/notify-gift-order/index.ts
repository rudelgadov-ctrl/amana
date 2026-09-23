import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { sendEmail } from '../_shared/resend.ts';
import { buildAdminNotificationEmail, buildCustomerConfirmationEmail, GiftOrderRecord } from '../_shared/giftOrderEmailTemplates.ts';

const AMANA_INBOX = 'info@amanacr.com';

// Called by the client right after a successful anonymous insert into gift_orders.
// Looks up the most recent not-yet-notified order for the given email/type, sends the
// internal notification + customer confirmation, and marks it notified (idempotent).
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Always the same generic response — never reveal whether a matching order was found.
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

    const { email, orderType } = await req.json().catch(() => ({ email: null, orderType: null }));
    if (typeof email !== 'string' || !email.trim() || (orderType !== 'chefs_table' && orderType !== 'gift_card')) {
      return genericOk();
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: order, error: selectError } = await supabase
      .from('gift_orders')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .eq('order_type', orderType)
      .is('notified_at', null)
      .gt('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (selectError) {
      console.error('notify-gift-order: select failed', selectError);
      return genericOk();
    }

    if (!order) {
      console.log('notify-gift-order: no matching un-notified order found');
      return genericOk();
    }

    const record = order as GiftOrderRecord & { id: string };
    let adminEmailSent = false;
    let customerEmailSent = false;

    try {
      const { subject, html } = buildAdminNotificationEmail(record);
      await sendEmail({ to: AMANA_INBOX, replyTo: record.email, subject, html });
      adminEmailSent = true;
    } catch (err) {
      console.error('notify-gift-order: admin notification failed', err);
    }

    try {
      const { subject, html } = buildCustomerConfirmationEmail(record);
      await sendEmail({ to: record.email, replyTo: AMANA_INBOX, subject, html });
      customerEmailSent = true;
    } catch (err) {
      console.error('notify-gift-order: customer confirmation failed', err);
    }

    const { error: updateError } = await supabase
      .from('gift_orders')
      .update({ notified_at: new Date().toISOString() })
      .eq('id', record.id)
      .is('notified_at', null);

    if (updateError) {
      console.error('notify-gift-order: failed to mark notified_at', updateError);
    }

    console.log(`notify-gift-order: order ${record.order_code} — admin=${adminEmailSent} customer=${customerEmailSent}`);

    return new Response(JSON.stringify({ ok: true, adminEmailSent, customerEmailSent }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('notify-gift-order: unexpected error', err);
    return genericOk();
  }
});
