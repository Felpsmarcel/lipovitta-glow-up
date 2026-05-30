# Ritmo vertical entre seções

Hoje quase todas as seções usam o mesmo padding (`py-16 md:py-24`), gerando uma cadência uniforme demais. Vou variar os espaçamentos verticais (top/bottom independentes) por seção, sem mexer em conteúdo, cores, links ou scripts.

## Mudanças por arquivo

Padrão atual → novo (apenas classes de padding/margin no wrapper `<section>`):

- **HeroSection.tsx** — mantém topo, reduz base: `pt-20 md:pt-28 pb-10 md:pb-16`
- **RoutineSection.tsx** — respiro maior no topo, base curta: `pt-14 md:pt-20 pb-8 md:pb-12`
- **TestimonialsSection.tsx** — base generosa pra "soltar" o mosaico: `pt-10 md:pt-14 pb-20 md:pb-28`
- **BenefitsSection.tsx** — compacto no topo, médio embaixo: `pt-12 md:pt-16 pb-16 md:pb-24`
- **CTABanner.tsx** — mais apertado, age como pausa: `py-10 md:py-14` (1ª) / `py-8 md:py-12` (2ª instância, se possível via prop ou só ajuste único)
- **ForWhoSection.tsx** — assimétrico: `pt-20 md:pt-28 pb-12 md:pb-16`
- **HowToUseSection.tsx** — curto em cima, longo embaixo: `pt-10 md:pt-14 pb-20 md:pb-28`
- **IngredientsSection.tsx** — bloco "respirado": `pt-16 md:pt-24 pb-20 md:pb-28`
- **OfferSection.tsx** — destaque com mais ar em cima: `pt-24 md:pt-32 pb-16 md:pb-20`
- **ProductsSection.tsx** — médio/curto: `pt-12 md:pt-16 pb-16 md:pb-20`
- **FAQSection.tsx** — padrão equilibrado: `pt-14 md:pt-20 pb-14 md:pb-20`
- **ContactSection.tsx** — fecha enxuto: `pt-10 md:pt-14 pb-16 md:pb-24`

## Regras

- Sem alterar conteúdo, classes de cor, gradientes, animações, links, pixels ou checkout.
- Apenas as classes `py-*` / `pt-*` / `pb-*` do `<section>` raiz de cada componente.
- Mobile preservado: valores `md:`/`lg:` só ampliam no desktop.
- Cadência alvo: alternar seções "curtas" (≈ pt-10/pb-12) com "longas" (≈ pt-24/pb-28), evitando dois blocos iguais consecutivos.
