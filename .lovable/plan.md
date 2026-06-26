## Trocar imagens dos brindes

Subir as 4 imagens enviadas como assets CDN e apontar `src/data/gifts.ts` para elas (substituindo o placeholder).

### Mapeamento
- Raspador de língua → `3BEE7E6D-6B7D-418B-BEB3-7558F63BE0CC.png`
- Porta cápsulas → `58ED24FA-8D85-4DDB-9F9B-0A830EA1DAB8.png`
- Mixer Dosador → `2C28F1D3-706B-4328-B478-24EF0966CB01.png`
- Garrafa Térmica → `E7709549-98C4-4E20-BD4D-09A4BAD71027.png`

### Passos
1. `lovable-assets create` para cada uma das 4 imagens, gerando:
   - `src/assets/brinde-raspador.png.asset.json`
   - `src/assets/brinde-portacapsulas.png.asset.json`
   - `src/assets/brinde-mixer.png.asset.json`
   - `src/assets/brinde-garrafa.png.asset.json`
2. Atualizar `src/data/gifts.ts`: importar os 4 `.asset.json` e usar `.url` no campo `image` de cada brinde (remover constante `PLACEHOLDER`).

Sem mexer em layout, copy, links Yampi nem regras de elegibilidade.
