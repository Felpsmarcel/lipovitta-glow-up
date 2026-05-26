## Objetivo
Transformar a seção `ProductsSection` (Shot Matinal, Gummy VittaGlow, Shot Rush) numa área de upsell visual posicionada **logo abaixo** da seção de ofertas, com o Shot Matinal como complemento principal da Cápsula.

## Arquivo 1: `src/pages/Index.tsx`
Mover `<ProductsSection />` para **depois** de `<OfferSection />` (atualmente está antes).

Ordem nova:
```
... IngredientsSection
CTABanner
OfferSection
ProductsSection   ← movido para cá
FAQSection ...
```

## Arquivo 2: `src/components/ProductsSection.tsx` (reescrita completa)

### Cabeçalho da seção
- Título: **"Potencialize sua rotina com a Cápsula LipoVitta"**
- Subtítulo: **"A Cápsula é a base. O Shot Matinal é o complemento que fecha sua rotina diária."**
- Microcopy: **"Adicione ao seu pedido e receba tudo junto, com frete grátis a partir de R$323,00."**
- Espaçamento generoso acima (`pt-20 md:pt-28`) para separar da seção de ofertas.

### Layout dos cards
- **Desktop (md+)**: grid de 3 colunas onde o Card A (Shot Matinal) ocupa **2 colunas** (col-span-2) à esquerda e os Cards B e C ficam empilhados na coluna restante à direita. Card A visivelmente maior.
- **Mobile**: empilhados verticalmente na ordem **Shot Matinal → Gummy → Shot Rush**.

### Card A — Shot Matinal (destaque principal)
- Etiqueta superior em destaque (cor de marca verde): "Combina perfeitamente com a Cápsula"
- Imagem: `shot-matinal.jpg` + `capsulas-lipovitta.png` lado a lado (composição mostrando os dois juntos)
- Título: "Shot Matinal LipoVitta"
- Subtítulo: "O ritual da manhã que potencializa sua Cápsula."
- Descrição: "A Cápsula cuida da sua rotina ao longo do dia. O Shot Matinal apoia o início da manhã com cuidado para inchaço, intestino e disposição. Juntos, formam a rotina completa."
- Benefícios:
  - Apoia o controle do inchaço matinal
  - Suporte para o intestino logo ao acordar
  - Sabor agradável, fácil de incluir na rotina
  - Combina com a Cápsula LipoVitta
- Preço: "R$170,00" / "ou 3x de R$63,03 sem juros"
- Bloco de economia (destaque visual, fundo verde claro):
  "Cápsula + Shot Matinal juntos: economia de R$79,05 no Protocolo Completo."
- Link discreto: "Ver Protocolo Completo" → âncora `#precos`
- Botão preenchido cor de marca secundária (azul `#2E5EA6`), tamanho médio: **"Adicionar Shot Matinal à minha rotina"**
- Link mantém o atual: `https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-matinal-lipovitta/`
- Microcopy abaixo: "Receba junto com sua Cápsula."

### Card B — Gummy VittaGlow
- Etiqueta superior discreta (cinza/contorno): "Combina com a Cápsula"
- Imagem: `gummy-vittaglow.png`
- Título: "Gummy VittaGlow Colágeno"
- Descrição curta: "Cuidado extra para pele, cabelo e firmeza. Pensado para somar à sua rotina com a Cápsula LipoVitta."
- Benefícios (3): Colágeno verisol / Sabor agradável / Uso diário simples
- Preço: **R$260** / **3x R$96,33 sem juros** (mantém preço atual do site)
- Botão outline (borda azul, texto azul, fundo branco), menor: **"Adicionar à minha rotina"**
- Link atual mantido
- Microcopy: "Receba junto com sua Cápsula."

### Card C — Shot Rush Pré-Treino
- Etiqueta superior discreta: "Combina com a Cápsula"
- Imagem: `shot-rush.jpg`
- Título: "Shot Rush Pré-Treino"
- Descrição curta: "Apoio para disposição antes do movimento. Pensado para somar à sua rotina com a Cápsula LipoVitta."
- Benefícios (3): Energia natural / Fácil de tomar / Sem estimulantes agressivos
- Preço: **R$225** / **3x R$75 sem juros** (mantém preço atual do site)
- Botão outline, menor: **"Adicionar à minha rotina"**
- Link atual mantido
- Microcopy: "Receba junto com sua Cápsula."

### Rodapé da seção
- Linha de reforço centralizada: "A Cápsula LipoVitta continua sendo a base da rotina. O Shot Matinal é o complemento natural. Gummy e Shot Rush são opcionais conforme sua necessidade."
- CTA secundário (texto link, sublinhado discreto): **"Voltar para a Cápsula LipoVitta"** → âncora `#precos`

### Hierarquia de botões
- Card A: preenchido `#2E5EA6`, `py-3 px-6`, texto médio
- Cards B/C: outline `border-2 border-[#2E5EA6] text-[#2E5EA6]`, `py-2.5`, texto menor
- Todos visualmente menores que o botão verde "ESCOLHER PROTOCOLO COMPLETO" da OfferSection.

### Regras visuais aplicadas
- Sem emojis (remover ☀️ ✨ ⚡ atuais).
- Sem badges "Premium" / "Performance".
- Sem urgência fake.
- Mobile-first, espaçamento generoso.
- Palavra "Cápsula" aparece ≥6 vezes (verificada no copy acima: título, subtítulo, descrição Card A, benefício Card A, bloco economia, descrição Card B, descrição Card C, rodapé, CTA = 9+ ocorrências).

### Não alterado
- `OfferSection.tsx` (Card 1 Cápsula, Card 2 Protocolo, Card 3 Shot Matinal e seus preços/links).
- Pixels, scripts, outros componentes.
- Links de checkout dos 3 produtos (mantidos exatamente como estão em `OfferSection`).
- Âncoras "Ver Protocolo Completo" e "Voltar para a Cápsula LipoVitta" apontam para `#precos` (id já existente na OfferSection) — sem necessidade de tocar a OfferSection.
