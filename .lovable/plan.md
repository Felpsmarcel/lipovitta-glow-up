## Ritmo visual — alternância, swooshes divisores, densidade e fade-in-up

### 1. Alternância de fundos (branco ↔ azul royal)

Definir ordem das seções no `Index.tsx` com cores alternadas:

```
Hero              → branco (gradiente sutil já existe)
RoutineSection    → AZUL #4667B4 (texto branco)
TestimonialsSection → branco (denso)
BenefitsSection   → AZUL #4667B4 (texto branco)
CTABanner         → branco
ForWhoSection     → AZUL (já é)
HowToUseSection   → branco
IngredientsSection → AZUL #4667B4 (texto branco)
CTABanner         → branco
OfferSection      → AZUL #4667B4
ProductsSection   → branco
FAQSection        → AZUL #4667B4 (texto branco)
```

Para cada seção que vira azul: ajustar cores de títulos (branco), corpo (`text-white/85`), cards internos (fundo branco mantém contraste), bordas/detalhes em verde oliva `#9BAE52`.

### 2. Swoosh divisor entre transições de cor

Criar componente `src/components/SectionSwoosh.tsx` — SVG curvo gradiente `#4667B4 → #9BAE52` que ocupa largura total, ~80–120px de altura. Duas variantes via prop `direction`:
- `white-to-blue` (curva desce, fundo superior branco)
- `blue-to-white` (curva sobe, fundo superior azul)

Inserir entre cada par de seções com cor diferente em `Index.tsx`. Seções que mantêm a mesma cor ficam sem swoosh (corte limpo natural).

Remover `pt-*` redundantes das seções que receberem o swoosh acima para não criar espaço duplo.

### 3. Densidade variável (quebra do espaçamento uniforme)

Ajustar paddings verticais por papel da seção:

- **Densas (prova social, depoimentos, FAQ):** `py-12 md:py-16`
  - `TestimonialsSection`, `BenefitsSection` (grid), `FAQSection`
  - Reduzir gap interno dos grids de `gap-6` para `gap-4 md:gap-5` em Testimonials
- **Respiro amplo (hero, oferta, "para quem"):** `py-24 md:py-32`
  - `HeroSection`, `OfferSection`, `ForWhoSection`
- **Médias (rotina, como usar, ingredientes, produtos):** `py-16 md:py-20`

### 4. Animação fade-in-up no scroll

Já existe `useScrollAnimation` (translateY 24px → 0, opacity 0 → 1) aplicado em algumas seções. Padronizar e estender:

- Aplicar o hook em todas as seções que ainda não usam (`HeroSection`, `TestimonialsSection`, `IngredientsSection`, `ProductsSection`, `OfferSection`, `FAQSection`, `CTABanner`).
- Marcar títulos H2 e cada card/item com `data-animate` para herdar o stagger já implementado no hook (delay 100ms × índice).
- Manter duração 0.5–0.6s e easing `ease-out` que já estão no hook (suave, não exagerado).

### Detalhes técnicos

- Cores via tokens já existentes (`#4667B4`, `#9BAE52`) — sem mexer em `tailwind.config.ts` nem `index.css`.
- Swoosh: SVG inline com `<defs><linearGradient>` reaproveitando os stops da marca, `preserveAspectRatio="none"`, `aria-hidden`, `pointer-events-none`, `block` (sem gap inline-SVG), `-mt-px` para evitar hairline.
- Em seções azuis, sobrescrever cor dos títulos (hoje hardcoded `#4667B4`) para `text-white` e divisor decorativo do título passa a `linear-gradient(90deg, #FFFFFF, #9BAE52)`.
- Não alterar conteúdo, lógica, dados ou estrutura de componentes — apenas estilos, ordem visual, divisores e wrapper de animação.

### Arquivos afetados

- novo: `src/components/SectionSwoosh.tsx`
- editar: `src/pages/Index.tsx` (inserir swooshes + reordenar wrappers de cor)
- editar: `RoutineSection`, `BenefitsSection`, `IngredientsSection`, `OfferSection`, `FAQSection` (variante azul: cores de texto/títulos)
- editar: `TestimonialsSection`, `HeroSection`, `ProductsSection`, `CTABanner` (adicionar `useScrollAnimation` + `data-animate`)
- ajustar paddings nas seções listadas acima
