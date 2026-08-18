# Corrigir preço do Shot Rush (desconto aplicado duas vezes)

## Problema
No card do Shot Rush o desconto de aniversário está sendo aplicado duas vezes: o valor cheio (R$225,00) vira R$180,00 e esse já é usado como base pelo componente de preço, que aplica outros 20% e mostra R$144,00 com R$180,00 riscado.

## Correção
- O card deve receber o kit com o valor cheio (R$225,00) e o componente de preço aplica o desconto uma única vez.
- Resultado exibido: R$225,00 riscado, R$180,00 em destaque, "Economize 45,00", 3x R$60,00 sem juros.
- O kit já com desconto continua sendo usado apenas para o fluxo de brinde/checkout e rastreamento, sem duplicar o cálculo.

## Não muda
- Link de checkout, regras de brinde, período da promoção e demais produtos.
