# Parceiros Comerciais + Botão flutuante

## 1. Página /afiliados com abas

Adicionar um toggle de abas no topo do formulário: **Afiliada (Creator)** | **Parceiro Comercial**. Mesma URL, mesmo layout premium, alterna o formulário renderizado.

### Aba "Afiliada" (atual)
Sem mudanças no que já existe.

### Aba "Parceiro Comercial" (novo formulário)
Campos:
- Nome do responsável
- WhatsApp
- Email corporativo
- **CNPJ** (com máscara XX.XXX.XXX/XXXX-XX, validação de dígitos)
- **Razão Social**
- **Tipo de negócio** (select): Farmácia, Clínica estética, Nutricionista, Personal trainer, Loja de suplementos, Outro
- **Cidade** + Estado (UF)
- **Volume estimado / interesse** (textarea curta, ex.: "revenda 50un/mês", "indicação para pacientes", "parceria clínica")

Validação com Zod, mesmo padrão visual do form atual.

## 2. Banco de dados

Nova tabela `commercial_partner_applications` (separada da tabela de afiliadas — schemas diferentes, fluxos de contato diferentes):

Campos: responsible_name, phone, email, cnpj, company_name, business_type, city, state, volume_notes, status, created_at, updated_at.

- RLS: `INSERT` público (anon+authenticated) com validações de tamanho, sem `SELECT`/`UPDATE`/`DELETE` público (igual afiliadas).
- GRANT `INSERT` para anon/authenticated, `ALL` para service_role.

## 3. Email de notificação

Novo template React Email `new-commercial-partner-application.tsx` no registry, disparado após insert bem-sucedido, enviado para `lipovitta@clarinhacbr.com.br` com todos os campos do parceiro. Mesmo visual do template de afiliada.

## 4. Botão flutuante "Seja Afiliada" (home apenas)

Novo componente `AffiliateFloatingButton.tsx`:
- Posição: `fixed bottom-24 right-6` (empilhado acima do WhatsApp, que fica em `bottom-6`).
- Estilo: pill horizontal com ícone + texto "Seja Afiliada", cor Royal Blue (#4667B4), sombra sutil, mesmo ritmo de animação suave do WhatsApp.
- Link para `/afiliados`.
- Renderizado **apenas na home** (`src/pages/Index.tsx`), não em `/afiliados` nem `/unsubscribe`.

O `WhatsAppButton` continua global como está hoje (nas 3 rotas). Se preferir escondê-lo também em `/afiliados`, é 1 linha extra — mas o pedido foi só sobre o de afiliada.

## Detalhes técnicos

- `src/pages/Afiliados.tsx`: extrair form atual para `<AffiliateForm />`, criar `<PartnerForm />`, adicionar `<Tabs>` (shadcn) no topo. Header e Footer inalterados.
- Migração cria tabela + policies + trigger `update_updated_at_column`.
- Registry `_shared/transactional-email-templates/registry.ts` recebe `'new-commercial-partner-application'`.
- Deploy de `send-transactional-email` após adicionar template.
- `AffiliateFloatingButton` importado só em `Index.tsx`, abaixo do `<WhatsAppButton />`, para stacking correto no z-index.

## Fora de escopo

Painel admin para listar candidaturas, aprovação/status workflow, geração de links UTM por parceiro, contratos — ficam para depois.
