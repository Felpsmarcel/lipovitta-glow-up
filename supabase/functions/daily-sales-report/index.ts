import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import {
  renderTemplatePreview,
  sendTemplateEmail,
} from '../_shared/transactional-email-templates/send-email.ts'
import { validateDailySalesReport } from '../_shared/transactional-email-templates/daily-sales-report.tsx'

// Daily sales digest, 09:00 America/Bahia.
// Modes:
//   send       — cron (shared secret header) or admin session; sends to the allowlist
//   preview    — admin only, read-only, renders html/text with real data
//   conference — admin only, one allowlisted recipient, "CONFERÊNCIA" notice
// Recipients are allowlisted server-side; the request body cannot choose them.

const TEMPLATE_NAME = 'daily-sales-report'

const RECIPIENTS = [
  'ffmconsultoria@gmail.com',
  'pedrogmneto@hotmail.com',
  'Emersoncopywriter21@gmail.com',
]

const CONFERENCE_TITLE = 'CONFERÊNCIA - NÃO GERAR NOVA EXPEDIÇÃO'
const CONFERENCE_TEXT =
  'Envio de conferência solicitado por um administrador. Nenhuma expedição, cobrança ou automação deve ser gerada a partir deste e-mail.'

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

function bahiaToday(): string {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bahia' }))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// deno-lint-ignore no-explicit-any
function mapOrders(list: any): Record<string, unknown>[] {
  if (!Array.isArray(list)) return []
  // deno-lint-ignore no-explicit-any
  return list.map((o: any) => ({
    order_id: String(o?.order_id ?? ''),
    order_number: String(o?.order_number ?? o?.order_id ?? ''),
    status: String(o?.status ?? 'desconhecido'),
    paid_at: String(o?.paid_at ?? ''),
    paid_at_provenance: String(o?.paid_at_provenance ?? 'event_received_at'),
    paid_source: String(o?.paid_source ?? 'desconhecido'),
    cancelled: o?.cancelled === true,
    value_total: Number(o?.value_total ?? 0),
    // deno-lint-ignore no-explicit-any
    items: (Array.isArray(o?.items) ? o.items : []).map((i: any) => ({
      name: String(i?.name ?? 'não informado'),
      sku: String(i?.sku ?? 'sem SKU'),
      quantity: Number(i?.quantity ?? 1),
      variant: i?.variant ? String(i.variant) : null,
    })),
    gift: o?.gift
      ? {
          code: String(o.gift.code ?? ''),
          name: String(o.gift.name ?? ''),
          quantity: Number(o.gift.quantity ?? 1),
          source: String(o.gift.source ?? 'desconhecido'),
        }
      : null,
    gift_pending: o?.gift_pending === true,
    order_missing: o?.order_missing === true,
  }))
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

  // deno-lint-ignore no-explicit-any
  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const mode = ['send', 'preview', 'conference', 'schedule'].includes(String(body?.mode))
    ? String(body.mode)
    : 'send'

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

  if (mode !== 'send' && trigger !== 'manual') {
    return json({ error: 'Preview and conference require an admin session' }, 403)
  }

  // --- Read-only: real state of the scheduled job ---
  if (mode === 'schedule') {
    const { data: schedule, error: scheduleError } = await admin.rpc('daily_report_schedule_status')
    if (scheduleError) {
      console.error('Failed to read schedule status', { code: scheduleError.code })
      return json({ error: 'Failed to read schedule status' }, 500)
    }
    return json({ schedule })
  }



  // --- Build the report ---
  const requestedDate = typeof body?.report_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.report_date)
    ? body.report_date
    : null
  if (requestedDate && trigger !== 'manual') {
    return json({ error: 'report_date requires an admin session' }, 403)
  }
  const reportDate = requestedDate ?? bahiaToday()

  const { data: report, error: reportError } = await admin.rpc('daily_sales_report', {
    _report_date: reportDate,
  })
  if (reportError || !report) {
    console.error('Failed to build daily report', { code: reportError?.code })
    return json({ error: 'Failed to build report' }, 500)
  }

  const yesterdayOrders = mapOrders(report.yesterday_orders)
  const todayOrders = mapOrders(report.today_orders)

  const templateData: Record<string, unknown> = {
    reportDate: report.report_date,
    yesterdayDate: report.yesterday_date,
    yesterday: report.yesterday,
    today: report.today,
    yesterdayOrders,
    todayOrders,
    topProducts: (report.top_products ?? []).map((p: Record<string, unknown>) => ({
      name: String(p.name ?? 'não informado'),
      orders: Number(p.orders ?? 0),
    })),
    bySource: (report.by_utm_source ?? []).map((s: Record<string, unknown>) => ({
      source: String(s.source ?? 'direto'),
      orders: Number(s.orders ?? 0),
    })),
  }
  if (mode === 'conference') {
    templateData.noticeTitle = CONFERENCE_TITLE
    templateData.noticeText = CONFERENCE_TEXT
  }

  const validationErrors = validateDailySalesReport(templateData)
  if (validationErrors.length > 0) {
    console.error('Report data invalid', { count: validationErrors.length })
    return json({ error: 'Report data invalid', details: validationErrors }, 422)
  }

  const allOrders = [...yesterdayOrders, ...todayOrders]
  const contentStats = {
    orders_count: allOrders.length,
    items_count: allOrders.reduce(
      (acc, o) => acc + (o.items as unknown[]).length,
      0,
    ),
    gifts_count: allOrders.filter((o) => o.gift).length,
    gift_pending_count: allOrders.filter((o) => o.gift_pending).length,
    order_ids: allOrders.map((o) => o.order_id),
  }

  // --- Read-only preview ---
  if (mode === 'preview') {
    const rendered = await renderTemplatePreview(TEMPLATE_NAME, templateData)
    return json({
      success: true,
      mode,
      report_date: reportDate,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      content_hash: rendered.contentHash,
      content_stats: contentStats,
    })
  }

  // --- Recipients ---
  let recipients = RECIPIENTS
  if (mode === 'conference') {
    const requested = String(body?.recipient ?? '').trim()
    const match = RECIPIENTS.find((r) => r.toLowerCase() === requested.toLowerCase())
    if (!match) return json({ error: 'Recipient not allowed' }, 403)
    recipients = [match]
  }

  const results: Record<string, unknown>[] = []
  let anyFailure = false

  for (const recipient of recipients) {
    const idempotencyKey =
      mode === 'conference'
        ? `lipovitta:daily-sales-report-conference:${reportDate}:${recipient.toLowerCase()}`
        : `lipovitta:daily-sales-report:${reportDate}:${recipient.toLowerCase()}`

    // Só um envio já aceito ou suprimido bloqueia a repetição; 'failed' pode ser reprocessado.
    const { data: existing } = await admin
      .from('email_send_log')
      .select('id, status, created_at, message_id')
      .eq('template_name', TEMPLATE_NAME)
      .eq('recipient_email', recipient)
      .in('status', ['sent', 'suppressed'])
      .contains('metadata', { idempotency_key: idempotencyKey })
      .maybeSingle()

    if (existing) {
      results.push({
        recipient,
        status: 'skipped',
        skipped: true,
        reason: 'already_sent',
        previous_status: existing.status,
        message_id: existing.message_id ?? null,
        logged_at: existing.created_at,
      })
      continue
    }

    try {
      const result = await sendTemplateEmail(TEMPLATE_NAME, recipient, {
        templateData,
        idempotencyKey,
        subjectOverride: mode === 'conference' ? `${CONFERENCE_TITLE} — Vendas ${report.yesterday_date}` : undefined,
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
          metadata: {
            idempotency_key: idempotencyKey,
            report_date: reportDate,
            trigger,
            mode,
            delivery_state: result.sent ? result.deliveryState : 'suppressed',
            provider_status: result.sent ? result.providerStatus : null,
            workflow_id: result.sent ? result.workflowId : null,
            content_hash: result.sent ? result.contentHash : null,
            html_bytes: result.sent ? result.htmlBytes : null,
            text_bytes: result.sent ? result.textBytes : null,
            ...contentStats,
          },
        })
        .select('id, created_at')
        .maybeSingle()

      results.push({
        recipient,
        status,
        delivery_state: result.sent ? result.deliveryState : 'suppressed',
        message_id: messageId,
        content_hash: result.sent ? result.contentHash : null,
        logged_at: logged?.created_at ?? null,
      })
    } catch (error) {
      anyFailure = true
      const message = error instanceof Error ? error.message : 'Unknown send failure'
      console.error('Daily report send failed', { message })
      await admin.from('email_send_log').insert({
        template_name: TEMPLATE_NAME,
        recipient_email: recipient,
        status: 'failed',
        error_message: message,
        metadata: {
          idempotency_key: idempotencyKey,
          report_date: reportDate,
          trigger,
          mode,
          ...contentStats,
        },
      })
      results.push({ recipient, status: 'failed', message })
    }
  }

  return json(
    {
      success: !anyFailure,
      mode,
      report_date: reportDate,
      trigger,
      content_stats: contentStats,
      results,
    },
    anyFailure ? 207 : 200,
  )
})
