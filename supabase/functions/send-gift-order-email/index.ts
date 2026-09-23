import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { sendEmail } from '../_shared/resend.ts';
import { wrapEmailHtml } from '../_shared/emailLayout.ts';
import { textToHtml } from '../_shared/html.ts';

const AMANA_INBOX = 'info@amanacr.com';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// Admin-triggered custom email for a specific gift order. The caller's Supabase Auth JWT
// (forwarded automatically by supabase.functions.invoke) scopes every query below, so the
// existing "CMS users can view/update gift orders" RLS policies are the only authorization
// check needed — a non-admin/editor caller simply gets zero rows back.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const authHeader = req.headers.get('Authorization');
    if (!supabaseUrl || !anonKey || !authHeader) {
      return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    const { orderId, templateLabel, subject, body } = await req.json().catch(() => ({}));
    if (
      typeof orderId !== 'string' ||
      !orderId.trim() ||
      typeof subject !== 'string' ||
      !subject.trim() ||
      typeof body !== 'string' ||
      !body.trim()
    ) {
      return jsonResponse({ ok: false, error: 'invalid_request' }, 400);
    }
    const label = typeof templateLabel === 'string' && templateLabel.trim() ? templateLabel.trim() : 'Personalizado';

    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    const { data: order, error: selectError } = await supabase
      .from('gift_orders')
      .select('id, email, order_code, admin_notes')
      .eq('id', orderId)
      .maybeSingle();

    if (selectError) {
      console.error('send-gift-order-email: select failed', selectError);
      return jsonResponse({ ok: false, error: 'select_failed' }, 500);
    }
    if (!order) {
      // RLS-filtered (not admin/editor) or genuinely missing — same response either way.
      return jsonResponse({ ok: false, error: 'not_found' }, 404);
    }

    await sendEmail({
      to: order.email,
      replyTo: AMANA_INBOX,
      subject,
      html: wrapEmailHtml(textToHtml(body)),
    });

    const auditLine = `[${new Date().toISOString()}] Email enviado (${label}) por ${user.email ?? user.id}: "${subject}"`;
    const nextNotes = order.admin_notes ? `${order.admin_notes}\n${auditLine}` : auditLine;

    const { error: updateError } = await supabase
      .from('gift_orders')
      .update({ admin_notes: nextNotes })
      .eq('id', order.id);

    if (updateError) {
      console.error('send-gift-order-email: failed to append audit note', updateError);
    }

    console.log(`send-gift-order-email: sent to order ${order.order_code} by ${user.email ?? user.id}`);

    return jsonResponse({ ok: true, admin_notes: nextNotes });
  } catch (err) {
    console.error('send-gift-order-email: unexpected error', err);
    const message = err instanceof Error ? err.message : 'unknown_error';
    return jsonResponse({ ok: false, error: message }, 500);
  }
});
