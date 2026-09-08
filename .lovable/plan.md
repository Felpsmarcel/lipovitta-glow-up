# Relatório diário de vendas por e-mail (09h Bahia)

Todo dia às 09h (horário da Bahia) o sistema envia um e-mail com o resumo de vendas do dia anterior completo e as vendas parciais de hoje até as 09h. Vai para os três endereços autorizados: ffmconsultoria@gmail.com, pedrogmneto@hotmail.com e Emersoncopywriter21@gmail.com. Pedidos de teste ficam de fora dos números.

## O que o e-mail mostra

Duas colunas de números — "Ontem (dia inteiro)" e "Hoje até as 09h":

- Pedidos pagos e faturamento (R$)
- Ticket médio
- Pedidos aguardando pagamento e cancelados
- Checkouts iniciados e carrinhos abandonados
- Top produtos vendidos no dia anterior
- Origem das vendas (UTM)
- Aviso quando algum pedido tem divergência de preço

Se não houve vendas no período, o e-mail é enviado mesmo assim indicando "sem vendas registradas", para servir de sinal de que o sistema está funcionando.

## Painel de acompanhamento

Nova aba "Relatórios diários" dentro da área administrativa (junto de Conversões e Webhooks), listando cada envio:

- Data/hora do disparo (horário da Bahia)
- Destinatário
- Status: enviado, bloqueado pela lista de exclusão ou falhou
- Identificador da mensagem e motivo do erro quando houver
- Botão para reenviar manualmente o relatório de hoje (respeitando a proteção contra duplicidade)

## Detalhes técnicos

- Nova edge function `daily-sales-report`: monta o resumo, renderiza o template e envia via API de e-mail gerenciada, um envio por destinatário, sequencial.
  - Autorização: chamada agendada usa cabeçalho com segredo interno (`DAILY_REPORT_CRON_SECRET`); chamada manual pelo painel exige sessão admin (`has_role`). `verify_jwt = false` com validação em código.
  - Destinatários em allowlist fixa no servidor; o corpo da requisição não escolhe endereço.
  - Idempotência: chave `lipovitta:daily-sales-report:<YYYY-MM-DD>:<destinatário>`; se já existe registro em `email_send_log` para a chave, não reenvia.
- Nova função no banco `daily_sales_report(_report_date date)` (SECURITY DEFINER, search_path public) agregando de `yampi_orders`, `conversion_events` e `abandoned_checkouts` com `is_test = false`, com janelas em `America/Bahia`: dia anterior 00:00–23:59 e hoje 00:00–09:00. Retorna jsonb; tolera ausência de linhas (zeros).
- Novo template React Email `daily-sales-report.tsx` registrado em `registry.ts`, com `validate` e `previewData`, seguindo a identidade visual dos templates atuais (azul #4667B4).
- Agendamento: `pg_cron` + `pg_net` chamando a função às 12:00 UTC (09:00 Bahia), uma vez por dia — cadência diária, sem polling frequente. Atraso máximo em caso de falha: até o dia seguinte; nesse caso o botão de reenvio manual cobre a lacuna.
- Novo arquivo `src/pages/admin/RelatoriosDiarios.tsx` + rota em `App.tsx`; leitura de `email_send_log` filtrando `template_name = 'daily-sales-report'`. Como a tabela hoje só é legível pelo service_role, adiciona-se policy de SELECT para admin (`has_role(auth.uid(), 'admin')`) mais o GRANT correspondente.
- Registro em `email_send_log` para todo envio (sent / suppressed / failed) com `metadata` contendo a chave de idempotência e a data do relatório.
- Sem alterações em GHL, Yampi, Meta, Frenet ou no layout público do site.

## Testes

- Função do banco: dia sem pedidos, dia com pedidos pagos, pedido aguardando pagamento, pedido de teste excluído, campos nulos.
- Edge function: chamada sem segredo/sessão (401), admin autorizado, duplicidade bloqueada, destinatário fora da allowlist rejeitado.
- Um envio real de validação em uma execução manual após o deploy, com status e horário exibidos no painel.
