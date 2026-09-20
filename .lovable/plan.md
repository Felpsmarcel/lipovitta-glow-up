# Liberar a confirmação de entrega do Lipolovers pelo webhook do GHL

Hoje a página de boas-vindas só libera o formulário de entrega quando o lead está com pagamento aprovado, e esse "aprovado" só é gravado pelo caminho da Yampi. Como o Essencial passou a ser cobrado pelo Mercado Pago, nenhuma assinatura nova fica aprovada e a cliente trava na tela de espera.

A solução é criar um endereço de webhook próprio no backend, que o GoHighLevel chama quando o pagamento da assinatura é confirmado. Ao receber, o backend marca o lead como aprovado e a página de boas-vindas libera o endereço imediatamente.

## O que será feito

1. **Novo endereço de webhook** exclusivo para pagamentos Lipolovers, protegido por uma chave secreta que o GHL envia em cada chamada. Chamadas sem a chave correta são recusadas.
2. **Identificação da assinante**: o webhook aceita o token gerado no momento do cadastro (quando o GHL consegue repassá-lo) e, na falta dele, procura o lead pelo e-mail e depois pelo telefone. Se não encontrar ninguém, responde com erro claro e registra o caso, sem aprovar nada.
3. **Aprovação segura e repetível**: marca o lead como aprovado, guarda a data do pagamento e a referência do pagamento recebida. Se o GHL reenviar o mesmo aviso, nada é duplicado.
4. **Eventos de cancelamento/estorno** (se o GHL enviar) revertem o lead para pendente, para não liberar entrega de quem não pagou.
5. **Página de boas-vindas**: sem mudança de regra — ela continua consultando o status; passa a liberar sozinha assim que o webhook chega. Também passa a reconsultar o status periodicamente enquanto a cliente estiver aguardando, para não precisar recarregar a página.
6. **Teste automatizado** do fluxo: cadastro de lead, envio simulado do aviso de pagamento, verificação de que o formulário de entrega abre.

## O que você precisará fazer depois

- Guardar a chave secreta (eu peço no momento certo) e colar o endereço do webhook dentro do fluxo do GoHighLevel que trata o pagamento aprovado da assinatura, com o e-mail da assinante no corpo do aviso.
- Nada muda no Mercado Pago diretamente: o GHL é quem avisa o backend.

## Detalhes técnicos

- Nova função `supabase/functions/lipolovers-payment/index.ts`, `verify_jwt = false`, validação por header `x-lipolovers-secret` comparado a um segredo dedicado (`LIPOLOVERS_WEBHOOK_SECRET`) em comparação de tempo constante.
- Corpo validado com zod: `event` (`payment.approved` | `payment.refunded` | `subscription.cancelled`), `token?`, `email?`, `phone?`, `payment_id?`, `paid_at?`.
- Busca em `lipolovers_leads`: por `claim_token_hash = sha256(token)`, senão por `email`, senão por telefone normalizado (só dígitos), sempre o registro mais recente.
- Update com service role: `payment_status='approved'`, `paid_at`, `paid_order_id = payment_id`; idempotente (não sobrescreve `paid_at` já existente). Eventos de estorno voltam para `pending`.
- Sem PII em logs — apenas id do lead e id do pagamento.
- `LipoloversWelcome.tsx`: polling do `action: "status"` a cada 10s enquanto pendente, com parada após aprovação.
- Teste em `supabase/functions/lipolovers-payment/lipolovers_payment_test.ts` para validação de schema e resolução de identificador.
