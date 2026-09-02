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

interface Item {
  name: string
  sku: string
  quantity: number
  price: string
}

interface Props {
  orderNumber?: string
  orderId?: string
  status?: string
  statusDate?: string
  createdDate?: string
  buyerName?: string
  buyerEmail?: string
  buyerPhone?: string
  items?: Item[]
  gift?: string
  subtotal?: string
  discount?: string
  subtotalAfterDiscount?: string
  total?: string
  difference?: string
  unavailable?: string[]
}

const WARNING =
  'TESTE DE CONFERÊNCIA — NÃO SEPARAR NOVAMENTE, NÃO EMITIR NOVA ETIQUETA E NÃO GERAR NOVA EXPEDIÇÃO. Pedido já em transporte.'

const Email = ({
  orderNumber = '-',
  orderId = '-',
  status = '-',
  statusDate = '-',
  createdDate = '-',
  buyerName = '-',
  buyerEmail = '-',
  buyerPhone = '-',
  items = [],
  gift = '-',
  subtotal = '-',
  discount = '-',
  subtotalAfterDiscount = '-',
  total = '-',
  difference = '-',
  unavailable = [],
}: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>{WARNING}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={warn}>
          <Text style={warnText}>{WARNING}</Text>
        </Section>

        <Heading style={h1}>LipoVitta — Conferência do Pedido {orderNumber}</Heading>
        <Text style={intro}>
          E-mail somente para conferência de layout e dados. Nenhuma ação é
          executada a partir desta mensagem.
        </Text>

        <Section style={card}>
          <Row label="Número do pedido" value={orderNumber} />
          <Row label="ID do pedido" value={orderId} />
          <Row label="Status atual registrado" value={status} />
          <Row label="Data do status registrado" value={statusDate} />
          <Row label="Data registrada de criação" value={createdDate} />
        </Section>

        <Heading style={h2}>Contato da compradora</Heading>
        <Section style={card}>
          <Row label="Nome" value={buyerName} />
          <Row label="E-mail" value={buyerEmail} />
          <Row label="Telefone" value={buyerPhone} />
        </Section>

        <Heading style={h2}>Itens</Heading>
        <Section style={card}>
          {items.map((it) => (
            <Row
              key={it.sku}
              label={`${it.quantity}x ${it.sku}`}
              value={`${it.name} — ${it.price}`}
            />
          ))}
          <Row label="Brinde selecionado (não é linha de SKU)" value={gift} />
        </Section>

        <Heading style={h2}>Valores</Heading>
        <Section style={card}>
          <Row label="Subtotal bruto" value={subtotal} />
          <Row label="Desconto" value={discount} />
          <Row label="Subtotal após desconto" value={subtotalAfterDiscount} />
          <Row label="Total do pedido" value={total} />
          <Row label="Diferença sem rubrica confirmada" value={difference} />
        </Section>

        <Heading style={h2}>Lacunas — não usar como ficha de expedição</Heading>
        <Section style={gap}>
          {unavailable.map((u) => (
            <Text key={u} style={gapItem}>
              • {u}: Não disponível no registro recebido
            </Text>
          ))}
        </Section>

        <Section style={warn}>
          <Text style={warnText}>{WARNING}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>LipoVitta · Teste operacional interno</Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value }: { label: string; value: string }) => (
  <Section style={row}>
    <Text style={rowLabel}>{label}</Text>
    <Text style={rowValue}>{value}</Text>
  </Section>
)

export const template = {
  component: Email,
  subject: 'TESTE — LipoVitta Pedido 81 — Não gerar nova expedição',
  displayName: 'Teste de conferência de pedido (operacional)',
  previewData: {
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
    ],
    gift: 'brinde_raspador (raspador)',
    subtotal: 'R$ 527,00',
    discount: 'R$ 158,10 (30%)',
    subtotalAfterDiscount: 'R$ 368,90',
    total: 'R$ 386,73',
    difference: 'R$ 17,83',
    unavailable: ['Endereço/CEP'],
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  padding: '24px 0',
}
const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '24px',
  border: '1px solid #E5E7EB',
  borderRadius: '12px',
}
const warn = {
  backgroundColor: '#FEF3C7',
  border: '2px solid #D97706',
  borderRadius: '10px',
  padding: '14px 16px',
  margin: '0 0 16px',
}
const warnText = {
  color: '#7C2D12',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '20px',
}
const h1 = {
  color: '#4667B4',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 8px',
}
const h2 = {
  color: '#4667B4',
  fontSize: '16px',
  fontWeight: '700',
  margin: '20px 0 8px',
}
const intro = { color: '#374151', fontSize: '14px', margin: '0 0 16px' }
const card = {
  backgroundColor: '#F8FAFC',
  border: '1px solid #E5E7EB',
  borderRadius: '10px',
  padding: '16px 20px',
}
const gap = {
  backgroundColor: '#FFF1F2',
  border: '1px solid #FECDD3',
  borderRadius: '10px',
  padding: '12px 16px',
}
const gapItem = { color: '#9F1239', fontSize: '13px', margin: '4px 0' }
const row = { margin: '0', padding: '8px 0', borderBottom: '1px solid #EEF2F7' }
const rowLabel = {
  color: '#6B7280',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 2px',
}
const rowValue = { color: '#111827', fontSize: '15px', margin: '0', fontWeight: '600' }
const hr = { borderColor: '#E5E7EB', margin: '20px 0' }
const footer = { color: '#9CA3AF', fontSize: '12px', textAlign: 'center' as const }
