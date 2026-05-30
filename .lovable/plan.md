## Problema

No card "Protocolo Completo LipoVitta" (OfferSection), dois selos aparecem sobrepostos e cortados:
- "MAIS ESCOLHIDO" (verde, centralizado no topo)
- "Economia de R$79,05" (azul, canto superior direito)

Ambos usam `-top-3` e colidem no centro/direita. Além disso, o container do card tem `overflow-hidden` (para conter a mancha decorativa), o que corta as bordas arredondadas dos selos que ficam acima da borda.

## Mudanças propostas

Arquivo: `src/components/OfferSection.tsx` (somente o card do Protocolo, linhas 80–101)

1. Remover `overflow-hidden` do container do card e aplicar o clipping apenas no SVG decorativo, usando um wrapper interno `absolute inset-0 overflow-hidden rounded-2xl pointer-events-none` ao redor do `<svg>`. Assim os selos deixam de ser cortados.

2. Reposicionar os selos para não colidirem:
   - "MAIS ESCOLHIDO" continua centralizado no topo (`-top-3 left-1/2 -translate-x-1/2`).
   - "Economia de R$79,05" passa para logo abaixo, alinhado ao centro também (`top-6 left-1/2 -translate-x-1/2`) OU, alternativa mais limpa: unificar em uma única "fita" superior contendo os dois rótulos lado a lado dentro de um mesmo container centralizado (flex gap-2), com fundo dividido (verde + azul). 
   
   Proposta a implementar: container único centralizado no topo com dois pills lado a lado (`flex items-center gap-2`), evitando qualquer sobreposição em qualquer largura.

3. Adicionar `mt-3` ao conteúdo interno se necessário, para compensar o espaço dos selos.

## Não alterado

Nenhuma outra seção, produto, preço, link, checkout, pixel, script ou copy. Apenas posicionamento visual dos dois selos do card central.
