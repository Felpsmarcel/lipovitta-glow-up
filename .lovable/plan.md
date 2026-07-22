## Ligar Meta Pixel + CAPI (via Stape CAPI Gateway)

O token que você mandou não é da Graph API do Meta — é um token do **Stape CAPI Gateway** (host `capig.stape.pm`). Isso muda o endpoint de envio: em vez de `graph.facebook.com/v20.0/{pixel_id}/events`, mando os eventos para o Stape, e ele reencaminha para o Meta. Vantagem: contorna bloqueadores/iOS melhor e mantém o mesmo formato de payload.

### 1. Pixel no browser (liga na hora)
- Adicionar `VITE_META_PIXEL_ID="2146878272549292"` no `.env`.
- `initMetaPixel()` já existe e passa a disparar `PageView` no bootstrap.
- `MetaPixelRouteTracker` continua cuidando das rotas SPA.
- `<noscript>` no `index.html` já usa `%VITE_META_PIXEL_ID%` — Vite injeta em build.

Eventos já plugados no código atual:
- `PageView` (todas as rotas)
- `ViewContent` (OfferSection entrando em viewport)
- `Lead` (AffiliateForm + PartnerForm, com `eventID = <tipo>-<insert.id>`)
- `InitiateCheckout` (GiftSelectionSection, com `eventID` propagado no link Yampi via `utm_term=eid_<uuid>`)

### 2. CAPI via Stape (server-side, com dedupe por `eventID`)
- Salvar 2 secrets (backend):
  - `META_PIXEL_ID = 2146878272549292`
  - `STAPE_CAPI_TOKEN = <token que você mandou>`
- Ligar o mirror do browser: `VITE_META_CAPI_MIRROR="true"` no `.env`.
- Editar `supabase/functions/meta-capi/index.ts`:
  - Trocar `ENABLE_SEND` para `true`.
  - Trocar endpoint de `graph.facebook.com/v20.0/{PIXEL_ID}/events?access_token=...` para o **Stape CAPI Gateway**: `POST https://capig.stape.pm/{PIXEL_ID}/events` com header `Authorization: Bearer <STAPE_CAPI_TOKEN>` (formato exato do header confirmado antes de subir — Stape aceita `access_token` no body OU header dependendo da versão; uso o padrão do painel do usuário).
  - Manter validação Zod, `client_ip_address` (do `x-forwarded-for`) e `client_user_agent`, e o `event_id` vindo do browser (dedupe automático com o Pixel).
  - Continuar logando payload no `console.log` para inspeção via Edge Function logs.

### 3. Purchase (Yampi → CAPI) — fora deste passo, mas preparado
Já deixei o `eventID` do `InitiateCheckout` viajando no link Yampi (`utm_term=eid_<uuid>`). Quando ligarmos o webhook Yampi de compra aprovada, ele lê esse `eid_` e envia `Purchase` para `meta-capi` com o mesmo `event_id` — dedupe garantido. Não faço agora.

### 4. Verificação
Depois de publicar:
- Meta Events Manager → **Test Events**: cola a URL do site, valida `PageView`, `ViewContent`, `Lead`, `InitiateCheckout` chegando via **Browser** e também via **Server** (Stape) com o mesmo `event_id`.
- Se você tiver um **Test Event Code** do Meta, adiciono como secret `META_CAPI_TEST_EVENT_CODE` (a função já suporta) para separar testes de produção.

### Detalhes técnicos
- `.env` no repo aceita `VITE_*` públicas — Pixel ID e a flag `VITE_META_CAPI_MIRROR` não são segredo.
- Secrets do backend (`META_PIXEL_ID`, `STAPE_CAPI_TOKEN`) via ferramenta `add_secret` — nunca no código.
- Sem mudanças em componentes de UI, checkout, ou banco.

### Pergunta rápida antes de eu executar
Você quer que eu **já ligue o envio CAPI para produção** (ENABLE_SEND=true) junto com o Pixel, ou prefere **manter CAPI em modo preview** (só logando) por 1 dia para você validar o Pixel primeiro no Test Events?
