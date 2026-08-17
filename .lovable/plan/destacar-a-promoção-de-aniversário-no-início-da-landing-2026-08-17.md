# Destacar a promoção de aniversário no início da landing

## Contexto
A promoção de aniversário está implementada no topo da seção de preços (`OfferSection`) e na `UrgencyBar`, mas o início da página (`HeroSection`) não menciona o evento. Isso faz com que visitantes que não rolam até a oferta não percebam a promoção.

## Objetivo
Inserir um destaque de aniversário no hero de forma sutil, condicional e automática — só aparece enquanto a promoção estiver ativa (agosto/2026) e some sozinha depois.

## O que será feito

### 1. Banner promocional condicional no hero
- Criar um componente interno dentro de `HeroSection` que use `usePromo()` para exibir o banner apenas quando `isPromoActive === true`.
- Posicionar logo abaixo do subtítulo e acima do CTA principal.
- Conteúdo do banner:
  - Ícone de bolo/confete (cores da marca).
  - Texto: "Aniversário LipoVitta em agosto — desconto automático de até 40% OFF".
  - Destaque para "PAC grátis acima de R$400".
  - Badge com os tiers: 1 produto = 20% / 2 = 30% / 3+ = 40%.
  - CTA secundário para rolar até a seção de preços (`#precos`).

### 2. Ajuste sutil no headline
- Manter o H1 atual sobre lipedema e controle.
- Adicionar, apenas durante a promoção, uma linha abaixo do H1 ou no subtítulo: "Aproveite o aniversário da marca com desconto progressivo automático."

### 3. Selo visual no vídeo/foto da Clara
- Adicionar um selo circular ou fita sutil no canto do vídeo: "Aniversário LipoVitta · Até 40% OFF".
- Manter o selo existente "LIPO VITTA" e não poluir a imagem.

### 4. Expiração automática
- Reutilizar a lógica de `PromoContext` (`PROMO_START` / `PROMO_END`).
- Nenhum conteúdo de aniversário deve ser renderizado fora do período.

## O que NÃO será alterado
- Estrutura, cores e tipografia do hero.
- Vídeo da Clara e CTA principal.
- Links de checkout e regras de brinde.
- Lógica de rastreamento (Pixel/CAPI).

## Validação
- Verificar se o banner aparece simulando a data em agosto/2026.
- Verificar se o banner some simulando a data em 01/09/2026.
- Confirmar responsividade mobile (banner não pode quebrar o layout).
- Rodar `bun run build` sem erros.
