# Reorganizar hierarquia da landing: foco na Cápsula + upsell limpo

## Problema
Hoje a landing tem duas seções com função parecida:
1. `OfferSection` — "Comece sua rotina LipoVitta" (Cápsula | Protocolo | Shot Matinal)
2. `ProductsSection` — "Potencialize sua rotina" (Shot Matinal | Gummy | Shot Rush)

O Shot Matinal aparece nas duas, gerando sensação de "duas ofertas" e tirando o foco do produto principal (Cápsula).

## Objetivo
Hierarquia clara: **Cápsula = decisão principal** → **Protocolo = upgrade** → **Complementos opcionais = upsell secundário** (sem repetir o Shot Matinal).

## Mudanças

### 1. `OfferSection.tsx` — manter como está
Os 3 cards (Cápsula | Protocolo | Shot Matinal) continuam intactos. Esta é a seção de decisão principal.

### 2. `ProductsSection.tsx` — reposicionar como "complementos opcionais"
- **Remover o Card A (Shot Matinal)** — ele já está em `OfferSection`.
- Restam **2 cards lado a lado** no desktop, empilhados no mobile:
  - Gummy VittaGlow
  - Shot Rush
- **Novo título**: "Complementos opcionais para sua rotina"
- **Novo subtítulo**: "Produtos que combinam com a Cápsula LipoVitta para quem quer ir além."
- **Microcopy mantida**: "Frete grátis em compras a partir de R$323,00."
- Botões em estilo **outline** (`border-2 border-[#2E5EA6] text-[#2E5EA6]`), tamanho menor — para deixar claro que são secundários em relação aos botões da seção principal.
- Remover bloco de comparação de preço, selo "Combina perfeitamente com a Cápsula" e demais elementos exclusivos do antigo Card A.
- Remover footer com "Voltar para a Cápsula LipoVitta" (deixar a seção mais enxuta) — ou manter um link discreto único.
- Limpar imports não utilizados (imagem do combo, imagem da Cápsula que só era usada na composição do Card A).

### 3. Links de checkout
Permanecem inalterados:
- Gummy: `/produtos/gummy-skin-glow/`
- Shot Rush: `/produtos/shot-rush-pre-treino/`

### 4. Não tocar em
- `OfferSection.tsx`
- `Index.tsx` (ordem das seções)
- Pixels, scripts, outros componentes

## Resultado
- Cápsula domina a página (Card 1 da `OfferSection`, maior, botão maior).
- Protocolo aparece como upgrade natural (Card 2 com "Mais escolhido" + economia).
- Shot Matinal aparece uma única vez (Card 3 da `OfferSection`).
- Gummy e Shot Rush ficam como complementos opcionais discretos abaixo, sem competir.
