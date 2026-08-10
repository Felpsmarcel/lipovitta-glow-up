# Trocar o segredo do webhook da Yampi

## Objetivo
Atualizar o `YAMPI_WEBHOOK_SECRET` no backend do projeto para o novo valor que você acabou de gerar no painel da Yampi, garantindo que a validação de assinatura continue funcionando.

## O que será feito
1. Receber o novo secret (valor gerado no painel da Yampi).
2. Salvar/atualizar o segredo `YAMPI_WEBHOOK_SECRET` no backend do projeto.
3. Testar a função `yampi-webhook`:
   - requisição sem assinatura ou com assinatura errada → resposta `invalid_signature`;
   - requisição com assinatura correta → processada normalmente.
4. Confirmar nos logs que a função está usando o novo segredo e não há avisos de "YAMPI_WEBHOOK_SECRET não configurado".

## Detalhes técnicos
- A função `yampi-webhook` já implementa a verificação HMAC-SHA256 via header `x-yampi-hmac-sha256`. Nenhuma alteração de código é necessária — apenas a troca do secret no backend.
- O valor antigo será substituído; a função passa a recusar eventos assinados com o segredo anterior.

## Fora do escopo
- Alterações no painel da Yampi (já feitas por você).
- Mudanças no código da função ou no fluxo de envio para a Meta.
- Qualquer alteração visual no site.
