import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

// Internal notification address — never taken from the request body.
const NOTIFY_EMAIL = 'lipovitta@clarinhacbr.com.br'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function formatDate(value: string | null): string {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleString('pt-BR')
  } catch {
    return '-'
  }
}

async function logSend(
  supabase: ReturnType<typeof createClient>,
  templateName: string,
  status: 'sent' | 'suppressed' | 'failed',
  errorMessage?: string,
) {
  const { error } = await supabase.from('email_send_log').insert({
    template_name: templateName,
    recipient_email: NOTIFY_EMAIL,
    status,
    error_message: errorMessage ?? null,
  })
  if (error) {
    console.error('Failed to write email_send_log', { code: error.code, message: error.message })
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !supabaseServiceKey) {
    return json({ error: 'Server configuration error' }, 500)
  }

  let type: string
  let applicationId: string
  try {
    const body = await req.json()
    type = String(body?.type ?? '')
    applicationId = String(body?.applicationId ?? '')
  } catch {
    return json({ error: 'Invalid JSON in request body' }, 400)
  }

  if (type !== 'affiliate' && type !== 'partner') {
    return json({ error: 'type must be "affiliate" or "partner"' }, 400)
  }
  if (!UUID_RE.test(applicationId)) {
    return json({ error: 'applicationId must be a UUID' }, 400)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const templateName =
    type === 'affiliate' ? 'new-affiliate-application' : 'new-commercial-partner-application'

  let templateData: Record<string, unknown>

  if (type === 'affiliate') {
    const { data, error } = await supabase
      .from('affiliate_applications')
      .select('id, full_name, phone, email, followers_range, state, knows_product, created_at')
      .eq('id', applicationId)
      .maybeSingle()

    if (error) {
      console.error('Failed to load affiliate application', { code: error.code, message: error.message })
      return json({ error: 'Failed to load application' }, 500)
    }
    if (!data) return json({ error: 'Application not found' }, 404)

    templateData = {
      fullName: data.full_name,
      phone: data.phone,
      email: data.email,
      followersRange: data.followers_range,
      state: data.state,
      knowsProduct: data.knows_product,
      submittedAt: formatDate(data.created_at),
    }
  } else {
    const { data, error } = await supabase
      .from('commercial_partner_applications')
      .select(
        'id, responsible_name, phone, email, cnpj, company_name, business_type, city, state, volume_notes, created_at',
      )
      .eq('id', applicationId)
      .maybeSingle()

    if (error) {
      console.error('Failed to load partner application', { code: error.code, message: error.message })
      return json({ error: 'Failed to load application' }, 500)
    }
    if (!data) return json({ error: 'Application not found' }, 404)

    templateData = {
      responsibleName: data.responsible_name,
      phone: data.phone,
      email: data.email,
      cnpj: data.cnpj,
      companyName: data.company_name,
      businessType: data.business_type,
      city: data.city,
      state: data.state,
      volumeNotes: data.volume_notes || '-',
      submittedAt: formatDate(data.created_at),
    }
  }

  try {
    const result = await sendTemplateEmail(templateName, NOTIFY_EMAIL, {
      templateData,
      idempotencyKey: `${templateName}-${applicationId}`,
    })

    if (!result.sent) {
      await logSend(supabase, templateName, 'suppressed')
      return json({ success: false, reason: result.reason })
    }

    await logSend(supabase, templateName, 'sent')
    return json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown send failure'
    console.error('Failed to send application notification', { templateName, message })
    await logSend(supabase, templateName, 'failed', message)
    return json({ error: 'Failed to send notification' }, 500)
  }
})
