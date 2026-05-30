# Adicionar SEOHead na home

## O que fazer

1. **Instalar dependência**
   - `react-helmet-async`

2. **Registrar o provider** em `src/main.tsx`
   - Envolver o `<App />` com `<HelmetProvider>`.

3. **Criar `src/components/SEOHead.tsx`**
   - Componente igual ao enviado, com pequenos ajustes:
     - `siteUrl = "https://lipovitta.site"` (domínio real do projeto, não `lipovita.club`).
     - Remover a tag `<meta name="facebook-domain-verification" content="seu_codigo_aqui" />` (placeholder inválido) — pode ser adicionada depois quando houver o código real.
     - Manter `ogImage` default usando a imagem que já está no `index.html` (`https://cdn.abacus.ai/images/4b9c67ed-695b-4262-881c-483c94f51e98.png`) em vez do placehold.co.

4. **Usar na home** (`src/pages/Index.tsx`)
   - Renderizar `<SEOHead />` no topo do componente com:
     - `title`: "Suplemento Natural para Lipedema, Celulite e Inchaço"
     - `description`: mesma descrição que está hoje no `index.html`.
     - `canonicalUrl`: `https://lipovitta.site/`

5. **Evitar canonical duplicada** em `index.html`
   - O `index.html` atual não tem `<link rel="canonical">`, então não há nada a remover. As demais tags de `index.html` permanecem como fallback para crawlers que não executam JS (LinkedIn, Slack, Facebook).

## Fora de escopo

- Não alterar pixels, scripts, conteúdo das seções, preços ou links.
- Não criar SEOHead em outras páginas (apenas a home agora).
- Não adicionar JSON-LD nesta etapa.
