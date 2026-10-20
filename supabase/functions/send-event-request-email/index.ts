import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { sendEmail } from '../_shared/resend.ts';
import { emailEyebrow, wrapEmailHtml } from '../_shared/emailLayout.ts';
import { textToHtml } from '../_shared/html.ts';

const AMANA_INBOX = 'info@amanacr.com';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// Admin-triggered custom email for a specific event request. The caller's Supabase Auth JWT
// (forwarded automatically by supabase.functions.invoke) scopes every query below, so the
// "CMS users can view/update event requests" RLS policies are the only authorization check
// needed — a non-admin/editor caller simply gets zero rows back.
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

    const { requestId, templateLabel, subject, body } = await req.json().catch(() => ({}));
    if (
      typeof requestId !== 'string' ||
      !requestId.trim() ||
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

    const { data: request, error: selectError } = await supabase
      .from('event_requests')
      .select('id, email, request_code, admin_notes, language')
      .eq('id', requestId)
      .maybeSingle();

    if (selectError) {
      console.error('send-event-request-email: select failed', selectError);
      return jsonResponse({ ok: false, error: 'select_failed' }, 500);
    }
    if (!request) {
      // RLS-filtered (not admin/editor) or genuinely missing — same response either way.
      return jsonResponse({ ok: false, error: 'not_found' }, 404);
    }

    const language = request.language === 'en' ? 'en' : 'es';
    const eyebrow = language === 'en' ? `Request ${request.request_code}` : `Solicitud ${request.request_code}`;

    await sendEmail({
      to: request.email,
      replyTo: AMANA_INBOX,
      subject,
      html: wrapEmailHtml(emailEyebrow(eyebrow) + textToHtml(body), {
        language,
        preheader: body.replace(/\s+/g, ' ').trim().slice(0, 140),
      }),
    });

    const auditLine = `[${new Date().toISOString()}] Email enviado (${label}) por ${user.email ?? user.id}: "${subject}"`;
    const nextNotes = request.admin_notes ? `${request.admin_notes}\n${auditLine}` : auditLine;

    const { error: updateError } = await supabase
      .from('event_requests')
      .update({ admin_notes: nextNotes })
      .eq('id', request.id);

    if (updateError) {
      console.error('send-event-request-email: failed to append audit note', updateError);
    }

    console.log(`send-event-request-email: sent to request ${request.request_code} by ${user.email ?? user.id}`);

    return jsonResponse({ ok: true, admin_notes: nextNotes });
  } catch (err) {
    console.error('send-event-request-email: unexpected error', err);
    const message = err instanceof Error ? err.message : 'unknown_error';
    return jsonResponse({ ok: false, error: message }, 500);
  }
});
