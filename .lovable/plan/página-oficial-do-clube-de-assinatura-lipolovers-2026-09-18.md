# Página oficial do Clube de Assinatura Lipolovers

## Resultado

Criar duas novas páginas, sem alterar a home atual:

- `/lipolovers`: apresentação e conversão dos planos Essencial e Master.
- `/lipolovers/boas-vindas`: confirmação dos dados de entrega após pagamento aprovado.

A experiência será mobile-first, alinhada à identidade LipoVitta, usando apenas imagens reais já existentes dos produtos e os textos comerciais fornecidos.

## Página `/lipolovers`

- Cabeçalho simples com logomarca e retorno ao site.
- Hero com “Lipolovers”, headline, explicação da assinatura, destaque “A partir de R$399/mês”, aviso de frete e CTA para os planos.
- Composição visual leve e assimétrica, com Royal Blue, Olive Green, branco, bastante respiro e produtos como protagonistas.
- Dois planos:
  - **Lipolovers Essencial — R$399/mês:** Cápsulas + Shot Matinal.
  - **Lipolovers Master — R$449/mês:** Cápsulas + Shot Matinal + Shot Rush Frutas Vermelhas, com badge “Mais completo”.
- Seleção de sabor do Shot Matinal: Tangerina, Limão ou Abacaxi.
- Bloco curto com as regras: cobrança mensal, sem fidelidade e frete calculado à parte.
- FAQ com as sete perguntas solicitadas.
- Rodapé institucional existente.
- CTA inferior fixo somente no celular, testado a partir de 360 px.

## Captura antes do checkout

- Todo CTA de plano abre um modal acessível antes do pagamento.
- O modal mantém o plano selecionado e exige: nome, WhatsApp, e-mail e sabor.
- Validação no navegador e novamente no backend, com mensagens claras e limites de tamanho.
- Ao salvar:
  1. registrar o interesse com origem `site-lipolovers`;
  2. registrar o evento `Lead`;
  3. preparar/sincronizar o contato no GHL com as tags `lipolovers-interesse`, tag do plano e tag do sabor;
  4. registrar `InitiateCheckout` com identificador único;
  5. direcionar ao checkout correspondente.
- Links centralizados em uma configuração própria, nunca espalhados nos componentes:
  - Essencial: `https://seguro.lipovitta.site/b/ERLVJYQMJDSK`
  - Master: `https://seguro.lipovitta.site/b/CS0TSDGA96O0`
- O identificador do checkout seguirá na URL para que o webhook existente possa relacionar o pagamento ao lead.

## Página `/lipolovers/boas-vindas`

- Exibir a mensagem fornecida e o formulário com nome, e-mail da assinatura, WhatsApp, CEP, endereço, número, complemento, bairro, cidade e estado.
- Consultar o backend sem expor dados pessoais e aceitar a confirmação somente quando houver pagamento aprovado relacionado ao lead pelo webhook existente.
- Salvar endereço e contato vinculados ao lead/pedido confirmado, com atualização idempotente.
- Se o pagamento ainda estiver processando, mostrar estado de espera e permitir nova tentativa, sem criar pedido ou disparar compra.

## Rastreamento e segurança comercial

- `ViewContent` uma vez ao acessar `/lipolovers`.
- `Lead` somente após o cadastro ser salvo.
- `InitiateCheckout` imediatamente antes do redirecionamento ao checkout.
- Nenhum `Purchase` no navegador, no formulário ou na página de retorno.
- `Purchase` continuará exclusivo do webhook quando o pagamento estiver realmente aprovado.
- Nenhum envio dos formulários criará pedido Yampi.
- Não incluir promoção de terceira remessa, alegações médicas, promessa de cura ou tratamento.

## Backend

- Criar tabelas próprias para interesses Lipolovers e dados de entrega, com permissões mínimas, proteção por linha e acesso público apenas pelas funções validadas.
- Criar uma função de captura para validar o lead, persistir plano/sabor/origem/identificador e encaminhar as tags autorizadas ao GHL sem expor credenciais.
- Adaptar o webhook de pedidos existente para marcar o lead como pago quando o identificador do checkout e o status aprovado coincidirem; eventos não pagos não liberam entrega.
- Criar uma função de confirmação de entrega que valide e-mail, lead e pagamento aprovado antes de gravar endereço.
- Manter dados pessoais fora de logs e respostas públicas.

## SEO, acessibilidade e validação

- Metadados e endereço canônico próprios para as duas rotas.
- Navegação por teclado, foco visível, rótulos associados, modal com foco controlado e contraste adequado.
- Testes para validação dos formulários, tags corretas, eventos sem `Purchase`, bloqueio sem pagamento e liberação após pagamento aprovado.
- Conferir desktop e mobile em 360 px, incluindo modal, CTA fixo, planos, FAQ e página de boas-vindas.
- Mostrar as duas páginas completas no preview para revisão.
- Não publicar nesta etapa e não modificar o conteúdo ou o layout da home.

## Observação operacional

O redirecionamento de sucesso do checkout deverá apontar para `https://lipovitta.site/lipolovers/boas-vindas`. Se essa configuração externa ainda não estiver ativa, a página estará pronta, mas o retorno automático dependerá desse ajuste no checkout.
