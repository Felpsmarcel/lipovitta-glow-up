## Objetivo
Atualizar o card de Cápsulas para exibir o preço com 10% de desconto já aplicado.

## Alterações no componente `src/components/OfferSection.tsx`

1. **Preço principal**: Alterar de `R$357,00` para `R$321,30` (357 × 0,9 = 321,30).
2. **Preço original riscado**: Adicionar `R$357,00` riscado ao lado do novo preço, para contextualizar o desconto.
3. **Parcelamento**: Atualizar de `3x de R$119,00` para `3x de R$107,10` (321,30 ÷ 3 = 107,10).
4. **Badge de economia**: Manter o badge verde "Economize 10%".

## Resumo visual esperado
```
[tag] 10% OFF comprando hoje
~~R$357,00~~  R$321,30  [Economize 10%]
ou 3x de R$107,10 sem juros
```