## Objetivo
Substituir a tipografia genérica atual (Playfair Display + Inter) por uma combinação que transmita feminilidade, saúde e sofisticação, seguindo as regras e combinações especificadas pelo usuário.

## Escopo
- Apenas estilos tipográficos: font-family, font-weight, font-size, font-style, line-height e cor de texto em citações.
- Nenhuma alteração em: textos, produtos, preços, links, checkout, pixels, scripts, imagens ou layout estrutural.

## Análise do estado atual
- `index.css`: importa Google Fonts Playfair Display (400-800) e Inter (300-700).
- `tailwind.config.ts`: define `font-display` (Playfair Display) e `font-sans` (Inter).
- `index.html`: importa Playfair Display 700 via `<link>`.
- Componentes misturam uso de classes Tailwind (`font-display`, `font-sans`) e estilos inline (`fontFamily: "'Playfair Display', serif"`).
- Muitos títulos H1/H2 usam `font-bold` ou `font-extrabold` com Playfair Display, o que o usuário quer evitar.
- A citação da hero (`"Lipedema não tem cura, mas tem controle."`) usa `italic` com a fonte sans, não a serifada em cor diferenciada.

## Decisões tipográficas

### Famílias escolhidas (2 famílias)
1. **Serifada (títulos e citações):** Cormorant Garamond (mais refinada e leve que Playfair Display; transmite sofisticação sem peso excessivo).
2. **Sans-serif (corpo e subtítulos):** DM Sans (limpa, moderna, excelente legibilidade em corpo e tamanhos menores; contrasta bem com a serifada sem competir).

### Pesos e uso
| Elemento | Fonte | Peso | Notas |
|---|---|---|---|
| H1, H2 | Cormorant Garamond | 500 (Medium) | Generoso no desktop, responsivo no mobile. Nunca bold. |
| H3, H4 | DM Sans | 500 (Medium) ou 600 (SemiBold) | Destaques e subtítulos. |
| Corpo (p, li, span) | DM Sans | 400 (Regular) | Mínimo 16px no mobile. |
| Citações / destaques | Cormorant Garamond | 400 (Regular) Italic | 1px a 2px maior que o corpo. Cor: verde-sálvia (`#8FAE82`) ou dourado champagne (a decidir no build). |

## Arquivos a modificar

### 1. `index.html`
- Remover o `<link>` atual de Playfair Display 700.
- Adicionar import do Google Fonts com **Cormorant Garamond** (400, 400i, 500, 500i) e **DM Sans** (400, 500, 600).

### 2. `src/index.css`
- Atualizar o `@import url(...)` no topo para Cormorant Garamond + DM Sans.
- Atualizar `@layer base`:
  - `body`: manter `font-sans` (agora DM Sans).
  - `h1, h2, h3, h4, h5, h6`: ajustar para regras corretas (H1/H2 = Cormorant Garamond, H3/H4 = DM Sans).
- Atualizar utilitários `.font-display` e `.font-body` para as novas famílias.
- Adicionar utilitário `.font-quote` para citações (Cormorant Garamond Italic + cor).

### 3. `tailwind.config.ts`
- Substituir `fontFamily.display` para `['"Cormorant Garamond"', 'serif']`.
- Substituir `fontFamily.sans` para `['"DM Sans"', 'sans-serif']`.
- Adicionar `fontFamily.quote` se utilitário utilizar config do Tailwind.

### 4. Componentes — revisão tipográfica por componente
Nos componentes abaixo, ajustar **apenas** classes e estilos inline relacionados a tipografia. Não alterar textos, links, preços, estrutura ou cores de fundo.

- **`src/components/HeroSection.tsx`**
  - H1: trocar `font-bold` → `font-medium` (Cormorant Garamond 500).
  - Citação `"Lipedema não tem cura..."`: trocar para `font-display italic`, aumentar levemente o tamanho, aplicar cor verde-sálvia ou dourado champagne.
  - Textos corridos: garantir `font-sans` (DM Sans 400), mínimo 16px.

- **`src/components/BenefitsSection.tsx`**
  - H2: remover `font-bold` inline, garantir `font-medium` via display.
  - H3 (títulos dos benefícios): trocar para `font-sans font-semibold` (DM Sans 600).
  - Descrições: `font-sans font-normal` (DM Sans 400).

- **`src/components/ForWhoSection.tsx`**
  - H2: remover `font-bold` inline, garantir `font-medium`.
  - Itens da lista: `font-sans font-normal`.

- **`src/components/HowToUseSection.tsx`**
  - H2: ajustar peso para Medium.
  - H3 (títulos dos passos): trocar para `font-sans font-semibold`.
  - Descrições: `font-sans font-normal`.

- **`src/components/RoutineSection.tsx`**
  - H2: ajustar peso para Medium.
  - Textos corridos: garantir DM Sans 400.
  - Assinatura "— Clara Caldas": estilizar como citação/destaque (Cormorant Garamond italic, cor diferenciada).

- **`src/components/IngredientsSection.tsx`**
  - H2: ajustar peso para Medium.
  - Nomes dos ingredientes (H3/nível): `font-sans font-semibold`.
  - Descrições: `font-sans font-normal`.

- **`src/components/TestimonialsSection.tsx`**
  - H2: ajustar peso para Medium.
  - Subtítulo "Prints reais...": `font-sans font-normal`, tamanho adequado.
  - Texto do contador: ajustar pesos (número pode manter bold ou semi-bold se for destaque numérico, texto ao redo em Regular).

- **`src/components/ProductsSection.tsx`**
  - H2: ajustar peso para Medium.
  - H3 (títulos dos produtos): `font-sans font-semibold`.
  - Corpo e bullets: `font-sans font-normal`.

- **`src/components/OfferSection.tsx`**
  - H2: ajustar peso para Medium.
  - H3 (títulos dos cards): `font-sans font-semibold`.
  - Preços: manter peso visual, mas se possível dentro da nova sans-serif.
  - Bullets e descrições: `font-sans font-normal`.

- **`src/components/FAQSection.tsx`**
  - H2: ajustar peso para Medium.
  - Perguntas (AccordionTrigger): `font-sans font-semibold`.
  - Respostas (AccordionContent): `font-sans font-normal`.

- **`src/components/CTABanner.tsx`**
  - Texto do botão: manter legibilidade, `font-sans font-semibold`.

- **`src/components/ContactSection.tsx` / `Footer.tsx` / `Navbar.tsx` / outros menores**
  - Revisar pesos de headings e corpo para consistência com o sistema novo.

## QA
- Verificar preview em mobile: nenhum texto menor que 16px; títulos legíveis; pesos não muito finos.
- Conferir contraste das citações em fundos claros e escuros.
- Validar que apenas tokens tipográficos mudaram (nenhuma URL, preço, produto ou script alterado).