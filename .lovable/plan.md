

# Seção de Depoimentos

## O que será feito
Criar componente `TestimonialsSection` abaixo do Hero com:

1. **Título + linha decorativa** — centralizado, gradiente azul→verde
2. **Grid de 6 cards** — 3 colunas desktop, carrossel swipeable no mobile usando Embla Carousel (já instalado)
3. **Cada card**: avatar placeholder circular, nome, cidade, 5 estrelas verdes, texto em itálico com aspas, badge "Compra verificada"
4. **Contador animado** — "+ de 2.000 mulheres..." com Intersection Observer para animar os números ao entrar na viewport

## Arquivos
- **Criar** `src/components/TestimonialsSection.tsx` — componente completo com dados, cards, carrossel mobile, contador
- **Editar** `src/pages/Index.tsx` — importar e adicionar abaixo do HeroSection

## Detalhes técnicos
- Mobile: Embla Carousel horizontal swipeable com dots de navegação
- Desktop: CSS grid 3 colunas, sem carrossel
- Contador: hook `useInView` com Intersection Observer + `useState` para animar de 0 a 2000 com easing
- Estrelas renderizadas com lucide-react `Star` icon preenchida em #7BA33E

