

# Nova Seção "A Rotina que Muda Tudo"

## O que será feito
Criar `src/components/RoutineSection.tsx` e inserir entre HeroSection e TestimonialsSection.

## 1. Criar `src/components/RoutineSection.tsx`
- `id="rotina"`, fundo `#F5F7FA`, padding 80px/48px
- 2 colunas desktop (gap 48px), empilhado mobile
- **Esquerda**: iframe Instagram (`/p/DWRSgEfEYW8/embed`), aspect-ratio 1:1, max-w 480px, rounded-2xl, sombra. Fallback com useState para erro. Texto "@lipo.vitta" abaixo.
- **Direita**: Título Playfair Display `#1B3A6B`, parágrafos emocionais Inter `#555`, "Não é." em bold maior, lista com checks `#7BA33E`, box destaque com borda esquerda verde, botão CTA scroll para produtos
- Usar `useScrollAnimation` hook existente

## 2. Editar `src/pages/Index.tsx`
- Importar `RoutineSection`
- Inserir `<RoutineSection />` entre `<HeroSection />` e `<TestimonialsSection />`

## Detalhes técnicos
- Script embed.js já está no `index.html` — não duplicar
- Fallback: `onError` no iframe → mostra placeholder com link externo
- Botão CTA: `document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })` (confirmar id da ProductsSection, adicionar se necessário)
- Google Fonts: Playfair Display precisa ser importado (adicionar no index.html ou index.css)

