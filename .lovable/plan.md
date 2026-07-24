## Objetivo

Medir a performance real do site publicado em `https://lipovitta.site` (mobile e desktop) e entregar um relatório claro com os principais gargalos e próximas ações — sem alterar código nesta etapa.

## O que vou fazer

1. **PageSpeed Insights (Google / Lighthouse)** via API pública, para `https://lipovitta.site`:
   - Estratégia **mobile** e **desktop**.
   - Coletar Performance Score + Core Web Vitals (LCP, CLS, INP, TBT, FCP, TTFB, Speed Index).
   - Listar as principais oportunidades (imagens, JS não usado, cache, render-blocking, etc.).

2. **Checagem de rede direta** com `curl` na home:
   - Tempo até first byte (TTFB), tamanho do HTML, headers de cache/compression, status HTTP.
   - Conferir se os assets do hero (vídeo/imagem/logo) estão sendo servidos com `cache-control` e compressão adequados.

3. **Auditoria local no Playwright** (viewport mobile 430×932 e desktop 1280×900) contra o site publicado:
   - Contar requests, tamanho total, JS/CSS/imagens, tempo de `load` e `DOMContentLoaded`.
   - Verificar erros de console e recursos 4xx/5xx.
   - Screenshot da home para comparar visualmente.

4. **Diagnóstico dirigido** com base nos números:
   - LCP alto → checar o hero (vídeo autoplay pesado, imagem sem `fetchpriority`, preload ausente).
   - TBT/INP alto → checar scripts de terceiros (Meta Pixel, iframes de Instagram, YouTube, WhatsApp float).
   - Payload alto → conferir vídeos e imagens em `src/assets` que estão sendo bundlados.

5. **Relatório final no chat**, com:
   - Tabela mobile x desktop (Score + Web Vitals).
   - Top 3–5 oportunidades ordenadas por impacto.
   - Recomendação de próximos passos (o que dá para corrigir em código, o que depende de infra).

## Fora de escopo (nesta etapa)

- Não vou alterar código, imagens, scripts ou infra agora — só medir e reportar.
- Se você aprovar as recomendações, faço as correções em um segundo passo.
