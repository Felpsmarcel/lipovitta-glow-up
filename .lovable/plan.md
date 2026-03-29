

# Otimizar Hero — Corrigir Sobreposição

## Problema
A `UrgencyBar` é `fixed top-0`, tirando-a do fluxo do documento. Isso faz com que a Navbar e o conteúdo do Hero subam e fiquem sobrepostos por ela. No mobile (430px), a barra de urgência + navbar + countdown ocupam espaço visual que invade o hero.

## Solução

### 1. Adicionar spacer para a UrgencyBar fixa em `Index.tsx`
Adicionar um `div` spacer antes do Navbar com altura equivalente à UrgencyBar (~44px mobile, ~40px desktop) para compensar o `position: fixed`.

### 2. Ajustar padding-top do HeroSection
Aumentar `pt-8` (32px) para `pt-16` (64px) no mobile e manter `md:pt-16` no desktop, garantindo espaço suficiente abaixo da navbar sticky.

### 3. Otimizar layout mobile do vídeo no Hero
- Limitar `max-h-[500px]` no container do vídeo em mobile
- Reduzir `gap-8` para `gap-6` no mobile para compactar o layout

### Arquivos editados
- `src/pages/Index.tsx` — spacer div
- `src/components/HeroSection.tsx` — padding e gap ajustados

