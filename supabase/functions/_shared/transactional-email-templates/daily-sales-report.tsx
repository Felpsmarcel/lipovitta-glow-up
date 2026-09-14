import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

export interface Bucket {
  paid_orders: number
  revenue_brl: number
  avg_ticket_brl: number
  waiting_orders: number
  cancelled_orders: number
  price_mismatches: number
  initiate_checkouts: number
  abandoned_checkouts: number
  gift_pending?: number
}

export interface OrderItem {
  name: string
  sku: string
  quantity: number
  variant?: string | null
}

export interface OrderGift {
  code: string
  name: string
  quantity: number
  source: string
}

export interface OrderDetail {
  order_id: string
  order_number: string
  status: string
  paid_at: string
  paid_at_provenance: string
  paid_source: string
  cancelled: boolean
  value_total: number
  items: OrderItem[]
  gift: OrderGift | null
  gift_pending: boolean
  order_missing?: boolean
}

interface Props {
  reportDate: string
  yesterdayDate: string
  yesterday: Bucket
  today: Bucket
  yesterdayOrders: OrderDetail[]
  todayOrders: OrderDetail[]
  topProducts: { name: string; orders: number }[]
  bySource: { source: string; orders: number }[]
  noticeTitle?: string
  noticeText?: string
}

const brl = (v: number) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const METRICS: { key: keyof Bucket; label: string; money?: boolean }[] = [
  { key: 'paid_orders', label: 'Pedidos pagos' },
  { key: 'revenue_brl', label: 'Faturamento', money: true },
  { key: 'avg_ticket_brl', label: 'Ticket médio', money: true },
  { key: 'waiting_orders', label: 'Aguardando pagamento' },
  { key: 'cancelled_orders', label: 'Cancelados/estornados' },
  { key: 'initiate_checkouts', label: 'Checkouts iniciados' },
  { key: 'abandoned_checkouts', label: 'Carrinhos abandonados' },
]

const GIFT_ALERT = 'BRINDE NÃO IDENTIFICADO - CONFERÊNCIA OBRIGATÓRIA'

const OrderCard = ({ order }: { order: OrderDetail }) => (
  <Section style={orderCard}>
    <Text style={orderTitle}>
      {`Pedido ${order.order_number} · ID ${order.order_id}`}
      {order.cancelled ? ' · CANCELADO/ESTORNADO' : ''}
    </Text>
    <Text style={orderMeta}>
      {`Pagamento: ${order.paid_at} (${
        order.paid_at_provenance === 'event_received_at'
          ? 'data de recebimento do evento de pagamento'
          : order.paid_at_provenance
      }) · Status atual: ${order.status} · Total: ${brl(order.value_total)}`}
    </Text>

    <Text style={blockLabel}>Itens do pedido</Text>
    {order.items.length === 0 ? (
      <Text style={alertText}>ITENS NÃO DISPONÍVEIS - CONFERÊNCIA OBRIGATÓRIA</Text>
    ) : (
      order.items.map((it, idx) => (
        <Text key={`${order.order_id}-${it.sku}-${idx}`} style={lineItem}>
          {`${it.quantity}x ${it.name} · SKU ${it.sku}`}
          {it.variant ? ` · Sabor: ${it.variant}` : ''}
        </Text>
      ))
    )}

    <Text style={blockLabel}>Brinde</Text>
    {order.gift ? (
      <Text style={giftText}>
        {`${order.gift.quantity}x ${order.gift.name} (${order.gift.code}) · origem: ${order.gift.source} · não somado ao faturamento`}
      </Text>
    ) : (
      <Text style={alertText}>{GIFT_ALERT}</Text>
    )}
  </Section>
)

const OrdersBlock = ({
  title,
  orders,
}: {
  title: string
  orders: OrderDetail[]
}) => (
  <>
    <Heading style={h2}>{title}</Heading>
    {orders.length === 0 ? (
      <Section style={card}>
        <Text style={muted}>Nenhum pedido pago neste período.</Text>
      </Section>
    ) : (
      orders.map((o) => <OrderCard key={o.order_id} order={o} />)
    )}
  </>
)

