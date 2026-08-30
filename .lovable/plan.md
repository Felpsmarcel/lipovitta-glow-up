# Ativar entrega real dos eventos da Yampi + site para o GHL

## Estado atual (verificado agora)
- Segredo `GHL_WEBHOOK_URL` **não existe** ainda → por isso o `ghl-dispatch` segue em modo simulação e nada foi enviado ao GHL.
- Fila `ghl_outbox` com **87 eventos pendentes** (nenhum de teste):
  - `order_status`: 40
  - `initiate_checkout`: 30
  - `purchase`: 11
  - `abandoned_cart`: 6
- URL do Inbound Webhook do GHL fornecida: `https://services.leadconnectorhq.com/hooks/fJzQmnIkw2U71SbtBDld/webhook-trigger/e7355674-a754-41e3-af3f-9c1296639a2f`

## Passos
1. **Salvar o segredo `GHL_WEBHOOK_URL`** com a URL acima, via formulário seguro (`add_secret`). O valor nunca entra no código nem em logs.
2. **Pré-visualizar** o envio com a ferramenta MCP `send_transactions_to_ghl` (`simulate=true`, 30 dias, sem testes) para confirmar as contagens antes de qualquer entrega real.
3. **Entregar de verdade**:
   - Disparar `ghl-dispatch` para enviar os 87 eventos já pendentes ao GHL.
   - Rodar `send_transactions_to_ghl` com `simulate=false` (30 dias) para enfileirar e enviar eventuais eventos históricos adicionais. É idempotente — os 87 existentes não duplicam.
4. **Confirmar entrega** via `ghl_sync_status` e consulta direta ao `ghl_outbox`: eventos passam de `pending` → `sent`. Falhas transitórias entram em `error`/`failed` com `last_error` e backoff automático (até 5 tentativas).
5. (Opcional) Reprocessar falhas com `retry_failed=true` após analisar os erros.

## Notas técnicas
- Sem mudanças de UI; tudo opera pelo backend e pelo MCP do ChatGPT.
- `ghl-dispatch` lê `GHL_WEBHOOK_URL` em runtime — ao salvar o segredo o envio real já fica ativo, sem precisar reimplantar.
- Dados pessoais (nome/e-mail/telefone) só trafegam no payload enviado ao GHL, conforme o plano original aprovado.
