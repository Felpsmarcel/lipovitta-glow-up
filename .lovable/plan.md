

# Ajustar fonte do título Hero no mobile

## Problema
No viewport 430px, o `h1` usa `text-3xl` (30px) que pode ficar apertado com o texto longo "A transformação vem de dentro para fora!".

## Solução

### Editar `src/components/HeroSection.tsx` (linha 29)

Alterar a escala de tamanhos do `h1`:
- Mobile: `text-2xl` (24px) → melhor legibilidade em 430px
- SM (640px+): `sm:text-3xl` (30px)
- MD (768px+): `md:text-4xl` (36px) — ligeiramente maior que antes
- LG (1024px+): `lg:text-[3.25rem]` — manter

Também ajustar o `leading` para `leading-snug` no mobile para melhor espaçamento entre linhas.

Classe final: `text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-bold leading-snug md:leading-tight text-white mb-4 md:mb-6`

