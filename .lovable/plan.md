# Publicar site + corrigir rastreamento de conversões

## Objetivo
Publicar a landing LipoVitta, mas antes garantir que o painel `/admin/conversoes` receba cliques e compras de forma confiável.

## Diagnóstico atual (confirmado no banco)
- **Cliques estão chegando**: 956 `CTAClick`, 399 `AddToCart`, 204 `InitiateCheckout` e 51 `Contact` nos últimos 7 dias.
- **Compras não estão chegando**: apenas 1 evento `Purchase` registrado (um teste de 10/08, `meta_status: error_404`).
- **Inconsistência de nomes**: os botões "COMPRAR" disparam `AddToCart`, mas o painel conta "Checkouts iniciados" apenas como `InitiateCheckout`. Isso deixa o funil confuso.

## O que será feito

### 1. Corrigir nomenclatura dos eventos de checkout
Padronizar para que todo clique que leva à escolha de brinde/dispara intenção de pagamento registre `InitiateCheckout`:
- `OfferSection.tsx`: alterar `eventName: "AddToCart"` para `InitiateCheckout` nos cards de kit.
- `ProductsSection.tsx`: alterar `eventName: "AddToCart"` para `InitiateCheckout` no Shot Rush.
- Manter `AddToCart` apenas se houver um botão intermediário real de "adicionar ao carrinho" (não é o caso hoje).
- O painel continuará mostrando `InitiateCheckout` como "Checkouts iniciados".

### 2. Diagnosticar e restaurar o webhook da Yampi
O `yampi-webhook` não registrou nenhuma compra real além do teste. Verificar:
- Se a URL da Edge Function está corretamente cadastrada no painel da Yampi.
- Se o secret (`YAMPI_WEBHOOK_SECRET`) salvo no projeto bate com o secret ativo na Yampi.
- Se a Yampi está enviando o evento `order.paid` (ou equivalente) para a URL.
- Adicionar logs mais explícitos no webhook para identificar rejeições (assinatura, evento recebido, status do pedido).

### 3. Testar ponta a ponta
- Simular um POST de compra da Yampi e confirmar que o evento `Purchase` aparece no painel.
- Clicar em um CTA de compra no preview e confirmar que `InitiateCheckout` é registrado.

### 4. Publicar o site
Após confirmar que cliques e compras estão chegando ao painel, publicar a versão atualizada.

## Fora do escopo
- Alterações visuais na landing.
- Mudança de preços, brindes ou produtos.
- Novos eventos de analytics (GA4 etc.).
