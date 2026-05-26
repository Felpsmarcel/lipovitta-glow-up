# Reconstrução da seção de ofertas (`OfferSection.tsx`)

Substituir totalmente o conteúdo de `src/components/OfferSection.tsx` mantendo o `id="precos"` e o background atual. Nenhuma outra seção, link, pixel ou script será alterado.

## Estrutura nova

**Header**
- H2: "Comece sua rotina LipoVitta"
- Subtítulo: "Escolha como quer começar. Você pode adicionar complementos depois."
- Linha discreta: "Frete grátis em compras a partir de R$323,00."

**Grid de 3 cards** (mobile: stack vertical 1→2→3; desktop ≥lg: 3 colunas com larguras assimétricas via `lg:col-span-*` num grid de 12 para refletir hierarquia — Card 1 ocupa 5/12, Card 2 ocupa 4/12 com escala visual maior (`lg:scale-105`, shadow forte, borda destacada), Card 3 ocupa 3/12 mais compacto).

### Card 1 — LipoVitta Cápsulas (Fórmula principal)
- `id="card-capsulas"`
- Etiqueta superior sóbria: "Fórmula principal" (fundo `#1B3A6B`/branco)
- Imagem: `capsulasImg`
- Título: "LipoVitta Cápsulas"
- Descrição conforme briefing
- Lista (ícone Check): Dimpless® patenteado, Frete grátis incluso, Garantia de 30 dias
- Preço: "R$357,00" + "ou 3x de R$119,00 sem juros"
- Botão preenchido GRANDE (`py-5 text-lg`, min-h 56px) cor `#7BA33E`: "COMEÇAR MINHA ROTINA"
- Link: `https://clarinhacbr.lojavirtualnuvem.com.br/produtos/lipovitta/`
- Microcopy: "Adicione Shot Matinal, Gummy ou Shot Rush logo abaixo."

### Card 2 — Protocolo Completo (Mais escolhido)
- `id="card-protocolo"`
- Etiqueta superior chamativa (verde sólido): "Mais escolhido"
- Selo canto superior direito (badge absoluto, fundo `#1B3A6B`, texto branco): "Economia de R$79,05"
- Borda destacada `border-2 border-[#7BA33E]`, shadow-xl, `lg:scale-105`
- Imagem: `comboImg` (já existe — combo Cápsula + Shot Matinal)
- Título: "Protocolo Completo LipoVitta"
- Subtítulo: "Cápsula + Shot Matinal. A rotina completa em um único pedido."
- Descrição conforme briefing
- Lista de benefícios (5 itens conforme briefing, com os 2 primeiros em destaque visual semibold)
- Bloco de comparação (caixa `bg-[#F5F7FA] rounded-xl p-4`):
  - "Comprando separado: R$527,00"
  - "No Protocolo: R$447,95"
  - "Você economiza: R$79,05" (verde, bold)
- Preço: "R$527,00" riscado + "R$447,95" destaque + "ou 3x de R$166,08 sem juros"
- Botão preenchido médio-grande (`py-4 text-base`) cor `#7BA33E`: "ESCOLHER PROTOCOLO COMPLETO"
- Link: `https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-matinal-lipovitta1/` (link atual do combo)
- Microcopy: "A escolha de 7 em cada 10 clientes."

### Card 3 — Shot Matinal (Complemento matinal)
- `id="card-shot"`
- Etiqueta superior discreta (outline cinza): "Complemento matinal"
- Imagem: `shotMatinalImg`
- Título: "Shot Matinal LipoVitta"
- Descrição conforme briefing
- Lista: Suporte para a manhã, Sabor agradável, Fácil de incluir na rotina
- Preço: "R$170,00" + "ou 3x de R$63,03 sem juros"
- Botão outline menor (`py-3 text-sm border-2 border-[#2E5EA6] text-[#2E5EA6] hover:bg-[#2E5EA6] hover:text-white`): "ADICIONAR À MINHA ROTINA"
- Link: `https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-matinal-lipovitta/`
- Microcopy + âncora `<a href="#card-protocolo">` (com `scroll-behavior: smooth` global já existente) "Ver Protocolo Completo"

**Bloco de garantia** (abaixo dos cards)
- Card branco com ícone `Shield` (lucide), título "Garantia de 30 dias", texto conforme briefing.

**Selos de confiança** (linha flex wrap, 4 itens)
- Lock "Compra segura"
- Truck "Envio rápido para todo o Brasil"
- CreditCard "Até 3x sem juros"
- Shield "Garantia de 30 dias"

## Remoções
- Card "Mais Vendido" antigo
- Abas Individuais/Kits Duplos/Kit Premium e arrays `individuais`, `kitsDuplos`, `kitPremium`, `tabs`, `tabData`
- `ProductCard` antigo
- Imports não utilizados (`gummyImg`, `shotRushImg`, `useState`)

## Regras respeitadas
- Sem emojis, sem urgência fake, sem "transformação"/"cura"
- Mobile-first: cards `w-full px-3`, botões `min-h-[48px]`
- Bloco de comparação visualmente impactante no mobile (texto maior, contraste)
- Links de checkout reaproveitados exatamente como já configurados
- `OfferSection.tsx` é o único arquivo modificado; `ProductsSection`, pixels, scripts, Index.tsx ficam intactos
