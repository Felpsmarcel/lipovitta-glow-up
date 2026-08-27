# Enviar todos os eventos da Yampi para o GHL (operável pelo ChatGPT via MCP)

Hoje o projeto registra tudo internamente (eventos do site, pedidos da Yampi, carrinhos abandonados), mas nada vai para o GHL. O plano cria a ponte: envio automático em tempo real de **todos os eventos da Yampi** + ferramentas no servidor MCP já existente, para você comandar e conferir o envio direto do ChatGPT.

## Decisões assumidas (posso mudar se quiser)

- Conexão via **Inbound Webhook do GHL** (você cria em Automations e me passa a URL). É o caminho mais simples e não exige token nem Location ID.
- Enviamos **todos os eventos da Yampi**: pedido criado, mudança de status, pedido pago/cancelado e carrinho abandonado. Também os checkouts iniciados no site.
- Enviamos **nome, e-mail e telefone** quando existirem, porque sem isso o GHL não cria/atualiza o contato. Pedidos de teste (TEST...) não são enviados por padrão.


## O que será construído

1. **Fila de envios (`ghl_outbox`)**
   Cada transação vira uma linha com o payload pronto, status (pendente/enviado/erro), número de tentativas e o motivo do último erro. Isso garante que nada se perde se o GHL estiver fora do ar e evita envio duplicado do mesmo pedido/evento.

2. **Envio automático**
   - O webhook da Yampi passa a enfileirar o envio ao GHL em pedidos pagos, mudança de status e carrinho abandonado.
   - O registro de checkout iniciado do site também enfileira.
   - Uma função de entrega envia os pendentes ao GHL, com repetição automática em caso de falha (até 5 tentativas, com espera crescente) e marcação de erro definitivo depois disso.

3. **Ferramenta MCP `send_transactions_to_ghl`**
   Permite ao agente enviar em lote: escolher período, tipo (pedidos pagos / abandonados / checkouts), incluir ou não testes, e um modo "simulação" que mostra o que seria enviado sem enviar. Só administradores conseguem usar, e cada envio é registrado para não duplicar.

4. **Ferramenta MCP `ghl_sync_status`**
   Mostra quantos envios estão pendentes, enviados e com erro no período, com os últimos motivos de falha.

5. **Painel admin**
   Nova aba em `/admin/webhooks` com o estado da sincronização com o GHL: pendentes, enviados, falhas e botão para reprocessar erros.

## Payload enviado ao GHL

Campos padronizados para você mapear direto na automação:
`event_type` (purchase / order_status / abandoned_cart / initiate_checkout), `order_id`, `order_number`, `status`, `value`, `currency`, `items` (nome, sku, quantidade), `first_name`, `last_name`, `email`, `phone`, `utm_source/medium/campaign/content/term`, `recovery_url`, `occurred_at`, `is_test`.

## Detalhes técnicos

- Migração: tabela `public.ghl_outbox` (RLS: leitura só admin, escrita só service_role), índice único por (`event_type`, `dedupe_key`) para idempotência, mais índice por status.
- Segredo novo: `GHL_WEBHOOK_URL` (solicitado via secret; nunca aparece no código nem em logs).
- Edge function nova `ghl-dispatch` (service_role, retry com backoff), chamada logo após o enfileiramento e também disponível para reprocessamento manual.
- Alterações em `supabase/functions/yampi-webhook/index.ts` e `track-conversion` apenas para enfileirar — nenhuma mudança pode quebrar o fluxo atual (falha no enfileiramento é registrada, não derruba o webhook).
- Novas ferramentas em `src/lib/mcp/tools/`, registradas em `src/lib/mcp/index.ts`, versão do MCP para 0.4.0 e manifest regenerado.
- Logs seguem a regra atual de PII mascarada; os dados pessoais só trafegam no payload para o GHL.

## O que preciso de você

A **URL do Inbound Webhook do GHL**. Sem ela eu implemento tudo e deixo o envio em modo simulação até a URL ser cadastrada.