const Email = ({
  reportDate,
  yesterdayDate,
  yesterday,
  today,
  yesterdayOrders = [],
  todayOrders = [],
  topProducts = [],
  bySource = [],
  noticeTitle,
  noticeText,
}: Props) => {
  const allOrders = [...yesterdayOrders, ...todayOrders]
  const empty = allOrders.length === 0
  const pendingGifts = allOrders.filter((o) => o.gift_pending).length
  const mismatches = yesterday.price_mismatches + today.price_mismatches
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head />
      <Preview>
        {`Vendas ${yesterdayDate}: ${yesterday.paid_orders} pedidos · ${brl(yesterday.revenue_brl)}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {noticeTitle && (
            <Section style={warn}>
              <Text style={warnText}>{noticeTitle}</Text>
              {noticeText && <Text style={warnText}>{noticeText}</Text>}
            </Section>
          )}
          <Heading style={h1}>LipoVitta — Resumo de vendas</Heading>
          <Text style={intro}>
            Enviado em {reportDate} às 09h (horário da Bahia). Compara o dia
            anterior completo com as vendas de hoje até as 09h. A venda é contada
            pela evidência de pagamento do pedido, independentemente do status
            logístico. Pedidos de teste não entram nos números.
          </Text>

          {empty && (
            <Section style={warn}>
              <Text style={warnText}>
                Sem vendas registradas nos dois períodos.
              </Text>
            </Section>
          )}

          {pendingGifts > 0 && (
            <Section style={warn}>
              <Text style={warnText}>
                {`${pendingGifts} pedido(s) sem brinde identificado — ${GIFT_ALERT}`}
              </Text>
            </Section>
          )}

          <Section style={card}>
            <Section style={rowHead}>
              <Text style={colLabel}>Indicador</Text>
              <Text style={colValue}>Ontem ({yesterdayDate})</Text>
              <Text style={colValue}>Hoje até 09h</Text>
            </Section>
            {METRICS.map((m) => (
              <Section key={String(m.key)} style={row}>
                <Text style={colLabel}>{m.label}</Text>
                <Text style={colValue}>
                  {m.money ? brl(Number(yesterday[m.key] ?? 0)) : String(yesterday[m.key] ?? 0)}
                </Text>
                <Text style={colValue}>
                  {m.money ? brl(Number(today[m.key] ?? 0)) : String(today[m.key] ?? 0)}
                </Text>
              </Section>
            ))}
          </Section>

          {mismatches > 0 && (
            <Section style={warn}>
              <Text style={warnText}>
                Atenção: {mismatches} pedido(s) com divergência de preço no período.
              </Text>
            </Section>
          )}

          <OrdersBlock
            title={`Pedidos pagos — ontem (${yesterdayDate})`}
            orders={yesterdayOrders}
          />
          <OrdersBlock
            title="Pedidos pagos — hoje até 09h"
            orders={todayOrders}
          />

          <Heading style={h2}>Produtos mais vendidos ({yesterdayDate})</Heading>
          <Section style={card}>
            {topProducts.length === 0 ? (
              <Text style={muted}>Sem produtos vendidos no dia.</Text>
            ) : (
              topProducts.map((p) => (
                <Section key={p.name} style={row}>
                  <Text style={colLabel}>{p.name}</Text>
                  <Text style={colValue}>{p.orders}</Text>
                </Section>
              ))
            )}
          </Section>

          <Heading style={h2}>Origem das vendas ({yesterdayDate})</Heading>
          <Section style={card}>
            {bySource.length === 0 ? (
              <Text style={muted}>Sem origem registrada no dia.</Text>
            ) : (
              bySource.map((s) => (
                <Section key={s.source} style={row}>
                  <Text style={colLabel}>{s.source}</Text>
                  <Text style={colValue}>{s.orders}</Text>
                </Section>
              ))
            )}
          </Section>

          <Hr style={hr} />
          <Text style={footer}>LipoVitta · Relatório automático diário</Text>
        </Container>
      </Body>
    </Html>
  )
}

const BUCKET_FIELDS: (keyof Bucket)[] = [
  'paid_orders',
  'revenue_brl',
  'avg_ticket_brl',
  'waiting_orders',
  'cancelled_orders',
  'price_mismatches',
  'initiate_checkouts',
  'abandoned_checkouts',
]

function validateOrders(list: unknown, label: string, errors: string[]) {
  if (!Array.isArray(list)) {
    errors.push(`${label} must be an array`)
    return
  }
  list.forEach((entry, index) => {
    const o = entry as Record<string, unknown>
    const at = `${label}[${index}]`
    for (const field of ['order_id', 'order_number', 'status', 'paid_at']) {
      if (typeof o?.[field] !== 'string' || !(o[field] as string).trim()) {
        errors.push(`${at}.${field} is required`)
      }
    }
    if (typeof o?.value_total !== 'number' || Number.isNaN(o.value_total)) {
      errors.push(`${at}.value_total must be a number`)
    }
    if (!Array.isArray(o?.items) || (o.items as unknown[]).length === 0) {
      errors.push(`${at}.items must be a non-empty array`)
    } else {
      ;(o.items as Record<string, unknown>[]).forEach((it, i) => {
        if (typeof it?.name !== 'string' || !it.name.trim()) errors.push(`${at}.items[${i}].name is required`)
        if (typeof it?.sku !== 'string' || !it.sku.trim()) errors.push(`${at}.items[${i}].sku is required`)
        const q = Number(it?.quantity)
        if (!Number.isFinite(q) || q <= 0) errors.push(`${at}.items[${i}].quantity must be > 0`)
      })
    }
    const gift = o?.gift as Record<string, unknown> | null | undefined
    const pending = o?.gift_pending === true
    if (!gift && !pending) {
      errors.push(`${at} must carry a gift section or gift_pending flag`)
    }
    if (gift) {
      if (typeof gift.name !== 'string' || !gift.name.trim()) errors.push(`${at}.gift.name is required`)
      const q = Number(gift.quantity)
      if (!Number.isFinite(q) || q <= 0) errors.push(`${at}.gift.quantity must be > 0`)
    }
  })
}

export function validateDailySalesReport(data: Record<string, unknown>): string[] {
  const errors: string[] = []
  for (const field of ['reportDate', 'yesterdayDate']) {
    if (typeof data[field] !== 'string' || !(data[field] as string).trim()) {
      errors.push(`${field} is required`)
    }
  }
  for (const bucket of ['yesterday', 'today']) {
    const value = data[bucket]
    if (!value || typeof value !== 'object') {
      errors.push(`${bucket} must be an object`)
      continue
    }
    const candidate = value as Record<string, unknown>
    for (const field of BUCKET_FIELDS) {
      if (typeof candidate[field] !== 'number' || Number.isNaN(candidate[field])) {
        errors.push(`${bucket}.${String(field)} must be a number`)
      }
    }
  }
  for (const list of ['topProducts', 'bySource']) {
    if (!Array.isArray(data[list])) errors.push(`${list} must be an array`)
  }
  validateOrders(data.yesterdayOrders, 'yesterdayOrders', errors)
  validateOrders(data.todayOrders, 'todayOrders', errors)
  return errors
}

const emptyBucket: Bucket = {
  paid_orders: 0,
  revenue_brl: 0,
  avg_ticket_brl: 0,
  waiting_orders: 0,
  cancelled_orders: 0,
  price_mismatches: 0,
  initiate_checkouts: 0,
  abandoned_checkouts: 0,
  gift_pending: 0,
}

export const template = {
  component: Email,
  subject: (data: Partial<Props>) =>
    data?.noticeTitle
      ? `CONFERÊNCIA - NÃO GERAR NOVA EXPEDIÇÃO — Vendas de ${data?.yesterdayDate ?? ''}`
      : `LipoVitta — Vendas de ${data?.yesterdayDate ?? ''} e parcial de hoje`,
  displayName: 'Resumo diário de vendas',
  previewData: {
    reportDate: '13/09/2026',
    yesterdayDate: '12/09/2026',
    yesterday: { ...emptyBucket, paid_orders: 1, revenue_brl: 544.83, avg_ticket_brl: 544.83 },
    today: { ...emptyBucket },
    yesterdayOrders: [
      {
        order_id: '000000000',
        order_number: '000',
        status: 'handling_products',
        paid_at: '12/09/2026 14:22',
        paid_at_provenance: 'event_received_at',
        paid_source: 'exemplo',
        cancelled: false,
        value_total: 544.83,
        items: [
          { name: 'Cápsulas Lipovitta', sku: 'LIP-CAPS-001', quantity: 1, variant: null },
          { name: 'Shot Matinal Lipovitta ABACAXI', sku: 'ASRL58GD8', quantity: 1, variant: 'ABACAXI' },
        ],
        gift: { code: 'brinde_mixer', name: 'Mixer Dosador', quantity: 1, source: 'utm_content' },
        gift_pending: false,
      },
    ],
    todayOrders: [],
    topProducts: [{ name: 'Cápsulas Lipovitta', orders: 1 }],
    bySource: [{ source: 'direto', orders: 1 }],
  },
  validate: validateDailySalesReport,
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  padding: '24px 0',
}
const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '24px',
  border: '1px solid #E5E7EB',
  borderRadius: '12px',
}
const h1 = { color: '#4667B4', fontSize: '22px', fontWeight: '700', margin: '0 0 8px' }
const h2 = { color: '#4667B4', fontSize: '16px', fontWeight: '700', margin: '20px 0 8px' }
const intro = { color: '#374151', fontSize: '14px', margin: '0 0 16px' }
const card = {
  backgroundColor: '#F8FAFC',
  border: '1px solid #E5E7EB',
  borderRadius: '10px',
  padding: '12px 20px',
}
const orderCard = {
  backgroundColor: '#F8FAFC',
  border: '1px solid #E5E7EB',
  borderRadius: '10px',
  padding: '12px 20px',
  margin: '0 0 12px',
}
const orderTitle = { color: '#111827', fontSize: '15px', fontWeight: '700', margin: '0 0 4px' }
const orderMeta = { color: '#6B7280', fontSize: '12px', margin: '0 0 8px' }
const blockLabel = {
  color: '#4667B4',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  fontWeight: '700',
  margin: '10px 0 4px',
}
const lineItem = { color: '#111827', fontSize: '14px', margin: '0 0 2px' }
const giftText = { color: '#3F6212', fontSize: '14px', fontWeight: '600', margin: '0' }
const alertText = { color: '#7C2D12', fontSize: '14px', fontWeight: '700', margin: '0' }
const warn = {
  backgroundColor: '#FEF3C7',
  border: '1px solid #D97706',
  borderRadius: '10px',
  padding: '12px 16px',
  margin: '12px 0',
}
const warnText = { color: '#7C2D12', fontSize: '14px', fontWeight: '700', margin: '0' }
const rowHead = { margin: '0', padding: '8px 0', borderBottom: '2px solid #E5E7EB' }
const row = { margin: '0', padding: '8px 0', borderBottom: '1px solid #EEF2F7' }
const colLabel = {
  color: '#6B7280',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 2px',
}
const colValue = { color: '#111827', fontSize: '15px', margin: '0', fontWeight: '600' }
const muted = { color: '#6B7280', fontSize: '13px', margin: '4px 0' }
const hr = { borderColor: '#E5E7EB', margin: '20px 0' }
const footer = { color: '#9CA3AF', fontSize: '12px', textAlign: 'center' as const }
