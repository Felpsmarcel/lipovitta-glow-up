# Relatório de vendas LipoVitta — 01 a 31/08/2026

**Escopo:** somente leitura. Não serão alterados código, dados, integrações ou publicação.

## Evidências já verificadas

- O armazenamento local tem 86 linhas em `yampi_orders`, mas a consulta por eventos mostrou que apenas 51 correspondem a `order.*`; também existem eventos `customer.*` e `transaction.payment.refused` misturados.
- Há 51 pedidos distintos de `order.*`, com `created_at_yampi` entre 06/08 e 31/08. `first_seen_at` começa em 27/08, confirmando que a persistência local começou depois de pedidos já existentes.
- O código persiste datas com `new Date(resource.created_at.date)` e não lê um timezone explícito do objeto. O banco não guarda o payload original, portanto a comparação literal entre `created_at.date` e `created_at_yampi` não é recuperável para auditoria completa.
- Os segredos configurados não incluem uma credencial claramente identificável de API Yampi nem há cliente/chamada GET paginada de pedidos no código. Não é possível consultar a API sem novo acesso; não serão tentados GETs especulativos.
- O pedido #74 (`171482339`) foi classificado como `is_test=false` porque a regra atual só reconhece IDs/token com prefixo `TEST`. O histórico armazenado não prova que ele seja um teste real; o plano do projeto é evidência externa, não histórico do pedido. Ele aparece como `cancelled`, e não deve ser excluído das métricas automaticamente sem marcador verificável.
- `invoiced`, `on_carriage` e `delivered` serão tratados apenas como status logístico, nunca como prova de pagamento ou data de recebimento.

## Entrega do relatório

Após a aprovação, executar somente consultas de leitura adicionais para consolidar:
1. totais por status, valor e período;
2. Purchase, Meta e cobertura comparável;
3. histórico completo do #74 e entregas do webhook;
4. campos realmente disponíveis versus ausentes (clientes, produtos, frete, desconto, pagamento, datas, cancelamento/reembolso, endereço e rastreio);
5. JSON dos pedidos armazenados, sem segredos e sem inventar dados não presentes.

A seção de API deve declarar explicitamente a cobertura verificável local e que os detalhes completos de pedidos não podem ser obtidos sem credenciais/API autorizada.