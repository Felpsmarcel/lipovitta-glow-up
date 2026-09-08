# Publicar o app e executar os 3 envios de teste (v3) — Pedido 81

## O que será feito

### 1. Publicar
Publicar a versão atual, que já inclui a atualização do sistema de e-mails (avisos de afiliadas/parceiros pelo novo envio gerenciado e tratamento automático de cancelamentos e devoluções). Antes de publicar, rodar a verificação de segurança e reportar qualquer achado crítico.

### 2. Enviar os 3 e-mails de teste
Três envios individuais, um por destinatário, sem cópia oculta e sem qualquer alteração de código:

- ffmconsultoria@gmail.com
- pedrogmneto@hotmail.com
- Emersoncopywriter21@gmail.com

Assunto: `TESTE CORRIGIDO — Pedido 81 — Não gerar nova expedição`
Conteúdo: os dados reais já validados do pedido 81 (Jamille Neiva, pedido 81 / 171546108, os dois produtos, total R$ 386,73, brinde raspador, campos ausentes sinalizados e o aviso de não gerar expedição).

### 3. Passos de execução
1. Confirmar que o banco do projeto está ativo; se estiver pausado, parar e avisar.
2. Deduplicar: conferir o registro de envios pelos três endereços; se já houver um envio da rodada v3 para um endereço, esse endereço é pulado.
3. Obter a sessão administrativa oficial pelo mecanismo do ambiente (credenciais só em memória, nunca exibidas).
4. Disparar os três envios sequencialmente, cada um com a chave de idempotência v3 do respectivo destinatário e o conteúdo completo do pedido.
5. Acompanhar apenas os registros até cada envio ficar como enviado ou falha definitiva — sem reenviar.
6. Reportar por destinatário: status, identificador da mensagem e horário.

## Limites
- Nenhuma alteração de código, template, permissões ou segredos.
- Nenhuma ação em GHL, Yampi, Frenet ou Meta; nenhuma etiqueta ou expedição.
- Nenhum e-mail ao comprador ou ao galpão.
- "Enviado" indica aceitação pelo serviço de envio, não confirmação de caixa de entrada.
