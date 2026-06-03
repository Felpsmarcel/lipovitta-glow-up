## Trocar logo da barra fixa do Hero

A barra fixa (`src/components/Navbar.tsx`) hoje usa uma logo hospedada na CDN externa (`cdn.abacus.ai`). Vou substituí-la pela imagem enviada (`2 4.PNG` — "LipoVitta por Clara Caldas" em branco sobre fundo azul royal).

### Passos
1. Subir a nova logo via `lovable-assets` a partir de `/mnt/user-uploads/2_4.PNG` gerando `src/assets/lipovitta-logo.png.asset.json`.
2. Em `src/components/Navbar.tsx`:
   - Importar o pointer da nova logo.
   - Trocar o `src` do `<img>` para `logo.url`.
   - Como a logo já tem fundo azul, ajustar para ficar legível tanto no estado inicial (navbar branca) quanto no estado scrolled (azul #4667B4): aplicar `rounded` + leve padding quando a navbar está branca, ou usar `mix-blend` — solução simples: manter a imagem como está (o azul da logo combina com o estado scrolled e fica como "selo" no estado branco). Altura mantida em `h-10`.

### Sem mudanças
- Botão "COMPRAR AGORA", comportamento de scroll, layout do restante da página.
