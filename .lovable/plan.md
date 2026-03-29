

# Seção de Oferta + FAQ + Contato + Footer

## Arquivos a criar/editar

### 1. Criar `src/components/OfferSection.tsx`
- Fundo #F5F7FA, id="precos" para scroll dos botões "Ver oferta"
- Título + subtítulo + linha decorativa (padrão existente)
- 3 tabs pill-style (Individuais | Kits Duplos | Kit Premium) com useState, aba ativa #2E5EA6
- Card destaque (Kit LipoVitta + Shot Matinal): borda 2px #7BA33E, badge "⭐ MAIS VENDIDO", preço riscado, preço grande, badge economia, CTA verde
- Cards menores por aba — todos os produtos/kits listados com preços, links externos (`target="_blank"`)
- Barra de garantia: fundo #1B3A6B, ícone escudo, texto branco
- Selos inline: Compra Segura, Envio Rápido, 3x sem juros

### 2. Criar `src/components/FAQSection.tsx`
- Fundo #F5F7FA, título centralizado
- Radix Accordion (já disponível em `ui/accordion.tsx`) com 6 perguntas
- Ícone +/- cor #2E5EA6, títulos #1B3A6B bold, respostas #555

### 3. Criar `src/components/ContactSection.tsx`
- Fundo #1B3A6B
- Título #7BA33E, 2 cards lado a lado (WhatsApp + Email)
- Links funcionais: `https://wa.me/5571996150401` e `mailto:lipovitta@clarinhacbr.com.br`

### 4. Criar `src/components/Footer.tsx`
- Fundo #0F2847
- Logo centralizado (reutilizar do Navbar), aviso legal #999, copyright, links #7BA33E

### 5. Editar `src/pages/Index.tsx`
- Importar e adicionar: OfferSection → FAQSection → ContactSection → Footer após ProductsSection

## Detalhes técnicos
- Tabs: useState com filtro no array de produtos por categoria
- Card destaque sempre visível acima das tabs
- Accordion: usa componente Radix existente em `ui/accordion.tsx`
- Todos os botões "COMPRAR AGORA" são links `<a>` abrindo em nova aba
- Mobile: cards empilhados, tabs scrolláveis horizontalmente se necessário

