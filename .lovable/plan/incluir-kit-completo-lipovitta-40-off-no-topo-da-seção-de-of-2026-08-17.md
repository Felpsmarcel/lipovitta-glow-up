# Incluir Kit Completo LipoVitta (40% OFF) no topo da seção de ofertas

## Objetivo
Adicionar um novo card de destaque acima do primeiro produto atual, oferecendo todos os produtos LipoVitta (Cápsulas + Shot Matinal + Shot Rush) com 40% OFF automático na promoção de aniversário.

## O que será feito

### 1. Preparar imagem do Kit Completo
- Fazer upload da imagem `kitcompleto.png` para Lovable Assets.
- Criar ponteiro `src/assets/kit-completo-lipovitta.png.asset.json`.

### 2. Novo kit na `OfferSection.tsx`
- Criar constante `KIT_COMPLETO` com:
  - `id: "kit-completo"`
  - `name: "Kit Completo LipoVitta"`
  - `productCount: 3`
  - `checkoutUrl: "https://seguro.lipovitta.site/b/CLF9IC4LPI8K"`
  - `value: 451.20`
  - `sku: "CLF9IC4LPI8K"`
- Adicionar entrada em `PROMO_BASE` para o cálculo automático:
  - `"kit-completo": 357.00 + 170.00 + 225.00` (R$752,00)
- Inserir novo card destacado **acima** do card "Kit Shot Rush + Cápsulas".
- No card, exibir:
  - Selo "Aniversário LipoVitta · Até 40% OFF automático"
  - Lista dos 3 produtos inclusos
  - Preço original riscado (R$752,00)
  - Preço promocional (R$451,20)
  - Parcelamento e economia
  - CTA "COMPRAR KIT COMPLETO"

### 3. Ajustes visuais
- Manter o mesmo padrão do card "Kit Shot Rush + Cápsulas" (layout horizontal em desktop, imagem à esquerda).
- Garantir que o novo card fique como primeiro elemento da seção de preços.

### 4. Validação
- Verificar build sem erros.
- Simular data de agosto/2026 para confirmar 40% OFF e preços corretos.
- Verificar responsividade mobile.

## O que NÃO será alterado
- Regras de brindes (`GiftFlowContext`).
- Links dos demais produtos.
- Lógica da promoção de aniversário (`PromoContext`).
- Estrutura de rastreamento.
