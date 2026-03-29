

# Seção "Linha Completa LipoVitta"

## O que será feito
Criar `src/components/ProductsSection.tsx` com fundo azul escuro (#1B3A6B), 3 cards de produtos lado a lado no desktop e carrossel Embla swipeable no mobile.

## Componente `ProductsSection.tsx`
- Título #7BA33E + subtítulo branco, linha decorativa gradiente
- 3 cards brancos com border-radius 16px, sombra, hover com borda inferior #7BA33E
- Cada card: badge colorido no topo, placeholder imagem, descrição, lista com bullets #7BA33E, tag secundária (#E8ECF1), botão "Ver oferta" (#2E5EA6)
- Botão faz smooth scroll para seção de preços (`document.getElementById('precos')?.scrollIntoView`)
- Mobile: Embla Carousel com dots (mesmo padrão de TestimonialsSection)
- Desktop: grid 3 colunas

## Editar `Index.tsx`
- Importar `ProductsSection` e adicionar após `IngredientsSection`

