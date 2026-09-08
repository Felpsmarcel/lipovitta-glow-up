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
}

interface Props {
  reportDate: string
  yesterdayDate: string
  yesterday: Bucket
  today: Bucket
  topProducts: { name: string; orders: number }[]
  bySource: { source: string; orders: number }[]
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

const Email = ({
  reportDate,
  yesterdayDate,
  yesterday,
  today,
  topProducts,
  bySource,
}: Props) => {
  const empty = yesterday.paid_orders === 0 && today.paid_orders === 0
  const mismatches = yesterday.price_mismatches + today.price_mismatches
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head />
      <Preview>
        {`Vendas ${yesterdayDate}: ${yesterday.paid_orders} pedidos · ${brl(yesterday.revenue_brl)}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>LipoVitta — Resumo de vendas</Heading>
          <Text style={intro}>
            Enviado em {reportDate} às 09h (horário da Bahia). Compara o dia
            anterior completo com as vendas de hoje até as 09h. Pedidos de teste
            não entram nos números.
          </Text>

          {empty && (
            <Section style={warn}>
              <Text style={warnText}>
                Sem vendas registradas nos dois períodos.
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
                  {m.money ? brl(yesterday[m.key]) : String(yesterday[m.key])}
                </Text>
                <Text style={colValue}>
                  {m.money ? brl(today[m.key]) : String(today[m.key])}
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
}

export const template = {
  component: Email,
  subject: (data: Partial<Props>) =>
    `LipoVitta — Vendas de ${data?.yesterdayDate ?? ''} e parcial de hoje`,
  displayName: 'Resumo diário de vendas',
  previewData: {
    reportDate: '09/09/2026',
    yesterdayDate: '08/09/2026',
    yesterday: { ...emptyBucket, paid_orders: 4, revenue_brl: 1428.9, avg_ticket_brl: 357.23 },
    today: { ...emptyBucket, paid_orders: 1, revenue_brl: 321.3, avg_ticket_brl: 321.3 },
    topProducts: [{ name: 'Cápsulas Lipovitta', orders: 3 }],
    bySource: [{ source: 'instagram', orders: 3 }],
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
