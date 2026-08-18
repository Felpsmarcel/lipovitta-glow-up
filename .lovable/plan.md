# Divergência de preço: Kit Shot Rush + Cápsulas (site R$407,40 x Yampi R$379,20)

## O que os números mostram

No print do checkout:
- Produtos: R$582,00 (mesma base do site: 357 + 225)
- Desconto: R$232,80 → exatamente **40%** de 582
- Frete: +R$30,00
- Total: R$379,20 (349,20 + 30)

No site o mesmo kit aparece por R$407,40, que é **30%** de desconto sobre 582.

Ou seja: não é erro de soma nem de link. O site aplica 30% (regra "2 produtos") e a Yampi aplica 40%, porque no painel da Yampi essa oferta está cadastrada com 40% — provavelmente por contar 3 itens no combo (Cápsulas + Shot Rush + Garrafa de brinde) em vez de 2 produtos vendáveis.

Segundo ponto: o frete de R$30 é cobrado porque, depois do desconto, o subtotal (R$349,20) fica abaixo dos R$400 anunciados como "PAC grátis acima de R$400". A regra de frete na Yampi está avaliando o valor **com** desconto.

## Decisão necessária

Qual é o preço correto para esse kit?

- **A) 40% (R$349,20)** — mantém o que a Yampi já cobra; ajusto o site para exibir 40% nesse kit e passo a contar o brinde/3 itens na régua.
- **B) 30% (R$407,40)** — o site está certo; a correção é no painel da Yampi (baixar o desconto do combo para 30%), sem mudança de código.

## O que farei em cada caso

### Se A (site acompanha a Yampi)
- `OfferSection.tsx`: o kit "Kit Shot Rush + Cápsulas" passa a usar a faixa de 40% (base R$582,00 → R$407,40 vira R$349,20), com selo, preço riscado, parcelamento e economia recalculados.
- Reviso o "Protocolo Completo" e o "Kit Completo" no mesmo critério, para que nenhum card divirja do que a Yampi cobra.
- Ajusto o texto de frete: em vez de "PAC grátis acima de R$400", deixo claro que o critério é o valor após o desconto (ou o valor que você definir na Yampi).

### Se B (Yampi acompanha o site)
- Nenhuma mudança de código no preço. Te passo exatamente o que alterar na Yampi (desconto do combo de 40% para 30%) e reviso apenas o texto do frete, para não prometer PAC grátis em um pedido que fecha abaixo de R$400.

## Fora de escopo
- Links de checkout, fluxo de brindes e rastreamento continuam como estão.
