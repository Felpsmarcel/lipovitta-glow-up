import { createEmailWebhookHandler } from 'npm:@lovable.dev/email-js@0.1.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

type Reason = 'bounce' | 'complaint' | 'unsubscribe'
type LogStatus = 'bounced' | 'complained' | 'suppressed'

const MESSAGES: Record<Reason, string> = {
  bounce: 'Permanent bounce — email address is invalid or rejected',
  complaint: 'Spam complaint — recipient marked email as spam',
  unsubscribe: 'Recipient unsubscribed',
}

async function record(
  event: { event_id: string; data?: Record<string, unknown> },
  reason: Reason,
  status: LogStatus,
) {
  const recipient = String(event.data?.recipient ?? '').toLowerCase()
  if (!recipient) {
    console.error('Email event without recipient', { event_id: event.event_id })
    return
  }

  const { error: suppressError } = await supabase
    .from('suppressed_emails')
    .upsert({ email: recipient, reason, metadata: null }, { onConflict: 'email' })

  if (suppressError) {
    console.error('Failed to upsert suppressed email', {
      event_id: event.event_id,
      code: suppressError.code,
      message: suppressError.message,
    })
    throw new Error('Failed to record suppression')
  }

  const messageId = event.data?.message_id
  const { error: logError } = await supabase.from('email_send_log').insert({
    message_id: typeof messageId === 'string' ? messageId : null,
    template_name: 'system',
    recipient_email: recipient,
    status,
    error_message: MESSAGES[reason],
    metadata: null,
  })

  if (logError) {
    console.error('Failed to insert email_send_log', {
      event_id: event.event_id,
      code: logError.code,
      message: logError.message,
    })
    throw new Error('Failed to record email event')
  }
}

const handler = createEmailWebhookHandler({
  apiKey: Deno.env.get('LOVABLE_API_KEY')!,
  on: {
    'email.bounced': async (event) => {
      await record(event, 'bounce', 'bounced')
    },
    'email.complaint': async (event) => {
      await record(event, 'complaint', 'complained')
    },
    'email.unsubscribed': async (event) => {
      await record(event, 'unsubscribe', 'suppressed')
    },
  },
})

Deno.serve((req) => handler(req))
