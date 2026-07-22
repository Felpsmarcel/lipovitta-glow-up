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

interface Props {
  fullName?: string
  phone?: string
  email?: string
  followersRange?: string
  state?: string
  knowsProduct?: boolean
  submittedAt?: string
}

const followersLabel: Record<string, string> = {
  ate_1k: 'Até 1.000',
  '1k_10k': '1.000 – 10.000',
  '10k_50k': '10.000 – 50.000',
  '50k_100k': '50.000 – 100.000',
  '100k_mais': 'Mais de 100.000',
}

const Email = ({
  fullName = 'Sem nome',
  phone = '-',
  email = '-',
  followersRange = '-',
  state = '-',
  knowsProduct = false,
  submittedAt,
}: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Novo cadastro no programa de afiliadas LipoVitta</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nova candidata a afiliada</Heading>
        <Text style={intro}>
          Você recebeu um novo cadastro no programa de afiliadas LipoVitta.
        </Text>

        <Section style={card}>
          <Row label="Nome" value={fullName} />
          <Row label="WhatsApp" value={phone} />
          <Row label="Email" value={email} />
          <Row
            label="Seguidores"
            value={followersLabel[followersRange] ?? followersRange}
          />
          <Row label="Estado" value={state} />
          <Row
            label="Já conhece o LipoVitta?"
            value={knowsProduct ? 'Sim' : 'Não'}
          />
          {submittedAt ? <Row label="Enviado em" value={submittedAt} /> : null}
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          LipoVitta · Programa de Afiliadas
        </Text>
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
  subject: (data: Props) =>
    `Nova afiliada: ${data?.fullName ?? 'cadastro recebido'}`,
  displayName: 'Nova candidata a afiliada',
  previewData: {
    fullName: 'Maria Silva',
    phone: '(71) 99999-0000',
    email: 'maria@example.com',
    followersRange: '10k_50k',
    state: 'BA',
    knowsProduct: true,
    submittedAt: '22/07/2026 14:30',
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
const h1 = {
  color: '#4667B4',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 8px',
}
const intro = { color: '#374151', fontSize: '14px', margin: '0 0 16px' }
const card = {
  backgroundColor: '#F8FAFC',
  border: '1px solid #E5E7EB',
  borderRadius: '10px',
  padding: '16px 20px',
}
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
