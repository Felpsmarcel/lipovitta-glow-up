# Envio dos 3 e-mails de teste (v3) — Pedido 81

Executar 3 envios individuais do template já validado `fulfillment-order-check-test`, um por destinatário, sem CC/BCC e sem qualquer alteração de código.

## Destinatários e chaves de idempotência
- ffmconsultoria@gmail.com → `lipovitta:fulfillment-email-test:171546108:ffmconsultoria@gmail.com:v3`
- pedrogmneto@hotmail.com → `lipovitta:fulfillment-email-test:171546108:pedrogmneto@hotmail.com:v3`
- Emersoncopywriter21@gmail.com → `lipovitta:fulfillment-email-test:171546108:Emersoncopywriter21@gmail.com:v3`

Assunto: `TESTE CORRIGIDO — Pedido 81 — Não gerar nova expedição`
Conteúdo: payload completo do pedido 81 (Jamille Neiva), idêntico ao teste corretivo já aprovado.

## Passos
1. Deduplicação: consultar `email_send_log` pelos 3 destinatários; se já houver envio v3 para um endereço, pular esse endereço.
2. Obter a sessão admin oficial de ffmconsultoria@gmail.com pelo mecanismo do ambiente (token só em memória, nunca impresso).
3. Chamar `send-transactional-email` 3 vezes, uma por destinatário, com `Authorization: Bearer` real e o `templateData` completo enviado como bytes de arquivo JSON (nunca `{}`).
4. Monitorar o dispatcher com leituras curtas até `sent`/`failed`; sem reenfileirar.
5. Reportar por destinatário: status exato, `message_id`, horário e provider ID quando disponível.

## Limites
- Nenhuma alteração em código, frontend, template, RLS, segredos ou `verify_jwt`.
- Nenhuma chamada a GHL, Yampi, Frenet ou Meta; nenhuma etiqueta/expedição.
- Nenhum envio ao comprador ou ao galpão.
