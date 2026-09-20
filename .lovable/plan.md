# Corrigir a abertura do link de pagamento (Lipolovers)

## O que está acontecendo

A tela que você fotografou é o Mercado Pago recusando abrir **dentro da janelinha de preview**. Hoje o botão troca a página atual pelo link de pagamento; como o preview roda dentro de um quadro embutido, o Mercado Pago bloqueia e aparece "A conexão com www.mercadopago.com.br foi recusada".

Um segundo risco: o link curto `mpago.la/16SyCN8` recebe vários parâmetros de rastreamento colados no final, e links curtos às vezes não repassam isso.

## O que vou fazer

1. **Abrir o pagamento em uma nova aba**, sempre fora do quadro de preview, em vez de trocar a página atual.
2. **Testar o link curto com e sem os parâmetros de rastreamento.** Se ele não aceitar os parâmetros, mando o link limpo e guardo os dados de rastreamento do lado do site (já ficam salvos no cadastro que a cliente preenche antes).
3. **Plano B visível:** se o navegador bloquear a nova aba, a tela mostra um aviso com o botão "Abrir pagamento" para a cliente clicar.
4. **Validar de verdade:** abrir a página no celular e no computador, preencher o formulário e confirmar que o Mercado Pago abre com o valor certo.

## Detalhes técnicos

- `LipoloversLeadDialog.tsx`: trocar `window.location.assign` por `window.open(url, "_blank", "noopener")` com fallback para `window.top.location` quando o popup for bloqueado; renderizar um link âncora de fallback no estado pós-envio.
- Verificar via `curl -I` se `mpago.la/16SyCN8?...` mantém o 3xx para o checkout; se quebrar, enviar a URL sem query params (o `claim_token` já é persistido em `sessionStorage` e no banco pelo `lipolovers-lead`).
- Nada muda no backend, no webhook `lipolovers-payment`, nos preços ou no rastreamento (Lead e InitiateCheckout continuam disparando antes do redirecionamento).
