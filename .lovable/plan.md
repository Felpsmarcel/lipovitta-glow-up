# Atualização do Design System — Identidade Oficial LipoVitta

Substituir o azul navy atual (#1B3A6B) pelo azul royal oficial (#4667B4), ajustar o verde para #9BAE52, e trocar a tipografia para Poppins (display + corpo).

## 1. Tipografia (`index.html` + `src/index.css` + `tailwind.config.ts`)

- Remover import de `Cormorant Garamond` e `DM Sans`.
- Importar do Google Fonts: `Poppins` nos pesos `300;400;500;600;700;800`.
- "Hugolers" não está no Google Fonts → usar **Poppins 700/800** como fonte display (fallback oficial conforme briefing).
- `font-display` → Poppins 700/800
- `font-sans` (corpo) → Poppins 300/400/500/600
- Atualizar `tailwind.config.ts` `fontFamily.display` e `fontFamily.sans` para Poppins.
- Atualizar regras `h1, h2, h3` e `h4, h5, h6` no `@layer base` para Poppins.

## 2. Tokens de cor (`src/index.css`)

Converter para HSL e aplicar globalmente:

- `--primary`: `#4667B4` → `hsl(220 42% 49%)` (azul royal)
- `--secondary`: manter como tom complementar do azul royal
- `--accent`: `#9BAE52` → `hsl(74 36% 50%)` (verde oliva)
- `--accent-light`: tom mais claro do verde oliva
- `--ring` / `--primary-foreground` ajustados conforme

Definir variáveis de gradiente da marca:
```
--gradient-brand: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
--gradient-brand-soft: linear-gradient(180deg, hsl(var(--primary)/0.05), hsl(var(--accent)/0.05));
```

E uma utility `.bg-gradient-brand` no `@layer utilities`.

## 3. Substituir cores hardcoded nos componentes

Buscar e substituir em todos os componentes que usam hex inline:

- `#1B3A6B` (navy antigo) → `hsl(var(--primary))` (azul royal #4667B4)
- `#7BA33E` (verde antigo) → `hsl(var(--accent))` (verde oliva #9BAE52)
- `#A8D45A` (verde claro antigo) → tom claro derivado do novo verde oliva
- `#2E5EA6` → `hsl(var(--primary))`

Arquivos afetados (varredura inicial):
- `HeroSection.tsx` — bg navy, badges verdes, CTA
- `Navbar.tsx` — bg scrolled navy, CTA verde
- `ForWhoSection.tsx` — bg navy, ícones e títulos verdes, CTA
- `CTABanner.tsx` — CTA verde
- `OfferSection.tsx` — cores de preço/badge
- `IngredientsSection.tsx`, `BenefitsSection.tsx`, `RoutineSection.tsx`, `TestimonialsSection.tsx`, `FAQSection.tsx`, `HowToUseSection.tsx`, `ProductsSection.tsx`, `Footer.tsx`, `WhatsAppButton.tsx`, `ExitIntentPopup.tsx`, `UrgencyBar.tsx`, `CountdownTimer.tsx`, `SEOHead.tsx`

Padrão de substituição: trocar `style={{ backgroundColor: "#..." }}` por classes Tailwind semânticas (`bg-primary`, `bg-accent`, `text-accent`, etc.) sempre que possível.

## 4. Gradientes da marca

Aplicar `bg-gradient-brand`:
- CTA principal do Hero (`HeroSection.tsx`)
- Botões CTA grandes (CTABanner, Navbar opcional)
- Elementos divisores/swoosh entre seções (linha decorativa SVG no Hero, e adicionar separadores sutis entre seções principais)

## 5. Animação `pulse-cta`

Atualizar `box-shadow` no keyframe `pulse-cta` para usar `hsl(var(--primary)/0.4)` ou tom do gradiente, em vez do verde antigo.

## 6. Verificação final

- Confirmar que nenhuma referência a `#1B3A6B`, `#7BA33E`, `Cormorant`, `DM Sans` permanece.
- Conferir contraste WCAG do azul royal com texto branco e do verde oliva com branco.
- Validar visualmente no preview mobile (430px) o Hero, Navbar, ForWho, Offer e CTAs.

## Detalhes técnicos

- Todas as cores no `index.css` em formato HSL (sem `hsl(...)` no valor da variável).
- Não modificar `src/integrations/supabase/*` nem arquivos auto-gerados.
- Manter estrutura de seções, copy e layout — apenas tokens visuais.
