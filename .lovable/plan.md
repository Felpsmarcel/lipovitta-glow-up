# Corrigir confusão entre os botões Shot Matinal e Shot Rush

## O que foi verificado

Testei o fluxo real no navegador:

- Botão do card **Shot Rush Pré-Treino** (seção "Complementos opcionais") → abre
  `https://seguro.lipovitta.site/r/5NYVZ7D8UT?utm_content=...` — ou seja, o link certo.
- Botão do card **Shot Matinal** (seção de ofertas) → abre
  `https://lipovitta2.catalog.yampi.io/shot-matinal-lipovitta/p?utm_content=...`

Os dois botões têm hoje **o mesmo texto**: "ADICIONAR À MINHA ROTINA" (ofertas / Shot Matinal)
e "Adicionar à minha rotina" (complementos / Shot Rush). É muito fácil clicar em um pensando
que é o outro — inclusive meu primeiro teste automatizado caiu nessa.

Ou seja: o código está apontando para o link correto do Shot Rush. O que precisa mudar é a
clareza dos botões — e, se ainda assim a página final mostrar o Shot Matinal, o problema está
no destino do link curto no painel da Yampi (fora do site).

## O que vou fazer

1. **Diferenciar os rótulos dos botões**
   - Card Shot Matinal (ofertas): "COMPRAR SHOT MATINAL".
   - Card Shot Rush (complementos): "COMPRAR SHOT RUSH".
2. **Reforçar o nome do produto na etapa do brinde**, que já exibe "Etapa final · <produto>",
   deixando o nome mais visível para o cliente conferir antes de finalizar.
3. **Reteste no navegador** dos dois caminhos, confirmando as URLs finais abertas.

## Detalhes técnicos

- `src/components/OfferSection.tsx` (~linha 583): trocar o texto do botão do card Shot Matinal.
- `src/components/ProductsSection.tsx` (~linha 110): trocar o texto do botão do card Shot Rush.
- `src/components/GiftSelectionSection.tsx`: destacar `selectedKit.name` no selo de etapa final.
- Nenhum link de checkout será alterado — `LINK_SHOT` e `checkoutUrl` do Shot Rush ficam como estão.

## Se o problema persistir

Se ao abrir `https://seguro.lipovitta.site/r/5NYVZ7D8UT` a página exibir Shot Matinal, o
redirecionamento desse link curto precisa ser corrigido no painel da Yampi — não há como
ajustar isso pelo site.
