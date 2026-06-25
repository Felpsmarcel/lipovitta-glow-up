
# Fase 1 — Webhook Yampi em modo captura

Só a edge function. Sem banco, sem tela, sem HMAC.

## O que vou criar

**`supabase/functions/yampi-webhook/index.ts`** — pública, `verify_jwt = false`.

Comportamento a cada POST:
1. `console.log` do método, URL e **todos os headers** (como objeto).
2. `const raw = await req.text()` e `console.log` do body cru.
3. `try { JSON.parse(raw) }` — se ok, itera `resource.items.data[]` e loga `product_id`, `item_sku`, `quantity`, `gift` por item. Item sem `product_id` é logado como `(sem product_id)` sem quebrar.
4. Responde sempre `200 { ok: true, mode: "capture" }`. Trata `OPTIONS` com CORS.
5. Nenhuma validação de assinatura, nenhuma escrita no banco.

**`supabase/config.toml`** — adiciono bloco `[functions.yampi-webhook] verify_jwt = false`.

## Preparado para Fase 2 (não ativo agora)
- Constante `SIGNATURE_HEADER` e bloco HMAC SHA-256 com `Deno.env.get("YAMPI_WEBHOOK_SECRET")` **comentados** no topo, prontos pra descomentar.
- Tabela `brindes_pedidos` e tela `/operacao/brindes` ficam pra próxima fase, depois que você capturar um pedido real.

## Entregável
URL pública pra você colar na Yampi:
```
https://ecgquvfoipmoqlhfkfol.supabase.co/functions/v1/yampi-webhook
```

Depois que você disparar um pedido teste, eu leio os logs da função, identifico o nome do header de assinatura e o shape real do payload, e seguimos para Fase 2 (HMAC + tabela + tela).
