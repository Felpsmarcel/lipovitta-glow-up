import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { EmailAPIError, sendLovableEmail } from 'npm:@lovable.dev/email-js@0.1.0'
import { TEMPLATES } from './registry.ts'

// Server-only: reads LOVABLE_API_KEY. Import from edge functions only — never
// expose sending to the browser.

// Configuration baked in at scaffold time
const SITE_NAME = "LipoVitta Transformation"
// SENDER_DOMAIN is the verified sender subdomain FQDN (e.g., "notify.example.com").
// It MUST match the subdomain delegated to Lovable's nameservers. NEVER use the root domain.
const SENDER_DOMAIN = "notify.lipovitta.site"
// FROM_DOMAIN is the domain shown in the From: header (e.g., "example.com").
// Can be the root domain when display_from_root is enabled — this is cosmetic only.
const FROM_DOMAIN = "lipovitta.site"

export type SendTemplateEmailResult =
  | {
      sent: true
      /** Aceito pela API de e-mail — não é confirmação de entrega na caixa. */
      deliveryState: 'accepted_by_provider'
      messageId: string | null
      workflowId: string | null
      providerStatus: string | null
      contentHash: string
      htmlBytes: number
      textBytes: number
    }
  | { sent: false; reason: 'recipient_suppressed' }

export interface SendTemplateEmailOptions {
  templateData?: Record<string, any>
  /** Dedupes retries of the same logical send; defaults to a random UUID (no dedupe). */
  idempotencyKey?: string
  replyTo?: string
  /** Substitui o assunto do template (usado em envios de conferência). */
  subjectOverride?: string
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Renders a registered template and sends it through Lovable's managed email
 * API. Suppression, retries, and rate limits are enforced by Lovable
 * server-side. A suppressed recipient is an expected outcome
 * ({ sent: false }); any other failure throws — EmailAPIError exposes
 * .code and .status for branching.
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {}
): Promise<SendTemplateEmailResult> {
  const apiKey = Deno.env.get('LOVABLE_API_KEY')
  if (!apiKey) {
    throw new Error('LOVABLE_API_KEY is not configured')
  }

  const template = TEMPLATES[templateName]
  if (!template) {
    throw new Error(
      `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`
    )
  }

  // Template-level `to` takes precedence — notification templates always
  // send to their fixed address.
  const recipient = template.to || to
  if (!recipient) {
    throw new Error('Recipient is required (the template defines no fixed recipient)')
  }

  const templateData = options.templateData ?? {}
  const element = React.createElement(template.component, templateData)
  const html = await renderAsync(element)
  const text = await renderAsync(element, { plainText: true })
  const subject =
    options.subjectOverride ??
    (typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject)
  const contentHash = await sha256Hex(`${subject}\n${html}`)

  let messageId: string | null = null
  let workflowId: string | null = null
  let providerStatus: string | null = null
  try {
    const response: any = await sendLovableEmail(
      {
        to: recipient,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject,
        html,
        text,
        purpose: 'transactional',
        label: templateName,
        idempotency_key: options.idempotencyKey || crypto.randomUUID(),
        reply_to: options.replyTo,
      },
      { apiKey, sendUrl: Deno.env.get('LOVABLE_SEND_URL') }
    )
    // Contrato do SDK 0.1.0: { success, message_id?, workflow_id?, status? }
    const raw = response?.message_id ?? null
    messageId = raw ? String(raw) : null
    workflowId = response?.workflow_id ? String(response.workflow_id) : null
    providerStatus = response?.status ? String(response.status) : null
  } catch (error) {
    if (error instanceof EmailAPIError && error.code === 'recipient_suppressed') {
      return { sent: false, reason: 'recipient_suppressed' }
    }
    throw error
  }

  return {
    sent: true,
    deliveryState: 'accepted_by_provider',
    messageId,
    workflowId,
    providerStatus,
    contentHash,
    htmlBytes: html.length,
    textBytes: text.length,
  }
}

/** Renderiza um template registrado sem enviar (prévia somente leitura). */
export async function renderTemplatePreview(
  templateName: string,
  templateData: Record<string, any>,
  subjectOverride?: string,
): Promise<{ subject: string; html: string; text: string; contentHash: string }> {
  const template = TEMPLATES[templateName]
  if (!template) throw new Error(`Template '${templateName}' not found`)
  const element = React.createElement(template.component, templateData)
  const html = await renderAsync(element)
  const text = await renderAsync(element, { plainText: true })
  const subject =
    subjectOverride ??
    (typeof template.subject === 'function' ? template.subject(templateData) : template.subject)
  return { subject, html, text, contentHash: await sha256Hex(`${subject}\n${html}`) }
}
