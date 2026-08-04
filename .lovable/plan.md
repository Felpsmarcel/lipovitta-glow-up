# Ativar validação de assinatura do webhook da Yampi

## Objetivo
Fazer com que a função `yampi-webhook` só aceite chamadas realmente vindas da Yampi, validando a assinatura HMAC com o segredo compartilhado.

## O que será feito
1. Salvar o segredo que você informou como `YAMPI_WEBHOOK_SECRET` no backend do projeto (valor fixo, gravado de forma segura — não fica no código).
2. Confirmar no painel da Yampi que o mesmo valor está configurado como segredo do webhook e que a URL apontada é a da função `yampi-webhook`.
3. Verificar o comportamento da função após a configuração:
   - com assinatura válida → pedido processado, `Purchase` enviado à Meta e registro em `conversion_events`;
   - com assinatura inválida/ausente → resposta `invalid_signature`, nada é gravado.
4. Checar os logs da função para confirmar que o aviso "YAMPI_WEBHOOK_SECRET não configurado" desapareceu.

## Detalhes técnicos
- A função já implementa a verificação: lê o header `x-yampi-hmac-sha256` e compara com o HMAC-SHA256 do corpo bruto, aceitando o formato base64 ou hex. Nenhuma mudança de código é necessária — só a configuração do segredo.
- A resposta continua sendo 200 mesmo em falha de assinatura, para a Yampi não entrar em loop de reenvio; o evento é apenas descartado.

## Observação de segurança
O valor foi colado no chat, ou seja, ficou registrado no histórico da conversa. Recomendo, depois de tudo funcionando, gerar um novo segredo na Yampi e substituí-lo aqui — posso fazer a troca em um passo.

## Fora do escopo
- Alterações no envio para a Meta (CAPI) ou na URL do gateway Stape.
- Qualquer mudança visual no site.
