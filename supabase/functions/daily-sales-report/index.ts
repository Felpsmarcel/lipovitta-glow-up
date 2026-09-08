import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'
import { validateDailySalesReport } from '../_shared/transactional-email-templates/daily-sales-report.tsx'

// Daily sales digest, 09:00 America/Bahia.
// Triggered by pg_cron (shared secret header) or manually by an admin session.
// Recipients are allowlisted server-side; the request body cannot choose them.

const TEMPLATE_NAME = 'daily-sales-report'

const RECIPIENTS = [
  'ffmconsultoria@gmail.com',
  'pedrogmneto@hotmail.com',
  'Emersoncopywriter21@gmail.com',
]

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json({ error: 'Server configuration error' }, 500)
  }

  const admin = createClient(supabaseUrl, serviceKey)

  // --- Authorization: internal job token (cron) OR admin session ---
  const providedSecret = req.headers.get('x-cron-secret') ?? ''
  let authorized = false
  let trigger = 'manual'

  if (providedSecret) {
    const { data: tokenRow } = await admin
      .from('internal_job_tokens')
      .select('token')
      .eq('job_name', 'daily-sales-report')
      .maybeSingle()
    if (tokenRow?.token && timingSafeEqual(providedSecret, tokenRow.token)) {
      authorized = true
      trigger = 'cron'
    }
  }

  if (!authorized) {
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!/^Bearer\s+.+/i.test(authHeader)) return json({ error: 'Unauthorized' }, 401)
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: userData, error: userError } = await userClient.auth.getUser()
    if (userError || !userData?.user) return json({ error: 'Unauthorized' }, 401)
    const { data: isAdmin, error: roleError } = await userClient.rpc('has_role', {
      _user_id: userData.user.id,
      _role: 'admin',
    })
    if (roleError) {
      console.error('Role check failed', { code: roleError.code })
      return json({ error: 'Authorization check failed' }, 500)
    }
    if (!isAdmin) return json({ error: 'Forbidden' }, 403)
    authorized = true
    trigger = 'manual'
  }


  // --- Build the report ---
  const reportDay = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Bahia' }),
  )
  const reportDate = `${reportDay.getFullYear()}-${String(reportDay.getMonth() + 1).padStart(2, '0')}-${String(reportDay.getDate()).padStart(2, '0')}`

  const { data: report, error: reportError } = await admin.rpc('daily_sales_report', {
    _report_date: reportDate,
  })
  if (reportError || !report) {
    console.error('Failed to build daily report', { code: reportError?.code })
    return json({ error: 'Failed to build report' }, 500)
  }

  const templateData = {
    reportDate: report.report_date,
    yesterdayDate: report.yesterday_date,
    yesterday: report.yesterday,
    today: report.today,
    topProducts: (report.top_products ?? []).map((p: Record<string, unknown>) => ({
      name: String(p.name ?? 'não informado'),
      orders: Number(p.orders ?? 0),
    })),
    bySource: (report.by_utm_source ?? []).map((s: Record<string, unknown>) => ({
      source: String(s.source ?? 'direto'),
      orders: Number(s.orders ?? 0),
    })),
  }

  const validationErrors = validateDailySalesReport(templateData)
  if (validationErrors.length > 0) {
    console.error('Report data invalid', { count: validationErrors.length })
    return json({ error: 'Report data invalid', details: validationErrors }, 500)
  }

  // --- Send, one recipient at a time, deduped per day ---
  const results: Record<string, unknown>[] = []

  for (const recipient of RECIPIENTS) {
    const idempotencyKey = `lipovitta:daily-sales-report:${reportDate}:${recipient.toLowerCase()}`

    const { data: existing } = await admin
      .from('email_send_log')
      .select('id, status, created_at, message_id')
      .eq('template_name', TEMPLATE_NAME)
      .eq('recipient_email', recipient)
      .contains('metadata', { idempotency_key: idempotencyKey })
      .maybeSingle()

    if (existing) {
      results.push({ recipient, skipped: true, reason: 'already_sent_today', existing })
      continue
    }

    try {
      const result = await sendTemplateEmail(TEMPLATE_NAME, recipient, {
        templateData,
        idempotencyKey,
      })
      const status = result.sent ? 'sent' : 'suppressed'
      const messageId = result.sent ? result.messageId : null
      const { data: logged } = await admin
        .from('email_send_log')
        .insert({
          template_name: TEMPLATE_NAME,
          recipient_email: recipient,
          status,
          message_id: messageId,
          metadata: { idempotency_key: idempotencyKey, report_date: reportDate, trigger },
        })
        .select('id, created_at')
        .maybeSingle()

      results.push({ recipient, status, message_id: messageId, logged_at: logged?.created_at ?? null })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown send failure'
      console.error('Daily report send failed', { message })
      await admin.from('email_send_log').insert({
        template_name: TEMPLATE_NAME,
        recipient_email: recipient,
        status: 'failed',
        error_message: message,
        metadata: { idempotency_key: idempotencyKey, report_date: reportDate, trigger },
      })
      results.push({ recipient, status: 'failed', message })
    }
  }

  return json({ success: true, report_date: reportDate, trigger, results })
})
