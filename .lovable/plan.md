## Redesign do Footer e da Barra de Confiança

### 1. Footer (`src/components/Footer.tsx`)

**Estrutura visual**
- Fundo: azul royal `#4667B4` (substitui `#2D4A7A`)
- Swoosh gradiente azul→verde no topo do footer (via `SectionSwoosh direction="white-to-blue"` inserido logo antes do `<footer>` no `Index.tsx`, e um detalhe interno de linha gradiente fina no topo do footer `linear-gradient(90deg, #4667B4, #9BAE52)` de 2px para reforçar a "costura")
- Logo LipoVitta em branco: aplicar `brightness-0 invert` na `<img>` (a logo atual é colorida) para forçar versão branca sem precisar de outro asset
- Colunas mantidas (4 colunas em desktop): Marca / Institucional / Ajuda / Pagamento — apenas refinadas em hierarquia, espaçamento (gap maior) e tipografia
- Títulos de coluna em verde oliva claro (`#B8C77A`) para criar acento de marca, links em `text-white/80` com hover `text-white`
- Borda divisória inferior `border-white/15`, copyright centralizado com selo "feito com cuidado por Clara Caldas"

**Bandeiras de pagamento (ícones reais, não texto)**
- Remover os chips de texto "VISA / MASTERCARD / ELO / AMEX / PIX / BOLETO"
- Renderizar ícones SVG reais inline em pílulas brancas arredondadas (fundo `bg-white`, padding pequeno) — uma pílula por bandeira, com o logo colorido oficial dentro
- Bandeiras incluídas: Visa, Mastercard, Elo, American Express, Pix, Boleto
- Implementação: criar `src/components/PaymentIcons.tsx` exportando 6 componentes SVG inline (paths simplificados/reconhecíveis das marcas, em viewBox padronizado, cores oficiais)
- Layout em flex-wrap, gap consistente, cada pílula com altura uniforme (~28px) para alinhamento limpo

### 2. Barra de confiança (3 selos)

A barra de selos atual está no rodapé da `OfferSection` com 4 itens (`Compra segura`, `Envio rápido`, `Até 3x sem juros`, `Garantia 30 dias`). Será **substituída por uma versão dedicada com 3 selos premium**, conforme pedido:

- **Compra Segura** (ícone `ShieldCheck`)
- **Frete Grátis** (ícone `Truck`)
- **Garantia 30 dias** (ícone `BadgeCheck`)

**Design premium de cada selo**
- Card branco `rounded-2xl`, sombra suave `shadow-[0_8px_24px_rgba(70,103,180,0.08)]`
- Borda superior de 2px com gradiente azul→verde (mesmo motivo dos cards de benefícios)
- Ícone em verde oliva `#9BAE52` dentro de círculo `rgba(70,103,180,0.12)` (56×56, `rounded-full`)
- Título em `#4667B4` semibold, subtítulo curto em `#666`
- Layout grid `md:grid-cols-3 gap-6`, hover `-translate-y-1` com transição suave

**Onde fica**
- Remover o bloco "Trust Seals" antigo de `OfferSection.tsx` (4 chips)
- Manter o bloco "Garantia de 30 dias" maior que já existe em OfferSection
- Inserir um novo componente `TrustBar` (`src/components/TrustBar.tsx`) com os 3 selos premium imediatamente **antes do Footer** no `Index.tsx`, sobre fundo branco — funciona como "selo final" antes do rodapé azul

### 3. Encadeamento visual (Index.tsx)

```
... FAQSection (azul)
SectionSwoosh blue-to-white
TrustBar              ← novo, fundo branco
SectionSwoosh white-to-blue   ← entrada do footer
Footer                ← agora azul royal
```

A swoosh já existente no fim do main (`<SectionSwoosh direction="blue-to-white" />` após FAQ) é mantida; entre TrustBar e Footer adicionamos uma swoosh `white-to-blue` para a transição final.

### Detalhes técnicos

- Sem novas dependências — todos os ícones de pagamento são SVG inline em um novo arquivo
- Sem novos tokens — cores reaproveitam `#4667B4` / `#9BAE52` / `#B8C77A` já usados
- Logo branca sem novo asset: filtro CSS `brightness(0) invert(1)` aplicado à `<img>` existente
- Sem mudanças em conteúdo dos links, telefone, e-mail ou copyright
- Acessibilidade: cada SVG de bandeira recebe `<title>` + `aria-label`; selos da TrustBar mantêm contraste AA

### Arquivos afetados

- novo: `src/components/PaymentIcons.tsx` (SVGs Visa, Mastercard, Elo, Amex, Pix, Boleto)
- novo: `src/components/TrustBar.tsx` (3 selos premium)
- editar: `src/components/Footer.tsx` (fundo azul, logo branca, ícones reais, hierarquia)
- editar: `src/components/OfferSection.tsx` (remover bloco antigo de 4 chips "Trust Seals")
- editar: `src/pages/Index.tsx` (inserir `<TrustBar />` + swoosh antes do Footer)
