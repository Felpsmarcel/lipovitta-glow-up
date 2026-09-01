# Fechar as lacunas do relatório de agosto (somente após aprovação)

O relatório de 01–31/08 foi entregue apenas com leitura. As lacunas encontradas só podem ser fechadas com quatro correções. Nada abaixo foi executado.

## 1. Acesso à API da Yampi (bloqueio principal)
Não existe credencial de API salva no projeto (apenas o segredo do webhook) e nenhum código chama `api.dooki.com.br`. Sem `YAMPI_API_TOKEN` + alias da loja não há como puxar frete, cupom, forma de pagamento, `paid_at`, endereço e rastreio.
- Cadastrar os segredos `YAMPI_API_TOKEN`, `YAMPI_SECRET_KEY` e `YAMPI_ALIAS`.
- Criar edge function de leitura `yampi-backfill` (somente GET /orders paginado, `include=customer,transactions,shipments,items`), gravando em colunas novas de `yampi_orders`.

## 2. Fuso horário das datas
`isoOrNull` faz `new Date("2026-08-31 09:11:57")` sem fuso; no runtime UTC a data local de São Paulo vira UTC, criando o atraso de 3h.
- Ler `resource.created_at.timezone` (ou assumir `America/Sao_Paulo`) e converter antes de gravar.
- Reprocessar as datas já gravadas com o mesmo deslocamento.

## 3. Separar eventos que não são pedido
`customer.created`, `customer.address.created` e `transaction.payment.refused` (35 linhas) estão gravados em `yampi_orders`.
- Restringir o upsert aos eventos `order.*`.
- Mover/expurgar as linhas indevidas em migração dedicada.

## 4. Marcar pedidos de teste
`is_test` só é verdadeiro quando o `order_id` começa com `TEST`. O #74 é teste real do proprietário e entra nas métricas.
- Adicionar marcação manual de teste (coluna/flag editável no painel `/admin/webhooks`) e sinalizar o #74.

## Extra
Corrigir o `error_404` do Meta CAPI, que atinge 100% dos 11 Purchase reais de agosto.
