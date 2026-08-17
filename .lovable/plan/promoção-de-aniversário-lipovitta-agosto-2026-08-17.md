# Promoção de Aniversário LipoVitta — Agosto

## Objetivo
Implementar no site uma promoção de aniversário automática, válida só em agosto, com desconto progressivo por quantidade de produtos e PAC grátis acima de R$400.

## Regras da promoção
- 1 produto → 20% OFF
- 2 produtos → 30% OFF
- 3 ou mais produtos → 40% OFF
- PAC grátis em compras acima de R$400
- Válida até 31/08/2026, 23:59
- Sem cupom: desconto automático no checkout

## Links que devem permanecer
- Cápsulas: https://seguro.lipovitta.site/r/RMTIX51GQN
- Shot Matinal: https://lipovitta2.catalog.yampi.io/shot-matinal-lipovitta/p
- Kit Rush + Cápsulas: https://seguro.lipovitta.site/b/3QUPWLJZ74U8

## O que será feito

### 1. Contexto global de promoção
- Criar `PromoContext.tsx` para centralizar o estado da promoção.
- Detectar automaticamente se estamos dentro do período válido (agosto/2026).
- Expor helpers:
  - `isPromoActive`
  - `getDiscountForQuantity(qty)` → 0.20 / 0.30 / 0.40
  - `formatPromoPrice(original)`

### 2. Banner de aniversário
- Substituir ou complementar a `UrgencyBar` atual por um banner temático de aniversário.
- Texto: "Aniversário LipoVitta! 🎂 Desconto progressivo automático + PAC grátis acima de R$400"
- Contador regressivo até 31/08/2026, 23:59.
- CTA para a seção de preços.

### 3. Atualização da seção de ofertas (`OfferSection.tsx`)
- Exibir o **preço original riscado** e o **preço com desconto** em cada card, respeitando a quantidade de produtos do kit:
  - Cápsulas (1 produto) → 20% OFF
  - Shot Matinal (1 produto) → 20% OFF
  - Kit Rush + Cápsulas (2 produtos) → 30% OFF
- Adicionar selo/badges de desconto nos cards.
- Atualizar texto de frete de "Frete grátis a partir de R$323,00" para "PAC grátis em compras acima de R$400".
- Manter o fluxo de escolha de brinde existente.

### 4. Régua de desconto progressivo
- Inserir abaixo do header da seção de preços uma régua visual:
  - 1 produto = 20% OFF
  - 2 produtos = 30% OFF
  - 3+ produtos = 40% OFF
  - Destacar a faixa ativa conforme o kit selecionado/rolado.

### 5. Toques visuais de aniversário
- Adicionar selos/ícones sutis (bolo, confete) no banner e nos cards.
- Usar as cores da marca (#4667B4 e #9BAE52) com acentos festivos sem poluir o layout.
- Manter a tipografia e identidade atuais.

### 6. Expiração automática
- A promoção some sozinha após 31/08/2026, 23:59.
- Preços, banner e régua voltam ao estado normal sem intervenção manual.

### 7. Ajustes de SEO/head
- Atualizar `title` e `description` da página para refletir a promoção de aniversário enquanto ativa.
- Manter canonical e og tags consistentes.

## O que NÃO será alterado
- Regras de brindes (`GiftFlowContext`).
- Links de checkout.
- Estrutura de rastreamento (Pixel/CAPI).
- Páginas de afiliados, admin e unsubscribe.

## Testes e validação
- Verificar se o banner aparece com data simulada em agosto.
- Verificar se o banner/descontos somem com data simulada em 01/09.
- Confirmar que os preços com desconto estão corretos para cada kit.
- Validar responsividade mobile dos cards e da régua.
