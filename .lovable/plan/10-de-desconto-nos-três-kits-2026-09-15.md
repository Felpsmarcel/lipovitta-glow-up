# 10% de desconto nos três kits

## O que muda

Desconto fixo de 10% aplicado apenas aos kits:

| Kit | Preço atual | Com 10% |
| --- | --- | --- |
| Kit Completo LipoVitta | R$ 752,00 | R$ 676,80 |
| Kit Shot Rush + Cápsulas | R$ 582,00 | R$ 523,80 |
| Protocolo Completo LipoVitta | R$ 527,00 | R$ 474,30 |

Cápsulas e Shot Matinal avulsos continuam sem desconto.

Nos três cards de kit aparece:
- preço cheio riscado + preço com desconto em destaque
- selo "10% OFF"
- economia em reais
- parcelamento recalculado sobre o novo valor

O nome "Protocolo Completo LipoVitta" fica como está.

## Detalhes técnicos

- Em `src/components/OfferSection.tsx`, criar um desconto de kit (10%) aplicado por `id` (`kit-completo`, `kit-rush`, `protocolo`), com preço original preservado para exibição riscada.
- Não mexer na promoção de aniversário (`PromoContext`): ela está fora do período; quando ativa, ela prevalece e o desconto de kit não é somado, evitando desconto duplo.
- O valor enviado ao rastreamento (`trackCtaClick`) passa a ser o valor exibido.
- Links de checkout, fluxo de brindes e escolha de sabor permanecem iguais.

## Atenção

O desconto ainda não está configurado no checkout. Até você criar a regra de 10% na Yampi para esses três kits, o site mostrará um preço menor do que o cobrado. Posso deixar pronto e você ativa lá — ou avise quando estiver configurado para publicarmos juntos.
