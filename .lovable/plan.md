

# Ajustes Finais — LipoVitta

## Resumo
10 melhorias de polish: navbar com scroll effect, WhatsApp flutuante, CTAs intermediários, animações, urgency bar sticky, exit intent popup, SEO, performance, acessibilidade e responsividade.

## Arquivos a criar/editar

### 1. Editar `src/components/Navbar.tsx`
- Adicionar `useState` + `useEffect` com scroll listener
- Transparente quando `scrollY < 50`, fundo sólido `#1B3A6B` ao scrollar
- Logo: usar URL CDN (`https://cdn.abacus.ai/images/4b9c67ed-695b-4262-881c-483c94f51e98.png`), max-height 40px
- Botão "COMPRAR AGORA" `#7BA33E` à direita, smooth scroll para `#precos`
- Remover `top-[44px]` (ficará no topo real, abaixo da urgency bar via z-index)

### 2. Criar `src/components/WhatsAppButton.tsx`
- Botão fixo `bottom-6 right-6`, 56px, circular, fundo `#25D366`
- Ícone WhatsApp (SVG inline), sombra, animação pulse
- Link `https://wa.me/5571996150401`, `target="_blank"`

### 3. Criar `src/components/CTABanner.tsx`
- Componente reutilizável: botão centralizado "QUERO MINHA TRANSFORMAÇÃO" `#7BA33E`
- Smooth scroll para `#precos`

### 4. Editar `src/pages/Index.tsx`
- Importar `WhatsAppButton` e `CTABanner`
- Inserir `CTABanner` entre BenefitsSection→HowToUseSection e IngredientsSection→OfferSection
- Adicionar `WhatsAppButton` no final

### 5. Criar `src/hooks/useScrollAnimation.ts`
- Custom hook com IntersectionObserver
- Adiciona classe `animate-fade-in-up` quando elemento entra na viewport
- Suporta stagger delay via `data-delay` attribute

### 6. Aplicar animações fade-in-up nas seções
- Cada seção principal recebe ref do hook
- Cards dentro das seções recebem stagger delay (100ms incremento)
- Editar: `BenefitsSection`, `TestimonialsSection`, `ForWhoSection`, `HowToUseSection`, `IngredientsSection`, `ProductsSection`, `OfferSection`, `FAQSection`

### 7. Editar `src/components/UrgencyBar.tsx`
- Mudar fundo para `#7BA33E` (já é accent, confirmar)
- Garantir `fixed top-0 z-50` (já está correto)

### 8. Criar `src/components/ExitIntentPopup.tsx`
- `useEffect` com `mouseleave` no `document.documentElement`
- `localStorage` check para mostrar 1x por sessão
- Modal: overlay `#1B3A6B/80%`, card branco centralizado
- Título, subtítulo, campo email + botão "QUERO MEU GUIA GRÁTIS" `#7BA33E`
- Botão X para fechar
- Só ativa no desktop (check `window.innerWidth > 768`)

### 9. Editar `index.html`
- Atualizar meta title para SEO completo
- Meta description expandida
- Adicionar `<link rel="preconnect">` para Google Fonts
- og:image já está configurado

### 10. Editar `src/index.css`
- Adicionar keyframe `fade-in-up` e classe utilitária
- Adicionar focus-visible styles globais com outline `#2E5EA6`

### 11. Editar `tailwind.config.ts`
- Adicionar keyframe e animation `fade-in-up`

## Detalhes técnicos
- Navbar scroll: `useEffect` com `scroll` event listener, `transition-colors duration-300`
- Animações: IntersectionObserver com `threshold: 0.1`, `once: true`
- Exit intent: `mouseleave` event no `documentElement`, `localStorage.getItem('exitPopupShown')`
- Acessibilidade: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E5EA6]` nos botões/links interativos, alt texts em imagens
- Performance: `loading="lazy"` em imagens, preconnect Google Fonts
- Links externos: audit e garantir `target="_blank" rel="noopener noreferrer"`

