## Plano: dar visibilidade ao Kit Rush (sem mexer no card em si)

O card do Kit Shot Rush + Cápsulas já existe e funciona (asset CDN responde 200, link de checkout ok, preço R$546,30). O problema é que ele está "escondido" abaixo dos 3 cards principais. Mantendo o card exatamente como está hoje (conteúdo, preço, layout interno), vou só criar caminhos para encontrá-lo:

### 1. Mover o Kit para o topo da seção de ofertas
- Em `OfferSection.tsx`, renderizar o bloco do Kit (linha destacada full-width) **antes** do grid de 3 cards.
- Manter o header "Comece sua rotina LipoVitta" acima.
- Adicionar `scroll-margin-top` no `#card-kit-rush` para a âncora não ficar atrás da navbar fixa.

### 2. Chamada no Hero
- Em `HeroSection.tsx`, adicionar um pill discreto abaixo do CTA principal:
  "Novo: Kit Shot Rush + Cápsulas →" linkando para `#card-kit-rush`.

### 3. Item no menu
- Em `Navbar.tsx`, incluir link "Kit Rush" apontando para `#card-kit-rush` (desktop e mobile).

### O que NÃO muda
- Conteúdo, imagem, selos, benefícios, preço (R$546,30 / 3x R$182,10), botão e link do Kit ficam idênticos.
- Nenhuma alteração nos outros 3 cards, pixels, checkout ou backend.

### Arquivos afetados
- `src/components/OfferSection.tsx` (reordenar)
- `src/components/HeroSection.tsx` (pill)
- `src/components/Navbar.tsx` (link)