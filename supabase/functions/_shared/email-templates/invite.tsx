/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Você foi convidada para o {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Text style={brandText}>LipoVitta</Text>
          <Text style={brandSubtext}>por Clara Caldas</Text>
        </Section>
        <Section style={card}>
          <Heading style={h1}>Você foi convidada</Heading>
          <Text style={text}>
            Você recebeu um convite para fazer parte do{' '}
            <Link href={siteUrl} style={link}>
              <strong>{siteName}</strong>
            </Link>
            . Clique no botão abaixo para aceitar e criar sua conta.
          </Text>
          <Button style={button} href={confirmationUrl}>
            Aceitar convite
          </Button>
          <Text style={footer}>
            Se você não esperava este convite, pode ignorar este e-mail.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

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
const link = { color: '#4667B4', textDecoration: 'underline' }
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
