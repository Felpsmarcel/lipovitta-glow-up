## Ajustar chamada real da CAPI via Stape

`ENABLE_SEND=true` já está no código e os secrets `META_PIXEL_ID` + `STAPE_CAPI_TOKEN` já estão salvos — o envio real está tecnicamente ligado. Mas o formato de autenticação que deixei (`Authorization: Bearer <token>`) não é o que o Stape CAPI Gateway espera. O token codificado em base64 já contém host + identificador + chave; o gateway é um proxy transparente do endpoint `/events` do Meta e recebe o token como **query string `access_token`**, igual à Graph API. Sem esse ajuste os eventos server-side voltam 401/403 do Stape.

### Alterações

1. `supabase/functions/meta-capi/index.ts`
   - Trocar
     ```
     POST https://capig.stape.pm/{PIXEL_ID}/events
     Authorization: Bearer <STAPE_CAPI_TOKEN>
     ```
     por
     ```
     POST https://capig.stape.pm/{PIXEL_ID}/events?access_token=<STAPE_CAPI_TOKEN>[&test_event_code=...]
     Content-Type: application/json
     ```
   - Manter `ENABLE_SEND = true`, Zod, IP/UA a partir dos headers, `event_id` para dedupe.
   - Log de resposta continua (status + primeiros 500 chars) para debug.

2. Espelhamento opcional a partir do browser
   - Continua controlado por `VITE_META_CAPI_MIRROR` no `.env` (hoje `"true"`). Sem mudança de código — quem quiser desligar o mirror server-side vindo do browser troca para `"false"` e faz redeploy. Documento isso na resposta.

3. Sem mudanças em UI, banco, checkout, Pixel do browser ou eventos existentes (`PageView`, `ViewContent`, `Lead`, `InitiateCheckout`).

### Fora de escopo
- Purchase server-side via webhook Yampi (o `event_id` do `InitiateCheckout` já viaja no link Yampi para dedupe futuro; fica para a próxima etapa).
- Advanced Matching com hash de email/telefone (só faz sentido depois que Test Events estiver validado).

### Verificação após o deploy
- Events Manager → **Test Events**: `PageView`, `ViewContent`, `Lead`, `InitiateCheckout` aparecendo com origem **Browser** e **Server** com o mesmo `event_id` (o Meta mostra "Deduplicated").
- Edge Function logs de `meta-capi`: status 200 e corpo `{"events_received":1,...}` do Meta.
