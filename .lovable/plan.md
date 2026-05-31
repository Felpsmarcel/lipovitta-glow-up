## Atualizar o Shot Matinal com os 3 sabores

O card "Shot Matinal LipoVitta" em `src/components/OfferSection.tsx` hoje mostra uma única imagem (`shot-matinal.jpg`). Vou substituí-la pelos 3 potes enviados — **Abacaxi**, **Limão** e **Tangerina** — exibidos lado a lado dentro do mesmo container de imagem do card.

### Passos

1. Copiar as 3 imagens enviadas para `src/assets/`:
   - `shot-matinal-abacaxi.jpg`
   - `shot-matinal-limao.jpg`
   - `shot-matinal-tangerina.jpg`

2. Em `src/components/OfferSection.tsx`:
   - Trocar o import de `shotMatinalImg` pelos 3 novos imports.
   - Substituir o `<img>` único (linha 181) por um layout flex com os 3 potes (`object-contain`, mesma altura), mantendo o fundo gradiente e a altura `h-32 sm:h-36` atual do container.
   - Adicionar uma pequena legenda abaixo das imagens: "Sabores: Abacaxi, Limão e Tangerina".
   - Atualizar o `alt` para refletir os 3 sabores.

3. Atualizar também a imagem do combo (linha 109) — não. Apenas o card do Shot Matinal, conforme pedido.

### Arquivos afetados

- `src/assets/shot-matinal-abacaxi.jpg` (novo)
- `src/assets/shot-matinal-limao.jpg` (novo)
- `src/assets/shot-matinal-tangerina.jpg` (novo)
- `src/components/OfferSection.tsx` (imports + bloco da imagem do card Shot Matinal)

O antigo `src/assets/shot-matinal.jpg` permanece no projeto (ainda referenciado pelo combo na linha 109, como "Cápsulas LipoVitta com Shot Matinal").
