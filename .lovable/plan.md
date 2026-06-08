## Problema
Em mobile, na seção "Para quem é o LipoVitta?" (`ForWhoSection.tsx`), os itens da lista ficam com o texto centralizado, deixando o ícone de check muito distante do texto e quebrando o alinhamento visual.

Isso acontece porque o container pai usa `text-center lg:text-left`, e o `text-center` é herdado pelos `<li>`, centralizando o texto dentro do flex item.

## Solução
Em `src/components/ForWhoSection.tsx`:

1. Forçar o alinhamento da lista (`<ul>`) à esquerda em todas as larguras (`text-left`), mantendo o título e o botão centralizados em mobile.
2. Reduzir o `space-y-4` da lista no mobile para melhorar a densidade vertical (ex.: `space-y-3 md:space-y-4`).
3. Garantir que o texto do item não quebre desalinhado: usar `flex-1` no `<span>` para ocupar o espaço restante ao lado do ícone.

Nenhuma outra alteração de layout, cores ou conteúdo.
