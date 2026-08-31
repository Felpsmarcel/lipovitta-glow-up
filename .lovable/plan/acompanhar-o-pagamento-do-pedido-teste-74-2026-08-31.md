# Acompanhar o pagamento do pedido teste #74

## Estado atual (verificado agora)
- Pedido **#74** (`171482339`) registrado às 12:12 UTC de 31/08, status `waiting_payment`, total **R$ 386,73**.
- Webhook da Yampi aceito (assinatura válida), sem erro de parser.
- Evento `order_status` do pedido 74 já foi **enviado ao GHL** (`sent`, 1 tentativa, sem erro).
- Checkout iniciado registrado às 12:10 com valor R$ 368,90 (diferença de R$ 17,83 em relação ao pedido, provavelmente frete).
- Nenhum evento `Purchase` ainda — ele só é criado quando a Yampi envia `order.paid`.
- Observação: os pedidos pagos #72 e #73 ficaram com `purchase_meta_error_404` (envio ao Meta/CAPI falhando).

## O que fazer quando o #74 for pago
Nenhuma alteração de código. Verificação de leitura, na ordem:

1. Conferir em `yampi_webhook_deliveries` se chegou o evento `order.paid` do pedido 74 e com qual resultado.
2. Conferir em `yampi_orders` se o status virou `paid` e se `price_mismatch` ficou falso (comparação com o checkout de R$ 368,90).
3. Conferir em `conversion_events` se foi criado o evento `Purchase` com `order_id = 171482339`, valor e `buyer_hash`.
4. Conferir em `ghl_outbox` se o evento `purchase` do pedido 74 saiu com status `sent`.
5. Anotar o `meta_status` do Purchase — se vier `error_404` de novo, confirma que a falha do Meta é sistemática e vira um plano de correção separado.

## Resultado esperado
Relato curto dizendo se o pagamento foi capturado ponta a ponta (Yampi → banco → GHL) e se o Meta continua falhando.
