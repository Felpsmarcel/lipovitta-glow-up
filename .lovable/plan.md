

# Editar Hero Section — "Conheça a Clara"

## O que muda
Substituir o conteúdo interno da HeroSection (texto sobre produto + placeholder de imagem) por apresentação da Clara Caldas com embed de vídeo do Instagram.

## Editar `src/components/HeroSection.tsx`

**Coluna esquerda (texto):**
- Tag "POR CLARA CALDAS" — uppercase, letter-spacing 2px, cor `#7BA33E`, fonte pequena
- Headline: "A transformação vem de dentro para fora!"
- Parágrafo com história da Clara (opacidade 90%)
- Subtexto itálico: "Lipedema não tem cura, mas tem controle."
- CTA: "QUERO COMEÇAR MINHA TRANSFORMAÇÃO" — fundo `#7BA33E`, rounded-full, pulse
- 3 badges: "100% Natural" | "Sem Glúten" | "+2.000 mulheres"

**Coluna direita (vídeo):**
- iframe do Instagram Reel (`/reel/DWZpEscEe_I/embed`), aspect-ratio 9/16, max-height 580px, border-radius 16px, sombra
- Fallback com `onError`: div placeholder com ícone play e link externo "Assistir no Instagram"
- Texto abaixo: "📍 @clarinhacbr no Instagram"

**Fundo:** Manter `#1B3A6B` sólido com padrão geométrico SVG sutil (opacity 5%)

**Mobile:** Texto primeiro, vídeo abaixo full-width (max-height 500px), botão full-width, centralizado

## Editar `index.html`
- Adicionar `<script async src="https://www.instagram.com/embed.js"></script>` no `<head>`

## Copiar imagem
- Copiar `user-uploads://PHOTO-2025-12-29-14-25-56.jpg` para `src/assets/clara-caldas-hero.jpg` (imagem da Clara para uso futuro/fallback, não será usada diretamente no hero agora pois o foco é o vídeo)

