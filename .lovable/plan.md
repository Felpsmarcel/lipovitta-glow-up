# Rastreamento de conversões (cliques + compras)

Objetivo: medir de ponta a ponta o desempenho dos CTAs (botões de compra) e dos formulários, e fechar o ciclo com a compra confirmada pela Yampi.

## Situação atual
- Meta Pixel já existe (`src/lib/metaPixel.ts`) com `trackEvent` e `eventID` para deduplicação.
- Eventos disparados hoje: `ViewContent` na seção de oferta, seleção de brinde, e envio dos formulários de afiliada/parceiro.
- Os links de checkout já carregam `utm_term=eid_<eventId>` e `utm_content=brinde_xxx`.
- A função `yampi-webhook` está em modo captura (só loga) e a `meta-capi` existe mas não recebe compras.

Faltando: eventos de clique padronizados em todos os CTAs do site e o evento de **Purchase** vindo da Yampi.

## O que será feito

### 1. Padronizar eventos de clique
Criar um helper único `trackCtaClick({ location, productName, value, checkoutUrl })` que:
- gera um `eventId`,
- dispara `InitiateCheckout` no Pixel (com valor, moeda BRL, nome do produto),
- devolve o link já com `utm_term=eid_<eventId>` + UTMs de origem preservadas.

Aplicar em todos os CTAs que hoje não medem nada:
- Hero (botão principal e "Novo" kit)
- Navbar (botão de compra)
- CTABanner (os dois banners)
- OfferSection (todos os cards: Cápsulas, Protocolo, Shot Matinal, Kit)
- ProductsSection (complementos)
- ExitIntentPopup e UrgencyBar
- WhatsApp flutuante e botão de afiliadas → evento `Contact` / `Lead`

### 2. Formulários
- `AffiliateForm` e `PartnerForm`: manter o `Lead` atual, mas com `eventId` e mirror para CAPI, além de um evento de início de preenchimento (`LeadStart`) para calcular taxa de abandono.

### 3. Compra (Purchase) via webhook Yampi
- Tirar `yampi-webhook` do modo captura: validar a assinatura/segredo, extrair `order id`, valor, itens, e-mail/telefone do cliente e os UTMs do pedido.
- Recuperar o `eid_<eventId>` do `utm_term` para deduplicar com o clique do Pixel.
- Enviar `Purchase` para a CAPI (via `meta-capi`) com dados do cliente hasheados (SHA-256: e-mail, telefone, nome).
- Gravar cada pedido em uma nova tabela `conversion_events` (id, event_name, event_id, order_id, valor, utm_source/medium/campaign/content/term, status do envio à Meta, criado em), com RLS: leitura só para admin, escrita só pela função (service role).

### 4. Painel simples de resultados
Página `/admin/conversoes` (protegida por role admin, já existente) listando os eventos: cliques por CTA, leads e compras, com filtro por período e totais por origem/UTM.

## Detalhes técnicos
- Deduplicação Meta: mesmo `event_id` no Pixel (browser) e na CAPI (servidor).
- CAPI continua passando pelo gateway Stape já configurado; erros são logados e não bloqueiam o webhook (sempre responde 200 para a Yampi).
- Dados pessoais: apenas hash SHA-256 é enviado à Meta; a tabela local guarda somente order_id, valores e UTMs — sem e-mail em texto puro.
- Nenhuma mudança visual no site.

## Fora do escopo
- Google Analytics / GA4 (posso adicionar depois se quiser).
- Alteração de preços, layout ou fluxo de brindes.
