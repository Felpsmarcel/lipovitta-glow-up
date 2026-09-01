# Relatório de vendas LipoVitta — 01 a 31/08/2026

**Escopo:** somente leitura. Não serão alterados código, dados, integrações ou publicação.

## Evidências verificadas

- O banco contém 86 linhas em `yampi_orders`; a consulta por `event LIKE 'order%'` encontra 51 pedidos/eventos de pedido e confirma 35 eventos não-pedido misturados (`customer.*` e `transaction.payment.refused`).
- Os 51 pedidos de pedido têm `created_at_yampi` entre 06/08 e 31/08, mas `first_seen_at` só começa em 27/08. Isso prova que a cobertura local é um backfill parcial recebido por atualizações tardias, não um espelho completo da Yampi.
- Os segredos configurados incluem `YAMPI_WEBHOOK_SECRET` e dois nomes opacos (`yamp`, `yampatualizado`), mas não há credencial claramente identificável de API nem chamada GET paginada de pedidos no código. Os valores não serão exibidos nem usados especulativamente.
- O código grava `created_at_yampi` com `new Date(resource.created_at.date)` e não armazena o payload original nem o timezone. Para o #74, `created_at_yampi=2026-08-31 09:11:57+00` e `first_seen_at=2026-08-31 12:12:19+00`, diferença observada de 3h; a origem literal (`date` local versus UTC) não pode ser provada retroativamente porque o payload não foi persistido.
- A regra atual marca teste somente por prefixo `TEST` no ID/token. O #74 (`171482339`) ficou `is_test=false`. O histórico local mostra `order.updated`/`waiting_payment` e depois `cancelled`, mas não contém um marcador de teste; portanto não é possível confirmar, apenas pelo banco, que o #74 foi teste real ou excluir sua compra das métricas comerciais.
- `invoiced`, `on_carriage` e `delivered` serão reportados como status logístico, não como prova de pagamento, recebimento de valor ou data de pagamento.

## Resultado a entregar após aprovação

Consolidar em resposta somente leitura os totais, status, valores e cobertura; os 11 `Purchase` reais e seus `error_404`; o histórico do #74; as fontes locais recuperáveis; e a lista explícita de campos ausentes. Como a API autenticada não está disponível, não haverá JSON completo de pedidos Yampi nem dados inventados de cliente, frete, cupom, pagamento, `paid_at`, endereço ou rastreio.