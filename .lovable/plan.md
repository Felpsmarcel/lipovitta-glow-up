

# Retirar a barra de oferta (UrgencyBar) do Hero

## O que muda
Remover o componente `UrgencyBar` e o spacer associado do `Index.tsx`.

## Editar `src/pages/Index.tsx`

- Remover o import de `UrgencyBar`
- Remover `<UrgencyBar />` (linha 24)
- Remover o spacer `<div className="h-[44px] sm:h-[40px]" />` (linha 25)

