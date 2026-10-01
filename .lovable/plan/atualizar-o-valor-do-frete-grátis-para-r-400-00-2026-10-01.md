# Atualizar o valor do frete grátis para R$ 400,00

O site hoje anuncia frete grátis a partir de R$ 323,00. O valor correto da loja é a partir de R$ 400,00.

## O que mudar

Atualizar o valor em 3 lugares (texto apenas, nada de layout):

1. `src/components/TrustBar.tsx` — "Em compras acima de R$323,00 para todo o Brasil." → R$400,00.
2. `src/components/ProductsSection.tsx` — "Frete grátis em compras a partir de R$323,00." → R$400,00.
3. `src/components/OfferSection.tsx` — "Frete grátis em compras a partir de R$323,00." → R$400,00.

Nenhuma outra menção precisa mudar: os selos "Frete grátis incluso" dos kits continuam corretos (os três kits passam de R$ 400), e o texto "Combine com a Cápsula para liberar frete grátis escolhendo o Protocolo Completo" também continua válido.

## Validação

- Conferir no preview que os 3 textos aparecem com R$ 400,00.
- Build sem erros.
