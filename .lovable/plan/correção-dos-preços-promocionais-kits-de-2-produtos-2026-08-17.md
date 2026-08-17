# Correção dos preços promocionais (kits de 2 produtos)

## Problema
O Protocolo Completo está marcado como 3 produtos, recebendo 40% OFF, e usa uma base de R$497,72 em vez da soma real dos produtos. O Kit Shot Rush + Cápsulas usa a base de kit R$546,30 em vez da soma real.

## Regra correta
- Base = soma dos valores reais dos produtos do kit
- 1 produto = 20% OFF, 2 produtos = 30% OFF, 3 ou mais = 40% OFF

## Ajustes

### Protocolo Completo (Cápsulas + Shot Matinal)
- productCount: 3 → 2
- Valor original: R$527,00 (357 + 170)
- Preço promocional: R$368,90 (30% OFF)
- Selos "40% OFF automático" → "30% OFF automático"
- Preço riscado fixo "R$497,72" passa a ser o valor original calculado
- Economia exibida: R$158,10

### Kit Shot Rush + Cápsulas
- Valor original: R$582,00 (357 + 225)
- Preço promocional: R$407,40 (30% OFF)
- Preço riscado fixo "R$546,30" passa a usar o valor original calculado
- Selo de desconto: 30% OFF

### Consistência geral
- Substituir os percentuais escritos manualmente nos cards por valor derivado de `getDiscountRate(productCount)`, para que nenhum card volte a divergir da régua.
- Cards de 1 produto (Cápsulas, Shot Matinal, Shot Rush) permanecem com 20% OFF.

## Não muda
- Links de checkout, fluxo de brindes, rastreamento e período da promoção (agosto/2026).
