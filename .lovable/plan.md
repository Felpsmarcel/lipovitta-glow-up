# Concluir o agendamento diário das 09h com chave segura

O relatório diário, o e-mail e a aba "Relatórios diários" já estão implementados. Falta fechar o agendamento automático de forma segura e comprovar o funcionamento.

## Chave do disparo automático

Problema atual: o agendamento precisaria carregar a chave interna no comando agendado, e chaves salvas no cofre nunca podem ser lidas de volta — o que forçaria expor um valor no chat.

Solução: a chave passa a ser gerada e guardada dentro do próprio banco, em uma tabela interna acessível apenas ao sistema (nem administradores logados nem visitantes conseguem lê-la).

- Nova tabela `internal_job_tokens` (nome do job, token, criado em), com proteção de acesso e sem permissão para `anon`/`authenticated`; somente `service_role`.
- Token gerado no banco com `encode(gen_random_bytes(32),'hex')` — nunca aparece em chat, código ou resposta de função.
- A função de envio deixa de ler `DAILY_REPORT_CRON_SECRET` e passa a comparar o cabeçalho recebido com o token lido da tabela pelo acesso de sistema.
- O segredo antigo `DAILY_REPORT_CRON_SECRET` é removido do cofre.
- Rotação futura: basta regravar o token na tabela e atualizar o comando agendado, tudo dentro do banco.

## Agendamento

- Extensões `pg_cron` e `pg_net` habilitadas.
- Job `daily-sales-report-0900-bahia`, cadência **uma vez por dia às 12:00 UTC = 09:00 na Bahia**. É a cadência mínima necessária: uma execução diária, sem verificações repetidas, portanto sem custo recorrente relevante. Se uma execução falhar, o atraso máximo é até o dia seguinte — o botão "Enviar relatório de hoje" no painel cobre a lacuna.
- O comando agendado envia a chamada com o cabeçalho do token lido da tabela interna, sem valores sensíveis escritos à mão.

## Teste e confirmação

1. Executar o disparo uma vez em modo real pela função publicada.
2. Conferir os três destinatários autorizados no histórico, com status e horário na hora da Bahia.
3. Confirmar que uma segunda execução no mesmo dia é bloqueada pela proteção contra duplicidade.
4. Confirmar que uma chamada sem token e sem sessão administrativa é recusada.
5. Verificar o job agendado listado no banco com a expressão `0 12 * * *`.

O resultado apresentado inclui destinatário, status, identificador da mensagem e horário de cada envio. "Enviado" significa aceito pelo serviço de e-mail, não confirmação de caixa de entrada.

## Fora do escopo

Nenhuma alteração em GHL, Yampi, Meta, Frenet, layout público, usuários ou permissões existentes.
