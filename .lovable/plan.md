## Objetivo
Substituir a imagem atual do depoimento "A inflamação do corpo começa a reduzir" pela segunda imagem enviada (versão ANTES/DEPOIS com lipovitta.site).

## Alterações
1. Fazer upload da nova imagem (`user-uploads://0151798B-2E7C-4E0A-83A4-03794E7EDF92.png`) para o CDN via `lovable-assets`, gerando `src/assets/testimonials/inflamacao.png.asset.json`.
2. Atualizar `src/components/TestimonialsSection.tsx`:
   - Trocar o import de `inflamacao.jpg` para o novo pointer `.asset.json` (usando `.url`).
3. Remover o arquivo antigo `src/assets/testimonials/inflamacao.jpg` do repositório.

## Fora do escopo
Texto, layout, demais depoimentos, estilos.

## Critério de aceite
A seção de depoimentos exibe a nova imagem ANTES/DEPOIS no lugar da anterior; nenhuma referência quebrada; build ok.