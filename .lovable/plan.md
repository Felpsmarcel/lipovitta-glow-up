## Objetivo

Ao clicar em "Adicionar à minha rotina" no card **Shot Rush Pré-Treino** (Complementos opcionais), o usuário deve ir para a etapa de escolha de brinde — igual ao Shot Matinal — em vez de abrir o checkout direto.

## O que muda

Apenas `src/components/ProductsSection.tsx`:

1. Usar o hook `useGiftFlow()` (a seção já está dentro do `GiftFlowProvider` na Index).
2. Definir o kit do complemento:
   - id: `shot-rush`
   - nome: `Shot Rush Pré-Treino`
   - productCount: `1` (libera Raspador e Porta cápsulas)
   - checkoutUrl: `https://seguro.lipovitta.site/r/5NYVZ7D8UT`
   - value: `202.50`, sku: `5NYVZ7D8UT`
3. Trocar o `<a href=...>` por um `<button>` com o mesmo estilo, chamando `selectKit(KIT_SHOT_RUSH)` — isso rola automaticamente até a seção "Escolha do brinde".
4. O checkout final (com `utm_content=brinde_xxx` e `utm_term=eid_...`) continua sendo disparado pelo botão "Finalizar minha compra" já existente.

## Detalhe técnico

O array `complementos` hoje é definido no escopo do módulo com `render()` sem parâmetros. Ele passa a receber o handler (`render: (onBuy) => ...`) ou é movido para dentro do componente, para ter acesso ao `selectKit`. Sem mudanças de layout, texto ou preço.
