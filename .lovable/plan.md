## Objetivo
Substituir o grid placeholder vazio da seção "O que nossas clientes dizem" pelas 6 imagens enviadas (cards visuais de benefícios + prints de WhatsApp da Clara).

## Mudanças

### 1. Copiar as 6 imagens para `src/assets/testimonials/`
- `PHOTO-2026-03-24-07-58-08.jpg` → `desinchar.jpg` ("Você começa a desinchar de verdade")
- `PHOTO-2026-03-24-07-58-08_2.jpg` → `peso-pernas.jpg` ("A sensação de peso nas pernas diminui")
- `PHOTO-2026-03-24-07-58-08_3.jpg` → `inflamacao.jpg` ("A inflamação do corpo começa a reduzir")
- `PHOTO-2026-03-24-07-58-08_4.jpg` → `corpo-pedindo-ajuda.jpg` ("Não era só inchaço")
- `PHOTO-2026-03-24-07-58-09_2.jpg` → `pele-melhora.jpg` ("A aparência da pele melhora")
- `PHOTO-2026-03-24-07-58-09_5.jpg` → `nao-era-esforco.jpg` ("Não era falta de esforço")

### 2. Atualizar `src/components/TestimonialsSection.tsx`
- Importar as 6 imagens via ES6.
- Remover o array `placeholderSlots` e o overlay "Em breve: depoimentos reais...".
- Renderizar grid responsivo (1 / 2 / 3 colunas) com as 6 imagens em `aspect-[4/5]` (proporção original das peças), `object-cover`, `rounded-2xl`, `shadow-sm`, com `alt` descritivo para SEO/acessibilidade.
- Manter título, divisor, subtítulo e o contador animado intactos.

### 3. Sem alterações em
- `OfferSection.tsx`, `ProductsSection.tsx`, pixels, scripts, checkouts ou qualquer outra seção.
