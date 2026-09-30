# Ativar a ação de pagamento aprovado no GoHighLevel (Lipolovers)

## Situação
- O endereço `lipolovers-payment` está publicado e protegido: aviso sem a senha certa é recusado.
- A ação dentro do fluxo do GoHighLevel não pode ser editada automaticamente. A API só permite consultar fluxos e inscrever contatos, não mudar as ações. Por isso, esse passo precisa ser feito por você no painel do GoHighLevel.

## Passo 1: você configura no GoHighLevel (uma vez só)
No fluxo que começa com a tag de pagamento aprovado, abra a ação de webhook e preencha:
- Método: `POST`
- URL: `https://ecgquvfoipmoqlhfkfol.supabase.co/functions/v1/lipolovers-payment`
- Cabeçalho: `x-lipolovers-secret` = a senha que você já guardou
- Corpo (JSON): `{"event":"payment.approved","email":"{{contact.email}}","payment_id":"{{contact.id}}"}`
- Salve e publique o fluxo.

## Passo 2: eu confirmo que funciona de ponta a ponta
1. Crio uma assinante de teste com um dos e-mails autorizados (ffmconsultoria@gmail.com), sem pagamento real.
2. Você aplica a tag de pagamento aprovado nesse contato no GoHighLevel. Se você autorizar, eu mesmo aplico a tag pela API.
3. Eu confiro nos registros do sistema que o aviso chegou com sucesso e que a assinante ficou como paga.
4. Abro a página de boas-vindas dessa assinante e confirmo que o formulário de entrega aparece sozinho.
5. Aplico a tag de novo para garantir que um aviso repetido não causa efeito duplicado.
6. Removo a assinante de teste e a tag.

## Limites
- A senha não aparece no chat, nos registros nem no código.
- Nenhum pedido na Yampi, nenhuma expedição e nenhum Purchase no navegador.

## Detalhes técnicos
- Verificação com `supabase--edge_function_logs` (lipolovers-payment) e uma consulta a `lipolovers_leads.payment_status`.
- A tag é aplicada pela ferramenta existente `ghl_add_tags`, só no contato de teste.
- Playwright em `/lipolovers/boas-vindas?token=...` para confirmar o formulário.
