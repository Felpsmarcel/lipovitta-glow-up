# Meta Pixel (agora) + estrutura pronta para CAPI

## 1. Configuração central do Pixel

Novo arquivo `src/lib/metaPixel.ts`:
- Lê `VITE_META_PIXEL_ID` do `.env` (variável pública — Pixel IDs não são segredo).
- Expõe helpers tipados:
  - `initMetaPixel()` — injeta o base code do fbq uma única vez.
  - `trackPageView()`
  - `trackEvent(name, params?, options?)` — aceita `{ eventID }` para dedupe futuro com CAPI.
  - `generateEventId()` — gera UUID reutilizável (Pixel + CAPI usarão o mesmo).
- Guarda contra SSR/duplo-init e contra ID ausente (no-op silencioso em dev).

## 2. Base code + `<noscript>`

- `index.html`: adicionar a tag `<noscript><img .../></noscript>` no `<body>` (não no `<head>`, conforme regra de HTML5) usando o Pixel ID em placeholder que o script substitui em runtime, OU deixar o fallback apontando para um ID configurável.
- `src/main.tsx`: chamar `initMetaPixel()` no bootstrap.

## 3. PageView em toda navegação SPA

Novo componente `src/components/MetaPixelRouteTracker.tsx` dentro do `<BrowserRouter>` em `App.tsx`:
- Usa `useLocation()` para disparar `trackPageView()` a cada mudança de rota (`/`, `/afiliados`, `/unsubscribe`).

## 4. Eventos específicos

- **ViewContent (home)** — em `OfferSection.tsx`, um `useEffect` com IntersectionObserver dispara `trackEvent('ViewContent', { content_category: 'ofertas' })` ao entrar em viewport (uma vez por sessão).
- **Lead (formulários)** — em `AffiliateForm.tsx` e `PartnerForm.tsx`, após insert bem-sucedido no banco, dispara `trackEvent('Lead', { content_name: 'afiliada' | 'parceiro_comercial' })` com `eventID` = `inserted.id`. Esse ID já é salvo no banco → CAPI futura consegue re-enviar o mesmo eventID e o Meta faz dedupe.
- **InitiateCheckout (Yampi)** — em `GiftSelectionSection.tsx`, no clique de "Finalizar minha compra" (antes de `window.open`), dispara `trackEvent('InitiateCheckout', { value, currency: 'BRL', content_ids: [kitSku], content_name: kitName })` com um `eventID` gerado. Grava esse eventID como `utm_term=eid_<uuid>` no link Yampi para o webhook Yampi conseguir usar o mesmo eventID no Purchase server-side depois.

## 5. Preparo para CAPI (sem implementar o envio agora)

Estrutura em código, sem chamar a API:
- `supabase/functions/meta-capi/index.ts` — esqueleto de Edge Function que valida payload (Zod), lê `META_CAPI_ACCESS_TOKEN` e `META_PIXEL_ID` dos secrets, monta o body no formato `/events` do Meta, e por enquanto responde 200 com `{ preview: body }` sem chamar o endpoint da Graph API. Comentário `TODO: enable send` no ponto exato.
- Helper `src/lib/metaPixel.ts` já expõe `sendCapiPreview(name, params, eventId)` que invoca essa função (fire-and-forget) — desligado por default via flag `VITE_META_CAPI_MIRROR=false`. Assim, quando o usuário quiser ligar CAPI: adiciona 2 secrets, muda a flag, remove o `TODO` — sem refatorar componentes.

## 6. Configuração / segredos

- `VITE_META_PIXEL_ID` — placeholder no `.env` (usuário troca pelo real depois; enquanto vazio, o Pixel fica em no-op sem quebrar o site).
- Para CAPI (etapa futura, não pedir agora): `META_PIXEL_ID` e `META_CAPI_ACCESS_TOKEN` via `add_secret`.

## Fora de escopo desta etapa

- Envio real para Graph API `/events` (só o esqueleto).
- Purchase via webhook Yampi (fica para a etapa CAPI, mas o `eventID` do InitiateCheckout já viaja no link Yampi para permitir dedupe depois).
- LGPD / banner de consentimento (posso adicionar depois se quiser).
- Advanced Matching com hash de email/telefone.

## Pergunta necessária antes de ligar de fato

Você já tem o **Pixel ID** (número de ~15 dígitos do Meta Business)? Se sim, me passa agora que eu já deixo plugado; se não, deixo o placeholder e é só você colar no `.env` depois.
