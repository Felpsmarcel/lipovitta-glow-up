## Objetivo

Reduzir o peso das imagens principais servindo **AVIF → WebP → fallback**, com **`srcset` responsivo** por largura de viewport. Sem mudar layout, textos ou lógica; só a forma como os arquivos de imagem são gerados e entregues.

## Abordagem

Usar **`vite-imagetools`** — plugin oficial do ecossistema Vite. Gera variantes em build time direto do arquivo original em `src/assets/`, então:

- Nada de rodar scripts manuais depois.
- Os PNGs/JPGs originais ficam no repo como fonte da verdade.
- O build produz automaticamente `.avif`, `.webp` e o fallback em várias larguras.
- Nomes com hash, cache imutável no CDN.

Ganho esperado: **50–70% menos bytes** nas imagens principais (hoje ~3,3 MB → ~1–1,5 MB), sem perda visual perceptível.

## Escopo — imagens a otimizar

Focar nas maiores e nas que aparecem acima da dobra ou no carrossel de oferta:

| Arquivo | Tamanho hoje |
|---|---:|
| `capsulas-lipovitta.png` | 1,01 MB |
| `gummy-vittaglow.png` | 1,09 MB |
| `shot-rush.jpg` | 469 KB |
| `combo-lipovitta.jpg` (usado via asset CDN) | 423 KB |
| `shot-matinal.jpg` | 363 KB |
| `shot-matinal-limao.jpg` | 213 KB |
| `shot-matinal-abacaxi.jpg` | 197 KB |
| `shot-matinal-tangerina.jpg` | 196 KB |
| `testimonials/*.jpg` (5 arquivos, 130–160 KB cada) | ~730 KB |

## Passos

1. **Instalar** `vite-imagetools` como devDependency.
2. **Configurar** o plugin em `vite.config.ts`.
3. **Criar helper `ResponsiveImage`** que aceita o objeto `picture` gerado pelo imagetools e renderiza:
   ```html
   <picture>
     <source type="image/avif" srcset="…" sizes="…" />
     <source type="image/webp" srcset="…" sizes="…" />
     <img src="…" srcset="…" sizes="…" loading="…" decoding="async" />
   </picture>
   ```
4. **Migrar imports** nos componentes:
   - `IngredientsSection.tsx` → cápsulas
   - `OfferSection.tsx` → cápsulas + shots matinais
   - `ProductsSection.tsx` → shot rush + gummy
   - `TestimonialsSection.tsx` → 5 imagens de depoimento
   
   Padrão de import:
   ```ts
   import capsulas from "@/assets/capsulas-lipovitta.png?w=400;800;1200&format=avif;webp;png&as=picture"
   ```
   Larguras adaptadas ao uso (produtos: 400/800/1200; testimonials: 480/960; combo: 600/1200).
5. **Manter atributos de performance** já usados (`loading="lazy"` em below-the-fold; a imagem LCP fica com `loading="eager"` + `fetchpriority="high"`).
6. **Validar** com `bun run build` + Playwright: novo peso transferido, LCP e ausência de 404 nas variantes.

## Fora de escopo

- Vídeo do hero (será outro passo se quiser).
- Imagens já servidas via `lovable-assets` (elas ficam como estão — o CDN já entrega, e trocar exigiria re-upload; posso fazer numa próxima rodada se quiser).
- Layout, textos, links, pixels, edge functions.

## Riscos

- `vite-imagetools` adiciona tempo ao build (aceitável, roda uma vez por deploy).
- Se algum componente usar a URL da imagem de forma não-padrão (background CSS, prop dinâmica), trato caso a caso mantendo o import atual.
