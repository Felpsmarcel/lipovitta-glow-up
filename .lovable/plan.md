## Aplicar regra dos "10% OFF comprando hoje"

Replicar nos demais cards o mesmo padrão visual já usado em LipoVitta Cápsulas: badge verde "10% OFF comprando hoje", preço cheio riscado, preço com desconto em destaque, pill "Economize 10%" e parcelamento recalculado (3x sem juros).

### Cards afetados

**1. Protocolo Completo (OfferSection)**
- Substituir a economia atual (R$527 → R$447,95) pela regra dos 10% sobre R$527.
- Preço novo: R$474,30 — 3x de R$158,10 sem juros.
- Remover o bloco "Comprando separado / No Protocolo / Você economiza R$79,05".
- Atualizar a tag superior "Economia de R$79,05" → "Economize 10%".
- Trocar o bullet "Economia de R$79,05..." por algo neutro (ex.: "Cápsula + Shot juntos em um pedido").
- Remover menções a "R$79,05" no rodapé do card 3 (Shot Matinal) para manter coerência.

**2. Shot Matinal LipoVitta (OfferSection)**
- Adicionar badge "10% OFF comprando hoje".
- De R$170,00 → R$153,00 (3x de R$51,00 sem juros) + pill "Economize 10%".

**3. Shot Rush Pré-Treino (ProductsSection)**
- Adicionar badge "10% OFF comprando hoje".
- De R$225,00 → R$202,50 (3x de R$67,50 sem juros) + pill "Economize 10%".

**Não alterar**
- Gummy VittaGlow (esgotado).
- Card de Cápsulas (já tem a regra).

### Arquivos
- `src/components/OfferSection.tsx`
- `src/components/ProductsSection.tsx`
