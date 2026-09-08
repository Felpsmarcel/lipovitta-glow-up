import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'
import { validateFulfillmentOrderCheck } from '../_shared/transactional-email-templates/fulfillment-order-check-test.tsx'

// Admin-only, fixed-content operational test send.
// Recipients are allowlisted server-side and the payload is hardcoded:
// the caller cannot choose the address, the template, or the content.

const TEMPLATE_NAME = 'fulfillment-order-check-test'
const ROUND = 'v3'

const ALLOWED_RECIPIENTS: Record<string, string> = {
  'ffmconsultoria@gmail.com': 'ffmconsultoria@gmail.com',
  'pedrogmneto@hotmail.com': 'pedrogmneto@hotmail.com',
  'emersoncopywriter21@gmail.com': 'Emersoncopywriter21@gmail.com',
}

const TEMPLATE_DATA = {
  orderNumber: '81',
  orderId: '171546108',
  status: 'on_carriage (em transporte)',
  statusDate: '02/09/2026',
  createdDate: '31/08/2026',
  buyerName: 'Jamille Neiva',
  buyerEmail: 'bilessa_@hotmail.com',
  buyerPhone: '+55 71 99984-1512',
  items: [
    { name: 'Cápsulas Lipovitta', sku: 'LIP-CAPS-001', quantity: 1, price: 'R$ 357,00' },
    { name: 'Shot Matinal Lipovitta TANGERINA', sku: 'G9JA3SMZR', quantity: 1, price: 'R$ 170,00' },
  ],
  gift: 'brinde_raspador (raspador)',
  subtotal: 'R$ 527,00',
  discount: 'R$ 158,10 (30%)',
  subtotalAfterDiscount: 'R$ 368,90',
  total: 'R$ 386,73',
  difference: 'R$ 17,83 — rubrica não confirmada',
  unavailable: ['Endereço/CEP', 'Modalidade de pagamento', 'Transportadora', 'Código de rastreio'],
}

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceKey) return json({ error: 'Server configuration error' }, 500)

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

  let requested: string
  try {
    const body = await req.json()
    requested = String(body?.recipient ?? '').trim().toLowerCase()
  } catch {
    return json({ error: 'Invalid JSON in request body' }, 400)
  }

  const recipient = ALLOWED_RECIPIENTS[requested]
  if (!recipient) return json({ error: 'Recipient not allowed' }, 400)

  const validationErrors = validateFulfillmentOrderCheck(TEMPLATE_DATA)
  if (validationErrors.length > 0) {
    return json({ error: 'Template data invalid', details: validationErrors }, 500)
  }

  const admin = createClient(supabaseUrl, serviceKey)
  const idempotencyKey = `lipovitta:fulfillment-email-test:171546108:${requested}:${ROUND}`

  // Dedupe: skip if this exact round already produced a send for this recipient.
  const { data: existing } = await admin
    .from('email_send_log')
    .select('id, status, created_at, message_id')
    .eq('template_name', TEMPLATE_NAME)
    .eq('recipient_email', recipient)
    .contains('metadata', { idempotency_key: idempotencyKey })
    .maybeSingle()

  if (existing) {
    return json({ skipped: true, reason: 'already_sent_this_round', existing })
  }

  try {
    const result = await sendTemplateEmail(TEMPLATE_NAME, recipient, {
      templateData: TEMPLATE_DATA,
      idempotencyKey,
    })

    const status = result.sent ? 'sent' : 'suppressed'
    const { data: logged } = await admin
      .from('email_send_log')
      .insert({
        template_name: TEMPLATE_NAME,
        recipient_email: recipient,
        status,
        metadata: { idempotency_key: idempotencyKey, round: ROUND, order_id: '171546108' },
      })
      .select('id, created_at')
      .maybeSingle()

    return json({
      success: result.sent,
      status,
      recipient,
      idempotency_key: idempotencyKey,
      logged_at: logged?.created_at ?? null,
      log_id: logged?.id ?? null,
      payload_fields: Object.keys(TEMPLATE_DATA).length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown send failure'
    console.error('Fulfillment test send failed', { message })
    await admin.from('email_send_log').insert({
      template_name: TEMPLATE_NAME,
      recipient_email: recipient,
      status: 'failed',
      error_message: message,
      metadata: { idempotency_key: idempotencyKey, round: ROUND },
    })
    return json({ error: 'Send failed', status: 'failed', recipient, message }, 500)
  }
})
