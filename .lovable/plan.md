# Selo 30% OFF no topo de vendas e faixa Pré Black na home

## Situação atual
- O texto do topo de vendas já existe ("A Pré Black LipoVitta começou" + 30% OFF + "em todos os produtos"), mas o selo 30% OFF não tem estilo: aparece como texto comum colado ao título.
- A faixa Pré Black da home some depois da abertura; ela só aparece antes de 18/10 às 8h.

## O que muda
1. **Selo 30% OFF**: número grande em destaque editorial (azul royal #4667B4 sobre azul-marinho, "%" e "OFF" menores em verde #9BAE52), em linha própria abaixo do título, seguido de "em todos os produtos". Proporção reduzida no celular, sem cortes.
2. **Faixa Pré Black na home aberta**: passa a aparecer também na fase de vendas, acima do topo, com "PRÉ BLACK LIPOVITTA · NO AR — 30% OFF em todos os produtos." e botão "VER OFERTAS" levando aos kits. Sem repetir o texto do botão principal.
3. Contraste legível, sem animação nova; o efeito de abertura já existente continua igual.

## Conferência
- Revisão em `/?fase=live` e `/pre-black?fase=live` no computador (1440) e no celular (390): selo visível, sem sobreposição nem rolagem lateral, botões levam às ofertas.
- Sem publicar: os preços de Cápsulas, Shot Matinal e Protocolo ainda não batem na Yampi.

## Detalhes técnicos
- CSS escopado em `src/index.css` para `.pb-live-discount` e `.pb-live-all` (tokens HSL existentes).
- `src/pages/Index.tsx`: renderizar `PreBlackHomeBanner` também quando live; em `PreBlackHomeBanner.tsx` o rótulo live vira "VER OFERTAS".
