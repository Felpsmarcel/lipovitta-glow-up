# Liberar a confirmação de entrega do Lipolovers pelo pagamento aprovado

Hoje a página de boas-vindas só mostra o formulário de endereço quando a assinatura está marcada como paga. Essa marcação só acontecia pelo caminho antigo de pagamento. Como o Essencial passou a ser cobrado pelo Mercado Pago, ninguém fica marcado como pago e a cliente trava na tela de "aguardando confirmação".

## Como o webhook funciona (passo a passo, sem termos técnicos)

Pense no webhook como um recado automático: quando o pagamento é aprovado, um sistema avisa o outro na hora.

1. A cliente preenche o formulário no site e é levada ao pagamento no Mercado Pago.
2. O Mercado Pago aprova o pagamento.
3. O GoHighLevel recebe essa aprovação (é ele que acompanha a assinatura hoje).
4. Dentro do GoHighLevel existe um fluxo (automação). Nele você adiciona uma última ação: "enviar um aviso para um endereço na internet".
5. Esse endereço é o que eu vou criar no seu backend. É um link fixo, tipo `https://.../lipolovers-payment`.
6. Junto do aviso vai o e-mail da assinante e uma senha secreta (para ninguém falsificar o recado).
7. Meu backend recebe, encontra a assinante pelo e-mail e marca a assinatura como paga.
8. A página de boas-vindas percebe a mudança sozinha e libera o formulário de endereço.

Resumindo o que fica com cada um: eu crio o endereço e a senha; você cola esses dois dentro do fluxo do GoHighLevel, no ponto em que o pagamento é aprovado. Uma vez só — depois funciona sozinho para todas as assinantes.

## O que será construído

1. **Endereço de webhook próprio** para pagamentos Lipolovers, protegido por uma senha secreta enviada em cada aviso. Aviso sem a senha certa é recusado.
2. **Identificação da assinante**: usa o código gerado no cadastro quando o GoHighLevel conseguir repassá-lo; senão procura pelo e-mail e depois pelo telefone. Não achando ninguém, responde com erro claro e não aprova nada.
3. **Marcação segura e repetível**: grava pagamento aprovado, data e referência. Se o mesmo aviso chegar duas vezes, nada duplica.
4. **Cancelamento ou estorno** (se o GoHighLevel enviar) volta a assinatura para pendente, para não liberar entrega de quem não pagou.
5. **Página de boas-vindas** passa a reconsultar o status sozinha enquanto a cliente espera, sem precisar recarregar.
6. **Teste automatizado**: cadastro, aviso simulado de pagamento e verificação de que o formulário de endereço abre.

## O que você precisa fazer depois que eu terminar

- Eu te entrego o endereço do webhook e peço que você guarde a senha secreta em local seguro.
- No GoHighLevel, abrir o fluxo da assinatura Lipolovers, adicionar a ação de webhook no passo de pagamento aprovado, colar o endereço, a senha e incluir o e-mail da assinante no aviso.
- No Mercado Pago não muda nada: quem avisa o backend é o GoHighLevel.

## Detalhes técnicos

- Nova função `supabase/functions/lipolovers-payment/index.ts`, `verify_jwt = false`, validando o header `x-lipolovers-secret` contra o segredo `LIPOLOVERS_WEBHOOK_SECRET` em comparação de tempo constante.
- Corpo validado com zod: `event` (`payment.approved` | `payment.refunded` | `subscription.cancelled`), `token?`, `email?`, `phone?`, `payment_id?`, `paid_at?`.
- Busca em `lipolovers_leads`: `claim_token_hash = sha256(token)`, senão `email`, senão telefone só com dígitos; sempre o registro mais recente.
- Update via service role: `payment_status='approved'`, `paid_at`, `paid_order_id = payment_id`; idempotente (não sobrescreve `paid_at` existente). Estorno/cancelamento volta para `pending`.
- Logs sem PII — apenas id do lead e id do pagamento.
- `LipoloversWelcome.tsx`: polling de `action: "status"` a cada 10s enquanto pendente, parando após aprovação.
- Teste em `supabase/functions/lipolovers-payment/lipolovers_payment_test.ts` para schema e resolução de identificador.
