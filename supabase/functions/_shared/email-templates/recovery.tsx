/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Redefina sua senha no {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Text style={brandText}>LipoVitta</Text>
          <Text style={brandSubtext}>por Clara Caldas</Text>
        </Section>
        <Section style={card}>
          <Heading style={h1}>Redefinir sua senha</Heading>
          <Text style={text}>
            Recebemos um pedido para redefinir a senha da sua conta em {siteName}. Clique no botão abaixo para escolher uma nova senha.
          </Text>
          <Button style={button} href={confirmationUrl}>
            Redefinir minha senha
          </Button>
          <Text style={footer}>
            Se você não pediu para redefinir sua senha, pode ignorar este e-mail. Sua senha continuará a mesma.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "Poppins, 'Helvetica Neue', Arial, sans-serif",
}
const container = { padding: '24px 16px', maxWidth: '560px', margin: '0 auto' }
const brandBar = {
  textAlign: 'center' as const,
  padding: '24px 0 16px',
  borderBottom: '3px solid #9BAE52',
}
const brandText = {
  fontSize: '28px',
  fontWeight: 700 as const,
  color: '#4667B4',
  letterSpacing: '-0.5px',
  margin: '0',
}
const brandSubtext = {
  fontSize: '12px',
  color: '#9BAE52',
  margin: '2px 0 0',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
}
const card = { padding: '32px 8px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 600 as const,
  color: '#4667B4',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#444444',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const button = {
  backgroundColor: '#9BAE52',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 700 as const,
  borderRadius: '999px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = { fontSize: '12px', color: '#888888', margin: '32px 0 0', lineHeight: '1.5' }
