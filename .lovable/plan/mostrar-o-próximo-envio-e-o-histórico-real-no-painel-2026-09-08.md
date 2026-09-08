# Mostrar o próximo envio e o histórico real no painel

O agendamento já está ativo no banco: o disparo roda uma vez por dia às 12:00 UTC, ou seja, 09:00 na Bahia. Os três envios de hoje ficaram registrados como "enviado" às 19:54 (horário da Bahia), com origem "automático".

O que falta é o painel refletir isso com clareza.

## O que muda na aba "Relatórios diários"

1. Faixa no topo com o estado do agendamento:
   - "Envio automático ativo — todo dia às 09:00 (Bahia)"
   - "Próximo envio: 09/09/2026 às 09:00 (Bahia)", calculado a partir do horário atual
   - Aviso visível caso o agendamento esteja desligado
2. Nova coluna "Origem" no histórico: automático ou manual.
3. Nova coluna "Data do relatório", para diferenciar o dia do conteúdo do dia do envio.
4. Coluna "Referência" passa a mostrar o identificador da mensagem quando existir e "—" quando o serviço não devolver um.

## Correção no registro do envio

Hoje o identificador da mensagem não está sendo guardado: os três registros de hoje têm esse campo vazio. O envio passa a gravar o identificador devolvido pelo serviço de e-mail junto com o registro, para que o painel mostre uma referência real e não um traço.

## Detalhes técnicos

- `src/pages/admin/RelatoriosDiarios.tsx`: cartão de status lendo o estado do agendamento por uma consulta somente leitura, cálculo do próximo horário 12:00 UTC, colunas `metadata.trigger` e `metadata.report_date`.
- Nova função no banco `daily_report_schedule_status()` (SECURITY DEFINER, restrita a admin via `has_role`) devolvendo `active` e `schedule` de `cron.job` para o job `daily-sales-report-0900-bahia`, com GRANT EXECUTE para `authenticated`. Sem expor tokens nem o comando agendado.
- `supabase/functions/daily-sales-report/index.ts`: propagar o `message_id` retornado pelo envio para o `insert` em `email_send_log`.
- Sem alteração de cadência, destinatários, idempotência ou qualquer integração externa.

## Verificação

- Conferir no painel a faixa "ativo" e o próximo envio 09/09 09:00.
- Conferir os três registros de hoje com origem "automático" e horário 19:54 (Bahia).
- Um envio manual de validação só se você pedir — a proteção contra duplicidade do dia bloquearia o reenvio de hoje de qualquer forma.
