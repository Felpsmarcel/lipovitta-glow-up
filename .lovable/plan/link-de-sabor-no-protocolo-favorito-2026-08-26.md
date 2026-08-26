# Link de sabor no Protocolo Favorito

## O que muda
No card **Protocolo Favorito** (Cápsula + Shot Matinal), a cliente continua escolhendo o sabor no site (Abacaxi, Limão, Tangerina). Ao clicar no botão, em vez do link atual, ela vai para a página da Yampi onde o sabor pode ser confirmado:

`https://lipovitta2.catalog.yampi.io/capsulas-lipovitta/p`

O sabor escolhido no site viaja no endereço (`?sabor=limao`), junto com o brinde e os parâmetros de rastreio já existentes.

## Comportamento
- Botão segue desabilitado até a cliente escolher o sabor.
- Sabor continua aparecendo no resumo da etapa de brinde e no painel `/admin/conversoes`.
- Demais cards (Kit Completo, Shot Matinal avulso, Cápsulas, Kit Rush) ficam exatamente como estão.

## Detalhes técnicos
- `src/components/OfferSection.tsx`: preencher `SHOT_FLAVOR_LINKS.protocolo` com o link do catálogo para os três sabores (mesma URL base, o `withFlavor` acrescenta `?sabor=<id>`), ou apontar `checkoutUrl` do `KIT_PROTOCOLO` para essa URL. Nada mais é alterado.
- Se depois você tiver uma URL diferente por sabor, basta trocar cada entrada do mapa.

## Fora do escopo
- Preços, descontos e regras de brinde permanecem iguais.
