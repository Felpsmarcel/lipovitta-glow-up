## Alteração no card Shot Matinal (OfferSection)

Remover a promoção de 10% apenas do card "Shot Matinal LipoVitta", mantendo os outros produtos/kits inalterados.

### Mudanças em `src/components/OfferSection.tsx`

1. **Preço**: exibir apenas R$170,00 (remover o riscado e o valor com desconto R$153,00).
2. **Parcelamento**: ajustar para "3x de R$56,67 sem juros" (baseado em R$170,00).
3. **Selo verde "10% OFF COMPRANDO HOJE"**: remover do card do Shot Matinal.
4. **Badge "Economize 10%"**: remover do card do Shot Matinal.

### Fora de escopo

- Cápsulas LipoVitta, Shot Rush, Protocolo Completo e Kit Shot Rush + Cápsulas continuam com o desconto de 10% atual.
- Nenhuma alteração em links de checkout, UTMs, pixel, imagens ou textos descritivos.
