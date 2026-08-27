# Webhook da Yampi: URL correta e assinatura recusada

## Situação verificada agora

A Yampi **já está chamando** o endpoint. Nos registros de entrega há 3 chamadas em 27/08/2026 (11:06–11:07 UTC):

- `signature_present = true` (o header de assinatura chega)
- `outcome = rejected`, `reason = invalid_signature`
- `yampi_orders` continua com 0 linhas, porque nada passa da validação

Ou seja: a URL está certa, o que está errado é o **segredo** (o valor salvo no projeto não bate com o configurado no painel da Yampi) ou o formato da assinatura enviada.

## URL a usar no painel da Yampi

```text
https://ecgquvfoipmoqlhfkfol.supabase.co/functions/v1/yampi-webhook
```

Eventos: `order.created`, `order.paid`, `order.status.updated`, `cart.reminder`.

## O que fazer

1. **Alinhar o segredo**: reconfirmar no painel da Yampi qual segredo está ativo e salvar exatamente o mesmo valor no projeto (sem espaços/quebras). Esse é o caminho mais provável de resolução.
2. **Diagnóstico mais rico enquanto não resolve**: gravar em `yampi_webhook_deliveries` um campo extra com o formato da assinatura recebida (comprimento e se é base64 ou hex) e um prefixo curto do HMAC calculado — nunca o segredo nem o payload. Isso mostra se é divergência de segredo ou de formato.
3. **Tolerar variações de formato**: comparar também assinatura em base64url e com prefixo (`sha256=...`), além do base64/hex já suportados, usando comparação de tempo constante.
4. **Reteste**: após alinhar o segredo, disparar um evento de teste pela Yampi e confirmar em `yampi_webhook_deliveries` um `outcome = accepted` e a linha correspondente em `yampi_orders`.

## Detalhes técnicos

- Arquivo afetado: `supabase/functions/yampi-webhook/index.ts` (funções `verifySignature` e `logDelivery`).
- Sem mudanças de UI, sem publicação, sem novas tabelas — apenas uma coluna opcional de diagnóstico em `yampi_webhook_deliveries` (`signature_format text`), via migração aditiva.
- Nenhum segredo é exibido em logs ou no banco.
