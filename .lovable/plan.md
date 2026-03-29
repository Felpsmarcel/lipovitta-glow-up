

# Adicionar Imagens Reais dos Produtos

## Mapeamento imagens → produtos
- `Produto_1` = Shot Rush
- `Produto_2` = Gummy VittaGlow
- `Produto_3` = Shot Matinal
- `Produto_4` = Combo LipoVitta (para card destaque Kit)
- `Produto_5` = Cápsulas LipoVitta

## Arquivos

### 1. Copiar 5 imagens para `src/assets/`
- `shot-rush.jpg`, `gummy-vittaglow.png`, `shot-matinal.jpg`, `combo-lipovitta.jpg`, `capsulas-lipovitta.png`

### 2. Editar `src/components/ProductsSection.tsx`
- Adicionar campo `image` em cada produto do array
- Substituir o placeholder (div com ícone Package) por `<img>` com a imagem real
- `object-contain`, `loading="lazy"`, alt text descritivo

### 3. Editar `src/components/OfferSection.tsx`
- Adicionar campo `image` opcional no tipo `Product`
- Associar imagens aos produtos individuais e ao card destaque
- Exibir imagem pequena ao lado do nome no card (ou acima), mantendo layout compacto

