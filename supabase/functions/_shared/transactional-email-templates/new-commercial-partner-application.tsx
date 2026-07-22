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
  responsibleName?: string
  phone?: string
  email?: string
  cnpj?: string
  companyName?: string
  businessType?: string
  city?: string
  state?: string
  volumeNotes?: string
  submittedAt?: string
}

const Email = ({
  responsibleName = '-',
  phone = '-',
  email = '-',
  cnpj = '-',
  companyName = '-',
  businessType = '-',
  city = '-',
  state = '-',
  volumeNotes = '-',
  submittedAt,
}: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Novo cadastro de parceiro comercial LipoVitta</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Novo parceiro comercial</Heading>
        <Text style={intro}>
          Você recebeu um novo cadastro no programa de parceiros comerciais LipoVitta.
        </Text>

        <Section style={card}>
          <Row label="Responsável" value={responsibleName} />
          <Row label="WhatsApp" value={phone} />
          <Row label="Email" value={email} />
          <Row label="Razão Social" value={companyName} />
          <Row label="CNPJ" value={cnpj} />
          <Row label="Tipo de negócio" value={businessType} />
          <Row label="Cidade / UF" value={`${city} - ${state}`} />
          <Row label="Volume / Interesse" value={volumeNotes || '-'} />
          {submittedAt ? <Row label="Enviado em" value={submittedAt} /> : null}
        </Section>

        <Hr style={hr} />
        <Text style={footer}>LipoVitta · Parceiros Comerciais</Text>
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
    `Novo parceiro: ${data?.companyName ?? 'cadastro recebido'}`,
  displayName: 'Novo parceiro comercial',
  previewData: {
    responsibleName: 'Ana Souza',
    phone: '(71) 99999-0000',
    email: 'ana@clinica.com',
    cnpj: '12.345.678/0001-90',
    companyName: 'Clínica Bem Estar Ltda',
    businessType: 'Clínica estética',
    city: 'Salvador',
    state: 'BA',
    volumeNotes: 'Indicação para pacientes, ~30un/mês',
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
