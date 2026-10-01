# Correspondência avançada do Pixel da Meta (advanced matching)

## O que o aviso do Facebook significa
A Meta quer receber dados de contato (e-mail, telefone, nome) junto com os eventos do Pixel para melhorar a atribuição das conversas. O exemplo dela mostra esses dados no `fbq('init', ...)`, mas isso só funciona quando o visitante já é conhecido ao carregar a página — o que não é o caso da landing.

## Diagnóstico (confirmado no código)
- O Pixel é iniciado em `src/lib/metaPixel.ts` sem dados de correspondência (correto para visitantes anônimos).
- Os momentos em que a visitante informa e-mail/telefone/nome são os formulários: `AffiliateForm`, `PartnerForm` e `LipoloversLeadDialog` — mas os eventos `Lead`/`InitiateCheckout` disparados ali não enviam esses dados ao Pixel.
- A Meta também aceita os dados de correspondência **dentro dos próprios eventos** (o Pixel faz o hash SHA-256 automaticamente), o que resolve o caso da landing.

## O que será feito

### 1. Helper de correspondência avançada
Em `src/lib/metaPixel.ts`, adicionar suporte a `userData` (e-mail, telefone, nome) em `trackEvent`:
- Normalizar e passar `em`, `ph`, `fn`, `ln` nos parâmetros do evento (o Pixel aplica SHA-256 sozinho — nada de dados em texto puro saem do padrão da Meta).
- Telefone normalizado com DDI 55 (reuso da lógica de `normalizePhoneBR`).

### 2. Enviar os dados nos formulários
- `trackLead` e `trackInitiateCheckout` em `src/lib/tracking.ts` passam a aceitar `email`, `phone`, `name` opcionais.
- `AffiliateForm`, `PartnerForm` e `LipoloversLeadDialog` passam os dados que a pessoa acabou de digitar ao disparar `Lead`/`InitiateCheckout`.

### 3. Espelho na CAPI
- O espelho CAPI (`meta-capi`) passa a receber os mesmos dados já com hash SHA-256 no servidor, mantendo a deduplicação pelo mesmo `event_id`.

### 4. Validação
- Testes locais do helper (normalização de telefone/e-mail).
- Verificar no preview que os eventos continuam disparando sem erro e que o aviso da Meta tende a sumir após os primeiros eventos com correspondência.

## Limites mantidos
- Nenhum dado pessoal é enviado para visitantes que não preencheram formulário.
- Nenhuma mudança visual, de preço ou de fluxo de compra.
- Purchase continua somente via webhook após pagamento aprovado.
