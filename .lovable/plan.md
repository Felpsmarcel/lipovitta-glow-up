## Tornar a landing LipoVitta mais "desenhada à mão" — quebrar a simetria

Apenas mudanças visuais/layout. Sem alterar texto, preços, links, scripts, pixels ou checkout.

### 1. Hero (`HeroSection.tsx`)
- Mudar `flex-1` (texto) + `flex-shrink-0` (vídeo) para proporções claramente assimétricas no desktop: texto ocupa ~58% (`lg:basis-[58%]`), vídeo ~42% com `max-w-[360px]` (ligeiramente maior que os 326px atuais) e leve `lg:-translate-y-3 lg:rotate-[1deg]` para tirar do eixo.
- Remover `items-center` central; usar `lg:items-end` para deslocar o vídeo um pouco mais para baixo que o texto (desnivelamento intencional).
- No mobile: aumentar largura do vídeo para `max-w-[340px]` e aplicar `mx-auto -mr-6` para um leve recorte/sangria na direita, dando profundidade. Manter `overflow-hidden` da seção para não quebrar layout.
- CTA: remover `w-full sm:w-auto` ⇒ ficar `inline-block` desde mobile (largura natural ao texto), com leve `translate-x-[-2px]` em desktop.

### 2. Depoimentos (`TestimonialsSection.tsx`)
- Substituir o grid 3-colunas uniforme por um layout mosaico assimétrico no desktop usando `lg:grid-cols-6` com spans variados:
  - Card 1: `lg:col-span-3 lg:row-span-2` (destaque grande, retrato alto)
  - Card 2: `lg:col-span-3` (médio horizontal)
  - Card 3: `lg:col-span-2`
  - Card 4: `lg:col-span-2`
  - Card 5: `lg:col-span-2`
  - Card 6: `lg:col-span-3 lg:translate-y-4` (offset vertical sutil)
- Aspect ratios variados por posição (`aspect-[4/5]`, `aspect-[3/4]`, `aspect-square`) em vez de todos `aspect-[4/5]`.
- Mobile/tablet permanecem em 1/2 colunas (sem alterar responsividade).
- Adicionar levíssima rotação alternada (`rotate-[-0.5deg]`/`rotate-[0.5deg]`) nos cards menores.

### 3. Benefícios (`BenefitsSection.tsx`)
- Trocar o grid 3-colunas simétrico por layout alternado em `lg:grid-cols-6`:
  - Linha 1: benefício 1 `col-span-4` (largo) + benefício 2 `col-span-2`
  - Linha 2: benefício 3 `col-span-2` + benefício 4 `col-span-2` + benefício 5 `col-span-2`
  - Linha 3: benefício 6 `col-span-4 col-start-2` (largo, deslocado à direita)
- Adicionar fundo branco/card sutil aos cards (atualmente sem container visível — `border` definido mas sem `bg`/`p`/`rounded`). Aplicar `bg-white rounded-2xl p-6 border` para legibilidade.
- Tablet (`md`) usa 2 colunas regulares; mobile permanece 1 coluna.

### 4. Ingredientes (`IngredientsSection.tsx`)
- Texto do header: trocar `text-center` por `md:text-left md:pl-2` (leve descentralização no desktop).
- A linha decorativa abaixo do título sai do `mx-auto` e fica `md:ml-2`.
- A seção atual não exibe imagem do produto; portanto, adicionar um `<img>` decorativo das cápsulas (`capsulas-lipovitta.png` já existente em `src/assets`) flutuando à direita do título em desktop (`hidden md:block absolute right-4 top-4 w-32 rotate-[-3deg] opacity-95 drop-shadow-xl`), dentro de um wrapper `relative`. Não inserir no mobile para não competir com o conteúdo.

### 5. Oferta (`OfferSection.tsx`)
- Hoje os cards estão `items-stretch` (mesma altura) com Protocolo levemente escalado. Trocar para `items-start` e dar pesos distintos:
  - Card Cápsulas: padding maior `p-7 sm:p-9`, imagem `h-56 sm:h-64`, shadow mais forte (`shadow-xl`), leve elevação (`lg:-translate-y-2`).
  - Card Protocolo: mantém destaque "MAIS ESCOLHIDO" mas remove `lg:scale-[1.03]` para deixar a Cápsula ser a maior visualmente.
  - Card Shot Matinal: mantém compacto (`p-5`, imagem `h-32`), `lg:translate-y-6` para ficar nitidamente "menor e mais baixo".
- Resultado: três alturas distintas em vez de iguais.

### 6. Elementos decorativos orgânicos
- Adicionar 2 SVGs inline sutis e responsivos (sem dependência nova):
  - Uma linha curva fina verde-sálvia (`#8FAE82` @ 30% opacity) atravessando a transição Hero → Benefícios, posicionada `absolute` em wrappers `relative` já existentes.
  - Uma mancha orgânica nude/sálvia (blob path SVG, opacity 0.08) como fundo decorativo atrás do título da seção Ingredientes e atrás do card Protocolo da seção Oferta.
- Ambos `pointer-events-none aria-hidden`, com `hidden md:block` para evitar peso visual no mobile.
- Nada de círculos/quadrados perfeitos como decoração.

### Garantias
- Nenhuma mudança em: copy, `href`s, scripts em `index.html`, componentes de checkout/pixel, `App.tsx`, ordem das seções.
- Responsividade mobile preservada (todos os layouts assimétricos só ativam em `md`/`lg`).
- Tokens de cor existentes (`#1B3A6B`, `#7BA33E`, `#8FAE82`, etc.) mantidos.

### Arquivos afetados
- `src/components/HeroSection.tsx`
- `src/components/TestimonialsSection.tsx`
- `src/components/BenefitsSection.tsx`
- `src/components/IngredientsSection.tsx`
- `src/components/OfferSection.tsx`