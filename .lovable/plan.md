# Rolagem automática para o botão de finalizar

Hoje, ao escolher o brinde, a cliente precisa rolar a página até o botão "Finalizar minha compra". A mudança leva ela direto ao botão assim que o presente é selecionado.

## Comportamento

- Ao clicar em um card de brinde, a página rola suavemente até o botão de finalizar, que fica em destaque (foco visível).
- Nada é aberto automaticamente: a compra só acontece quando ela clicar no botão.
- Se ainda faltar escolher o sabor, a rolagem acontece do mesmo jeito e o aviso de sabor continua visível.
- Em telas menores, o botão fica centralizado na tela após a rolagem.

## Detalhes técnicos

Arquivo: `src/components/GiftSelectionSection.tsx`

- Adicionar um `useRef` no botão de checkout.
- No `onClick` do card do brinde: após `setSelectedGiftId(gift.id)`, chamar `requestAnimationFrame` e então `scrollIntoView({ behavior: "smooth", block: "center" })` + `focus({ preventScroll: true })` no botão.
- Respeitar `prefers-reduced-motion`: usar `behavior: "auto"` quando ativo.
