## Refazer Fase 1 do webhook Yampi (do zero)

Sobrescrever a edge function `yampi-webhook` com uma versão limpa em **modo captura puro**, sem nenhum resíduo da implementação anterior.

### O que a função vai fazer
1. Aceitar `POST` (e responder `OPTIONS` com CORS).
2. Logar no console:
   - Método e URL.
   - **Todos os headers** da requisição (iterando `req.headers`).
   - **Body cru** como texto puro (`await req.text()`).
   - Tentar `JSON.parse` do body; se sucesso, iterar `resource.items.data[]` e logar `product_id`, `item_sku`, `quantity`, `gift` de cada item.
   - Se o parse falhar, logar o erro mas **não quebrar**.
3. **Sempre** responder `200 OK` com `{ ok: true }`.
4. **Não** validar assinatura HMAC.
5. **Não** gravar em banco.
6. **Não** ler `YAMPI_WEBHOOK_SECRET` ainda.

### Config
- `supabase/config.toml`: garantir bloco `[functions.yampi-webhook] verify_jwt = false`.
- Sem migrations, sem novos secrets, sem mudanças no frontend.

### Arquivos
- Sobrescrever: `supabase/functions/yampi-webhook/index.ts`
- Ajustar (se necessário): `supabase/config.toml`

### Entrega
URL pública para colar na Yampi:
```
https://ecgquvfoipmoqlhfkfol.supabase.co/functions/v1/yampi-webhook
```

### Próxima fase (não incluída agora)
Após você disparar 1 pedido teste, eu leio os logs, identifico o header de assinatura real e o shape do payload, e então avançamos para HMAC + tabela `brindes_pedidos` + tela `/operacao/brindes`.
